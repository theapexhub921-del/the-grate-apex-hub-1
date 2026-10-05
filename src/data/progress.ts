import { useSyncExternalStore } from 'react';

import { findLesson, getSubjectTopics } from '@/data/curriculum';
import type { SubjectId } from '@/data/lesson-types';
import {
  getAuthenticatedLearningUserId,
  loadCloudProgress,
  readLearningCache,
  recordCloudXpAdjustment,
  saveCloudProgress,
  saveCloudXpEvent,
  subscribeToLearningAuthChanges,
  writeLearningCache,
} from '@/data/learning-sync';
import { dayKey } from '@/data/learning/time';
import type { XpBreakdown } from '@/data/learning/xp-rules';

// XP, level, streak and completed lessons — persisted with AsyncStorage
// (account-scoped) and synced to Supabase.
//
// Lesson completion:
//   1. prevents duplicate XP for an already completed lesson
//   2. adds the lesson ID (and when) to completed lessons
//   3. increments lessons completed and the subject progress
//   4. updates the streak, adds XP, persists, and notifies every screen
// The learning engine (data/learning/) derives memory and review
// schedules from the completion times — nothing is scheduled here.
//
// XP is kept with a small ledger of recent awards so every reward is
// one-off per source and the results screen can show what was earned or
// lost. Penalties (negative XP) cannot be stored by the current Supabase
// schema; they stay queued locally (`pendingPenalty`) until the
// migration in supabase/migrations adds the adjustment function.

type Subject = SubjectId;

const SUBJECTS: Subject[] = ['anatomy', 'biochemistry', 'physiology'];
const LEDGER_LIMIT = 300;

export type XpSourceType = 'lesson' | 'quiz' | 'practice' | 'review' | 'apex' | 'milestone';

export type XpEntry = {
  key: string; // `${sourceType}:${sourceId}` — unique per reward
  sourceType: XpSourceType;
  sourceId: string;
  amount: number; // signed
  label: string;
  at: number;
};

export type ProgressData = {
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  lastActivityDate: string | null; // local YYYY-MM-DD
  completedLessons: string[];
  lessonCompletedAt: Record<string, number>;
  xpLedger: XpEntry[]; // newest first
  awardedKeys: string[]; // every reward key ever given (milestones, quizzes…)
  pendingPenalty: number; // negative XP not yet stored in Supabase (≥ 0)

  subjects: {
    anatomy: { progress: number };
    biochemistry: { progress: number };
    physiology: { progress: number };
  };
};

export function isLessonUnlocked(
  lessonId: string,
  lessonIds: string[],
  state: Pick<ProgressData, 'completedLessons'>
) {
  const index = lessonIds.indexOf(lessonId);
  if (index < 0) return false;
  if (index === 0 || state.completedLessons.includes(lessonId)) return true;
  return state.completedLessons.includes(lessonIds[index - 1]);
}

// Subject progress = completed published lessons ÷ all published lessons
// in that subject, so it always matches the course pages.
export function calculateSubjectProgress(subject: Subject, completedLessons: string[]) {
  const lessonIds = getSubjectTopics(subject).flatMap((topic) => topic.lessons.map((lesson) => lesson.id));
  if (lessonIds.length === 0) return 0;
  const done = lessonIds.filter((id) => completedLessons.includes(id)).length;
  return Math.round((done / lessonIds.length) * 100);
}

function syncSubjectProgress() {
  SUBJECTS.forEach((subject) => {
    progress.subjects[subject].progress = calculateSubjectProgress(subject, progress.completedLessons);
  });
}

function levelFor(xp: number) {
  return Math.floor(xp / 100) + 1;
}

const progress: ProgressData = {
  xp: 0,
  level: 1,
  streak: 0,
  lessonsCompleted: 0,
  lastActivityDate: null,
  completedLessons: [],
  lessonCompletedAt: {},
  xpLedger: [],
  awardedKeys: [],
  pendingPenalty: 0,
  subjects: {
    anatomy: { progress: 0 },
    biochemistry: { progress: 0 },
    physiology: { progress: 0 },
  },
};

const listeners = new Set<() => void>();
let progressLoadPromise: Promise<void> | null = null;
let snapshot: ProgressData = createSnapshot();

function notify() {
  snapshot = createSnapshot();
  listeners.forEach((listener) => listener());
}

async function saveProgress() {
  try {
    await writeLearningCache('grateapex_progress', JSON.stringify(progress));
  } catch (error) {
    console.log('Could not save progress:', error);
  }
}

function asNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      (entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])
    )
  );
}

async function loadProgress() {
  let hasLocalProgress = false;
  try {
    const requestedUserId = await getAuthenticatedLearningUserId();
    const saved = await readLearningCache('grateapex_progress');
    if ((await getAuthenticatedLearningUserId()) !== requestedUserId) return;

    if (saved) {
      const data = JSON.parse(saved);
      hasLocalProgress = true;
      progress.xp = Math.max(0, Number(data.xp) || 0);
      progress.level = levelFor(progress.xp);
      progress.streak = Number(data.streak) || 0;
      progress.lastActivityDate = typeof data.lastActivityDate === 'string' ? data.lastActivityDate : null;
      progress.completedLessons = Array.isArray(data.completedLessons)
        ? data.completedLessons.filter((id: unknown): id is string => typeof id === 'string')
        : [];
      progress.lessonsCompleted = progress.completedLessons.length;
      progress.lessonCompletedAt = asNumberRecord(data.lessonCompletedAt);
      progress.xpLedger = Array.isArray(data.xpLedger) ? data.xpLedger.slice(0, LEDGER_LIMIT) : [];
      progress.awardedKeys = Array.isArray(data.awardedKeys) ? data.awardedKeys : progress.xpLedger.map((entry) => entry.key);
      progress.pendingPenalty = Math.max(0, Number(data.pendingPenalty) || 0);
      syncSubjectProgress();
      notify();
    }

    // Hydration and upload are background work: local progress remains
    // usable immediately if Supabase is slow or unavailable.
    void syncProgressWithSupabase(hasLocalProgress);
  } catch (error) {
    console.log('Could not load progress:', error);
    void syncProgressWithSupabase(false);
  }
}

function cloudStats() {
  return {
    total_xp: progress.xp,
    current_streak: progress.streak,
    last_activity_date: progress.lastActivityDate,
  };
}

function cloudLessonRows() {
  return progress.completedLessons.map((lessonId) => ({
    lessonId,
    xp: findLesson(lessonId)?.lesson.xp ?? 0,
    completedAt: progress.lessonCompletedAt[lessonId],
  }));
}

async function syncProgressWithSupabase(hasLocalProgress: boolean) {
  const requestedUserId = await getAuthenticatedLearningUserId();
  if (!requestedUserId) return;
  const remote = await loadCloudProgress();
  if (!remote) return;
  if ((await getAuthenticatedLearningUserId()) !== requestedUserId) return;

  const remoteDate = remote.stats?.last_activity_date ?? null;
  const localDate = progress.lastActivityDate;
  const useRemoteActivity = Boolean(remoteDate && (!localDate || remoteDate > localDate));
  const activityDate = useRemoteActivity ? remoteDate : localDate;
  const streak =
    remoteDate === localDate
      ? Math.max(progress.streak, remote.stats?.current_streak ?? 0)
      : useRemoteActivity
        ? remote.stats?.current_streak ?? 0
        : progress.streak;

  for (const row of remote.completedLessons) {
    if (!progress.completedLessons.includes(row.lessonId)) progress.completedLessons.push(row.lessonId);
    const local = progress.lessonCompletedAt[row.lessonId];
    if (row.completedAt && (!local || row.completedAt < local)) {
      progress.lessonCompletedAt[row.lessonId] = row.completedAt;
    }
  }
  progress.lessonsCompleted = progress.completedLessons.length;

  // Supabase cannot hold penalties yet, so its total is higher by the
  // pending penalty; subtract it before taking the larger total.
  const remoteXp = Math.max(0, (remote.stats?.total_xp ?? 0) - progress.pendingPenalty);
  progress.xp = Math.max(progress.xp, remoteXp);
  progress.level = levelFor(progress.xp);
  progress.streak = streak;
  progress.lastActivityDate = activityDate;
  syncSubjectProgress();
  await saveProgress();
  notify();

  if (hasLocalProgress || remote.completedLessons.length > 0) {
    await saveCloudProgress(cloudLessonRows(), cloudStats());
  }
  void flushPendingPenalty();
}

async function flushPendingPenalty() {
  if (progress.pendingPenalty <= 0) return;
  const amount = progress.pendingPenalty;
  const stored = await recordCloudXpAdjustment(-amount, `penalty-batch:${Date.now()}`);
  if (stored) {
    progress.pendingPenalty = Math.max(0, progress.pendingPenalty - amount);
    await saveProgress();
    notify();
  }
}

function ensureProgressLoaded() {
  if (!progressLoadPromise) progressLoadPromise = loadProgress();
  return progressLoadPromise;
}

export function preloadProgress() {
  return ensureProgressLoaded();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// A fresh copy, so React (and the React Compiler) sees every change.
function createSnapshot(): ProgressData {
  return {
    ...progress,
    completedLessons: [...progress.completedLessons],
    lessonCompletedAt: { ...progress.lessonCompletedAt },
    xpLedger: [...progress.xpLedger],
    awardedKeys: [...progress.awardedKeys],
    subjects: {
      anatomy: { ...progress.subjects.anatomy },
      biochemistry: { ...progress.subjects.biochemistry },
      physiology: { ...progress.subjects.physiology },
    },
  };
}

export function getProgressSnapshot() {
  return snapshot;
}

export function useProgress() {
  return useSyncExternalStore(
    (listener) => {
      const unsubscribe = subscribe(listener);
      void ensureProgressLoaded();
      return unsubscribe;
    },
    () => snapshot,
    () => snapshot
  );
}

// Any study activity today keeps (or starts) the streak. Local dates.
function updateStreak(now = Date.now()) {
  const today = dayKey(now);
  if (!progress.lastActivityDate) {
    progress.streak = 1;
    progress.lastActivityDate = today;
    return;
  }
  if (progress.lastActivityDate === today) return;

  const [y, m, d] = progress.lastActivityDate.split('-').map(Number);
  const last = new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
  const yesterday = new Date(now);
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  progress.streak = last === yesterday.getTime() ? progress.streak + 1 : 1;
  progress.lastActivityDate = today;
}

function cloudSourceType(sourceType: XpSourceType): 'lesson' | 'quiz' {
  return sourceType === 'lesson' ? 'lesson' : 'quiz';
}

export function hasAward(key: string) {
  return progress.awardedKeys.includes(key);
}

// Applies an XP reward once per source. Returns the XP actually applied
// (0 when the reward was already given). The total never drops below 0.
export async function awardXp(input: {
  sourceType: XpSourceType;
  sourceId: string;
  amount: number | XpBreakdown;
  label: string;
  countsAsActivity?: boolean;
}): Promise<number> {
  await ensureProgressLoaded();
  const key = `${input.sourceType}:${input.sourceId}`;
  if (progress.awardedKeys.includes(key)) return 0;

  const net = typeof input.amount === 'number' ? Math.round(input.amount) : input.amount.net;
  const before = progress.xp;
  progress.xp = Math.max(0, progress.xp + net);
  const applied = progress.xp - before;
  progress.level = levelFor(progress.xp);
  if (input.countsAsActivity !== false) updateStreak();

  progress.awardedKeys.push(key);
  progress.xpLedger = [
    { key, sourceType: input.sourceType, sourceId: input.sourceId, amount: applied, label: input.label, at: Date.now() },
    ...progress.xpLedger,
  ].slice(0, LEDGER_LIMIT);
  if (applied < 0) progress.pendingPenalty += -applied;

  await saveProgress();
  notify();

  if (applied > 0) {
    void saveCloudXpEvent(cloudSourceType(input.sourceType), key, applied, cloudStats());
  } else if (applied < 0) {
    void flushPendingPenalty();
  }
  return applied;
}

// Records study activity for the streak without any XP (e.g. a review
// session whose reward was already given).
export async function markStudyActivity() {
  await ensureProgressLoaded();
  const before = progress.lastActivityDate;
  updateStreak();
  if (before !== progress.lastActivityDate) {
    await saveProgress();
    notify();
  }
}

export async function completeLesson(lessonId: string, _subject: Subject, xp: number, at = Date.now()) {
  await ensureProgressLoaded();

  // Prevent duplicate XP
  if (progress.completedLessons.includes(lessonId)) return false;

  progress.completedLessons.push(lessonId);
  progress.lessonCompletedAt[lessonId] = at;
  progress.lessonsCompleted = progress.completedLessons.length;
  syncSubjectProgress();
  updateStreak(at);

  const key = `lesson:${lessonId}`;
  if (!progress.awardedKeys.includes(key)) {
    progress.xp += xp;
    progress.level = levelFor(progress.xp);
    progress.awardedKeys.push(key);
    const label = findLesson(lessonId)?.lesson.title ?? 'Lesson';
    progress.xpLedger = [
      { key, sourceType: 'lesson' as const, sourceId: lessonId, amount: xp, label: `Lesson completed · ${label}`, at },
      ...progress.xpLedger,
    ].slice(0, LEDGER_LIMIT);
  }

  await saveProgress();
  notify();
  void saveCloudProgress(cloudLessonRows(), cloudStats());
  return true;
}

function resetProgress() {
  progress.xp = 0;
  progress.level = 1;
  progress.streak = 0;
  progress.lessonsCompleted = 0;
  progress.lastActivityDate = null;
  progress.completedLessons = [];
  progress.lessonCompletedAt = {};
  progress.xpLedger = [];
  progress.awardedKeys = [];
  progress.pendingPenalty = 0;
  SUBJECTS.forEach((subject) => {
    progress.subjects[subject].progress = 0;
  });
  notify();
}

let activeLearningUserId: string | null | undefined;
subscribeToLearningAuthChanges((userId) => {
  if (activeLearningUserId === userId) return;
  activeLearningUserId = userId;
  progressLoadPromise = null;
  resetProgress();
  if (userId) void ensureProgressLoaded();
});

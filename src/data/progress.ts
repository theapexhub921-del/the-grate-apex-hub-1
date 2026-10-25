import { useSyncExternalStore } from 'react';

import { findLesson, getSubjectTopics } from '@/data/curriculum';
import { isLegacyLessonId } from '@/data/legacy-ids';
import type { SubjectId } from '@/data/lesson-types';
import {
  getAuthenticatedLearningUserId,
  loadCloudProgress,
  readLearningCache,
  recordCloudXpAdjustment,
  resetCloudLearningProgress,
  saveCloudProgress,
  saveCloudXpEvent,
  subscribeToLearningAuthChanges,
  writeLearningCache,
} from '@/data/learning-sync';
import { ensureEventsLoaded, resetLearningEvents } from '@/data/learning/events';
import { ensureLessonSessionsLoaded, resetLessonSessions } from '@/data/learning/lesson-sessions';
import { ensurePowerupsLoaded, resetPowerups } from '@/data/learning/powerups';
import { ensureLegacyScheduleLoaded, resetLegacyReviewSchedule } from '@/data/review';
import { ensureQuestionHistoryLoaded, getQuestionHistory, resetQuestionHistory } from '@/data/question-history';
import { ensureQuizHistoryLoaded, resetQuizHistory } from '@/data/quiz-history';
import { dayKey } from '@/data/learning/time';
import type { XpBreakdown } from '@/data/learning/xp-rules';
import { grantPowerup } from '@/data/learning/powerups';
import { triggerStreakCelebration } from '@/components/streak-celebration';
import {
  applyActivity,
  canRestore,
  currentStreak,
  freezeEarned,
  lapseDay,
  type LostStreak,
  MAX_FREEZES,
  missedDays,
  restoredState,
  weekKeyOf,
} from '@/data/learning/streak-rules';
import { track } from '@/lib/analytics';

// XP, level, streak and completed lessons — persisted with AsyncStorage
// (account-scoped) and synced with cloud progress.
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
// lost. Penalties (negative XP) stay queued locally (`pendingPenalty`)
// until synced.

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
  pendingPenalty: number; // negative XP not yet stored in the cloud (≥ 0)
  // Streak protection (rules: data/learning/streak-rules.ts).
  streakFreezes: number; // 0..MAX_FREEZES, used automatically for missed days
  freezeWeeks: string[]; // weeks (Monday keys) that already earned a freeze
  lostStreak: LostStreak | null; // the last streak that ended, while it can be restored

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

// The original app's levels: 1 + every 150 XP (data/progression.ts).
function levelFor(xp: number) {
  return Math.floor(Math.max(0, xp) / 150) + 1;
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
  streakFreezes: 0,
  freezeWeeks: [],
  lostStreak: null,
  subjects: {
    anatomy: { progress: 0 },
    biochemistry: { progress: 0 },
    physiology: { progress: 0 },
  },
};

const listeners = new Set<() => void>();
let progressLoadPromise: Promise<void> | null = null;
let progressSyncPromise: Promise<void> | null = null;
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
      progress.streakFreezes = clampFreezes(data.streakFreezes);
      progress.freezeWeeks = Array.isArray(data.freezeWeeks) ? data.freezeWeeks.filter((week: unknown): week is string => typeof week === 'string').slice(-30) : [];
      progress.lostStreak = parseLost(data.lostStreak);
      noteLapse();
      syncSubjectProgress();
      notify();
    }

    // Hydration and upload are background work: local progress remains
    // usable immediately if cloud sync is slow or unavailable.
    const sync = syncProgressWithCloud(hasLocalProgress);
    progressSyncPromise = sync;
    void sync.then(
      () => { if (progressSyncPromise === sync) progressSyncPromise = null; },
      (error) => { console.warn('Could not sync progress:', error); if (progressSyncPromise === sync) progressSyncPromise = null; }
    );
  } catch (error) {
    console.log('Could not load progress:', error);
    const sync = syncProgressWithCloud(false);
    progressSyncPromise = sync;
    void sync.then(
      () => { if (progressSyncPromise === sync) progressSyncPromise = null; },
      (syncError) => { console.warn('Could not sync progress:', syncError); if (progressSyncPromise === sync) progressSyncPromise = null; }
    );
  }
}

function cloudStats() {
  return {
    total_xp: progress.xp,
    current_streak: shownStreak(),
    last_activity_date: progress.lastActivityDate,
    streak_freezes: progress.streakFreezes,
    freeze_weeks: progress.freezeWeeks,
    lost_streak: progress.lostStreak,
  };
}

const clampFreezes = (value: unknown) => Math.max(0, Math.min(MAX_FREEZES, Math.floor(Number(value) || 0)));

function parseLost(value: unknown): LostStreak | null {
  if (!value || typeof value !== 'object') return null;
  const { streak, on } = value as { streak?: unknown; on?: unknown };
  return typeof streak === 'number' && streak > 0 && typeof on === 'string' ? { streak: Math.floor(streak), on } : null;
}

/** The streak to show (0 once a missed day can't be covered by a freeze). */
function shownStreak(now = Date.now()) {
  return currentStreak({ streak: progress.streak, lastActivityDate: progress.lastActivityDate, freezes: progress.streakFreezes }, dayKey(now));
}

/**
 * A whole missed day that no freeze covers ends the streak at midnight: keep it
 * as `lostStreak` (it can be restored for a few days) and show 0 from now on.
 */
function noteLapse(now = Date.now()) {
  if (progress.streak <= 0 || !progress.lastActivityDate) return false;
  if (missedDays(progress.lastActivityDate, dayKey(now)) <= progress.streakFreezes) return false;
  if (!progress.lostStreak || progress.lostStreak.streak < progress.streak || progress.lostStreak.on < progress.lastActivityDate) {
    progress.lostStreak = { streak: progress.streak, on: lapseDay(progress.lastActivityDate, progress.streakFreezes, dayKey(now)) };
  }
  progress.streak = 0;
  return true;
}

// Only lessons of this app's curriculum are synced: the cloud document is
// shared with the original app, whose lesson entries must stay untouched.
function cloudLessonRows() {
  return progress.completedLessons.filter((lessonId) => findLesson(lessonId) || isLegacyLessonId(lessonId)).map((lessonId) => ({
    lessonId,
    xp: progress.xpLedger.find((entry) => entry.key === `lesson:${lessonId}`)?.amount ?? findLesson(lessonId)?.lesson.xp ?? 0,
    completedAt: progress.lessonCompletedAt[lessonId],
  }));
}

async function syncProgressWithCloud(hasLocalProgress: boolean) {
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
    // A lesson of this app, or an original-app lesson finished here (those come
    // only from the completions record — see readCompletions).
    if (!findLesson(row.lessonId) && !isLegacyLessonId(row.lessonId)) continue;
    if (!progress.completedLessons.includes(row.lessonId)) progress.completedLessons.push(row.lessonId);
    const local = progress.lessonCompletedAt[row.lessonId];
    if (row.completedAt && (!local || row.completedAt < local)) {
      progress.lessonCompletedAt[row.lessonId] = row.completedAt;
    }
  }
  progress.lessonsCompleted = progress.completedLessons.length;

  const remoteXp = Math.max(0, (remote.stats?.total_xp ?? 0) - progress.pendingPenalty);
  progress.xp = Math.max(progress.xp, remoteXp);
  progress.level = levelFor(progress.xp);
  progress.streak = streak;
  progress.lastActivityDate = activityDate;
  if (remote.streak) {
    // Freezes are only used when the last study day moves on, so on the same day the
    // larger count is the true one (a freeze earned on the other device is kept: its
    // week is already marked as rewarded below, so it could never be earned again).
    if (useRemoteActivity) progress.streakFreezes = clampFreezes(remote.streak.freezes);
    else if (remoteDate === localDate) progress.streakFreezes = Math.max(progress.streakFreezes, clampFreezes(remote.streak.freezes));
    progress.freezeWeeks = [...new Set([...progress.freezeWeeks, ...remote.streak.freezeWeeks])].sort().slice(-30);
    const remoteLost = parseLost(remote.streak.lost);
    if (remoteLost && (!progress.lostStreak || remoteLost.on > progress.lostStreak.on)) progress.lostStreak = remoteLost;
    if (remote.streak.lost === null && useRemoteActivity) progress.lostStreak = null;
  }
  syncSubjectProgress();
  const repaired = await repairStreakFromHistory();
  noteLapse();
  await saveProgress();
  notify();

  if (hasLocalProgress || repaired || remote.completedLessons.length > 0) {
    await saveCloudProgress(cloudLessonRows(), cloudStats());
  }
  // XP records already carry stable source keys. Replaying them after an
  // offline session is safe because the server rejects duplicate keys.
  await Promise.all(progress.xpLedger
    .filter((entry) => entry.amount > 0 && entry.sourceType !== 'lesson')
    .map((entry) => saveCloudXpEvent(cloudSourceType(entry.sourceType), entry.key, entry.amount, cloudStats())));
  void flushPendingPenalty();
}

// From 2026-10-09 to 2026-10-13 every study day set the streak back to 1 (a
// placeholder left by the move to Firebase). Rebuild it from the days the
// learner really studied: lessons, XP awards and answered questions. It only
// ever raises the streak, and only when the run of days reaches the last
// activity day, so a streak that really lapsed stays lapsed.
async function repairStreakFromHistory() {
  try {
    await ensureQuestionHistoryLoaded();
  } catch {
    // Lessons and XP awards alone are still enough for a repair.
  }
  const days = new Set<string>();
  Object.values(progress.lessonCompletedAt).forEach((at) => days.add(dayKey(at)));
  progress.xpLedger.forEach((entry) => days.add(dayKey(entry.at)));
  getQuestionHistory().forEach((attempt) => days.add(dayKey(attempt.attemptedAt)));
  const latest = [...days].sort().pop();
  if (!latest || (progress.lastActivityDate && latest < progress.lastActivityDate)) return false;

  let run = 0;
  const [y, m, d] = latest.split('-').map(Number);
  const cursor = new Date(y, (m ?? 1) - 1, d ?? 1);
  while (days.has(dayKey(cursor))) {
    run += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  if (run <= progress.streak) return false;
  progress.streak = run;
  progress.lastActivityDate = latest;
  return true;
}

/** Retry the local-first progress sync after a connection is restored. */
export async function syncLearningProgress() {
  await ensureProgressLoaded();
  await syncProgressWithCloud(true);
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

/** Resolves once local progress is loaded and any cloud sync in flight has finished (or failed). */
export async function waitForProgressSync() {
  await ensureProgressLoaded();
  if (progressSyncPromise) await progressSyncPromise.catch(() => undefined);
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
    streak: shownStreak(),
    freezeWeeks: [...progress.freezeWeeks],
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
// Rules (freezes, lost streaks): data/learning/streak-rules.ts.
async function updateStreak(now = Date.now()) {
  noteLapse(now);
  const previous = progress.streak;
  const prevDate = progress.lastActivityDate;
  const result = applyActivity({ streak: progress.streak, lastActivityDate: progress.lastActivityDate, freezes: progress.streakFreezes }, dayKey(now));
  progress.streak = result.state.streak;
  progress.lastActivityDate = result.state.lastActivityDate;
  progress.streakFreezes = result.state.freezes;
  if (result.lost) progress.lostStreak = result.lost;
  if (progress.streak > previous) await awardStreakPowerups(previous, progress.streak);
  // A new day on the streak: celebrate it (components/streak-celebration.tsx).
  if (prevDate !== progress.lastActivityDate) triggerStreakCelebration({ streak: progress.streak, isNew: progress.streak > previous });
}

/** A freeze for every week with FREEZE_LESSONS completed lessons (up to MAX_FREEZES stored). */
function checkFreezeEarned(at: number) {
  const week = weekKeyOf(at);
  if (!freezeEarned(Object.values(progress.lessonCompletedAt), week, progress.freezeWeeks, progress.streakFreezes)) return false;
  progress.streakFreezes = Math.min(MAX_FREEZES, progress.streakFreezes + 1);
  progress.freezeWeeks = [...progress.freezeWeeks, week].slice(-30);
  return true;
}

/** Any learning activity that earned no new XP (a retaken quiz, a re-read lesson): it still keeps the streak. */
async function recordActivity() {
  const before = `${progress.streak}|${progress.lastActivityDate}|${progress.streakFreezes}`;
  await updateStreak();
  if (before !== `${progress.streak}|${progress.lastActivityDate}|${progress.streakFreezes}`) {
    await saveProgress();
    notify();
    void saveCloudProgress([], cloudStats());
  }
}

const STREAK_POWERUPS = [
  { days: 7, multiplier: 1.5 },
  { days: 15, multiplier: 1.5 },
  { days: 30, multiplier: 2 },
  { days: 60, multiplier: 2 },
  { days: 90, multiplier: 2.5 },
  { days: 100, multiplier: 3 },
  { days: 150, multiplier: 2.5 },
  { days: 200, multiplier: 3 },
  { days: 365, multiplier: 3 },
  { days: 500, multiplier: 3 },
  { days: 1000, multiplier: 3 },
] as const;

async function awardStreakPowerups(previous: number, current: number) {
  for (const milestone of STREAK_POWERUPS) {
    if (previous < milestone.days && current >= milestone.days) {
      try {
        await grantPowerup('streak', String(milestone.days), milestone.multiplier);
      } catch (error) {
        console.warn('Could not award a streak power-up:', error);
      }
    }
  }
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
  if (progress.awardedKeys.includes(key)) {
    // No second reward, but the learning still counts for the streak.
    if (input.countsAsActivity !== false) await recordActivity();
    return 0;
  }

  const net = typeof input.amount === 'number' ? Math.round(input.amount) : input.amount.net;
  const before = progress.xp;
  progress.xp = Math.max(0, progress.xp + net);
  const applied = progress.xp - before;
  progress.level = levelFor(progress.xp);
  if (input.countsAsActivity !== false) await updateStreak();

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
// session whose reward was already given, or a flashcard session).
export async function markStudyActivity() {
  await ensureProgressLoaded();
  await recordActivity();
}

/** Streak protection, for the screens. */
export function streakProtection(now = Date.now()) {
  return {
    freezes: progress.streakFreezes,
    maxFreezes: MAX_FREEZES,
    lost: progress.lostStreak,
    canRestore: canRestore(progress.lostStreak, dayKey(now)),
    lessonsThisWeek: Object.values(progress.lessonCompletedAt).filter((at) => weekKeyOf(at) === weekKeyOf(now)).length,
    freezeEarnedThisWeek: progress.freezeWeeks.includes(weekKeyOf(now)),
  };
}

/**
 * Puts a lost streak back, after the coins have been taken (data/apex-coins.ts).
 * If the learner has studied since, the old streak carries on through today.
 */
export async function restoreLostStreak(at = Date.now()) {
  await ensureProgressLoaded();
  const today = dayKey(at);
  if (!progress.lostStreak || !canRestore(progress.lostStreak, today)) throw new Error('There is no lost streak to restore.');
  const restored = restoredState({ streak: progress.streak, lastActivityDate: progress.lastActivityDate, freezes: progress.streakFreezes }, progress.lostStreak, today);
  const previous = progress.streak;
  progress.streak = restored.streak;
  progress.lastActivityDate = restored.lastActivityDate;
  progress.lostStreak = null;
  await awardStreakPowerups(previous, progress.streak);
  await saveProgress();
  notify();
  void saveCloudProgress([], cloudStats());
  return progress.streak;
}

/** Spends freezes (e.g. to protect a friend streak). False when there are not enough. */
export async function spendStreakFreezes(count: number) {
  await ensureProgressLoaded();
  const n = Math.max(1, Math.floor(count));
  if (progress.streakFreezes < n) return false;
  progress.streakFreezes -= n;
  await saveProgress();
  notify();
  void saveCloudProgress([], cloudStats());
  return true;
}

export async function completeLesson(lessonId: string, _subject: Subject, xp: number, at = Date.now(), title?: string) {
  await ensureProgressLoaded();

  // Prevent duplicate XP (doing a lesson again still counts for the streak)
  if (progress.completedLessons.includes(lessonId)) {
    await recordActivity();
    return false;
  }

  progress.completedLessons.push(lessonId);
  progress.lessonCompletedAt[lessonId] = at;
  progress.lessonsCompleted = progress.completedLessons.length;
  syncSubjectProgress();
  await updateStreak(at);
  checkFreezeEarned(at);

  const key = `lesson:${lessonId}`;
  if (!progress.awardedKeys.includes(key)) {
    progress.xp += xp;
    progress.level = levelFor(progress.xp);
    progress.awardedKeys.push(key);
    const label = findLesson(lessonId)?.lesson.title ?? title ?? 'Lesson';
    progress.xpLedger = [
      { key, sourceType: 'lesson' as const, sourceId: lessonId, amount: xp, label: `Lesson completed · ${label}`, at },
      ...progress.xpLedger,
    ].slice(0, LEDGER_LIMIT);
  }

  await saveProgress();
  notify();
  void saveCloudProgress(cloudLessonRows(), cloudStats());
  // +10 Apex Coins for a first completion (data/apex-coins.ts; loaded here on demand because
  // apex-coins imports this module). Best effort: a failed reward never fails the lesson.
  void import('@/data/apex-coins').then((coins) => coins.awardLessonCoins(lessonId, xp, at)).catch((error) => console.warn('Could not add lesson coins:', error));
  track('lesson_complete', { lesson_id: lessonId });
  if (progress.lessonsCompleted === 1) track('first_lesson_complete', { lesson_id: lessonId });
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
  progress.streakFreezes = 0;
  progress.freezeWeeks = [];
  progress.lostStreak = null;
  SUBJECTS.forEach((subject) => {
    progress.subjects[subject].progress = 0;
  });
  notify();
}

/** Reset the signed-in learner's cloud and on-device learning history. */
export async function resetAllLearningProgress() {
  const userId = await getAuthenticatedLearningUserId();
  if (!userId) throw new Error('Sign in before resetting your learning progress.');
  await ensureProgressLoaded();
  if (progressSyncPromise) await progressSyncPromise;

  await Promise.all([
    ensureEventsLoaded(),
    ensureLessonSessionsLoaded(),
    ensurePowerupsLoaded(),
    ensureLegacyScheduleLoaded(),
    ensureQuestionHistoryLoaded(),
    ensureQuizHistoryLoaded(),
  ]);
  if ((await getAuthenticatedLearningUserId()) !== userId) throw new Error('Your account changed. Please try again.');

  await resetCloudLearningProgress();
  if ((await getAuthenticatedLearningUserId()) !== userId) throw new Error('Your account changed. Please sign in again.');

  resetProgress();
  await saveProgress();
  await Promise.all([
    resetLearningEvents(),
    resetLessonSessions(),
    resetPowerups(),
    resetLegacyReviewSchedule(),
    resetQuestionHistory(),
    resetQuizHistory(),
  ]);
}

let activeLearningUserId: string | null | undefined;
subscribeToLearningAuthChanges((userId) => {
  if (activeLearningUserId === userId) return;
  activeLearningUserId = userId;
  progressLoadPromise = null;
  resetProgress();
  if (userId) void ensureProgressLoaded();
});

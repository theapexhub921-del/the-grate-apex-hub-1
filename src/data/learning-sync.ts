import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';

const LEGACY_CACHE_OWNER_KEY = 'grateapex_learning_cache_owner';

// The local stores remain the fast UI source. This module is the single
// account-scoped bridge to Supabase and always takes ownership from Auth.
//
// Schema compatibility: the app works against the CURRENT schema
// (supabase/migrations/20261001000000…, 20261001000001…) and upgrades
// itself when the learning-engine migration (20261003000000…) has been
// applied:
//   - new answer modes (apex, recall, topic-quiz, …) fall back to the
//     closest legacy mode if the database rejects them
//   - XP penalties, new quiz kinds and learning events are stored only
//     once their table/function exists; until then they stay local
// Every failure is logged once and never blocks the learner.
export type CloudLearningStats = {
  total_xp: number;
  current_streak: number;
  last_activity_date: string | null;
};

export type CloudLessonRow = { lessonId: string; completedAt: number | null };

export type CloudProgress = {
  stats: CloudLearningStats | null;
  completedLessons: CloudLessonRow[];
};

export type AttemptMode =
  | 'interactive'
  | 'interactive-retry'
  | 'lesson-quiz'
  | 'topic-quiz'
  | 'practice'
  | 'review'
  | 'recall'
  | 'apex'
  | 'mastery-check';

const LEGACY_MODES: Record<AttemptMode, 'interactive' | 'interactive-retry' | 'lesson-quiz' | 'practice' | 'review'> = {
  interactive: 'interactive',
  'interactive-retry': 'interactive-retry',
  'lesson-quiz': 'lesson-quiz',
  'topic-quiz': 'lesson-quiz',
  practice: 'practice',
  review: 'review',
  recall: 'review',
  apex: 'practice',
  'mastery-check': 'lesson-quiz',
};

export type CloudQuestionAttempt = {
  id: string;
  questionId: string;
  topicId: string;
  lessonId: string;
  concept: string;
  correct: boolean;
  attemptedAt: number;
  mode: AttemptMode;
};

export type CloudQuizKind = 'lesson' | 'apex_challenge' | 'topic' | 'review' | 'practice';

export type CloudQuizAttempt = {
  id: string;
  attemptType: CloudQuizKind;
  courseId: string | null;
  lessonId: string | null;
  score: number;
  total: number;
  percentage: number;
  timeSeconds: number;
  wrongConcepts: string[];
  wrongQuestionIds: string[];
  practice: boolean;
  completedAt: number;
};

export type CloudReviewItem = {
  lessonId: string;
  concept: string;
  stage: number;
  dueAt: number;
  misses: number;
  lastReviewedAt: number;
  firstTrackedAt: number;
  reason: 'learned' | 'missed';
};

export type CloudLearningEvent = {
  id: string;
  type: string;
  at: number;
  topicId: string | null;
  lessonId: string | null;
  refId: string | null;
  data: Record<string, unknown> | null;
};

// Capabilities discovered at runtime (reset on sign-in change).
const capability = {
  extendedModes: true, // flips to false if the DB rejects new modes
  extendedQuizKinds: true,
  xpAdjustments: true,
  learningEvents: true,
};
const warned = new Set<string>();

function report(operation: string, error: unknown) {
  if (warned.has(operation)) return;
  warned.add(operation);
  console.warn(`Could not sync ${operation} with Supabase:`, error);
}

function errorCode(error: unknown): string {
  return (error && typeof error === 'object' && 'code' in error ? String((error as { code: unknown }).code) : '') || '';
}

function isMissingRelation(error: unknown) {
  const code = errorCode(error);
  return code === '42P01' || code === 'PGRST205' || code === 'PGRST202' || code === '42883';
}

function isConstraintViolation(error: unknown) {
  return errorCode(error) === '23514';
}

async function getUserId() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.user.id ?? null;
  } catch (error) {
    report('session lookup', error);
    return null;
  }
}

export async function getAuthenticatedLearningUserId() {
  return getUserId();
}

// Old installs have one unscoped local snapshot. It is claimed by the first
// signed-in account that opens it, then copied into that account's local
// namespace. Later accounts never read that legacy snapshot.
export async function readLearningCache(key: string) {
  const userId = await getUserId();
  if (!userId) return AsyncStorage.getItem(key);

  const accountKey = `${key}:${userId}`;
  const accountValue = await AsyncStorage.getItem(accountKey);
  if (accountValue !== null) return accountValue;

  const legacyOwner = await AsyncStorage.getItem(LEGACY_CACHE_OWNER_KEY);
  if (legacyOwner && legacyOwner !== userId) return null;

  if (!legacyOwner) {
    await AsyncStorage.setItem(LEGACY_CACHE_OWNER_KEY, userId);
  }
  const legacyValue = await AsyncStorage.getItem(key);
  if (legacyValue !== null) {
    await AsyncStorage.setItem(accountKey, legacyValue);
  }
  return legacyValue;
}

export async function writeLearningCache(key: string, value: string) {
  const userId = await getUserId();
  const storageKey = userId ? `${key}:${userId}` : key;
  await AsyncStorage.setItem(storageKey, value);
}

export function subscribeToLearningAuthChanges(listener: (userId: string | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => listener(session?.user.id ?? null));
  return () => subscription.unsubscribe();
}

subscribeToLearningAuthChanges(() => {
  capability.extendedModes = true;
  capability.extendedQuizKinds = true;
  capability.xpAdjustments = true;
  capability.learningEvents = true;
  warned.clear();
});

function toMillis(value: string | null | undefined) {
  if (!value) return Date.now();
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

export function createLearningRecordId() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();

  const bytes = new Uint8Array(16);
  if (cryptoApi?.getRandomValues) {
    cryptoApi.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ─── Progress ────────────────────────────────────────────────────────

export async function loadCloudProgress(): Promise<CloudProgress | null> {
  const userId = await getUserId();
  if (!userId) return null;

  try {
    const [statsResult, lessonsResult] = await Promise.all([
      supabase
        .from('user_learning_stats')
        .select('total_xp, current_streak, last_activity_date')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase.from('lesson_progress').select('lesson_id, completed_at').eq('user_id', userId),
    ]);

    if (statsResult.error) report('learning statistics load', statsResult.error);
    if (lessonsResult.error) report('lesson progress load', lessonsResult.error);

    return {
      stats: statsResult.error ? null : statsResult.data,
      completedLessons: lessonsResult.error
        ? []
        : (lessonsResult.data ?? []).map((row) => ({
            lessonId: row.lesson_id,
            completedAt: row.completed_at ? toMillis(row.completed_at) : null,
          })),
    };
  } catch (error) {
    report('learning progress load', error);
    return null;
  }
}

/** Clear all server-backed learning records for the signed-in learner. */
export async function resetCloudLearningProgress() {
  const userId = await getUserId();
  if (!userId) throw new Error('Sign in before resetting your learning progress.');
  const { error } = await supabase.rpc('grateapex_reset_learning_progress');
  if (error) throw error;
}

async function mergeStats(userId: string, stats: CloudLearningStats, operation: string) {
  const { data: remoteStats, error: readError } = await supabase
    .from('user_learning_stats')
    .select('total_xp, current_streak, last_activity_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (readError) {
    report(`${operation} (read)`, readError);
    return;
  }

  const remoteDate = remoteStats?.last_activity_date ?? null;
  const localDate = stats.last_activity_date;
  const useLocalActivity = !remoteDate || Boolean(localDate && localDate >= remoteDate);
  const mergedDate = useLocalActivity ? localDate : remoteDate;
  const mergedStreak =
    remoteDate === localDate
      ? Math.max(stats.current_streak, remoteStats?.current_streak ?? 0)
      : useLocalActivity
        ? stats.current_streak
        : remoteStats?.current_streak ?? 0;

  const { error: saveError } = await supabase
    .from('user_learning_stats')
    .upsert(
      { user_id: userId, current_streak: mergedStreak, last_activity_date: mergedDate },
      { onConflict: 'user_id' }
    );

  if (saveError) report(operation, saveError);
}

export async function saveCloudProgress(
  completedLessons: { lessonId: string; xp: number; completedAt?: number }[],
  stats: CloudLearningStats
) {
  const userId = await getUserId();
  if (!userId) return;

  try {
    if (completedLessons.length > 0) {
      const { error } = await supabase.from('lesson_progress').upsert(
        completedLessons.map(({ lessonId, completedAt }) => ({
          user_id: userId,
          lesson_id: lessonId,
          ...(completedAt ? { completed_at: new Date(completedAt).toISOString() } : {}),
        })),
        { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
      );

      if (error) {
        report('lesson progress save', error);
      } else {
        // Retry every supplied completion. The XP event's unique key makes
        // successful prior awards no-ops and lets failed awards recover.
        for (const lesson of completedLessons) {
          if (lesson.xp <= 0) continue;
          const { error: xpError } = await supabase.rpc('grateapex_record_xp_event', {
            p_source_type: 'lesson',
            p_source_id: lesson.lessonId,
            p_amount: lesson.xp,
          });
          if (xpError) report('lesson XP event save', xpError);
        }
      }
    }

    await mergeStats(userId, stats, 'learning statistics save');
  } catch (error) {
    report('learning progress save', error);
  }
}

export async function saveCloudXpEvent(
  sourceType: 'lesson' | 'quiz',
  sourceId: string,
  amount: number,
  stats: CloudLearningStats
) {
  if (amount <= 0) return;
  const userId = await getUserId();
  if (!userId) return;

  try {
    const { error } = await supabase.rpc('grateapex_record_xp_event', {
      p_source_type: sourceType,
      p_source_id: sourceId,
      p_amount: amount,
    });

    if (error) {
      report('XP event save', error);
      return;
    }

    await mergeStats(userId, stats, 'learning statistics save after XP');
  } catch (error) {
    report('XP event save', error);
  }
}

// Negative XP (penalties). Needs grateapex_record_xp_adjustment from the
// learning-engine migration. Returns true when stored.
export async function recordCloudXpAdjustment(amount: number, sourceId: string): Promise<boolean> {
  if (!capability.xpAdjustments || amount === 0) return false;
  const userId = await getUserId();
  if (!userId) return false;

  try {
    const { error } = await supabase.rpc('grateapex_record_xp_adjustment', {
      p_source_id: sourceId,
      p_amount: amount,
    });
    if (error) {
      if (isMissingRelation(error)) capability.xpAdjustments = false;
      report('XP adjustment (needs the learning-engine migration)', error);
      return false;
    }
    return true;
  } catch (error) {
    report('XP adjustment', error);
    return false;
  }
}

// ─── Quiz attempts ───────────────────────────────────────────────────

export async function loadCloudQuizAttempts(): Promise<CloudQuizAttempt[]> {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select(
        'id, attempt_type, course_id, lesson_id, score, total, percentage, time_seconds, wrong_concepts, wrong_question_ids, practice, completed_at'
      )
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(200);
    if (error) {
      report('quiz history load', error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      attemptType: row.attempt_type,
      courseId: row.course_id,
      lessonId: row.lesson_id,
      score: row.score,
      total: row.total,
      percentage: row.percentage,
      timeSeconds: row.time_seconds,
      wrongConcepts: row.wrong_concepts ?? [],
      wrongQuestionIds: row.wrong_question_ids ?? [],
      practice: row.practice,
      completedAt: toMillis(row.completed_at),
    }));
  } catch (error) {
    report('quiz history load', error);
    return [];
  }
}

// Returns false when the current schema cannot store this attempt kind.
export async function saveCloudQuizAttempt(attempt: CloudQuizAttempt): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;
  const legacyKind = attempt.attemptType === 'lesson' || attempt.attemptType === 'apex_challenge';
  if (!legacyKind && !capability.extendedQuizKinds) return false;
  if (attempt.total <= 0) return false;

  try {
    const { error } = await supabase.from('quiz_attempts').upsert(
      {
        id: attempt.id,
        user_id: userId,
        attempt_type: attempt.attemptType,
        course_id: attempt.courseId,
        lesson_id: attempt.lessonId,
        score: attempt.score,
        total: attempt.total,
        percentage: attempt.percentage,
        time_seconds: attempt.timeSeconds,
        wrong_concepts: attempt.wrongConcepts,
        wrong_question_ids: attempt.wrongQuestionIds,
        practice: attempt.practice,
        completed_at: new Date(attempt.completedAt).toISOString(),
      },
      { onConflict: 'id', ignoreDuplicates: true }
    );
    if (error) {
      if (!legacyKind && isConstraintViolation(error)) capability.extendedQuizKinds = false;
      report(legacyKind ? 'quiz attempt save' : 'quiz attempt save (new kinds need the learning-engine migration)', error);
      return false;
    }
    return true;
  } catch (error) {
    report('quiz attempt save', error);
    return false;
  }
}

// ─── Question attempts ───────────────────────────────────────────────

export async function loadCloudQuestionAttempts(): Promise<CloudQuestionAttempt[]> {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('question_attempts')
      .select('id, question_id, topic_id, lesson_id, concept, correct, attempted_at, mode')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false })
      .limit(5000);
    if (error) {
      report('question history load', error);
      return [];
    }

    return (data ?? []).reverse().map((row) => ({
      id: row.id,
      questionId: row.question_id,
      topicId: row.topic_id,
      lessonId: row.lesson_id,
      concept: row.concept,
      correct: row.correct,
      attemptedAt: toMillis(row.attempted_at),
      mode: row.mode,
    }));
  } catch (error) {
    report('question history load', error);
    return [];
  }
}

export async function saveCloudQuestionAttempts(attempts: CloudQuestionAttempt[]) {
  if (attempts.length === 0) return;
  const userId = await getUserId();
  if (!userId) return;

  const rows = (legacy: boolean) =>
    attempts.map((attempt) => ({
      id: attempt.id,
      user_id: userId,
      question_id: attempt.questionId,
      topic_id: attempt.topicId || 'unknown',
      lesson_id: attempt.lessonId || 'unknown',
      concept: attempt.concept || 'unknown',
      correct: attempt.correct,
      mode: legacy ? LEGACY_MODES[attempt.mode] ?? 'practice' : attempt.mode,
      attempted_at: new Date(attempt.attemptedAt).toISOString(),
    }));

  try {
    let all = rows(!capability.extendedModes);
    for (let offset = 0; offset < all.length; offset += 500) {
      let { error } = await supabase
        .from('question_attempts')
        .upsert(all.slice(offset, offset + 500), { onConflict: 'id', ignoreDuplicates: true });
      if (error && capability.extendedModes && isConstraintViolation(error)) {
        // Older schema: store the closest legacy mode instead.
        capability.extendedModes = false;
        all = rows(true);
        ({ error } = await supabase
          .from('question_attempts')
          .upsert(all.slice(offset, offset + 500), { onConflict: 'id', ignoreDuplicates: true }));
      }
      if (error) {
        report('question attempts save', error);
        return;
      }
    }
  } catch (error) {
    report('question attempts save', error);
  }
}

// ─── Review schedule (projection of the memory model) ────────────────

export async function loadCloudReviewItems(): Promise<CloudReviewItem[]> {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('review_schedule')
      .select('lesson_id, concept, stage, due_at, misses, last_reviewed_at, first_tracked_at, reason')
      .eq('user_id', userId);
    if (error) {
      report('review schedule load', error);
      return [];
    }

    return (data ?? []).map((row) => ({
      lessonId: row.lesson_id,
      concept: row.concept,
      stage: row.stage,
      dueAt: toMillis(row.due_at),
      misses: row.misses,
      lastReviewedAt: toMillis(row.last_reviewed_at),
      firstTrackedAt: toMillis(row.first_tracked_at),
      reason: row.reason,
    }));
  } catch (error) {
    report('review schedule load', error);
    return [];
  }
}

export async function saveCloudReviewItems(items: CloudReviewItem[]) {
  if (items.length === 0) return;
  const userId = await getUserId();
  if (!userId) return;

  try {
    const rows = items.map((item) => ({
      user_id: userId,
      lesson_id: item.lessonId,
      concept: item.concept,
      stage: Math.max(0, Math.min(4, item.stage)),
      due_at: new Date(item.dueAt).toISOString(),
      misses: Math.max(0, item.misses),
      last_reviewed_at: new Date(item.lastReviewedAt).toISOString(),
      first_tracked_at: new Date(item.firstTrackedAt).toISOString(),
      reason: item.reason,
    }));

    for (let offset = 0; offset < rows.length; offset += 500) {
      const { error } = await supabase
        .from('review_schedule')
        .upsert(rows.slice(offset, offset + 500), { onConflict: 'user_id,lesson_id,concept' });
      if (error) {
        report('review schedule save', error);
        return;
      }
    }
  } catch (error) {
    report('review schedule save', error);
  }
}

// ─── Learning events (needs the learning-engine migration) ───────────

export async function loadCloudLearningEvents(): Promise<CloudLearningEvent[]> {
  if (!capability.learningEvents) return [];
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('learning_events')
      .select('id, event_type, occurred_at, topic_id, lesson_id, ref_id, data')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
      .limit(1000);
    if (error) {
      if (isMissingRelation(error)) capability.learningEvents = false;
      report('learning events load (needs the learning-engine migration)', error);
      return [];
    }
    return (data ?? []).map((row) => ({
      id: row.id,
      type: row.event_type,
      at: toMillis(row.occurred_at),
      topicId: row.topic_id,
      lessonId: row.lesson_id,
      refId: row.ref_id,
      data: row.data,
    }));
  } catch (error) {
    report('learning events load', error);
    return [];
  }
}

export async function saveCloudLearningEvents(events: CloudLearningEvent[]) {
  if (!capability.learningEvents || events.length === 0) return;
  const userId = await getUserId();
  if (!userId) return;

  try {
    const { error } = await supabase.from('learning_events').upsert(
      events.map((event) => ({
        id: event.id,
        user_id: userId,
        event_type: event.type,
        occurred_at: new Date(event.at).toISOString(),
        topic_id: event.topicId,
        lesson_id: event.lessonId,
        ref_id: event.refId,
        data: event.data,
      })),
      { onConflict: 'id', ignoreDuplicates: true }
    );
    if (error) {
      if (isMissingRelation(error)) capability.learningEvents = false;
      report('learning events save (needs the learning-engine migration)', error);
    }
  } catch (error) {
    report('learning events save', error);
  }
}

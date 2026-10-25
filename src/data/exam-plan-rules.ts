// Exam countdown and daily plan (owner, 2026-10-25). Pure, so
// tests/exam-plan.test.mjs can check it; src/data/exam-plan.ts stores the date
// and components/learning/exam-countdown-card.tsx shows the plan.
//
// The plan spreads the lessons still to finish over the days before the exam,
// keeping the last REVISION_DAYS days for revision only (as the original app's
// study plan did): due reviews every day, then mock exams and the weakest
// questions once the lessons are done or the revision days begin.

export const REVISION_DAYS = 3;
/** The furthest ahead an exam date can be set. */
export const MAX_DAYS_AHEAD = 730;

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Midday of a YYYY-MM-DD day (midday, so a clock change never moves it to another day). */
function noonOf(day: string): number | null {
  const match = DAY.exec(day);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  // Rejects days that do not exist (2026-02-30 would roll over to March).
  if (date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return null;
  return date.getTime();
}

export function dayKeyOf(at: number): string {
  const date = new Date(at);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Whole days from `today` to `exam` (0 on the exam day, negative once it has passed). */
export function daysUntil(today: string, exam: string): number | null {
  const from = noonOf(today);
  const to = noonOf(exam);
  if (from === null || to === null) return null;
  return Math.round((to - from) / 86_400_000);
}

/** A date the learner may choose: a real day, from tomorrow up to two years ahead. */
export function isValidExamDate(exam: string, today: string): boolean {
  const days = daysUntil(today, exam);
  return days !== null && days >= 1 && days <= MAX_DAYS_AHEAD;
}

export type ExamPlanInput = {
  today: string;
  examDate: string;
  /** Lessons of the learner's class not finished yet. */
  lessonsLeft: number;
  /** Lessons finished for the first time today. */
  lessonsDoneToday: number;
  /** Ideas due for spaced review now. */
  reviewsDue: number;
};

export type ExamPlan = {
  daysLeft: number;
  /** learn: lessons to finish; revise: lessons done or the last days; exam-day; passed. */
  phase: 'learn' | 'revise' | 'exam-day' | 'passed';
  /** Lessons to finish today (the day's target, fixed for the whole day). */
  lessonTarget: number;
  /** How many of today's target are still to do. */
  lessonsStillToday: number;
  reviewsDue: number;
  /** Days left before the revision days begin (0 once they have). */
  learningDays: number;
};

export function examPlan({ today, examDate, lessonsLeft, lessonsDoneToday, reviewsDue }: ExamPlanInput): ExamPlan | null {
  const daysLeft = daysUntil(today, examDate);
  if (daysLeft === null) return null;
  const left = Math.max(0, Math.floor(lessonsLeft));
  const doneToday = Math.max(0, Math.floor(lessonsDoneToday));
  const reviews = Math.max(0, Math.floor(reviewsDue));
  const learningDays = Math.max(0, daysLeft - REVISION_DAYS);
  const base = { daysLeft, reviewsDue: reviews, learningDays, lessonTarget: 0, lessonsStillToday: 0 };
  if (daysLeft < 0) return { ...base, phase: 'passed' };
  if (daysLeft === 0) return { ...base, phase: 'exam-day' };
  if (left === 0 || learningDays === 0) return { ...base, phase: 'revise' };
  // Today's finished lessons count toward today's share, so the target does not
  // shrink as the learner works through it.
  const lessonTarget = Math.ceil((left + doneToday) / learningDays);
  return { ...base, phase: 'learn', lessonTarget, lessonsStillToday: Math.min(left, Math.max(0, lessonTarget - doneToday)) };
}

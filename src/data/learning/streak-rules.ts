// Streak rules, shared by the learning streak (progress.ts) and friend streaks
// (friend-streaks.ts). Pure, so `npm test` checks them.
//
// A streak counts calendar days (local time). Studying (or, for a friend
// streak, both of you messaging) on a day keeps it going. A whole day with
// nothing ends it at midnight, unless:
//   • a streak FREEZE covers the missed day (one freeze per missed day; they
//     are used automatically, and you can store up to MAX_FREEZES), or
//   • you RESTORE it within RESTORE_DAYS days for RESTORE_COST Apex Coins.
// Freezes are earned by completing FREEZE_LESSONS lessons in one week.

export const MAX_FREEZES = 2;
export const FREEZE_LESSONS = 5;
export const RESTORE_COST = 100;
export const RESTORE_DAYS = 3;

const DAY_MS = 86_400_000;

/** YYYY-MM-DD, local time. */
export function dayKeyOf(time: number) {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Whole days from one YYYY-MM-DD to another (local calendar days). */
export function daysBetween(from: string, to: string) {
  const a = parseDay(from);
  const b = parseDay(to);
  return Math.round((b - a) / DAY_MS);
}

function parseDay(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1).getTime();
}

export function addDays(key: string, days: number) {
  const date = new Date(parseDay(key));
  date.setDate(date.getDate() + days);
  return dayKeyOf(date.getTime());
}

/** Monday of the week (YYYY-MM-DD) — the key for "lessons this week". */
export function weekKeyOf(time: number) {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  const back = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - back);
  return dayKeyOf(date.getTime());
}

export type StreakState = {
  streak: number;
  lastActivityDate: string | null;
  freezes: number;
};

export type LostStreak = { streak: number; on: string }; // `on`: the day it was found lost

/** Days missed since the last activity, before `today` (0 when it was today or yesterday). */
export function missedDays(lastActivityDate: string | null, today: string) {
  if (!lastActivityDate) return 0;
  return Math.max(0, daysBetween(lastActivityDate, today) - 1);
}

/**
 * The streak to SHOW today: the stored streak while it is alive (studied today
 * or yesterday, or every missed day can be covered by a freeze), otherwise 0.
 */
export function currentStreak(state: StreakState, today: string) {
  if (!state.lastActivityDate || state.streak <= 0) return 0;
  return missedDays(state.lastActivityDate, today) <= Math.max(0, state.freezes) ? state.streak : 0;
}

export type StreakStatus = 'none' | 'activeToday' | 'continueToday' | 'frozen' | 'lapsed';

export function streakStatus(state: StreakState, today: string): StreakStatus {
  if (!state.lastActivityDate || state.streak <= 0) return 'none';
  if (state.lastActivityDate === today) return 'activeToday';
  const missed = missedDays(state.lastActivityDate, today);
  if (missed === 0) return 'continueToday';
  return missed <= Math.max(0, state.freezes) ? 'frozen' : 'lapsed';
}

/**
 * Study activity on `today`. Returns the new state, how many freezes were
 * used, and the streak that was lost (when the gap was too long to cover).
 */
export function applyActivity(state: StreakState, today: string): { state: StreakState; freezesUsed: number; lost: LostStreak | null } {
  const freezes = Math.max(0, Math.min(MAX_FREEZES, Math.floor(state.freezes)));
  if (!state.lastActivityDate || state.streak <= 0) return { state: { streak: 1, lastActivityDate: today, freezes }, freezesUsed: 0, lost: null };
  if (state.lastActivityDate >= today) return { state: { ...state, freezes }, freezesUsed: 0, lost: null };
  const missed = missedDays(state.lastActivityDate, today);
  if (missed === 0) return { state: { streak: state.streak + 1, lastActivityDate: today, freezes }, freezesUsed: 0, lost: null };
  if (missed <= freezes) return { state: { streak: state.streak + 1, lastActivityDate: today, freezes: freezes - missed }, freezesUsed: missed, lost: null };
  return { state: { streak: 1, lastActivityDate: today, freezes }, freezesUsed: 0, lost: { streak: state.streak, on: today } };
}

/** A lost streak can be restored for a few days after it was lost. */
export function canRestore(lost: LostStreak | null | undefined, today: string) {
  return Boolean(lost && lost.streak >= 2 && daysBetween(lost.on, today) <= RESTORE_DAYS);
}

/**
 * The state after paying to restore `lost`. If the learner has already studied
 * since (a new streak of 1 today), the old streak continues through today.
 */
export function restoredState(state: StreakState, lost: LostStreak, today: string): StreakState {
  if (state.lastActivityDate === today) return { ...state, streak: lost.streak + Math.max(1, state.streak) };
  return { ...state, streak: lost.streak, lastActivityDate: addDays(today, -1) };
}

/** Freezes to add for this week: one when FREEZE_LESSONS lessons were completed in it (not already rewarded). */
export function freezeEarned(lessonCompletedAt: readonly number[], weekKey: string, rewardedWeeks: readonly string[], freezes: number) {
  if (rewardedWeeks.includes(weekKey) || freezes >= MAX_FREEZES) return false;
  return lessonCompletedAt.filter((at) => weekKeyOf(at) === weekKey).length >= FREEZE_LESSONS;
}

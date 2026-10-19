// Friend streaks (like Snapchat): the number of days in a row on which you and
// a friend BOTH stumped each other (sent a "Stump a friend" question in your
// chat, data/stumps.ts). Pure, for tests.
//
//   • Owner's rule from 2026-10-18: a streak is kept by stumping, not by
//     ordinary messages. Streaks that already existed are kept: every day
//     before STUMP_STREAKS_FROM still counts when you both sent any message
//     (a stump is a message too), so nobody lost a streak at the switch and
//     everyone had a few days to learn the new rule.
//   • Today counts once you have both stumped; until then the streak still
//     stands on yesterday, and it is "at risk".
//   • A whole day without both of you stumping ends it at midnight, unless the
//     missed day is covered: either of you can spend a streak freeze (one per
//     missed day) or Apex Coins to restore it, within RESTORE_DAYS days
//     (data/friend-streak-store.ts saves the covered days for both of you).
import { addDays, dayKeyOf, RESTORE_DAYS } from '@/data/learning/streak-rules';

/** From this day on, only stumps keep a friend streak (day keys compare as text). */
export const STUMP_STREAKS_FROM = '2026-10-21';

/** True when a stump (not just any message) is needed to count this day. */
export const stumpsNeededOn = (day: string) => day >= STUMP_STREAKS_FROM;

export type FriendStreakStatus = {
  /** The streak to show (0 when it has ended). */
  streak: number;
  /** Today counts: both of you have done what the day needs. */
  today: boolean;
  /** I / my friend have done today's part (a stump, or during the changeover any message). */
  meToday: boolean;
  friendToday: boolean;
  /** The streak still stands on yesterday: stump each other today to keep it. */
  atRisk: boolean;
  /** Today needs a stump (false only during the changeover days). */
  stumpsNeeded: boolean;
  /** A streak that ended recently and can still be restored: covering `missed` brings it back. */
  lost: { streak: number; missed: string[] } | null;
};

/** One chat message, as far as streaks care: who sent it, when, and whether it was a stump. */
type Message = { sender_id: string; created_at: string; stump?: boolean };

export function friendStreakStatus(messages: readonly Message[], me: string, friend: string, now = Date.now(), covered: Iterable<string> = []): FriendStreakStatus {
  // Days each of us sent anything, and days each of us sent a stump.
  const mine = new Set<string>();
  const theirs = new Set<string>();
  const myStumps = new Set<string>();
  const theirStumps = new Set<string>();
  for (const message of messages) {
    const at = Date.parse(message.created_at);
    if (!Number.isFinite(at)) continue;
    const day = dayKeyOf(at);
    if (message.sender_id === me) { mine.add(day); if (message.stump) myStumps.add(day); }
    else if (message.sender_id === friend) { theirs.add(day); if (message.stump) theirStumps.add(day); }
  }
  const coveredDays = new Set(covered);
  const meOn = (day: string) => (stumpsNeededOn(day) ? myStumps : mine).has(day);
  const friendOn = (day: string) => (stumpsNeededOn(day) ? theirStumps : theirs).has(day);
  const counts = (day: string) => coveredDays.has(day) || (meOn(day) && friendOn(day));

  const today = dayKeyOf(now);
  const yesterday = addDays(today, -1);
  const runFrom = (start: string) => {
    let run = 0;
    let day = start;
    while (counts(day) && run < 3650) {
      run += 1;
      day = addDays(day, -1);
    }
    return run;
  };

  const todayCounts = counts(today);
  const streak = runFrom(todayCounts ? today : yesterday);

  // A recent break: up to RESTORE_DAYS missed days ending yesterday, after a run of at least 2.
  let lost: FriendStreakStatus['lost'] = null;
  if (!counts(yesterday)) {
    const missed: string[] = [];
    let day = yesterday;
    while (!counts(day) && missed.length <= RESTORE_DAYS) {
      missed.push(day);
      day = addDays(day, -1);
    }
    const before = missed.length <= RESTORE_DAYS ? runFrom(day) : 0;
    if (before >= 2) lost = { streak: before, missed: missed.reverse() };
  }

  return {
    streak,
    today: todayCounts,
    meToday: meOn(today),
    friendToday: friendOn(today),
    atRisk: streak > 0 && !todayCounts,
    stumpsNeeded: stumpsNeededOn(today),
    lost,
  };
}

/**
 * What today's streak depends on in a chat's messages: whether each of you has
 * done today's part. It changes only when that does, so a chat reloads the
 * streak on the first stump of the day, not on every message.
 */
export function todaysStreakKey(messages: readonly (Message & { share?: { kind: string } | null })[], me: string | null, now = Date.now()): string {
  const today = dayKeyOf(now);
  const stumpsOnly = stumpsNeededOn(today);
  let mine = false;
  let theirs = false;
  for (const message of messages) {
    const at = Date.parse(message.created_at);
    if (!Number.isFinite(at) || dayKeyOf(at) !== today) continue;
    if (stumpsOnly && !(message.stump || message.share?.kind === 'stump')) continue;
    if (message.sender_id === me) mine = true;
    else theirs = true;
  }
  return `${today}:${mine ? 1 : 0}${theirs ? 1 : 0}`;
}

/** The streak number alone. */
export function friendStreak(messages: readonly Message[], me: string, friend: string, now = Date.now(), covered: Iterable<string> = []) {
  return friendStreakStatus(messages, me, friend, now, covered).streak;
}

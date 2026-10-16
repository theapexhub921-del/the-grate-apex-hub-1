// Friend streaks (like Snapchat): the number of days in a row on which you and
// a friend BOTH sent each other at least one message. Pure, for tests.
//
//   • Today counts once you have both messaged; until then the streak still
//     stands on yesterday, and it is "at risk".
//   • A whole day without both of you messaging ends it at midnight, unless the
//     missed day is covered: either of you can spend a streak freeze (one per
//     missed day) or Apex Coins to restore it, within RESTORE_DAYS days
//     (data/friend-streak-store.ts saves the covered days for both of you).
import { addDays, dayKeyOf, RESTORE_DAYS } from '@/data/learning/streak-rules';

export type FriendStreakStatus = {
  /** The streak to show (0 when it has ended). */
  streak: number;
  /** Both of you have messaged today. */
  today: boolean;
  /** I / my friend have messaged today. */
  meToday: boolean;
  friendToday: boolean;
  /** The streak still stands on yesterday: message each other today to keep it. */
  atRisk: boolean;
  /** A streak that ended recently and can still be restored: covering `missed` brings it back. */
  lost: { streak: number; missed: string[] } | null;
};

type Message = { sender_id: string; created_at: string };

export function friendStreakStatus(messages: readonly Message[], me: string, friend: string, now = Date.now(), covered: Iterable<string> = []): FriendStreakStatus {
  const mine = new Set<string>();
  const theirs = new Set<string>();
  for (const message of messages) {
    const at = Date.parse(message.created_at);
    if (!Number.isFinite(at)) continue;
    if (message.sender_id === me) mine.add(dayKeyOf(at));
    else if (message.sender_id === friend) theirs.add(dayKeyOf(at));
  }
  const coveredDays = new Set(covered);
  const counts = (day: string) => coveredDays.has(day) || (mine.has(day) && theirs.has(day));

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
    meToday: mine.has(today),
    friendToday: theirs.has(today),
    atRisk: streak > 0 && !todayCounts,
    lost,
  };
}

/** The streak number alone. */
export function friendStreak(messages: readonly Message[], me: string, friend: string, now = Date.now(), covered: Iterable<string> = []) {
  return friendStreakStatus(messages, me, friend, now, covered).streak;
}

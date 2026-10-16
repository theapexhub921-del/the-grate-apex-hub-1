// Presentation helpers for XP, levels and streaks.
// They only READ existing progress data — they never change it.
import { dayKeyOf, streakStatus } from '@/data/learning/streak-rules';

// Must match the level rule in progress.ts:
// level = Math.floor(xp / 100) + 1
// The original app's levels (owner decision, 2026-10-10): 1 + every 150 XP.
export const XP_PER_LEVEL = 150;

export type LevelProgress = {
  level: number;
  nextLevel: number;
  xpIntoLevel: number; // XP earned inside the current level
  xpForLevel: number; // XP needed to complete a level
  xpToNextLevel: number; // XP still needed for the next level
  percent: number; // 0–100, for the progress bar
};

export function getLevelProgress(xp: number): LevelProgress {
  const safeXp = Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = safeXp - (level - 1) * XP_PER_LEVEL;

  return {
    level,
    nextLevel: level + 1,
    xpIntoLevel,
    xpForLevel: XP_PER_LEVEL,
    xpToNextLevel: XP_PER_LEVEL - xpIntoLevel,
    percent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
  };
}

export type StreakStatus =
  | 'none' // no streak yet
  | 'activeToday' // studied today
  | 'continueToday' // last studied yesterday (or a freeze covers the missed days): keep it going
  | 'lapsed'; // a day was missed with no freeze: the next study starts a new streak

/** Uses the streak rules (data/learning/streak-rules.ts); a day covered by a freeze is not lapsed. */
export function getStreakStatus(
  streak: number,
  lastActivityDate: string | null,
  now: Date = new Date(),
  freezes = 0
): StreakStatus {
  const status = streakStatus({ streak, lastActivityDate, freezes }, dayKeyOf(now.getTime()));
  return status === 'frozen' ? 'continueToday' : status;
}

// One short, honest encouragement line based on real progress data.
export function getMotivationMessage(
  status: StreakStatus,
  streak: number,
  levelProgress: LevelProgress
) {
  switch (status) {
    case 'activeToday':
      return `You've studied today — nice work. ${levelProgress.xpToNextLevel} XP to reach Level ${levelProgress.nextLevel}.`;
    case 'continueToday':
      return `Complete a lesson today to keep your ${streak}-day streak going.`;
    case 'lapsed':
      return 'Welcome back! Complete a lesson to start a new streak.';
    default:
      return 'Complete your first lesson to start your streak.';
  }
}

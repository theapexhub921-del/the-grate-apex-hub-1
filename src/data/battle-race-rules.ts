// XP battles as the app shows them. The rules themselves are applied only by the
// server (api/_battle-rules.mjs); these copies are for labels and must match it
// (tests/battle-race.test.mjs checks). Pure, for tests.

export type BattleDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export type BattleCount = 10 | 20 | 30;

export const BATTLE_RULES = {
  right: 5,
  wrong: -1,
  skip: 0,
  winBonus: 20,
  counts: [10, 20, 30] as BattleCount[],
  inviteMinutes: 5,
  idleSeconds: 90,
};

export const DIFFICULTY_OPTIONS: { value: BattleDifficulty; label: string; hint: string }[] = [
  { value: 'mixed', label: 'Mixed', hint: 'Any level' },
  { value: 'easy', label: 'Easy', hint: 'Recall what was taught' },
  { value: 'medium', label: 'Medium', hint: 'Connect two ideas' },
  { value: 'hard', label: 'Hard', hint: 'Apply and tell apart · +1 tier point' },
];

export const difficultyName = (value: string | null | undefined) => DIFFICULTY_OPTIONS.find((option) => option.value === value)?.label ?? 'Mixed';

export const TIERS = [
  { id: 'bronze', name: 'Bronze', from: 0 },
  { id: 'silver', name: 'Silver', from: 10 },
  { id: 'gold', name: 'Gold', from: 25 },
  { id: 'platinum', name: 'Platinum', from: 50 },
  { id: 'diamond', name: 'Diamond', from: 90 },
  { id: 'apex', name: 'Apex', from: 150 },
] as const;

export type TierId = (typeof TIERS)[number]['id'];

export function tierFor(points = 0) {
  let index = 0;
  TIERS.forEach((tier, i) => {
    if (points >= tier.from) index = i;
  });
  const next = TIERS[index + 1] ?? null;
  return { id: TIERS[index].id as TierId, name: TIERS[index].name as string, points, next: next ? { name: next.name as string, needed: next.from - points } : null };
}

export const tierName = (id: string | null | undefined) => TIERS.find((tier) => tier.id === id)?.name ?? 'Bronze';

/** Topic counts from public/battle-bank/index.json. */
export type BankTopic = { id: string; title: string; easy: number; medium: number; hard: number; unrated: number };
export type BankCourse = { id: string; name: string; total: number; topics: BankTopic[] };

/** How many questions the chosen topics have at a difficulty (mixed = all). */
export function available(topics: readonly BankTopic[], selected: readonly string[], difficulty: BattleDifficulty) {
  const chosen = selected.length ? topics.filter((topic) => selected.includes(topic.id)) : topics;
  const total = chosen.reduce((sum, topic) => sum + topic.easy + topic.medium + topic.hard + topic.unrated, 0);
  const exact = difficulty === 'mixed' ? total : chosen.reduce((sum, topic) => sum + topic[difficulty], 0);
  return { total, exact };
}

/** "3 in a row" style lines for a run of right answers (shown, no extra XP). */
export function streakLine(streak: number) {
  if (streak >= 10) return `${streak} in a row. Unstoppable.`;
  if (streak >= 5) return `${streak} in a row. On fire.`;
  if (streak >= 3) return `${streak} in a row`;
  return null;
}

/** Accuracy and pace for the results card. */
export function battleSummary(side: { right: number; wrong: number; skipped: number; finishedAt: number; lastAt: number }, startAt: number) {
  const answered = side.right + side.wrong;
  const done = side.right + side.wrong + side.skipped;
  const end = side.finishedAt || side.lastAt || startAt;
  return {
    accuracy: answered ? Math.round((side.right / answered) * 100) : 0,
    seconds: Math.max(0, Math.round((end - startAt) / 1000)),
    perQuestion: done ? Math.round(((end - startAt) / 1000 / done) * 10) / 10 : 0,
  };
}

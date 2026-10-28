// Ways to keep studying a little every day (2026-10-28). Pure, so
// tests/learning-boosts.test.mjs can check them; data/daily-practice.ts feeds
// them the learner's memory, history and the question bank.
//
// - Daily 10: ten questions from what is due across every course, one per
//   concept, topics interleaved (mixing subjects makes recall stick better than
//   one topic at a time).
// - Confused pairs: the two answers a learner keeps mixing up (picked A when it
//   was B), and a drill that asks both side by side.
// - Daily quest: three small things a day, with a reward once all are done.
import type { ConceptMemory, QuestionMemory } from '@/data/learning/memory';

export const DAILY_MIX_SIZE = 10;
export const SPRINT_SECONDS = 120;
export const SPRINT_POOL = 40;
export const PAIR_DRILL_SIZE = 12;
export const DAILY_QUEST_XP = 25;

// ── Daily 10 ────────────────────────────────────────────────────────

/**
 * The concepts for today's Daily 10, most urgent first: due ones by review
 * priority, then struggling or still-learning ones, then the least well known.
 * Concepts are taken from different topics in turn, so subjects alternate.
 */
export function dailyMixConcepts(concepts: Iterable<ConceptMemory>, size = DAILY_MIX_SIZE): ConceptMemory[] {
  const studied = [...concepts].filter((concept) => concept.attempts > 0 || concept.learnedAt !== null);
  const rank = (concept: ConceptMemory) =>
    concept.due ? 0 : concept.state === 'struggling' ? 1 : concept.state === 'learning' ? 2 : 3;
  const ordered = studied.sort(
    (a, b) => rank(a) - rank(b) || b.priority - a.priority || a.mastery - b.mastery || a.key.localeCompare(b.key)
  );
  // Round-robin over topics, keeping each topic's own order.
  const byTopic = new Map<string, ConceptMemory[]>();
  for (const concept of ordered) {
    const list = byTopic.get(concept.topicId) ?? [];
    list.push(concept);
    byTopic.set(concept.topicId, list);
  }
  const queues = [...byTopic.values()];
  const out: ConceptMemory[] = [];
  while (out.length < size && queues.some((queue) => queue.length > 0)) {
    // Topics with the most urgent next concept go first in each round.
    queues.sort((a, b) => (a[0] && b[0] ? rank(a[0]) - rank(b[0]) || b[0].priority - a[0].priority : a[0] ? -1 : 1));
    for (const queue of queues) {
      const next = queue.shift();
      if (next) out.push(next);
      if (out.length >= size) break;
    }
  }
  return out;
}

/**
 * One question per concept: the one missed last, otherwise the one seen least
 * recently, otherwise the first. `questionsFor` lists a concept's question ids.
 */
export function dailyMixIds(
  concepts: Iterable<ConceptMemory>,
  questionsFor: (concept: ConceptMemory) => string[],
  questionMemory: (id: string) => QuestionMemory | undefined,
  size = DAILY_MIX_SIZE
): string[] {
  const ids: string[] = [];
  for (const concept of dailyMixConcepts(concepts, size * 2)) {
    const options = questionsFor(concept);
    if (options.length === 0) continue;
    const missed = options.find((id) => questionMemory(id)?.lastCorrect === false);
    const pick =
      missed ??
      [...options].sort((a, b) => (questionMemory(a)?.lastSeenAt ?? 0) - (questionMemory(b)?.lastSeenAt ?? 0) || a.localeCompare(b))[0];
    ids.push(pick);
    if (ids.length >= size) break;
  }
  return ids;
}

// ── Confused pairs ──────────────────────────────────────────────────

/** A wrong answer: the option picked and the right one. */
export type MixUp = { questionId: string; picked: string; right: string; at: number };

export type ConfusedPair = {
  /** The two answers, in alphabetical order. */
  terms: [string, string];
  /** How many times they were mixed up. */
  count: number;
  /** The questions where it happened. */
  questionIds: string[];
  lastAt: number;
};

const clean = (text: string) => text.trim().replace(/\s+/g, ' ');
// Options like "All of the above" or long sentences are not "terms" one mixes up.
const isTerm = (text: string) => {
  const words = clean(text).split(' ').length;
  return words >= 1 && words <= 6 && !/\b(all|none|both|neither) of the\b/i.test(text) && !/^(true|false)$/i.test(clean(text));
};

/** The pairs of answers mixed up most often (twice or more first), newest first among equals. */
export function confusedPairs(mixUps: readonly MixUp[], limit = 8): ConfusedPair[] {
  const pairs = new Map<string, ConfusedPair>();
  const seen = new Set<string>();
  for (const mixUp of mixUps) {
    const picked = clean(mixUp.picked);
    const right = clean(mixUp.right);
    if (!picked || !right || picked.toLowerCase() === right.toLowerCase() || !isTerm(picked) || !isTerm(right)) continue;
    // The same question answered the same wrong way in one sitting counts once.
    const once = `${mixUp.questionId}|${picked}|${Math.floor(mixUp.at / 3_600_000)}`;
    if (seen.has(once)) continue;
    seen.add(once);
    const terms = [picked, right].sort((a, b) => a.localeCompare(b)) as [string, string];
    const key = terms.map((term) => term.toLowerCase()).join('|');
    const pair = pairs.get(key) ?? { terms, count: 0, questionIds: [], lastAt: 0 };
    pair.count += 1;
    if (!pair.questionIds.includes(mixUp.questionId)) pair.questionIds.push(mixUp.questionId);
    pair.lastAt = Math.max(pair.lastAt, mixUp.at);
    pairs.set(key, pair);
  }
  return [...pairs.values()]
    .sort((a, b) => b.count - a.count || b.lastAt - a.lastAt || a.terms[0].localeCompare(b.terms[0]))
    .slice(0, limit);
}

export type DrillQuestion = { id: string; options: string[]; right: string };

/**
 * A drill on the learner's confused pairs: for each pair, the questions whose
 * right answer is one of the two terms and whose options offer the other, taken
 * in turn (A, then B) so the difference has to be noticed each time.
 */
export function pairDrillIds(pairs: readonly ConfusedPair[], bank: readonly DrillQuestion[], size = PAIR_DRILL_SIZE): string[] {
  const lower = (text: string) => clean(text).toLowerCase();
  const perPair = pairs.map((pair) => {
    const [a, b] = pair.terms.map(lower);
    const asks = (want: string, other: string) =>
      bank.filter((question) => lower(question.right) === want && question.options.some((option) => lower(option) === other));
    const forA = asks(a, b).map((question) => question.id);
    const forB = asks(b, a).map((question) => question.id);
    // Also the questions where the mix-up happened, if the bank no longer has the pair side by side.
    const own = pair.questionIds.filter((id) => bank.some((question) => question.id === id));
    const out: string[] = [];
    for (let i = 0; i < Math.max(forA.length, forB.length); i += 1) {
      if (forA[i]) out.push(forA[i]);
      if (forB[i]) out.push(forB[i]);
    }
    for (const id of own) if (!out.includes(id)) out.push(id);
    return out.slice(0, 4);
  });
  const ids: string[] = [];
  for (let round = 0; ids.length < size && perPair.some((list) => list.length > round); round += 1) {
    for (const list of perPair) {
      const id = list[round];
      if (id && !ids.includes(id)) ids.push(id);
      if (ids.length >= size) break;
    }
  }
  return ids;
}

// ── Daily quest ─────────────────────────────────────────────────────

export type QuestStep = { id: 'daily' | 'label' | 'study'; label: string; done: boolean };

/** Today's three steps. */
export function dailyQuest(done: { daily: boolean; label: boolean; study: boolean }): { steps: QuestStep[]; complete: boolean } {
  const steps: QuestStep[] = [
    { id: 'daily', label: 'Finish your Daily 10', done: done.daily },
    { id: 'label', label: 'Label a diagram', done: done.label },
    { id: 'study', label: 'Finish a lesson, quiz or 2-minute sprint', done: done.study },
  ];
  return { steps, complete: steps.every((step) => step.done) };
}

/** The best score in earlier sprints (correct answers in two minutes). */
export function bestSprint(scores: readonly number[]): number | null {
  return scores.length ? Math.max(...scores) : null;
}

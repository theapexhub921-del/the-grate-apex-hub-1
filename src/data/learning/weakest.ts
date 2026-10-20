// "Your weakest 20" (owner's request, 2026-10-20): the questions this learner
// gets wrong most, worst first. Pure, so tests/exam-practice.test.mjs can check it.
import type { QuestionMemory } from '@/data/learning/memory';

export const WEAKEST_SIZE = 20;

/** How badly a question is going: recent misses and repeated misses count most; a run of right answers pays it back. */
export function weaknessScore(memory: QuestionMemory): number {
  if (memory.wrongCount === 0) return 0;
  const missRate = memory.wrongCount / Math.max(1, memory.attempts);
  return (memory.lastCorrect ? 0 : 3) + memory.wrongCount * 1.5 + missRate * 4 - memory.correctStreak * 2;
}

/**
 * The learner's weakest questions, worst first: only questions missed at least
 * once and not yet answered right twice in a row since. `known` drops questions
 * the app cannot show any more (renamed or removed).
 */
export function weakestQuestionIds(
  questions: Iterable<QuestionMemory>,
  known: (questionId: string) => boolean,
  size = WEAKEST_SIZE
): string[] {
  return [...questions]
    .filter((memory) => memory.wrongCount > 0 && memory.correctStreak < 2 && known(memory.questionId))
    .map((memory) => ({ id: memory.questionId, score: weaknessScore(memory), lastSeenAt: memory.lastSeenAt }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.lastSeenAt - a.lastSeenAt || a.id.localeCompare(b.id))
    .slice(0, size)
    .map((item) => item.id);
}

/** Today's date as YYYY-MM-DD in the learner's own time zone. */
export function localDay(now = Date.now()): string {
  const date = new Date(now);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Daily 10, 2-minute sprints, confused pairs and the daily quest (2026-10-28):
// the learner's data fed to the pure rules in data/learning/daily-practice.ts.
import { getQuestion, getTopicQuestions } from '@/data/curriculum';
import { EXAM_BANKS } from '@/data/exam-practice';
import {
  confusedPairs,
  type ConfusedPair,
  dailyMixIds,
  type DrillQuestion,
  type MixUp,
  pairDrillIds,
} from '@/data/learning/daily-practice';
import type { MemoryModel } from '@/data/learning/memory';
import { loadPastQuestions, pastCourseOf } from '@/data/past-questions';
import { getQuestionHistory } from '@/data/question-history';
import type { ChoiceQuestion, Question } from '@/data/questions';
import { getQuizHistory } from '@/data/quiz-history';

export * from '@/data/learning/daily-practice';
export * from '@/data/daily-quest';

const askable = (question: Question) => question.usage !== 'learn' && question.reviewEligible !== false;

/**
 * Today's Daily 10: one question for each of the most urgent concepts, courses
 * mixed — only from lessons the learner has really studied (owner, 2026-10-29:
 * "do not bring stuff the user has not studied"; `studied` is
 * studiedLessonIds() from selection.ts: completed lessons and lessons worked
 * through step by step), and only questions from those lessons.
 */
export function dailyMixPool(memory: MemoryModel, studied: ReadonlySet<string>): string[] {
  const byTopic = new Map<string, Question[]>();
  const topicQuestions = (topicId: string) => {
    let list = byTopic.get(topicId);
    if (!list) {
      list = getTopicQuestions(topicId).filter((question) => askable(question) && studied.has(question.lessonId ?? ''));
      byTopic.set(topicId, list);
    }
    return list;
  };
  return dailyMixIds(
    [...memory.concepts.values()].filter((concept) => studied.has(concept.lessonId)),
    (concept) => topicQuestions(concept.topicId).filter((question) => question.conceptId === concept.conceptId).map((question) => question.id),
    (id) => memory.questions.get(id)
  );
}

const rightOption = (question: Question | undefined) =>
  question?.type === 'choice' ? question.options[question.answer] : undefined;

/** Every recorded wrong multiple-choice answer: what was picked and what was right. */
export function myMixUps(): MixUp[] {
  const out: MixUp[] = [];
  for (const attempt of getQuestionHistory()) {
    if (attempt.correct || !attempt.chosen) continue;
    const right = rightOption(getQuestion(attempt.questionId));
    if (right) out.push({ questionId: attempt.questionId, picked: attempt.chosen, right, at: attempt.attemptedAt });
  }
  // Quizzes saved their answers before "chosen" was recorded: read those too.
  for (const quiz of getQuizHistory()) {
    if (!quiz.answers) continue;
    for (const id of quiz.wrongQuestionIds) {
      const question = getQuestion(id);
      const answer = quiz.answers[id];
      if (question?.type !== 'choice' || typeof answer !== 'number') continue;
      const picked = question.options[answer];
      if (picked) out.push({ questionId: id, picked, right: question.options[question.answer], at: quiz.completedAt });
    }
  }
  return out;
}

/** The answers this learner mixes up most. */
export const myConfusedPairs = (limit?: number): ConfusedPair[] => confusedPairs(myMixUps(), limit);

/**
 * A drill on those pairs: the questions where the mix-ups happened, plus other
 * questions on the same two answers from lessons the learner has studied.
 */
export async function preparePairDrill(pairs: readonly ConfusedPair[], studied: ReadonlySet<string>): Promise<string[]> {
  const ids = pairs.flatMap((pair) => pair.questionIds);
  if (ids.some((id) => pastCourseOf(id))) await Promise.allSettled(EXAM_BANKS.map(loadPastQuestions));
  const topics = new Set(ids.map((id) => getQuestion(id)?.topicId).filter((id): id is string => Boolean(id)));
  const bank = new Map<string, DrillQuestion>();
  const add = (question: Question | undefined) => {
    if (!question || question.type !== 'choice' || !askable(question)) return;
    const choice = question as ChoiceQuestion;
    bank.set(choice.id, { id: choice.id, options: choice.options, right: choice.options[choice.answer] });
  };
  for (const topicId of topics) getTopicQuestions(topicId).filter((question) => studied.has(question.lessonId ?? '')).forEach(add);
  ids.forEach((id) => add(getQuestion(id)));
  return pairDrillIds(pairs, [...bank.values()]);
}

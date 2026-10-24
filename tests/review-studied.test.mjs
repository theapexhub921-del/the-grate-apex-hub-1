// Review asks only about what the learner has studied (owner, 2026-10-24): lessons
// completed or worked through step by step. A concept met only in an Apex Challenge
// (or the Question of the Day, or a quiz taken without the lesson) is never due and
// never reviewed.
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { builtTopics } = await import('@/data/topics');
const { getLessonQuestions } = await import('@/data/curriculum');
const { buildMemoryModel } = await import('@/data/learning/memory');
const { selectQuestions, studiedLessonIds } = await import('@/data/learning/selection');

const DAY = 86_400_000;
const now = Date.parse('2026-10-24T12:00:00Z');
const topic = builtTopics.find(({ topic }) => topic.id === 'upper-limb').topic;
const [apexLesson, stepLesson, doneLesson] = topic.lessons;
const first = (lesson) => getLessonQuestions(lesson.id).find((q) => q.concept);
const answer = (lesson, mode, at) => {
  const q = first(lesson);
  return { questionId: q.id, lessonId: lesson.id, concept: q.concept, correct: true, attemptedAt: at, mode };
};

// Long ago, so every concept touched would be due by now.
const attempts = [answer(apexLesson, 'apex', now - 60 * DAY), answer(stepLesson, 'interactive', now - 60 * DAY)];
const completions = [{ lessonId: doneLesson.id, completedAt: now - 60 * DAY }];
const memory = buildMemoryModel({ attempts, completions, now });

test('studied lessons are the completed ones and the ones worked through step by step', () => {
  const studied = studiedLessonIds([doneLesson.id], memory);
  assert.ok(studied.has(doneLesson.id));
  assert.ok(studied.has(stepLesson.id));
  assert.ok(!studied.has(apexLesson.id), 'a lesson met only in an Apex Challenge is not studied');
});

test('a concept met only in an Apex Challenge never falls due', () => {
  const apexConcepts = [...memory.concepts.values()].filter((c) => c.lessonId === apexLesson.id);
  assert.ok(apexConcepts.length > 0);
  assert.ok(apexConcepts.every((c) => !c.due));
  assert.ok([...memory.concepts.values()].some((c) => c.lessonId === stepLesson.id && c.due));
  assert.ok([...memory.concepts.values()].some((c) => c.lessonId === doneLesson.id && c.due));
});

test('a review session only asks about studied lessons', () => {
  const studied = studiedLessonIds([doneLesson.id], memory);
  const picked = selectQuestions(
    { scope: { kind: 'review', topicId: topic.id }, filters: { learnedOnly: true, studiedLessons: studied }, strategy: 'weighted', size: 30, seed: 's', now },
    memory
  );
  assert.ok(picked.length > 0);
  for (const item of picked) assert.ok(studied.has(item.question.lessonId), `${item.question.id} is from ${item.question.lessonId}`);
});

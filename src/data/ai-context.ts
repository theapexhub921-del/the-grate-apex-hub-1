// Finds the lecture text behind a question, so "Explain with AI" answers from
// the learner's own slides (see api/ai.mjs, mode 'explain').
//
//   1. a topic lesson (data/topics)          → its reading text
//   2. an HB1 / HB2 lesson (data/legacy-study) → its sections
//   3. nothing found                          → null (the AI then says it is going beyond the slides)
import { lessonToText, legacyToText } from '@/data/ai-study';
import { findLesson, getTopic } from '@/data/curriculum';
import { legacyCourse, loadLegacyLessonBody, loadLegacyLessonMeta } from '@/data/legacy-study';
import type { Question } from '@/data/questions';

export type AiLessonText = { id: string; title: string; text: string };

const cache = new Map<string, Promise<AiLessonText | null>>();

/** The lesson text for a lesson id, from whichever kind of lesson it is. Never throws. */
export function aiLessonById(lessonId: string | undefined | null): Promise<AiLessonText | null> {
  if (!lessonId) return Promise.resolve(null);
  const hit = cache.get(lessonId);
  if (hit) return hit;
  const promise = (async () => {
    const entry = findLesson(lessonId);
    if (entry) return { id: lessonId, title: entry.lesson.title, text: lessonToText(entry.lesson) };
    try {
      const [meta, body] = await Promise.all([loadLegacyLessonMeta(lessonId), loadLegacyLessonBody(lessonId)]);
      if (meta) return { id: lessonId, title: meta.title, text: legacyToText(meta.title, body.sections, body.extras) };
    } catch {
      // Another class's lesson, or offline: explain without it.
    }
    return null;
  })();
  cache.set(lessonId, promise);
  void promise.then((value) => { if (!value) cache.delete(lessonId); });
  return promise;
}

/** The lesson text behind a question (null when there is none to find). */
export function aiLessonForQuestion(question: Question): Promise<AiLessonText | null> {
  return aiLessonById(question.lessonId);
}

/** A readable course name for a question, given to the AI as context. */
export function courseNameForQuestion(question: Question): string | undefined {
  if (!question.topicId) return undefined;
  return getTopic(question.topicId)?.title ?? legacyCourse(question.topicId)?.name ?? undefined;
}

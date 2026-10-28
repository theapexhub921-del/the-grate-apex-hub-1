// Lecture diagrams as practice (2026-10-28): which lesson shows each diagram,
// and the "what is the marked part?" question for each labelled part, so
// "Label it" can record answers like a quiz (memory, Review).
import { getTopicQuestions, publishedTopics } from '@/data/curriculum';
import { allFigures } from '@/data/figures';
import { chunkFigures, type LessonFigure } from '@/data/lesson-types';
import type { Question } from '@/data/questions';

let lessonOf: Map<string, string> | null = null;
let spotQuestions: Map<string, Question> | null = null;

/** Figure id → the first lesson that shows it. */
export function figureLessons(): Map<string, string> {
  if (lessonOf) return lessonOf;
  lessonOf = new Map();
  for (const topic of publishedTopics) {
    for (const lesson of topic.lessons) {
      const ids = [
        ...lesson.chunks.flatMap((chunk) => chunkFigures(chunk)),
        ...(lesson.interactive ?? []).flatMap((step) => ('figures' in step && Array.isArray(step.figures) ? step.figures : [])),
      ];
      for (const id of ids) if (!lessonOf.has(id)) lessonOf.set(id, lesson.id);
    }
  }
  return lessonOf;
}

/** The quiz question asking about one part of a diagram, if there is one. */
export function spotQuestionFor(figureId: string, spotId: string): Question | undefined {
  if (!spotQuestions) {
    spotQuestions = new Map();
    for (const topic of publishedTopics) {
      for (const question of getTopicQuestions(topic.id)) {
        const ref = (question as Question & { figure?: { id: string; spot?: string } }).figure;
        if (ref?.spot && question.type === 'choice') {
          const key = `${ref.id}|${ref.spot}`;
          if (!spotQuestions.has(key)) spotQuestions.set(key, question);
        }
      }
    }
  }
  return spotQuestions.get(`${figureId}|${spotId}`);
}

/**
 * A diagram to label: one from a studied lesson when there is one (not the one
 * just done), otherwise any. `pick` is a number in [0, 1).
 */
export function pickLabelFigure(studied: ReadonlySet<string>, pick: number, skip?: string): LessonFigure | undefined {
  const lessons = figureLessons();
  const usable = allFigures.filter((figure) => figure.spots.length >= 3 && figure.id !== skip && lessons.has(figure.id));
  const fromStudied = usable.filter((figure) => studied.has(lessons.get(figure.id)!));
  const pool = fromStudied.length ? fromStudied : usable;
  return pool.length ? pool[Math.floor(pick * pool.length) % pool.length] : undefined;
}

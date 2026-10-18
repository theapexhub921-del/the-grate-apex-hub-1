// Every lesson simulation of a subject, grouped by topic in course order —
// the Simulations tab of Physiology (components/learning/simulation-library.tsx).
import { findLesson, publishedTopics } from '@/data/curriculum';
import type { Lesson, SimulationStep, SubjectId, Topic } from '@/data/lesson-types';
import { getSimulation } from '@/data/simulations';

export type SimulationEntry = { lesson: Lesson; step: SimulationStep; name: string };
export type SimulationGroup = { topic: Topic; items: SimulationEntry[] };

function stepOf(lesson: Lesson): SimulationStep | undefined {
  return (lesson.interactive ?? []).find((step): step is SimulationStep => step.type === 'simulate');
}

export function simulationLibrary(subject: SubjectId): SimulationGroup[] {
  return publishedTopics
    .filter((topic) => topic.subject === subject)
    .map((topic) => ({
      topic,
      items: topic.lessons.flatMap((lesson) => {
        const step = stepOf(lesson);
        const definition = step ? getSimulation(step.sim) : undefined;
        return step && definition ? [{ lesson, step, name: step.title || definition.name }] : [];
      }),
    }))
    .filter((group) => group.items.length > 0);
}

// The simulation of one lesson (for /learn/simulation?lesson=…).
export function lessonSimulation(lessonId: string | null | undefined) {
  const entry = findLesson(lessonId);
  const step = entry ? stepOf(entry.lesson) : undefined;
  return entry && step ? { ...entry, step } : null;
}

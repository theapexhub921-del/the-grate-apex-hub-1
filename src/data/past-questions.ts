// HB2 past questions as this app's questions, grouped by topic
// (data/past-question-topics.ts). Loading a course's bank also registers its
// questions with the curriculum, so the quiz engine finds them by id: the custom
// quiz can mix them with lesson questions, and results and retakes show them.
import { useEffect, useState } from 'react';

import { registerExtraQuestions } from '@/data/curriculum';
import { loadLegacyBank, toQuestion } from '@/data/legacy-study';
import { OTHER_PAST_TOPIC, pastTopicTitle } from '@/data/past-question-topics';
import type { Question } from '@/data/questions';

type ByTopic = Map<string, Question[]>; // topic id → questions

const loaded = new Map<string, ByTopic>();
const loading = new Map<string, Promise<ByTopic>>();

/** A course's past questions by topic (each question once, even if it is in several papers). */
export function loadPastQuestions(courseId: string): Promise<ByTopic> {
  const pending = loading.get(courseId);
  if (pending) return pending;
  const promise = loadLegacyBank(courseId).then((bank) => {
    const byTopic: ByTopic = new Map();
    const seen = new Set<string>();
    for (const set of bank.sets) {
      for (const q of set.questions) {
        if (seen.has(q.id)) continue;
        seen.add(q.id);
        const topic = q.tp ?? OTHER_PAST_TOPIC;
        const list = byTopic.get(topic) ?? [];
        list.push(toQuestion(q, { course: courseId, concept: pastTopicTitle(courseId, topic) }));
        byTopic.set(topic, list);
      }
    }
    registerExtraQuestions([...byTopic.values()].flat());
    loaded.set(courseId, byTopic);
    return byTopic;
  });
  loading.set(courseId, promise);
  promise.catch(() => loading.delete(courseId)); // try again next time
  return promise;
}

/** A topic's past questions, once its course has loaded (empty before). */
export const pastQuestionsFor = (courseId: string, topicId: string): Question[] => loaded.get(courseId)?.get(topicId) ?? [];

/** The HB2 course a past question belongs to ("legacy:hb2-anatomy:1a2b3c" → "hb2-anatomy"). */
export const pastCourseOf = (questionId: string) => /^legacy:(hb2-[a-z]+):/.exec(questionId)?.[1] ?? null;

/** Loads these courses' past questions; true once they are ready (or could not be loaded). */
export function usePastQuestions(courseIds: readonly string[]) {
  const key = [...new Set(courseIds)].sort().join(',');
  const [readyKey, setReadyKey] = useState(() => (courseIds.every((id) => loaded.has(id)) ? key : null));
  useEffect(() => {
    if (!key) return;
    let live = true;
    Promise.allSettled(key.split(',').map(loadPastQuestions)).then(() => {
      if (live) setReadyKey(key);
    });
    return () => {
      live = false;
    };
  }, [key]);
  return !key || readyKey === key;
}

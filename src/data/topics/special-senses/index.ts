// Physiology → Special Senses, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/special-senses/lessons';
import { questions } from '@/data/topics/special-senses/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/special-senses/sources';

export const specialSenses = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Special Senses',
  description: 'The eye, focusing, the retina and phototransduction, visual pathways, hearing, balance, taste and smell.',
  emoji: '👁️',
  source: 'Lectures: Visual System, Auditory and Vestibular Systems, Chemical Senses',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

// Physiology → Endocrinology, assembled from its parts:
//   sources.ts      — page references, concepts, discrepancies
//   lessons.ts      — the seven lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/endocrinology/lessons';
import { questions } from '@/data/topics/endocrinology/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/endocrinology/sources';

export const endocrinology = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Endocrinology',
  description: 'Hormones and their control, the hypothalamus and pituitary, the thyroid, the adrenal glands, the endocrine pancreas and calcium metabolism.',
  emoji: '🦋',
  source: 'Lectures: Endocrinology, Thyroid, Adrenals, Endocrine Pancreas, Calcium Metabolism',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

// Physiology → Reproductive Physiology, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/reproductive-physiology/lessons';
import { questions } from '@/data/topics/reproductive-physiology/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/reproductive-physiology/sources';

export const reproductivePhysiology = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Reproductive Physiology',
  description: 'The male and female systems, spermatogenesis and oogenesis, the menstrual cycle, sex hormones, puberty and climacteric, sexual response, pregnancy, parturition and lactation.',
  emoji: '🧬',
  source: 'Lectures: Male, Female, Sexual Response',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

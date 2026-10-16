// Physiology → Central Nervous System, assembled from its parts:
//   sources.ts      — slide and page references, concepts, discrepancies, diagrams
//   lessons.ts      — the nine lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   simulations.ts  — one simulation per lesson
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/central-nervous-system/lessons';
import { questions } from '@/data/topics/central-nervous-system/questions';
import { concepts, diagrams, discrepancies, TOPIC_ID } from '@/data/topics/central-nervous-system/sources';

export const centralNervousSystem = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Central Nervous System',
  description:
    'Sensory receptors and reflexes, the ascending pathways, pain, the spinal cord, motor control, the cerebellum, the basal ganglia and the brain.',
  emoji: '🧠',
  source: 'Lectures: Sensory I–II, Pain, Spinal Cord, Motor Activity, Cerebellum, Basal Ganglia, The Brain',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams,
});

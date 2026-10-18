// Physiology → Respiratory Physiology (HB2), assembled from its parts:
//   sources.ts     — slide references, concepts, discrepancies
//   lessons.ts     — the nine lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/respiratory-physiology/lessons';
import { questions } from '@/data/topics/respiratory-physiology/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/respiratory-physiology/sources';

export const respiratoryPhysiology = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Respiratory Physiology',
  description:
    'How we breathe and exchange gases: the mechanics of breathing, lung volumes, compliance and surfactant, ventilation and the pulmonary circulation, O₂ and CO₂ transport, diffusion and V/Q, the control of breathing, hypoxia and breathing in unusual conditions.',
  emoji: '🫁',
  source: 'Lecture: Respiratory System',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
});

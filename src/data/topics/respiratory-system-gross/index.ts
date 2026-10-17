// Anatomy → Respiratory System (gross, HB2), assembled from its parts:
//   sources.ts     — slide references, concepts, discrepancies
//   lessons.ts     — the seven lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/respiratory-system-gross/lessons';
import { questions } from '@/data/topics/respiratory-system-gross/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/respiratory-system-gross/sources';

export const respiratoryGross = buildTopic({
  id: TOPIC_ID,
  subject: 'anatomy',
  courseId: 'anatomy-lectures',
  title: 'Respiratory System',
  description:
    'Gross anatomy of the respiratory system: nasal cavity and pharynx, larynx, trachea, thoracic wall, diaphragm, pleura, and the lungs and bronchial tree.',
  emoji: '🫁',
  source: 'Lecture: Respiratory System 2026 (v2)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
});

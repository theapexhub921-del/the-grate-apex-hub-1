// Anatomy → Head and Neck (gross, HB2), assembled from its parts:
//   sources.ts     — slide references, concepts, discrepancies
//   lessons.ts     — the ten lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { pictures } from '@/data/figures/pictures/head-and-neck';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/head-and-neck/lessons';
import { questions } from '@/data/topics/head-and-neck/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/head-and-neck/sources';

export const headAndNeck = buildTopic({
  id: TOPIC_ID,
  subject: 'anatomy',
  courseId: 'anatomy-lectures',
  section: 'Gross Anatomy',
  title: 'Head and Neck',
  description:
    'Gross anatomy of the head and neck: cervical fascia and triangles, scalp and face, orbit, pterygopalatine fossa, nasal cavity and sinuses, ear, tongue and salivary glands, the twelve cranial nerves, and the larynx.',
  emoji: '🧠',
  source: 'Lecture: Head and Neck (HB2, June–July 2026)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  pictures,
  discrepancies,
});

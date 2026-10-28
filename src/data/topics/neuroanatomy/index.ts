// Anatomy → Neuroanatomy (gross, HB2), assembled from its parts:
//   sources.ts     — slide references, concepts, discrepancies
//   lessons.ts     — the eight lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { pictures } from '@/data/figures/pictures/neuroanatomy';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/neuroanatomy/lessons';
import { questions } from '@/data/topics/neuroanatomy/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/neuroanatomy/sources';

export const neuroanatomy = buildTopic({
  id: TOPIC_ID,
  subject: 'anatomy',
  courseId: 'anatomy-lectures',
  section: 'Gross Anatomy',
  title: 'Neuroanatomy',
  description:
    'Gross neuroanatomy: divisions of the nervous system, cerebral hemispheres and cortical areas, thalamus and diencephalon, hypothalamus and pituitary, basal nuclei and blood supply of the brain, and the meninges, dural venous sinuses, cisterns and intracranial haemorrhage.',
  emoji: '🧬',
  source: 'Lectures: Central Nervous System; Meninges of the CNS',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  pictures,
  discrepancies,
});

// Anatomy → Gastrointestinal System (gross, HB2), assembled from its parts:
//   sources.ts     — slide references, concepts, discrepancies
//   lessons.ts     — the ten lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/gastrointestinal-system-gross/lessons';
import { questions } from '@/data/topics/gastrointestinal-system-gross/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/gastrointestinal-system-gross/sources';

export const gastrointestinalGross = buildTopic({
  id: TOPIC_ID,
  subject: 'anatomy',
  courseId: 'anatomy-lectures',
  title: 'Gastrointestinal System',
  description:
    'Gross anatomy of the abdomen and gut: the anterior and posterior abdominal walls, inguinal region and hernias, oesophagus to anal canal, liver, gallbladder, pancreas and spleen, and the blood supply, portal system, lymphatics and nerves of the GI tract.',
  emoji: '🍽️',
  source: 'Lectures: Abdominal Walls; GI Tract & Accessory Organs; Neurovasculature of the GI Tract (2026)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
});

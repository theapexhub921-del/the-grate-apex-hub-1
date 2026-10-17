// Anatomy → Cardiovascular System (gross, HB2), assembled from its parts:
//   sources.ts     — slide references, concepts, discrepancies
//   lessons.ts     — the seven lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/cardiovascular-system-gross/lessons';
import { questions } from '@/data/topics/cardiovascular-system-gross/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/cardiovascular-system-gross/sources';

export const cardiovascularGross = buildTopic({
  id: TOPIC_ID,
  subject: 'anatomy',
  courseId: 'anatomy-lectures',
  section: 'Gross Anatomy',
  title: 'Cardiovascular System',
  description:
    'Gross anatomy of the cardiovascular system: the mediastinum, pericardium, external and internal features of the heart, valves and auscultation, conduction and coronary circulation, blood vessel structure, and the great vessels and arteries of the trunk.',
  emoji: '🫀',
  source: 'Lectures: Cardiovascular System Gross 1 and 2',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
});

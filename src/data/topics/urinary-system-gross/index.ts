// Anatomy → Urinary System (gross, HB2), assembled from its parts:
//   sources.ts     — slide references, concepts
//   lessons.ts     — the five lessons (reading layer)
//   interactive.ts — each lesson's interactive layer
//   questions.ts   — the quiz bank (with Assertion–Reason questions)
import { contentTopics } from '@/data/content-catalog';
import { pictures } from '@/data/figures/pictures/urinary-system-gross';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/urinary-system-gross/lessons';
import { questions } from '@/data/topics/urinary-system-gross/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/urinary-system-gross/sources';

export const urinaryGross = buildTopic({
  id: TOPIC_ID,
  subject: 'anatomy',
  courseId: 'anatomy-lectures',
  section: 'Gross Anatomy',
  title: 'Urinary System',
  description:
    'Gross anatomy of the urinary system: the kidneys and their coverings, relations, structure and vessels, the suprarenal glands, the ureters, the urinary bladder and the male and female urethra.',
  emoji: '💧',
  source: 'Lecture: Urinary System (Gross) 2026',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  pictures,
  discrepancies,
});

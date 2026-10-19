// Physiology → Renal Physiology, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
//   extra-questions.ts — more practice and Assertion–Reason questions
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/renal-physiology/lessons';
import { extraQuestions } from '@/data/topics/renal-physiology/extra-questions';
import { questions } from '@/data/topics/renal-physiology/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/renal-physiology/sources';

export const renalPhysiology = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Renal Physiology',
  description: 'The kidney and nephron, glomerular filtration, tubular reabsorption and secretion, concentrating urine, clearance, micturition and acid–base balance.',
  emoji: '🫘',
  source: 'Lecture: Renal System',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 2, // 2: a simulation in every lesson
  concepts,
  lessons,
  questions: [...questions, ...extraQuestions],
  discrepancies,
  diagrams: [],
});

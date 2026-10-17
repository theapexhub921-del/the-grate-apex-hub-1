// Biochemistry → Immunology, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/immunology/lessons';
import { questions } from '@/data/topics/immunology/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/immunology/sources';

export const immunology = buildTopic({
  id: TOPIC_ID,
  subject: 'biochemistry',
  courseId: 'biochemistry-lectures',
  title: 'Immunology',
  description: 'History, innate and adaptive immunity, immune cells, cytokines, antigens, antibodies and monoclonals, complement, and immunity to infection.',
  emoji: '🛡️',
  source: 'Lectures: Immunology (Prof. Sakyi, Dr Frimpong; current and earlier decks)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

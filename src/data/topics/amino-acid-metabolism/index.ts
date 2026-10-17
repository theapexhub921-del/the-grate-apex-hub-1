// Biochemistry → Amino Acid Metabolism, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/amino-acid-metabolism/lessons';
import { questions } from '@/data/topics/amino-acid-metabolism/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/amino-acid-metabolism/sources';

export const aminoAcidMetabolism = buildTopic({
  id: TOPIC_ID,
  subject: 'biochemistry',
  courseId: 'biochemistry-lectures',
  title: 'Amino Acid Metabolism',
  description: 'Amino acid structure and classes, general reactions, ammonia and the urea cycle, carbon-skeleton and sulfur amino acid catabolism, and one-carbon metabolism.',
  emoji: '🧪',
  source: 'Lectures: Amino Acid Metabolism (four decks, Dr Annani-Akollor)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

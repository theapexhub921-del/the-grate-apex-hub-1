// Biochemistry → Nucleic Acids, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/nucleic-acids/lessons';
import { questions } from '@/data/topics/nucleic-acids/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/nucleic-acids/sources';

export const nucleicAcids = buildTopic({
  id: TOPIC_ID,
  subject: 'biochemistry',
  courseId: 'biochemistry-lectures',
  title: 'Nucleic Acids',
  description: 'Nucleotide synthesis and breakdown, DNA and RNA structure, replication, repair, transcription, translation, gene regulation, cancer genetics and recombinant DNA technology.',
  emoji: '🧬',
  source: 'Lectures: Nucleic Acids (five decks, Dr Annani-Akollor)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

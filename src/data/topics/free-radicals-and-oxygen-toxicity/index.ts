// Biochemistry → Free Radicals and Oxygen Toxicity, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/free-radicals-and-oxygen-toxicity/lessons';
import { questions } from '@/data/topics/free-radicals-and-oxygen-toxicity/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/free-radicals-and-oxygen-toxicity/sources';

export const freeRadicals = buildTopic({
  id: TOPIC_ID,
  subject: 'biochemistry',
  courseId: 'biochemistry-lectures',
  title: 'Free Radicals and Oxygen Toxicity',
  description: 'What free radicals are, how they damage cells, how antioxidants defend, and their role in disease.',
  emoji: '🔥',
  source: 'Lectures: Free Radicals and Oxygen Toxicity (two decks)',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

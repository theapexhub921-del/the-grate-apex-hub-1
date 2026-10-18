// Physiology → Gastrointestinal Physiology, assembled from its parts:
//   sources.ts      — slide/page references, concepts, discrepancies
//   lessons.ts      — the lessons (reading layer)
//   interactive.ts  — each lesson's interactive layer + reading extras
//   questions.ts    — the topic question bank (quiz layer)
import { contentTopics } from '@/data/content-catalog';
import { buildTopic } from '@/data/topics/build';
import { lessons } from '@/data/topics/gastrointestinal-physiology/lessons';
import { questions } from '@/data/topics/gastrointestinal-physiology/questions';
import { concepts, discrepancies, TOPIC_ID } from '@/data/topics/gastrointestinal-physiology/sources';

export const gastrointestinalPhysiology = buildTopic({
  id: TOPIC_ID,
  subject: 'physiology',
  courseId: 'physiology-lectures',
  title: 'Gastrointestinal Physiology',
  description: 'The gut wall, digestion and absorption, saliva, gastric, pancreatic and intestinal secretion, control of the gut, motility, defecation, vomiting, the liver and bile.',
  emoji: '🍽️',
  source: 'Lecture: Digestive System',
  sourceFileIds: contentTopics.find((topic) => topic.id === TOPIC_ID)?.sourceFileIds ?? [],
  contentVersion: 1,
  concepts,
  lessons,
  questions,
  discrepancies,
  diagrams: [],
});

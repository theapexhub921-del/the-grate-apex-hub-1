// Anatomy drills (owner, 2026-10-28): "Stack the layers", "What gets hit?" and
// "Why is it there?", one file per Gross Anatomy topic (see types.ts).
//
// Layers and cases become ordinary quiz questions (order and multiple choice)
// with ids `drill:<topic>:<id>`, registered with the curriculum so the quiz
// engine, results, retakes and spaced repetition find them by id. Each is tied
// to the lesson concept its words match best, so answers feed that concept's
// memory. Why cards are flip cards (components/learning/anatomy-drills.tsx).
import { findLesson, getTopic, isTrackableConcept, registerExtraQuestions } from '@/data/curriculum';
import type { Lesson } from '@/data/lesson-types';
import type { ChoiceQuestion, OrderQuestion, Question } from '@/data/questions';

import { drills as cardiovascular } from './cardiovascular-system-gross';
import { drills as gastrointestinal } from './gastrointestinal-system-gross';
import { drills as headAndNeck } from './head-and-neck';
import { drills as neuroanatomy } from './neuroanatomy';
import { drills as respiratory } from './respiratory-system-gross';
import type { HitCase, LayerDrill, TopicDrills, WhyCard } from './types';
import { drills as upperLimb } from './upper-limb';
import { drills as urinary } from './urinary-system-gross';

export type { HitCase, LayerDrill, TopicDrills, WhyCard } from './types';

/** In course order (as builtTopics). */
export const allDrills: readonly TopicDrills[] = [cardiovascular, respiratory, gastrointestinal, urinary, upperLimb, headAndNeck, neuroanatomy];

export const drillsFor = (topicId: string | undefined | null): TopicDrills | undefined =>
  allDrills.find((item) => item.topicId === topicId);

export type DrillKind = 'layers' | 'cases';
/** Questions per drill run. */
export const DRILL_SIZE = 8;
export const drillQuestionId = (topicId: string, kind: DrillKind, id: string) => `drill:${topicId}:${kind}:${id}`;

// Words too common in anatomy to tell concepts apart.
const GENERIC = new Set(['nerve', 'nerves', 'artery', 'arteries', 'branch', 'branches', 'their', 'with', 'from', 'part', 'parts', 'clinical', 'notes', 'supply', 'course', 'features', 'relations']);
const words = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, ' ')
      .split(' ')
      .filter((word) => word.length >= 4 && !GENERIC.has(word))
      .map((word) => (word.endsWith('s') && word.length > 4 ? word.slice(0, -1) : word))
  );

/** The lesson concept whose name shares the most words with the drill (the first concept if none do). */
export function conceptFor(lesson: Lesson, text: string) {
  const concepts = lesson.concepts.filter(isTrackableConcept);
  const drillWords = words(text);
  let best = concepts[0];
  let bestScore = 0;
  for (const concept of concepts) {
    const score = [...words(concept.name)].filter((word) => drillWords.has(word)).length;
    if (score > bestScore) {
      best = concept;
      bestScore = score;
    }
  }
  return best;
}

function base(topicId: string, kind: DrillKind, item: LayerDrill | HitCase, text: string) {
  const lesson = findLesson(item.lessonId)?.lesson;
  const topic = getTopic(topicId);
  const concept = lesson ? (lesson.concepts.find((concept) => concept.id === item.conceptId) ?? conceptFor(lesson, text)) : undefined;
  return {
    id: drillQuestionId(topicId, kind, item.id),
    concept: concept?.name ?? lesson?.title ?? topicId,
    conceptId: concept?.id,
    subject: topic?.subject,
    courseId: topic?.courseId,
    topicId,
    lessonId: item.lessonId,
    usage: 'quiz' as const,
    difficulty: 'intermediate' as const,
  };
}

export function layerQuestion(topicId: string, item: LayerDrill): OrderQuestion {
  return {
    ...base(topicId, 'layers', item, `${item.prompt} ${item.items.join(' ')} ${item.explanation}`),
    type: 'order',
    prompt: item.prompt,
    items: item.items,
    explanation: item.explanation,
    skill: 'sequence',
    label: 'Stack the layers',
  };
}

export function caseQuestion(topicId: string, item: HitCase): ChoiceQuestion {
  return {
    ...base(topicId, 'cases', item, `${item.scenario} ${item.answer} ${item.explanation}`),
    type: 'choice',
    prompt: item.scenario,
    options: [item.answer, ...item.wrong],
    answer: 0,
    explanation: item.explanation,
    skill: 'application',
    label: 'What gets hit?',
    clinical: true,
  };
}

let built: { all: Question[]; byTopic: Map<string, { layers: Question[]; cases: Question[] }> } | null = null;

function build() {
  if (built) return built;
  const byTopic = new Map<string, { layers: Question[]; cases: Question[] }>();
  const all: Question[] = [];
  for (const topic of allDrills) {
    const layers = topic.layers.map((item) => layerQuestion(topic.topicId, item));
    const cases = topic.cases.map((item) => caseQuestion(topic.topicId, item));
    byTopic.set(topic.topicId, { layers, cases });
    all.push(...layers, ...cases);
  }
  registerExtraQuestions(all);
  built = { all, byTopic };
  return built;
}

/** Registers every drill question with the curriculum (safe to call often). */
export function ensureDrillQuestions(): readonly Question[] {
  return build().all;
}

/** A topic's drill questions of one kind. */
export function drillQuestions(topicId: string, kind: DrillKind): Question[] {
  return build().byTopic.get(topicId)?.[kind] ?? [];
}

/** Whether a question id belongs to a drill. */
export const isDrillQuestionId = (id: string) => id.startsWith('drill:');

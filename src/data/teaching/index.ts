// Physiology taught the way a textbook teaches (owner, 2026-10-29: "the slides
// do not teach, they just state — the physiology courses should actually teach
// you like a textbook"). For each reading section, a few paragraphs that build
// the idea from the basics: what it is, how it works step by step, why, and
// what happens when it goes wrong. Written in our own words from the lecture
// (its facts and numbers are kept) and the course textbooks' explanations
// (Guyton & Hall, Costanzo); never copied text. buildTopic puts them on the
// section as `teach`; the Read tab and HB2 lesson pages show them first, then
// the lecture's key points. tests/teaching.test.mjs checks them.
import type { Teaching } from '@/data/teaching/types';
import { teaching as cardiovascularPhysiology } from '@/data/teaching/cardiovascular-physiology';
import { teaching as centralNervousSystem } from '@/data/teaching/central-nervous-system';
import { teaching as endocrinology } from '@/data/teaching/endocrinology';
import { teaching as gastrointestinalPhysiology } from '@/data/teaching/gastrointestinal-physiology';
import { teaching as renalPhysiology } from '@/data/teaching/renal-physiology';
import { teaching as reproductivePhysiology } from '@/data/teaching/reproductive-physiology';
import { teaching as respiratoryPhysiology } from '@/data/teaching/respiratory-physiology';
import { teaching as specialSenses } from '@/data/teaching/special-senses';

const byTopic: Record<string, Teaching> = {
  'cardiovascular-physiology': cardiovascularPhysiology,
  'central-nervous-system': centralNervousSystem,
  'endocrinology': endocrinology,
  'gastrointestinal-physiology': gastrointestinalPhysiology,
  'renal-physiology': renalPhysiology,
  'reproductive-physiology': reproductivePhysiology,
  'respiratory-physiology': respiratoryPhysiology,
  'special-senses': specialSenses,
};

export const teachingTopics = Object.keys(byTopic);

/** The teaching paragraphs for one lesson section, if there are any. */
export function teachingFor(topicId: string, lessonId: string, index: number): string[] | undefined {
  const paragraphs = byTopic[topicId]?.[lessonId]?.[index];
  return paragraphs?.length ? paragraphs : undefined;
}

/** Every teaching paragraph of a topic (for checks). */
export const teachingOf = (topicId: string): Teaching => byTopic[topicId] ?? {};

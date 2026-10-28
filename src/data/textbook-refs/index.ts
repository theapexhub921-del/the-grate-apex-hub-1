// Textbook page references for every course (owner, 2026-10-28: "add textbook
// references based on the slides to every course"). Each topic file lists, per
// lesson section, the reference-textbook pages that cover the section's lecture
// content: Gray's Anatomy for Students (anatomy), Guyton and Hall and Costanzo
// (physiology, and the biochemistry topics Guyton covers). They are added to
// the sections' sourceRefs by buildTopic, so they show as "Textbook" in the
// lesson (Read tab, HB2 lesson pages). Lehninger references were already
// written into the biochemistry topics' own sources.ts.
import type { SourceReference } from '@/data/lesson-types';
import type { TextbookPages } from '@/data/textbook-refs/types';
import { textbookPages as aminoAcidMetabolism } from '@/data/textbook-refs/amino-acid-metabolism';
import { textbookPages as bloodCoagulationAndFibrinolysis } from '@/data/textbook-refs/blood-coagulation-and-fibrinolysis';
import { textbookPages as cardiovascularPhysiology } from '@/data/textbook-refs/cardiovascular-physiology';
import { textbookPages as cardiovascularSystemGross } from '@/data/textbook-refs/cardiovascular-system-gross';
import { textbookPages as centralNervousSystem } from '@/data/textbook-refs/central-nervous-system';
import { textbookPages as collagenSynthesis } from '@/data/textbook-refs/collagen-synthesis';
import { textbookPages as endocrinology } from '@/data/textbook-refs/endocrinology';
import { textbookPages as freeRadicalsAndOxygenToxicity } from '@/data/textbook-refs/free-radicals-and-oxygen-toxicity';
import { textbookPages as gastrointestinalPhysiology } from '@/data/textbook-refs/gastrointestinal-physiology';
import { textbookPages as gastrointestinalSystemGross } from '@/data/textbook-refs/gastrointestinal-system-gross';
import { textbookPages as headAndNeck } from '@/data/textbook-refs/head-and-neck';
import { textbookPages as hormonesEndocrineBiochemistry } from '@/data/textbook-refs/hormones-endocrine-biochemistry';
import { textbookPages as immunology } from '@/data/textbook-refs/immunology';
import { textbookPages as neuroanatomy } from '@/data/textbook-refs/neuroanatomy';
import { textbookPages as nucleicAcids } from '@/data/textbook-refs/nucleic-acids';
import { textbookPages as oxygenCarriers } from '@/data/textbook-refs/oxygen-carriers';
import { textbookPages as renalPhysiology } from '@/data/textbook-refs/renal-physiology';
import { textbookPages as reproductivePhysiology } from '@/data/textbook-refs/reproductive-physiology';
import { textbookPages as respiratoryPhysiology } from '@/data/textbook-refs/respiratory-physiology';
import { textbookPages as respiratorySystemGross } from '@/data/textbook-refs/respiratory-system-gross';
import { textbookPages as specialSenses } from '@/data/textbook-refs/special-senses';
import { textbookPages as upperLimb } from '@/data/textbook-refs/upper-limb';
import { textbookPages as urinarySystemGross } from '@/data/textbook-refs/urinary-system-gross';

const byTopic: Record<string, TextbookPages> = {
  "amino-acid-metabolism": aminoAcidMetabolism,
  "blood-coagulation-and-fibrinolysis": bloodCoagulationAndFibrinolysis,
  "cardiovascular-physiology": cardiovascularPhysiology,
  "cardiovascular-system-gross": cardiovascularSystemGross,
  "central-nervous-system": centralNervousSystem,
  "collagen-synthesis": collagenSynthesis,
  "endocrinology": endocrinology,
  "free-radicals-and-oxygen-toxicity": freeRadicalsAndOxygenToxicity,
  "gastrointestinal-physiology": gastrointestinalPhysiology,
  "gastrointestinal-system-gross": gastrointestinalSystemGross,
  "head-and-neck": headAndNeck,
  "hormones-endocrine-biochemistry": hormonesEndocrineBiochemistry,
  "immunology": immunology,
  "neuroanatomy": neuroanatomy,
  "nucleic-acids": nucleicAcids,
  "oxygen-carriers": oxygenCarriers,
  "renal-physiology": renalPhysiology,
  "reproductive-physiology": reproductivePhysiology,
  "respiratory-physiology": respiratoryPhysiology,
  "respiratory-system-gross": respiratorySystemGross,
  "special-senses": specialSenses,
  "upper-limb": upperLimb,
  "urinary-system-gross": urinarySystemGross,
};

/** The textbook references for one reading section (none when not listed). */
export function textbookRefsFor(topicId: string, lessonId: string, chunkIndex: number): SourceReference[] {
  const refs = byTopic[topicId]?.[lessonId]?.[chunkIndex] ?? [];
  return refs.flatMap(([sourceId, pages]) => pages.map((page) => ({ sourceId, page })));
}

/** Every topic with textbook pages (used by the tests). */
export const textbookTopics = Object.keys(byTopic);

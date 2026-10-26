import type { LessonTerm } from '@/data/lesson-types';

import { keyWords as fattyAcidBiosynthesis } from './fatty-acid-biosynthesis';
import { keyWords as hemeMetabolism } from './heme-metabolism';
import { keyWords as oxygenCarriers } from './oxygen-carriers';
import { keyWords as bloodCoagulationAndFibrinolysis } from './blood-coagulation-and-fibrinolysis';
import { keyWords as hormonesEndocrineBiochemistry } from './hormones-endocrine-biochemistry';
import { keyWords as inbornErrorsOfMetabolism } from './inborn-errors-of-metabolism';
import { keyWords as collagenSynthesis } from './collagen-synthesis';
import { keyWords as freeRadicalsAndOxygenToxicity } from './free-radicals-and-oxygen-toxicity';
import { keyWords as aminoAcidMetabolism } from './amino-acid-metabolism';
import { keyWords as nucleicAcids } from './nucleic-acids';
import { keyWords as immunology } from './immunology';
import { keyWords as cardiovascularPhysiology } from './cardiovascular-physiology';
import { keyWords as respiratoryPhysiology } from './respiratory-physiology';
import { keyWords as centralNervousSystem } from './central-nervous-system';
import { keyWords as endocrinology } from './endocrinology';
import { keyWords as gastrointestinalPhysiology } from './gastrointestinal-physiology';
import { keyWords as renalPhysiology } from './renal-physiology';
import { keyWords as reproductivePhysiology } from './reproductive-physiology';
import { keyWords as specialSenses } from './special-senses';

// Key words for lessons whose steps and reading sections name none (owner,
// 2026-10-25), one file per topic. "Start simple" shows a lesson's own words
// first and these only when it has none (components/learning/interactive-layer.tsx).
// tests/key-words.test.mjs checks every lesson has key words and that each word
// here appears in its lesson's text.
const ALL: Record<string, LessonTerm[]> = {
  ...fattyAcidBiosynthesis,
  ...hemeMetabolism,
  ...oxygenCarriers,
  ...bloodCoagulationAndFibrinolysis,
  ...hormonesEndocrineBiochemistry,
  ...inbornErrorsOfMetabolism,
  ...collagenSynthesis,
  ...freeRadicalsAndOxygenToxicity,
  ...aminoAcidMetabolism,
  ...nucleicAcids,
  ...immunology,
  ...cardiovascularPhysiology,
  ...respiratoryPhysiology,
  ...centralNervousSystem,
  ...endocrinology,
  ...gastrointestinalPhysiology,
  ...renalPhysiology,
  ...reproductivePhysiology,
  ...specialSenses,
};

export function keyWordsFor(lessonId: string): readonly LessonTerm[] {
  return ALL[lessonId] ?? [];
}

export const KEY_WORD_LESSONS: readonly string[] = Object.keys(ALL);

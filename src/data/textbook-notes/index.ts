// Textbook notes (owner, 2026-10-29: "instead of just saying read more in a
// textbook, add a small extract that communicates what you want to teach").
// The books are copyrighted and the app is public, so these are NOT extracts:
// each is a short summary, in our own words, of what the section's own textbook
// pages (data/textbook-refs/) add to the slides — a clearer explanation, the
// "why", a link or a clinical point. Shown as "From the textbook (summarised)"
// with the pages, on the Read tab and HB2 lesson pages. Sections whose only
// textbook is Lehninger have none yet (its text was not available).
// tests/textbook-notes.test.mjs checks every note belongs to a section that has
// textbook pages.
import type { TextbookNotes } from '@/data/textbook-notes/types';
import { notes as aminoAcidMetabolism } from '@/data/textbook-notes/amino-acid-metabolism';
import { notes as bloodCoagulationAndFibrinolysis } from '@/data/textbook-notes/blood-coagulation-and-fibrinolysis';
import { notes as cardiovascularPhysiology } from '@/data/textbook-notes/cardiovascular-physiology';
import { notes as cardiovascularSystemGross } from '@/data/textbook-notes/cardiovascular-system-gross';
import { notes as centralNervousSystem } from '@/data/textbook-notes/central-nervous-system';
import { notes as collagenSynthesis } from '@/data/textbook-notes/collagen-synthesis';
import { notes as endocrinology } from '@/data/textbook-notes/endocrinology';
import { notes as freeRadicalsAndOxygenToxicity } from '@/data/textbook-notes/free-radicals-and-oxygen-toxicity';
import { notes as gastrointestinalPhysiology } from '@/data/textbook-notes/gastrointestinal-physiology';
import { notes as gastrointestinalSystemGross } from '@/data/textbook-notes/gastrointestinal-system-gross';
import { notes as headAndNeck } from '@/data/textbook-notes/head-and-neck';
import { notes as hormonesEndocrineBiochemistry } from '@/data/textbook-notes/hormones-endocrine-biochemistry';
import { notes as immunology } from '@/data/textbook-notes/immunology';
import { notes as neuroanatomy } from '@/data/textbook-notes/neuroanatomy';
import { notes as nucleicAcids } from '@/data/textbook-notes/nucleic-acids';
import { notes as oxygenCarriers } from '@/data/textbook-notes/oxygen-carriers';
import { notes as renalPhysiology } from '@/data/textbook-notes/renal-physiology';
import { notes as reproductivePhysiology } from '@/data/textbook-notes/reproductive-physiology';
import { notes as respiratoryPhysiology } from '@/data/textbook-notes/respiratory-physiology';
import { notes as respiratorySystemGross } from '@/data/textbook-notes/respiratory-system-gross';
import { notes as specialSenses } from '@/data/textbook-notes/special-senses';
import { notes as upperLimb } from '@/data/textbook-notes/upper-limb';
import { notes as urinarySystemGross } from '@/data/textbook-notes/urinary-system-gross';

const byTopic: Record<string, TextbookNotes> = {
  'amino-acid-metabolism': aminoAcidMetabolism,
  'blood-coagulation-and-fibrinolysis': bloodCoagulationAndFibrinolysis,
  'cardiovascular-physiology': cardiovascularPhysiology,
  'cardiovascular-system-gross': cardiovascularSystemGross,
  'central-nervous-system': centralNervousSystem,
  'collagen-synthesis': collagenSynthesis,
  'endocrinology': endocrinology,
  'free-radicals-and-oxygen-toxicity': freeRadicalsAndOxygenToxicity,
  'gastrointestinal-physiology': gastrointestinalPhysiology,
  'gastrointestinal-system-gross': gastrointestinalSystemGross,
  'head-and-neck': headAndNeck,
  'hormones-endocrine-biochemistry': hormonesEndocrineBiochemistry,
  'immunology': immunology,
  'neuroanatomy': neuroanatomy,
  'nucleic-acids': nucleicAcids,
  'oxygen-carriers': oxygenCarriers,
  'renal-physiology': renalPhysiology,
  'reproductive-physiology': reproductivePhysiology,
  'respiratory-physiology': respiratoryPhysiology,
  'respiratory-system-gross': respiratorySystemGross,
  'special-senses': specialSenses,
  'upper-limb': upperLimb,
  'urinary-system-gross': urinarySystemGross,
};

export const textbookNoteTopics = Object.keys(byTopic);

/** The note for one lesson section, if there is one. */
export function textbookNoteFor(topicId: string, lessonId: string, index: number): string | undefined {
  return byTopic[topicId]?.[lessonId]?.[index];
}

/** Every note of a topic (for checks). */
export const textbookNotesOf = (topicId: string): TextbookNotes => byTopic[topicId] ?? {};

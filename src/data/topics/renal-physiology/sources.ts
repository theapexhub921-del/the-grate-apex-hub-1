// Source references, concepts and discrepancies for Physiology → Renal Physiology.
//
// Lecture source: "Renal System" — one deck of 162 slides (RS in
// content-catalog.ts). The "ai guide" found with it is a study aid and is
// not used as a source of facts; a web link in the speaker notes of
// slide 1 is ignored. Slides that are only pictures are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'renal-physiology';

export const rs = (numbers: number[]): SourceReference[] => slides('renal-renal-system', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Organisation of the kidney
  'urinary-system': { lessonId: L(1), name: 'The urinary system and kidney functions', category: 'core', relevance: 'core', sourceRefs: rs([1, 2, 4]) },
  'kidney-structure': { lessonId: L(1), name: 'Gross structure of the kidney', category: 'core', relevance: 'core', sourceRefs: rs([5, 6, 7]) },
  'nephron-types': { lessonId: L(1), name: 'Cortical and juxtamedullary nephrons', category: 'core', relevance: 'core', sourceRefs: rs([9, 10]) },
  'nephron-vessels': { lessonId: L(1), name: 'Glomerulus, arterioles, peritubular capillaries and vasa recta', category: 'core', relevance: 'core', sourceRefs: rs([11, 12, 13, 14]) },
  'nephron-tubule': { lessonId: L(1), name: 'The parts of the renal tubule', category: 'core', relevance: 'core', sourceRefs: rs([15, 16, 17, 18]) },
  'jga': { lessonId: L(1), name: 'The juxtaglomerular apparatus', category: 'core', relevance: 'core', sourceRefs: rs([20, 21]) },

  // Lesson 2 — Glomerular filtration
  'filtration-barrier': { lessonId: L(2), name: 'The filtration barrier', category: 'core', relevance: 'core', sourceRefs: rs([23, 24]) },
  'nfp': { lessonId: L(2), name: 'Net filtration pressure', category: 'core', relevance: 'core', sourceRefs: rs([26, 27]) },
  'gfr': { lessonId: L(2), name: 'Glomerular filtration rate', category: 'core', relevance: 'core', sourceRefs: rs([28]) },
  'autoregulation': { lessonId: L(2), name: 'Autoregulation: myogenic and tubuloglomerular feedback', category: 'visual-process', relevance: 'core', sourceRefs: rs([29, 30, 31, 32, 33]) },
  'gfr-extrinsic': { lessonId: L(2), name: 'Neural and hormonal control of GFR', category: 'core', relevance: 'core', sourceRefs: rs([34, 35, 36, 37, 38]) },

  // Lesson 3 — Reabsorption and secretion
  'reabsorption-routes': { lessonId: L(3), name: 'Tubular reabsorption and its routes', category: 'core', relevance: 'core', sourceRefs: rs([41, 42, 44]) },
  'sodium-reabsorption': { lessonId: L(3), name: 'Sodium reabsorption', category: 'core', relevance: 'core', sourceRefs: rs([44, 45]) },
  'tm': { lessonId: L(3), name: 'Secondary active transport and the tubular maximum', category: 'core', relevance: 'core', sourceRefs: rs([46, 47]) },
  'passive-reabsorption': { lessonId: L(3), name: 'Water, chloride and urea', category: 'core', relevance: 'core', sourceRefs: rs([47, 48, 49]) },
  'regional-reabsorption': { lessonId: L(3), name: 'What each part of the tubule reabsorbs', category: 'core', relevance: 'core', sourceRefs: rs([51, 52, 53, 55]) },
  'secretion': { lessonId: L(3), name: 'Tubular secretion of H⁺ and K⁺', category: 'core', relevance: 'core', sourceRefs: rs([58, 59, 60, 61, 62]) },

  // Lesson 4 — Concentrating urine
  'countercurrent-multiplier': { lessonId: L(4), name: 'The countercurrent multiplier', category: 'visual-process', relevance: 'core', sourceRefs: rs([64, 65, 66, 67, 68]) },
  'countercurrent-exchanger': { lessonId: L(4), name: 'The countercurrent exchanger (vasa recta)', category: 'core', relevance: 'core', sourceRefs: rs([72, 73, 74]) },
  'adh-kidney': { lessonId: L(4), name: 'ADH and water reabsorption', category: 'core', relevance: 'core', sourceRefs: rs([78, 79]) },
  'diuretics': { lessonId: L(4), name: 'Diuretics', category: 'clinical', relevance: 'core', sourceRefs: rs([81, 82]) },

  // Lesson 5 — Clearance and urine
  'clearance': { lessonId: L(5), name: 'Renal clearance', category: 'core', relevance: 'core', sourceRefs: rs([83, 84]) },
  'gfr-measurement': { lessonId: L(5), name: 'Measuring GFR: inulin and creatinine', category: 'core', relevance: 'core', sourceRefs: rs([85, 86, 87]) },
  'rpf': { lessonId: L(5), name: 'Renal plasma and blood flow: PAH', category: 'core', relevance: 'core', sourceRefs: rs([88, 89]) },
  'urine': { lessonId: L(5), name: 'Physical and chemical characteristics of urine', category: 'core', relevance: 'core', sourceRefs: rs([90, 91, 93, 94, 95, 96, 97]) },

  // Lesson 6 — Micturition
  'bladder': { lessonId: L(6), name: 'The bladder and its sphincters', category: 'core', relevance: 'core', sourceRefs: rs([98, 99, 100]) },
  'bladder-nerves': { lessonId: L(6), name: 'Innervation of the bladder', category: 'core', relevance: 'core', sourceRefs: rs([103, 104, 105]) },
  'storage-reflex': { lessonId: L(6), name: 'Storage reflexes', category: 'core', relevance: 'core', sourceRefs: rs([107, 108, 109]) },
  'voiding-reflex': { lessonId: L(6), name: 'Voiding: reflex and voluntary control', category: 'visual-process', relevance: 'core', sourceRefs: rs([110, 111, 112, 113, 114]) },

  // Lesson 7 — Acid–base balance
  'acid-base-basics': { lessonId: L(7), name: 'pH, acids and the three lines of defence', category: 'core', relevance: 'core', sourceRefs: rs([118, 119, 120]) },
  'buffers': { lessonId: L(7), name: 'Bicarbonate, phosphate and protein buffers', category: 'core', relevance: 'core', sourceRefs: rs([121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131]) },
  'respiratory-regulation': { lessonId: L(7), name: 'Respiratory regulation of H⁺', category: 'core', relevance: 'core', sourceRefs: rs([132, 133, 134, 135, 136]) },
  'renal-acid-base': { lessonId: L(7), name: 'Renal handling of bicarbonate and H⁺', category: 'visual-process', relevance: 'core', sourceRefs: rs([137, 138, 139, 140, 142, 143, 144, 146, 148, 150]) },
  'acid-base-disorders': { lessonId: L(7), name: 'Acidosis, alkalosis and compensation', category: 'clinical', relevance: 'core', sourceRefs: rs([152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

// Reference textbook (clarification only).
const GUYTON: SourceReference[] = [{ sourceId: 'guyton-hall-14e' }];

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'renal-pyramid-number',
    concept: 'Number of renal pyramids',
    status: 'unresolved',
    statements: [
      { text: 'Slide 6: the medulla is “made up of seven cone-shaped medullary or renal pyramids”.', sourceRefs: rs([6]) },
      { text: 'Guyton: the medulla is divided into 8 to 10 cone-shaped renal pyramids.', sourceRefs: GUYTON },
    ],
    note: 'Not quizzed (question q1-05 retired).',
  },
  {
    id: 'nephron-number',
    concept: 'Number of nephrons in each kidney',
    status: 'unresolved',
    statements: [
      { text: 'Slide 9: each kidney contains about 1.25 million nephrons.', sourceRefs: rs([9]) },
      { text: 'Guyton: each kidney contains about 800,000 to 1,000,000 nephrons.', sourceRefs: GUYTON },
    ],
    note: 'Not quizzed (question q1-06 retired).',
  },
  {
    id: 'ph-range',
    concept: 'Normal arterial pH',
    status: 'unresolved',
    statements: [
      { text: 'Slide 119: physiological pH range 7.36–7.44; above 7.44 alkalosis, below 7.36 acidosis.', sourceRefs: rs([119]) },
      { text: 'Slides 154–157: acidosis is a pH below 7.35 and alkalosis a pH above 7.45.', sourceRefs: rs([154, 155, 156, 157]) },
    ],
    note: 'Both cut-offs appear in the lecture. The quiz asks only that acidosis is below and alkalosis above the normal range.',
  },
  {
    id: 'pah-extraction',
    concept: 'How much PAH the kidney removes',
    status: 'unresolved',
    statements: [
      { text: 'Slide 88: PAH is 20% filtered and 80% secreted, “almost 100% excretion”.', sourceRefs: rs([88]) },
      { text: 'Same slide: “about 90% of PAH is excreted”, so RPF = V × U_PAH / (0.9 × P_PAH).', sourceRefs: rs([88, 89]) },
    ],
    note: 'The formula uses 90%. The exact extraction figure is not quizzed.',
  },
];

// Source references, concepts and discrepancies for Biochemistry → Free
// Radicals and Oxygen Toxicity.
//
// Lecture sources (content-catalog.ts), both titled "Free Radicals and
// Oxygen Toxicity":
//   HB = the Human Biology 2021 deck — 72 slides (the fuller version)
//   FY = Prof Fay's deck — 33 slides (largely the same material)
// The antioxidant handout and "presentation group 4" are study aids, not
// sources of facts. Speaker notes added to the decks are annotations and
// are not quizzed. Picture-only slides are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'free-radicals-and-oxygen-toxicity';

export const hb = (numbers: number[]): SourceReference[] => slides('frox-free-radical-human-biology-2021-autosaved', numbers);
export const fy = (numbers: number[]): SourceReference[] => slides('frox-free-radical-and-oxygen-toxicity-prof-fay', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — What free radicals are and where they come from
  'free-radical-definition': { lessonId: L(1), name: 'Free radicals and their behaviour', category: 'core', relevance: 'core', sourceRefs: [...hb([5, 8]), ...fy([7])] },
  'ros-terms': { lessonId: L(1), name: 'Oxygen toxicity, ROS and oxidative stress', category: 'core', relevance: 'core', sourceRefs: [...hb([6, 11, 12]), ...fy([4])] },
  'radical-sources': { lessonId: L(1), name: 'Internal and external sources', category: 'core', relevance: 'core', sourceRefs: [...hb([7, 9, 14, 16]), ...fy([5, 6, 8])] },
  'ischaemia-reperfusion': { lessonId: L(1), name: 'Ischaemia–reperfusion and the respiratory burst', category: 'core', relevance: 'core', sourceRefs: hb([10, 16]) },

  // Lesson 2 — Reactions and the major ROS
  'radical-reactions': { lessonId: L(2), name: 'Radical–radical and radical–non-radical reactions', category: 'core', relevance: 'core', sourceRefs: [...hb([15, 21]), ...fy([9, 10])] },
  'major-ros': { lessonId: L(2), name: 'Superoxide, hydrogen peroxide, singlet oxygen and hydroxyl radical', category: 'core', relevance: 'core', sourceRefs: hb([34, 35, 36]) },
  'fenton-haber-weiss': { lessonId: L(2), name: 'Fenton and Haber–Weiss reactions; reduction of oxygen', category: 'visual-process', relevance: 'core', sourceRefs: hb([37, 69]) },

  // Lesson 3 — How free radicals damage cells
  'toxicity-mechanisms': { lessonId: L(3), name: 'Mechanisms of free radical toxicity', category: 'core', relevance: 'core', sourceRefs: [...hb([13, 17, 18, 19]), ...fy([11])] },
  'lipid-peroxidation': { lessonId: L(3), name: 'Lipid peroxidation', category: 'visual-process', relevance: 'core', sourceRefs: [...hb([22, 23, 24, 25, 29]), ...fy([12, 13])] },
  'dna-damage': { lessonId: L(3), name: 'Oxidative DNA damage', category: 'core', relevance: 'core', sourceRefs: [...hb([26, 27]), ...fy([14, 15])] },
  'oxidised-ldl': { lessonId: L(3), name: 'Why oxidised LDL is atherogenic', category: 'clinical', relevance: 'core', sourceRefs: hb([32, 33]) },

  // Lesson 4 — Antioxidants
  'antioxidant-action': { lessonId: L(4), name: 'Antioxidants and how they act', category: 'core', relevance: 'core', sourceRefs: hb([38, 39, 43, 47, 50]) },
  'antioxidant-enzymes': { lessonId: L(4), name: 'SOD, catalase and glutathione peroxidase', category: 'core', relevance: 'core', sourceRefs: [...hb([40, 48]), ...fy([24, 25])] },
  'antioxidant-vitamins': { lessonId: L(4), name: 'Antioxidant vitamins and other antioxidants', category: 'core', relevance: 'core', sourceRefs: hb([41, 44, 45]) },
  'antioxidant-sources': { lessonId: L(4), name: 'Food sources and location of antioxidants', category: 'supporting', relevance: 'supporting', sourceRefs: [...hb([42, 47, 49]), ...fy([27])] },

  // Lesson 5 — ROS in disease
  'ros-disease': { lessonId: L(5), name: 'Oxidative stress, ageing and disease', category: 'clinical', relevance: 'core', sourceRefs: [...hb([31, 52, 53]), ...fy([18, 19])] },
  'ros-cancer': { lessonId: L(5), name: 'Free radicals and antioxidants in carcinogenesis', category: 'clinical', relevance: 'core', sourceRefs: hb([58, 59, 61, 62, 63]) },
  'ros-hiv-pregnancy': { lessonId: L(5), name: 'HIV, pregnancy, diabetic embryopathy and Down syndrome', category: 'clinical', relevance: 'core', sourceRefs: [...hb([51, 54, 55, 56, 57, 58]), ...fy([20, 21, 22])] },
  'ros-transplant': { lessonId: L(5), name: 'Transplantation and measuring oxidative stress', category: 'clinical', relevance: 'core', sourceRefs: [...hb([64, 65, 66, 67]), ...fy([23, 26])] },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'sod-reaction',
    concept: 'Products of superoxide dismutation',
    status: 'unresolved',
    statements: [
      { text: 'HB slide 15 and FY slide 9 write 2O₂·⁻ + 2H⁺ → H₂O₂ + O₂⁻.', sourceRefs: [...hb([15]), ...fy([9])] },
      { text: 'HB slide 35 writes 2O₂·⁻ + 2H⁺ → H₂O₂ + O₂.', sourceRefs: hb([35]) },
    ],
    note: 'The lesson uses the slide-35 form (oxygen as the second product); the charge on O₂ is not quizzed.',
  },
  {
    id: 'nitric-oxide-radical',
    concept: 'Whether nitric oxide is a free radical',
    status: 'unresolved',
    statements: [
      { text: 'HB slide 6: NO is given as an example of a non-radical ROS, with H₂O₂ and HOCl.', sourceRefs: hb([6]) },
      { text: 'HB slide 34 lists NO· (with the radical dot) among biologically significant free radicals.', sourceRefs: hb([34]) },
    ],
    note: 'Whether NO is a radical is not quizzed.',
  },
];

// Source references, concepts and discrepancies for
// Anatomy → Neuroanatomy (gross anatomy, HB2).
//
// Lecture sources (define WHAT is taught; see content-catalog.ts):
//   CNS = "Central Nervous System" — PPTX, 92 slides
//   MEN = "Meninges of the CNS" — PPTM, 70 slides
// The "Neuroscience Slides for Steeplechase" picture deck is a study aid
// only and is not used.
//
// Reference (clarification only): Gray's Anatomy for Students (4th ed.), via GRAYS.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'neuroanatomy';

export const cns = (numbers: number[]): SourceReference[] => slides('anat-cns', numbers);
export const men = (numbers: number[]): SourceReference[] => slides('anat-meninges', numbers);
export const GRAYS: SourceReference[] = [{ sourceId: 'grays-anatomy-students-4e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — The Nervous System and the Cerebral Hemispheres
  'ns-divisions': { lessonId: L(1), name: 'Functions and structural and functional divisions of the nervous system', category: 'core', relevance: 'core', sourceRefs: men([2, 3, 4, 7]) },
  'brain-parts': { lessonId: L(1), name: 'General plan of the CNS: forebrain, midbrain and hindbrain', category: 'core', relevance: 'core', sourceRefs: cns([3, 4, 5]) },
  'lobes-sulci': { lessonId: L(1), name: 'Lobes and main sulci of the cerebral hemisphere', category: 'core', relevance: 'core', sourceRefs: cns([7, 9, 11]) },
  'gyri-surfaces': { lessonId: L(1), name: 'Gyri and sulci of the superolateral, medial and inferior surfaces', category: 'core', relevance: 'core', sourceRefs: cns([10, 12, 14, 15, 16, 18]) },

  // Lesson 2 — Cortical Areas and White Matter
  'cortical-areas': { lessonId: L(2), name: 'Functional cortical areas and Brodmann numbers', category: 'core', relevance: 'core', sourceRefs: cns([20, 22, 23, 24, 25, 26]) },
  'cortical-lesions': { lessonId: L(2), name: 'Effects of lesions of the cerebral cortex', category: 'clinical', relevance: 'core', sourceRefs: cns([27, 28, 29]) },
  'white-matter': { lessonId: L(2), name: 'White matter: commissural, association and projection fibres', category: 'core', relevance: 'core', sourceRefs: cns([30, 92]) },

  // Lesson 3 — The Thalamus and Diencephalon
  'diencephalon-parts': { lessonId: L(3), name: 'Parts and relations of the diencephalon', category: 'core', relevance: 'core', sourceRefs: cns([31, 33]) },
  'thalamus': { lessonId: L(3), name: 'The thalamus: position, surfaces, nuclei and functions', category: 'core', relevance: 'core', sourceRefs: cns([34, 36, 37, 38, 42, 46]) },
  'thalamic-lesions': { lessonId: L(3), name: 'Thalamic lesions and the thalamic hand', category: 'clinical', relevance: 'core', sourceRefs: cns([47, 48, 49]) },
  'epithalamus-metathalamus': { lessonId: L(3), name: 'Epithalamus (pineal gland) and metathalamus (geniculate bodies)', category: 'core', relevance: 'core', sourceRefs: cns([50, 72, 73]) },

  // Lesson 4 — Hypothalamus and Pituitary
  'hypothalamus-structure': { lessonId: L(4), name: 'Boundaries, functions and nuclei of the hypothalamus', category: 'core', relevance: 'core', sourceRefs: cns([51, 52, 54, 58, 59]) },
  'hypothalamic-functions': { lessonId: L(4), name: 'Functional regions of the hypothalamus and hypothalamic lesions', category: 'core', relevance: 'core', sourceRefs: cns([65, 66, 67]) },
  'pituitary': { lessonId: L(4), name: 'The pituitary gland and its connections with the hypothalamus', category: 'core', relevance: 'core', sourceRefs: cns([68, 69, 70]) },

  // Lesson 5 — Basal Nuclei and Blood Supply of the Brain
  'basal-nuclei': { lessonId: L(5), name: 'The basal nuclei: parts, caudate nucleus and functions', category: 'core', relevance: 'core', sourceRefs: cns([74, 75, 79, 80, 81]) },
  'brain-arteries': { lessonId: L(5), name: 'Internal carotid and vertebrobasilar arteries and the circle of Willis', category: 'core', relevance: 'core', sourceRefs: cns([82, 86, 87, 88]) },
  'vascular-lesions': { lessonId: L(5), name: 'Cerebral blood flow and vascular lesions', category: 'clinical', relevance: 'core', sourceRefs: cns([90, 91]) },

  // Lesson 6 — The Dura Mater
  'meninges-overview': { lessonId: L(6), name: 'The three meninges and the two layers of the dura mater', category: 'core', relevance: 'core', sourceRefs: men([12, 14, 15, 17]) },
  'dural-folds': { lessonId: L(6), name: 'Dural folds: falx cerebri, tentorium cerebelli, falx cerebelli, diaphragma sellae', category: 'core', relevance: 'core', sourceRefs: men([17, 19, 20, 25, 26, 28, 29]) },
  'dura-supply': { lessonId: L(6), name: 'Nerve and arterial supply of the dura', category: 'core', relevance: 'core', sourceRefs: men([32, 33]) },

  // Lesson 7 — Dural Venous Sinuses
  'venous-sinuses': { lessonId: L(7), name: 'Features of the dural venous sinuses and the sagittal, straight, transverse, sigmoid and occipital sinuses', category: 'core', relevance: 'core', sourceRefs: men([35, 36, 38, 40, 42, 44, 45]) },
  'cavernous-sinus': { lessonId: L(7), name: 'The cavernous sinus: relations, contents, tributaries and drainage', category: 'core', relevance: 'core', sourceRefs: men([46, 47, 48, 51, 52]) },

  // Lesson 8 — Arachnoid, Pia, Spaces and Haemorrhage
  'arachnoid-pia': { lessonId: L(8), name: 'Arachnoid mater, arachnoid granulations and pia mater', category: 'core', relevance: 'core', sourceRefs: men([54, 55]) },
  'meningeal-spaces-cisterns': { lessonId: L(8), name: 'Meningeal spaces and the subarachnoid cisterns', category: 'core', relevance: 'core', sourceRefs: men([56, 57, 59, 62, 63, 64, 65]) },
  'intracranial-haemorrhage': { lessonId: L(8), name: 'Epidural and subdural haematomas and meningitis', category: 'clinical', relevance: 'core', sourceRefs: men([10, 11, 67, 70]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'adh-nucleus',
    concept: 'Which hypothalamic nucleus makes ADH',
    status: 'resolved',
    statements: [
      { text: 'CNS, slide 66: “paraventricular nucleus synthesizes ADH”.', sourceRefs: cns([66]) },
      { text: 'CNS, slide 70: neurons of the supraoptic and paraventricular nuclei release ADH and oxytocin into the posterior pituitary.', sourceRefs: cns([70]) },
      { text: 'Gray’s: both nuclei make both hormones; the supraoptic nucleus mainly ADH, the paraventricular mainly oxytocin.', sourceRefs: GRAYS },
    ],
    resolution: { text: 'Both nuclei produce ADH; questions use the slide 70 wording (supraoptic and paraventricular).', sourceRefs: [...cns([66, 70]), ...GRAYS] },
  },
  {
    id: 'wernicke-label',
    concept: 'Name of Wernicke’s area',
    status: 'resolved',
    statements: [
      { text: 'CNS, slide 25: the sensory speech area of Wernicke.', sourceRefs: cns([25]) },
      { text: 'CNS, slide 27: “Motor speech area of Wernicke – receptive aphasia”.', sourceRefs: cns([27]) },
    ],
    resolution: { text: 'Wernicke’s area is the sensory (receptive) speech area; slide 27’s “motor” is a slip — the lesion it describes, receptive aphasia, fits a sensory area.', sourceRefs: [...cns([25, 27]), ...GRAYS] },
  },
  {
    id: 'falx-cerebelli-position',
    concept: 'Position of the falx cerebelli',
    status: 'resolved',
    statements: [
      { text: 'Meninges, slide 28: the falx cerebelli lies “between the two hemispheres of the cerebrum”.', sourceRefs: men([28]) },
      { text: 'Gray’s: the falx cerebelli lies below the tentorium between the two cerebellar hemispheres.', sourceRefs: GRAYS },
    ],
    resolution: { text: 'The same slide places it below the tentorium on the internal occipital crest, so “cerebrum” is a slip for cerebellum.', sourceRefs: [...men([28]), ...GRAYS] },
  },
];

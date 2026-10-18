// Source references, concepts and discrepancies for
// Anatomy → Respiratory System (gross anatomy, HB2).
//
// Lecture source (defines WHAT is taught; see content-catalog.ts):
//   RS = "Respiratory System 2026 (v2)" — PPTX, 287 slides
//
// Reference (clarification only): Gray's Anatomy for Students (4th ed.), via GRAYS.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'respiratory-system-gross';

const RS = 'anat-respiratory-gross';
export const rs = (numbers: number[]): SourceReference[] => slides(RS, numbers);
export const GRAYS: SourceReference[] = [{ sourceId: 'grays-anatomy-students-4e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Upper Airway: Nasal Cavity and Pharynx
  'rs-components': { lessonId: L(1), name: 'Components and divisions of the respiratory system', category: 'core', relevance: 'core', sourceRefs: rs([16, 17]) },
  'nasal-cavity-resp': { lessonId: L(1), name: 'Nose and nasal cavity: openings, vestibule and septum', category: 'core', relevance: 'core', sourceRefs: rs([19, 24, 26]) },
  'pharynx-parts': { lessonId: L(1), name: 'Pharynx: extent, muscular wall and three parts', category: 'core', relevance: 'core', sourceRefs: rs([30, 32, 37, 40, 42]) },
  'waldeyer-ring': { lessonId: L(1), name: 'Waldeyer’s tonsillar ring', category: 'core', relevance: 'core', sourceRefs: rs([44]) },

  // Lesson 2 — The Larynx
  'larynx-position': { lessonId: L(2), name: 'Position, vertebral level and age/sex changes of the larynx', category: 'core', relevance: 'core', sourceRefs: rs([46, 57, 59]) },
  'larynx-cartilages-resp': { lessonId: L(2), name: 'The nine laryngeal cartilages', category: 'core', relevance: 'core', sourceRefs: rs([62]) },
  'larynx-membranes': { lessonId: L(2), name: 'Intrinsic and extrinsic ligaments and membranes of the larynx', category: 'core', relevance: 'core', sourceRefs: rs([65]) },
  'laryngeal-aditus': { lessonId: L(2), name: 'Boundaries of the laryngeal aditus (inlet)', category: 'visual-process', relevance: 'core', sourceRefs: rs([86]) },

  // Lesson 3 — The Trachea
  'trachea-extent': { lessonId: L(3), name: 'Extent, size and structure of the trachea', category: 'core', relevance: 'core', sourceRefs: rs([98]) },
  'trachea-neck-relations': { lessonId: L(3), name: 'Relations of the trachea in the neck', category: 'core', relevance: 'core', sourceRefs: rs([101, 102]) },
  'trachea-thorax-relations': { lessonId: L(3), name: 'Relations of the trachea in the thorax', category: 'core', relevance: 'core', sourceRefs: rs([104, 105]) },
  'trachea-supply': { lessonId: L(3), name: 'Blood, lymph and nerve supply of the trachea', category: 'core', relevance: 'core', sourceRefs: rs([106, 109, 111]) },

  // Lesson 4 — The Thoracic Wall
  'thorax-components': { lessonId: L(4), name: 'Components of the thorax and the thoracic wall', category: 'core', relevance: 'core', sourceRefs: rs([117, 118, 132, 135]) },
  'thoracic-muscles': { lessonId: L(4), name: 'Extrinsic and intercostal muscles and the serratus posterior muscles', category: 'core', relevance: 'core', sourceRefs: rs([136, 144, 148, 150, 151, 153, 155, 159]) },
  'thoracic-apertures': { lessonId: L(4), name: 'Thoracic inlet and outlet', category: 'core', relevance: 'core', sourceRefs: rs([131, 167, 172, 173]) },
  'intercostal-space-joints': { lessonId: L(4), name: 'Intercostal spaces, the neurovascular plane and joints of the thoracic wall', category: 'clinical', relevance: 'core', sourceRefs: rs([199, 200, 203]) },

  // Lesson 5 — The Diaphragm
  'diaphragm-parts': { lessonId: L(5), name: 'Muscular parts, arcuate ligaments and central tendon of the diaphragm', category: 'core', relevance: 'core', sourceRefs: rs([175, 177, 180, 182]) },
  'diaphragm-openings': { lessonId: L(5), name: 'Openings of the diaphragm and what they transmit', category: 'core', relevance: 'core', sourceRefs: rs([183, 186]) },
  'diaphragm-supply': { lessonId: L(5), name: 'Nerve and blood supply of the diaphragm', category: 'core', relevance: 'core', sourceRefs: rs([188, 190]) },
  'diaphragm-development-clinical': { lessonId: L(5), name: 'Development of the diaphragm, hernias and clinical notes', category: 'clinical', relevance: 'core', sourceRefs: rs([195, 197, 198]) },

  // Lesson 6 — The Pleura
  'pleura-layers': { lessonId: L(6), name: 'Thoracic cavity compartments and the layers of the pleura', category: 'core', relevance: 'core', sourceRefs: rs([230, 231, 232, 233, 236]) },
  'pleural-reflections': { lessonId: L(6), name: 'Surface markings of the pleural reflections', category: 'clinical', relevance: 'core', sourceRefs: rs([240, 242, 245, 246]) },
  'pleural-recesses-lines': { lessonId: L(6), name: 'Costodiaphragmatic recess and lines of pleural reflection', category: 'core', relevance: 'core', sourceRefs: rs([247, 248, 250]) },
  'pleura-clinical': { lessonId: L(6), name: 'Clinical notes on the pleura', category: 'clinical', relevance: 'supporting', sourceRefs: rs([252]) },

  // Lesson 7 — The Lungs and Bronchial Tree
  'lung-features': { lessonId: L(7), name: 'General features, surfaces and borders of the lungs', category: 'core', relevance: 'core', sourceRefs: rs([257, 258, 260, 263]) },
  'lung-roots-fissures': { lessonId: L(7), name: 'Roots, fissures and lobes of the lungs', category: 'core', relevance: 'core', sourceRefs: rs([268, 271, 273]) },
  'main-bronchi': { lessonId: L(7), name: 'Right and left main bronchi', category: 'core', relevance: 'core', sourceRefs: rs([207, 211, 212]) },
  'bronchopulmonary-segments': { lessonId: L(7), name: 'Segmental bronchi and bronchopulmonary segments', category: 'core', relevance: 'core', sourceRefs: rs([224, 278]) },
  'lung-supply': { lessonId: L(7), name: 'Blood, lymph and nerve supply of the lungs', category: 'core', relevance: 'core', sourceRefs: rs([214, 216, 220, 221, 227, 229]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'phrenic-right-crus',
    concept: 'Nerve supply of the right crus fibres around the oesophagus',
    status: 'unresolved',
    statements: [
      { text: 'Slide 188: “the right crus that loop around the oesophagus is supply by left phrenic nerve”.', sourceRefs: rs([188]) },
      { text: 'Gray’s: each half of the diaphragm, including its crus, is supplied by the phrenic nerve of its own side; the fibres of the right crus that pass to the left of the oesophageal hiatus may receive left phrenic fibres.', sourceRefs: GRAYS },
    ],
    note: 'Not quizzed. Ask your lecturer how this point is examined.',
  },
];

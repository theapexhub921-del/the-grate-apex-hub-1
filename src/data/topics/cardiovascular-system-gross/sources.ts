// Source references, concepts and discrepancies for
// Anatomy → Cardiovascular System (gross anatomy, HB2).
//
// Lecture sources (define WHAT is taught; see content-catalog.ts):
//   CVS1 = "Cardiovascular System Gross 1" — PPTX, 195 slides (mediastinum,
//          pericardium, heart, conduction, coronary circulation)
//   CVS2 = "Cardiovascular System Gross 2" — PPT, 76 slides (vascular
//          system, great vessels, arteries of the trunk)
//
// Reference (clarification only): Gray's Anatomy for Students (4th ed.), via GRAYS.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'cardiovascular-system-gross';

const CVS1 = 'anat-cvs-gross-1';
const CVS2 = 'cardiovascular-gross-slides';

export const c1 = (numbers: number[]): SourceReference[] => slides(CVS1, numbers);
export const c2 = (numbers: number[]): SourceReference[] => slides(CVS2, numbers);
export const GRAYS: SourceReference[] = [{ sourceId: 'grays-anatomy-students-4e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — The Mediastinum
  'cvs-overview': { lessonId: L(1), name: 'Functions and components of the cardiovascular and circulatory systems', category: 'core', relevance: 'core', sourceRefs: c1([5, 6, 7, 9]) },
  'mediastinum-divisions': { lessonId: L(1), name: 'Definition, extent and subdivisions of the mediastinum', category: 'core', relevance: 'core', sourceRefs: c1([15, 19, 22, 43]) },
  'superior-mediastinum': { lessonId: L(1), name: 'Contents of the superior mediastinum', category: 'core', relevance: 'core', sourceRefs: c1([25, 27]) },
  'inferior-mediastinum-contents': { lessonId: L(1), name: 'Boundaries and contents of the anterior, middle and posterior mediastinum', category: 'core', relevance: 'core', sourceRefs: c1([32, 34, 36, 38]) },

  // Lesson 2 — The Pericardium
  'pericardium-layers': { lessonId: L(2), name: 'Fibrous and serous pericardium', category: 'core', relevance: 'core', sourceRefs: c1([46, 47, 49, 58, 59]) },
  'pericardial-relations': { lessonId: L(2), name: 'Position and relations of the pericardial sac', category: 'core', relevance: 'core', sourceRefs: c1([49, 51, 52, 53]) },
  'pericardial-sinuses': { lessonId: L(2), name: 'Oblique and transverse pericardial sinuses', category: 'visual-process', relevance: 'core', sourceRefs: c1([60, 61, 62]) },
  'pericardium-supply-clinical': { lessonId: L(2), name: 'Blood and nerve supply of the pericardium and its clinical conditions', category: 'clinical', relevance: 'core', sourceRefs: c1([63, 64, 67, 69]) },

  // Lesson 3 — External Features of the Heart
  'heart-size-position': { lessonId: L(3), name: 'Shape, size, weight and position of the heart', category: 'core', relevance: 'core', sourceRefs: c1([72, 74, 75, 76]) },
  'heart-borders-surfaces': { lessonId: L(3), name: 'Borders and surfaces of the heart and the chambers that form them', category: 'core', relevance: 'core', sourceRefs: c1([77, 78, 79, 80, 81, 82, 83, 84, 86]) },
  'heart-surface-marking': { lessonId: L(3), name: 'Surface marking of the heart and the apex beat', category: 'clinical', relevance: 'core', sourceRefs: c1([87, 88, 89, 108]) },
  'cardiac-wall-grooves': { lessonId: L(3), name: 'Layers of the cardiac wall, chambers, septa and surface grooves', category: 'core', relevance: 'core', sourceRefs: c1([90, 91, 92, 93, 98, 101, 102, 104, 106]) },

  // Lesson 4 — Chambers, Valves and the Cardiac Skeleton
  'right-atrium': { lessonId: L(4), name: 'Interior of the right atrium', category: 'core', relevance: 'core', sourceRefs: c1([111, 112, 115, 116]) },
  'right-ventricle': { lessonId: L(4), name: 'Right ventricle, conus arteriosus and trabeculae carneae', category: 'core', relevance: 'core', sourceRefs: c1([117, 118, 121, 123, 124, 125]) },
  'left-heart-chambers': { lessonId: L(4), name: 'Left atrium and left ventricle', category: 'core', relevance: 'core', sourceRefs: c1([128, 130, 131, 132, 134, 136, 137]) },
  'cardiac-skeleton': { lessonId: L(4), name: 'Fibrous rings and the cardiac skeleton', category: 'core', relevance: 'core', sourceRefs: c1([140, 142, 143]) },
  'valves-auscultation': { lessonId: L(4), name: 'Surface marking of the valves, heart sounds and auscultation areas', category: 'clinical', relevance: 'core', sourceRefs: c1([147, 148, 149, 150, 151]) },

  // Lesson 5 — Conduction System and Coronary Circulation
  'conduction-system': { lessonId: L(5), name: 'The cardiac conduction system', category: 'core', relevance: 'core', sourceRefs: c1([152, 153, 154, 155]) },
  'right-coronary': { lessonId: L(5), name: 'Right coronary artery and its branches', category: 'core', relevance: 'core', sourceRefs: c1([158, 161]) },
  'left-coronary': { lessonId: L(5), name: 'Left coronary artery, its branches and dominance', category: 'core', relevance: 'core', sourceRefs: c1([168]) },
  'cardiac-veins': { lessonId: L(5), name: 'Venous drainage of the heart', category: 'core', relevance: 'core', sourceRefs: c1([174, 178]) },
  'heart-clinical': { lessonId: L(5), name: 'Clinical notes: infarction, angina, valve dysfunction and hypertrophy', category: 'clinical', relevance: 'supporting', sourceRefs: c1([183, 184, 185, 186, 188, 189]) },

  // Lesson 6 — Blood Vessels: Structure and Types
  'vascular-organization': { lessonId: L(6), name: 'Circulatory systems and the organisation of the vascular tree', category: 'core', relevance: 'core', sourceRefs: c2([3, 4]) },
  'vessel-wall-arteries': { lessonId: L(6), name: 'Tunics of the vessel wall, elastic and muscular arteries, anastomoses', category: 'core', relevance: 'core', sourceRefs: c2([5, 6, 7]) },
  'capillaries': { lessonId: L(6), name: 'Capillaries: structure, pre-capillary sphincters and the three types', category: 'core', relevance: 'core', sourceRefs: c2([12, 13, 15, 16, 17]) },
  'veins': { lessonId: L(6), name: 'Veins: wall, valves and venae comitantes', category: 'core', relevance: 'core', sourceRefs: c2([18, 19, 23]) },

  // Lesson 7 — Great Vessels and Arteries of the Trunk
  'ascending-aorta-arch': { lessonId: L(7), name: 'Parts of the aorta, ascending aorta and arch of the aorta', category: 'core', relevance: 'core', sourceRefs: c2([27, 28, 30, 32]) },
  'pulmonary-trunk': { lessonId: L(7), name: 'Pulmonary trunk, pulmonary arteries and catheterisation', category: 'core', relevance: 'core', sourceRefs: c2([36, 40]) },
  'thoracic-aorta': { lessonId: L(7), name: 'Descending thoracic aorta and its branches', category: 'core', relevance: 'core', sourceRefs: c2([45, 46, 47, 49]) },
  'abdominal-aorta': { lessonId: L(7), name: 'Abdominal aorta: extent, ventral and lateral branches', category: 'core', relevance: 'core', sourceRefs: c2([51, 52, 53, 54]) },
  'mesenteric-arteries': { lessonId: L(7), name: 'Superior and inferior mesenteric arteries', category: 'core', relevance: 'core', sourceRefs: c2([58, 61, 62, 65]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'apex-position',
    concept: 'Position of the apex of the heart',
    status: 'unresolved',
    statements: [
      { text: 'Gross 1, slide 87: the inferior border runs to the apex “at lt. 5th ICS-MCL”.', sourceRefs: c1([87]) },
      { text: 'Gross 1, slide 108: the apex lies behind the 5th left intercostal space, 8 to 9 cm from the mid-sternal line, “or about 4 cm lateral to mid-clavicular line”.', sourceRefs: c1([108]) },
      { text: 'Gray’s: the apex beat is in the left 5th intercostal space, about 9 cm from the midline, at or just medial to the midclavicular line.', sourceRefs: GRAYS },
    ],
    note: 'Both slides agree on the 5th left intercostal space, 8–9 cm from the midline. Check the “4 cm lateral to the midclavicular line” wording with your lecturer.',
  },
  {
    id: 'tricuspid-area',
    concept: 'Tricuspid auscultation area',
    status: 'unresolved',
    statements: [
      { text: 'Gross 1, slide 149: tricuspid area — 5th right intercostal space.', sourceRefs: c1([149]) },
      { text: 'Gray’s and most clinical texts: the tricuspid area is at the lower left sternal border (4th–5th intercostal space).', sourceRefs: GRAYS },
    ],
    note: 'Not used in quiz questions until confirmed with the lecturer.',
  },
];

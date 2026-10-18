// Source references, concepts and discrepancies for
// Anatomy → Gastrointestinal System (gross anatomy of the abdomen, HB2).
//
// Lecture sources (define WHAT is taught; see content-catalog.ts):
//   AW = "Anterior and Posterior Abdominal Walls 2026" — PPTX, 116 slides
//   GI = "GI Tract & Accessory Organs 2026" — PPT, 85 slides
//   NV = "Neurovasculature of the GI Tract 2026" — PPT, 50 slides
//
// Reference (clarification only): Gray's Anatomy for Students (4th ed.), via GRAYS.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'gastrointestinal-system-gross';

export const aw = (numbers: number[]): SourceReference[] => slides('anat-abdominal-walls', numbers);
export const gi = (numbers: number[]): SourceReference[] => slides('anat-gi-tract-organs', numbers);
export const nv = (numbers: number[]): SourceReference[] => slides('anat-gi-neurovasculature', numbers);
export const GRAYS: SourceReference[] = [{ sourceId: 'grays-anatomy-students-4e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — The Abdomen and the Anterolateral Wall
  'abdomen-regions': { lessonId: L(1), name: 'Boundaries of the abdomen, quadrants, regions and planes', category: 'core', relevance: 'core', sourceRefs: aw([3, 4, 5, 6]) },
  'surface-points': { lessonId: L(1), name: 'Surface landmarks: McBurney’s and Murphy’s points', category: 'clinical', relevance: 'core', sourceRefs: aw([7, 8]) },
  'wall-layers-fascia': { lessonId: L(1), name: 'Layers of the anterolateral wall, Langer’s lines and Camper’s and Scarpa’s fascia', category: 'core', relevance: 'core', sourceRefs: aw([9, 10, 11, 12, 13, 14]) },
  'wall-muscles': { lessonId: L(1), name: 'Muscles of the anterolateral wall, conjoint tendon and transversalis fascia', category: 'core', relevance: 'core', sourceRefs: aw([15, 16, 18, 20, 21, 22]) },

  // Lesson 2 — Rectus Sheath, Neurovasculature and Incisions
  'rectus-sheath': { lessonId: L(2), name: 'The rectus sheath, arcuate line and linea alba', category: 'core', relevance: 'core', sourceRefs: aw([26, 29, 30]) },
  'wall-vessels-lymph': { lessonId: L(2), name: 'Arteries, veins, anastomoses and lymph drainage of the anterolateral wall', category: 'core', relevance: 'core', sourceRefs: aw([31, 33, 34, 35]) },
  'wall-nerves': { lessonId: L(2), name: 'Nerves and dermatomes of the anterolateral wall and nerve blocks', category: 'core', relevance: 'core', sourceRefs: aw([36, 37]) },
  'abdominal-incisions': { lessonId: L(2), name: 'Principles and types of abdominal incisions', category: 'clinical', relevance: 'core', sourceRefs: aw([38, 39]) },

  // Lesson 3 — Inguinal Region and Hernias
  'inguinal-canal': { lessonId: L(3), name: 'The inguinal canal: rings, boundaries and contents', category: 'core', relevance: 'core', sourceRefs: aw([40, 41, 52, 54, 55]) },
  'spermatic-cord': { lessonId: L(3), name: 'Testicular descent and the coverings and contents of the spermatic cord', category: 'core', relevance: 'core', sourceRefs: aw([42, 43, 49, 50]) },
  'inguinal-femoral-hernia': { lessonId: L(3), name: 'Hernias: direct and indirect inguinal, femoral and Hesselbach’s triangle', category: 'clinical', relevance: 'core', sourceRefs: aw([57, 59, 60, 61]) },
  'umbilical-wall-defects': { lessonId: L(3), name: 'Umbilical hernia, congenital wall defects and internal folds and fossae', category: 'clinical', relevance: 'core', sourceRefs: aw([66, 67, 68, 70]) },

  // Lesson 4 — The Posterior Abdominal Wall
  'posterior-wall-structure': { lessonId: L(4), name: 'Boundaries, fascia and muscles of the posterior abdominal wall', category: 'core', relevance: 'core', sourceRefs: aw([78, 82, 83, 84, 85]) },
  'posterior-wall-vessels': { lessonId: L(4), name: 'Abdominal aorta, IVC and lumbar lymph nodes', category: 'core', relevance: 'core', sourceRefs: aw([87, 90, 93, 94]) },
  'lymphatic-ducts': { lessonId: L(4), name: 'Lymphatic trunks, cisterna chyli and the lymphatic ducts', category: 'core', relevance: 'core', sourceRefs: aw([105, 107, 108, 110]) },
  'abdominal-autonomics-lumbar-plexus': { lessonId: L(4), name: 'Abdominal autonomic ganglia, splanchnic nerves and the lumbar plexus', category: 'core', relevance: 'core', sourceRefs: aw([96, 97, 98, 99, 102, 112, 115]) },

  // Lesson 5 — Oesophagus and Stomach
  'oesophagus': { lessonId: L(5), name: 'The oesophagus: course, constrictions and sphincters', category: 'core', relevance: 'core', sourceRefs: gi([3, 4, 5, 6, 7]) },
  'stomach': { lessonId: L(5), name: 'The stomach: parts, relations and clinical notes', category: 'core', relevance: 'core', sourceRefs: gi([10, 11, 12, 13, 14]) },
  'hiatal-hernia': { lessonId: L(5), name: 'Phrenicoesophageal ligament and hiatal hernia', category: 'clinical', relevance: 'core', sourceRefs: gi([15, 16]) },

  // Lesson 6 — The Small Intestine
  'duodenum': { lessonId: L(6), name: 'The duodenum: parts, levels and relations', category: 'core', relevance: 'core', sourceRefs: gi([20, 22, 23, 24, 26, 27]) },
  'duodenal-clinical': { lessonId: L(6), name: 'Duodenal ulcers, ligament of Treitz and paraduodenal recesses', category: 'clinical', relevance: 'core', sourceRefs: gi([25, 28, 29, 30]) },
  'jejunum-ileum': { lessonId: L(6), name: 'Jejunum and ileum, root of the mesentery and Meckel’s diverticulum', category: 'core', relevance: 'core', sourceRefs: gi([31, 32, 36]) },

  // Lesson 7 — Large Intestine, Rectum and Anal Canal
  'colon-features': { lessonId: L(7), name: 'Large intestine: functions, special features, caecum, appendix and colon', category: 'core', relevance: 'core', sourceRefs: gi([37, 39, 40, 41, 43, 44, 46]) },
  'rectum': { lessonId: L(7), name: 'The rectum: extent, features and relations', category: 'core', relevance: 'core', sourceRefs: gi([48, 50]) },
  'anal-canal': { lessonId: L(7), name: 'The anal canal, sphincters and the pectinate line', category: 'core', relevance: 'core', sourceRefs: gi([51, 52, 53, 55, 56]) },

  // Lesson 8 — Liver, Gallbladder, Pancreas and Spleen
  'liver': { lessonId: L(8), name: 'The liver: functions, relations, lobes, segments and ligaments', category: 'core', relevance: 'core', sourceRefs: gi([57, 58, 59, 61, 64, 66]) },
  'gallbladder': { lessonId: L(8), name: 'The gallbladder, gallstones and the cystohepatic triangle', category: 'core', relevance: 'core', sourceRefs: gi([68, 69, 70]) },
  'pancreas': { lessonId: L(8), name: 'The pancreas: parts, ducts and clinical notes', category: 'core', relevance: 'core', sourceRefs: gi([71, 72, 74]) },
  'spleen': { lessonId: L(8), name: 'The spleen: functions, position, relations and ligaments', category: 'core', relevance: 'core', sourceRefs: gi([75, 76, 77, 78, 80]) },

  // Lesson 9 — Arterial Supply of the GI Tract
  'gut-arteries-overview': { lessonId: L(9), name: 'Foregut, midgut and hindgut arteries, watershed zones and anastomoses', category: 'core', relevance: 'core', sourceRefs: nv([2, 3]) },
  'coeliac-trunk': { lessonId: L(9), name: 'Coeliac trunk branches and clinical correlates', category: 'core', relevance: 'core', sourceRefs: nv([6, 10]) },
  'sma-ima-branches': { lessonId: L(9), name: 'Branches of the superior and inferior mesenteric arteries and rectal supply', category: 'core', relevance: 'core', sourceRefs: nv([11, 13, 15]) },

  // Lesson 10 — Portal System, Lymphatics and Innervation
  'portal-system': { lessonId: L(10), name: 'The hepatic portal vein, its formation and tributaries', category: 'core', relevance: 'core', sourceRefs: nv([16, 18, 19, 20]) },
  'portocaval-anastomoses': { lessonId: L(10), name: 'Portocaval anastomoses, portal hypertension and haemorrhoids', category: 'clinical', relevance: 'core', sourceRefs: nv([22, 23, 24, 28, 30, 31]) },
  'gi-lymphatics': { lessonId: L(10), name: 'Lymphatic drainage of the abdominal viscera', category: 'core', relevance: 'core', sourceRefs: nv([32, 33, 34]) },
  'gi-innervation': { lessonId: L(10), name: 'Innervation of the GI tract and referred visceral pain', category: 'core', relevance: 'core', sourceRefs: nv([36, 37, 39, 41, 42, 45, 47]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'lesser-splanchnic-levels',
    concept: 'Spinal levels of the lesser splanchnic nerve',
    status: 'resolved',
    statements: [
      { text: 'Abdominal Walls, slide 97: lesser splanchnic nerve T10–T11.', sourceRefs: aw([97]) },
      { text: 'Neurovasculature, slide 41: lesser splanchnic nerve “T10–T11 or T9–T10”; greater splanchnic “T5–T9/10”.', sourceRefs: nv([41]) },
    ],
    resolution: { text: 'Both decks give T10–T11 as the usual levels; the second deck notes the common variation.', sourceRefs: [...aw([97]), ...nv([41])] },
  },
];

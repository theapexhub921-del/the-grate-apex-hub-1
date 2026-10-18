// Source references, concepts and discrepancies for
// Anatomy → Urinary System (gross anatomy, HB2).
//
// Lecture source (defines WHAT is taught; see content-catalog.ts):
//   UR = "Urinary System (Gross) 2026" — PPTX, 79 slides
//
// Reference (clarification only): Gray's Anatomy for Students (4th ed.), via GRAYS.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'urinary-system-gross';

export const ur = (numbers: number[]): SourceReference[] => slides('anat-urinary-gross', numbers);
export const GRAYS: SourceReference[] = [{ sourceId: 'grays-anatomy-students-4e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — The Kidneys: Position, Coverings and Relations
  'urinary-overview': { lessonId: L(1), name: 'Organs of the urinary system and functions of the kidneys', category: 'core', relevance: 'core', sourceRefs: ur([2, 3]) },
  'kidney-position': { lessonId: L(1), name: 'Position, size and surface anatomy of the kidneys', category: 'core', relevance: 'core', sourceRefs: ur([4, 5, 6, 8, 18]) },
  'kidney-coverings': { lessonId: L(1), name: 'Coverings of the kidney and the renal fascia', category: 'core', relevance: 'core', sourceRefs: ur([7, 9, 10]) },
  'kidney-relations': { lessonId: L(1), name: 'Anterior and posterior relations of the kidneys', category: 'core', relevance: 'core', sourceRefs: ur([13, 15]) },

  // Lesson 2 — Kidney Structure, Vessels, Nerves and Suprarenal Glands
  'kidney-internal': { lessonId: L(2), name: 'Hilum, renal sinus, cortex, medulla, calyces and renal pelvis', category: 'core', relevance: 'core', sourceRefs: ur([11, 12, 19, 20]) },
  'kidney-vessels': { lessonId: L(2), name: 'Renal arteries and veins, accessory arteries and the avascular line', category: 'core', relevance: 'core', sourceRefs: ur([22, 24, 25, 26]) },
  'kidney-nerves': { lessonId: L(2), name: 'Innervation of the kidney and renal pain', category: 'core', relevance: 'core', sourceRefs: ur([27]) },
  'suprarenal-glands': { lessonId: L(2), name: 'The suprarenal (adrenal) glands', category: 'core', relevance: 'core', sourceRefs: ur([32, 34, 36, 37]) },

  // Lesson 3 — The Ureters
  'ureter-course': { lessonId: L(3), name: 'Ureters: parts, course and relations', category: 'core', relevance: 'core', sourceRefs: ur([38, 39, 41, 42, 43, 50]) },
  'ureter-constrictions': { lessonId: L(3), name: 'Ureteric constrictions and renal stone disease', category: 'clinical', relevance: 'core', sourceRefs: ur([44, 46]) },
  'ureter-supply': { lessonId: L(3), name: 'Blood supply, lymph drainage and innervation of the ureter; ureteric colic', category: 'core', relevance: 'core', sourceRefs: ur([48, 49, 52, 53]) },

  // Lesson 4 — The Urinary Bladder
  'bladder-structure': { lessonId: L(4), name: 'Urinary bladder: position, parts, relations and capacity', category: 'core', relevance: 'core', sourceRefs: ur([55, 56, 57, 58, 69]) },
  'bladder-interior': { lessonId: L(4), name: 'Interior of the bladder: trigone, neck and uvula', category: 'core', relevance: 'core', sourceRefs: ur([59, 60, 61]) },
  'bladder-support-supply': { lessonId: L(4), name: 'Ligaments, blood supply and innervation of the bladder; urethral sphincters', category: 'core', relevance: 'core', sourceRefs: ur([62, 64, 65]) },

  // Lesson 5 — The Urethra
  'female-urethra': { lessonId: L(5), name: 'The female urethra', category: 'core', relevance: 'core', sourceRefs: ur([70]) },
  'male-urethra': { lessonId: L(5), name: 'The male urethra: parts and features of the prostatic urethra', category: 'core', relevance: 'core', sourceRefs: ur([71, 72]) },
  'urethra-supply-incontinence': { lessonId: L(5), name: 'Blood supply, lymph drainage and innervation of the urethra; incontinence', category: 'core', relevance: 'core', sourceRefs: ur([75, 77, 78, 79]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [];

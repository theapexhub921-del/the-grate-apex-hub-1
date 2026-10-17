// Source references, concepts and discrepancies for Biochemistry →
// Immunology.
//
// Lecture sources (content-catalog.ts). Current decks:
//   IN   = 01 Introduction & Historical Perspective (Prof. Sakyi, 2026) — 63 slides
//   CY   = 02 Cytokines & Chemokines, revised (Prof. Sakyi) — 24 slides
//   RS   = 03 Receptors and Signalling: Cytokines (Prof. Sakyi) — 24 slides
//   CE   = 04 Cells of the Immune System (Prof. Sakyi, 2024) — 62 slides
//   AB   = 05 Antibody, Monoclonal Antibodies & Complement (Dr Frimpong) — 62 slides
//   AG   = 06 Antigens (Prof. Sakyi, 2024) — 48 slides
//   IF   = 07 Immunity to Infectious Agents (Prof. Sakyi, 2026) — 25 slides
//   CM   = The Complement System (Dr Sakyi) — 60 slides
// Earlier versions, merged with the current decks (their extra material is used):
//   RS0  = Receptors and Signalling (earlier) — 29 slides
//   CE22 = Cells of the Immune System 2022 — 61 slides
//   IG22 = Immunoglobulins (Antibodies) 2022 — 35 slides
//   AG22 = Antigens 2022 — 40 slides
//   IF0  = Immunity to Infectious Agents (earlier) — 55 slides
// The study guides (including hypersensitivity) and the third-party
// immunodiagnostics notes are study aids, not sources. Speaker notes are
// annotations and are not quizzed. Picture-only slides are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'immunology';

export const intro = (n: number[]): SourceReference[] => slides('imm-01-introduction-historical-perspective-to-immuno', n);
export const cy = (n: number[]): SourceReference[] => slides('imm-02-cytokines-chemokines-revised-1', n);
export const rs = (n: number[]): SourceReference[] => slides('imm-03-receptors-and-signaling-cytokines-sas', n);
export const rs0 = (n: number[]): SourceReference[] => slides('imm-receptors-and-signaling-cytokines-sas', n);
export const ce = (n: number[]): SourceReference[] => slides('imm-04-cells-of-the-immune-system-sas-2024-autosaved', n);
export const ce22 = (n: number[]): SourceReference[] => slides('imm-cells-of-the-immune-system-sas-2022-rr-hb2', n);
export const ab = (n: number[]): SourceReference[] => slides('imm-05-antibody-monoclonal-antibodies-complement', n);
export const ig22 = (n: number[]): SourceReference[] => slides('imm-antibodies-hb-ii-2022-sas', n);
export const ag = (n: number[]): SourceReference[] => slides('imm-06-antigens-sas-2024', n);
export const ag22 = (n: number[]): SourceReference[] => slides('imm-antigens-hbii-2022-sas', n);
export const inf = (n: number[]): SourceReference[] => slides('imm-07-immunity-to-infectious-agents-sas-2026', n);
export const inf0 = (n: number[]): SourceReference[] => slides('imm-immunity-to-infectious-agents-sas-tm', n);
export const cm = (n: number[]): SourceReference[] => slides('imm-the-complement-system-sas-2', n);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — History
  'immunity-definition': { lessonId: L(1), name: 'What immunity and the immune system are', category: 'terminology', relevance: 'core', sourceRefs: intro([3, 4]) },
  'vaccination-history': { lessonId: L(1), name: 'Variolation, Jenner and Pasteur', category: 'core', relevance: 'core', sourceRefs: intro([8, 9, 10, 11, 21]) },
  'cellular-humoral-debate': { lessonId: L(1), name: 'Cellular versus humoral immunity', category: 'core', relevance: 'core', sourceRefs: intro([12, 13, 14, 15, 16, 21, 22]) },
  'clonal-selection': { lessonId: L(1), name: 'Selective, instructional and clonal-selection theories', category: 'core', relevance: 'core', sourceRefs: intro([17, 18]) },

  // Lesson 2 — Innate and adaptive immunity
  'acquired-immunity': { lessonId: L(2), name: 'Natural and artificial, active and passive immunity', category: 'core', relevance: 'core', sourceRefs: intro([24, 25, 26]) },
  'innate-barriers': { lessonId: L(2), name: 'Innate immunity and its barriers', category: 'core', relevance: 'core', sourceRefs: intro([28, 29, 32, 33, 34, 43]) },
  'adaptive-immunity': { lessonId: L(2), name: 'Adaptive immunity: B and T cells', category: 'core', relevance: 'core', sourceRefs: intro([54, 55, 56, 57, 58, 60, 61, 62]) },

  // Lesson 3 — Recognising pathogens; inflammation
  'pamps-prrs': { lessonId: L(3), name: 'PAMPs and pattern recognition receptors', category: 'core', relevance: 'core', sourceRefs: [...intro([44, 45, 46, 47, 48, 49]), ...ce([28, 30, 34, 35]), ...inf0([28, 31])] },
  'inflammation': { lessonId: L(3), name: 'Acute inflammation', category: 'core', relevance: 'core', sourceRefs: intro([51, 52]) },

  // Lesson 4 — Cells
  'blood-haematopoiesis': { lessonId: L(4), name: 'Blood, haematopoiesis and lineages', category: 'supporting', relevance: 'core', sourceRefs: [...ce([3, 5, 7, 10, 22]), ...intro([41, 42])] },
  'cd-markers': { lessonId: L(4), name: 'CD markers', category: 'core', relevance: 'core', sourceRefs: ce([15, 17, 19, 21]) },
  'phagocytes': { lessonId: L(4), name: 'Macrophages and neutrophils', category: 'core', relevance: 'core', sourceRefs: [...ce([24, 36, 37, 38, 42, 44, 60]), ...intro([42])] },
  'other-innate-cells': { lessonId: L(4), name: 'Eosinophils, basophils, mast cells, dendritic cells', category: 'core', relevance: 'core', sourceRefs: ce([45, 46, 47, 48]) },
  'nk-cells': { lessonId: L(4), name: 'NK and NKT cells', category: 'core', relevance: 'core', sourceRefs: [...ce([50, 51, 53, 56, 58]), ...ce22([54, 55])] },

  // Lesson 5 — Cytokines
  'cytokine-basics': { lessonId: L(5), name: 'What cytokines are and how they act', category: 'core', relevance: 'core', sourceRefs: [...cy([4, 5, 7, 9]), ...rs([3, 4, 5, 6, 8, 14])] },
  'cytokine-receptors': { lessonId: L(5), name: 'Receptor families and JAK/STAT', category: 'core', relevance: 'core', sourceRefs: [...cy([12, 13, 14]), ...rs([19])] },
  'th-subsets': { lessonId: L(5), name: 'Helper T-cell subsets and regulation', category: 'core', relevance: 'core', sourceRefs: [...cy([16, 17]), ...rs([16]), ...rs0([21, 22, 24])] },
  'cytokine-disease': { lessonId: L(5), name: 'Cytokine diseases and therapies', category: 'clinical', relevance: 'core', sourceRefs: [...cy([19, 21, 23]), ...rs([20, 21, 22, 23, 24])] },

  // Lesson 6 — Antigens
  'antigen-terms': { lessonId: L(6), name: 'Immunogens, antigens and haptens', category: 'terminology', relevance: 'core', sourceRefs: [...ag([5, 6, 15, 16]), ...ag22([6, 21])] },
  'immunogenicity-factors': { lessonId: L(6), name: 'What makes a substance immunogenic', category: 'core', relevance: 'core', sourceRefs: ag22([16, 17, 19, 21]) },
  'epitopes': { lessonId: L(6), name: 'Epitopes and their kinds', category: 'core', relevance: 'core', sourceRefs: [...ag([19, 22, 23, 24, 26]), ...ag22([27, 28])] },
  'antigen-classes': { lessonId: L(6), name: 'Classes of antigen, TD and TI antigens', category: 'core', relevance: 'core', sourceRefs: [...ag([28, 31, 33, 34, 35, 38, 39, 40, 41, 42]), ...ag22([33])] },
  'adjuvants-mitogens': { lessonId: L(6), name: 'Adjuvants, mitogens and superantigens', category: 'core', relevance: 'core', sourceRefs: [...ag([36, 37, 43, 44, 45, 46, 47]), ...ag22([20])] },

  // Lesson 7 — Antibodies
  'ig-structure': { lessonId: L(7), name: 'Structure of immunoglobulins', category: 'core', relevance: 'core', sourceRefs: [...ab([4, 5, 6, 7]), ...ig22([4, 8, 10, 11, 12, 14, 27, 29, 32, 34])] },
  'ig-classes': { lessonId: L(7), name: 'The five classes', category: 'core', relevance: 'core', sourceRefs: [...ab([10, 11, 12, 13, 14]), ...ig22([15, 16, 19, 20, 21, 23, 25, 26])] },
  'ag-ab-binding': { lessonId: L(7), name: 'Antigen–antibody interaction', category: 'core', relevance: 'core', sourceRefs: ab([15, 16]) },

  // Lesson 8 — Monoclonal antibodies
  'mab-basics': { lessonId: L(8), name: 'What monoclonal antibodies are and how they are made', category: 'core', relevance: 'core', sourceRefs: ab([18, 19, 20, 34, 35]) },
  'mab-types': { lessonId: L(8), name: 'Murine, chimeric, humanised and human', category: 'core', relevance: 'core', sourceRefs: ab([21, 22, 23, 24, 25]) },
  'mab-uses': { lessonId: L(8), name: 'Uses, conjugates and limitations', category: 'clinical', relevance: 'core', sourceRefs: ab([26, 27, 28, 29, 30, 31, 32, 36, 37, 38, 39]) },

  // Lesson 9 — Complement
  'complement-intro': { lessonId: L(9), name: 'What complement is', category: 'core', relevance: 'core', sourceRefs: [...cm([3, 4, 5]), ...ab([43, 44])] },
  'complement-pathways': { lessonId: L(9), name: 'Classical, alternative and lectin pathways', category: 'visual-process', relevance: 'core', sourceRefs: [...cm([11, 22, 25, 26, 27, 28, 29, 32, 33]), ...ab([47, 48, 49, 51, 52, 54, 55])] },
  'complement-effects': { lessonId: L(9), name: 'Membrane attack complex and biological effects', category: 'core', relevance: 'core', sourceRefs: [...cm([14, 15, 18, 19, 20, 39, 40, 41, 42, 43, 44]), ...ab([46, 56, 59])] },
  'complement-regulation': { lessonId: L(9), name: 'Regulation, receptors and deficiency diseases', category: 'clinical', relevance: 'core', sourceRefs: cm([45, 46, 47, 49, 50, 51, 52, 53, 54]) },
  'complement-testing': { lessonId: L(9), name: 'Laboratory testing of complement', category: 'clinical', relevance: 'core', sourceRefs: [...cm([55, 57, 58, 59]), ...ab([60, 61])] },

  // Lesson 10 — Immunity to infection
  'infection-principles': { lessonId: L(10), name: 'Pathogens and general principles', category: 'core', relevance: 'core', sourceRefs: inf([4, 5, 6, 7, 22]) },
  'antiviral-immunity': { lessonId: L(10), name: 'Immunity to viruses', category: 'core', relevance: 'core', sourceRefs: [...inf([8, 10, 11]), ...inf0([10, 18, 20, 21])] },
  'antibacterial-immunity': { lessonId: L(10), name: 'Immunity to extracellular and intracellular bacteria', category: 'core', relevance: 'core', sourceRefs: [...inf([12, 13, 14, 15, 16, 17, 18]), ...inf0([23, 35])] },
  'fungi-parasites': { lessonId: L(10), name: 'Immunity to fungi, protozoa and helminths', category: 'core', relevance: 'core', sourceRefs: [...inf([19, 20, 21, 23, 24]), ...inf0([54, 55])] },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'adaptive-line-of-defence',
    concept: 'Which line of defence adaptive immunity is',
    status: 'unresolved',
    statements: [
      { text: 'IN slide 28: adaptive mechanisms are the second line of defence.', sourceRefs: intro([28]) },
      { text: 'IN slide 55: adaptive immunity is the body’s third line of defence.', sourceRefs: intro([55]) },
    ],
    note: 'The line number is not quizzed.',
  },
  {
    id: 'lps-teichoic-gram',
    concept: 'Which bacteria carry LPS and teichoic acid',
    status: 'unresolved',
    statements: [
      { text: 'IN slide 44 and AG slide 37: LPS is from the Gram-negative cell wall (endotoxin).', sourceRefs: [...intro([44]), ...ag([37])] },
      { text: 'CE slide 30: scavenger receptors recognise “teichoic acid (gram-negative bacteria)” and “lipopolysaccharide (LPS, gram-positive bacteria)”.', sourceRefs: ce([30]) },
    ],
    note: 'Lessons follow IN slide 44; the Gram stain of these molecules is not quizzed from CE slide 30.',
  },
  {
    id: 'c2-fragment',
    concept: 'Which C2 fragment joins C4b in the C3 convertase',
    status: 'unresolved',
    statements: [
      { text: 'CM slides 12–13 and AB slides 49–50: C2b stays with C4b (C4b2b); C2a diffuses away.', sourceRefs: [...cm([12, 13]), ...ab([49, 50])] },
      { text: 'AB slides 53, 55, 56 and CM slide 34: the convertase is C4b2a.', sourceRefs: [...ab([53, 55, 56]), ...cm([34])] },
    ],
    note: 'The C2 fragment name is not quizzed; the convertase is called “C4b2 (C3 convertase)”.',
  },
  {
    id: 'tlr-count',
    concept: 'How many Toll-like receptors',
    status: 'unresolved',
    statements: [
      { text: 'CE slide 34: thirteen TLRs identified in mice and humans.', sourceRefs: ce([34]) },
      { text: 'IF0 slide 29: at least ten TLRs.', sourceRefs: inf0([29]) },
    ],
    note: 'The number of TLRs is not quizzed.',
  },
  {
    id: 'heavy-chain-mass',
    concept: 'Mass of an immunoglobulin heavy chain',
    status: 'unresolved',
    statements: [
      { text: 'AB slide 6: heavy chains 50–70 kD.', sourceRefs: ab([6]) },
      { text: 'IG22 slide 11: heavy chains 53–75 kDa.', sourceRefs: ig22([11]) },
    ],
    note: 'Heavy chain mass is not quizzed; the light chain (23 kDa) is.',
  },
  {
    id: 'antigen-vs-immunogen',
    concept: 'Antigen and immunogen',
    status: 'unresolved',
    statements: [
      { text: 'AG slide 5: an immunogen induces an immune response; an antigen binds its products. All immunogens are antigens, not all antigens immunogens.', sourceRefs: ag([5]) },
      { text: 'AG22 slides 3–4: the distinction is functional, the terms are commonly used as synonyms, and an antigen is defined as inducing an immune response.', sourceRefs: ag22([3, 4]) },
    ],
    note: 'Lessons use the AG slide 5 definitions.',
  },
];

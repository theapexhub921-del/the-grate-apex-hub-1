// Source references, concepts and discrepancies for Physiology → Endocrinology.
//
// Lecture sources (PDF exports of the slides; see content-catalog.ts):
//   IN = "Endocrinology (introduction)" — 47 pages: principles, hypothalamus, pituitary
//   TH = "Thyroid Hormones" — 17 pages
//   AD = "Adrenal Gland" — 26 pages
//   PA = "Endocrine Pancreas" — 29 pages
//   CA = "Calcium Metabolism" — 22 pages
// Pages that are only a picture or a heading are not cited. Arrows lost in
// the text layer were read from the page images.
//
// Reference (clarification only): Guyton and Hall (14th ed.), via GUYTON.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { pages, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'endocrinology';

const pdf = (id: string) => (numbers: number[]): SourceReference[] => pages(id, numbers);

export const intro = pdf('endo-endocrinology-lecture-proper-1a-3');
export const th = pdf('endo-thyroid-hormones-proper-1');
export const ad = pdf('endo-adrenals-4');
export const pa = pdf('endo-insulin');
export const ca = pdf('endo-calcium-metabolism');

export const GUYTON: SourceReference[] = [{ sourceId: 'guyton-hall-14e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Principles
  'chemical-communication': { lessonId: L(1), name: 'Ways cells communicate', category: 'core', relevance: 'core', sourceRefs: intro([2]) },
  'hormone-classes': { lessonId: L(1), name: 'Amines, peptides and steroids', category: 'core', relevance: 'core', sourceRefs: intro([3]) },
  'hormone-transport': { lessonId: L(1), name: 'Transport of hormones in blood', category: 'core', relevance: 'core', sourceRefs: intro([6]) },
  'hormone-action': { lessonId: L(1), name: 'Receptors and second messengers', category: 'core', relevance: 'core', sourceRefs: intro([7]) },
  'secretion-control': { lessonId: L(1), name: 'Patterns and control of secretion; feedback', category: 'core', relevance: 'core', sourceRefs: intro([9, 23]) },
  'primary-secondary': { lessonId: L(1), name: 'Primary and secondary hypo- and hypersecretion', category: 'clinical', relevance: 'core', sourceRefs: intro([26]) },

  // Lesson 2 — Hypothalamus and posterior pituitary
  'hypothalamus': { lessonId: L(2), name: 'The hypothalamus and its releasing hormones', category: 'core', relevance: 'core', sourceRefs: intro([10, 19, 21]) },
  'posterior-pituitary': { lessonId: L(2), name: 'The posterior pituitary', category: 'core', relevance: 'core', sourceRefs: intro([11]) },
  'oxytocin': { lessonId: L(2), name: 'Oxytocin and the let-down reflex', category: 'visual-process', relevance: 'core', sourceRefs: intro([12, 13, 14]) },
  'adh': { lessonId: L(2), name: 'ADH and its control', category: 'core', relevance: 'core', sourceRefs: intro([16]) },
  'adh-disorders': { lessonId: L(2), name: 'Diabetes insipidus and SIADH', category: 'clinical', relevance: 'core', sourceRefs: intro([17, 18]) },

  // Lesson 3 — Anterior pituitary
  'anterior-pituitary': { lessonId: L(3), name: 'Anterior pituitary hormones and targets', category: 'core', relevance: 'core', sourceRefs: intro([20, 26]) },
  'gh-actions': { lessonId: L(3), name: 'Actions of growth hormone', category: 'core', relevance: 'core', sourceRefs: intro([28, 29, 30, 31, 32]) },
  'gh-control': { lessonId: L(3), name: 'Control of growth hormone secretion', category: 'core', relevance: 'core', sourceRefs: intro([32, 33, 34]) },
  'gh-disorders': { lessonId: L(3), name: 'Gigantism, acromegaly and dwarfism', category: 'clinical', relevance: 'core', sourceRefs: intro([35, 36, 37]) },
  'prolactin': { lessonId: L(3), name: 'Prolactin', category: 'core', relevance: 'core', sourceRefs: intro([40, 41, 42, 43]) },
  'msh': { lessonId: L(3), name: 'Melanocyte-stimulating hormone', category: 'supporting', relevance: 'supporting', sourceRefs: intro([44, 45]) },

  // Lesson 4 — Thyroid
  'thyroid-hormones': { lessonId: L(4), name: 'T3, T4 and their synthesis', category: 'core', relevance: 'core', sourceRefs: th([3, 4, 5]) },
  'thyroid-metabolic': { lessonId: L(4), name: 'Metabolic effects of thyroid hormones', category: 'core', relevance: 'core', sourceRefs: th([7, 8]) },
  'thyroid-systems': { lessonId: L(4), name: 'Effects on heart, muscle, CNS and growth', category: 'core', relevance: 'core', sourceRefs: th([9, 10, 11]) },
  'thyroid-control': { lessonId: L(4), name: 'The hypothalamic–pituitary–thyroid axis', category: 'visual-process', relevance: 'core', sourceRefs: th([12, 13]) },
  'thyroid-disorders': { lessonId: L(4), name: 'Hypothyroidism, cretinism and hyperthyroidism', category: 'clinical', relevance: 'core', sourceRefs: th([13, 14, 15, 16]) },

  // Lesson 5 — Adrenal gland
  'adrenal-zones': { lessonId: L(5), name: 'Cortex, medulla and the three zones', category: 'core', relevance: 'core', sourceRefs: ad([2, 3, 6]) },
  'glucocorticoid-control': { lessonId: L(5), name: 'CRH, ACTH and cortisol', category: 'core', relevance: 'core', sourceRefs: ad([4, 5, 7]) },
  'cortisol-actions': { lessonId: L(5), name: 'Actions of cortisol', category: 'core', relevance: 'core', sourceRefs: ad([8, 9, 10, 11]) },
  'aldosterone-raas': { lessonId: L(5), name: 'Aldosterone and the renin–angiotensin system', category: 'visual-process', relevance: 'core', sourceRefs: ad([12, 13]) },
  'adrenal-disorders': { lessonId: L(5), name: 'Addison’s, Cushing’s, Conn’s and hypoaldosteronism', category: 'clinical', relevance: 'core', sourceRefs: ad([14, 15, 16, 17, 18, 19]) },
  'adrenal-medulla': { lessonId: L(5), name: 'The adrenal medulla and phaeochromocytoma', category: 'core', relevance: 'core', sourceRefs: ad([20, 21, 22]) },

  // Lesson 6 — Endocrine pancreas
  'islets': { lessonId: L(6), name: 'The islets of Langerhans', category: 'core', relevance: 'core', sourceRefs: pa([2]) },
  'insulin-synthesis': { lessonId: L(6), name: 'Insulin structure, synthesis and breakdown', category: 'core', relevance: 'core', sourceRefs: pa([3, 5]) },
  'insulin-secretion': { lessonId: L(6), name: 'Control of insulin secretion', category: 'core', relevance: 'core', sourceRefs: pa([6]) },
  'insulin-actions': { lessonId: L(6), name: 'Metabolic actions of insulin', category: 'core', relevance: 'core', sourceRefs: pa([7, 8, 9, 10]) },
  'diabetes': { lessonId: L(6), name: 'Diabetes mellitus', category: 'clinical', relevance: 'core', sourceRefs: pa([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) },
  'hypoglycaemia': { lessonId: L(6), name: 'Insulin excess and hypoglycaemia', category: 'clinical', relevance: 'core', sourceRefs: pa([21, 22]) },
  'glucagon': { lessonId: L(6), name: 'Glucagon', category: 'core', relevance: 'core', sourceRefs: pa([28]) },

  // Lesson 7 — Calcium metabolism
  'calcium-roles': { lessonId: L(7), name: 'Roles of calcium; hypo- and hypercalcaemia', category: 'core', relevance: 'core', sourceRefs: ca([2, 3, 4]) },
  'calcium-handling': { lessonId: L(7), name: 'Hormones and organs; absorption of calcium and phosphate', category: 'core', relevance: 'core', sourceRefs: ca([5, 6]) },
  'bone': { lessonId: L(7), name: 'Bone, its cells and its disorders', category: 'core', relevance: 'core', sourceRefs: ca([7, 8, 9, 10]) },
  'vitamin-d': { lessonId: L(7), name: 'Vitamin D', category: 'visual-process', relevance: 'core', sourceRefs: ca([12, 13, 14, 18]) },
  'pth': { lessonId: L(7), name: 'Parathyroid hormone', category: 'core', relevance: 'core', sourceRefs: ca([15, 16, 17]) },
  'calcitonin': { lessonId: L(7), name: 'Calcitonin', category: 'core', relevance: 'core', sourceRefs: ca([19]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'thyroid-bone-growth',
    concept: 'Thyroid hormone and bone growth',
    status: 'unresolved',
    statements: [
      { text: 'Thyroid Hormones, p. 11: “Important for growth … Needed for proper bone growth.”', sourceRefs: th([11]) },
      { text: 'Same page: “Slows bone growth and delays epiphyseal healing.”', sourceRefs: th([11]) },
    ],
    note: 'The last line probably describes what happens when thyroid hormone is lacking. Only “needed for proper bone growth” is quizzed.',
  },
  {
    id: 'hypoglycaemia-heart',
    concept: 'Cardiac excitability in hypoglycaemia',
    status: 'unresolved',
    statements: [{ text: 'Endocrine Pancreas, p. 22: hypoglycaemia stimulates sympathetic activity, with nervousness, sweating and “↓ excitability of cardiac muscle”.', sourceRefs: pa([22]) }],
    note: 'Sympathetic stimulation would normally raise cardiac excitability; the arrow may be a slip. Not quizzed.',
  },
  {
    id: 'prolactin-timing',
    concept: 'When prolactin falls',
    status: 'unresolved',
    statements: [{ text: 'Introduction, p. 43: prolactin secretion increases in pregnancy, “falls after 8 days of pregnancy but increases with suckling. Falls again after 3 months.”', sourceRefs: intro([43]) }],
    note: '“8 days of pregnancy” is probably “8 days after delivery”. Not quizzed.',
  },
];

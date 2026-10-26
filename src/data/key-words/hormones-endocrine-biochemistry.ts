import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'hormones-endocrine-biochemistry-1': [
    { term: 'Hormone', meaning: 'A chemical secreted by a ductless gland into the extracellular fluid, where it regulates cells, tissues and organs.' },
    { term: 'Endocrine system', meaning: 'The body’s controlling system alongside the CNS, made of ductless glands.' },
    { term: 'Target cells', meaning: 'The cells with specific receptors for a hormone: only they respond.' },
    { term: 'Receptors', meaning: 'Specific proteins that bind a hormone: the crucial first step of its action.' },
    { term: 'Adipose tissue', meaning: 'Fat tissue, also considered an endocrine organ.' },
  ],
  'hormones-endocrine-biochemistry-3': [
    { term: 'Steroid hormones', meaning: 'Lipid-soluble hormones all derived from cholesterol.' },
    { term: 'Glucocorticoids', meaning: 'Adrenal steroids such as cortisol: gluconeogenesis, protein breakdown, anti-inflammatory.' },
    { term: 'Mineralocorticoids', meaning: 'Adrenal steroids such as aldosterone: Na⁺/K⁺ balance.' },
    { term: 'Pregnenolone', meaning: 'Made from cholesterol in the rate-limiting step for all steroids.' },
    { term: 'Zona glomerulosa', meaning: 'The adrenal zone with no 17-hydroxylase, so it makes aldosterone.' },
    { term: 'HPA axis', meaning: 'Hypothalamus → pituitary → adrenal: CRF → ACTH → cortisol, with cortisol feeding back.' },
  ],
};

import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'endocrinology-3': [
    { term: 'Anterior pituitary', meaning: 'Releases FSH, LH, GH, TSH, prolactin, ACTH and MSH.' },
    { term: 'Growth hormone', meaning: 'A peptide that drives growth of all tissues; it spares glucose (diabetogenic).' },
    { term: 'Somatomedins', meaning: 'Insulin-like growth factors from the liver that carry out growth hormone’s actions.' },
    { term: 'Acromegaly', meaning: 'Too much growth hormone after puberty: bones widen, height does not increase.' },
    { term: 'Gigantism', meaning: 'Too much growth hormone before puberty: long bones lengthen.' },
    { term: 'Prolactin', meaning: 'A peptide for breast development and milk production; dopamine is its main brake.' },
  ],
  'endocrinology-5': [
    { term: 'Adrenal cortex', meaning: 'The outer adrenal: mineralocorticoids, glucocorticoids and androgens.' },
    { term: 'Cortisol', meaning: 'The main glucocorticoid: gluconeogenesis, protein breakdown, anti-inflammatory.' },
    { term: 'Aldosterone', meaning: 'The main mineralocorticoid: Na⁺ and water reabsorption, raising blood pressure.' },
    { term: 'Renin–angiotensin system', meaning: 'The kidney signals that control aldosterone.' },
    { term: 'Addison’s disease', meaning: 'Primary adrenal failure: too little cortisol, often too little aldosterone.' },
    { term: 'Cushing’s syndrome', meaning: 'Too much cortisol: moon face, weight gain, hypertension.' },
  ],
  'endocrinology-6': [
    { term: 'Islets of Langerhans', meaning: 'The endocrine pancreas: α cells (glucagon), β cells (insulin), δ cells (somatostatin).' },
    { term: 'Insulin', meaning: 'The storage hormone: moves glucose into cells and builds glycogen, fat and protein.' },
    { term: 'Glucagon', meaning: 'Raises blood glucose: gluconeogenic, lipolytic and ketogenic, opposite to insulin.' },
    { term: 'Diabetes mellitus', meaning: 'Lack of insulin or abnormal receptors, so all of insulin’s effects are reversed.' },
    { term: 'Ketone bodies', meaning: 'Acetoacetate, acetone and β-hydroxybutyrate, made when fat is broken down without insulin.' },
    { term: 'Hypoglycaemia', meaning: 'Low blood glucose: confusion, weakness, sweating.' },
  ],
};

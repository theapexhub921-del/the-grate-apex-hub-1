// Endocrinology Lesson 3 — Growth hormone.
//
// Lecture (Introduction, pp. 28–37): GH stimulates postnatal growth of all tissues; it is
// diabetogenic (less glucose use, more output by the liver); it acts through insulin-like growth
// factors made in the liver (somatomedins). Secretion rises with low blood sugar (exercise,
// fasting), amino acids after a protein meal, stress, fever, sleep, GHRH and sex steroids; it is
// inhibited by hyperglycaemia, cortisol, GH itself, somatostatin and pregnancy. Excess before
// puberty: gigantism (long bones lengthen before the epiphyses fuse); after puberty: acromegaly
// (bones widen — hands, feet, jaw, forehead — but no gain in height). Deficiency: pituitary
// dwarfism; no GH receptors: Laron dwarfism.
// Textbook value (labelled): a child grows about 5–6 cm a year before puberty.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const TRIGGERS = [
  { label: 'At rest', k: 1 },
  { label: 'Fasting (low blood sugar)', k: 2.5 },
  { label: 'Protein meal (amino acids)', k: 1.8 },
  { label: 'Deep sleep', k: 2.5 },
  { label: 'High blood sugar', k: 0.4 },
  { label: 'Cortisol excess', k: 0.5 },
];
export const PITUITARY = ['Deficient', 'Normal', 'Tumour (excess GH)'];
export const DIAGNOSES = ['Normal', 'Gigantism', 'Acromegaly', 'Pituitary dwarfism', 'Laron dwarfism', 'GH deficiency'];

export type GhState = SimState & { gh: number; igf: number; height: number; widen: boolean; child: boolean; diagnosis: number };

function model(values: Record<string, number>): GhState {
  const { age, pituitary, receptors, trigger } = values;
  const child = age === 0;
  const noReceptors = receptors === 0;
  const k = TRIGGERS[trigger]?.k ?? 1;
  // The pituitary's usual output; somatomedins feed back on it, so without receptors (no IGF)
  // GH runs high. A tumour secretes regardless, so triggers barely change it.
  const base = pituitary === 0 ? 0.1 : pituitary === 2 ? 4 : noReceptors ? 2.5 : 1;
  const gh = pituitary === 2 ? base * (0.85 + 0.15 * k) : base * k;
  const igf = noReceptors ? 0.1 : base ** 0.8;
  const height = child ? clamp(5.5 * igf ** 0.7, 0.5, 16) : 0; // cm a year
  const widen = !child && igf > 1.5;
  const glucoseOut = clamp(100 + 25 * (gh - 1), 60, 220);
  let diagnosis = 0;
  if (igf > 1.5) diagnosis = child ? 1 : 2;
  else if (noReceptors) diagnosis = child ? 4 : 5;
  else if (igf < 0.5) diagnosis = child ? 3 : 5;
  const notes: string[] = [];
  if (noReceptors) notes.push('GH is high, but without receptors the liver makes no somatomedins: Laron dwarfism.');
  if (diagnosis === 2) notes.push('The epiphyses have fused: the bones cannot lengthen, so they widen (subperiosteal growth) — hands, feet, jaw, forehead.');
  if (diagnosis === 1) notes.push('Before puberty the epiphyseal plates are open: the long bones lengthen.');
  return {
    readouts: { gh: Math.round(gh * 100), igf: Math.round(igf * 100), height, glucoseOut, widen: widen ? 1 : 0, diagnosis },
    notes,
    gh,
    igf,
    height,
    widen,
    child,
    diagnosis,
  };
}

const START = { age: 0, pituitary: 1, receptors: 1, trigger: 0 };

export const growthHormone: SimDefinition<GhState> = {
  id: 'growth-hormone',
  name: 'Growth hormone',
  controls: [
    { kind: 'choice', key: 'age', label: 'Age', options: [{ value: 0, label: 'Child (before puberty)' }, { value: 1, label: 'Adult (after puberty)' }] },
    { kind: 'choice', key: 'pituitary', label: 'Pituitary', options: PITUITARY.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'receptors', label: 'GH receptors', options: [{ value: 1, label: 'Normal' }, { value: 0, label: 'Absent' }] },
    { kind: 'choice', key: 'trigger', label: 'Right now', options: TRIGGERS.map((t, value) => ({ value, label: t.label })) },
  ],
  initial: START,
  readouts: [
    { key: 'gh', label: 'GH secreted', unit: '% of normal', primary: true },
    { key: 'igf', label: 'Somatomedins (IGF)', unit: '% of normal' },
    { key: 'height', label: 'Height gained', unit: 'cm/year', decimals: 1, primary: true },
    { key: 'glucoseOut', label: 'Glucose output by the liver', unit: '%' },
    { key: 'widen', label: 'Bones widen', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'diagnosis', label: 'Picture', noDelta: true, text: (v) => DIAGNOSES[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal child', values: START, caption: 'Normal GH and somatomedins: steady growth in height.' },
    { id: 'gigantism', label: 'Gigantism', values: { ...START, pituitary: 2 }, caption: 'A GH-secreting tumour before puberty: the long bones lengthen.' },
    { id: 'acromegaly', label: 'Acromegaly', values: { ...START, age: 1, pituitary: 2 }, caption: 'The same tumour after puberty: no gain in height, but hands, feet and jaw widen.' },
    { id: 'laron', label: 'Laron dwarfism', values: { ...START, receptors: 0 }, caption: 'High GH but no receptors, so no somatomedins and little growth.' },
  ],
  challenges: [
    {
      id: 'raise',
      label: 'Push GH up naturally',
      prompt: 'Without changing the pituitary, raise GH secretion to at least 240% of normal.',
      rules: ['The pituitary, receptors and age are fixed.'],
      start: START,
      locked: ['pituitary', 'receptors', 'age'],
      goals: [{ readout: 'gh', atLeast: 240, label: 'GH ≥ 240%' }],
      debrief: 'Low energy substrate (fasting, exercise) and sleep are strong stimuli for GH; high blood sugar and cortisol suppress it (Introduction, pp. 32–34).',
    },
  ],
  modelNote:
    'Simplified teaching model. The actions of GH, its stimuli and inhibitors, the somatomedins and the disorders are from the lecture (Introduction, pp. 28–37). The size of each stimulus and the growth rate (about 5–6 cm a year before puberty, a textbook value) are illustrative.',
};

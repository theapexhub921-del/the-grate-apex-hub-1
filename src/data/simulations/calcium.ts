// Endocrinology Lesson 7 — Calcium metabolism.
//
// Lecture (Calcium, pp. 2–19): plasma Ca²⁺ 2.16–2.65 mmol/L. Hypocalcaemia makes nerves more
// excitable (tetany; Chvostek’s and Trousseau’s signs); hypercalcaemia makes them less excitable
// (sluggish reflexes, weakness). Vitamin D is made in the skin (UV) and hydroxylated in the liver
// (25-) and the kidney (1α-) to 1,25-dihydroxycholecalciferol, which raises Ca²⁺ through gut,
// kidney and bone. PTH (chief cells; controlled by plasma Ca²⁺) raises Ca²⁺ and lowers phosphate:
// bone resorption, renal Ca²⁺ reabsorption, phosphate excretion and more 1,25-DHCC.
// Hypoparathyroidism (e.g. after thyroidectomy) → hypocalcaemia; treated with PTH or large doses
// of vitamin D. Primary hyperparathyroidism → hypercalcaemia, hypercalciuria, stones. Calcitonin
// lowers Ca²⁺ by suppressing osteoclasts and increasing urinary calcium.
// Textbook value (labelled): plasma phosphate ≈ 1.0 mmol/L.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const PARATHYROID = ['Normal', 'Removed (hypoparathyroidism)', 'Tumour (hyperparathyroidism)'];
export const VITAMIN_D = [
  { label: 'Deficient (no sun, poor diet)', k: 0.25 },
  { label: 'Enough', k: 1 },
  { label: 'Large doses', k: 12 },
];

export type CalciumState = SimState & { ca: number; pth: number; calcitriol: number; resorption: number; absorption: number };

function model(values: Record<string, number>): CalciumState {
  const { parathyroid, vitd, kidney, calcitonin, diet } = values;
  const dietK = [0.6, 1, 1.4][diet] ?? 1;
  let ca = 2.4;
  let pth = 1;
  let calcitriol = 1;
  let resorption = 1;
  let absorption = 1;
  let reabsorb = 1;
  // PTH and Ca²⁺ settle together: low Ca²⁺ raises PTH, and PTH raises Ca²⁺.
  for (let i = 0; i < 60; i += 1) {
    pth = parathyroid === 1 ? 0.05 : parathyroid === 2 ? 4 : clamp(Math.exp(-(ca - 2.4) / 0.08), 0.05, 12);
    calcitriol = clamp((VITAMIN_D[vitd]?.k ?? 1) * (kidney ? 0.1 : 1) * pth ** 0.6, 0.02, 12);
    absorption = dietK * (0.4 + 0.6 * Math.min(calcitriol, 3));
    resorption = pth ** 0.7 * calcitriol ** 0.2 * (calcitonin ? 0.6 : 1);
    reabsorb = pth ** 0.3;
    const target = 2.4 + 0.15 * Math.log(absorption) + 0.12 * Math.log(resorption) + 0.1 * Math.log(reabsorb) - (calcitonin ? 0.03 : 0);
    ca += 0.5 * (target - ca);
  }
  const phosphate = clamp(1.0 * pth ** -0.3 * calcitriol ** 0.15 * (kidney ? 1.6 : 1), 0.4, 3);
  const urineCa = clamp(100 * (ca / 2.4) ** 6 / reabsorb * (calcitonin ? 1.3 : 1), 5, 600);
  const nerves = ca < 2.16 ? 1 : ca > 2.65 ? 2 : 0;
  const notes: string[] = [];
  if (nerves === 1) notes.push('Low Ca²⁺ makes nerves more excitable: tetany. Tapping the facial nerve twitches the face (Chvostek’s sign); a cuff on the arm brings on carpal spasm (Trousseau’s sign).');
  if (nerves === 2) notes.push('High Ca²⁺ makes nerves less excitable: sluggish reflexes and muscle weakness.');
  if (parathyroid === 2) notes.push('Too much PTH: osteoclasts erode bone; high urinary calcium can form kidney stones.');
  if (vitd === 0 && parathyroid === 0) notes.push('Little vitamin D: less calcium absorbed from the gut, so PTH rises to hold the plasma Ca²⁺ up — at the cost of bone.');
  if (kidney) notes.push('Failing kidneys cannot make the active form (1α-hydroxylase): 1,25-DHCC falls and phosphate builds up.');
  return {
    readouts: { ca, pth: Math.round(pth * 100), calcitriol: Math.round(calcitriol * 100), phosphate, resorption: Math.round(resorption * 100), absorption: Math.round(absorption * 100), urineCa: Math.round(urineCa), nerves },
    notes,
    ca,
    pth,
    calcitriol,
    resorption,
    absorption,
  };
}

const START = { parathyroid: 0, vitd: 1, kidney: 0, calcitonin: 0, diet: 1 };
const NERVES = ['Normal', 'Excitable: tetany', 'Sluggish, weak'];

export const calcium: SimDefinition<CalciumState> = {
  id: 'calcium',
  name: 'Calcium balance',
  controls: [
    { kind: 'choice', key: 'parathyroid', label: 'Parathyroid glands', options: PARATHYROID.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'vitd', label: 'Vitamin D', options: VITAMIN_D.map((v, value) => ({ value, label: v.label })) },
    { kind: 'choice', key: 'diet', label: 'Calcium in the diet', options: [{ value: 0, label: 'Low' }, { value: 1, label: 'Normal' }, { value: 2, label: 'High' }] },
    { kind: 'choice', key: 'kidney', label: 'Kidneys', options: [{ value: 0, label: 'Healthy' }, { value: 1, label: 'Failing' }] },
    { kind: 'choice', key: 'calcitonin', label: 'Calcitonin injection', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
  ],
  initial: START,
  readouts: [
    { key: 'ca', label: 'Plasma Ca²⁺', unit: 'mmol/L', decimals: 2, primary: true },
    { key: 'pth', label: 'PTH', unit: '% of normal', primary: true },
    { key: 'calcitriol', label: '1,25-DHCC (active vitamin D)', unit: '%' },
    { key: 'phosphate', label: 'Plasma phosphate', unit: 'mmol/L', decimals: 2 },
    { key: 'absorption', label: 'Ca²⁺ absorbed from the gut', unit: '%' },
    { key: 'resorption', label: 'Bone resorption', unit: '%' },
    { key: 'urineCa', label: 'Ca²⁺ in the urine', unit: '%' },
    { key: 'nerves', label: 'Nerves and muscle', noDelta: true, text: (v) => NERVES[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'PTH and vitamin D hold plasma Ca²⁺ in its range (2.16–2.65 mmol/L).' },
    { id: 'thyroidectomy', label: 'After thyroidectomy', values: { ...START, parathyroid: 1 }, caption: 'The parathyroids were removed with the thyroid: hypocalcaemia and tetany.' },
    { id: 'hyper', label: 'Parathyroid tumour', values: { ...START, parathyroid: 2 }, caption: 'Hypercalcaemia, low phosphate, high urinary calcium.' },
    { id: 'rickets', label: 'Vitamin D deficiency', values: { ...START, vitd: 0 }, caption: 'PTH rises to hold the calcium up, taking it from bone: rickets in children, osteomalacia in adults.' },
  ],
  challenges: [
    {
      id: 'hypopara',
      label: 'Treat hypoparathyroidism',
      prompt: 'The parathyroids were removed. Without PTH, bring the plasma Ca²⁺ back into the normal range (2.16–2.65 mmol/L).',
      rules: ['The parathyroids and kidneys are fixed.'],
      start: { parathyroid: 1, vitd: 1, kidney: 0, calcitonin: 0, diet: 1 },
      locked: ['parathyroid', 'kidney'],
      goals: [{ readout: 'ca', atLeast: 2.16, atMost: 2.65, label: 'Ca²⁺ 2.16–2.65 mmol/L' }],
      debrief: 'Large doses of vitamin D (and plenty of calcium) make up for the lost PTH by increasing absorption from the gut — the lecture’s treatment for hypoparathyroidism (Calcium, p. 17).',
    },
  ],
  modelNote:
    'Simplified teaching model. The normal range, the effects of low and high calcium, the vitamin D pathway, the actions and control of PTH and calcitonin, and the treatment of hypoparathyroidism are from the lecture (Calcium, pp. 2–19). Plasma phosphate (≈ 1.0 mmol/L) is a textbook value; the sizes of the changes are illustrative.',
};

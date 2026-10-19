// Endocrinology Lesson 2 — ADH and water balance.
//
// Lecture (Introduction, pp. 11, 16–18): ADH is made in the hypothalamus (supraoptic and
// paraventricular nuclei) and released from the posterior pituitary. Its secretion rises with a
// reduced ECF volume (baroreceptors: haemorrhage, diarrhoea), with osmoreceptor stimulation in
// the hypothalamus, and with stress, trauma, pain, anxiety and fear; alcohol inhibits it. Diabetes
// insipidus (no ADH, or kidneys that do not respond — nephrogenic): polyuria, dilute urine of low
// specific gravity, dehydration and thirst. SIADH: low volume of concentrated urine, water
// retention, hyponatraemia from excess water.
// Textbook values (Guyton, labelled): plasma osmolality ≈ 285 mOsm/kg; urine 50–1200 mOsm/kg;
// ≈ 600 mOsm of solute excreted a day.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const CONDITIONS = ['Normal', 'Central diabetes insipidus', 'Nephrogenic diabetes insipidus', 'SIADH'];

export type AdhState = SimState & { adh: number; flow: number; uosm: number; condition: number };

function model(values: Record<string, number>): AdhState {
  const { water, bleed, stress, alcohol, condition } = values;
  // Plasma osmolality: water drunk dilutes it, water lost concentrates it. In DI the person loses
  // water faster than thirst replaces it; in SIADH water is retained.
  let posm = 285 - 4 * water;
  if (condition === 1 || condition === 2) posm += 8;
  if (condition === 3) posm -= 18;
  const osmDrive = Math.exp((posm - 285) / 5);
  const volumeDrive = 1 + 0.025 * bleed ** 1.5;
  let adh = 100 * osmDrive * volumeDrive * (stress ? 2 : 1) * (alcohol ? 0.3 : 1);
  if (condition === 1) adh *= 0.05;
  if (condition === 3) adh = Math.max(adh, 400);
  const response = condition === 2 ? 0.05 : 1;
  const effect = (adh * response) ** 2 / ((adh * response) ** 2 + 100 ** 2);
  const uosm = 50 + 1150 * effect;
  const flow = 600 / uosm; // L a day at ≈ 600 mOsm of solute a day
  const sg = 1 + 0.000025 * uosm;
  const na = 140 + (posm - 285) / 2;
  const thirst = posm > 289 || bleed >= 15 ? 1 : 0;
  const notes: string[] = [];
  if (condition === 1) notes.push('Central DI: the supraoptico-hypophysial system does not secrete ADH, so the urine stays dilute whatever the body needs.');
  if (condition === 2) notes.push('Nephrogenic DI: ADH is high, but the kidney does not respond to it.');
  if (condition === 3) notes.push('SIADH: ADH is secreted whatever the osmolality; retained water dilutes the sodium.');
  if (alcohol && condition === 0) notes.push('Alcohol inhibits ADH: more dilute urine.');
  return {
    readouts: { adh: Math.round(clamp(adh, 0, 999)), flow, uosm, sg, na, thirst },
    notes,
    adh,
    flow,
    uosm,
    condition,
  };
}

const START = { water: 0, bleed: 0, stress: 0, alcohol: 0, condition: 0 };

export const adhWater: SimDefinition<AdhState> = {
  id: 'adh-water',
  name: 'ADH and water balance',
  controls: [
    { kind: 'slider', key: 'water', label: 'Water drunk (+) or lost (−)', unit: 'L', min: -2, max: 2, step: 0.5 },
    { kind: 'slider', key: 'bleed', label: 'Blood lost', unit: '%', min: 0, max: 30, step: 5 },
    { kind: 'choice', key: 'stress', label: 'Pain, fear or stress', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
    { kind: 'choice', key: 'alcohol', label: 'Alcohol', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
    { kind: 'choice', key: 'condition', label: 'Condition', options: CONDITIONS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'adh', label: 'ADH secreted', unit: '% of normal', primary: true },
    { key: 'flow', label: 'Urine flow', unit: 'L/day', decimals: 1, primary: true },
    { key: 'uosm', label: 'Urine osmolality', unit: 'mOsm/kg' },
    { key: 'sg', label: 'Specific gravity', decimals: 3 },
    { key: 'na', label: 'Plasma Na⁺', unit: 'mmol/L' },
    { key: 'thirst', label: 'Thirst', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Moderate ADH: about a litre of urine a day.' },
    { id: 'haemorrhage', label: 'Haemorrhage', values: { ...START, bleed: 25 }, caption: 'The atrial volume receptors sense the lost volume: ADH rises and little concentrated urine is made.' },
    { id: 'di', label: 'Diabetes insipidus', values: { ...START, condition: 1 }, caption: 'Polyuria with dilute urine of low specific gravity; the person is thirsty.' },
    { id: 'siadh', label: 'SIADH', values: { ...START, condition: 3 }, caption: 'Little concentrated urine; water is retained and the sodium falls.' },
  ],
  challenges: [
    {
      id: 'concentrate',
      label: 'Concentrate the urine',
      prompt: 'Make the urine as concentrated as the kidney can: specific gravity at least 1.025.',
      rules: ['The condition and alcohol are fixed.'],
      start: START,
      locked: ['condition', 'alcohol'],
      goals: [{ readout: 'sg', atLeast: 1.025, label: 'Specific gravity ≥ 1.025' }],
      debrief: 'Water loss raises plasma osmolality, the hypothalamic osmoreceptors drive ADH up, and the kidney returns water to the blood, leaving a small volume of concentrated urine.',
    },
  ],
  modelNote:
    'Simplified teaching model. What raises and lowers ADH, and the urine and plasma in diabetes insipidus and SIADH, are from the lecture (Introduction, pp. 16–18). Plasma and urine osmolalities, the daily solute load and the specific gravity scale are textbook values (Guyton); the strength of each stimulus is illustrative.',
};

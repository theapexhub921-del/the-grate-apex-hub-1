// Endocrinology Lesson 4 — The thyroid axis.
//
// Lecture (Thyroid, pp. 3–16): T4 (~90% of secretion) and T3 (~10%, more potent); iodide is taken
// up by active transport and is the key factor in synthesis. Thyroid hormones raise O₂ consumption
// (BMR), heat production and body temperature, and make the heart more sensitive to
// catecholamines (more β receptors). TRH → TSH → T3/T4 with negative feedback. Locating a defect:
// a primary (thyroid) defect does not respond to TSH; a secondary one does; a hypothalamic defect
// responds to TRH; a pituitary defect does not. Hypothyroidism: cold intolerance, slow thinking;
// hyperthyroidism: heat intolerance, tremor, raised BMR.
// Textbook values (labelled): resting heart rate ≈ 72/min, temperature ≈ 37 °C. A goitre is a
// gland enlarged by TSH stimulation (textbook).
import { pct, solveAxis, type AxisLevels } from '@/data/simulations/endocrine-axis';
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const CONDITIONS = ['Normal', 'Thyroid fails (primary)', 'Pituitary fails', 'Hypothalamus fails', 'Overactive thyroid'];
export const TESTS = ['No test', 'Inject TRH', 'Inject TSH'];
export const RESULTS = ['No test', 'TSH rises', 'TSH does not rise', 'T4 rises', 'T4 does not rise'];

export type ThyroidState = SimState & AxisLevels & { goitre: number; condition: number; result: number };

function model(values: Record<string, number>): ThyroidState {
  const { condition, iodine, given, test } = values;
  const gland = (condition === 1 ? 0.15 : 1) * (iodine === 0 ? 0.35 : 1);
  const pit = condition === 2 ? 0.15 : 1;
  const hyp = condition === 3 ? 0.15 : 1;
  const levels = solveAxis({ hyp, pit, gland, autonomousGland: condition === 4 ? 3 : null, given: given / 100 });
  const t4 = levels.hormone;
  // The lecture's tests: does the next level respond to the injected hormone?
  let result = 0;
  if (test === 1) result = pit > 0.5 ? 1 : 2;
  if (test === 2) result = gland > 0.5 || condition === 4 ? 3 : 4;
  const goitre = condition === 4 ? 150 : clamp(100 * Math.sqrt(levels.trophic), 40, 300);
  const bmr = clamp(100 * t4 ** 0.5, 50, 200);
  const hr = clamp(72 * t4 ** 0.3, 45, 150);
  const temp = clamp(37 + 0.5 * Math.log2(t4), 35.5, 38.5);
  const notes: string[] = [];
  if (iodine === 0 && condition !== 4) notes.push('Without enough iodide the follicles cannot make enough hormone; the high TSH enlarges the gland (goitre).');
  if (condition === 4) notes.push('The overactive gland secretes on its own: high T4 suppresses TRH and TSH.');
  if (result === 2) notes.push('No TSH response to TRH: the defect is in the pituitary.');
  if (result === 1 && condition === 3) notes.push('TSH rises when TRH is given: the pituitary works, so the defect is in the hypothalamus.');
  if (result === 4) notes.push('The thyroid does not respond to TSH: a primary defect.');
  return {
    readouts: { trh: pct(levels.releasing), tsh: pct(levels.trophic), t4: pct(t4), bmr, hr, temp, goitre, result },
    notes,
    ...levels,
    goitre,
    condition,
    result,
  };
}

const START = { condition: 0, iodine: 1, given: 0, test: 0 };

export const thyroidAxis: SimDefinition<ThyroidState> = {
  id: 'thyroid-axis',
  name: 'The thyroid axis',
  controls: [
    { kind: 'choice', key: 'condition', label: 'Condition', options: CONDITIONS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'iodine', label: 'Iodine in the diet', options: [{ value: 1, label: 'Enough' }, { value: 0, label: 'Deficient' }] },
    { kind: 'slider', key: 'given', label: 'T4 tablets', unit: '% of normal output', min: 0, max: 200, step: 5 },
    { kind: 'choice', key: 'test', label: 'Test', options: TESTS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'trh', label: 'TRH', unit: '%' },
    { key: 'tsh', label: 'TSH', unit: '%', primary: true },
    { key: 't4', label: 'T4 in the blood', unit: '%', primary: true },
    { key: 'bmr', label: 'Metabolic rate (BMR)', unit: '%' },
    { key: 'hr', label: 'Heart rate', unit: '/min' },
    { key: 'temp', label: 'Body temperature', unit: '°C', decimals: 1 },
    { key: 'goitre', label: 'Size of the thyroid', unit: '%' },
    { key: 'result', label: 'Test result', noDelta: true, text: (v) => RESULTS[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'TRH, TSH and T4 held steady by negative feedback.' },
    { id: 'iodine', label: 'Iodine deficiency', values: { ...START, iodine: 0 }, caption: 'Low T4, high TSH and an enlarged gland.' },
    { id: 'hyper', label: 'Hyperthyroidism', values: { ...START, condition: 4 }, caption: 'High BMR, fast heart, warm: TSH is suppressed.' },
    { id: 'hypothalamic', label: 'Hypothalamic failure, TRH test', values: { ...START, condition: 3, test: 1 }, caption: 'TSH rises when TRH is injected: the defect is in the hypothalamus.' },
  ],
  challenges: [
    {
      id: 'goitre',
      label: 'Shrink the goitre',
      prompt: 'This person has a goitre. Without tablets, bring the thyroid back to under 120% of its normal size.',
      rules: ['The condition and the tablets are fixed.'],
      start: { condition: 0, iodine: 0, given: 0, test: 0 },
      locked: ['condition', 'given'],
      goals: [{ readout: 'goitre', atMost: 120, label: 'Thyroid under 120%' }],
      debrief: 'With enough iodide the follicles make enough T4 again; negative feedback brings TSH down and the gland stops being driven to enlarge.',
    },
  ],
  modelNote:
    'Simplified teaching model. T4 and T3, iodide uptake, the effects on metabolic rate, heat and the heart, the TRH → TSH → T4 axis and the TSH and TRH tests are from the lecture (Thyroid, pp. 3–16). Heart rate, temperature and goitre size are textbook-based and illustrative.',
};

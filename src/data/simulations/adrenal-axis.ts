// Endocrinology Lesson 5 — The adrenal gland.
//
// Lecture (Adrenal, pp. 4–22): CRH → ACTH → cortisol (zona fasciculata) with negative feedback.
// Cortisol promotes gluconeogenesis and counteracts insulin (hyperglycaemia) and supports
// vascular responsiveness (needed for normal BP). Aldosterone (zona glomerulosa) increases Na⁺
// and water reabsorption and K⁺ and H⁺ secretion; low renal blood flow → renin → angiotensin I →
// (ACE) angiotensin II → aldosterone. Addison’s: low Na⁺, high K⁺, low BP, hypoglycaemia,
// hyperpigmentation (ACTH has MSH activity). Cushing’s syndrome (primary) / disease (secondary,
// ACTH): hypertension, weight gain, moon face. Conn’s: Na⁺ retention, high BP, hypokalaemia,
// alkalosis. Phaeochromocytoma: episodic hypertension, palpitations.
// Textbook values (labelled): Na⁺ 135–145 and K⁺ 3.5–5.0 mmol/L; fasting glucose ≈ 5 mmol/L;
// mean arterial pressure ≈ 93 mmHg.
import { pct, solveAxis } from '@/data/simulations/endocrine-axis';
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const CONDITIONS = ['Normal', 'Addison’s disease', 'Cushing’s disease (pituitary)', 'Cushing’s syndrome (adrenal)', 'Conn’s syndrome', 'Phaeochromocytoma'];

export type AdrenalState = SimState & { cortisol: number; acth: number; aldosterone: number; renin: number; adrenaline: number; condition: number; pigment: boolean };

function model(values: Record<string, number>): AdrenalState {
  const { condition, given, bleed } = values;
  const axis = solveAxis({
    gland: condition === 1 ? 0.1 : 1,
    autonomousPit: condition === 2 ? 3 : null,
    autonomousGland: condition === 3 ? 3 : null,
    given: given / 100,
  });
  const cortisol = axis.hormone;
  const adrenaline = condition === 5 ? 6 : 1;
  // Renin, aldosterone and pressure settle together (a few rounds of the loop).
  let map = 93;
  let renin = 1;
  let aldo = 1;
  for (let i = 0; i < 40; i += 1) {
    const sensed = map - (condition === 5 ? 35 : 0); // the kidney's own perfusion pressure
    renin = clamp((bleed ? 3 : 1) * (93 / sensed) ** 4, 0.05, 20);
    aldo = condition === 4 ? 4 : condition === 1 ? 0.15 * renin : renin;
    const target = 93 + 9 * Math.log2(aldo) + 7 * Math.log2(Math.max(cortisol, 0.05)) + (condition === 5 ? 35 : 0) - (bleed ? 15 : 0);
    map += 0.5 * (clamp(target, 50, 160) - map);
  }
  const na = clamp(140 + 3 * Math.log2(aldo), 118, 146);
  const k = clamp(4.3 - 0.55 * Math.log2(aldo), 2.5, 6.8);
  const glucose = clamp(5 + 1.1 * Math.log2(Math.max(cortisol, 0.05)) + (condition === 5 ? 1 : 0), 2.5, 12);
  const hr = clamp(72 + (condition === 5 ? 40 : 0) + (map < 80 ? (80 - map) * 1.2 : 0), 50, 160);
  const pigment = axis.trophic > 2;
  const notes: string[] = [];
  if (pigment) notes.push('ACTH is very high, and ACTH has some MSH activity: the skin darkens.');
  if (condition === 1) notes.push('Addison’s: cortisol and aldosterone are both low, so Na⁺ is lost, K⁺ is kept and blood pressure falls.');
  if (condition === 4) notes.push('Conn’s: the adenoma makes aldosterone on its own; the high pressure switches renin off.');
  if (given > 0 && condition === 0) notes.push('Steroid tablets suppress CRH and ACTH, and the adrenal cortex makes less of its own.');
  return {
    readouts: { acth: pct(axis.trophic), cortisol: pct(cortisol), renin: pct(renin), aldosterone: pct(aldo), na, k, map, glucose, hr, pigment: pigment ? 1 : 0 },
    notes,
    cortisol,
    acth: axis.trophic,
    aldosterone: aldo,
    renin,
    adrenaline,
    condition,
    pigment,
  };
}

const START = { condition: 0, given: 0, bleed: 0 };

export const adrenalAxis: SimDefinition<AdrenalState> = {
  id: 'adrenal-axis',
  name: 'The adrenal gland',
  controls: [
    { kind: 'choice', key: 'condition', label: 'Condition', options: CONDITIONS.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'given', label: 'Cortisol (steroid) tablets', unit: '% of normal output', min: 0, max: 200, step: 5 },
    { kind: 'choice', key: 'bleed', label: 'Renal blood flow', options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'Low (haemorrhage)' }] },
  ],
  initial: START,
  readouts: [
    { key: 'acth', label: 'ACTH', unit: '%' },
    { key: 'cortisol', label: 'Cortisol', unit: '%', primary: true },
    { key: 'renin', label: 'Renin', unit: '%' },
    { key: 'aldosterone', label: 'Aldosterone', unit: '%', primary: true },
    { key: 'na', label: 'Plasma Na⁺', unit: 'mmol/L' },
    { key: 'k', label: 'Plasma K⁺', unit: 'mmol/L', decimals: 1 },
    { key: 'map', label: 'Mean blood pressure', unit: 'mmHg' },
    { key: 'glucose', label: 'Blood glucose', unit: 'mmol/L', decimals: 1 },
    { key: 'hr', label: 'Heart rate', unit: '/min' },
    { key: 'pigment', label: 'Skin darkening', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Cortisol and aldosterone at their normal levels.' },
    { id: 'addison', label: 'Addison’s disease', values: { ...START, condition: 1 }, caption: 'Low cortisol and aldosterone: low Na⁺, high K⁺, low BP, low glucose, dark skin.' },
    { id: 'cushing', label: 'Cushing’s disease', values: { ...START, condition: 2 }, caption: 'A pituitary tumour drives ACTH and cortisol up: high BP and glucose.' },
    { id: 'conn', label: 'Conn’s syndrome', values: { ...START, condition: 4 }, caption: 'Aldosterone from an adenoma: high BP, low K⁺, renin switched off.' },
    { id: 'pheo', label: 'Phaeochromocytoma', values: { ...START, condition: 5 }, caption: 'Catecholamines from the medulla: hypertension and palpitations.' },
  ],
  challenges: [
    {
      id: 'addison',
      label: 'Treat Addison’s disease',
      prompt: 'Replace the missing cortisol: bring cortisol to 80–130% and ACTH under 150%.',
      rules: ['Only the tablets can change.'],
      start: { condition: 1, given: 0, bleed: 0 },
      locked: ['condition', 'bleed'],
      goals: [
        { readout: 'cortisol', atLeast: 80, atMost: 130, label: 'Cortisol 80–130%' },
        { readout: 'acth', atMost: 150, label: 'ACTH under 150%' },
      ],
      debrief: 'With cortisol replaced, negative feedback turns CRH and ACTH down again — and the pigmentation fades. (Aldosterone, also missing in Addison’s, needs its own replacement.)',
    },
  ],
  modelNote:
    'Simplified teaching model. The axis, the actions of cortisol and aldosterone, the renin–angiotensin system and the features of each disorder are from the lecture (Adrenal, pp. 4–22). The normal ranges of Na⁺, K⁺, glucose and blood pressure are textbook values; the sizes of the changes are illustrative.',
};

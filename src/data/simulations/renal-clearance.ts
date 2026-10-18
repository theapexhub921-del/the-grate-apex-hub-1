// Renal Lesson 5 — Renal clearance.
//
// Lecture (slides 83–89): clearance = U × V / P. Inulin is filtered but not
// reabsorbed or secreted, so its clearance = GFR (≈ 125 ml/min). Clearance
// below inulin's means reabsorption, above means secretion, zero means
// complete reabsorption. Creatinine is slightly secreted (≈ 140 ml/min).
// PAH is filtered and secreted, ≈ 90% removed in one pass: RPF = C_PAH / 0.9;
// RBF = RPF / (1 − Hct). Glucose is completely reabsorbed below its Tm.
// Textbook (labelled): RPF ≈ 650 ml/min, Hct 45%, glucose Tm 375 mg/min,
// urea clearance about half of GFR, urine flow 1 ml/min.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const SUBSTANCES = ['Inulin', 'Creatinine', 'Glucose', 'Urea', 'PAH'];

export type ClearanceState = SimState & {
  substance: number;
  plasma: number; // mg/ml
  clearance: number;
  extraction: number; // fraction removed from the plasma passing through
  urineConc: number;
  rpf: number;
};

function model(values: Record<string, number>): ClearanceState {
  const { substance, plasma, gfr, rpf, hct } = values;
  let clearance = gfr;
  if (substance === 1) clearance = gfr * 1.12;
  if (substance === 2) clearance = Math.max(0, gfr * plasma - 375) / plasma;
  if (substance === 3) clearance = gfr * 0.5;
  if (substance === 4) clearance = Math.max(gfr, 0.9 * rpf);
  const excretion = clearance * plasma; // mg/min
  const urineFlow = 1; // ml/min
  const urineConc = excretion / urineFlow;
  const ratio = clearance / gfr;
  const versus = clearance < 0.5 ? 0 : ratio < 0.95 ? 1 : ratio <= 1.05 ? 2 : 3;
  const rbf = rpf / (1 - hct / 100);
  const notes: string[] = [];
  if (substance === 2) notes.push(clearance > 0 ? 'Filtered glucose exceeds the transport maximum: some is excreted.' : 'Glucose is filtered but completely reabsorbed: its clearance is zero.');
  if (substance === 4) notes.push('PAH is filtered and secreted — about 90% leaves the plasma in one pass: RPF = C_PAH / 0.9.');
  if (substance === 1) notes.push('Creatinine is slightly secreted, so its clearance is a little above the GFR — close enough to estimate GFR without an infusion.');
  return {
    readouts: { clearance, versus, excretion, rbf, rpf },
    notes,
    substance,
    plasma,
    clearance,
    extraction: Math.min(0.98, clearance / rpf),
    urineConc,
    rpf,
  };
}

const START = { substance: 0, plasma: 1, gfr: 125, rpf: 650, hct: 45 };

export const renalClearance: SimDefinition<ClearanceState> = {
  id: 'renal-clearance',
  name: 'Renal clearance',
  controls: [
    { kind: 'choice', key: 'substance', label: 'Substance', options: SUBSTANCES.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'plasma', label: 'Plasma concentration', unit: 'mg/ml', min: 0.2, max: 2, step: 0.1, format: (v) => v.toFixed(1) },
    { kind: 'slider', key: 'gfr', label: 'GFR', unit: 'ml/min', min: 30, max: 180, step: 5 },
    { kind: 'slider', key: 'rpf', label: 'Renal plasma flow', unit: 'ml/min', min: 300, max: 900, step: 10 },
    { kind: 'slider', key: 'hct', label: 'Haematocrit', unit: '%', min: 30, max: 60, step: 1 },
  ],
  initial: START,
  readouts: [
    { key: 'clearance', label: 'Clearance', unit: 'ml/min', primary: true },
    { key: 'versus', label: 'Compared with inulin', noDelta: true, text: (v) => ['Zero: all reabsorbed', 'Less: reabsorbed', 'Equal: filtered only', 'Greater: secreted'][v] ?? '' },
    { key: 'excretion', label: 'Excretion rate (U × V)', unit: 'mg/min', decimals: 1 },
    { key: 'rbf', label: 'Renal blood flow', unit: 'ml/min' },
    { key: 'rpf', label: 'Renal plasma flow', unit: 'ml/min', hidden: true },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'inulin', label: 'Inulin', values: START, caption: 'Clearance = GFR = 125 ml/min.' },
    { id: 'creatinine', label: 'Creatinine', values: { ...START, substance: 1 }, caption: 'Slightly secreted: about 140 ml/min.' },
    { id: 'glucose', label: 'Glucose', values: { ...START, substance: 2 }, caption: 'All reabsorbed: clearance 0.' },
    { id: 'pah', label: 'PAH', values: { ...START, substance: 4 }, caption: 'Filtered and secreted: about 90% of the renal plasma flow is cleared.' },
  ],
  challenges: [
    {
      id: 'rbf',
      label: 'Set the renal blood flow',
      prompt: 'The haematocrit is 45%. Set the renal plasma flow so that the renal blood flow is 1200 ml/min (±20).',
      rules: ['Only the renal plasma flow can change.'],
      start: { ...START, substance: 4, rpf: 560 },
      locked: ['substance', 'plasma', 'gfr', 'hct'],
      goals: [
        { readout: 'rbf', atLeast: 1180, label: 'Renal blood flow at least 1180 ml/min' },
        { readout: 'rbf', atMost: 1220, label: 'Renal blood flow at most 1220 ml/min' },
      ],
      debrief: 'RBF = RPF / (1 − Hct): plasma is only 55% of blood here, so 660 ml/min of plasma means 1200 ml/min of blood (slide 89).',
    },
  ],
  modelNote:
    'Simplified teaching model. Clearance = UV/P, inulin = GFR (≈ 125), creatinine slightly secreted (≈ 140), the meaning of clearances above and below inulin, RPF = C_PAH / 0.9 and RBF = RPF / (1 − Hct) are from the lecture (slides 83–89). RPF 650 ml/min, Hct 45%, glucose Tm 375 mg/min, urea clearance ≈ half of GFR and a urine flow of 1 ml/min are textbook values.',
};

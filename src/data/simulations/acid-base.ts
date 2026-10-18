// Renal Lesson 7 — Acid–base balance.
//
// Lecture (slides 118–162): arterial H⁺ ≈ 40 nmol/L, pH 7.36–7.44 (7.35 /
// 7.45 for the disorders); respiratory disorders change PaCO₂ (> 45 or
// < 35 mmHg), metabolic disorders change HCO₃⁻ (< 22 or > 26 mEq/L); the
// 20:1 HCO₃⁻ : H₂CO₃ ratio; the lungs compensate metabolic disorders within
// minutes (compensation for alkalosis is limited); the kidneys compensate
// respiratory disorders, slowly. Limits for life pH 7.0–7.8. Textbook
// (labelled): the Henderson–Hasselbalch equation (pK 6.1, 0.03 × PCO₂),
// the expected compensation (Winter's formula; HCO₃⁻ change per 10 mmHg
// PCO₂, acute and chronic) and ≈ 3 days for full renal compensation.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const DISORDERS = ['None', 'Respiratory acidosis', 'Respiratory alkalosis', 'Metabolic acidosis', 'Metabolic alkalosis'];

export type AcidBaseState = SimState & {
  ph: number;
  paco2: number;
  hco3: number;
  ventilation: number; // relative to normal
  renal: number; // relative acid excretion by the kidney
  disorder: number;
};

function model(values: Record<string, number>): AcidBaseState {
  const { disorder, severity, hours } = values;
  const s = severity / 100;
  let paco2 = 40;
  let hco3 = 24;
  const lungs = clamp(hours / 2, 0, 1); // minutes to hours
  const kidneys = clamp(hours / 72, 0, 1); // days
  if (disorder === 1) {
    paco2 = 40 + 30 * s;
    hco3 = 24 + (0.1 + 0.25 * kidneys) * (paco2 - 40);
  } else if (disorder === 2) {
    paco2 = 40 - 18 * s;
    hco3 = 24 - (0.2 + 0.3 * kidneys) * (40 - paco2);
  } else if (disorder === 3) {
    hco3 = 24 - 14 * s;
    paco2 = 40 + (1.5 * hco3 + 8 - 40) * lungs;
  } else if (disorder === 4) {
    hco3 = 24 + 16 * s;
    paco2 = 40 + (Math.min(55, 0.7 * hco3 + 21) - 40) * lungs;
  }
  const ph = 6.1 + Math.log10(hco3 / (0.03 * paco2));
  const h = Math.pow(10, 9 - ph);
  const notes: string[] = [];
  if (ph < 7.0 || ph > 7.8) notes.push('Outside 7.0–7.8: incompatible with life (CNS depression below, tetany and convulsions above).');
  if ((disorder === 3 || disorder === 4) && lungs > 0) notes.push(disorder === 3 ? 'Respiratory compensation: faster, deeper breathing blows off CO₂.' : 'Respiratory compensation: slower breathing retains CO₂ — limited, because low PO₂ drives breathing.');
  if ((disorder === 1 || disorder === 2) && kidneys > 0.05) notes.push(disorder === 1 ? 'Renal compensation: the kidney secretes more H⁺ and makes new HCO₃⁻ — slowly, over days.' : 'Renal compensation: the kidney reabsorbs and makes less HCO₃⁻.');
  const renal = 1 + (disorder === 1 ? 2 * kidneys * s : disorder === 2 ? -0.8 * kidneys * s : disorder === 3 ? 1.2 * s : disorder === 4 ? -0.8 * s : 0);
  return {
    readouts: { ph, paco2, hco3, h, ratio: hco3 / (0.03 * paco2), kind: disorder },
    notes,
    ph,
    paco2,
    hco3,
    ventilation: 40 / paco2,
    renal,
    disorder,
  };
}

const START = { disorder: 0, severity: 50, hours: 0 };

export const acidBase: SimDefinition<AcidBaseState> = {
  id: 'acid-base',
  name: 'Acid–base balance',
  controls: [
    { kind: 'choice', key: 'disorder', label: 'Disorder', options: DISORDERS.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'severity', label: 'Severity', unit: '%', min: 0, max: 100, step: 5 },
    { kind: 'slider', key: 'hours', label: 'Time since it began', unit: 'hours', min: 0, max: 96, step: 1, hint: 'Lungs act in minutes; kidneys take days' },
  ],
  initial: START,
  readouts: [
    { key: 'ph', label: 'pH', decimals: 2, primary: true },
    { key: 'paco2', label: 'PaCO₂', unit: 'mmHg' },
    { key: 'hco3', label: 'HCO₃⁻', unit: 'mEq/L', decimals: 1 },
    { key: 'h', label: 'H⁺', unit: 'nmol/L' },
    { key: 'ratio', label: 'HCO₃⁻ : H₂CO₃', decimals: 1, text: (v) => `${v.toFixed(1)} : 1` },
    { key: 'kind', label: 'Disorder', hidden: true },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'pH 7.40, PaCO₂ 40, HCO₃⁻ 24: a 20 : 1 ratio.' },
    { id: 'copd', label: 'Hypoventilation, 3 days on', values: { disorder: 1, severity: 50, hours: 72 }, caption: 'Respiratory acidosis, partly compensated by the kidneys.' },
    { id: 'dka', label: 'Diabetic ketoacidosis', values: { disorder: 3, severity: 70, hours: 4 }, caption: 'Metabolic acidosis with deep, fast breathing.' },
    { id: 'vomit', label: 'Vomiting', values: { disorder: 4, severity: 50, hours: 4 }, caption: 'Metabolic alkalosis; breathing slows a little.' },
  ],
  challenges: [
    {
      id: 'breathe',
      label: 'Let the lungs work',
      prompt: 'A metabolic acidosis has just started (severity 60%). Let time pass until the pH is back to 7.30 or above.',
      rules: ['The disorder and its severity are fixed.'],
      start: { disorder: 3, severity: 60, hours: 0 },
      locked: ['disorder', 'severity'],
      goals: [{ readout: 'ph', atLeast: 7.3, label: 'pH 7.30 or higher' }],
      debrief: 'Faster, deeper breathing blows off CO₂ and restores the HCO₃⁻ : H₂CO₃ ratio towards 20 : 1 within minutes — but only partly (slide 159). The kidneys must remove the acid.',
    },
  ],
  modelNote:
    'Simplified teaching model. Normal values, the four disorders and their PaCO₂ / HCO₃⁻ findings, the 20 : 1 ratio, fast respiratory and slow renal compensation and the limits for life are from the lecture (slides 118–162). The Henderson–Hasselbalch equation, the expected compensation formulas and the time course are textbook values.',
};

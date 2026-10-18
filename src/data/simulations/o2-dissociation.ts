// Respiratory Lessons 5–6 — The oxygen–haemoglobin dissociation curve and
// what shifts it.
//
// Lecture (slides 45–66): 99% of blood O₂ is on haemoglobin, 1% dissolved;
// the curve is sigmoid (cooperative binding), flat above ≈ 60 mmHg and
// steep below; P50 ≈ 26.6 mmHg; it shifts right (↓ affinity, ↑ P50) with
// ↑ temperature, ↓ pH, ↑ CO₂ and ↑ 2,3-DPG, and left with the opposite;
// fetal Hb (less 2,3-DPG binding) and myoglobin (one O₂) have higher
// affinity; CO binds Hb ≈ 210× more avidly, displaces O₂ and shifts the
// rest of the curve left. Arterial PO₂ ≈ 100, venous ≈ 40 mmHg (slide 73).
// Textbook (labelled): Hill coefficient 2.7, 1.34 ml O₂ per g Hb, 0.003 ml
// dissolved per mmHg per dl, Hb 15 g/dl, fetal P50 ≈ 19, myoglobin P50 ≈ 2.8
// mmHg, and the size of each shift.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const CARRIERS = ['Adult haemoglobin', 'Fetal haemoglobin', 'Myoglobin'];
const BASE_P50 = [26.6, 19, 2.8];
const HILL = [2.7, 2.7, 1];
export const ARTERIAL = 100;
export const TISSUE = 40;

export type DissociationState = SimState & {
  p50: number;
  hill: number;
  available: number; // fraction of Hb free to carry O₂ (CO takes the rest)
  hb: number;
  po2: number;
  carrier: number;
};

export function saturationAt(po2: number, p50: number, hill: number) {
  if (po2 <= 0) return 0;
  const r = Math.pow(p50 / po2, hill);
  return 1 / (1 + r);
}

export function contentAt(state: Pick<DissociationState, 'p50' | 'hill' | 'available' | 'hb'>, po2: number) {
  return 1.34 * state.hb * state.available * saturationAt(po2, state.p50, state.hill) + 0.003 * po2;
}

function model(values: Record<string, number>): DissociationState {
  const { po2, temp, ph, pco2, dpg, carrier, co, hb } = values;
  const kind = Math.round(carrier);
  let p50 = BASE_P50[kind] ?? 26.6;
  if (kind !== 2) {
    p50 *= Math.pow(10, -0.48 * (ph - 7.4));
    p50 *= Math.pow(10, 0.024 * (temp - 37));
    p50 *= 1 + 0.0025 * (pco2 - 40);
    p50 *= Math.pow(dpg / 100, kind === 1 ? 0.1 : 0.3);
  }
  const coFraction = clamp(co / 100, 0, 0.95);
  p50 *= 1 - 0.6 * coFraction;
  const hill = HILL[kind] ?? 2.7;
  const available = 1 - coFraction;
  const state = { p50, hill, available, hb };
  const sat = saturationAt(po2, p50, hill) * available * 100;
  const content = contentAt(state, po2);
  const dissolved = 0.003 * po2;
  const unload = contentAt(state, ARTERIAL) - contentAt(state, TISSUE);
  const notes: string[] = [];
  if (co > 0) notes.push('Carbon monoxide occupies haemoglobin (≈ 210× the affinity of O₂) and shifts the rest of the curve left: less O₂ carried and less released. The blood stays red, so there is no cyanosis.');
  if (kind === 2) notes.push('Myoglobin binds one O₂ and has a very high affinity: it holds O₂ until the PO₂ is very low.');
  if (kind === 1) notes.push('Fetal haemoglobin binds 2,3-DPG poorly, so its affinity is higher than the mother’s: O₂ passes from mother to fetus.');
  return {
    readouts: { sat, p50, content, unload, dissolvedPct: content > 0 ? (dissolved / content) * 100 : 0 },
    notes,
    p50,
    hill,
    available,
    hb,
    po2,
    carrier: kind,
  };
}

const START = { po2: 100, temp: 37, ph: 7.4, pco2: 40, dpg: 100, carrier: 0, co: 0, hb: 15 };

export const o2Dissociation: SimDefinition<DissociationState> = {
  id: 'o2-dissociation',
  name: 'Oxygen–haemoglobin dissociation curve',
  controls: [
    { kind: 'slider', key: 'po2', label: 'PO₂', unit: 'mmHg', min: 0, max: 150, step: 1, hint: 'Arterial ≈ 100, venous ≈ 40' },
    { kind: 'slider', key: 'temp', label: 'Temperature', unit: '°C', min: 34, max: 42, step: 0.5 },
    { kind: 'slider', key: 'ph', label: 'pH', min: 7.0, max: 7.7, step: 0.05, format: (v) => v.toFixed(2) },
    { kind: 'slider', key: 'pco2', label: 'PCO₂', unit: 'mmHg', min: 20, max: 80, step: 1 },
    { kind: 'slider', key: 'dpg', label: '2,3-DPG', unit: '% of normal', min: 50, max: 200, step: 5 },
    { kind: 'choice', key: 'carrier', label: 'Carrier', options: CARRIERS.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'co', label: 'Carbon monoxide (COHb)', unit: '%', min: 0, max: 60, step: 5 },
    { kind: 'slider', key: 'hb', label: 'Haemoglobin', unit: 'g/dl', min: 5, max: 20, step: 0.5 },
  ],
  initial: START,
  readouts: [
    { key: 'sat', label: 'O₂ saturation', unit: '%', primary: true },
    { key: 'p50', label: 'P50', unit: 'mmHg', decimals: 1 },
    { key: 'content', label: 'O₂ content', unit: 'ml/dl', decimals: 1 },
    { key: 'unload', label: 'Released, 100 → 40 mmHg', unit: 'ml/dl', decimals: 1 },
    { key: 'dissolvedPct', label: 'Carried dissolved', unit: '%', decimals: 1 },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Arterial blood', values: START, caption: 'At 100 mmHg haemoglobin is nearly saturated; only about 1% of the O₂ is dissolved.' },
    { id: 'venous', label: 'Venous blood', values: { ...START, po2: 40 }, caption: 'At 40 mmHg haemoglobin is still about 75% saturated — a reserve.' },
    { id: 'exercise', label: 'Exercising muscle', values: { ...START, po2: 40, temp: 39, ph: 7.25, pco2: 55 }, caption: 'Hot, acid, high-CO₂ muscle shifts the curve right: more O₂ is released.' },
    { id: 'fetal', label: 'Fetal haemoglobin', values: { ...START, carrier: 1 }, caption: 'Left of adult haemoglobin: takes O₂ from the mother.' },
    { id: 'co', label: 'CO poisoning', values: { ...START, co: 40 }, caption: 'Less haemoglobin free for O₂, and what is left holds on tighter.' },
  ],
  challenges: [
    {
      id: 'exercise',
      label: 'Feed exercising muscle',
      prompt: 'Make haemoglobin release at least 6.5 ml O₂ per dl of blood between the lungs (100 mmHg) and the tissues (40 mmHg).',
      rules: ['PO₂, the carrier, CO and haemoglobin are fixed. Change temperature, pH, PCO₂ and 2,3-DPG.'],
      start: START,
      locked: ['po2', 'carrier', 'co', 'hb'],
      goals: [{ readout: 'unload', atLeast: 6.5, label: 'At least 6.5 ml/dl released' }],
      debrief: 'A rise in temperature, CO₂ and 2,3-DPG and a fall in pH shift the curve right, so haemoglobin gives up much more O₂ in the tissues — exactly what active muscle produces (slides 56–58).',
    },
  ],
  modelNote:
    'Simplified teaching model. The shape of the curve, P50 26.6 mmHg, the factors that shift it, fetal Hb, myoglobin and CO (≈ 210×) are from the lecture (slides 45–66). The Hill coefficient, 1.34 ml O₂/g Hb, dissolved O₂ (0.003 ml/dl/mmHg), Hb 15 g/dl, fetal and myoglobin P50 and the size of each shift are textbook values.',
};

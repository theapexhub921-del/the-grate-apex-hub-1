// Lesson 8 — Cerebral blood flow: autoregulation, CO₂ and intracranial pressure.
//
// Lecture (Regional Circulation slides 21–25; Regulation slides 35–36):
// autoregulation is prominent; a rise in PCO₂ dilates cerebral vessels
// (Gravity slide 5); the Monro–Kellie doctrine means a rise in
// intracranial pressure compresses the vessels; above about 33 mmHg it
// triggers Cushing’s reflex — a rise in BP with reflex bradycardia.
// The autoregulation range used (perfusion pressure 60–140 mmHg) is from
// Guyton; the lecture does not give one.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const PLATEAU_LOW = 60;
export const PLATEAU_HIGH = 140;
export const CUSHING_ICP = 33;

// Flow (% of normal) at a given perfusion pressure, before the CO₂ effect.
export function autoregulated(cpp: number) {
  if (cpp <= 0) return 0;
  if (cpp < PLATEAU_LOW) return (100 * cpp) / PLATEAU_LOW;
  if (cpp <= PLATEAU_HIGH) return 100;
  return 100 * (1 + (cpp - PLATEAU_HIGH) / 100);
}

export function co2Factor(co2: number) {
  return clamp(1 + 0.03 * (co2 - 40), 0.4, 2);
}

export type CerebralState = SimState & {
  map: number; // after Cushing’s reflex
  cpp: number;
  flow: number;
  co2: number;
  icp: number;
  cushing: boolean;
};

function model(values: Record<string, number>): CerebralState {
  const cushing = values.icp > CUSHING_ICP;
  const map = cushing ? values.map + 1.5 * (values.icp - CUSHING_ICP) : values.map;
  const hr = cushing ? Math.max(40, 70 - 1.2 * (values.icp - CUSHING_ICP)) : 70;
  const cpp = map - values.icp;
  const flow = autoregulated(cpp) * co2Factor(values.co2);
  const notes: string[] = [];
  if (cushing) notes.push('Intracranial pressure is above about 33 mmHg: Cushing’s reflex raises the BP to keep the medulla perfused, and the baroreceptors slow the heart (slides 35–36).');
  if (cpp < PLATEAU_LOW) notes.push('Perfusion pressure is below the autoregulation range: flow now falls with pressure.');
  return {
    readouts: { flow, cpp, map, hr, cushing: cushing ? 1 : 0, status: flow >= 80 ? 0 : flow >= 50 ? 1 : 2 },
    notes,
    map,
    cpp,
    flow,
    co2: values.co2,
    icp: values.icp,
    cushing,
  };
}

const NORMAL = { map: 93, co2: 40, icp: 10 };

export const cerebralFlow: SimDefinition<CerebralState> = {
  id: 'cerebral-flow',
  name: 'Cerebral blood flow',
  controls: [
    { kind: 'slider', key: 'map', label: 'Mean arterial pressure', unit: 'mmHg', min: 40, max: 180, step: 1 },
    { kind: 'slider', key: 'co2', label: 'Arterial PCO₂', unit: 'mmHg', min: 20, max: 70, step: 1, hint: 'CO₂ dilates cerebral vessels' },
    { kind: 'slider', key: 'icp', label: 'Intracranial pressure', unit: 'mmHg', min: 0, max: 60, step: 1, hint: 'Tumour, clot or hydrocephalus raise it' },
  ],
  initial: NORMAL,
  readouts: [
    { key: 'flow', label: 'Brain flow vs normal', unit: '%', primary: true },
    { key: 'cpp', label: 'Perfusion pressure', unit: 'mmHg' },
    { key: 'map', label: 'Mean BP', unit: 'mmHg' },
    { key: 'hr', label: 'Heart rate', unit: '/min' },
    { key: 'status', label: 'Brain', noDelta: true, text: (v) => ['Well perfused', 'Reduced — dizzy', 'Very low — fainting'][v] ?? '' },
    { key: 'cushing', label: 'Cushing’s reflex', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: NORMAL, caption: 'Perfusion pressure = arterial pressure − intracranial pressure. Flow sits on the flat part of the curve.' },
    { id: 'low', label: 'BP falls to 75', values: { ...NORMAL, map: 75 }, caption: 'Autoregulation: the vessels dilate and flow barely changes (Regional Circulation slide 23).' },
    { id: 'shock', label: 'Severe hypotension', values: { ...NORMAL, map: 50 }, caption: 'Below the autoregulation range flow falls with pressure — dizziness, then fainting.' },
    { id: 'hyperventilate', label: 'Hyperventilation', values: { ...NORMAL, co2: 25 }, caption: 'Blowing off CO₂ constricts cerebral vessels, so flow falls.' },
    { id: 'hypercapnia', label: 'High CO₂', values: { ...NORMAL, co2: 60 }, caption: 'A rise in PCO₂ dilates cerebral vessels and raises flow (Gravity slide 5).' },
    { id: 'icp', label: 'Raised ICP', values: { ...NORMAL, icp: 45 }, caption: 'The skull cannot expand (Monro–Kellie), so vessels are compressed; above ~33 mmHg Cushing’s reflex raises BP with bradycardia (slides 22–23).' },
  ],
  challenges: [
    {
      id: 'perfuse',
      label: 'Protect the brain',
      prompt: 'Intracranial pressure is 30 mmHg and mean BP has fallen to 75 mmHg. Bring cerebral blood flow back to 95–105% of normal.',
      rules: ['Intracranial pressure and CO₂ are locked: you can only change the BP.'],
      start: { map: 75, co2: 40, icp: 30 },
      locked: ['co2', 'icp'],
      goals: [{ readout: 'flow', atLeast: 95, atMost: 105, label: 'Cerebral flow 95–105%' }],
      debrief:
        'Perfusion pressure is arterial pressure minus intracranial pressure. Once it is back above about 60 mmHg, autoregulation holds flow steady. With raised ICP the brain needs a higher BP — exactly what Cushing’s reflex provides when ICP rises further.',
    },
  ],
  modelNote:
    'Simplified teaching model. The lecture says autoregulation is prominent and CO₂ dilates cerebral vessels; the autoregulation range (60–140 mmHg perfusion pressure) and the size of the CO₂ effect are textbook (Guyton) values.',
};

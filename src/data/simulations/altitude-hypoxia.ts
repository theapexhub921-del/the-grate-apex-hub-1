// Respiratory Lesson 9 — Altitude, acclimatisation, hypoxia and cyanosis.
//
// Lecture (slides 113–127): four types of hypoxia — hypoxic (low arterial
// PO₂: altitude), anaemic (anaemia, CO), stagnant (slow flow: shock) and
// histotoxic (cyanide). Above ≈ 3000 m the PO₂ falls to ≈ 60 mmHg.
// Hypoxia stimulates the chemoreceptors (hyperventilation); acclimatisation
// adds H⁺ transport into the CSF (3–4 days), more 2,3-DPG (right shift) and
// more erythropoietin and haemoglobin. Cyanosis appears at ≈ 5 g/dl of
// reduced haemoglobin; none in anaemia, CO poisoning or histotoxic hypoxia;
// peripheral cyanosis with slow flow. Alveolar PO₂ cannot exceed ≈ 149 mmHg
// breathing air at sea level (slide 75). Textbook (labelled): barometric
// pressure falling by half at ≈ 5500 m, the alveolar gas equation, Hb
// 15 g/dl, 1.34 ml O₂/g, 5 ml/dl tissue extraction; the size and timing of
// acclimatisation are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const PROBLEMS = ['None', 'Anaemia (Hb 7 g/dl)', 'CO poisoning (40%)', 'Shock (slow blood flow)', 'Cyanide'];
export const HYPOXIA_TYPES = ['None', 'Hypoxic', 'Anaemic', 'Stagnant', 'Histotoxic'];

export type AltitudeState = SimState & {
  altitude: number;
  pao2: number;
  sat: number;
  hb: number;
  reduced: number;
  cyanosis: boolean;
  type: number;
};

function model(values: Record<string, number>): AltitudeState {
  const { altitude, days, fio2, problem } = values;
  const patm = 760 * Math.exp(-altitude / 8000);
  const pio2 = (patm - 47) * (fio2 / 100);
  const drive = pio2 < 120 ? (120 - pio2) / 80 : 0;
  const acclimatised = clamp(days / 4, 0, 1);
  const ventFactor = 1 + 0.5 * drive + 0.6 * drive * acclimatised;
  const paco2 = 40 / ventFactor;
  const pao2 = clamp(pio2 - paco2 / 0.8, 20, 650);
  // 2,3-DPG rises with acclimatisation: a small right shift.
  const p50 = 26.6 * (1 + 0.1 * clamp(days / 3, 0, 1)) * (problem === 2 ? 0.76 : 1);
  const saturation = 1 / (1 + Math.pow(p50 / pao2, 2.7));
  const baseHb = problem === 1 ? 7 : 15;
  const hb = baseHb + (altitude > 1500 ? 3 * clamp(days / 10, 0, 1) * clamp((altitude - 1500) / 3500, 0, 1) : 0);
  const usable = problem === 2 ? 0.6 : 1;
  const content = 1.34 * hb * usable * saturation + 0.003 * pao2;
  const flow = problem === 3 ? 0.4 : 1;
  const delivery = (content * flow) / (1.34 * 15 * 0.973 + 0.3) * 100;
  // Tissues take what they need (5 ml/dl at normal flow) unless they cannot use it.
  const extraction = problem === 4 ? 0 : Math.min(content * 0.9, 5 / flow);
  const used = problem === 4 ? 0 : clamp((extraction * flow) / 5, 0, 1) * 100;
  // Average reduced (deoxygenated) haemoglobin in the capillaries.
  const reduced = hb * usable * (1 - saturation) + extraction / 1.34 / 2;
  const cyanosis = reduced >= 5 && problem !== 2;
  const type = problem > 0 ? problem + 1 - (problem >= 2 ? 1 : 0) : pao2 < 60 ? 1 : 0;
  const notes: string[] = [];
  if (pao2 < 60 && problem === 0) notes.push('Hypoxic hypoxia: the arterial PO₂ is low, on the steep part of the dissociation curve.');
  if (problem === 1) notes.push('Anaemic hypoxia: too little haemoglobin to become blue — no cyanosis.');
  if (problem === 2) notes.push('CO poisoning: carboxyhaemoglobin is cherry red — no cyanosis, though the tissues are short of O₂.');
  if (problem === 3) notes.push('Stagnant hypoxia: slow flow lets tissues strip more O₂ from each pass — peripheral cyanosis.');
  if (problem === 4) notes.push('Histotoxic hypoxia: cyanide stops the cells using O₂; blood O₂ stays high, so no cyanosis.');
  if (days >= 3 && altitude > 1500) notes.push('Acclimatisation: more breathing (H⁺ moved into the CSF), more 2,3-DPG and more haemoglobin.');
  return {
    readouts: { pao2, sat: saturation * usable * 100, content, delivery, used, reduced, cyanosis: cyanosis ? 1 : 0, type, paco2 },
    notes,
    altitude,
    pao2,
    sat: saturation,
    hb,
    reduced,
    cyanosis,
    type,
  };
}

const START = { altitude: 0, days: 0, fio2: 21, problem: 0 };

export const altitudeHypoxia: SimDefinition<AltitudeState> = {
  id: 'altitude-hypoxia',
  name: 'Altitude and hypoxia',
  controls: [
    { kind: 'slider', key: 'altitude', label: 'Altitude', unit: 'm', min: 0, max: 8000, step: 100 },
    { kind: 'slider', key: 'days', label: 'Days at this altitude', min: 0, max: 30, step: 1 },
    { kind: 'slider', key: 'fio2', label: 'Inspired O₂', unit: '%', min: 21, max: 100, step: 1, hint: '21% = room air' },
    { kind: 'choice', key: 'problem', label: 'Other problem', options: PROBLEMS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'pao2', label: 'Arterial PO₂', unit: 'mmHg', primary: true },
    { key: 'sat', label: 'O₂ saturation', unit: '%' },
    { key: 'content', label: 'O₂ content', unit: 'ml/dl', decimals: 1 },
    { key: 'delivery', label: 'O₂ delivered to tissues', unit: '% of normal' },
    { key: 'used', label: 'O₂ used by cells', unit: '% of need' },
    { key: 'reduced', label: 'Reduced Hb in capillaries', unit: 'g/dl', decimals: 1 },
    { key: 'cyanosis', label: 'Cyanosis', noDelta: true, text: (v) => (v ? 'Present' : 'Absent') },
    { key: 'type', label: 'Hypoxia', noDelta: true, text: (v) => HYPOXIA_TYPES[v] ?? '' },
    { key: 'paco2', label: 'Arterial PCO₂', unit: 'mmHg', hidden: true },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'sea', label: 'Sea level', values: START, caption: 'Breathing air at sea level: PO₂ about 100, saturation about 97%.' },
    { id: 'mountain', label: '5000 m, just arrived', values: { ...START, altitude: 5000 }, caption: 'Low barometric pressure: hypoxic hypoxia and cyanosis.' },
    { id: 'acclimatised', label: '5000 m, 3 weeks later', values: { ...START, altitude: 5000, days: 21 }, caption: 'More breathing, more 2,3-DPG and more haemoglobin restore O₂ content.' },
    { id: 'anaemia', label: 'Anaemia', values: { ...START, problem: 1 }, caption: 'Normal PO₂ and saturation, but little O₂ carried — and no cyanosis.' },
    { id: 'cyanide', label: 'Cyanide', values: { ...START, problem: 4 }, caption: 'Plenty of O₂ delivered, none used.' },
  ],
  challenges: [
    {
      id: 'summit',
      label: 'Oxygen on the mountain',
      prompt: 'A climber has just arrived at 5000 m. Using supplementary oxygen only, bring the saturation up to at least 95%.',
      rules: ['Altitude, days and other problems are fixed. Change the inspired O₂.'],
      start: { altitude: 5000, days: 0, fio2: 21, problem: 0 },
      locked: ['altitude', 'days', 'problem'],
      goals: [{ readout: 'sat', atLeast: 95, label: 'Saturation at least 95%' }],
      debrief: 'Raising the inspired O₂ fraction restores the alveolar and arterial PO₂ that the low barometric pressure took away — rest or O₂ also treats mountain sickness (slide 121).',
    },
  ],
  modelNote:
    'Simplified teaching model. The types of hypoxia, cyanosis at ≈ 5 g/dl reduced Hb (and when it is absent), PO₂ ≈ 60 mmHg above 3000 m and the steps of acclimatisation are from the lecture (slides 113–127). Barometric pressure with altitude, the alveolar gas equation, Hb 15 g/dl, 1.34 ml O₂/g and 5 ml/dl extraction are textbook values; the size and timing of acclimatisation are illustrative.',
};

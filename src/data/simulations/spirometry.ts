// Respiratory Lesson 2 — Lung volumes and capacities on a spirometer.
//
// Lecture (slides 17–26): TV ≈ 500 ml; VC = IRV + TV + ERV, IC = TV + IRV,
// FRC = ERV + RV; FEV1 ≈ 83% of VC; spirometry cannot measure RV; VC is
// larger in athletes and standing, smaller lying down (abdominal contents
// push the diaphragm up), with chest paralysis and with lung disease such
// as fibrosis. IRV, ERV and RV values are textbook (Guyton: 3000, 1100,
// 1200 ml); the size of each change is illustrative.
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const PEOPLE = ['Healthy adult', 'Athlete', 'Lung fibrosis', 'Chest paralysis'];
export const POSTURES = ['Standing', 'Lying down'];

export type SpiroState = SimState & {
  tv: number;
  irv: number;
  erv: number;
  rv: number;
  person: number;
  posture: number;
};

function model(values: Record<string, number>): SpiroState {
  const { person, posture, tidal } = values;
  let irv = 3000;
  let erv = 1100;
  let rv = 1200;
  if (person === 1) {
    irv += 800;
    erv += 200;
  }
  if (person === 2) {
    irv *= 0.5;
    erv *= 0.6;
    rv *= 0.8;
  }
  if (person === 3) {
    irv *= 0.4;
    erv *= 0.3;
  }
  if (posture === 1) {
    erv -= 300;
    irv -= 100;
  }
  const tv = tidal;
  // A bigger tidal breath comes out of the inspiratory reserve.
  irv = Math.max(0, irv - (tv - 500));
  const vc = irv + tv + erv;
  const notes: string[] = [];
  if (posture === 1) notes.push('Lying down, the abdominal contents push the diaphragm up: less air can be breathed out, so the vital capacity is smaller.');
  if (person === 2) notes.push('Fibrosis stops the lungs expanding: both reserve volumes, and so the vital capacity, fall.');
  notes.push('The residual volume never leaves the lungs, so a simple spirometer cannot measure it (or the FRC and TLC that include it).');
  return {
    readouts: {
      vc,
      tv,
      irv,
      erv,
      rv,
      ic: tv + irv,
      frc: erv + rv,
      tlc: vc + rv,
      fev1: 0.83 * vc,
      minute: (12 * tv) / 1000,
    },
    notes,
    tv,
    irv,
    erv,
    rv,
    person,
    posture,
  };
}

const START = { person: 0, posture: 0, tidal: 500 };

export const spirometry: SimDefinition<SpiroState> = {
  id: 'spirometry',
  name: 'Spirometer',
  controls: [
    { kind: 'choice', key: 'person', label: 'Person', options: PEOPLE.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'posture', label: 'Posture', options: POSTURES.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'tidal', label: 'Tidal volume', unit: 'ml', min: 300, max: 1500, step: 50, hint: 'Air moved in each ordinary breath' },
  ],
  initial: START,
  readouts: [
    { key: 'vc', label: 'Vital capacity', unit: 'ml', primary: true },
    { key: 'fev1', label: 'FEV1 (1 s)', unit: 'ml' },
    { key: 'irv', label: 'Inspiratory reserve', unit: 'ml' },
    { key: 'erv', label: 'Expiratory reserve', unit: 'ml' },
    { key: 'rv', label: 'Residual volume', unit: 'ml' },
    { key: 'frc', label: 'Functional residual capacity', unit: 'ml' },
    { key: 'ic', label: 'Inspiratory capacity', unit: 'ml', hidden: true },
    { key: 'tlc', label: 'Total lung capacity', unit: 'ml', hidden: true },
    { key: 'tv', label: 'Tidal volume', unit: 'ml', hidden: true },
    { key: 'minute', label: 'Minute volume (12 breaths/min)', unit: 'L/min', decimals: 1 },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'healthy', label: 'Healthy adult', values: START, caption: 'VC = IRV + TV + ERV. FEV1 is about 83% of it.' },
    { id: 'athlete', label: 'Athlete', values: { ...START, person: 1 }, caption: 'Training increases the vital capacity.' },
    { id: 'lying', label: 'Lying down', values: { ...START, posture: 1 }, caption: 'The diaphragm is pushed up: ERV and VC fall.' },
    { id: 'fibrosis', label: 'Fibrosis', values: { ...START, person: 2 }, caption: 'Stiff lungs cannot expand fully: the vital capacity falls.' },
  ],
  challenges: [
    {
      id: 'biggest',
      label: 'The biggest vital capacity',
      prompt: 'Find a person and posture with a vital capacity of at least 5500 ml.',
      rules: ['Keep the tidal volume at 500 ml.'],
      start: { person: 0, posture: 1, tidal: 500 },
      locked: ['tidal'],
      goals: [{ readout: 'vc', atLeast: 5500, label: 'Vital capacity at least 5500 ml' }],
      debrief: 'The vital capacity is largest in athletes and when standing (slides 23, 25).',
    },
  ],
  modelNote:
    'Simplified teaching model. TV 500 ml, FEV1 ≈ 83% of VC and the factors that change VC are from the lecture (slides 19–26). IRV, ERV and RV are textbook values (Guyton); the sizes of the changes and the 12 breaths a minute are illustrative. FEV1 is shown as 83% of VC throughout (the lecture’s figure for restrictive disease is disputed and not used).',
};

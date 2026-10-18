// Respiratory Lesson 4 — Dead space and alveolar ventilation.
//
// Lecture (slides 20, 37–39): minute volume = rate × tidal volume; of a
// 500 ml breath about 150 ml stays in the dead space and about 350 ml
// reaches the alveoli; the dead space is a fixed amount taken from every
// breath, so shallow breathing reduces and deep breathing increases
// alveolar ventilation. The resting rate of 12 a minute and the snorkel
// are illustrative.
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const ANATOMICAL_DEAD_SPACE = 150;

export type VentilationState = SimState & {
  rate: number;
  tidal: number;
  dead: number;
  perBreath: number;
};

function model(values: Record<string, number>): VentilationState {
  const { rate, tidal, extra } = values;
  const dead = ANATOMICAL_DEAD_SPACE + extra;
  const perBreath = Math.max(0, tidal - dead);
  const minute = (rate * tidal) / 1000;
  const alveolar = (rate * perBreath) / 1000;
  const notes: string[] = [];
  if (perBreath === 0) notes.push('Each breath is no bigger than the dead space: no fresh air reaches the alveoli at all.');
  else if (tidal < 300) notes.push('Shallow breathing: most of each breath only fills the dead space.');
  if (extra > 0) notes.push('Breathing through a tube adds to the anatomical dead space.');
  return {
    readouts: { alveolar, minute, deadVent: minute - alveolar, perBreath },
    notes,
    rate,
    tidal,
    dead,
    perBreath,
  };
}

const START = { rate: 12, tidal: 500, extra: 0 };

export const alveolarVentilation: SimDefinition<VentilationState> = {
  id: 'alveolar-ventilation',
  name: 'Dead space and alveolar ventilation',
  controls: [
    { kind: 'slider', key: 'rate', label: 'Breathing rate', unit: '/min', min: 4, max: 40, step: 1 },
    { kind: 'slider', key: 'tidal', label: 'Tidal volume', unit: 'ml', min: 150, max: 1500, step: 25 },
    { kind: 'slider', key: 'extra', label: 'Extra dead space (snorkel tube)', unit: 'ml', min: 0, max: 500, step: 25 },
  ],
  initial: START,
  readouts: [
    { key: 'alveolar', label: 'Alveolar ventilation', unit: 'L/min', decimals: 1, primary: true },
    { key: 'minute', label: 'Minute volume', unit: 'L/min', decimals: 1 },
    { key: 'deadVent', label: 'Wasted on dead space', unit: 'L/min', decimals: 1 },
    { key: 'perBreath', label: 'Fresh air per breath', unit: 'ml' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'rest', label: 'Quiet breathing', values: START, caption: '500 ml × 12 = 6 L/min, but only 350 ml of each breath reaches the alveoli.' },
    { id: 'shallow', label: 'Rapid, shallow', values: { ...START, rate: 24, tidal: 250 }, caption: 'Same minute volume, but most of each breath is dead space.' },
    { id: 'deep', label: 'Slow, deep', values: { ...START, rate: 6, tidal: 1000 }, caption: 'Same minute volume, more of it reaches the alveoli.' },
    { id: 'snorkel', label: 'Snorkel', values: { ...START, extra: 300 }, caption: 'The tube adds dead space: each breath delivers less fresh air.' },
  ],
  challenges: [
    {
      id: 'snorkel',
      label: 'Breathe through a snorkel',
      prompt: 'A 300 ml snorkel is fitted. Get alveolar ventilation back to at least 4.2 L/min while keeping the minute volume no more than 9 L/min.',
      rules: ['The snorkel stays on. Change the rate and depth of breathing.'],
      start: { rate: 12, tidal: 500, extra: 300 },
      locked: ['extra'],
      goals: [
        { readout: 'alveolar', atLeast: 4.2, label: 'Alveolar ventilation at least 4.2 L/min' },
        { readout: 'minute', atMost: 9, label: 'Minute volume no more than 9 L/min' },
      ],
      debrief: 'Breathing deeper rather than faster: the dead space is taken from every breath, so fewer, bigger breaths waste less (slide 39).',
    },
  ],
  modelNote:
    'Simplified teaching model. Minute volume = rate × tidal volume, and the 500/150/350 ml split, are from the lecture (slides 20, 39). The resting rate of 12 a minute and the snorkel are illustrative.',
};

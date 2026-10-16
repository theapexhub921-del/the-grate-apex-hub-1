// CNS Lesson 4 — Fast and slow pain, and how the body turns pain down.
//
// Lecture (Sensory II, pp. 16–24): fast pain — Aδ, sharp, rapid onset;
// slow pain — C, builds steadily and lasts, because its transmitter,
// substance P, is slow to build up and slow to be destroyed. Local
// suppression: large tactile fibres from the same area depress pain
// transmission (rubbing, liniment, acupuncture). The brain’s analgesic
// system (periaqueductal grey, raphe magnus, dorsal horn) uses endorphins,
// dynorphins and enkephalin. Time courses and sizes are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const SPAN = 20; // seconds shown

export function fastAt(injury: number, t: number) {
  return injury * Math.exp(-t / 1.5);
}

// Substance P builds up and clears slowly.
export function slowAt(injury: number, t: number) {
  return injury * (1 - Math.exp(-t / 3)) * (0.75 + 0.25 * Math.exp(-t / 40));
}

export function gateFactor(rubbing: number) {
  return 1 - (0.5 * rubbing) / 100;
}

export function opioidFactor(analgesia: number) {
  return 1 - (0.7 * analgesia) / 100;
}

export type PainState = SimState & {
  t: number;
  factor: number;
  fast: number;
  slow: number;
  // Felt pain over the whole trace, for the drawing.
  fastTrace: [number, number][];
  slowTrace: [number, number][];
};

function model(values: Record<string, number>): PainState {
  const { injury, t, rubbing, analgesia } = values;
  const factor = gateFactor(rubbing) * opioidFactor(analgesia);
  const fast = fastAt(injury, t) * factor;
  const slow = slowAt(injury, t) * factor;
  const fastTrace: [number, number][] = [];
  const slowTrace: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const time = (SPAN * i) / 120;
    fastTrace.push([time, fastAt(injury, time) * factor]);
    slowTrace.push([time, slowAt(injury, time) * factor]);
  }
  const notes: string[] = [];
  if (rubbing > 0) notes.push('Rubbing excites large touch fibres, which inhibit pain transmission from the same area in the dorsal horn (local suppression).');
  if (analgesia > 0) notes.push('Endorphins, dynorphins and enkephalin act in the periaqueductal grey and the dorsal horn to suppress pain.');
  return {
    readouts: {
      felt: clamp(fast + slow, 0, 200),
      fast,
      slow,
      blocked: 100 * (1 - factor),
      dominant: slow > fast ? 1 : 0,
    },
    notes,
    t,
    factor,
    fast,
    slow,
    fastTrace,
    slowTrace,
  };
}

const START = { injury: 70, t: 0.5, rubbing: 0, analgesia: 0 };

export const painGate: SimDefinition<PainState> = {
  id: 'pain-gate',
  name: 'Fast pain, slow pain',
  controls: [
    { kind: 'slider', key: 'injury', label: 'Size of the injury', unit: '%', min: 0, max: 100, step: 1 },
    { kind: 'slider', key: 't', label: 'Time since the injury', unit: 's', min: 0, max: SPAN, step: 0.1 },
    { kind: 'slider', key: 'rubbing', label: 'Rubbing the area', unit: '%', min: 0, max: 100, step: 1, hint: 'Large touch fibres from the same area' },
    { kind: 'slider', key: 'analgesia', label: 'Brain’s analgesic system', unit: '%', min: 0, max: 100, step: 1, hint: 'Endorphins, dynorphins, enkephalin' },
  ],
  initial: START,
  readouts: [
    { key: 'felt', label: 'Pain felt', primary: true, decimals: 0 },
    { key: 'fast', label: 'Fast pain', decimals: 0 },
    { key: 'slow', label: 'Slow pain', decimals: 0 },
    { key: 'blocked', label: 'Transmission blocked', unit: '%' },
    { key: 'dominant', label: 'Main pain now', noDelta: true, text: (v) => (v ? 'Slow: burning, aching' : 'Fast: sharp, pricking') },
  ],
  model,
  scenarios: [
    { id: 'stub', label: 'Just after the injury', values: START, caption: 'Fast pain arrives first along Aδ fibres: sharp and well localised.' },
    { id: 'later', label: '10 s later', values: { ...START, t: 10 }, caption: 'Fast pain has faded; slow pain, carried by C fibres with substance P, has built up and lingers.' },
    { id: 'rub', label: 'Rub it', values: { ...START, t: 10, rubbing: 80 }, caption: 'Touch fibres from the same area inhibit pain transmission in the dorsal horn.' },
    { id: 'opiate', label: 'Analgesic system', values: { ...START, t: 10, analgesia: 80 }, caption: 'The brain’s own opiates act in the periaqueductal grey, raphe magnus and dorsal horn.' },
  ],
  challenges: [
    {
      id: 'ease',
      label: 'Ease the ache',
      prompt: 'Ten seconds after a big knock, the slow pain is building. Bring the pain felt down to 30 or less.',
      rules: ['The injury and time are fixed. The analgesic system can only be pushed to 50%.'],
      start: { injury: 80, t: 10, rubbing: 0, analgesia: 0 },
      locked: ['injury', 't'],
      limits: { analgesia: { max: 50 } },
      goals: [{ readout: 'felt', atMost: 30, label: 'Pain felt 30 or less' }],
      debrief: 'Neither on its own is enough here: rubbing (local suppression) and the descending analgesic system act at different places, so their effects multiply.',
    },
  ],
  modelNote:
    'Simplified teaching model. Fast versus slow pain, substance P, local suppression and the analgesic system are from Sensory II, pp. 16–24; the time courses and the size of each effect are illustrative.',
};

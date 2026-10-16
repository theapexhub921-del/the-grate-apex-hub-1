// CNS Lesson 6 — Upper versus lower motor neuron lesions, and spinal shock.
//
// Lecture (Motor Activity): LMN — flaccid paralysis, atrophy, reflexes
// reduced, fibrillation; UMN — spastic paralysis, no atrophy, reflexes
// exaggerated (slide 19; the arrows are clarified from Guyton). Damage
// next to the motor cortex: hypotonia followed by spasticity (slide 14).
// Complete transection: spinal shock — paralysis and depression of all
// reflexes below the cut for about 2 weeks, then spasticity (slides 14,
// 17). Hemisection: Brown-Séquard. Timings other than the 2 weeks and the
// amounts are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const LESIONS = ['None', 'Stroke: left motor cortex (UMN)', 'Right femoral nerve (LMN)', 'Whole cord at T10', 'Right half of cord at T10'];
export const TONES = ['Flaccid', 'Normal', 'Spastic'];
export const REFLEXES = ['Absent', 'Reduced', 'Normal', 'Brisk'];
export const SHOCK_DAYS = 14;
const CORTICAL_DAYS = 7; // hypotonia before spasticity after a cortical stroke (illustrative)

export type MotorState = SimState & {
  lesion: number;
  days: number;
  strength: number;
  tone: number;
  reflex: number;
  bulk: number;
  fibrillation: number;
  shock: boolean;
};

function model(values: Record<string, number>): MotorState {
  const { lesion, days } = values;
  // Everything is for the RIGHT leg’s quadriceps.
  let strength = 100;
  let tone = 1;
  let reflex = 2;
  let bulk = 100;
  let fibrillation = 0;
  let shock = false;
  const notes: string[] = [];
  if (lesion === 1) {
    strength = 20;
    const early = days < CORTICAL_DAYS;
    tone = early ? 0 : 2;
    reflex = early ? 1 : 3;
    notes.push('The corticospinal tract crosses at the pyramids, so a left cortical stroke weakens the right side. Upper motor neuron: no wasting.');
  } else if (lesion === 2) {
    strength = 0;
    tone = 0;
    reflex = 0;
    bulk = clamp(100 - 1.2 * days, 50, 100);
    fibrillation = days >= 1 ? 1 : 0;
    notes.push('Lower motor neuron: the muscle has lost its nerve — flaccid, wasting, no reflex, with fibrillation.');
  } else if (lesion === 3 || lesion === 4) {
    strength = 0;
    shock = days < SHOCK_DAYS;
    tone = shock ? 0 : 2;
    reflex = shock ? 0 : 3;
    notes.push(
      shock
        ? 'Spinal shock: below the cut every reflex is depressed — the cord has lost the tonic influence of higher centres.'
        : 'Spinal shock has worn off (about 2 weeks): the reflexes return, now hyperactive, and the leg is spastic.'
    );
    if (lesion === 4) notes.push('Hemisection: the right leg is weak (the lateral corticospinal tract has already crossed above); the left leg moves but cannot feel pain.');
  }
  return {
    readouts: { strength, tone, reflex, bulk, fibrillation },
    notes,
    lesion,
    days,
    strength,
    tone,
    reflex,
    bulk,
    fibrillation,
    shock,
  };
}

const START = { lesion: 0, days: 30 };

export const motorLesion: SimDefinition<MotorState> = {
  id: 'motor-lesion',
  name: 'Examine the right leg',
  animated: true,
  controls: [
    { kind: 'choice', key: 'lesion', label: 'Lesion', options: LESIONS.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'days', label: 'Days since the injury', unit: 'days', min: 0, max: 60, step: 1 },
  ],
  initial: START,
  readouts: [
    { key: 'strength', label: 'Strength', unit: '%', primary: true },
    { key: 'tone', label: 'Tone', noDelta: true, text: (v) => TONES[v] ?? '' },
    { key: 'reflex', label: 'Knee jerk', noDelta: true, text: (v) => REFLEXES[v] ?? '' },
    { key: 'bulk', label: 'Muscle bulk', unit: '%' },
    { key: 'fibrillation', label: 'Fibrillation', noDelta: true, text: (v) => (v ? 'Present' : 'None') },
  ],
  model,
  scenarios: [
    { id: 'umn', label: 'UMN (stroke)', values: { lesion: 1, days: 30 }, caption: 'Spastic, brisk reflexes, no wasting.' },
    { id: 'lmn', label: 'LMN (nerve)', values: { lesion: 2, days: 30 }, caption: 'Flaccid, no reflex, wasting and fibrillation.' },
    { id: 'shock', label: 'Spinal shock', values: { lesion: 3, days: 3 }, caption: 'Days after a transection: paralysis with every reflex below the cut depressed.' },
    { id: 'after', label: 'After spinal shock', values: { lesion: 3, days: 30 }, caption: 'After about 2 weeks the reflexes return, hyperactive: spasticity.' },
  ],
  challenges: [
    {
      id: 'which',
      label: 'Weak but not paralysed',
      prompt: 'A month after the injury the right leg is weak but can still move a little; it is stiff, the knee jerk is brisk, and the quadriceps is not wasted. Choose the lesion.',
      rules: ['Days are fixed at 30.'],
      start: { lesion: 2, days: 30 },
      locked: ['days'],
      goals: [
        { readout: 'tone', atLeast: 2, label: 'Spastic' },
        { readout: 'reflex', atLeast: 3, label: 'Brisk knee jerk' },
        { readout: 'bulk', atLeast: 95, label: 'No wasting' },
        { readout: 'strength', atLeast: 10, label: 'Some movement left' },
      ],
      debrief: 'Spastic, brisk and not wasted is an upper motor neuron picture. A cord lesion after spinal shock looks similar, but leaves the leg completely paralysed below the cut; this patient’s cortical stroke leaves some movement.',
    },
  ],
  modelNote:
    'Simplified teaching model of one muscle. The UMN and LMN signs, spinal shock (about 2 weeks) and Brown-Séquard are from Motor Activity, slides 14–19; the reflex directions on slide 19 are clarified from Guyton. Strength values, the rate of wasting and the 7-day hypotonia after a cortical stroke are illustrative.',
};

// CNS Lesson 1 — From stimulus to impulses, and adaptation.
//
// Lecture (Sensory I, pp. 9–10): stimulus → generator potential (an
// EPSP-like, graded potential) → summation → action potential. A stronger
// stimulus stimulates more receptors and raises the frequency. With a
// constant stimulus the frequency falls over time (adaptation): rapid
// (phasic) in touch and smell, slow (tonic) in lung inflation, BP and
// temperature. The millivolt values and time constants are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const THRESHOLD = 5; // mV of generator potential needed to fire
export const SPAN = 10; // seconds shown on the trace
export const RECEPTORS = ['Touch (phasic)', 'Blood pressure (tonic)'];

// How each receptor adapts: what fraction of the onset response is left
// in the long run, and how fast it gets there.
const ADAPT = [
  { residual: 0.05, tau: 0.6 },
  { residual: 0.8, tau: 4 },
];

export function generatorAt(strength: number, receptor: number, t: number) {
  const onset = (30 * strength) / 100;
  const a = ADAPT[receptor] ?? ADAPT[0];
  return onset * (a.residual + (1 - a.residual) * Math.exp(-t / a.tau));
}

export function frequencyFrom(generator: number) {
  return Math.max(0, (generator - THRESHOLD) * 2.4);
}

// Receptors with thresholds 5%, 15%, … 95% of the full range.
export function recruited(strength: number) {
  return clamp(Math.floor((strength + 5) / 10), 0, 10);
}

export type AdaptationState = SimState & {
  strength: number;
  receptor: number;
  t: number;
  generator: number;
  frequency: number;
  // The generator potential over the whole trace, for the drawing.
  trace: [number, number][];
};

function model(values: Record<string, number>): AdaptationState {
  const { strength, receptor, t } = values;
  const generator = generatorAt(strength, receptor, t);
  const frequency = frequencyFrom(generator);
  const onset = frequencyFrom(generatorAt(strength, receptor, 0));
  const count = recruited(strength);
  const trace: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const time = (SPAN * i) / 100;
    trace.push([time, generatorAt(strength, receptor, time)]);
  }
  const notes: string[] = [];
  if (strength > 0 && generator < THRESHOLD) notes.push('The generator potential is below threshold: no action potentials, although the stimulus is still there.');
  if (receptor === 0 && t >= 3 && onset > 0) notes.push('Touch receptors adapt rapidly: you soon stop feeling a steady touch, like a watch on your wrist.');
  return {
    readouts: {
      frequency,
      generator,
      recruited: count,
      total: frequency * count,
      remaining: onset > 0 ? (100 * frequency) / onset : 0,
    },
    notes,
    strength,
    receptor,
    t,
    generator,
    frequency,
    trace,
  };
}

const START = { strength: 50, receptor: 0, t: 0 };

export const receptorAdaptation: SimDefinition<AdaptationState> = {
  id: 'receptor-adaptation',
  name: 'Receptor and adaptation',
  controls: [
    { kind: 'slider', key: 'strength', label: 'Stimulus strength', unit: '%', min: 0, max: 100, step: 1 },
    {
      kind: 'choice',
      key: 'receptor',
      label: 'Receptor',
      options: RECEPTORS.map((label, value) => ({ value, label })),
    },
    { kind: 'slider', key: 't', label: 'Time the stimulus has been held', unit: 's', min: 0, max: SPAN, step: 0.1, hint: 'The stimulus stays the same the whole time' },
  ],
  initial: START,
  readouts: [
    { key: 'frequency', label: 'Firing in one fibre', unit: '/s', primary: true },
    { key: 'generator', label: 'Generator potential', unit: 'mV', decimals: 1 },
    { key: 'recruited', label: 'Receptors recruited', text: (v) => `${v} of 10` },
    { key: 'total', label: 'Impulses to the CNS', unit: '/s' },
    { key: 'remaining', label: 'Firing vs onset', unit: '%', hidden: true },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'onset', label: 'Touch begins', values: START, caption: 'At onset the generator potential is high above threshold, so the fibre fires fast.' },
    { id: 'held', label: 'Touch held 5 s', values: { ...START, t: 5 }, caption: 'Same stimulus, but the touch receptor has adapted: the generator potential has fallen below threshold.' },
    { id: 'tonic', label: 'BP receptor held 5 s', values: { strength: 50, receptor: 1, t: 5 }, caption: 'A tonic receptor keeps firing at nearly the same rate — it reports a steady state.' },
    { id: 'strong', label: 'Strong stimulus', values: { strength: 95, receptor: 0, t: 0 }, caption: 'Intensity is coded by more receptors and a higher frequency (Sensory I, p. 9).' },
  ],
  challenges: [
    {
      id: 'steady',
      label: 'Report a steady pressure',
      prompt: 'The stimulus has been held for 8 seconds. Make one fibre still fire at least 30 impulses per second.',
      rules: ['Time is fixed at 8 s. Choose the receptor and the stimulus strength.'],
      start: { strength: 50, receptor: 0, t: 8 },
      locked: ['t'],
      goals: [{ readout: 'frequency', atLeast: 30, label: 'At least 30 /s after 8 s' }],
      debrief:
        'Only a slowly adapting (tonic) receptor still fires after 8 s, and only if the stimulus is strong enough to keep its generator potential well above threshold. That is why baroreceptors and lung-inflation receptors are tonic: their job is to report a steady state.',
    },
  ],
  modelNote:
    'Simplified teaching model of one receptor type at a time. The sequence (generator potential → summation → action potentials), intensity coding and which receptors adapt fast or slowly are from Sensory I, pp. 9–10; the millivolt values, threshold and adaptation times are illustrative.',
};

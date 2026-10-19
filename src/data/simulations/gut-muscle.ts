// GI Lesson 7 — Slow waves, spikes and gastric emptying.
//
// Lecture (slides 128–163): interstitial cells of Cajal generate slow waves (the basic electrical
// rhythm); spikes on top of them cause contraction. Stretch, ACh and parasympathetic stimulation
// depolarise; noradrenaline and adrenaline hyperpolarise. Slow-wave frequency falls from duodenum
// to ileum. The stomach empties when antral peristalsis beats the pylorus; excess acid or
// undigested fat in the small intestine delays emptying.
// Textbook values (labelled): slow waves about 3/min in the stomach, 12/min in the duodenum and
// 8/min in the ileum; slow waves of about 10–15 mV around a resting potential near −60 mV.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const REGIONS = [
  { label: 'Stomach (antrum)', freq: 3 },
  { label: 'Duodenum', freq: 12 },
  { label: 'Ileum', freq: 8 },
];
export const INPUTS = ['None', 'Stretch (food)', 'ACh (vagus)', 'Noradrenaline (sympathetic)'];
export const DUODENUM = ['Empty', 'Acid', 'Fat'];
export const THRESHOLD = -40;

export type MuscleState = SimState & { freq: number; base: number; amplitude: number; spikes: number; force: number; region: number };

function model(values: Record<string, number>): MuscleState {
  const { region, input, duodenum } = values;
  const freq = REGIONS[region].freq;
  const shift = [0, 10, 16, -10][input];
  const base = -60 + shift; // resting membrane potential, mV
  const amplitude = 14;
  const over = base + amplitude - THRESHOLD; // how far the crest passes threshold
  const spikes = Math.max(0, Math.round(over / 2.5));
  const force = clamp(spikes * 20, 0, 100);
  // Gastric emptying uses the antrum's force, whatever region is shown.
  const antrum = clamp(Math.max(0, Math.round((-60 + shift + amplitude - THRESHOLD) / 2.5)) * 20, 0, 100);
  const emptying = clamp((10 + antrum) * [1, 0.4, 0.5][duodenum], 0, 100) * 0.4;
  const notes: string[] = [];
  if (!spikes) notes.push('The slow waves do not reach threshold: no spikes, so the muscle barely contracts.');
  if (input === 3) notes.push('Noradrenaline hyperpolarises the fibres: slow waves stay below threshold.');
  if (duodenum) notes.push(`${DUODENUM[duodenum]} in the duodenum delays gastric emptying.`);
  return {
    readouts: { freq, spikes, force, emptying },
    notes,
    freq,
    base,
    amplitude,
    spikes,
    force,
    region,
  };
}

const START = { region: 0, input: 1, duodenum: 0 };

export const gutMuscle: SimDefinition<MuscleState> = {
  id: 'gut-muscle',
  name: 'Gut smooth muscle',
  controls: [
    { kind: 'choice', key: 'region', label: 'Region', options: REGIONS.map((r, value) => ({ value, label: r.label })) },
    { kind: 'choice', key: 'input', label: 'Input', options: INPUTS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'duodenum', label: 'In the duodenum', options: DUODENUM.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'freq', label: 'Slow waves', unit: '/min' },
    { key: 'spikes', label: 'Spikes per slow wave', primary: true },
    { key: 'force', label: 'Contraction strength', unit: '%', primary: true },
    { key: 'emptying', label: 'Gastric emptying', unit: '%/hour' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'rest', label: 'At rest', values: { ...START, input: 0 }, caption: 'Slow waves without spikes: little contraction.' },
    { id: 'meal', label: 'After a meal', values: START, caption: 'Stretch brings the slow waves above threshold: spikes and contractions.' },
    { id: 'fat', label: 'Fat in the duodenum', values: { ...START, duodenum: 2 }, caption: 'The stomach empties more slowly.' },
    { id: 'duodenum', label: 'Duodenum', values: { ...START, region: 1 }, caption: 'Faster slow waves than in the stomach.' },
  ],
  challenges: [
    {
      id: 'empty',
      label: 'Speed up emptying',
      prompt: 'Fat is in the duodenum. Make the stomach empty at least 15% of its contents an hour.',
      rules: ['The duodenal contents are fixed.'],
      start: { region: 0, input: 0, duodenum: 2 },
      locked: ['duodenum'],
      goals: [{ readout: 'emptying', atLeast: 15, label: 'Emptying ≥ 15%/hour' }],
      debrief: 'ACh from the vagus depolarises the antral muscle most: more spikes on each slow wave, stronger peristalsis to push chyme past the pylorus.',
    },
  ],
  modelNote:
    'Simplified teaching model. Slow waves from the interstitial cells of Cajal, spikes, the depolarising and hyperpolarising inputs, falling frequency along the small intestine and the delay of emptying by duodenal acid and fat are from the lecture (slides 128–163). Frequencies, potentials and the emptying rate are textbook-based and illustrative.',
};

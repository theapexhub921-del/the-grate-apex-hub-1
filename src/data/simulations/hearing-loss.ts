// Special Senses Lesson 7 — Hearing loss and the audiogram.
//
// Lecture (Auditory, slides 36–51): a lesion of the auditory nerve or the cochlear nuclei causes
// deafness in the same ear; lesions above the cochlear nuclei do not cause one-sided deafness,
// because the pathway is bilateral. Conductive loss: sound blocked in the outer or middle ear (wax,
// infection) — treatable. Sensorineural loss: inner-ear sensory cells or the nerve (loud noise,
// ageing — presbycusis) — permanent. An audiogram shows the loss at each frequency.
// Textbook (labelled): conductive loss raises air- but not bone-conduction thresholds (an
// "air–bone gap"); noise damage notches at 4 kHz; presbycusis affects high frequencies most;
// normal thresholds are 0–20 dB HL.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const FREQS = [250, 500, 1000, 2000, 4000, 8000];
export const CONDITIONS = ['Normal hearing', 'Ear wax (right)', 'Middle ear infection (right)', 'Noise damage', 'Presbycusis (ageing)', 'Right auditory nerve tumour', 'Stroke in the left auditory cortex'];
export const TYPES = ['Normal', 'Conductive', 'Sensorineural'];

export type HearingState = SimState & { air: number[]; bone: number[]; condition: number; ear: number };

function thresholds(condition: number, ear: number) {
  const right = ear === 0;
  const flat = (v: number) => FREQS.map(() => v);
  let air = flat(5);
  let bone = flat(5);
  if (condition === 1 && right) air = flat(35);
  if (condition === 2 && right) air = [45, 40, 35, 30, 30, 30];
  if (condition === 3) {
    air = [5, 5, 10, 25, 55, 30];
    bone = [5, 5, 10, 25, 55, 30];
  }
  if (condition === 4) {
    air = [10, 10, 15, 25, 45, 65];
    bone = [10, 10, 15, 25, 45, 65];
  }
  if (condition === 5 && right) {
    air = [55, 55, 60, 60, 65, 70];
    bone = [55, 55, 60, 60, 65, 70];
  }
  return { air, bone };
}

function model(values: Record<string, number>): HearingState {
  const { condition, ear } = values;
  const { air, bone } = thresholds(condition, ear);
  const mean = (v: number[]) => (v[1] + v[2] + v[3] + v[4]) / 4;
  const gap = mean(air) - mean(bone);
  const type = mean(air) <= 20 ? 0 : gap > 15 ? 1 : 2;
  const notes: string[] = [];
  if (condition === 6) notes.push('The auditory pathway is bilateral above the cochlear nuclei: a cortical stroke on one side does not make either ear deaf.');
  if (condition === 5 && ear === 0) notes.push('A lesion of the auditory nerve causes deafness in the same ear.');
  if (type === 1) notes.push('Bone conduction bypasses the blockage, so it stays normal: an air–bone gap means a conductive loss.');
  if (condition === 3) notes.push('Loud noise damages the hair cells, typically around 4 kHz.');
  return {
    readouts: { air: mean(air), bone: mean(bone), gap, type, at4k: air[4] },
    notes,
    air,
    bone,
    condition,
    ear,
  };
}

export const hearingLoss: SimDefinition<HearingState> = {
  id: 'hearing-loss',
  name: 'Hearing loss',
  controls: [
    { kind: 'choice', key: 'condition', label: 'Condition', options: CONDITIONS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'ear', label: 'Ear tested', options: [{ value: 0, label: 'Right' }, { value: 1, label: 'Left' }] },
  ],
  initial: { condition: 0, ear: 0 },
  readouts: [
    { key: 'air', label: 'Air conduction (0.5–4 kHz)', unit: 'dB HL', primary: true },
    { key: 'bone', label: 'Bone conduction', unit: 'dB HL' },
    { key: 'gap', label: 'Air–bone gap', unit: 'dB' },
    { key: 'at4k', label: 'Threshold at 4 kHz', unit: 'dB HL' },
    { key: 'type', label: 'Type of loss', noDelta: true, primary: true, text: (v) => TYPES[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: { condition: 0, ear: 0 }, caption: 'Thresholds near 0 dB at every frequency.' },
    { id: 'wax', label: 'Ear wax', values: { condition: 1, ear: 0 }, caption: 'Air conduction worse, bone conduction normal: conductive.' },
    { id: 'noise', label: 'Noise damage', values: { condition: 3, ear: 0 }, caption: 'A notch at 4 kHz in air and bone: sensorineural.' },
    { id: 'stroke', label: 'Cortical stroke', values: { condition: 6, ear: 1 }, caption: 'Both ears still hear: the pathway is bilateral.' },
  ],
  challenges: [
    {
      id: 'one-sided',
      label: 'Deaf in one ear',
      prompt: 'Find a lesion of the nervous system that makes the right ear deaf (thresholds over 50 dB) by sensorineural loss.',
      rules: ['The right ear is tested.'],
      start: { condition: 6, ear: 0 },
      locked: ['ear'],
      goals: [
        { readout: 'air', atLeast: 50, label: 'Thresholds over 50 dB' },
        { readout: 'type', atLeast: 2, label: 'Sensorineural' },
      ],
      debrief: 'Only a lesion of the auditory nerve (or the cochlear nuclei) causes deafness in one ear; above the cochlear nuclei the pathway is bilateral (slide 44).',
    },
  ],
  modelNote:
    'Simplified teaching model. One-sided deafness only from nerve or cochlear nucleus lesions, conductive versus sensorineural loss and their causes, and the audiogram are from the lecture (Auditory, slides 36–51). The threshold patterns, air–bone gap and 4 kHz notch are textbook.',
};

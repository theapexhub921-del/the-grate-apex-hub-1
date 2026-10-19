// Renal Lesson 6 — Micturition.
//
// Lecture (slides 98–114): sympathetic hypogastric nerve (T12–L2) relaxes the
// detrusor and closes the bladder neck (storage); parasympathetic pelvic
// nerve (S2–S4) contracts the detrusor and opens the neck (voiding); somatic
// pudendal nerve (S2–S4) controls the external sphincter. Sensory fibres
// signal fullness (pelvic nerve). During filling pressure stays low
// (5–10 cm H₂O) despite large volume increases, then rises abruptly at
// micturition. Capacity ≈ 500 ml, ≈ 50 ml residual. The cerebrum can
// suppress the reflex through the external sphincter. Textbook (labelled):
// the urge from ≈ 150 ml and the reflex at ≈ 400 ml; voiding pressure
// ≈ 40 cm H₂O.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const LESIONS = ['None', 'Pelvic nerve cut (parasympathetic)', 'Hypogastric nerve cut (sympathetic)', 'Pudendal nerve cut (somatic)'];

export type BladderState = SimState & {
  volume: number;
  voiding: boolean;
  pressure: number;
  sympathetic: number; // 0–1 activity
  parasympathetic: number;
  pudendal: number;
  lesion: number;
};

function model(values: Record<string, number>): BladderState {
  const { volume, wish, lesion } = values;
  const pelvicCut = lesion === 1;
  const voiding = !pelvicCut && ((wish === 1 && volume >= 100) || (lesion === 3 && volume >= 400));
  let pressure = 5 + (5 * Math.min(volume, 400)) / 400 + Math.max(0, volume - 400) * 0.12;
  if (lesion === 2) pressure *= 1.5;
  if (voiding) pressure = 40 + volume * 0.02;
  const urge = pelvicCut ? 0 : clamp((volume - 150) / 350, 0, 1) * 100;
  const after = voiding ? 50 : volume;
  const notes: string[] = [];
  if (pelvicCut) notes.push('Without the pelvic nerve the detrusor cannot contract and fullness is not felt: the bladder fills and over-stretches (retention).');
  if (lesion === 2) notes.push('Without sympathetic tone the detrusor is less relaxed during filling: pressure rises sooner.');
  if (lesion === 3 && voiding && wish === 0) notes.push('The external sphincter can no longer be held shut: the reflex empties the bladder.');
  if (!pelvicCut && wish === 0 && volume >= 400 && lesion !== 3) notes.push('The reflex is triggered, but the cerebrum suppresses it and keeps the external sphincter closed.');
  return {
    readouts: { pressure, urge, voiding: voiding ? 1 : 0, after },
    notes,
    volume,
    voiding,
    pressure,
    sympathetic: lesion === 2 || voiding ? 0 : 1,
    parasympathetic: pelvicCut ? 0 : voiding ? 1 : clamp(volume / 600, 0, 0.4),
    pudendal: lesion === 3 || voiding ? 0 : 1,
    lesion,
  };
}

const START = { volume: 100, wish: 0, lesion: 0 };

export const micturition: SimDefinition<BladderState> = {
  id: 'micturition',
  name: 'The bladder',
  controls: [
    { kind: 'slider', key: 'volume', label: 'Urine in the bladder', unit: 'ml', min: 0, max: 600, step: 10 },
    { kind: 'choice', key: 'wish', label: 'Voluntary control', options: [{ value: 0, label: 'Hold' }, { value: 1, label: 'Go (void)' }] },
    { kind: 'choice', key: 'lesion', label: 'Nerve injury', options: LESIONS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'pressure', label: 'Bladder pressure', unit: 'cm H₂O', primary: true },
    { key: 'urge', label: 'Sense of fullness', unit: '%' },
    { key: 'voiding', label: 'Voiding', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'after', label: 'Left in the bladder', unit: 'ml' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'filling', label: 'Filling', values: { ...START, volume: 300 }, caption: 'Large volume, little rise in pressure: the detrusor relaxes as it fills.' },
    { id: 'full', label: 'Full, holding', values: { ...START, volume: 480 }, caption: 'Strong urge; the cerebrum keeps the external sphincter shut.' },
    { id: 'void', label: 'Voiding', values: { ...START, volume: 450, wish: 1 }, caption: 'Detrusor contracts, both sphincters relax; about 50 ml remains.' },
    { id: 'pelvic', label: 'Pelvic nerve injury', values: { volume: 500, wish: 1, lesion: 1 }, caption: 'No contraction and no sensation: retention.' },
  ],
  challenges: [
    {
      id: 'empty',
      label: 'Empty the bladder',
      prompt: 'The bladder holds 450 ml. Empty it so that no more than 60 ml is left.',
      rules: ['Volume and nerves are fixed.'],
      start: { volume: 450, wish: 0, lesion: 0 },
      locked: ['volume', 'lesion'],
      goals: [{ readout: 'after', atMost: 60, label: 'No more than 60 ml left' }],
      debrief: 'Deciding to void lets the pontine micturition centre switch the parasympathetic supply on and the sympathetic and pudendal supply off: the detrusor contracts and both sphincters open (slides 110–114).',
    },
  ],
  modelNote:
    'Simplified teaching model. The three nerve supplies and their effects, low pressure (5–10 cm H₂O) while filling, the abrupt rise at micturition, capacity ≈ 500 ml with ≈ 50 ml residual and voluntary control through the external sphincter are from the lecture (slides 98–114). The volumes for the urge and the reflex (≈ 150 and ≈ 400 ml) and the voiding pressure are textbook values.',
};

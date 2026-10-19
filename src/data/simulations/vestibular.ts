// Special Senses Lesson 8 — The semicircular canals and otolith organs.
//
// Lecture (Auditory, slides 52–72): semicircular canals sense angular acceleration; when the head
// turns the endolymph lags (inertia) and deflects the cupula. Bending towards the kinocilium
// depolarises the hair cells and raises the firing rate; away lowers it. Hair cells fire at a low
// rate even at rest. The utricle (horizontal) and saccule (vertical) sense linear acceleration:
// the dense otoconia lag. Vestibular nuclei → vestibulospinal tracts (posture), MLF (eye movements
// that compensate for head movement), cerebellum. Disturbance causes dizziness and nystagmus.
// Textbook values (labelled): resting firing ≈ 90 spikes/s; during steady rotation the cupula
// returns within about 20–30 s, so the sensation of turning fades.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const PHASES = ['Head still', 'Starts turning right', 'Turning right steadily (30 s)', 'Stops after spinning right'];
export const LINEAR = ['None', 'Car accelerating forwards', 'Lift starting upwards'];
export const SENSE = ['Still', 'Turning right', 'Turning left'];
export const EYES = ['Still', 'Slow drift left (vestibulo-ocular reflex)', 'Slow drift right, nystagmus'];

export type VestibularState = SimState & { phase: number; cupula: number; right: number; left: number };

function model(values: Record<string, number>): VestibularState {
  const { phase, linear } = values;
  const cupula = [0, 1, 0, -1][phase]; // +1: towards the kinocilium in the right horizontal canal
  const right = 90 + 70 * cupula;
  const left = 90 - 70 * cupula;
  const sense = cupula > 0 ? 1 : cupula < 0 ? 2 : 0;
  const eyes = cupula > 0 ? 1 : cupula < 0 ? 2 : 0;
  const utricle = linear === 1 ? 150 : 90;
  const saccule = linear === 2 ? 150 : 90;
  const notes: string[] = [];
  if (phase === 1) notes.push('The endolymph lags behind the turning head and bends the cupula: the right canal fires faster, the left slower.');
  if (phase === 2) notes.push('In steady rotation the endolymph catches up and the cupula straightens: firing returns to its resting rate and the turning is no longer felt.');
  if (phase === 3) notes.push('On stopping, the endolymph keeps moving and bends the cupula the other way: you feel as if turning left, with nystagmus and dizziness.');
  if (linear === 1) notes.push('The otoconia of the utricle lag behind: horizontal linear acceleration.');
  if (linear === 2) notes.push('The otoconia of the saccule lag behind: vertical linear acceleration.');
  return {
    readouts: { right, left, sense, eyes, utricle, saccule },
    notes,
    phase,
    cupula,
    right,
    left,
  };
}

export const vestibular: SimDefinition<VestibularState> = {
  id: 'vestibular',
  name: 'Balance: canals and otoliths',
  controls: [
    { kind: 'choice', key: 'phase', label: 'Head rotation', options: PHASES.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'linear', label: 'Linear movement', options: LINEAR.map((label, value) => ({ value, label })) },
  ],
  initial: { phase: 0, linear: 0 },
  readouts: [
    { key: 'right', label: 'Right horizontal canal', unit: 'spikes/s', primary: true },
    { key: 'left', label: 'Left horizontal canal', unit: 'spikes/s', primary: true },
    { key: 'sense', label: 'You feel', noDelta: true, text: (v) => SENSE[v] ?? '' },
    { key: 'eyes', label: 'Eyes', noDelta: true, text: (v) => EYES[v] ?? '' },
    { key: 'utricle', label: 'Utricle', unit: 'spikes/s' },
    { key: 'saccule', label: 'Saccule', unit: 'spikes/s' },
  ],
  model,
  animated: true,
  scenarios: PHASES.map((label, phase) => ({ id: `p${phase}`, label, values: { phase, linear: 0 }, caption: ['Resting firing in both canals.', 'Right canal excited, left inhibited; the eyes counter-rotate.', 'The cupula has returned: no sensation of turning.', 'The cupula bends the other way: dizziness and nystagmus.'][phase] })),
  challenges: [
    {
      id: 'dizzy',
      label: 'Feel a turn that is not happening',
      prompt: 'Make the brain feel the head turning left while the head is actually still.',
      rules: ['Choose the head rotation.'],
      start: { phase: 0, linear: 0 },
      locked: ['linear'],
      goals: [{ readout: 'sense', atLeast: 2, label: 'Feels like turning left' }],
      debrief: 'After spinning right and stopping, the endolymph keeps moving and deflects the cupula the other way — the brain reads it as turning left.',
    },
  ],
  modelNote:
    'Simplified teaching model of the horizontal canals. Endolymph lag, cupula deflection, firing above and below a resting rate, the otolith organs and the effects on the eyes are from the lecture (Auditory, slides 52–72). The resting rate and the cupula’s return during steady rotation are textbook.',
};

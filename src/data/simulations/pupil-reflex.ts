// Special Senses Lesson 5 — The pupillary light reflex.
//
// Lecture (Visual System, slides 86–89): circular iris muscles (parasympathetic, blocked by
// atropine) constrict the pupil; radial muscles (sympathetic) dilate it. Light in one eye
// constricts that pupil (direct reflex) and the other (consensual). Pathway: optic nerve → optic
// tract fibres to the pretectal nucleus → both Edinger–Westphal nuclei → oculomotor nerve (III) →
// ciliary ganglion → short ciliary nerves → pupillary constrictor.
// Textbook values (labelled): pupil about 6 mm in dim light, about 2.5 mm in bright light, about
// 7–8 mm when the parasympathetic supply is lost or blocked.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const LIGHTS = ['Dim room', 'Torch in the right eye', 'Torch in the left eye'];
export const LESIONS = ['None', 'Right optic nerve cut', 'Right oculomotor nerve (III) cut', 'Atropine drops in the right eye'];

export type PupilState = SimState & { right: number; left: number; lesion: number; light: number; signal: number };

function model(values: Record<string, number>): PupilState {
  const { light, lesion } = values;
  const rightSees = light === 1 && lesion !== 1;
  const leftSees = light === 2;
  const signal = rightSees || leftSees ? 1 : 0; // reaches both Edinger–Westphal nuclei
  const pupil = (blocked: boolean) => (blocked ? 7.5 : signal ? 2.5 : 6);
  const right = pupil(lesion === 2 || lesion === 3);
  const left = pupil(false);
  const notes: string[] = [];
  if (signal && lesion === 0) notes.push('Both pupils constrict: the pretectal nucleus signals both Edinger–Westphal nuclei — direct and consensual reflexes.');
  if (light === 1 && lesion === 1) notes.push('The right eye cannot send the signal: neither pupil constricts. Light in the left eye would still constrict both.');
  if (lesion === 2) notes.push('The right oculomotor nerve carries the parasympathetic fibres: the right pupil is dilated and fixed, whatever eye is lit.');
  if (lesion === 3) notes.push('Atropine blocks the parasympathetic constrictor: the right pupil dilates and does not react.');
  return { readouts: { right, left, signal }, notes, right, left, lesion, light, signal };
}

export const pupilReflex: SimDefinition<PupilState> = {
  id: 'pupil-reflex',
  name: 'The pupillary light reflex',
  controls: [
    { kind: 'choice', key: 'light', label: 'Light', options: LIGHTS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'lesion', label: 'Lesion', options: LESIONS.map((label, value) => ({ value, label })) },
  ],
  initial: { light: 0, lesion: 0 },
  readouts: [
    { key: 'right', label: 'Right pupil', unit: 'mm', decimals: 1, primary: true },
    { key: 'left', label: 'Left pupil', unit: 'mm', decimals: 1, primary: true },
    { key: 'signal', label: 'Signal to the midbrain', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
  ],
  model,
  scenarios: [
    { id: 'dim', label: 'Dim room', values: { light: 0, lesion: 0 }, caption: 'Both pupils wide.' },
    { id: 'direct', label: 'Light in the right eye', values: { light: 1, lesion: 0 }, caption: 'Both constrict: direct and consensual.' },
    { id: 'afferent', label: 'Right optic nerve cut', values: { light: 1, lesion: 1 }, caption: 'Light in the blind eye: no reflex at all.' },
    { id: 'efferent', label: 'Right III cut', values: { light: 2, lesion: 2 }, caption: 'Light in the left eye: only the left pupil constricts.' },
  ],
  challenges: [
    {
      id: 'consensual',
      label: 'Constrict the right pupil through the left eye',
      prompt: 'The right optic nerve is cut. Make the right pupil constrict.',
      rules: ['The lesion is fixed.'],
      start: { light: 1, lesion: 1 },
      locked: ['lesion'],
      goals: [{ readout: 'right', atMost: 3, label: 'Right pupil ≤ 3 mm' }],
      debrief: 'The right eye cannot send the signal, but light in the left eye reaches both Edinger–Westphal nuclei, and the right oculomotor nerve is intact: the consensual reflex.',
    },
  ],
  modelNote:
    'Simplified teaching model. The muscles of the iris, atropine, the direct and consensual reflexes and the pathway are from the lecture (Visual System, slides 86–89). The pupil diameters are textbook values.',
};

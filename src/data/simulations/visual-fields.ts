// Special Senses Lesson 4 — The optic pathway and visual field defects.
//
// Lecture (Visual System, slides 68–72): light from the temporal field falls on the nasal
// hemiretina and vice versa. At the optic chiasm nasal fibres cross; temporal fibres stay on the
// same side. Optic tract → lateral geniculate nucleus → optic radiation → primary visual cortex.
// Right optic nerve lesion: blind right eye. Chiasm: bitemporal hemianopia. Right optic tract:
// left homonymous hemianopia. Part of the right optic radiation: an upper or lower quadrant of the
// left field in both eyes.
// Textbook (labelled): the lower radiation fibres (Meyer's loop) carry the upper field.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const LESIONS = ['None', 'Right optic nerve', 'Optic chiasm (centre)', 'Right optic tract', 'Right optic radiation (lower fibres)'];
export const DEFECTS = ['Full fields', 'Blind right eye', 'Bitemporal hemianopia', 'Left homonymous hemianopia', 'Left upper quadrantanopia'];

// Each eye's field as four quadrants of space: [left upper, left lower, right upper, right lower];
// true = lost.
export type Field = [boolean, boolean, boolean, boolean];
export type FieldState = SimState & { lesion: number; leftEye: Field; rightEye: Field };

function model(values: Record<string, number>): FieldState {
  const { lesion } = values;
  const none: Field = [false, false, false, false];
  let leftEye: Field = none;
  let rightEye: Field = none;
  if (lesion === 1) rightEye = [true, true, true, true];
  if (lesion === 2) {
    leftEye = [true, true, false, false]; // left eye's temporal field is to the left
    rightEye = [false, false, true, true]; // right eye's temporal field is to the right
  }
  if (lesion === 3) {
    leftEye = [true, true, false, false];
    rightEye = [true, true, false, false];
  }
  if (lesion === 4) {
    leftEye = [true, false, false, false];
    rightEye = [true, false, false, false];
  }
  const lost = (f: Field) => f.filter(Boolean).length * 25;
  const notes: string[] = [];
  if (lesion === 2) notes.push('Only the crossing nasal fibres are cut: both temporal fields are lost.');
  if (lesion === 3) notes.push('The right optic tract carries the left half of the field from both eyes.');
  if (lesion === 4) notes.push('Only part of the radiation is damaged, so only a quadrant is lost — in both eyes.');
  return {
    readouts: { lostLeft: lost(leftEye), lostRight: lost(rightEye), defect: lesion },
    notes,
    lesion,
    leftEye,
    rightEye,
  };
}

export const visualFields: SimDefinition<FieldState> = {
  id: 'visual-fields',
  name: 'The optic pathway',
  controls: [{ kind: 'choice', key: 'lesion', label: 'Lesion', options: LESIONS.map((label, value) => ({ value, label })) }],
  initial: { lesion: 0 },
  readouts: [
    { key: 'defect', label: 'Field defect', noDelta: true, primary: true, text: (v) => DEFECTS[v] ?? '' },
    { key: 'lostLeft', label: 'Left eye’s field lost', unit: '%' },
    { key: 'lostRight', label: 'Right eye’s field lost', unit: '%' },
  ],
  model,
  scenarios: LESIONS.map((label, lesion) => ({ id: `l${lesion}`, label, values: { lesion }, caption: DEFECTS[lesion] })),
  challenges: [
    {
      id: 'homonymous',
      label: 'Lose the same half in both eyes',
      prompt: 'Find a lesion that takes away the left half of the field in both eyes.',
      rules: ['Choose a lesion.'],
      start: { lesion: 2 },
      goals: [
        { readout: 'defect', atLeast: 3, atMost: 3, label: 'Left homonymous hemianopia' },
      ],
      debrief: 'Behind the chiasm each optic tract carries one half of the field from both eyes — so a right tract lesion takes the left half of both.',
    },
  ],
  modelNote:
    'Simplified teaching model. The crossing at the chiasm and the defect from each lesion are from the lecture (Visual System, slides 68–72). That the lower radiation fibres carry the upper quadrant (Meyer’s loop) is textbook.',
};

// Special Senses Lesson 2 — Accommodation and refractive errors.
//
// Lecture (Visual System, slides 15–27): about 80% of refraction happens at the cornea and 20% in
// the lens, whose power is adjustable. Near object: the ciliary body contracts, the zonules relax
// and the lens rounds (more power); far object: the ciliary body relaxes, the zonules tighten and
// the lens thins. Near point often taken as 25 cm; accommodation declines with age (presbyopia).
// Myopia: focus in front of the retina, corrected by biconcave lenses; hyperopia: behind the
// retina, convex lenses.
// Textbook values (labelled): powers in dioptres (1/metres); the amplitude of accommodation falls
// from about 12 D in childhood to under 1 D by 60; a 3 D refractive error.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const EYES = ['Normal', 'Myopia (too strong)', 'Hyperopia (too weak)'];
export const GLASSES = ['None', 'Concave lens (−3 D)', 'Convex lens (+3 D)'];
export const FOCUS = ['In front of the retina', 'On the retina', 'Behind the retina'];

export type AccommodationState = SimState & { used: number; focus: number; defocus: number; amplitude: number };

function model(values: Record<string, number>): AccommodationState {
  const { distance, eye, glasses, age } = values;
  const need = 100 / distance; // dioptres of extra power to focus this distance
  const relaxed = [0, 3, -3][eye] + [0, -3, 3][glasses]; // extra power with the lens relaxed
  const amplitude = clamp(14 - 0.24 * age, 0.5, 14);
  const used = clamp(need - relaxed, 0, amplitude);
  const defocus = relaxed + used - need; // + : too much power (in front); − : too little (behind)
  const focus = defocus > 0.25 ? 0 : defocus < -0.25 ? 2 : 1;
  const near = relaxed + amplitude > 0 ? 100 / (relaxed + amplitude) : 999;
  const far = relaxed > 0 ? 100 / relaxed : 999;
  const notes: string[] = [];
  if (used > 0.5) notes.push('Near object: the ciliary muscle contracts, the zonules slacken and the elastic lens rounds up.');
  if (focus === 0) notes.push('Too much power: light focuses in front of the retina (myopia). A concave lens spreads it out.');
  if (focus === 2) notes.push('Not enough power: light would focus behind the retina. A convex lens helps.');
  if (age >= 45 && focus === 2 && distance <= 40) notes.push('Presbyopia: the lens and ciliary muscle have lost elasticity, so near work blurs.');
  return {
    readouts: { focus, used, defocus: Math.abs(defocus), near: Math.round(near), far: Math.round(far), ciliary: used > 0.5 ? 1 : 0 },
    notes,
    used,
    focus,
    defocus,
    amplitude,
  };
}

const START = { distance: 600, eye: 0, glasses: 0, age: 20 };

export const accommodation: SimDefinition<AccommodationState> = {
  id: 'accommodation',
  name: 'Focusing the eye',
  controls: [
    { kind: 'slider', key: 'distance', label: 'Object distance', unit: 'cm', min: 10, max: 600, step: 10 },
    { kind: 'choice', key: 'eye', label: 'Eye', options: EYES.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'glasses', label: 'Glasses', options: GLASSES.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'age', label: 'Age', unit: 'years', min: 10, max: 70, step: 5 },
  ],
  initial: START,
  readouts: [
    { key: 'focus', label: 'Light focuses', noDelta: true, primary: true, text: (v) => FOCUS[v] ?? '' },
    { key: 'used', label: 'Accommodation used', unit: 'D', decimals: 1, primary: true },
    { key: 'defocus', label: 'Blur', unit: 'D', decimals: 1 },
    { key: 'near', label: 'Near point', unit: 'cm', text: (v) => (v >= 999 ? '—' : `${v} cm`) },
    { key: 'far', label: 'Far point', unit: 'cm', text: (v) => (v >= 999 ? 'Infinity' : `${v} cm`) },
    { key: 'ciliary', label: 'Ciliary muscle', noDelta: true, text: (v) => (v ? 'Contracted' : 'Relaxed') },
  ],
  model,
  scenarios: [
    { id: 'far', label: 'Looking far', values: START, caption: 'Ciliary muscle relaxed, zonules tight, lens thin.' },
    { id: 'near', label: 'Reading at 25 cm', values: { ...START, distance: 30 }, caption: 'The lens rounds up to add power.' },
    { id: 'myopia', label: 'Myopia', values: { ...START, eye: 1 }, caption: 'Distant objects focus in front of the retina.' },
    { id: 'presbyopia', label: 'Presbyopia', values: { ...START, distance: 30, age: 60 }, caption: 'Too little accommodation left for reading.' },
  ],
  challenges: [
    {
      id: 'glasses',
      label: 'Correct the myopia',
      prompt: 'A myopic student cannot see the board 6 m away. Bring the image onto the retina.',
      rules: ['The eye, distance and age are fixed.'],
      start: { distance: 600, eye: 1, glasses: 0, age: 20 },
      locked: ['eye', 'distance', 'age'],
      goals: [{ readout: 'focus', atLeast: 1, atMost: 1, label: 'Focused on the retina' }],
      debrief: 'A biconcave lens takes away the extra power, so light from far away focuses on the retina again (slides 23–24).',
    },
  ],
  modelNote:
    'Simplified teaching model. The roles of cornea and lens, accommodation, the near point, presbyopia and the correction of myopia and hyperopia are from the lecture (Visual System, slides 15–27). Powers in dioptres, the fall of accommodation with age and the 3 D errors are textbook values.',
};

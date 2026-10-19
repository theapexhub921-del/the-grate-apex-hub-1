// Endocrinology Lesson 1 — Negative feedback and primary vs secondary disorders.
//
// Lecture (Introduction, pp. 9, 20, 23–26): the hypothalamus controls the anterior pituitary with
// releasing hormones; the pituitary's trophic hormones stimulate their glands; the gland's hormone
// feeds back negatively (short, intermediate and long loops). A defect in the gland itself is
// primary; a lack or excess of its trophic hormone is secondary. The two axes offered are the
// lecture's own: TRH → TSH → T3/T4 and CRH → ACTH → cortisol. Levels are % of normal (model).
import { axisPattern, PATTERNS, pct, solveAxis, type AxisLevels } from '@/data/simulations/endocrine-axis';
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const AXES = [
  { releasing: 'TRH', trophic: 'TSH', hormone: 'T4', gland: 'Thyroid' },
  { releasing: 'CRH', trophic: 'ACTH', hormone: 'Cortisol', gland: 'Adrenal cortex' },
];
export const FAULTS = ['None', 'Gland fails', 'Pituitary fails', 'Tumour of the gland', 'Tumour of the pituitary'];

export type FeedbackState = SimState & AxisLevels & { axis: number; fault: number; pattern: number };

function model(values: Record<string, number>): FeedbackState {
  const { axis, fault, feedback, given } = values;
  const levels = solveAxis({
    gland: fault === 1 ? 0.15 : 1,
    pit: fault === 2 ? 0.15 : 1,
    autonomousGland: fault === 3 ? 3 : null,
    autonomousPit: fault === 4 ? 3 : null,
    given: given / 100,
    feedback,
  });
  const pattern = axisPattern(levels);
  const names = AXES[axis];
  const notes: string[] = [];
  if (!feedback && fault === 1) notes.push(`With feedback cut, nothing pushes the pituitary to work harder: ${names.hormone} falls much further.`);
  if (given > 0 && fault === 0) notes.push(`The ${names.hormone} taken as a drug feeds back like the body’s own: ${names.trophic} falls and the ${names.gland.toLowerCase()} makes less.`);
  if (fault === 3) notes.push('A tumour of the gland secretes on its own: the high hormone suppresses the releasing and trophic hormones.');
  return {
    readouts: { releasing: pct(levels.releasing), trophic: pct(levels.trophic), hormone: pct(levels.hormone), own: pct(levels.own), pattern },
    notes,
    ...levels,
    axis,
    fault,
    pattern,
  };
}

const START = { axis: 0, fault: 0, feedback: 1, given: 0 };

export const feedbackAxis: SimDefinition<FeedbackState> = {
  id: 'feedback-axis',
  name: 'A hormone axis',
  controls: [
    { kind: 'choice', key: 'axis', label: 'Axis', options: AXES.map((a, value) => ({ value, label: `${a.releasing} → ${a.trophic} → ${a.hormone}` })) },
    { kind: 'choice', key: 'fault', label: 'Fault', options: FAULTS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'feedback', label: 'Negative feedback', options: [{ value: 1, label: 'Working' }, { value: 0, label: 'Cut' }] },
    { kind: 'slider', key: 'given', label: 'Hormone taken as a drug', unit: '% of normal output', min: 0, max: 200, step: 5 },
  ],
  initial: START,
  readouts: [
    { key: 'releasing', label: 'Releasing hormone (hypothalamus)', unit: '%' },
    { key: 'trophic', label: 'Trophic hormone (pituitary)', unit: '%', primary: true },
    { key: 'hormone', label: 'Hormone in the blood', unit: '%', primary: true },
    { key: 'own', label: 'Made by the gland itself', unit: '%' },
    { key: 'pattern', label: 'Pattern', noDelta: true, text: (v) => PATTERNS[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Each level at its normal output, held there by negative feedback.' },
    { id: 'primary', label: 'Gland fails', values: { ...START, fault: 1 }, caption: 'Low hormone, high trophic hormone: primary hyposecretion.' },
    { id: 'secondary', label: 'Pituitary fails', values: { ...START, fault: 2 }, caption: 'Low hormone and low trophic hormone: secondary hyposecretion.' },
    { id: 'drug', label: 'Steroid tablets', values: { ...START, axis: 1, given: 100 }, caption: 'Cortisol taken as a drug suppresses CRH and ACTH; the adrenal cortex makes less of its own.' },
  ],
  challenges: [
    {
      id: 'replace',
      label: 'Replace the missing hormone',
      prompt: 'The thyroid has failed. Give enough T4 to bring TSH back into the normal range (80–120%).',
      rules: ['Only the dose can change.'],
      start: { axis: 0, fault: 1, feedback: 1, given: 0 },
      locked: ['axis', 'fault', 'feedback'],
      goals: [
        { readout: 'trophic', atLeast: 80, atMost: 120, label: 'TSH 80–120%' },
        { readout: 'hormone', atLeast: 85, atMost: 125, label: 'T4 85–125%' },
      ],
      debrief: 'When the hormone is back to normal, negative feedback brings the trophic hormone back too — so a normal trophic hormone shows the dose is right.',
    },
  ],
  modelNote:
    'Simplified teaching model: every level is a percentage of its normal output, with two negative feedback loops (on the hypothalamus and on the pituitary). The control by releasing and trophic hormones, negative feedback and the primary/secondary classification are from the lecture (Introduction, pp. 20–26); the sizes of the changes are illustrative.',
};

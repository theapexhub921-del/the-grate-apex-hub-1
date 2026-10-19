// GI Lesson 1 — The digestive tract and its five processes, followed through one meal.
//
// Lecture (slides 1–15): the GI tract is a ~7 m tube — mouth, pharynx, oesophagus, stomach, small
// intestine, large intestine, anus — with accessory organs (salivary glands, liver, gallbladder,
// pancreas). Five processes: motility, secretion, digestion, absorption (mainly in the small
// intestine) and elimination. Sympathetic activity reduces motility (slide 107); undigested fat in
// the small intestine delays gastric emptying (slide 154); fibre softens stool and strengthens
// colonic contractions (slide 173).
// Textbook times (labelled): the stomach empties in about 3 hours (longer after a fatty meal); the
// small intestine takes about 5 hours; the colon 1–2 days.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const PLACES = ['Stomach', 'Small intestine', 'Large intestine', 'Passed as faeces'];
export const PROCESSES = ['Mixing and storage; acid and pepsin start digestion', 'Digestion and absorption of nutrients', 'Water absorbed, faeces formed and stored', 'Elimination'];

export type TransitState = SimState & { place: number; absorbed: number; stomachFull: number };

function model(values: Record<string, number>): TransitState {
  const { time, meal, fibre, stress } = values;
  const slow = stress ? 1.3 : 1;
  const gastric = (meal ? 5 : 3) * slow;
  const small = 5 * slow;
  const colon = (fibre ? 18 : 30) * slow;
  const total = gastric + small + colon;
  const place = time < gastric ? 0 : time < gastric + small ? 1 : time < total ? 2 : 3;
  const absorbed = clamp((time - gastric) / small, 0, 1) * 95;
  const stomachFull = clamp(1 - time / gastric, 0, 1);
  const notes: string[] = [];
  if (meal && place === 0 && time >= 3) notes.push('Fat reaching the small intestine slows gastric emptying: the meal is still in the stomach.');
  if (stress) notes.push('Sympathetic activity reduces secretion and motility: everything moves more slowly.');
  return {
    readouts: { place, process: place, absorbed, total },
    notes,
    place,
    absorbed,
    stomachFull,
  };
}

const START = { time: 2, meal: 0, fibre: 0, stress: 0 };

export const gutTransit: SimDefinition<TransitState> = {
  id: 'gut-transit',
  name: 'A meal through the gut',
  controls: [
    { kind: 'slider', key: 'time', label: 'Hours after eating', unit: 'h', min: 0, max: 48, step: 1 },
    { kind: 'choice', key: 'meal', label: 'Meal', options: [{ value: 0, label: 'Mixed meal' }, { value: 1, label: 'Fatty meal' }] },
    { kind: 'choice', key: 'fibre', label: 'Fibre', options: [{ value: 0, label: 'Low' }, { value: 1, label: 'High' }] },
    { kind: 'choice', key: 'stress', label: 'Nerves', options: [{ value: 0, label: 'Relaxed' }, { value: 1, label: 'Stressed (sympathetic)' }] },
  ],
  initial: START,
  readouts: [
    { key: 'place', label: 'Where the meal is', noDelta: true, primary: true, text: (v) => PLACES[v] ?? '' },
    { key: 'process', label: 'What is happening', noDelta: true, text: (v) => PROCESSES[v] ?? '' },
    { key: 'absorbed', label: 'Nutrients absorbed', unit: '%', primary: true },
    { key: 'total', label: 'Mouth to anus', unit: 'h' },
  ],
  model,
  scenarios: [
    { id: 'stomach', label: 'In the stomach', values: START, caption: 'Stored, mixed with acid and pepsin and ground into chyme.' },
    { id: 'small', label: 'In the small intestine', values: { ...START, time: 6 }, caption: 'Enzymes from the pancreas and brush border finish digestion; nutrients are absorbed.' },
    { id: 'colon', label: 'In the colon', values: { ...START, time: 20 }, caption: 'Water and electrolytes are absorbed and faeces formed.' },
    { id: 'fibre', label: 'High-fibre diet', values: { ...START, time: 30, fibre: 1 }, caption: 'Fibre strengthens colonic contractions: the residue passes sooner.' },
  ],
  challenges: [
    {
      id: 'absorbed',
      label: 'Finish absorbing',
      prompt: 'Find the earliest time at which the meal has been fully absorbed (at least 95%) after a fatty meal.',
      rules: ['The meal is fixed.'],
      start: { time: 2, meal: 1, fibre: 0, stress: 0 },
      locked: ['meal'],
      goals: [{ readout: 'absorbed', atLeast: 95, label: 'At least 95% absorbed' }],
      debrief: 'Absorption happens almost entirely in the small intestine, after the stomach has emptied — and fat delays that emptying.',
    },
  ],
  modelNote:
    'Simplified teaching model. The parts of the tract, the five processes, the effects of sympathetic activity, fat and fibre are from the lecture (slides 1–15, 107, 154, 173). Transit times (stomach about 3 hours, small intestine about 5 hours, colon 1–2 days) are textbook values.',
};

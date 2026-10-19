// GI Lesson 8 — Defecation.
//
// Lecture (slides 174–182): continence depends on the internal anal sphincter (smooth muscle,
// enteric nerves), the external anal sphincter (skeletal, pudendal nerve, voluntary) and the
// puborectalis sling (an acute anorectal angle). A mass movement fills the rectum → defecation
// reflex: the internal sphincter relaxes and the external contracts — the urge. If delayed, the
// external sphincter stays shut and more water is absorbed. To defecate, the external sphincter
// and puborectalis relax and the Valsalva manoeuvre helps. The intrinsic reflex is weak; the
// parasympathetic reflex through the sacral cord (pelvic nerves) strengthens it.
// Textbook values (labelled): the urge from ≈ 100 mL in the rectum; the anorectal angle ≈ 90° at
// rest and ≈ 130° when straightened.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const INJURIES = ['None', 'Sacral cord (pelvic nerves) damaged', 'Pudendal nerve damaged'];

export type DefecationState = SimState & { volume: number; internalOpen: boolean; externalShut: boolean; angle: number; passing: boolean };

function model(values: Record<string, number>): DefecationState {
  const { volume, decide, injury } = values;
  const sacral = injury === 1;
  const pudendal = injury === 2;
  const reflex = volume >= 100;
  const internalOpen = reflex; // the enteric reflex alone can relax it, if weakly
  const strongReflex = reflex && !sacral;
  const externalShut = !pudendal && !(decide && reflex);
  const angle = decide && !pudendal ? 130 : pudendal ? 115 : 90;
  const pressure = clamp(5 + volume * 0.12 + (strongReflex ? 25 : reflex ? 8 : 0) + (decide ? 30 : 0), 0, 120);
  const urge = sacral ? 0 : clamp((volume - 60) / 1.6, 0, 100);
  const passing = internalOpen && !externalShut && (strongReflex || decide === 1);
  const continent = !(passing && !decide);
  const emptied = passing ? (strongReflex ? 95 : 50) : 0;
  const notes: string[] = [];
  if (reflex && !decide && !pudendal) notes.push('The defecation reflex relaxes the internal sphincter and contracts the external one: the urge, held back voluntarily.');
  if (pudendal && reflex) notes.push('Without the pudendal nerve the external sphincter cannot be held shut: incontinence.');
  if (sacral) notes.push('Without the sacral parasympathetic reflex only the weak enteric reflex is left, and the urge is not felt: incomplete emptying, constipation.');
  return {
    readouts: { pressure, urge, angle, internal: internalOpen ? 1 : 0, external: externalShut ? 1 : 0, emptied, continent: continent ? 1 : 0 },
    notes,
    volume,
    internalOpen,
    externalShut,
    angle,
    passing,
  };
}

const START = { volume: 50, decide: 0, injury: 0 };

export const defecation: SimDefinition<DefecationState> = {
  id: 'defecation',
  name: 'Defecation',
  controls: [
    { kind: 'slider', key: 'volume', label: 'Faeces in the rectum', unit: 'mL', min: 0, max: 300, step: 25 },
    { kind: 'choice', key: 'decide', label: 'Decision', options: [{ value: 0, label: 'Hold on' }, { value: 1, label: 'Defecate (Valsalva)' }] },
    { kind: 'choice', key: 'injury', label: 'Nerve injury', options: INJURIES.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'pressure', label: 'Rectal pressure', unit: 'cm H₂O' },
    { key: 'urge', label: 'Urge', unit: '%', primary: true },
    { key: 'internal', label: 'Internal sphincter', noDelta: true, text: (v) => (v ? 'Relaxed' : 'Closed') },
    { key: 'external', label: 'External sphincter', noDelta: true, text: (v) => (v ? 'Contracted' : 'Relaxed') },
    { key: 'angle', label: 'Anorectal angle', unit: '°' },
    { key: 'emptied', label: 'Rectum emptied', unit: '%', primary: true },
    { key: 'continent', label: 'Continent', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
  ],
  model,
  scenarios: [
    { id: 'rest', label: 'Rectum nearly empty', values: START, caption: 'Both sphincters closed; the puborectalis keeps the angle acute.' },
    { id: 'urge', label: 'After a mass movement', values: { ...START, volume: 200 }, caption: 'The reflex brings on the urge; the external sphincter holds.' },
    { id: 'go', label: 'Defecating', values: { volume: 200, decide: 1, injury: 0 }, caption: 'External sphincter and puborectalis relax; the angle straightens.' },
    { id: 'pudendal', label: 'Pudendal injury', values: { volume: 200, decide: 0, injury: 2 }, caption: 'The external sphincter cannot hold: incontinence.' },
  ],
  challenges: [
    {
      id: 'empty',
      label: 'Empty the rectum',
      prompt: 'The rectum holds 200 mL. Empty at least 90% of it.',
      rules: ['The volume and nerves are fixed.'],
      start: { volume: 200, decide: 0, injury: 0 },
      locked: ['volume', 'injury'],
      goals: [{ readout: 'emptied', atLeast: 90, label: 'At least 90% emptied' }],
      debrief: 'Defecation needs a decision: the cortex relaxes the external sphincter and the puborectalis, the angle straightens, and the Valsalva manoeuvre and rectal peristalsis do the rest.',
    },
  ],
  modelNote:
    'Simplified teaching model. The sphincters and their nerves, the puborectalis, the defecation reflex and its parasympathetic reinforcement are from the lecture (slides 174–182). The volume for the urge, the pressures and the angles are textbook-based and illustrative.',
};

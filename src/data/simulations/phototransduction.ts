// Special Senses Lesson 3 — Phototransduction.
//
// Lecture (Visual System, slides 43–61): in the dark, high cGMP keeps CNG channels open: the dark
// current of Na⁺ (and Ca²⁺) holds the photoreceptor at about −30 mV, releasing glutamate. Light
// isomerises 11-cis to all-trans retinal → metarhodopsin II → transducin → phosphodiesterase →
// cGMP falls → channels close → hyperpolarisation towards −90 mV → less glutamate. Rods work in
// dim light (scotopic); cones need more light (photopic). Rhodopsin is regenerated from retinol
// (vitamin A); vitamin A deficiency causes night blindness (slide 83).
// The light scale (log units) and the receptors' half-saturation levels are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const RECEPTORS = ['Rod', 'Cone'];

export type PhotoState = SimState & { open: number; potential: number; glutamate: number; bleached: number; cone: boolean };

function model(values: Record<string, number>): PhotoState {
  const { receptor, light, vitaminA } = values;
  const cone = receptor === 1;
  const i = 10 ** light - 1;
  const half = cone ? 10 ** 3.5 : 10 ** 1 * (vitaminA ? 1 : 100);
  const active = i / (i + half);
  const cgmp = 100 * (1 - 0.92 * active);
  const open = 100 * (cgmp / 100) ** 2;
  const potential = -90 + (60 * open) / 100;
  const glutamate = open;
  const notes: string[] = [];
  if (light === 0) notes.push('Dark: cGMP holds the CNG channels open; the dark current depolarises the cell, which releases glutamate.');
  if (!cone && active > 0.9) notes.push('The rod is saturated: in bright light vision depends on cones.');
  if (cone && light <= 2 && light > 0) notes.push('Too dim for cones: they barely respond.');
  if (!vitaminA && !cone) notes.push('Without vitamin A little rhodopsin is regenerated: rods lose their sensitivity — night blindness.');
  return {
    readouts: { cgmp, open, potential, response: potential + 30 < 0 ? -(potential + 30) : 0, glutamate },
    notes,
    open,
    potential,
    glutamate,
    bleached: active,
    cone,
  };
}

const START = { receptor: 0, light: 0, vitaminA: 1 };

export const phototransduction: SimDefinition<PhotoState> = {
  id: 'phototransduction',
  name: 'Phototransduction',
  controls: [
    { kind: 'choice', key: 'receptor', label: 'Photoreceptor', options: RECEPTORS.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'light', label: 'Light', unit: 'log units', min: 0, max: 6, step: 0.5, hint: '0 = darkness' },
    { kind: 'choice', key: 'vitaminA', label: 'Vitamin A', options: [{ value: 1, label: 'Enough' }, { value: 0, label: 'Deficient' }] },
  ],
  initial: START,
  readouts: [
    { key: 'cgmp', label: 'cGMP', unit: '% of dark' },
    { key: 'open', label: 'CNG channels open', unit: '%' },
    { key: 'potential', label: 'Membrane potential', unit: 'mV', primary: true },
    { key: 'response', label: 'Hyperpolarisation', unit: 'mV' },
    { key: 'glutamate', label: 'Glutamate release', unit: '% of dark', primary: true },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'dark', label: 'Darkness', values: START, caption: 'Dark current: −30 mV, glutamate released.' },
    { id: 'dim', label: 'Rod in dim light', values: { ...START, light: 1.5 }, caption: 'Rods respond to very little light.' },
    { id: 'bright', label: 'Cone in daylight', values: { ...START, receptor: 1, light: 5 }, caption: 'Cones need bright light.' },
  ],
  challenges: [
    {
      id: 'saturate',
      label: 'Switch the glutamate off',
      prompt: 'Make a cone release less than 10% of its dark glutamate.',
      rules: ['The receptor is a cone.'],
      start: { receptor: 1, light: 1, vitaminA: 1 },
      locked: ['receptor'],
      goals: [{ readout: 'glutamate', atMost: 10, label: 'Glutamate < 10%' }],
      debrief: 'Bright light activates enough transducin and phosphodiesterase to clear cGMP: the channels close, the cone hyperpolarises and glutamate release stops.',
    },
  ],
  modelNote:
    'Simplified teaching model. The dark current, the cascade from rhodopsin to cGMP, the −30 and −90 mV potentials, glutamate release, rods versus cones and vitamin A are from the lecture (Visual System, slides 43–61, 83). The light scale and sensitivities are illustrative.',
};

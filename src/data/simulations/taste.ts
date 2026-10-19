// Special Senses Lesson 9 — Taste.
//
// Lecture (Chemical Senses, slides 4–25): five tastes. Type I cells detect salty; type II cells are
// the receptor cells for sweet, bitter and umami (GPCRs: sweet T1R2 + T1R3, umami T1R1 + T1R3,
// bitter T2Rs → gustducin → PLC-β2 → IP₃ → TRPM5) and release ATP; type III cells sense sour
// (H⁺ through PKD2L1, K⁺ channels blocked) and synapse with afferents. Salty: Na⁺ enters through an
// ion channel. There is no tongue map. Fibres run in VII (front two-thirds), IX (back third) and
// X → nucleus of the solitary tract → thalamus → lower postcentral gyrus and limbic system.
// The concentration–response curve is illustrative.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const TASTES = ['Salty', 'Sour', 'Sweet', 'Bitter', 'Umami'];
const CELLS = ['Type I', 'Type III', 'Type II', 'Type II', 'Type II'];
const RECEPTORS = ['Na⁺ channel', 'PKD2L1 (H⁺); K⁺ channels blocked', 'T1R2 + T1R3 (GPCR)', 'T2R (GPCR)', 'T1R1 + T1R3 (GPCR)'];
export const NERVES = ['Facial (VII, chorda tympani)', 'Glossopharyngeal (IX)'];

export type TasteState = SimState & { taste: number; firing: number; nerve: number; gprotein: boolean };

function model(values: Record<string, number>): TasteState {
  const { taste, strength, place, block } = values;
  const gprotein = taste >= 2;
  const blocked = gprotein && block === 1;
  const response = (strength / (strength + 25)) * 125 * (blocked ? 0.05 : 1);
  const potential = -60 + 0.35 * response; // receptor potential, mV
  const notes: string[] = [];
  if (blocked) notes.push('Sweet, bitter and umami all depend on gustducin → PLC-β2 → TRPM5: with that pathway blocked they cannot be tasted.');
  if (block && !gprotein) notes.push('Salty and sour use ion channels, not the G-protein pathway: they are still tasted.');
  return {
    readouts: { firing: response, potential, cell: taste, receptor: taste, nerve: place, transmitter: gprotein ? 1 : 0 },
    notes,
    taste,
    firing: response,
    nerve: place,
    gprotein,
  };
}

export const taste: SimDefinition<TasteState> = {
  id: 'taste',
  name: 'Taste',
  controls: [
    { kind: 'choice', key: 'taste', label: 'Taste', options: TASTES.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'strength', label: 'Concentration', unit: '%', min: 0, max: 100, step: 5 },
    { kind: 'choice', key: 'place', label: 'Where on the tongue', options: [{ value: 0, label: 'Front two-thirds' }, { value: 1, label: 'Back third' }] },
    { kind: 'choice', key: 'block', label: 'Gustducin–PLC–TRPM5 pathway', options: [{ value: 0, label: 'Working' }, { value: 1, label: 'Blocked' }] },
  ],
  initial: { taste: 2, strength: 50, place: 0, block: 0 },
  readouts: [
    { key: 'firing', label: 'Afferent firing', unit: '% of max', primary: true },
    { key: 'potential', label: 'Receptor potential', unit: 'mV' },
    { key: 'cell', label: 'Taste cell', noDelta: true, text: (v) => CELLS[v] ?? '' },
    { key: 'receptor', label: 'Detected by', noDelta: true, text: (v) => RECEPTORS[v] ?? '' },
    { key: 'nerve', label: 'Cranial nerve', noDelta: true, primary: true, text: (v) => NERVES[v] ?? '' },
    { key: 'transmitter', label: 'Signal to the nerve', noDelta: true, text: (v) => (v ? 'ATP from type II cells' : 'Ca²⁺-triggered transmitter release') },
  ],
  model,
  scenarios: TASTES.map((label, t) => ({ id: `t${t}`, label, values: { taste: t, strength: 50, place: 0, block: 0 }, caption: `${CELLS[t]} cells: ${RECEPTORS[t]}.` })),
  challenges: [
    {
      id: 'mask',
      label: 'Keep the salt, lose the sweet',
      prompt: 'With sweet on the tongue, cut the afferent firing below 10% without changing the sweetener or its concentration.',
      rules: ['The taste and concentration are fixed.'],
      start: { taste: 2, strength: 50, place: 0, block: 0 },
      locked: ['taste', 'strength'],
      goals: [{ readout: 'firing', atMost: 10, label: 'Firing < 10%' }],
      debrief: 'Sweet is a GPCR taste: blocking gustducin, PLC-β2 or TRPM5 silences it — while salty and sour, which use ion channels, would still get through. There is no tongue map, so moving it does not help.',
    },
  ],
  modelNote:
    'Simplified teaching model. The taste cells, receptors and transduction, the absence of a tongue map and the nerves are from the lecture (Chemical Senses, slides 4–25). The concentration–response curve and potentials are illustrative.',
};

// GI Lesson 3 — Water and salt in the gut.
//
// Lecture (slides 36–46, 89–90): about 2 L of water is drunk and about 7 L secreted into the gut
// each day; ~90% is absorbed in the small intestine, the colon absorbs most of the rest, and only
// 50–150 mL is lost in faeces. Water follows Na⁺ by osmosis. Glucose-coupled Na⁺ absorption (SGLT1)
// is the basis of oral rehydration therapy. Crypt fluid secretion is driven by Cl⁻ through CFTR,
// regulated by cAMP — the basis of cholera toxin’s effect.
// Textbook values (labelled): cholera can add 10–20 L/day of secretion; the colon can absorb at
// most about 4–5 L/day; about 1.5 L/day of water also leaves as urine, sweat and breath.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export type WaterState = SimState & { entering: number; small: number; colon: number; faeces: number; cholera: boolean };

const COLON_MAX = 4.5;

function model(values: Record<string, number>): WaterState {
  const { drink, cholera, ors } = values;
  const secreted = 7 + (cholera ? 15 : 0);
  const entering = drink + secreted;
  // Cholera's cAMP blocks NaCl absorption, but glucose-coupled Na⁺ absorption still works — which
  // is why a glucose–salt drink helps.
  const fraction = cholera ? (ors ? 0.75 : 0.55) : ors ? 0.92 : 0.9;
  const small = entering * fraction;
  const toColon = entering - small;
  const faeces = Math.max(toColon * 0.11, toColon - COLON_MAX);
  const colon = toColon - faeces;
  const balance = drink - faeces - 1.5;
  const notes: string[] = [];
  if (cholera) notes.push('Cholera toxin raises cAMP in the crypt cells: CFTR pours Cl⁻ — and with it Na⁺ and water — into the gut.');
  if (cholera && ors) notes.push('Glucose and Na⁺ are absorbed together by SGLT1, which cholera does not block; water follows.');
  if (toColon > COLON_MAX) notes.push('More reaches the colon than it can absorb: watery diarrhoea.');
  return {
    readouts: { entering, small, colon, faeces: faeces * 1000, balance },
    notes,
    entering,
    small,
    colon,
    faeces,
    cholera: !!cholera,
  };
}

const START = { drink: 2, cholera: 0, ors: 0 };

export const gutWater: SimDefinition<WaterState> = {
  id: 'gut-water',
  name: 'Water and salt in the gut',
  controls: [
    { kind: 'slider', key: 'drink', label: 'Water drunk', unit: 'L/day', min: 0.5, max: 5, step: 0.5 },
    { kind: 'choice', key: 'cholera', label: 'Cholera toxin', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
    { kind: 'choice', key: 'ors', label: 'Drink taken as', options: [{ value: 0, label: 'Plain water' }, { value: 1, label: 'Glucose–salt solution (ORS)' }] },
  ],
  initial: START,
  readouts: [
    { key: 'entering', label: 'Entering the gut', unit: 'L/day', decimals: 1 },
    { key: 'small', label: 'Absorbed: small intestine', unit: 'L/day', decimals: 1, primary: true },
    { key: 'colon', label: 'Absorbed: colon', unit: 'L/day', decimals: 1 },
    { key: 'faeces', label: 'Lost in faeces', unit: 'mL/day', primary: true },
    { key: 'balance', label: 'Body water gained', unit: 'L/day', decimals: 1 },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal day', values: START, caption: '9 L in; about 90% absorbed by the small intestine; about 100 mL in the faeces.' },
    { id: 'cholera', label: 'Cholera', values: { ...START, cholera: 1 }, caption: 'Litres of extra secretion overwhelm the colon: severe watery diarrhoea and dehydration.' },
    { id: 'ors', label: 'Cholera with ORS', values: { drink: 4, cholera: 1, ors: 1 }, caption: 'Glucose-coupled Na⁺ absorption pulls water back in.' },
  ],
  challenges: [
    {
      id: 'rehydrate',
      label: 'Rehydrate a cholera patient',
      prompt: 'This patient has cholera. Stop them losing body water (gain at least 0 L/day).',
      rules: ['The cholera cannot be cured here.'],
      start: { drink: 2, cholera: 1, ors: 0 },
      locked: ['cholera'],
      goals: [{ readout: 'balance', atLeast: 0, label: 'Body water gained ≥ 0' }],
      debrief: 'Plain water alone cannot keep up, but a glucose–salt solution uses SGLT1 — untouched by cholera — to bring Na⁺ and water back: oral rehydration therapy (slide 43).',
    },
  ],
  modelNote:
    'Simplified teaching model. The daily volumes (2 L drunk, 7 L secreted, ~90% absorbed in the small intestine, 50–150 mL in faeces), water following Na⁺, glucose-coupled Na⁺ absorption and CFTR-driven secretion are from the lecture (slides 36–46, 89–90). The extra secretion in cholera, the colon’s maximum absorption and the other daily water losses are textbook values.',
};

// GI Lesson 4 — Saliva.
//
// Lecture (slides 58–66, 117–120): the acini make an isotonic, plasma-like primary saliva (Cl⁻
// secretion through apical channels, Na⁺ and water following); the ducts reabsorb Na⁺ and Cl⁻ and
// secrete K⁺ and HCO₃⁻ but are impermeable to water, so the final saliva is hypotonic. Salivation is
// purely neural: taste (sour most strongly), smell, sight and touch → salivatory nuclei.
// Parasympathetic (ACh): copious, protein-poor saliva; sympathetic (noradrenaline): sparse,
// protein-rich saliva. Both increase salivation.
// Textbook values (labelled): resting flow ≈ 0.3–0.5 mL/min, up to ≈ 4–5 mL/min when stimulated;
// the faster the flow, the less time the ducts have, so Na⁺ (and osmolality) rise with flow.
// Atropine (blocks ACh) is a textbook example.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const STIMULI = ['Resting', 'Smell or sight of food', 'Sour taste'];
export const NERVES = ['Normal', 'Atropine (blocks ACh)', 'Strong sympathetic (stress)'];

export type SalivaState = SimState & { flow: number; protein: number; na: number };

function model(values: Record<string, number>): SalivaState {
  const { stimulus, nerves } = values;
  const para = [0.05, 0.45, 1][stimulus] * (nerves === 1 ? 0.05 : 1);
  const symp = nerves === 2 ? 0.8 : 0.1;
  const flow = clamp(0.3 + 3.8 * para + 0.4 * symp, 0.05, 6);
  const na = clamp(4 + 60 * (flow / 4.5) ** 0.9, 2, 90);
  const k = clamp(30 - 10 * (flow / 4.5), 12, 35);
  const hco3 = clamp(5 + 40 * (flow / 4.5), 3, 60);
  const osm = 2 * (na + k) * 0.95 + 15;
  const protein = clamp(100 * (1 + 4 * symp) / (1 + 2.5 * para), 20, 500);
  const notes: string[] = [];
  if (nerves === 1) notes.push('Atropine blocks the parasympathetic ACh: little saliva, and a dry mouth.');
  if (nerves === 2) notes.push('Sympathetic stimulation gives a small volume of thick, protein-rich saliva.');
  if (stimulus === 2 && nerves !== 1) notes.push('Sour taste is the strongest stimulus: copious watery saliva. Flowing fast, it has less time in the ducts, so it keeps more Na⁺ — but it is still hypotonic.');
  return {
    readouts: { flow, na, k, hco3, osm, protein },
    notes,
    flow,
    protein,
    na,
  };
}

const START = { stimulus: 0, nerves: 0 };

export const saliva: SimDefinition<SalivaState> = {
  id: 'saliva',
  name: 'Saliva',
  controls: [
    { kind: 'choice', key: 'stimulus', label: 'Stimulus', options: STIMULI.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'nerves', label: 'Autonomic nerves', options: NERVES.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'flow', label: 'Saliva flow', unit: 'mL/min', decimals: 1, primary: true },
    { key: 'na', label: 'Na⁺ in saliva', unit: 'mmol/L' },
    { key: 'k', label: 'K⁺ in saliva', unit: 'mmol/L' },
    { key: 'hco3', label: 'HCO₃⁻ in saliva', unit: 'mmol/L' },
    { key: 'osm', label: 'Osmolality (plasma ≈ 290)', unit: 'mOsm/kg', primary: true },
    { key: 'protein', label: 'Protein (mucin, amylase)', unit: '% of resting' },
  ],
  model,
  scenarios: [
    { id: 'rest', label: 'Resting', values: START, caption: 'A trickle of saliva keeps the mouth moist and clean.' },
    { id: 'sour', label: 'Lemon on the tongue', values: { stimulus: 2, nerves: 0 }, caption: 'Copious, watery saliva — still hypotonic.' },
    { id: 'stress', label: 'Nervous before an exam', values: { stimulus: 0, nerves: 2 }, caption: 'Sparse, thick, protein-rich saliva.' },
  ],
  challenges: [
    {
      id: 'dry',
      label: 'Dry mouth',
      prompt: 'Even with a sour taste, keep the saliva flow under 1 mL/min.',
      rules: ['The stimulus is fixed.'],
      start: { stimulus: 2, nerves: 0 },
      locked: ['stimulus'],
      goals: [{ readout: 'flow', atMost: 1, label: 'Flow under 1 mL/min' }],
      debrief: 'Salivation is purely neural: block the parasympathetic transmitter, ACh, and even the strongest taste cannot drive it.',
    },
  ],
  modelNote:
    'Simplified teaching model. The two stages of saliva formation, its hypotonicity, the stimuli and the parasympathetic and sympathetic effects are from the lecture (slides 58–66, 117–120). Flow rates, how Na⁺, K⁺ and HCO₃⁻ change with flow, and atropine are textbook.',
};

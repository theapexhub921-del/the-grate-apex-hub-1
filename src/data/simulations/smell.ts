// Special Senses Lesson 10 — Smell.
//
// Lecture (Chemical Senses, slides 26–33): odorants dissolve in the mucus and bind receptors in the
// cilia → odorant-specific G protein → adenylate cyclase → cAMP → cation channel (Na⁺, Ca²⁺ in) →
// Ca²⁺-gated Cl⁻ channels (Cl⁻ out) → depolarisation → action potentials, at a rate set by the
// concentration. Axons pass through the cribriform plate (olfactory nerve I) to the olfactory bulb
// (mitral cells), then the olfactory tract to the olfactory cortex and the limbic system
// (hypothalamus, hippocampus, amygdala) — emotion and memory.
// Textbook (labelled): a thick, inflamed mucus layer in a cold keeps odorants from the cilia; a
// fractured cribriform plate can tear the olfactory nerves (anosmia). The scale is illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export type SmellState = SimState & { firing: number; perceived: number; limbic: number; cut: boolean };

function model(values: Record<string, number>): SmellState {
  const { odour, cold, fracture } = values;
  const reaching = 10 ** odour * (cold ? 0.03 : 1);
  const camp = (100 * reaching) / (reaching + 1000);
  const firing = camp; // % of maximum
  const cut = fracture === 1;
  const perceived = cut ? 0 : firing;
  const limbic = clamp(perceived * 1.1, 0, 100);
  const notes: string[] = [];
  if (cold) notes.push('Thick mucus keeps the odorant from reaching the cilia: fewer receptors are activated.');
  if (cut) notes.push('The receptors still fire, but their axons are torn where they cross the cribriform plate: nothing reaches the bulb — anosmia.');
  return {
    readouts: { camp, firing, perceived, limbic },
    notes,
    firing,
    perceived,
    limbic,
    cut,
  };
}

export const smell: SimDefinition<SmellState> = {
  id: 'smell',
  name: 'Smell',
  controls: [
    { kind: 'slider', key: 'odour', label: 'Odorant concentration', unit: 'log units', min: 0, max: 6, step: 0.5 },
    { kind: 'choice', key: 'cold', label: 'Nose', options: [{ value: 0, label: 'Clear' }, { value: 1, label: 'Heavy cold (thick mucus)' }] },
    { kind: 'choice', key: 'fracture', label: 'Cribriform plate', options: [{ value: 0, label: 'Intact' }, { value: 1, label: 'Fractured (nerves torn)' }] },
  ],
  initial: { odour: 3, cold: 0, fracture: 0 },
  readouts: [
    { key: 'camp', label: 'cAMP in the cilia', unit: '% of max' },
    { key: 'firing', label: 'Receptor firing', unit: '% of max', primary: true },
    { key: 'perceived', label: 'Smell perceived', unit: '% of max', primary: true },
    { key: 'limbic', label: 'Amygdala and hippocampus', unit: '% of max' },
  ],
  model,
  scenarios: [
    { id: 'faint', label: 'Faint smell', values: { odour: 2, cold: 0, fracture: 0 }, caption: 'Few receptors activated: a weak signal.' },
    { id: 'strong', label: 'Strong smell', values: { odour: 5, cold: 0, fracture: 0 }, caption: 'Firing rate rises with concentration.' },
    { id: 'cold', label: 'A heavy cold', values: { odour: 3, cold: 1, fracture: 0 }, caption: 'The odorant cannot reach the cilia.' },
    { id: 'fracture', label: 'Head injury', values: { odour: 5, cold: 0, fracture: 1 }, caption: 'No smell at all, however strong the odour.' },
  ],
  challenges: [
    {
      id: 'through-cold',
      label: 'Smell through a cold',
      prompt: 'With a heavy cold, make the smell perceived at least 50% of maximum.',
      rules: ['The cold is fixed.'],
      start: { odour: 2, cold: 1, fracture: 0 },
      locked: ['cold'],
      goals: [{ readout: 'perceived', atLeast: 50, label: 'Perceived ≥ 50%' }],
      debrief: 'A much stronger odorant gets enough molecules through the mucus to the cilia: the firing rate follows the concentration (slides 30–31).',
    },
  ],
  modelNote:
    'Simplified teaching model. The olfactory cascade, the firing rate set by concentration and the pathway to the limbic system are from the lecture (Chemical Senses, slides 26–33). The effects of a cold and of a cribriform fracture, and the scale, are textbook and illustrative.',
};

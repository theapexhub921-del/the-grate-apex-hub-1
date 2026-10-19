// GI Lesson 5 — Pancreatic secretion.
//
// Lecture (slides 80–86, 121–127): acinar cells secrete enzymes (proteases as inactive proenzymes,
// lipases, amylase); duct cells secrete HCO₃⁻ and water (secretin → cAMP; Cl⁻ channels, Cl⁻/HCO₃⁻
// exchange, CFTR). Phases: cephalic 20–25% (vagus, ACh), gastric ~10% (mainly enzymes), intestinal
// 50–80% — acid chyme → secretin (S cells) → HCO₃⁻; peptides and fatty acids → CCK (I cells) →
// enzymes; each hormone potentiates the other; vagovagal reflexes amplify.
// Textbook (labelled): pancreatic lipase works best near neutral pH, so acid chyme left
// unneutralised digests fat poorly.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const PHASES = ['Between meals', 'Cephalic (sight, smell, chewing)', 'Gastric (food in the stomach)', 'Intestinal (chyme in the duodenum)'];

export type PancreasState = SimState & { hco3: number; enzymes: number; ph: number; secretin: number; cck: number };

function model(values: Record<string, number>): PancreasState {
  const { phase, acid, fat, vagus } = values;
  const vagal = vagus ? 0 : 1;
  const intestinal = phase === 3;
  const secretin = intestinal && acid ? 1 : 0;
  const cck = intestinal && fat ? 1 : 0;
  const potentiate = secretin && cck ? 1.3 : 1;
  let enzymes = 5;
  let hco3 = 3;
  if (phase === 1) {
    enzymes += 22 * vagal;
    hco3 += 5 * vagal;
  }
  if (phase === 2) {
    enzymes += 10 * (0.5 + 0.5 * vagal);
    hco3 += 2;
  }
  if (intestinal) {
    const amp = 0.7 + 0.3 * vagal;
    hco3 += 60 * secretin * potentiate * amp;
    enzymes += 55 * cck * potentiate * amp;
  }
  hco3 = clamp(hco3, 0, 100);
  enzymes = clamp(enzymes, 0, 100);
  const ph = intestinal && acid ? clamp(2 + 5 * Math.min(1, hco3 / 60), 2, 7.2) : 6.8;
  const fatDigested = intestinal && fat ? clamp((enzymes / 70) * (ph > 5.5 ? 1 : 0.4) * 95, 0, 95) : 0;
  const notes: string[] = [];
  if (secretin) notes.push('Acid in the duodenum releases secretin from S cells: the duct cells pour out HCO₃⁻ and water.');
  if (cck) notes.push('Peptides and fatty acids release CCK from I cells: the acinar cells release their enzymes.');
  if (vagus && phase === 1) notes.push('The cephalic phase works entirely through the vagus: cut it and this phase is lost.');
  return {
    readouts: { hco3, enzymes, ph, secretin: secretin * 100, cck: cck * 100, fat: fatDigested },
    notes,
    hco3,
    enzymes,
    ph,
    secretin,
    cck,
  };
}

const START = { phase: 0, acid: 0, fat: 0, vagus: 0 };

export const pancreaticSecretion: SimDefinition<PancreasState> = {
  id: 'pancreatic-secretion',
  name: 'Pancreatic secretion',
  controls: [
    { kind: 'choice', key: 'phase', label: 'Phase', options: PHASES.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'acid', label: 'Acid chyme in the duodenum', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
    { kind: 'choice', key: 'fat', label: 'Fat and peptides in the duodenum', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
    { kind: 'choice', key: 'vagus', label: 'Vagus nerve', options: [{ value: 0, label: 'Intact' }, { value: 1, label: 'Cut' }] },
  ],
  initial: START,
  readouts: [
    { key: 'hco3', label: 'HCO₃⁻ and water (ducts)', unit: '% of max', primary: true },
    { key: 'enzymes', label: 'Enzymes (acini)', unit: '% of max', primary: true },
    { key: 'ph', label: 'Duodenal pH', decimals: 1 },
    { key: 'secretin', label: 'Secretin', noDelta: true, text: (v) => (v ? 'Released' : 'Low') },
    { key: 'cck', label: 'CCK', noDelta: true, text: (v) => (v ? 'Released' : 'Low') },
    { key: 'fat', label: 'Fat digested', unit: '%' },
  ],
  model,
  scenarios: [
    { id: 'cephalic', label: 'Smelling dinner', values: { ...START, phase: 1 }, caption: 'The vagus starts enzyme secretion before any food arrives.' },
    { id: 'acid', label: 'Acid chyme', values: { ...START, phase: 3, acid: 1 }, caption: 'Secretin: a flood of HCO₃⁻ neutralises the acid.' },
    { id: 'meal', label: 'Acid, fatty chyme', values: { ...START, phase: 3, acid: 1, fat: 1 }, caption: 'Secretin and CCK together potentiate each other.' },
  ],
  challenges: [
    {
      id: 'digest',
      label: 'Digest the fat',
      prompt: 'Acid, fatty chyme has entered the duodenum. Neutralise it (pH ≥ 6) and digest at least 80% of the fat.',
      rules: ['The chyme is fixed.'],
      start: { phase: 3, acid: 1, fat: 1, vagus: 1 },
      locked: ['phase', 'acid', 'fat'],
      goals: [
        { readout: 'ph', atLeast: 6, label: 'Duodenal pH ≥ 6' },
        { readout: 'fat', atLeast: 80, label: 'At least 80% of the fat digested' },
      ],
      debrief: 'Secretin and CCK do the main work in the intestinal phase, but vagovagal reflexes amplify both: with the vagus intact, HCO₃⁻ neutralises the acid and lipase can work.',
    },
  ],
  modelNote:
    'Simplified teaching model. The two products, the phases and their shares, secretin and CCK, their potentiation and the vagal reflexes are from the lecture (slides 80–86, 121–127). The pH dependence of lipase and the sizes of the changes are textbook-based and illustrative.',
};

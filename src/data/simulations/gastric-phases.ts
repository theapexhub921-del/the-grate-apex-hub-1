// GI Lessons 4 and 6 — Acid secretion and its three phases.
//
// Lecture (slides 70–76, 110–115): parietal cells secrete HCl through the H⁺/K⁺-ATPase; HCO₃⁻ leaves
// into the blood ("alkaline tide"). ACh (vagus), gastrin (G cells) and histamine (ECL cells)
// stimulate them. Cephalic phase: sight, smell, taste or thought of food → vagus → ACh, gastrin,
// histamine; about 40% of the maximum rate. Gastric phase: distension and protein products →
// gastrin; about 70% of the acid of a meal. Intestinal phase: first stimulates (pH > 3: duodenal
// gastrin), then inhibits (pH < 2: enterogastric reflex; secretin, GIP and CCK).
// Textbook (labelled): blocking histamine (H2 receptor blockers) or the proton pump (proton pump
// inhibitors) reduces acid; vagotomy removes the cephalic phase. The size of the alkaline tide is
// illustrative.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const PHASES = ['Fasting', 'Cephalic (sight, smell of food)', 'Gastric (food in the stomach)', 'Intestinal, early (chyme pH > 3)', 'Intestinal, late (acid and fat in the duodenum)'];
export const DRUGS = ['None', 'Histamine (H2) blocker', 'Proton pump inhibitor'];

export type GastricState = SimState & { acid: number; gastrin: number; phase: number; inhibition: number };

function model(values: Record<string, number>): GastricState {
  const { phase, vagus, drug } = values;
  const cut = vagus === 1;
  // [vagal part, gastrin-driven part] of the acid rate, % of maximum
  const parts: [number, number][] = [
    [3, 2],
    [32, 8],
    [35, 55],
    [15, 45],
    [5, 10],
  ];
  const [v, g] = parts[phase];
  let acid = (cut ? 0 : v) + g * (cut ? 0.8 : 1);
  if (drug === 1) acid *= 0.35;
  if (drug === 2) acid *= 0.1;
  const gastrin = [100, cut ? 100 : 150, 320, 220, 90][phase];
  const tide = 0.04 * acid; // mmol/L rise in blood HCO₃⁻
  const inhibition = phase === 4 ? 1 : 0;
  const notes: string[] = [];
  if (phase === 1 && cut) notes.push('The cephalic phase runs entirely through the vagus: after vagotomy it is lost.');
  if (phase === 4) notes.push('Acid and fat in the duodenum switch the stomach off: the enterogastric reflex, plus secretin, GIP and CCK.');
  if (drug === 2) notes.push('Blocking the H⁺/K⁺-ATPase stops the last step, whatever stimulates the parietal cell.');
  if (drug === 1) notes.push('Histamine from ECL cells strengthens the effect of ACh and gastrin; blocking it reduces acid a lot.');
  return {
    readouts: { acid, gastrin, tide, inhibition },
    notes,
    acid,
    gastrin,
    phase,
    inhibition,
  };
}

const START = { phase: 0, vagus: 0, drug: 0 };

export const gastricPhases: SimDefinition<GastricState> = {
  id: 'gastric-phases',
  name: 'Acid secretion',
  controls: [
    { kind: 'choice', key: 'phase', label: 'Phase of the meal', options: PHASES.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'vagus', label: 'Vagus nerve', options: [{ value: 0, label: 'Intact' }, { value: 1, label: 'Cut (vagotomy)' }] },
    { kind: 'choice', key: 'drug', label: 'Drug', options: DRUGS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'acid', label: 'Acid secretion', unit: '% of max', primary: true },
    { key: 'gastrin', label: 'Gastrin', unit: '% of fasting' },
    { key: 'tide', label: 'Alkaline tide (blood HCO₃⁻ rise)', unit: 'mmol/L', decimals: 1 },
    { key: 'inhibition', label: 'Enterogastric reflex', noDelta: true, text: (v) => (v ? 'Inhibiting' : 'Quiet') },
  ],
  model,
  scenarios: [
    { id: 'fasting', label: 'Fasting', values: START, caption: 'Little acid between meals.' },
    { id: 'cephalic', label: 'Smelling food', values: { ...START, phase: 1 }, caption: 'The vagus drives acid to about 40% of the maximum before any food arrives.' },
    { id: 'gastric', label: 'Food in the stomach', values: { ...START, phase: 2 }, caption: 'Distension and protein products release gastrin: most of the meal’s acid.' },
    { id: 'late', label: 'Acid chyme in the duodenum', values: { ...START, phase: 4 }, caption: 'The duodenum switches gastric secretion off.' },
  ],
  challenges: [
    {
      id: 'ulcer',
      label: 'Protect an ulcer',
      prompt: 'Food is in the stomach. Bring acid secretion under 15% of the maximum.',
      rules: ['The phase is fixed.'],
      start: { phase: 2, vagus: 0, drug: 0 },
      locked: ['phase'],
      goals: [{ readout: 'acid', atMost: 15, label: 'Acid under 15% of max' }],
      debrief: 'Cutting the vagus removes only part of the drive; blocking histamine or — most completely — the proton pump itself stops acid whatever stimulates the parietal cell.',
    },
  ],
  modelNote:
    'Simplified teaching model. The parietal cell, the three stimulants, the alkaline tide and the three phases with their sizes (cephalic ≈ 40% of max; gastric ≈ 70% of the meal’s acid) are from the lecture (slides 70–76, 110–115). Drug effects and vagotomy are textbook; the numbers are illustrative.',
};

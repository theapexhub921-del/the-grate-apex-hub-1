// Renal Lesson 1 — The kidney and the nephron: its vessels and the JGA.
//
// Lecture (slides 9–21): blood reaches the glomerulus by the afferent
// arteriole and leaves by the efferent arteriole, which divides into the
// peritubular capillaries (and, in juxtamedullary nephrons, the vasa recta).
// Glomerular pressure is high because the efferent arteriole is narrower
// than the afferent (slide 26). Cortical nephrons (~85%) have short loops;
// juxtamedullary nephrons (~15%) have long loops and vasa recta. The
// juxtaglomerular apparatus: granular cells in the afferent arteriole make
// renin; the macula densa senses tubular Na⁺ (slide 20). Glomerular pressures
// 55 / 30 / 15 mmHg and GFR ≈ 125 ml/min are from slides 26–28. The split of
// resistance between the vessels and the size of the renin response are
// illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const NEPHRONS = ['Cortical nephron (~85%)', 'Juxtamedullary nephron (~15%)'];

export type VesselsState = SimState & {
  afferent: number; // 0–1 constriction
  efferent: number;
  gbhp: number;
  flow: number; // % of normal
  gfr: number;
  renin: number; // % of normal
  nephron: number;
};

const RA = 0.45;
const RE = 0.4;
const RV = 0.15;
const factor = (constrict: number) => Math.pow(1 / (1 - 0.6 * constrict), 2);

function model(values: Record<string, number>): VesselsState {
  const { afferent, efferent, nephron } = values;
  const ra = RA * factor(afferent / 100);
  const re = RE * factor(efferent / 100);
  const total = ra + re + RV;
  const flow = (100 * 1) / total;
  const gbhp = (100 * (re + RV)) / total;
  const gfr = 12.5 * Math.max(0, gbhp - 30 - 15);
  const renin = 100 * clamp(Math.pow(55 / gbhp, 3), 0.3, 6);
  const notes: string[] = [];
  if (efferent > afferent + 10) notes.push('A narrow efferent arteriole dams blood back into the glomerulus: glomerular pressure rises.');
  if (afferent > efferent + 10) notes.push('A narrow afferent arteriole lets less blood in: glomerular pressure and filtration fall, and less NaCl reaches the macula densa — the granular cells release renin.');
  if (nephron === 1) notes.push('Juxtamedullary nephron: a long loop deep into the medulla, and its efferent arteriole also forms the vasa recta.');
  return {
    readouts: { gbhp, flow, gfr, renin, loop: nephron, vasa: nephron },
    notes,
    afferent: afferent / 100,
    efferent: efferent / 100,
    gbhp,
    flow,
    gfr,
    renin,
    nephron,
  };
}

const START = { afferent: 0, efferent: 0, nephron: 0 };

export const renalVessels: SimDefinition<VesselsState> = {
  id: 'renal-vessels',
  name: 'The nephron and its vessels',
  controls: [
    { kind: 'slider', key: 'afferent', label: 'Afferent arteriole constriction', unit: '%', min: 0, max: 80, step: 5, hint: 'The vessel bringing blood in' },
    { kind: 'slider', key: 'efferent', label: 'Efferent arteriole constriction', unit: '%', min: 0, max: 80, step: 5, hint: 'The vessel taking blood away' },
    { kind: 'choice', key: 'nephron', label: 'Nephron', options: NEPHRONS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'gbhp', label: 'Glomerular blood pressure', unit: 'mmHg', primary: true },
    { key: 'gfr', label: 'Filtrate formed', unit: 'ml/min', hidden: true },
    { key: 'flow', label: 'Blood flow through it', unit: '% of normal' },
    { key: 'renin', label: 'Renin release', unit: '% of normal' },
    { key: 'loop', label: 'Loop of Henle', noDelta: true, text: (v) => (v ? 'Long, deep into the medulla' : 'Short, outer medulla') },
    { key: 'vasa', label: 'Vasa recta', noDelta: true, text: (v) => (v ? 'Present' : 'None (peritubular capillaries only)') },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'normal', label: 'Normal cortical nephron', values: START, caption: 'Glomerular pressure 55 mmHg: high, because the efferent arteriole is the narrower one.' },
    { id: 'jm', label: 'Juxtamedullary nephron', values: { ...START, nephron: 1 }, caption: 'Long loop deep in the medulla, with vasa recta beside it.' },
    { id: 'aff', label: 'Afferent constricted', values: { ...START, afferent: 40 }, caption: 'Less blood in: low glomerular pressure, renin released.' },
    { id: 'eff', label: 'Efferent constricted', values: { ...START, efferent: 30 }, caption: 'Blood held back in the glomerulus: higher pressure.' },
  ],
  challenges: [
    {
      id: 'balance',
      label: 'Balance the arterioles',
      prompt: 'The afferent arteriole is constricted by 40%. Using only the efferent arteriole, bring glomerular pressure back to 52–58 mmHg.',
      rules: ['The afferent arteriole and nephron type are fixed.'],
      start: { afferent: 40, efferent: 0, nephron: 0 },
      locked: ['afferent', 'nephron'],
      goals: [
        { readout: 'gbhp', atLeast: 52, label: 'Glomerular pressure at least 52 mmHg' },
        { readout: 'gbhp', atMost: 58, label: 'Glomerular pressure at most 58 mmHg' },
      ],
      debrief: 'Glomerular pressure depends on the balance of the two arterioles: narrowing the efferent arteriole holds blood in the glomerulus — that is why its pressure is normally high (slide 26).',
    },
  ],
  modelNote:
    'Simplified teaching model of one nephron. The vessels in order, the narrower efferent arteriole, glomerular pressures (55 / 30 / 15 mmHg), GFR ≈ 125 ml/min, the two nephron types and the JGA cells are from the lecture (slides 9–28). How resistance is shared between the vessels and the size of the renin response are illustrative.',
};

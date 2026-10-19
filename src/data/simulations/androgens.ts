// Reproductive Lesson 4 — Testosterone: transport, DHT, and hypogonadism.
//
// Lecture (Male, slides 52–71): ~65% of testosterone is bound to SHBG, ~33% loosely bound
// (albumin and others), 1–2% free; free plus loosely bound is the "bioavailable" fraction. In
// target cells 5α-reductase makes DHT, 3–10 times more potent and not aromatised. 5α-reductase
// deficiency: male internal genitalia but small or ambiguous external genitalia; virilisation at
// puberty; the prostate stays rudimentary. Hypogonadism: primary (testis) or secondary
// (hypothalamus/pituitary); its features depend on when it begins.
// Textbook (labelled): in primary failure LH is high; in secondary failure it is low.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const GONADS = ['Normal', 'Primary failure (testes)', 'Secondary failure (pituitary)'];
export const SHBG = [{ label: 'Low', k: 0.5 }, { label: 'Normal', k: 1 }, { label: 'High', k: 2 }];
export const GENITALIA = ['Male', 'Small penis or ambiguous', 'Female-appearing'];

export type AndrogenState = SimState & { total: number; free: number; dht: number; lh: number; external: number; reductase: boolean };

function model(values: Record<string, number>): AndrogenState {
  const { gonads, shbg, reductase } = values;
  const total = gonads === 0 ? 1 : 0.15;
  const lh = gonads === 1 ? 4 : gonads === 2 ? 0.15 : 1;
  const k = SHBG[shbg]?.k ?? 1;
  // Shares at normal SHBG: 65% avidly bound, 33% loosely bound, 2% free.
  const bound = 65 * k;
  const free = (2 / (bound + 35)) * 100;
  const bioavailable = (35 / (bound + 35)) * 100;
  const dht = total * (reductase ? 1 : 0.08) * Math.min(1.5, bioavailable / 35);
  const external = !reductase ? 1 : total < 0.5 ? 1 : 0;
  const notes: string[] = [];
  if (!reductase) notes.push('Without 5α-reductase little DHT is made: the internal genitalia (testosterone) are male, but the external genitalia and prostate (DHT) are underdeveloped.');
  if (gonads === 1) notes.push('Primary failure: the testes cannot respond, so LH rises.');
  if (gonads === 2) notes.push('Secondary failure: no LH, so the healthy testes are not stimulated.');
  if (shbg === 2) notes.push('More SHBG binds more testosterone avidly, leaving less free and bioavailable — as in andropause.');
  return {
    readouts: { total: total * 100, free: free * total, bioavailable: bioavailable * total, dht: dht * 100, lh: lh * 100, external },
    notes,
    total,
    free,
    dht,
    lh,
    external,
    reductase: !!reductase,
  };
}

const START = { gonads: 0, shbg: 1, reductase: 1 };

export const androgens: SimDefinition<AndrogenState> = {
  id: 'androgens',
  name: 'Testosterone and DHT',
  controls: [
    { kind: 'choice', key: 'gonads', label: 'Testes', options: GONADS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'shbg', label: 'SHBG in the blood', options: SHBG.map((s, value) => ({ value, label: s.label })) },
    { kind: 'choice', key: 'reductase', label: '5α-reductase', options: [{ value: 1, label: 'Normal' }, { value: 0, label: 'Deficient' }] },
  ],
  initial: START,
  readouts: [
    { key: 'total', label: 'Total testosterone', unit: '% of normal', primary: true },
    { key: 'free', label: 'Free testosterone', unit: '% of total', decimals: 1 },
    { key: 'bioavailable', label: 'Bioavailable', unit: '% of total' },
    { key: 'dht', label: 'DHT', unit: '% of normal', primary: true },
    { key: 'lh', label: 'LH', unit: '% of normal' },
    { key: 'external', label: 'External genitalia (from fetal life)', noDelta: true, text: (v) => GENITALIA[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: '65% on SHBG, 33% loosely bound, 2% free; DHT made in the targets.' },
    { id: 'reductase', label: '5α-reductase deficiency', values: { ...START, reductase: 0 }, caption: 'Testosterone is normal but DHT is low: ambiguous external genitalia.' },
    { id: 'primary', label: 'Primary hypogonadism', values: { ...START, gonads: 1 }, caption: 'Low testosterone with high LH.' },
    { id: 'andropause', label: 'High SHBG', values: { ...START, shbg: 2 }, caption: 'Less bioavailable testosterone.' },
  ],
  challenges: [
    {
      id: 'locate',
      label: 'High LH or low LH?',
      prompt: 'Make testosterone low while LH is also low (under 50%).',
      rules: ['Choose the cause.'],
      start: { gonads: 1, shbg: 1, reductase: 1 },
      goals: [
        { readout: 'total', atMost: 50, label: 'Testosterone under 50%' },
        { readout: 'lh', atMost: 50, label: 'LH under 50%' },
      ],
      debrief: 'Low testosterone with low LH points above the testes — the hypothalamus or pituitary (secondary hypogonadism). With primary failure LH is high.',
    },
  ],
  modelNote:
    'Simplified teaching model. The transport fractions, DHT and 5α-reductase deficiency, and primary versus secondary hypogonadism are from the lecture (Male, slides 52–71). The LH pattern in each type and the sizes of the changes are textbook-based and illustrative.',
};

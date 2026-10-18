// Renal Lesson 2 — Glomerular filtration.
//
// Lecture (slides 23–38): NFP = GBHP − (BCOP + CHP) = 55 − (30 + 15) =
// 10 mmHg; GFR = Kf × NFP ≈ 125 ml/min (180 L/day). Autoregulation
// (myogenic and tubuloglomerular feedback) keeps GFR fairly constant over
// arterial pressures of about 80–180 mmHg by changing the afferent
// arteriole. Sympathetic nerves constrict the afferent arterioles and
// override autoregulation, lowering GFR. Kf = 12.5 ml/min/mmHg follows from
// 125 / 10. The resistances and the strength of sympathetic constriction are
// illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const SYMPATHETIC = ['None (rest)', 'Moderate (stress)', 'Strong (emergency, haemorrhage)'];

export type FiltrationState = SimState & {
  map: number;
  gbhp: number;
  nfp: number;
  gfr: number;
  afferent: number; // relative afferent radius, 1 = normal
  sympathetic: number;
  chp: number;
  bcop: number;
};

const RA = 0.45;
const DOWN = 0.55; // efferent + downstream
const KF = 12.5;
const SNS = [1, 1.15, 1.6];

function model(values: Record<string, number>): FiltrationState {
  const { map, auto, sympathetic, chp, bcop } = values;
  let ra = RA;
  if (auto === 1) ra = clamp((map * DOWN) / 55 - DOWN, RA * 0.5, RA * 2.7);
  ra *= SNS[sympathetic] ?? 1;
  const total = ra + DOWN;
  const gbhp = (map * DOWN) / total;
  const nfp = gbhp - bcop - chp;
  const gfr = KF * Math.max(0, nfp);
  const flow = (100 * (map / 100)) / total;
  const notes: string[] = [];
  if (auto === 1 && (map < 80 || map > 180)) notes.push('Outside about 80–180 mmHg autoregulation can no longer hold GFR steady.');
  if (auto === 0) notes.push('Without autoregulation, glomerular pressure — and GFR — follow arterial pressure.');
  if (sympathetic > 0) notes.push('Sympathetic nerves constrict the afferent arterioles and override autoregulation: GFR falls.');
  if (nfp <= 0) notes.push('Net filtration pressure is zero or below: filtration stops.');
  return {
    readouts: { gbhp, nfp, gfr, flow, map, daily: (gfr * 1.44) },
    notes,
    map,
    gbhp,
    nfp,
    gfr,
    afferent: Math.pow(RA / ra, 0.25),
    sympathetic,
    chp,
    bcop,
  };
}

const START = { map: 100, auto: 1, sympathetic: 0, chp: 15, bcop: 30 };

export const glomerularFiltration: SimDefinition<FiltrationState> = {
  id: 'glomerular-filtration',
  name: 'Glomerular filtration',
  controls: [
    { kind: 'slider', key: 'map', label: 'Mean arterial pressure', unit: 'mmHg', min: 40, max: 200, step: 5 },
    { kind: 'choice', key: 'auto', label: 'Autoregulation', options: [{ value: 1, label: 'Working' }, { value: 0, label: 'Lost' }] },
    { kind: 'choice', key: 'sympathetic', label: 'Sympathetic nerves', options: SYMPATHETIC.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'chp', label: 'Capsular pressure (CHP)', unit: 'mmHg', min: 10, max: 40, step: 1 },
    { kind: 'slider', key: 'bcop', label: 'Blood colloid osmotic pressure', unit: 'mmHg', min: 15, max: 45, step: 1, hint: 'From the plasma proteins' },
  ],
  initial: START,
  readouts: [
    { key: 'gfr', label: 'GFR', unit: 'ml/min', primary: true },
    { key: 'nfp', label: 'Net filtration pressure', unit: 'mmHg' },
    { key: 'gbhp', label: 'Glomerular blood pressure', unit: 'mmHg' },
    { key: 'daily', label: 'Filtrate per day', unit: 'L' },
    { key: 'flow', label: 'Renal blood flow', unit: '% of normal' },
    { key: 'map', label: 'Mean arterial pressure', unit: 'mmHg', hidden: true },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'NFP = 55 − (30 + 15) = 10 mmHg; GFR ≈ 125 ml/min, 180 L a day.' },
    { id: 'high', label: 'High pressure, autoregulated', values: { ...START, map: 160 }, caption: 'The afferent arteriole constricts: GFR hardly changes.' },
    { id: 'lost', label: 'High pressure, no autoregulation', values: { ...START, map: 160, auto: 0 }, caption: 'Glomerular pressure follows arterial pressure: GFR soars.' },
    { id: 'emergency', label: 'Emergency (sympathetic)', values: { ...START, sympathetic: 2 }, caption: 'Afferent constriction overrides autoregulation: GFR falls, blood goes to vital organs.' },
  ],
  challenges: [
    {
      id: 'range',
      label: 'Find the bottom of the range',
      prompt: 'Lower the arterial pressure as far as you can while autoregulation still keeps GFR at 120 ml/min or more. Get to 85 mmHg or below.',
      rules: ['Only arterial pressure can change.'],
      start: { ...START, map: 140 },
      locked: ['auto', 'sympathetic', 'chp', 'bcop'],
      goals: [
        { readout: 'gfr', atLeast: 120, label: 'GFR at least 120 ml/min' },
        { readout: 'map', atMost: 85, label: 'Arterial pressure 85 mmHg or less' },
      ],
      debrief: 'Autoregulation holds GFR steady from about 80 to 180 mmHg (slide 29). Below that, the afferent arteriole is already fully dilated and GFR falls with pressure.',
    },
  ],
  modelNote:
    'Simplified teaching model. The three pressures (55, 30, 15 mmHg), NFP = 10 mmHg, GFR ≈ 125 ml/min and 180 L/day, the 80–180 mmHg autoregulatory range and sympathetic afferent constriction are from the lecture (slides 26–35). Kf = 12.5 ml/min/mmHg is 125 / 10; the vessel resistances and the strength of sympathetic constriction are illustrative.',
};

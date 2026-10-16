// Lesson 5 — Starling's forces along a capillary, lymph and oedema.
//
// Net outward pressure at each point (The Heart slides 94–95):
//   (capillary hydrostatic + interstitial oncotic) − (plasma oncotic + tissue hydrostatic)
// Capillary pressure falls by 20 mmHg from the arterial to the venous end.
// At rest about 24 L/day is filtered, most is reabsorbed and the rest
// returns as lymph (slide 97). Oedema appears when filtration outruns
// reabsorption plus lymph drainage (slides 99–107).
// Lecture slides give no resting pressures; the values used are
// standard textbook teaching values (labelled in the model note).
import type { SimDefinition, SimState } from '@/data/simulations/types';

const DROP = 20; // mmHg fall along the capillary
const LYMPH_MAX = 20; // L/day lymph can carry when it is working
const LYMPH_BLOCKED = 1;

function split(a: number, b: number) {
  // Area above and below zero of a straight line from a (x = 0) to b (x = 1).
  if (a >= 0 && b >= 0) return { out: (a + b) / 2, in: 0 };
  if (a <= 0 && b <= 0) return { out: 0, in: -(a + b) / 2 };
  const x0 = a / (a - b);
  return a > 0 ? { out: (a * x0) / 2, in: (-b * (1 - x0)) / 2 } : { out: (b * (1 - x0)) / 2, in: (-a * x0) / 2 };
}

const SCALE = 24 / split(35 + 1 - 25 - 0.5, 15 + 1 - 25 - 0.5).out; // resting filtration = 24 L/day

export type StarlingState = SimState & {
  netArterial: number;
  netVenous: number;
  filtered: number;
  reabsorbed: number;
  lymph: number;
  oedema: number;
  lymphCapacity: number;
  pc: number;
  interstitialOncotic: number;
  leaky: boolean;
};

function model(values: Record<string, number>): StarlingState {
  const leaky = values.permeability === 1;
  const kf = leaky ? 3 : 1;
  const interstitialOncotic = values.pi + (leaky ? 6 : 0); // protein leaks out
  const netArterial = values.pc + interstitialOncotic - values.pp - values.pt;
  const netVenous = values.pc - DROP + interstitialOncotic - values.pp - values.pt;
  const area = split(netArterial, netVenous);
  const filtered = area.out * SCALE * kf;
  const reabsorbed = area.in * SCALE * kf;
  const lymphCapacity = values.lymph === 1 ? LYMPH_BLOCKED : LYMPH_MAX;
  const needed = Math.max(0, filtered - reabsorbed);
  const lymph = Math.min(needed, lymphCapacity);
  const oedema = Math.max(0, needed - lymphCapacity);
  const notes: string[] = [];
  if (oedema > 0) {
    notes.push(
      values.lymph === 1
        ? 'Fluid is collecting in the tissues: oedema. With the lymphatics blocked it is protein-rich and does not pit (slide 107).'
        : 'Fluid is collecting in the tissues faster than lymph can carry it away: oedema (slide 99).'
    );
  }
  return {
    readouts: {
      filtered,
      reabsorbed,
      reabsorbedShare: filtered > 0 ? (reabsorbed / filtered) * 100 : 0,
      lymph,
      oedema,
      swelling: oedema > 0 ? 1 : 0,
      netArterial,
      netVenous,
    },
    notes,
    netArterial,
    netVenous,
    filtered,
    reabsorbed,
    lymph,
    oedema,
    lymphCapacity,
    pc: values.pc,
    interstitialOncotic,
    leaky,
  };
}

const NORMAL = { pc: 35, pp: 25, pi: 1, pt: 0.5, permeability: 0, lymph: 0 };

export const capillaryStarling: SimDefinition<StarlingState> = {
  id: 'capillary-starling',
  name: 'Starling’s forces',
  animated: true,
  controls: [
    { kind: 'slider', key: 'pc', label: 'Capillary pressure', unit: 'mmHg', min: 20, max: 60, step: 1, hint: 'At the arterial end (pushes fluid out); 20 mmHg lower at the venous end' },
    { kind: 'slider', key: 'pp', label: 'Plasma oncotic pressure', unit: 'mmHg', min: 10, max: 35, step: 1, hint: 'Plasma proteins draw fluid in' },
    { kind: 'slider', key: 'pi', label: 'Interstitial oncotic pressure', unit: 'mmHg', min: 0, max: 15, step: 1, hint: 'Tissue proteins draw fluid out' },
    { kind: 'slider', key: 'pt', label: 'Tissue hydrostatic pressure', unit: 'mmHg', min: 0, max: 10, step: 0.5, hint: 'Tissue pressure pushes fluid back in' },
    {
      kind: 'choice',
      key: 'permeability',
      label: 'Capillary wall',
      options: [
        { value: 0, label: 'Normal' },
        { value: 1, label: 'Leaky (histamine)' },
      ],
    },
    {
      kind: 'choice',
      key: 'lymph',
      label: 'Lymphatics',
      options: [
        { value: 0, label: 'Draining' },
        { value: 1, label: 'Blocked' },
      ],
    },
  ],
  initial: NORMAL,
  readouts: [
    { key: 'oedema', label: 'Fluid building up', primary: true, text: (v) => (v > 0 ? `${v.toFixed(1)} L/day` : 'None') },
    { key: 'filtered', label: 'Filtered out', unit: 'L/day', decimals: 1 },
    { key: 'reabsorbed', label: 'Reabsorbed', unit: 'L/day', decimals: 1 },
    { key: 'lymph', label: 'Returned as lymph', unit: 'L/day', decimals: 1 },
    { key: 'swelling', label: 'Oedema', hidden: true, noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'reabsorbedShare', label: 'Reabsorbed', unit: '%', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: NORMAL, caption: 'Fluid leaves at the arterial end and most returns at the venous end; about 24 L/day is filtered and the rest goes back as lymph (slide 97).' },
    { id: 'failure', label: 'Heart failure', values: { ...NORMAL, pc: 50 }, caption: 'Raised venous pressure raises capillary pressure all along: filtration wins everywhere (slide 100).' },
    { id: 'standing', label: 'Long standing', values: { ...NORMAL, pc: 45 }, caption: 'Gravity, without the muscle pump, raises capillary pressure in the legs (slide 100).' },
    { id: 'liver', label: 'Liver disease', values: { ...NORMAL, pp: 15 }, caption: 'Low plasma proteins mean a weak pull back into the capillary (slide 102).' },
    { id: 'histamine', label: 'Histamine', values: { ...NORMAL, permeability: 1 }, caption: 'A leaky wall lets fluid and protein out (slide 101).' },
    { id: 'filaria', label: 'Lymphatics blocked', values: { ...NORMAL, lymph: 1 }, caption: 'Filarial worms or radical mastectomy: the normal excess cannot drain — non-pitting lymphoedema (slides 106–107).' },
  ],
  challenges: [
    {
      id: 'dry',
      label: 'Keep the tissues dry',
      prompt: 'Your patient has liver disease: plasma oncotic pressure is only 15 mmHg. Without touching plasma proteins, stop fluid building up in the tissues.',
      rules: ['Plasma oncotic pressure, the capillary wall and the lymphatics are locked.', 'You may change capillary pressure and tissue pressure.'],
      start: { ...NORMAL, pp: 15 },
      locked: ['pp', 'pi', 'permeability', 'lymph'],
      goals: [{ readout: 'swelling', atMost: 0, label: 'No fluid building up' }],
      debrief:
        'Oedema is a balance: with weak oncotic pull, a lower capillary hydrostatic pressure or a higher tissue pressure is needed to keep filtration within what reabsorption and lymph can return (slides 94–95, 99–102).',
    },
  ],
  modelNote:
    'Simplified teaching model of Starling’s forces from your lecture (The Heart slides 94–107). The resting pressures are standard textbook teaching values (not given on the slides), chosen so that about 24 L/day is filtered.',
};

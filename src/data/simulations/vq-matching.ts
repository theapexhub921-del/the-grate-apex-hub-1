// Respiratory Lesson 7 — Ventilation–perfusion and the respiratory membrane.
//
// Lecture (slides 72–87): arterial PO₂ 95–100, PCO₂ 40; venous PO₂ 40,
// PCO₂ 46 mmHg; alveolar PO₂ cannot exceed ≈ 149 mmHg; V/Q = 0 (perfused,
// not ventilated): alveolar gas equals venous blood (40/46); V/Q = ∞
// (ventilated, not perfused): inspired air (149/0); V/Q < 1 shunt, > 1
// dead space; the apex has a high V/Q and high PO₂; diffusion falls with a
// thicker membrane (oedema, fibrosis) or a smaller area (emphysema), and
// O₂ fails to get in before CO₂ fails to get out. The curve between the
// ends and the size of the membrane effect are illustrative.
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const MEMBRANES = ['Normal membrane', 'Thickened (oedema, fibrosis)', 'Less area (emphysema)'];
const O2_GAP = [0, 30, 20];
const CO2_GAP = [0, 1, 0.5];

export type VqState = SimState & {
  vq: number;
  membrane: number;
  alvO2: number;
  alvCO2: number;
  artO2: number;
  artCO2: number;
};

export function alveolarGas(vq: number) {
  const alvO2 = 149 - 109 / (1 + 1.224 * vq);
  const alvCO2 = 46 / (1 + 0.15 * vq);
  return { alvO2, alvCO2 };
}

export function vqKind(vq: number) {
  if (vq <= 0.001) return 0;
  if (vq < 0.8) return 1;
  if (vq <= 1.25) return 2;
  if (vq < 9.9) return 3;
  return 4;
}
export const VQ_KINDS = ['No ventilation (shunt)', 'Shunt-like (V/Q < 1)', 'Matched', 'Dead-space-like (V/Q > 1)', 'Almost no blood flow (dead space)'];

function model(values: Record<string, number>): VqState {
  const { vq, membrane } = values;
  const { alvO2, alvCO2 } = alveolarGas(vq);
  // The membrane only matters where there is a gradient to cross.
  const share = (alvO2 - 40) / 109;
  const artO2 = Math.max(40, alvO2 - (O2_GAP[membrane] ?? 0) * share);
  const artCO2 = Math.min(46, alvCO2 + (CO2_GAP[membrane] ?? 0) * share);
  const notes: string[] = [];
  if (vq === 0) notes.push('V/Q = 0: blood flows past an unventilated alveolus, so its gas matches venous blood and nothing is exchanged — a shunt.');
  if (vq >= 9.9) notes.push('Very high V/Q: like the lung apex — well ventilated, little blood, alveolar gas close to inspired air.');
  if (membrane > 0) notes.push('A damaged membrane lets O₂ in less well long before it stops CO₂ getting out.');
  return {
    readouts: { artO2, alvO2, artCO2, alvCO2, kind: vqKind(vq) },
    notes,
    vq,
    membrane,
    alvO2,
    alvCO2,
    artO2,
    artCO2,
  };
}

const START = { vq: 1, membrane: 0 };

export const vqMatching: SimDefinition<VqState> = {
  id: 'vq-matching',
  name: 'Ventilation–perfusion',
  controls: [
    { kind: 'slider', key: 'vq', label: 'Ventilation–perfusion ratio (V/Q)', min: 0, max: 10, step: 0.05, hint: '0 = no ventilation; 10 = hardly any blood flow', format: (v) => v.toFixed(2) },
    { kind: 'choice', key: 'membrane', label: 'Respiratory membrane', options: MEMBRANES.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'artO2', label: 'Blood PO₂ leaving', unit: 'mmHg', primary: true },
    { key: 'artCO2', label: 'Blood PCO₂ leaving', unit: 'mmHg' },
    { key: 'alvO2', label: 'Alveolar PO₂', unit: 'mmHg' },
    { key: 'alvCO2', label: 'Alveolar PCO₂', unit: 'mmHg' },
    { key: 'kind', label: 'This alveolus', noDelta: true, text: (v) => VQ_KINDS[v] ?? '' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'matched', label: 'Matched (V/Q = 1)', values: START, caption: 'Ventilation and blood flow match: blood leaves with PO₂ about 100 and PCO₂ 40.' },
    { id: 'shunt', label: 'Blocked airway (V/Q = 0)', values: { vq: 0, membrane: 0 }, caption: 'No air reaches the alveolus: blood leaves as venous blood, PO₂ 40, PCO₂ 46.' },
    { id: 'apex', label: 'Lung apex (high V/Q)', values: { vq: 3.3, membrane: 0 }, caption: 'Little blood flow: high alveolar PO₂ — why TB favours the apex.' },
    { id: 'fibrosis', label: 'Fibrosis', values: { vq: 1, membrane: 1 }, caption: 'A thick membrane: O₂ uptake falls, CO₂ removal barely changes.' },
  ],
  challenges: [
    {
      id: 'reopen',
      label: 'Reopen a partly blocked airway',
      prompt: 'A mucus plug has dropped this alveolus to V/Q 0.2. Restore its blood to PO₂ at least 95 and PCO₂ no more than 42 mmHg.',
      rules: ['The membrane is normal and stays so. Change only the ventilation–perfusion ratio.'],
      start: { vq: 0.2, membrane: 0 },
      locked: ['membrane'],
      goals: [
        { readout: 'artO2', atLeast: 95, label: 'Blood PO₂ at least 95 mmHg' },
        { readout: 'artCO2', atMost: 42, label: 'Blood PCO₂ at most 42 mmHg' },
      ],
      debrief: 'Bringing ventilation back up to match the blood flow (V/Q near 1) restores normal alveolar and arterial gases (slides 83–86).',
    },
  ],
  modelNote:
    'Simplified model of one alveolus. The end points (V/Q 0 → 40/46 mmHg; V/Q ∞ → 149/0), the normal arterial gases and the effects of the membrane are from the lecture (slides 72–87); the shape of the curve in between and the size of the membrane effect are illustrative.',
};

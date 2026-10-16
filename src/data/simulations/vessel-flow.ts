// Lesson 4 — Flow, resistance and turbulence in a blood vessel.
//
// Poiseuille–Hagen (The Heart slides 66, 74–76):
//   flow = ΔP × π/8 × 1/η × r⁴/L,   resistance = 8ηL / πr⁴
// shown relative to a normal vessel (100%).
// Turbulence (slides 70–72): Reynolds' number Re = ρDv/η. In a short
// narrowed segment the flow is set by the rest of the vessel, so the
// velocity there rises as v = Q/A (slide 73). Re is shown relative to
// the point where flow turns turbulent (index 1).
import type { SimDefinition, SimState } from '@/data/simulations/types';

const RE_REST = 0.3; // Reynolds index of a normal vessel (laminar)

export type FlowState = SimState & {
  radius: number;
  narrowRadius: number;
  stenosis: number;
  flow: number; // % of normal
  velocity: number; // % of normal, in the narrowing
  reynolds: number; // 1 = turbulence threshold
  turbulent: boolean;
};

function model(values: Record<string, number>): FlowState {
  const { r, length, viscosity, dp } = values;
  const stenosis = values.stenosis / 100;
  const flow = 100 * (dp / 100) * (r ** 4 / (length * viscosity));
  const resistance = (100 * length * viscosity) / r ** 4;
  const narrowRadius = r * (1 - stenosis);
  const velocity = flow / Math.max(0.0001, narrowRadius ** 2);
  const reynolds = (RE_REST * (flow / 100)) / Math.max(0.0001, narrowRadius * viscosity);
  const turbulent = reynolds >= 1;
  const notes: string[] = [];
  if (turbulent) notes.push('Flow is turbulent: you would hear a murmur or bruit over this vessel (slides 70–72).');
  return {
    readouts: { flow, resistance, velocity, reynolds, turbulent: turbulent ? 1 : 0 },
    notes,
    radius: r,
    narrowRadius,
    stenosis,
    flow,
    velocity,
    reynolds,
    turbulent,
  };
}

const NORMAL = { r: 1, length: 1, viscosity: 1, dp: 100, stenosis: 0 };
const times = (v: number) => `×${v.toFixed(2)}`;

export const vesselFlow: SimDefinition<FlowState> = {
  id: 'vessel-flow',
  name: 'Flow in a vessel',
  animated: true,
  controls: [
    { kind: 'slider', key: 'r', label: 'Radius', min: 0.5, max: 2, step: 0.01, hint: 'The whole vessel widens or narrows', format: times },
    { kind: 'slider', key: 'viscosity', label: 'Viscosity', min: 0.4, max: 2, step: 0.05, hint: 'Thick (polycythaemia) or thin (anaemia) blood', format: times },
    { kind: 'slider', key: 'length', label: 'Length', min: 0.5, max: 2, step: 0.05, format: times },
    { kind: 'slider', key: 'dp', label: 'Pressure drop (ΔP)', unit: '%', min: 50, max: 150, step: 1, hint: 'Arterial-end minus venous-end pressure' },
    { kind: 'slider', key: 'stenosis', label: 'Narrowed segment', unit: '%', min: 0, max: 80, step: 5, hint: 'A short plaque narrowing the diameter' },
  ],
  initial: NORMAL,
  readouts: [
    { key: 'flow', label: 'Flow vs normal', unit: '%', decimals: 0, primary: true },
    { key: 'resistance', label: 'Resistance vs normal', unit: '%' },
    { key: 'velocity', label: 'Speed in narrowing', unit: '%' },
    { key: 'reynolds', label: 'Flow pattern', noDelta: true, text: (v) => (v >= 1 ? 'Turbulent (noisy)' : 'Laminar (silent)') },
    { key: 'turbulent', label: 'Turbulent', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: NORMAL, caption: 'Laminar flow: fastest in the centre, still at the wall, and silent (slide 70).' },
    { id: 'constrict', label: 'Arteriole constricts', values: { ...NORMAL, r: 0.8 }, caption: 'A 20% smaller radius cuts flow by about 60%, because resistance varies with 1/r⁴ (slides 74–76).' },
    { id: 'dilate', label: 'Arteriole dilates', values: { ...NORMAL, r: 1.2 }, caption: 'A 20% wider radius roughly doubles flow: this is how organs regulate their blood flow (slide 76).' },
    { id: 'polycythaemia', label: 'Polycythaemia', values: { ...NORMAL, viscosity: 1.6 }, caption: 'Thicker blood raises resistance — more afterload and more work for the heart (slides 77–78).' },
    { id: 'anaemia', label: 'Anaemia', values: { ...NORMAL, viscosity: 0.5 }, caption: 'Low viscosity: faster flow and a higher Reynolds’ number, so turbulence and flow murmurs appear (slides 72, 40).' },
    { id: 'plaque', label: 'Narrowed artery', values: { ...NORMAL, stenosis: 75 }, caption: 'Blood speeds up through the narrowing (v = Q/A), turns turbulent and gives a bruit (slides 72–73).' },
  ],
  challenges: [
    {
      id: 'double',
      label: 'Double the flow',
      prompt: 'Using the radius alone, double the flow through this vessel (195–205% of normal).',
      rules: ['Only the radius is unlocked.', 'Guess first: how much wider must it get?'],
      start: NORMAL,
      locked: ['viscosity', 'length', 'dp', 'stenosis'],
      goals: [{ readout: 'flow', atLeast: 195, atMost: 205, label: 'Flow 195–205% of normal' }],
      debrief:
        'Only about 19% wider: because flow rises with r⁴, a small change in radius has a huge effect. That is why arterioles, by varying their diameter, are the main resistance vessels (slides 74–76).',
    },
    {
      id: 'bruit',
      label: 'Make a murmur',
      prompt: 'Make the flow turbulent by changing the blood alone.',
      rules: ['Only viscosity is unlocked.'],
      start: NORMAL,
      locked: ['r', 'length', 'dp', 'stenosis'],
      goals: [{ readout: 'turbulent', atLeast: 1, label: 'Turbulent flow' }],
      debrief:
        'Thin blood (low viscosity, as in anaemia) flows faster and has a higher Reynolds’ number (Re = ρDv/η), so flow turns turbulent and noisy (slides 71–72, 40).',
    },
  ],
  modelNote:
    'Simplified teaching model using Poiseuille’s law and Reynolds’ number from your lecture (The Heart slides 66–78). Values are relative to a normal vessel; the turbulence threshold is illustrative.',
};

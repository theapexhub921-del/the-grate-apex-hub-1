// CNS Lesson 7 — Reaching for a target: the cerebellum as a damper.
//
// Lecture (Cerebellum, slides 13–18): the cerebellum compares intention
// with performance and coordinates agonists and antagonists; movement is
// usually pendular and the cerebellum damps it — destroy it and the limb
// overshoots (intention tremor); dysmetria and past-pointing. The limb is
// modelled as a spring–mass system whose damping comes from the
// cerebellum; the numbers are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const SPAN = 3; // seconds shown
const DT = 0.002;

export function damping(cerebellum: number, speed: number) {
  return (0.2 + (0.8 * cerebellum) / 100) / Math.sqrt(speed);
}

// Finger position (0 = start, 1 = target) over time.
export function trajectory(cerebellum: number, speed: number): [number, number][] {
  const zeta = damping(cerebellum, speed);
  const omega = 5 * speed;
  let x = 0;
  let v = 0;
  const points: [number, number][] = [[0, 0]];
  const every = Math.round(0.02 / DT);
  for (let i = 1; i <= SPAN / DT; i++) {
    const a = omega * omega * (1 - x) - 2 * zeta * omega * v;
    v += a * DT;
    x += v * DT;
    if (i % every === 0) points.push([i * DT, x]);
  }
  return points;
}

export type ReachState = SimState & {
  cerebellum: number;
  speed: number;
  path: [number, number][];
  overshoot: number;
  swings: number;
  settle: number;
};

function model(values: Record<string, number>): ReachState {
  const { cerebellum, speed } = values;
  const path = trajectory(cerebellum, speed);
  const peak = Math.max(...path.map(([, x]) => x));
  const overshoot = Math.max(0, (peak - 1) * 100);
  // Swings: times the finger crosses the target, missing by more than 5% on the far side.
  let swings = 0;
  let side = 0;
  let worst = 0;
  for (const [, x] of path) {
    const s = x > 1 ? 1 : -1;
    if (side !== 0 && s !== side) {
      if (worst > 0.05) swings += 1;
      worst = 0;
    }
    side = s;
    worst = Math.max(worst, Math.abs(x - 1));
  }
  let settle = 0;
  for (const [t, x] of path) if (Math.abs(x - 1) > 0.05) settle = t;
  const notes: string[] = [];
  if (overshoot >= 5) notes.push('The finger overshoots the target and has to come back: dysmetria, seen as past-pointing in the finger–nose test.');
  if (swings >= 3) notes.push('The finger swings back and forth around the target: intention tremor, from loss of damping.');
  return {
    readouts: {
      overshoot,
      swings,
      settle: clamp(settle, 0, SPAN),
      grade: overshoot < 5 ? 0 : swings >= 3 ? 2 : 1,
    },
    notes,
    cerebellum,
    speed,
    path,
    overshoot,
    swings,
    settle,
  };
}

const START = { cerebellum: 100, speed: 1 };

export const cerebellarReach: SimDefinition<ReachState> = {
  id: 'cerebellar-reach',
  name: 'Finger to target',
  animated: true,
  controls: [
    { kind: 'slider', key: 'cerebellum', label: 'Cerebellar function', unit: '%', min: 0, max: 100, step: 1 },
    { kind: 'slider', key: 'speed', label: 'Speed of the reach', min: 0.5, max: 2, step: 0.05, format: (v) => `×${v.toFixed(2)}` },
  ],
  initial: START,
  readouts: [
    { key: 'overshoot', label: 'Overshoot', unit: '%', primary: true },
    { key: 'swings', label: 'Swings past the target', decimals: 0 },
    { key: 'settle', label: 'Time to settle', unit: 's', decimals: 2 },
    { key: 'grade', label: 'The reach', noDelta: true, text: (v) => ['On target', 'Overshoots (dysmetria)', 'Intention tremor'][v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Healthy', values: START, caption: 'The cerebellum compares the plan with the movement and damps it, so the finger stops on target.' },
    { id: 'lesion', label: 'Cerebellar damage', values: { cerebellum: 10, speed: 1 }, caption: 'Without damping the movement is pendular: overshoot, correction, overshoot — intention tremor.' },
    { id: 'fast', label: 'Damaged and fast', values: { cerebellum: 10, speed: 2 }, caption: 'A fast reach gives even less time to correct.' },
    { id: 'slow', label: 'Damaged but slow', values: { cerebellum: 10, speed: 0.5 }, caption: 'Moving slowly helps — the patient leans more on feedback.' },
  ],
  challenges: [
    {
      id: 'careful',
      label: 'Steady the hand',
      prompt: 'Cerebellar function is down to 30%. Reach the target with an overshoot of 15% or less.',
      rules: ['Cerebellar function is fixed. You can change only the speed.'],
      start: { cerebellum: 30, speed: 1.5 },
      locked: ['cerebellum'],
      goals: [{ readout: 'overshoot', atMost: 15, label: 'Overshoot 15% or less' }],
      debrief: 'Slowing down gives the remaining feedback time to brake the movement. People with cerebellar disease often move slowly and deliberately for this reason; fast, ballistic movements are the ones that overshoot most.',
    },
  ],
  modelNote:
    'Simplified teaching model: the limb is treated as a pendular (spring–mass) system and the cerebellum supplies its damping. That the cerebellum damps pendular movement, and that losing it gives overshoot, intention tremor and past-pointing, is from Cerebellum, slides 16 and 18; the equation and numbers are illustrative.',
};

// CNS Lesson 2 — The knee jerk: muscle spindle, γ-efferents, reciprocal
// innervation and the Golgi tendon organ.
//
// Lecture (Sensory I, pp. 12–27): stretch → spindle → Ia afferent (dorsal
// root) → α-motor neuron (ventral horn) → contraction, monosynaptic.
// γ discharge raises spindle sensitivity (p. 24); Ia impulses inhibit the
// antagonist (p. 25); the Golgi tendon organ, in series, causes IPSPs in
// motor neurons and relaxation when tension is high (pp. 26–27). The
// firing rates and angles are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const LESIONS = ['Intact', 'Dorsal root cut', 'Ventral root cut'];
export const GRADES = ['Absent', 'Reduced', 'Normal', 'Brisk'];
export const GTO_THRESHOLD = 70; // % tension at which the tendon organ starts to inhibit

export type ReflexState = SimState & {
  tap: number;
  gamma: number;
  tension: number;
  lesion: number;
  ia: number; // spindle afferent firing (at the spindle)
  iaCord: number; // what reaches the cord
  gto: number;
  ipsp: number;
  alpha: number;
  kick: number; // degrees
  hamstrings: number; // % activity
};

export function sensitivity(gamma: number) {
  return 0.5 + gamma / 40;
}

function model(values: Record<string, number>): ReflexState {
  const { tap, gamma, tension, lesion } = values;
  const ia = 5 + 8 * tap * sensitivity(gamma);
  const iaCord = lesion === 1 ? 0 : ia;
  const gto = Math.max(0, (tension - 20) * 1.5);
  const ipsp = Math.max(0, (tension - GTO_THRESHOLD) * 3);
  const alpha = Math.max(0, 0.9 * iaCord - ipsp);
  const kick = lesion === 2 ? 0 : clamp((alpha - 15) * 0.6, 0, 60);
  const grade = kick < 2 ? 0 : kick < 12 ? 1 : kick <= 30 ? 2 : 3;
  const hamstrings = clamp(30 - 0.3 * alpha, 0, 30);
  const notes: string[] = [];
  if (lesion === 1) notes.push('Dorsal root cut: the spindle still fires, but its signal never reaches the cord — no reflex, and no reciprocal inhibition.');
  if (lesion === 2) notes.push('Ventral root cut: the α-motor neuron fires, but the signal cannot reach the muscle.');
  if (ipsp > 0) notes.push('Tension is high: the Golgi tendon organ causes IPSPs in the α-motor neuron and the muscle relaxes — the inverse stretch reflex.');
  return {
    readouts: { kick, grade, ia, alpha, gto, hamstrings },
    notes,
    tap,
    gamma,
    tension,
    lesion,
    ia,
    iaCord,
    gto,
    ipsp,
    alpha,
    kick,
    hamstrings,
  };
}

const START = { tap: 5, gamma: 30, tension: 20, lesion: 0 };

export const stretchReflex: SimDefinition<ReflexState> = {
  id: 'stretch-reflex',
  name: 'The knee jerk',
  controls: [
    { kind: 'slider', key: 'tap', label: 'Tap on the patellar tendon', unit: 'mm stretch', min: 0, max: 8, step: 0.5 },
    { kind: 'slider', key: 'gamma', label: 'γ-efferent discharge', unit: '%', min: 0, max: 100, step: 1, hint: 'Raised by descending tracts, anxiety, Jendrassik’s manoeuvre' },
    { kind: 'slider', key: 'tension', label: 'Tension in the quadriceps tendon', unit: '%', min: 0, max: 100, step: 1, hint: 'How hard the muscle is already pulling' },
    { kind: 'choice', key: 'lesion', label: 'Nerve roots', options: LESIONS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'kick', label: 'Knee jerk', unit: '°', primary: true },
    { key: 'grade', label: 'Reflex', noDelta: true, text: (v) => GRADES[v] ?? '' },
    { key: 'ia', label: 'Spindle afferent', unit: '/s' },
    { key: 'alpha', label: 'Alpha motor neuron', unit: '/s' },
    { key: 'gto', label: 'Tendon organ firing', unit: '/s' },
    { key: 'hamstrings', label: 'Hamstring activity', unit: '%' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal knee jerk', values: START, caption: 'Tap → spindle stretched → Ia → α-motor neuron → quadriceps contracts. One synapse.' },
    { id: 'anxious', label: 'Anxious patient', values: { ...START, gamma: 80 }, caption: 'Descending signals raise γ discharge: the spindle is more sensitive, so the same tap gives a brisk jerk (Sensory I, p. 25).' },
    { id: 'dorsal', label: 'Dorsal root cut', values: { ...START, lesion: 1 }, caption: 'No afferent signal reaches the cord, so there is no reflex.' },
    { id: 'gto', label: 'Heavy load', values: { ...START, tension: 95 }, caption: 'High tendon tension: the Golgi tendon organ inhibits the α-motor neuron — relaxation protects the tendon.' },
  ],
  challenges: [
    {
      id: 'reinforce',
      label: 'Reinforce a weak reflex',
      prompt: 'The patient is so relaxed that the knee jerk is absent with a gentle tap. Bring it back into the normal range (12–30°) — without hitting harder.',
      rules: ['The tap, tendon tension and nerve roots are fixed. You can change only γ-efferent discharge (as Jendrassik’s manoeuvre does).'],
      start: { tap: 3, gamma: 0, tension: 20, lesion: 0 },
      locked: ['tap', 'tension', 'lesion'],
      goals: [
        { readout: 'kick', atLeast: 12, atMost: 30, label: 'Knee jerk 12–30°' },
      ],
      debrief:
        'Raising γ discharge contracts the ends of the intrafusal fibres and stretches the middle of the spindle, so the same tap produces more Ia firing. Jendrassik’s manoeuvre (pulling the hooked fingers apart) reinforces a weak reflex this way.',
    },
  ],
  modelNote:
    'Simplified teaching model of one quadriceps reflex arc. The pathway, γ control, reciprocal innervation and the inverse stretch reflex are from Sensory I, pp. 12–27; firing rates, the 70% tension threshold and the angles are illustrative.',
};

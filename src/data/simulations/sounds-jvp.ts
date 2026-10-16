// Lesson 2 — Heart sounds, murmurs and the JVP over one beat.
//
// From The Heart slides 26–36: S1 = AV valves closing (start of systole);
// S2 = aortic and pulmonary valves closing (end of systole), split in
// inspiration (aortic before pulmonary). Murmur timing follows slide 36:
// semilunar stenosis / AV incompetence → systolic; the reverse → diastolic.
// JVP waves (slide 27) and their changes (slide 28): big c wave in
// tricuspid incompetence, giant a wave in heart block.
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const BEAT = 60 / 70; // seconds

export const TIMES = {
  aStart: 0,
  s1: 0.1, // AV valves close: start of ventricular systole
  ejectStart: 0.15,
  a2: 0.43, // aortic valve closes
  yStart: 0.5, // tricuspid opens
} as const;

export const LESIONS = [
  { label: 'No lesion', phase: 0, flow: 0 },
  { label: 'Aortic stenosis', phase: 1, flow: 1 },
  { label: 'Aortic incompetence', phase: 2, flow: 2 },
  { label: 'Mitral stenosis', phase: 2, flow: 1 },
  { label: 'Mitral incompetence', phase: 1, flow: 2 },
] as const;

export type MurmurBand = { start: number; end: number; shape: 'diamond' | 'plateau' | 'decrescendo' | 'rumble' };

export type SoundsState = SimState & {
  split: number; // seconds between A2 and P2
  murmur: MurmurBand[];
  jvp: [number, number][]; // [time s, height]
  jvpLabels: { label: string; t: number }[];
};

function jvpCurve(condition: number): { points: [number, number][]; labels: { label: string; t: number }[] } {
  const points: [number, number][] = [];
  const a = condition === 2 ? 13 : 4;
  const c = condition === 1 ? 9 : 2;
  const bump = (t: number, centre: number, width: number) => Math.exp(-(((t - centre) / width) ** 2));
  for (let i = 0; i <= 200; i++) {
    const t = (BEAT * i) / 200;
    let h = 5;
    h += a * bump(t, 0.05, 0.035); // a: atrial contraction
    h += c * bump(t, 0.13, condition === 1 ? 0.07 : 0.025); // c: tricuspid bulging (or regurgitation)
    h -= 2.5 * bump(t, 0.28, 0.07); // x descent
    h += (condition === 1 ? 4 : 3) * bump(t, 0.46, 0.05); // v: filling with tricuspid shut
    h -= 2 * bump(t, 0.58, 0.06); // y descent: tricuspid opens
    points.push([t, h]);
  }
  const labels = [
    { label: condition === 2 ? 'giant a' : 'a', t: 0.05 },
    { label: condition === 1 ? 'big c' : 'c', t: 0.13 },
    { label: 'x', t: 0.28 },
    { label: 'v', t: 0.46 },
    { label: 'y', t: 0.58 },
  ];
  return { points, labels };
}

function model(values: Record<string, number>): SoundsState {
  const lesion = LESIONS[Math.round(values.lesion)] ?? LESIONS[0];
  const split = values.breath === 1 ? 0.04 : 0.008;
  const murmur: MurmurBand[] = [];
  switch (Math.round(values.lesion)) {
    case 1:
      murmur.push({ start: TIMES.ejectStart + 0.02, end: TIMES.a2 - 0.02, shape: 'diamond' });
      break;
    case 2:
      murmur.push({ start: TIMES.a2 + 0.01, end: 0.72, shape: 'decrescendo' });
      break;
    case 3:
      murmur.push({ start: 0.56, end: 0.8, shape: 'rumble' }, { start: 0.0, end: 0.09, shape: 'rumble' });
      break;
    case 4:
      murmur.push({ start: TIMES.s1, end: TIMES.a2, shape: 'plateau' });
      break;
  }
  const condition = Math.round(values.jvp);
  const { points, labels } = jvpCurve(condition);
  return {
    readouts: {
      s2Split: split * 1000,
      murmurPhase: lesion.phase,
      flow: lesion.flow,
      aWave: condition === 2 ? 13 : 4,
      cWave: condition === 1 ? 9 : 2,
      jvp: condition,
    },
    notes: [],
    split,
    murmur,
    jvp: points,
    jvpLabels: labels,
  };
}

const REST = { breath: 0, lesion: 0, jvp: 0 };

export const soundsJvp: SimDefinition<SoundsState> = {
  id: 'sounds-jvp',
  name: 'Heart sounds and JVP',
  animated: true,
  controls: [
    {
      kind: 'choice',
      key: 'breath',
      label: 'Breathing',
      options: [
        { value: 0, label: 'Breathing out' },
        { value: 1, label: 'Breathing in' },
      ],
    },
    {
      kind: 'choice',
      key: 'lesion',
      label: 'Valve lesion',
      options: LESIONS.map((item, value) => ({ value, label: item.label })),
    },
    {
      kind: 'choice',
      key: 'jvp',
      label: 'Neck veins',
      options: [
        { value: 0, label: 'Normal' },
        { value: 1, label: 'Tricuspid incompetence' },
        { value: 2, label: 'Complete heart block' },
      ],
    },
  ],
  initial: REST,
  readouts: [
    { key: 's2Split', label: 'S2', noDelta: true, primary: true, text: (v) => (v > 20 ? `Split: A2 then P2 (${Math.round(v)} ms)` : 'Single (A2 and P2 together)') },
    { key: 'murmurPhase', label: 'Murmur', noDelta: true, text: (v) => ['None', 'Systolic', 'Diastolic'][v] ?? '' },
    { key: 'flow', label: 'Cause', noDelta: true, text: (v) => ['—', 'Forward flow through a narrow valve', 'Backflow through a leaky valve'][v] ?? '' },
    { key: 'jvp', label: 'JVP', noDelta: true, text: (v) => ['Normal waves', 'Big c wave', 'Giant a wave'][v] ?? '' },
    { key: 'aWave', label: 'a wave', hidden: true },
    { key: 'cWave', label: 'c wave', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: REST, caption: 'S1 starts systole (AV valves close); S2 ends it (aortic and pulmonary valves close). Silent, laminar flow in between (slides 30, 35).' },
    { id: 'inspiration', label: 'Breathing in', values: { breath: 1, lesion: 0, jvp: 0 }, caption: 'More venous return and lower pulmonary resistance prolong right ventricular ejection, so P2 comes after A2 (slide 34).' },
    { id: 'as', label: 'Aortic stenosis', values: { breath: 0, lesion: 1, jvp: 0 }, caption: 'Forward flow through a narrow aortic valve during ejection: a systolic murmur (slide 36).' },
    { id: 'ar', label: 'Aortic incompetence', values: { breath: 0, lesion: 2, jvp: 0 }, caption: 'Backflow through a leaky aortic valve after it should have closed: a diastolic murmur (slide 36).' },
    { id: 'ms', label: 'Mitral stenosis', values: { breath: 0, lesion: 3, jvp: 0 }, caption: 'Forward flow through a narrow mitral valve while the ventricle fills: a diastolic murmur (slide 36).' },
    { id: 'mr', label: 'Mitral incompetence', values: { breath: 0, lesion: 4, jvp: 0 }, caption: 'Backflow into the atrium while the ventricle contracts: a systolic murmur (slide 36).' },
    { id: 'ti', label: 'Tricuspid incompetence', values: { breath: 0, lesion: 0, jvp: 1 }, caption: 'Regurgitation through the tricuspid valve gives a big c wave in the neck veins (slide 28).' },
    { id: 'block', label: 'Heart block', values: { breath: 0, lesion: 0, jvp: 2 }, caption: 'The atrium contracts against a closed tricuspid valve: a giant a wave (slide 28).' },
  ],
  challenges: [
    {
      id: 'systolic-backflow',
      label: 'Systolic backflow',
      prompt: 'Choose a lesion that gives a systolic murmur caused by backflow.',
      rules: ['Think: which valve should be shut while the ventricle contracts?'],
      start: REST,
      locked: ['breath', 'jvp'],
      goals: [
        { readout: 'murmurPhase', atLeast: 1, atMost: 1, label: 'Murmur in systole' },
        { readout: 'flow', atLeast: 2, atMost: 2, label: 'Caused by backflow' },
      ],
      debrief: 'Mitral (or tricuspid) incompetence: the AV valves should be shut in systole, so a leak lets blood flow back into the atrium while the ventricle contracts (slide 36).',
    },
    {
      id: 'diastolic-forward',
      label: 'Diastolic forward flow',
      prompt: 'Choose a lesion that gives a diastolic murmur caused by forward flow.',
      rules: ['Think: which valve should be open while the ventricle fills?'],
      start: REST,
      locked: ['breath', 'jvp'],
      goals: [
        { readout: 'murmurPhase', atLeast: 2, atMost: 2, label: 'Murmur in diastole' },
        { readout: 'flow', atLeast: 1, atMost: 1, label: 'Caused by forward flow' },
      ],
      debrief: 'Mitral (or tricuspid) stenosis: the AV valves are open in diastole, so a narrow valve makes the filling flow turbulent (slide 36).',
    },
  ],
  modelNote:
    'Simplified timing diagram of one beat at 70 /min, following your lecture (The Heart slides 26–36). Wave sizes are illustrative. Shown 4× slower than real time.',
};

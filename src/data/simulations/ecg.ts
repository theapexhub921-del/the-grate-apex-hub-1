// Lesson 9 — Build an ECG strip.
//
// From the ECG lecture (slides 2–26): paper at 25 mm/s, 1 mV = 10 mm;
// small square 0.04 s, large square 0.2 s; HR = 1500 ÷ small squares
// between R waves. P = atrial depolarisation, PR 0.12–0.20 s, QRS =
// ventricular depolarisation (0.06–0.1 s), T = repolarisation.
// Heart block: 1st degree long PR; Mobitz I PR lengthens until a beat is
// dropped; Mobitz II sudden dropped QRS (e.g. 2:1); 3rd degree P and QRS
// independent, slow idioventricular rhythm. Sinus arrhythmia: faster in
// inspiration, slower in expiration (slide 19).
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const STRIP_SECONDS = 6;
export const RHYTHMS = ['Sinus rhythm', 'First-degree block', 'Mobitz I (Wenckebach)', 'Mobitz II (2:1)', 'Complete heart block'] as const;

export type EcgBeat = { p: number; qrs: number | null; pr: number | null; wide: boolean };

export type EcgState = SimState & {
  beats: EcgBeat[];
  escape: number[]; // QRS times in complete block
  trace: [number, number][]; // [seconds, mV]
};

const gauss = (t: number, centre: number, width: number, height: number) => height * Math.exp(-(((t - centre) / width) ** 2));

function model(values: Record<string, number>): EcgState {
  const rhythm = Math.round(values.rhythm);
  const rate = values.hr;
  const interval = 60 / rate;
  const breathing = values.breath === 1 && rhythm === 0;

  // Atrial (P wave) times across the strip.
  const pTimes: number[] = [];
  let t = 0.2;
  while (t < STRIP_SECONDS) {
    pTimes.push(t);
    const swing = breathing ? 1 - 0.14 * Math.sin((2 * Math.PI * t) / 4) : 1; // faster in inspiration
    t += interval * swing;
  }

  const beats: EcgBeat[] = [];
  const escape: number[] = [];
  pTimes.forEach((p, i) => {
    let pr: number | null = 0.16;
    if (rhythm === 1) pr = 0.28;
    if (rhythm === 2) pr = [0.16, 0.24, 0.32, null][i % 4];
    if (rhythm === 3) pr = i % 2 === 0 ? 0.16 : null;
    if (rhythm === 4) pr = null;
    beats.push({ p, pr, qrs: pr === null ? null : p + pr, wide: false });
  });
  if (rhythm === 4) {
    for (let q = 0.45; q < STRIP_SECONDS; q += 1.5) escape.push(q); // idioventricular, 40 /min
  }

  const qrsTimes = [...beats.filter((b) => b.qrs !== null).map((b) => ({ t: b.qrs as number, wide: false })), ...escape.map((q) => ({ t: q, wide: true }))];
  const trace: [number, number][] = [];
  for (let i = 0; i <= STRIP_SECONDS * 250; i++) {
    const s = i / 250;
    let v = 0;
    for (const b of beats) v += gauss(s, b.p + 0.045, 0.022, 0.15);
    for (const q of qrsTimes) {
      const w = q.wide ? 1.8 : 1;
      v += gauss(s, q.t + 0.01 * w, 0.008 * w, -0.12);
      v += gauss(s, q.t + 0.035 * w, 0.011 * w, 1.2);
      v += gauss(s, q.t + 0.06 * w, 0.01 * w, -0.25);
      v += gauss(s, q.t + (q.wide ? 0.36 : 0.28), 0.05, q.wide ? -0.3 : 0.3);
    }
    trace.push([s, v]);
  }

  const conducted = rhythm === 4 ? 0 : beats.filter((b) => b.qrs !== null).length / Math.max(1, beats.length);
  const ventricularRate = rhythm === 4 ? 40 : rhythm === 2 ? rate * 0.75 : rhythm === 3 ? rate / 2 : rate;
  const prs = beats.map((b) => b.pr).filter((x): x is number => x !== null);
  const longestPr = prs.length ? Math.max(...prs) : 0;

  const notes: string[] = [];
  if (ventricularRate < 45) notes.push('A ventricular rate this slow can starve the brain of blood: fainting and dizziness (Stokes–Adams syndrome, slide 20).');

  return {
    readouts: {
      ventricularRate,
      atrialRate: rate,
      squares: 1500 / ventricularRate,
      pr: longestPr * 1000,
      conduction: rhythm === 2 ? 0.75 : rhythm === 3 ? 0.5 : conducted,
      rhythm,
    },
    notes,
    beats,
    escape,
    trace,
  };
}

const SINUS = { hr: 75, rhythm: 0, breath: 0 };

export const ecg: SimDefinition<EcgState> = {
  id: 'ecg',
  name: 'ECG strip',
  controls: [
    { kind: 'slider', key: 'hr', label: 'SA node rate', unit: '/min', min: 40, max: 180, step: 1, hint: 'Rate of P waves' },
    { kind: 'choice', key: 'rhythm', label: 'Conduction', options: RHYTHMS.map((label, value) => ({ value, label })) },
    {
      kind: 'choice',
      key: 'breath',
      label: 'Breathing effect',
      options: [
        { value: 0, label: 'Off' },
        { value: 1, label: 'Sinus arrhythmia' },
      ],
    },
  ],
  initial: SINUS,
  readouts: [
    { key: 'ventricularRate', label: 'Heart rate (QRS)', unit: '/min', primary: true },
    { key: 'atrialRate', label: 'P-wave rate', unit: '/min' },
    { key: 'squares', label: 'R to R', noDelta: true, text: (v, all) => (all.rhythm === 0 || all.rhythm === 1 ? `${v.toFixed(1)} small squares` : 'Irregular or unrelated') },
    { key: 'pr', label: 'PR interval', noDelta: true, text: (v, all) => (all.rhythm === 4 ? 'No fixed PR' : all.rhythm === 2 ? `Lengthens to ${Math.round(v)} ms` : `${Math.round(v)} ms`) },
    { key: 'conduction', label: 'P waves conducted', noDelta: true, text: (v) => (v >= 0.99 ? 'Every one' : v > 0 ? `${Math.round(v * 100)}%` : 'None — independent') },
    { key: 'rhythm', label: 'Rhythm', hidden: true, noDelta: true, text: (v) => RHYTHMS[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'sinus', label: 'Sinus rhythm', values: SINUS, caption: 'Each P is followed by a QRS after a normal PR (0.12–0.20 s). 20 small squares between R waves: 1500 ÷ 20 = 75 /min (slides 15–18).' },
    { id: 'tachy', label: 'Sinus tachycardia', values: { ...SINUS, hr: 120 }, caption: 'Faster than normal, every beat still from the SA node (slide 18).' },
    { id: 'brady', label: 'Sinus bradycardia', values: { ...SINUS, hr: 50 }, caption: 'Slower than normal (slide 18).' },
    { id: 'arrhythmia', label: 'Sinus arrhythmia', values: { ...SINUS, breath: 1 }, caption: 'The rate speeds up in inspiration and slows in expiration, mainly through the vagus (slide 19).' },
    { id: 'first', label: 'First-degree block', values: { ...SINUS, rhythm: 1 }, caption: 'Every P conducts, but late: a long PR interval (slide 21).' },
    { id: 'mobitz1', label: 'Mobitz I', values: { ...SINUS, rhythm: 2 }, caption: 'The PR lengthens beat by beat until a P wave has no QRS (Wenckebach, slide 22).' },
    { id: 'mobitz2', label: 'Mobitz II', values: { ...SINUS, rhythm: 3 }, caption: 'Normal PR, but some QRS complexes are suddenly missing — here 2:1 (slide 23).' },
    { id: 'complete', label: 'Complete block', values: { ...SINUS, rhythm: 4 }, caption: 'P waves and QRS complexes march independently; the ventricles beat slowly and the QRS is wide (slides 24–26).' },
  ],
  challenges: [
    {
      id: 'twenty',
      label: '20 small squares',
      prompt: 'Set the SA node so that the R waves are exactly 20 small squares apart.',
      rules: ['Rhythm and breathing are locked to sinus rhythm.', 'Use HR = 1500 ÷ small squares.'],
      start: { ...SINUS, hr: 60 },
      locked: ['rhythm', 'breath'],
      goals: [{ readout: 'squares', atLeast: 19.95, atMost: 20.05, label: 'R to R = 20 small squares' }],
      debrief: '1500 ÷ 20 = 75 beats/min. Each small square is 0.04 s, so 20 squares = 0.8 s per beat (slides 15–16).',
    },
    {
      id: 'every-second',
      label: 'Every second P alone',
      prompt: 'Make an ECG where every second P wave has no QRS after it, with a normal PR for the beats that do conduct.',
      rules: ['Choose the conduction pattern.'],
      start: SINUS,
      locked: ['hr', 'breath'],
      goals: [{ readout: 'conduction', atLeast: 0.49, atMost: 0.51, label: 'Half the P waves conducted' }],
      debrief: 'Mobitz II (second-degree) block with 2:1 conduction: the PR is normal, but some impulses are blocked outright, here every second one (slide 23).',
    },
  ],
  modelNote:
    'Simplified ECG drawn on standard paper (25 mm/s, 1 mV = 10 mm), following your lecture (ECG slides 2–26). Wave shapes are illustrative.',
};

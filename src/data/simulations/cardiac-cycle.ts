// Lesson 1 — The cardiac cycle, beat by beat.
//
// One beat of the left heart: left ventricular, aortic and left atrial
// pressures and ventricular volume, with the phases and valves of
// The Heart slides 12–20. The beat starts with atrial systole.
// Resting values from the lecture: filling 70% passive / 30% atrial,
// aortic valve opens at ~80 mmHg, LV peak ~120 mmHg, EDV ~130 mL,
// EF ~65%. Faster rates shorten diastole much more than systole (slide 20).
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const CYCLE_PHASES = [
  { name: 'Atrial systole', av: true, semilunar: false, systole: false },
  { name: 'Isovolumetric contraction', av: false, semilunar: false, systole: true },
  { name: 'Ejection', av: false, semilunar: true, systole: true },
  { name: 'Isovolumetric relaxation', av: false, semilunar: false, systole: false },
  { name: 'Filling', av: true, semilunar: false, systole: false },
] as const;

export type CycleSample = { t: number; lv: number; ao: number; la: number; volume: number };

export type CycleState = SimState & {
  beat: number;
  systole: number;
  diastole: number;
  bounds: number[]; // start time of each phase, then the beat length
  samples: CycleSample[];
  edv: number;
  esv: number;
  conduction: { name: string; start: number; end: number }[]; // times within the beat (may wrap)
  moment: number; // the paused moment, seconds into the beat
};

const ESV = 45;
const PASSIVE = 59.5; // 70% of an 85 mL filling
const ATRIAL = 25.5; // 30%
const TAU = 0.08;

function bez(a: number, b: number, c: number, d: number, t: number) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

export function phaseAt(time: number, bounds: number[]) {
  for (let i = 0; i < CYCLE_PHASES.length; i++) {
    if (time < bounds[i + 1]) return i;
  }
  return CYCLE_PHASES.length - 1;
}

function model(values: Record<string, number>): CycleState {
  const hr = values.hr;
  const beat = 60 / hr;
  const systole = clamp(0.33 - 0.000875 * (hr - 70), 0.2, 0.36);
  const diastole = beat - systole;
  const atrial = Math.min(0.1, diastole * 0.35);
  const ivc = 0.05;
  const ivr = Math.min(0.06, diastole * 0.3);
  const fill = Math.max(0.005, diastole - atrial - ivr);
  const bounds = [0, atrial, atrial + ivc, atrial + systole, atrial + systole + ivr, beat];

  const restFill = 1 - Math.exp(-0.367 / TAU);
  const passiveEnd = (PASSIVE * (1 - Math.exp(-fill / TAU))) / restFill;
  const atrialAdd = ATRIAL * Math.min(1, atrial / 0.1);
  const startVolume = ESV + passiveEnd;
  const edv = startVolume + atrialAdd;
  const sv = edv - ESV;
  const aorticEnd = 80;
  const decay = beat - (atrial + systole) + atrial + ivc; // from valve closure to next opening
  const k = Math.log(99 / aorticEnd) / Math.max(0.05, decay - 0.03);

  const aortaInDiastole = (since: number) => {
    if (since < 0.015) return 100 - (since / 0.015) * 4;
    if (since < 0.03) return 96 + ((since - 0.015) / 0.015) * 3;
    return 99 * Math.exp(-k * (since - 0.03));
  };

  const samples: CycleSample[] = [];
  const N = 240;
  for (let i = 0; i <= N; i++) {
    const t = (beat * i) / N;
    const phase = phaseAt(t, bounds);
    const s = clamp((t - bounds[phase]) / Math.max(1e-6, bounds[phase + 1] - bounds[phase]), 0, 1);
    let lv = 4;
    let la = 5;
    let volume = ESV;
    let ao = 80;
    const afterClosure = beat - bounds[3]; // time from aortic closure to the end of the beat
    switch (phase) {
      case 0:
        lv = 5 + 3 * s;
        la = 5 + 4 * Math.sin(Math.PI * s);
        volume = startVolume + atrialAdd * (s * s * (3 - 2 * s));
        ao = aortaInDiastole(afterClosure + t);
        break;
      case 1:
        lv = 8 + 72 * s * s;
        la = 5 + 2 * Math.sin(Math.PI * s);
        volume = edv;
        ao = aortaInDiastole(afterClosure + t);
        break;
      case 2:
        lv = bez(80, 138, 122, 100, s);
        ao = lv - 1.5 * Math.sin(Math.PI * s);
        la = 3 + 7 * Math.pow(s, 1.2);
        volume = edv - sv * (1 - (1 - s) * (1 - s));
        break;
      case 3:
        lv = 5 + 95 * Math.pow(1 - s, 3);
        la = 10 + s;
        volume = ESV;
        ao = aortaInDiastole(t - bounds[3]);
        break;
      default: {
        const since = t - bounds[4];
        lv = 3 + 2 * (1 - Math.exp(-since / 0.1));
        la = 4 + 7 * Math.exp(-since / 0.05);
        volume = ESV + (passiveEnd * (1 - Math.exp(-since / TAU))) / (1 - Math.exp(-fill / TAU));
        ao = aortaInDiastole(t - bounds[3]);
      }
    }
    samples.push({ t, lv, ao, la, volume });
  }

  // Conduction, timed back from the start of ventricular contraction.
  const qrs = bounds[1];
  const wrap = (x: number) => ((x % beat) + beat) % beat;
  const conduction = [
    { name: 'SA node', start: wrap(qrs - 0.17), end: wrap(qrs - 0.15) },
    { name: 'Atria', start: wrap(qrs - 0.15), end: wrap(qrs - 0.08) },
    { name: 'AV node', start: wrap(qrs - 0.08), end: wrap(qrs - 0.03) },
    { name: 'Bundle of His', start: wrap(qrs - 0.03), end: wrap(qrs - 0.015) },
    { name: 'Purkinje fibres', start: wrap(qrs - 0.015), end: wrap(qrs + 0.03) },
  ];

  const moment = clamp(values.t, 0, 0.999) * beat;
  const phase = phaseAt(moment, bounds);
  const open = (CYCLE_PHASES[phase].av ? 2 : 0) + (CYCLE_PHASES[phase].semilunar ? 2 : 0);

  return {
    readouts: {
      systole,
      diastole,
      diastoleShare: (diastole / beat) * 100,
      coronaryTime: diastole * hr,
      edv,
      hr,
      phase,
      openValves: open,
    },
    notes: [],
    beat,
    systole,
    diastole,
    bounds,
    samples,
    edv,
    esv: ESV,
    conduction,
    moment,
  };
}

const REST = { hr: 70, paused: 0, t: 0.15 };

export const cardiacCycle: SimDefinition<CycleState> = {
  id: 'cardiac-cycle',
  name: 'One heartbeat',
  animated: true,
  controls: [
    { kind: 'slider', key: 'hr', label: 'Heart rate', unit: '/min', min: 45, max: 180, step: 1, hint: 'Faster rates shorten the beat' },
    {
      kind: 'choice',
      key: 'paused',
      label: 'Motion',
      options: [
        { value: 0, label: 'Play' },
        { value: 1, label: 'Pause' },
      ],
    },
    { kind: 'slider', key: 't', label: 'Moment in the beat', min: 0, max: 0.99, step: 0.01, hint: 'Pause, then drag through the beat', format: (v) => `${Math.round(v * 100)}%` },
  ],
  initial: REST,
  readouts: [
    { key: 'diastole', label: 'Diastole', unit: 's', decimals: 2, primary: true },
    { key: 'systole', label: 'Systole', unit: 's', decimals: 2 },
    { key: 'diastoleShare', label: 'Beat in diastole', unit: '%' },
    { key: 'coronaryTime', label: 'Diastole per minute', unit: 's' },
    { key: 'edv', label: 'End-diastolic volume', unit: 'mL' },
    { key: 'hr', label: 'Heart rate', unit: '/min', hidden: true },
    { key: 'phase', label: 'Phase', hidden: true, noDelta: true, text: (v) => CYCLE_PHASES[Math.round(v)]?.name ?? '' },
    {
      key: 'openValves',
      label: 'Valves open',
      hidden: true,
      noDelta: true,
      text: (v) => (v === 0 ? 'none (all four shut)' : `${v} of 4`),
    },
  ],
  model,
  scenarios: [
    { id: 'rest', label: 'Rest', values: REST, caption: 'About 70 beats a minute: diastole takes roughly two-thirds of each beat (slides 12–17).' },
    { id: 'sleep', label: 'Asleep', values: { hr: 55, paused: 0, t: 0.15 }, caption: 'A slower rate gives a long diastole: plenty of time to fill and for coronary flow.' },
    { id: 'exercise', label: 'Exercise', values: { hr: 150, paused: 0, t: 0.15 }, caption: 'Systole shortens a little, diastole a lot (slide 20).' },
    { id: 'fast', label: 'Very fast', values: { hr: 180, paused: 0, t: 0.15 }, caption: 'Diastole is now so short that filling and coronary flow suffer (slide 20).' },
    { id: 'ivc', label: 'Freeze: valves shut', values: { hr: 70, paused: 1, t: 0.15 }, caption: 'Isovolumetric contraction: pressure rises with every valve shut, so volume cannot change (slides 13–15).' },
  ],
  challenges: [
    {
      id: 'coronary',
      label: 'Fast but safe',
      prompt: 'Coronary flow happens in diastole. Find a fast heart rate — at least 115 /min — that still leaves at least 25 seconds of diastole in every minute.',
      rules: ['Only the heart rate matters here.'],
      start: { hr: 70, paused: 0, t: 0.15 },
      locked: ['paused', 't'],
      goals: [
        { readout: 'coronaryTime', atLeast: 25, label: 'At least 25 s of diastole per minute' },
        { readout: 'hr', atLeast: 115, label: 'Heart rate at least 115 /min' },
      ],
      debrief:
        'Above about 125 /min the heart spends less than 25 s of each minute in diastole. Diastole is the resting period, when the ventricles fill and the coronary arteries flow, so very fast rates starve the myocardium (slide 20).',
    },
    {
      id: 'shut',
      label: 'All valves shut',
      prompt: 'Pause the beat at a moment when all four valves are shut.',
      rules: ['Use the “Moment in the beat” slider while paused.', 'There are two such moments. Can you find both?'],
      start: { hr: 70, paused: 1, t: 0.5 },
      locked: ['hr'],
      goals: [{ readout: 'openValves', atMost: 0, label: 'All four valves shut' }],
      debrief:
        'Isovolumetric contraction (after the AV valves close, before the aortic and pulmonary valves open) and isovolumetric relaxation (after they close, before the AV valves open). With every valve shut the volume cannot change, so only the pressure moves (slides 13–17).',
    },
  ],
  modelNote:
    'Simplified teaching model of the left heart, using your lecture’s resting values (The Heart slides 12–20). Curve shapes are standard textbook shapes. Shown 4× slower than real time.',
};

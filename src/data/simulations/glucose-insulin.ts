// Endocrinology Lesson 6 — Insulin, glucagon and blood glucose.
//
// Lecture (Pancreas, pp. 2–28): β cells secrete insulin, α cells glucagon. Glucose stimulates
// insulin; α-adrenergic stimulation, somatostatin and exercise inhibit it. Insulin stimulates
// glucose uptake and glycogen synthesis and inhibits glycogen breakdown and gluconeogenesis, so
// plasma glucose falls; it moves K⁺ into cells. Exercise moves glucose into cells and raises the
// affinity of muscle glucose receptors. Diabetes: type 1 lacks insulin (ketosis); type 2 has
// normal insulin levels but fewer receptors (no ketosis). When blood glucose exceeds the tubular
// maximum, glucose appears in the urine (osmotic diuresis). Glucagon rises with low glucose.
// Textbook values (labelled): fasting glucose ≈ 5 mmol/L; a 75 g glucose drink; glucose appears
// in the urine above ≈ 10 mmol/L; K⁺ 3.5–5.0 mmol/L.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const DIABETES = ['None', 'Type 1 (no insulin)', 'Type 2 (fewer receptors)'];
export const END = 240; // minutes shown

export type GlucoseInsulinState = SimState & {
  curve: number[]; // glucose every 5 min from 0 to END
  normal: number[]; // a healthy person, same meal
  time: number;
  insulin: number;
  glucagon: number;
};

type Run = { g: number[]; i: number[] };

// One-minute steps from long before the drink (so fasting values settle) to END.
function run(diabetes: number, meal: number, dose: number, exercise: number): Run {
  const sensitivity = (diabetes === 2 ? 0.35 : 1) * (exercise ? 1.5 : 1);
  const u0 = 0.004 * (exercise ? 1.4 : 1);
  const h0 = 0.02;
  let G = 5;
  let I = 1;
  const g: number[] = [];
  const i: number[] = [];
  for (let t = -600; t <= END; t += 1) {
    const secretion = diabetes === 1 ? 0.03 : Math.max(0.05, 1 + 1.4 * (G - 5)) * (exercise ? 0.7 : 1);
    const injected = t >= 0 ? dose * 0.35 * (t / 60) * Math.exp(1 - t / 60) : 0;
    I += 0.08 * (secretion - I);
    const effective = sensitivity * (I + injected);
    const absorbed = meal && t >= 0 ? 27.8 * 0.5 * 0.025 * Math.exp(-0.025 * t) : 0;
    const liver = h0 * Math.max(0, 1.6 - 0.6 * Math.min(effective, 2.6));
    const uptake = u0 * G * (0.3 + 0.7 * effective);
    const urine = G > 10 ? 0.01 * (G - 10) : 0;
    G = Math.max(1.5, G + absorbed + liver - uptake - urine);
    if (t >= 0) {
      g.push(G);
      i.push(I + injected);
    }
  }
  return { g, i };
}

function model(values: Record<string, number>): GlucoseInsulinState {
  const { meal, diabetes, dose, exercise, time } = values;
  const r = run(diabetes, meal, dose, exercise);
  const n = run(0, meal, 0, 0);
  const t = Math.round(clamp(time, 0, END));
  const glucose = r.g[t];
  const insulin = r.i[t];
  const peak = Math.max(...r.g);
  const low = Math.min(...r.g);
  const glucagon = clamp(100 * (5 / glucose) ** 1.5 * (insulin < 0.3 ? 1.6 : 1), 20, 400);
  const k = clamp(4.3 - 0.25 * Math.log2(Math.max(insulin, 0.02)), 3, 5.8);
  const urine = glucose > 10 ? 1 : 0;
  const ketones = diabetes === 1 && insulin < 0.3 ? 1 : 0;
  const notes: string[] = [];
  if (urine) notes.push('Glucose is above the tubular maximum: it spills into the urine and drags water with it (osmotic diuresis).');
  if (ketones) notes.push('Without insulin, fat is broken down and acetyl-CoA forms ketone bodies: ketosis and acidosis.');
  if (low < 3) notes.push('Too much insulin for the glucose taken in: hypoglycaemia (confusion, sweating, hunger).');
  const curve = r.g.filter((_, k5) => k5 % 5 === 0);
  return {
    readouts: { glucose, insulin: Math.round(insulin * 100), glucagon, k, urine, ketones, peak, low },
    notes,
    curve,
    normal: n.g.filter((_, k5) => k5 % 5 === 0),
    time: t,
    insulin,
    glucagon,
  };
}

const START = { meal: 1, diabetes: 0, dose: 0, exercise: 0, time: 60 };

export const glucoseInsulin: SimDefinition<GlucoseInsulinState> = {
  id: 'glucose-insulin',
  name: 'Insulin and blood glucose',
  controls: [
    { kind: 'slider', key: 'time', label: 'Time after the drink', unit: 'min', min: 0, max: END, step: 10 },
    { kind: 'choice', key: 'meal', label: 'Drink', options: [{ value: 0, label: 'Nothing (fasting)' }, { value: 1, label: '75 g glucose' }] },
    { kind: 'choice', key: 'diabetes', label: 'Diabetes', options: DIABETES.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'dose', label: 'Insulin injected with the drink', unit: 'units', min: 0, max: 20, step: 1 },
    { kind: 'choice', key: 'exercise', label: 'Exercise', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
  ],
  initial: START,
  readouts: [
    { key: 'glucose', label: 'Blood glucose', unit: 'mmol/L', decimals: 1, primary: true },
    { key: 'insulin', label: 'Insulin', unit: '% of fasting', primary: true },
    { key: 'glucagon', label: 'Glucagon', unit: '% of fasting' },
    { key: 'k', label: 'Plasma K⁺', unit: 'mmol/L', decimals: 1 },
    { key: 'urine', label: 'Glucose in urine', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'ketones', label: 'Ketosis', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'peak', label: 'Highest glucose', unit: 'mmol/L', decimals: 1 },
    { key: 'low', label: 'Lowest glucose', unit: 'mmol/L', decimals: 1 },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Healthy', values: START, caption: 'Insulin rises with the glucose and brings it back down within about two hours.' },
    { id: 'type1', label: 'Type 1 diabetes', values: { ...START, diabetes: 1 }, caption: 'No insulin: glucose climbs, spills into the urine, and ketones form.' },
    { id: 'type2', label: 'Type 2 diabetes', values: { ...START, diabetes: 2 }, caption: 'Insulin is made, but with fewer receptors it works poorly: glucose stays high for longer. No ketosis.' },
    { id: 'treated', label: 'Type 1 with insulin', values: { ...START, diabetes: 1, dose: 8, time: 120 }, caption: 'Injected insulin moves glucose — and K⁺ — into the cells.' },
  ],
  challenges: [
    {
      id: 'dose',
      label: 'Find the right dose',
      prompt: 'A person with type 1 diabetes drinks 75 g of glucose. Choose an insulin dose that brings the glucose to 4–8 mmol/L two hours later, without it ever falling below 3.5.',
      rules: ['Choose the insulin dose; exercise is allowed.'],
      start: { meal: 1, diabetes: 1, dose: 0, exercise: 0, time: 120 },
      locked: ['meal', 'diabetes', 'time'],
      goals: [
        { readout: 'glucose', atLeast: 4, atMost: 8, label: 'Glucose 4–8 mmol/L at 2 hours' },
        { readout: 'low', atLeast: 3.5, label: 'Never below 3.5 mmol/L' },
      ],
      debrief: 'Too little insulin leaves the glucose above the tubular maximum; too much drives it into hypoglycaemia. Exercise helps by moving glucose into muscle.',
    },
  ],
  modelNote:
    'Simplified teaching model. What stimulates and inhibits insulin and glucagon, insulin’s effects on glucose and K⁺, exercise, and the two types of diabetes are from the lecture (Pancreas, pp. 2–28). The 75 g drink, fasting glucose (≈ 5 mmol/L), the renal threshold (≈ 10 mmol/L) and the time course are textbook-based and illustrative.',
  animated: false,
};

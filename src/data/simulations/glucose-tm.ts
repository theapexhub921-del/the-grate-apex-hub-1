// Renal Lesson 3 — Reabsorption and the tubular maximum (glucose).
//
// Lecture (slides 44–47, 51): the basolateral Na⁺/K⁺-ATPase keeps cell Na⁺
// low; glucose and amino acids are reabsorbed by secondary active transport
// with Na⁺, on specific carriers of limited number — a transport maximum
// (Tm). When the carriers are saturated, the excess is excreted. The PCT
// reabsorbs 100% of filtered glucose normally. Textbook (labelled): glucose
// Tm ≈ 375 mg/min; filtered load = GFR × plasma glucose. Real nephrons
// differ, so glucose appears in urine somewhat before the whole-kidney Tm
// is reached ("splay"); this model leaves splay out.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const TM = 375;

export type GlucoseState = SimState & {
  plasma: number;
  filtered: number;
  reabsorbed: number;
  excreted: number;
  tm: number;
  pump: number;
  carriers: number;
};

function model(values: Record<string, number>): GlucoseState {
  const { glucose, gfr, carriers, pump } = values;
  const filtered = (gfr * glucose) / 100; // mg/dl × ml/min → mg/min
  const tm = pump === 1 ? 0 : (TM * carriers) / 100;
  const reabsorbed = Math.min(filtered, tm);
  const excreted = filtered - reabsorbed;
  const notes: string[] = [];
  if (pump === 1) notes.push('With the Na⁺/K⁺ pump blocked, cell Na⁺ rises and the Na⁺ gradient that drives glucose co-transport is lost: glucose is not reabsorbed.');
  else if (excreted > 0) notes.push('The carriers are saturated (Tm reached): the extra glucose stays in the tubule and is excreted — glycosuria.');
  return {
    readouts: { filtered, reabsorbed, excreted, urine: excreted > 0 ? 1 : 0, tm },
    notes,
    plasma: glucose,
    filtered,
    reabsorbed,
    excreted,
    tm,
    pump,
    carriers,
  };
}

const START = { glucose: 100, gfr: 125, carriers: 100, pump: 0 };

export const glucoseTm: SimDefinition<GlucoseState> = {
  id: 'glucose-tm',
  name: 'Glucose and the tubular maximum',
  controls: [
    { kind: 'slider', key: 'glucose', label: 'Plasma glucose', unit: 'mg/dl', min: 50, max: 600, step: 10, hint: 'Fasting normal ≈ 70–100' },
    { kind: 'slider', key: 'gfr', label: 'GFR', unit: 'ml/min', min: 50, max: 180, step: 5 },
    { kind: 'slider', key: 'carriers', label: 'Glucose carriers', unit: '% of normal', min: 40, max: 150, step: 10 },
    { kind: 'choice', key: 'pump', label: 'Na⁺/K⁺-ATPase', options: [{ value: 0, label: 'Working' }, { value: 1, label: 'Blocked' }] },
  ],
  initial: START,
  readouts: [
    { key: 'excreted', label: 'Glucose in urine', unit: 'mg/min', primary: true },
    { key: 'filtered', label: 'Filtered', unit: 'mg/min' },
    { key: 'reabsorbed', label: 'Reabsorbed', unit: 'mg/min' },
    { key: 'tm', label: 'Tubular maximum', unit: 'mg/min' },
    { key: 'urine', label: 'Urine test', noDelta: true, text: (v) => (v ? 'Glucose present' : 'No glucose') },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'All 125 mg/min of filtered glucose is reabsorbed in the PCT.' },
    { id: 'diabetes', label: 'Uncontrolled diabetes', values: { ...START, glucose: 400 }, caption: 'Filtered load 500 mg/min exceeds Tm: 125 mg/min spills into the urine.' },
    { id: 'pump', label: 'Pump blocked', values: { ...START, pump: 1 }, caption: 'No Na⁺ gradient, no secondary active transport.' },
  ],
  challenges: [
    {
      id: 'load',
      label: 'Stop the spill',
      prompt: 'Plasma glucose is stuck at 350 mg/dl. Change only the GFR so that no glucose appears in the urine.',
      rules: ['Plasma glucose, carriers and the pump are fixed.'],
      start: { glucose: 350, gfr: 125, carriers: 100, pump: 0 },
      locked: ['glucose', 'carriers', 'pump'],
      goals: [{ readout: 'excreted', atMost: 0, label: 'No glucose in urine' }],
      debrief: 'Filtered load = GFR × plasma concentration. Glucose spills only when the load exceeds the transport maximum of the carriers (slide 47).',
    },
  ],
  modelNote:
    'Simplified teaching model. Secondary active co-transport with Na⁺, the role of the basolateral Na⁺/K⁺-ATPase, the transport maximum set by the number of carriers, and 100% glucose reabsorption in the PCT are from the lecture (slides 44–51). Tm ≈ 375 mg/min and filtered load = GFR × plasma glucose are textbook values; splay (glucose appearing before Tm) is left out.',
};

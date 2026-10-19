// Reproductive Lesson 6 — The uterine cycle and its hormonal control.
//
// Lecture (Female, slides 22–44): menstrual (days 1–5), proliferative (6–14, estrogen), secretory
// (15–26, progesterone; constant 14 days) and premenstrual (27–28) phases. GnRH → FSH, LH; rising
// estrogen first inhibits, then (high) triggers the LH surge 34–36 h before ovulation; the corpus
// luteum's progesterone and estrogen then suppress FSH and LH; it regresses after 12–16 days
// unless hCG rescues it. Estrogen: copious watery ferning mucus; progesterone: thick mucus. Basal
// body temperature rises about 1 °C at ovulation (progesterone). Caloric deprivation, strenuous
// exercise and stress can override ovulation.
// The shapes of the hormone curves and the endometrial thickness are textbook and illustrative
// (levels are relative, 1 = early follicular).
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const PHASES = ['Menstrual', 'Proliferative', 'Secretory', 'Premenstrual'];
export const CONDITIONS = ['Normal cycle', 'Pregnant (hCG from day 21)', 'No ovulation (stress, low weight)'];

const bump = (d: number, at: number, width: number) => Math.exp(-(((d - at) / width) ** 2));

export function hormonesOn(day: number, condition: number) {
  const anov = condition === 2;
  const preg = condition === 1;
  const late = preg && day > 21 ? 21 : day; // hCG holds the luteal levels from day 21
  const fsh = anov ? 0.9 : 0.8 + 0.5 * bump(day, 3, 3) + (anov ? 0 : 1.2 * bump(day, 14, 0.9)) - 0.25 * bump(day, 21, 5);
  const lh = anov ? 1 : 0.9 + 7 * bump(day, 14, 0.8) - 0.2 * bump(day, 21, 5);
  const e2 = anov ? 1.6 : 1 + 3 * bump(day, 13, 2.2) + 1.5 * bump(late, 21, 3.5) - (preg && day > 21 ? 0 : 0.5 * bump(day, 27, 1.5));
  const p4 = anov ? 0.1 : 0.1 + 10 * bump(late, 21, 3.5) * (day >= 14 ? 1 : 0);
  return { fsh: Math.max(0.3, fsh), lh: Math.max(0.3, lh), e2: Math.max(0.5, e2), p4: Math.max(0.05, p4) };
}

export type MenstrualState = SimState & { day: number; condition: number; phase: number; endometrium: number; curves: { fsh: number[]; lh: number[]; e2: number[]; p4: number[] } };

function model(values: Record<string, number>): MenstrualState {
  const { day, condition } = values;
  const h = hormonesOn(day, condition);
  const preg = condition === 1;
  const anov = condition === 2;
  let phase = day <= 5 ? 0 : day <= 14 ? 1 : day <= 26 ? 2 : 3;
  if (preg && day > 26) phase = 2;
  if (anov && day > 14) phase = 1;
  let endometrium = day <= 5 ? 4 - 3 * ((day - 1) / 4) : day <= 14 ? 1 + 7 * ((day - 5) / 9) : day <= 26 ? 8 + 4 * ((day - 14) / 12) : 12 - 3 * (day - 26);
  if (preg && day > 26) endometrium = 12.5;
  if (anov) endometrium = day <= 5 ? endometrium : clamp(1 + 6 * ((day - 5) / 23), 1, 7);
  const temp = 36.4 + (!anov && day >= 14 && (day <= 27 || preg) ? 0.9 * clamp((day - 13.5) / 1.5, 0, 1) : 0);
  const mucus = h.p4 > 1.5 ? 2 : h.e2 > 2.5 ? 1 : 0;
  const curves = { fsh: [] as number[], lh: [] as number[], e2: [] as number[], p4: [] as number[] };
  for (let d = 1; d <= 28; d += 0.5) {
    const k = hormonesOn(d, condition);
    curves.fsh.push(k.fsh);
    curves.lh.push(k.lh);
    curves.e2.push(k.e2);
    curves.p4.push(k.p4);
  }
  const notes: string[] = [];
  if (!anov && day >= 13 && day <= 14) notes.push('High estrogen has switched to positive feedback: the LH surge, 34–36 hours before ovulation.');
  if (preg && day > 21) notes.push('hCG from the trophoblast keeps the corpus luteum secreting: no menstruation.');
  if (anov) notes.push('No LH surge, so no ovulation and no corpus luteum: no progesterone, and no secretory phase.');
  return {
    readouts: { phase, fsh: h.fsh * 100, lh: h.lh * 100, e2: h.e2 * 100, p4: h.p4 * 100, endometrium, temp, mucus },
    notes,
    day,
    condition,
    phase,
    endometrium,
    curves,
  };
}

const START = { day: 8, condition: 0 };
const MUCUS = ['Scant', 'Watery, elastic, ferning', 'Thick, pasty'];

export const menstrualCycle: SimDefinition<MenstrualState> = {
  id: 'menstrual-cycle',
  name: 'The menstrual cycle',
  controls: [
    { kind: 'slider', key: 'day', label: 'Day of the cycle', min: 1, max: 28, step: 1 },
    { kind: 'choice', key: 'condition', label: 'This cycle', options: CONDITIONS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'phase', label: 'Uterine phase', noDelta: true, primary: true, text: (v) => PHASES[v] ?? '' },
    { key: 'fsh', label: 'FSH', unit: '%' },
    { key: 'lh', label: 'LH', unit: '%' },
    { key: 'e2', label: 'Estradiol', unit: '%' },
    { key: 'p4', label: 'Progesterone', unit: '%', primary: true },
    { key: 'endometrium', label: 'Endometrium', unit: 'mm', decimals: 1 },
    { key: 'temp', label: 'Basal body temperature', unit: '°C', decimals: 1 },
    { key: 'mucus', label: 'Cervical mucus', noDelta: true, text: (v) => MUCUS[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'menses', label: 'Day 2', values: { day: 2, condition: 0 }, caption: 'Low estrogen and progesterone: the functional layer is shed.' },
    { id: 'surge', label: 'Day 14', values: { day: 14, condition: 0 }, caption: 'The LH surge: ovulation follows.' },
    { id: 'luteal', label: 'Day 21', values: { day: 21, condition: 0 }, caption: 'Progesterone peaks: secretory endometrium, thick mucus, higher temperature.' },
    { id: 'pregnant', label: 'Day 28, pregnant', values: { day: 28, condition: 1 }, caption: 'hCG keeps progesterone high and the endometrium intact.' },
  ],
  challenges: [
    {
      id: 'fertile',
      label: 'Find the fertile window',
      prompt: 'Find a day when the cervical mucus is watery and elastic and LH is surging (over 300%).',
      rules: ['A normal cycle.'],
      start: START,
      locked: ['condition'],
      goals: [
        { readout: 'mucus', atLeast: 1, atMost: 1, label: 'Watery, ferning mucus' },
        { readout: 'lh', atLeast: 300, label: 'LH over 300%' },
      ],
      debrief: 'Around ovulation high estrogen makes the mucus copious and elastic — easy for sperm to swim through — and triggers the LH surge.',
    },
  ],
  modelNote:
    'Simplified teaching model of a 28-day cycle. The four uterine phases, the hormones and their feedback, the LH surge, hCG, the mucus and temperature changes and anovulation from stress or low weight are from the lecture (Female, slides 22–44). The curve shapes, relative levels and endometrial thickness are textbook and illustrative.',
};

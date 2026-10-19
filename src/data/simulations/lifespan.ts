// Reproductive Lesson 8 — Puberty and the climacteric.
//
// Lecture (Sexual Response, slides 1–20): puberty usually 10–14 in girls and 12–16 in boys; a
// change in hypothalamic kisspeptin (GPR54) switches on GnRH, then LH and FSH; body fat (leptin)
// may signal readiness. Girls: thelarche, then pubarche, then menarche; boys: testes and penis,
// then pubic and axillary hair, then muscle, voice and facial hair. Delayed puberty: no breast
// development by 13.5 or no menstruation by 16; no testicular enlargement by 14. Andropause:
// gradual from about 40 — testosterone declines and SHBG rises. Menopause: 45–55; fewer oocytes,
// follicles resist FSH, estrogen falls; no period for 12 months.
// Textbook (labelled): FSH and LH rise high after menopause; testosterone falls about 1% a year.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const STAGES = ['Childhood', 'Puberty', 'Reproductive years', 'Menopause', 'Andropause'];
const SIGNS_F = ['Breast development (thelarche)', 'Pubic and axillary hair (pubarche)', 'First period (menarche)'];
const SIGNS_M = ['Testes and penis enlarge', 'Pubic and axillary hair', 'Muscle, deeper voice, facial hair'];

export type LifespanState = SimState & { female: boolean; stage: number; steroid: number; gnrh: number; development: number };

function model(values: Record<string, number>): LifespanState {
  const { sex, age, fat } = values;
  const female = sex === 0;
  const start = (female ? 10.5 : 12.5) + (fat ? 0 : 4);
  const length = 4;
  const p = clamp((age - start) / length, 0, 1);
  const gnrh = age < start ? 5 : 5 + 95 * p;
  let steroid = age < start ? 5 : 5 + 95 * p;
  let fsh = age < start ? 10 : 10 + 90 * p;
  let shbg = 100;
  let stage = age < start ? 0 : p < 1 ? 1 : 2;
  if (female && age >= 51) {
    stage = 3;
    steroid = 10;
    fsh = 900;
  } else if (!female && age >= 40) {
    stage = 4;
    steroid = clamp(100 - (age - 40), 40, 100);
    shbg = 100 + 1.5 * (age - 40);
  }
  const sign = p <= 0 ? 0 : p < 0.5 ? 1 : p < 0.85 ? 2 : 3;
  const fertile = stage === 2 || stage === 4 || (stage === 1 && p > 0.66) ? 1 : 0;
  const notes: string[] = [];
  if (!fat && age >= 12 && age < start) notes.push('Very low body fat (little leptin) delays the switch-on of kisspeptin and GnRH: delayed puberty.');
  if (stage === 3) notes.push('Menopause: few oocytes remain and the follicles resist FSH; estrogen falls and FSH climbs.');
  if (stage === 4) notes.push('Andropause is gradual: testosterone declines and SHBG rises, so even less is bioavailable — but men stay fertile.');
  return {
    readouts: { stage, sign, gnrh, fsh, steroid, shbg, fertile, male: female ? 0 : 1 },
    notes,
    female,
    stage,
    steroid,
    gnrh,
    development: p,
  };
}

const START = { sex: 0, age: 8, fat: 1 };

export const lifespan: SimDefinition<LifespanState> = {
  id: 'lifespan',
  name: 'Puberty to climacteric',
  controls: [
    { kind: 'choice', key: 'sex', label: 'Sex', options: [{ value: 0, label: 'Female' }, { value: 1, label: 'Male' }] },
    { kind: 'slider', key: 'age', label: 'Age', unit: 'years', min: 4, max: 80, step: 1 },
    { kind: 'choice', key: 'fat', label: 'Body fat', options: [{ value: 1, label: 'Normal' }, { value: 0, label: 'Very low' }] },
  ],
  initial: START,
  readouts: [
    { key: 'stage', label: 'Stage', noDelta: true, primary: true, text: (v) => STAGES[v] ?? '' },
    { key: 'sign', label: 'Latest pubertal sign', noDelta: true, text: (v, all) => (v ? ((all.male ? SIGNS_M : SIGNS_F)[v - 1] ?? '') : 'None yet') },
    { key: 'gnrh', label: 'GnRH (kisspeptin) activity', unit: '%' },
    { key: 'fsh', label: 'FSH', unit: '%' },
    { key: 'steroid', label: 'Estrogen or testosterone', unit: '% of adult', primary: true },
    { key: 'shbg', label: 'SHBG', unit: '%' },
    { key: 'fertile', label: 'Fertile', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'male', label: 'Sex', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'child', label: 'Child', values: START, caption: 'GnRH is quiet: low gonadotropins and sex steroids.' },
    { id: 'girl', label: 'Girl, 12', values: { sex: 0, age: 12, fat: 1 }, caption: 'Kisspeptin switches on GnRH: thelarche comes first.' },
    { id: 'menopause', label: 'Woman, 55', values: { sex: 0, age: 55, fat: 1 }, caption: 'Estrogen has fallen and FSH is high.' },
    { id: 'andropause', label: 'Man, 65', values: { sex: 1, age: 65, fat: 1 }, caption: 'Testosterone declining, SHBG rising — still fertile.' },
  ],
  challenges: [
    {
      id: 'delay',
      label: 'Delayed puberty',
      prompt: 'Make a 14-year-old girl who has not started puberty.',
      rules: ['Her age is fixed at 14.'],
      start: { sex: 0, age: 14, fat: 1 },
      locked: ['age', 'sex'],
      goals: [{ readout: 'stage', atMost: 0, label: 'Still in childhood' }],
      debrief: 'Very low body fat (with little leptin) can hold back the hypothalamic switch — no breast development by 13.5 is delayed puberty.',
    },
  ],
  modelNote:
    'Simplified teaching model. The ages, the kisspeptin–GnRH switch, the order of pubertal signs, delayed puberty, andropause and menopause are from the lecture (Sexual Response, slides 1–20). The size of the leptin effect, the post-menopausal FSH rise and the yearly fall in testosterone are textbook and illustrative.',
};

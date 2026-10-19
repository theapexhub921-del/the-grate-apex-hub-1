// Reproductive Lesson 3 — Hormonal control of spermatogenesis, and temperature.
//
// Lecture (Male, slides 31–40): the hypothalamus and pituitary (GnRH → FSH, LH) and local factors
// control spermatogenesis. Sertoli cells (under FSH) make inhibin — negative feedback on FSH — and
// androgen-binding protein, which concentrates testosterone 20–50 times above blood levels,
// essential to start and maintain spermatogenesis. FSH starts it; testosterone alone maintains it.
// The testes are held about 3 °C below body temperature (pampiniform plexus, cremaster, dartos,
// sweat glands). Anabolic steroids impair spermatogenesis. Normal semen ≥ 15 million sperm/mL.
// Textbook (labelled): testosterone (and given androgens) feeds back on LH (and FSH).
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export type TestisState = SimState & { lh: number; fsh: number; blood: number; inside: number; count: number; temp: number };

function model(values: Record<string, number>): TestisState {
  const { gnrh, steroids, warm } = values;
  const g = gnrh ? 1 : 0.01;
  const given = steroids ? 3 : 0;
  // Leydig output T = LH, and LH = g / (blood testosterone): T² + given·T − g = 0.
  const own = (-given + Math.sqrt(given * given + 4 * g)) / 2;
  const blood = own + given;
  const lh = g / blood;
  const fsh = Math.sqrt(g) / Math.sqrt(blood); // inhibin and testosterone both hold FSH down
  const inside = 30 * own; // ABP keeps testicular testosterone ~30× the blood's (own production only)
  const temp = warm ? 37 : 34;
  const count = clamp(70 * Math.min(1, inside / 30) ** 1.5 * Math.min(1, fsh) ** 0.3 * (warm ? 0.25 : 1), 0, 150);
  const notes: string[] = [];
  if (steroids) notes.push('The anabolic steroid raises blood testosterone, which shuts down LH and FSH: the testes make little of their own, so testosterone inside the tubules falls — and with it sperm production.');
  if (warm) notes.push('Body temperature is too warm for spermatogenesis: normally the scrotum keeps the testes about 3 °C cooler.');
  if (!gnrh) notes.push('Without GnRH there is no FSH or LH: no testosterone and no sperm.');
  return {
    readouts: { lh: lh * 100, fsh: fsh * 100, blood: blood * 100, inside: inside * 100 / 30, count, temp },
    notes,
    lh,
    fsh,
    blood,
    inside,
    count,
    temp,
  };
}

const START = { gnrh: 1, steroids: 0, warm: 0 };

export const testisControl: SimDefinition<TestisState> = {
  id: 'testis-control',
  name: 'Control of sperm production',
  controls: [
    { kind: 'choice', key: 'gnrh', label: 'GnRH from the hypothalamus', options: [{ value: 1, label: 'Normal pulses' }, { value: 0, label: 'Absent' }] },
    { kind: 'choice', key: 'steroids', label: 'Anabolic steroids', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
    { kind: 'choice', key: 'warm', label: 'Testes', options: [{ value: 0, label: 'In the scrotum (cool)' }, { value: 1, label: 'At body temperature' }] },
  ],
  initial: START,
  readouts: [
    { key: 'lh', label: 'LH', unit: '%' },
    { key: 'fsh', label: 'FSH', unit: '%' },
    { key: 'blood', label: 'Testosterone in the blood', unit: '%', primary: true },
    { key: 'inside', label: 'Testosterone in the tubules', unit: '%' },
    { key: 'count', label: 'Sperm count', unit: 'million/mL', primary: true },
    { key: 'temp', label: 'Testis temperature', unit: '°C' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'FSH and LH drive Sertoli and Leydig cells; ABP keeps testicular testosterone high.' },
    { id: 'steroids', label: 'Anabolic steroids', values: { ...START, steroids: 1 }, caption: 'High blood testosterone, but low sperm count.' },
    { id: 'warm', label: 'Undescended testes', values: { ...START, warm: 1 }, caption: 'At body temperature sperm production falls sharply.' },
  ],
  challenges: [
    {
      id: 'restore',
      label: 'Restore the sperm count',
      prompt: 'This athlete takes anabolic steroids and keeps their testes warm. Bring the sperm count back to at least 15 million/mL.',
      rules: ['GnRH is fixed.'],
      start: { gnrh: 1, steroids: 1, warm: 1 },
      locked: ['gnrh'],
      goals: [{ readout: 'count', atLeast: 15, label: 'At least 15 million/mL' }],
      debrief: 'Stopping the steroids lets LH and FSH return and the testes make their own testosterone again; keeping them cool lets spermatogenesis proceed.',
    },
  ],
  modelNote:
    'Simplified teaching model. GnRH, FSH, LH, inhibin, ABP (testosterone 20–50× the blood’s), the temperature mechanisms and anabolic steroids are from the lecture (Male, slides 31–40). Feedback of testosterone on LH and FSH, and the sizes of the changes, are textbook-based and illustrative.',
};

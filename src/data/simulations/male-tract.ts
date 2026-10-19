// Reproductive Lesson 1 — The male tract: the testis's two jobs, and the ducts and glands.
//
// Lecture (Male, slides 7–8, 18–20, 47–50): the testes make sperm (spermatogenesis) and androgens
// (steroidogenesis); the ducts — epididymis, ductus deferens, ejaculatory duct, urethra — carry
// sperm out; the seminal vesicles (~60% of semen), prostate (~30%) and bulbourethral glands (< 5%)
// add their secretions; sperm are 2–3% of semen. Leydig cells make testosterone. Normal semen:
// 1.5–5.0 mL, ≥ 15 million sperm/mL.
// Textbook (labelled): cutting the ductus deferens (vasectomy) leaves testosterone unchanged;
// fructose in semen comes from the seminal vesicles.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const BLOCKS = ['None', 'Both ductus deferens cut (vasectomy)', 'Both ejaculatory ducts blocked'];

export type MaleTractState = SimState & { block: number; leydig: boolean; count: number; testosterone: number };

function model(values: Record<string, number>): MaleTractState {
  const { block, leydig, sertoli } = values;
  const testosterone = leydig ? 100 : 8;
  // Without testosterone (or the Sertoli cells that support germ cells), spermatogenesis fails.
  const made = (leydig ? 1 : 0.05) * (sertoli ? 1 : 0);
  const reaches = block === 0 ? 1 : 0;
  const count = clamp(70 * made * reaches, 0, 200);
  const shares = { sperm: 0.025 * reaches * made, epididymis: 0.045 * reaches, prostate: 0.3, vesicles: block === 2 ? 0 : 0.6, cowper: 0.03 };
  const volume = 3.2 * (shares.sperm + shares.epididymis + shares.prostate + shares.vesicles + shares.cowper);
  const fructose = block === 2 ? 0 : 1;
  const notes: string[] = [];
  if (block === 1) notes.push('The ducts are cut, so no sperm reach the semen — but the testes still make testosterone, and the glands still make nearly all the fluid.');
  if (block === 2) notes.push('The seminal vesicles empty through the ejaculatory ducts: with them blocked, semen loses 60% of its volume and its fructose.');
  if (!leydig) notes.push('Without Leydig cells there is little testosterone, and spermatogenesis cannot be maintained.');
  if (!sertoli) notes.push('Without Sertoli cells the germ cells have no support: no sperm are made.');
  return {
    readouts: { count, volume, testosterone, fructose, fertile: count >= 15 ? 1 : 0 },
    notes,
    block,
    leydig: !!leydig,
    count,
    testosterone,
  };
}

const START = { block: 0, leydig: 1, sertoli: 1 };

export const maleTract: SimDefinition<MaleTractState> = {
  id: 'male-tract',
  name: 'The male tract',
  controls: [
    { kind: 'choice', key: 'block', label: 'Ducts', options: BLOCKS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'leydig', label: 'Leydig cells', options: [{ value: 1, label: 'Working' }, { value: 0, label: 'Lost' }] },
    { kind: 'choice', key: 'sertoli', label: 'Sertoli cells', options: [{ value: 1, label: 'Working' }, { value: 0, label: 'Lost' }] },
  ],
  initial: START,
  readouts: [
    { key: 'count', label: 'Sperm in semen', unit: 'million/mL', primary: true },
    { key: 'volume', label: 'Semen volume', unit: 'mL', decimals: 1 },
    { key: 'testosterone', label: 'Testosterone', unit: '% of normal', primary: true },
    { key: 'fructose', label: 'Fructose in semen', noDelta: true, text: (v) => (v ? 'Present' : 'Absent') },
    { key: 'fertile', label: 'Sperm count', noDelta: true, text: (v) => (v ? 'Normal (≥ 15 million/mL)' : 'Low') },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Sperm from the testes, fluid from the seminal vesicles and prostate.' },
    { id: 'vasectomy', label: 'Vasectomy', values: { ...START, block: 1 }, caption: 'No sperm in the semen; testosterone unchanged.' },
    { id: 'ejaculatory', label: 'Blocked ejaculatory ducts', values: { ...START, block: 2 }, caption: 'Low volume, no sperm and no fructose.' },
  ],
  challenges: [
    {
      id: 'two-jobs',
      label: 'Separate the two jobs',
      prompt: 'Find a change that stops sperm reaching the semen but leaves testosterone at 100%.',
      rules: ['Choose one change.'],
      start: { block: 0, leydig: 0, sertoli: 1 },
      locked: [],
      goals: [
        { readout: 'count', atMost: 0, label: 'No sperm in the semen' },
        { readout: 'testosterone', atLeast: 100, label: 'Testosterone 100%' },
      ],
      debrief: 'The testis has two separate jobs: the ducts carry sperm out, while Leydig cells release testosterone into the blood — so cutting the ducts (or losing Sertoli cells) stops sperm without touching the hormone.',
    },
  ],
  modelNote:
    'Simplified teaching model. The organs, ducts and glands, their shares of semen, the roles of Sertoli and Leydig cells and the normal semen values are from the lecture (Male, slides 7–8, 18–20, 47–50). The effects of vasectomy and ejaculatory duct obstruction on volume and fructose are textbook.',
};

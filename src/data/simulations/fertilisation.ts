// Reproductive Lesson 9 — Fertilisation and implantation.
//
// Lecture (Sexual Response, slides 40–55): fertilisation usually occurs in the ampulla of the
// uterine tube. Over 99% of ejaculated sperm never enter the cervix; about 1% reach the ampulla.
// Sperm cross the cumulus (hyaluronidase), bind ZP3 (acrosome reaction) and fuse with the oocyte:
// a Ca²⁺ wave completes meiosis II and the cortical reaction blocks polyspermy. The zygote cleaves
// for 2–3 days (morula), reaches the uterus in about 4 days, becomes a blastocyst and implants;
// the syncytiotrophoblast's hCG maintains the corpus luteum and prevents menstruation. Normal
// semen ≥ 15 million sperm/mL (Male deck, slide 50).
// Textbook (labelled): ejaculate ≈ 3 mL; implantation begins about day 6–7.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const STAGES = ['Not fertilised', 'Zygote', 'Cleaving (2–16 cells)', 'Morula', 'Blastocyst', 'Implanting', 'Not viable (polyspermy)'];
export const PLACES = ['Ampulla of the uterine tube', 'Uterine tube', 'Uterine cavity', 'Endometrium (decidua)'];

export type FertilisationState = SimState & { fertilised: boolean; stage: number; place: number; day: number; luteum: number };

function model(values: Record<string, number>): FertilisationState {
  const { day, count, block, hcg } = values;
  const ejaculated = count * 3; // million
  const ampulla = ejaculated * 0.01 * 1000; // thousands
  const fertilised = ampulla >= 450; // ≥ 15 million/mL
  const polyspermy = fertilised && block === 0;
  let stage = 0;
  if (fertilised) stage = polyspermy ? 6 : day < 1 ? 1 : day < 3 ? 2 : day < 5 ? 3 : day < 6 ? 4 : 5;
  const place = !fertilised ? 0 : day < 1 ? 0 : day < 4 ? 1 : day < 6 ? 2 : 3;
  const keep = fertilised && !polyspermy && hcg === 1 && day >= 6;
  const luteum = keep ? 100 : clamp(100 - Math.max(0, day - 8) * 40, 0, 100);
  const notes: string[] = [];
  if (!fertilised) notes.push('Too few sperm reach the ampulla: over 99% are lost on the way.');
  if (polyspermy) notes.push('Without the cortical reaction more than one sperm enters: the zygote is not viable.');
  if (stage === 5 && !keep) notes.push('Without hCG from the syncytiotrophoblast the corpus luteum regresses and menstruation follows.');
  return {
    readouts: { ampulla, fertilised: fertilised ? 1 : 0, stage, place, luteum },
    notes,
    fertilised,
    stage,
    place,
    day,
    luteum,
  };
}

const START = { day: 0, count: 60, block: 1, hcg: 1 };

export const fertilisation: SimDefinition<FertilisationState> = {
  id: 'fertilisation',
  name: 'Fertilisation and implantation',
  controls: [
    { kind: 'slider', key: 'day', label: 'Days after fertilisation', unit: 'days', min: 0, max: 10, step: 1 },
    { kind: 'slider', key: 'count', label: 'Sperm count', unit: 'million/mL', min: 5, max: 100, step: 5 },
    { kind: 'choice', key: 'block', label: 'Cortical reaction', options: [{ value: 1, label: 'Works' }, { value: 0, label: 'Fails' }] },
    { kind: 'choice', key: 'hcg', label: 'hCG from the embryo', options: [{ value: 1, label: 'Made' }, { value: 0, label: 'Not made' }] },
  ],
  initial: START,
  readouts: [
    { key: 'ampulla', label: 'Sperm reaching the ampulla', unit: 'thousand' },
    { key: 'fertilised', label: 'Fertilised', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'stage', label: 'The embryo', noDelta: true, primary: true, text: (v) => STAGES[v] ?? '' },
    { key: 'place', label: 'Where', noDelta: true, text: (v) => PLACES[v] ?? '' },
    { key: 'luteum', label: 'Corpus luteum', unit: '%', primary: true },
  ],
  model,
  scenarios: [
    { id: 'zygote', label: 'Day 0', values: START, caption: 'Fertilisation in the ampulla: a diploid zygote.' },
    { id: 'morula', label: 'Day 4', values: { ...START, day: 4 }, caption: 'The morula reaches the uterus.' },
    { id: 'implant', label: 'Day 8', values: { ...START, day: 8 }, caption: 'The blastocyst implants; hCG keeps the corpus luteum.' },
    { id: 'low', label: 'Low sperm count', values: { ...START, count: 10 }, caption: 'Too few sperm reach the ampulla.' },
  ],
  challenges: [
    {
      id: 'pregnancy',
      label: 'Keep the pregnancy going',
      prompt: 'On day 10, keep the corpus luteum fully active.',
      rules: ['It is day 10.'],
      start: { day: 10, count: 10, block: 1, hcg: 0 },
      locked: ['day'],
      goals: [{ readout: 'luteum', atLeast: 100, label: 'Corpus luteum 100%' }],
      debrief: 'Enough sperm to fertilise, a working block to polyspermy, and hCG from the implanting embryo to rescue the corpus luteum.',
    },
  ],
  modelNote:
    'Simplified teaching model. The site of fertilisation, the loss of sperm, the steps through the cumulus and zona, the cortical reaction, the timing of cleavage and implantation, and hCG are from the lecture (Sexual Response, slides 40–55). The ejaculate volume and the fertility threshold are textbook-based and illustrative.',
};

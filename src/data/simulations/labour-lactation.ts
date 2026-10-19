// Reproductive Lesson 10 — Labour and lactation.
//
// Lecture (Sexual Response, slides 65–90): near term the estrogen/progesterone ratio rises,
// oxytocin receptors increase > 100-fold, and prostaglandins (PGF2α, essential for labour to
// progress) raise intracellular Ca²⁺. Stretch of the cervix → oxytocin → stronger contractions →
// more stretch: positive feedback until delivery. Lactation: suckling → PVN/SON → oxytocin →
// myoepithelial contraction (milk ejection); can be inhibited by emotional distress. Prolactin
// maintains milk production; milk must be removed (FIL). Full breastfeeding (every 4 h by day,
// 6 h at night) usually stops ovarian cycles: β-endorphin inhibits GnRH and suppresses dopamine,
// raising prolactin.
// Textbook (labelled): the cervix dilates to 10 cm; blocking prostaglandin synthesis slows labour.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export type LabourState = SimState & { mode: number; dilation: number; contraction: number; oxytocin: number; milk: number; ejection: boolean; prolactin: number };

function labourAt(hours: number, oxyBlock: number, pgBlock: number) {
  let d = 2;
  let oxy = 1;
  let c = 0.3;
  for (let t = 0; t < hours; t += 0.05) {
    oxy = 1 + 2 * (d / 10);
    c = clamp((0.25 + 0.25 * oxy) * (oxyBlock ? 0.35 : 1) * (pgBlock ? 0.55 : 1), 0, 1);
    d = Math.min(10, d + 0.05 * 1.6 * Math.max(0, c - 0.2));
  }
  return { d, oxy, c };
}

function model(values: Record<string, number>): LabourState {
  const { mode, hours, oxyBlock, pgBlock, feeds, stress } = values;
  const notes: string[] = [];
  if (mode === 0) {
    const { d, oxy, c } = labourAt(hours, oxyBlock, pgBlock);
    if (d >= 10) notes.push('Fully dilated: the baby is delivered as the mother bears down.');
    if (oxyBlock) notes.push('Without oxytocin the positive feedback loop is broken: contractions stay weak.');
    if (pgBlock) notes.push('Prostaglandins raise Ca²⁺ in the myometrium; blocking them weakens contractions.');
    return {
      readouts: { dilation: d, contraction: c * 100, oxytocin: oxy * 100, delivered: d >= 10 ? 1 : 0, milk: 0, prolactin: 100, ejection: 0, cycles: 0 },
      notes,
      mode,
      dilation: d,
      contraction: c,
      oxytocin: oxy,
      milk: 0,
      ejection: false,
      prolactin: 1,
    };
  }
  const prolactin = clamp(1 + 0.6 * feeds, 1, 10);
  const ejection = feeds > 0 && !stress;
  const oxytocin = ejection ? 3 : 1;
  const milk = clamp((feeds / 8) * 100 * (ejection ? 1 : 0.35), 0, 120); // milk removed keeps supply up
  const cyclesStopped = feeds >= 7;
  if (stress && feeds > 0) notes.push('Emotional distress inhibits the milk ejection reflex through higher centres: milk stays in the alveoli.');
  if (cyclesStopped) notes.push('Frequent suckling releases β-endorphin: GnRH is inhibited and prolactin is high, so ovulation stops (lactational amenorrhoea).');
  if (feeds < 7 && feeds > 0) notes.push('Feeds are too far apart to stop ovarian cycles reliably.');
  return {
    readouts: { dilation: 0, contraction: 0, oxytocin: oxytocin * 100, delivered: 0, milk, prolactin: prolactin * 100, ejection: ejection ? 1 : 0, cycles: cyclesStopped ? 1 : 0 },
    notes,
    mode,
    dilation: 0,
    contraction: 0,
    oxytocin,
    milk,
    ejection,
    prolactin,
  };
}

const START = { mode: 0, hours: 2, oxyBlock: 0, pgBlock: 0, feeds: 8, stress: 0 };

export const labourLactation: SimDefinition<LabourState> = {
  id: 'labour-lactation',
  name: 'Labour and breastfeeding',
  controls: [
    { kind: 'choice', key: 'mode', label: 'Show', options: [{ value: 0, label: 'Labour' }, { value: 1, label: 'Breastfeeding' }] },
    { kind: 'slider', key: 'hours', label: 'Hours of labour', unit: 'h', min: 0, max: 16, step: 1 },
    { kind: 'choice', key: 'oxyBlock', label: 'Oxytocin', options: [{ value: 0, label: 'Released' }, { value: 1, label: 'Blocked' }] },
    { kind: 'choice', key: 'pgBlock', label: 'Prostaglandin synthesis', options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'Blocked' }] },
    { kind: 'slider', key: 'feeds', label: 'Breastfeeds a day', min: 0, max: 12, step: 1 },
    { kind: 'choice', key: 'stress', label: 'Emotional distress', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
  ],
  initial: START,
  readouts: [
    { key: 'dilation', label: 'Cervix dilated', unit: 'cm', decimals: 1, primary: true },
    { key: 'contraction', label: 'Contraction strength', unit: '%' },
    { key: 'oxytocin', label: 'Oxytocin', unit: '%' },
    { key: 'delivered', label: 'Baby delivered', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'milk', label: 'Milk supply', unit: '%', primary: true },
    { key: 'prolactin', label: 'Prolactin', unit: '%' },
    { key: 'ejection', label: 'Milk ejection', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'cycles', label: 'Ovarian cycles', noDelta: true, text: (v) => (v ? 'Suppressed' : 'May return') },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'early', label: 'Early labour', values: START, caption: 'Stretch of the cervix releases oxytocin; contractions strengthen.' },
    { id: 'late', label: 'Late labour', values: { ...START, hours: 9 }, caption: 'Positive feedback: near full dilation.' },
    { id: 'feeding', label: 'Breastfeeding', values: { ...START, mode: 1 }, caption: 'Suckling: oxytocin ejects milk, prolactin maintains it, cycles stop.' },
    { id: 'stress', label: 'Distressed mother', values: { ...START, mode: 1, stress: 1 }, caption: 'The let-down reflex is inhibited.' },
  ],
  challenges: [
    {
      id: 'deliver',
      label: 'Deliver the baby',
      prompt: 'Reach full dilation (10 cm) within 12 hours.',
      rules: ['Labour mode.'],
      start: { mode: 0, hours: 4, oxyBlock: 1, pgBlock: 1, feeds: 8, stress: 0 },
      locked: ['mode', 'feeds', 'stress'],
      limits: { hours: { max: 12 } },
      goals: [{ readout: 'dilation', atLeast: 10, label: 'Fully dilated' }],
      debrief: 'Labour needs both oxytocin and prostaglandins: oxytocin strengthens contractions, which stretch the cervix, which releases more oxytocin.',
    },
  ],
  modelNote:
    'Simplified teaching model. The hormones of labour, the stretch → oxytocin positive feedback, the milk ejection reflex, prolactin and lactational amenorrhoea are from the lecture (Sexual Response, slides 65–90). The dilation rate, 10 cm at full dilation and the size of the prostaglandin effect are textbook and illustrative.',
};

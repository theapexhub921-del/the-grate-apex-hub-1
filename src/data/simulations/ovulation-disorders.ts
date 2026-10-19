// Reproductive Lesson 7 — Anovulation, amenorrhoea and the ovarian hormones.
//
// Lecture (Female, slides 45–62): ovulation fails when the hypothalamus, pituitary or ovary
// malfunctions — no GnRH, or hyperprolactinaemia (prolactinoma) lowering the hormones that trigger
// ovulation; also PCOS, thyroid and adrenal disease, excessive exercise, weight loss, obesity,
// stress. Secondary amenorrhoea: commonest causes pregnancy, lactation, undernutrition, stress,
// eating disorders, strenuous exercise. Estrogens inhibit bone resorption; progesterone is
// thermogenic and makes the endometrium secretory; inhibin inhibits FSH.
// Textbook (labelled): at menopause FSH and LH rise because estrogen and inhibin no longer hold
// them down; low estrogen speeds bone loss.
import { type SimDefinition, type SimState } from '@/data/simulations/types';

export const CAUSES = ['None (regular cycles)', 'Prolactinoma (high prolactin)', 'Low body weight or strenuous exercise', 'Pregnancy', 'Menopause'];
export const PERIODS = ['Regular', 'Absent'];

type Row = { gnrh: number; fsh: number; lh: number; e2: number; p4: number; prolactin: number; ovulates: number };
const TABLE: Row[] = [
  { gnrh: 100, fsh: 100, lh: 100, e2: 100, p4: 100, prolactin: 100, ovulates: 1 },
  { gnrh: 35, fsh: 55, lh: 40, e2: 45, p4: 5, prolactin: 600, ovulates: 0 },
  { gnrh: 25, fsh: 45, lh: 30, e2: 35, p4: 5, prolactin: 100, ovulates: 0 },
  { gnrh: 20, fsh: 10, lh: 10, e2: 1500, p4: 2000, prolactin: 800, ovulates: 0 },
  { gnrh: 150, fsh: 900, lh: 500, e2: 15, p4: 3, prolactin: 90, ovulates: 0 },
];

export type DisorderState = SimState & Row & { cause: number };

function model(values: Record<string, number>): DisorderState {
  const { cause } = values;
  const row = TABLE[cause] ?? TABLE[0];
  const bone = row.e2 < 60 ? (cause === 4 ? 3 : 1.5) : 1; // relative rate of bone loss
  const notes: string[] = [];
  if (cause === 1) notes.push('High prolactin lowers GnRH, and with it the FSH and LH that drive ovulation.');
  if (cause === 2) notes.push('Caloric deprivation and strenuous exercise override the hypothalamic signals for ovulation.');
  if (cause === 3) notes.push('Pregnancy: estrogen and progesterone from the placenta suppress the gonadotropins — the commonest cause of secondary amenorrhoea.');
  if (cause === 4) notes.push('Few oocytes are left and the follicles resist FSH: estrogen falls, so FSH and LH rise.');
  return {
    readouts: { gnrh: row.gnrh, fsh: row.fsh, lh: row.lh, e2: row.e2, p4: row.p4, prolactin: row.prolactin, ovulates: row.ovulates, periods: row.ovulates ? 0 : 1, bone: bone * 100 },
    notes,
    ...row,
    cause,
  };
}

export const ovulationDisorders: SimDefinition<DisorderState> = {
  id: 'ovulation-disorders',
  name: 'When ovulation stops',
  controls: [{ kind: 'choice', key: 'cause', label: 'Cause', options: CAUSES.map((label, value) => ({ value, label })) }],
  initial: { cause: 0 },
  readouts: [
    { key: 'ovulates', label: 'Ovulation', noDelta: true, primary: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'periods', label: 'Periods', noDelta: true, text: (v) => PERIODS[v] ?? '' },
    { key: 'gnrh', label: 'GnRH pulses', unit: '%' },
    { key: 'fsh', label: 'FSH', unit: '%' },
    { key: 'lh', label: 'LH', unit: '%' },
    { key: 'e2', label: 'Estrogen', unit: '%', primary: true },
    { key: 'p4', label: 'Luteal progesterone', unit: '%' },
    { key: 'prolactin', label: 'Prolactin', unit: '%' },
    { key: 'bone', label: 'Rate of bone loss', unit: '%' },
  ],
  model,
  scenarios: CAUSES.map((label, cause) => ({ id: `c${cause}`, label, values: { cause }, caption: ['Ovulation and periods each month.', 'Galactorrhoea and amenorrhoea.', 'The hypothalamus switches the cycle off.', 'The corpus luteum, then the placenta, keep the hormones high.', 'No more follicles to respond.'][cause] })),
  challenges: [
    {
      id: 'high-fsh',
      label: 'Which one raises FSH?',
      prompt: 'Find the cause of absent periods in which FSH is high (over 300%).',
      rules: ['Choose a cause.'],
      start: { cause: 1 },
      goals: [{ readout: 'fsh', atLeast: 300, label: 'FSH over 300%' }],
      debrief: 'When the ovary itself fails (menopause), estrogen and inhibin no longer hold FSH and LH down; when the hypothalamus is switched off, FSH and LH are low.',
    },
  ],
  modelNote:
    'Simplified teaching model. The causes of anovulation and amenorrhoea and the actions of estrogen, progesterone and inhibin are from the lecture (Female, slides 45–62). The hormone levels in each condition are textbook-based and illustrative.',
};

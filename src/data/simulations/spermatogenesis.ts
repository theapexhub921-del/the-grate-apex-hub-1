// Reproductive Lesson 2 — Spermatogenesis, maturation and capacitation.
//
// Lecture (Male, slides 22–25, 28–29, 41–43): spermatogenesis takes about 74 days in the
// seminiferous tubules: mitotic phase (type A → type B spermatogonia → primary spermatocytes),
// meiotic phase (secondary spermatocytes → spermatids, haploid), spermiogenesis (spermatids →
// sperm); each generation moves towards the lumen; spermiation releases sperm. Sperm mature and
// gain motility in the epididymis (stored up to 2 weeks), then are stored in the vas deferens.
// Capacitation in the female tract takes 5–7 hours, then hyperactivated motility and the
// acrosome reaction become possible.
// Textbook (labelled): how the 74 days divide between the phases.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const STAGES = ['Type A spermatogonium', 'Type B spermatogonium', 'Primary spermatocyte', 'Secondary spermatocyte', 'Spermatid', 'Spermatozoon (released)', 'Maturing in the epididymis', 'Stored in the vas deferens'];
export const PLACES = ['Seminiferous tubule — basal compartment', 'Seminiferous tubule — adluminal compartment', 'Lumen of the tubule', 'Epididymis', 'Vas deferens', 'Female tract'];

export type SpermState = SimState & { stage: number; place: number; progress: number; capacitated: boolean };

function stageAt(day: number) {
  if (day < 8) return 0;
  if (day < 16) return 1;
  if (day < 38) return 2;
  if (day < 40) return 3;
  if (day < 74) return 4;
  if (day < 75) return 5;
  if (day < 88) return 6;
  return 7;
}

function model(values: Record<string, number>): SpermState {
  const { day, hours } = values;
  const stage = stageAt(day);
  const inFemale = hours > 0 && stage === 7;
  const place = inFemale ? 5 : stage <= 1 ? 0 : stage <= 4 ? 1 : stage === 5 ? 2 : stage === 6 ? 3 : 4;
  const chromosomes = stage <= 2 ? 46 : 23;
  const motile = stage >= 6 && (stage === 7 || day >= 82) ? 1 : 0;
  const capacitated = inFemale && hours >= 6;
  const notes: string[] = [];
  if (stage === 3) notes.push('Meiosis I has halved the chromosome number: secondary spermatocytes are haploid (23).');
  if (stage === 6) notes.push('In the epididymis the sperm mature and develop motility, bathed in protein- and ion-rich fluid.');
  if (inFemale && !capacitated) notes.push('Freshly ejaculated sperm can barely fertilise: capacitation in the female tract takes 5–7 hours.');
  if (capacitated) notes.push('Capacitated: seminal proteins stripped off, Ca²⁺ in, cAMP up — hyperactivated motility and ready for the acrosome reaction.');
  return {
    readouts: { stage, place, chromosomes, motile, capacitated: capacitated ? 1 : 0, progress: clamp((day / 74) * 100, 0, 100) },
    notes,
    stage,
    place,
    progress: clamp(day / 74, 0, 1.3),
    capacitated,
  };
}

const START = { day: 20, hours: 0 };

export const spermatogenesis: SimDefinition<SpermState> = {
  id: 'spermatogenesis',
  name: 'From spermatogonium to sperm',
  controls: [
    { kind: 'slider', key: 'day', label: 'Days since the spermatogonium divided', unit: 'days', min: 0, max: 100, step: 2 },
    { kind: 'slider', key: 'hours', label: 'Hours in the female tract (after ejaculation)', unit: 'h', min: 0, max: 10, step: 1 },
  ],
  initial: START,
  readouts: [
    { key: 'stage', label: 'Cell', noDelta: true, primary: true, text: (v) => STAGES[v] ?? '' },
    { key: 'place', label: 'Where', noDelta: true, text: (v) => PLACES[v] ?? '' },
    { key: 'chromosomes', label: 'Chromosomes' },
    { key: 'progress', label: 'Spermatogenesis done', unit: '%' },
    { key: 'motile', label: 'Motile', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'capacitated', label: 'Capacitated', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
  ],
  model,
  scenarios: [
    { id: 'mitotic', label: 'Mitotic phase', values: { day: 4, hours: 0 }, caption: 'Spermatogonia on the basal lamina divide by mitosis.' },
    { id: 'meiotic', label: 'Meiotic phase', values: { day: 30, hours: 0 }, caption: 'Primary spermatocytes, beyond the blood–testis barrier, enter meiosis.' },
    { id: 'spermiogenesis', label: 'Spermiogenesis', values: { day: 60, hours: 0 }, caption: 'Round spermatids become sperm: acrosome, midpiece and tail form.' },
    { id: 'capacitation', label: 'Capacitation', values: { day: 96, hours: 7 }, caption: 'After hours in the female tract the sperm can fertilise.' },
  ],
  challenges: [
    {
      id: 'ready',
      label: 'Ready to fertilise',
      prompt: 'Bring this sperm to the point where it can fertilise an egg.',
      rules: ['Use both sliders.'],
      start: { day: 20, hours: 0 },
      goals: [{ readout: 'capacitated', atLeast: 1, label: 'Capacitated' }],
      debrief: 'About 74 days to make the sperm, time in the epididymis to gain motility, and 5–7 hours in the female tract to be capacitated.',
    },
  ],
  modelNote:
    'Simplified teaching model. The phases and cells, the ~74 days, maturation in the epididymis and capacitation (5–7 h) are from the lecture (Male, slides 22–25, 41–43). How the 74 days divide between the phases is textbook and approximate.',
};

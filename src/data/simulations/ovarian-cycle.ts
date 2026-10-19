// Reproductive Lesson 5 — The follicle, ovulation and the corpus luteum.
//
// Lecture (Female, slides 8–20): primary oocytes arrest in prophase of meiosis I until puberty;
// each cycle 30–40 primordial follicles are recruited; primordial → primary (zona pellucida) →
// preantral (theca; 10–15 mm) → antral (dominant follicle selected) → Graafian (1.5–2.5 cm).
// Just before ovulation meiosis I is completed (secondary oocyte + first polar body) and meiosis II
// begins and arrests in metaphase; it completes only if fertilisation occurs. Ovulation ~day 14;
// corpus haemorrhagicum → corpus luteum → corpus albicans in 14 days without fertilisation.
// The day-by-day follicle sizes are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const FOLLICLES = ['Primordial follicles recruited', 'Primary follicles', 'Preantral (secondary) follicles', 'Antral follicle — dominant one selected', 'Graafian follicle', 'Ovulation', 'Corpus haemorrhagicum', 'Corpus luteum', 'Corpus albicans'];
export const OOCYTE = ['Primary oocyte, arrested in prophase I', 'Secondary oocyte, arrested in metaphase II', 'Meiosis II completed: ovum (fertilised)', 'Degenerating (not fertilised)'];

export type OvaryState = SimState & { stage: number; size: number; luteum: number; fertilised: boolean };

function model(values: Record<string, number>): OvaryState {
  const { day, fertilised } = values;
  let stage = 0;
  if (day >= 2) stage = 1;
  if (day >= 5) stage = 2;
  if (day >= 8) stage = 3;
  if (day >= 12) stage = 4;
  if (day === 14) stage = 5;
  if (day >= 15) stage = 6;
  if (day >= 17) stage = 7;
  if (day >= 26 && !fertilised) stage = 8;
  const size = day <= 14 ? clamp(1 + 22 * ((day - 1) / 13) ** 2, 0.1, 23) : 0; // mm
  const luteum = day < 15 ? 0 : fertilised ? 1 : clamp(day < 24 ? 1 : 1 - (day - 24) / 4, 0, 1);
  const oocyte = day < 13 ? 0 : day >= 15 && fertilised ? 2 : day >= 16 && !fertilised ? 3 : 1;
  const notes: string[] = [];
  if (stage === 3) notes.push('Of the follicles recruited, one becomes dominant; the rest degenerate.');
  if (stage === 5) notes.push('The Graafian follicle ruptures and expels the secondary oocyte with its zona and cumulus cells.');
  if (fertilised && day >= 17) notes.push('hCG from the implanting embryo rescues the corpus luteum, so it keeps secreting.');
  return {
    readouts: { stage, size, oocyte, luteum: luteum * 100 },
    notes,
    stage,
    size,
    luteum,
    fertilised: !!fertilised,
  };
}

const START = { day: 6, fertilised: 0 };

export const ovarianCycle: SimDefinition<OvaryState> = {
  id: 'ovarian-cycle',
  name: 'The ovarian cycle',
  controls: [
    { kind: 'slider', key: 'day', label: 'Day of the cycle', min: 1, max: 28, step: 1 },
    { kind: 'choice', key: 'fertilised', label: 'Oocyte fertilised', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
  ],
  initial: START,
  readouts: [
    { key: 'stage', label: 'In the ovary', noDelta: true, primary: true, text: (v) => FOLLICLES[v] ?? '' },
    { key: 'size', label: 'Dominant follicle', unit: 'mm', primary: true },
    { key: 'oocyte', label: 'The oocyte', noDelta: true, text: (v) => OOCYTE[v] ?? '' },
    { key: 'luteum', label: 'Corpus luteum activity', unit: '%' },
  ],
  model,
  scenarios: [
    { id: 'early', label: 'Day 3', values: { day: 3, fertilised: 0 }, caption: 'Primary follicles grow; the oocyte is still arrested in prophase I.' },
    { id: 'graafian', label: 'Day 13', values: { day: 13, fertilised: 0 }, caption: 'A Graafian follicle 1.5–2.5 cm across; meiosis I completed.' },
    { id: 'luteal', label: 'Day 21', values: { day: 21, fertilised: 0 }, caption: 'The corpus luteum secretes progesterone and estrogen.' },
    { id: 'pregnant', label: 'Day 27, pregnant', values: { day: 27, fertilised: 1 }, caption: 'hCG keeps the corpus luteum alive.' },
  ],
  challenges: [
    {
      id: 'graafian',
      label: 'Find the Graafian follicle',
      prompt: 'Find a day when the dominant follicle is at least 15 mm across but has not yet ruptured.',
      rules: ['Move through the cycle.'],
      start: START,
      goals: [
        { readout: 'size', atLeast: 15, label: 'Follicle ≥ 15 mm' },
        { readout: 'stage', atMost: 4, label: 'Not yet ovulated' },
      ],
      debrief: 'The Graafian follicle reaches 1.5–2.5 cm just before ovulation around day 14 (Female, slides 17–19).',
    },
  ],
  modelNote:
    'Simplified teaching model of a 28-day cycle. The stages, meiotic arrests, Graafian follicle size, ovulation around day 14 and the 14-day corpus luteum are from the lecture (Female, slides 8–20); the day each stage begins and the follicle growth curve are illustrative.',
};

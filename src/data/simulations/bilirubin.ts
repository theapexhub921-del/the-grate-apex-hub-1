// GI Lesson 9 — Bilirubin, bile and jaundice.
//
// Lecture (slides 200–217): bilirubin comes mostly from haem of broken-down red cells; the liver
// conjugates it (water-soluble) and excretes it in bile; bacteria change some, excreted in faeces
// and urine. Jaundice is visible above 2.5–3 mg/dL. Pre-hepatic (haemolysis): unconjugated;
// hepatic: unconjugated and/or conjugated; post-hepatic (obstruction): conjugated. The gallbladder
// stores and concentrates bile; CCK (fatty acids in the duodenum) contracts it and relaxes the
// sphincter of Oddi.
// Textbook values (labelled): normal total bilirubin ≈ 0.3–1.0 mg/dL; conjugated bilirubin in the
// urine darkens it; with complete obstruction the stools are pale and urobilinogen disappears.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const TYPES = ['No jaundice', 'Pre-hepatic jaundice', 'Hepatic jaundice', 'Post-hepatic jaundice'];

export type BilirubinState = SimState & { unconjugated: number; conjugated: number; total: number; gallbladder: number; blocked: boolean };

function model(values: Record<string, number>): BilirubinState {
  const { haemolysis, liver, obstruction, meal } = values;
  const l = liver / 100;
  const blocked = obstruction === 1;
  const unconjugated = clamp((0.6 * haemolysis) / Math.max(l, 0.1), 0.2, 30);
  const conjugated = clamp(0.15 + 2 * (1 - l) * haemolysis + (blocked ? 6 : 0), 0.1, 30);
  const total = unconjugated + conjugated;
  let type = 0;
  if (total > 2.5) type = blocked ? 3 : l < 0.6 ? 2 : 1;
  const darkUrine = conjugated > 1 ? 1 : 0;
  const paleStool = blocked ? 1 : 0;
  const urobilinogen = blocked ? 0 : clamp(100 * haemolysis * Math.min(1, l * 1.2), 0, 800);
  const gallbladder = blocked ? 1.3 : meal ? 0.6 : 1;
  const notes: string[] = [];
  if (type === 1) notes.push('More haem is broken down than the liver can conjugate: unconjugated bilirubin builds up.');
  if (type === 3) notes.push('Bile cannot drain: conjugated bilirubin backs up into the blood and spills into the urine; the stools lose their colour.');
  if (meal && !blocked) notes.push('Fat in the duodenum releases CCK: the gallbladder contracts and the sphincter of Oddi relaxes.');
  return {
    readouts: { unconjugated, conjugated, total, type, urine: darkUrine, stool: paleStool, urobilinogen, gallbladder: Math.round(gallbladder * 100) },
    notes,
    unconjugated,
    conjugated,
    total,
    gallbladder,
    blocked,
  };
}

const START = { haemolysis: 1, liver: 100, obstruction: 0, meal: 0 };

export const bilirubin: SimDefinition<BilirubinState> = {
  id: 'bilirubin',
  name: 'Bilirubin and jaundice',
  controls: [
    { kind: 'slider', key: 'haemolysis', label: 'Red cell breakdown', unit: '× normal', min: 1, max: 6, step: 0.5 },
    { kind: 'slider', key: 'liver', label: 'Liver function', unit: '%', min: 10, max: 100, step: 10 },
    { kind: 'choice', key: 'obstruction', label: 'Common bile duct', options: [{ value: 0, label: 'Open' }, { value: 1, label: 'Blocked (gallstone)' }] },
    { kind: 'choice', key: 'meal', label: 'Duodenum', options: [{ value: 0, label: 'Fasting' }, { value: 1, label: 'Fatty meal arriving' }] },
  ],
  initial: START,
  readouts: [
    { key: 'unconjugated', label: 'Unconjugated bilirubin', unit: 'mg/dL', decimals: 1 },
    { key: 'conjugated', label: 'Conjugated bilirubin', unit: 'mg/dL', decimals: 1 },
    { key: 'total', label: 'Total bilirubin', unit: 'mg/dL', decimals: 1, primary: true },
    { key: 'type', label: 'Picture', noDelta: true, text: (v) => TYPES[v] ?? '' },
    { key: 'urine', label: 'Urine', noDelta: true, text: (v) => (v ? 'Dark (bilirubin)' : 'Normal') },
    { key: 'stool', label: 'Stools', noDelta: true, text: (v) => (v ? 'Pale' : 'Normal') },
    { key: 'urobilinogen', label: 'Urobilinogen', unit: '%' },
    { key: 'gallbladder', label: 'Gallbladder size', unit: '%' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Bilirubin is conjugated and excreted as fast as it is made.' },
    { id: 'haemolysis', label: 'Haemolysis (e.g. malaria)', values: { ...START, haemolysis: 6 }, caption: 'Pre-hepatic jaundice: mostly unconjugated bilirubin.' },
    { id: 'hepatitis', label: 'Hepatitis', values: { ...START, liver: 20 }, caption: 'Hepatic jaundice: both kinds rise.' },
    { id: 'stone', label: 'Gallstone in the bile duct', values: { ...START, obstruction: 1 }, caption: 'Post-hepatic jaundice: conjugated bilirubin, dark urine, pale stools.' },
  ],
  challenges: [
    {
      id: 'clear',
      label: 'Clear the jaundice',
      prompt: 'This patient is jaundiced. Bring the total bilirubin under 2.5 mg/dL by fixing one thing.',
      rules: ['The red cell breakdown and liver function are fixed.'],
      start: { haemolysis: 1, liver: 100, obstruction: 1, meal: 0 },
      locked: ['haemolysis', 'liver'],
      goals: [{ readout: 'total', atMost: 2.5, label: 'Total bilirubin under 2.5 mg/dL' }],
      debrief: 'With normal red cell breakdown and a healthy liver, the jaundice must be post-hepatic: remove the stone and bile — with its conjugated bilirubin — drains again.',
    },
  ],
  modelNote:
    'Simplified teaching model. Where bilirubin comes from, its conjugation and excretion, the visible threshold (2.5–3 mg/dL), the three types of jaundice and the gallbladder’s response to CCK are from the lecture (slides 200–217). The normal level, urine and stool colours and urobilinogen are textbook; the numbers are illustrative.',
};

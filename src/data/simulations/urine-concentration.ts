// Renal Lesson 4 — Concentrating the urine.
//
// Lecture (slides 64–82): body fluids ≈ 300 mOsm. The countercurrent
// multiplier: water leaves the descending limb; NaCl leaves the ascending
// limb (Na⁺-K⁺-2Cl⁻ in the thick part); fluid at the bend ≈ 1200 mOsm; the
// distal tubule receives ≈ 100 mOsm fluid. ADH inserts aquaporins in the
// collecting duct; without it, large volumes of dilute urine (diabetes
// insipidus). Diuretics: osmotic (glucose), alcohol (↓ ADH), xanthines
// (↓ Na⁺ reabsorption), Lasix (blocks Na⁺-K⁺-2Cl⁻). Textbook (labelled):
// ≈ 600–900 mOsm of solute excreted a day; how far each drug acts is
// illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const DRUGS = ['None', 'Lasix (furosemide)', 'Osmotic diuretic (glucose)', 'Alcohol', 'Caffeine'];

export type ConcentrationState = SimState & {
  peak: number;
  dct: number;
  urineOsm: number;
  flow: number; // L/day
  adh: number; // effective 0–1
  drug: number;
  gradient: number; // 0–1 strength of the multiplier
};

const SOLUTE = [0.6, 1.4, 1.8, 0.6, 0.85]; // mOsm/min excreted

function model(values: Record<string, number>): ConcentrationState {
  const { adh, drug } = values;
  const gradient = drug === 1 ? 0.2 : drug === 4 ? 0.85 : 1;
  const peak = 300 + 900 * gradient;
  const dct = 100 + 200 * (1 - gradient);
  const adhEff = clamp((adh / 100) * (drug === 3 ? 0.2 : 1), 0, 1);
  const ceiling = drug === 2 ? 300 + (peak - 300) * 0.35 : peak;
  const urineOsm = dct + Math.max(0, ceiling - dct) * adhEff;
  const flow = ((SOLUTE[drug] ?? 0.6) * 1000) / urineOsm * 1.44;
  const notes: string[] = [];
  if (adhEff < 0.1) notes.push('Little or no ADH: the collecting duct stays watertight, so large volumes of dilute urine pass (as in diabetes insipidus).');
  if (drug === 1) notes.push('Lasix blocks the Na⁺-K⁺-2Cl⁻ co-transporter: NaCl is not pumped out, the medullary gradient collapses.');
  if (drug === 2) notes.push('Unreabsorbed glucose holds water in the tubule: an osmotic diuresis.');
  if (drug === 3) notes.push('Alcohol inhibits ADH secretion.');
  if (drug === 4) notes.push('Caffeine inhibits Na⁺ reabsorption, and the water that would have followed it.');
  return {
    readouts: { urineOsm, flow, peak, dct },
    notes,
    peak,
    dct,
    urineOsm,
    flow,
    adh: adhEff,
    drug,
    gradient,
  };
}

const START = { adh: 50, drug: 0 };

export const urineConcentration: SimDefinition<ConcentrationState> = {
  id: 'urine-concentration',
  name: 'Concentrating the urine',
  controls: [
    { kind: 'slider', key: 'adh', label: 'ADH (vasopressin)', unit: '% of maximum', min: 0, max: 100, step: 5 },
    { kind: 'choice', key: 'drug', label: 'Diuretic', options: DRUGS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'urineOsm', label: 'Urine concentration', unit: 'mOsm', primary: true },
    { key: 'flow', label: 'Urine volume', unit: 'L/day', decimals: 1 },
    { key: 'peak', label: 'Fluid at the bend of the loop', unit: 'mOsm' },
    { key: 'dct', label: 'Fluid reaching the distal tubule', unit: 'mOsm' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Gradient up to 1200 mOsm; moderate ADH.' },
    { id: 'thirsty', label: 'Dehydrated (high ADH)', values: { ...START, adh: 100 }, caption: 'Small volume of urine as concentrated as the deep medulla.' },
    { id: 'di', label: 'Diabetes insipidus', values: { ...START, adh: 0 }, caption: 'No ADH: litres of dilute urine.' },
    { id: 'lasix', label: 'Lasix', values: { ...START, drug: 1 }, caption: 'The multiplier stops: the gradient collapses.' },
  ],
  challenges: [
    {
      id: 'di',
      label: 'Treat diabetes insipidus',
      prompt: 'A patient makes no ADH. Give ADH (desmopressin) to bring urine output down to 2 L a day or less.',
      rules: ['Only the ADH level can change.'],
      start: { adh: 0, drug: 0 },
      locked: ['drug'],
      goals: [{ readout: 'flow', atMost: 2, label: 'Urine 2 L/day or less' }],
      debrief: 'ADH inserts aquaporins into the collecting duct, so water leaves into the concentrated medulla and a small volume of concentrated urine remains (slides 78–79).',
    },
  ],
  modelNote:
    'Simplified teaching model. The 300 → 1200 → 100 mOsm profile of the loop, ADH and aquaporins, diabetes insipidus and how each diuretic acts are from the lecture (slides 64–82). Solute excretion (≈ 600–900 mOsm a day) is textbook; how strongly each diuretic acts is illustrative.',
};

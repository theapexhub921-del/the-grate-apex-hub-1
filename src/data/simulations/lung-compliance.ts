// Respiratory Lesson 3 — Compliance and surfactant.
//
// Lecture (slides 27–35): compliance = change in lung volume per unit
// change in pressure; reduced by fibrosis and oedema, increased in
// emphysema; surfactant (type II cells) lowers surface tension, keeping
// alveoli open and dry; its absence (premature babies) causes collapse —
// respiratory distress syndrome, treated with surfactant. A quiet breath
// moves ≈ 500 ml for the −2.5 → −6 mmHg intrapleural swing (slides 14, 39),
// so normal compliance here is ≈ 500/3.5 ml per mmHg. The size of each
// effect is illustrative.
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const CONDITIONS = ['Normal lung', 'Fibrosis', 'Pulmonary oedema', 'Emphysema'];
const CONDITION_FACTOR = [1, 0.5, 0.6, 1.6];
export const NORMAL_COMPLIANCE = 500 / 3.5;

export type ComplianceState = SimState & {
  compliance: number;
  pressure: number;
  surfactant: number;
  condition: number;
  tidal: number;
  collapse: number;
};

function model(values: Record<string, number>): ComplianceState {
  const { surfactant, condition, pressure } = values;
  const surface = 0.35 + 0.65 * (surfactant / 100);
  const compliance = NORMAL_COMPLIANCE * surface * (CONDITION_FACTOR[condition] ?? 1);
  const tidal = compliance * pressure;
  const tension = 1 - 0.7 * (surfactant / 100);
  const collapse = (tension / 0.3) * 100;
  const notes: string[] = [];
  if (surfactant < 40) notes.push('Too little surfactant: high surface tension pulls the alveoli shut (atelectasis) — respiratory distress syndrome of the premature baby.');
  if (condition === 3) notes.push('Emphysema destroys elastic tissue: the lung stretches more easily (compliance rises).');
  if (condition === 1 || condition === 2) notes.push('A stiff lung needs a bigger pressure change for the same breath — more work.');
  return {
    readouts: { compliance, tidal, needed: 500 / compliance, collapse },
    notes,
    compliance,
    pressure,
    surfactant,
    condition,
    tidal,
    collapse,
  };
}

const START = { surfactant: 100, condition: 0, pressure: 3.5 };

export const lungCompliance: SimDefinition<ComplianceState> = {
  id: 'lung-compliance',
  name: 'Compliance and surfactant',
  controls: [
    { kind: 'slider', key: 'surfactant', label: 'Surfactant', unit: '% of normal', min: 0, max: 100, step: 5, hint: 'Made by type II alveolar cells' },
    { kind: 'choice', key: 'condition', label: 'Lung tissue', options: CONDITIONS.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'pressure', label: 'Pressure change in a breath', unit: 'mmHg', min: 0, max: 10, step: 0.5, hint: '3.5 mmHg = a quiet breath (−2.5 → −6)' },
  ],
  initial: START,
  readouts: [
    { key: 'compliance', label: 'Compliance', unit: 'ml/mmHg', primary: true },
    { key: 'tidal', label: 'Breath size', unit: 'ml' },
    { key: 'needed', label: 'Pressure needed for 500 ml', unit: 'mmHg', decimals: 1 },
    { key: 'collapse', label: 'Pull to collapse alveoli', unit: '% of normal' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'normal', label: 'Normal lung', values: START, caption: 'A 3.5 mmHg swing moves about 500 ml.' },
    { id: 'rds', label: 'Premature baby', values: { ...START, surfactant: 10 }, caption: 'Little surfactant: surface tension is high, compliance low, alveoli collapse.' },
    { id: 'fibrosis', label: 'Fibrosis', values: { ...START, condition: 1 }, caption: 'Stiff lung: the same pressure moves much less air.' },
    { id: 'emphysema', label: 'Emphysema', values: { ...START, condition: 3 }, caption: 'Loss of elastic tissue: compliance rises.' },
  ],
  challenges: [
    {
      id: 'rds',
      label: 'Treat respiratory distress',
      prompt: 'A premature baby has 10% of normal surfactant. Using only surfactant treatment, get a quiet breath (3.5 mmHg) to move at least 450 ml.',
      rules: ['The lung tissue and breathing pressure are fixed.'],
      start: { surfactant: 10, condition: 0, pressure: 3.5 },
      locked: ['condition', 'pressure'],
      goals: [{ readout: 'tidal', atLeast: 450, label: 'Breath size at least 450 ml' }],
      debrief: 'Giving surfactant (bovine surfactant; corticosteroids help the baby make its own) lowers surface tension, so the alveoli open and the lung becomes compliant again (slide 32).',
    },
  ],
  modelNote:
    'Simplified teaching model. The definition of compliance, its causes of change and the role of surfactant are from slides 27–35; normal compliance is worked out from the lecture’s 500 ml breath and −2.5 → −6 mmHg swing. The size of each effect is illustrative.',
};

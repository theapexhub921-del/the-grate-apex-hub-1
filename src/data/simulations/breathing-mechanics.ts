// Respiratory Lesson 1 — Pressures that move air: intrapleural pressure,
// lung pressure, airway calibre and pneumothorax.
//
// Lecture (Respiratory System, slides 5, 10–16): inspiration expands the
// chest, lung pressure falls below atmospheric and air flows in;
// intrapleural pressure is about −2.5 mmHg, becoming about −6 mmHg in
// inspiration; muscarinic receptors constrict the airways, β2 receptors
// (salbutamol) dilate them; pneumothorax raises intrapleural pressure and
// the lung collapses (slide 125). Tidal volume ≈ 500 ml (slide 39).
// The lung-pressure values and resistance factors are illustrative.
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const AIRWAYS = ['Normal', 'Bronchoconstricted', 'Salbutamol (β2)'];
const RESISTANCE = [1, 3, 0.8];

export type MechanicsState = SimState & {
  effort: number;
  airway: number;
  pneumothorax: boolean;
  intrapleural: number;
  lungPressure: number;
  tidal: number;
  resistance: number;
};

function model(values: Record<string, number>): MechanicsState {
  const { effort, airway, pleura } = values;
  const pneumothorax = pleura === 1;
  const resistance = RESISTANCE[airway] ?? 1;
  const intrapleural = pneumothorax ? 0 : -2.5 - 3.5 * (effort / 100);
  const lungPressure = pneumothorax ? 0 : -1 * (effort / 100) * Math.sqrt(resistance);
  const tidal = pneumothorax ? 0 : (500 * (effort / 100)) / (1 + 0.35 * (resistance - 1));
  const notes: string[] = [];
  if (pneumothorax) notes.push('Air in the pleural space: intrapleural pressure equals atmospheric, nothing holds the lung out, and it collapses.');
  else if (airway === 1) notes.push('Narrow airways: the same effort moves less air. Muscarinic stimulation constricts the bronchioles (blocked by atropine).');
  if (!pneumothorax && effort === 0) notes.push('No inspiratory effort: intrapleural pressure stays at its resting −2.5 mmHg and no air moves.');
  return {
    readouts: { tidal, intrapleural, lungPressure, lung: pneumothorax ? 0 : 1 },
    notes,
    effort,
    airway,
    pneumothorax,
    intrapleural,
    lungPressure,
    tidal,
    resistance,
  };
}

const START = { effort: 100, airway: 0, pleura: 0 };

export const breathingMechanics: SimDefinition<MechanicsState> = {
  id: 'breathing-mechanics',
  name: 'Pressures that move air',
  controls: [
    { kind: 'slider', key: 'effort', label: 'Inspiratory effort', unit: '%', min: 0, max: 200, step: 5, hint: '100% = a quiet breath (diaphragm and external intercostals)' },
    { kind: 'choice', key: 'airway', label: 'Airways', options: AIRWAYS.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'pleura', label: 'Pleural space', options: [{ value: 0, label: 'Intact' }, { value: 1, label: 'Pneumothorax' }] },
  ],
  initial: START,
  readouts: [
    { key: 'tidal', label: 'Air breathed in', unit: 'ml', primary: true },
    { key: 'intrapleural', label: 'Intrapleural pressure', unit: 'mmHg', decimals: 1 },
    { key: 'lungPressure', label: 'Lung pressure (vs atmosphere)', unit: 'mmHg', decimals: 1 },
    { key: 'lung', label: 'Lung', noDelta: true, text: (v) => (v ? 'Expanded' : 'Collapsed') },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'quiet', label: 'Quiet breath', values: START, caption: 'The chest expands, intrapleural pressure falls from −2.5 to −6 mmHg, lung pressure dips below atmospheric and about 500 ml flows in.' },
    { id: 'deep', label: 'Deep breath', values: { ...START, effort: 200 }, caption: 'A bigger effort makes intrapleural pressure more negative and draws in more air.' },
    { id: 'asthma', label: 'Bronchoconstriction', values: { ...START, airway: 1 }, caption: 'Constricted bronchioles resist flow: the same effort brings in much less air.' },
    { id: 'pneumo', label: 'Pneumothorax', values: { ...START, pleura: 1 }, caption: 'Air in the pleural space abolishes the negative pressure and the lung collapses.' },
  ],
  challenges: [
    {
      id: 'asthma',
      label: 'Ease an asthma attack',
      prompt: 'During bronchoconstriction a quiet breath moves far too little air. Get the tidal volume back to at least 480 ml without breathing harder than a quiet breath.',
      rules: ['Effort is fixed at a quiet breath and the pleura is intact. You can change only the airways.'],
      start: { effort: 100, airway: 1, pleura: 0 },
      locked: ['effort', 'pleura'],
      goals: [{ readout: 'tidal', atLeast: 480, label: 'Air breathed in at least 480 ml' }],
      debrief: 'A β2 agonist such as salbutamol relaxes bronchial smooth muscle, so a normal effort again moves a normal tidal volume (slide 5).',
    },
  ],
  modelNote:
    'Simplified teaching model of one breath. Intrapleural pressures (−2.5 → −6 mmHg), the receptor effects and the tidal volume are from the Respiratory System lecture (slides 5, 12–16, 39, 125); lung pressure and airway-resistance factors are illustrative.',
};

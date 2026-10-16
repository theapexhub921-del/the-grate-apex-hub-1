// Lesson 6 — The baroreceptor reflex.
//
// Baroreceptors in the carotid sinus and aortic arch (Regulation slide 23)
// signal through IX and X to the nucleus of the tractus solitarius and the
// vasomotor centre (slide 24). A fall in BP: less discharge → more
// sympathetic, less vagal → tachycardia, positive inotropy and
// vasoconstriction (slide 28). A rise: the reverse (slide 26).
import { solveCirculation, REST_TPR, type Circulation } from '@/data/simulations/circulation';
import type { SimDefinition, SimState } from '@/data/simulations/types';

export type BaroState = SimState & Circulation & { reflexIntact: boolean };

function model(values: Record<string, number>): BaroState {
  const reflexIntact = values.reflex === 1;
  const c = solveCirculation({ volume: values.volume / 100, tone: values.tone, reflex: reflexIntact ? 1 : 0 });
  const notes: string[] = [];
  if (!reflexIntact) notes.push('The baroreceptor nerves are cut: the receptors still fire, but the medulla gets no signal, so nothing corrects the pressure.');
  return {
    readouts: {
      map: c.map,
      hr: c.hr,
      co: c.co,
      tpr: (c.tpr / REST_TPR) * 100,
      baro: c.baroFiring,
      sympathetic: c.sympathetic,
      vagal: c.vagal,
      openLoop: c.openLoopMap,
    },
    notes,
    ...c,
    reflexIntact,
  };
}

const REST = { volume: 0, tone: 1, reflex: 1 };

export const baroreflex: SimDefinition<BaroState> = {
  id: 'baroreflex',
  name: 'Baroreceptor reflex',
  animated: true,
  controls: [
    { kind: 'slider', key: 'volume', label: 'Blood volume', unit: '%', min: -30, max: 20, step: 1, hint: 'Bleed (−) or transfuse (+)', format: (v) => `${v > 0 ? '+' : ''}${v}%` },
    { kind: 'slider', key: 'tone', label: 'Arteriole tone (drugs)', min: 0.6, max: 1.6, step: 0.05, hint: 'Below 1: vasodilator · above 1: vasoconstrictor', format: (v) => `×${v.toFixed(2)}` },
    {
      kind: 'choice',
      key: 'reflex',
      label: 'Baroreceptor nerves',
      options: [
        { value: 1, label: 'Intact' },
        { value: 0, label: 'Cut' },
      ],
    },
  ],
  initial: REST,
  readouts: [
    { key: 'map', label: 'Mean BP', unit: 'mmHg', primary: true },
    { key: 'hr', label: 'Heart rate', unit: '/min' },
    { key: 'co', label: 'Cardiac output', unit: 'L/min', decimals: 1 },
    { key: 'tpr', label: 'Resistance vs rest', unit: '%' },
    { key: 'baro', label: 'Receptor firing vs rest', unit: '%' },
    { key: 'sympathetic', label: 'Sympathetic', unit: '%', hidden: true },
    { key: 'vagal', label: 'Vagal', unit: '%', hidden: true },
    { key: 'openLoop', label: 'BP without the reflex', unit: 'mmHg', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'rest', label: 'Rest', values: REST, caption: 'BP = cardiac output × total peripheral resistance (slide 4). Tonic vagal discharge keeps the resting rate down (slide 21).' },
    { id: 'bleed', label: 'Lose 20% of blood', values: { volume: -20, tone: 1, reflex: 1 }, caption: 'Less stretch, less firing: the pressor area is released, giving tachycardia and vasoconstriction (slide 28).' },
    { id: 'transfuse', label: 'Transfusion', values: { volume: 15, tone: 1, reflex: 1 }, caption: 'More stretch, more firing: vagal slowing and less sympathetic discharge bring BP back down (slide 26).' },
    { id: 'dilator', label: 'Vasodilator drug', values: { volume: 0, tone: 0.7, reflex: 1 }, caption: 'Resistance falls, BP falls, and the reflex answers with tachycardia.' },
    { id: 'constrictor', label: 'Vasoconstrictor drug', values: { volume: 0, tone: 1.4, reflex: 1 }, caption: 'BP rises and the reflex answers with bradycardia.' },
    { id: 'cut', label: 'Nerves cut + bleed', values: { volume: -20, tone: 1, reflex: 0 }, caption: 'With no reflex, the same bleed drops BP much further and the heart rate does not rise.' },
  ],
  challenges: [
    {
      id: 'buffer',
      label: 'Beat the buffer',
      prompt: 'Using the vasoconstrictor alone, raise mean BP to at least 100 mmHg with the reflex intact. Watch the heart rate as you go.',
      rules: ['Only arteriole tone is unlocked.'],
      start: REST,
      locked: ['volume', 'reflex'],
      goals: [{ readout: 'map', atLeast: 100, label: 'Mean BP at least 100 mmHg' }],
      debrief:
        'The reflex fights you: as BP rises the baroreceptors fire more, the vagus slows the heart and sympathetic discharge falls (slide 26). That is why it takes a large change in tone to move BP a little — and why the heart rate falls as BP rises.',
    },
  ],
  modelNote:
    'Simplified closed-loop model: BP = cardiac output × total peripheral resistance (Regulation slide 4), with one sympathetic “drive” standing for the whole reflex arc (slides 23–28). Numbers are illustrative.',
};

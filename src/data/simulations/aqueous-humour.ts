// Special Senses Lesson 1 — Aqueous humour and glaucoma.
//
// Lecture (Visual System, slides 11–14): aqueous humour is secreted by the ciliary epithelium into
// the posterior chamber, flows through the pupil into the anterior chamber and drains through the
// trabecular meshwork into the canal of Schlemm at the filtration angle. The balance of production
// and drainage sets intraocular pressure; when production exceeds drainage the pressure rises and
// damages the retina and optic nerve — glaucoma.
// Textbook values (labelled): normal intraocular pressure ≈ 10–21 mmHg (≈ 15); episcleral venous
// pressure ≈ 8 mmHg; an angle that closes blocks most drainage.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const NERVE = ['Healthy', 'At risk', 'Being damaged'];

export type AqueousState = SimState & { iop: number; nerve: number; closed: boolean };

function model(values: Record<string, number>): AqueousState {
  const { production, drainage, angle } = values;
  const closed = angle === 1;
  const outflow = (drainage / 100) * (closed ? 0.25 : 1);
  const iop = clamp(8 + (7 * (production / 100)) / Math.max(outflow, 0.05), 5, 70);
  const nerve = iop > 30 ? 2 : iop > 21 ? 1 : 0;
  const notes: string[] = [];
  if (closed) notes.push('The iris has closed the filtration angle: aqueous cannot reach the trabecular meshwork, and pressure climbs fast.');
  if (nerve === 2) notes.push('Sustained high pressure damages the retina and optic nerve: glaucoma, which can cause blindness.');
  if (production < 100 && iop <= 21) notes.push('Making less aqueous lowers the pressure even when drainage is poor.');
  return { readouts: { iop, nerve, flow: (2.5 * production) / 100 }, notes, iop, nerve, closed };
}

const START = { production: 100, drainage: 100, angle: 0 };

export const aqueousHumour: SimDefinition<AqueousState> = {
  id: 'aqueous-humour',
  name: 'Aqueous humour and eye pressure',
  controls: [
    { kind: 'slider', key: 'production', label: 'Aqueous made by the ciliary epithelium', unit: '%', min: 50, max: 200, step: 10 },
    { kind: 'slider', key: 'drainage', label: 'Drainage through the trabecular meshwork', unit: '%', min: 20, max: 150, step: 10 },
    { kind: 'choice', key: 'angle', label: 'Filtration angle', options: [{ value: 0, label: 'Open' }, { value: 1, label: 'Closed' }] },
  ],
  initial: START,
  readouts: [
    { key: 'iop', label: 'Intraocular pressure', unit: 'mmHg', primary: true },
    { key: 'flow', label: 'Aqueous made', unit: 'µL/min', decimals: 1 },
    { key: 'nerve', label: 'Optic nerve', noDelta: true, text: (v) => NERVE[v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: START, caption: 'Production and drainage balance at about 15 mmHg.' },
    { id: 'open', label: 'Open-angle glaucoma', values: { ...START, drainage: 40 }, caption: 'The meshwork drains poorly: pressure rises slowly.' },
    { id: 'closed', label: 'Angle closure', values: { ...START, angle: 1 }, caption: 'Drainage is blocked: a sudden, very high pressure.' },
  ],
  challenges: [
    {
      id: 'treat',
      label: 'Treat glaucoma',
      prompt: 'The trabecular meshwork drains only 40% of normal. Bring the pressure down to 21 mmHg or less.',
      rules: ['Drainage and the angle are fixed.'],
      start: { production: 100, drainage: 40, angle: 0 },
      locked: ['drainage', 'angle'],
      goals: [{ readout: 'iop', atMost: 21, label: 'Pressure ≤ 21 mmHg' }],
      debrief: 'Pressure is set by the balance of production and drainage: if drainage cannot be improved, making less aqueous restores the balance.',
    },
  ],
  modelNote:
    'Simplified teaching model. The production, flow and drainage of aqueous humour and glaucoma are from the lecture (Visual System, slides 11–14). The normal pressure, the venous pressure it drains against and the aqueous flow (≈ 2.5 µL/min) are textbook values.',
};

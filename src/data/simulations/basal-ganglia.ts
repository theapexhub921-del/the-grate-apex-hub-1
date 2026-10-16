// CNS Lesson 8 — The basal ganglia as a brake.
//
// Lecture (Basal Ganglia, slides 6–10): overall the basal ganglia are
// inhibitory — a brake. Dopamine (substantia nigra → caudate and putamen)
// is inhibitory; losing it (Parkinson’s) leaves the caudate and putamen
// overactive — rigidity, tremor, bradykinesia, difficulty starting
// movement (hypokinetic). Losing striatal GABA and cholinergic neurons
// (Huntington’s) gives chorea; damage to the subthalamic nucleus gives
// hemiballismus (hyperkinetic). The "brake" is one lumped number in this
// model; the arithmetic is illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export type BasalState = SimState & {
  dopamine: number;
  striatum: number; // % of striatal neurons left
  stn: number; // % subthalamic nucleus function
  striatalActivity: number; // % of normal
  brake: number; // % of normal
  speed: number;
  rigidity: number;
  involuntary: number;
  kind: number; // 0 none, 1 chorea, 2 hemiballismus
};

function model(values: Record<string, number>): BasalState {
  const { dopamine, striatum, stn } = values;
  // Dopamine inhibits the striatum, so less dopamine → more striatal activity.
  const striatalActivity = (striatum / 100) * (1 + (1.2 * (100 - dopamine)) / 100) * 100;
  const brake = 0.5 * striatalActivity + 0.5 * stn;
  const speed = 100 * clamp(2 - brake / 100, 0.2, 1.4);
  const rigidity = clamp((striatalActivity - 110) / 0.9, 0, 100);
  const involuntary = clamp((90 - brake) * 2.5, 0, 100);
  const kind = involuntary <= 0 ? 0 : stn < 60 ? 2 : 1;
  const notes: string[] = [];
  if (rigidity > 0) notes.push('Without dopamine’s inhibition the caudate and putamen are overactive: rigidity and tremor, and activity once started is hard to stop.');
  if (speed < 80) notes.push('Too much brake: movements are slow (bradykinesia) and hard to start — hypokinetic.');
  if (kind === 1) notes.push('Too little brake from the striatum: unwanted, dance-like movements — chorea.');
  if (kind === 2) notes.push('The subthalamic nucleus is damaged: violent flailing of one arm and leg — hemiballismus.');
  return {
    readouts: { speed, rigidity, involuntary, brake, kind },
    notes,
    dopamine,
    striatum,
    stn,
    striatalActivity,
    brake,
    speed,
    rigidity,
    involuntary,
    kind,
  };
}

const NORMAL = { dopamine: 100, striatum: 100, stn: 100 };

export const basalGanglia: SimDefinition<BasalState> = {
  id: 'basal-ganglia',
  name: 'The brake on movement',
  animated: true,
  controls: [
    { kind: 'slider', key: 'dopamine', label: 'Dopamine from the substantia nigra', unit: '%', min: 0, max: 100, step: 1 },
    { kind: 'slider', key: 'striatum', label: 'Striatal neurons (GABA and ACh)', unit: '%', min: 0, max: 100, step: 1 },
    { kind: 'slider', key: 'stn', label: 'Subthalamic nucleus', unit: '%', min: 0, max: 100, step: 1 },
  ],
  initial: NORMAL,
  readouts: [
    { key: 'speed', label: 'Speed of movement', unit: '%', primary: true },
    { key: 'rigidity', label: 'Rigidity', unit: '%' },
    { key: 'involuntary', label: 'Unwanted movements', unit: '%' },
    { key: 'brake', label: 'Brake', unit: '% of normal' },
    { key: 'kind', label: 'Unwanted movement type', noDelta: true, text: (v) => ['None', 'Chorea', 'Hemiballismus'][v] ?? '' },
  ],
  model,
  scenarios: [
    { id: 'normal', label: 'Normal', values: NORMAL, caption: 'The brake is held on postural reflexes and released for the voluntary movement.' },
    { id: 'pd', label: 'Parkinson’s', values: { ...NORMAL, dopamine: 20 }, caption: 'Nigrostriatal dopamine loss: tremor, rigidity, bradykinesia — hypokinetic.' },
    { id: 'hd', label: 'Huntington’s', values: { ...NORMAL, striatum: 30 }, caption: 'Loss of striatal GABA and cholinergic neurons: chorea — hyperkinetic.' },
    { id: 'hb', label: 'Hemiballismus', values: { ...NORMAL, stn: 10 }, caption: 'Stroke in the subthalamic nucleus: violent flailing of one arm and leg.' },
  ],
  challenges: [
    {
      id: 'chorea',
      label: 'Which disease?',
      prompt: 'Produce chorea — clear unwanted movements (40% or more) — with no rigidity at all, leaving the subthalamic nucleus intact.',
      rules: ['The subthalamic nucleus is fixed at 100%.'],
      start: NORMAL,
      locked: ['stn'],
      goals: [
        { readout: 'involuntary', atLeast: 40, label: 'Unwanted movements at least 40%' },
        { readout: 'rigidity', atMost: 0, label: 'No rigidity' },
      ],
      debrief: 'Losing striatal neurons (Huntington’s disease) takes brake away and gives chorea. Losing dopamine does the opposite — more striatal activity, more brake, rigidity and slowness.',
    },
  ],
  modelNote:
    'Simplified teaching model that lumps the basal ganglia into one “brake”, as the lecture does (Basal Ganglia, slide 7). The direction of each effect follows slides 6–10 (dopamine inhibitory to the striatum); the arithmetic and percentages are illustrative, and the real circuits are more complex.',
};

// CNS Lesson 9 — Lesion explorer: what each part of the brain does.
//
// Lecture (The Brain): frontal (slides 7–8) — movement, sequencing,
// personality, Broca’s aphasia; temporal (9–10) — Wernicke’s aphasia,
// face recognition, short-term memory; parietal (11–12) — left: reading,
// writing, naming, maths; right: attention and space; occipital (13–14) —
// primary visual area (blindness) versus association area (sees but
// cannot recognise); brainstem (18–19) — consciousness, vital reflexes;
// corpus callosum (24); hippocampus (28) — new memories. In a right-handed,
// left-dominant person (slide 23).
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const REGIONS = [
  'None',
  'Left posterior frontal (Broca)',
  'Prefrontal cortex',
  'Left temporal (Wernicke)',
  'Left parietal',
  'Right parietal',
  'Primary visual cortex',
  'Visual association area',
  'Both hippocampi',
  'Corpus callosum cut',
  'Brainstem (pons)',
];

// The functions checked, in display order.
export const FUNCTIONS = [
  { key: 'speak', label: 'Producing speech' },
  { key: 'understand', label: 'Understanding speech' },
  { key: 'readWrite', label: 'Reading, writing' },
  { key: 'space', label: 'Attention to space' },
  { key: 'see', label: 'Seeing' },
  { key: 'recognise', label: 'Recognising sights' },
  { key: 'plan', label: 'Planning, personality' },
  { key: 'memory', label: 'New memories' },
  { key: 'alert', label: 'Consciousness' },
  { key: 'link', label: 'Hemispheres linked' },
  { key: 'rightMove', label: 'Moving the right side' },
] as const;

type FunctionKey = (typeof FUNCTIONS)[number]['key'];

const LOST: FunctionKey[][] = [
  [],
  ['speak', 'rightMove'],
  ['plan'],
  ['understand'],
  ['readWrite'],
  ['space'],
  ['see', 'recognise'],
  ['recognise'],
  ['memory'],
  ['link'],
  ['alert'],
];

export type BrainState = SimState & {
  region: number;
  lost: FunctionKey[];
};

function model(values: Record<string, number>): BrainState {
  const region = values.region;
  const lost = LOST[region] ?? [];
  const readouts: Record<string, number> = { affected: lost.length };
  for (const f of FUNCTIONS) readouts[f.key] = lost.includes(f.key) ? 0 : 1;
  const notes: string[] = [];
  if (region === 1) notes.push('Broca’s aphasia: the patient knows what to say but cannot produce it; next to the motor cortex, so the right side is often weak too.');
  if (region === 3) notes.push('Wernicke’s aphasia: speech flows, but spoken words are not understood.');
  if (region === 6) notes.push('Blind, even though the eyes and optic nerves are perfectly intact.');
  if (region === 7) notes.push('Can see, but cannot recognise what is seen.');
  if (region === 9) notes.push('Each hemisphere still perceives, but the two cannot share what they see.');
  return { readouts, notes, region, lost };
}

const okText = (v: number) => (v ? 'Normal' : 'Affected');

export const brainLesion: SimDefinition<BrainState> = {
  id: 'brain-lesion',
  name: 'Lesion explorer',
  controls: [{ kind: 'choice', key: 'region', label: 'Damaged area', options: REGIONS.map((label, value) => ({ value, label })) }],
  initial: { region: 0 },
  readouts: [
    { key: 'affected', label: 'Functions affected', primary: true, decimals: 0 },
    ...FUNCTIONS.map((f) => ({ key: f.key, label: f.label, noDelta: true, hidden: true, text: okText })),
  ],
  model,
  scenarios: [
    { id: 'broca', label: 'Broca', values: { region: 1 }, caption: 'Left posterior frontal: inability to express language (The Brain, slide 8).' },
    { id: 'wernicke', label: 'Wernicke', values: { region: 3 }, caption: 'Left temporal: difficulty understanding spoken words (slide 10).' },
    { id: 'assoc', label: 'Visual association', values: { region: 7 }, caption: 'Sees, but cannot recognise what is seen (slides 13–14).' },
    { id: 'split', label: 'Split brain', values: { region: 9 }, caption: 'Corpus callosum cut: perception without communication between the hemispheres (slide 24).' },
  ],
  challenges: [
    {
      id: 'diagnose',
      label: 'Find the lesion',
      prompt: 'A right-handed man speaks fluently, but what he says makes little sense and he cannot follow what you say to him. His sight and movement are normal. Where is the damage?',
      rules: ['Pick one area.'],
      start: { region: 0 },
      goals: [
        { readout: 'understand', atMost: 0, label: 'Cannot understand speech' },
        { readout: 'speak', atLeast: 1, label: 'Produces speech' },
        { readout: 'see', atLeast: 1, label: 'Sees normally' },
      ],
      debrief: 'Fluent speech without comprehension is Wernicke’s aphasia, from the left temporal lobe. In Broca’s aphasia it is the other way round — he would understand but struggle to speak.',
    },
    {
      id: 'agnosia',
      label: 'Sees but cannot name it',
      prompt: 'A woman can walk round obstacles and describe colours and edges, but cannot tell what a cup is by looking at it. Where is the damage?',
      rules: ['Pick one area.'],
      start: { region: 0 },
      goals: [
        { readout: 'recognise', atMost: 0, label: 'Cannot recognise objects' },
        { readout: 'see', atLeast: 1, label: 'Can see' },
      ],
      debrief: 'Destroying only the visual association area leaves sight but removes the power to recognise what is seen. Destroying the primary visual cortex would make her blind.',
    },
  ],
  modelNote:
    'Simplified teaching model: each area is reduced to its main functions in a right-handed, left-dominant person, as described in The Brain, slides 7–28. Real lesions rarely respect these boundaries.',
};

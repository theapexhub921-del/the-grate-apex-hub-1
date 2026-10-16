// CNS Lesson 3 — Where the pathways cross decides the side of the loss.
//
// Lecture: the dorsal columns (fine touch, proprioception, vibration)
// ascend on the same side and cross in the medulla (Sensory II, p. 7); the
// spinothalamic tracts (pain, temperature, crude touch) cross in the
// spinal cord (p. 9); both pass through the thalamus. The corticospinal
// tract crosses at the pyramids (Motor Activity, slide 10). Hemisection
// gives the Brown-Séquard pattern (Motor Activity, slide 14).
import type { SimDefinition, SimState } from '@/data/simulations/types';

export const LESIONS = [
  'None',
  'Right half of cord (T10)',
  'Right dorsal column (T10)',
  'Right lateral spinothalamic (T10)',
  'Whole cord (T10)',
  'Right thalamus',
];

// Which structures each lesion cuts. "R"/"L" = side of the CNS.
type Cut = { dcR?: boolean; dcL?: boolean; stR?: boolean; stL?: boolean; csR?: boolean; csL?: boolean; thalR?: boolean; thalL?: boolean };
const CUTS: Cut[] = [
  {},
  { dcR: true, stR: true, csR: true },
  { dcR: true },
  { stR: true },
  { dcR: true, dcL: true, stR: true, stL: true, csR: true, csL: true },
  { thalR: true },
];

export type TractState = SimState & {
  lesion: number;
  cut: Cut;
  // 1 = intact, 0 = lost, for each leg.
  touchL: number;
  touchR: number;
  painL: number;
  painR: number;
  moveL: number;
  moveR: number;
};

function model(values: Record<string, number>): TractState {
  const lesion = values.lesion;
  const cut = CUTS[lesion] ?? {};
  // Below T10, a leg's dorsal-column fibres are on its own side of the
  // cord; its spinothalamic fibres have already crossed to the other side.
  // Above the medulla both reach the thalamus on the opposite side.
  const touchR = cut.dcR || cut.thalL ? 0 : 1;
  const touchL = cut.dcL || cut.thalR ? 0 : 1;
  const painR = cut.stL || cut.thalL ? 0 : 1;
  const painL = cut.stR || cut.thalR ? 0 : 1;
  // Below the pyramids, the lateral corticospinal fibres run on the side of the leg they move.
  const moveR = cut.csR ? 0 : 1;
  const moveL = cut.csL ? 0 : 1;
  const lost = 6 - (touchL + touchR + painL + painR + moveL + moveR);
  const notes: string[] = [];
  if (lesion === 1) notes.push('Brown-Séquard: same side — weakness and loss of vibration, position and fine touch; opposite side — loss of pain and temperature.');
  if (lesion === 5) notes.push('Above the medulla both pathways have crossed, so a lesion here loses every sensation on the opposite side.');
  return {
    readouts: { lost, touchL, touchR, painL, painR, moveL, moveR, touchBoth: touchL + touchR, moveBoth: moveL + moveR },
    notes,
    lesion,
    cut,
    touchL,
    touchR,
    painL,
    painR,
    moveL,
    moveR,
  };
}

const intactText = (v: number) => (v ? 'Normal' : 'Lost');

export const sensoryTracts: SimDefinition<TractState> = {
  id: 'sensory-tracts',
  name: 'Ascending pathways',
  controls: [{ kind: 'choice', key: 'lesion', label: 'Lesion', options: LESIONS.map((label, value) => ({ value, label })) }],
  initial: { lesion: 0 },
  readouts: [
    { key: 'touchL', label: 'Left leg: vibration, position', noDelta: true, text: intactText },
    { key: 'touchR', label: 'Right leg: vibration, position', noDelta: true, text: intactText },
    { key: 'painL', label: 'Left leg: pain, temperature', noDelta: true, text: intactText },
    { key: 'painR', label: 'Right leg: pain, temperature', noDelta: true, text: intactText },
    { key: 'moveL', label: 'Left leg: movement', noDelta: true, text: intactText },
    { key: 'moveR', label: 'Right leg: movement', noDelta: true, text: intactText },
    { key: 'lost', label: 'Functions lost', hidden: true },
    { key: 'touchBoth', label: 'Legs with vibration and position', hidden: true },
    { key: 'moveBoth', label: 'Legs that move', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'none', label: 'Normal', values: { lesion: 0 }, caption: 'Dorsal columns ascend on the same side and cross in the medulla; spinothalamic fibres cross in the cord.' },
    { id: 'bs', label: 'Brown-Séquard', values: { lesion: 1 }, caption: 'Hemisection: position and vibration and movement lost on the same side, pain and temperature on the opposite side.' },
    { id: 'thal', label: 'Thalamus', values: { lesion: 5 }, caption: 'Above the medulla, everything from the left side of the body is on the right.' },
  ],
  challenges: [
    {
      id: 'pain-only',
      label: 'Find the lesion',
      prompt: 'A patient cannot feel a pinprick or hot water on the left leg. Everything else — both legs’ movement, vibration and position sense, and the right leg’s pain — is normal. Choose the lesion.',
      rules: ['Pick one lesion.'],
      start: { lesion: 0 },
      goals: [
        { readout: 'painL', atMost: 0, label: 'Left leg: pain lost' },
        { readout: 'painR', atLeast: 1, label: 'Right leg: pain normal' },
        { readout: 'touchBoth', atLeast: 2, label: 'Both legs: vibration and position normal' },
        { readout: 'moveBoth', atLeast: 2, label: 'Both legs move normally' },
      ],
      debrief:
        'The left leg’s pain fibres cross in the cord and ascend in the right lateral spinothalamic tract — so a small lesion of that tract alone gives pain loss on the opposite side and nothing else.',
    },
    {
      id: 'brown-sequard',
      label: 'Brown-Séquard',
      prompt: 'The right leg is weak and cannot feel a tuning fork; the left leg cannot feel pain. Choose the lesion.',
      rules: ['Pick one lesion.'],
      start: { lesion: 0 },
      goals: [
        { readout: 'moveR', atMost: 0, label: 'Right leg weak' },
        { readout: 'touchR', atMost: 0, label: 'Right leg: vibration lost' },
        { readout: 'painL', atMost: 0, label: 'Left leg: pain lost' },
        { readout: 'moveL', atLeast: 1, label: 'Left leg moves' },
      ],
      debrief: 'A right hemisection: motor and dorsal column fibres for the right leg run on the right below the medulla; the left leg’s pain fibres crossed into the right cord just above where they entered.',
    },
  ],
  modelNote:
    'Simplified teaching model of three pathways for the legs below a T10 lesion. Where each pathway crosses is from Sensory II, pp. 7–9 and Motor Activity, slides 10–14. Crude touch (ventral spinothalamic) and the medial corticospinal tract are left out.',
};

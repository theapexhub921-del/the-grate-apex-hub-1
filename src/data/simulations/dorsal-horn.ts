// CNS Lesson 5 — The laminae of the dorsal horn.
//
// Lecture (Spinal Cord, slides 12–13): laminae I–II (II = substantia
// gelatinosa) receive C and Aδ nociceptor input and hold
// nociceptive-specific (NS) and wide-dynamic-range (WDR) cells; laminae
// III–VI receive Aβ input and hold low-threshold (LT) cells; some lamina V
// cells are WDR, receiving both. Lamina I’s large cells send axons into
// the spinothalamic tract. Descending fibres modulate transmission.
// Firing rates are illustrative.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const NOXIOUS_THRESHOLD = 10; // % — nociceptors are high-threshold

export type HornState = SimState & {
  touch: number;
  noxious: number;
  descending: number;
  lt: number;
  ns: number;
  wdr: number;
  output: number;
};

function model(values: Record<string, number>): HornState {
  const { touch, noxious, descending } = values;
  const lt = 0.8 * touch;
  const ns = noxious > NOXIOUS_THRESHOLD ? 1.1 * (noxious - NOXIOUS_THRESHOLD) : 0;
  const wdr = clamp(0.6 * touch + 1.2 * noxious, 0, 150);
  // The signal sent up the spinothalamic tract (lamina I and WDR cells),
  // turned down by descending fibres.
  const output = (ns + 0.3 * wdr) * (1 - (0.6 * descending) / 100);
  const notes: string[] = [];
  if (touch > 0 && noxious === 0) notes.push('Touch alone: low-threshold cells (laminae III–VI) and WDR cells fire; nociceptive-specific cells stay silent.');
  if (noxious > 0 && noxious <= NOXIOUS_THRESHOLD) notes.push('Nociceptors are high-threshold: this stimulus is too weak to fire the NS cells.');
  return {
    readouts: { output, lt, ns, wdr },
    notes,
    touch,
    noxious,
    descending,
    lt,
    ns,
    wdr,
    output,
  };
}

const START = { touch: 0, noxious: 0, descending: 0 };

export const dorsalHorn: SimDefinition<HornState> = {
  id: 'dorsal-horn',
  name: 'Inside the dorsal horn',
  controls: [
    { kind: 'slider', key: 'touch', label: 'Light touch (Aβ fibres)', unit: '%', min: 0, max: 100, step: 1 },
    { kind: 'slider', key: 'noxious', label: 'Pinprick or heat (C and Aδ fibres)', unit: '%', min: 0, max: 100, step: 1 },
    { kind: 'slider', key: 'descending', label: 'Descending inhibition', unit: '%', min: 0, max: 100, step: 1, hint: 'Fibres from the brainstem' },
  ],
  initial: START,
  readouts: [
    { key: 'output', label: 'Pain signal up the spinothalamic tract', unit: '/s', primary: true },
    { key: 'lt', label: 'LT cell (laminae III–VI)', unit: '/s' },
    { key: 'ns', label: 'NS cell (laminae I–II)', unit: '/s' },
    { key: 'wdr', label: 'WDR cell (lamina V)', unit: '/s' },
  ],
  model,
  scenarios: [
    { id: 'touch', label: 'Light touch', values: { ...START, touch: 60 }, caption: 'Aβ input reaches laminae III–VI. LT and WDR cells fire; NS cells stay silent.' },
    { id: 'prick', label: 'Pinprick', values: { ...START, noxious: 60 }, caption: 'C and Aδ input reaches laminae I–II. NS cells fire, and WDR cells fire hard.' },
    { id: 'both', label: 'Touch and pinprick', values: { ...START, touch: 60, noxious: 60 }, caption: 'WDR cells add up both inputs: their dendrites reach up into laminae I–II.' },
    { id: 'desc', label: 'Descending inhibition', values: { ...START, noxious: 60, descending: 80 }, caption: 'The dorsal horn is not just a relay: descending fibres turn down what is sent to the brain.' },
  ],
  challenges: [
    {
      id: 'wdr-only',
      label: 'A WDR cell, not an NS cell',
      prompt: 'Make the WDR cell fire 50–70 impulses a second while the nociceptive-specific cell stays completely silent.',
      rules: ['Descending inhibition is fixed at 0.'],
      start: { touch: 0, noxious: 50, descending: 0 },
      locked: ['descending'],
      goals: [
        { readout: 'wdr', atLeast: 50, atMost: 70, label: 'WDR 50–70 /s' },
        { readout: 'ns', atMost: 0, label: 'NS cell silent' },
      ],
      debrief: 'WDR cells respond to innocuous as well as noxious input, so strong touch alone can drive them. NS cells have a high threshold and need a noxious stimulus.',
    },
  ],
  modelNote:
    'Simplified teaching model of three dorsal horn cell types. Their laminae, inputs and responses are from Spinal Cord, slides 12–13; the firing rates, the nociceptor threshold and the size of descending inhibition are illustrative.',
};

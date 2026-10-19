// Special Senses Lesson 6 — Sound and the middle ear.
//
// Lecture (Auditory, slides 1–34): the ear hears 20–20,000 Hz and is most sensitive at
// 500–4000 Hz. Sounds above 85 dB can damage hearing; 140 dB causes immediate damage and pain.
// The ossicles match the impedance of air to inner-ear fluid (area ratio, ossicular lever, eardrum
// buckling); too much wax blocks sound. The basilar membrane is narrow and stiff at the base, wide
// and flexible at the apex. The stapedius and tensor tympani reflex protects against loud sound.
// Textbook values (labelled): the hearing threshold at each frequency; losses of 20–35 dB from
// wax, fluid, a perforated eardrum or fixed ossicles; the place of each frequency along the 35 mm
// basilar membrane (Greenwood).
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const FREQS = [125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const THRESHOLD = [45, 25, 12, 5, 2, 0, 15, 40];
export const EARS = ['Normal', 'Wax blocking the canal', 'Fluid in the middle ear', 'Perforated eardrum', 'Ossicles fixed'];
const LOSS = [0, 30, 25, 20, 35];

export type SoundState = SimState & { atCochlea: number; place: number; audible: boolean; vibration: number; danger: number };

function model(values: Record<string, number>): SoundState {
  const { level, freq, ear } = values;
  const f = FREQS[freq] ?? 1000;
  const reflex = level >= 80 && f <= 2000 ? 12 : 0; // the stapedius and tensor tympani damp loud, low sounds
  const atCochlea = Math.max(0, level - LOSS[ear] - reflex);
  const sensation = atCochlea - THRESHOLD[freq];
  const audible = sensation > 0;
  const place = clamp(35 - (35 / 2.1) * Math.log10(f / 165.4 + 0.88), 0, 35); // mm from the base
  const danger = atCochlea >= 140 ? 2 : atCochlea >= 85 ? 1 : 0;
  const notes: string[] = [];
  if (ear === 4) notes.push('Fixed ossicles cannot match the impedance of air to the cochlear fluid: most of the sound is reflected.');
  if (reflex) notes.push('The tympanic reflex (stapedius and tensor tympani) stiffens the ossicles against this loud, low sound.');
  if (danger === 1) notes.push('Above 85 dB: long exposure damages the hair cells.');
  if (danger === 2) notes.push('140 dB: immediate damage and pain.');
  return {
    readouts: { atCochlea, sensation: Math.max(0, sensation), audible: audible ? 1 : 0, place, danger },
    notes,
    atCochlea,
    place,
    audible,
    vibration: clamp(atCochlea / 120, 0, 1),
    danger,
  };
}

const START = { level: 60, freq: 3, ear: 0 };
const DANGER = ['Safe', 'Can damage hearing', 'Immediate damage'];

export const soundTransmission: SimDefinition<SoundState> = {
  id: 'sound-transmission',
  name: 'Sound through the ear',
  controls: [
    { kind: 'slider', key: 'level', label: 'Sound level', unit: 'dB', min: 0, max: 140, step: 10 },
    { kind: 'choice', key: 'freq', label: 'Frequency', options: FREQS.map((f, value) => ({ value, label: f >= 1000 ? `${f / 1000} kHz` : `${f} Hz` })) },
    { kind: 'choice', key: 'ear', label: 'Outer and middle ear', options: EARS.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'atCochlea', label: 'Reaching the cochlea', unit: 'dB', primary: true },
    { key: 'sensation', label: 'Above threshold', unit: 'dB' },
    { key: 'audible', label: 'Heard', noDelta: true, text: (v) => (v ? 'Yes' : 'No') },
    { key: 'place', label: 'Peak on the basilar membrane', unit: 'mm from base', decimals: 1, primary: true },
    { key: 'danger', label: 'Risk', noDelta: true, text: (v) => DANGER[v] ?? '' },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'talk', label: 'Conversation', values: START, caption: '60 dB at 1 kHz: comfortably heard.' },
    { id: 'whisper', label: 'Whisper, 4 kHz', values: { level: 20, freq: 5, ear: 0 }, caption: 'Quiet, but in the most sensitive range.' },
    { id: 'concert', label: 'Rock concert', values: { level: 120, freq: 4, ear: 0 }, caption: 'Loud enough to damage the hair cells.' },
    { id: 'wax', label: 'Ear wax', values: { level: 40, freq: 3, ear: 1 }, caption: 'Sound is blocked before the eardrum.' },
  ],
  challenges: [
    {
      id: 'protect',
      label: 'Protect the hair cells',
      prompt: 'At a 110 dB, 4 kHz concert, keep what reaches the cochlea under 85 dB while still hearing it.',
      rules: ['The music is fixed.'],
      start: { level: 110, freq: 5, ear: 0 },
      locked: ['level', 'freq'],
      goals: [
        { readout: 'atCochlea', atMost: 84, label: 'Under 85 dB at the cochlea' },
        { readout: 'audible', atLeast: 1, label: 'Still heard' },
      ],
      debrief: 'Anything that blocks the canal or stiffens the middle ear cuts what reaches the cochlea — the principle of earplugs. The tympanic reflex helps too, but mainly for low frequencies.',
    },
  ],
  modelNote:
    'Simplified teaching model. The hearing range and most sensitive band, safe and damaging levels, the middle ear’s impedance matching, the basilar membrane and the tympanic reflex are from the lecture (Auditory, slides 1–34). Thresholds, the size of each conductive loss and the frequency map are textbook values.',
};

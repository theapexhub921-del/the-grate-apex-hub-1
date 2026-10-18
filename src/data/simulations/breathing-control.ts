// Respiratory Lesson 8 — Chemical control of breathing.
//
// Lecture (slides 99–106, 127): a rise in CO₂, a fall in pH and a fall in
// O₂ increase breathing. Central chemoreceptors (medulla) follow CSF H⁺,
// i.e. arterial CO₂; peripheral ones (carotid, aortic bodies) respond to
// dissolved O₂ (PO₂) and H⁺ — not to anaemia or CO poisoning. Low inspired
// O₂ raises breathing only a little until PO₂ is very low, and low O₂
// makes the system more sensitive to CO₂. Very high CO₂ depresses the CNS
// (CO₂ narcosis). Metabolic acidosis stimulates breathing; alkalosis
// depresses it. In hypoxia with hypercapnia, 100% O₂ removes the drive and
// depresses breathing. Resting ventilation 6 L/min (500 ml × 12, slides
// 20, 39). The response slopes are illustrative; the "blunted CO₂
// response" setting is a textbook explanation of the 100% O₂ warning.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const METABOLIC = ['Normal', 'Metabolic acidosis', 'Metabolic alkalosis'];
export const CARRIAGE = ['Normal haemoglobin', 'Anaemia', 'CO poisoning'];
export const RESPONSE = ['Normal CO₂ response', 'Blunted (long-standing CO₂ retention)'];

export type ControlState = SimState & {
  central: number;
  peripheral: number;
  ventilation: number;
  narcosis: boolean;
};

export function peripheralDrive(pao2: number) {
  if (pao2 >= 100) return 0;
  if (pao2 >= 60) return (0.15 * (100 - pao2)) / 40;
  return 0.15 + 0.05 * (60 - pao2);
}

function model(values: Record<string, number>): ControlState {
  const { paco2, pao2, metabolic, carriage, response } = values;
  const slope = response === 1 ? 0.018 : 0.12;
  let central = 1 + slope * (paco2 - 40);
  if (metabolic === 1) central += 0.6;
  if (metabolic === 2) central -= 0.4;
  central = Math.max(0, central);
  let peripheral = peripheralDrive(pao2) * (1 + 0.05 * Math.max(0, paco2 - 40));
  if (metabolic === 1) peripheral += 0.3;
  if (metabolic === 2) peripheral = Math.max(0, peripheral - 0.1);
  const narcosis = paco2 > 70;
  const depress = narcosis ? Math.max(0.2, 1 - (paco2 - 70) / 12) : 1;
  const ventilation = clamp(6 * (central + peripheral) * depress, 0, 80);
  // O₂ the blood carries, as % of normal: haemoglobin saturation × usable haemoglobin.
  const sat = 1 / (1 + Math.pow(26.6 / Math.max(1, pao2), 2.7));
  const usable = carriage === 1 ? 0.5 : carriage === 2 ? 0.6 : 1;
  const content = (sat / 0.973) * usable * 100;
  const notes: string[] = [];
  if (carriage > 0) notes.push('The peripheral chemoreceptors sense dissolved O₂ (PO₂), not how much the blood carries — so anaemia and CO poisoning do not stimulate breathing.');
  if (narcosis) notes.push('CO₂ narcosis: very high CO₂ depresses the CNS, including the respiratory centre — headache, confusion, coma.');
  if (pao2 >= 60 && pao2 < 100 && paco2 <= 45) notes.push('Above about 60 mmHg, low O₂ adds little drive: extra breathing would wash out CO₂, which inhibits breathing.');
  return {
    readouts: { ventilation, pao2, central: central * 100, peripheral: peripheral * 100, content, narcosis: narcosis ? 1 : 0 },
    notes,
    central,
    peripheral,
    ventilation,
    narcosis,
  };
}

const START = { paco2: 40, pao2: 100, metabolic: 0, carriage: 0, response: 0 };

export const breathingControl: SimDefinition<ControlState> = {
  id: 'breathing-control',
  name: 'Chemical control of breathing',
  controls: [
    { kind: 'slider', key: 'paco2', label: 'Arterial PCO₂', unit: 'mmHg', min: 25, max: 85, step: 1 },
    { kind: 'slider', key: 'pao2', label: 'Arterial PO₂', unit: 'mmHg', min: 30, max: 150, step: 1 },
    { kind: 'choice', key: 'metabolic', label: 'Acid–base', options: METABOLIC.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'carriage', label: 'O₂ carriage', options: CARRIAGE.map((label, value) => ({ value, label })) },
    { kind: 'choice', key: 'response', label: 'CO₂ response', options: RESPONSE.map((label, value) => ({ value, label })) },
  ],
  initial: START,
  readouts: [
    { key: 'ventilation', label: 'Ventilation', unit: 'L/min', decimals: 1, primary: true },
    { key: 'central', label: 'Central drive (CSF H⁺)', unit: '%' },
    { key: 'peripheral', label: 'Peripheral drive (carotid, aortic)', unit: '%' },
    { key: 'content', label: 'O₂ carried by blood', unit: '% of normal' },
    { key: 'pao2', label: 'Arterial PO₂', unit: 'mmHg', hidden: true },
    { key: 'narcosis', label: 'CNS', noDelta: true, text: (v) => (v ? 'CO₂ narcosis' : 'Normal') },
  ],
  model,
  animated: true,
  scenarios: [
    { id: 'rest', label: 'At rest', values: START, caption: 'PCO₂ 40, PO₂ 100: about 6 L/min, driven mainly by the central chemoreceptors.' },
    { id: 'co2', label: 'Rebreathing CO₂', values: { ...START, paco2: 50 }, caption: 'A rise in CO₂ raises CSF H⁺: breathing increases steeply.' },
    { id: 'acidosis', label: 'Metabolic acidosis', values: { ...START, metabolic: 1 }, caption: 'Acid stimulates breathing, washing out CO₂ in compensation.' },
    { id: 'anaemia', label: 'Anaemia', values: { ...START, carriage: 1 }, caption: 'Less O₂ is carried, but PO₂ is normal, so breathing does not change.' },
    { id: 'narcosis', label: 'CO₂ narcosis', values: { ...START, paco2: 80 }, caption: 'Extreme CO₂ depresses the respiratory centre itself.' },
  ],
  challenges: [
    {
      id: 'oxygen',
      label: 'Give oxygen safely',
      prompt: 'A patient with long-standing CO₂ retention has PCO₂ 65 and PO₂ 40 mmHg. Raise the PO₂ to at least 55 mmHg while keeping ventilation at 12 L/min or more.',
      rules: ['The PCO₂, acid–base state, O₂ carriage and CO₂ response are fixed. You control the PO₂ (the oxygen given).'],
      start: { paco2: 65, pao2: 40, metabolic: 0, carriage: 0, response: 1 },
      locked: ['paco2', 'metabolic', 'carriage', 'response'],
      goals: [
        { readout: 'pao2', atLeast: 55, label: 'PO₂ at least 55 mmHg' },
        { readout: 'ventilation', atLeast: 12, label: 'Ventilation at least 12 L/min' },
      ],
      debrief: 'Here the drive to breathe comes from the low O₂. Raise it a little and breathing continues; push it to 100% O₂ and the drive vanishes, breathing falls and CO₂ rises further. That is why the lecture says: in hypoxia with hypercapnia, give air, not 100% O₂ (slide 127).',
    },
  ],
  modelNote:
    'Simplified teaching model. Which receptors respond to what, CO₂ narcosis, the small effect of mild hypoxia and the 100% O₂ warning are from the lecture (slides 99–106, 127); resting ventilation 6 L/min follows slides 20 and 39. Response slopes are illustrative, and the blunted CO₂ response is a textbook explanation.',
};

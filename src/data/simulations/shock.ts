// Lesson 7 — Gravity and shock.
//
// Standing: pooling lowers venous return; baroreceptors drive the VMC to
// restore BP (Gravity & Shock slides 3–4). Orthostatic hypotension: the
// sympathetic response fails (slide 8). Shock (slides 12–23): four types —
// hypovolaemic (low volume), distributive (vasodilatation and pooling),
// cardiogenic (failing pump), obstructive (filling blocked) — with
// compensation by tachycardia and vasoconstriction (skin and kidney).
// JVP: low when the veins are empty; raised when blood backs up behind a
// failing or obstructed heart (backward failure, slide 31).
import { solveCirculation, REST_MAP, type Circulation } from '@/data/simulations/circulation';
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

export const SHOCK_TYPES = ['None', 'Hypovolaemic', 'Distributive', 'Cardiogenic', 'Obstructive'] as const;

export type ShockState = SimState &
  Circulation & {
    cvp: number;
    urine: number;
    skin: number; // 0 normal, 1 pale and cool, 2 vasodilated
    breathing: number;
    standing: boolean;
    type: number;
  };

function model(values: Record<string, number>): ShockState {
  const type = Math.round(values.type);
  const sev = type === 0 ? 0 : values.severity / 100;
  const standing = values.posture === 1;
  let volume = 0;
  let preload = standing ? 0.8 : 1;
  let contractility = 1;
  let tone = 1;
  let cvp = standing ? 4 : 5;
  switch (type) {
    case 1:
      volume = -sev;
      cvp -= 12 * sev;
      break;
    case 2:
      tone = Math.max(0.3, 1 - 1.2 * sev);
      preload *= 1 - 0.5 * sev;
      cvp -= 6 * sev;
      break;
    case 3:
      contractility = Math.max(0.2, 1 - 1.5 * sev);
      cvp += 25 * sev;
      break;
    case 4:
      preload *= Math.max(0.2, 1 - 1.4 * sev);
      cvp += 25 * sev;
      break;
  }
  const c = solveCirculation({ volume, preload, contractility, tone, reflex: values.sympathetic === 1 ? 1 : 0 });
  cvp = clamp(cvp, 0, 25);
  const constricting = Math.max(0, c.drive);
  const urine = 60 * clamp((c.map - 50) / (REST_MAP - 50), 0, 1.2) * (1 - 0.6 * constricting);
  const skin = type === 2 && sev > 0.05 ? 2 : constricting > 0.08 ? 1 : 0;
  const breathing = 14 + 30 * Math.max(0, (REST_MAP - c.map) / REST_MAP);
  const notes: string[] = [];
  if (c.map < 70) notes.push('Mean BP is below 70 mmHg: tissue perfusion is now inadequate — shock (slide 12).');
  if (standing && values.sympathetic === 0) notes.push('No sympathetic response on standing: orthostatic (postural) hypotension (slide 8).');
  return {
    readouts: {
      map: c.map,
      hr: c.hr,
      cvp,
      urine,
      skin,
      breathing,
      co: c.co,
    },
    notes,
    ...c,
    cvp,
    urine,
    skin,
    breathing,
    standing,
    type,
  };
}

const LYING = { type: 0, severity: 30, posture: 0, sympathetic: 1 };

export const shock: SimDefinition<ShockState> = {
  id: 'shock',
  name: 'Gravity and shock',
  animated: true,
  controls: [
    { kind: 'choice', key: 'type', label: 'Type of shock', options: SHOCK_TYPES.map((label, value) => ({ value, label })) },
    { kind: 'slider', key: 'severity', label: 'Severity', unit: '%', min: 5, max: 45, step: 1, hint: 'e.g. % of blood volume lost' },
    {
      kind: 'choice',
      key: 'posture',
      label: 'Posture',
      options: [
        { value: 0, label: 'Lying' },
        { value: 1, label: 'Standing' },
      ],
    },
    {
      kind: 'choice',
      key: 'sympathetic',
      label: 'Sympathetic response',
      options: [
        { value: 1, label: 'Working' },
        { value: 0, label: 'Failed' },
      ],
    },
  ],
  initial: LYING,
  readouts: [
    { key: 'map', label: 'Mean BP', unit: 'mmHg', primary: true },
    { key: 'hr', label: 'Pulse', unit: '/min' },
    { key: 'cvp', label: 'JVP / CVP', unit: 'mmHg' },
    { key: 'urine', label: 'Urine output', unit: 'mL/h' },
    { key: 'skin', label: 'Skin', noDelta: true, text: (v) => ['Normal', 'Pale and cool', 'Vasodilated'][v] ?? '' },
    { key: 'breathing', label: 'Breathing', unit: '/min', hidden: true },
    { key: 'co', label: 'Cardiac output', unit: 'L/min', decimals: 1, hidden: true },
  ],
  model,
  scenarios: [
    { id: 'lying', label: 'Healthy, lying', values: LYING, caption: 'Resting circulation: mean BP about 93 mmHg, CVP 4–6 mmHg.' },
    { id: 'standing', label: 'Stand up', values: { ...LYING, posture: 1 }, caption: 'Pooling lowers venous return; the baroreceptor reflex restores BP with tachycardia and vasoconstriction (slides 3–4).' },
    { id: 'orthostatic', label: 'Orthostatic hypotension', values: { ...LYING, posture: 1, sympathetic: 0 }, caption: 'No sympathetic response — after sympatholytic drugs, in diabetes or autonomic failure — so BP falls on standing (slide 8).' },
    { id: 'bleed', label: 'Haemorrhage', values: { ...LYING, type: 1 }, caption: 'Low BP, fast pulse, pale cool skin, low urine output, rapid breathing; the veins are empty so the JVP is low (slides 18–23).' },
    { id: 'distributive', label: 'Anaphylaxis / sepsis', values: { ...LYING, type: 2 }, caption: 'Normal volume but massive vasodilatation and pooling (slide 29).' },
    { id: 'cardiogenic', label: 'Cardiogenic', values: { ...LYING, type: 3 }, caption: 'A failing pump (MI, arrhythmia): blood backs up behind the heart, so the JVP rises (slides 13, 31).' },
    { id: 'obstructive', label: 'Tamponade', values: { ...LYING, type: 4 }, caption: 'Filling is blocked (cardiac tamponade, tension pneumothorax, pulmonary embolism): low output with distended neck veins (slide 13).' },
  ],
  challenges: [
    {
      id: 'high-jvp',
      label: 'Shock with full neck veins',
      prompt: 'Set up a shock (mean BP 75 mmHg or less) in which the JVP is raised (12 mmHg or more).',
      rules: ['Choose the type and severity.'],
      start: LYING,
      locked: ['posture', 'sympathetic'],
      goals: [
        { readout: 'map', atMost: 75, label: 'Mean BP 75 mmHg or less' },
        { readout: 'cvp', atLeast: 12, label: 'JVP 12 mmHg or more' },
      ],
      debrief:
        'Cardiogenic and obstructive shock: the problem is the pump or its filling, so blood backs up in the veins (raised JVP). In hypovolaemic and distributive shock the veins are empty and the JVP is low — a quick bedside way to tell them apart.',
    },
  ],
  modelNote:
    'Simplified closed-loop model built on BP = cardiac output × peripheral resistance, following your lecture (Gravity & Shock slides 3–31). Numbers are illustrative, not clinical thresholds.',
};

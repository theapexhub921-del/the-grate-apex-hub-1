// Lesson 3 — Cardiac output: the left ventricular pressure–volume loop.
//
// Model (simplified):
//   end-systolic pressure–volume line   P = Ees × (V − V0)      (contractility)
//   end-diastolic (filling) curve       P = 0.5 × (e^(0.022(V−10)) − 1)
//   pulse pressure ≈ SV / 2.1, so end-systolic pressure ≈ diastolic + SV/4.2
// Resting values match The Heart slides 13–16, 41: EDV 130 mL, EF ≈ 65%,
// CO ≈ 5.5 L/min, aortic valve opening at ≈ 80 mmHg, LV peak ≈ 120 mmHg.
import { clamp, type SimDefinition, type SimState } from '@/data/simulations/types';

const V0 = 10;
const EES = 2.863; // mmHg/mL at normal contractility
const K = 4.2;

export const edpvr = (volume: number) => 0.5 * (Math.exp(0.022 * (volume - 10)) - 1);

export type PvPhase = 'Isovolumetric contraction' | 'Ejection' | 'Isovolumetric relaxation' | 'Filling';

export type PvSegment = {
  phase: PvPhase;
  mitral: boolean; // open?
  aortic: boolean;
  duration: number; // seconds
  points: [number, number][]; // [volume mL, pressure mmHg]
};

export type PvState = SimState & {
  edv: number;
  esv: number;
  sv: number;
  pes: number;
  diastolic: number;
  systolic: number;
  ees: number;
  opened: boolean;
  fillFraction: number;
  beat: number; // seconds
  systole: number;
  diastole: number;
  segments: PvSegment[];
};

function bezier(a: number, b: number, c: number, d: number, t: number) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

function line(from: [number, number], to: [number, number], n: number): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => [from[0] + ((to[0] - from[0]) * i) / n, from[1] + ((to[1] - from[1]) * i) / n]);
}

function model(values: Record<string, number>): PvState {
  const hr = values.hr;
  const beat = 60 / hr;
  const systole = clamp(0.3 - 0.0006 * (hr - 65), 0.18, 0.32);
  const ivc = 0.05;
  const ivr = 0.06;
  const fillTime = Math.max(0.02, beat - systole - ivr);
  // Very short diastole cuts filling short (slide 20).
  const fillFraction = fillTime >= 0.15 ? 1 : 0.7 + 0.3 * (fillTime / 0.15);
  const edv = values.edv * fillFraction;
  const ees = EES * values.c;
  const diastolic = values.afterload;
  let sv = (edv - V0 - diastolic / ees) / (1 + 1 / (K * ees));
  const opened = sv > 0;
  if (!opened) sv = 0;
  const pp = sv / 2.1;
  const pes = diastolic + sv / K;
  const esv = edv - sv;
  const systolic = diastolic + pp;
  const map = diastolic + pp / 3;
  const ef = edv > 0 ? sv / edv : 0;
  const co = (sv * hr) / 1000;

  const edp = edpvr(edv);
  const segments: PvSegment[] = [];
  if (!opened) {
    const top = Math.min(ees * (edv - V0), 158);
    segments.push({ phase: 'Isovolumetric contraction', mitral: false, aortic: false, duration: systole / 2, points: line([edv, edp], [edv, top], 12) });
    segments.push({ phase: 'Isovolumetric relaxation', mitral: false, aortic: false, duration: systole / 2 + ivr, points: line([edv, top], [edv, edp], 12) });
    segments.push({ phase: 'Filling', mitral: true, aortic: false, duration: fillTime, points: line([edv, edp], [edv, edp], 2) });
  } else {
    segments.push({ phase: 'Isovolumetric contraction', mitral: false, aortic: false, duration: ivc, points: line([edv, edp], [edv, diastolic], 10) });
    const ejection: [number, number][] = [];
    const v1 = edv - 0.1 * sv;
    const v2 = esv + 0.25 * sv;
    const p1 = diastolic + 1.35 * pp;
    const p2 = pes + 0.75 * pp;
    for (let i = 0; i <= 36; i++) {
      const t = i / 36;
      ejection.push([bezier(edv, v1, v2, esv, t), bezier(diastolic, p1, p2, pes, t)]);
    }
    segments.push({ phase: 'Ejection', mitral: false, aortic: true, duration: systole - ivc, points: ejection });
    segments.push({ phase: 'Isovolumetric relaxation', mitral: false, aortic: false, duration: ivr, points: line([esv, pes], [esv, edpvr(esv)], 10) });
    const filling: [number, number][] = [];
    for (let i = 0; i <= 36; i++) {
      const v = esv + ((edv - esv) * i) / 36;
      filling.push([v, edpvr(v)]);
    }
    segments.push({ phase: 'Filling', mitral: true, aortic: false, duration: fillTime, points: filling });
  }

  const notes: string[] = [];
  if (fillFraction < 1) {
    notes.push(`At this rate diastole is so short that the ventricle fills only to ${Math.round(edv)} mL instead of ${Math.round(values.edv)} mL (slide 20).`);
  }
  if (!opened) notes.push('The ventricle cannot reach the pressure needed to open the aortic valve, so nothing is ejected.');

  return {
    readouts: {
      co,
      sv,
      ef: ef * 100,
      esv,
      systolic,
      diastolic,
      map,
      work: (sv * map) / REST_WORK * 100,
    },
    notes,
    edv,
    esv,
    sv,
    pes,
    diastolic,
    systolic,
    ees,
    opened,
    fillFraction,
    beat,
    systole,
    diastole: beat - systole,
    segments,
  };
}

// Work per beat at rest (SV × MAP), so work can be shown as % of rest.
const REST_WORK = (() => {
  const sv = (130 - V0 - 80 / EES) / (1 + 1 / (K * EES));
  return sv * (80 + sv / 2.1 / 3);
})();

const REST = { edv: 130, afterload: 80, c: 1, hr: 65 };

export const pvLoop: SimDefinition<PvState> = {
  id: 'pv-loop',
  name: 'Pressure–volume loop',
  animated: true,
  controls: [
    { kind: 'slider', key: 'edv', label: 'Preload', unit: 'mL', min: 80, max: 180, step: 1, hint: 'End-diastolic volume: how full the ventricle is before it contracts' },
    { kind: 'slider', key: 'afterload', label: 'Afterload', unit: 'mmHg', min: 50, max: 130, step: 1, hint: 'Aortic pressure the ventricle must beat to open the valve' },
    { kind: 'slider', key: 'c', label: 'Contractility', min: 0.4, max: 2, step: 0.05, hint: 'Strength of contraction at the same stretch (inotropy)', format: (v) => `×${v.toFixed(2)}${Math.abs(v - 1) < 0.001 ? ' (normal)' : ''}` },
    { kind: 'slider', key: 'hr', label: 'Heart rate', unit: '/min', min: 40, max: 180, step: 1, hint: 'Beats per minute (chronotropy)' },
  ],
  initial: REST,
  readouts: [
    { key: 'co', label: 'Cardiac output', unit: 'L/min', decimals: 1, primary: true },
    { key: 'sv', label: 'Stroke volume', unit: 'mL' },
    { key: 'ef', label: 'Ejection fraction', unit: '%' },
    { key: 'systolic', label: 'Blood pressure', text: (_v, all) => `${Math.round(all.systolic)}/${Math.round(all.diastolic)}` },
    { key: 'work', label: 'Work per beat vs rest', unit: '%' },
    { key: 'esv', label: 'End-systolic volume', unit: 'mL', hidden: true },
  ],
  model,
  scenarios: [
    { id: 'rest', label: 'Rest', values: REST, caption: 'Resting heart: EDV ≈ 130 mL, EF ≈ 65%, cardiac output ≈ 5.5 L/min (slides 16, 41).' },
    { id: 'exercise', label: 'Exercise', values: { edv: 150, afterload: 70, c: 1.6, hr: 140 }, caption: 'Catecholamines and sympathetic drive raise contractility and rate, the muscle pump raises venous return, and vasodilatation lowers afterload (slide 54).' },
    { id: 'standing', label: 'Standing still', values: { edv: 95, afterload: 80, c: 1, hr: 65 }, caption: 'Blood pools in the legs, so end-diastolic volume falls and so does stroke volume (slide 49).' },
    { id: 'adrenaline', label: 'Adrenaline / caffeine', values: { edv: 130, afterload: 80, c: 1.5, hr: 90 }, caption: 'Catecholamines act via β1 → cAMP; xanthines such as caffeine stop cAMP being broken down. Both raise inotropy (slides 50–52).' },
    { id: 'failure', label: 'Heart failure', values: { edv: 170, afterload: 80, c: 0.4, hr: 85 }, caption: 'Contractility is depressed, so the heart sits on a lower Starling curve. It needs a much larger, stretched ventricle just to keep stroke volume near normal, and the ejection fraction falls (slides 46, 53).' },
    { id: 'afterload', label: 'High afterload', values: { edv: 130, afterload: 115, c: 1, hr: 65 }, caption: 'Raised systemic pressure means more resistance to ejection. Stroke volume falls while work per beat rises (slides 44, 50, 58).' },
  ],
  challenges: [
    {
      id: 'standing',
      label: 'Standing up',
      prompt: 'Your patient has stood still and blood has pooled in the legs: end-diastolic volume is down to 95 mL. Get cardiac output back to at least 5.5 L/min.',
      rules: ['Preload and afterload are locked.', 'Heart rate can go no higher than 100 /min.'],
      start: { edv: 95, afterload: 80, c: 1, hr: 65 },
      locked: ['edv', 'afterload'],
      limits: { hr: { max: 100 } },
      goals: [{ readout: 'co', atLeast: 5.5, label: 'Cardiac output at least 5.5 L/min' }],
      debrief:
        'That is what the body does on standing: the fall in pressure at the carotid sinus and aortic arch drives the vasomotor centre to give positive inotropic and chronotropic effects (plus vasoconstriction and more venous return), restoring cardiac output and BP (Lesson 7, slide 4).',
    },
    {
      id: 'exercise',
      label: 'Exercise',
      prompt: 'Your patient starts running. Raise cardiac output to at least 15 L/min using any of the four controls.',
      rules: ['Everything is unlocked.', 'Watch what happens to filling if you push the heart rate very high.'],
      start: REST,
      goals: [{ readout: 'co', atLeast: 15, label: 'Cardiac output at least 15 L/min' }],
      debrief:
        'In exercise the body uses all four levers at once: more contractility and rate from catecholamines and sympathetic discharge, more venous return from the muscle pump, and less afterload from vasodilatation (slide 54). Rate alone does not work well, because very fast rates cut diastole short and the ventricle fills less (slide 20).',
    },
  ],
  modelNote:
    'Simplified teaching model. Resting values follow your lecture (The Heart slides 13–16, 41); the curve shapes are standard textbook shapes. It shows which way things move and roughly how far, not exact values for a real patient. Shown 4× slower than real time.',
};

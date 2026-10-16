// Physiology → Cardiovascular Physiology — one simulation per lesson
// (models in data/simulations/). Each starts with predictions: checkpoint
// questions answered BEFORE the model runs the change, recorded like any
// other checkpoint. Prediction IDs: sN-xx.
//
// A simulation goes just before a lesson's final recall prompt: learn the
// idea, play with it, then recall it.
import type { InteractiveDraft, QuestionDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { c1, c2, c3, c4, c5, type ConceptId } from '@/data/topics/cardiovascular-physiology/sources';

type Step = InteractiveDraft<ConceptId>;

const DIRECTIONS = ['It increases', 'It decreases', 'It stays about the same'];

// "Which way will it go?" — always in the same order.
function direction(id: string, conceptId: ConceptId, prompt: string, answer: 'up' | 'down' | 'same', explanation: string): QuestionDraft<ConceptId> {
  return {
    id,
    type: 'choice',
    conceptId,
    prompt,
    options: DIRECTIONS,
    answer: answer === 'up' ? 0 : answer === 'down' ? 1 : 2,
    fixedOrder: true,
    explanation,
    skill: 'prediction',
    label: 'Predict',
  } as QuestionDraft<ConceptId>;
}

const predict = { skill: 'prediction' as const, label: 'Predict' };

export const simulations: Record<string, Step> = {
  // ─── Lesson 1 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-1': simulate({
    sim: 'cardiac-cycle',
    title: 'One heartbeat, frame by frame',
    intro: 'Watch the pressures and volume of the left heart through one beat, then change the rate and see which part of the beat pays for it.',
    sourceRefs: c1([12, 13, 14, 15, 16, 17, 20]),
    predictions: [
      {
        question: direction(
          's1-01',
          'fast-heart-rate',
          'Heart rate rises from 70 to 150 /min. What happens to the share of each beat spent in diastole?',
          'down',
          'Systole shortens only a little (about 0.33 → 0.26 s) but diastole shrinks from about 0.53 to 0.14 s. Diastole is when the ventricles fill and the coronary arteries flow (slide 20).'
        ),
        set: { hr: 150 },
        watch: 'diastoleShare',
        expect: [
          { readout: 'diastoleShare', change: 'down' },
          { readout: 'diastole', change: 'down' },
        ],
      },
      {
        question: mcq(
          's1-02',
          'cycle-phases',
          'The beat is frozen just after the mitral and tricuspid valves close, before the aortic and pulmonary valves open. Which valves are open?',
          'None — all four are shut',
          ['Mitral and tricuspid', 'Aortic and pulmonary', 'All four'],
          {
            ...predict,
            explanation: 'This is isovolumetric contraction: the ventricle squeezes with every valve shut, so pressure rises while volume cannot change (slides 13–15).',
          }
        ),
        set: { paused: 1, t: 0.15 },
        watch: 'openValves',
        expect: [{ readout: 'openValves', equals: 0 }],
      },
    ],
  }),

  // ─── Lesson 2 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-2': simulate({
    sim: 'sounds-jvp',
    title: 'Listen to one beat',
    intro: 'S1, S2, murmurs and the neck-vein waves on one timeline. Change the breathing, the valve and the neck veins and see what moves.',
    sourceRefs: c1([27, 28, 30, 34, 36]),
    predictions: [
      {
        question: mcq('s2-01', 'murmurs', 'A patient has mitral incompetence. When is the murmur heard?', 'In systole', ['In diastole', 'Only when breathing in'], {
          ...predict,
          explanation: 'The mitral valve should be shut while the ventricle contracts. A leaky valve lets blood flow back into the atrium during systole: a systolic murmur (slide 36).',
        }),
        set: { lesion: 4 },
        watch: 'murmurPhase',
        expect: [{ readout: 'murmurPhase', equals: 1 }],
      },
      {
        question: direction(
          's2-02',
          'heart-sounds',
          'The patient breathes in. What happens to the gap between the aortic (A2) and pulmonary (P2) parts of the second sound?',
          'up',
          'Inspiration increases venous return and lowers pulmonary resistance, so right ventricular ejection lasts longer and P2 comes after A2: physiological splitting (slide 34).'
        ),
        set: { breath: 1 },
        watch: 's2Split',
        expect: [{ readout: 's2Split', change: 'up' }],
      },
    ],
  }),

  // ─── Lesson 3 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-3': simulate({
    sim: 'pv-loop',
    title: 'Preload, afterload and contractility in one beat',
    intro: 'Each lap of the loop is one beat of the left ventricle. Its width is the stroke volume. Predict first, then move the sliders.',
    sourceRefs: c1([44, 46, 48, 50, 52, 54, 58]),
    predictions: [
      {
        question: direction(
          's3-01',
          'frank-starling',
          'Afterload rises: the aortic pressure the ventricle must beat goes from 80 to 110 mmHg. Preload and contractility stay the same. What happens to stroke volume?',
          'down',
          'The ventricle must build a higher pressure before the aortic valve opens, and it stops ejecting at a higher pressure, so more blood is left behind and stroke volume falls. Work per beat still rises: pressure work costs the heart more oxygen than volume work (slides 44, 50, 58).'
        ),
        set: { afterload: 110 },
        watch: 'sv',
        expect: [{ readout: 'sv', change: 'down' }],
      },
      {
        question: direction(
          's3-02',
          'frank-starling',
          'Venous return rises, so end-diastolic volume goes from 130 to 160 mL. Afterload and contractility stay the same. What happens to stroke volume?',
          'up',
          'The Frank–Starling law: the energy of contraction is proportional to the initial length of the muscle. More stretch gives a stronger beat, so the loop widens and stroke volume rises (slides 44–48).'
        ),
        set: { edv: 160 },
        watch: 'sv',
        expect: [{ readout: 'sv', change: 'up' }],
      },
      {
        question: direction(
          's3-03',
          'contractility',
          'Adrenaline acts on β1 receptors and raises cAMP, so contractility goes up 1.5×. Preload and afterload stay the same. What happens to end-systolic volume — the blood left at the end of the beat?',
          'down',
          'Higher contractility steepens the contractility line, so the ventricle empties further at the same pressure: end-systolic volume falls and stroke volume and ejection fraction rise — a positive inotropic effect (slides 50–52).'
        ),
        set: { c: 1.5 },
        watch: 'esv',
        expect: [
          { readout: 'esv', change: 'down' },
          { readout: 'sv', change: 'up' },
        ],
      },
    ],
  }),

  // ─── Lesson 4 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-4': simulate({
    sim: 'vessel-flow',
    title: 'Squeeze the pipe',
    intro: 'Change the radius, the blood and the narrowing of a vessel, and watch flow, resistance and turbulence.',
    sourceRefs: c1([66, 70, 71, 72, 73, 74, 76, 77]),
    predictions: [
      {
        question: mcq('s4-01', 'flow-pressure-resistance', 'A vessel’s radius halves; the pressure drop stays the same. Flow becomes about…', 'One-sixteenth of normal', ['Half of normal', 'One-quarter of normal', 'Twice normal'], {
          ...predict,
          explanation: 'Flow varies with r⁴ (Poiseuille), so halving the radius cuts flow to (½)⁴ = 1/16 — about 6% of normal (slides 74–76).',
        }),
        set: { r: 0.5 },
        watch: 'flow',
        expect: [{ readout: 'flow', equals: 6.25, tolerance: 0.01 }],
      },
      {
        question: mcq('s4-02', 'laminar-turbulent', 'The blood becomes thin, as in anaemia: viscosity halves. Is flow in this vessel laminar or turbulent?', 'Turbulent', ['Laminar', 'It stops'], {
          ...predict,
          explanation: 'Thin blood flows faster and has a higher Reynolds’ number (Re = ρDv/η), so flow turns turbulent — the flow murmurs of anaemia (slides 71–72, 40).',
        }),
        set: { viscosity: 0.5 },
        watch: 'reynolds',
        expect: [{ readout: 'turbulent', equals: 1 }],
      },
    ],
  }),

  // ─── Lesson 5 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-5': simulate({
    sim: 'capillary-starling',
    title: 'Balance the capillary',
    intro: 'Four pressures decide whether fluid leaves or returns along a capillary. Tip the balance and see when oedema appears.',
    sourceRefs: c1([94, 95, 97, 99, 100, 101, 102, 106, 107]),
    predictions: [
      {
        question: mcq(
          's5-01',
          'oedema',
          'Plasma proteins fall in liver disease: plasma oncotic pressure drops from 25 to 15 mmHg. What happens in the tissues?',
          'Fluid builds up (oedema)',
          ['The tissues dry out', 'Nothing — lymph always copes'],
          {
            ...predict,
            explanation: 'Plasma oncotic pressure is what draws fluid back in. With less of it, filtration wins along the whole capillary and outruns what lymph can return: oedema (slide 102).',
          }
        ),
        set: { pp: 15 },
        watch: 'oedema',
        expect: [{ readout: 'swelling', equals: 1 }],
      },
      {
        question: direction(
          's5-02',
          'starling-forces',
          'Venous pressure rises in heart failure, so capillary pressure goes from 35 to 50 mmHg. What happens to reabsorption at the venous end?',
          'down',
          'Capillary hydrostatic pressure pushes fluid out. Raised all along the capillary, it overwhelms the oncotic pull even at the venous end, so reabsorption falls (slides 94–95, 100).'
        ),
        set: { pc: 50 },
        watch: 'reabsorbed',
        expect: [{ readout: 'reabsorbed', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 6 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-6': simulate({
    sim: 'baroreflex',
    title: 'Run the baroreceptor reflex',
    intro: 'Bleed, transfuse or give a drug, and follow the reflex from the carotid sinus to the heart and arterioles.',
    sourceRefs: c2([4, 21, 23, 24, 26, 28]),
    predictions: [
      {
        question: direction(
          's6-01',
          'baroreceptor-reflex',
          'You lose 20% of your blood volume, with your reflexes intact. What happens to your heart rate?',
          'up',
          'Lower pressure means less stretch and less baroreceptor firing, so the pressor area is released: more sympathetic and less vagal discharge — tachycardia, positive inotropy and vasoconstriction (slide 28).'
        ),
        set: { volume: -20 },
        watch: 'hr',
        expect: [
          { readout: 'hr', change: 'up' },
          { readout: 'map', change: 'down' },
        ],
      },
      {
        question: mcq(
          's6-02',
          'baroreceptor-reflex',
          'Same bleed, but now the baroreceptor nerves are cut. Compared with the intact reflex, BP is…',
          'Lower — nothing corrects the fall',
          ['Higher', 'The same — the reflex makes no difference'],
          {
            ...predict,
            explanation: 'Without the afferents (carotid sinus nerve, IX; aortic, X) the medulla never hears that pressure has fallen, so there is no tachycardia or vasoconstriction to buffer it (slides 24, 28).',
          }
        ),
        from: { volume: -20 },
        set: { reflex: 0 },
        watch: 'map',
        expect: [{ readout: 'map', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 7 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-7': simulate({
    sim: 'shock',
    title: 'Stand up, bleed, and compensate',
    intro: 'Choose a type of shock or stand the patient up, and read the bedside signs: BP, pulse, JVP, urine and skin.',
    sourceRefs: c3([3, 4, 8, 12, 13, 18, 19, 20, 21, 31]),
    predictions: [
      {
        question: mcq('s7-01', 'shock-features', 'Haemorrhage: 30% of blood volume is lost. Which set of signs do you expect?', 'Low BP, fast pulse, low JVP', ['Low BP, slow pulse, raised JVP', 'High BP, fast pulse, low JVP'], {
          ...predict,
          explanation: 'Low volume → low venous return → low output and BP. The VMC is released from inhibition, giving tachycardia and vasoconstriction (pale, cool skin); the veins are empty, so the JVP is low (slides 18–21).',
        }),
        set: { type: 1, severity: 30 },
        watch: 'hr',
        expect: [
          { readout: 'hr', change: 'up' },
          { readout: 'map', change: 'down' },
          { readout: 'cvp', change: 'down' },
        ],
      },
      {
        question: direction(
          's7-02',
          'orthostatic-hypotension',
          'A patient stands up, but their sympathetic nerves do not respond (e.g. diabetic neuropathy). What happens to their BP compared with a healthy person standing?',
          'down',
          'Without sympathetic vasoconstriction and the rise in heart rate, nothing offsets the pooling of blood in the legs: orthostatic (postural) hypotension (slide 8).'
        ),
        from: { posture: 1 },
        set: { sympathetic: 0 },
        watch: 'map',
        expect: [{ readout: 'map', change: 'down' }],
      },
    ],
  }),

  // ─── Lesson 8 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-8': simulate({
    sim: 'cerebral-flow',
    title: 'Keep the brain perfused',
    intro: 'Change blood pressure, CO₂ and intracranial pressure and watch cerebral blood flow on its autoregulation curve.',
    sourceRefs: [...c4([21, 22, 23]), ...c2([35, 36]), ...c3([5])],
    predictions: [
      {
        question: direction(
          's8-01',
          'cerebral-flow',
          'Mean BP falls from 93 to 75 mmHg; intracranial pressure is normal. What happens to cerebral blood flow?',
          'same',
          'Autoregulation is prominent in the brain: the vessels dilate as pressure falls, keeping flow nearly constant while perfusion pressure stays in range (Regional Circulation slide 23).'
        ),
        set: { map: 75 },
        watch: 'flow',
        expect: [{ readout: 'flow', change: 'same', tolerance: 0.01 }],
      },
      {
        question: direction(
          's8-02',
          'cerebral-flow',
          'Arterial PCO₂ rises from 40 to 60 mmHg. What happens to cerebral blood flow?',
          'up',
          'A rise in PCO₂ dilates the cerebral vessels, so flow increases (Gravity & Shock slide 5).'
        ),
        set: { co2: 60 },
        watch: 'flow',
        expect: [{ readout: 'flow', change: 'up' }],
      },
    ],
  }),

  // ─── Lesson 9 ──────────────────────────────────────────────────────
  'cardiovascular-physiology-9': simulate({
    sim: 'ecg',
    title: 'Build the ECG',
    intro: 'Set the SA node rate and the conduction, and read the strip like the real thing: squares, PR intervals and dropped beats.',
    sourceRefs: c5([2, 15, 16, 18, 19, 20, 21, 22, 23, 24]),
    predictions: [
      {
        question: mcq(
          's9-01',
          'heart-block',
          'Complete heart block: the SA node still fires at 75 /min. The ventricles beat…',
          'Slower, unrelated to the P waves',
          ['At 75 /min, after every P wave', 'Faster than the atria'],
          {
            ...predict,
            explanation: 'Conduction is interrupted, so atria and ventricles beat independently. The ventricles beat slowly from their own pacemaker (idioventricular rhythm) — P–P and R–R are each regular but unrelated (slides 24–26).',
          }
        ),
        set: { rhythm: 4 },
        watch: 'ventricularRate',
        expect: [{ readout: 'ventricularRate', change: 'down' }],
      },
      {
        question: mcq('s9-02', 'heart-block', 'First-degree heart block. Which interval is longer than normal?', 'The PR interval', ['The QRS duration', 'The QT interval'], {
          ...predict,
          explanation: 'Signals are slowed from atria to ventricles, so every P conducts but late: a PR interval longer than 0.20 s (slide 21).',
        }),
        set: { rhythm: 1 },
        watch: 'pr',
        expect: [{ readout: 'pr', change: 'up' }],
      },
    ],
  }),
};

// The lesson's interactive steps with its simulation added before the
// final recall prompt (or at the end if there is none).
export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  const sim = simulations[lessonId];
  if (!steps || !sim) return steps;
  const last = steps[steps.length - 1];
  return last?.type === 'recall' ? [...steps.slice(0, -1), sim, last] : [...steps, sim];
}

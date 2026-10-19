// Physiology → Renal Physiology — one simulation per lesson (models in
// data/simulations/). Each starts with predictions answered BEFORE the
// model runs the change. Prediction IDs: sN-xx.
import type { InteractiveDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { rs, TOPIC_ID, type ConceptId } from '@/data/topics/renal-physiology/sources';
import { direction, insertSimulation, predict } from '@/data/topics/sim-helpers';

type Step = InteractiveDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const simulations: Record<string, Step> = {
  [L(1)]: simulate({
    sim: 'renal-vessels',
    title: 'Inside one nephron',
    intro: 'Narrow the arteriole that brings blood to the glomerulus or the one that takes it away, switch between the two kinds of nephron, and watch the glomerular pressure and the juxtaglomerular apparatus.',
    sourceRefs: rs([9, 10, 11, 12, 13, 14, 20, 26]),
    predictions: [
      {
        question: direction('s1-01', 'nephron-vessels', 'The efferent arteriole — the one leaving the glomerulus — narrows. What happens to the pressure in the glomerulus?', 'up', 'Blood is held back in the glomerulus, so its pressure rises. This is why glomerular pressure is normally high: the efferent arteriole is narrower than the afferent (slides 12, 26).'),
        set: { efferent: 30 },
        watch: 'gbhp',
        expect: [{ readout: 'gbhp', change: 'up' }],
      },
      {
        question: direction('s1-02', 'jga', 'The afferent arteriole narrows, so less blood and filtrate pass through the nephron. What do the granular (juxtaglomerular) cells do with renin?', 'up', 'Less filtrate means less NaCl at the macula densa, which signals the granular cells in the afferent arteriole wall to release renin (slides 20, 36).'),
        set: { afferent: 30 },
        watch: 'renin',
        expect: [
          { readout: 'renin', change: 'up' },
          { readout: 'gbhp', change: 'down' },
        ],
      },
      {
        question: mcq('s1-03', 'nephron-types', 'You switch to a juxtamedullary nephron. Which vessels does its efferent arteriole form?', 'Peritubular capillaries and vasa recta', ['Peritubular capillaries only', 'A second glomerulus in the medulla'], {
          ...predict,
          explanation: 'Juxtamedullary nephrons (about 15%) have long loops deep into the medulla, and their efferent arterioles form the vasa recta as well as peritubular capillaries (slides 10, 13).',
        }),
        set: { nephron: 1 },
        watch: 'vasa',
        expect: [
          { readout: 'vasa', equals: 1 },
          { readout: 'loop', equals: 1 },
        ],
      },
    ],
  }),

  [L(2)]: simulate({
    sim: 'glomerular-filtration',
    title: 'The forces of filtration',
    intro: 'Change the arterial pressure, the sympathetic nerves and the pressures opposing filtration, and see how autoregulation protects the GFR.',
    sourceRefs: rs([26, 27, 28, 29, 34, 35]),
    predictions: [
      {
        question: direction('s2-01', 'autoregulation', 'Mean arterial pressure rises from 100 to 150 mmHg, with autoregulation working. What happens to the GFR?', 'same', 'The afferent arteriole constricts (myogenic response and tubuloglomerular feedback), so glomerular pressure — and GFR — stay fairly constant between about 80 and 180 mmHg (slide 29).'),
        set: { map: 150 },
        watch: 'gfr',
        expect: [{ readout: 'gfr', change: 'same' }],
      },
      {
        question: direction('s2-02', 'gfr-extrinsic', 'In an emergency, strong sympathetic activity reaches the kidney. What happens to the GFR?', 'down', 'Noradrenaline and adrenaline constrict the afferent arterioles, overriding autoregulation: filtration falls and blood is shunted to vital organs (slide 35).'),
        set: { sympathetic: 2 },
        watch: 'gfr',
        expect: [{ readout: 'gfr', change: 'down' }],
      },
      {
        question: mcq('s2-03', 'nfp', 'Capsular hydrostatic pressure rises from 15 to 20 mmHg. What is the new net filtration pressure?', '5 mmHg', ['10 mmHg', '15 mmHg'], {
          ...predict,
          explanation: 'NFP = GBHP − (BCOP + CHP) = 55 − (30 + 20) = 5 mmHg. GFR is proportional to NFP, so it halves (slides 26–28).',
        }),
        set: { chp: 20 },
        watch: 'nfp',
        expect: [
          { readout: 'nfp', equals: 5, tolerance: 0.01 },
          { readout: 'gfr', change: 'down' },
        ],
      },
    ],
  }),

  [L(3)]: simulate({
    sim: 'glucose-tm',
    title: 'Glucose and the tubular maximum',
    intro: 'Raise the blood glucose, change the number of carriers or block the Na⁺/K⁺ pump, and see when glucose spills into the urine.',
    sourceRefs: rs([44, 45, 46, 47, 51]),
    predictions: [
      {
        question: direction('s3-01', 'tm', 'Plasma glucose rises from 100 to 400 mg/dl (uncontrolled diabetes). What happens to the glucose in the urine?', 'up', 'The filtered load exceeds the transport maximum: the carriers are saturated and the excess is excreted (slide 47).'),
        set: { glucose: 400 },
        watch: 'excreted',
        expect: [
          { readout: 'excreted', change: 'up' },
          { readout: 'reabsorbed', change: 'up' },
        ],
      },
      {
        question: direction('s3-02', 'tm', 'Plasma glucose rises a little, from 100 to 140 mg/dl. What happens to the glucose in the urine?', 'same', 'Still well below the transport maximum: every filtered molecule is reabsorbed and urine glucose stays at zero (slides 47, 51).'),
        set: { glucose: 140 },
        watch: 'excreted',
        expect: [{ readout: 'excreted', change: 'same' }],
      },
      {
        question: direction('s3-03', 'sodium-reabsorption', 'The basolateral Na⁺/K⁺-ATPase is blocked. What happens to glucose reabsorption?', 'down', 'Glucose rides in with Na⁺ (secondary active transport). Without the pump, cell Na⁺ rises and the gradient that drives the co-transport is lost (slides 45–46).'),
        set: { pump: 1 },
        watch: 'reabsorbed',
        expect: [{ readout: 'reabsorbed', change: 'down' }],
      },
    ],
  }),

  [L(4)]: simulate({
    sim: 'urine-concentration',
    title: 'The countercurrent and ADH',
    intro: 'Change the ADH level or give a diuretic, and watch the medullary gradient and the urine that comes out.',
    sourceRefs: rs([64, 65, 66, 67, 78, 79, 81, 82]),
    predictions: [
      {
        question: direction('s4-01', 'adh-kidney', 'ADH rises to its maximum (the person is dehydrated). What happens to the urine concentration?', 'up', 'ADH inserts aquaporins in the collecting duct; water leaves into the concentrated medulla, leaving a small volume of concentrated urine (slide 78).'),
        set: { adh: 100 },
        watch: 'urineOsm',
        expect: [
          { readout: 'urineOsm', change: 'up' },
          { readout: 'flow', change: 'down' },
        ],
      },
      {
        question: direction('s4-02', 'diuretics', 'Lasix (furosemide) is given. What happens to the concentration at the bend of the loop?', 'down', 'Lasix blocks the Na⁺-K⁺-2Cl⁻ co-transporter of the thick ascending limb, so NaCl is not pumped into the medulla and the gradient collapses (slides 66, 82).'),
        set: { drug: 1 },
        watch: 'peak',
        expect: [
          { readout: 'peak', change: 'down' },
          { readout: 'flow', change: 'up' },
        ],
      },
      {
        question: mcq('s4-03', 'diuretics', 'The person drinks alcohol. Why does urine output rise?', 'Alcohol inhibits ADH secretion', ['Alcohol blocks the Na⁺-K⁺-2Cl⁻ co-transporter', 'Alcohol is an osmotic diuretic'], {
          ...predict,
          explanation: 'Alcohol inhibits ADH secretion, so the collecting duct stays watertight and dilute urine passes (slide 81).',
        }),
        set: { drug: 3 },
        watch: 'urineOsm',
        expect: [
          { readout: 'urineOsm', change: 'down' },
          { readout: 'peak', change: 'same' },
        ],
      },
    ],
  }),

  [L(5)]: simulate({
    sim: 'renal-clearance',
    title: 'Clearing the plasma',
    intro: 'Choose a substance and see how much plasma the kidneys clear of it each minute — and what that tells you about how the tubule handles it.',
    sourceRefs: rs([83, 84, 85, 86, 87, 88, 89]),
    predictions: [
      {
        question: direction('s5-01', 'gfr-measurement', 'You switch from inulin to creatinine. What happens to the clearance?', 'up', 'Creatinine is filtered and slightly secreted, so its clearance (about 140) is a little above the GFR measured by inulin (slides 86–87).'),
        set: { substance: 1 },
        watch: 'clearance',
        expect: [{ readout: 'clearance', change: 'up' }],
      },
      {
        question: mcq('s5-02', 'gfr-measurement', 'You switch to glucose at a normal plasma level. What is its clearance?', 'Zero', ['Equal to inulin', 'Greater than inulin'], {
          ...predict,
          explanation: 'Glucose is filtered but completely reabsorbed below its Tm: none reaches the urine, so its clearance is zero (slide 85).',
        }),
        set: { substance: 2 },
        watch: 'clearance',
        expect: [{ readout: 'clearance', equals: 0 }],
      },
      {
        question: direction('s5-03', 'clearance', 'Inulin\'s plasma concentration doubles. What happens to its clearance?', 'same', 'U × V doubles with P, so UV/P is unchanged: clearance is a volume of plasma per minute, not an amount (slide 84).'),
        set: { plasma: 2 },
        watch: 'clearance',
        expect: [
          { readout: 'clearance', change: 'same' },
          { readout: 'excretion', change: 'up' },
        ],
      },
      {
        question: direction('s5-04', 'rpf', 'The renal plasma flow stays the same but the haematocrit rises from 45% to 55%. What happens to the renal blood flow?', 'up', 'RBF = RPF / (1 − Hct): with less of the blood being plasma, the same plasma flow means more blood (slide 89).'),
        set: { hct: 55 },
        watch: 'rbf',
        expect: [{ readout: 'rbf', change: 'up' }],
      },
    ],
  }),

  [L(6)]: simulate({
    sim: 'micturition',
    title: 'Filling and emptying the bladder',
    intro: 'Fill the bladder, decide when to void, and cut each nerve to see what it does.',
    sourceRefs: rs([103, 104, 105, 107, 110, 113, 114]),
    predictions: [
      {
        question: mcq('s6-01', 'storage-reflex', 'The bladder fills from 100 to 350 ml while you hold on. What happens to the pressure inside it?', 'It rises only a little, staying under 10 cm H₂O', ['It rises steeply with every millilitre', 'It falls'], {
          ...predict,
          explanation: 'During filling the detrusor relaxes (sympathetic) and pressure stays low, about 5–10 cm H₂O, despite large increases in volume (slides 107, 110).',
        }),
        set: { volume: 350 },
        watch: 'pressure',
        expect: [
          { readout: 'pressure', change: 'up' },
          { readout: 'pressure', equals: 9.4, tolerance: 0.07 },
        ],
      },
      {
        question: mcq('s6-02', 'voiding-reflex', 'At 400 ml you decide to void. About how much urine is left afterwards?', 'About 50 ml', ['None at all', 'About 200 ml'], {
          ...predict,
          explanation: 'The detrusor contracts and both sphincters relax; positive feedback drives nearly complete emptying, leaving a residual of about 50 ml (slides 110–113).',
        }),
        from: { volume: 400 },
        set: { wish: 1 },
        watch: 'after',
        expect: [{ readout: 'after', equals: 50 }],
      },
      {
        question: mcq('s6-03', 'bladder-nerves', 'The pelvic nerve (S2–S4) is cut. The person tries to void at 400 ml. What happens?', 'Nothing: the detrusor cannot contract', ['Normal voiding', 'Constant leaking through a relaxed sphincter'], {
          ...predict,
          explanation: 'The parasympathetic pelvic nerve contracts the detrusor (and carries the sensation of fullness); without it the bladder cannot empty (slides 104–105).',
        }),
        from: { volume: 400, wish: 1 },
        set: { lesion: 1 },
        watch: 'voiding',
        expect: [{ readout: 'voiding', equals: 0 }],
      },
    ],
  }),

  [L(7)]: simulate({
    sim: 'acid-base',
    title: 'Acidosis, alkalosis and compensation',
    intro: 'Start a respiratory or metabolic disorder and let time pass: the lungs answer within minutes, the kidneys over days.',
    sourceRefs: rs([119, 133, 152, 153, 154, 155, 157, 159, 161]),
    predictions: [
      {
        question: direction('s7-01', 'acid-base-disorders', 'Breathing is depressed and CO₂ accumulates (respiratory acidosis), just now. What happens to the pH?', 'down', 'CO₂ forms H₂CO₃ → H⁺ + HCO₃⁻: H⁺ rises and pH falls below 7.35, with PaCO₂ above 45 (slides 133, 153).'),
        set: { disorder: 1 },
        watch: 'ph',
        expect: [
          { readout: 'ph', change: 'down' },
          { readout: 'paco2', change: 'up' },
        ],
      },
      {
        question: direction('s7-02', 'renal-acid-base', 'The respiratory acidosis has lasted three days. Compared with the first hour, what has happened to the plasma HCO₃⁻?', 'up', 'Renal compensation: the kidney secretes more H⁺ and makes new HCO₃⁻, slowly over days, bringing the pH back towards normal (slides 161–162).'),
        from: { disorder: 1 },
        set: { hours: 72 },
        watch: 'hco3',
        expect: [
          { readout: 'hco3', change: 'up' },
          { readout: 'ph', change: 'up' },
        ],
      },
      {
        question: direction('s7-03', 'respiratory-regulation', 'A metabolic acidosis began. Two hours later, what has happened to the PaCO₂?', 'down', 'Respiratory compensation: H⁺ drives the chemoreceptors, breathing deepens and quickens and blows off CO₂ within minutes (slides 134, 159).'),
        from: { disorder: 3 },
        set: { hours: 2 },
        watch: 'paco2',
        expect: [
          { readout: 'paco2', change: 'down' },
          { readout: 'ph', change: 'up' },
        ],
      },
    ],
  }),
};

export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  return insertSimulation(steps, simulations[lessonId]);
}

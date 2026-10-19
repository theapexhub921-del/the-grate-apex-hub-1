// Physiology → Renal Physiology — layer 1 (learn by answering) and reading
// extras. Checkpoint IDs: cN-xx; recall prompts: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, fill, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { rs, type ConceptId } from '@/data/topics/renal-physiology/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'renal-physiology-1': [
    ask(mcq('c1-01', 'urinary-system', 'Which of these is NOT a function of the kidney?', 'Producing bile', ['Secreting renin', 'Activating vitamin D', 'Secreting erythropoietin'], { explanation: 'Slide 4.' })),
    learn('Inside the kidney', ['Capsule → cortex → medulla of seven pyramids → minor calyces → major calyces → renal pelvis → ureter at the hilum.'], { sourceRefs: rs([6, 7]) }),
    ask(order('c1-02', 'kidney-structure', 'Put the urine’s route out of the kidney in order.', ['Renal pyramid', 'Minor calyx', 'Major calyx', 'Renal pelvis', 'Ureter'], { explanation: 'Slide 7.' })),
    ask(mcq('c1-03', 'nephron-types', 'Which nephrons have long loops of Henle reaching deep into the medulla?', 'Juxtamedullary nephrons (~15%)', ['Cortical nephrons (~85%)', 'All nephrons equally', 'None — all loops are short'], { explanation: 'Slide 9.' })),
    learn('The tubule', ['Bowman’s capsule → proximal convoluted tubule → loop of Henle → distal convoluted tubule → collecting duct.'], { sourceRefs: rs([15, 16, 17]) }),
    ask(match('c1-04', 'jga', 'Match each cell of the juxtaglomerular apparatus to its job.', [
      ['Granular cells', 'Secrete renin'],
      ['Macula densa', 'Sense tubular Na⁺'],
      ['Lacis cells', 'Pass signals; may secrete erythropoietin'],
    ], { explanation: 'Slides 20–21.' })),
    recall('r1-01', 'nephron-vessels', 'Trace blood from the renal artery through a juxtamedullary nephron’s vessels.', [
      'Afferent arteriole (from the renal artery) → glomerulus, a porous tuft of capillaries for filtration.',
      'Efferent arteriole carries blood away.',
      'It divides into peritubular capillaries around the tubules and, in juxtamedullary nephrons, the vasa recta.',
      'The vasa recta form hairpin loops deep in the medulla beside the loop of Henle.',
    ], rs([12, 13, 14])),
  ],

  'renal-physiology-2': [
    ask(mcq('c2-01', 'filtration-barrier', 'Why does albumin, a negatively charged protein, hardly appear in the filtrate?', 'All three layers of the barrier are negatively charged and repel anions', ['It is actively reabsorbed by the glomerular capillaries', 'It is too small and passes back into the blood', 'The efferent arteriole blocks it before it reaches the barrier'], { explanation: 'Slide 24.', skill: 'cause-effect' })),
    learn('Pressures', ['NFP = glomerular hydrostatic pressure (55) − colloid osmotic pressure (30) − capsular pressure (15) = 10 mmHg.'], { sourceRefs: rs([26, 27]) }),
    ask(fill('c2-02', 'nfp', 'If capsular pressure rises from 15 to 25 mmHg (a blocked ureter), the net filtration pressure becomes ____ mmHg.', ['0', 'zero'], { explanation: '55 − (30 + 25) = 0 (slide 26 formula).', skill: 'application' })),
    ask(mcq('c2-03', 'gfr', 'A normal adult GFR is about…', '125 mL/min (about 180 L/day)', ['5 L/min (about 7,200 L/day)', '1.5 L/day (about 1 mL/min)', '600 mL/min (about 860 L/day)'], { explanation: 'Slide 28.' })),
    learn('Autoregulation', ['Between about 80 and 180 mmHg, GFR stays steady: a stretched afferent arteriole constricts (myogenic), and extra NaCl at the macula densa triggers afferent constriction (tubuloglomerular feedback).'], { sourceRefs: rs([29, 30, 31, 32]) }),
    ask(mcq('c2-04', 'autoregulation', 'BP rises and more NaCl reaches the macula densa. What happens next?', 'ATP and adenosine constrict the afferent arteriole, bringing GFR back down', ['The efferent arteriole dilates, letting GFR rise further', 'Renin secretion rises, constricting the efferent arteriole', 'Prostaglandins dilate the afferent arteriole, raising GFR'], { explanation: 'Slides 31–32.', skill: 'prediction' })),
    ask(mcq('c2-05', 'gfr-extrinsic', 'During severe haemorrhage, what does sympathetic activity do to GFR?', 'Lowers it, by constricting the afferent arterioles', ['Raises it', 'Leaves it unchanged by autoregulation', 'Raises it by dilating the efferent arterioles'], { explanation: 'Slide 35: neural control overrides autoregulation.', skill: 'application' })),
    recall('r2-01', 'autoregulation', 'Explain the two intrinsic mechanisms that keep GFR constant when arterial pressure rises.', [
      'Myogenic: higher pressure stretches the afferent arteriole, whose smooth muscle contracts, limiting flow into the glomerulus.',
      'Tubuloglomerular feedback: higher GFR delivers more NaCl to the macula densa.',
      'The macula densa releases vasoconstrictors such as ATP and adenosine.',
      'The afferent arteriole constricts, glomerular pressure falls and GFR returns to normal.',
    ], rs([30, 31, 32])),
  ],

  'renal-physiology-3': [
    ask(mcq('c3-01', 'reabsorption-routes', 'About how much of the filtrate is reabsorbed?', '99%', ['50%', '80%', '10%'], { explanation: 'Slide 41.' })),
    learn('The engine', ['The basolateral Na⁺/K⁺-ATPase keeps cell Na⁺ low, so Na⁺ flows in from the lumen — and glucose, amino acids, water and Cl⁻ follow.'], { sourceRefs: rs([45, 46, 48]) }),
    ask(mcq('c3-02', 'tm', 'A diabetic’s blood glucose is very high and glucose appears in the urine. Why?', 'The glucose carriers are saturated — the tubular maximum is exceeded', ['The glomerulus stops filtering glucose when levels are high', 'Glucose is actively secreted into the tubule by the PCT', 'Insulin is needed for the tubule to reabsorb any glucose'], { explanation: 'Slide 47.', skill: 'application' })),
    ask(mcq('c3-03', 'regional-reabsorption', 'Where is most of the filtrate reabsorbed?', 'The proximal convoluted tubule', ['The loop of Henle', 'The distal convoluted tubule', 'The collecting duct'], { explanation: 'Slide 51: 65% of Na⁺ and water, 100% of glucose and amino acids.' })),
    learn('Fine-tuning', ['Only about 10% of NaCl and 25% of water reach the distal nephron. There, hormones set the final amounts: aldosterone (Na⁺), ADH (water), PTH (Ca²⁺), ANP (excretion).'], { sourceRefs: rs([55]) }),
    ask(mcq('c3-04', 'secretion', 'How does aldosterone increase K⁺ secretion?', 'By increasing Na⁺/K⁺ pumps and apical K⁺ channels', ['By blocking K⁺ channels', 'By increasing K⁺ reabsorption in the PCT', 'By lowering GFR'], { explanation: 'Slides 61–62.', skill: 'cause-effect' })),
    recall('r3-01', 'sodium-reabsorption', 'Explain how active sodium transport drives the reabsorption of glucose, water and chloride.', [
      'The basolateral Na⁺/K⁺-ATPase pumps Na⁺ out of the cell, keeping cell Na⁺ low.',
      'Na⁺ enters passively from the lumen down this gradient.',
      'Glucose and amino acids are co-transported with Na⁺ (secondary active transport).',
      'The solute movement creates an osmotic gradient: water follows through aquaporins.',
      'The electrical gradient draws Cl⁻ along.',
    ], rs([45, 46, 48, 49])),
  ],

  'renal-physiology-4': [
    ask(mcq('c4-01', 'countercurrent-multiplier', 'What is the descending limb of the loop of Henle permeable to?', 'Water, not solute', ['Solute, not water', 'Both', 'Neither'], { explanation: 'Slide 66.' })),
    learn('Building the gradient', ['Water leaves the descending limb; NaCl is pumped out of the water-tight ascending limb. The filtrate peaks at ~1200 mOsm at the bend and leaves the loop at ~100 mOsm.'], { sourceRefs: rs([66, 67]) }),
    ask(mcq('c4-02', 'countercurrent-multiplier', 'The fluid entering the distal tubule is about 100 mOsm. Why is it hypotonic?', 'NaCl was removed in the ascending limb, which water cannot leave', ['Water was added in the ascending limb from the medulla', 'ADH dilutes it by adding water in the descending limb', 'Urea is secreted into it, drawing water into the tubule'], { explanation: 'Slide 67.', skill: 'cause-effect' })),
    ask(mcq('c4-03', 'countercurrent-exchanger', 'What is the job of the vasa recta in concentrating urine?', 'To supply the medulla without washing out its gradient', ['To create the gradient by pumping NaCl into the medulla', 'To secrete ADH directly into the medullary interstitium', 'To filter plasma a second time in the deep medulla'], { explanation: 'Slides 72–74.' })),
    learn('ADH', ['ADH inserts aquaporins into collecting duct principal cells via cAMP, so water can leave into the concentrated medulla.'], { sourceRefs: rs([78]) }),
    ask(match('c4-04', 'diuretics', 'Match each diuretic to its action.', [
      ['Lasix', 'Blocks the Na⁺-K⁺-2Cl⁻ co-transporter'],
      ['Alcohol', 'Inhibits ADH secretion'],
      ['Caffeine', 'Inhibits Na⁺ reabsorption'],
      ['Glucose in diabetes', 'Osmotic — not reabsorbed, carries water out'],
    ], { explanation: 'Slides 81–82.' })),
    recall('r4-01', 'countercurrent-multiplier', 'Explain how the loop of Henle creates a concentrated medulla.', [
      'The loops of juxtamedullary nephrons run deep into the medulla with flow in opposite directions.',
      'The descending limb is permeable to water: water leaves into the concentrated interstitium, so filtrate reaches ~1200 mOsm at the bend.',
      'The ascending limb is impermeable to water but pumps out NaCl (Na⁺-K⁺-2Cl⁻ in the thick part), concentrating the interstitium and diluting the filtrate to ~100 mOsm.',
      'Urea recycling adds to the gradient; the vasa recta preserve it.',
    ], rs([66, 67, 68])),
  ],

  'renal-physiology-5': [
    ask(fill('c5-01', 'clearance', 'Urine [X] = 10 mg/mL, urine flow = 2 mL/min, plasma [X] = 0.2 mg/mL. The clearance of X is ____ mL/min.', ['100'], { explanation: 'UV/P = 10 × 2 / 0.2 = 100 (slide 84).', skill: 'application' })),
    learn('Inulin is the yardstick', ['Inulin is filtered and nothing else, so its clearance equals GFR. Compare any substance with it.'], { sourceRefs: rs([85, 86]) }),
    ask(mcq('c5-02', 'gfr-measurement', 'A substance has a clearance of 200 mL/min when inulin clearance is 125. What does the tubule do to it?', 'Secretes it', ['Reabsorbs it', 'Neither', 'Destroys it'], { explanation: 'Slide 86.', skill: 'pathway-reasoning' })),
    ask(mcq('c5-03', 'gfr-measurement', 'Why is creatinine used to estimate GFR in practice?', 'It is endogenous, freely filtered and not reabsorbed', ['It is completely reabsorbed', 'It is the only substance cleared by the kidney', 'It measures renal blood flow exactly'], { explanation: 'Slides 86–87.' })),
    ask(mcq('c5-04', 'rpf', 'Renal plasma flow is 600 mL/min and the haematocrit is 0.4. What is renal blood flow?', '1000 mL/min', ['240 mL/min', '600 mL/min', '1500 mL/min'], { explanation: 'RBF = RPF/(1 − Hct) = 600/0.6 (slide 89).', skill: 'application' })),
    ask(mcq('c5-05', 'urine', 'Which solute is present in the highest concentration in normal urine?', 'Urea', ['Sodium', 'Glucose', 'Creatinine'], { explanation: 'Slide 96.' })),
    recall('r5-01', 'gfr-measurement', 'Explain how comparing a substance’s clearance with inulin’s shows how the tubule handles it.', [
      'Inulin is filtered but not reabsorbed, stored or secreted, so its clearance equals GFR (~125 mL/min).',
      'Clearance less than inulin: the substance is reabsorbed (zero = completely reabsorbed).',
      'Equal: no net reabsorption or secretion.',
      'Greater: the tubules secrete it.',
    ], rs([85, 86])),
  ],

  'renal-physiology-6': [
    ask(mcq('c6-01', 'bladder', 'What is the muscle of the bladder wall called?', 'The detrusor', ['The trigone', 'The rugae', 'The levator ani'], { explanation: 'Slide 99.' })),
    learn('Three nerve supplies', ['Sympathetic (hypogastric, T12–L2) stores; parasympathetic (pelvic, S2–S4) voids; somatic (pudendal, S2–S4) holds the external sphincter shut voluntarily.'], { sourceRefs: rs([103, 104]) }),
    ask(match('c6-02', 'bladder-nerves', 'Match each nerve to its effect on the bladder.', [
      ['Hypogastric (sympathetic)', 'Relaxes the detrusor, closes the internal sphincter'],
      ['Pelvic (parasympathetic)', 'Contracts the detrusor'],
      ['Pudendal (somatic)', 'Controls the external sphincter'],
    ], { explanation: 'Slides 103–104.' })),
    ask(mcq('c6-03', 'voiding-reflex', 'Where is the centre that triggers micturition?', 'The pons (Barrington’s centre)', ['The sacral cord (Onuf’s nucleus)', 'The cerebellum (vermis)', 'The hypothalamus (supraoptic)'], { explanation: 'Slide 111.' })),
    ask(mcq('c6-04', 'storage-reflex', 'How does bladder pressure behave during filling?', 'It barely rises despite large increases in volume', ['It rises steadily with every millilitre', 'It falls', 'It rises abruptly at 100 mL'], { explanation: 'Slides 107, 110: 5–10 cm H₂O during filling.' })),
    recall('r6-01', 'voiding-reflex', 'Describe the reflex pathway that empties the bladder.', [
      'Stretch excites bladder wall mechanoreceptors; afferents pass through the periaqueductal grey to the pontine micturition centre.',
      'Commands descend a reticulospinal pathway to the sacral cord.',
      'Sympathetic and pudendal outflow are inhibited: both sphincters relax.',
      'Parasympathetic outflow contracts the detrusor; this drives the receptors harder (positive feedback) until the bladder is empty.',
    ], rs([111, 112, 113])),
  ],

  'renal-physiology-7': [
    ask(mcq('c7-01', 'acid-base-basics', 'Which acid do the lungs remove?', 'Volatile acid (from CO₂)', ['Sulphuric acid (from protein)', 'Phosphoric acid (from phospholipid)', 'Uric acid (from purines)'], { explanation: 'Slide 120.' })),
    learn('Buffers buy time', ['Buffers act instantly but only short-term: they swap strong acids for weak ones. The lungs then adjust CO₂ and the kidneys excrete acid.'], { sourceRefs: rs([122, 124]) }),
    ask(mcq('c7-02', 'buffers', 'Which is the most important buffer in plasma?', 'Bicarbonate', ['Phosphate', 'Ammonia', 'Haemoglobin'], { explanation: 'Slide 123. Proteins are the most plentiful overall; phosphate matters in urine and cells.' })),
    ask(mcq('c7-03', 'renal-acid-base', 'For every H⁺ the proximal tubule secretes, what is reabsorbed?', 'One Na⁺ and one HCO₃⁻', ['One K⁺ and one Cl⁻', 'Two Na⁺ and no HCO₃⁻', 'Nothing is reabsorbed'], { explanation: 'Slide 140.' })),
    learn('Telling them apart', ['Respiratory disorders change PaCO₂ with normal HCO₃⁻; metabolic disorders change HCO₃⁻ with normal PaCO₂.'], { sourceRefs: rs([154, 155, 156, 157]) }),
    ask(mcq('c7-04', 'acid-base-disorders', 'pH 7.30, PaCO₂ 60 mmHg, HCO₃⁻ normal, after a morphine overdose. Which disorder?', 'Respiratory acidosis', ['Metabolic acidosis', 'Respiratory alkalosis', 'Metabolic alkalosis'], { explanation: 'Slides 153–154: hypoventilation.', skill: 'application', clinical: true })),
    ask(mcq('c7-05', 'acid-base-disorders', 'A patient vomits repeatedly, losing stomach acid. Which disorder develops?', 'Metabolic alkalosis', ['Metabolic acidosis', 'Respiratory acidosis', 'Respiratory alkalosis'], { explanation: 'Slide 157.', skill: 'application', clinical: true })),
    recall('r7-01', 'renal-acid-base', 'Describe the ways the kidney keeps blood pH from falling.', [
      'It reabsorbs filtered HCO₃⁻ in the proximal tubule by secreting H⁺, which converts luminal HCO₃⁻ to CO₂ and water that re-form HCO₃⁻ inside the cell.',
      'Type A intercalated cells make new HCO₃⁻ with carbonic anhydrase and pump H⁺ into urine, buffered by phosphate and ammonium.',
      'Glutamine metabolism makes NH₄⁺ (excreted) and new HCO₃⁻ (to blood).',
      'Only the kidneys remove non-volatile acids; they act slowly.',
    ], rs([137, 139, 140, 143, 146])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'renal-physiology-1': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['~1.25 million nephrons per kidney; 85% cortical, 15% juxtamedullary.', 'Vasa recta come only from juxtamedullary nephrons.', 'Granular cells make renin; the macula densa senses Na⁺.'],
    confusions: [{ confusion: 'The right kidney is higher than the left.', clarification: 'The left is slightly higher; the liver pushes the right down (slide 5).' }],
  },
  'renal-physiology-2': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['NFP = 55 − (30 + 15) = 10 mmHg.', 'GFR ≈ 125 mL/min ≈ 180 L/day.', 'Autoregulation 80–180 mmHg: myogenic and tubuloglomerular feedback.'],
    confusions: [{ confusion: 'Glomerular filtration is selective.', clarification: 'It is passive and non-selective — anything small enough passes, except that the charge barrier slows anions (slides 23–24).' }],
  },
  'renal-physiology-3': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['PCT: 65% of Na⁺ and water, all glucose and amino acids.', 'Glucose has a Tm; Na⁺ does not.', 'Aldosterone: Na⁺ in, K⁺ out.'],
    confusions: [{ confusion: 'K⁺ is only ever secreted.', clarification: 'It is reabsorbed in the PCT and secreted in the distal nephron (slide 60).' }],
  },
  'renal-physiology-4': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Descending limb: water out. Ascending limb: salt out.', '~1200 mOsm at the bend; ~100 mOsm entering the DCT.', 'Lasix blocks Na⁺-K⁺-2Cl⁻.'],
    confusions: [{ confusion: 'The vasa recta create the medullary gradient.', clarification: 'The loop of Henle creates it (multiplier); the vasa recta preserve it (exchanger) (slides 65, 72).' }],
  },
  'renal-physiology-5': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Clearance = UV/P.', 'Inulin clearance = GFR; PAH clearance ≈ RPF.', 'RBF = RPF / (1 − Hct).'],
    confusions: [{ confusion: 'Creatinine clearance equals GFR exactly.', clarification: 'Creatinine is slightly secreted, so it overestimates GFR by about 10% (slide 87).' }],
  },
  'renal-physiology-6': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Sympathetic stores, parasympathetic voids.', 'Pudendal nerve (S2–S4, Onuf’s nucleus): external sphincter.', 'Pontine micturition (Barrington’s) centre.'],
    confusions: [{ confusion: 'Sympathetic stimulation empties the bladder.', clarification: 'It relaxes the detrusor and closes the bladder neck — storage (slide 104).' }],
  },
  'renal-physiology-7': {
    estimatedMinutes: 14,
    xp: 25,
    highYield: ['Bicarbonate is the main plasma buffer.', 'Respiratory: PaCO₂ abnormal. Metabolic: HCO₃⁻ abnormal.', 'Only the kidneys remove non-volatile acid.'],
    confusions: [{ confusion: 'The lungs can correct a metabolic alkalosis as well as an acidosis.', clarification: 'Compensation for alkalosis is limited: breathing can only be slowed so far (slide 160).' }],
  },
};

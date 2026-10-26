import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'renal-physiology-2': [
    { term: 'Glomerular filtration', meaning: 'The first step of urine formation: water and small solutes pass into the capsule.' },
    { term: 'Podocytes', meaning: 'Cells of the filtration barrier, with filtration slits between their feet.' },
    { term: 'Net filtration pressure', meaning: 'NFP: glomerular pressure minus the pressures opposing filtration (about 10 mmHg).' },
    { term: 'GFR', meaning: 'Glomerular filtration rate: filtrate made each minute, about 125 mL/min.' },
    { term: 'Tubuloglomerular feedback', meaning: 'The macula densa senses NaCl and adjusts the afferent arteriole.' },
    { term: 'Macula densa', meaning: 'Cells that sense NaCl in the filtrate.' },
  ],
  'renal-physiology-4': [
    { term: 'Countercurrent', meaning: 'Fluids flowing in opposite directions in parallel tubes lying close together.' },
    { term: 'Loop of Henle', meaning: 'Its descending and ascending limbs build the medulla’s osmotic gradient.' },
    { term: 'Vasa recta', meaning: 'Blood vessels that feed the medulla without washing out its gradient.' },
    { term: 'ADH', meaning: 'Vasopressin: inserts aquaporins in the collecting duct so water is kept.' },
    { term: 'Aquaporins', meaning: 'Water channels that let water leave the collecting duct.' },
    { term: 'Diuretic', meaning: 'Anything that increases urine output.' },
  ],
  'renal-physiology-5': [
    { term: 'Renal clearance', meaning: 'The volume of plasma cleared of a substance each minute: U × V / P.' },
    { term: 'Inulin', meaning: 'Filtered but not reabsorbed or secreted, so its clearance equals GFR.' },
    { term: 'Creatinine', meaning: 'A product of muscle metabolism whose clearance estimates GFR in practice.' },
    { term: 'Renal plasma flow', meaning: 'Measured with PAH, which the kidney removes almost completely.' },
    { term: 'Specific gravity', meaning: 'How dense urine is compared with water: normally 1.001–1.035.' },
  ],
  'renal-physiology-6': [
    { term: 'Micturition', meaning: 'Emptying the bladder.' },
    { term: 'Detrusor', meaning: 'The smooth muscle of the bladder wall.' },
    { term: 'External urethral sphincter', meaning: 'Skeletal muscle under voluntary control (pudendal nerve).' },
    { term: 'Pelvic nerve', meaning: 'Parasympathetic (S2–S4): contracts the detrusor for voiding.' },
    { term: 'Pontine micturition centre', meaning: 'Barrington’s centre in the pons, which coordinates voiding.' },
  ],
  'renal-physiology-7': [
    { term: 'Acid–base balance', meaning: 'Keeping free H⁺ in body fluids within the pH range 7.36–7.44.' },
    { term: 'Buffer', meaning: 'Minimises the pH change when acid or base is added.' },
    { term: 'Bicarbonate', meaning: 'The most important buffer in plasma and ECF.' },
    { term: 'Volatile', meaning: 'Acid from CO₂, removed by the lungs.' },
    { term: 'Metabolic acidosis', meaning: 'Low bicarbonate and pH, with normal PaCO₂.' },
    { term: 'Compensation', meaning: 'The lungs or kidneys correcting the other’s disturbance.' },
  ],
};

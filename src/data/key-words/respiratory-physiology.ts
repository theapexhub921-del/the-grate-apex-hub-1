import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'respiratory-physiology-2': [
    { term: 'Tidal volume', meaning: 'Air moved in or out in quiet breathing (about 500 ml).' },
    { term: 'Residual volume', meaning: 'Air left in the lungs after a maximal expiration.' },
    { term: 'Vital capacity', meaning: 'Air that can be breathed out after a maximal inspiration: IRV + TV + ERV.' },
    { term: 'Functional residual capacity', meaning: 'ERV + RV: the air left after a normal breath out.' },
    { term: 'Spirometry', meaning: 'Measuring lung volumes (it cannot measure the residual volume).' },
    { term: 'FEV1', meaning: 'Air forced out in one second, normally about 83% of the vital capacity.' },
  ],
  'respiratory-physiology-4': [
    { term: 'Ventilation', meaning: 'Moving air between the environment and the lungs.' },
    { term: 'Dead space', meaning: 'The part of the airways that does not exchange gas with blood.' },
    { term: 'Anatomical dead space', meaning: 'Air that stays in the conducting airways.' },
    { term: 'Alveolar ventilation', meaning: 'The air that actually reaches the alveoli: about 350 of every 500 ml.' },
    { term: 'Pulmonary circulation', meaning: 'The low-pressure, high-flow circulation through the lungs.' },
    { term: 'Hypoxic pulmonary vasoconstriction', meaning: 'Lung vessels constrict in hypoxia, moving blood to areas that need it.' },
  ],
  'respiratory-physiology-7': [
    { term: 'Diffusion', meaning: 'Net movement of a gas from high to low partial pressure.' },
    { term: 'Partial pressure', meaning: 'The pressure of one gas, proportional to its concentration.' },
    { term: 'Respiratory membrane', meaning: 'The alveolar and capillary walls together, across which gas is exchanged.' },
    { term: 'Diffusing capacity', meaning: 'Gas diffusing across the membrane each minute per 1 mmHg of pressure difference.' },
    { term: 'Ventilation–perfusion ratio', meaning: 'V/Q: how well ventilation matches blood flow in an area of lung.' },
    { term: 'Shunt', meaning: 'Blood passing through without being ventilated (V/Q below 1).' },
  ],
};

import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'blood-coagulation-and-fibrinolysis-3': [
    { term: 'Thrombin', meaning: 'Factor IIa: a serine esterase made when factor Xa cleaves prothrombin.' },
    { term: 'Prothrombin complex', meaning: 'Factors II, VII, IX and X, which must be anchored to phospholipid through Ca²⁺.' },
    { term: 'γ-Carboxyglutamate', meaning: 'A strong calcium-binding residue, made after translation by a vitamin K-dependent system.' },
    { term: 'Warfarin', meaning: 'A vitamin K antagonist used as an anticoagulant.' },
    { term: 'Haemophilia A', meaning: 'X-linked bleeding disorder from an ineffective factor VIII (over 80% of haemophiliacs).' },
    { term: 'Von Willebrand factor', meaning: 'A blood glycoprotein that binds factor VIII and helps platelets stick to wounds.' },
  ],
  'blood-coagulation-and-fibrinolysis-4': [
    { term: 'Antithrombin III', meaning: 'A plasma protein that irreversibly inactivates thrombin and factors IXa, Xa and XIa.' },
    { term: 'Heparin', meaning: 'A negatively charged glycosaminoglycan that speeds antithrombin III about a hundred-fold.' },
    { term: 'Plasmin', meaning: 'The enzyme that lyses clots, breaking fibrin into soluble fragments; made from plasminogen.' },
    { term: 'Fibrin degradation products', meaning: 'The small soluble peptides plasmin makes from fibrin.' },
    { term: 'Tissue plasminogen activator', meaning: 'TPA: released from damaged vessels; binds fibrin and activates plasminogen on the clot.' },
    { term: 'Aspirin', meaning: 'Blocks COX-1, stopping platelets making thromboxane A₂.' },
  ],
};

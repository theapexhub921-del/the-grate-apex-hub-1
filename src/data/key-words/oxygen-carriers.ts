import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'oxygen-carriers-1': [
    { term: 'Myoglobin', meaning: 'A reserve supply of oxygen that helps oxygen move within red muscle.' },
    { term: 'Haem group', meaning: 'The non-polypeptide unit that lets both carriers bind oxygen.' },
    { term: 'Coordination positions', meaning: 'The bonds the haem iron can make: four to the ring’s nitrogens, a fifth and sixth on each side of the plane.' },
    { term: 'Ferrous', meaning: 'Iron in the +2 state: the only form that binds oxygen.' },
    { term: 'Methaemoglobin', meaning: 'Haemoglobin with ferric (+3) iron; it does not bind oxygen.' },
    { term: 'α-helix', meaning: 'The coiled segments that make up about 75% of myoglobin, eight of them labelled A to H.' },
  ],
  'oxygen-carriers-3': [
    { term: 'Haemoglobin A', meaning: 'Normal adult haemoglobin: four chains, α₂β₂.' },
    { term: 'Allosteric', meaning: 'An interaction between two separate sites on a protein: H⁺, CO₂ and 2,3-DPG bind far from the haems yet change their O₂ affinity.' },
    { term: 'Deoxyhaemoglobin', meaning: 'The taut (T) form, with bonds and salt links between subunits intact.' },
    { term: 'Co-operative', meaning: 'Binding in which one O₂ makes the next bind more easily: haemoglobin’s, not myoglobin’s.' },
    { term: 'P50', meaning: 'The pO₂ at half saturation: about 1 torr for myoglobin, 26 torr for haemoglobin.' },
  ],
  'oxygen-carriers-4': [
    { term: 'Bohr–Haldane effect', meaning: 'Lower pH and higher pCO₂ shift the curve right, so haemoglobin releases O₂ at the tissues.' },
    { term: '2,3-BPG', meaning: 'Binds the central cavity of deoxyhaemoglobin and stabilises the T state, lowering O₂ affinity.' },
    { term: 'Central cavity', meaning: 'Where one 2,3-BPG binds, held by three positive groups on each β chain.' },
    { term: 'Fetal haemoglobin', meaning: 'HbF (α₂γ₂): binds 2,3-BPG less strongly, so it holds O₂ more tightly than HbA.' },
    { term: 'Saturation', meaning: 'How much of haemoglobin’s oxygen-binding sites are filled, from 0 to 1.' },
  ],
};

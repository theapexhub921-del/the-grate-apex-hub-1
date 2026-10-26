import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'free-radicals-and-oxygen-toxicity-3': [
    { term: 'Oxidants', meaning: 'Another name for radicals: they injure membranes by oxidation.' },
    { term: 'Lipid peroxidation', meaning: 'Radicals “steal” electrons from membrane lipids, making the membrane leaky.' },
    { term: 'PUFAs', meaning: 'Polyunsaturated fatty acids: their reactive hydrogens make them the most easily attacked.' },
    { term: '8-hydroxyguanine', meaning: 'A mutagenic lesion made when a hydroxyl radical attacks guanine.' },
    { term: 'NF-κB', meaning: 'Transcription factors that ROS can switch on, linking them to inflammation and disease.' },
    { term: 'Oxidised LDL', meaning: 'Taken up avidly by macrophages; it promotes atherosclerosis.' },
  ],
  'free-radicals-and-oxygen-toxicity-4': [
    { term: 'Antioxidant', meaning: 'A molecule stable enough to donate an electron to a radical and neutralise it.' },
    { term: 'Oxidative stress', meaning: 'When radicals outweigh antioxidants.' },
    { term: 'Superoxide dismutase', meaning: 'SOD: turns superoxide into hydrogen peroxide.' },
    { term: 'Catalase', meaning: 'Breaks hydrogen peroxide down to water.' },
    { term: 'Glutathione peroxidase', meaning: 'A selenium enzyme that removes H₂O₂ and lipid peroxides using GSH.' },
    { term: 'Preventive antioxidants', meaning: 'Binding proteins such as transferrin and caeruloplasmin that keep metal ions bound.' },
  ],
  'free-radicals-and-oxygen-toxicity-5': [
    { term: 'Carcinogenesis', meaning: 'Cancer formation: initiation, promotion and progression, each helped by radicals.' },
    { term: 'Initiation', meaning: 'The first stage: radicals damage DNA, activating proto-oncogenes.' },
    { term: 'Reperfusion injury', meaning: 'Damage when blood returns to a starved organ, triggered by xanthine oxidase.' },
    { term: 'Xanthine oxidase', meaning: 'Triggers ischaemia–reperfusion injury; allopurinol inhibits it.' },
    { term: 'Biomarkers', meaning: 'Measurable signs of antioxidant status or oxidation, such as SOD or malondialdehyde.' },
  ],
};

import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple", for the lessons whose steps and sections name none
// (owner, 2026-10-25). Each word and meaning comes from that lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'fatty-acid-biosynthesis-2': [
    { term: 'Anabolic pathway', meaning: 'A pathway that builds a larger molecule from smaller ones, costing energy and reducing power.' },
    { term: 'Cytosol', meaning: 'Where fatty acid synthesis takes place.' },
    { term: 'Fed conditions', meaning: 'After a meal, when the body has more fuel than it needs and can store the extra as fat.' },
    { term: 'Malonyl-CoA', meaning: 'Acetyl-CoA “activated” by adding carbon dioxide; it drives the chain-joining step.' },
    { term: 'NADPH', meaning: 'The reducing agent used for the two reduction steps of synthesis.' },
    { term: 'Palmitate', meaning: 'The 16-carbon chain released at the end of the synthesis cycle.' },
  ],
  'fatty-acid-biosynthesis-6': [
    { term: 'β-Oxidation', meaning: 'The breakdown pathway that removes two carbons per cycle as acetyl-CoA, in the mitochondria.' },
    { term: 'ACP', meaning: 'The carrier that holds the intermediates in synthesis (β-oxidation uses coenzyme A).' },
    { term: 'FADH₂', meaning: 'Made when β-oxidation forms a double bond; NADPH is a more powerful reducing agent.' },
    { term: 'NADPH', meaning: 'The electron carrier for both reductions in synthesis.' },
    { term: 'Malonyl', meaning: 'The activated two-carbon unit synthesis adds (acetyl + CO₂).' },
  ],
  'fatty-acid-biosynthesis-7': [
    { term: 'Palmitate', meaning: 'The 16-carbon product of the fatty acid synthase complex.' },
    { term: 'Endoplasmic reticulum', meaning: 'Where the main elongation system for longer fatty acids works.' },
    { term: 'Stearoyl-CoA', meaning: 'The major (C18) product of ER elongation.' },
    { term: 'Polyunsaturated', meaning: 'Having several double bonds; most longer fatty acids are.' },
    { term: 'Mitosol', meaning: 'The mitochondrial matrix, home of a second elongation system.' },
  ],
  'fatty-acid-biosynthesis-8': [
    { term: 'Pyruvate–Malate Cycle', meaning: 'Takes acetyl groups to the cytosol and turns NADH into NADPH, coupling synthesis to glycolysis.' },
    { term: 'Citrate', meaning: 'Carries acetyl groups out of the mitochondria on a co-transporter.' },
    { term: 'ATP-citrate lyase', meaning: 'Cleaves citrate into acetyl-CoA and oxaloacetate in the cytosol, using ATP.' },
    { term: 'Malic enzyme', meaning: 'Oxidises malate to pyruvate, releasing CO₂ and producing NADPH.' },
    { term: 'Pyruvate carboxylase', meaning: 'Regenerates oxaloacetate from pyruvate in the mitochondria, using CO₂ and ATP.' },
  ],
};

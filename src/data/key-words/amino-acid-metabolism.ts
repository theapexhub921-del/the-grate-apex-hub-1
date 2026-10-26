import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'amino-acid-metabolism-2': [
    { term: 'R group', meaning: 'The side chain that differs between amino acids and decides their class and solubility.' },
    { term: 'Essential amino acids', meaning: 'The ten humans cannot make and must eat.' },
    { term: 'Conditionally essential', meaning: 'Made by the body but sometimes not enough: arginine, histidine, tyrosine, cysteine.' },
    { term: 'Glucogenic', meaning: 'Broken down to compounds that can make glucose (pyruvate, oxaloacetate…).' },
    { term: 'Ketogenic', meaning: 'Broken down to acetyl-CoA or acetoacetyl-CoA; leucine and lysine are purely ketogenic.' },
    { term: 'Branched-chain amino acids', meaning: 'Leucine, isoleucine and valine.' },
  ],
  'amino-acid-metabolism-3': [
    { term: 'Amino acid pool', meaning: 'The amino acids in the body, used for protein synthesis or metabolites.' },
    { term: 'Decarboxylation', meaning: 'Removing CO₂ to make amines such as histamine, dopamine and serotonin.' },
    { term: 'Transamination', meaning: 'Moving an amino group from an amino acid to a keto acid.' },
    { term: 'Pyridoxal phosphate', meaning: 'PLP, from vitamin B6: the prosthetic group of aminotransferases.' },
    { term: 'Glutamate dehydrogenase', meaning: 'Releases ammonia from glutamate in liver mitochondria.' },
    { term: 'Transdeamination', meaning: 'Transamination coupled with glutamate dehydrogenase: a route to deaminate all amino acids.' },
  ],
  'amino-acid-metabolism-4': [
    { term: 'Glutamine synthetase', meaning: 'Adds ammonium to glutamate using ATP, making glutamine.' },
    { term: 'Glutaminase', meaning: 'Releases the ammonia from glutamine in the liver and kidney.' },
    { term: 'Alanine–glucose cycle', meaning: 'Muscle sends nitrogen to the liver as alanine; the liver returns glucose.' },
    { term: 'Acidosis', meaning: 'When more glutamine goes to the kidney, conserving bicarbonate.' },
    { term: 'Encephalopathy', meaning: 'Brain dysfunction that ammonia accumulation can cause.' },
    { term: 'Ureotelic', meaning: 'Excreting nitrogen as urea, as land animals do.' },
  ],
  'amino-acid-metabolism-5': [
    { term: 'Urea cycle', meaning: 'Five steps, mainly in the liver, that turn ammonia into urea.' },
    { term: 'Carbamoyl phosphate synthetase I', meaning: 'The first, mitochondrial step; it needs N-acetylglutamate.' },
    { term: 'N-acetylglutamate', meaning: 'The allosteric activator that switches the cycle on when protein intake is high.' },
    { term: 'Citrulline', meaning: 'Made in the mitochondria from carbamoyl phosphate and ornithine; it leaves for the cytosol.' },
    { term: 'Fumarate', meaning: 'Released by argininosuccinate lyase; it links the urea cycle to the citric acid cycle.' },
    { term: 'Hyperammonaemia', meaning: 'Too much ammonia in the blood: lethargy, convulsions and coma.' },
  ],
  'amino-acid-metabolism-6': [
    { term: 'Branched-chain amino acids', meaning: 'Leucine, isoleucine and valine; their breakdown starts in muscle.' },
    { term: 'Branched-chain α-keto acid dehydrogenase complex', meaning: 'One complex handles all three keto acids; it resembles pyruvate dehydrogenase.' },
    { term: 'Maple syrup urine disease', meaning: 'The keto acid complex fails; urine and sweat smell of maple syrup.' },
    { term: 'Isovaleric acidaemia', meaning: 'A defect in the leucine pathway; a “cheesy” odour.' },
    { term: 'Phenylalanine hydroxylase', meaning: 'Makes tyrosine from phenylalanine with tetrahydrobiopterin; deficient in PKU.' },
  ],
  'amino-acid-metabolism-7': [
    { term: 'Catecholamines', meaning: 'Dopamine, noradrenaline and adrenaline, made from tyrosine.' },
    { term: 'Melanin', meaning: 'The pigment made from tyrosine; missing in albinism.' },
    { term: 'Alkaptonuria', meaning: 'Homogentisic acid cannot be broken down; urine darkens on standing.' },
    { term: 'Serotonin', meaning: '5-HT, made from tryptophan: sleep, mood and appetite.' },
    { term: 'Melatonin', meaning: 'Made from serotonin, mainly in the pineal gland, under the control of light.' },
    { term: 'Histidinaemia', meaning: 'Histidase deficiency: histidine rises; benign in most people.' },
  ],
  'amino-acid-metabolism-8': [
    { term: 'S-adenosylmethionine', meaning: 'SAM: made from methionine, the principal methyl donor.' },
    { term: 'Trans-sulfuration pathway', meaning: 'Moves sulfur from homocysteine to serine, making cystathionine and then cysteine.' },
    { term: 'Homocysteine', meaning: 'Made from methionine; prothrombotic when it builds up.' },
    { term: 'Homocystinuria', meaning: 'Cystathionine β-synthase deficiency: homocysteine accumulates.' },
    { term: 'Taurine', meaning: 'Made from cysteine; conjugates bile acids.' },
  ],
  'amino-acid-metabolism-9': [
    { term: 'One-carbon', meaning: 'Single carbon units (formyl, methylene, methyl…) passed between molecules.' },
    { term: 'Biotin', meaning: 'Carries CO₂ in carboxylation reactions.' },
    { term: 'Tetrahydrofolate', meaning: 'FH₄: carries formyl, methylene and methyl groups.' },
    { term: 'Dihydrofolate reductase', meaning: 'Reduces folate to tetrahydrofolate using NADPH.' },
    { term: 'Sulfonamides', meaning: 'Antibacterials that block the bacterial enzyme making folate from PABA.' },
  ],
};

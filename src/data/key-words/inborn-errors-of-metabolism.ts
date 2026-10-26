import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'inborn-errors-of-metabolism-1': [
    { term: 'Inborn error', meaning: 'A defect present from birth: a defective enzyme blocks a step of metabolism.' },
    { term: 'One gene → one enzyme', meaning: 'Garrod’s idea, from studying alkaptonuria.' },
    { term: 'Metabolic block', meaning: 'A failed enzyme step: substrate piles up, product is lacking and the substrate is diverted.' },
    { term: 'Toxic metabolite', meaning: 'What a piled-up substrate can be pushed into down a side route.' },
    { term: 'Remote product', meaning: 'Made several steps beyond the block, so it is lacking even though its own enzyme works.' },
  ],
  'inborn-errors-of-metabolism-2': [
    { term: 'Chromatography', meaning: 'With electrophoresis, the main technique for detecting inborn errors chemically.' },
    { term: 'Prenatal diagnosis', meaning: 'Diagnosis before birth, from fibroblasts cultured from amniotic fluid.' },
    { term: 'Chorionic villus sampling', meaning: 'Used in the first trimester for prenatal screening.' },
    { term: 'Neonatal screening', meaning: 'Testing newborns for treatable diseases before damage is done.' },
    { term: 'Galactosaemia', meaning: 'One of the conditions UK newborns are screened for.' },
  ],
  'inborn-errors-of-metabolism-3': [
    { term: 'Failure to thrive', meaning: 'One of the warning signs that should make you suspect an inborn error in an infant.' },
    { term: 'Hepatosplenomegaly', meaning: 'An enlarged liver and spleen: another warning sign.' },
    { term: 'Metabolic acidosis', meaning: 'A suggestive laboratory finding in an infant with an inborn error.' },
    { term: 'Plasma ammonia', meaning: 'One of the routine tests for a suspected IEM.' },
    { term: 'Enzyme assays', meaning: 'Specialised tests that confirm the defect.' },
  ],
  'inborn-errors-of-metabolism-4': [
    { term: 'Phenylketonuria', meaning: 'PKU: phenylalanine hydroxylase fails, so phenylalanine is not made into tyrosine.' },
    { term: 'Autosomal recessive', meaning: 'Both copies of the gene must be faulty; carrier parents have a 25% chance of an affected child.' },
    { term: 'Methylmalonic aciduria', meaning: 'Methylmalonyl-CoA mutase (which needs vitamin B12) fails; severe ketoacidosis.' },
    { term: 'Tay-Sachs disease', meaning: 'Without hexosaminidase A, GM2 builds up in neurons; a cherry red spot in the macula.' },
    { term: 'Severe combined immunodeficiency', meaning: 'SCID: without adenosine deaminase, dATP builds up and is toxic to lymphocytes.' },
  ],
  'inborn-errors-of-metabolism-5': [
    { term: 'Transport proteins', meaning: 'Carriers and channels; when one fails, a substance cannot reach where it is needed.' },
    { term: 'Thalassaemia', meaning: 'Deletions or mutations of the α or β subunit of haemoglobin A.' },
    { term: 'CFTR', meaning: 'The chloride transporter that fails in cystic fibrosis, leaving dehydrated mucus.' },
    { term: 'Cystinosis', meaning: 'Cystine is trapped inside lysosomes because its transporter fails.' },
    { term: 'Menkes syndrome', meaning: 'X-linked failure of copper transport (ATP7A); brittle “kinky” hair.' },
  ],
  'inborn-errors-of-metabolism-6': [
    { term: 'Osteogenesis imperfecta', meaning: 'A glycine substitution in type I collagen: frequent fractures and bluish whites of the eyes.' },
    { term: 'Zellweger syndrome', meaning: 'A defect in peroxisome biogenesis; very-long-chain fatty acids accumulate.' },
    { term: 'Haemophilia A', meaning: 'Without factor VIII the platelet plug is weak and bleeding continues.' },
    { term: 'Tumour suppressor', meaning: 'A growth-control protein such as Rb; its loss causes retinoblastoma.' },
    { term: 'Familial hypercholesterolaemia', meaning: 'Caused by a defective LDL receptor.' },
  ],
};

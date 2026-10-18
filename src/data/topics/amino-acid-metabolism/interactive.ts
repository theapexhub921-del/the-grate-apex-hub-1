// Biochemistry → Amino Acid Metabolism — layer 1 (learn by answering) and
// reading-layer extras. Checkpoint IDs: cN-xx; recall: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { a1, a2, a3, a4, type ConceptId } from '@/data/topics/amino-acid-metabolism/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'amino-acid-metabolism-1': [
    ask(mcq('c1-01', 'aa-structure', 'Which amino acid has an α-carbon that is not chiral?', 'Glycine', ['Alanine', 'Serine', 'Proline'], { explanation: 'AA1 slide 6: glycine’s R group is hydrogen.' })),
    learn('Charge depends on pH', ['With pKa values of about 2 (COOH) and 9 (NH₂), amino acids are zwitterions at physiological pH. Below the pI they are cations; above it, anions.'], { sourceRefs: a1([9, 22, 24]) }),
    ask(mcq('c1-02', 'aa-ionisation', 'An amino acid is placed in a solution with pH below its pI. What is its net charge?', 'Positive', ['Negative', 'Zero', 'It depends on the R group only'], { explanation: 'AA1 slide 24.', skill: 'cause-effect' })),
    ask(match('c1-03', 'protein-structure', 'Match each level of protein structure to what holds it.', [
      ['Primary', 'Peptide bonds'],
      ['Secondary', 'Hydrogen bonds in the backbone'],
      ['Tertiary', 'Non-covalent bonds between side chains'],
      ['Quaternary', 'Bonds between subunits'],
    ], { explanation: 'AA1 slides 11–16.' })),
    recall('r1-01', 'aa-ionisation', 'Explain what a zwitterion and the isoelectric point are.', [
      'Amino acids are amphoteric: –COOH can donate a proton and –NH₂ can accept one.',
      'At physiological pH the carboxyl (pKa ≈ 2) is –COO⁻ and the amino group (pKa ≈ 9) is –NH₃⁺: a zwitterion.',
      'The pI is the pH of no net charge, where the amino acid does not move in an electric field; below it the amino acid is positive, above it negative.',
    ], a1([9, 22, 24])),
  ],
  'amino-acid-metabolism-2': [
    ask(multi('c2-01', 'r-group-classes', 'Which are the positively charged (basic) amino acids? Select all that apply.', ['Lysine', 'Arginine', 'Histidine'], ['Aspartate', 'Glutamine'], { explanation: 'AA1 slide 38.' })),
    learn('What we must eat', ['Humans make ten amino acids and must eat the other ten. Arginine, histidine, tyrosine and cysteine are conditionally essential.'], { sourceRefs: a1([39, 44]) }),
    ask(mcq('c2-02', 'essential-aa', 'Why is tyrosine essential in a child with PKU?', 'They cannot make it from phenylalanine', ['It is destroyed in the gut', 'It is lost in urine', 'The child needs more for growth'], { explanation: 'AA1 slide 44.', skill: 'cause-effect' })),
    ask(multi('c2-03', 'glucogenic-ketogenic', 'Which amino acids are purely ketogenic? Select all that apply.', ['Leucine', 'Lysine'], ['Isoleucine', 'Valine', 'Tyrosine'], { explanation: 'AA1 slide 48.' })),
    recall('r2-01', 'glucogenic-ketogenic', 'Distinguish glucogenic from ketogenic amino acids, with examples.', [
      'Glucogenic amino acids give pyruvate, succinyl-CoA, α-ketoglutarate, fumarate or oxaloacetate — e.g. alanine, aspartate, valine, methionine.',
      'Ketogenic amino acids give acetyl-CoA or acetoacetyl-CoA; leucine and lysine are purely ketogenic.',
      'Isoleucine, phenylalanine, tryptophan and tyrosine are both.',
    ], a1([47, 48])),
  ],
  'amino-acid-metabolism-3': [
    ask(mcq('c3-01', 'decarboxylation', 'Decarboxylation of histidine gives…', 'Histamine', ['Dopamine', 'Serotonin', 'GABA'], { explanation: 'AA1 slide 52.' })),
    ask(mcq('c3-02', 'transamination', 'Which vitamin-derived cofactor do aminotransferases need?', 'Pyridoxal phosphate (B6)', ['Thiamine pyrophosphate (B1)', 'FAD (B2)', 'Biotin'], { explanation: 'AA1 slide 56.' })),
    learn('Collecting nitrogen on glutamate', ['Transamination funnels amino groups onto α-ketoglutarate to make glutamate. Glutamate dehydrogenase then releases the ammonia. Together they are transdeamination.'], { sourceRefs: [...a1([62]), ...a3([7])] }),
    ask(mcq('c3-03', 'oxidative-deamination', 'ATP is plentiful in a liver cell. What happens to glutamate dehydrogenase?', 'It is inhibited', ['It is activated', 'It reverses permanently', 'It is degraded'], { explanation: 'AA1 slides 61–62: ATP and GTP inhibit, ADP and GDP activate.', skill: 'cause-effect' })),
    recall('r3-01', 'transamination', 'Describe transamination and its limits.', [
      'An amino group moves from an amino acid to a keto acid, forming a new amino acid.',
      'Aminotransferases such as AST and ALT use PLP (vitamin B6), which carries the amino group as pyridoxamine phosphate.',
      'All α-amino acids except lysine and threonine can be transaminated; proline cannot take part in PLP reactions.',
    ], a1([56, 57, 59])),
  ],
  'amino-acid-metabolism-4': [
    ask(mcq('c4-01', 'glu-gln', 'Which enzyme adds ammonium to glutamate using ATP?', 'Glutamine synthetase', ['Glutaminase', 'Glutamate dehydrogenase', 'Alanine aminotransferase'], { explanation: 'AA3 slide 8.' })),
    ask(mcq('c4-02', 'kidney-ammonia', 'In acidosis, why is glutamine sent to the kidney rather than the liver?', 'Making urea in the liver uses bicarbonate; renal NH₄⁺ excretion conserves it', ['The liver cannot take up glutamine in acidosis', 'The kidney makes urea faster', 'Glutamine is toxic to the liver'], { explanation: 'AA3 slide 12.', skill: 'cause-effect' })),
    learn('Muscle uses alanine', ['Muscle transaminates pyruvate to alanine. The liver turns it back to pyruvate, sends the nitrogen to urea and makes glucose that returns to muscle.'], { sourceRefs: a3([15, 18]) }),
    ask(order('c4-03', 'alanine-glucose', 'Order the alanine–glucose cycle, starting in muscle.', ['Pyruvate transaminated to alanine in muscle', 'Alanine carried in blood to the liver', 'Alanine transaminated to pyruvate; nitrogen to urea', 'Pyruvate made into glucose', 'Glucose returns to muscle'], { explanation: 'AA3 slides 15, 18.' })),
    recall('r4-01', 'ammonia-toxicity', 'Explain why ammonia is toxic to the brain.', [
      'Excess ammonia reverses glutamate dehydrogenase, draining α-ketoglutarate from the citric acid cycle.',
      'ATP falls, active transport fails and the electrochemical gradient for nerve impulses is lost.',
      'GABA synthesis is impaired; extra glutamine synthesis may cause encephalopathy; Na⁺/K⁺-ATPase is inhibited.',
    ], a3([16, 17])),
  ],
  'amino-acid-metabolism-5': [
    ask(mcq('c5-01', 'urea-cycle-steps', 'Which two urea cycle steps occur in the mitochondria?', 'Carbamoyl phosphate synthetase I and ornithine transcarbamoylase', ['Argininosuccinate synthetase and lyase', 'Arginase and ornithine transcarbamoylase', 'All five'], { explanation: 'AA3 slides 23–25.' })),
    ask(order('c5-02', 'urea-cycle-steps', 'Order the urea cycle intermediates from ammonia.', ['Carbamoyl phosphate', 'Citrulline', 'Argininosuccinate', 'Arginine', 'Urea + ornithine'], { explanation: 'AA3 slides 24–26.' })),
    learn('The switch', ['Carbamoyl phosphate synthetase I only works with N-acetylglutamate, made from acetyl-CoA and glutamate and stimulated by arginine — so the cycle speeds up when amino acids are plentiful.'], { sourceRefs: a3([24, 33]) }),
    ask(mcq('c5-03', 'urea-cycle-link', 'Fumarate from the urea cycle becomes which compound that can re-enter the cycle as aspartate?', 'Oxaloacetate', ['Citrulline', 'Pyruvate', 'Succinyl-CoA'], { explanation: 'AA3 slide 27.' })),
    recall('r5-01', 'urea-defects', 'Describe the consequences and management of inherited urea cycle defects.', [
      'Complete deficiency: death soon after the first protein meal; partial deficiency allows survival with management.',
      'Hyperammonaemia: lethargy, stupor, convulsions, CNS impairment, coma and death.',
      'Protein-rich diets are not tolerated; patients are given α-keto analogues of the essential amino acids.',
    ], a3([31])),
  ],
  'amino-acid-metabolism-6': [
    ask(mcq('c6-01', 'bcaa-catabolism', 'Where does most branched-chain amino acid transamination occur?', 'Skeletal muscle', ['Liver', 'Brain', 'Kidney'], { explanation: 'AA2 slide 7: about 65%.' })),
    ask(match('c6-02', 'bcaa-catabolism', 'Match each amino acid to its fate.', [
      ['Valine', 'Glucogenic (propionyl-CoA)'],
      ['Leucine', 'Strictly ketogenic'],
      ['Isoleucine', 'Both glucogenic and ketogenic'],
    ], { explanation: 'AA2 slide 10.' })),
    learn('One enzyme, three keto acids', ['A single branched-chain α-keto acid dehydrogenase handles all three keto acids. If it fails, they pile up — maple syrup urine disease.'], { sourceRefs: a2([9, 11]) }),
    ask(mcq('c6-03', 'pku', 'A baby with PKU has normal phenylalanine hydroxylase. What else could be defective?', 'Tetrahydrobiopterin or the reductase that regenerates it', ['Tyrosinase', 'Homogentisate dioxygenase', 'Branched-chain aminotransferase'], { explanation: 'AA2 slide 20.', clinical: true })),
    recall('r6-01', 'msud', 'Describe maple syrup urine disease.', [
      'Defect of the branched-chain α-keto acid dehydrogenase complex.',
      'α-Keto acids accumulate in blood and are excreted; urine and sweat smell of maple syrup.',
      'Abnormal brain development, mental retardation and death in infancy.',
      'Managed by restricting branched-chain amino acids; some cases respond to large doses of thiamine.',
    ], a2([11, 14])),
  ],
  'amino-acid-metabolism-7': [
    ask(order('c7-01', 'tyrosine-fates', 'Order catecholamine synthesis from tyrosine.', ['Tyrosine', 'L-DOPA', 'Dopamine', 'Noradrenaline', 'Adrenaline'], { explanation: 'AA2 slide 47.' })),
    ask(match('c7-02', 'tyrosine-disorders', 'Match each disorder to its deficient enzyme.', [
      ['Tyrosinaemia type I', 'Fumarylacetoacetase'],
      ['Tyrosinaemia type II', 'Tyrosine aminotransferase'],
      ['Tyrosinaemia type III', '4-Hydroxyphenylpyruvate dioxygenase'],
      ['Albinism', 'Tyrosinase'],
    ], { explanation: 'AA2 slides 29, 31, 34, 37.' })),
    learn('Alkaptonuria', ['Homogentisic acid cannot be broken down. It is excreted and darkens on standing; deposited in cartilage it causes ochronosis and later arthritis.'], { sourceRefs: a2([35, 36, 44]) }),
    ask(mcq('c7-03', 'tryptophan', 'Where is melatonin mainly made?', 'Pineal gland', ['Enterochromaffin cells', 'Platelets', 'Adrenal medulla'], { explanation: 'AA2 slide 51.' })),
    recall('r7-01', 'tyrosine-fates', 'List the metabolic fates of tyrosine.', [
      'Catabolism to acetoacetyl-CoA (and fumarate).',
      'Catecholamines: L-DOPA → dopamine → noradrenaline → adrenaline.',
      'Melanin, via dopaquinone (tyrosinase).',
      'Thyroid hormones T₄ and T₃.',
    ], a2([23, 46])),
  ],
  'amino-acid-metabolism-8': [
    ask(mcq('c8-01', 'methionine', 'Which sulfur amino acids are incorporated into proteins?', 'Methionine and cysteine', ['Homocysteine and taurine', 'Methionine and taurine', 'Cysteine and homocysteine'], { explanation: 'AA4 slide 5.' })),
    ask(order('c8-02', 'methionine', 'Order the trans-sulfuration pathway.', ['Methionine', 'S-Adenosylmethionine', 'S-Adenosylhomocysteine', 'Homocysteine', 'Cystathionine', 'Cysteine'], { explanation: 'AA4 slides 9–10.' })),
    learn('Where the block is', ['Homocystinuria blocks cystathionine β-synthase, so homocysteine and methionine build up. Cystathioninuria blocks the next enzyme, γ-lyase.'], { sourceRefs: a4([11, 14]) }),
    ask(mcq('c8-03', 'homocystinuria', 'Why does homocystinuria cause connective tissue defects?', 'Homocysteine interferes with collagen cross-linking via lysyl semialdehydes', ['It blocks vitamin C', 'It destroys elastin', 'It inhibits collagen gene transcription'], { explanation: 'AA4 slide 12.', skill: 'cause-effect' })),
    recall('r8-01', 'cysteine', 'Describe the catabolic fates of cysteine.', [
      'Main route: a three-step pathway to pyruvate.',
      'Sulfite and pyruvate; sulfite oxidase makes sulfate, which becomes PAPS.',
      'Thiocysteine and thiosulfate, which can become thiocyanate.',
      'Hypotaurine and taurine.',
    ], a4([16, 17, 18, 19])),
  ],
  'amino-acid-metabolism-9': [
    ask(match('c9-01', 'one-carbon-carriers', 'Match each carrier to what it transfers.', [
      ['Biotin', 'CO₂'],
      ['Tetrahydrofolate', 'Formyl, methylene or methyl'],
      ['SAM', 'Methyl only'],
    ], { explanation: 'AA4 slide 21.' })),
    ask(mcq('c9-02', 'thf', 'What is the major source of one-carbon units for tetrahydrofolate?', 'Conversion of serine to glycine', ['Formate', 'Histidine', 'Methionine'], { explanation: 'AA4 slides 33, 35.' })),
    learn('Why sulfonamides spare us', ['Bacteria build folate from PABA via dihydropteroate synthetase; humans get folate from the diet. Sulfonamides block that bacterial enzyme.'], { sourceRefs: a4([39]) }),
    ask(mcq('c9-03', 'folate-disorders', 'Impaired folate leads to more uracil in DNA because of a shortage of…', 'Thymidylate', ['Purines', 'SAM', 'Biotin'], { explanation: 'AA4 slide 40.', skill: 'cause-effect' })),
    recall('r9-01', 'thf', 'Describe tetrahydrofolate and how it is formed.', [
      'A pteridine ring, para-aminobenzoate and glutamate (vitamin B9).',
      'Dihydrofolate reductase reduces folate to FH₂ then FH₄, using NADPH.',
      'One-carbon units attach at N⁵, N¹⁰ or bridge both, and are interconvertible.',
    ], a4([25, 32, 33])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'amino-acid-metabolism-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Glycine is the only non-chiral amino acid.', 'Zwitterions at physiological pH.', 'pH < pI → positive charge.'],
    confusions: [{ confusion: 'Zwitterions have no charges.', clarification: 'They carry both a positive and a negative charge; only the net charge is zero (AA1 slides 22–24).' }],
  },
  'amino-acid-metabolism-2': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Leu and Lys are purely ketogenic.', 'Ile, Phe, Trp, Tyr are both.', 'Tyr becomes essential in PKU.'],
    confusions: [{ confusion: 'All aromatic amino acids are ketogenic only.', clarification: 'Phenylalanine, tryptophan and tyrosine are both glucogenic and ketogenic (AA1 slide 48).' }],
  },
  'amino-acid-metabolism-3': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['PLP (B6) for transamination.', 'Lys, Thr and Pro are not transaminated.', 'GDH: ADP/GDP activate; ATP/GTP inhibit.'],
    confusions: [{ confusion: 'Transamination releases free ammonia.', clarification: 'It moves the amino group to a keto acid; free ammonia is released by glutamate dehydrogenase (AA1 slides 56, 60).' }],
  },
  'amino-acid-metabolism-4': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Glutamine: main ammonia carrier.', 'Alanine–glucose cycle from muscle.', 'Ammonia depletes α-ketoglutarate.'],
    confusions: [{ confusion: 'Muscle makes the glucose in the alanine–glucose cycle.', clarification: 'The liver does the gluconeogenesis; the cycle shifts that burden to the liver (AA3 slide 15).' }],
  },
  'amino-acid-metabolism-5': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['CPS I and OTC are mitochondrial.', 'NAG activates CPS I.', 'Fumarate links to the TCA cycle.'],
    confusions: [{ confusion: 'The whole urea cycle is cytosolic.', clarification: 'The first two steps are mitochondrial; ornithine must enter and citrulline leave the mitochondria (AA3 slide 23).' }],
  },
  'amino-acid-metabolism-6': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['MSUD: BCKA dehydrogenase defect.', 'Isovaleric acidaemia: cheesy odour.', 'PKU: restrict Phe, supplement Tyr.'],
    confusions: [{ confusion: 'PKU is always due to a phenylalanine hydroxylase defect.', clarification: 'A lack of tetrahydrobiopterin or its reductase can also cause it (AA2 slide 20).' }],
  },
  'amino-acid-metabolism-7': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Type I tyrosinaemia: fumarylacetoacetase.', 'Albinism: tyrosinase.', 'Serotonin → melatonin in the pineal.'],
    confusions: [{ confusion: 'People with PKU are albinos.', clarification: 'They can be lighter but still get enough dietary tyrosine to make melanin (AA2 slide 38).' }],
  },
  'amino-acid-metabolism-8': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Homocystinuria: cystathionine β-synthase.', 'Lens dislocation, thrombosis.', 'Cysteine → taurine.'],
    confusions: [{ confusion: 'Cysteine is an essential amino acid.', clarification: 'Cysteine is non-essential, made from methionine; methionine is essential (AA4 slide 5).' }],
  },
  'amino-acid-metabolism-9': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Biotin: CO₂; SAM: methyl.', 'Serine → glycine feeds the pool.', 'Sulfonamides mimic PABA.'],
    confusions: [{ confusion: 'Sulfonamides block human folate synthesis.', clarification: 'Humans lack the dihydropteroate pathway; sulfonamides block the bacterial enzyme (AA4 slide 39).' }],
  },
};

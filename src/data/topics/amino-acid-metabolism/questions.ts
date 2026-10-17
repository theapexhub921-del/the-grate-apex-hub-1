// Biochemistry → Amino Acid Metabolism — the topic question bank.
//
// Rules: only what the lessons teach (the four lecture decks). Not asked:
// whether alkaptonuria differs from homogentisic aciduria, the methionine
// advice for low-PLP-affinity homocystinuria (see discrepancies), the
// open review questions, or speaker-note annotations. IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/amino-acid-metabolism/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  mcq('q1-01', 'aa-structure', 'Which four groups are bonded to the α-carbon?', 'Amino group, carboxyl group, hydrogen and R group', ['Two amino groups, hydrogen and R', 'Carboxyl, phosphate, hydrogen and R', 'Amino, hydroxyl, hydrogen and R'], { explanation: 'AA1 slide 5.' }),
  mcq('q1-02', 'aa-structure', 'Which isoforms of amino acids are found in proteins?', 'L-isoforms', ['D-isoforms', 'Both equally', 'Neither — proteins use achiral forms'], { explanation: 'AA1 slide 6.' }),
  mcq('q1-03', 'aa-structure', 'How many α-amino acids appear in the genetic code?', '22', ['20', '10', '300'], { explanation: 'AA1 slide 19.' }),
  mcq('q1-04', 'aa-ionisation', 'The pKa of the α-carboxyl group is about…', '2', ['5', '9', '12'], { explanation: 'AA1 slide 9.' }),
  mcq('q1-05', 'aa-ionisation', 'The isoelectric point is the pH at which an amino acid…', 'Bears no net charge and does not move in an electric field', ['Is fully protonated', 'Precipitates', 'Has the most negative charge'], { explanation: 'AA1 slide 22.', skill: 'terminology' }),
  tf({ id: 'q1-06', conceptId: 'aa-ionisation', statement: 'Above its isoelectric point, an amino acid carries a net negative charge.', answer: true, explanation: 'AA1 slide 24.' }),
  mcq('q1-07', 'aa-ionisation', 'In an acidic environment the amino group of an amino acid…', 'Accepts a proton to form –NH₃⁺', ['Loses a proton', 'Becomes –COO⁻', 'Is unchanged'], { explanation: 'AA1 slide 9.' }),
  mcq('q1-08', 'protein-structure', 'Which bonds stabilise the α-helix?', 'Hydrogen bonds between peptide bonds above and below along the spiral', ['Disulfide bonds', 'Ionic bonds between side chains only', 'Peptide bonds'], { explanation: 'AA1 slide 12.' }),
  mcq('q1-09', 'protein-structure', 'In the α-helix, where do the side chains lie?', 'Projecting outward', ['Inside the helix', 'Between β-strands', 'Bonded to the backbone by disulfides'], { explanation: 'AA1 slide 12.' }),
  multi('q1-10', 'protein-structure', 'Which bonds stabilise tertiary structure? Select all that apply.', ['Van der Waals forces', 'Hydrogen bonds', 'Ionic bonds'], ['Glycosidic bonds'], { explanation: 'AA1 slide 14.' }),
  mcq('q1-11', 'protein-structure', 'A chain of 50 amino acids is called…', 'A polypeptide', ['An oligopeptide', 'A protein', 'A dipeptide'], { explanation: 'AA1 slide 51: polypeptides have 11–100 residues.' }),
  mcq('q1-12', 'protein-structure', 'Haemoglobin’s four globin chains are joined by…', 'Non-covalent bonds', ['Peptide bonds', 'Disulfide bonds only', 'Glycosidic bonds'], { explanation: 'AA1 slide 17.' }),
  multi('q1-13', 'aa-functions', 'Which are functions of amino acids named in the lecture? Select all that apply.', ['Precursors of glucose, haem and nucleotide bases', 'Serine in phospholipids', 'Glycine in bile salts', 'Neurotransmitters or their precursors'], ['Main store of energy'], { explanation: 'AA1 slide 18.' }),
];

const lesson2: Q[] = [
  multi('q2-01', 'r-group-classes', 'Which are aromatic amino acids? Select all that apply.', ['Phenylalanine', 'Tyrosine', 'Tryptophan'], ['Histidine', 'Proline'], { explanation: 'AA1 slide 35.' }),
  mcq('q2-02', 'r-group-classes', 'Aromatic amino acids absorb UV light at…', '280 nm', ['260 nm', '340 nm', '420 nm'], { explanation: 'AA1 slide 35.' }),
  mcq('q2-03', 'r-group-classes', 'Asparagine is the amide of…', 'Aspartic acid', ['Glutamic acid', 'Arginine', 'Alanine'], { explanation: 'AA1 slide 36.' }),
  multi('q2-04', 'r-group-classes', 'Which are branched-chain amino acids? Select all that apply.', ['Leucine', 'Isoleucine', 'Valine'], ['Glycine', 'Alanine'], { explanation: 'AA1 slide 45.' }),
  mcq('q2-05', 'r-group-classes', 'Why are aspartate and glutamate named “-ate”?', 'They are negatively charged at physiological pH, present as conjugate bases', ['They contain sulfur', 'They are amides', 'They are positively charged'], { explanation: 'AA1 slide 37.' }),
  match('q2-06', 'r-group-classes', 'Match each amino acid to its distinctive group.', [
    ['Arginine', 'Guanidino group'],
    ['Histidine', 'Imidazole ring'],
    ['Tryptophan', 'Indole ring'],
    ['Methionine', 'Thioether'],
  ], { explanation: 'AA1 slide 45.' }),
  mcq('q2-07', 'essential-aa', 'How many of the twenty amino acids must humans obtain from the diet?', 'Ten', ['Five', 'Twenty', 'Two'], { explanation: 'AA1 slide 39.' }),
  mcq('q2-08', 'essential-aa', 'Why is arginine conditionally essential?', 'It is made, but not in sufficient amounts', ['It is made from phenylalanine', 'It is only in plants', 'It is lost in urine'], { explanation: 'AA1 slide 44.' }),
  mcq('q2-09', 'essential-aa', 'Histidine is described as essential for…', 'Growth in children', ['Adults only', 'Pregnancy only', 'Bacteria only'], { explanation: 'AA1 slide 44.' }),
  mcq('q2-10', 'glucogenic-ketogenic', 'Ketogenic amino acids are catabolised to…', 'Acetyl-CoA or acetoacetyl-CoA', ['Pyruvate', 'Oxaloacetate', 'Fumarate'], { explanation: 'AA1 slide 48.' }),
  multi('q2-11', 'glucogenic-ketogenic', 'Which amino acids are both glucogenic and ketogenic? Select all that apply.', ['Isoleucine', 'Phenylalanine', 'Tryptophan', 'Tyrosine'], ['Leucine'], { explanation: 'AA1 slide 48.' }),
  tf({ id: 'q2-12', conceptId: 'glucogenic-ketogenic', statement: 'Valine is a glucogenic amino acid.', answer: true, explanation: 'AA1 slide 47; AA2 slide 10.' }),
  multi('q2-13', 'glucogenic-ketogenic', 'Glucogenic amino acids are catabolised to which intermediates? Select all that apply.', ['Pyruvate', 'Succinyl-CoA', 'α-Ketoglutarate', 'Oxaloacetate'], ['Acetoacetyl-CoA'], { explanation: 'AA1 slide 47.' }),
];

const lesson3: Q[] = [
  mcq('q3-01', 'protein-digestion', 'Pepsin works best at pH…', '2', ['5', '7', '9'], { explanation: 'AA1 slide 30.' }),
  mcq('q3-02', 'protein-digestion', 'Which enzyme activates trypsinogen?', 'Enteropeptidase', ['Pepsin', 'Chymotrypsin', 'Aminopeptidase'], { explanation: 'AA1 slide 30.' }),
  multi('q3-03', 'protein-digestion', 'Which zymogens does trypsin activate? Select all that apply.', ['Chymotrypsinogen', 'Proelastase', 'Procarboxypeptidase'], ['Pepsinogen'], { explanation: 'AA1 slide 30.' }),
  mcq('q3-04', 'protein-digestion', 'Body proteins are degraded in proteasomes after tagging with…', 'Ubiquitin', ['Phosphate', 'Biotin', 'Glutathione'], { explanation: 'AA1 slide 28.' }),
  match('q3-05', 'decarboxylation', 'Match each amine to the amino acid (or derivative) it is decarboxylated from.', [
    ['Histamine', 'Histidine'],
    ['Dopamine', 'DOPA'],
    ['Serotonin', '5-Hydroxytryptophan'],
  ], { explanation: 'AA1 slides 52–55.' }),
  mcq('q3-06', 'decarboxylation', 'Histamine stimulates…', 'Gastric secretion', ['Insulin release', 'Bile flow', 'Bone growth'], { explanation: 'AA1 slide 52.' }),
  mcq('q3-07', 'transamination', 'Which amino acids cannot be transaminated? Select the best answer.', 'Lysine and threonine (and proline cannot take part in PLP reactions)', ['Glutamate and aspartate', 'Alanine and glycine', 'All amino acids can'], { explanation: 'AA1 slide 59; AA3 slide 7.' }),
  mcq('q3-08', 'transamination', 'Why can proline not take part in PLP-dependent reactions?', 'It has a secondary amino group', ['It has no carboxyl group', 'It is aromatic', 'It contains sulfur'], { explanation: 'AA1 slide 59.', skill: 'cause-effect' }),
  multi('q3-09', 'transamination', 'Which are aminotransferases named in the lecture? Select all that apply.', ['AST', 'ALT'], ['GDH', 'ALP'], { explanation: 'AA1 slide 57.' }),
  fill('q3-10', 'transamination', 'During transamination PLP carries the amino group as pyridoxamine ____.', ['phosphate'], { explanation: 'AA1 slide 56.' }),
  mcq('q3-11', 'oxidative-deamination', 'Glutamate dehydrogenase converts glutamate to…', 'α-Ketoglutarate and NH₄⁺', ['Glutamine', 'Oxaloacetate and NH₄⁺', 'Aspartate'], { explanation: 'AA1 slide 60.' }),
  multi('q3-12', 'oxidative-deamination', 'Which are allosteric activators of glutamate dehydrogenase? Select all that apply.', ['ADP', 'GDP'], ['ATP', 'GTP'], { explanation: 'AA1 slide 61.' }),
  mcq('q3-13', 'oxidative-deamination', 'Transdeamination is…', 'Transamination coupled with oxidative deamination by glutamate dehydrogenase', ['Removal of an amide group', 'Decarboxylation followed by deamination', 'Ammonia transport in blood'], { explanation: 'AA1 slide 62.', skill: 'terminology' }),
  mcq('q3-14', 'oxidative-deamination', 'Raised serum glutamate dehydrogenase indicates…', 'Liver damage', ['Kidney failure', 'Muscle injury', 'Pancreatitis'], { explanation: 'AA1 slide 61.', clinical: true }),
];

const lesson4: Q[] = [
  multi('q4-01', 'glu-gln', 'How does reduced nitrogen enter the body? Select all that apply.', ['Dietary free amino acids', 'Protein', 'Ammonia from gut bacteria'], ['Atmospheric nitrogen'], { explanation: 'AA3 slide 4.' }),
  mcq('q4-02', 'glu-gln', 'Glutamine is a co-substrate for synthesis of…', 'Asparagine', ['Leucine', 'Tryptophan', 'Lysine'], { explanation: 'AA3 slide 5.' }),
  mcq('q4-03', 'glu-gln', 'In which cells is glutamine synthetase mainly found in the brain?', 'Astrocytes', ['Neurons', 'Microglia', 'Ependymal cells'], { explanation: 'AA3 slide 10.' }),
  multi('q4-04', 'glu-gln', 'Malfunction of glutamine synthetase is linked to which conditions? Select all that apply.', ['Alzheimer’s disease', 'Epilepsy', 'Glioblastoma multiforme'], ['Phenylketonuria'], { explanation: 'AA3 slide 10.' }),
  mcq('q4-05', 'glu-gln', 'In the liver, urea cycle enzymes are in the same cells as…', 'Glutaminase', ['Glutamine synthetase', 'Tyrosinase', 'Arginase only'], { explanation: 'AA3 slide 11.' }),
  mcq('q4-06', 'kidney-ammonia', 'Glutamine is the major carrier of ammonia from peripheral tissues to the…', 'Kidney', ['Brain', 'Muscle', 'Lung'], { explanation: 'AA3 slide 12.' }),
  mcq('q4-07', 'kidney-ammonia', 'How many ammonia molecules does the kidney release from one glutamine?', 'Two — one by glutaminase, one by glutamate dehydrogenase', ['One', 'Three', 'None'], { explanation: 'AA3 slide 12.' }),
  mcq('q4-08', 'kidney-ammonia', 'In the liver, glutaminase converts glutamine to glutamate in the…', 'Mitochondria', ['Cytosol', 'Nucleus', 'Peroxisomes'], { explanation: 'AA3 slide 14.' }),
  mcq('q4-09', 'alanine-glucose', 'Skeletal muscle transports ammonia to the liver mainly as…', 'Alanine', ['Urea', 'Free ammonia', 'Aspartate'], { explanation: 'AA3 slide 15.' }),
  multi('q4-10', 'alanine-glucose', 'Where does muscle alanine come from? Select all that apply.', ['Protein degradation', 'Transamination of pyruvate by ALT'], ['Urea cycle', 'Glycogen'], { explanation: 'AA3 slide 19.' }),
  tf({ id: 'q4-11', conceptId: 'alanine-glucose', statement: 'Alanine is the most abundant circulating amino acid in blood.', answer: false, explanation: 'AA3 slide 19: it is second only to glutamine.', skill: 'misconception' }),
  multi('q4-12', 'ammonia-toxicity', 'How does excess ammonia harm cells? Select all that apply.', ['Depletes α-ketoglutarate', 'Lowers ATP synthesis', 'Impairs GABA synthesis', 'Inhibits Na⁺/K⁺-ATPase'], ['Increases urea excretion'], { explanation: 'AA3 slides 16–17.' }),
  mcq('q4-13', 'ammonia-toxicity', 'Increased synthesis of which compound may lead to encephalopathy?', 'Glutamine', ['Urea', 'Alanine', 'Taurine'], { explanation: 'AA3 slide 17.' }),
  match('q4-14', 'nitrogen-excretion', 'Match each type of animal to its nitrogen waste.', [
    ['Ammonotelic (bony fishes)', 'Ammonia'],
    ['Ureotelic (terrestrial animals)', 'Urea'],
    ['Uricotelic (birds, reptiles)', 'Uric acid'],
  ], { explanation: 'AA3 slide 21.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'urea-cycle-steps', 'Where is urea mainly synthesised?', 'Liver', ['Kidney', 'Muscle', 'Intestine'], { explanation: 'AA3 slide 24.' }),
  mcq('q5-02', 'urea-cycle-steps', 'Which enzyme makes citrulline?', 'Ornithine transcarbamoylase', ['Arginase', 'Argininosuccinate lyase', 'Carbamoyl phosphate synthetase I'], { explanation: 'AA3 slide 25.' }),
  mcq('q5-03', 'urea-cycle-steps', 'Which amino acid supplies the second nitrogen in the cytosol?', 'Aspartate', ['Glutamate', 'Alanine', 'Glutamine'], { explanation: 'AA3 slide 26.' }),
  mcq('q5-04', 'urea-cycle-steps', 'Argininosuccinate lyase produces…', 'Arginine and fumarate', ['Urea and ornithine', 'Citrulline', 'Carbamoyl phosphate'], { explanation: 'AA3 slide 26.' }),
  mcq('q5-05', 'urea-cycle-steps', 'Which enzyme releases urea?', 'Arginase', ['Argininosuccinate synthetase', 'Ornithine transcarbamoylase', 'Fumarase'], { explanation: 'AA3 slide 26.' }),
  mcq('q5-06', 'urea-cycle-steps', 'Which molecule must leave the mitochondria for the cycle to continue?', 'Citrulline', ['Ornithine', 'Arginine', 'Urea'], { explanation: 'AA3 slides 23, 25.' }),
  mcq('q5-07', 'urea-cycle-steps', 'Blood urea nitrogen is a sensitive test of…', 'Kidney function', ['Liver function', 'Muscle mass', 'Thyroid function'], { explanation: 'AA3 slide 23.', clinical: true }),
  mcq('q5-08', 'urea-regulation', 'Carbamoyl phosphate synthetase I requires which allosteric activator?', 'N-Acetylglutamate', ['Arginine', 'Citrate', 'AMP'], { explanation: 'AA3 slide 24.' }),
  multi('q5-09', 'urea-regulation', 'Which stimulate N-acetylglutamate synthesis? Select all that apply.', ['Arginine', 'Glutamate', 'High protein intake'], ['ATP'], { explanation: 'AA3 slides 24, 33.' }),
  multi('q5-10', 'urea-regulation', 'Which hormones regulate expression of liver urea cycle enzymes? Select all that apply.', ['Glucagon', 'Insulin', 'Glucocorticoids'], ['Thyroxine'], { explanation: 'AA3 slide 34.' }),
  multi('q5-11', 'urea-cycle-link', 'What can oxaloacetate formed from urea cycle fumarate become? Select all that apply.', ['Citric acid cycle intermediate with acetyl-CoA', 'Glucose', 'Aspartate'], ['Ornithine'], { explanation: 'AA3 slide 27.' }),
  multi('q5-12', 'urea-defects', 'Which are symptoms of hyperammonaemia? Select all that apply.', ['Lethargy', 'Stupor', 'Convulsions', 'Coma'], ['Hypertension'], { explanation: 'AA3 slide 31.', clinical: true }),
  mcq('q5-13', 'urea-defects', 'Patients with urea cycle defects are given…', 'α-Keto analogues of essential amino acids', ['High-protein diets', 'Extra ammonia', 'Glutamine supplements'], { explanation: 'AA3 slide 31.', clinical: true }),
];

const lesson6: Q[] = [
  mcq('q6-01', 'bcaa-catabolism', 'Which amino group acceptor does branched-chain aminotransferase use?', 'α-Ketoglutarate', ['Oxaloacetate', 'Pyruvate', 'Ammonia'], { explanation: 'AA2 slide 7.' }),
  mcq('q6-02', 'bcaa-catabolism', 'The second step of BCAA catabolism is…', 'Oxidative decarboxylation by the branched-chain α-keto acid dehydrogenase complex', ['Transamination', 'FAD-linked dehydrogenation', 'Hydroxylation'], { explanation: 'AA2 slide 8.' }),
  mcq('q6-03', 'bcaa-catabolism', 'The branched-chain α-keto acid dehydrogenase complex is inactivated by…', 'Phosphorylation', ['Dephosphorylation', 'Thiamine', 'Glucagon'], { explanation: 'AA2 slide 11.' }),
  mcq('q6-04', 'bcaa-catabolism', 'The principal product of valine catabolism is…', 'Propionyl-CoA', ['Acetoacetyl-CoA', 'Acetyl-CoA only', 'Fumarate'], { explanation: 'AA2 slide 10.' }),
  mcq('q6-05', 'bcaa-catabolism', 'Branched-chain amino acids are an alternative fuel for the brain during…', 'Starvation', ['Exercise', 'Sleep', 'Pregnancy'], { explanation: 'AA2 slide 6.' }),
  mcq('q6-06', 'msud', 'The urine and sweat in MSUD smell of…', 'Maple syrup', ['Cheese', 'Cabbage', 'Mice'], { explanation: 'AA2 slide 14.' }),
  mcq('q6-07', 'msud', 'Some MSUD cases respond to large doses of…', 'Thiamine', ['Pyridoxine', 'Biotin', 'Vitamin C'], { explanation: 'AA2 slide 14.', clinical: true }),
  mcq('q6-08', 'msud', 'Isovaleric acidaemia is due to deficiency of…', 'Isovaleryl-CoA dehydrogenase', ['Branched-chain aminotransferase', 'Phenylalanine hydroxylase', 'Tyrosinase'], { explanation: 'AA2 slide 17.' }),
  mcq('q6-09', 'msud', 'Intermittent branched-chain ketonuria differs from MSUD in that…', 'The enzyme deficiency is milder and symptoms appear later and intermittently', ['It affects a different enzyme', 'It cannot be treated', 'It causes a cheesy odour'], { explanation: 'AA2 slide 16.' }),
  mcq('q6-10', 'pku', 'The cofactor of phenylalanine hydroxylase is…', 'Tetrahydrobiopterin', ['Pyridoxal phosphate', 'Biotin', 'Tetrahydrofolate'], { explanation: 'AA2 slide 20.' }),
  mcq('q6-11', 'pku', 'Two PKU carriers have a child. What is the chance it is affected?', '25%', ['50%', '100%', '2%'], { explanation: 'AA2 slide 19.' }),
  multi('q6-12', 'pku', 'Which are part of PKU management? Select all that apply.', ['Restrict phenylalanine', 'High tyrosine for the first 4–5 years', 'Avoid aspartame', 'Tetrahydrobiopterin'], ['High-protein diet'], { explanation: 'AA2 slides 21–22.', clinical: true }),
  mcq('q6-13', 'pku', 'The PKU gene (phenylalanine hydroxylase) is on chromosome…', '12', ['X', '7', '21'], { explanation: 'AA2 slide 19.' }),
];

const lesson7: Q[] = [
  multi('q7-01', 'tyrosine-fates', 'Which are made from tyrosine? Select all that apply.', ['Catecholamines', 'Melanin', 'Thyroid hormones'], ['Serotonin'], { explanation: 'AA2 slide 23.' }),
  mcq('q7-02', 'tyrosine-fates', 'Which enzyme converts dopamine to noradrenaline?', 'Dopamine β-hydroxylase', ['Tyrosine hydroxylase', 'Aromatic amino acid decarboxylase', 'Tyrosinase'], { explanation: 'AA2 slide 47.' }),
  mcq('q7-03', 'tyrosine-fates', 'Conversion of noradrenaline to adrenaline requires…', 'S-Adenosylmethionine', ['Tetrahydrobiopterin', 'Vitamin C', 'Biotin'], { explanation: 'AA2 slide 47.' }),
  mcq('q7-04', 'tyrosine-fates', 'The yellow colour of pheomelanin comes from…', 'The sulfur of cysteine', ['Iron', 'Copper', 'Bilirubin'], { explanation: 'AA2 slide 25.' }),
  mcq('q7-05', 'tyrosine-disorders', 'A cabbage-like odour, jaundice and liver failure in an infant suggest…', 'Type I tyrosinaemia', ['Type II tyrosinaemia', 'Alkaptonuria', 'Albinism'], { explanation: 'AA2 slide 30.', clinical: true }),
  mcq('q7-06', 'tyrosine-disorders', 'Painful skin lesions on the palms and soles with photophobia suggest…', 'Type II tyrosinaemia (Richner–Hanhart syndrome)', ['Type I tyrosinaemia', 'Type III tyrosinaemia', 'Histidinaemia'], { explanation: 'AA2 slide 33.', clinical: true }),
  mcq('q7-07', 'tyrosine-disorders', 'Urine that darkens on standing points to…', 'Alkaptonuria', ['PKU', 'MSUD', 'Albinism'], { explanation: 'AA2 slides 35, 44.' }),
  mcq('q7-08', 'tyrosine-disorders', 'Deposition of alkapton in cartilage and connective tissue is called…', 'Ochronosis', ['Vitiligo', 'Melanism', 'Fanconi syndrome'], { explanation: 'AA2 slide 36.' }),
  mcq('q7-09', 'tyrosine-disorders', 'Temporary tyrosinaemia in neonates may be due to…', 'Vitamin C deficiency or immature liver enzymes', ['Iron overload', 'Too much phenylalanine hydroxylase', 'Thiamine excess'], { explanation: 'AA2 slide 28.' }),
  tf({ id: 'q7-10', conceptId: 'tyrosine-disorders', statement: 'People with PKU are albinos.', answer: false, explanation: 'AA2 slide 38: they get enough tyrosine from the diet to make melanin.', skill: 'misconception' }),
  mcq('q7-11', 'tryptophan', 'The major storage site of serotonin is…', 'Enterochromaffin cells of the gut', ['Platelets', 'Pineal gland', 'Adrenal medulla'], { explanation: 'AA2 slide 50.' }),
  multi('q7-12', 'tryptophan', 'What is made from tryptophan? Select all that apply.', ['Serotonin', 'Melatonin', 'Nicotinic acid (niacin)'], ['Adrenaline'], { explanation: 'AA2 slides 49–52.' }),
  mcq('q7-13', 'histidine-serine', 'Histidinaemia is a deficiency of…', 'Histidase (histidine ammonia lyase)', ['Histidine decarboxylase', 'Tyrosinase', 'Serine hydroxymethyltransferase'], { explanation: 'AA2 slide 42.' }),
  mcq('q7-14', 'histidine-serine', 'Serine is made from which glycolytic intermediate?', '3-Phosphoglycerate', ['Pyruvate', 'Glucose 6-phosphate', 'Phosphoenolpyruvate'], { explanation: 'AA2 slide 53.' }),
];

const lesson8: Q[] = [
  multi('q8-01', 'methionine', 'Which are the four common sulfur-containing amino acids? Select all that apply.', ['Methionine', 'Cysteine', 'Homocysteine', 'Taurine'], ['Serine'], { explanation: 'AA4 slide 5.' }),
  mcq('q8-02', 'methionine', 'The principal methyl group donor is…', 'S-Adenosylmethionine', ['Homocysteine', 'Cysteine', 'Taurine'], { explanation: 'AA4 slide 8.' }),
  mcq('q8-03', 'methionine', 'Cystathionine β-synthase joins homocysteine with…', 'Serine', ['Glycine', 'Alanine', 'Cysteine'], { explanation: 'AA4 slide 10.' }),
  mcq('q8-04', 'methionine', 'Cystathionine γ-lyase produces cysteine and…', 'α-Ketobutyrate', ['Pyruvate', 'Homocysteine', 'Taurine'], { explanation: 'AA4 slide 10.' }),
  mcq('q8-05', 'methionine', 'α-Ketobutyrate is oxidatively decarboxylated to…', 'Propionyl-CoA', ['Acetyl-CoA', 'Succinate', 'Pyruvate'], { explanation: 'AA4 slide 10.' }),
  mcq('q8-06', 'methionine', 'How does cysteine regulate its own synthesis?', 'It suppresses cystathionine β-synthase and inhibits γ-lyase', ['It activates methionine synthase', 'It stimulates SAM formation', 'It has no effect'], { explanation: 'AA4 slide 10.' }),
  mcq('q8-07', 'homocystinuria', 'Homocystinuria is a deficiency of…', 'Cystathionine β-synthase', ['Cystathionine γ-lyase', 'Sulfite oxidase', 'Methionine adenosyltransferase'], { explanation: 'AA4 slide 11.' }),
  multi('q8-08', 'homocystinuria', 'Which are features of homocystinuria? Select all that apply.', ['Bilateral lens dislocation', 'Thrombosis and cardiac events', 'Osteoporosis', 'Aortic aneurysm'], ['Maple syrup odour'], { explanation: 'AA4 slides 11–12.', clinical: true }),
  mcq('q8-09', 'homocystinuria', 'Which vitamin is most often part of homocystinuria treatment?', 'Pyridoxine (B6)', ['Thiamine (B1)', 'Vitamin C', 'Vitamin K'], { explanation: 'AA4 slide 13.', clinical: true }),
  mcq('q8-10', 'homocystinuria', 'Cystathioninuria is due to deficiency of…', 'Cystathionine γ-lyase', ['Cystathionine β-synthase', 'Methionine synthase', 'Sulfite oxidase'], { explanation: 'AA4 slide 14.' }),
  mcq('q8-11', 'cysteine', 'The universal source of sulfate groups is…', 'PAPS (3′-phosphoadenosine 5′-phosphosulfate)', ['Taurine', 'Thiosulfate', 'Glutathione'], { explanation: 'AA4 slide 17.' }),
  mcq('q8-12', 'cysteine', 'Excretion of thiosulfate and sulfite with progressive neurological damage suggests deficiency of…', 'Sulfite oxidase', ['Cystathionine β-synthase', 'Tyrosinase', 'Arginase'], { explanation: 'AA4 slide 18.', clinical: true }),
  multi('q8-13', 'cysteine', 'Which are roles of taurine? Select all that apply.', ['Conjugating bile acids', 'Clearing xenobiotics and toxins', 'Osmoregulation'], ['Carrying CO₂'], { explanation: 'AA4 slide 20.' }),
];

const lesson9: Q[] = [
  mcq('q9-01', 'one-carbon-carriers', 'Biotin carries…', 'CO₂', ['Methyl groups', 'Formyl groups', 'Amino groups'], { explanation: 'AA4 slide 21.' }),
  mcq('q9-02', 'one-carbon-carriers', 'Biotin is sequestered by avidin, found in…', 'Uncooked egg white', ['Milk', 'Liver', 'Leafy vegetables'], { explanation: 'AA4 slide 23.' }),
  order('q9-03', 'one-carbon-carriers', 'Order these one-carbon groups from most oxidised to most reduced.', ['Carbon dioxide', 'Formyl', 'Methenyl', 'Methylene', 'Methyl'], { explanation: 'AA4 slide 22.' }),
  multi('q9-04', 'thf', 'What are the parts of folate? Select all that apply.', ['Pteridine', 'Para-aminobenzoate', 'Glutamate'], ['Adenosine'], { explanation: 'AA4 slide 25.' }),
  mcq('q9-05', 'thf', 'Which enzyme reduces dihydrofolate to tetrahydrofolate?', 'Dihydrofolate reductase', ['Thymidylate synthase', 'Methionine synthase', 'Serine hydroxymethyltransferase'], { explanation: 'AA4 slide 32.' }),
  mcq('q9-06', 'thf', 'What supplies electrons for both folate reductions?', 'NADPH', ['NADH', 'FADH₂', 'Glutathione'], { explanation: 'AA4 slide 33.' }),
  mcq('q9-07', 'thf', 'One-carbon units attach to tetrahydrofolate at…', 'N⁵, N¹⁰ or a bridge between them', ['C2 only', 'The glutamate tail', 'The PABA ring'], { explanation: 'AA4 slides 25, 33.' }),
  match('q9-08', 'thf', 'Match each source to the THF form it produces.', [
    ['Formate', 'N¹⁰-Formyl'],
    ['Histidine', 'N⁵,N¹⁰-Methenyl'],
    ['Serine', 'N⁵,N¹⁰-Methylene'],
  ], { explanation: 'AA4 slide 37.' }),
  mcq('q9-09', 'thf', 'N⁵,N¹⁰-methylene-THF provides the carbon for converting…', 'dUMP to dTMP', ['Glycine to serine only', 'Purine C8', 'B12 to methyl-B12'], { explanation: 'AA4 slide 37.' }),
  mcq('q9-10', 'thf', 'Why is dietary carbohydrate a major source of the folate one-carbon pool?', 'Serine, the main donor, can be made from glucose', ['Glucose binds folate', 'Carbohydrate contains folate', 'Glucose is a methyl donor'], { explanation: 'AA4 slide 33.', skill: 'cause-effect' }),
  mcq('q9-11', 'folate-disorders', 'Sulfonamides competitively bind…', 'Dihydropteroate synthetase', ['Dihydrofolate reductase', 'Thymidylate synthase', 'Methionine synthase'], { explanation: 'AA4 slide 39.' }),
  multi('q9-12', 'folate-disorders', 'Which are inborn errors of folate transport and metabolism? Select all that apply.', ['Hereditary folate malabsorption', 'Glutamate formiminotransferase deficiency', 'MTHFR deficiency', 'Methionine synthase deficiency (cblG)'], ['Phenylketonuria'], { explanation: 'AA4 slide 39.' }),
  multi('q9-13', 'folate-disorders', 'Which are associated with impaired folate status? Select all that apply.', ['Neural tube defects', 'Anaemia', 'Raised homocysteine'], ['Lower uracil in DNA'], { explanation: 'AA4 slide 40.' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7, ...lesson8, ...lesson9];

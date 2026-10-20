// Biochemistry → Free Radicals and Oxygen Toxicity — the topic question bank.
//
// Rules: only what the lessons teach (the two lecture decks). Not asked:
// whether NO is a radical, the charge on the oxygen made by dismutation
// (see discrepancies), the open-ended "facts to know" and assignment
// questions, or speaker-note annotations. IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/free-radicals-and-oxygen-toxicity/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  mcq('q1-01', 'free-radical-definition', 'What happens when two free radicals react?', 'They neutralise each other', ['They make two more radicals', 'They always form water', 'Nothing'], { explanation: 'HB slide 5.' }),
  mcq('q1-02', 'free-radical-definition', 'What happens when a free radical reacts with a stable molecule?', 'More free radicals are generated — a chain reaction', ['Both become stable and the reaction ends', 'The radical is destroyed and nothing else forms', 'An antioxidant forms from the stable molecule'], { explanation: 'HB slide 5.' }),
  mcq('q1-03', 'ros-terms', 'Oxidative stress is…', 'The overall effect of oxidative species in causing tissue injury or disease', ['The toxic effect of breathing oxygen gas at high pressure', 'A lack of oxygen reaching the tissues', 'The production of ATP by oxidative phosphorylation'], { explanation: 'HB slide 6.', skill: 'terminology' }),
  mcq('q1-04', 'ros-terms', 'Oxygen toxicity is defined as…', 'The overall toxic effect of oxidative free radical species at cellular level', ['Breathing too much oxygen for too long at normal pressure', 'Hypoxia of the tissues from poor blood supply', 'Anaemia from destruction of red cells by oxygen'], { explanation: 'HB slide 6.', skill: 'terminology' }),
  multi('q1-05', 'ros-terms', 'Which are non-radical ROS named in the lecture? Select all that apply.', ['H₂O₂', 'HOCl'], ['Superoxide', 'Hydroxyl radical'], { explanation: 'HB slide 6.' }),
  multi('q1-06', 'radical-sources', 'Which are external sources of free radicals? Select all that apply.', ['Cigarette smoke', 'Ultraviolet light', 'Ozone', 'Certain drugs and pesticides'], ['Peroxisomes'], { explanation: 'HB slide 9; Fay slide 6.' }),
  mcq('q1-07', 'radical-sources', 'Which organelle is the main source of free radicals from oxidation of food?', 'Mitochondria', ['Lysosomes', 'Golgi apparatus', 'Ribosomes'], { explanation: 'HB slide 9.' }),
  mcq('q1-08', 'radical-sources', 'How does radiation generate free radicals in the body?', 'It splits water', ['It oxidises iron', 'It activates xanthine oxidase', 'It blocks antioxidants'], { explanation: 'HB slide 9.' }),
  multi('q1-09', 'radical-sources', 'Which molecules undergo autoxidation? Select all that apply.', ['Catecholamines', 'Haemoglobin', 'Myoglobin', 'Reduced cytochrome c'], ['Glucose'], { explanation: 'HB slide 16.' }),
  mcq('q1-10', 'radical-sources', 'Free transition metals that behave as radicals include…', 'Fe²⁺ and Cu⁺', ['Na⁺ and K⁺', 'Ca²⁺ and Mg²⁺', 'Zn²⁺ only'], { explanation: 'HB slide 14.' }),
  mcq('q1-11', 'ischaemia-reperfusion', 'In the respiratory burst, what share of the oxygen consumed becomes superoxide?', '70–90%', ['1–2%', '20–30%', '100%'], { explanation: 'HB slide 16.' }),
  multi('q1-12', 'ischaemia-reperfusion', 'What happens during ischaemia? Select all that apply.', ['Xanthine and xanthine oxidase rise', 'SOD is lost', 'Glutathione peroxidase is lost'], ['Catalase rises'], { explanation: 'HB slide 10.' }),
];

const lesson2: Q[] = [
  mcq('q2-01', 'radical-reactions', 'Most superoxide in the body is…', 'Dismutated to hydrogen peroxide, non-enzymatically or by SOD', ['Excreted unchanged in the urine', 'Converted to ATP in the mitochondria', 'Stored in lysosomes until needed'], { explanation: 'HB slide 15.' }),
  mcq('q2-02', 'radical-reactions', 'Why does a radical in the body usually react with a non-radical?', 'Most molecules in the body are not radicals', ['Radicals repel each other', 'Non-radicals are charged', 'Antioxidants prevent radical–radical reactions'], { explanation: 'HB slide 21.' }),
  mcq('q2-03', 'radical-reactions', 'Radical attack on DNA causes…', 'Mutation', ['Lipid peroxidation', 'Foam cells', 'Haemolysis'], { explanation: 'HB slide 21.' }),
  match('q2-04', 'major-ros', 'Match each symbol to its name.', [
    ['O₂·⁻', 'Superoxide'],
    ['·OH', 'Hydroxyl radical'],
    ['¹O₂', 'Singlet oxygen'],
    ['ONOO⁻', 'Peroxynitrite'],
  ], { explanation: 'HB slide 34.' }),
  mcq('q2-05', 'major-ros', 'The major source of superoxide in vivo is…', 'Electron leakage from the mitochondrial transport chain', ['Catalase in the peroxisomes', 'Fat in the diet', 'The kidney tubules'], { explanation: 'HB slide 35.' }),
  tf({ id: 'q2-06', conceptId: 'major-ros', statement: 'Hydrogen peroxide is a free radical.', answer: false, explanation: 'HB slide 35: it is a ROS but not a radical.', skill: 'misconception' }),
  mcq('q2-07', 'major-ros', 'The main significance of hydrogen peroxide is that it…', 'Is the main source of hydroxyl radicals in the presence of transition metals', ['Is extremely reactive itself and attacks DNA directly', 'Is an antioxidant that protects the membranes', 'Makes ATP when it is broken down by catalase'], { explanation: 'HB slide 35.' }),
  multi('q2-08', 'major-ros', 'How is singlet oxygen generated? Select all that apply.', ['Input of energy such as radiation', 'Peroxidases or lipoxygenases', 'The respiratory burst'], ['Catalase'], { explanation: 'HB slide 36.' }),
  mcq('q2-09', 'major-ros', 'Which species is extremely reactive and attacks most biomolecules?', 'The hydroxyl radical', ['Hydrogen peroxide (H₂O₂)', 'Superoxide', 'Oxygen'], { explanation: 'HB slide 37.' }),
  mcq('q2-10', 'fenton-haber-weiss', 'The Haber–Weiss reaction combines…', 'Superoxide and hydrogen peroxide', ['Hydrogen peroxide and Fe²⁺', 'Two superoxide radicals', 'Oxygen and water'], { explanation: 'HB slide 37.' }),
  fill('q2-11', 'fenton-haber-weiss', 'The Fenton reaction: H₂O₂ + ____ → ·OH + OH⁻ + Fe³⁺.', ['Fe2+', 'Fe²⁺', 'ferrous iron', 'Fe++'], { explanation: 'HB slide 37.' }),
  mcq('q2-12', 'fenton-haber-weiss', 'How many electrons reduce one O₂ to water?', 'Four, added one at a time', ['Two, added together at once', 'One, in a single step', 'Six, two at a time'], { explanation: 'HB slide 69.' }),
];

const lesson3: Q[] = [
  multi('q3-01', 'toxicity-mechanisms', 'Which are mechanisms of free radical toxicity? Select all that apply.', ['Lipid peroxidation', 'DNA damage', 'Protein oxidation', 'Altered calcium homeostasis'], ['ATP synthesis'], { explanation: 'HB slide 13; Fay slide 11.' }),
  mcq('q3-02', 'toxicity-mechanisms', 'Which amino acids are oxidised by free radicals?', 'Cysteine and methionine', ['Glycine and alanine only', 'Lysine and arginine', 'Leucine and valine'], { explanation: 'HB slide 18.' }),
  mcq('q3-03', 'toxicity-mechanisms', 'Which transcription factor family may link ROS signalling to disease?', 'NF-κB', ['p53 only', 'CREB', 'SREBP'], { explanation: 'HB slide 19.' }),
  mcq('q3-04', 'lipid-peroxidation', 'Lipid peroxidation increases membrane permeability, leading to…', 'Calcium influx and altered cell pH', ['Potassium influx into the cell', 'Water loss from the cell only', 'More ATP made by the cell'], { explanation: 'HB slide 17.' }),
  mcq('q3-05', 'lipid-peroxidation', 'In initiation, the attacking radical removes what from the fatty acid?', 'A hydrogen', ['An oxygen', 'A phosphate', 'A carbon'], { explanation: 'HB slide 25.' }),
  mcq('q3-06', 'lipid-peroxidation', 'What forms when a lipid radical reacts with oxygen?', 'A peroxyl radical (LOO·)', ['A hydroxyl radical', 'Water', 'A lipid hydroperoxide directly'], { explanation: 'HB slide 23.' }),
  multi('q3-07', 'lipid-peroxidation', 'Which inhibit the initiation of lipid peroxidation? Select all that apply.', ['Tocopherols', 'Mannitol', 'Formate'], ['Iron'], { explanation: 'HB slide 29.' }),
  mcq('q3-08', 'lipid-peroxidation', 'Which end-product of lipid peroxidation forms DNA adducts?', 'Malondialdehyde', ['Glutathione', 'Uric acid', 'Cholesterol'], { explanation: 'HB slide 24.' }),
  mcq('q3-09', 'lipid-peroxidation', 'Which treatment may cause haemolysis through lipid peroxidation?', 'Phototherapy', ['Allopurinol', 'Vitamin E', 'Iron chelation'], { explanation: 'HB slide 24.', clinical: true }),
  mcq('q3-10', 'dna-damage', 'Hydroxyl radical attack on guanine can produce…', '8-Hydroxyguanine', ['Uracil', 'Thymine dimers', 'Adenine'], { explanation: 'Fay slide 14.' }),
  mcq('q3-11', 'dna-damage', 'Ring-opened guanine…', 'Halts DNA replication', ['Repairs the damaged DNA', 'Acts as an antioxidant', 'Speeds up replication'], { explanation: 'Fay slide 14.' }),
  multi('q3-12', 'oxidised-ldl', 'How is oxidised LDL atherogenic? Select all that apply.', ['Chemotactic for monocytes and T cells', 'Cytotoxic', 'Induces tissue factor', 'Immunogenic'], ['Raises HDL'], { explanation: 'HB slides 32–33.' }),
  tf({ id: 'q3-13', conceptId: 'oxidised-ldl', statement: 'Oxidised LDL inhibits the motility of tissue macrophages.', answer: true, explanation: 'HB slide 32.' }),
];

const lesson4: Q[] = [
  mcq('q4-01', 'antioxidant-action', 'An antioxidant neutralises a free radical by…', 'Donating an electron while staying stable itself', ['Accepting a proton from the radical', 'Splitting water into H and OH', 'Binding oxygen so it cannot react'], { explanation: 'HB slide 47.' }),
  mcq('q4-02', 'antioxidant-action', 'Serum antioxidant activity is measured as…', '% inhibition of lipid peroxidation in a standard brain homogenate', ['The vitamin C level in the blood', 'Malondialdehyde measured in the urine', 'The red cell count and haemoglobin'], { explanation: 'HB slide 38.' }),
  multi('q4-03', 'antioxidant-action', 'What makes a good antioxidant? Select all that apply.', ['Relatively unreactive as a radical', 'Repaired rapidly', 'Decays to harmless products'], ['Highly reactive'], { explanation: 'HB slide 50.' }),
  mcq('q4-04', 'antioxidant-action', 'α-Tocopherol works mainly by…', 'Chain breaking in the lipid phase', ['Chelating iron in the plasma', 'Dismutating superoxide', 'Removing H₂O₂ in the cytosol'], { explanation: 'HB slide 39.' }),
  mcq('q4-05', 'antioxidant-action', 'Which protein sequesters copper?', 'Caeruloplasmin', ['Transferrin', 'Ferritin', 'Lactoferrin'], { explanation: 'HB slides 39, 43.' }),
  multi('q4-06', 'antioxidant-action', 'Which antioxidants are largely extracellular? Select all that apply.', ['Transferrin', 'Haptoglobin', 'Haemopexin'], ['Glutathione peroxidase'], { explanation: 'HB slide 47.' }),
  mcq('q4-07', 'antioxidant-enzymes', 'Which SOD is found in mitochondria?', 'MnSOD', ['CuZnSOD', 'CuSOD', 'FeSOD'], { explanation: 'HB slide 40.' }),
  mcq('q4-08', 'antioxidant-enzymes', 'Glutathione peroxidase contains…', 'Selenium', ['Manganese', 'Iron', 'Cobalt'], { explanation: 'HB slide 40.' }),
  mcq('q4-09', 'antioxidant-enzymes', 'Catalase converts…', 'H₂O₂ to water', ['Superoxide to H₂O₂', 'Lipid peroxides to alcohols', 'Fe²⁺ to Fe³⁺'], { explanation: 'HB slide 40.' }),
  multi('q4-10', 'antioxidant-enzymes', 'Which minerals are needed for enzymatic antioxidant defence? Select all that apply.', ['Selenium', 'Copper', 'Manganese', 'Zinc'], ['Sodium'], { explanation: 'HB slide 48.' }),
  mcq('q4-11', 'antioxidant-vitamins', 'Which antioxidant prevents oxidation of vitamin A and binds transition metals?', 'β-Carotene', ['Vitamin C', 'Uric acid (urate)', 'Catalase'], { explanation: 'HB slide 41.' }),
  mcq('q4-12', 'antioxidant-vitamins', 'Deferoxamine acts as an antioxidant by…', 'Inhibiting iron redox cycling', ['Blocking xanthine oxidase', 'Scavenging superoxide', 'Making glutathione'], { explanation: 'HB slide 45.' }),
  multi('q4-13', 'antioxidant-sources', 'Which foods contain polyphenolic flavonoids? Select all that apply.', ['Berries', 'Green tea', 'Red grapes'], ['White sugar'], { explanation: 'HB slide 49.' }),
];

const lesson5: Q[] = [
  multi('q5-01', 'ros-disease', 'Which diseases are linked to free radical chain reactions? Select all that apply.', ['Rheumatoid arthritis', 'Atherosclerosis', 'Diabetes', 'Myocardial reperfusion injury'], ['Haemophilia'], { explanation: 'HB slide 31.' }),
  mcq('q5-02', 'ros-disease', 'The link between fat intake and some cancers in people over 55 may reflect…', 'Greater lipid peroxidation', ['Less oxygen use by the tissues', 'More antioxidants in the diet', 'Lower cholesterol in the blood'], { explanation: 'HB slide 53.' }),
  order('q5-03', 'ros-cancer', 'Order the stages of carcinogenesis.', ['Initiation', 'Promotion', 'Progression'], { explanation: 'HB slides 58–59.' }),
  mcq('q5-04', 'ros-cancer', 'In early stages, what can return a transformed cell to normal?', 'Detection and correction by the immune system', ['More free radicals attacking the cell', 'Promotion by growth factors', 'Tumour promoters in the diet'], { explanation: 'HB slide 58.' }),
  multi('q5-05', 'ros-cancer', 'Which supplements do most epidemiological data link to fewer cancers? Select all that apply.', ['Vitamins A, E and C', 'β-Carotene', 'Selenium'], ['Iron'], { explanation: 'HB slide 63.' }),
  mcq('q5-06', 'ros-hiv-pregnancy', 'Oxidative stress increases HIV replication by activating…', 'NF-κB', ['Catalase', 'Transferrin', 'Glutathione'], { explanation: 'HB slide 54.' }),
  mcq('q5-07', 'ros-hiv-pregnancy', 'Glutathione levels in people living with HIV are…', 'About 30% lower', ['About 30% higher', 'Normal', 'Absent'], { explanation: 'HB slide 55.' }),
  multi('q5-08', 'ros-hiv-pregnancy', 'Which rise during normal pregnancy? Select all that apply.', ['Serum tocopherol', 'Glutathione peroxidase activity', 'Serum caeruloplasmin and transferrin'], ['Free iron'], { explanation: 'HB slide 51.' }),
  tf({ id: 'q5-09', conceptId: 'ros-hiv-pregnancy', statement: 'Antioxidants should routinely be given in normal pregnancy.', answer: false, explanation: 'HB slide 51: no evidence they are needed, but drugs that form radicals should be avoided.', skill: 'misconception' }),
  mcq('q5-10', 'ros-hiv-pregnancy', 'The key to preventing diabetic embryopathy is…', 'Keeping blood glucose at normal levels', ['High-dose antioxidants alone, whatever the glucose', 'Iron supplements throughout pregnancy', 'Avoiding all exercise during pregnancy'], { explanation: 'HB slide 57.', clinical: true }),
  mcq('q5-11', 'ros-transplant', 'Which enzyme triggers post-ischaemic injury in transplanted organs?', 'Xanthine oxidase', ['Catalase', 'SOD', 'Glutathione peroxidase'], { explanation: 'HB slide 65.' }),
  multi('q5-12', 'ros-transplant', 'Which preserved organ function when subjected to ischaemia? Select all that apply.', ['SOD', 'Catalase', 'Allopurinol'], ['Ozone'], { explanation: 'HB slides 66–67.' }),
  multi('q5-13', 'ros-transplant', 'Which are antioxidant biomarkers? Select all that apply.', ['Superoxide dismutase', 'GSH/GSSG ratio', 'Catalase'], ['Malondialdehyde'], { explanation: 'HB slide 64.' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5];

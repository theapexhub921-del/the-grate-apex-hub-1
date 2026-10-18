// Biochemistry → Free Radicals and Oxygen Toxicity — the five lessons
// (reading layer). Sources: the Human Biology 2021 deck (hb) and Prof Fay's
// deck (fy). References: "HB slide 22", "Fay slide 13".
import type { LessonDraft } from '@/data/topics/build';
import { fy, hb, type ConceptId } from '@/data/topics/free-radicals-and-oxygen-toxicity/sources';
import { interactive, readingExtras } from '@/data/topics/free-radicals-and-oxygen-toxicity/interactive';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'free-radicals-and-oxygen-toxicity-1',
  title: 'Free Radicals and Where They Come From',
  description: 'What a free radical is, the language of ROS and oxidative stress, and the internal and external sources of free radicals.',
  xp: 25,
  sourceRefs: [...hb([4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16]), ...fy([3, 4, 5, 6, 7, 8])],
  objectives: [
    'Define a free radical and explain why it starts chain reactions',
    'Define oxygen toxicity, ROS and oxidative stress',
    'List cellular, internal and external sources of free radicals',
    'Explain how ischaemia–reperfusion and the respiratory burst produce radicals',
  ],
  chunks: [
    {
      title: 'Why free radicals matter',
      kind: 'overview',
      paragraphs: [
        'The body makes free radicals all the time, from its own processes, from toxins, radiation or poor digestion, and from disease. Normally it copes, but if antioxidants are lacking or production is excessive, cells are damaged. Some researchers see free radical damage behind almost every disease: ageing, cancer, impaired immunity, cardiovascular disease, arthritis, Alzheimer’s and Parkinson’s disease (HB slide 4; Fay slide 3).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on HB slide 4 (inadequate antioxidants at the core of disease; life arising from radical reactions) were added to the deck and are not quizzed.' }],
      sourceRefs: [...hb([4]), ...fy([3])],
    },
    {
      title: 'What a free radical is',
      kind: 'definitions',
      paragraphs: [
        'A free radical is any species capable of independent existence with one or more unpaired electrons — a highly reactive entity with a single unpaired electron in its outer orbit. It is unstable and tries to become stable by accepting or donating an electron (HB slides 5–6).',
        'Two radicals that meet neutralise each other. But a radical that reacts with a stable molecule makes a new radical, so radicals drive autocatalytic chain reactions that propagate damage (HB slide 5; Fay slide 7).',
      ],
      terms: [
        { term: 'Oxygen toxicity', meaning: 'The overall toxic effect of oxidative free radical species at cellular level.' },
        { term: 'Reactive oxygen species (ROS)', meaning: 'A collective term for oxygen-centred radicals and some non-radical oxygen derivatives such as H₂O₂ and HOCl (and peroxynitrite from NO).' },
        { term: 'Oxidative stress', meaning: 'The overall effect of oxidative species in causing tissue injury or disease.' },
      ],
      keyPoints: ['ROS have very short half-lives; they arise normally from oxygen metabolism and have roles in cell signalling, but rise sharply under environmental stress (HB slide 11).'],
      sourceRefs: [...hb([5, 6, 8, 11, 12]), ...fy([4, 7])],
    },
    {
      title: 'Sources',
      kind: 'classification',
      paragraphs: ['Potential cellular sources include the mitochondria, peroxisomes, endoplasmic reticulum, cytoplasm, lysosomes, nucleus and DNA (HB slide 7).'],
      table: {
        columns: ['Internal', 'External'],
        rows: [
          ['Mitochondria (oxidation of food)', 'Cigarette smoke'],
          ['Phagocytes', 'Pollutants, mineral dust'],
          ['Xanthine oxidase', 'Radiation (splits water), UV light'],
          ['Iron and other transition metals', 'Drugs, pesticides, anaesthetics, solvents (e.g. nitrofurantoin, adriamycin, methotrexate)'],
          ['Arachidonate pathways, peroxisomes', 'Ozone'],
          ['Exercise, inflammation, ischaemia–reperfusion', 'Stress, fever, glucocorticoids, hyperthyroidism'],
        ],
      },
      keyPoints: [
        'Normal respiration gives superoxide, H₂O₂, HOCl and NO; free transition metals (Fe²⁺, Cu⁺) behave as radicals (HB slide 14).',
        'Radicals also form by autoxidation (catecholamines, haemoglobin, myoglobin, reduced cytochrome c, thiols) and enzymatic oxidation (xanthine oxidase, prostaglandin synthase, lipoxygenase, aldehyde oxidase) (HB slide 16).',
      ],
      sourceRefs: [...hb([7, 9, 14, 16]), ...fy([5, 6, 8])],
    },
    {
      title: 'Ischaemia–reperfusion and the respiratory burst',
      kind: 'mechanism',
      paragraphs: [
        'During ischaemia xanthine and xanthine oxidase rise greatly, while the antioxidants superoxide dismutase and glutathione peroxidase are lost — so radicals flood the tissue when blood returns (HB slide 10).',
        'In the respiratory burst, phagocytes consume large amounts of oxygen during phagocytosis; 70–90% of it becomes superoxide (HB slide 16).',
      ],
      sourceRefs: hb([10, 16]),
    },
  ],
  summary: [
    'Free radical: one or more unpaired electrons; unstable; starts chain reactions with non-radicals.',
    'ROS: oxygen radicals plus non-radicals (H₂O₂, HOCl). Oxidative stress: tissue injury from oxidative species.',
    'Internal: mitochondria, phagocytes, xanthine oxidase, transition metals, inflammation, ischaemia–reperfusion. External: smoke, radiation, UV, drugs, ozone.',
    'Ischaemia: ↑xanthine oxidase, ↓SOD and glutathione peroxidase. Respiratory burst: 70–90% of O₂ → superoxide.',
  ],
};

const lesson2: Draft = {
  id: 'free-radicals-and-oxygen-toxicity-2',
  title: 'Free Radical Reactions and the Major ROS',
  description: 'How radicals react with each other and with non-radicals, the biologically important species, and the Fenton and Haber–Weiss reactions.',
  xp: 25,
  sourceRefs: [...hb([15, 21, 34, 35, 36, 37, 69]), ...fy([8, 9, 10])],
  objectives: [
    'Explain what happens when a radical meets a radical or a non-radical',
    'Name the biologically significant free radicals and ROS',
    'Describe superoxide, hydrogen peroxide, singlet oxygen and the hydroxyl radical',
    'Write the Fenton and Haber–Weiss reactions',
    'Describe the four-electron reduction of oxygen',
  ],
  chunks: [
    {
      title: 'Reactions',
      kind: 'mechanism',
      paragraphs: [
        'Reactivity depends on the radical and what it meets. Two radicals can pair their electrons into a covalent bond — superoxide and nitrogen dioxide give peroxynitrite (ONOO⁻). Most superoxide in the body undergoes dismutation, non-enzymatically or by SOD, to hydrogen peroxide and oxygen (HB slide 15; Fay slide 9).',
        'Most molecules are not radicals, so a radical usually meets a non-radical — starting a chain reaction that makes new radicals. Attack on membranes or lipoproteins starts lipid peroxidation (e.g. atherosclerosis); attack on DNA causes mutation (HB slide 21; Fay slide 10).',
      ],
      sourceRefs: [...hb([15, 21]), ...fy([9, 10])],
    },
    {
      title: 'Biologically significant species',
      kind: 'classification',
      table: {
        columns: ['Species', 'Name'],
        rows: [
          ['O₂·⁻', 'Superoxide radical'],
          ['·OH', 'Hydroxyl radical'],
          ['ROO·', 'Peroxyl radical'],
          ['H₂O₂', 'Hydrogen peroxide'],
          ['¹O₂', 'Singlet oxygen'],
          ['NO·', 'Nitric oxide'],
          ['ONOO⁻', 'Peroxynitrite'],
          ['RS·', 'Thiyl radical'],
          ['HOCl', 'Hypochlorous acid'],
        ],
      },
      keyPoints: ['Other examples: trichloromethyl (CCl₃·) and alkoxyl (RO·) radicals (Fay slide 8).'],
      sourceRefs: [...hb([34]), ...fy([8])],
    },
    {
      title: 'The major ROS',
      kind: 'definitions',
      terms: [
        { term: 'Superoxide (O₂·⁻)', meaning: 'O₂ reduced by one electron. Its main source is electron leakage from the mitochondrial electron transport chain. Not very damaging itself, but central because other species form from it.' },
        { term: 'Hydrogen peroxide (H₂O₂)', meaning: '2O₂·⁻ + 2H⁺ → H₂O₂ + O₂. Not a radical and not very reactive, but the main source of hydroxyl radicals in the presence of transition metals.' },
        { term: 'Singlet oxygen (¹O₂)', meaning: 'Formed by energy input (radiation), peroxidases, lipoxygenases or the respiratory burst; involved in photo-oxygenation, red cell damage in G6PD deficiency, photoageing, lens ageing and carcinogenesis.' },
        { term: 'Hydroxyl radical (·OH)', meaning: 'Extremely reactive; attacks most biomolecules.' },
      ],
      sourceRefs: hb([35, 36, 37]),
    },
    {
      title: 'Making the hydroxyl radical',
      kind: 'pathway',
      steps: [
        { label: 'Fenton reaction', detail: 'H₂O₂ + Fe²⁺ → ·OH + OH⁻ + Fe³⁺' },
        { label: 'Haber–Weiss reaction', detail: 'O₂·⁻ + H₂O₂ → O₂ + ·OH + OH⁻' },
      ],
      paragraphs: [
        'Each oxygen molecule we breathe is reduced to water by four electrons added one at a time: O₂ → superoxide → hydrogen peroxide → hydroxyl radical → water. So where there is life there are oxidants (HB slides 37, 69).',
      ],
      sourceRefs: hb([37, 69]),
    },
  ],
  summary: [
    'Radical + radical → covalent bond (O₂·⁻ + NO₂· → ONOO⁻). Radical + non-radical → chain reaction.',
    'Significant species: O₂·⁻, ·OH, ROO·, H₂O₂, ¹O₂, NO·, ONOO⁻, RS·, HOCl.',
    'Superoxide: from mitochondrial leakage; parent of the others. H₂O₂: not a radical; source of ·OH with metals.',
    'Fenton: H₂O₂ + Fe²⁺ → ·OH. Haber–Weiss: O₂·⁻ + H₂O₂ → ·OH.',
    'O₂ + 4 e⁻ stepwise → O₂·⁻ → H₂O₂ → ·OH → H₂O.',
  ],
};

const lesson3: Draft = {
  id: 'free-radicals-and-oxygen-toxicity-3',
  title: 'How Free Radicals Damage Cells',
  description: 'Lipid peroxidation, protein and DNA damage, ROS as signals through NF-κB, and why oxidised LDL is atherogenic.',
  xp: 25,
  sourceRefs: [...hb([13, 17, 18, 19, 22, 23, 24, 25, 26, 27, 29, 32, 33]), ...fy([11, 12, 13, 14, 15])],
  objectives: [
    'List the mechanisms of free radical toxicity',
    'Describe initiation, propagation and termination of lipid peroxidation',
    'Explain why PUFAs are vulnerable and what lipid peroxides do to membranes',
    'Describe oxidative damage to proteins and DNA',
    'List the ways oxidised LDL promotes atherosclerosis',
  ],
  chunks: [
    {
      title: 'Mechanisms of toxicity',
      kind: 'classification',
      paragraphs: ['Radicals — also called oxidants — injure cell and organelle membranes by oxidation (HB slide 17). The mechanisms (HB slide 13; Fay slide 11):'],
      steps: [
        { label: 'Lipid peroxidation', detail: 'Membrane PUFAs are readily attacked.' },
        { label: 'Protein damage', detail: 'Cross-linking and fragmentation; oxidation of cysteine and methionine; altered enzymes and receptors. Proteins and nucleic acids are less susceptible than PUFAs.' },
        { label: 'DNA damage', detail: 'Strand breaks and mutations.' },
        { label: 'Covalent binding of xenobiotics' },
        { label: 'Altered calcium homeostasis' },
      ],
      keyPoints: [
        'DNA injury may be lethal (cell death, removal by phagocytes) or sublethal (increased permeability, toxicity, mutation) (HB slide 18).',
        'ROS also act as signals, for example through NF-κB — transcription factors for immunity, inflammation, apoptosis and proliferation — which may link them to disease (HB slide 19).',
      ],
      sourceRefs: [...hb([13, 17, 18, 19]), ...fy([11])],
    },
    {
      title: 'Lipid peroxidation',
      kind: 'pathway',
      paragraphs: [
        'Lipid peroxidation is the oxidative degradation of lipids with C=C double bonds: radicals “steal” electrons from membrane lipids. PUFAs are most affected, because the methylene (–CH₂–) groups between their double bonds have especially reactive hydrogens — a double bond weakens the C–H bonds next to it (HB slides 22, 29).',
      ],
      steps: [
        { label: 'Initiation', detail: 'A radical abstracts a hydrogen from a PUFA side-chain: LH + X· → L· + XH, leaving an unpaired electron on carbon. Inhibited by tocopherols, mannitol and formate.' },
        { label: 'Propagation', detail: 'The carbon radical reacts fast with O₂: L· + O₂ → LOO· (peroxyl). The peroxyl radical attacks another side-chain: LOO· + LH → L· + LOOH.' },
        { label: 'Accumulation', detail: 'Lipid peroxides build up and make the membrane leaky to ions — Ca²⁺ influx and altered pH.' },
        { label: 'Termination', detail: 'Radicals combine into non-radical products: LOO· + LOO·, L· + LOO·, L· + L· (e.g. stable dimers).' },
      ],
      keyPoints: [
        'Lipid peroxidation is an indicator of oxidative stress. Phototherapy may cause haemolysis this way, and end-products such as malondialdehyde form DNA adducts with deoxyadenosine and deoxyguanosine — mutagenic and carcinogenic (HB slide 24).',
      ],
      sourceRefs: [...hb([17, 22, 23, 24, 25, 29]), ...fy([12, 13])],
    },
    {
      title: 'DNA damage',
      kind: 'mechanism',
      paragraphs: [
        'Hydroxyl radicals generated near DNA attack purine and pyrimidine bases. Guanine becomes 8-hydroxyguanine, a mutagenic lesion, or ring-opened guanine, which halts DNA replication (Fay slide 14; HB slide 26).',
        'A study of estradiol catechols found that copper-dependent oxidation generates ROS that damage DNA; the damage seemed to come from localised singlet oxygen or a bound reactive species rather than free hydroxyl radicals (HB slides 26–27; Fay slide 15).',
      ],
      sourceRefs: [...hb([26, 27]), ...fy([14, 15])],
    },
    {
      title: 'Oxidised LDL and atherosclerosis',
      kind: 'clinical',
      steps: [
        { label: 'Foam cells', detail: 'Taken up avidly by macrophages, enriching them in cholesteryl ester.' },
        { label: 'Attracts and traps cells', detail: 'Chemotactic for monocytes and T cells; inhibits macrophage motility.' },
        { label: 'Cytotoxic', detail: 'And makes LDL aggregate, increasing uptake further.' },
        { label: 'Alters the artery', detail: 'Induces MCP-1, CSF, IL-1 and endothelial adhesion molecules; tissue factor (coagulation); impairs coronary vasomotor function.' },
        { label: 'Immunogenic', detail: 'Elicits autoantibodies and reactive T cells.' },
      ],
      sourceRefs: hb([32, 33]),
    },
  ],
  summary: [
    'Toxicity: lipid peroxidation, protein damage, DNA damage, xenobiotic binding, altered Ca²⁺.',
    'Lipid peroxidation: initiation (H abstraction) → propagation (L· + O₂ → LOO·; LOO· + LH → LOOH + L·) → accumulation (leaky membranes) → termination.',
    'Malondialdehyde forms DNA adducts. Tocopherols inhibit initiation.',
    '·OH + guanine → 8-hydroxyguanine (mutagenic) or ring-opened guanine (blocks replication).',
    'Oxidised LDL: foam cells, chemotaxis, cytotoxicity, adhesion molecules, tissue factor, autoantibodies.',
  ],
};

const lesson4: Draft = {
  id: 'free-radicals-and-oxygen-toxicity-4',
  title: 'Antioxidants',
  description: 'What antioxidants are and how they work, the antioxidant enzymes and vitamins, metal-binding proteins and dietary sources.',
  xp: 25,
  sourceRefs: [...hb([38, 39, 40, 41, 42, 43, 44, 45, 47, 48, 49, 50]), ...fy([24, 25, 27])],
  objectives: [
    'Define an antioxidant and a good antioxidant',
    'Describe the four modes of antioxidant action',
    'State what SOD, catalase and glutathione peroxidase do, and their cofactors',
    'Describe the actions of vitamin E, β-carotene and vitamin C',
    'Name preventive (metal-binding) antioxidants and dietary sources',
  ],
  chunks: [
    {
      title: 'What antioxidants are',
      kind: 'definitions',
      paragraphs: [
        'Antioxidants protect against harmful oxygen-derived radicals. An antioxidant is a molecule stable enough to donate an electron to a radical and neutralise it. The body has its own (in vivo) antioxidants and we can add more from outside; normally radicals and antioxidants are balanced. Serum antioxidant activity is measured as % inhibition of lipid peroxidation in a standard brain homogenate (HB slides 38, 47).',
        'A good antioxidant is relatively unreactive as a radical, is repaired rapidly and decays to harmless products. When the balance breaks — more radicals or fewer antioxidants — oxidative stress results (HB slide 50).',
      ],
      sourceRefs: [...hb([38, 47, 50]), ...fy([24])],
    },
    {
      title: 'Modes of action',
      kind: 'classification',
      steps: [
        { label: 'Chain breaking', detail: 'α-Tocopherol, in the lipid phase, traps radicals.' },
        { label: 'Reducing ROS', detail: 'Glutathione.' },
        { label: 'Scavenging initiating radicals', detail: 'SOD, in the aqueous phase, removes superoxide.' },
        { label: 'Chelating transition metals', detail: 'Transferrin, lactoferrin and ferritin hold iron; caeruloplasmin and albumin hold copper.' },
      ],
      keyPoints: [
        'Preventive antioxidants are binding proteins that keep free ions bound (transferrin for Fe, caeruloplasmin for Cu); scavenger (chain-breaking) antioxidants break the radical chain (HB slide 43).',
        'Largely extracellular: transferrin, lactoferrin, caeruloplasmin, haemopexin, haptoglobin. Both inside and outside cells: α-tocopherol. GSH, urate, α-tocopherol and ascorbate react directly with radicals, non-catalytically (HB slide 47).',
      ],
      sourceRefs: hb([39, 43, 46, 47]),
    },
    {
      title: 'Antioxidant enzymes',
      kind: 'comparison',
      table: {
        columns: ['Enzyme', 'Acts on', 'Reaction', 'Notes'],
        rows: [
          ['Superoxide dismutase (SOD)', 'Superoxide', 'O₂·⁻ → H₂O₂', 'MnSOD (mitochondrial), CuZnSOD (cytoplasmic), CuSOD (extracellular)'],
          ['Catalase', 'H₂O₂', 'H₂O₂ → H₂O', 'Blood, bone marrow, mucous membranes, kidney, liver'],
          ['Glutathione peroxidase', 'H₂O₂ and lipid peroxides', 'Removes both, using GSH', 'A selenoprotein; cytosol and mitochondria; red cells'],
        ],
      },
      keyPoints: ['Selenium, copper, manganese and zinc are needed by these enzymes, so dietary shortage of these minerals weakens enzymatic defence (HB slide 48; Fay slide 25).'],
      sourceRefs: [...hb([40, 48]), ...fy([24, 25])],
    },
    {
      title: 'Vitamins and other antioxidants',
      kind: 'comparison',
      table: {
        columns: ['Vitamin', 'Solubility', 'Action'],
        rows: [
          ['α-Tocopherol (vitamin E)', 'Fat', 'Breaks lipid peroxidation; scavenges lipid peroxides, O₂·⁻ and ·OH'],
          ['β-Carotene', 'Fat', 'Scavenges ·OH, O₂·⁻ and peroxyl radicals; prevents oxidation of vitamin A; binds transition metals'],
          ['Ascorbic acid (vitamin C)', 'Water', 'Scavenges O₂·⁻, ·OH and H₂O₂; neutralises neutrophil oxidants; helps regenerate vitamin E'],
        ],
      },
      keyPoints: [
        'Other antioxidants: glutathione, CoQ10, uric acid, albumin. Drugs: xanthine oxidase inhibitors (allopurinol), “NADPH inhibitors” (adenosine, Ca²⁺ channel blockers), and inhibitors of iron redox cycling (deferoxamine, apotransferrin) (HB slide 45).',
      ],
      sourceRefs: hb([41, 44, 45]),
    },
    {
      title: 'Sources',
      kind: 'definitions',
      paragraphs: [
        'Antioxidants come as medicines (vitamins A, C, E; cystine, glutathione, methionine; selenium, zinc) and in food: green and yellow vegetables, turmeric, garlic, grapes, tea, berries, carrots, spinach, broccoli, red meat, kidney and liver (HB slide 42).',
        'Phytochemicals: carotenoids (carrots, tomatoes, greens, mangoes, spinach, legumes, nuts) and polyphenolic flavonoids (berries, green tea, apples, chocolate, red grapes) (HB slide 49; Fay slide 27).',
      ],
      sourceRefs: [...hb([42, 49]), ...fy([27])],
    },
  ],
  summary: [
    'Antioxidant: donates an electron to neutralise a radical; good ones are unreactive, quickly repaired, decay harmlessly.',
    'Modes: chain breaking (vitamin E), reducing ROS (GSH), scavenging (SOD), chelating metals (transferrin, ferritin, caeruloplasmin, albumin).',
    'SOD: O₂·⁻ → H₂O₂ (Mn, CuZn, Cu forms). Catalase: H₂O₂ → H₂O. Glutathione peroxidase (Se): H₂O₂ and lipid peroxides.',
    'Vitamin E and β-carotene (fat-soluble); vitamin C (water-soluble, regenerates E).',
    'Se, Cu, Mn, Zn are needed for enzymatic defence.',
  ],
};

const lesson5: Draft = {
  id: 'free-radicals-and-oxygen-toxicity-5',
  title: 'Free Radicals in Disease',
  description: 'Oxidative stress in ageing, cancer and atherosclerosis, HIV, pregnancy and diabetic embryopathy, Down syndrome, transplantation, and how oxidative stress is measured.',
  xp: 25,
  sourceRefs: [...hb([31, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 67]), ...fy([18, 19, 20, 21, 22, 23, 26])],
  objectives: [
    'List diseases linked to free radical chain reactions',
    'Explain how free radicals contribute to the stages of carcinogenesis and how antioxidants may protect',
    'Explain the links between ROS and HIV',
    'Describe antioxidant status in pregnancy and diabetic embryopathy',
    'Explain the role of xanthine oxidase in transplant reperfusion injury',
    'Name antioxidant and oxidative biomarkers',
  ],
  chunks: [
    {
      title: 'Oxidative stress and disease',
      kind: 'clinical',
      paragraphs: [
        'Excess radicals and oxidative stress harm proteins, lipids and DNA and can cause necrosis or apoptosis; ageing speeds up and degenerative diseases — cancer, atherosclerosis, Alzheimer’s, arthritis — become more likely (HB slide 52).',
        'Chain reactions are linked to carcinogenesis, reperfusion injury of the heart, shock-related injury, arteriosclerosis, rheumatoid arthritis, adult respiratory disease, diabetes, obesity and lipid disorders (HB slide 31).',
        'Cancer: endogenous radical reactions, like those of ionising radiation, may cause tumours; the correlation between fat and oil intake and deaths from leukaemia and cancers of the breast, ovary and rectum over 55 may reflect lipid peroxidation. Atherosclerosis may come from radical reactions of dietary lipids in the artery wall, producing peroxides that injure the endothelium (HB slide 53; Fay slide 19).',
      ],
      sourceRefs: [...hb([31, 52, 53]), ...fy([18, 19])],
    },
    {
      title: 'Carcinogenesis',
      kind: 'pathway',
      paragraphs: ['Early on, a transformed cell can revert if the immune system detects and corrects it. Otherwise it passes through initiation, promotion and progression (HB slide 58).'],
      steps: [
        { label: 'Initiation', detail: 'Radicals (from radiation, xenobiotics, inflammatory cells, respiration) damage DNA — mutagenesis and clastogenesis — activating proto-oncogenes and inactivating tumour suppressor genes.' },
        { label: 'Promotion', detail: 'Radicals activate procarcinogens and tumour promoters → premalignant cell.' },
        { label: 'Progression', detail: 'Dysregulation, greater autonomy, less dependence on growth factors → clinical cancer.' },
      ],
      keyPoints: [
        'Antioxidants can repair at each stage. They protect lipids and enzymes and slow radical generation (preventing initiation); later they deactivate genotoxins and tumour promoters and maintain gap junctions and membrane stability (HB slides 61–63).',
        'Most epidemiological data suggest supplementing vitamins A, E, C, β-carotene and selenium lowers the incidence of various cancers (HB slide 63).',
      ],
      sourceRefs: hb([58, 59, 61, 62, 63]),
    },
    {
      title: 'HIV',
      kind: 'clinical',
      paragraphs: [
        'H₂O₂ crosses membranes easily and promotes viral gene expression. Oxidative stress increases HIV replication by activating NF-κB. At the infection site ROS stress tissue and induce pro-inflammatory cytokines (inflammatory injury), and cytokines in turn release ROS and activate HIV (HB slide 54; Fay slides 20–21).',
        'People living with HIV have about 30% lower glutathione, and lower SOD and glutathione peroxidase; glutathione supplementation reduced HIV expression in infected cells, and oral vitamin C has helped in HIV, hepatitis, influenza and infectious mononucleosis (HB slide 55).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes explaining cytokines and SOD on these slides were added to the decks and are not quizzed.' }],
      sourceRefs: [...hb([54, 55]), ...fy([20, 21, 22])],
    },
    {
      title: 'Pregnancy, diabetic embryopathy and Down syndrome',
      kind: 'clinical',
      paragraphs: [
        'Pregnancy increases radical production (stress, rapid fetal growth), and antioxidant activity rises progressively — serum tocopherol, glutathione peroxidase, caeruloplasmin and transferrin. There is no evidence that antioxidants need to be given in normal pregnancy, but drugs that generate radicals should be avoided (HB slide 51).',
        'In poorly controlled diabetes, oxidative stress may contribute to fetal malformations: swings in glucose, ketone bodies and branched-chain amino acids, and later a glucose load accelerating mitochondrial electron flow and radical leakage in embryonic tissue. Keeping blood glucose normal is key (HB slides 56–57).',
        'Radicals, a hallmark of ageing, increase with maternal age and may play a role in Down syndrome; antioxidants may help prevent it (HB slide 58).',
      ],
      sourceRefs: hb([51, 56, 57, 58]),
    },
    {
      title: 'Transplantation and measurement',
      kind: 'clinical',
      paragraphs: [
        'Organs for transplant suffer long hypoxia, and ischaemia–reperfusion injury can occur in liver, kidney and heart, triggered by xanthine oxidase. Allopurinol (a xanthine oxidase inhibitor) improves myocardial contractility in cardiopulmonary bypass; SOD reduced acute renal failure in renal transplants; SOD, catalase and allopurinol preserved organ function in ischaemia. In the US antioxidant therapy before bypass and kidney transplant has become routine (HB slides 65–67; Fay slides 23, 26).',
      ],
      table: {
        columns: ['Antioxidant biomarkers', 'Oxidative biomarkers'],
        rows: [
          ['Total antioxidant potential, SOD, total glutathione', 'Malondialdehyde (MDA)'],
          ['Glutathione peroxidase and reductase, GSH/GSSG ratio', 'Hydrogen peroxide'],
          ['Catalase', 'Total nitric oxide'],
        ],
      },
      sourceRefs: [...hb([64, 65, 66, 67]), ...fy([23, 26])],
    },
  ],
  summary: [
    'Oxidative stress speeds ageing and degenerative disease: cancer, atherosclerosis, Alzheimer’s, arthritis, diabetes.',
    'Carcinogenesis: initiation (DNA damage) → promotion → progression; antioxidants can repair at each stage.',
    'HIV: H₂O₂ and NF-κB increase replication; lower glutathione, SOD and GPx in AIDS.',
    'Pregnancy raises antioxidant activity; diabetic embryopathy linked to oxidative stress — keep glucose normal.',
    'Transplant reperfusion injury via xanthine oxidase; allopurinol, SOD, catalase protect.',
    'Biomarkers: SOD, glutathione, GPx, catalase, GSH/GSSG; MDA, H₂O₂, NO.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: interactive[lesson.id],
}));

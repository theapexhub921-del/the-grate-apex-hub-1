// Biochemistry → Amino Acid Metabolism — the nine lessons (reading layer).
// Sources: the four decks by Dr Annani-Akollor (a1–a4). References:
// "AA1 slide 22", "AA3 slide 15".
import type { LessonDraft } from '@/data/topics/build';
import { a1, a2, a3, a4, type ConceptId } from '@/data/topics/amino-acid-metabolism/sources';
import { interactive, readingExtras } from '@/data/topics/amino-acid-metabolism/interactive';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'amino-acid-metabolism-1',
  title: 'Amino Acids: Structure and Properties',
  description: 'The α-amino acid, its charge at different pH values, how amino acids build the four levels of protein structure, and what they do in the body.',
  xp: 25,
  sourceRefs: a1([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 24, 25, 27, 50, 51]),
  objectives: [
    'Describe the basic structure of an α-amino acid',
    'Explain zwitterions and the isoelectric point',
    'Describe primary, secondary, tertiary and quaternary structure',
    'List the functions of amino acids in the body',
  ],
  chunks: [
    {
      title: 'The α-amino acid',
      kind: 'structure',
      paragraphs: [
        'Amino acids are the building blocks of proteins. Each has a central, tetrahedral α-carbon bonded to an amino group (NH₂), a carboxyl group (COOH), a hydrogen and a variable side chain (R). All share this core; they differ in R (AA1 slides 5–6).',
        'The α-carbon is chiral in every amino acid except glycine, whose R group is hydrogen. Proteins contain only L-isoforms; under the newer IUPAC nomenclature the L/D forms are replaced by the (S)/(R) system (AA1 slides 6, 25).',
        'Hundreds of amino acids exist in nature; only 22 α-amino acids appear in the genetic code, and twenty are common in proteins (AA1 slide 19).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA1 slide 19 (how the L/D and R/S conventions are derived) were added to the deck and are not quizzed.' }],
      sourceRefs: a1([5, 6, 19, 25]),
    },
    {
      title: 'Charge and the isoelectric point',
      kind: 'mechanism',
      paragraphs: [
        'Amino acids are amphoteric (ampholytes): –COOH makes them acidic and –NH₂ basic. In an acidic environment the amino group accepts a proton (–NH₃⁺); in a basic environment the carboxyl group gives one up (–COO⁻) (AA1 slides 6, 7, 9).',
        'The pKa of the α-COOH is about 2 and of the α-NH₂ about 9, so at physiological pH most amino acids exist as zwitterions (AA1 slide 9).',
        'The isoelectric point (pI) is the pH at which an amino acid carries no net charge and so does not move in an electric field. Below the pI it is a cation (+); above it, an anion (−) (AA1 slides 22–24).',
      ],
      terms: [
        { term: 'Zwitterion', meaning: 'A form carrying both a positive and a negative charge, with no net charge.' },
        { term: 'Isoelectric point (pI)', meaning: 'The pH at which an amino acid bears no net charge.' },
      ],
      sourceRefs: a1([6, 7, 9, 22, 23, 24]),
    },
    {
      title: 'From amino acids to proteins',
      kind: 'structure',
      paragraphs: [
        'A condensation reaction between the carboxyl of one amino acid and the amino group of another forms a peptide bond. Oligopeptides have 2–10 residues, polypeptides 11–100, and proteins more than 100 (AA1 slide 51).',
      ],
      table: {
        columns: ['Level', 'What it is', 'Held by'],
        rows: [
          ['Primary', 'The linear sequence of amino acids', 'Peptide bonds'],
          ['Secondary', 'Local conformation: α-helix (side chains project outward) and β-pleated sheet', 'Hydrogen bonds'],
          ['Tertiary', 'Overall fold; contains α-helices and β-sheets', 'Non-covalent bonds between side chains: van der Waals, hydrogen, ionic'],
          ['Quaternary', 'Two or more subunits, e.g. haemoglobin’s four globin chains', 'Mostly non-covalent bonds; sometimes disulfide bonds'],
        ],
      },
      sourceRefs: a1([8, 10, 11, 12, 13, 14, 15, 16, 17, 51]),
    },
    {
      title: 'What amino acids do',
      kind: 'overview',
      paragraphs: [
        'Besides building proteins, amino acids are precursors of glucose (gluconeogenesis), purines and pyrimidines, and haem; some non-protein amino acids are intermediates of the urea cycle; serine forms part of phospholipids and glycine part of bile salts; and some are neurotransmitters, mediators or hormones, or their precursors (AA1 slide 18).',
        'They are colourless, non-volatile crystalline solids that decompose above 200 °C (AA1 slide 20). Unusual amino acids such as hydroxyproline, ornithine and norleucine arise by modification of the common ones (AA1 slide 50).',
      ],
      sourceRefs: a1([18, 20, 27, 50]),
    },
  ],
  summary: [
    'α-Carbon carries NH₂, COOH, H and R; chiral except glycine; proteins use L-forms.',
    'pKa ≈ 2 (COOH) and ≈ 9 (NH₂): zwitterions at physiological pH. pI = no net charge.',
    'Peptide bond by condensation. Primary → secondary (H bonds) → tertiary → quaternary.',
  ],
};

const lesson2: Draft = {
  id: 'amino-acid-metabolism-2',
  title: 'Classifying Amino Acids',
  description: 'The five R-group classes, which amino acids we must eat, and which feed glucose or ketone production.',
  xp: 25,
  sourceRefs: [...a1([31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 44, 45, 47, 48]), ...a2([10])],
  objectives: [
    'Classify the 20 amino acids by R group',
    'Distinguish essential, non-essential and conditionally essential amino acids',
    'Distinguish glucogenic and ketogenic amino acids by their end products',
  ],
  chunks: [
    {
      title: 'Five classes by R group',
      kind: 'classification',
      paragraphs: ['The R group differs in structure, size and charge, and determines solubility in water. The common amino acids fall into five classes by R-group reactivity (AA1 slides 31, 33).'],
      table: {
        columns: ['Class', 'Members', 'Notes'],
        rows: [
          ['Aliphatic non-polar', 'Gly, Ala, Val, Leu, Ile, Pro, Met', 'Leu, Ile and Val are the branched-chain amino acids'],
          ['Aromatic', 'Phe, Tyr, Trp', 'Very hydrophobic; absorb UV at 280 nm; Trp has an indole ring'],
          ['Polar uncharged', 'Ser, Thr, Asn, Gln', 'Hydrophilic, form hydrogen bonds; Asn and Gln are amides of Asp and Glu'],
          ['Polar negatively charged', 'Asp, Glu', 'Negative at physiological pH, hence “-ate”'],
          ['Polar positively charged', 'Lys, Arg, His', 'Arg has a guanidino group; His an imidazole ring'],
        ],
      },
      keyPoints: ['Sulfur-containing: cysteine (sulfhydryl) and methionine (thioether); cystine forms from two cysteines. Hydroxyl-containing: serine, threonine and tyrosine (AA1 slide 45).'],
      sourceRefs: a1([31, 33, 34, 35, 36, 37, 38, 45]),
    },
    {
      title: 'Essential and non-essential',
      kind: 'classification',
      paragraphs: [
        'Plants and bacteria make all twenty amino acids, but animals lack many of the enzymes. Humans need ten of the twenty in the diet — the essential amino acids; the other ten, which the body can make, are non-essential (AA1 slides 39–40).',
      ],
      table: {
        columns: ['Conditionally essential', 'Why'],
        rows: [
          ['Arginine', 'Made, but not in sufficient amounts'],
          ['Histidine', 'Controversial; essential for growth in children'],
          ['Tyrosine', 'Made from phenylalanine — essential when that enzyme is missing (PKU)'],
          ['Cysteine', 'Made from methionine — essential if methionine is not converted'],
        ],
      },
      sourceRefs: a1([39, 40, 44]),
    },
    {
      title: 'Glucogenic and ketogenic',
      kind: 'classification',
      paragraphs: [
        'Glucogenic amino acids are catabolised to pyruvate, succinyl-CoA, α-ketoglutarate, fumarate or oxaloacetate — e.g. alanine, asparagine, aspartate, arginine, cysteine, glutamine, histidine, methionine, proline, threonine and valine (AA1 slide 47).',
        'Ketogenic amino acids give acetyl-CoA or acetoacetyl-CoA. Leucine and lysine are purely ketogenic; isoleucine, phenylalanine, tryptophan and tyrosine are both (AA1 slide 48; AA2 slide 10).',
      ],
      sourceRefs: [...a1([47, 48]), ...a2([10])],
    },
  ],
  summary: [
    'Five R-group classes: aliphatic non-polar, aromatic, polar uncharged, negative (Asp, Glu), positive (Lys, Arg, His).',
    'Ten essential; Arg, His, Tyr and Cys conditionally essential.',
    'Purely ketogenic: Leu, Lys. Both: Ile, Phe, Trp, Tyr.',
  ],
};

const lesson3: Draft = {
  id: 'amino-acid-metabolism-3',
  title: 'General Reactions of Amino Acids',
  description: 'Digestion to the amino acid pool, then the reactions every amino acid can undergo: decarboxylation, transamination, oxidative deamination and transdeamination.',
  xp: 25,
  sourceRefs: [...a1([28, 30, 52, 54, 55, 56, 57, 59, 60, 61, 62]), ...a3([7])],
  objectives: [
    'Outline protein digestion and the amino acid pool',
    'Give examples of decarboxylation to physiologically important amines',
    'Explain transamination and the role of PLP',
    'Describe glutamate dehydrogenase, its regulation and transdeamination',
  ],
  chunks: [
    {
      title: 'Digestion and the amino acid pool',
      kind: 'pathway',
      paragraphs: [
        'Dietary proteins are digested — mostly in the small intestine — absorbed into the blood and join the amino acid pool, used for protein synthesis or metabolites. Body proteins are degraded in proteasomes after tagging with ubiquitin (AA1 slide 28).',
        'In the stomach pepsinogen becomes pepsin (maximum activity at pH 2). In the small intestine enteropeptidase activates trypsinogen to trypsin, which activates chymotrypsinogen, proelastase and procarboxypeptidase; aminopeptidases come from the intestinal epithelium (AA1 slide 30).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note on AA1 slide 30 (enteropeptidase is also called enterokinase) was added to the deck and is not quizzed.' }],
      sourceRefs: a1([28, 30]),
    },
    {
      title: 'Decarboxylation',
      kind: 'mechanism',
      paragraphs: ['Amino acids are decarboxylated to amines, some with important roles (AA1 slides 52–55).'],
      table: {
        columns: ['Amine', 'From', 'Role'],
        rows: [
          ['Histamine', 'Histidine', 'Stimulates gastric secretion; immune response (itching)'],
          ['Dopamine', 'DOPA', 'Intermediate to adrenaline; the “feel good” neurotransmitter'],
          ['Serotonin (5-hydroxytryptamine)', '5-Hydroxytryptophan', 'Neurotransmitter for mood and memory'],
        ],
      },
      sourceRefs: a1([52, 54, 55]),
    },
    {
      title: 'Transamination',
      kind: 'mechanism',
      paragraphs: [
        'Transamination transfers an amino group from an amino acid to a keto acid, forming the corresponding amino acid. Aminotransferases (e.g. AST and ALT) need pyridoxal phosphate (PLP), from vitamin B6, as prosthetic group; PLP carries the amino group, switching between its aldehyde form and pyridoxamine phosphate (AA1 slides 56–57).',
        'In mammals every α-amino acid except lysine and threonine can be transaminated. Proline, with a secondary amino group, cannot take part in PLP-dependent reactions (AA1 slide 59; AA3 slide 7).',
        'Transamination funnels nitrogen from all amino acids into a few compounds, which are then oxidatively deaminated or have their amino groups converted to urea (AA3 slide 7).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note calling transamination a “ping-pong” reaction (AA1 slide 56) was added to the deck and is not quizzed.' }],
      sourceRefs: [...a1([56, 57, 59]), ...a3([7])],
    },
    {
      title: 'Oxidative deamination and transdeamination',
      kind: 'regulation',
      paragraphs: [
        'Glutamate is oxidatively deaminated in liver mitochondria: L-glutamate + H₂O ⇌ α-ketoglutarate + NH₄⁺, catalysed by glutamate dehydrogenase (GDH), a complex allosteric enzyme. The ammonia goes to the urea cycle (AA1 slides 60–61).',
        'GDH is activated by GDP and ADP and inhibited by GTP and ATP: when the liver needs fuel from the citric acid cycle its activity rises; when ATP and GTP accumulate it is inhibited. Raised serum GLDH indicates liver damage (AA1 slides 61–62).',
        'Transamination coupled with GDH — transdeamination — gives a route for deaminating all amino acids (AA1 slide 62).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA1 slides 61–62 (GDH in heavy drinkers; ADP-ribosylation by SIRT4) were added to the deck and are not quizzed.' }],
      sourceRefs: a1([60, 61, 62]),
    },
  ],
  summary: [
    'Pepsin (pH 2) in stomach; enteropeptidase → trypsin → other pancreatic proteases.',
    'Decarboxylation: histidine → histamine, DOPA → dopamine, 5-HTP → serotonin.',
    'Transamination needs PLP (B6); not Lys, Thr or Pro.',
    'GDH: Glu ⇌ α-KG + NH₄⁺; ADP/GDP activate, ATP/GTP inhibit. Transdeamination = aminotransferase + GDH.',
  ],
};

const lesson4: Draft = {
  id: 'amino-acid-metabolism-4',
  title: 'Ammonia: Assimilation, Transport and Toxicity',
  description: 'How glutamate and glutamine capture ammonia, how it reaches the liver and kidney, why it is toxic, and how animals excrete nitrogen.',
  xp: 25,
  sourceRefs: a3([4, 5, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21]),
  objectives: [
    'Describe the glutamate dehydrogenase, glutamine synthetase and glutaminase reactions',
    'Explain how glutamine carries ammonia to the liver and kidney, including in acidosis',
    'Describe the alanine–glucose cycle',
    'Explain why ammonia is toxic',
  ],
  chunks: [
    {
      title: 'Capturing ammonia',
      kind: 'pathway',
      paragraphs: [
        'Reduced nitrogen enters the body as dietary amino acids, protein, and ammonia from gut bacteria. Glutamate dehydrogenase and glutamine synthetase convert ammonia into glutamate and glutamine; their amino and amide groups then pass to other carbon skeletons (AA3 slide 4).',
        'GDH incorporates free ammonia into α-ketoglutarate (an NADPH-requiring reaction) to give glutamate; glutamine synthetase adds a second ammonium to glutamate, using ATP, to give glutamine (AA3 slide 8). Glutamine is also a co-substrate for making asparagine (AA3 slide 5).',
        'Glutamine synthetase is mainly in astrocytes, protecting neurons from excitotoxicity by turning excess ammonia and glutamate into glutamine; its malfunction is linked to Alzheimer’s disease, epilepsy and glioblastoma multiforme (AA3 slide 10).',
        'The liver has both glutamine synthetase and glutaminase in different cells; urea cycle enzymes sit in the same cells as glutaminase, letting the liver scavenge ammonia not made into urea (AA3 slide 11).',
      ],
      sourceRefs: a3([4, 5, 8, 10, 11]),
    },
    {
      title: 'Glutamine and alanine as carriers',
      kind: 'mechanism',
      paragraphs: [
        'In many peripheral tissues glutamine synthetase turns ammonia into glutamine, which travels to the liver; there mitochondrial glutaminase releases the ammonia, giving glutamate (AA3 slide 14).',
        'Glutamine is the major carrier of NH₃ from peripheral tissues to the kidney. In acidosis more glutamine goes to the kidney instead of the liver — conserving bicarbonate, which urea synthesis consumes. Renal glutaminase and then GDH each release an ammonia; it is excreted as NH₄⁺ (AA3 slide 12).',
        'Skeletal muscle sends ammonia as alanine. In the liver alanine is transaminated to pyruvate (and glutamate); the nitrogen goes to urea and the pyruvate to glucose, which returns to muscle — the alanine–glucose cycle, which puts the burden of gluconeogenesis on the liver (AA3 slides 15, 18).',
        'Muscle alanine comes from protein breakdown and from transamination of pyruvate by ALT. Alanine is second only to glutamine as a circulating amino acid (AA3 slide 19).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA3 slide 9 (the many roles of glutamine and glutaminase) were added to the deck and are not quizzed.' }],
      sourceRefs: a3([12, 14, 15, 18, 19]),
    },
    {
      title: 'Why ammonia is toxic',
      kind: 'clinical',
      paragraphs: [
        'Accumulated ammonia reverses the GDH reaction and depletes the cell of α-ketoglutarate, so ATP synthesis falls; active transport fails and the electrochemical gradient needed for nerve impulses is lost. Ammonia may also impede synthesis of the neurotransmitter GABA (AA3 slide 16).',
        'Increased glutamine synthesis may lead to encephalopathy; ammonia can also cause acid–base disturbances and inhibit amino acid transport and the Na⁺/K⁺-ATPase (AA3 slide 17).',
      ],
      sourceRefs: a3([16, 17]),
    },
    {
      title: 'Excreting nitrogen',
      kind: 'comparison',
      paragraphs: ['Animals that excrete nitrogen as ammonia (most aquatic species, such as bony fishes) are ammonotelic; as urea (terrestrial animals), ureotelic; as uric acid (birds and reptiles), uricotelic (AA3 slide 21).'],
      sourceRefs: a3([21]),
    },
  ],
  summary: [
    'GDH: α-KG + NH₃ → Glu. Glutamine synthetase: Glu + NH₄⁺ + ATP → Gln. Glutaminase reverses it.',
    'Glutamine carries ammonia to liver and kidney; in acidosis, to the kidney (NH₄⁺ excreted, HCO₃⁻ saved).',
    'Alanine–glucose cycle: muscle alanine → liver urea + glucose → muscle.',
    'Toxicity: α-KG depletion → ↓ATP, ↓GABA, glutamine → encephalopathy.',
  ],
};

const lesson5: Draft = {
  id: 'amino-acid-metabolism-5',
  title: 'The Urea Cycle',
  description: 'The five steps of urea synthesis, where they happen, how the cycle links to the citric acid cycle, its regulation, and what happens when an enzyme is missing.',
  xp: 25,
  sourceRefs: a3([23, 24, 25, 26, 27, 31, 33, 34]),
  objectives: [
    'Describe the five steps of the urea cycle and where each occurs',
    'Explain the role of N-acetylglutamate',
    'Link fumarate from the urea cycle to the citric acid cycle',
    'Describe inherited urea cycle defects and their management',
  ],
  chunks: [
    {
      title: 'Five steps in two compartments',
      kind: 'pathway',
      paragraphs: ['Urea is made mainly in the liver, in five enzymatic steps. The first two are in the mitochondria and the rest in the cytosol, so ornithine must enter the mitochondria and citrulline leave them (AA3 slides 23–26).'],
      table: {
        columns: ['Step', 'Reaction', 'Enzyme', 'Where'],
        rows: [
          ['I', 'NH₃ → carbamoyl phosphate', 'Carbamoyl phosphate synthetase I (needs N-acetylglutamate)', 'Mitochondria'],
          ['II', 'Carbamoyl phosphate + ornithine → citrulline', 'Ornithine transcarbamoylase', 'Mitochondria'],
          ['III', 'Citrulline + aspartate → argininosuccinate', 'Argininosuccinate synthetase', 'Cytosol'],
          ['IV', 'Argininosuccinate → arginine + fumarate', 'Argininosuccinate lyase', 'Cytosol'],
          ['V', 'Arginine → urea + ornithine', 'Arginase', 'Cytosol'],
        ],
      },
      keyPoints: [
        'Step II is driven forward by orthophosphate cleavage; step III by pyrophosphate cleavage (AA3 slides 25–26).',
        'Urea travels in the blood to the kidneys. Blood urea nitrogen (BUN) tests kidney function; blood ammonia tests liver function (AA3 slide 23).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note on AA3 slide 24 (only ureotelic organisms have arginase) was added to the deck and is not quizzed.' }],
      sourceRefs: a3([23, 24, 25, 26]),
    },
    {
      title: 'Link to the citric acid cycle',
      kind: 'mechanism',
      paragraphs: [
        'Fumarate from the argininosuccinate lyase step enters the mitochondria, where fumarase and malate dehydrogenase turn it into oxaloacetate. Oxaloacetate can join acetyl-CoA in the citric acid cycle, be made into glucose, or be converted to aspartate — a nitrogen donor for the urea cycle (AA3 slide 27).',
      ],
      sourceRefs: a3([27]),
    },
    {
      title: 'Regulation',
      kind: 'regulation',
      paragraphs: [
        'Carbamoyl phosphate synthetase I needs N-acetylglutamate (NAG) as allosteric activator. NAG synthase makes it from acetyl-CoA and glutamate when protein intake is high, and is stimulated by arginine. Glutamate is both its substrate and so an activator of the cycle (AA3 slides 24, 33).',
        'Glucagon, insulin and glucocorticoids regulate expression of the liver’s urea cycle enzymes; elsewhere cytokines do. Regulation is largely transcriptional (AA3 slide 34).',
      ],
      sourceRefs: a3([24, 33, 34]),
    },
    {
      title: 'Inherited defects',
      kind: 'clinical',
      paragraphs: [
        'Infants with complete deficiency of a urea cycle enzyme die soon after their first protein meal; partial deficiency allows survival into early adulthood or later with management (AA3 slide 31).',
        'Hyperammonaemia causes lethargy, stupor, convulsions and CNS impairment, with coma and death in severe cases. Patients cannot tolerate protein-rich diets and are given α-keto analogues of the essential amino acids (AA3 slide 31).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note on AA3 slide 31 explaining how keto-analogues use excess ammonia was added to the deck and is not quizzed.' }],
      sourceRefs: a3([31]),
    },
  ],
  summary: [
    'CPS I → OTC (mitochondria); ASS → ASL → arginase (cytosol).',
    'NAG activates CPS I; made from acetyl-CoA + Glu; stimulated by Arg.',
    'Fumarate → oxaloacetate → TCA, glucose or aspartate.',
    'Defects → hyperammonaemia; low-protein diet with α-keto analogues.',
  ],
};

const lesson6: Draft = {
  id: 'amino-acid-metabolism-6',
  title: 'Branched-Chain Amino Acids and Phenylalanine',
  description: 'How leucine, isoleucine and valine are broken down, maple syrup urine disease and its relatives, and phenylketonuria.',
  xp: 25,
  sourceRefs: a2([5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 21, 22]),
  objectives: [
    'Describe the first three steps of branched-chain amino acid catabolism',
    'State the end products of leucine, isoleucine and valine',
    'Describe MSUD, intermittent branched-chain ketonuria and isovaleric acidaemia',
    'Explain the cause, inheritance and management of phenylketonuria',
  ],
  chunks: [
    {
      title: 'Branched-chain amino acids',
      kind: 'pathway',
      paragraphs: [
        'Leucine, isoleucine and valine are hydrophobic, essential and important for muscle protein. They are an alternative fuel for the brain in starvation (AA2 slides 5–6).',
        'Their catabolism starts in muscle — 65% of BCAA transamination occurs in skeletal muscle — and is also shown in liver, adipose, kidney and brain. It yields NADH and FADH₂ (AA2 slides 7, 9).',
      ],
      table: {
        columns: ['Step', 'What happens', 'Enzyme'],
        rows: [
          ['1', 'Transamination to branched-chain α-keto acids, with α-ketoglutarate as acceptor (giving glutamate)', 'Branched-chain aminotransferase (BCATm, BCATc)'],
          ['2', 'Oxidative decarboxylation to CoA derivatives', 'Branched-chain α-keto acid dehydrogenase complex'],
          ['3', 'FAD-linked dehydrogenation; pathways then diverge', '—'],
        ],
      },
      keyPoints: [
        'The α-keto acid dehydrogenase complex resembles pyruvate dehydrogenase; it is inactivated by phosphorylation and activated by dephosphorylation (AA2 slide 11).',
        'Valine → propionyl-CoA (glucogenic, to succinyl-CoA). Isoleucine → acetyl-CoA + propionyl-CoA (both). Leucine → acetyl-CoA + acetoacetyl-CoA (strictly ketogenic) (AA2 slide 10).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA2 slides 7–8 (BCAA supplement benefits; abbreviations) were added to the deck and are not quizzed.' }],
      sourceRefs: a2([5, 6, 7, 8, 9, 10, 11]),
    },
    {
      title: 'Disorders of BCAA catabolism',
      kind: 'clinical',
      table: {
        columns: ['Disorder', 'Defect', 'Features and management'],
        rows: [
          ['Maple syrup urine disease', 'α-Keto acid dehydrogenase complex', 'α-Keto acids in blood and urine; urine and sweat smell of maple syrup; abnormal brain development, mental retardation, death in infancy. Restrict BCAA; some respond to large doses of thiamine'],
          ['Intermittent branched-chain ketonuria', 'Milder deficiency of the same complex', 'Symptoms later in life and only intermittently; BCAA restriction more effective'],
          ['Isovaleric acidaemia', 'Isovaleryl-CoA dehydrogenase (leucine pathway)', '“Cheesy” odour of breath and urine; mild mental retardation; vomiting, acidosis and coma after protein. Restrict leucine'],
        ],
      },
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA2 slides 12 and 15 (extra MSUD details) were added to the deck and are not quizzed.' }],
      sourceRefs: a2([11, 12, 14, 16, 17]),
    },
    {
      title: 'Phenylketonuria',
      kind: 'clinical',
      paragraphs: [
        'Phenylalanine is normally hydroxylated to tyrosine by phenylalanine hydroxylase with tetrahydrobiopterin as cofactor. Deficiency of the hydroxylase, the cofactor, or the reductase that regenerates the cofactor can cause PKU (AA2 slide 20).',
        'Phenylketones accumulate in blood and urine; phenylpyruvic acid appears in urine (musty odour) 2–6 weeks after blood phenylalanine rises. Features: severe mental retardation, low IQ, and dilution of hair and skin pigmentation (AA2 slide 18).',
        'The phenylalanine hydroxylase gene is on chromosome 12; PKU is autosomal recessive. Two carriers have a 25% chance of an affected child; with a carrier frequency of about 1 in 50, the chance at random is 0.02 × 0.02 × 0.25 = 1 in 10,000, close to the observed 1 in 15,000 (AA2 slide 19).',
        'Management: restrict phenylalanine, keep the diet high in tyrosine for the first 4–5 years, enforce protein restriction for several years, and give tetrahydrobiopterin. Avoid aspartame (aspartyl-phenylalanine methyl ester) (AA2 slides 21–22).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA2 slides 18–20 (symptom lists, PKU types, the α-ketoglutarate explanation of brain damage, “mousy” odour from phenylacetate) were added to the deck and are not quizzed.' }],
      sourceRefs: a2([18, 19, 20, 21, 22]),
    },
  ],
  summary: [
    'BCAA: transamination (muscle) → BCKA dehydrogenase → FAD dehydrogenation.',
    'Val glucogenic; Ile both; Leu ketogenic.',
    'MSUD = BCKA dehydrogenase defect; isovaleric acidaemia = isovaleryl-CoA dehydrogenase (cheesy odour).',
    'PKU: phenylalanine hydroxylase or BH₄ defect; autosomal recessive (chr 12); restrict Phe, give Tyr.',
  ],
};

const lesson7: Draft = {
  id: 'amino-acid-metabolism-7',
  title: 'Tyrosine, Tryptophan, Histidine and Serine',
  description: 'What tyrosine becomes, the tyrosinaemias, alkaptonuria and albinism, serotonin and melatonin from tryptophan, histidinaemia, and serine and glycine.',
  xp: 25,
  sourceRefs: a2([23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 40, 42, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54]),
  objectives: [
    'List the metabolic fates of tyrosine and the steps of catecholamine synthesis',
    'Match the tyrosinaemias, alkaptonuria and albinism to their enzyme defects',
    'Describe serotonin, melatonin and niacin formation from tryptophan',
    'Describe histidinaemia and the formation of serine and glycine',
  ],
  chunks: [
    {
      title: 'Fates of tyrosine',
      kind: 'pathway',
      paragraphs: [
        'Tyrosine is catabolised to acetoacetyl-CoA (via transamination, dioxygenation and isomerisation) and is used to make catecholamines, melanin and the thyroid hormones T₄ and T₃ (AA2 slides 23, 26, 46).',
        'Melanins come from dopaquinone: eumelanins (brown or black) and pheomelanins (red or yellow — the yellow from the sulfur of cysteine) (AA2 slide 25).',
      ],
      table: {
        columns: ['Step', 'Enzyme'],
        rows: [
          ['Tyrosine → L-DOPA', 'Tyrosine hydroxylase (needs tetrahydrobiopterin)'],
          ['L-DOPA → dopamine + CO₂', 'Aromatic amino acid decarboxylase'],
          ['Dopamine → noradrenaline', 'Dopamine β-hydroxylase'],
          ['Noradrenaline → adrenaline', 'Requires SAM'],
        ],
      },
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA2 slide 47 (Parkinson’s disease and L-DOPA) were added to the deck and are not quizzed.' }],
      sourceRefs: a2([23, 24, 25, 26, 46, 47]),
    },
    {
      title: 'Disorders of tyrosine metabolism',
      kind: 'clinical',
      paragraphs: [
        'About 10% of neonates have temporarily raised tyrosine, from vitamin C deficiency or immature liver enzymes in prematurity (AA2 slide 28).',
      ],
      table: {
        columns: ['Disorder', 'Deficient enzyme', 'Features'],
        rows: [
          ['Tyrosinaemia type I', 'Fumarylacetoacetase', 'Maleyl- and fumarylacetoacetate accumulate. Acute (first months): failure to thrive, vomiting, bloody stools, cabbage-like odour, jaundice, hepatitis. Chronic (around 1 year): cirrhosis, polyneuropathy, abdominal pain, heart weakness. Liver damage and Fanconi syndrome'],
          ['Tyrosinaemia type II (oculocutaneous; Richner–Hanhart)', 'Tyrosine aminotransferase', 'Eye lesions (tearing, photophobia, pain), painful skin lesions on palms and soles; ~50% some intellectual disability'],
          ['Tyrosinaemia type III', '4-Hydroxyphenylpyruvate dioxygenase', 'Intellectual disability, seizures, intermittent ataxia'],
          ['Alkaptonuria (homogentisic aciduria)', 'Homogentisate 1,2-dioxygenase', 'Homogentisic acid in urine darkens on standing (alkapton); ochronosis; arthritis later; no effective treatment'],
          ['Albinism', 'Tyrosinase', 'No melanin in skin, hair and eyes; photophobia, poor eyesight, sunburn and skin cancer'],
        ],
      },
      keyPoints: ['People with PKU may have light skin and hair but are not albinos: they get enough tyrosine from the diet to make melanin (AA2 slide 38).'],
      notes: [{ kind: 'check', text: 'AA2 names the alkaptonuria enzyme as homogentisate 1,2-dioxygenase (slide 35) and homogentisic acid oxidase (slide 44), and its review question asks how alkaptonuria differs from homogentisic aciduria. Both names are kept; the difference is not quizzed.' }],
      sourceRefs: a2([27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 40, 44]),
    },
    {
      title: 'Tryptophan',
      kind: 'pathway',
      paragraphs: [
        'Tryptophan hydroxylase (needing tetrahydrobiopterin) makes 5-hydroxytryptophan, which aromatic amino acid decarboxylase turns into serotonin (5-HT) (AA2 slide 49).',
        'Serotonin is made in the brain (sleep, mood, appetite), platelets (aggregation, vasoconstriction), smooth muscle (contraction) and the gut’s enterochromaffin cells, the major store. Drugs acting on it treat depression (SSRIs), migraine, schizophrenia, OCD and chemotherapy-induced vomiting; LSD is an agonist (AA2 slide 50).',
        'In two steps serotonin becomes melatonin, made mainly in the pineal gland under the control of light; it lightens skin, suppresses ovarian function and may help sleep disorders (AA2 slide 51). Tryptophan is also converted, in several steps, to nicotinic acid (niacin) and NAD (AA2 slide 52).',
      ],
      sourceRefs: a2([49, 50, 51, 52]),
    },
    {
      title: 'Histidine, serine and glycine',
      kind: 'mechanism',
      paragraphs: [
        'Histidinaemia is an autosomal recessive deficiency of histidase (histidine ammonia lyase): histidine rises in blood, CSF and urine and urocanic acid falls. It seems benign in most people, but some have CNS disease, eye and speech defects or mental retardation (AA2 slide 42).',
        'Serine is made from the glycolytic intermediate 3-phosphoglycerate in three steps (dehydrogenase, transaminase, phosphatase). Serine hydroxymethyltransferase (PLP-dependent) converts serine to glycine, producing N⁵,N¹⁰-methylene-FH₄ — key for purines and thymine; glycine is used for haem, porphyrins and purines (AA2 slides 53–54).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on AA2 slide 42 (more on histidase and 3-methylhistidine) were added to the deck and are not quizzed.' }],
      sourceRefs: a2([42, 53, 54]),
    },
  ],
  summary: [
    'Tyrosine → acetoacetyl-CoA, catecholamines, melanin, thyroid hormones.',
    'Type I tyrosinaemia: fumarylacetoacetase. Type II: tyrosine aminotransferase. Type III: 4-HPP dioxygenase.',
    'Alkaptonuria: homogentisate dioxygenase. Albinism: tyrosinase.',
    'Trp → 5-HTP → serotonin → melatonin; Trp → niacin. Histidinaemia: histidase.',
  ],
};

const lesson8: Draft = {
  id: 'amino-acid-metabolism-8',
  title: 'Sulfur-Containing Amino Acids',
  description: 'Methionine, SAM and the trans-sulfuration pathway to cysteine; homocystinuria and cystathioninuria; and the roles and breakdown of cysteine.',
  xp: 25,
  sourceRefs: a4([5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
  objectives: [
    'Name the sulfur-containing amino acids and which are in proteins',
    'Trace methionine to cysteine through SAM and cystathionine',
    'Describe homocystinuria and cystathioninuria',
    'Describe the roles and catabolic routes of cysteine, including taurine',
  ],
  chunks: [
    {
      title: 'Methionine',
      kind: 'pathway',
      paragraphs: [
        'Methionine, cysteine, homocysteine and taurine are the four common sulfur amino acids; only methionine and cysteine are in proteins. Methionine is essential; cysteine is non-essential, made from methionine. They support sulfur homeostasis, one-carbon metabolism and the cell’s redox state and detoxification (AA4 slide 5).',
        'Methionine’s major fates are conversion to S-adenosylmethionine (SAM), the principal methyl donor, and the trans-sulfuration pathway to cystathionine and cysteine (AA4 slide 8). Converting homocysteine back to methionine links sulfur and methyl-group metabolism through tetrahydrofolate (AA4 slide 6).',
      ],
      table: {
        columns: ['Step', 'Enzyme or note'],
        rows: [
          ['Methionine → SAM → S-adenosylhomocysteine → homocysteine', 'Methyl group donated'],
          ['Homocysteine + serine → cystathionine (irreversible)', 'Cystathionine β-synthase (PLP)'],
          ['Cystathionine → cysteine + α-ketobutyrate', 'Cystathionine γ-lyase (PLP)'],
          ['α-Ketobutyrate → propionyl-CoA', 'Oxidative decarboxylation'],
        ],
      },
      keyPoints: [
        'Cysteine suppresses synthesis of cystathionine β-synthase and allosterically inhibits γ-lyase (AA4 slide 10).',
        'Net effect: the sulfhydryl of homocysteine moves to the carbon chain of serine (AA4 slide 10).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note on AA4 slide 7 listing the enzymes of the pathway diagram was added to the deck and is not quizzed.' }],
      sourceRefs: a4([5, 6, 8, 9, 10]),
    },
    {
      title: 'Homocystinuria and cystathioninuria',
      kind: 'clinical',
      paragraphs: [
        'Homocystinuria is a deficiency of cystathionine β-synthase (all types autosomal recessive). Homocysteine accumulates in blood and urine and methionine in blood. Homocysteine is prothrombotic, increasing cardiac events (AA4 slide 11).',
        'Homocysteine reacts with lysyl semialdehydes and interferes with collagen cross-linking; homocysteine thiolactone modifies LDL, causing aggregation and atheroma. Patients have severe mental retardation, spine deformity, bone demineralisation, joint dislocation, aortic aneurysms, bilateral lens dislocation, fair complexion with blue eyes, and hepatomegaly (AA4 slides 11–12).',
        'Treatment depends on subtype but usually includes more pyridoxine (B6). For cystathionine synthase deficiency: less methionine, more cysteine, B6, B12 and folate; feed betaine or its precursor choline (AA4 slide 13).',
        'Cystathioninuria is a rare deficiency of cystathionine γ-lyase (or reduced affinity, or PLP deficiency): cystathionine accumulates in blood and urine. Most are asymptomatic (AA4 slide 14).',
      ],
      notes: [{ kind: 'check', text: 'AA4 slide 13 says “eat more Met” when cystathionine synthase has reduced affinity for PLP, while the same slide advises restricting methionine. Kept as written; not quizzed.' }],
      sourceRefs: a4([11, 12, 13, 14]),
    },
    {
      title: 'Cysteine',
      kind: 'mechanism',
      paragraphs: [
        'Cysteine is the main route for putting sulfur into cell components: a precursor of thiamine, biotin, lipoic acid and coenzyme A, important for Fe–S clusters, in the active site of several enzymes, and forms disulfide bonds. Thioredoxin and glutathione protect cells from oxidative stress (AA4 slide 15).',
        'The major catabolic route is a three-step pathway to pyruvate. Cysteine can give sulfite and pyruvate; mitochondrial sulfite oxidase makes sulfate, which becomes PAPS (3′-phosphoadenosine 5′-phosphosulfate), the source of sulfate groups (AA4 slides 16–17).',
        'Sulfite oxidase deficiency causes excretion of thiosulfate and sulfite, with neurological abnormalities from birth and early death (AA4 slide 18).',
        'Cysteine can also give hypotaurine and taurine. Taurine may aid brain development, conjugates bile acids (helping cholesterol clearance), clears xenobiotics and toxins, and may regulate intracellular calcium and osmoregulation (AA4 slides 19–20).',
      ],
      sourceRefs: a4([15, 16, 17, 18, 19, 20]),
    },
  ],
  summary: [
    'Met (essential) → SAM → SAH → homocysteine → cystathionine (β-synthase) → cysteine (γ-lyase).',
    'Homocystinuria: β-synthase deficiency; thrombosis, lens dislocation, collagen defects; B6, ↓Met, ↑Cys, betaine.',
    'Cystathioninuria: γ-lyase; mostly asymptomatic.',
    'Cysteine → pyruvate + sulfite → sulfate → PAPS; also taurine.',
  ],
};

const lesson9: Draft = {
  id: 'amino-acid-metabolism-9',
  title: 'One-Carbon Metabolism',
  description: 'The three one-carbon carriers — biotin, tetrahydrofolate and SAM — where the one-carbon pool comes from and goes, and what happens when folate metabolism fails.',
  xp: 25,
  sourceRefs: a4([21, 22, 23, 25, 28, 32, 33, 34, 35, 37, 39, 40]),
  objectives: [
    'Match biotin, THF and SAM to the one-carbon groups they carry',
    'Describe the structure and formation of tetrahydrofolate',
    'Give the sources and recipients of the one-carbon pool',
    'Explain how sulfonamides work and list inborn errors of folate metabolism',
  ],
  chunks: [
    {
      title: 'Three carriers',
      kind: 'classification',
      table: {
        columns: ['Carrier', 'Carries'],
        rows: [
          ['Biotin', 'CO₂ (carboxylation reactions)'],
          ['Tetrahydrofolate (FH₄)', 'Formyl, methenyl/methylene, methyl (–HC=O, –HCOH, –CH₃)'],
          ['S-Adenosylmethionine (SAM)', 'Methyl (–CH₃)'],
        ],
      },
      paragraphs: [
        'Carbon in metabolism exists as CO₂, formyl (–CHO), formimino (–CHNH–), methenyl (–CH=), methylene (–CH₂–) and methyl (–CH₃) (AA4 slide 22).',
        'Biotin comes from the diet and gut flora and is sequestered by avidin in uncooked egg white (AA4 slide 23).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note on AA4 slide 23 about a veterinary drug was added to the deck and is not quizzed.' }],
      sourceRefs: a4([21, 22, 23]),
    },
    {
      title: 'Tetrahydrofolate',
      kind: 'structure',
      paragraphs: [
        'Folate (vitamin B9; tetrahydropteroyl glutamate) has a substituted pteridine, para-aminobenzoate and glutamate. It comes from the diet (folic acid is the synthetic form) and gut flora (AA4 slides 25, 28).',
        'Dihydrofolate reductase reduces folate first to 7,8-dihydrofolate (FH₂) and then to 5,6,7,8-tetrahydrofolate (FH₄), using NADPH for both steps. One-carbon units attach to N⁵, N¹⁰ or bridge both, and are interconvertible (AA4 slides 25, 32, 33).',
      ],
      sourceRefs: a4([25, 28, 32, 33]),
    },
    {
      title: 'The one-carbon pool',
      kind: 'pathway',
      paragraphs: [
        'Serine is the major source of one-carbon units — the carbon removed when serine becomes glycine. Because serine is made from glucose, dietary carbohydrate is a major source of the folate pool (AA4 slides 33, 35).',
        'Methionine, homocysteine, purines and thymine depend on one-carbon units from THF (AA4 slide 35).',
      ],
      table: {
        columns: ['Source', 'THF form', 'Used for'],
        rows: [
          ['Formate; tryptophan', 'N¹⁰-Formyl', 'Purine C2'],
          ['Histidine (via formiminoglutamate)', 'N⁵,N¹⁰-Methenyl', 'Purine C8'],
          ['Serine, glycine, formaldehyde', 'N⁵,N¹⁰-Methylene', 'dUMP → dTMP'],
          ['Reduction of N⁵,N¹⁰-methylene-THF', 'N⁵-Methyl', 'Vitamin B12 → methyl-B12'],
        ],
      },
      sourceRefs: a4([33, 34, 35, 37]),
    },
    {
      title: 'Sulfonamides and folate disorders',
      kind: 'clinical',
      paragraphs: [
        'Many bacteria make THF via dihydropteroate; humans lack these enzymes. Sulfonamides competitively bind dihydropteroate synthetase, competing with para-aminobenzoic acid (PABA) — so they are effective antibacterials (AA4 slide 39).',
        'Inborn errors of folate transport and metabolism: hereditary folate malabsorption, glutamate formiminotransferase deficiency, methylenetetrahydrofolate reductase deficiency, methionine synthase reductase deficiency (cblE) and methionine synthase deficiency (cblG) (AA4 slide 39).',
        'Impaired folate status reduces SAM (hypomethylated DNA, high homocysteine), thymidylate (more uracil in DNA) and purines, decreasing DNA synthesis and cell division — associated with cancer, cardiovascular disease, demyelination, neural tube defects and anaemia (AA4 slide 40).',
      ],
      sourceRefs: a4([39, 40]),
    },
  ],
  summary: [
    'Biotin: CO₂. THF: formyl to methyl. SAM: methyl.',
    'DHFR + NADPH: folate → FH₂ → FH₄; units on N⁵/N¹⁰.',
    'Serine → glycine is the main source; used for purines, dTMP, methionine.',
    'Sulfonamides block bacterial dihydropteroate synthetase (PABA analogue).',
  ],
};

// In the order of the lectures (owner, 2026-10-24): AA1 amino acids (1-3), AA2 fate of
// the carbon skeleton (6-7), AA3 transport of ammonia (4-5), AA4 sulfur amino acids
// (8-9). Lesson ids keep their numbers, so learners' progress is unchanged.
export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson6, lesson7, lesson4, lesson5, lesson8, lesson9].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: interactive[lesson.id],
}));

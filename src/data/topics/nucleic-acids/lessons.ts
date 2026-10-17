// Biochemistry → Nucleic Acids — the fourteen lessons (reading layer).
// Sources: Nucleotide Biosynthesis 2025 (nm) and 2022 (nb), Nucleic Acid
// Metabolism (na), Gene Expression and Regulation (ge), Recombinant DNA
// Technology (rd). References: "NM slide 17", "NB22 slide 25", "NA slide 72",
// "GE slide 54", "RD slide 51".
import type { LessonDraft } from '@/data/topics/build';
import { ge, na, nb, nm, rd, type ConceptId } from '@/data/topics/nucleic-acids/sources';
import { interactive, readingExtras } from '@/data/topics/nucleic-acids/interactive';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'nucleic-acids-1',
  title: 'Nucleotides: Building Blocks and Roles',
  description: 'Purines and pyrimidines, how bases, sugars and phosphates make nucleosides and nucleotides, how they are named, and what nucleotides do.',
  xp: 25,
  sourceRefs: [...na([9, 10, 12, 13, 15, 16, 17, 18, 21, 22, 25, 26, 28]), ...nm([5, 8, 9]), ...nb([5, 6, 7, 8, 9, 10, 11, 12])],
  objectives: [
    'Distinguish purines from pyrimidines',
    'Describe how nucleosides and nucleotides are built and named',
    'List the roles of nucleotides in the cell',
    'Explain why nucleotide metabolism is a drug target',
  ],
  chunks: [
    {
      title: 'Bases',
      kind: 'structure',
      paragraphs: [
        'The nitrogenous bases are planar, aromatic and heterocyclic. Purines (adenine, guanine) have two fused rings — a six-membered and a five-membered nitrogen-containing ring; pyrimidines (cytosine, thymine, uracil) have a single six-membered ring. Base atoms are numbered without primes (NM slide 5; NA slides 10, 18; NB22 slide 5).',
      ],
      sourceRefs: [...nm([5]), ...na([10, 18]), ...nb([5])],
    },
    {
      title: 'Nucleosides and nucleotides',
      kind: 'definitions',
      paragraphs: [
        'A nucleoside is a base linked to a pentose by a β-N-glycosidic bond at the sugar’s C1′: purines bond at N9, pyrimidines at N1. Sugar carbons are numbered with primes; deoxyribose lacks the 2′-OH. Sugars make nucleosides more water-soluble than free bases (NA slides 12, 22).',
        'A nucleotide is a phosphate ester of a nucleoside — one, two or three phosphates esterified at the 5′ (or 3′) carbon. Nucleotides with deoxyribose are deoxynucleotides; with ribose, ribonucleotides. A, G and C occur in both; uracil only in RNA, thymine only in DNA (NA slides 15, 16, 21).',
        'Nucleoside names end in -osine for purines and -idine for pyrimidines (NA slide 22).',
      ],
      table: {
        columns: ['Base', 'Nucleoside', 'Ribonucleotide', 'Deoxyribonucleotide'],
        rows: [
          ['Adenine', 'Adenosine', 'Adenylate (AMP)', 'dAMP'],
          ['Guanine', 'Guanosine', 'Guanylate (GMP)', 'dGMP'],
          ['Cytosine', 'Cytidine', 'Cytidylate (CMP)', 'dCMP'],
          ['Uracil', 'Uridine', 'Uridylate (UMP)', '—'],
          ['Thymine', 'Deoxythymidine', '—', 'dTMP'],
        ],
      },
      sourceRefs: [...na([12, 13, 15, 16, 21, 22]), ...nb([6, 7, 8, 9])],
    },
    {
      title: 'What nucleotides do',
      kind: 'overview',
      paragraphs: [
        'Nucleotides are monomers of DNA and RNA; energy carriers (ATP, GTP) for active transport, muscle contraction and ion gradients; second messengers (cAMP, cGMP); components of coenzymes (AMP is in NAD⁺, NADP⁺, FAD and CoA); activated intermediates (UDP-glucose, UDP-galactose, SAM, PAPS); allosteric effectors; and methyl donors (SAM) (NA slides 25–26; NB22 slides 10–11).',
        'ADP is needed for platelet aggregation, adenosine helps control coronary blood flow, and GTP is a precursor of tetrahydrobiopterin (NA slide 25).',
        'Minor bases include 5-methylcytidine in the DNA of animals and higher plants, and N⁶-methyladenosine in bacterial DNA (NA slide 28).',
      ],
      sourceRefs: [...na([25, 26, 28]), ...nb([10, 11])],
    },
    {
      title: 'A drug target',
      kind: 'clinical',
      paragraphs: [
        'Nearly all organisms make purines and pyrimidines de novo, and many also salvage them. Rapidly dividing cells make large amounts, so nucleotide synthesis is a target for anticancer, antibacterial and antiviral drugs; antivirals include zidovudine, lamivudine and valacyclovir (NM slide 9; NA slide 17). The ribose can be used for energy, but purine and pyrimidine rings cannot (NM slide 9).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on these slides were added to the decks and are not quizzed.' }],
      sourceRefs: [...nm([9]), ...na([17]), ...nb([12])],
    },
  ],
  summary: [
    'Purines (A, G): two rings. Pyrimidines (C, T, U): one ring.',
    'Nucleoside = base + sugar (N9 of purines, N1 of pyrimidines to C1′). Nucleotide = nucleoside + phosphate(s).',
    'Roles: monomers, energy, second messengers, coenzymes, activated intermediates, methyl donors.',
  ],
};

const lesson2: Draft = {
  id: 'nucleic-acids-2',
  title: 'De Novo Purine Synthesis',
  description: 'How purine nucleotides are built on ribose phosphate — PRPP, the committed step, the eleven steps to IMP, the branch to AMP and GMP — and how the pathway is regulated.',
  xp: 25,
  sourceRefs: [...nm([8, 11, 12, 13, 17, 18, 19, 20, 26, 27, 28, 29, 30, 62]), ...nb([15, 16, 25, 28, 30])],
  objectives: [
    'Describe the formation of PRPP and the committed step',
    'List the origins of the purine ring atoms',
    'Explain how IMP is converted to AMP and GMP',
    'Describe the regulation of purine synthesis and the drugs that block it',
  ],
  chunks: [
    {
      title: 'Building on ribose phosphate',
      kind: 'pathway',
      paragraphs: [
        'Purines are not first made as free bases: the ring is assembled on ribose 5-phosphate (from the pentose phosphate pathway), using CO₂, amino acids and THF, mainly in the liver. The first purine formed is inosine monophosphate (IMP), whose base is hypoxanthine (NM slides 11–13; NB22 slide 15).',
        'Step 1: ribose-5-phosphate pyrophosphokinase (PRPP synthetase) activates ribose 5-phosphate to PRPP — also a precursor for pyrimidines, histidine and tryptophan (NM slides 13, 17).',
        'Step 2, the committed step: amidophosphoribosyl transferase converts glutamine to glutamate, forming phosphoribosyl-1-amine; hydrolysis of PPi makes it irreversible. It is strongly feedback-inhibited by IMP, AMP and GMP, and blocked by the glutamine analogues azaserine and acivicin (NM slides 17, 20).',
        'Eleven steps in all lead to IMP. Five use ATP (really six ATP equivalents), and two depend on THF — which is why methotrexate and sulfonamides block purine synthesis (NM slides 11, 19).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NM slides 11–20 were added to the deck and are not quizzed.' }],
      sourceRefs: [...nm([11, 12, 13, 17, 18, 19, 20]), ...nb([15])],
    },
    {
      title: 'Where the ring atoms come from',
      kind: 'structure',
      table: {
        columns: ['Source', 'Ring atoms'],
        rows: [
          ['Aspartate', 'N1'],
          ['N¹⁰-Formyl-THF', 'C2, C8'],
          ['Glutamine', 'N3, N9'],
          ['Glycine', 'C4, C5, N7'],
          ['CO₂', 'C6'],
        ],
      },
      sourceRefs: nb([25]),
    },
    {
      title: 'IMP to AMP and GMP',
      kind: 'pathway',
      paragraphs: [
        'IMP is the branch point. AMP: adenylosuccinate synthetase adds aspartate using GTP, then a lyase releases fumarate. GMP: an NAD⁺-linked dehydrogenase oxidises IMP to xanthylate (XMP), then a synthetase converts XMP to GMP using ATP. Each branch uses the other’s triphosphate, balancing the two (NM slides 11, 26; NB22 slides 28, 30).',
        '6-Mercaptopurine blocks IMP → adenylate and IMP → xanthylate; mycophenolic acid blocks IMP → guanylate (NM slide 27).',
        'Nucleoside monophosphate kinases make diphosphates (adenylate kinase: AMP + ATP ⇌ 2 ADP); nucleoside diphosphate kinase makes triphosphates and is not base-specific (NM slide 28).',
        'AMP deaminase and GMP reductase convert AMP and GMP back to IMP, keeping the two in balance (NM slide 26).',
      ],
      notes: [{ kind: 'check', text: 'NB22 slide 30 writes that xanthylate → guanylate requires Glu and ATP; the 2025 deck names no nitrogen donor. The donor is not quizzed.' }],
      sourceRefs: [...nm([11, 26, 27, 28]), ...nb([28, 30])],
    },
    {
      title: 'Regulation',
      kind: 'regulation',
      paragraphs: [
        'Regulation balances the nucleotides at two levels: IMP synthesis from PRPP, and AMP or GMP from IMP (NM slide 29).',
        'PRPP synthetase is inhibited by high phosphate and ADP (with GDP). The committed step is inhibited cumulatively by AMP, GMP and IMP — at distinct sites for IMP/GMP and for AMP, so AMP and GMP together inhibit fully. IMP dehydrogenase is inhibited by GMP and adenylosuccinate synthetase by AMP (NM slides 29, 30, 62).',
      ],
      sourceRefs: nm([29, 30, 62]),
    },
  ],
  summary: [
    'R5P → PRPP (PRPP synthetase) → phosphoribosylamine (amidophosphoribosyl transferase, committed) → … → IMP.',
    'Ring: Asp N1; formyl-THF C2, C8; Gln N3, N9; Gly C4, C5, N7; CO₂ C6.',
    'IMP → AMP (needs GTP, Asp); IMP → XMP → GMP (needs ATP).',
    'Feedback: AMP, GMP, IMP on the committed step; GMP on IMP dehydrogenase; AMP on adenylosuccinate synthetase.',
  ],
};

const lesson3: Draft = {
  id: 'nucleic-acids-3',
  title: 'Purine Salvage, Degradation and Disease',
  description: 'How free purine bases are salvaged, how purines are broken down to uric acid, and gout, Lesch–Nyhan syndrome and ADA deficiency.',
  xp: 25,
  sourceRefs: [...nm([22, 24, 25, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 45, 46, 47, 73, 74, 77, 78]), ...nb([26, 41])],
  objectives: [
    'Describe the purine salvage reactions and why they matter',
    'Trace the degradation of AMP and GMP to uric acid',
    'Explain gout and how allopurinol works',
    'Explain Lesch–Nyhan syndrome and ADA deficiency',
  ],
  chunks: [
    {
      title: 'Salvage',
      kind: 'mechanism',
      paragraphs: [
        'Free purine bases from nucleic acid breakdown are converted straight back to nucleotides with PRPP. Salvage saves fuel — only one salvage reaction uses ATP, against five steps of de novo synthesis — and leucocytes, brain and bone marrow can make nucleotides only by salvage (NM slides 11, 22, 25).',
      ],
      table: {
        columns: ['Enzyme', 'Reaction'],
        rows: [
          ['Adenine phosphoribosyltransferase (APRT)', 'Adenine + PRPP → AMP + PPi'],
          ['Hypoxanthine–guanine phosphoribosyltransferase (HGPRT)', 'Hypoxanthine + PRPP → IMP + PPi; guanine + PRPP → GMP + PPi'],
        ],
      },
      sourceRefs: [...nm([22, 24, 25, 33]), ...nb([26, 41])],
    },
    {
      title: 'Breaking purines down',
      kind: 'pathway',
      paragraphs: [
        'Dietary nucleic acids survive the stomach and are degraded in the duodenum by pancreatic nucleases and intestinal phosphodiesterases; nucleotidases and phosphatases make nucleosides, which are absorbed or broken to bases. Most ingested nucleic acid is degraded and excreted (NM slides 32, 73–74).',
        'AMP: 5′-nucleotidase → adenosine; adenosine deaminase (ADA) → inosine; purine nucleoside phosphorylase → hypoxanthine (+ ribose 1-phosphate); xanthine oxidase → xanthine → uric acid (NM slide 77).',
        'GMP: 5′-nucleotidase → guanosine; purine nucleoside phosphorylase → guanine; guanine deaminase → xanthine; xanthine oxidase → uric acid (NM slide 78).',
        'Xanthine is the point of convergence; xanthine oxidase catalyses two reactions. Ribose 1-phosphate can be isomerised to ribose 5-phosphate and reused in PRPP (NM slides 34–36).',
        'Humans excrete uric acid in urine; birds and terrestrial reptiles excrete it as a paste (saving water); other animals convert it on to allantoin, allantoic acid, urea and ammonia (NM slide 38).',
        'The purine nucleotide cycle — AMP deaminase plus adenylosuccinate synthetase and lyase — deaminates aspartate to fumarate at the cost of a GTP (NM slide 37).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NM slides 34–37 were added to the deck and are not quizzed.' }],
      sourceRefs: nm([32, 34, 35, 36, 37, 38, 73, 74, 77, 78]),
    },
    {
      title: 'Gout',
      kind: 'clinical',
      paragraphs: [
        'Gout results from accumulation — impaired excretion or overproduction — of uric acid, whose crystals deposit in joints (gouty arthritis), kidneys and ureters. Lead impairs uric acid excretion (NM slide 41).',
        'In the lecture’s case, a 45-year-old man woke with a painful, swollen great toe after liver, onions and beer; serum uric acid was 8.0 mg/dl (normal < 7.0). He was treated with NSAIDs, fluids, rest and allopurinol (NM slides 39–40).',
        'Allopurinol, a hypoxanthine analogue, is converted by xanthine oxidase into a suicide inhibitor of the enzyme, lowering uric acid production. Colchicine is also used (NM slide 42).',
      ],
      sourceRefs: nm([39, 40, 41, 42]),
    },
    {
      title: 'Lesch–Nyhan syndrome and ADA deficiency',
      kind: 'clinical',
      paragraphs: [
        'Lesch–Nyhan syndrome is a deficiency of HGPRT. Hypoxanthine and guanine go to uric acid instead of being salvaged; PRPP accumulates and drives de novo purine synthesis up 200-fold, raising blood uric acid. Patients have gout-like symptoms plus spasticity, aggressiveness and self-mutilation — the first neuropsychiatric abnormality traced to a single enzyme (NM slides 45–46).',
        'Adenosine deaminase deficiency causes severe combined immunodeficiency (SCID): it selectively kills both B and T lymphocytes. All known ADA mutants perturb the active site (NM slide 47).',
      ],
      sourceRefs: nm([45, 46, 47]),
    },
  ],
  summary: [
    'Salvage: APRT (adenine) and HGPRT (hypoxanthine, guanine) with PRPP.',
    'AMP → adenosine → inosine (ADA) → hypoxanthine → xanthine → uric acid; GMP → guanine → xanthine.',
    'Gout: uric acid crystals; allopurinol inhibits xanthine oxidase.',
    'Lesch–Nyhan: HGPRT deficiency; ADA deficiency: SCID.',
  ],
};

const lesson4: Draft = {
  id: 'nucleic-acids-4',
  title: 'Pyrimidines and Deoxyribonucleotides',
  description: 'The six steps from glutamine to UMP, CTP formation, regulation in animals and bacteria, orotic aciduria, how deoxyribonucleotides and thymidylate are made, and pyrimidine breakdown.',
  xp: 25,
  sourceRefs: [...nm([49, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 68, 69, 70, 79, 80, 81]), ...nb([16, 76, 77, 78])],
  objectives: [
    'Describe the six steps of de novo pyrimidine synthesis',
    'Compare the regulation of pyrimidine synthesis in animals and bacteria',
    'Describe orotic aciduria and its treatment',
    'Explain how deoxyribonucleotides and dTMP are made and how antifolates act',
  ],
  chunks: [
    {
      title: 'Six steps to UMP',
      kind: 'pathway',
      paragraphs: [
        'Unlike purines, the pyrimidine ring is made first and then attached to ribose phosphate, in 6 steps instead of 11. N1, C4, C5 and C6 come from aspartate, C2 from HCO₃⁻ and N3 from the amide of glutamine (NM slides 49, 52).',
      ],
      table: {
        columns: ['Step', 'Enzyme', 'Product'],
        rows: [
          ['1', 'Carbamoyl phosphate synthetase II (cytosolic; glutamine + HCO₃⁻ + 2 ATP)', 'Carbamoyl phosphate'],
          ['2', 'Aspartate transcarbamoylase (ATCase)', 'Carbamoyl aspartate'],
          ['3', 'Dihydroorotase', 'Dihydroorotate'],
          ['4', 'Dihydroorotate dehydrogenase (the only mitochondrial step)', 'Orotate'],
          ['5', 'Orotate phosphoribosyltransferase (ribose-P from PRPP)', 'OMP'],
          ['6', 'OMP decarboxylase', 'UMP'],
        ],
      },
      keyPoints: [
        'In animals steps 1–3 are on one multifunctional protein, CAD (carbamoyl phosphate synthetase, aspartate transcarbamoylase, dihydroorotase), allowing channelling; dihydroorotate dehydrogenase is a second protein; steps 5–6 are on a third (NM slides 54, 58, 59).',
        'CPS I is mitochondrial and serves the urea cycle; CPS II is cytosolic and serves pyrimidines (NM slide 55).',
        'Dihydroorotate dehydrogenase sits on the inner mitochondrial membrane, contains FAD, FMN and iron–sulfur centres, and reduces ubiquinone (NM slides 55, 60).',
        'OMP decarboxylase is the most catalytically proficient enzyme and needs no cofactor (NM slide 61). It is inhibited by 6-azauridine (NM slide 60).',
        'UMP → UDP → UTP by kinases; CTP synthetase makes CTP from UTP, with glutamine supplying the nitrogen and ATP the energy (NM slides 56–57).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NM slides 54 and 60 were added to the deck and are not quizzed.' }],
      sourceRefs: nm([49, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61]),
    },
    {
      title: 'Regulation',
      kind: 'regulation',
      paragraphs: [
        'In animals the committed, regulated step is CPS II: UDP and UTP inhibit it; ATP and PRPP activate it. It is also inhibited by glutamine analogues such as azaserine. UMP and CMP competitively inhibit OMP decarboxylase (NM slides 54, 58, 62, 70).',
        'In bacteria (E. coli) regulation is at ATCase: CTP feedback-inhibits it by lowering its affinity for substrates without changing Vmax, while ATP activates it by competing with CTP for the regulatory sites. ATP signals that energy is available for DNA replication; CTP ensures products are made only when needed (NM slides 60, 62, 68–70).',
        'Treating ATCase with mercurials such as p-hydroxymercuribenzoate removes its allosteric control without loss of catalytic activity; excess mercaptoethanol reverses this (NM slide 65).',
      ],
      sourceRefs: nm([54, 58, 62, 65, 68, 69, 70]),
    },
    {
      title: 'Orotic aciduria',
      kind: 'clinical',
      paragraphs: [
        'Type I: deficiency of both orotate phosphoribosyltransferase and orotidylate decarboxylase. Type II: deficiency of orotidylate decarboxylase alone, which can also follow treatment of cancer with 6-azauridine (NM slide 63).',
        'Orotic acid is excreted in excess; patients have stunted growth, severe anaemia and infections. It is the only known inherited defect in this pathway (others are lethal to the fetus) and is treated with uridine or cytidine (NM slides 63–64).',
      ],
      sourceRefs: nm([63, 64]),
    },
    {
      title: 'Deoxyribonucleotides and thymidylate',
      kind: 'mechanism',
      paragraphs: [
        'Biosynthesis makes only ribonucleotides. Ribonucleotide reductase reduces the 2′ carbon of ribonucleoside diphosphates to give deoxyribonucleotides; the hydrogens come via thioredoxin and glutaredoxin (NM slide 66; NB22 slide 16).',
        'Thymine nucleotides are made from uridine nucleotides: dUTP is hydrolysed by dUTPase to dUMP (preventing dUTP being put into DNA), and thymidylate synthase methylates dUMP at C5 to dTMP using N⁵,N¹⁰-methylene-THF — the only reaction in which THF’s net oxidation state changes, giving dihydrofolate. Dihydrofolate reductase (with NADPH) regenerates THF, and serine hydroxymethyltransferase reloads it (NB22 slides 76–77).',
        'Cancer cells use dTMP quickly. Fluorodeoxyuridylate irreversibly inhibits thymidylate synthase; aminopterin, methotrexate and trimethoprim competitively inhibit dihydrofolate reductase. These also affect rapidly growing normal cells (hair follicles, bone marrow, immune system, gut mucosa) (NB22 slide 78).',
      ],
      notes: [{ kind: 'annotation', text: 'The speaker note on NM slide 66 was added to the deck and is not quizzed.' }],
      sourceRefs: [...nm([66]), ...nb([16, 76, 77, 78])],
    },
    {
      title: 'Pyrimidine breakdown',
      kind: 'pathway',
      paragraphs: [
        'Pyrimidine nucleotides are dephosphorylated, deaminated and cleaved to bases; uracil and thymine are then broken down in the liver by reduction (not oxidation, as for purines). The end products are β-alanine (from cytosine and uracil) and β-aminoisobutyrate (from thymine), which become malonyl-CoA and methylmalonyl-CoA (NM slides 79–81).',
      ],
      sourceRefs: nm([79, 80, 81]),
    },
  ],
  summary: [
    'CPS II → ATCase → dihydroorotase → DHO dehydrogenase (mitochondrial) → OPRT → OMP decarboxylase → UMP.',
    'Animals: CPS II (UTP/UDP inhibit; ATP, PRPP activate). Bacteria: ATCase (CTP inhibits, ATP activates).',
    'Orotic aciduria: OPRT/OMP decarboxylase; treat with uridine.',
    'Ribonucleotide reductase → dNDPs; thymidylate synthase dUMP → dTMP; methotrexate blocks DHFR.',
  ],
};

const lesson5: Draft = {
  id: 'nucleic-acids-5',
  title: 'DNA and RNA Structure',
  description: 'The double helix and base pairing, how RNA differs from DNA, UV absorbance and melting, DNA forms and supercoiling, and how DNA is packed into chromatin.',
  xp: 25,
  sourceRefs: na([3, 4, 19, 30, 31, 32, 33, 34, 35, 38, 39, 41, 42, 43, 45, 47, 48, 49, 50, 51, 52, 53, 55]),
  objectives: [
    'Describe the double helix and Chargaff’s base-pairing rules',
    'Explain how RNA differs from DNA and why DNA uses thymine',
    'Explain UV absorbance, denaturation and melting temperature',
    'Describe DNA forms, supercoiling and chromatin',
  ],
  chunks: [
    {
      title: 'The double helix',
      kind: 'structure',
      paragraphs: [
        'Franklin’s X-ray pictures (1952) first showed the double helix; Watson, Crick and Wilkins built the model (1953); Chargaff found the pairing rules (NA slides 3–4).',
        'DNA has two antiparallel strands with sugar–phosphate backbones outside and bases inside. Nucleotides are joined by 3′→5′ phosphodiester bonds. The phosphate backbone gives an overall negative charge (NA slides 19, 33, 35).',
        'Chargaff’s rule: A pairs with T by 2 hydrogen bonds, G with C by 3. In moles, A = T and G = C (NA slide 34).',
        'The helix is stabilised by hydrophobic interactions burying the bases, base stacking (van der Waals), hydrogen bonding, and cations such as Mg²⁺ reducing phosphate repulsion (NA slide 38).',
      ],
      sourceRefs: na([3, 4, 19, 33, 34, 35, 38, 39]),
    },
    {
      title: 'RNA versus DNA',
      kind: 'comparison',
      table: {
        columns: ['Feature', 'DNA', 'RNA'],
        rows: [
          ['Sugar', 'Deoxyribose (H at 2′)', 'Ribose (OH at 2′)'],
          ['Bases', 'A, G, C, T', 'A, G, C, U'],
          ['Strands', 'Double', 'Usually single'],
          ['Location', 'Nucleus', 'Made in nucleus, moves to cytoplasm'],
        ],
      },
      paragraphs: [
        'Why thymine in DNA? Cytosine readily deaminates to uracil, so using T makes detecting and repairing that damage efficient, enhancing fidelity. RNA is not repaired, so it uses the cheaper U (NA slide 31).',
        'In DNA–RNA pairing, A in DNA pairs with U in RNA (NA slide 32).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NA slide 31 were added to the deck and are not quizzed.' }],
      sourceRefs: na([30, 31, 32]),
    },
    {
      title: 'Absorbance and melting',
      kind: 'mechanism',
      paragraphs: [
        'Nucleic acids absorb UV maximally at 260 nm because of their conjugated bases; A260/A280 assesses purity. They are acidic, precipitated by ethanol, and viscous (NA slide 41).',
        'Heat above about 90 °C breaks hydrogen bonds and separates the strands (denaturation): A260 rises (base stacking reduces absorbance), viscosity falls and function is lost (NA slides 42–43, 45).',
        'The melting temperature (Tm) is the temperature at which half the DNA is single-stranded. It depends on length and sequence: G:C pairs, with three hydrogen bonds, need more heat than A:T pairs (NA slides 47–48).',
      ],
      sourceRefs: na([41, 42, 43, 45, 47, 48]),
    },
    {
      title: 'Forms, supercoiling and chromatin',
      kind: 'structure',
      paragraphs: [
        'B-form is the “default” right-handed Watson–Crick helix in cells; A-form is common for RNA and favoured at low water; Z-form, with almost no major groove, forms in G:C-rich regions (NA slide 49).',
        'Prokaryotic DNA is naked, circular and supercoiled; eukaryotic DNA is linear and bound to proteins in chromosomes. Negative supercoiling can promote cruciforms at palindromic sequences (NA slides 50–52).',
        'About 2 m of human DNA fits a 5 µm nucleus by wrapping around histone octamers (nucleosomes). Chromatin consists of histones (H1, H2A, H2B, H3, H4) and non-histone proteins, which regulate gene expression (NA slide 53).',
        'DNA sequencing methods include Sanger’s chain termination (dideoxynucleotides), Maxam–Gilbert chemical cleavage, pyrosequencing and next-generation sequencing (NA slide 55).',
      ],
      sourceRefs: na([49, 50, 51, 52, 53, 55]),
    },
  ],
  summary: [
    'Antiparallel double helix; A=T (2 H bonds), G≡C (3 H bonds).',
    'RNA: ribose, uracil, single-stranded. T in DNA allows repair of deaminated C.',
    'λmax 260 nm; melting raises A260; higher G:C → higher Tm.',
    'B-form default; prokaryotic DNA circular supercoiled; eukaryotic DNA in nucleosomes.',
  ],
};

const lesson6: Draft = {
  id: 'nucleic-acids-6',
  title: 'DNA Replication',
  description: 'The rules of replication, the enzymes at the E. coli replication fork, how eukaryotes differ, and how telomerase protects chromosome ends.',
  xp: 25,
  sourceRefs: na([56, 57, 59, 60, 62, 63, 64, 65, 71, 72, 73, 74, 75, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87]),
  objectives: [
    'Explain semiconservative, bidirectional and semidiscontinuous replication',
    'Describe the roles of helicase, gyrase, SSBs, primase, polymerases and ligase',
    'Compare prokaryotic and eukaryotic replication and polymerases',
    'Explain the end-replication problem and telomerase',
  ],
  chunks: [
    {
      title: 'Three rules',
      kind: 'mechanism',
      paragraphs: [
        'Semiconservative: each daughter helix has one parental and one new strand — shown by Meselson and Stahl, who grew DNA in ¹⁵N then ¹⁴N and separated it on a density gradient (NA slides 59–62).',
        'Bidirectional: replication starts at an origin (shown by denaturation mapping to be a unique A=T-rich site) and two forks move apart (NA slides 62–63, 65).',
        'Semidiscontinuous: polymerases make DNA only 5′→3′. The leading strand is made continuously towards the fork; the lagging strand is made away from it as Okazaki fragments — about 1000–2000 nucleotides in bacteria and 150–200 in eukaryotes (NA slides 72–73).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NA slides 62–73 were added to the deck and are not quizzed.' }],
      sourceRefs: na([59, 60, 62, 63, 65, 72, 73]),
    },
    {
      title: 'At the E. coli fork',
      kind: 'pathway',
      paragraphs: [
        'DNA synthesis needs a template, the four dNTPs with Mg²⁺, and a primer (NA slides 57, 64). E. coli has one replicon (one origin, oriC) (NA slide 71).',
      ],
      table: {
        columns: ['Protein', 'Job'],
        rows: [
          ['Helicase', 'Unwinds the double helix'],
          ['Gyrase (a topoisomerase)', 'Relieves supercoiling ahead of the fork'],
          ['Single-strand binding proteins', 'Keep strands apart'],
          ['Primase', 'Makes RNA primers (with helicase forms the primosome); one for the leading strand, many for the lagging'],
          ['DNA polymerase III', 'Extends primers; main synthesis and proofreading'],
          ['DNA polymerase I', 'Removes RNA primers (5′→3′ exonuclease) and fills the gap'],
          ['DNA ligase', 'Seals nicks between fragments'],
        ],
      },
      keyPoints: [
        'Termination: forks meet at the GC-rich ter region, where Tus protein binds and stops the fork by inhibiting helicase (NA slide 79).',
        'All three E. coli polymerases have 3′→5′ exonuclease (proofreading); only pol I has 5′→3′ exonuclease (NA slide 83).',
      ],
      sourceRefs: na([57, 64, 71, 74, 75, 77, 79, 83]),
    },
    {
      title: 'Eukaryotes',
      kind: 'comparison',
      paragraphs: [
        'Eukaryotic replication is similar but more complex and slower, with multiple origins, nucleosomes that must be taken apart and rebuilt, and shorter Okazaki fragments. Replication protein A acts as SSB; PCNA, replication factor C, RNase H and flap endonuclease 1 are also involved (NA slides 80–81, 84).',
      ],
      table: {
        columns: ['Polymerase', 'Main role'],
        rows: [
          ['α', 'Primase activity; starts replication'],
          ['β', 'DNA repair (low fidelity)'],
          ['γ', 'Mitochondrial DNA replication'],
          ['δ', 'Main replicative enzyme for leading and lagging strands'],
          ['ε', 'Fills gaps after primer removal; repair'],
        ],
      },
      sourceRefs: na([80, 81, 82, 84]),
    },
    {
      title: 'Telomeres',
      kind: 'mechanism',
      paragraphs: [
        'After the terminal RNA primer of a linear chromosome is removed, the end cannot be copied, so chromosomes would shorten each cycle (NA slide 85).',
        'Telomeres — TTAGGG repeated 500–5000 times and capped by proteins — protect chromosome ends. Telomerase, an RNA-dependent DNA polymerase carrying its own RNA template, adds repeats (NA slides 86–87).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NA slides 85–87 were added to the deck and are not quizzed.' }],
      sourceRefs: na([85, 86, 87]),
    },
  ],
  summary: [
    'Semiconservative (Meselson–Stahl), bidirectional, semidiscontinuous.',
    'Helicase, gyrase, SSB, primase, pol III, pol I, ligase.',
    'Eukaryotes: many origins; pol α primes, pol δ elongates, pol γ in mitochondria.',
    'Telomeres TTAGGG; telomerase is an RNA-dependent DNA polymerase.',
  ],
};

const lesson7: Draft = {
  id: 'nucleic-acids-7',
  title: 'DNA Damage, Mutation and Repair',
  description: 'Endogenous and exogenous DNA damage, kinds and causes of mutation, and how cells repair DNA.',
  xp: 25,
  sourceRefs: [...na([89, 90, 91, 93, 94, 95, 96, 97, 98, 99, 103, 104, 105, 108, 109, 110, 111, 112]), ...ge([3])],
  objectives: [
    'List endogenous and exogenous causes of DNA damage',
    'Classify mutations and explain tautomeric shifts',
    'Describe excision repair, photoreactivation and recombinational repair',
    'Link xeroderma pigmentosum to repair failure',
  ],
  chunks: [
    {
      title: 'DNA damage',
      kind: 'classification',
      table: {
        columns: ['Endogenous', 'Exogenous'],
        rows: [
          ['Attack by ROS', 'UV, X-rays and γ-rays'],
          ['Replication errors (mismatches)', 'Hydrolysis or heat'],
          ['Deamination, depurination, depyrimidination', 'Plant toxins'],
          ['Bulky adducts; alkylation (e.g. O⁶-methylguanine)', 'Mutagenic chemicals (intercalators); viruses'],
        ],
      },
      paragraphs: [
        'Chemical mutagens include polycyclic aromatic hydrocarbons (benzopyrene), nitrosamines and aromatic amines, alkylating drugs (nitrogen mustard, cyclophosphamide), aflatoxin and nitrites (NA slide 95). UV light forms thymine dimers (NA slide 99).',
      ],
      sourceRefs: na([89, 93, 95, 99]),
    },
    {
      title: 'Mutations',
      kind: 'definitions',
      paragraphs: [
        'A mutation is a permanent, heritable change in DNA. Somatic mutations affect only the individual; germ-line mutations pass to the next generation. Mutations usually produce recessive genes (NA slide 90).',
        'Classes: spontaneous, error-prone replication past damage (translesion synthesis), errors during repair, and induced by mutagens (NA slide 91). Most mutations are spontaneous — base modification, replication errors and slippage, tautomeric shifts, deamination and depurination — and transposons can also move. Spontaneous rates are 10⁻⁴–10⁻⁶ per gene per generation in eukaryotes (NA slides 97–98).',
        'A tautomeric shift to the rare enol form lets G pair with T; if uncorrected, the next round gives a GC→AT transition (NA slide 96).',
        'Point mutations may be silent, missense (change an amino acid, e.g. sickle cell haemoglobin) or nonsense (create a stop codon); insertions and deletions can shift the reading frame (GE slide 3; NA slides 102–103).',
        'Mutation rate is per gene per generation; mutation frequency is per number of individuals. Mutations allow evolution and polymorphism but can be fatal or cause disease (NA slide 94).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on NA slides 89–97 were added to the deck and are not quizzed.' }],
      sourceRefs: [...na([90, 91, 94, 96, 97, 98, 103, 104]), ...ge([3])],
    },
    {
      title: 'Repair',
      kind: 'mechanism',
      table: {
        columns: ['Repair', 'How'],
        rows: [
          ['Base excision', 'DNA glycosylase removes an altered base (e.g. uracil from deaminated cytosine); endonuclease, polymerase and ligase finish'],
          ['Nucleotide excision', 'Nucleases cut out a damaged stretch (e.g. a thymine dimer, recognised by UV-specific endonucleases); polymerase and ligase fill in'],
          ['Photoreactivation', 'Photolyase, activated by 300–600 nm light, directly reverses thymine dimers'],
          ['Recombinational', 'A gap left after replication skips a lesion is filled with a piece of the parental strand'],
        ],
      },
      paragraphs: [
        'Xeroderma pigmentosum is a defect in the enzymes that repair UV damage in skin: patients cannot go into sunlight and have increased skin cancers and cataracts (NA slide 112).',
      ],
      sourceRefs: na([105, 108, 109, 110, 111, 112]),
    },
  ],
  summary: [
    'Damage: ROS, deamination, depurination, alkylation; UV (thymine dimers), radiation, chemicals.',
    'Mutations: somatic or germ-line; silent, missense, nonsense, frameshift.',
    'Tautomeric shift → G–T mispair → GC→AT transition.',
    'Repair: base excision, nucleotide excision, photoreactivation, recombination. XP = UV repair defect.',
  ],
};

const lesson8: Draft = {
  id: 'nucleic-acids-8',
  title: 'RNA and Transcription',
  description: 'The kinds of RNA, how E. coli RNA polymerase transcribes a gene, and how eukaryotic transcription and mRNA processing differ.',
  xp: 25,
  sourceRefs: [...na([114, 115, 116, 119, 120, 121, 123, 124, 125, 127, 129, 131, 132, 133, 134, 136, 137, 140, 142, 145, 146, 147, 148, 149, 150, 151, 184]), ...ge([5, 6, 7, 12, 14, 15, 18, 22, 75])],
  objectives: [
    'Describe mRNA, tRNA, rRNA and other RNAs',
    'Describe the subunits of E. coli RNA polymerase and the role of sigma',
    'Explain initiation, elongation and both kinds of termination',
    'Describe the eukaryotic RNA polymerases, promoters and mRNA processing',
  ],
  chunks: [
    {
      title: 'Kinds of RNA',
      kind: 'classification',
      table: {
        columns: ['RNA', 'Features and role'],
        rows: [
          ['mRNA', 'Template for protein; ~1000–10,000 nucleotides; 5′ cap of methylated GTP and 3′ poly(A) tail in eukaryotes; lifetime minutes to days'],
          ['tRNA', 'Adaptor carrying amino acids; cloverleaf with acceptor arm ending CCA, TψC arm, anticodon arm and DHU arm; unusual bases (pseudouridine, dihydrouracil)'],
          ['rRNA', 'Most abundant; with proteins forms ribosomes; is a ribozyme'],
          ['miRNA', 'RNA silencing and post-transcriptional regulation'],
          ['Ribozymes', 'Catalytic RNA: cleavage, ligation, peptide bond formation'],
          ['snRNA', '~150 nucleotides; splicing, transcription factor regulation, telomeres'],
        ],
      },
      paragraphs: [
        'Prokaryotic ribosomes are 70S (50S with 5S and 23S rRNA; 30S with 16S). Eukaryotic ribosomes are 80S (60S with 5S, 5.8S and 28S; 40S with 18S) (NA slide 131).',
        'Most RNAs have stem–loop secondary structure from base pairing within the strand (NA slide 116).',
      ],
      notes: [{ kind: 'check', text: 'NA slide 125 gives tRNA as up to 1000 nucleotides and slide 152 as 70–80; slide 129 gives rRNA as 100–600 nucleotides beside a table of much longer rRNAs. Lengths are not quizzed.' }],
      sourceRefs: na([114, 116, 119, 120, 121, 123, 124, 125, 127, 129, 131]),
    },
    {
      title: 'Transcription in E. coli',
      kind: 'pathway',
      paragraphs: [
        'DNA-dependent RNA polymerase copies one DNA strand 5′→3′ using ATP, GTP, UTP and CTP, with Mg²⁺ and Zn²⁺, and needs no primer. Bacteria have one RNA polymerase (NA slides 115, 134).',
        'The core enzyme is α₂ββ′ω: β′ binds DNA, β holds the active site, α is the scaffold. Core alone binds DNA non-specifically; the sigma factor (most commonly σ⁷⁰) forms the holoenzyme that binds promoters with high affinity (NA slides 132–133).',
        'Initiation: the holoenzyme scans DNA, binds the promoter (closed complex), opens a bubble (open complex) and starts — most RNAs begin with a purine. After 6–10 nucleotides sigma leaves and NusA binds (NA slides 136, 137, 140).',
        'Elongation: the core makes about 20–50 bases per second with about 1 error per 10,000 bases; topoisomerases relieve supercoiling (NA slide 142).',
        'Termination: either pausing at GC-rich sites, where an RNA hairpin destabilises the RNA–DNA hybrid followed by an easily separated AU-rich end, or rho — an ATP-dependent helicase that unwinds the RNA–DNA hybrid (NA slides 145–147).',
      ],
      notes: [{ kind: 'check', text: 'NA slide 134 calls the transcribed DNA strand the “sense” strand. Strand naming is not quizzed.' }],
      sourceRefs: na([115, 132, 133, 134, 136, 137, 140, 142, 145, 146, 147, 148]),
    },
    {
      title: 'Eukaryotic transcription',
      kind: 'comparison',
      table: {
        columns: ['Polymerase', 'Location', 'Makes'],
        rows: [
          ['RNA polymerase I', 'Nucleolus', 'rRNA'],
          ['RNA polymerase II', 'Nucleoplasm', 'mRNA'],
          ['RNA polymerase III', 'Nucleoplasm', 'tRNA and other small RNAs'],
        ],
      },
      paragraphs: [
        'Eukaryotic polymerases do not bind promoters by themselves: transcription factors assemble them. TFIID contains the TATA-binding protein (NA slides 150–151).',
        'Bacterial promoters have the Pribnow box (TATAAT) at −10 and a −35 region where σ⁷⁰ binds; eukaryotic promoters have the TATA (Goldberg–Hogness) box at about −19 to −27 (GE slide 18).',
        'Pre-mRNA is processed in the nucleus: a 7-methylguanosine cap at the 5′ end, a poly(A) tail at the 3′ end (both protect against nucleases and aid export), and splicing by the spliceosome (snRNAs + protein) to remove introns. The initial message has roughly twice the bases of the final one (GE slides 5–7, 75).',
        'The coding region runs from AUG to a stop codon, between the 5′ and 3′ untranslated regions (GE slide 22).',
        'Inhibitors of RNA synthesis: rifamycin (bacterial polymerase), α-amanitin (pol II), the intercalators actinomycin D and quinacrine, and substrate analogues ara-C and ara-A (NA slide 184).',
      ],
      notes: [{ kind: 'check', text: 'NA slide 149 lists rRNA among RNA polymerase III products; slide 115 lists tRNA and small RNAs. Polymerase III is quizzed only for tRNA.' }],
      sourceRefs: [...na([149, 150, 151, 184]), ...ge([5, 6, 7, 14, 15, 18, 22, 75])],
    },
  ],
  summary: [
    'mRNA (template), tRNA (adaptor, CCA end), rRNA (ribosome, ribozyme).',
    'E. coli: α₂ββ′ω core + σ = holoenzyme; rho-dependent or hairpin termination.',
    'Pol I rRNA, pol II mRNA, pol III tRNA; TATA box; TFIID.',
    'mRNA processing: 5′ cap, poly(A) tail, splicing.',
  ],
};

const lesson9: Draft = {
  id: 'nucleic-acids-9',
  title: 'Translation and the Genetic Code',
  description: 'Charging tRNAs, the three stages of translation on the ribosome, and the properties of the genetic code.',
  xp: 25,
  sourceRefs: [...na([152, 153, 154, 155, 158, 159, 160, 161, 162, 163, 164, 165, 166, 171, 174, 177, 178, 179, 180]), ...ge([10, 11])],
  objectives: [
    'Describe how aminoacyl-tRNA synthetases charge tRNAs',
    'Describe the A, P and E sites and the stages of translation',
    'List the properties of the genetic code',
  ],
  chunks: [
    {
      title: 'Charging tRNA',
      kind: 'mechanism',
      paragraphs: [
        'Each amino acid is attached to the right tRNA by its own aminoacyl-tRNA synthetase, which recognises identity elements mostly in the acceptor stem and anticodon loop (NA slides 152–153).',
        'Two steps: amino acid + ATP → aminoacyl-AMP + PPi; aminoacyl-AMP + tRNA → aminoacyl-tRNA + AMP. Hydrolysis of PPi by pyrophosphatase drives it. Class I and class II synthetases attach the amino acid to the 2′ or 3′ OH (NA slides 154–155).',
      ],
      sourceRefs: na([152, 153, 154, 155]),
    },
    {
      title: 'On the ribosome',
      kind: 'pathway',
      paragraphs: [
        'The ribosome has three tRNA sites: A (aminoacyl — the incoming charged tRNA), P (peptidyl — holds the growing chain) and E (exit) (NA slides 158, 160). The rRNA is the ribozyme that forms peptide bonds (GE slide 11).',
        'Initiation: initiator tRNA carrying methionine binds the small subunit, which binds the mRNA — at the leader sequence in prokaryotes, the 5′ cap in eukaryotes. Its anticodon pairs with AUG, the large subunit joins and the initiator tRNA sits in the P site; initiation factors help (NA slides 161–162).',
        'Elongation: the next aminoacyl-tRNA enters the A site with elongation factors; a peptide bond forms, transferring the chain to the A-site tRNA. Translocation moves the ribosome three nucleotides: the empty tRNA goes to the E site and leaves, the peptidyl-tRNA moves to P (NA slides 163–164).',
        'Termination: a stop codon (UAA, UGA, UAG) has no tRNA; a termination factor releases the polypeptide and separates everything (NA slide 165).',
        'In bacteria transcription and translation are coupled; in eukaryotes mRNA must be processed and exported first (NA slide 166; GE slide 10).',
      ],
      notes: [{ kind: 'check', text: 'NA slide 162 says initiation uses GTP (eubacteria) or ATP (eukaryotes) and slide 163 that elongation binding uses ATP. The energy source is not quizzed.' }],
      sourceRefs: [...na([158, 159, 160, 161, 162, 163, 164, 165, 166]), ...ge([10, 11])],
    },
    {
      title: 'The genetic code',
      kind: 'definitions',
      paragraphs: [
        'There is no direct fit between amino acids and mRNA, so tRNA adaptors read codons of three bases. Four bases in triplets give 4 × 4 × 4 = 64 codons — 61 for 20 amino acids and 3 stops (NA slides 174, 177, 179).',
        'The code is degenerate (most amino acids have several codons, usually differing in the third base — “wobble” lets one tRNA read several), non-overlapping, read continuously from a fixed start (AUG), and has three stop (nonsense) codons. Similar codons code similar amino acids, limiting the effects of mutation (NA slides 178, 180).',
        'At least 31 tRNAs are needed; mammalian cells make more than 150 (NA slide 179). Each codon pairs with a complementary anticodon — e.g. codon AUG with anticodon UAC (NA slide 171).',
      ],
      sourceRefs: na([171, 174, 177, 178, 179, 180]),
    },
  ],
  summary: [
    'aaRS: amino acid + ATP → aminoacyl-AMP → aminoacyl-tRNA.',
    'A site (incoming), P site (peptidyl), E site (exit). Start AUG (Met); stops UAA, UAG, UGA.',
    '64 codons: degenerate, non-overlapping, continuous, wobble at the third base.',
  ],
};

const lesson10: Draft = {
  id: 'nucleic-acids-10',
  title: 'Gene Regulation in Bacteria',
  description: 'What a gene is, constitutive and inducible expression, positive and negative regulation, and the lac and trp operons.',
  xp: 25,
  sourceRefs: [...ge([13, 16, 17, 21, 25, 26, 28, 29, 30, 31, 32, 33, 35, 41, 42, 43, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 58, 73]), ...rd([86])],
  objectives: [
    'Distinguish constitutive and inducible genes, and negative and positive regulation',
    'Describe the parts of an operon and the difference between promoter and operator',
    'Explain how the lac operon is induced',
    'Explain repression and attenuation of the trp operon',
  ],
  chunks: [
    {
      title: 'Genes and their expression',
      kind: 'definitions',
      paragraphs: [
        'All nucleated body cells have the same DNA; they differ by which genes they express. A gene encodes one polypeptide (or an RNA such as rRNA or tRNA). Bacterial genomes have 500–600 genes; multicellular eukaryotes 15,000–50,000 (GE slides 13, 25, 31, 44).',
        'Constitutive (housekeeping) genes — e.g. actin, ubiquitin, GAPDH, tubulin — are transcribed continually. Inducible genes are transcribed only when needed: inducible ones can be turned on, repressible ones off (GE slide 32).',
        'The same signal can affect cells differently: glucocorticoids raise tyrosine aminotransferase in liver but lower it in fat cells (GE slide 26).',
        'Negative regulation: a repressor reduces expression (if a signal removes the repressor, transcription is induced — still negative regulation). Positive regulation: an activator increases it (GE slides 33, 35).',
        'In bacteria, control of transcription initiation is the main point of regulation; in eukaryotes control is spread over many points (GE slides 29–30).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on GE slides 25–35 were added to the deck and are not quizzed.' }],
      sourceRefs: ge([13, 25, 26, 29, 30, 31, 32, 33, 35, 44]),
    },
    {
      title: 'Operons',
      kind: 'structure',
      paragraphs: [
        'An operon is a bacterial cluster of related genes under one promoter, transcribed as one polycistronic mRNA. It has a promoter (RNA polymerase binds), an operator (between promoter and genes; the regulatory protein binds), structural genes and a terminator. The regulatory gene that makes the repressor can lie far away (GE slides 21, 28, 30, 46–48).',
        'Operators occur only in prokaryotes; promoters in both. Bacterial promoters have conserved −10 and −35 regions that bind sigma (GE slides 17, 45).',
        'Inducer: pulls the repressor off the operator, turning the operon on. Corepressor: keeps the repressor on the operator (GE slide 48).',
      ],
      sourceRefs: ge([16, 17, 21, 28, 45, 46, 47, 48]),
    },
    {
      title: 'The lac operon',
      kind: 'mechanism',
      paragraphs: [
        'The lac operon lets E. coli use lactose: inducible and polycistronic. The i gene makes the Lac repressor; the structural genes are lacZ (β-galactosidase, splitting lactose into glucose and galactose), lacY (permease, bringing lactose in) and lacA (thiogalactoside transacetylase) (GE slides 50, 52, 53).',
        'Low lactose: the repressor binds the operator and blocks RNA polymerase — no mRNA. High lactose: lactose (allolactose) binds the repressor, changing its shape so it falls off; RNA polymerase transcribes the three genes (GE slides 54–55, 58).',
      ],
      notes: [{ kind: 'check', text: 'GE slide 54 names lactose as the inducer and slide 58 allolactose. Both are kept; which one is not quizzed.' }],
      sourceRefs: ge([50, 51, 52, 53, 54, 55, 58]),
    },
    {
      title: 'The trp operon',
      kind: 'mechanism',
      paragraphs: [
        'The trp operon makes tryptophan — repressible negative regulation. Tryptophan is a corepressor: bound to the trp repressor it enhances binding to the operator, blocking transcription; without tryptophan the operator is free (GE slides 41, 56).',
        'Attenuation adds graded control: a leader sequence contains an attenuator, a provisional stop signal. Because transcription and translation are coupled in bacteria, a ribosome stalling in the leader decides whether transcription stops early or reads through to the structural genes (GE slide 58; RD slide 86).',
      ],
      sourceRefs: [...ge([41, 56, 58]), ...rd([86])],
    },
  ],
  summary: [
    'Constitutive vs inducible genes; negative (repressor) vs positive (activator) regulation.',
    'Operon: promoter, operator, structural genes; polycistronic mRNA.',
    'lac: inducible; lactose removes repressor → lacZ, lacY, lacA.',
    'trp: repressible; tryptophan is corepressor; attenuation.',
  ],
};

const lesson11: Draft = {
  id: 'nucleic-acids-11',
  title: 'Gene Regulation in Eukaryotes',
  description: 'The many levels at which eukaryotes control gene expression — chromatin and methylation, transcription factors and enhancers, RNA processing, mRNA stability and translation, and protein breakdown — and how expression is measured.',
  xp: 25,
  sourceRefs: ge([2, 5, 6, 37, 38, 40, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 76, 77, 78, 79, 80]),
  objectives: [
    'List the levels at which eukaryotic gene expression is controlled',
    'Explain how histone acetylation and DNA methylation affect transcription',
    'Describe control by promoters, enhancers and hormones',
    'Give examples of post-transcriptional, translational and post-translational control',
  ],
  chunks: [
    {
      title: 'Many control points',
      kind: 'overview',
      paragraphs: [
        'Eukaryotic expression can be controlled at chromatin, transcription, RNA processing, RNA transport, mRNA degradation, translation and post-translational modification. Operons are not known; the nuclear membrane separates transcription from translation (GE slides 61–62, 74).',
        'Cells rarely use more than 5–10% of their genes at a time. Hox (homeotic) genes are master genes for body-part development that encode homeodomain regulatory proteins (GE slide 79).',
      ],
      sourceRefs: ge([2, 61, 62, 74, 79]),
    },
    {
      title: 'Chromatin and methylation',
      kind: 'mechanism',
      paragraphs: [
        'Histones repress transcription by blocking DNA-binding proteins; DNase I readily digests active DNA but not histone-covered DNA (GE slide 66).',
        'Acetylation (and phosphorylation) of histones loosens their grip, allowing transcription. Methylation of DNA, mostly at CG sequences, inactivates genes; in fragile X syndrome the FMR-1 gene is silenced by methylation (GE slides 67–68).',
        'Euchromatin is diffuse and transcribed; heterochromatin is condensed and not. The inactive X chromosome in females is heterochromatin, equalising X-linked gene dosage (GE slides 76–77).',
      ],
      sourceRefs: ge([66, 67, 68, 76, 77]),
    },
    {
      title: 'Transcription control',
      kind: 'regulation',
      paragraphs: [
        'Promoters, upstream of the start site, are activated by specific transcription factors; some decide where transcription starts (TATA), others whether it starts (GE slide 64).',
        'Enhancers bind regulatory proteins; activators can work thousands of base pairs away by DNA looping, aided by architectural proteins and co-activators. Combinatorial control comes from many shared regulatory proteins (GE slides 37, 65).',
        'Steroid hormones bind intracellular receptors; the complex binds hormone response elements (HRE) in DNA. Other signals act by phosphorylating transcription factors (GE slide 80).',
      ],
      notes: [{ kind: 'check', text: 'GE slide 43 says enhancers are always upstream of the promoter; slide 65 says upstream or downstream. Both are kept; enhancer position is not quizzed.' }],
      sourceRefs: ge([37, 43, 64, 65, 80]),
    },
    {
      title: 'After transcription',
      kind: 'regulation',
      paragraphs: [
        'Alternative splicing and alternative polyadenylation make different mRNAs from one gene — e.g. the calcitonin (CALC) gene in thyroid and neurons. About half of primary transcripts never leave the nucleus (GE slides 6, 69).',
        'Translation: stored mRNAs in eggs have short poly(A) tails (15–90 As) and are activated by adding ~150 As after fertilisation (GE slide 70).',
        'mRNA stability is a major control point: AU-rich elements, secondary structure, deadenylation, decapping and internal cleavage shorten mRNA life; tRNA and rRNA are very stable (GE slide 71).',
        'Iron: without iron, iron regulatory proteins bind iron-responsive elements, blocking ferritin translation and stabilising transferrin receptor mRNA; with iron they let go (GE slide 78).',
        'Proteins are tagged by ubiquitin for degradation; the N-terminal amino acid predicts half-life — Arg, Lys, Phe, Leu, Trp ≤ 3 minutes; Cys, Ala, Ser, Thr, Gly, Val, Pro, Met ≥ 20 hours (GE slide 72).',
      ],
      sourceRefs: ge([5, 6, 69, 70, 71, 72, 78]),
    },
    {
      title: 'Measuring expression',
      kind: 'overview',
      paragraphs: [
        'DNA microarrays give a rough measure of many mRNAs at once (expression profiling). Real-time PCR is more sensitive and accurate; reverse transcriptase first copies mRNA into cDNA, which lacks introns (GE slides 38, 40).',
      ],
      sourceRefs: ge([38, 40]),
    },
  ],
  summary: [
    'Control at chromatin, transcription, processing, transport, stability, translation, protein turnover.',
    'Histone acetylation → active; DNA methylation (CG) → silent (fragile X).',
    'Enhancers act at a distance by looping; steroid receptors bind HREs.',
    'IRP/IRE: ferritin vs transferrin receptor; ubiquitin and the N-end rule.',
  ],
};

const lesson12: Draft = {
  id: 'nucleic-acids-12',
  title: 'The Genetics of Cancer',
  description: 'What cancer is, its causes and stages, oncogenes and tumour suppressor genes, p53 and apoptosis, the hallmarks of cancer, and treatment.',
  xp: 25,
  sourceRefs: ge([85, 86, 87, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100, 103, 104, 105, 108, 109, 111, 112, 113, 115, 118]),
  objectives: [
    'Distinguish benign and malignant tumours and the classes of cancer',
    'Describe the stages of cancer and the causes of the mutations',
    'Compare oncogenes and tumour suppressor genes',
    'Explain the role of p53 and apoptosis',
  ],
  chunks: [
    {
      title: 'What cancer is',
      kind: 'definitions',
      paragraphs: [
        'Cancer is uncontrolled cell proliferation, usually with de-differentiation, starting from one transformed cell. Benign tumours stay in place, behave like their cells of origin and are usually removed by surgery; malignant tumours invade and metastasise and lack contact inhibition (GE slides 85–86, 90, 95).',
        'Sarcomas arise from mesoderm (bone, muscle); carcinomas from ectoderm or endoderm; leukaemias from white cells in bone marrow; lymphomas from white cells in lymph glands (GE slide 87).',
        'Metastasis requires cells to break free, cross the basal lamina by secreting enzymes, travel in the circulation and colonise another tissue — about 1 in 10⁶ succeed. A tumour of 10⁶ cells (~2 mm) needs angiogenesis, which malignant cells stimulate with FGF and VEGF (GE slides 96, 98).',
      ],
      sourceRefs: ge([85, 86, 87, 90, 95, 96, 98]),
    },
    {
      title: 'Causes and stages',
      kind: 'mechanism',
      paragraphs: [
        'Most cancer is caused by somatic mutations, mostly in older people: spontaneous changes, chemicals (preservatives, pesticides), tobacco smoke, UV and ionising radiation (GE slides 91–92). Viruses cause at least five human cancers: hepatitis B (liver), HPV (cervix), Epstein–Barr (Burkitt’s lymphoma), HTLV I and II (leukaemia) (GE slide 91).',
        'Initiation: a mutation leaves the cell capable of unrestrained growth. Promotion: a mitogen pushes the cell into S phase. Progression: angiogenesis, invasiveness and metastasis (GE slide 93).',
        'Initiators are carcinogens that mutate DNA; promoters stimulate growth and block differentiation but do not cause cancer alone (GE slide 109).',
      ],
      sourceRefs: ge([91, 92, 93, 109]),
    },
    {
      title: 'Oncogenes and tumour suppressors',
      kind: 'comparison',
      table: {
        columns: ['', 'Oncogenes', 'Tumour suppressor genes'],
        rows: [
          ['Normal role', 'Proto-oncogenes promote growth', 'Inhibit cell division or promote apoptosis'],
          ['Mutation', 'Gain of function', 'Loss of function'],
          ['Copies needed', 'One (dominant)', 'Both (recessive)'],
          ['Car analogy', 'Accelerator', 'Brake'],
          ['Examples', 'Myc', 'APC, Rb, p53'],
        ],
      },
      paragraphs: [
        'p53, the product of TP53, is the “guardian of the genome”. Normally it is kept low by ubiquitination and proteasomal breakdown; DNA damage phosphorylates and stabilises it, so it accumulates and switches on genes that halt the cell cycle and start apoptosis. TP53 mutations are common, especially in late tumours and in smoke-, sunlight-, aflatoxin- and HPV-induced cancers (GE slides 104–105).',
      ],
      sourceRefs: ge([94, 99, 103, 104, 105]),
    },
    {
      title: 'Hallmarks, cell death and treatment',
      kind: 'clinical',
      paragraphs: [
        'The hallmarks: sustaining proliferative signalling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion and metastasis — underlain by genome instability and inflammation; emerging hallmarks are reprogrammed energy metabolism and evading immune destruction (GE slide 100).',
        'Apoptosis is programmed cell death carried out by caspases (targets include lamins, the cytoskeleton and caspase-activated DNase): cells shrink, membranes stay intact and DNA is cut into 180–200 bp pieces. Necrosis is a response to damage: cells swell and burst (GE slides 105, 111–113).',
        'Treatment depends on type, site and grade: surgery, chemotherapy, radiation, hormonal and targeted therapy (e.g. tamoxifen for ER/PR-positive breast cancer, Herceptin for HER2, Gleevec for BCR/ABL), angiogenesis inhibitors, transplant, gene therapy and palliative care (GE slides 108, 115).',
        'CRISPR–Cas9 uses a guide RNA to cut the genome at a chosen site, allowing precise editing; germline use is highly controversial (GE slide 118).',
      ],
      sourceRefs: ge([100, 105, 108, 111, 112, 113, 115, 118]),
    },
  ],
  summary: [
    'Benign stays; malignant invades and metastasises. Initiation → promotion → progression.',
    'Oncogenes: gain of function, one copy. Tumour suppressors: loss of function, both copies.',
    'p53 halts the cycle and triggers apoptosis; caspases carry it out.',
    'Viruses: HBV, HPV, EBV, HTLV.',
  ],
};

const lesson13: Draft = {
  id: 'nucleic-acids-13',
  title: 'Recombinant DNA and Cloning',
  description: 'Restriction enzymes, vectors, the steps of cloning, selecting transformants, making human insulin and other products, and DNA libraries.',
  xp: 25,
  sourceRefs: rd([2, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20, 22, 45, 46, 47, 77, 78, 79, 80]),
  objectives: [
    'Define recombinant DNA technology and restriction enzymes',
    'Compare plasmids, phage, cosmids, YACs, BACs and shuttle vectors',
    'Outline the steps of cloning and how transformants are selected',
    'Describe the production of human insulin and other recombinant products',
  ],
  chunks: [
    {
      title: 'Cutting and joining DNA',
      kind: 'definitions',
      paragraphs: [
        'Recombinant DNA technology (Boyer and Cohen, 1973) isolates DNA from different species, cuts and splices it into a vector, and multiplies it in rapidly dividing host cells (RD slide 2).',
        'Restriction enzymes — “molecular scissors” from bacteria, where they cut viral DNA — recognise specific, usually palindromic, sequences and cut there, leaving sticky or blunt ends (RD slide 5).',
        'General cloning: isolate vector and gene; cut both with the same restriction enzyme; mix and ligate; transform host cells; select transformants with antibiotics (RD slide 7).',
      ],
      notes: [{ kind: 'annotation', text: 'Speaker notes on RD slides 5–8 were added to the deck and are not quizzed.' }],
      sourceRefs: rd([2, 5, 7]),
    },
    {
      title: 'Vectors',
      kind: 'comparison',
      table: {
        columns: ['Vector', 'Insert size', 'Notes'],
        rows: [
          ['Plasmid', 'Up to 10 kb', 'Circular, self-replicating; needs origin, selectable marker and unique restriction sites'],
          ['Phage (λ)', 'Up to 15 kb', 'Linear'],
          ['Cosmid', 'Up to 45 kb', 'Constructed from plasmid and phage features'],
          ['YAC', 'Up to 1 million bp', 'Needs telomeres, centromere, origin, markers'],
          ['Shuttle vector', '—', 'Replicates in two or more kinds of organism (e.g. E. coli and yeast)'],
        ],
      },
      paragraphs: [
        'Selecting cells: vectors carry antibiotic-resistance genes, so only cells with the vector grow on antibiotic media. Recombinant vectors are spotted because the insert inactivates a vector gene or adds a marker, or by cutting plasmids and running a gel — vector alone gives one band (e.g. 4 kb), vector + insert two (4 kb and 2 kb) (RD slides 13–14).',
        'DNA can be put into cells by particle gun (tungsten pellets) or electroporation; the gene of interest can also be isolated by PCR (RD slides 12–13).',
      ],
      sourceRefs: rd([8, 9, 10, 12, 13, 14, 15]),
    },
    {
      title: 'Products',
      kind: 'clinical',
      paragraphs: [
        'Human insulin: a cDNA copy is made from insulin mRNA, inserted into a plasmid via sticky ends, put into E. coli, and transformed bacteria selected on antibiotic agar (RD slides 16–19).',
        'Recombinant factors VIII and IX treat haemophilia A and B (X-linked) more safely than pooled blood, which may carry HIV or hepatitis B and C. A Plasmodium falciparum surface antigen made in E. coli is used for malaria vaccine development (RD slide 20).',
        'Other products: tissue plasminogen activator, growth hormone, TGF-β, DNase for cystic fibrosis, recombinant vaccines, PDGF for diabetic ulcers, bovine growth hormone. Proteins can be secreted in transgenic animals’ milk using a mammary promoter (β-lactoglobulin) (RD slides 45–47).',
        'Safety: the Recombinant DNA Advisory Committee (1974) set physical and biological containment (RD slide 22).',
      ],
      sourceRefs: rd([4, 16, 17, 18, 19, 20, 22, 45, 46, 47]),
    },
    {
      title: 'Libraries',
      kind: 'comparison',
      paragraphs: [
        'Genomic libraries are made by digesting genomic DNA (complete or partial digestion, or shearing); not all sequences are equally represented (RD slides 77, 80).',
        'cDNA libraries come from mature mRNA, so have no introns. An oligo(dT) primer anneals to the poly(A) tail; reverse transcriptase makes cDNA; RNase H nicks the mRNA to give primers; DNA polymerase I and ligase complete the second strand (RD slides 78–79).',
      ],
      sourceRefs: rd([77, 78, 79, 80]),
    },
  ],
  summary: [
    'Restriction enzymes cut palindromes → sticky or blunt ends; ligase joins.',
    'Plasmid 10 kb, phage 15 kb, cosmid 45 kb, YAC 1 Mb.',
    'Antibiotic resistance selects transformants.',
    'Insulin from cDNA in a plasmid in E. coli; recombinant factor VIII/IX.',
  ],
};

const lesson14: Draft = {
  id: 'nucleic-acids-14',
  title: 'PCR, DNA Testing and Gene Therapy',
  description: 'How PCR amplifies DNA, how gel electrophoresis and RFLPs detect mutations, DNA typing and paternity, and gene therapy.',
  xp: 25,
  sourceRefs: rd([21, 23, 24, 25, 26, 27, 28, 29, 30, 32, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 48, 49, 50, 51, 53, 54, 55, 58, 71, 73]),
  objectives: [
    'Describe the components and cycle of PCR',
    'Explain how RFLPs detect sickle cell disease',
    'Describe the purposes and limits of genetic testing',
    'Explain DNA typing and somatic gene therapy',
  ],
  chunks: [
    {
      title: 'PCR',
      kind: 'pathway',
      paragraphs: [
        'PCR amplifies DNA exponentially with DNA polymerase. Only the flanking sequences need to be known to design the two primers (~20–35 nucleotides), which anneal to opposite strands; only DNA between them is copied (RD slide 48).',
        'Components: template, primers in vast excess, the four dNTPs, and Taq polymerase — a thermostable enzyme from Thermus aquaticus of hot springs (RD slide 50).',
        'Each cycle: denaturation (~95 °C), primer annealing (e.g. ~54 °C), extension (72 °C). Each cycle doubles the target (2ⁿ after n cycles); usually 25–40 cycles (RD slides 51, 53).',
        'Benefits: sensitivity, speed, no radioactivity, works on damaged DNA. Limits: not for long sequences, primer sequences must be known, needs pure samples, no proofreading, and contamination is amplified (RD slides 49, 55).',
        'Gel electrophoresis separates DNA by size — migration is inversely related to size; ethidium bromide stains it under UV (RD slides 58–59).',
      ],
      sourceRefs: rd([48, 49, 50, 51, 53, 54, 55, 58, 59]),
    },
    {
      title: 'Genetic testing',
      kind: 'clinical',
      paragraphs: [
        'DNA tests exist for Huntington disease, haemophilia, cystic fibrosis, Tay–Sachs and sickle cell anaemia. Testing targets people with symptoms or a family history; screening covers the population at large (RD slides 23–24).',
        'Purposes: prenatal diagnosis (amniocentesis, chorionic villus sampling), newborn screening (PKU, sickle cell, Tay–Sachs) and carrier detection (Tay–Sachs, Duchenne muscular dystrophy, cystic fibrosis) (RD slides 26–27).',
        'RFLP analysis detects the loss or gain of a restriction site. The sickle mutation (an A→T change in codon 6 of β-globin, glutamate → valine) removes a DdeI site: HbA has three DdeI sites, HbS two, seen by Southern blotting with a β-globin probe (RD slides 28–30).',
        'Allele-specific oligonucleotide hybridisation after PCR detects mutations in GLC1A, a glaucoma gene (RD slide 32).',
        'Limits: the gene may be unknown, many different mutations may cause the disease (e.g. BRCA1/2), and not every carrier develops disease (RD slides 25, 34).',
      ],
      sourceRefs: rd([23, 24, 25, 26, 27, 28, 29, 30, 32, 34]),
    },
    {
      title: 'DNA typing',
      kind: 'mechanism',
      paragraphs: [
        'DNA typing (fingerprinting) uses highly polymorphic regions: microsatellites (STRs, 2–4 bp repeats) and minisatellites (VNTRs, 5 to a few tens of bp) (RD slide 35).',
        'Paternity: mother, baby and putative father are typed. The baby shares one allele with the mother and one with the father. If the man shares none, he is excluded; sharing alleles at five or more loci gives convincing probability (RD slides 38–39).',
        'Other uses: forensic cases, population studies, animal pedigrees, wildlife crime, pathogens in food, GMO detection (RD slide 40).',
      ],
      sourceRefs: rd([35, 37, 38, 39, 40]),
    },
    {
      title: 'Gene therapy',
      kind: 'clinical',
      paragraphs: [
        'Somatic cell therapy modifies non-reproductive cells and is used in humans; germ-line therapy alters reproductive cells and is not used, for ethical reasons (RD slide 41).',
        'Cells are sampled, given normal copies of the gene, and returned — e.g. bone marrow cells for thalassaemia or sickle cell, skin fibroblasts for circulating proteins. For ADA-deficient SCID, a retroviral vector based on Moloney murine leukaemia virus carries the ADA gene into T cells (RD slides 42–43, 71).',
        'Limits: transformation is inefficient, integration must be precise, retroviruses integrate only in dividing cells, vectors carry limited DNA and can provoke immunity, and insertion can inactivate genes (RD slides 43, 73).',
      ],
      sourceRefs: rd([21, 41, 42, 43, 44, 71, 73]),
    },
  ],
  summary: [
    'PCR: denature 95 °C, anneal, extend 72 °C with Taq; 2ⁿ copies.',
    'RFLP: sickle mutation removes a DdeI site.',
    'STRs (2–4 bp) and VNTRs for typing; baby shares one allele with each parent.',
    'Somatic gene therapy used (ADA-SCID); germ-line not.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10, lesson11, lesson12, lesson13, lesson14].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: interactive[lesson.id],
}));

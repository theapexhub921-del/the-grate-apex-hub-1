// Biochemistry → Nucleic Acids — layer 1 (learn by answering) and
// reading-layer extras. Checkpoint IDs: cN-xx; recall: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { ge, na, nb, nm, rd, type ConceptId } from '@/data/topics/nucleic-acids/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'nucleic-acids-1': [
    ask(mcq('c1-01', 'nucleotide-parts', 'Which bases are purines?', 'Adenine and guanine', ['Cytosine and thymine', 'Uracil and cytosine', 'Adenine and thymine'], { explanation: 'NA slide 18.' })),
    learn('Base + sugar + phosphate', ['A base on a sugar is a nucleoside; add phosphate(s) and it is a nucleotide. Purines attach through N9, pyrimidines through N1, both to C1′ of the sugar.'], { sourceRefs: na([12, 21]) }),
    ask(mcq('c1-02', 'nucleotide-parts', 'Uridine is…', 'A nucleoside: uracil + ribose', ['A nucleotide: uracil + ribose + phosphate', 'A free base, not attached to a sugar', 'A nucleoside found in DNA: uracil + deoxyribose'], { explanation: 'NA slides 13, 21.' })),
    ask(multi('c1-03', 'nucleotide-roles', 'Which molecules contain an adenine nucleotide? Select all that apply.', ['NAD⁺', 'FAD', 'Coenzyme A'], ['Glucose', 'Biotin'], { explanation: 'NA slide 25; NB22 slide 11.' })),
    recall('r1-01', 'nucleotide-roles', 'List the roles of nucleotides in the cell.', [
      'Monomers of DNA and RNA.',
      'Energy carriers (ATP, GTP).',
      'Second messengers (cAMP, cGMP); ADP in platelet aggregation; adenosine in coronary flow.',
      'Parts of coenzymes (NAD⁺, FAD, CoA) and activated intermediates (UDP-glucose, SAM, PAPS); allosteric effectors.',
    ], na([25, 26])),
  ],
  'nucleic-acids-2': [
    ask(mcq('c2-01', 'purine-de-novo', 'What is the first purine nucleotide made de novo?', 'Inosine monophosphate (IMP)', ['Adenosine monophosphate (AMP)', 'Guanosine monophosphate (GMP)', 'Xanthosine monophosphate (XMP)'], { explanation: 'NM slide 12.' })),
    ask(mcq('c2-02', 'purine-de-novo', 'Which enzyme catalyses the committed step of purine synthesis?', 'Amidophosphoribosyl transferase', ['PRPP synthetase (ribose-phosphate pyrophosphokinase)', 'IMP dehydrogenase', 'Adenylosuccinate synthetase'], { explanation: 'NM slides 17, 20.' })),
    learn('Two drugs, one reason', ['Two steps of purine synthesis need THF, so drugs that starve the folate pool — methotrexate, sulfonamides — block purine synthesis.'], { sourceRefs: nm([19]) }),
    ask(match('c2-03', 'purine-de-novo', 'Match each source to the purine ring atoms it gives.', [
      ['Aspartate', 'N1'],
      ['Glutamine', 'N3 and N9'],
      ['Glycine', 'C4, C5 and N7'],
      ['CO₂', 'C6'],
    ], { explanation: 'NB22 slide 25.' })),
    recall('r2-01', 'amp-gmp', 'Explain how IMP is converted to AMP and GMP and how the balance is kept.', [
      'AMP: adenylosuccinate synthetase adds aspartate using GTP; a lyase removes fumarate.',
      'GMP: IMP dehydrogenase (NAD⁺) makes XMP; a synthetase makes GMP using ATP.',
      'Each branch uses the other’s triphosphate; AMP inhibits adenylosuccinate synthetase and GMP inhibits IMP dehydrogenase.',
    ], [...nm([26, 30]), ...nb([28, 30])]),
  ],
  'nucleic-acids-3': [
    ask(mcq('c3-01', 'purine-salvage', 'Which enzyme salvages hypoxanthine and guanine?', 'HGPRT', ['APRT', 'Xanthine oxidase', 'Adenosine deaminase'], { explanation: 'NM slide 22.' })),
    ask(order('c3-02', 'purine-degradation', 'Order the degradation of AMP to uric acid.', ['AMP', 'Adenosine', 'Inosine', 'Hypoxanthine', 'Xanthine', 'Uric acid'], { explanation: 'NM slide 77.' })),
    learn('Allopurinol', ['Allopurinol looks like hypoxanthine. Xanthine oxidase converts it to a compound that inactivates the enzyme — a suicide inhibitor — so less uric acid is made.'], { sourceRefs: nm([42]) }),
    ask(mcq('c3-03', 'lesch-nyhan-ada', 'Why does purine synthesis rise 200-fold in Lesch–Nyhan syndrome?', 'Unused PRPP accumulates and drives de novo synthesis', ['Xanthine oxidase is overactive and pulls the pathway forward', 'Uric acid activates amidophosphoribosyl transferase', 'ADA is missing, so adenosine builds up and drives it'], { explanation: 'NM slides 45–46.', skill: 'cause-effect' })),
    recall('r3-01', 'gout', 'Explain gout and its treatment.', [
      'Uric acid accumulates through overproduction or impaired excretion (lead impairs excretion).',
      'Crystals deposit in joints (e.g. the great toe), kidneys and ureters.',
      'Treat with NSAIDs, fluids, rest; allopurinol inhibits xanthine oxidase; colchicine.',
    ], nm([40, 41, 42])),
  ],
  'nucleic-acids-4': [
    ask(mcq('c4-01', 'pyrimidine-de-novo', 'How does pyrimidine synthesis differ from purine synthesis?', 'The ring is made first, then attached to ribose phosphate', ['It is built on PRPP from the very first step, like purines', 'It needs 11 steps, one more than purine synthesis', 'It occurs entirely inside the mitochondria'], { explanation: 'NM slide 52.' })),
    ask(order('c4-02', 'pyrimidine-de-novo', 'Order the intermediates of pyrimidine synthesis.', ['Carbamoyl phosphate', 'Carbamoyl aspartate', 'Dihydroorotate', 'Orotate', 'OMP', 'UMP'], { explanation: 'NM slides 53, 57.' })),
    learn('Different switches', ['Animals regulate pyrimidine synthesis at CPS II (UTP inhibits; ATP and PRPP activate). Bacteria regulate at ATCase (CTP inhibits; ATP activates).'], { sourceRefs: nm([62, 70]) }),
    ask(mcq('c4-03', 'deoxyribonucleotides', 'Methotrexate blocks dTMP production by inhibiting…', 'Dihydrofolate reductase', ['Thymidylate synthase', 'Ribonucleotide reductase', 'CTP synthetase'], { explanation: 'NB22 slide 78.', clinical: true })),
    recall('r4-01', 'orotic-aciduria', 'Describe orotic aciduria and why uridine treats it.', [
      'Type I: deficient orotate phosphoribosyltransferase and orotidylate decarboxylase; type II: decarboxylase only (or 6-azauridine).',
      'Orotic acid is excreted; growth is stunted, with severe anaemia and infections.',
      'Uridine (or cytidine) supplies pyrimidine nucleotides beyond the block.',
    ], nm([63, 64])),
  ],
  'nucleic-acids-5': [
    ask(mcq('c5-01', 'dna-double-helix', 'How many hydrogen bonds join G and C?', 'Three', ['Two', 'One', 'Four'], { explanation: 'NA slide 34.' })),
    ask(mcq('c5-02', 'dna-rna-differences', 'Why does DNA use thymine instead of uracil?', 'Uracil arising from deaminated cytosine can then be recognised and repaired', ['Thymine is cheaper for the cell to make than uracil', 'Uracil cannot pair with adenine in a double helix', 'Thymine absorbs less UV, protecting DNA from sunlight'], { explanation: 'NA slide 31.', skill: 'cause-effect' })),
    learn('Melting', ['Heating separates the strands. Stacked bases absorb less UV, so A260 rises as DNA melts. G:C-rich DNA melts at a higher temperature.'], { sourceRefs: na([43, 48]) }),
    ask(mcq('c5-03', 'dna-properties', 'Which DNA has the highest melting temperature?', 'One rich in G:C pairs', ['One rich in A:T pairs', 'Single-stranded DNA', 'RNA'], { explanation: 'NA slide 48.' })),
    recall('r5-01', 'dna-double-helix', 'Describe the forces that stabilise the DNA double helix.', [
      'Hydrophobic interactions bury the bases inside.',
      'Base stacking (van der Waals) between neighbouring pairs.',
      'Hydrogen bonds between paired bases.',
      'Cations such as Mg²⁺ reduce repulsion between phosphates.',
    ], na([38])),
  ],
  'nucleic-acids-6': [
    ask(mcq('c6-01', 'replication-rules', 'Meselson and Stahl showed that replication is…', 'Semiconservative', ['Conservative', 'Dispersive', 'Unidirectional'], { explanation: 'NA slide 60.' })),
    ask(mcq('c6-02', 'replication-rules', 'Why is the lagging strand made in pieces?', 'Polymerase works only 5′→3′, away from the moving fork on that strand', ['That strand has no template to copy from at the fork', 'DNA ligase works too slowly to join a continuous strand', 'Primase cannot bind that strand except at the origin'], { explanation: 'NA slides 72–73.', skill: 'cause-effect' })),
    ask(match('c6-03', 'replication-machinery', 'Match each protein to its job.', [
      ['Helicase', 'Unwinds DNA'],
      ['Gyrase', 'Relieves supercoiling'],
      ['Primase', 'Makes RNA primers'],
      ['DNA ligase', 'Seals nicks'],
    ], { explanation: 'NA slides 74–77.' })),
    learn('The ends', ['When the last RNA primer is removed from a linear chromosome, the gap cannot be filled. Telomerase uses its own RNA template to add TTAGGG repeats.'], { sourceRefs: na([85, 86, 87]) }),
    recall('r6-01', 'replication-machinery', 'Describe events at an E. coli replication fork.', [
      'Helicase unwinds; gyrase relieves supercoils; SSBs hold strands apart.',
      'Primase lays RNA primers — one on the leading strand, many on the lagging.',
      'DNA polymerase III extends them 5′→3′; Okazaki fragments form on the lagging strand.',
      'DNA polymerase I replaces primers with DNA; ligase seals the nicks.',
    ], na([74, 75, 77])),
  ],
  'nucleic-acids-7': [
    ask(mcq('c7-01', 'dna-damage', 'Ultraviolet light typically damages DNA by forming…', 'Thymine dimers', ['Depurinated sites', 'Single-strand breaks only', 'Methylated guanine'], { explanation: 'NA slide 99.' })),
    ask(mcq('c7-02', 'mutations', 'A mutation in a skin cell that is not passed to children is…', 'Somatic', ['Germ-line', 'Induced only', 'Silent'], { explanation: 'NA slide 90.' })),
    learn('Tautomers', ['A base can briefly shift to its rare enol form and pair wrongly — G with T. If not corrected, the next replication gives a GC→AT transition.'], { sourceRefs: na([96]) }),
    ask(match('c7-03', 'dna-repair', 'Match each repair system to what it does.', [
      ['Photoreactivation', 'Photolyase reverses thymine dimers with light'],
      ['Base excision', 'Glycosylase removes an altered base'],
      ['Recombinational repair', 'Parental strand fills a post-replication gap'],
    ], { explanation: 'NA slides 108–111.' })),
    recall('r7-01', 'dna-repair', 'Explain xeroderma pigmentosum.', [
      'A genetic defect in the enzymes that repair UV damage in skin cells (nucleotide excision repair).',
      'UV-induced damage such as thymine dimers persists.',
      'Patients cannot go into sunlight and develop more skin cancers and cataracts.',
    ], na([110, 112])),
  ],
  'nucleic-acids-8': [
    ask(mcq('c8-01', 'prokaryotic-transcription', 'What does the sigma factor do?', 'Lets RNA polymerase bind promoters specifically', ['Terminates transcription at the end of the gene', 'Adds the poly(A) tail to the new transcript', 'Proofreads the RNA as it is being made'], { explanation: 'NA slide 133.' })),
    ask(match('c8-02', 'eukaryotic-transcription', 'Match each eukaryotic RNA polymerase to its main product.', [
      ['RNA polymerase I', 'rRNA'],
      ['RNA polymerase II', 'mRNA'],
      ['RNA polymerase III', 'tRNA'],
    ], { explanation: 'NA slides 115, 149.' })),
    learn('Processing', ['Eukaryotic pre-mRNA gets a 7-methylguanosine cap and a poly(A) tail, and the spliceosome removes introns before export.'], { sourceRefs: ge([6, 7, 75]) }),
    ask(mcq('c8-03', 'prokaryotic-transcription', 'Rho factor is…', 'An ATP-dependent helicase that releases the RNA', ['A sigma factor that recognises the terminator', 'A ribosomal protein that halts the polymerase', 'An RNA hairpin rich in G and C'], { explanation: 'NA slide 147.' })),
    recall('r8-01', 'prokaryotic-transcription', 'Describe the stages of transcription in E. coli.', [
      'Initiation: the holoenzyme (core + σ) binds the promoter, opens the DNA and starts RNA; σ leaves after 6–10 nucleotides.',
      'Elongation: the core enzyme adds nucleotides 5′→3′ (20–50 per second).',
      'Termination: an RNA hairpin at a GC-rich pause site, or rho helicase, releases the RNA.',
    ], na([136, 140, 145])),
  ],
  'nucleic-acids-9': [
    ask(mcq('c9-01', 'trna-charging', 'What intermediate does an aminoacyl-tRNA synthetase form first?', 'Aminoacyl-AMP', ['Aminoacyl-CoA', 'Peptidyl-tRNA', 'Aminoacyl-ADP'], { explanation: 'NA slide 154.' })),
    ask(match('c9-02', 'translation-steps', 'Match each ribosome site to its role.', [
      ['A site', 'Incoming aminoacyl-tRNA'],
      ['P site', 'tRNA holding the growing chain'],
      ['E site', 'Empty tRNA leaves'],
    ], { explanation: 'NA slide 160.' })),
    learn('Reading frames', ['Codons are read three bases at a time from AUG without gaps or overlaps. Shift the frame and every codon after it changes.'], { sourceRefs: na([179, 180]) }),
    ask(multi('c9-03', 'genetic-code', 'Which are stop codons? Select all that apply.', ['UAA', 'UAG', 'UGA'], ['AUG', 'UUU'], { explanation: 'NA slide 165.' })),
    recall('r9-01', 'genetic-code', 'List the properties of the genetic code.', [
      'Triplet codons: 64 = 61 sense + 3 stop.',
      'Degenerate: most amino acids have several codons, usually differing at the third base (wobble).',
      'Non-overlapping and read continuously from a fixed start (AUG).',
    ], na([177, 178, 180])),
  ],
  'nucleic-acids-10': [
    ask(mcq('c10-01', 'gene-regulation-basics', 'GAPDH and actin genes are examples of…', 'Constitutive (housekeeping) genes', ['Inducible genes (switched on by a signal)', 'Repressible genes (switched off by a product)', 'Operons (several genes under one promoter)'], { explanation: 'GE slide 32.' })),
    ask(mcq('c10-02', 'operon-parts', 'What binds the operator?', 'The repressor (regulatory protein)', ['RNA polymerase holoenzyme', 'The sigma factor alone', 'The small ribosomal subunit'], { explanation: 'GE slides 16–17.' })),
    learn('Two styles', ['lac is inducible: off until lactose removes the repressor. trp is repressible: on until tryptophan helps the repressor bind.'], { sourceRefs: ge([54, 56]) }),
    ask(mcq('c10-03', 'lac-operon', 'Which lac gene encodes the permease?', 'lacY', ['lacZ', 'lacA', 'lacI'], { explanation: 'GE slide 53.' })),
    recall('r10-01', 'lac-operon', 'Explain how the lac operon responds to lactose.', [
      'The i gene makes the Lac repressor, which binds the operator and blocks RNA polymerase when lactose is low.',
      'Lactose (allolactose) binds the repressor, changing its shape so it leaves the operator.',
      'RNA polymerase transcribes lacZ, lacY and lacA on one polycistronic mRNA.',
    ], ge([52, 54, 55])),
  ],
  'nucleic-acids-11': [
    ask(mcq('c11-01', 'chromatin-epigenetics', 'Histone acetylation generally…', 'Loosens chromatin and allows transcription', ['Tightens chromatin and silences genes', 'Methylates the DNA at CpG islands', 'Degrades the mRNA in the cytoplasm'], { explanation: 'GE slide 67.' })),
    ask(mcq('c11-02', 'chromatin-epigenetics', 'In fragile X syndrome the FMR-1 gene is silenced by…', 'DNA methylation', ['Histone acetylation', 'Alternative splicing', 'Deletion'], { explanation: 'GE slide 68.', clinical: true })),
    learn('Iron', ['With little iron, IRPs bind IREs: ferritin translation is blocked and transferrin receptor mRNA is stabilised, so the cell takes up more iron.'], { sourceRefs: ge([78]) }),
    ask(mcq('c11-03', 'eukaryotic-control-levels', 'How do activators bound far from a promoter affect transcription?', 'DNA loops to bring them close', ['They slide along the DNA to the promoter', 'They are cleaved off and diffuse to it', 'They make a new promoter where they bind'], { explanation: 'GE slide 37.' })),
    recall('r11-01', 'post-transcriptional', 'Give examples of control after transcription in eukaryotes.', [
      'Alternative splicing and polyadenylation (calcitonin gene).',
      'mRNA export (half of transcripts never leave the nucleus) and stability (AU-rich elements, deadenylation).',
      'Translation (short poly(A) tails in stored egg mRNA; IRP/IRE for ferritin).',
      'Protein degradation via ubiquitin, rate set by the N-terminal amino acid.',
    ], ge([69, 70, 71, 72, 78])),
  ],
  'nucleic-acids-12': [
    ask(mcq('c12-01', 'cancer-basics', 'A cancer of bone or muscle is a…', 'Sarcoma', ['Carcinoma', 'Lymphoma', 'Leukaemia'], { explanation: 'GE slide 87.' })),
    ask(mcq('c12-02', 'oncogenes-suppressors', 'How many copies of a tumour suppressor gene must usually be lost to raise cancer risk?', 'Both', ['One', 'None', 'Three'], { explanation: 'GE slides 99, 103.' })),
    learn('Guardian', ['DNA damage stabilises p53, which halts the cell cycle and can trigger apoptosis. Lose p53 and damaged cells keep dividing.'], { sourceRefs: ge([104]) }),
    ask(multi('c12-03', 'cancer-basics', 'Which viruses are linked to human cancers? Select all that apply.', ['Hepatitis B virus', 'Human papillomavirus', 'Epstein–Barr virus', 'HTLV I'], ['Influenza virus'], { explanation: 'GE slide 91.' })),
    recall('r12-01', 'oncogenes-suppressors', 'Compare oncogenes and tumour suppressor genes.', [
      'Oncogenes come from proto-oncogenes that promote growth; mutation is a gain of function (e.g. Myc).',
      'One mutant copy is enough (dominant) — the accelerator.',
      'Tumour suppressors inhibit division or promote apoptosis (Rb, APC, p53); mutation is a loss of function.',
      'Both copies must be lost (recessive) — the brake.',
    ], ge([94, 99, 103])),
  ],
  'nucleic-acids-13': [
    ask(mcq('c13-01', 'rdna-basics', 'Restriction enzymes usually recognise…', 'Palindromic sequences', ['Random sequences of any length', 'Telomere repeat sequences', 'Poly(A) tails of mRNA'], { explanation: 'RD slide 5.' })),
    ask(match('c13-02', 'vectors', 'Match each vector to the largest insert it carries.', [
      ['Plasmid', 'Up to 10 kb'],
      ['Cosmid', 'Up to 45 kb'],
      ['YAC', 'Up to 1 million bp'],
    ], { explanation: 'RD slides 8–9.' })),
    learn('Why cDNA for insulin', ['Bacteria cannot splice introns. Copying insulin mRNA into cDNA gives a gene without introns that E. coli can express.'], { sourceRefs: rd([16, 78]) }),
    ask(mcq('c13-03', 'vectors', 'How are bacteria that took up the plasmid selected?', 'Growing them on antibiotic medium, since the plasmid carries resistance', ['By the colour of the colonies alone, without any antibiotic', 'By running PCR on every single colony on the plate', 'By heating them so that only plasmid-carrying cells survive'], { explanation: 'RD slides 13–14.' })),
    recall('r13-01', 'rdna-basics', 'Outline the general steps of cloning a gene.', [
      'Isolate the vector and the gene of interest.',
      'Cut both with the same restriction enzyme.',
      'Mix and join with DNA ligase to make recombinant DNA.',
      'Transform host cells and select transformants with antibiotics.',
    ], rd([7])),
  ],
  'nucleic-acids-14': [
    ask(order('c14-01', 'pcr', 'Order one cycle of PCR.', ['Denaturation (~95 °C)', 'Primer annealing', 'Extension (72 °C)'], { explanation: 'RD slides 51, 53.' })),
    ask(mcq('c14-02', 'pcr', 'Why is Taq polymerase used in PCR?', 'It is thermostable and survives denaturation', ['It proofreads perfectly, so it makes no errors', 'It needs no primers to start copying the DNA', 'It copies RNA as well as DNA at high temperature'], { explanation: 'RD slide 50.', skill: 'cause-effect' })),
    learn('Sickle cell by RFLP', ['The sickle mutation removes one DdeI site in β-globin. Cut DNA gives different fragment sizes for HbA and HbS on a Southern blot.'], { sourceRefs: rd([29, 30]) }),
    ask(mcq('c14-03', 'dna-typing', 'A man shares no alleles with a baby at a typed locus. What follows?', 'He is excluded as the father', ['He is proven to be the father', 'The test has failed and must be repeated', 'The mother is excluded instead'], { explanation: 'RD slide 39.' })),
    recall('r14-01', 'gene-therapy', 'Describe somatic gene therapy, with an example.', [
      'Patient cells are sampled, given normal copies of the gene and returned.',
      'ADA-deficient SCID: a retroviral vector carries the ADA gene into T cells.',
      'It treats the individual only; germ-line therapy would be heritable and is not used.',
    ], rd([41, 42, 43, 71])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'nucleic-acids-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Purines A, G; pyrimidines C, T, U.', 'Nucleoside = base + sugar.', 'AMP is part of NAD⁺, FAD, CoA.'],
    confusions: [{ confusion: 'Nucleosides contain phosphate.', clarification: 'A nucleoside is base + sugar; a nucleotide adds phosphate (NA slide 21).' }],
  },
  'nucleic-acids-2': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['IMP is the first purine.', 'Committed step: amidophosphoribosyl transferase.', 'AMP needs GTP; GMP needs ATP.'],
    confusions: [{ confusion: 'Purine bases are made first, then attached to ribose.', clarification: 'Purines are built on ribose phosphate from PRPP; it is pyrimidines whose ring is made first (NM slides 12, 52).' }],
  },
  'nucleic-acids-3': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['HGPRT deficiency = Lesch–Nyhan.', 'ADA deficiency = SCID.', 'Allopurinol inhibits xanthine oxidase.'],
    confusions: [{ confusion: 'Lesch–Nyhan lowers purine synthesis.', clarification: 'PRPP builds up and de novo synthesis rises 200-fold (NM slide 45).' }],
  },
  'nucleic-acids-4': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['CPS II regulated in animals; ATCase in bacteria.', 'DHO dehydrogenase is mitochondrial.', 'Methotrexate inhibits DHFR.'],
    confusions: [{ confusion: 'CPS II makes carbamoyl phosphate for the urea cycle.', clarification: 'CPS I (mitochondrial) serves the urea cycle; CPS II (cytosolic) serves pyrimidines (NM slide 55).' }],
  },
  'nucleic-acids-5': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['A=T 2 H bonds; G≡C 3.', 'λmax 260 nm.', 'G:C-rich DNA melts higher.'],
    confusions: [{ confusion: 'Denatured DNA absorbs less UV.', clarification: 'Single strands absorb more; A260 rises on melting (NA slides 43, 45).' }],
  },
  'nucleic-acids-6': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Semiconservative (Meselson–Stahl).', 'Pol III synthesises; pol I removes primers.', 'Telomerase: RNA-dependent DNA polymerase.'],
    confusions: [{ confusion: 'The leading strand is made in Okazaki fragments.', clarification: 'The lagging strand is; the leading strand is continuous (NA slide 72).' }],
  },
  'nucleic-acids-7': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['UV → thymine dimers.', 'Photolyase reverses dimers.', 'XP = UV repair defect.'],
    confusions: [{ confusion: 'Most mutations are caused by mutagens.', clarification: 'Most are spontaneous (NA slide 97).' }],
  },
  'nucleic-acids-8': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['σ gives promoter specificity.', 'Pol I rRNA, II mRNA, III tRNA.', '5′ cap, poly(A), splicing.'],
    confusions: [{ confusion: 'Transcription needs a primer, like replication.', clarification: 'RNA polymerase needs no primer (NA slides 115, 117).' }],
  },
  'nucleic-acids-9': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['A, P, E sites.', 'Start AUG; stops UAA, UAG, UGA.', 'Degenerate, non-overlapping code.'],
    confusions: [{ confusion: 'Stop codons are read by special tRNAs.', clarification: 'No tRNA matches a stop codon; a termination factor acts (NA slide 165).' }],
  },
  'nucleic-acids-10': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['lac: inducible.', 'trp: repressible; tryptophan is the corepressor.', 'Operators only in prokaryotes.'],
    confusions: [{ confusion: 'Removing a repressor is positive regulation.', clarification: 'It is still negative regulation — a repressor controls the gene (GE slide 33).' }],
  },
  'nucleic-acids-11': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Acetylation opens; methylation silences.', 'Enhancers act by looping.', 'IRP/IRE controls ferritin.'],
    confusions: [{ confusion: 'Eukaryotic genes are organised in operons.', clarification: 'Operons are not known in eukaryotes (GE slide 74).' }],
  },
  'nucleic-acids-12': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Oncogene: one copy; suppressor: both.', 'p53 = guardian of the genome.', 'HPV → cervical cancer.'],
    confusions: [{ confusion: 'Benign tumours metastasise slowly.', clarification: 'Benign tumours stay confined; only malignant tumours invade and metastasise (GE slides 86, 90).' }],
  },
  'nucleic-acids-13': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Restriction enzymes cut palindromes.', 'YAC holds up to 1 Mb.', 'Insulin made from cDNA.'],
    confusions: [{ confusion: 'Genomic DNA can be expressed directly in bacteria.', clarification: 'cDNA (no introns) is used, as for insulin (RD slides 16, 78).' }],
  },
  'nucleic-acids-14': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['PCR: 95 → anneal → 72 °C.', 'Sickle mutation removes a DdeI site.', 'Somatic, not germ-line, gene therapy.'],
    confusions: [{ confusion: 'Sharing an allele proves paternity.', clarification: 'It makes paternity possible; only exclusion is certain (RD slide 39).' }],
  },
};

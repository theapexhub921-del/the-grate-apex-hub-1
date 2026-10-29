import type { TextbookNotes } from '@/data/textbook-notes/types';

export const notes: TextbookNotes = {
  'nucleic-acids-1': {
    0: "Guyton shows why the purine–pyrimidine pairing matters: adenine on one strand always bonds with thymine on the other, and guanine always with cytosine, through loose hydrogen bonds. Pairing a two-ring base with a one-ring base keeps the helix the same width all along, and the loose bonds let the strands separate for copying.",
    1: "Guyton reduces each DNA nucleotide to three parts, phosphoric acid, deoxyribose and one of four bases, and uses simple symbols for them. RNA is made from ribose nucleotides that first carry two extra phosphates; RNA polymerase removes two of the three, and the energy released joins the remaining phosphate to the growing chain.",
    2: "Guyton highlights the nucleotide as an energy carrier during gene expression: RNA nucleotides are activated with high-energy phosphate bonds taken from ATP before they can be added to RNA, so large amounts of ATP are spent on transcription. The same chapter introduces microRNAs, short single-stranded RNAs of 21–23 nucleotides that regulate gene expression.",
  },
  'nucleic-acids-2': {
    0: "Guyton gives the reason the cell needs a steady nucleotide supply: every mRNA is a long strand of several hundred to several thousand nucleotides, and genes are transcribed continuously. Activating those nucleotides uses ATP, which helps explain why purine synthesis, itself energy-hungry, is tightly regulated.",
  },
  'nucleic-acids-4': {
    1: "Guyton describes cross-talk between the two pathways: purines inhibit their own synthesis but stimulate pyrimidine synthesis, and pyrimidines do the reverse. This keeps the two kinds of base in nearly equal amounts, which is what DNA and RNA synthesis need. It is an example of enzyme regulation, alongside regulation of the genes themselves.",
  },
  'nucleic-acids-5': {
    0: "Guyton adds how the helix is copied: the whole of both strands is replicated, not just pieces as in transcription. DNA polymerase moves along the template adding nucleotides 5′ to 3′, so the leading strand is made continuously and the lagging strand in short pieces, after helicase unwinds the helix at the replication fork and primers give a starting point.",
    1: "Guyton explains why the cell needs RNA as well as DNA: DNA stays in the nucleus while most cell work happens in the cytoplasm, so the code is copied into RNA, which leaves through nuclear pores. Messenger RNA carries the codons, transfer RNA brings amino acids, and ribosomal RNA (about 60% of the ribosome) forms the protein-building machine.",
    3: "Guyton links packaging to gene activity: DNA is wound around histones and held in a compact form, and while it is compact it cannot be transcribed. Mechanisms that loosen chromatin make regions available, so packaging is one way cells decide which genes are read.",
  },
  'nucleic-acids-6': {
    0: "Guyton lists the practical steps at the replication fork: helicase unwinds the helix, primers mark where copying starts, and DNA polymerases extend the new strand only 5′ to 3′. Because of that direction, one strand is made continuously and the other in fragments that DNA ligase joins later.",
    1: "Guyton notes that the same DNA polymerases and ligases are used to proofread: before mitosis, wrongly paired nucleotides are cut out and replaced with the correct complementary ones. This repair means mistakes in copying are rare.",
    3: "Guyton adds numbers on telomere loss: an average cell loses 30–200 base pairs from its telomeres at each division, and in human blood cells telomeres shrink from roughly 8000 base pairs in a newborn to perhaps 1500 in an elderly person. Once they are critically short the chromosomes become unstable and the cell dies; stem and germ cells use telomerase to rebuild them.",
  },
  'nucleic-acids-7': {
    1: "Guyton explains why mutations are uncommon: DNA is proofread and repaired before mitosis, and wrongly placed nucleotides are cut out and replaced. A mistake that slips through is a mutation, which may make an abnormal protein, damage the cell or, rarely, start a cancer.",
  },
  'nucleic-acids-8': {
    1: "Guyton describes transcription in steps: RNA polymerase binds a promoter, unwinds about two turns of the helix, adds activated nucleotides complementary to one DNA strand, and stops at a chain-terminating sequence, releasing the RNA and freeing the polymerase to be reused.",
    2: "Guyton adds the eukaryotic regulators beyond the promoter: transcription factors bound to the promoter recruit RNA polymerase, enhancers far from the gene (even on another chromosome) can boost transcription, and insulators shield genes from neighbouring influences. Each of the 20,000–25,000 genes has at least one such control.",
  },
  'nucleic-acids-9': {
    1: "Guyton stresses the energy cost of building proteins: charging each amino acid onto its tRNA and moving along the ribosome uses four high-energy phosphate bonds per amino acid, so protein synthesis is one of the most energy-consuming activities of the cell. On the rough ER, ribosomes thread new proteins into the reticulum.",
    2: "Guyton's examples make the triplet code concrete: the codons CCG, UCU and GAA specify proline, serine and glutamic acid. Special start (chain-initiating) and stop (chain-terminating) codons mark where reading begins and ends, and tRNA anticodons pair with codons to place each amino acid.",
  },
  'nucleic-acids-10': {
    0: "Guyton frames gene expression as control: every cell has the same genes, but each has feedback mechanisms that set how active each gene is. Cells regulate their chemistry in two ways, by switching genes on or off (genetic regulation) and by activating or inhibiting enzymes (enzyme regulation).",
  },
  'nucleic-acids-11': {
    1: "Guyton explains the effect of chromatin on transcription: wound tightly around histones and held compact by other proteins, DNA cannot be read, and the condensed regions do not uncoil. Unwinding mechanisms, such as the histone changes on the slides, make genes available; in differentiated cells some genes stay permanently repressed.",
    2: "Guyton adds that promoters differ from gene to gene, giving different tissues their own expression patterns, and that enhancers can bind transcription factors at a great distance from the gene. Insulators separate genes from enhancers they should not respond to.",
    3: "Guyton adds RNA interference as a control after transcription: microRNAs processed by Dicer join the RISC complex, which blocks or breaks down matching mRNA. Synthetic short interfering RNAs (siRNAs) use the same route and can be designed to silence any gene whose sequence is known, a possible future treatment.",
  },
  'nucleic-acids-12': {
    1: "Guyton notes that inherited mutations shorten the path to cancer: family members who already carry a mutated gene need fewer further mutations before a cancer grows. He also lists cancer-causing viruses, such as human papillomavirus, hepatitis B and C, Epstein–Barr virus and HTLV.",
    2: "Guyton explains why a single oncogene is rarely enough: several activated oncogenes usually have to be present together, for example one driving rapid division and another bringing in blood vessels. Apoptosis is carried out by caspases, stored as inactive procaspases that activate each other in a cascade once triggered.",
    3: "Guyton connects immortality and cell death: normal cells stop after telomeres shorten, while cancer cells often keep telomerase active. Apoptosis, the cell's orderly self-destruction by caspases with its remains eaten by neighbouring phagocytes, is a defence that cancer cells learn to resist.",
  },
};

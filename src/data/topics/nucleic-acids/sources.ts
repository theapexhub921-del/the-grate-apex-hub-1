// Source references, concepts and discrepancies for Biochemistry → Nucleic
// Acids.
//
// Lecture sources (content-catalog.ts), all by Dr Max Annani-Akollor:
//   NM   = Nucleotide Biosynthesis (Purine and Pyrimidine Metabolism), 2025 — 84 slides
//   NB22 = Nucleotide Biosynthesis, 2022 version — 80 slides (merged with NM;
//          adds nomenclature, ring origins and thymidylate synthesis)
//   NA   = Nucleic Acid Metabolism (Structure and Function), 2025 — 188 slides
//   GE   = Gene Expression and Regulation, 2025 — 121 slides
//   RD   = Recombinant DNA Technology, 2022 — 86 slides
// The practice exam PDF is a study aid, not a source of facts. Speaker
// notes added to the decks are annotations and are not quizzed.
// Picture-only and link-only slides are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'nucleic-acids';

export const nm = (numbers: number[]): SourceReference[] => slides('na-1-nucleotide-metabolism-full-2025-2', numbers);
export const nb = (numbers: number[]): SourceReference[] => slides('na-nucleotide-biosynthesis-full-2022', numbers);
export const na = (numbers: number[]): SourceReference[] => slides('na-2-nucleic-acid-metabolism-meaa-2025', numbers);
export const ge = (numbers: number[]): SourceReference[] => slides('na-3-gene-expression-and-regulation-meaa-2025', numbers);
export const rd = (numbers: number[]): SourceReference[] => slides('na-recombinant-dna-technology-full-2022', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Nucleotides
  'nucleotide-parts': { lessonId: L(1), name: 'Bases, nucleosides and nucleotides', category: 'core', relevance: 'core', sourceRefs: [...na([9, 10, 12, 13, 15, 16, 18, 21, 22]), ...nb([5, 6, 7, 8, 9])] },
  'nucleotide-roles': { lessonId: L(1), name: 'Roles of nucleotides', category: 'core', relevance: 'core', sourceRefs: [...na([25, 26]), ...nb([10, 11])] },
  'nucleotide-drugs': { lessonId: L(1), name: 'Nucleotide metabolism and drugs; modified bases', category: 'supporting', relevance: 'core', sourceRefs: [...na([17, 28]), ...nm([9]), ...nb([12])] },

  // Lesson 2 — De novo purine synthesis
  'purine-de-novo': { lessonId: L(2), name: 'De novo synthesis of IMP', category: 'visual-process', relevance: 'core', sourceRefs: [...nm([8, 11, 12, 13, 17, 18, 19, 20]), ...nb([15, 25])] },
  'amp-gmp': { lessonId: L(2), name: 'Making AMP and GMP; NMP to NTP', category: 'core', relevance: 'core', sourceRefs: [...nm([26, 27, 28]), ...nb([28, 30])] },
  'purine-regulation': { lessonId: L(2), name: 'Regulation of purine synthesis', category: 'core', relevance: 'core', sourceRefs: nm([17, 29, 30, 62]) },

  // Lesson 3 — Purine salvage and degradation
  'purine-salvage': { lessonId: L(3), name: 'Salvage of purine bases', category: 'core', relevance: 'core', sourceRefs: [...nm([22, 24, 25, 33]), ...nb([41])] },
  'purine-degradation': { lessonId: L(3), name: 'Degradation to uric acid', category: 'visual-process', relevance: 'core', sourceRefs: nm([32, 34, 35, 36, 37, 38, 73, 74, 77, 78]) },
  'gout': { lessonId: L(3), name: 'Gout and allopurinol', category: 'clinical', relevance: 'core', sourceRefs: nm([39, 40, 41, 42]) },
  'lesch-nyhan-ada': { lessonId: L(3), name: 'Lesch–Nyhan syndrome and ADA deficiency', category: 'clinical', relevance: 'core', sourceRefs: nm([45, 46, 47]) },

  // Lesson 4 — Pyrimidines and deoxyribonucleotides
  'pyrimidine-de-novo': { lessonId: L(4), name: 'De novo pyrimidine synthesis', category: 'visual-process', relevance: 'core', sourceRefs: nm([49, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61]) },
  'pyrimidine-regulation': { lessonId: L(4), name: 'Regulation of pyrimidine synthesis', category: 'core', relevance: 'core', sourceRefs: nm([54, 62, 68, 69, 70]) },
  'orotic-aciduria': { lessonId: L(4), name: 'Orotic aciduria', category: 'clinical', relevance: 'core', sourceRefs: nm([63, 64]) },
  'deoxyribonucleotides': { lessonId: L(4), name: 'Deoxyribonucleotides, thymidylate and antifolates', category: 'core', relevance: 'core', sourceRefs: [...nm([66]), ...nb([16, 76, 77, 78])] },
  'pyrimidine-degradation': { lessonId: L(4), name: 'Pyrimidine degradation', category: 'supporting', relevance: 'core', sourceRefs: nm([79, 80, 81]) },

  // Lesson 5 — DNA and RNA structure
  'dna-double-helix': { lessonId: L(5), name: 'The DNA double helix and base pairing', category: 'core', relevance: 'core', sourceRefs: na([4, 19, 33, 34, 35, 38, 39]) },
  'dna-rna-differences': { lessonId: L(5), name: 'RNA versus DNA', category: 'core', relevance: 'core', sourceRefs: na([30, 31, 32]) },
  'dna-properties': { lessonId: L(5), name: 'UV absorbance, denaturation and melting', category: 'core', relevance: 'core', sourceRefs: na([41, 42, 43, 45, 47, 48]) },
  'dna-forms-packaging': { lessonId: L(5), name: 'DNA forms, supercoiling and chromatin', category: 'supporting', relevance: 'core', sourceRefs: na([3, 49, 50, 51, 52, 53, 55]) },

  // Lesson 6 — DNA replication
  'replication-rules': { lessonId: L(6), name: 'Semiconservative, bidirectional, semidiscontinuous', category: 'core', relevance: 'core', sourceRefs: na([59, 60, 62, 63, 65, 72, 73]) },
  'replication-machinery': { lessonId: L(6), name: 'Replication in E. coli', category: 'visual-process', relevance: 'core', sourceRefs: na([64, 71, 74, 75, 77, 79, 83]) },
  'eukaryotic-replication': { lessonId: L(6), name: 'Eukaryotic replication and polymerases', category: 'core', relevance: 'core', sourceRefs: na([80, 81, 82, 84]) },
  'telomeres': { lessonId: L(6), name: 'Telomeres and telomerase', category: 'core', relevance: 'core', sourceRefs: na([85, 86, 87]) },

  // Lesson 7 — DNA damage, mutation and repair
  'dna-damage': { lessonId: L(7), name: 'Sources of DNA damage', category: 'core', relevance: 'core', sourceRefs: na([89, 93, 95, 99]) },
  'mutations': { lessonId: L(7), name: 'Mutations: kinds, causes and effects', category: 'core', relevance: 'core', sourceRefs: [...na([90, 91, 94, 96, 97, 98, 104]), ...ge([3])] },
  'dna-repair': { lessonId: L(7), name: 'DNA repair mechanisms', category: 'core', relevance: 'core', sourceRefs: na([105, 108, 109, 110, 111, 112]) },

  // Lesson 8 — RNA and transcription
  'rna-types': { lessonId: L(8), name: 'mRNA, tRNA, rRNA and other RNAs', category: 'core', relevance: 'core', sourceRefs: na([114, 116, 119, 120, 121, 123, 124, 125, 127, 129, 131]) },
  'prokaryotic-transcription': { lessonId: L(8), name: 'Transcription in E. coli', category: 'visual-process', relevance: 'core', sourceRefs: na([115, 132, 133, 134, 136, 137, 140, 142, 145, 146, 147, 148]) },
  'eukaryotic-transcription': { lessonId: L(8), name: 'Eukaryotic RNA polymerases, promoters and processing', category: 'core', relevance: 'core', sourceRefs: [...na([149, 150, 151, 184]), ...ge([5, 6, 7, 14, 15, 18, 22, 75])] },

  // Lesson 9 — Translation and the genetic code
  'trna-charging': { lessonId: L(9), name: 'Aminoacyl-tRNA synthetases', category: 'core', relevance: 'core', sourceRefs: na([152, 153, 154, 155]) },
  'translation-steps': { lessonId: L(9), name: 'Initiation, elongation and termination', category: 'visual-process', relevance: 'core', sourceRefs: [...na([158, 160, 161, 162, 163, 164, 165, 166]), ...ge([11])] },
  'genetic-code': { lessonId: L(9), name: 'The genetic code', category: 'core', relevance: 'core', sourceRefs: na([171, 174, 177, 178, 179, 180]) },

  // Lesson 10 — Gene regulation in bacteria
  'gene-regulation-basics': { lessonId: L(10), name: 'Genes, constitutive and inducible expression', category: 'core', relevance: 'core', sourceRefs: ge([13, 25, 26, 29, 30, 31, 32, 33, 35, 42, 43, 73]) },
  'operon-parts': { lessonId: L(10), name: 'Operons: promoter, operator and regulators', category: 'core', relevance: 'core', sourceRefs: ge([16, 17, 21, 28, 45, 46, 47, 48]) },
  'lac-operon': { lessonId: L(10), name: 'The lac operon', category: 'visual-process', relevance: 'core', sourceRefs: ge([50, 51, 52, 53, 54, 55]) },
  'trp-operon': { lessonId: L(10), name: 'The trp operon and attenuation', category: 'core', relevance: 'core', sourceRefs: [...ge([41, 56, 58]), ...rd([86])] },

  // Lesson 11 — Gene regulation in eukaryotes
  'eukaryotic-control-levels': { lessonId: L(11), name: 'Levels of eukaryotic control', category: 'core', relevance: 'core', sourceRefs: ge([2, 37, 61, 62, 64, 65, 74, 79, 80]) },
  'chromatin-epigenetics': { lessonId: L(11), name: 'Chromatin, methylation and X inactivation', category: 'core', relevance: 'core', sourceRefs: ge([66, 67, 68, 76, 77]) },
  'post-transcriptional': { lessonId: L(11), name: 'Splicing, mRNA stability, translation and protein turnover', category: 'core', relevance: 'core', sourceRefs: ge([5, 6, 69, 70, 71, 72, 78]) },
  'expression-measurement': { lessonId: L(11), name: 'Measuring gene expression', category: 'supporting', relevance: 'supporting', sourceRefs: ge([38, 40]) },

  // Lesson 12 — Cancer genetics
  'cancer-basics': { lessonId: L(12), name: 'Tumours, cancer types and causes', category: 'clinical', relevance: 'core', sourceRefs: ge([85, 86, 87, 90, 91, 92, 93, 95, 96, 98, 109]) },
  'oncogenes-suppressors': { lessonId: L(12), name: 'Oncogenes, tumour suppressors and p53', category: 'clinical', relevance: 'core', sourceRefs: ge([94, 99, 103, 104, 105]) },
  'cancer-hallmarks-death': { lessonId: L(12), name: 'Hallmarks, cell death and treatment', category: 'clinical', relevance: 'core', sourceRefs: ge([100, 108, 111, 112, 113, 115, 118]) },

  // Lesson 13 — Recombinant DNA and cloning
  'rdna-basics': { lessonId: L(13), name: 'Recombinant DNA and restriction enzymes', category: 'core', relevance: 'core', sourceRefs: rd([2, 4, 5, 7]) },
  'vectors': { lessonId: L(13), name: 'Vectors and selecting transformants', category: 'core', relevance: 'core', sourceRefs: rd([8, 9, 10, 13, 14, 15]) },
  'rdna-products': { lessonId: L(13), name: 'Insulin, clotting factors and other products', category: 'core', relevance: 'core', sourceRefs: rd([16, 17, 18, 19, 20, 22, 45, 46, 47]) },
  'libraries': { lessonId: L(13), name: 'Genomic and cDNA libraries', category: 'supporting', relevance: 'core', sourceRefs: rd([77, 78, 79, 80]) },

  // Lesson 14 — PCR, testing, typing and gene therapy
  'pcr': { lessonId: L(14), name: 'The polymerase chain reaction', category: 'visual-process', relevance: 'core', sourceRefs: rd([48, 49, 50, 51, 53, 54, 55, 58]) },
  'genetic-testing': { lessonId: L(14), name: 'DNA molecular testing and RFLPs', category: 'clinical', relevance: 'core', sourceRefs: rd([23, 24, 25, 26, 27, 28, 29, 30, 32, 34]) },
  'dna-typing': { lessonId: L(14), name: 'DNA typing and paternity', category: 'core', relevance: 'core', sourceRefs: rd([35, 37, 38, 39, 40]) },
  'gene-therapy': { lessonId: L(14), name: 'Gene therapy', category: 'clinical', relevance: 'core', sourceRefs: rd([21, 41, 42, 43, 44, 71, 73]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'trna-length',
    concept: 'Length of tRNA',
    status: 'unresolved',
    statements: [
      { text: 'NA slide 125: tRNA is the smallest RNA and “contains up to 1000 nucleotides”.', sourceRefs: na([125]) },
      { text: 'NA slide 152: tRNA molecules are strands about 70–80 bases long.', sourceRefs: na([152]) },
    ],
    note: 'tRNA length is not quizzed.',
  },
  {
    id: 'rrna-length',
    concept: 'Length of rRNA',
    status: 'unresolved',
    statements: [
      { text: 'NA slide 129: rRNA contains about 100–600 nucleotides.', sourceRefs: na([129]) },
      { text: 'NA slides 129 and 131: 16S rRNA has about 1500 nucleotides; 28S about 5070.', sourceRefs: na([129, 131]) },
    ],
    note: 'Overall rRNA length is not quizzed; the named rRNAs of each ribosome are.',
  },
  {
    id: 'enhancer-position',
    concept: 'Where enhancers lie',
    status: 'unresolved',
    statements: [
      { text: 'GE slide 43: enhancers are always upstream of the promoter.', sourceRefs: ge([43]) },
      { text: 'GE slide 65: enhancers occur upstream or downstream of the transcription start site.', sourceRefs: ge([65]) },
    ],
    note: 'Enhancer position is not quizzed; that activators act from far away by DNA looping is.',
  },
  {
    id: 'lac-inducer',
    concept: 'The inducer of the lac operon',
    status: 'unresolved',
    statements: [
      { text: 'GE slides 48 and 54: lactose acts as the inducer, binding the repressor.', sourceRefs: ge([48, 54]) },
      { text: 'GE slide 58: allolactose binds the repressor protein, allowing transcription.', sourceRefs: ge([58]) },
    ],
    note: 'Questions say “lactose (allolactose)” and do not test which one.',
  },
];

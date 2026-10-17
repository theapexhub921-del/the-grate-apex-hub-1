// Source references, concepts and discrepancies for Biochemistry → Amino
// Acid Metabolism.
//
// Lecture sources (content-catalog.ts), all by Dr Max Efui Annani-Akollor (2024):
//   AA1 = Amino Acid Metabolism — 64 slides
//   AA2 = Fate of the Carbon Skeleton in Amino Acid Catabolism — 57 slides
//   AA3 = Transport of Ammonia — 39 slides
//   AA4 = Catabolism of Sulfur-Containing Amino Acids — 44 slides
// The PDFs and the PNG in the folder are study aids, not sources of facts.
// Speaker notes added to the decks are annotations and are not quizzed.
// Picture-only slides are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'amino-acid-metabolism';

export const a1 = (numbers: number[]): SourceReference[] => slides('aa-1-amino-acid-metabolism-maa-2024', numbers);
export const a2 = (numbers: number[]): SourceReference[] => slides('aa-2-fate-of-carbon-skeleton-in-amino-acid-cataboli', numbers);
export const a3 = (numbers: number[]): SourceReference[] => slides('aa-3-transport-of-ammonia-maa-2024', numbers);
export const a4 = (numbers: number[]): SourceReference[] => slides('aa-4-catabolism-of-sulfur-containing-amino-acids-ma', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Amino acid structure and properties
  'aa-structure': { lessonId: L(1), name: 'Structure of an α-amino acid', category: 'core', relevance: 'core', sourceRefs: a1([5, 6, 19, 25]) },
  'aa-ionisation': { lessonId: L(1), name: 'Zwitterions and the isoelectric point', category: 'core', relevance: 'core', sourceRefs: a1([6, 7, 9, 22, 23, 24]) },
  'protein-structure': { lessonId: L(1), name: 'Levels of protein structure', category: 'core', relevance: 'core', sourceRefs: a1([8, 10, 11, 12, 13, 14, 16, 17, 51]) },
  'aa-functions': { lessonId: L(1), name: 'Functions and properties of amino acids', category: 'supporting', relevance: 'supporting', sourceRefs: a1([18, 20, 27, 50]) },

  // Lesson 2 — Classifying amino acids
  'r-group-classes': { lessonId: L(2), name: 'Classes by R group', category: 'core', relevance: 'core', sourceRefs: a1([31, 33, 34, 35, 36, 37, 38, 45]) },
  'essential-aa': { lessonId: L(2), name: 'Essential, non-essential and conditionally essential', category: 'core', relevance: 'core', sourceRefs: a1([39, 40, 44]) },
  'glucogenic-ketogenic': { lessonId: L(2), name: 'Glucogenic and ketogenic amino acids', category: 'core', relevance: 'core', sourceRefs: [...a1([47, 48]), ...a2([10, 12])] },

  // Lesson 3 — General reactions of amino acids
  'protein-digestion': { lessonId: L(3), name: 'Protein digestion and the amino acid pool', category: 'supporting', relevance: 'core', sourceRefs: a1([28, 30]) },
  'decarboxylation': { lessonId: L(3), name: 'Decarboxylation to amines', category: 'core', relevance: 'core', sourceRefs: a1([52, 54, 55]) },
  'transamination': { lessonId: L(3), name: 'Transamination and PLP', category: 'core', relevance: 'core', sourceRefs: [...a1([56, 57, 59]), ...a3([7])] },
  'oxidative-deamination': { lessonId: L(3), name: 'Glutamate dehydrogenase and transdeamination', category: 'core', relevance: 'core', sourceRefs: a1([60, 61, 62]) },

  // Lesson 4 — Ammonia: assimilation, transport and toxicity
  'glu-gln': { lessonId: L(4), name: 'Glutamate, glutamine and their enzymes', category: 'core', relevance: 'core', sourceRefs: a3([4, 5, 8, 10, 11]) },
  'kidney-ammonia': { lessonId: L(4), name: 'Glutamine, the kidney and acidosis', category: 'core', relevance: 'core', sourceRefs: a3([12, 14]) },
  'alanine-glucose': { lessonId: L(4), name: 'The alanine–glucose cycle', category: 'visual-process', relevance: 'core', sourceRefs: a3([15, 18, 19]) },
  'ammonia-toxicity': { lessonId: L(4), name: 'Why ammonia is toxic', category: 'clinical', relevance: 'core', sourceRefs: a3([16, 17]) },
  'nitrogen-excretion': { lessonId: L(4), name: 'Ammonotelic, ureotelic and uricotelic animals', category: 'supporting', relevance: 'supporting', sourceRefs: a3([21]) },

  // Lesson 5 — The urea cycle
  'urea-cycle-steps': { lessonId: L(5), name: 'The five steps of the urea cycle', category: 'visual-process', relevance: 'core', sourceRefs: a3([23, 24, 25, 26]) },
  'urea-cycle-link': { lessonId: L(5), name: 'Link between the urea and citric acid cycles', category: 'core', relevance: 'core', sourceRefs: a3([27]) },
  'urea-regulation': { lessonId: L(5), name: 'Regulation of the urea cycle', category: 'core', relevance: 'core', sourceRefs: a3([24, 33, 34]) },
  'urea-defects': { lessonId: L(5), name: 'Inherited urea cycle defects and hyperammonaemia', category: 'clinical', relevance: 'core', sourceRefs: a3([23, 31]) },

  // Lesson 6 — Branched-chain amino acids and phenylalanine
  'bcaa-catabolism': { lessonId: L(6), name: 'Catabolism of leucine, isoleucine and valine', category: 'visual-process', relevance: 'core', sourceRefs: a2([5, 6, 7, 8, 9, 10, 11]) },
  'msud': { lessonId: L(6), name: 'MSUD, intermittent ketonuria and isovaleric acidaemia', category: 'clinical', relevance: 'core', sourceRefs: a2([11, 14, 16, 17]) },
  'pku': { lessonId: L(6), name: 'Phenylalanine hydroxylase and phenylketonuria', category: 'clinical', relevance: 'core', sourceRefs: a2([18, 19, 20, 21, 22]) },

  // Lesson 7 — Tyrosine, tryptophan, histidine and serine
  'tyrosine-fates': { lessonId: L(7), name: 'Fates of tyrosine and catecholamine synthesis', category: 'core', relevance: 'core', sourceRefs: a2([23, 24, 25, 26, 46, 47]) },
  'tyrosine-disorders': { lessonId: L(7), name: 'Tyrosinaemias, alkaptonuria and albinism', category: 'clinical', relevance: 'core', sourceRefs: a2([27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 40, 44]) },
  'tryptophan': { lessonId: L(7), name: 'Serotonin, melatonin and niacin from tryptophan', category: 'core', relevance: 'core', sourceRefs: a2([49, 50, 51, 52]) },
  'histidine-serine': { lessonId: L(7), name: 'Histidinaemia; serine and glycine', category: 'supporting', relevance: 'core', sourceRefs: a2([42, 53, 54]) },

  // Lesson 8 — Sulfur-containing amino acids
  'methionine': { lessonId: L(8), name: 'Methionine, SAM and trans-sulfuration', category: 'visual-process', relevance: 'core', sourceRefs: a4([5, 6, 8, 9, 10]) },
  'homocystinuria': { lessonId: L(8), name: 'Homocystinuria and cystathioninuria', category: 'clinical', relevance: 'core', sourceRefs: a4([11, 12, 13, 14]) },
  'cysteine': { lessonId: L(8), name: 'Roles and catabolism of cysteine; taurine', category: 'core', relevance: 'core', sourceRefs: a4([15, 16, 17, 18, 19, 20]) },

  // Lesson 9 — One-carbon metabolism
  'one-carbon-carriers': { lessonId: L(9), name: 'Biotin, tetrahydrofolate and SAM', category: 'core', relevance: 'core', sourceRefs: a4([21, 22, 23]) },
  'thf': { lessonId: L(9), name: 'Tetrahydrofolate and the one-carbon pool', category: 'core', relevance: 'core', sourceRefs: a4([25, 32, 33, 34, 35, 37]) },
  'folate-disorders': { lessonId: L(9), name: 'Sulfonamides and disorders of folate metabolism', category: 'clinical', relevance: 'core', sourceRefs: a4([39, 40]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'alkaptonuria-naming',
    concept: 'Homogentisic aciduria and alkaptonuria',
    status: 'unresolved',
    statements: [
      { text: 'AA2 slides 35–36 describe “homogentisic aciduria” (homogentisate 1,2-dioxygenase deficiency) and slides 44–45 “alkaptonuria” (homogentisic acid oxidase), with the same pathway diagram labelled “deficient in alkaptonuria”.', sourceRefs: a2([35, 36, 44, 45]) },
      { text: 'The review questions on AA2 slide 55 say “Alkaptonuria differs from homogentisic aciduria, discuss”.', sourceRefs: a2([55]) },
    ],
    note: 'The lesson presents them together, as the slides’ shared diagram does. Whether they differ is not quizzed.',
  },
  {
    id: 'homocystinuria-pyridoxal',
    concept: 'Diet when cystathionine synthase has low affinity for PLP',
    status: 'unresolved',
    statements: [
      { text: 'AA4 slide 13: “Decreased cystathionine synthase affinity for pyridoxal phosphate: eat more Met”.', sourceRefs: a4([13]) },
      { text: 'The same slide advises restricting methionine for cystathionine synthase deficiency.', sourceRefs: a4([13]) },
    ],
    note: 'A speaker note on the slide suggests “more B6” was meant. Not quizzed.',
  },
];

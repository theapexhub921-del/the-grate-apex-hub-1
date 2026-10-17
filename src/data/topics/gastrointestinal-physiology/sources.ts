// Source references, concepts and discrepancies for Physiology →
// Gastrointestinal Physiology.
//
// Lecture source: "Digestive System" — one deck of 217 slides (DS in
// content-catalog.ts). Speaker notes added to some slides (explanations,
// a mnemonic and web links) are annotations: they are not used as sources
// of facts or quizzed. Slides that are only pictures are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'gastrointestinal-physiology';

export const ds = (numbers: number[]): SourceReference[] => slides('gi-digestive-system', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Organisation
  'gi-functions': { lessonId: L(1), name: 'Functions and components of the digestive system', category: 'core', relevance: 'core', sourceRefs: ds([1, 2, 3, 4]) },
  'gut-wall': { lessonId: L(1), name: 'The four layers of the gut wall', category: 'core', relevance: 'core', sourceRefs: ds([6, 7, 8, 9, 10]) },
  'digestive-processes': { lessonId: L(1), name: 'The five digestive processes', category: 'core', relevance: 'core', sourceRefs: ds([12, 13, 14, 15]) },

  // Lesson 2 — Digestion and absorption of nutrients
  'carbohydrate-digestion': { lessonId: L(2), name: 'Digestion of carbohydrate', category: 'core', relevance: 'core', sourceRefs: ds([16, 17, 18]) },
  'carbohydrate-absorption': { lessonId: L(2), name: 'Absorption of monosaccharides', category: 'core', relevance: 'core', sourceRefs: ds([21]) },
  'protein-digestion': { lessonId: L(2), name: 'Digestion of protein', category: 'core', relevance: 'core', sourceRefs: ds([23, 24, 25]) },
  'protein-absorption': { lessonId: L(2), name: 'Absorption of peptides and amino acids', category: 'core', relevance: 'core', sourceRefs: ds([27, 28]) },
  'lipid-digestion': { lessonId: L(2), name: 'Digestion of lipid', category: 'core', relevance: 'core', sourceRefs: ds([30, 31, 32]) },
  'lipid-absorption': { lessonId: L(2), name: 'Micelles, chylomicrons and lacteals', category: 'visual-process', relevance: 'core', sourceRefs: ds([32, 33, 34]) },

  // Lesson 3 — Water, electrolytes, minerals and vitamins
  'water-absorption': { lessonId: L(3), name: 'Absorption of water', category: 'core', relevance: 'core', sourceRefs: ds([36, 37, 38]) },
  'sodium-absorption': { lessonId: L(3), name: 'Absorption of Na⁺, Cl⁻ and HCO₃⁻', category: 'core', relevance: 'core', sourceRefs: ds([41, 42, 43, 45, 46]) },
  'calcium-absorption': { lessonId: L(3), name: 'Absorption of calcium', category: 'core', relevance: 'core', sourceRefs: ds([47, 48]) },
  'iron-absorption': { lessonId: L(3), name: 'Absorption of iron', category: 'visual-process', relevance: 'core', sourceRefs: ds([51, 52, 53]) },
  'vitamin-absorption': { lessonId: L(3), name: 'Absorption of vitamins and B12', category: 'core', relevance: 'core', sourceRefs: ds([55]) },

  // Lesson 4 — Saliva and gastric juice
  'gi-secretion': { lessonId: L(4), name: 'Secretion in the GI tract', category: 'core', relevance: 'core', sourceRefs: ds([56]) },
  'saliva': { lessonId: L(4), name: 'Salivary glands, saliva and its formation', category: 'core', relevance: 'core', sourceRefs: ds([58, 59, 61, 62, 63, 65, 66]) },
  'saliva-control': { lessonId: L(4), name: 'Control of salivation', category: 'core', relevance: 'core', sourceRefs: ds([63, 117, 118, 119, 120]) },
  'gastric-mucus': { lessonId: L(4), name: 'Gastric juice and mucus', category: 'core', relevance: 'core', sourceRefs: ds([67, 69, 70]) },
  'gastric-acid': { lessonId: L(4), name: 'HCl secretion by the parietal cell', category: 'visual-process', relevance: 'core', sourceRefs: ds([70, 71, 72]) },
  'gastric-other': { lessonId: L(4), name: 'Intrinsic factor, enzymes and gastrin', category: 'core', relevance: 'core', sourceRefs: ds([74, 75, 76]) },

  // Lesson 5 — Pancreatic and intestinal secretion
  'pancreas-structure': { lessonId: L(5), name: 'The exocrine pancreas', category: 'core', relevance: 'core', sourceRefs: ds([76, 77, 78]) },
  'pancreatic-enzymes': { lessonId: L(5), name: 'Pancreatic enzymes', category: 'core', relevance: 'core', sourceRefs: ds([80, 81, 82, 83]) },
  'pancreatic-bicarbonate': { lessonId: L(5), name: 'Pancreatic bicarbonate secretion', category: 'core', relevance: 'core', sourceRefs: ds([83, 84, 85, 86]) },
  'pancreas-control': { lessonId: L(5), name: 'Phases of pancreatic secretion', category: 'core', relevance: 'core', sourceRefs: ds([121, 122, 123, 124, 125, 126, 127]) },
  'intestinal-secretion': { lessonId: L(5), name: 'Secretion by the small and large intestine', category: 'core', relevance: 'core', sourceRefs: ds([87, 88, 89, 90, 92, 93]) },

  // Lesson 6 — Control of the gut
  'gi-control': { lessonId: L(6), name: 'Endocrine and paracrine control; GI peptides', category: 'core', relevance: 'core', sourceRefs: ds([94, 95, 96, 97]) },
  'neural-control': { lessonId: L(6), name: 'Long and short reflexes', category: 'core', relevance: 'core', sourceRefs: ds([99, 100]) },
  'enteric-nervous-system': { lessonId: L(6), name: 'The enteric nervous system', category: 'core', relevance: 'core', sourceRefs: ds([103, 104, 105, 106]) },
  'extrinsic-nerves': { lessonId: L(6), name: 'Parasympathetic and sympathetic supply', category: 'core', relevance: 'core', sourceRefs: ds([107, 108, 109]) },
  'gastric-phases': { lessonId: L(6), name: 'Cephalic, gastric and intestinal phases of gastric secretion', category: 'visual-process', relevance: 'core', sourceRefs: ds([110, 111, 112, 113, 114, 115]) },

  // Lesson 7 — Motility I
  'gi-smooth-muscle': { lessonId: L(7), name: 'GI smooth muscle and slow waves', category: 'core', relevance: 'core', sourceRefs: ds([128, 129, 131, 132, 134]) },
  'motility-types': { lessonId: L(7), name: 'Peristalsis and segmentation', category: 'core', relevance: 'core', sourceRefs: ds([135, 136, 137]) },
  'swallowing': { lessonId: L(7), name: 'Swallowing and its control', category: 'visual-process', relevance: 'core', sourceRefs: ds([139, 140, 141, 142, 143, 144, 145, 146]) },
  'gastric-motility': { lessonId: L(7), name: 'Gastric motility, emptying and their control', category: 'core', relevance: 'core', sourceRefs: ds([148, 150, 151, 152, 153, 156, 157, 158, 159, 160, 161, 162, 163]) },

  // Lesson 8 — Motility II
  'small-intestine-motility': { lessonId: L(8), name: 'Small intestinal motility and the MMC', category: 'core', relevance: 'core', sourceRefs: ds([163, 164, 165]) },
  'colon': { lessonId: L(8), name: 'The large intestine and its motility', category: 'core', relevance: 'core', sourceRefs: ds([165, 166, 167, 169, 170, 171, 172, 173]) },
  'defecation': { lessonId: L(8), name: 'Defecation', category: 'visual-process', relevance: 'core', sourceRefs: ds([174, 175, 179, 180, 181, 182]) },
  'vomiting': { lessonId: L(8), name: 'Vomiting and its control', category: 'core', relevance: 'core', sourceRefs: ds([184, 185, 186, 188, 189, 190, 191]) },

  // Lesson 9 — Liver and bile
  'liver': { lessonId: L(9), name: 'Structure and functions of the liver', category: 'core', relevance: 'core', sourceRefs: ds([193, 195, 196, 199]) },
  'bile': { lessonId: L(9), name: 'Bile: composition, production and the gallbladder', category: 'core', relevance: 'core', sourceRefs: ds([200, 201, 202, 203, 204]) },
  'bile-secretion': { lessonId: L(9), name: 'Functions and control of bile secretion', category: 'core', relevance: 'core', sourceRefs: ds([207, 208, 209]) },
  'jaundice': { lessonId: L(9), name: 'Jaundice', category: 'clinical', relevance: 'core', sourceRefs: ds([211, 212, 213, 214, 215, 216, 217]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'secretin-target',
    concept: 'Which pancreatic cells secretin acts on',
    status: 'unresolved',
    statements: [
      { text: 'Slide 83: secretin “binding to its receptor on the acinar cells and activating adenylate cyclase and increasing cAMP levels in the ductal cell”.', sourceRefs: ds([83, 84]) },
      { text: 'Slide 125: secretin “stimulates bicarbonate and water release from pancreatic duct cells”.', sourceRefs: ds([125]) },
    ],
    note: 'The quiz uses slide 125: secretin acts on duct cells to release bicarbonate and water.',
  },
  {
    id: 'lipid-digestion-site',
    concept: 'Where lipid digestion happens',
    status: 'unresolved',
    statements: [
      { text: 'Slide 30: lipid digestion occurs mainly in the stomach and small intestine.', sourceRefs: ds([30]) },
      { text: 'Slide 31: lingual and gastric lipase only initiate it; pancreatic lipases hydrolyse most dietary lipid.', sourceRefs: ds([31]) },
    ],
    note: 'The quiz asks only that pancreatic lipase digests most dietary fat.',
  },
];

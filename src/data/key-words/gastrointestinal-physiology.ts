import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'gastrointestinal-physiology-3': [
    { term: 'Osmosis', meaning: 'How water moves in the gut: it follows the osmotic gradient made by absorbed sodium.' },
    { term: 'Oral rehydration therapy', meaning: 'Based on glucose-coupled sodium absorption.' },
    { term: 'Calbindin', meaning: 'Carries calcium across the intestinal cell; made under vitamin D.' },
    { term: 'Ferritin', meaning: 'The cell’s store of iron.' },
    { term: 'Hepcidin', meaning: 'A liver hormone that blocks iron absorption and release from stores.' },
    { term: 'Intrinsic factor', meaning: 'Binds vitamin B12 so it can be taken up in the lower ileum.' },
  ],
  'gastrointestinal-physiology-5': [
    { term: 'Exocrine', meaning: 'Secreting into a duct: the part of the pancreas that makes pancreatic juice.' },
    { term: 'Acinar cells', meaning: 'Pancreatic cells that secrete the digestive enzymes.' },
    { term: 'Proenzymes', meaning: 'Inactive forms (like trypsinogen) so the enzymes cannot digest the pancreas.' },
    { term: 'Enterokinase', meaning: 'A duodenal enzyme that turns trypsinogen into trypsin.' },
    { term: 'Secretin', meaning: 'Released by acid chyme; makes duct cells secrete bicarbonate and water.' },
    { term: 'CCK', meaning: 'Released by fat and peptides; makes acinar cells secrete enzymes.' },
  ],
  'gastrointestinal-physiology-7': [
    { term: 'Slow waves', meaning: 'The gut’s basic electrical rhythm, set by the interstitial cells of Cajal.' },
    { term: 'Interstitial cells of Cajal', meaning: 'Pacemaker cells that make the slow waves.' },
    { term: 'Peristalsis', meaning: 'Waves of contraction that push contents along the gut.' },
    { term: 'Segmentation', meaning: 'Localised contractions that mix contents back and forth.' },
    { term: 'Receptive relaxation', meaning: 'The stomach relaxing as food is swallowed.' },
    { term: 'Migrating motor complex', meaning: 'MMC: contractions that sweep residue along between meals.' },
  ],
  'gastrointestinal-physiology-8': [
    { term: 'Haustra', meaning: 'The pouches of the colon, gathered by the shorter taeniae coli.' },
    { term: 'Taeniae coli', meaning: 'The three bands of longitudinal muscle on the colon.' },
    { term: 'Mass movements', meaning: 'Strong waves that clear a segment of colon, 3–4 times a day.' },
    { term: 'Gastrocolic reflex', meaning: 'Food in the stomach increasing colonic motility.' },
    { term: 'Defecation', meaning: 'Emptying the rectum, controlled by the internal and external anal sphincters.' },
    { term: 'Chemoreceptor trigger zone', meaning: 'CTZ: senses drugs and toxins and triggers vomiting.' },
  ],
  'gastrointestinal-physiology-9': [
    { term: 'Hepatocytes', meaning: 'The liver cells, in plates radiating from a central vein.' },
    { term: 'Sinusoids', meaning: 'Liver channels receiving blood from the hepatic artery and portal vein.' },
    { term: 'Bile salts', meaning: 'Bile acids conjugated with glycine or taurine: detergents that emulsify fat.' },
    { term: 'Gallbladder', meaning: 'Stores bile and concentrates it about five-fold.' },
    { term: 'Enterohepatic', meaning: 'The circulation returning bile salts from the gut to the liver.' },
    { term: 'Jaundice', meaning: 'Yellowing from raised blood bilirubin: pre-hepatic, hepatic or post-hepatic.' },
  ],
};

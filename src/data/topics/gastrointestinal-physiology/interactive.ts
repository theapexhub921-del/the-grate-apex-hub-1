// Physiology → Gastrointestinal Physiology — layer 1 (learn by answering)
// and reading extras. Checkpoint IDs: cN-xx; recall prompts: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { ds, type ConceptId } from '@/data/topics/gastrointestinal-physiology/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'gastrointestinal-physiology-1': [
    ask(mcq('c1-01', 'gi-functions', 'Which is an accessory digestive organ rather than part of the GI tract?', 'The pancreas', ['The duodenum', 'The oesophagus', 'The caecum'], { explanation: 'Slide 4: teeth, tongue, salivary glands, liver, gallbladder, pancreas.' })),
    learn('The wall', ['Mucosa → submucosa (Meissner’s plexus) → muscularis externa (circular, then longitudinal, with Auerbach’s plexus between) → serosa.'], { sourceRefs: ds([6, 9]) }),
    ask(match('c1-02', 'gut-wall', 'Match each structure to its layer.', [
      ['Meissner’s plexus', 'Submucosa'],
      ['Auerbach’s plexus', 'Between the muscle layers of the muscularis externa'],
      ['Lamina propria', 'Mucosa'],
      ['Serous fluid', 'Serosa'],
    ], { explanation: 'Slides 7–10.' })),
    ask(mcq('c1-03', 'gut-wall', 'Which layer gives the gut its distensibility and elasticity?', 'The submucosa', ['The serosa', 'The muscularis mucosae', 'The epithelium'], { explanation: 'Slide 9.' })),
    ask(mcq('c1-04', 'digestive-processes', 'Transfer of small digested units from the gut into blood or lymph is…', 'Absorption', ['Digestion', 'Secretion', 'Elimination'], { explanation: 'Slide 14.', skill: 'terminology' })),
    recall('r1-01', 'gut-wall', 'Describe the four layers of the gut wall, from inside out.', [
      'Mucosa: epithelium, lamina propria (with lymphoid tissue) and muscularis mucosae.',
      'Submucosa: thick connective tissue with large vessels and the submucosal (Meissner’s) plexus.',
      'Muscularis externa: inner circular and outer longitudinal smooth muscle with the myenteric (Auerbach’s) plexus between.',
      'Serosa: outer connective tissue secreting serous fluid.',
    ], ds([6, 7, 8, 9, 10])),
  ],

  'gastrointestinal-physiology-2': [
    ask(mcq('c2-01', 'carbohydrate-digestion', 'Why does starch digestion stop in the stomach?', 'Acid inactivates salivary amylase', ['The stomach absorbs starch', 'Pepsin digests starch', 'Bile is absent'], { explanation: 'Slide 17.', skill: 'cause-effect' })),
    learn('Sugar transporters', ['Glucose and galactose enter by SGLT1 (with Na⁺); fructose by GLUT5; all leave by GLUT2.'], { sourceRefs: ds([21]) }),
    ask(match('c2-02', 'carbohydrate-absorption', 'Match each transporter to its job.', [
      ['SGLT1', 'Glucose and galactose in, with Na⁺'],
      ['GLUT5', 'Fructose in'],
      ['GLUT2', 'Monosaccharides out of the basolateral side'],
    ], { explanation: 'Slide 21.' })),
    ask(order('c2-03', 'protein-digestion', 'Order the activation of pancreatic proteases.', ['Enterokinase from the duodenal mucosa', 'Trypsinogen → trypsin', 'Trypsin activates chymotrypsinogen and procarboxypeptidase'], { explanation: 'Slides 24–25.' })),
    learn('Fat needs bile', ['Bile acids emulsify fat into small droplets so water-soluble pancreatic lipase, held on by colipase, can reach it.'], { sourceRefs: ds([30, 31]) }),
    ask(mcq('c2-04', 'lipid-absorption', 'Why do chylomicrons enter lacteals rather than blood capillaries?', 'They are too large to pass the capillary basement membrane', ['Lacteals actively pump them', 'Blood capillaries are absent in villi', 'They are water-soluble'], { explanation: 'Slides 33–34.', skill: 'cause-effect' })),
    recall('r2-01', 'lipid-absorption', 'Trace a dietary triglyceride from the duodenum into the lymph.', [
      'Bile acids emulsify fat into small droplets.',
      'Pancreatic lipase (with colipase) splits triglyceride into free fatty acids and monoglycerides.',
      'These form micelles with bile salts, cholesterol and phospholipids, which carry them to the brush border, where they diffuse in.',
      'In the smooth ER they are remade into triglycerides, coated with protein as chylomicrons, released by exocytosis and taken up by lacteals.',
    ], ds([30, 31, 32, 33, 34])),
  ],

  'gastrointestinal-physiology-3': [
    ask(mcq('c3-01', 'water-absorption', 'Where is most of the water entering the gut absorbed?', 'The small intestine (about 90%)', ['The stomach', 'The colon', 'The oesophagus'], { explanation: 'Slide 36.' })),
    learn('Water follows sodium', ['Active Na⁺ transport into the lateral spaces creates the osmotic gradient; Cl⁻ and water follow.'], { sourceRefs: ds([37, 38]) }),
    ask(mcq('c3-02', 'sodium-absorption', 'Why does a solution of glucose and salt treat dehydration from diarrhoea?', 'Glucose is absorbed with Na⁺ by SGLT1, and water follows', ['Glucose blocks secretion', 'Salt kills bacteria', 'Glucose is absorbed in the colon'], { explanation: 'Slides 42–43: oral rehydration therapy.', skill: 'application', clinical: true })),
    ask(order('c3-03', 'iron-absorption', 'Order the steps of non-haem iron absorption.', ['Ferrireductase reduces Fe³⁺ to Fe²⁺', 'DMT-1 carries Fe²⁺ into the enterocyte', 'Ferroportin exports Fe²⁺', 'Hephaestin oxidises it', 'Transferrin carries it in plasma'], { explanation: 'Slides 51–53.' })),
    ask(mcq('c3-04', 'iron-absorption', 'What does hepcidin do?', 'Blocks intestinal iron absorption and release from stores', ['Increases iron absorption', 'Carries iron in plasma', 'Reduces Fe³⁺ to Fe²⁺'], { explanation: 'Slide 53.' })),
    ask(mcq('c3-05', 'vitamin-absorption', 'A patient has had the terminal ileum removed. Which vitamin will they fail to absorb?', 'Vitamin B12', ['Vitamin C', 'Folate', 'Vitamin B1'], { explanation: 'Slide 55: B12–intrinsic factor is taken up in the lower ileum.', skill: 'application', clinical: true })),
    recall('r3-01', 'calcium-absorption', 'Describe transcellular calcium absorption and how it depends on vitamin D and calcium intake.', [
      'In the duodenum and upper jejunum Ca²⁺ enters across the brush border through CaT1/TRPV6.',
      'Calbindin (CaBP) carries it across the cell.',
      'It leaves by Ca-ATPase (PMCA), Na⁺/Ca²⁺ exchange or exocytosis.',
      'CaBP is fully, and CaT1 about 90%, vitamin D–dependent; the route matters most when intake is low and is down-regulated when intake is high.',
    ], ds([47, 48])),
  ],

  'gastrointestinal-physiology-4': [
    ask(mcq('c4-01', 'saliva', 'Why is final saliva hypotonic?', 'Ducts remove Na⁺ and Cl⁻ but are impermeable to water', ['Acini secrete pure water', 'Ducts add water', 'Saliva contains no electrolytes'], { explanation: 'Slide 63.', skill: 'cause-effect' })),
    learn('Salivation is purely neural', ['Taste (sour most strongly) → salivatory nuclei → parasympathetic (copious, watery) and sympathetic (sparse, protein-rich). Both increase saliva.'], { sourceRefs: ds([117, 118]) }),
    ask(mcq('c4-02', 'saliva-control', 'Which nerve carries parasympathetic fibres to the parotid gland, through the otic ganglion?', 'Glossopharyngeal (IX)', ['Facial (VII)', 'Vagus (X)', 'Trigeminal (V)'], { explanation: 'Slide 118.' })),
    ask(order('c4-03', 'gastric-acid', 'Order the steps of acid secretion in the parietal cell.', ['Carbonic anhydrase makes HCO₃⁻ from CO₂', 'HCO₃⁻ leaves in exchange for Cl⁻ (alkaline tide)', 'Cl⁻ enters the canaliculus', 'H⁺/K⁺-ATPase pumps H⁺ into the lumen'], { explanation: 'Slides 71–72.' })),
    ask(mcq('c4-04', 'gastric-acid', 'Why does blood leaving the stomach after a meal become slightly alkaline?', 'Parietal cells release HCO₃⁻ into the blood — the alkaline tide', ['The stomach absorbs bicarbonate from food', 'Gastrin is alkaline', 'Mucus enters the blood'], { explanation: 'Slide 71.', skill: 'cause-effect' })),
    ask(match('c4-05', 'gastric-other', 'Match each gastric cell to its product.', [
      ['Parietal cell', 'HCl and intrinsic factor'],
      ['Chief cell', 'Pepsinogen and gastric lipase'],
      ['G cell', 'Gastrin'],
      ['Mucous neck cell', 'Mucins'],
    ], { explanation: 'Slides 69–75.' })),
    recall('r4-01', 'saliva', 'Explain the two stages of saliva formation.', [
      'Primary stage: acinar cells load Cl⁻ by the basolateral Na⁺-K⁺-2Cl⁻ co-transporter and release it through apical Cl⁻ channels when Ca²⁺ rises.',
      'Na⁺ follows between the cells and water follows the NaCl: primary saliva is isotonic.',
      'Modification stage: duct cells reabsorb Na⁺ (and Cl⁻) and secrete K⁺ and HCO₃⁻.',
      'The ducts are impermeable to water, so final saliva is hypotonic.',
    ], ds([61, 62, 63])),
  ],

  'gastrointestinal-physiology-5': [
    ask(mcq('c5-01', 'pancreatic-enzymes', 'Why are pancreatic proteases secreted as inactive proenzymes?', 'So they do not digest the pancreas itself', ['Because they need bile to fold', 'Because the pancreas is acidic', 'Because they act only in the colon'], { explanation: 'Slide 81.', skill: 'cause-effect' })),
    learn('Two hormones, two products', ['Acid in the duodenum → secretin → bicarbonate and water from duct cells. Fat and peptides → CCK → enzymes from acinar cells.'], { sourceRefs: ds([125, 126]) }),
    ask(mcq('c5-02', 'pancreas-control', 'Acid chyme enters the duodenum. Which hormone mainly responds, and what does the pancreas secrete?', 'Secretin — bicarbonate and water', ['CCK — enzymes', 'Gastrin — acid', 'Motilin — mucus'], { explanation: 'Slide 125.', skill: 'application' })),
    ask(mcq('c5-03', 'pancreas-control', 'In which phase is most pancreatic juice secreted?', 'Intestinal (50–80%)', ['Cephalic', 'Gastric', 'Interdigestive'], { explanation: 'Slide 124.' })),
    ask(mcq('c5-04', 'intestinal-secretion', 'What is the main driving force for fluid secretion by crypt enterocytes?', 'Transcellular Cl⁻ secretion through CFTR', ['Active water pumping', 'Glucose secretion', 'HCO₃⁻ reabsorption'], { explanation: 'Slide 89.' })),
    recall('r5-01', 'pancreatic-bicarbonate', 'Explain how pancreatic duct cells secrete bicarbonate.', [
      'Secretin (cAMP) and ACh (Ca²⁺) open luminal Cl⁻ channels, so Cl⁻ enters the lumen.',
      'A luminal Cl⁻/HCO₃⁻ antiport exchanges it for HCO₃⁻; CFTR also passes HCO₃⁻.',
      'HCO₃⁻ comes from CO₂ + water (carbonic anhydrase) and from a basolateral Na⁺–HCO₃⁻ co-transporter; H⁺ is removed basolaterally.',
      'Na⁺ and water follow between the cells: a large volume of HCO₃⁻-rich fluid.',
    ], ds([84, 85, 86])),
  ],

  'gastrointestinal-physiology-6': [
    ask(mcq('c6-01', 'enteric-nervous-system', 'Which plexus mainly controls gut motility?', 'The myenteric (Auerbach’s) plexus', ['The submucosal (Meissner’s) plexus', 'The coeliac plexus', 'The pelvic plexus'], { explanation: 'Slide 104.' })),
    learn('Two divisions', ['Parasympathetic (vagus, pelvic nerves) increases motility and secretion and relaxes sphincters. Sympathetic (T5–L2) inhibits them and contracts sphincters and vessels.'], { sourceRefs: ds([107, 108]) }),
    ask(mcq('c6-02', 'extrinsic-nerves', 'What does sympathetic stimulation do to the gut?', 'Inhibits secretion and motility; contracts sphincters', ['Increases secretion and motility', 'Relaxes sphincters', 'Has no effect'], { explanation: 'Slide 108.' })),
    ask(order('c6-03', 'gastric-phases', 'Order the phases of gastric secretion.', ['Cephalic', 'Gastric', 'Intestinal'], { explanation: 'Slide 110.' })),
    ask(mcq('c6-04', 'gastric-phases', 'Which phase produces most of the acid secreted with a meal?', 'The gastric phase (about 70%)', ['The cephalic phase', 'The intestinal phase', 'All equally'], { explanation: 'Slide 113.' })),
    ask(mcq('c6-05', 'gastric-phases', 'How does fat in the duodenum reduce gastric acid secretion?', 'It releases GIP and CCK, which inhibit parietal cells', ['It releases gastrin', 'It stimulates the vagus', 'It neutralises acid directly'], { explanation: 'Slide 115.', skill: 'cause-effect' })),
    recall('r6-01', 'gastric-phases', 'Describe the cephalic, gastric and intestinal phases of gastric secretion.', [
      'Cephalic: sight, smell, taste or thought of food → vagus → ACh stimulates parietal cells directly and via gastrin and histamine; up to ~40% of maximum.',
      'Gastric: distension (vagovagal and local reflexes) and protein products release gastrin; ~70% of meal-related acid.',
      'Intestinal: early stimulation by duodenal gastrin; later inhibition by the enterogastric reflex, secretin (acid) and GIP and CCK (fat).',
    ], ds([110, 111, 112, 113, 114, 115])),
  ],

  'gastrointestinal-physiology-7': [
    ask(mcq('c7-01', 'gi-smooth-muscle', 'Which cells generate the slow waves of the gut?', 'Interstitial cells of Cajal', ['Enterochromaffin cells', 'Chief cells', 'Kupffer cells'], { explanation: 'Slide 131.' })),
    learn('Slow waves set the pace', ['Slow waves bring the muscle near threshold; only when spikes fire on top of them does it contract. Stretch and ACh depolarise; noradrenaline hyperpolarises.'], { sourceRefs: ds([131, 132]) }),
    ask(mcq('c7-02', 'motility-types', 'Which movement mixes chyme by moving it back and forth?', 'Segmentation', ['Peristalsis', 'Mass movement', 'Receptive relaxation'], { explanation: 'Slide 137.' })),
    ask(order('c7-03', 'swallowing', 'Order the phases of swallowing.', ['Oral preparatory', 'Oral propulsive', 'Pharyngeal', 'Oesophageal'], { explanation: 'Slides 139–144.' })),
    ask(mcq('c7-04', 'swallowing', 'During the pharyngeal phase, what stops food entering the nose?', 'The soft palate rises against the posterior pharyngeal wall', ['The epiglottis', 'The upper oesophageal sphincter', 'The tongue'], { explanation: 'Slide 142.' })),
    ask(mcq('c7-05', 'gastric-motility', 'What is receptive relaxation?', 'Relaxation of the orad stomach as food is swallowed', ['Relaxation of the pylorus during emptying', 'Relaxation of the colon after a meal', 'Relaxation of the anal sphincter'], { explanation: 'Slide 150.', skill: 'terminology' })),
    recall('r7-01', 'gastric-motility', 'Explain how the proximal and distal stomach divide the work of storing, mixing and emptying.', [
      'Proximal stomach (cardia, fundus, body) is the reservoir: thin muscle, weak tonic contractions, receptive and adaptive relaxation (NANC: NO, VIP, PACAP, ATP).',
      'Distal stomach (antrum, pylorus) is the pump: thick muscle, phasic peristaltic waves that grow stronger towards the closed pylorus, grinding food into chyme.',
      'Emptying happens when peristaltic pressure exceeds pyloric closing pressure; acid or fat in the duodenum delays it.',
    ], ds([150, 151, 152, 153])),
  ],

  'gastrointestinal-physiology-8': [
    ask(mcq('c8-01', 'small-intestine-motility', 'Which hormone elicits the migrating motor complex?', 'Motilin', ['Gastrin', 'CCK', 'Secretin'], { explanation: 'Slide 165.' })),
    learn('The colon’s shape', ['Three taeniae coli, shorter than the colon, gather it into haustra.'], { sourceRefs: ds([167]) }),
    ask(mcq('c8-02', 'colon', 'Why does a person often need to defecate soon after breakfast?', 'The gastrocolic reflex triggers mass movements', ['The MMC starts after meals', 'Breakfast relaxes the external sphincter', 'Haustral contractions stop'], { explanation: 'Slides 172–173.', skill: 'application' })),
    ask(mcq('c8-03', 'defecation', 'What does the defecation reflex itself produce?', 'The urge to defecate', ['Automatic defecation', 'Contraction of the internal sphincter', 'Vomiting'], { explanation: 'Slide 179.' })),
    ask(mcq('c8-04', 'vomiting', 'Where is the chemoreceptor trigger zone?', 'The area postrema in the floor of the fourth ventricle', ['The hypothalamus', 'The stomach wall', 'The cerebellum'], { explanation: 'Slide 188.' })),
    ask(order('c8-05', 'vomiting', 'Order the stages of vomiting.', ['Nausea', 'Retching', 'Emesis'], { explanation: 'Slide 184.' })),
    recall('r8-01', 'defecation', 'Describe how defecation happens, including the sphincters and reflexes involved.', [
      'A mass movement fills the rectum; rising pressure triggers the defecation reflex: the rectum contracts and the internal anal sphincter relaxes, giving the urge.',
      'The external anal sphincter (skeletal, pudendal nerve) is under voluntary control; if it stays shut, reverse peristalsis relieves the urge.',
      'A parasympathetic sacral reflex (pelvic nerves) strengthens the weak enteric reflex.',
      'To defecate, the external sphincter and puborectalis relax; rectal peristalsis and the Valsalva manoeuvre expel the faeces.',
    ], ds([174, 175, 179, 180, 181, 182])),
  ],

  'gastrointestinal-physiology-9': [
    ask(mcq('c9-01', 'liver', 'Which two vessels supply the hepatic sinusoids?', 'The hepatic artery and portal vein', ['The hepatic vein and portal vein', 'The coeliac and splenic arteries', 'The central vein and hepatic artery'], { explanation: 'Slides 195–196.' })),
    learn('Bile acids to bile salts', ['Cholic and chenodeoxycholic acids are conjugated with glycine or taurine to make bile salts, which are better detergents.'], { sourceRefs: ds([201, 202]) }),
    ask(mcq('c9-02', 'bile-secretion', 'A fatty meal reaches the duodenum. Which hormone empties the gallbladder?', 'CCK', ['Secretin', 'Gastrin', 'Motilin'], { explanation: 'Slides 208–209: CCK contracts the gallbladder and relaxes the sphincter of Oddi.', skill: 'application' })),
    ask(mcq('c9-03', 'bile', 'Why do pigment gallstones form more readily in the gallbladder?', 'It concentrates Ca²⁺ and bilirubin, so calcium bilirubinate precipitates', ['It secretes bilirubin', 'It makes bile alkaline', 'It absorbs all bile salts'], { explanation: 'Slide 204.', skill: 'cause-effect' })),
    ask(mcq('c9-04', 'jaundice', 'A patient with sickle cell crisis becomes jaundiced with high unconjugated bilirubin. Which type?', 'Pre-hepatic', ['Hepatic', 'Post-hepatic', 'Obstructive'], { explanation: 'Slides 213–214: haemolysis overwhelms the liver.', skill: 'application', clinical: true })),
    recall('r9-01', 'jaundice', 'Classify jaundice by where the problem lies, with the bilirubin type and two causes of each.', [
      'Pre-hepatic: excess haemolysis overwhelms the liver; unconjugated bilirubin; e.g. malaria, sickle cell, G6PD deficiency.',
      'Hepatic: faulty metabolism or excretion in the liver; unconjugated and/or conjugated; e.g. hepatitis, cirrhosis, Gilbert’s syndrome.',
      'Post-hepatic: obstruction to bile drainage; conjugated; e.g. gallstones in the common bile duct, pancreatic cancer.',
    ], ds([213, 214, 215, 216])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'gastrointestinal-physiology-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Meissner’s plexus in the submucosa; Auerbach’s between the muscle layers.', 'GI tract ~7 m.', 'Five processes: motility, secretion, digestion, absorption, elimination.'],
    confusions: [{ confusion: 'Auerbach’s plexus is in the submucosa.', clarification: 'Auerbach’s (myenteric) is between the circular and longitudinal muscle; Meissner’s is in the submucosa (slide 9).' }],
  },
  'gastrointestinal-physiology-2': {
    estimatedMinutes: 14,
    xp: 25,
    highYield: ['SGLT1 (glucose, galactose, with Na⁺), GLUT5 (fructose), GLUT2 (out).', 'Enterokinase → trypsin → activates the rest.', 'Chylomicrons → lacteals.'],
    confusions: [{ confusion: 'Most protein is digested in the stomach.', clarification: 'Pepsin digests only 10–15%; pancreatic proteases and brush border peptidases do most (slides 23–25).' }],
  },
  'gastrointestinal-physiology-3': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['~90% of water absorbed in the small intestine.', 'Iron: DMT-1 in, ferroportin out; hepcidin blocks.', 'B12 + intrinsic factor → lower ileum.'],
    confusions: [{ confusion: 'The colon absorbs most of the water.', clarification: 'The small intestine absorbs about 90%; the colon absorbs most of the rest (slide 36).' }],
  },
  'gastrointestinal-physiology-4': {
    estimatedMinutes: 14,
    xp: 25,
    highYield: ['Final saliva is hypotonic.', 'Parietal cell: H⁺/K⁺-ATPase; alkaline tide.', 'Intrinsic factor from parietal cells; pepsinogen from chief cells.'],
    confusions: [{ confusion: 'Sympathetic stimulation stops salivation.', clarification: 'Both divisions increase saliva; sympathetic saliva is sparse and protein-rich (slide 117).' }],
  },
  'gastrointestinal-physiology-5': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Secretin → HCO₃⁻ and water; CCK → enzymes.', 'Intestinal phase: 50–80% of pancreatic secretion.', 'Intestinal fluid secretion: Cl⁻ through CFTR.'],
    confusions: [{ confusion: 'Intestinal juice contains digestive enzymes.', clarification: 'Small intestinal enzymes act in the brush border; none are secreted into the juice (slide 90).' }],
  },
  'gastrointestinal-physiology-6': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Myenteric: motility; submucosal: secretion.', 'Gastric phase: ~70% of meal-related acid.', 'Enterogastric reflex, secretin, GIP and CCK inhibit gastric secretion.'],
    confusions: [{ confusion: 'The cephalic phase produces most gastric acid.', clarification: 'It reaches about 40% of maximum rate; the gastric phase produces about 70% of meal-related acid (slides 111–113).' }],
  },
  'gastrointestinal-physiology-7': {
    estimatedMinutes: 14,
    xp: 25,
    highYield: ['Interstitial cells of Cajal: slow waves.', 'Pharyngeal phase ~1 s; oesophageal < 10 s.', 'Proximal stomach stores; distal stomach mixes and empties.'],
    confusions: [{ confusion: 'Every slow wave causes a contraction.', clarification: 'Only slow waves that reach threshold and fire spikes cause contraction (slide 131).' }],
  },
  'gastrointestinal-physiology-8': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['MMC: motilin; abolished by meals.', 'Mass movements 3–4 times a day; gastrocolic reflex.', 'Vomiting centre (medulla) and CTZ (area postrema).'],
    confusions: [{ confusion: 'The defecation reflex empties the rectum automatically.', clarification: 'It produces the urge; voluntary relaxation of the external sphincter is needed (slide 179).' }],
  },
  'gastrointestinal-physiology-9': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Bile salts = bile acids conjugated with glycine or taurine.', 'CCK contracts the gallbladder; secretin adds HCO₃⁻.', 'Pre-hepatic jaundice: unconjugated; post-hepatic: conjugated.'],
    confusions: [{ confusion: 'Hepatic bile and gallbladder bile have different components.', clarification: 'The components are the same; only the concentration differs (slide 203).' }],
  },
};

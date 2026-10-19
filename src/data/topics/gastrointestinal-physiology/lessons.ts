// Physiology → Gastrointestinal Physiology — the nine lessons (reading
// layer). Source: the "Digestive System" lecture deck (ds in sources.ts).
import type { LessonDraft } from '@/data/topics/build';
import { ds, type ConceptId } from '@/data/topics/gastrointestinal-physiology/sources';
import { interactive, readingExtras } from '@/data/topics/gastrointestinal-physiology/interactive';
import { withSimulation } from '@/data/topics/gastrointestinal-physiology/simulations';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'gastrointestinal-physiology-1',
  title: 'Organisation of the Digestive System',
  description: 'What the digestive system does, the GI tract and accessory organs, the four layers of the gut wall and the five digestive processes.',
  xp: 25,
  sourceRefs: ds([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15]),
  objectives: [
    'List the functions and components of the digestive system',
    'Name the parts of the GI tract and the accessory organs',
    'Describe the four layers of the gut wall and the two nerve plexuses',
    'Define the five digestive processes',
  ],
  chunks: [
    {
      title: 'What the digestive system does',
      kind: 'overview',
      paragraphs: [
        'The digestive system converts food into nutrients that are absorbed, and eliminates unused waste (slide 1). Its functions:',
      ],
      steps: [
        { label: 'Processing and storing food' },
        { label: 'Manufacture', detail: 'Enzymes, HCl, intrinsic factor and mucus; vitamin K and some B vitamins in the large intestine (by bacteria).' },
        { label: 'Absorption', detail: 'From the small intestine into capillaries.' },
        { label: 'Reabsorption and elimination', detail: 'Water, minerals and vitamins reabsorbed; faeces formed and defecated.' },
      ],
      sourceRefs: ds([1, 2]),
    },
    {
      title: 'Tract and accessory organs',
      kind: 'structure',
      paragraphs: [
        'The GI tract (alimentary canal) is a continuous tube about 7 m long from mouth to anus: mouth, pharynx, oesophagus, stomach, small intestine (duodenum, jejunum, ileum), large intestine (caecum, appendix, colon, rectum) and anus (slide 3).',
        'The accessory organs, mostly outside the tract and mostly exocrine glands, are the teeth, tongue, salivary glands, liver, gallbladder and pancreas (slide 4).',
      ],
      sourceRefs: ds([2, 3, 4]),
    },
    {
      title: 'The gut wall',
      kind: 'structure',
      paragraphs: ['The whole tract has the same basic four-layered wall, with regional variations (slide 6):'],
      table: {
        columns: ['Layer', 'What it is'],
        rows: [
          ['Mucosa (innermost, folded)', 'Epithelium (usually columnar, rich in mucus cells, with exocrine and endocrine glands); lamina propria (connective tissue with vessels, nerves and gut-associated lymphoid tissue); muscularis mucosae (thin smooth muscle)'],
          ['Submucosa', 'Thick connective tissue giving distensibility; large blood and lymph vessels; the submucosal (Meissner’s) plexus'],
          ['Muscularis externa', 'The main smooth muscle: inner circular and outer longitudinal layers, with the myenteric (Auerbach’s) plexus between them'],
          ['Serosa', 'Outer connective tissue that secretes serous fluid to prevent friction; continuous with the mesentery'],
        ],
      },
      sourceRefs: ds([6, 7, 8, 9, 10]),
    },
    {
      title: 'Five digestive processes',
      kind: 'definitions',
      terms: [
        { term: 'Mechanical processing and motility', meaning: 'Chewing, and smooth muscle contractions that mix (mixing movements) and propel (propulsive movements) food along.' },
        { term: 'Secretion', meaning: 'Digestive juices — water, electrolytes, enzymes, bile salts, acid and mucus — released by exocrine glands under neural and hormonal control.' },
        { term: 'Digestion', meaning: 'Breaking complex food into small absorbable units, mechanically and chemically.' },
        { term: 'Absorption', meaning: 'Moving those units into blood or lymph, mainly in the small intestine, together with water, electrolytes and vitamins.' },
        { term: 'Elimination', meaning: 'Undigested material and bile pigments leave through the anus as faeces.' },
      ],
      sourceRefs: ds([12, 13, 14, 15]),
    },
  ],
  summary: [
    'GI tract ~7 m: mouth → pharynx → oesophagus → stomach → small intestine → large intestine → anus.',
    'Accessory organs: teeth, tongue, salivary glands, liver, gallbladder, pancreas.',
    'Wall: mucosa (epithelium, lamina propria, muscularis mucosae), submucosa (Meissner’s plexus), muscularis externa (circular + longitudinal with Auerbach’s plexus), serosa.',
    'Processes: motility, secretion, digestion, absorption, elimination.',
  ],
};

const lesson2: Draft = {
  id: 'gastrointestinal-physiology-2',
  title: 'Digestion and Absorption of Nutrients',
  description: 'How carbohydrate, protein and fat are broken down and absorbed — the enzymes, transporters, micelles and chylomicrons.',
  xp: 25,
  sourceRefs: ds([16, 17, 18, 21, 23, 24, 25, 27, 28, 30, 31, 32, 33, 34]),
  objectives: [
    'Trace carbohydrate digestion from mouth to brush border',
    'Name the transporters that absorb glucose, galactose and fructose',
    'Describe protein digestion by pepsin, pancreatic proteases and peptidases, and how they are activated',
    'Explain how peptides and amino acids are absorbed',
    'Explain emulsification and the action of pancreatic lipase and colipase',
    'Trace lipid absorption through micelles, chylomicrons and lacteals',
  ],
  chunks: [
    {
      title: 'Carbohydrate: digestion',
      kind: 'pathway',
      paragraphs: [
        'Dietary carbohydrate is plant starch (amylopectin), animal starch (glycogen), disaccharides (sucrose, maltose, lactose), monosaccharides (glucose, fructose, galactose) and cellulose, which our enzymes cannot digest. Only monosaccharides can be absorbed (slides 16–17).',
      ],
      steps: [
        { label: 'Mouth', detail: 'Salivary amylase starts breaking starch into maltose.' },
        { label: 'Stomach', detail: 'Acid inactivates salivary amylase; no further carbohydrate digestion.' },
        { label: 'Duodenum', detail: 'Pancreatic amylase completes starch digestion to oligosaccharides within about 10 minutes — maltose and short branched glucose chains.' },
        { label: 'Brush border', detail: 'Lactase (lactose → glucose + galactose), sucrase (sucrose → glucose + fructose), α-dextrinase (debranches α-limit dextrins), maltase (maltose → glucose).' },
      ],
      keyPoints: ['Lack of lactase causes lactose intolerance (slide 18).'],
      sourceRefs: ds([16, 17, 18]),
    },
    {
      title: 'Carbohydrate: absorption',
      kind: 'mechanism',
      paragraphs: ['The duodenum and upper jejunum absorb sugars best (slide 21).'],
      table: {
        columns: ['Sugar', 'Into the cell (brush border)', 'Out of the cell (basolateral)'],
        rows: [
          ['Glucose, galactose', 'SGLT1 — Na⁺-powered secondary active transport', 'GLUT2 — facilitated diffusion'],
          ['Fructose', 'GLUT5 — facilitated diffusion', 'GLUT2'],
        ],
      },
      sourceRefs: ds([21]),
    },
    {
      title: 'Protein: digestion',
      kind: 'pathway',
      paragraphs: ['Digested protein includes dietary protein, secreted enzymes and protein from sloughed mucosal cells (slide 23).'],
      steps: [
        { label: 'Stomach', detail: 'Chief cells secrete pepsinogens, converted to pepsins by acid. Pepsins work best at pH 1.5–2.5 and digest 10–15% of dietary protein; they are inactivated by the high pH of the duodenum.' },
        { label: 'Activation in the duodenum', detail: 'Enteropeptidase (enterokinase) from the duodenal and jejunal mucosa converts trypsinogen to trypsin; trypsin activates more trypsinogen, chymotrypsinogen and procarboxypeptidases.' },
        { label: 'Pancreatic proteases', detail: 'Trypsin, chymotrypsin, carboxypeptidase.' },
        { label: 'Brush border peptidases', detail: 'Finish the job: small peptides and single amino acids.' },
      ],
      sourceRefs: ds([23, 24, 25]),
    },
    {
      title: 'Protein: absorption',
      kind: 'mechanism',
      paragraphs: [
        'Di- and tripeptides are absorbed faster than single amino acids, by a single broad-specificity transporter coupled to an H⁺ gradient (secondary active transport), then hydrolysed to amino acids inside the cell. Amino acids enter by transporters that may or may not depend on Na⁺, and leave across the basolateral membrane by facilitated diffusion. Some intact proteins and large peptides are taken up by endocytosis and exocytosis (slides 27–28).',
      ],
      sourceRefs: ds([27, 28]),
    },
    {
      title: 'Lipid: digestion',
      kind: 'mechanism',
      paragraphs: [
        'Most dietary lipid is triglyceride, with some cholesterol, sterol esters and phospholipids. Insoluble in water, lipids clump into large droplets, and only the surface is reachable by water-soluble lipases (slide 30).',
        'In the duodenum bile acids emulsify the fat into small coated droplets with a large surface area (slides 30–31). Lingual and gastric lipase start digestion, but pancreatic lipases do most of it:',
      ],
      terms: [
        { term: 'Pancreatic lipase', meaning: 'Cleaves two fatty acids from a triglyceride, leaving free fatty acids and a monoglyceride.' },
        { term: 'Colipase', meaning: 'Essential for pancreatic lipase: binds it and holds it on the surface of the oil droplet.' },
        { term: 'Cholesterol esterase', meaning: 'Splits cholesterol ester into a fatty acid and free cholesterol.' },
      ],
      sourceRefs: ds([30, 31, 32]),
    },
    {
      title: 'Lipid: absorption',
      kind: 'pathway',
      steps: [
        { label: 'Micelles', detail: 'Bile salts, fatty acids, monoglycerides, cholesterol and phospholipids cluster together and diffuse among the microvilli, keeping the fluid at the brush border saturated.' },
        { label: 'Entry', detail: 'The contents diffuse across the brush border membrane (with some specific transporters).' },
        { label: 'Smooth ER', detail: 'Reassembled into triglycerides and phospholipids.' },
        { label: 'Chylomicrons', detail: 'Lipid droplets coated with protein, packaged in the Golgi and released by exocytosis.' },
        { label: 'Lacteals', detail: 'Too big for blood capillaries, chylomicrons enter the lacteals and leave in the lymph.' },
      ],
      keyPoints: ['Lipid absorption is complete by the middle of the jejunum (slide 34).'],
      sourceRefs: ds([32, 33, 34]),
    },
  ],
  summary: [
    'Carbohydrate: salivary amylase → (stopped by acid) → pancreatic amylase → brush border lactase, sucrase, maltase, α-dextrinase.',
    'Glucose and galactose in by SGLT1 (Na⁺); fructose by GLUT5; all out by GLUT2.',
    'Protein: pepsin (pH 1.5–2.5, 10–15%) → enterokinase activates trypsin → trypsin activates the rest → brush border peptidases.',
    'Di/tripeptides absorbed with H⁺, faster than amino acids.',
    'Fat: bile emulsifies; pancreatic lipase + colipase → fatty acids + monoglycerides → micelles → chylomicrons → lacteals.',
  ],
};

const lesson3: Draft = {
  id: 'gastrointestinal-physiology-3',
  title: 'Absorption of Water, Electrolytes, Minerals and Vitamins',
  description: 'How the intestine absorbs water, sodium, chloride and bicarbonate, calcium, iron and vitamins, including vitamin B12.',
  xp: 25,
  sourceRefs: ds([36, 37, 38, 41, 42, 43, 45, 46, 47, 48, 51, 52, 53, 55]),
  objectives: [
    'Account for the water entering and leaving the gut each day',
    'Explain how water follows sodium',
    'Describe the routes of Na⁺ absorption along the small intestine',
    'Describe transcellular calcium absorption and the role of vitamin D',
    'Trace iron absorption and its control by hepcidin',
    'Explain how vitamin B12 is absorbed',
  ],
  chunks: [
    {
      title: 'Water',
      kind: 'mechanism',
      paragraphs: [
        'About 2 L of water is drunk and about 7 L secreted into the gut each day. About 90% is absorbed in the small intestine; only 50–150 mL is lost in faeces, the rest being absorbed by the colon (slide 36).',
        'Water moves entirely by osmosis, freely in both directions. Hypertonic chyme from the stomach is made isotonic in the duodenum within minutes, with little net absorption there. In the jejunum and ileum water follows the osmotic gradient created by nutrient absorption — above all by active Na⁺ transport into the lateral spaces, with Cl⁻ following (slides 36–38).',
      ],
      sourceRefs: ds([36, 37, 38]),
    },
    {
      title: 'Sodium, chloride and bicarbonate',
      kind: 'mechanism',
      paragraphs: [
        'Na⁺ is absorbed along the whole small intestine, more proximally than distally. It enters down its electrochemical gradient and is pumped out by the basolateral Na⁺/K⁺-ATPase — so it is absorbed even without a concentration gradient, since luminal Na⁺ is about the same as plasma (slide 41).',
      ],
      table: {
        columns: ['Route', 'Where'],
        rows: [
          ['SGLT1 and Na⁺–amino acid transporters', 'Jejunum — where Na⁺ absorption is fastest'],
          ['Na⁺/H⁺ exchanger', 'Ileum and colon — the main active route in the ileum'],
          ['Passive, paracellular', 'Throughout, greatest in the leaky duodenum'],
        ],
      },
      keyPoints: [
        'Glucose-coupled Na⁺ absorption is the basis of oral rehydration therapy (slide 43).',
        'Coupled Na⁺/H⁺ and Cl⁻/HCO₃⁻ exchange: secreted H⁺ meets HCO₃⁻ → H₂CO₃ → CO₂ + water, and CO₂ diffuses into the blood. The ileum and colon secrete HCO₃⁻ when luminal HCO₃⁻ is below about 40–45 mM and absorb it above that (slides 45–46).',
      ],
      sourceRefs: ds([41, 42, 43, 45, 46]),
    },
    {
      title: 'Calcium',
      kind: 'mechanism',
      paragraphs: ['Calcium is absorbed by two routes (slides 47–48):'],
      steps: [
        { label: 'Transcellular, active (duodenum and upper jejunum)', detail: 'Entry by CaT1/TRPV6 → carried across the cell by calbindin (CaBP) → extruded by Ca-ATPase (PMCA), Na⁺/Ca²⁺ exchange or exocytosis.' },
        { label: 'Paracellular, passive (whole intestine)' },
      ],
      keyPoints: [
        'Transcellular transport matters most when calcium intake is low; with high intake CaT1 and CaBP are down-regulated and it contributes little.',
        'CaBP synthesis is fully, and CaT1 function about 90%, vitamin D–dependent (slide 48).',
      ],
      sourceRefs: ds([47, 48]),
    },
    {
      title: 'Iron',
      kind: 'pathway',
      paragraphs: [
        'Iron absorption is regulated by the body’s needs — more in deficiency, less in overload. Dietary iron is haem iron (meat, poultry, fish) or non-haem iron (cereals, pulses, fruit, vegetables). It is absorbed in the proximal duodenum, best in an acid environment (slide 51).',
      ],
      steps: [
        { label: 'Reduction', detail: 'Brush border ferrireductase reduces Fe³⁺ to Fe²⁺.' },
        { label: 'Entry', detail: 'Fe²⁺ enters by DMT-1 (which carries other divalent metals too); haem enters by facilitated diffusion and its iron is released.' },
        { label: 'In the cell', detail: 'Stored as ferritin (lost when the cell is shed) or carried through.' },
        { label: 'Exit', detail: 'Ferroportin 1 exports Fe²⁺; hephaestin oxidises it so it can bind plasma transferrin.' },
      ],
      keyPoints: ['Hepcidin, a peptide hormone from the liver, blocks intestinal iron absorption and the release of iron from stores (slide 53).'],
      sourceRefs: ds([51, 52, 53]),
    },
    {
      title: 'Vitamins',
      kind: 'mechanism',
      paragraphs: [
        'Fat-soluble vitamins (A, D, E, K) follow the fat absorption pathway. Water-soluble vitamins (C and B complex) are absorbed by diffusion or mediated transport — except B12 (slide 55).',
        'Vitamin B12 is large and charged. It binds intrinsic factor from the stomach’s acid-secreting cells, and the complex is taken up in the lower ileum by receptor-mediated endocytosis. A little B12 is absorbed passively throughout the small intestine.',
      ],
      sourceRefs: ds([55]),
    },
  ],
  summary: [
    '~9 L/day enters the gut (2 L drunk + 7 L secretions); ~90% absorbed in the small intestine; 50–150 mL lost in faeces.',
    'Water follows Na⁺ by osmosis; Na⁺ pumped out by the basolateral Na⁺/K⁺-ATPase.',
    'Na⁺ entry: SGLT1 and amino acid transporters (jejunum), Na⁺/H⁺ exchange (ileum, colon), paracellular (duodenum).',
    'Ca²⁺: TRPV6 → calbindin → PMCA (vitamin D–dependent, duodenum) plus paracellular.',
    'Fe: ferrireductase → DMT-1 → ferritin or ferroportin → hephaestin → transferrin; hepcidin blocks absorption.',
    'B12 + intrinsic factor → terminal ileum by endocytosis.',
  ],
};

const lesson4: Draft = {
  id: 'gastrointestinal-physiology-4',
  title: 'Saliva and Gastric Juice',
  description: 'The salivary glands and how saliva is made and controlled, and the mucus, acid, intrinsic factor, enzymes and gastrin of the stomach.',
  xp: 25,
  sourceRefs: ds([56, 58, 59, 61, 62, 63, 65, 66, 67, 69, 70, 71, 72, 74, 75, 76, 117, 118, 119, 120]),
  objectives: [
    'State the daily volume of GI secretions and their sources',
    'Describe the two stages of saliva formation and why final saliva is hypotonic',
    'List the functions and composition of saliva',
    'Explain the neural control of salivation',
    'Describe gastric mucus and how the parietal cell secretes HCl',
    'Describe intrinsic factor, pepsinogen, gastric lipase and gastrin',
  ],
  chunks: [
    {
      title: 'Secretion overall',
      kind: 'overview',
      paragraphs: [
        'About 9 L of fluid passes through the GI tract daily, only about 2 L of it drunk. About half the secretion (3.5 L) comes from accessory organs, half from the tract’s own epithelium, and nearly all is absorbed. Secretion is triggered by neurocrine, endocrine and paracrine substances called secretagogues (slide 56).',
      ],
      sourceRefs: ds([56]),
    },
    {
      title: 'Salivary glands',
      kind: 'structure',
      paragraphs: [
        'Three major pairs — parotid, submandibular and sublingual — plus many small buccal glands make saliva. Each gland is made of acini draining into intercalated ducts, then salivary ducts. Serous acini have zymogen granules with salivary amylase; mucous acini secrete mucins (slides 58–59).',
      ],
      sourceRefs: ds([58, 59]),
    },
    {
      title: 'Making saliva',
      kind: 'pathway',
      steps: [
        { label: 'Primary stage — acini', detail: 'Autonomic stimulation raises intracellular Ca²⁺, opening apical Cl⁻ channels. Cl⁻ (loaded by the basolateral Na⁺-K⁺-2Cl⁻ co-transporter) enters the lumen; Na⁺ follows between the cells, and water follows the NaCl. Primary saliva is isotonic and plasma-like.' },
        { label: 'Modification stage — ducts', detail: 'Duct cells actively reabsorb Na⁺ and secrete K⁺ (more Na⁺ out than K⁺ in, so Cl⁻ follows passively) and secrete HCO₃⁻. The ducts are impermeable to water, so final saliva is hypotonic.' },
      ],
      sourceRefs: ds([61, 62, 63]),
    },
    {
      title: 'What saliva does and contains',
      kind: 'definitions',
      table: {
        columns: ['Functions', 'Composition'],
        rows: [
          ['Cleans the mouth', 'Water, 97–99.5%'],
          ['Moistens and dissolves food', 'Electrolytes: Na⁺, K⁺, Cl⁻, HCO₃⁻'],
          ['Contains enzymes', 'Salivary amylase and lingual lipase'],
          ['Lubricates the mouth for speech', 'Mucin'],
          ['Helps control water balance', 'Antimicrobials: a cyanide compound, lysozyme, IgA'],
          ['Reduces decay and infection by removing debris and bacteria', 'Wastes: urea and uric acid'],
        ],
      },
      sourceRefs: ds([65, 66]),
    },
    {
      title: 'Control of salivation',
      kind: 'regulation',
      paragraphs: [
        'Salivation is purely neural — a reflex through the superior and inferior salivatory nuclei in the medulla. Taste is the main stimulus (sour most strongly), with touch, smell and sight; afferents run in the facial (VII) and glossopharyngeal (IX) nerves (slides 117–118).',
      ],
      table: {
        columns: ['', 'Parasympathetic', 'Sympathetic'],
        rows: [
          ['Pathway', 'VII via the submandibular ganglion (submandibular, sublingual); IX via the otic ganglion (parotid)', 'From the cervical sympathetic ganglion'],
          ['Saliva', 'Copious, protein-poor, with marked vasodilatation', 'Sparse, protein-rich'],
          ['Transmitter and pathway', 'ACh, via IP₃ (with co-transmitters substance P, VIP, NO)', 'Noradrenaline, via cAMP'],
        ],
      },
      keyPoints: ['Both divisions increase salivation (slide 117).'],
      sourceRefs: ds([63, 117, 118, 119, 120]),
    },
    {
      title: 'Gastric mucus',
      kind: 'mechanism',
      paragraphs: [
        'Gastric juice is a mixture of mucus, HCl, intrinsic factor and enzymes; the main gastric hormone is gastrin (slide 67).',
        'Mucus is 5% mucins (large glycoproteins) and 95% water, with electrolytes and some immunoglobulin. Mucous neck cells and surface cells release it by exocytosis. It forms a sticky gel that resists acid and enzymes and is rich in HCO₃⁻, which neutralises acid; failure of this barrier leads to gastric ulcer (slides 69–70).',
      ],
      sourceRefs: ds([67, 69, 70]),
    },
    {
      title: 'How the parietal cell makes acid',
      kind: 'pathway',
      paragraphs: [
        'HCl kills swallowed pathogens, helps solubilise food and activates pepsinogen. Parietal (oxyntic) cells in the gastric pits make it; capacity is roughly proportional to parietal cell number, and their secretion has about 3 million times the H⁺ concentration of blood (slide 70).',
      ],
      steps: [
        { label: 'H⁺ from water', detail: 'H⁺ is generated by dissociation of water inside the cell.' },
        { label: 'OH⁻ + CO₂ → HCO₃⁻', detail: 'Catalysed by carbonic anhydrase, with CO₂ from plasma.' },
        { label: 'HCO₃⁻ out, Cl⁻ in', detail: 'Basolateral HCO₃⁻/Cl⁻ exchange. HCO₃⁻ in the blood causes the “alkaline tide”.' },
        { label: 'Into the canaliculus', detail: 'Cl⁻ and K⁺ leave through channels; the H⁺/K⁺-ATPase (proton pump) swaps H⁺ out for K⁺ in, recycling K⁺.' },
        { label: 'HCl', detail: 'Pure secretion has pH about 0.8; gastric pH is 1.5–3.5.' },
      ],
      sourceRefs: ds([70, 71, 72]),
    },
    {
      title: 'Intrinsic factor, enzymes and gastrin',
      kind: 'definitions',
      terms: [
        { term: 'Intrinsic factor', meaning: 'Glycoprotein from parietal cells needed for B12 absorption; stimulated by histamine, gastrin and ACh. Its loss causes pernicious anaemia.' },
        { term: 'Pepsinogen and gastric lipase', meaning: 'From chief cells; pepsinogen is activated to pepsin by HCl.' },
        { term: 'Gastrin', meaning: 'From G cells at the bottom of the gastric pits. Increases acid, pancreatic juice, bile and gastric motility. Released by vagal activity, amino acids in the stomach and stretch of the stomach wall.' },
      ],
      sourceRefs: ds([74, 75, 76]),
    },
  ],
  summary: [
    '~9 L/day through the gut; half the secretions from accessory organs, half from the tract.',
    'Saliva: isotonic primary secretion from acini → ducts reabsorb Na⁺/Cl⁻, secrete K⁺/HCO₃⁻, impermeable to water → hypotonic.',
    'Salivation is purely neural: taste (sour) → salivatory nuclei → parasympathetic (copious, watery, ACh/IP₃) and sympathetic (scant, protein-rich, NA/cAMP).',
    'Mucus: mucin gel with HCO₃⁻.',
    'Parietal cell: carbonic anhydrase; HCO₃⁻/Cl⁻ exchange (alkaline tide); H⁺/K⁺-ATPase.',
    'Intrinsic factor (parietal), pepsinogen and lipase (chief), gastrin (G cells).',
  ],
};

const lesson5: Draft = {
  id: 'gastrointestinal-physiology-5',
  title: 'Pancreatic and Intestinal Secretion',
  description: 'The exocrine pancreas, its enzymes and bicarbonate, the phases of pancreatic secretion, and the secretions of the small and large intestine.',
  xp: 25,
  sourceRefs: ds([76, 77, 78, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 121, 122, 123, 124, 125, 126, 127]),
  objectives: [
    'Describe the structure of the exocrine pancreas',
    'List the pancreatic enzymes and explain how proteases are kept inactive',
    'Explain how duct cells secrete bicarbonate',
    'Describe the cephalic, gastric and intestinal phases of pancreatic secretion and the roles of secretin and CCK',
    'Describe the secretions of the small intestine and how chloride drives them',
    'Describe secretion by the large intestine',
  ],
  chunks: [
    {
      title: 'The exocrine pancreas',
      kind: 'structure',
      paragraphs: [
        'The pancreas has exocrine tissue (pancreatic juice) and endocrine islets (insulin, glucagon). The exocrine part is a compound acinar gland, like the parotid, made of acinar and duct cells. Each acinus is a ring of serous, protein-secreting cells around a tiny lumen; pale centroacinar cells start the intercalated duct, which joins intralobular ducts lined by columnar epithelium. Zymogen granules are most numerous after fasting (slides 76–78).',
      ],
      sourceRefs: ds([76, 77, 78]),
    },
    {
      title: 'Pancreatic enzymes',
      kind: 'classification',
      paragraphs: ['Pancreatic juice has two products: enzymes from acinar cells and bicarbonate from duct cells (slide 80).'],
      table: {
        columns: ['Group', 'Enzymes'],
        rows: [
          ['Proteases', 'Trypsin, chymotrypsin, carboxypeptidase, elastase — secreted as inactive proenzymes (trypsinogen, chymotrypsinogen, procarboxypeptidase) so they cannot digest the pancreas'],
          ['Lipases', 'Pancreatic lipase, phospholipase, cholesterol esterase'],
          ['Amylase', 'Pancreatic amylase digests carbohydrate'],
        ],
      },
      keyPoints: ['Activation starts with duodenal enterokinase converting trypsinogen to trypsin, which activates the rest (slide 82).'],
      sourceRefs: ds([80, 81, 82, 83]),
    },
    {
      title: 'Bicarbonate',
      kind: 'mechanism',
      paragraphs: [
        'Acinar cells secrete a small volume of isotonic NaCl-rich fluid; duct cells (mainly intercalated and small intralobular ducts) secrete most of the fluid and the HCO₃⁻ (slide 83).',
      ],
      steps: [
        { label: 'Signal', detail: 'Secretin raises cAMP; ACh raises Ca²⁺.' },
        { label: 'Cl⁻ channels open', detail: 'Luminal Cl⁻ channels (and basolateral K⁺ channels) open; Cl⁻ enters the lumen.' },
        { label: 'Exchange', detail: 'A Cl⁻/HCO₃⁻ antiport swaps luminal Cl⁻ for HCO₃⁻; CFTR also passes HCO₃⁻.' },
        { label: 'Supplying HCO₃⁻', detail: 'From CO₂ + water (carbonic anhydrase) and by a basolateral Na⁺–HCO₃⁻ co-transporter; H⁺ is removed by basolateral Na⁺/H⁺ exchange and an H⁺-ATPase.' },
        { label: 'Na⁺ and water follow', detail: 'Between the cells.' },
      ],
      notes: [{ kind: 'check', text: 'Slide 83 says secretin binds receptors “on the acinar cells” but raises cAMP “in the ductal cell”; slide 125 says it acts on duct cells.' }],
      sourceRefs: ds([83, 84, 85, 86]),
    },
    {
      title: 'Three phases of pancreatic secretion',
      kind: 'regulation',
      table: {
        columns: ['Phase', 'Share', 'Trigger and control'],
        rows: [
          ['Cephalic', '20–25%', 'Sight, smell, taste, chewing (and long-chain fatty acids in the mouth) → dorsal vagal complex → vagus → ACh; peptides such as VIP and GRP may contribute'],
          ['Gastric', '~10%', 'Gastric distension and peptides in the antrum → vagovagal and antropancreatic reflexes, gastrin; mainly enzymes with little HCO₃⁻'],
          ['Intestinal', '50–80%', 'Acid chyme → secretin from S cells → HCO₃⁻ and water from duct cells. Peptides and fatty acids → CCK from I cells → enzymes from acinar cells. Each hormone potentiates the other; vagovagal and enteropancreatic reflexes (M1, M3 receptors) amplify'],
        ],
      },
      sourceRefs: ds([121, 122, 123, 124, 125, 126, 127]),
    },
    {
      title: 'Small intestinal secretion',
      kind: 'mechanism',
      paragraphs: [
        'Brunner’s glands secrete mucus that protects the duodenum from acid. In the crypts of Lieberkühn, goblet cells secrete mucus and enterocytes secrete nearly 2 L/day of fluid like ECF (slides 87–88).',
        'Fluid secretion is driven by Cl⁻: the basolateral Na⁺-K⁺-2Cl⁻ carrier (1:1:2) loads the cell with Cl⁻, which leaves through apical CFTR channels; Na⁺ and water follow passively. The Na⁺ pump and basolateral K⁺ channels recycle Na⁺ and K⁺. Ca²⁺, cAMP and cGMP regulate the transporters — the basis of cholera toxin’s effect (slides 89–90).',
        'No enzymes are secreted into intestinal juice: the small intestine’s enzymes work in the brush border membrane (slide 90).',
      ],
      sourceRefs: ds([87, 88, 89, 90]),
    },
    {
      title: 'Large intestinal secretion',
      kind: 'mechanism',
      paragraphs: [
        'Colonic glands secrete mostly mucus, which lubricates the stool, protects the mucosa and probably limits bacterial overgrowth; it carries some HCO₃⁻. Acid from bacteria is removed by Cl⁻/HCO₃⁻ and Na⁺/H⁺ exchange. When irritated, the colon can secrete large amounts of water and electrolytes to wash the irritant away (slides 92–93).',
      ],
      sourceRefs: ds([92, 93]),
    },
  ],
  summary: [
    'Exocrine pancreas: acini (enzymes) and ducts (HCO₃⁻ and water).',
    'Proteases secreted inactive; enterokinase → trypsin → activates the rest.',
    'Duct HCO₃⁻: Cl⁻ channels + Cl⁻/HCO₃⁻ exchange + CFTR; carbonic anhydrase.',
    'Phases: cephalic 20–25% (vagus), gastric ~10%, intestinal 50–80% (secretin → HCO₃⁻; CCK → enzymes).',
    'Small intestine: Brunner’s mucus; crypt fluid ~2 L/day driven by Cl⁻ through CFTR; no secreted enzymes.',
    'Colon: mucus, some HCO₃⁻; large fluid secretion when irritated.',
  ],
};

const lesson6: Draft = {
  id: 'gastrointestinal-physiology-6',
  title: 'Control of the Gut',
  description: 'Endocrine, paracrine and neural control, the enteric nervous system, the extrinsic nerves and the three phases of gastric secretion.',
  xp: 25,
  sourceRefs: ds([94, 95, 96, 97, 99, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115]),
  objectives: [
    'Distinguish endocrine and paracrine control in the gut',
    'Contrast long and short reflexes',
    'Describe the two plexuses and the neurons of the enteric nervous system',
    'Describe the parasympathetic and sympathetic supply and their effects',
    'Explain the cephalic, gastric and intestinal phases of gastric secretion',
  ],
  chunks: [
    {
      title: 'Endocrine and paracrine control',
      kind: 'regulation',
      paragraphs: [
        'Three principal mechanisms regulate the gut: endocrine, paracrine and neural (slide 94).',
        'Endocrine: an enteroendocrine cell (EEC) senses a chemical or mechanical stimulus (or neural input) and releases a hormone into the blood, acting on other parts of the gut, on glands such as the pancreas, and even on the liver and brain. Paracrine: a messenger from a sensing cell diffuses to nearby smooth muscle cells, enterocytes, gland cells or other EECs (slides 94–96).',
        'With so many endocrine cells, the GI tract has been called the largest endocrine organ. Its peptides, spread from oesophagus to pancreas but localised to regions, regulate motility, secretion, absorption, growth and development (slides 96–97).',
      ],
      sourceRefs: ds([94, 95, 96, 97]),
    },
    {
      title: 'Long and short reflexes',
      kind: 'comparison',
      table: {
        columns: ['Long reflexes', 'Short reflexes'],
        rows: [['Extrinsic nervous system: sensory information (from the gut or outside it) goes to the brain, which sends commands back', 'Intrinsic (enteric) nervous system: sensation is received, integrated and acted on in the gut wall alone']],
      },
      keyPoints: ['A vagovagal reflex: vagal afferents reach the medulla and vagal efferents carry the response back (slide 100).'],
      sourceRefs: ds([99, 100]),
    },
    {
      title: 'The enteric nervous system',
      kind: 'structure',
      paragraphs: [
        'The “brain of the gut” can regulate motility and secretion without extrinsic input. It has two plexuses running from the oesophagus to the anus (slides 103–104):',
      ],
      table: {
        columns: ['Plexus', 'Where', 'Controls'],
        rows: [
          ['Myenteric (Auerbach’s)', 'Between the longitudinal and circular muscle; continuous from upper oesophagus to internal anal sphincter', 'Mainly motility'],
          ['Submucosal (Meissner’s)', 'Submucosa — in the small and large intestine, not the stomach and oesophagus', 'Local secretion, absorption and submucosal muscle'],
        ],
      },
      terms: [
        { term: 'Intrinsic primary afferent neurons (IPANs)', meaning: 'Sensory: receive from receptors in the mucosa and muscle.' },
        { term: 'Motor neurons', meaning: 'Muscle motor, secretomotor and vasodilator neurons.' },
        { term: 'Interneurons', meaning: 'Carry signals from IPANs to motor neurons and to each other.' },
      ],
      keyPoints: ['Both plexuses receive CNS output through vagal, sympathetic and pelvic pathways (slide 106).'],
      sourceRefs: ds([103, 104, 105, 106]),
    },
    {
      title: 'Extrinsic nerves',
      kind: 'comparison',
      table: {
        columns: ['', 'Parasympathetic', 'Sympathetic'],
        rows: [
          ['Route', 'Vagus (oesophagus to proximal colon, gallbladder, pancreas); pelvic nerves (distal colon, anorectum)', 'Preganglionic from T5–L2 → coeliac, superior and inferior mesenteric ganglia → all parts of the ENS, blood vessels and glands'],
          ['Effect', 'More motility and secretion; sphincters relax', 'Less secretion and motility; sphincters and vessels contract'],
        ],
      },
      keyPoints: ['Afferents in the vagal and spinal nerves report acidity, nutrients, osmolality, stretch and pain to the CNS (slides 108–109).'],
      sourceRefs: ds([107, 108, 109]),
    },
    {
      title: 'Three phases of gastric secretion',
      kind: 'pathway',
      steps: [
        { label: 'Cephalic phase', detail: 'Before food arrives: sight, smell, taste or thought of food → cortex and hypothalamus → vagal nuclei → vagus → ACh stimulates parietal cells directly and via gastrin (G cells) and histamine (ECL cells). Secretion reaches about 40% of the maximum rate.' },
        { label: 'Gastric phase', detail: 'Food in the stomach: distension (vagovagal and local reflexes) and protein products (peptones, peptides, amino acids acting on G cells) release gastrin. About 70% of the acid secreted with a meal.' },
        { label: 'Intestinal phase — stimulation', detail: 'Early, while chyme pH is above 3: peptides and amino acids in the duodenum release gastrin from duodenal and jejunal G cells.' },
        { label: 'Intestinal phase — inhibition', detail: 'Later, as chyme pH falls below 2: the enterogastric reflex (duodenal distension and acid → vagal afferents → medulla) inhibits gastric motility and secretion and tightens the pylorus; acid releases secretin and fat releases GIP and CCK, which inhibit acid secretion.' },
      ],
      sourceRefs: ds([110, 111, 112, 113, 114, 115]),
    },
  ],
  summary: [
    'Endocrine (EEC hormone in blood), paracrine (diffuses to neighbours), neural.',
    'Long reflexes via the CNS; short reflexes via the ENS alone; vagovagal reflexes.',
    'Myenteric plexus: motility. Submucosal plexus: secretion and absorption (intestines only).',
    'Parasympathetic (vagus, pelvic) stimulates; sympathetic (T5–L2, prevertebral ganglia) inhibits.',
    'Gastric secretion: cephalic (~40% of max; vagus, ACh, gastrin, histamine) → gastric (~70% of acid; distension, peptides, gastrin) → intestinal (first stimulates, then inhibits: enterogastric reflex, secretin, GIP, CCK).',
  ],
};

const lesson7: Draft = {
  id: 'gastrointestinal-physiology-7',
  title: 'Motility I: Smooth Muscle, Swallowing and the Stomach',
  description: 'GI smooth muscle and slow waves, peristalsis and segmentation, the three phases of swallowing and how the stomach stores, mixes and empties.',
  xp: 25,
  sourceRefs: ds([128, 129, 131, 132, 134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146, 148, 150, 151, 152, 153, 156, 157, 158, 159, 160, 161, 162, 163]),
  objectives: [
    'Describe GI smooth muscle and how it works as a syncytium',
    'Explain slow waves, spikes and the interstitial cells of Cajal',
    'Contrast phasic and tonic contractions, and peristalsis and segmentation',
    'Describe the oral, pharyngeal and oesophageal phases of swallowing and their control',
    'Describe the roles of the proximal and distal stomach and how the stomach empties',
    'Describe the control of fundic and antral motility, and the migrating motor complex',
  ],
  chunks: [
    {
      title: 'GI smooth muscle',
      kind: 'structure',
      paragraphs: [
        'All gut muscle is smooth except the first part of the oesophagus and the external anal sphincter. It is arranged in inner circular and outer longitudinal layers of bundles of up to 1000 fibres. It is unitary smooth muscle: gap junctions link the fibres so signals spread easily (faster along a bundle than sideways), and the bundles fuse into a layer that acts as a syncytium (slides 128–129).',
      ],
      sourceRefs: ds([128, 129]),
    },
    {
      title: 'Slow waves and spikes',
      kind: 'mechanism',
      paragraphs: [
        'Most GI smooth muscle shows slow waves — the basic electrical rhythm — made by pacemaker interstitial cells of Cajal joined to the muscle by gap junctions. Slow waves bring the membrane towards threshold; spikes (action potentials) on top of them cause contraction (slide 131).',
        'Depolarisation is promoted by stretch (food), ACh and parasympathetic stimulation, and some GI hormones; noradrenaline and adrenaline hyperpolarise the fibres (slide 132).',
      ],
      table: {
        columns: ['Phasic contractions', 'Tonic contractions'],
        rows: [['Periodic, with relaxation: oesophagus, gastric antrum, small intestine', 'Sustained tone: lower oesophageal sphincter, orad stomach, ileocaecal sphincter, internal anal sphincter']],
      },
      sourceRefs: ds([131, 132, 134]),
    },
    {
      title: 'Peristalsis and segmentation',
      kind: 'comparison',
      table: {
        columns: ['', 'Peristalsis', 'Segmentation'],
        rows: [
          ['Purpose', 'Propels contents aborally', 'Mixes contents, moving them both ways'],
          ['Where', 'Oesophagus, stomach, small and large intestine', 'Small intestine (mainly) and large intestine'],
          ['How', 'Distension → circular muscle contracts just orally, the segment beyond relaxes (receptive relaxation), longitudinal muscle shortens the tube', 'Localised contractions of circular muscle divide the gut into segments'],
          ['Control', 'Myenteric (Auerbach’s) plexus; also chemical stimuli and strong parasympathetic activity', 'Exposes food to enzymes and to the lining for absorption'],
        ],
      },
      sourceRefs: ds([135, 136, 137]),
    },
    {
      title: 'Swallowing',
      kind: 'pathway',
      steps: [
        { label: 'Oral phase (voluntary)', detail: 'Preparatory: chewing and mixing with saliva into a bolus. Propulsive: the tongue presses the bolus against the hard palate, lips sealed, and a reflex wave pushes it back into the pharynx.' },
        { label: 'Pharyngeal phase (involuntary, ~1 s)', detail: 'Pharyngeal receptors trigger it. Constrictors push the bolus down; the soft palate seals the nasopharynx; the larynx rises and the epiglottis covers it; the Eustachian tubes open; the upper oesophageal sphincter relaxes, then shuts.' },
        { label: 'Oesophageal phase (involuntary, < 10 s)', detail: 'Peristalsis carries the bolus down; the lower oesophageal sphincter relaxes to let it in, then closes to stop reflux.' },
      ],
      keyPoints: [
        'Control: afferents in the trigeminal and glossopharyngeal nerves reach the swallowing centre in the medulla and pons, which sends motor signals through cranial nerves V, IX, X and XII and some upper cervical nerves (slides 145–146).',
        'Primary peristalsis is driven by the swallowing centre; secondary peristalsis by enteric reflexes to oesophageal distension, backed by the vagus and glossopharyngeal nerves (slides 146–147).',
      ],
      sourceRefs: ds([139, 140, 141, 142, 143, 144, 145, 146]),
    },
    {
      title: 'The stomach',
      kind: 'comparison',
      paragraphs: ['The stomach stores food, breaks it into chyme, and delivers chyme to the duodenum no faster than the intestine can handle (slide 148).'],
      table: {
        columns: ['', 'Proximal stomach (cardia, fundus, body)', 'Distal stomach (antrum, pylorus)'],
        rows: [
          ['Role', 'Storage — the gastric reservoir', 'The gastric pump: mixing, grinding and emptying'],
          ['Muscle', 'Thin, weak tonic contractions', 'Thick and powerful, phasic contractions'],
          ['Key reflexes', 'Receptive relaxation (as food is swallowed) and adaptive relaxation (as pressure rises)', 'Peristaltic waves from mid-stomach to the closed pylorus, strongest near it, make chyme'],
        ],
      },
      keyPoints: [
        'The stomach empties when peristaltic pressure exceeds the closing pressure of the pylorus — by stronger waves or a relaxing pylorus. Excess acid or undigested fat in the small intestine delays emptying (slides 153–154).',
      ],
      sourceRefs: ds([148, 150, 151, 152, 153]),
    },
    {
      title: 'Control of gastric motility',
      kind: 'regulation',
      paragraphs: [
        'Pacemaker cells sit in the greater curvature of the fundus, but slow waves do not spread into the proximal fundus, whose membrane is less negative (slide 156).',
        'Fundus: under vagal control. Receptive and adaptive relaxation are produced by non-adrenergic non-cholinergic (NANC) inhibition — NO, PACAP, VIP and ATP from enteric motor neurons, triggered by vagovagal reflexes — and by sympathetic noradrenaline. Many hormones (GRP, gastrin, CCK, secretin, VIP, somatostatin, glucagon, bombesin) relax it; motilin and TRH contract it. Duodenal distension, acid, protein and fat reduce fundic tone (slides 157–160).',
        'Distal stomach: between meals the migrating motor complex (MMC) sweeps residue along every 1.5–2 hours, enhanced by motilin; duodenal acid abolishes it. After a meal, slow waves from the interstitial cells of Cajal give contractions only when ACh is released (cephalic and gastric reflexes). CCK, substance P, bombesin and opiates increase antral contractions; secretin, somatostatin, GRP, glucagon and TRH inhibit them, as do sympathetic and NANC nerves and duodenal distension, fat, protein and acid (slides 160–163).',
      ],
      sourceRefs: ds([156, 157, 158, 159, 160, 161, 162, 163]),
    },
  ],
  summary: [
    'Unitary smooth muscle linked by gap junctions acts as a syncytium.',
    'Interstitial cells of Cajal make slow waves; spikes cause contraction; stretch and ACh depolarise, noradrenaline hyperpolarises.',
    'Peristalsis propels (myenteric plexus); segmentation mixes (small intestine).',
    'Swallowing: oral (voluntary) → pharyngeal (involuntary, ~1 s) → oesophageal (< 10 s). Centre in medulla/pons; nerves V, IX, X, XII.',
    'Proximal stomach stores (receptive and adaptive relaxation, NANC: NO, VIP, PACAP, ATP). Distal stomach mixes and empties.',
    'MMC every 1.5–2 h between meals, driven by motilin.',
  ],
};

const lesson8: Draft = {
  id: 'gastrointestinal-physiology-8',
  title: 'Motility II: Intestines, Defecation and Vomiting',
  description: 'Small intestinal motility and the MMC, the structure and movements of the colon, the defecation reflex and the control of vomiting.',
  xp: 25,
  sourceRefs: ds([163, 164, 165, 166, 167, 169, 170, 171, 172, 173, 174, 175, 179, 180, 181, 182, 184, 185, 186, 188, 189, 190, 191]),
  objectives: [
    'Describe small intestinal slow waves, contractions and the MMC',
    'Describe the structure and functions of the large intestine',
    'Describe haustral contractions, peristalsis, antiperistalsis and mass movements',
    'Explain the gastrocolic reflex',
    'Describe the sphincters and reflexes of defecation',
    'Describe the stages and control of vomiting',
  ],
  chunks: [
    {
      title: 'The small intestine',
      kind: 'mechanism',
      paragraphs: [
        'Interstitial cells of Cajal start slow waves that spread aborally through gap junctions. Their frequency — and so the maximum frequency of contractions — falls from duodenum to ileum (slides 163–164).',
        'The small intestine shows segmentation, peristaltic waves (fast and far-spreading proximally, shorter and slower distally) and, between meals, the MMC. The ENS generates the MMC; motilin elicits it; a meal suppresses it through vagovagal reflexes and hormones such as gastrin, secretin and CCK (slides 164–165).',
      ],
      sourceRefs: ds([163, 164, 165]),
    },
    {
      title: 'The large intestine',
      kind: 'structure',
      paragraphs: [
        'The colon reabsorbs water and compacts faeces, absorbs vitamins made by bacteria and electrolytes, and stores faeces before defecation; apart from bacterial digestion, no digestion happens there. It comprises the caecum, colon, rectum and anal canal (slides 165–166).',
        'Its longitudinal muscle is reduced to three bands, the taeniae coli. Being shorter than the colon, they gather it into pouches — haustra. Fat-filled epiploic appendages hang from the taeniae (slides 166–167).',
      ],
      sourceRefs: ds([165, 166, 167]),
    },
    {
      title: 'Colonic movements',
      kind: 'comparison',
      table: {
        columns: ['Pattern', 'What happens'],
        rows: [
          ['Haustral contractions', 'Sluggish segmentation, mainly in the transverse and descending colon: a distended haustrum contracts, pushing residue on — about every 30 min, lasting about 1 min; mixing helps water absorption'],
          ['Peristalsis and antiperistalsis', 'Slow forward movement; antiperistalsis towards the ileum slows transit, allowing more absorption'],
          ['Mass movements', 'Strong, prolonged waves from mid-transverse colon to the rectum, clearing a segment; 3–4 times a day, during or after meals; only in the large intestine'],
        ],
      },
      keyPoints: [
        'Food in the stomach and digestion products in the small intestine increase colonic motility — the gastrocolic reflex; duodenal distension triggers the duodenocolic reflex. Both are started rapidly by the parasympathetic system and more slowly by gastrin and CCK (slides 172–173).',
        'Parasympathetic activity, ACh and substance P stimulate the colon; sympathetic, NANC and adrenergic nerves inhibit it. Fibre softens stool and strengthens contractions (slides 169, 173).',
      ],
      sourceRefs: ds([169, 170, 171, 172, 173]),
    },
    {
      title: 'Defecation',
      kind: 'pathway',
      paragraphs: [
        'Continence depends on the internal anal sphincter (smooth muscle, enteric nerves), the external anal sphincter (skeletal muscle, pudendal nerve, voluntary) and the puborectalis sling, which keeps an acute anorectal angle (slides 174–175).',
      ],
      steps: [
        { label: 'Mass movement fills the rectum' },
        { label: 'Defecation reflex', detail: 'Rectal pressure → sigmoid and rectum contract, internal sphincter relaxes, external sphincter contracts. This produces the urge, not defecation itself.' },
        { label: 'If delayed', detail: 'The external sphincter stays shut; reverse peristalsis relieves pressure. Prolonged delay lets more water be absorbed — firmer stool, constipation.' },
        { label: 'Defecation', detail: 'External sphincter and puborectalis relax; rectal and sigmoid peristalsis expel the faeces, helped by the Valsalva manoeuvre.' },
      ],
      keyPoints: [
        'The intrinsic (enteric) reflex is weak; a stronger parasympathetic reflex through the sacral cord and pelvic nerves intensifies rectal peristalsis and relaxes the internal sphincter. Higher centres decide via the external sphincter (slides 180–182).',
      ],
      sourceRefs: ds([174, 175, 179, 180, 181, 182]),
    },
    {
      title: 'Vomiting',
      kind: 'pathway',
      paragraphs: ['Vomiting is the forceful expulsion of stomach (and sometimes upper intestinal) contents. It can cause acid–base and electrolyte disturbance, volume depletion, malnutrition and aspiration pneumonia (slide 184).'],
      steps: [
        { label: 'Nausea', detail: 'Cold sweat, pallor, salivation, loss of gastric tone, duodenal contraction, reflux into the stomach, reverse peristalsis.' },
        { label: 'Retching', detail: 'Spasmodic breathing against a closed glottis; antrum contracts, fundus and cardia relax.' },
        { label: 'Emesis', detail: 'Deep breath, glottis closed, larynx raised (opening the upper sphincter), soft palate raised; the diaphragm drops sharply and the abdominal muscles squeeze the stomach; with the pylorus closed, contents leave by the mouth.' },
      ],
      keyPoints: [
        'Control: the vomiting centre in the medullary reticular formation and the chemoreceptor trigger zone (CTZ) in the area postrema (floor of the fourth ventricle). Inputs: the GI tract (vagus), cortex and thalamus, the vestibular system (motion sickness) and the CTZ (drugs, uraemia, hypoxia, diabetic ketoacidosis) (slides 188–190).',
        'Outputs: phrenic nerve (diaphragm), spinal nerves (abdominal and chest wall), vagus (oesophagus, larynx, pharynx). Transmitters include dopamine, serotonin, ACh, histamine and substance P (slides 190–191).',
      ],
      sourceRefs: ds([184, 185, 186, 188, 189, 190, 191]),
    },
  ],
  summary: [
    'Small intestine: slow-wave frequency falls distally; segmentation, peristalsis and the MMC (motilin; suppressed by meals).',
    'Colon: taeniae coli and haustra; absorbs water and electrolytes, stores faeces.',
    'Haustral contractions (~every 30 min), slow peristalsis and antiperistalsis, mass movements (3–4/day).',
    'Gastrocolic and duodenocolic reflexes increase colonic motility after meals.',
    'Defecation reflex → urge; voluntary relaxation of the external sphincter and puborectalis; Valsalva helps.',
    'Vomiting: nausea → retching → emesis; vomiting centre (medulla) and CTZ (area postrema).',
  ],
};

const lesson9: Draft = {
  id: 'gastrointestinal-physiology-9',
  title: 'The Liver, Bile and Jaundice',
  description: 'The structure and functions of the liver, the composition and production of bile, the gallbladder, control of bile secretion and the types of jaundice.',
  xp: 25,
  sourceRefs: ds([193, 195, 196, 199, 200, 201, 202, 203, 204, 207, 208, 209, 211, 212, 213, 214, 215, 216, 217]),
  objectives: [
    'Describe the lobule, sinusoids and portal area of the liver',
    'List the functions of the liver',
    'Describe the composition of bile and how bile acids become bile salts',
    'Explain how the gallbladder concentrates bile and why pigment stones form',
    'Explain the control of bile secretion by CCK, secretin and the vagus',
    'Classify jaundice as pre-hepatic, hepatic or post-hepatic, with causes',
  ],
  chunks: [
    {
      title: 'The liver',
      kind: 'structure',
      paragraphs: [
        'The biliary system — liver, gallbladder and bile ducts — makes, stores and carries bile (slide 193).',
        'The liver, the largest organ, has four lobes (left, right, caudate, quadrate) made of hexagonal lobules. Plates of hepatocytes radiate from a central vein; between them, sinusoids receive oxygen-rich blood from the hepatic artery and nutrient-rich blood from the portal vein. Kupffer cells (macrophages) in the sinusoids recycle old red cells. At each corner a portal area holds branches of the portal vein, hepatic artery, bile duct and nerves (slides 195–196).',
        'Bile drains from canaliculi into the hepatic duct, which joins the cystic duct from the gallbladder to form the common bile duct to the duodenum (slide 196).',
      ],
      keyPoints: ['Functions: protein synthesis (albumin, prothrombin, fibrinogen); bile; metabolism of lipid-soluble drugs (detoxification) and steroids (including cholesterol synthesis); lipoproteins; carbohydrate metabolism; urea formation (slide 199).'],
      sourceRefs: ds([193, 195, 196, 199]),
    },
    {
      title: 'Bile',
      kind: 'definitions',
      paragraphs: [
        'Bile is an aqueous, alkaline, greenish-yellow liquid; 0.25–1 L is made daily. It emulsifies fat and eliminates substances from the liver. It is 95% water, with bile acids, cholesterol, phospholipids, bile pigments (bilirubin, biliverdin), electrolytes and HCO₃⁻, steroids, enzymes, porphyrins, vitamins, heavy metals, drugs and toxins (slides 200–201).',
        'The two primary bile acids are cholic and chenodeoxycholic acid. Conjugated with glycine or taurine they become bile salts, which are more soluble and act as detergents (slides 201–202).',
      ],
      steps: [
        { label: 'Hepatocytes', detail: 'Secrete bile rich in bile acids, cholesterol and organic molecules into canaliculi.' },
        { label: 'Bile ducts', detail: 'Add a watery, HCO₃⁻-rich secretion.' },
        { label: 'Gallbladder', detail: 'Stores and concentrates it about five-fold during fasting.' },
      ],
      sourceRefs: ds([200, 201, 202]),
    },
    {
      title: 'The gallbladder',
      kind: 'mechanism',
      paragraphs: [
        'The gallbladder absorbs water actively (Na⁺/H⁺ exchange) and passively (aquaporins), and absorbs Cl⁻ and HCO₃⁻ through CFTR, keeping almost all the organic molecules. Secreting H⁺ and absorbing HCO₃⁻ turns basic hepatic bile into acidic gallbladder bile (slides 203–204).',
        'It absorbs Ca²⁺ and Mg²⁺ less efficiently than Na⁺ and water, so Ca²⁺ concentrates; bilirubin, not actively absorbed, may concentrate ten-fold. So calcium bilirubinate — the main component of pigment gallstones — precipitates much more readily in the gallbladder (slide 204).',
      ],
      sourceRefs: ds([203, 204]),
    },
    {
      title: 'What bile does and how it is released',
      kind: 'regulation',
      paragraphs: [
        'Bile is the main route for excreting lipophilic toxins, bilirubin and bile salts (too large for the kidney) and for eliminating cholesterol. Bile salts emulsify fat for absorption. Bile protects against enteric infection (IgA, cytokines, innate immunity), is part of the enterohepatic and cholehepatic circulation, and carries hormones out of the body (slides 207–208).',
      ],
      table: {
        columns: ['Signal', 'Effect'],
        rows: [
          ['Vagal stimulation', 'Increases bile secretion'],
          ['Splanchnic (sympathetic) stimulation', 'Vasoconstriction, less hepatic blood flow, less bile'],
          ['CCK (from fatty acids in the duodenum)', 'Contracts the gallbladder and relaxes the sphincter of Oddi'],
          ['Secretin (from acid chyme)', 'Duct cells add HCO₃⁻ to bile'],
          ['Bile salts returning by the enterohepatic circulation', 'Set the rate of bile salt synthesis — the most important regulator of bile volume'],
        ],
      },
      sourceRefs: ds([207, 208, 209]),
    },
    {
      title: 'Jaundice',
      kind: 'clinical',
      paragraphs: [
        'Jaundice is yellowing of the skin, mucous membranes and sclerae from raised blood bilirubin, usually seen above 2.5–3 mg/dL. It is a sign, not a disease. Bilirubin comes mostly from haem of broken-down red cells; the liver conjugates it (making it water-soluble) and excretes it in bile; some is lost in faeces and some is changed by bacteria and excreted in urine (slides 211–212).',
      ],
      table: {
        columns: ['Type', 'Problem', 'Bilirubin', 'Causes'],
        rows: [
          ['Pre-hepatic', 'Excess haemolysis overwhelms the liver', 'Unconjugated', 'Malaria; thalassaemia, sickle cell, G6PD deficiency, spherocytosis; haemolytic uraemic syndrome; drugs and toxins; autoimmune'],
          ['Hepatic', 'Faulty metabolism or excretion in the liver', 'Unconjugated and/or conjugated', 'Hepatitis, cirrhosis, Gilbert’s, Crigler–Najjar, Rotor and Dubin–Johnson syndromes, liver cancer'],
          ['Post-hepatic', 'Obstruction to bile drainage', 'Conjugated', 'Gallstones in the common bile duct, pancreatic cancer, pancreatitis, biliary atresia, gallbladder cancer, cholangitis, liver flukes, primary biliary cirrhosis'],
        ],
      },
      sourceRefs: ds([211, 212, 213, 214, 215, 216, 217]),
    },
  ],
  summary: [
    'Lobules: hepatocyte plates around a central vein; sinusoids get hepatic arterial and portal blood; Kupffer cells; portal triads at the corners.',
    'Liver functions: plasma proteins, bile, drug and steroid metabolism, lipoproteins, carbohydrate, urea.',
    'Bile: 0.25–1 L/day; cholic and chenodeoxycholic acids conjugated with glycine/taurine → bile salts.',
    'Gallbladder concentrates bile ~5× and acidifies it; concentrated Ca²⁺ and bilirubin → pigment stones.',
    'CCK contracts the gallbladder and relaxes the sphincter of Oddi; secretin adds HCO₃⁻; vagus increases bile.',
    'Jaundice > 2.5–3 mg/dL: pre-hepatic (haemolysis, unconjugated), hepatic, post-hepatic (obstruction, conjugated).',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: withSimulation(lesson.id, interactive[lesson.id]),
}));

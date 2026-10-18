// Physiology → Renal Physiology — the seven lessons (reading layer).
// Source: the "Renal System" lecture deck (rs in sources.ts).
import type { LessonDraft } from '@/data/topics/build';
import { interactive, readingExtras } from '@/data/topics/renal-physiology/interactive';
import { withSimulation } from '@/data/topics/renal-physiology/simulations';
import { rs, type ConceptId } from '@/data/topics/renal-physiology/sources';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'renal-physiology-1',
  title: 'The Kidney and the Nephron',
  description: 'What the kidneys do, their gross structure, the two kinds of nephron, the nephron’s vessels and tubule, and the juxtaglomerular apparatus.',
  xp: 25,
  sourceRefs: rs([1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21]),
  objectives: [
    'List the organs of the urinary system and the functions of the kidney',
    'Describe the gross structure of the kidney from capsule to pelvis',
    'Compare cortical and juxtamedullary nephrons',
    'Trace blood through the glomerulus, peritubular capillaries and vasa recta',
    'Name the parts of the renal tubule in order',
    'Describe the three cell types of the juxtaglomerular apparatus',
  ],
  chunks: [
    {
      title: 'The urinary system',
      kind: 'overview',
      paragraphs: [
        'The renal system produces, stores and releases urine. The two kidneys produce it; the accessory structures are the two ureters (transport), the urinary bladder (storage) and the urethra (excretion) (slides 1–2).',
      ],
      steps: [
        { label: 'Water and electrolyte balance' },
        { label: 'Plasma volume and blood pressure' },
        { label: 'Acid–base balance and osmolarity' },
        { label: 'Excretion of wastes' },
        { label: 'Hormones', detail: 'The enzyme renin and the hormone erythropoietin.' },
        { label: 'Vitamin D', detail: 'Conversion to its active form.' },
      ],
      sourceRefs: rs([1, 2, 4]),
    },
    {
      title: 'Gross structure',
      kind: 'structure',
      paragraphs: [
        'The kidneys are retroperitoneal, on the posterior abdominal wall either side of the vertebral column. The left is slightly higher because the liver pushes the right one down. They are bean-shaped, convex laterally and concave medially; the renal hilum on the concave side lets the renal artery, renal vein and ureter in and out (slides 5–6).',
      ],
      steps: [
        { label: 'Renal capsule', detail: 'Thin fibrous layer keeping the shape of the soft tissue.' },
        { label: 'Renal cortex', detail: 'Granular-looking.' },
        { label: 'Renal medulla', detail: 'Seven cone-shaped renal pyramids, bases outward, apexes inward.' },
        { label: 'Minor calyces', detail: 'Each pyramid’s apex drains into one.' },
        { label: 'Major calyces' },
        { label: 'Renal pelvis', detail: 'Leaves at the hilum and drains into the ureter.' },
      ],
      notes: [{ kind: 'check', text: 'Slide 6 gives seven renal pyramids; Guyton gives 8 to 10. Not quizzed — confirm with the lecturer.' }],
      sourceRefs: rs([5, 6, 7]),
    },
    {
      title: 'Two kinds of nephron',
      kind: 'comparison',
      paragraphs: ['The nephron is the structural and functional unit of the kidney; each kidney has about 1.25 million (slide 9).'],
      notes: [{ kind: 'check', text: 'Slide 9 gives about 1.25 million nephrons per kidney; Guyton gives about 800,000 to 1,000,000. The number is not quizzed.' }],
      table: {
        columns: ['', 'Cortical (~85%)', 'Juxtamedullary (~15%)'],
        rows: [
          ['Renal corpuscle', 'In the outer cortex', 'Close to the medulla'],
          ['Loop of Henle', 'Short, dipping slightly into the medulla', 'Long, deep into the pyramids'],
          ['Efferent arteriole forms', 'Peritubular capillaries', 'Peritubular capillaries and vasa recta'],
        ],
      },
      sourceRefs: rs([9, 10, 13]),
    },
    {
      title: 'The vascular component',
      kind: 'pathway',
      steps: [
        { label: 'Afferent arteriole', detail: 'A subdivision of the renal artery, carrying blood to the glomerulus.' },
        { label: 'Glomerulus', detail: 'A ball of capillaries specialised for filtration, with a well-fenestrated, very porous endothelium.' },
        { label: 'Efferent arteriole', detail: 'Carries blood away and divides into the peritubular capillaries and vasa recta.' },
        { label: 'Peritubular capillaries', detail: 'Wrap the tubules, supply the renal tissue and exchange with the tubule.' },
        { label: 'Vasa recta', detail: 'From juxtamedullary efferent arterioles: thin hairpin capillaries running deep into the medulla beside the loop of Henle.' },
      ],
      sourceRefs: rs([11, 12, 13, 14]),
    },
    {
      title: 'The tubular component',
      kind: 'pathway',
      paragraphs: ['A hollow tube made of a single layer of epithelial cells (slide 15):'],
      steps: [
        { label: 'Bowman’s capsule', detail: 'Double-walled cup around the glomerulus that collects the filtrate; with the glomerulus it forms the renal corpuscle.' },
        { label: 'Proximal convoluted tubule', detail: 'Highly coiled, entirely in the cortex.' },
        { label: 'Loop of Henle', detail: 'U-shaped: thin descending, thin ascending and thick ascending limbs, dipping into the medulla and back.' },
        { label: 'Distal convoluted tubule', detail: 'Highly coiled, entirely in the cortex.' },
        { label: 'Collecting duct', detail: 'Drains up to eight nephrons, runs through the pyramids (giving them their striations) and empties into the renal pelvis.' },
      ],
      sourceRefs: rs([15, 16, 17, 18]),
    },
    {
      title: 'The juxtaglomerular apparatus',
      kind: 'structure',
      paragraphs: ['Where the distal tubule touches the afferent arteriole near the vascular pole of the glomerulus, both vascular and tubular cells form the juxtaglomerular apparatus (slide 20):'],
      terms: [
        { term: 'Juxtaglomerular (granular) cells', meaning: 'Large smooth muscle cells in the afferent arteriole wall; they make and secrete renin.' },
        { term: 'Macula densa', meaning: 'Densely packed epithelial cells of the distal tubule that detect the tubular fluid’s sodium concentration.' },
        { term: 'Extraglomerular mesangial (lacis) cells', meaning: 'Joined by gap junctions; may pass signals between macula densa and granular cells, and secrete erythropoietin.' },
      ],
      sourceRefs: rs([20, 21]),
    },
  ],
  summary: [
    'Kidneys make urine; ureters carry it; the bladder stores it; the urethra excretes it.',
    'Kidney functions: water, electrolytes, volume and BP, acid–base, osmolarity, wastes, renin and erythropoietin, active vitamin D.',
    'Capsule → cortex → medulla (7 pyramids) → minor calyces → major calyces → pelvis → ureter.',
    '~1.25 million nephrons per kidney: 85% cortical (short loops), 15% juxtamedullary (long loops, vasa recta).',
    'Afferent arteriole → glomerulus → efferent arteriole → peritubular capillaries / vasa recta.',
    'Bowman’s capsule → PCT → loop of Henle → DCT → collecting duct.',
    'JGA: granular cells (renin), macula densa (senses Na⁺), lacis cells.',
  ],
};

const lesson2: Draft = {
  id: 'renal-physiology-2',
  title: 'Glomerular Filtration',
  description: 'The filtration barrier, net filtration pressure, GFR, renal autoregulation and the neural and hormonal control of filtration.',
  xp: 25,
  sourceRefs: rs([23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]),
  objectives: [
    'Name the three processes of urine formation',
    'Describe the three layers of the filtration barrier and the effect of their charge',
    'Calculate net filtration pressure from its three pressures',
    'State the normal GFR and what it depends on',
    'Explain the myogenic and tubuloglomerular feedback mechanisms',
    'Explain how sympathetic nerves and angiotensin II change GFR',
  ],
  chunks: [
    {
      title: 'The filtration barrier',
      kind: 'structure',
      paragraphs: [
        'Urine is formed by glomerular filtration, tubular reabsorption and tubular secretion (slide 23). Filtration is passive and non-selective: water and small solutes pass through the barrier into the capsular space.',
      ],
      steps: [
        { label: 'Fenestrated glomerular endothelium' },
        { label: 'Glomerular basement membrane', detail: 'The endothelial and podocyte basement membranes combined.' },
        { label: 'Visceral epithelium of Bowman’s capsule', detail: 'Podocytes, with filtration slits between their pedicels.' },
      ],
      keyPoints: [
        'Each layer carries a negative charge, which is thought to slow the filtration of anions (slide 24).',
        'The filtrate is like plasma but protein-free; filtration is driven by Starling forces.',
      ],
      sourceRefs: rs([23, 24]),
    },
    {
      title: 'Net filtration pressure',
      kind: 'mechanism',
      table: {
        columns: ['Pressure', 'Value', 'Effect'],
        rows: [
          ['Glomerular blood hydrostatic pressure (GBHP)', '55 mmHg', 'Pushes fluid out — high because the efferent arteriole is narrower than the afferent'],
          ['Blood colloid osmotic pressure (BCOP)', '30 mmHg', 'Opposes filtration'],
          ['Capsular hydrostatic pressure (CHP)', '15 mmHg', 'Opposes filtration'],
        ],
      },
      keyPoints: ['NFP = GBHP − (BCOP + CHP) = 55 − (30 + 15) = 10 mmHg (slides 26–27).'],
      sourceRefs: rs([26, 27]),
    },
    {
      title: 'Glomerular filtration rate',
      kind: 'definitions',
      paragraphs: [
        'GFR is the volume of filtrate formed each minute by the glomeruli. It depends on the surface area for filtration, the membrane’s permeability and the NFP: GFR = Kf × NFP, where Kf is the filtration coefficient. GFR is directly proportional to NFP (slide 28).',
        'Normal GFR is about 120–125 mL/min — about 180 litres a day. It is the best measure of kidney function.',
      ],
      sourceRefs: rs([28]),
    },
    {
      title: 'Autoregulation',
      kind: 'regulation',
      paragraphs: ['Intrinsic controls keep GFR fairly constant over arterial pressures of about 80–180 mmHg by two mechanisms (slide 29):'],
      table: {
        columns: ['', 'Myogenic mechanism', 'Tubuloglomerular feedback'],
        rows: [
          ['Sensor', 'Stretch of the afferent arteriole’s smooth muscle', 'Macula densa cells sensing filtrate NaCl'],
          ['If pressure rises', 'The stretched arteriole contracts, limiting flow into the glomerulus', 'More filtrate and NaCl reach the macula densa → ATP, adenosine (and endothelin) → afferent constriction → GFR back to normal'],
          ['If pressure falls', 'The arteriole relaxes, letting more blood in', 'Less NaCl → less ATP and adenosine → afferent dilation; the macula densa also releases NO, prostaglandins and bradykinin'],
        ],
      },
      sourceRefs: rs([29, 30, 31, 32, 33]),
    },
    {
      title: 'Extrinsic control',
      kind: 'regulation',
      paragraphs: [
        'Neural and hormonal mechanisms regulate GFR indirectly by regulating systemic blood pressure (slide 34).',
        'Neural: under stress or in emergencies, when blood is shunted to vital organs, sympathetic control overrides autoregulation. Noradrenaline (nerves) and adrenaline (adrenal medulla) constrict the afferent arterioles, inhibiting filtration; the sympathetic system also stimulates the renin–angiotensin mechanism (slide 35).',
      ],
      steps: [
        { label: 'Arterial pressure falls → less renal blood flow' },
        { label: 'Macula densa detects it and signals the granular cells' },
        { label: 'Renin converts angiotensinogen (liver) to angiotensin I' },
        { label: 'ACE (lungs) converts it to angiotensin II' },
        { label: 'Angiotensin II acts', detail: 'Potent vasoconstriction; thirst; ADH secretion; Na⁺ and fluid retention; mesangial contraction (less filtration area, lower GFR); aldosterone over the next hours.' },
        { label: 'Aldosterone', detail: 'More Na⁺ and water reabsorption → volume expansion → higher BP → GFR rises.' },
      ],
      keyPoints: ['Other factors: prostaglandins and NO are vasodilators (their effects offset by the SNS and angiotensin II); adenosine constricts the renal vessels; endothelin is a vasoconstrictor (slide 38).'],
      sourceRefs: rs([34, 35, 36, 37, 38]),
    },
  ],
  summary: [
    'Urine formation: filtration, reabsorption, secretion.',
    'Barrier: fenestrated endothelium, basement membrane, podocytes — all negatively charged; filtrate is protein-free.',
    'NFP = 55 − (30 + 15) = 10 mmHg.',
    'GFR = Kf × NFP ≈ 125 mL/min ≈ 180 L/day.',
    'Autoregulation (80–180 mmHg): myogenic (stretch → constriction) and tubuloglomerular feedback (macula densa NaCl → ATP/adenosine).',
    'Sympathetic constriction of afferent arterioles lowers GFR; renin → angiotensin II → vasoconstriction, thirst, ADH, aldosterone.',
  ],
};

const lesson3: Draft = {
  id: 'renal-physiology-3',
  title: 'Tubular Reabsorption and Secretion',
  description: 'How the tubule reclaims water and solutes, sodium transport, the tubular maximum, what each segment reabsorbs, and the secretion of H⁺ and K⁺.',
  xp: 25,
  sourceRefs: rs([41, 42, 44, 45, 46, 47, 48, 49, 51, 52, 53, 55, 58, 59, 60, 61, 62]),
  objectives: [
    'Define tubular reabsorption and contrast the transcellular and paracellular routes',
    'Explain how the Na⁺/K⁺-ATPase drives sodium reabsorption',
    'Explain secondary active transport and the tubular maximum',
    'Explain how water, chloride and urea are reabsorbed passively',
    'State what the PCT, loop of Henle and distal nephron each reabsorb',
    'Describe the secretion of H⁺ and K⁺ and the role of aldosterone',
  ],
  chunks: [
    {
      title: 'Reabsorption and its routes',
      kind: 'overview',
      paragraphs: [
        'Tubular reabsorption reclaims water and solutes (organic nutrients, water and ions) from the tubular fluid and returns them to the peritubular capillaries or vasa recta. About 99% of the filtrate is reabsorbed. It is selective and happens by osmosis, diffusion and active transport (slides 41, 44).',
      ],
      table: {
        columns: ['Transcellular', 'Paracellular'],
        rows: [['Through the luminal membrane, cytosol and basolateral membrane, then the capillary endothelium', 'Between the cells — limited by tight junctions, but the leaky junctions of the proximal nephron allow it']],
      },
      sourceRefs: rs([41, 42, 44]),
    },
    {
      title: 'Sodium',
      kind: 'mechanism',
      paragraphs: [
        'Na⁺ is the most abundant cation in the filtrate. It is reabsorbed transcellularly, almost always actively, throughout the tubule at different rates; 80% of the kidney’s energy goes on Na⁺ transport (slide 44).',
        'The Na⁺/K⁺-ATPase in the basolateral membrane pumps Na⁺ out of the cell into the lateral space, keeping the cell’s Na⁺ low. This creates an electrochemical gradient for Na⁺ to enter passively at the luminal face. Na⁺ transport has no transport maximum (slide 45).',
      ],
      sourceRefs: rs([44, 45]),
    },
    {
      title: 'Glucose, amino acids and the tubular maximum',
      kind: 'mechanism',
      paragraphs: [
        'Glucose, amino acids, vitamins and most cations are reabsorbed by secondary active transport: co-transported with Na⁺ as Na⁺ moves down its gradient into the cell, then leaving across the basolateral membrane on carriers that need no energy (slide 46).',
        'These carriers are specific and limited, so each has a transport (tubular) maximum, Tm, which reflects the number of carriers and sets the renal threshold. When the carriers are saturated, the excess is excreted in urine (slide 47).',
      ],
      sourceRefs: rs([46, 47]),
    },
    {
      title: 'Water, chloride and urea',
      kind: 'mechanism',
      paragraphs: ['These move passively down their electrochemical gradients (slides 47–49):'],
      terms: [
        { term: 'Water', meaning: 'Na⁺ and solute movement sets up an osmotic gradient; water follows through aquaporins. This is obligatory water reabsorption.' },
        { term: 'Chloride', meaning: 'Na⁺ movement creates an electrical gradient that draws anions, especially Cl⁻, to keep neutrality.' },
        { term: 'Urea', meaning: 'A waste from protein breakdown; as water is reabsorbed, urea is concentrated in the tubule, which favours its reabsorption.' },
      ],
      sourceRefs: rs([47, 48, 49]),
    },
    {
      title: 'Segment by segment',
      kind: 'comparison',
      table: {
        columns: ['Segment', 'Reabsorbs'],
        rows: [
          ['Proximal convoluted tubule (most reabsorption)', '65% of Na⁺ and water; 100% of glucose, lactate, amino acids, vitamins; 90% of HCO₃⁻; 50% of Cl⁻; 55% of K⁺; Ca²⁺, PO₄ and Mg²⁺ (hormonally controlled)'],
          ['Loop of Henle', '25% of Na⁺ (half paracellularly), 10% of water, 35% of Cl⁻, 30% of K⁺'],
          ['Distal tubule and collecting duct', 'About 10% of Na⁺ and Cl⁻ and 25% of water — according to the body’s needs'],
        ],
      },
      keyPoints: [
        'Loop of Henle: water leaves the descending limb but not the ascending limb (few or no aquaporins); no solute is reabsorbed in the descending limb. In the thick ascending limb Na⁺ enters by the Na⁺-K⁺-2Cl⁻ co-transporter, driven by the basolateral Na⁺/K⁺-ATPase (slides 52–53).',
        'Distal nephron hormones: aldosterone (Na⁺), ADH (water), PTH (Ca²⁺); ANP promotes Na⁺ and water excretion (slide 55).',
      ],
      sourceRefs: rs([51, 52, 53, 55]),
    },
    {
      title: 'Tubular secretion',
      kind: 'mechanism',
      paragraphs: [
        'Secretion moves substances from the capillary blood into the tubular fluid: it disposes of unwanted solutes, removes ones that were reabsorbed, rids the body of excess K⁺ and controls blood pH. Secreted substances include H⁺, K⁺, urea, NH₄⁺, creatinine, some hormones and some drugs such as penicillin (slides 58–59).',
      ],
      table: {
        columns: ['', 'H⁺', 'K⁺'],
        rows: [
          ['Where', 'Proximal tubule, distal tubule and collecting ducts', 'Reabsorbed in the PCT (constant, unregulated); secreted in the DCT and collecting tubules (variable, regulated)'],
          ['Controlled by', 'The acidity of body fluids', 'Plasma K⁺, aldosterone and acid–base status'],
        ],
      },
      keyPoints: [
        'K⁺ secretion is coupled to Na⁺ reabsorption by the basolateral Na⁺/K⁺ pump. Aldosterone increases it by adding Na⁺/K⁺ pumps and apical K⁺ channels, and high K⁺ itself stimulates aldosterone secretion (slides 61–62).',
      ],
      sourceRefs: rs([58, 59, 60, 61, 62]),
    },
  ],
  summary: [
    '~99% of filtrate reabsorbed; transcellular and (leaky proximal) paracellular routes.',
    'Na⁺: active, via the basolateral Na⁺/K⁺-ATPase; uses 80% of renal energy; no Tm.',
    'Glucose and amino acids: secondary active co-transport with Na⁺; limited carriers → Tm → excess spills into urine.',
    'Water by osmosis (aquaporins), Cl⁻ by electrical gradient, urea by concentration.',
    'PCT: 65% Na⁺/water, 100% glucose and amino acids, 90% HCO₃⁻. Loop: 25% Na⁺ (Na⁺-K⁺-2Cl⁻). Distal: ~10% Na⁺, hormone-regulated.',
    'Secretion: H⁺ (pH), K⁺ (distal, aldosterone), creatinine, drugs like penicillin.',
  ],
};

const lesson4: Draft = {
  id: 'renal-physiology-4',
  title: 'Concentrating the Urine',
  description: 'The countercurrent multiplier and exchanger, urea recycling, ADH and how diuretics work.',
  xp: 25,
  sourceRefs: rs([64, 65, 66, 67, 68, 72, 73, 74, 78, 79, 81, 82]),
  objectives: [
    'Explain what a countercurrent system is',
    'Describe how the loop of Henle builds the medullary osmotic gradient',
    'Explain the role of urea in the gradient',
    'Explain how the vasa recta preserve the gradient',
    'Describe how ADH concentrates urine',
    'Explain how osmotic diuretics, alcohol, caffeine and Lasix increase urine output',
  ],
  chunks: [
    {
      title: 'Why a countercurrent?',
      kind: 'overview',
      paragraphs: [
        'The kidneys keep the solute concentration of body fluids at about 300 mOsm by changing the concentration and volume of urine, using countercurrent mechanisms — the multiplier and the exchanger (slide 64).',
        'A countercurrent exists when fluids flow in opposite directions in parallel tubes lying close together. A countercurrent multiplier spends energy to create a concentration gradient (slide 65).',
      ],
      sourceRefs: rs([64, 65]),
    },
    {
      title: 'The countercurrent multiplier',
      kind: 'pathway',
      paragraphs: ['The multiplier is the interaction between the descending and ascending limbs of the long loops of juxtamedullary nephrons (slides 65–67):'],
      steps: [
        { label: 'Descending limb', detail: 'Permeable to water, relatively impermeable to solutes: water leaves into the concentrated medulla.' },
        { label: 'The bend', detail: 'The filtrate reaches its highest concentration, about 1200 mOsm.' },
        { label: 'Ascending limb', detail: 'Impermeable to water, permeable to solutes: Na⁺ and Cl⁻ leave — passively in the thin segment, actively by the Na⁺-K⁺-2Cl⁻ co-transporter in the thick segment.' },
        { label: 'Distal tubule', detail: 'The fluid is now hypotonic, about 100 mOsm.' },
      ],
      keyPoints: [
        'Urea adds to the gradient: water reabsorption from the cortical collecting duct leaves urea behind; it leaves the inner medullary collecting duct by facilitated diffusion (helped by ADH) and re-enters the thin ascending limb (slides 67–68).',
      ],
      sourceRefs: rs([65, 66, 67, 68]),
    },
    {
      title: 'The countercurrent exchanger',
      kind: 'mechanism',
      paragraphs: [
        'The vasa recta bring nutrients and O₂ to the medulla without washing out its gradient. They are freely permeable to water and solute. Blood enters the descending vasa recta at about 300 mOsm/L and leaves the ascending vasa recta at about 325 mOsm/L (slide 72).',
        'Going down, water leaves and NaCl enters to match the rising interstitial osmolarity; coming up, water enters and NaCl leaves. So excess water is kept out of the medulla, and most NaCl and urea recycle from the ascending to the descending vasa recta and stay trapped in the medulla (slides 73–74).',
      ],
      sourceRefs: rs([72, 73, 74]),
    },
    {
      title: 'ADH',
      kind: 'regulation',
      paragraphs: [
        'ADH (vasopressin) is made in the hypothalamus and stored and released by the posterior pituitary. Its most important effect is to conserve water: it inserts aquaporins into the luminal membrane of the collecting duct’s principal cells, acting through cAMP (slide 78).',
        'It is released when hypothalamic osmoreceptors sense a rise in blood osmolarity, and also in response to angiotensin II. Without ADH, large amounts of dilute urine are produced — diabetes insipidus (slide 79).',
      ],
      sourceRefs: rs([78, 79]),
    },
    {
      title: 'Diuretics',
      kind: 'clinical',
      paragraphs: ['A diuretic increases urine output, reducing water conservation (slides 81–82):'],
      table: {
        columns: ['Diuretic', 'How it works'],
        rows: [
          ['Osmotic diuretic (e.g. glucose in diabetes mellitus)', 'Is not reabsorbed and carries water out with it'],
          ['Alcohol', 'Inhibits ADH secretion'],
          ['Xanthines (caffeine, theophylline)', 'Inhibit Na⁺ reabsorption and the obligatory water reabsorption that follows'],
          ['Lasix (furosemide)', 'Inhibits the Na⁺-K⁺-2Cl⁻ co-transporter in the thick ascending limb'],
        ],
      },
      keyPoints: ['Diuretics are used for hypertension, congestive heart failure and fluid retention with menstruation (slide 82).'],
      sourceRefs: rs([81, 82]),
    },
  ],
  summary: [
    'Body fluids are held near 300 mOsm by countercurrent mechanisms.',
    'Descending limb: water out. Bend: ~1200 mOsm. Ascending limb: NaCl out (Na⁺-K⁺-2Cl⁻ in the thick part). DCT: ~100 mOsm.',
    'Urea recycling adds to the medullary gradient; ADH helps urea leave the inner collecting duct.',
    'Vasa recta (exchanger): 300 in, ~325 out — they preserve the gradient.',
    'ADH inserts aquaporins in principal cells via cAMP; raised by osmolarity and angiotensin II.',
    'Diuretics: osmotic (glucose), alcohol (↓ ADH), caffeine (↓ Na⁺ reabsorption), Lasix (blocks Na⁺-K⁺-2Cl⁻).',
  ],
};

const lesson5: Draft = {
  id: 'renal-physiology-5',
  title: 'Renal Clearance and Urine',
  description: 'Clearance and how it measures GFR and renal plasma flow, and the physical and chemical features of normal urine.',
  xp: 25,
  sourceRefs: rs([83, 84, 85, 86, 87, 88, 89, 90, 91, 93, 94, 95, 96, 97]),
  objectives: [
    'Define renal clearance and calculate it',
    'Explain why inulin clearance equals GFR',
    'Interpret a clearance greater or less than inulin’s',
    'Explain why creatinine clearance is used clinically',
    'Calculate renal plasma flow from PAH and renal blood flow from it',
    'Describe the normal colour, odour, pH, specific gravity and composition of urine',
  ],
  chunks: [
    {
      title: 'Clearance',
      kind: 'definitions',
      paragraphs: [
        'Renal clearance is the volume of plasma cleared of a substance in a given time, usually a minute. It is the net result of filtration, secretion and reabsorption, and is used to assess GFR, renal blood flow and the handling of substances (slide 83).',
      ],
      keyPoints: ['Clearance (mL/min) = U × V / P, where U = urine concentration (mg/mL), V = urine flow (mL/min), P = plasma concentration (mg/mL); U × V is the excretion rate (slide 84).'],
      sourceRefs: rs([83, 84]),
    },
    {
      title: 'Measuring GFR',
      kind: 'mechanism',
      paragraphs: [
        'Inulin is not reabsorbed, stored or secreted, so its clearance equals GFR — about 125 mL/min (slide 85).',
      ],
      table: {
        columns: ['Clearance compared with inulin', 'Meaning'],
        rows: [
          ['Less', 'The substance is reabsorbed'],
          ['Equal', 'No net reabsorption or secretion'],
          ['Greater', 'The tubules secrete it'],
          ['Zero', 'Completely reabsorbed'],
        ],
      },
      keyPoints: [
        'Inulin must be infused. Creatinine, an endogenous product of muscle metabolism, is freely filtered, not reabsorbed and slightly secreted (clearance about 140); excretion exceeds filtration by about 10%, but it gives a reasonably accurate GFR (slides 86–87).',
      ],
      sourceRefs: rs([85, 86, 87]),
    },
    {
      title: 'Renal plasma and blood flow',
      kind: 'mechanism',
      paragraphs: [
        'Para-aminohippuric acid (PAH), an exogenous substance, is freely filtered (20%) and secreted (80%) but not reabsorbed. Only the kidney removes it, so its concentration in any peripheral vein equals that in the renal artery (slide 88).',
      ],
      keyPoints: [
        'Because about 90% of PAH is excreted: RPF = V × U_PAH / (0.9 × P_PAH) (slide 89).',
        'Renal blood flow = RPF / (1 − haematocrit), since 1 − Hct is the plasma fraction of blood (slide 89).',
      ],
      notes: [{ kind: 'check', text: 'Slide 88 also says PAH has “almost 100% excretion”; the formula uses 90%.' }],
      sourceRefs: rs([88, 89]),
    },
    {
      title: 'Normal urine',
      kind: 'definitions',
      table: {
        columns: ['Feature', 'Normal'],
        rows: [
          ['Colour', 'Clear, pale to deep yellow, from urochrome/urobilin (from haemoglobin breakdown); varies with diet, bile pigments, blood, drugs, vitamins. Cloudy urine may mean a UTI'],
          ['Odour', 'Slightly aromatic; ammonia smell on standing (bacteria break down urea); sweet or fruity with ketones in diabetes'],
          ['pH', 'About 6.0 (range 4.6–8); high-protein diets acidify, vegetarian diets alkalinise'],
          ['Specific gravity', '1.001–1.035'],
          ['Turbidity', 'Clear or slightly cloudy; more from cells, crystals, bacteria, lipid, mucus, semen or faeces'],
        ],
      },
      keyPoints: [
        'Composition: about 95% water. Solutes in decreasing concentration: urea (9.3 g/L), chloride (1.87), sodium (1.17), potassium (0.75), creatinine (0.67), then other ions and compounds (slide 96).',
        'Unusually high solutes, or blood proteins, white cells (pus) or bile pigments, may indicate disease (slide 97).',
      ],
      sourceRefs: rs([90, 91, 93, 94, 95, 96, 97]),
    },
  ],
  summary: [
    'Clearance = UV/P.',
    'Inulin clearance = GFR (~125 mL/min). Below inulin: reabsorbed; above: secreted; zero: fully reabsorbed.',
    'Creatinine: endogenous, slightly secreted, a practical GFR estimate.',
    'PAH: filtered and secreted, not reabsorbed → RPF = VU/(0.9P). RBF = RPF/(1 − Hct).',
    'Urine: ~95% water, pH ~6, SG 1.001–1.035; urea is the main solute.',
  ],
};

const lesson6: Draft = {
  id: 'renal-physiology-6',
  title: 'Micturition',
  description: 'The bladder and its sphincters, its sympathetic, parasympathetic and somatic nerves, the storage and voiding reflexes, and voluntary control.',
  xp: 25,
  sourceRefs: rs([98, 99, 100, 103, 104, 105, 107, 108, 109, 110, 111, 112, 113, 114]),
  objectives: [
    'Describe the layers of the bladder wall and the two sphincters',
    'Match each nerve supply of the bladder to its roots and effects',
    'Explain the storage reflexes',
    'Explain the micturition reflex and the role of the pontine micturition centre',
    'Explain voluntary control of voiding',
  ],
  chunks: [
    {
      title: 'The bladder',
      kind: 'structure',
      paragraphs: ['Micturition is emptying the bladder. The bladder is a hollow, distensible, muscular organ (slides 98–99):'],
      steps: [
        { label: 'Serosa or adventitia', detail: 'Serosa over the dome, continuous with the peritoneum; loose adventitia where there is no serosa.' },
        { label: 'Muscular layer', detail: 'The detrusor: inner and outer longitudinal smooth muscle with a circular layer between.' },
        { label: 'Submucosa', detail: 'Thin areolar tissue.' },
        { label: 'Mucosa', detail: 'Transitional epithelium, folded into rugae when empty.' },
      ],
      keyPoints: ['The bladder neck forms the internal urethral sphincter; skeletal muscle around the urethra where it passes through the pelvic floor forms the external urethral sphincter (slide 100).'],
      sourceRefs: rs([98, 99, 100]),
    },
    {
      title: 'Nerve supply',
      kind: 'comparison',
      table: {
        columns: ['Supply', 'Nerve (roots)', 'Effect'],
        rows: [
          ['Sympathetic', 'Hypogastric nerve (T12–L2)', 'Relaxes the detrusor (β) and contracts the bladder neck at the internal sphincter (α) — storage'],
          ['Parasympathetic', 'Pelvic nerve (S2–S4)', 'Contracts the detrusor and relaxes the trigone and sphincter — voiding'],
          ['Somatic', 'Pudendal nerve (S2–S4), from Onuf’s nucleus in the sacral ventral horn', 'Voluntary control of the external sphincter'],
        ],
      },
      keyPoints: ['Sensory nerves in the bladder wall report to the brain and signal the need to urinate when the bladder is full (slide 105).'],
      sourceRefs: rs([103, 104, 105]),
    },
    {
      title: 'Storage',
      kind: 'regulation',
      paragraphs: [
        'Bladder function has two phases: filling and storage, then emptying (voiding). During filling, pressure barely rises despite large increases in volume (slide 107).',
      ],
      steps: [
        { label: 'Low-level afferent activity signals distension (pelvic nerve)' },
        { label: 'Sympathetic outflow (hypogastric nerve)', detail: 'Relaxes the detrusor and contracts the internal sphincter.' },
        { label: 'Pudendal outflow', detail: 'Contracts the external sphincter — continence.' },
        { label: 'Pontine storage centre', detail: 'At lower volumes, suppresses parasympathetic and enhances sympathetic output.' },
      ],
      sourceRefs: rs([107, 108, 109]),
    },
    {
      title: 'Voiding',
      kind: 'pathway',
      paragraphs: [
        'Bladder wall mechanoreceptors respond to stretch and contraction. Pressure is low during filling (5–10 cm H₂O) but rises abruptly when micturition begins, which may be reflex or voluntary (slide 110).',
      ],
      steps: [
        { label: 'Bladder afferents → brainstem', detail: 'Through the periaqueductal grey to the pontine micturition centre (Barrington’s centre) in the rostral pons; ascending projections also inhibit the sympathetic neurons that prevent voiding.' },
        { label: 'Commands down a reticulospinal pathway to the sacral cord' },
        { label: 'Sympathetic and pudendal outflow inhibited', detail: 'Both sphincters relax.' },
        { label: 'Parasympathetic outflow activated', detail: 'The detrusor contracts.' },
        { label: 'Contraction drives the mechanoreceptors harder', detail: 'Positive feedback through the supraspinal loop → complete emptying.' },
      ],
      keyPoints: [
        'The adult bladder holds about 500 mL and may keep about 50 mL residual volume after emptying (slide 113).',
        'Voluntary control: the cerebrum can suppress the sacral reflex, especially through the external sphincter. When appropriate it relaxes the external sphincter and removes sympathetic inhibition, and the bladder contracts (slides 113–114).',
      ],
      sourceRefs: rs([110, 111, 112, 113, 114]),
    },
  ],
  summary: [
    'Detrusor smooth muscle; transitional epithelium with rugae; internal (bladder neck) and external (skeletal) sphincters.',
    'Sympathetic hypogastric (T12–L2): store. Parasympathetic pelvic (S2–S4): void. Somatic pudendal (S2–S4, Onuf’s nucleus): external sphincter.',
    'Storage: sympathetic relaxes detrusor and closes the neck; pudendal closes the external sphincter; pontine storage centre.',
    'Voiding: afferents → PAG → pontine micturition (Barrington’s) centre → reticulospinal → parasympathetic on, sympathetic and pudendal off.',
    'Capacity ~500 mL, residual ~50 mL; the cerebrum gives voluntary control.',
  ],
};

const lesson7: Draft = {
  id: 'renal-physiology-7',
  title: 'Acid–Base Balance',
  description: 'Normal pH, the chemical buffers, respiratory and renal regulation of H⁺, and acidosis, alkalosis and compensation.',
  xp: 25,
  sourceRefs: rs([118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 142, 143, 144, 146, 148, 150, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162]),
  objectives: [
    'State the normal pH and H⁺ concentration of arterial blood',
    'Distinguish volatile and non-volatile acids and the three lines of defence',
    'Explain how the bicarbonate, phosphate and protein buffers work',
    'Explain how breathing regulates H⁺',
    'Describe how the kidney reabsorbs bicarbonate, makes new bicarbonate and secretes H⁺',
    'Classify acidosis and alkalosis as respiratory or metabolic and describe compensation',
  ],
  chunks: [
    {
      title: 'pH and acids',
      kind: 'overview',
      paragraphs: [
        'Acid–base balance is the precise regulation of free H⁺ in body fluids. Arterial blood has about 40 nmol/L of H⁺; the physiological pH range is 7.36–7.44. Above that is alkalosis (alkalaemia), below it acidosis (acidaemia). ICF pH is about 7.0; venous and interstitial pH about 7.35. An acid donates H⁺; a base accepts it (slides 118–119).',
      ],
      table: {
        columns: ['Acid', 'From', 'Removed by'],
        rows: [
          ['Volatile', 'CO₂', 'The lungs'],
          ['Non-volatile', 'Food, or metabolic by-products', 'The kidneys'],
        ],
      },
      keyPoints: ['Three lines of defence: chemical buffers, the brain’s respiratory centres, and the kidneys (slide 120).'],
      notes: [{ kind: 'check', text: 'Slide 119 gives 7.36–7.44; the slides on disorders use below 7.35 and above 7.45.' }],
      sourceRefs: rs([118, 119, 120]),
    },
    {
      title: 'Chemical buffers',
      kind: 'mechanism',
      paragraphs: [
        'A buffer minimises the change in pH when acid or base is added; most are a weak acid plus a weak base. They act immediately but only in the short term (slides 121–122).',
      ],
      table: {
        columns: ['Buffer', 'How it works', 'Where it matters'],
        rows: [
          ['Bicarbonate (H₂CO₃ / NaHCO₃)', 'HCl + NaHCO₃ → H₂CO₃ + NaCl (strong acid → weak acid); NaOH + H₂CO₃ → NaHCO₃ + H₂O (strong base → weak base)', 'The most important buffer in plasma and ECF'],
          ['Phosphate (NaH₂PO₄ / Na₂HPO₄)', 'Same principle', 'Urine and ICF, where phosphate is high; unimportant in plasma'],
          ['Protein', 'Carboxyl groups release H⁺; amino groups accept it — proteins are amphoteric', 'The most plentiful and powerful buffers, in plasma and cells'],
        ],
      },
      keyPoints: [
        'Haemoglobin: CO₂ enters red cells and either forms carbaminohaemoglobin or, catalysed by carbonic anhydrase, forms H₂CO₃ → H⁺ + HCO₃⁻. Over 70% of the HCO₃⁻ leaves in exchange for Cl⁻ (the chloride or Hamburger shift); the H⁺ is buffered by haemoglobin, and deoxyhaemoglobin is the stronger base (slides 129–130).',
      ],
      sourceRefs: rs([121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131]),
    },
    {
      title: 'The lungs',
      kind: 'regulation',
      paragraphs: [
        'Respiration is slower than chemical buffers but has up to twice their combined buffering power. It regulates H₂CO₃ by controlling CO₂ elimination (slide 132). Accumulated CO₂ forms H₂CO₃ → H⁺ + HCO₃⁻ → acidosis; blowing off too much CO₂ lowers H⁺ → alkalosis (slide 133).',
        'Peripheral (carotid and aortic bodies) and central chemoreceptors detect CO₂ and drive the medullary respiratory centre to change the rate and depth of breathing (slide 134).',
      ],
      table: {
        columns: ['Hypercapnia → breathing increases', 'Hypocapnia → breathing decreases'],
        rows: [['Pneumonia, heart failure, hypoventilation from morphine, barbiturates or ethanol, breath-holding', 'Hyperventilation: salicylate toxicity, high room temperature, fever, hysteria']],
      },
      sourceRefs: rs([132, 133, 134, 135, 136]),
    },
    {
      title: 'The kidneys',
      kind: 'pathway',
      paragraphs: [
        'Only the kidneys can rid the body of non-volatile acids (phosphoric, sulphuric, uric) and they are the only organs that can efficiently correct alkalosis — slowly but surely. Losing HCO₃⁻ is the same as gaining H⁺; reabsorbing HCO₃⁻ is the same as losing H⁺ (slides 137–138).',
      ],
      steps: [
        { label: 'Reabsorbing filtered HCO₃⁻ (proximal tubule)', detail: 'Cells cannot take HCO₃⁻ directly. They secrete H⁺ (Na⁺/H⁺ antiport or H⁺-ATPase); in the lumen H⁺ + HCO₃⁻ → H₂CO₃ → CO₂ + H₂O, which enter the cell and re-form HCO₃⁻ (absorbed) and H⁺ (secreted). One secreted H⁺ = one Na⁺ and one HCO₃⁻ reabsorbed.' },
        { label: 'New HCO₃⁻ with H⁺ excretion (type A intercalated cells)', detail: 'Carbonic anhydrase makes H⁺ and HCO₃⁻ from CO₂; H⁺ is pumped into urine (buffered by phosphate and ammonium) and HCO₃⁻ goes to the blood via Cl⁻/HCO₃⁻ exchange. Aldosterone stimulates H⁺ secretion.' },
        { label: 'New HCO₃⁻ with NH₄⁺ excretion', detail: 'Each glutamine metabolised gives two NH₄⁺ (excreted) and two HCO₃⁻ (to the blood).' },
        { label: 'Secreting HCO₃⁻ in alkalosis (type B intercalated cells)', detail: 'The reverse of type A; even so, the nephron excretes less HCO₃⁻ than it keeps.' },
      ],
      keyPoints: ['H⁺ secretion happens mainly in the PCT and type A intercalated cells, and its rate rises and falls with ECF CO₂ (slide 150).'],
      sourceRefs: rs([137, 138, 139, 140, 142, 143, 144, 146, 148, 150]),
    },
    {
      title: 'Disorders and compensation',
      kind: 'clinical',
      table: {
        columns: ['Disorder', 'Cause', 'Findings'],
        rows: [
          ['Respiratory acidosis (commonest)', 'Hypoventilation: lung disease, chest nerve or muscle disease, drugs that slow breathing', 'pH < 7.35, PaCO₂ > 45 mmHg, HCO₃⁻ normal'],
          ['Respiratory alkalosis', 'Hyperventilation, most often anxiety', 'pH > 7.45, PaCO₂ < 35 mmHg, HCO₃⁻ normal'],
          ['Metabolic acidosis', 'Acid ingestion; excess acid (alcohol, anaerobic glycolysis in hypoxia, ketones in diabetes or starvation); kidneys unable to excrete acid; loss of base', 'HCO₃⁻ < 22 mEq/L, pH < 7.35, PaCO₂ normal'],
          ['Metabolic alkalosis', 'Loss of stomach acid, excess Na⁺ or K⁺ loss, renal H⁺ loss, gain of base', 'HCO₃⁻ > 26 mEq/L, pH > 7.45, PaCO₂ normal'],
        ],
      },
      keyPoints: [
        'Limits for life: pH 7.0–7.8. Below 7.0 the CNS is depressed → coma and death; above 7.8 nerves are overexcited → tetany, nervousness, convulsions, death from respiratory arrest (slides 157–158).',
        'Respiratory compensation for metabolic acidosis: faster breathing blows off CO₂, restoring the 20:1 HCO₃⁻ : H₂CO₃ ratio within minutes. Compensation for metabolic alkalosis (slower breathing) is limited (slides 159–160).',
        'Renal compensation: in respiratory acidosis the kidney conserves HCO₃⁻ and secretes H⁺; in respiratory alkalosis it reduces HCO₃⁻ reabsorption and production. K⁺–H⁺ exchange can limit this (slides 161–162).',
      ],
      sourceRefs: rs([152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162]),
    },
  ],
  summary: [
    'Arterial H⁺ ~40 nmol/L; pH 7.36–7.44. Volatile acid (CO₂) → lungs; non-volatile → kidneys.',
    'Buffers: bicarbonate (plasma), phosphate (urine, ICF), protein (most powerful; haemoglobin, chloride shift).',
    'Lungs: chemoreceptors adjust breathing to CO₂ — fast but limited.',
    'Kidneys: reabsorb HCO₃⁻ (PCT), make new HCO₃⁻ with H⁺ or NH₄⁺ excretion (type A cells), secrete HCO₃⁻ in alkalosis (type B).',
    'Respiratory: PaCO₂ changes, HCO₃⁻ normal. Metabolic: HCO₃⁻ changes, PaCO₂ normal.',
    'Life limits pH 7.0–7.8. Lungs compensate metabolic disorders; kidneys compensate respiratory ones.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: withSimulation(lesson.id, interactive[lesson.id]),
}));

// Physiology → Renal Physiology — the topic question bank.
//
// Rules: only what the lessons teach (the Renal System deck). Not asked:
// the exact pH cut-offs (7.35/7.36, 7.44/7.45) or PAH's exact extraction
// (see discrepancies), or anything from the "ai guide". IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/renal-physiology/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  multi('q1-01', 'urinary-system', 'Which are accessory structures of the urinary system? Select all that apply.', ['Ureters', 'Urinary bladder', 'Urethra'], ['Kidneys', 'Adrenal glands'], { explanation: 'Slide 1: the kidneys are the primary organs.' }),
  multi('q1-02', 'urinary-system', 'Which hormones or enzymes does the kidney produce? Select all that apply.', ['Renin', 'Erythropoietin'], ['Insulin', 'Aldosterone'], { explanation: 'Slide 4.' }),
  mcq('q1-03', 'kidney-structure', 'The kidneys lie…', 'Retroperitoneally on the posterior abdominal wall', ['Within the peritoneal cavity', 'In the pelvis', 'Anterior to the liver'], { explanation: 'Slide 5.' }),
  mcq('q1-04', 'kidney-structure', 'What passes through the renal hilum?', 'Renal artery, renal vein and ureter', ['Only the ureter', 'The adrenal vein', 'The renal pyramids'], { explanation: 'Slide 5.' }),
  // mcq('q1-05', 'kidney-structu… retired: the slide figure disagrees with Guyton (see discrepancies).
  // mcq('q1-06', 'nephron-types'… retired: the slide figure disagrees with Guyton (see discrepancies).
  mcq('q1-07', 'nephron-vessels', 'The vasa recta arise from…', 'Efferent arterioles of juxtamedullary nephrons', ['Afferent arterioles', 'The renal vein', 'Efferent arterioles of cortical nephrons only'], { explanation: 'Slide 13.' }),
  mcq('q1-08', 'nephron-vessels', 'Why is the glomerular endothelium exceptionally porous?', 'It is heavily fenestrated', ['It has no basement membrane', 'It lacks tight junctions only', 'It is made of podocytes'], { explanation: 'Slide 11.' }),
  order('q1-09', 'nephron-tubule', 'Order the parts of the renal tubule.', ['Bowman’s capsule', 'Proximal convoluted tubule', 'Loop of Henle', 'Distal convoluted tubule', 'Collecting duct'], { explanation: 'Slides 15–17.' }),
  mcq('q1-10', 'nephron-tubule', 'The renal corpuscle is…', 'The glomerulus with Bowman’s capsule', ['The loop of Henle', 'The collecting duct', 'The renal pyramid'], { explanation: 'Slide 15.', skill: 'terminology' }),
  mcq('q1-11', 'nephron-tubule', 'Each collecting duct drains up to how many nephrons?', 'Eight', ['Two', 'One hundred', 'One'], { explanation: 'Slide 17.' }),
  tf({ id: 'q1-12', conceptId: 'nephron-tubule', statement: 'The proximal and distal convoluted tubules lie entirely in the cortex.', answer: true, explanation: 'Slides 16–17.' }),
  mcq('q1-13', 'jga', 'The juxtaglomerular apparatus is formed by…', 'The distal tubule and the afferent arteriole', ['The PCT and the efferent arteriole', 'The collecting duct and vasa recta', 'The loop of Henle and the renal vein'], { explanation: 'Slide 20.' }),
  mcq('q1-14', 'jga', 'Juxtaglomerular (granular) cells are…', 'Modified smooth muscle cells in the afferent arteriole wall', ['Epithelial cells of the distal tubule', 'Podocytes', 'Cells of the collecting duct'], { explanation: 'Slide 20.' }),
];

const lesson2: Q[] = [
  multi('q2-01', 'filtration-barrier', 'Which are the three processes of urine formation? Select all that apply.', ['Glomerular filtration', 'Tubular reabsorption', 'Tubular secretion'], ['Glomerular secretion'], { explanation: 'Slide 23.' }),
  order('q2-02', 'filtration-barrier', 'Order the layers of the filtration barrier from blood to capsular space.', ['Fenestrated endothelium', 'Glomerular basement membrane', 'Podocytes with filtration slits'], { explanation: 'Slides 23–24.' }),
  mcq('q2-03', 'filtration-barrier', 'The glomerular filtrate is similar to plasma except that it is…', 'Protein-free', ['Glucose-free', 'Sodium-free', 'More concentrated'], { explanation: 'Slide 24.' }),
  mcq('q2-04', 'nfp', 'What is the normal glomerular blood hydrostatic pressure?', '55 mmHg', ['30 mmHg', '15 mmHg', '10 mmHg'], { explanation: 'Slide 26.' }),
  mcq('q2-05', 'nfp', 'Why is glomerular hydrostatic pressure so high?', 'The afferent and efferent arterioles differ in diameter', ['The glomerulus has no resistance', 'The renal vein is blocked', 'Plasma proteins push fluid out'], { explanation: 'Slide 26.', skill: 'cause-effect' }),
  mcq('q2-06', 'nfp', 'What is the normal net filtration pressure?', '10 mmHg', ['55 mmHg', '45 mmHg', '25 mmHg'], { explanation: 'Slides 26–27.' }),
  multi('q2-07', 'nfp', 'Which pressures oppose filtration? Select all that apply.', ['Blood colloid osmotic pressure', 'Capsular hydrostatic pressure'], ['Glomerular blood hydrostatic pressure'], { explanation: 'Slide 26.' }),
  mcq('q2-08', 'gfr', 'GFR equals…', 'Kf × NFP', ['NFP ÷ Kf', 'RPF × haematocrit', 'U × V'], { explanation: 'Slide 28.' }),
  multi('q2-09', 'gfr', 'GFR depends on… Select all that apply.', ['Surface area for filtration', 'Membrane permeability', 'Net filtration pressure'], ['Urine pH'], { explanation: 'Slide 28.' }),
  mcq('q2-10', 'autoregulation', 'Over what arterial pressure range does autoregulation hold GFR steady?', 'About 80–180 mmHg', ['About 20–60 mmHg', 'About 180–250 mmHg', 'At all pressures'], { explanation: 'Slide 29.' }),
  mcq('q2-11', 'autoregulation', 'Which cells mediate tubuloglomerular feedback?', 'Macula densa cells', ['Podocytes', 'Granular cells only', 'Principal cells'], { explanation: 'Slide 31.' }),
  multi('q2-12', 'autoregulation', 'Which vasodilators can the macula densa release when GFR falls? Select all that apply.', ['NO', 'Prostaglandins', 'Bradykinin'], ['Endothelin'], { explanation: 'Slide 33.' }),
  mcq('q2-13', 'autoregulation', 'The myogenic mechanism relies on…', 'Vascular smooth muscle contracting when stretched', ['Sympathetic nerves', 'Angiotensin II', 'Macula densa signals'], { explanation: 'Slide 30.' }),
  multi('q2-14', 'gfr-extrinsic', 'Which are actions of angiotensin II? Select all that apply.', ['Vasoconstriction', 'Thirst', 'ADH secretion', 'Aldosterone secretion'], ['Vasodilation of the afferent arteriole'], { explanation: 'Slide 37.' }),
  mcq('q2-15', 'gfr-extrinsic', 'How does angiotensin II reduce GFR through mesangial cells?', 'It contracts them, reducing the filtration surface area', ['It relaxes them', 'It destroys podocytes', 'It raises capsular pressure'], { explanation: 'Slide 37.' }),
  tf({ id: 'q2-16', conceptId: 'gfr-extrinsic', statement: 'Neural (sympathetic) control can override renal autoregulation.', answer: true, explanation: 'Slide 35.' }),
];

const lesson3: Q[] = [
  multi('q3-01', 'reabsorption-routes', 'By which mechanisms does tubular reabsorption occur? Select all that apply.', ['Osmosis', 'Diffusion', 'Active transport'], ['Filtration'], { explanation: 'Slide 44.' }),
  mcq('q3-02', 'reabsorption-routes', 'Why is paracellular reabsorption possible in the proximal nephron?', 'Its tight junctions are leaky', ['It has no epithelium', 'It has aquaporins only', 'It is lined by podocytes'], { explanation: 'Slide 42.' }),
  mcq('q3-03', 'sodium-reabsorption', 'What proportion of the kidney’s energy is used for Na⁺ transport?', '80%', ['20%', '50%', '5%'], { explanation: 'Slide 44.' }),
  mcq('q3-04', 'sodium-reabsorption', 'Where is the Na⁺/K⁺-ATPase located in tubular cells?', 'The basolateral membrane', ['The luminal membrane', 'The nucleus', 'The tight junctions'], { explanation: 'Slide 45.' }),
  tf({ id: 'q3-05', conceptId: 'sodium-reabsorption', statement: 'Sodium reabsorption shows a transport maximum.', answer: false, explanation: 'Slide 45: Na⁺ transport does not exhibit a Tm.', skill: 'misconception' }),
  mcq('q3-06', 'tm', 'Glucose and amino acids are reabsorbed by…', 'Secondary active transport with Na⁺', ['Simple diffusion', 'Primary active transport', 'Paracellular flow'], { explanation: 'Slide 46.' }),
  mcq('q3-07', 'tm', 'What does the tubular maximum (Tm) reflect?', 'The number of carriers available for a substance', ['The GFR', 'The plasma protein level', 'The speed of filtration'], { explanation: 'Slide 47.' }),
  mcq('q3-08', 'passive-reabsorption', 'Water reabsorption that follows solute reabsorption is called…', 'Obligatory water reabsorption', ['Facultative secretion', 'Osmotic diuresis', 'Countercurrent exchange'], { explanation: 'Slide 48.', skill: 'terminology' }),
  mcq('q3-09', 'passive-reabsorption', 'Water moves through which proteins?', 'Aquaporins', ['Na⁺/K⁺-ATPases', 'Connexins', 'Podocins'], { explanation: 'Slide 48.' }),
  mcq('q3-10', 'passive-reabsorption', 'Why is urea partly reabsorbed?', 'Water reabsorption concentrates it in the tubule', ['It is actively pumped', 'It binds glucose', 'It is secreted first'], { explanation: 'Slide 49.', skill: 'cause-effect' }),
  multi('q3-11', 'regional-reabsorption', 'What does the PCT reabsorb? Select all that apply.', ['65% of Na⁺ and water', '100% of glucose', '90% of HCO₃⁻'], ['All of the urea'], { explanation: 'Slide 51.' }),
  mcq('q3-12', 'regional-reabsorption', 'Which limb of the loop of Henle is impermeable to water?', 'The ascending limb', ['The descending limb', 'Both', 'Neither'], { explanation: 'Slide 52.' }),
  mcq('q3-13', 'regional-reabsorption', 'The main Na⁺ entry route in the thick ascending limb is…', 'The Na⁺-K⁺-2Cl⁻ co-transporter', ['Aquaporins', 'The Na⁺/H⁺ antiport only', 'ENaC'], { explanation: 'Slide 53.' }),
  match('q3-14', 'regional-reabsorption', 'Match each hormone to what it regulates in the distal nephron.', [
    ['Aldosterone', 'Na⁺'],
    ['ADH', 'Water'],
    ['PTH', 'Ca²⁺'],
    ['ANP', 'Na⁺ and water excretion'],
  ], { explanation: 'Slide 55.' }),
  multi('q3-15', 'secretion', 'Which substances are secreted by the tubule? Select all that apply.', ['H⁺', 'K⁺', 'Creatinine', 'Penicillin'], ['Glucose'], { explanation: 'Slides 58–59.' }),
  mcq('q3-16', 'secretion', 'Where is K⁺ actively secreted?', 'The distal and collecting tubules', ['The PCT', 'The glomerulus', 'The descending limb'], { explanation: 'Slide 60.' }),
  tf({ id: 'q3-17', conceptId: 'secretion', statement: 'High plasma K⁺ stimulates aldosterone secretion.', answer: true, explanation: 'Slide 62.' }),
];

const lesson4: Q[] = [
  mcq('q4-01', 'countercurrent-multiplier', 'Body fluids are kept at about what osmolality?', '300 mOsm', ['100 mOsm', '1200 mOsm', '150 mOsm'], { explanation: 'Slide 64.' }),
  mcq('q4-02', 'countercurrent-multiplier', 'A countercurrent multiplier…', 'Spends energy to create a concentration gradient', ['Uses no energy', 'Only exchanges water', 'Is found in the PCT'], { explanation: 'Slide 65.' }),
  mcq('q4-03', 'countercurrent-multiplier', 'What is the osmolality of filtrate at the bend of a long loop?', 'About 1200 mOsm', ['About 300 mOsm', 'About 100 mOsm', 'About 600 mOsm'], { explanation: 'Slide 66.' }),
  mcq('q4-04', 'countercurrent-multiplier', 'Which nephrons form the countercurrent multiplier?', 'Juxtamedullary nephrons with long loops', ['Cortical nephrons', 'All nephrons equally', 'Only the collecting ducts'], { explanation: 'Slide 65.' }),
  mcq('q4-05', 'countercurrent-multiplier', 'How does urea leave the inner medullary collecting duct?', 'By facilitated diffusion, enhanced by ADH', ['By active transport', 'It cannot leave', 'Through the vasa recta wall only'], { explanation: 'Slide 68.' }),
  mcq('q4-06', 'countercurrent-exchanger', 'Blood leaving the ascending vasa recta has an osmolality of about…', '325 mOsm/L', ['1200 mOsm/L', '100 mOsm/L', '300 mOsm/L exactly'], { explanation: 'Slide 72.' }),
  tf({ id: 'q4-07', conceptId: 'countercurrent-exchanger', statement: 'The vasa recta are freely permeable to both water and solute.', answer: true, explanation: 'Slide 72.' }),
  mcq('q4-08', 'adh-kidney', 'ADH acts on which cells of the collecting duct?', 'Principal cells', ['Intercalated cells', 'Podocytes', 'Granular cells'], { explanation: 'Slide 78.' }),
  mcq('q4-09', 'adh-kidney', 'Which second messenger does ADH use?', 'cAMP', ['IP₃', 'cGMP', 'Ca²⁺ only'], { explanation: 'Slide 78.' }),
  multi('q4-10', 'adh-kidney', 'What stimulates ADH secretion? Select all that apply.', ['Rising blood osmolarity', 'Angiotensin II'], ['Alcohol', 'Low osmolarity'], { explanation: 'Slide 79.' }),
  mcq('q4-11', 'adh-kidney', 'Absence of ADH causes…', 'Large volumes of dilute urine (diabetes insipidus)', ['Small volumes of concentrated urine', 'Glycosuria', 'Proteinuria'], { explanation: 'Slide 79.' }),
  mcq('q4-12', 'diuretics', 'Lasix acts on…', 'The thick ascending limb', ['The PCT', 'The collecting duct', 'The glomerulus'], { explanation: 'Slide 82.' }),
  mcq('q4-13', 'diuretics', 'How do caffeine and theophylline cause diuresis?', 'By inhibiting Na⁺ reabsorption', ['By inhibiting ADH', 'By osmotic effect', 'By raising GFR to zero'], { explanation: 'Slide 81.' }),
  multi('q4-14', 'diuretics', 'Diuretics are used to treat… Select all that apply.', ['Hypertension', 'Congestive heart failure', 'Menstrual fluid retention'], ['Dehydration'], { explanation: 'Slide 82.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'clearance', 'Renal clearance is…', 'The volume of plasma cleared of a substance per unit time', ['The amount of a substance excreted per day', 'The plasma concentration of a substance', 'The urine flow rate'], { explanation: 'Slide 83.', skill: 'terminology' }),
  mcq('q5-02', 'clearance', 'In clearance = UV/P, what is UV?', 'The excretion rate', ['The filtration rate', 'The plasma flow', 'The reabsorption rate'], { explanation: 'Slide 84.' }),
  mcq('q5-03', 'gfr-measurement', 'Why is inulin clearance equal to GFR?', 'Inulin is filtered but not reabsorbed, stored or secreted', ['Inulin is fully secreted', 'Inulin is made by the kidney', 'Inulin binds plasma proteins'], { explanation: 'Slide 85.' }),
  mcq('q5-04', 'gfr-measurement', 'A clearance of zero means the substance is…', 'Completely reabsorbed', ['Completely secreted', 'Not filtered', 'Equal to GFR'], { explanation: 'Slide 86.' }),
  mcq('q5-05', 'gfr-measurement', 'Creatinine is a byproduct of…', 'Muscle metabolism', ['Liver metabolism of fat', 'Haemoglobin breakdown', 'Nucleic acids'], { explanation: 'Slide 86.' }),
  tf({ id: 'q5-06', conceptId: 'gfr-measurement', statement: 'Inulin is endogenous, so it can be measured without infusing it.', answer: false, explanation: 'Slide 86: it is not endogenous and must be administered.', skill: 'misconception' }),
  mcq('q5-07', 'rpf', 'Which substance is used to estimate renal plasma flow?', 'PAH', ['Inulin', 'Creatinine', 'Glucose'], { explanation: 'Slide 88.' }),
  mcq('q5-08', 'rpf', 'Why can a peripheral vein sample replace a renal artery sample for PAH?', 'No organ except the kidney removes PAH', ['PAH is made in the veins', 'The renal artery has no PAH', 'PAH is not filtered'], { explanation: 'Slide 88.' }),
  mcq('q5-09', 'urine', 'What gives urine its yellow colour?', 'Urochrome (urobilin) from haemoglobin breakdown', ['Bilirubin glucuronide only', 'Creatinine', 'Urea'], { explanation: 'Slides 90–91.' }),
  mcq('q5-10', 'urine', 'Why does standing urine smell of ammonia?', 'Bacteria break down urea', ['Urine contains ammonia gas from the kidney', 'Creatinine decomposes', 'Glucose ferments'], { explanation: 'Slide 93.' }),
  mcq('q5-11', 'urine', 'What is the normal pH of urine?', 'About 6.0', ['About 7.4', 'About 2', 'About 9'], { explanation: 'Slide 94.' }),
  mcq('q5-12', 'urine', 'The normal specific gravity of urine is…', '1.001–1.035', ['0.9–1.0', '1.1–1.3', 'Exactly 1.000'], { explanation: 'Slide 94.' }),
  mcq('q5-13', 'urine', 'A vegetarian diet tends to make urine…', 'More alkaline', ['More acidic', 'No different', 'Cloudy'], { explanation: 'Slide 94.' }),
  multi('q5-14', 'urine', 'Which may indicate disease in urine? Select all that apply.', ['Blood proteins', 'White cells (pus)', 'Bile pigments'], ['Urea'], { explanation: 'Slide 97.' }),
];

const lesson6: Q[] = [
  mcq('q6-01', 'bladder', 'What lines the bladder?', 'Transitional epithelium', ['Simple columnar epithelium', 'Stratified squamous keratinised epithelium', 'Ciliated epithelium'], { explanation: 'Slide 99.' }),
  mcq('q6-02', 'bladder', 'The folds of the empty bladder wall are called…', 'Rugae', ['Villi', 'Plicae', 'Haustra'], { explanation: 'Slide 99.', skill: 'terminology' }),
  mcq('q6-03', 'bladder', 'The external urethral sphincter is made of…', 'Skeletal muscle', ['Smooth muscle', 'Cardiac muscle', 'Connective tissue only'], { explanation: 'Slide 100.' }),
  mcq('q6-04', 'bladder-nerves', 'The sympathetic supply to the bladder comes from which roots?', 'T12–L2', ['S2–S4', 'C5–T1', 'L4–S1'], { explanation: 'Slide 103.' }),
  mcq('q6-05', 'bladder-nerves', 'Which nerve contracts the detrusor?', 'The pelvic (parasympathetic) nerve', ['The hypogastric nerve', 'The pudendal nerve', 'The femoral nerve'], { explanation: 'Slide 104.' }),
  mcq('q6-06', 'bladder-nerves', 'Where are the motor neurons of the pudendal nerve?', 'Onuf’s nucleus in the sacral ventral horn', ['The pons', 'The lumbar dorsal horn', 'The hypothalamus'], { explanation: 'Slides 104–105.' }),
  mcq('q6-07', 'bladder-nerves', 'Sympathetic stimulation relaxes the detrusor through which receptors?', 'β receptors', ['α receptors', 'Muscarinic receptors', 'Nicotinic receptors'], { explanation: 'Slides 103–104: the bladder neck contracts via α receptors.' }),
  mcq('q6-08', 'storage-reflex', 'Which centre inhibits urination during filling?', 'The pontine storage centre', ['The cerebellum', 'Onuf’s nucleus', 'The medullary respiratory centre'], { explanation: 'Slide 109.' }),
  mcq('q6-09', 'voiding-reflex', 'Barrington’s centre is in the…', 'Rostral pons', ['Medulla', 'Sacral cord', 'Thalamus'], { explanation: 'Slide 111.' }),
  mcq('q6-10', 'voiding-reflex', 'About how much urine does the normal adult bladder hold?', '500 mL', ['50 mL', '2 L', '150 mL'], { explanation: 'Slide 113.' }),
  mcq('q6-11', 'voiding-reflex', 'About how much residual volume may remain after emptying?', '50 mL', ['500 mL', '0 mL always', '250 mL'], { explanation: 'Slide 113.' }),
  mcq('q6-12', 'voiding-reflex', 'Bladder pressure during filling is about…', '5–10 cm H₂O', ['50–100 cm H₂O', '120 mmHg', 'Zero'], { explanation: 'Slide 110.' }),
  tf({ id: 'q6-13', conceptId: 'voiding-reflex', statement: 'The cerebrum gives voluntary control mainly through the external sphincter.', answer: true, explanation: 'Slide 113.' }),
];

const lesson7: Q[] = [
  mcq('q7-01', 'acid-base-basics', 'What is the normal H⁺ concentration of arterial blood?', 'About 40 nmol/L', ['About 40 mmol/L', 'About 7.4 nmol/L', 'About 140 mmol/L'], { explanation: 'Slide 118.' }),
  mcq('q7-02', 'acid-base-basics', 'What is the pH of intracellular fluid?', 'About 7.0', ['About 7.4', 'About 6.0', 'About 8.0'], { explanation: 'Slide 119.' }),
  multi('q7-03', 'acid-base-basics', 'What are the three lines of defence for pH? Select all that apply.', ['Chemical buffers', 'Respiratory centres', 'Renal mechanisms'], ['The liver'], { explanation: 'Slide 120.' }),
  mcq('q7-04', 'buffers', 'When HCl is added to the bicarbonate buffer, what forms?', 'H₂CO₃ and NaCl', ['NaOH and CO₂', 'NaHCO₃ and water', 'Cl₂ and H₂'], { explanation: 'Slide 124.' }),
  mcq('q7-05', 'buffers', 'Where is the phosphate buffer most effective?', 'Urine and intracellular fluid', ['Plasma', 'CSF only', 'Bile'], { explanation: 'Slide 127.' }),
  mcq('q7-06', 'buffers', 'Which are the body’s most plentiful and powerful buffers?', 'Proteins', ['Bicarbonate', 'Phosphate', 'Ammonia'], { explanation: 'Slide 127.' }),
  mcq('q7-07', 'buffers', 'The chloride (Hamburger) shift is…', 'HCO₃⁻ leaving red cells in exchange for Cl⁻', ['Cl⁻ secretion in the stomach', 'Cl⁻ reabsorption in the loop of Henle', 'H⁺ entering red cells'], { explanation: 'Slide 130.', skill: 'terminology' }),
  mcq('q7-08', 'buffers', 'Which haemoglobin is the better H⁺ acceptor?', 'Deoxygenated haemoglobin', ['Oxygenated haemoglobin', 'Carboxyhaemoglobin', 'Methaemoglobin'], { explanation: 'Slide 130.' }),
  mcq('q7-09', 'respiratory-regulation', 'Compared with chemical buffers, the respiratory system…', 'Is slower but has up to twice their buffering power', ['Is faster and weaker', 'Is the only way to remove non-volatile acid', 'Has no effect on pH'], { explanation: 'Slide 132.' }),
  multi('q7-10', 'respiratory-regulation', 'Which cause hypocapnia from hyperventilation? Select all that apply.', ['Salicylate toxicity', 'Fever', 'Hysteria'], ['Morphine overdose'], { explanation: 'Slides 135–136.' }),
  mcq('q7-11', 'renal-acid-base', 'Which organs are the only ones that remove non-volatile acids?', 'The kidneys', ['The lungs', 'The liver', 'The skin'], { explanation: 'Slide 137.' }),
  mcq('q7-12', 'renal-acid-base', 'Which cells make new HCO₃⁻ while excreting H⁺?', 'Type A intercalated cells', ['Type B intercalated cells', 'Principal cells', 'Podocytes'], { explanation: 'Slide 142.' }),
  mcq('q7-13', 'renal-acid-base', 'Each glutamine metabolised in the tubule yields…', 'Two NH₄⁺ and two HCO₃⁻', ['One NH₄⁺ and one H⁺', 'Two urea', 'Four HCO₃⁻'], { explanation: 'Slide 146.' }),
  mcq('q7-14', 'renal-acid-base', 'Type B intercalated cells act in…', 'Alkalosis, secreting HCO₃⁻', ['Acidosis, secreting H⁺', 'Dehydration', 'Hyperkalaemia'], { explanation: 'Slide 148.' }),
  tf({ id: 'q7-15', conceptId: 'renal-acid-base', statement: 'Losing a HCO₃⁻ is equivalent to gaining a H⁺.', answer: true, explanation: 'Slide 138.' }),
  mcq('q7-16', 'acid-base-disorders', 'What is the most common acid–base disturbance?', 'Respiratory acidosis', ['Metabolic alkalosis', 'Respiratory alkalosis', 'Metabolic acidosis'], { explanation: 'Slide 153.' }),
  mcq('q7-17', 'acid-base-disorders', 'In metabolic acidosis, plasma HCO₃⁻ is…', 'Below 22 mEq/L', ['Above 26 mEq/L', 'Normal', 'Above 40 mEq/L'], { explanation: 'Slide 156.' }),
  mcq('q7-18', 'acid-base-disorders', 'The most common cause of respiratory alkalosis is…', 'Anxiety (hyperventilation)', ['Vomiting', 'Diabetes', 'Kidney failure'], { explanation: 'Slides 154–155.' }),
  multi('q7-19', 'acid-base-disorders', 'Which cause metabolic acidosis? Select all that apply.', ['Diabetic ketosis', 'Anaerobic glycolysis in hypoxia', 'Kidneys unable to excrete acid'], ['Loss of stomach acid'], { explanation: 'Slides 155–156.' }),
  mcq('q7-20', 'acid-base-disorders', 'What are the limits of blood pH compatible with life?', '7.0–7.8', ['6.0–9.0', '7.3–7.5', '6.8–7.0'], { explanation: 'Slide 157.' }),
  mcq('q7-21', 'acid-base-disorders', 'How do the lungs compensate for metabolic acidosis?', 'Faster, deeper breathing blows off CO₂', ['Slower breathing retains CO₂', 'They excrete H⁺ directly', 'They cannot compensate'], { explanation: 'Slide 159.' }),
  fill('q7-22', 'acid-base-disorders', 'Respiratory compensation restores the HCO₃⁻ : H₂CO₃ ratio to ____:1.', ['20'], { explanation: 'Slides 159–160.' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7];

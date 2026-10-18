// Sorts every HB2 past question into a topic, so learners can practise past
// questions one topic at a time (custom quiz, past question bank → By topic).
//
// Each question gets `tp` (a topic id from src/data/past-question-topics.ts)
// in public/curriculum/hb2-*.json. How a question is sorted:
//   1. Key words: each topic below lists words that point to it; the question
//      goes to the topic whose words it mentions most (the question itself
//      counts double, its options and explanation once). True/false statements
//      that share a stem are sorted together, by the stem and all its statements.
//   2. Paper hints: a paper about named topics (e.g. "CVS & Respiratory") can
//      only use those topics.
//   3. Decisive words: a question naming e.g. the scapula is Upper Limb.
//   4. Neighbours: papers are written in blocks by system, so a weakly sorted
//      question between two questions of the same topic joins them.
//   5. Hand corrections (OVERRIDES), from reading every question.
// Anything left goes to "other".
//
// Safe to run again (it rewrites `tp`). After adding past questions, run it,
// check the counts it prints, and look at a topic with --samples <topic id>.
//
// Usage:  node scripts/sort-past-questions-by-topic.mjs [--samples <topic id>]

import { readFileSync, writeFileSync } from 'fs';

// Order matters only for ties: earlier topics win.
const TOPICS = {
  'hb2-biochemistry': {
    'fatty-acid-biosynthesis': ['fatty acid', 'malonyl', 'acetyl-?coa carboxylase', 'palmit', 'fatty acid synthase', 'acyl carrier', '\\bACP\\b', 'elongation of fatty', 'desaturase', 'beta[- ]oxidation', 'β-oxidation', 'carnitine', 'ketone bod', 'ketogenesis', 'triacylglycerol', 'lipogenesis', 'citrate shuttle'],
    'cholesterol-and-bile-biosynthesis': ['cholesterol', 'HMG-?CoA', 'mevalon', 'squalene', 'lanosterol', 'bile (acid|salt)', 'statin', 'lipoprotein', '\\bLDL\\b', '\\bHDL\\b', '\\bVLDL\\b', 'isoprene'],
    'amino-acid-metabolism': ['amino acid', 'transamina', 'aminotransferase', 'urea cycle', '\\burea\\b', 'ammonia', 'glutamine', 'glutamate', 'methionine', 'cysteine', 'sulphur|sulfur', 'carbon skeleton', 'glucogenic', 'ketogenic', 'deamination', 'S-adenosyl'],
    'blood-coagulation-and-fibrinolysis': ['coagulation', 'clott', 'fibrin', 'thrombin', 'prothrombin', 'platelet', 'factor (V|VII|VIII|IX|X|XI|XII|XIII)\\b', 'haemophilia|hemophilia', 'vitamin K', 'plasmin', 'haemostasis|hemostasis', 'von Willebrand', 'bleeding', 'thrombo', 'anticoagul', 'heparin', 'warfarin', 'tissue factor'],
    'collagen-synthesis': ['collagen', 'elastin', 'hydroxyprolin', 'hydroxylysin', 'lysyl', 'procollagen', 'tropocollagen', 'scurvy', 'Ehlers', 'osteogenesis imperfecta', 'Marfan', 'fibrillin', 'desmosine', 'triple helix', 'ascorbic|vitamin C', 'lathyr', 'aminopropionitrile'],
    'hormones-endocrine-biochemistry': ['hormone', 'endocrine', 'insulin', 'glucagon', 'thyro', 'cortisol', 'steroid', 'second messenger', 'cAMP', 'G[- ]protein', 'pituitary', 'hypothalam', 'adrenal', 'receptor tyrosine', 'paracrine', 'autocrine', 'feedback'],
    'free-radicals-and-oxygen-toxicity': ['free radical', 'reactive oxygen', '\\bROS\\b', 'superoxide', 'antioxidant', 'glutathione', 'catalase', 'peroxidase', 'oxidative stress', 'peroxidation', 'hydroxyl radical'],
    'heme-metabolism': ['haem(?!o)|heme(?!o)', 'porphyr', '\\bALA\\b', 'aminolev', 'bilirubin', 'jaundice', 'biliverdin', 'haem oxygenase|heme oxygenase', 'urobilin', 'stercobilin', 'ferrochelatase', 'protoporphyrin', 'glucuronid'],
    immunology: ['antibod', 'antigen', 'immun', 'cytokine', 'interleukin', 'complement', '\\bT[- ]?cell', '\\bB[- ]?cell', 'lymphocyte', '\\bMHC\\b', 'HLA', 'hypersensitiv', 'vaccin', '\\bIg[AGEMD]\\b', 'macrophage', 'interferon', 'autoimmun', 'tolerance', 'chemokine', 'neutrophil', 'phagocyt', 'inflammat', 'allerg', 'opsoni', 'natural killer|\\bNK\\b', 'dendritic', 'serolog', 'ELISA', 'agglutinat', 'infection', 'malaria', 'parasit', 'virulence', 'toxin', 'bacteri', 'vir(us|al)', 'pattern recognition', '\\bTLR', 'microbicid', 'NADPH oxidase', 'respiratory burst', 'serum', 'globulin'],
    'inborn-errors-of-metabolism': ['inborn', 'phenylketon', '\\bPKU\\b', 'alkapton', 'albinism', 'maple syrup', 'galactos', 'homocystin', 'glycogen storage', 'Tay[- ]Sachs', 'Gaucher', 'lysosomal storage', 'enzyme deficien', 'autosomal recessive', 'newborn screening'],
    'nucleic-acids': ['\\bDNA\\b', '\\bRNA\\b', 'mRNA', 'tRNA', 'replicat', 'transcri', 'translat', 'codon', 'purine', 'pyrimidine', 'nucleotide', 'nucleoside', '\\bgene', 'mutation', 'recombinant', '\\bPCR\\b', 'restriction (enzyme|endonuclease)', 'plasmid', 'oncogene', 'tumou?r suppressor', 'cancer', 'operon', 'promoter', 'ribosom', 'uric acid', 'gout', 'helicase', 'polymerase', 'cloning', 'genetic code', 'exon', 'intron', 'splic', 'telomer', 'Okazaki', 'lac ', 'orot', 'CAD protein', 'azaserine', 'carbamoyl', 'transcarbamoylase', '\\b[IGA]MP\\b', 'HGPRT', 'Lesch', 'salvage', 'vector', 'cDNA'],
    'oxygen-carriers': ['haemoglobin|hemoglobin', 'myoglobin', 'oxygen dissociation', 'dissociation curve', '2,3-?BPG|2,3-?DPG|bisphosphoglycerate', 'Bohr', 'sickle', 'thalass', '\\bHbF\\b|\\bHbA|\\bHbS\\b|fetal haemoglobin|foetal haemoglobin', 'oxygen binding', 'cooperativ', 'methaemoglobin|methemoglobin', 'carboxyhaemoglobin|carbon monoxide', 'oxygen', 'distal histidine|proximal histidine'],
    'vitamin-a-and-vision': ['vitamin A', 'retin', 'rhodopsin', 'phototransduction', 'opsin', '\\bcones?\\b', '\\brods?\\b', 'visual', 'vision', 'transducin', 'photoreceptor', 'night blind', 'carotene', 'xerophthalmia', 'cGMP'],
  },
  'hb2-physiology': {
    'cardiovascular-physiology': ['heart', 'cardiac', 'ventric', 'atri(um|al|a)\\b', 'coronary', 'blood pressure', 'arterial pressure', 'arteriol', 'capillar', 'venous', '\\bveins?\\b', 'stroke volume', 'Starling', 'ECG|electrocardiogram', 'sinoatrial|SA node|AV node', 'Purkinje', 'baroreceptor', 'vasoconstrict', 'vasodilat', 'circulation', 'systol', 'diastol', 'heart sound', 'aort', 'cardiac output', 'Fick', 'peripheral resistance', 'sphygmomanometer', 'myocard', 'hypertension', 'lymph', 'blood flow', 'flow', 'resistance', 'oedema|edema', 'perfusion', 'pulse', 'electrical axis', '\\bleads?\\b', 'auscultat', 'mitral|tricuspid', 'valve', 'kal(a)?emia', 'extrasystol', 'pacemaker', 'compensatory pause', 'hyperaemia|hyperemia', 'haemorrhage|hemorrhage', 'blood volume', 'carotid sinus', 'vasomotor', 'exercise', 'cardiomyocyte|cardiomiocyte'],
    'respiratory-physiology': ['respirat', 'lung', 'alveol', 'ventilation', 'tidal volume', 'vital capacity', 'spiromet', 'surfactant', 'compliance', 'pleura', 'bronch', 'inspirat', 'expirat', 'breath', 'apnoea|apnea', 'hypox', 'P(a)?O2|PCO2|PaCO2', 'carbon dioxide', 'oxygen', 'chemoreceptor', 'diaphragm', 'airway', 'dead space', 'residual volume', 'altitude', 'pulmonary', 'CO2', 'cyanosis', 'dissociation curve', 'FEV', 'diver|depth|Caisson', 'cough', 'emphysema|asthma|pneumothorax', 'V/Q', 'chloride shift'],
    'central-nervous-system': ['brain', 'cerebr', 'cerebell', 'spinal cord', 'basal ganglia', 'thalam', 'cortex', 'reflex', 'synap', 'neurotransmitter', 'motor neuron', 'pain', 'sensory', 'nocicept', 'somatosens', 'sleep', '\\bEEG\\b', 'memory', 'autonomic', 'sympathetic', 'parasympathetic', 'neuron', 'nerve', 'muscle spindle', 'Golgi tendon', 'posture', 'limbic', 'brainstem|brain stem', 'medulla oblongata', 'pons', 'CSF|cerebrospinal'],
    endocrinology: ['hormone', 'endocrine', 'pituitary', 'hypothalam', 'thyro', 'insulin', 'glucagon', 'cortisol', 'adrenal', 'aldosterone', 'growth hormone', 'prolactin', 'oxytocin', 'ADH|vasopressin|antidiuretic', 'parathyroid|PTH', 'calcitonin', 'diabetes', 'feedback', 'glucocorticoid', 'catecholamine', 'adrenaline|epinephrine', 'ACTH', 'TSH', 'melatonin'],
    'gastrointestinal-physiology': ['gastr', 'stomach', 'intestin', 'digest', 'saliva', 'oesophag|esophag', 'swallow', 'pancrea', 'bile', 'liver', 'hepat', 'colon', 'defecat', 'peristal', 'absorption', 'secretin', 'cholecystokinin|CCK', 'HCl|hydrochloric', 'pepsin', 'parietal cell', 'chyme', 'gut', 'vomit'],
    'metabolism-and-temperature': ['temperature', 'heat', 'thermo', 'sweat', 'shiver', 'fever', 'cold|overcooling', 'metabolic rate|\\bBMR\\b', 'respiratory quotient|\\bRQ\\b', 'energy', 'calori', 'nitrogen balance', 'specific dynamic', 'fat stores|brown fat', 'metabolism', 'appetite|obesity|starvation', 'oxygen consumption', 'glycogen', 'fatty acids', 'cholesterol', 'amino acids', 'vitamin'],
    'renal-physiology': ['renal', 'kidney', 'nephron', 'glomerul', '\\bGFR\\b', 'tubul', 'urin', 'micturition', 'bladder', 'clearance', 'loop of Henle', 'collecting duct', 'countercurrent', 'diuresis|diuretic', 'acid[- ]base', 'bicarbonate', 'creatinine', 'juxtaglomerular', 'renin', 'filtration fraction', 'reabsorption', 'osmolar'],
    'reproductive-physiology': ['reproduct', 'testos', 'oestrogen|estrogen', 'progesterone', 'ovar', 'testis|testes|testicular', 'sperm', 'menstru', 'ovulat', 'pregnan', 'placenta', 'lactation', 'puberty', 'menopause', '\\bFSH\\b', '\\bLH\\b', 'GnRH', 'uter', 'fertili', 'corpus luteum', 'follic', 'hCG|chorionic', 'contracept', 'erection|ejaculat', 'parturition'],
    'special-senses': ['\\beye', 'retina', 'lens', 'visual', 'vision', 'cornea', 'pupil', 'accommodation', 'myopia|hypermetropia|presbyopia', '\\bear\\b', 'cochlea', 'hearing', 'sound', 'auditory', 'vestibul', 'taste', 'gustat', 'olfact', 'smell', 'rods?\\b|cones?\\b', 'photoreceptor', 'tympanic', 'ossicle', 'organ of Corti', 'semicircular', 'decibel'],
    blood: ['blood cell', 'erythro', 'red (blood )?cell|\\bRBC', 'haematocrit|hematocrit', 'haemoglobin|hemoglobin', 'anaemia|anemia', 'leucocyte|leukocyte|white (blood )?cell', 'neutrophil', 'lymphocyte', 'platelet', 'coagulat', 'clott', 'blood group|ABO|Rh(esus)?\\b', 'transfusion', 'plasma protein', 'albumin', '\\bESR\\b|sedimentation', 'iron', 'B12|folate', 'haemolysis|hemolysis', 'spleen', 'bone marrow', 'immun', 'antibod'],
  },
  'hb2-anatomy': {
    embryology: ['embryo', 'foetus|fetus|foetal|fetal', 'placenta', 'develop', 'congenital', 'notochord', 'somite', 'neural crest', 'neural tube', 'trophoblast', 'blastocyst', 'implantation', 'fertili[sz]', 'gastrulation', 'primitive (streak|knot|node|heart|gut)', 'pharyngeal (arch|pouch)', 'cloning', '\\bIVF\\b|in vitro fertili', 'assisted (conception|reproduct)', 'twin', 'oogenesis', 'spermatogenesis', 'spermatogon', 'spermatid', 'spermatocyte', 'oocyte', 'ovulation', 'corpus luteum', 'chorion', 'amnio', 'yolk sac', 'allantois', 'mesoderm', 'ectoderm', 'endoderm', 'mesonephr', 'paramesonephr', 'pronephros', 'metanephr', 'ureteric bud', 'cleft', 'contracept', 'pregnan', 'decidua', 'zygote', 'morula', 'cleavage', 'gonadotrophin|gonadotropin', 'teratoma', 'polysperm', 'capacitation', 'acrosom', 'hydatidiform|hyadatiform|molar pregnancy', 'spina bifida', 'Fallot', 'Hirschsprung|Hirschprung', 'pyloric stenosis', 'umbilical', 'infertil', 'follicle', 'Mullerian|Müllerian', 'gonad', 'newborn|neonat|baby|paediatric'],
    histology: ['epitheli', 'cartilag', 'connective tissue', 'microanatomy', 'specimen', 'histolog', 'fibroblast', 'adipose|fat cell', 'brown fat', 'osteon|haversian', 'osteoblast|osteoclast|osteocyte', 'goblet', 'gland', 'secretion', 'merocrine|apocrine|holocrine', 'microvilli|cilia|stereocilia', 'tight junction|desmosome|gap junction|zonula|macula adherens', 'basement membrane|basal lamina', 'lymph node', 'thymus', 'spleen', 'tonsil', 'Peyer', 'lymphoid', 'lymphatic', 'muscle fib', 'skeletal muscle|smooth muscle|cardiac muscle', 'nervous tissue', 'neuron', 'neuroglia', 'glycosaminoglycan', 'collagen', 'elastic fib', 'reticular fib', 'stratified|squamous|columnar|cuboidal|pseudostratified|transitional', 'keratin', 'dermis|epidermis', 'capillar', 'endometri', 'renal corpuscle|podocyte|nephron|collecting duct|convoluted tubule', 'islets? of Langerhans', 'adrenal', 'thyroid', 'parathyroid', 'pineal', 'hypophys|pituitary', 'seminal vesicle|prostate|epididym|efferent ductule|vas deferens', 'ovary|ovarian', 'Sertoli|Leydig', 'mucosa|submucosa|muscularis|serosa|lamina propria', 'olfactory', 'paranasal', 'larynx', 'trachea', 'bronch', 'alveol', 'tongue', 'papilla', 'urethra', 'ureter', 'urinary bladder', 'Kupffer|hepatocyte|sinusoid', 'medulla', 'cortex'],
    'general-anatomy': ['system', 'anatomical', 'terminolog', 'region', 'bone', 'vertebra', 'skull', 'cranium|cranial', 'suture', 'fontanelle', 'sternum', '\\bribs?\\b', 'pelvis|pelvic', 'sacrum', 'coccyx', 'femur', 'tibia', 'fibula', 'patella', 'foot|tarsal|metatars', 'joint', 'articul', 'ligament', 'scoliosis|kyphosis|lordosis', 'curvature', 'hyoid', 'axial skeleton', 'appendicular', 'anatomical position', 'plane', 'foramen|fissure|fossa|condyle|tubercle|process', 'mandible|maxilla', 'atlas|axis', 'skeleton', 'ossification'],
    'upper-limb': ['upper limb', 'clavicle', 'scapula', 'humerus', 'radius', 'ulna', 'carpal', 'metacarp', 'phalan', 'axilla', 'brachial', 'shoulder', 'elbow', 'wrist', '\\bhand\\b', 'forearm', '\\barm\\b', 'deltoid', 'biceps', 'triceps', 'rotator cuff', 'median nerve', 'ulnar nerve', 'radial nerve', 'axillary nerve', 'musculocutaneous', 'cubital', 'carpal tunnel', 'pectoral'],
    'cardiovascular-system-gross': ['heart', 'cardiac', 'pericardi', 'coronary', 'aort', 'ventric', 'atri(um|al|a)\\b', 'mitral|tricuspid', 'vena cava', 'artery|arteries', 'vein', 'circulat'],
    'respiratory-system-gross': ['lung', 'pleura', 'diaphragm', 'thoracic (cage|wall|cavity)', 'mediastin', 'intercostal', 'nasal cavity', 'pharynx'],
    'gastrointestinal-system-gross': ['stomach', 'oesophag|esophag', 'duoden', 'jejun', 'ileum', 'caecum|cecum', 'appendix', 'colon', 'rectum', 'anal canal', 'liver', 'gall ?bladder', 'pancrea', 'peritone', 'mesentery', 'omentum', 'intestin', 'barium', 'abdominal', 'inguinal', 'hernia'],
  },
};

// Papers about named topics: their questions can only be sorted into those topics.
const PAPER_TOPICS = {
  'hb2-biochemistry': {
    'Collagen & Phototransduction': ['collagen-synthesis', 'vitamin-a-and-vision'],
    'Haem, Haemoglobin & Haemostasis': ['heme-metabolism', 'oxygen-carriers', 'blood-coagulation-and-fibrinolysis'],
    'Hormones & Endocrine System': ['hormones-endocrine-biochemistry'],
    Immunology: ['immunology'],
  },
  'hb2-physiology': {
    'CVS & Respiratory': ['cardiovascular-physiology', 'respiratory-physiology', 'blood'],
    'Cardiovascular Physiology': ['cardiovascular-physiology'],
  },
  'hb2-anatomy': {
    'Anatomy Part 1 · Single-answer': ['embryology'],
    'Anatomy Part 2 · Matching': ['embryology'],
    'Anatomy Part 10 · True/False Section J': ['histology', 'embryology'],
    'Histology Practical': ['histology'],
  },
};

// Decisive words: a question whose own text names one of these goes to that topic
// whatever else it mentions (an upper-limb bone is Upper Limb, not general bones).
const DECISIVE = {
  'hb2-anatomy': {
    'upper-limb': ['clavicle', 'scapula', 'humerus', 'radius', 'ulna', 'carpal', 'metacarp', 'thumb', 'axillary', 'brachial', 'upper (limb|extremit)'],
    histology: ['osteon', 'ossification', 'cartilag', 'microscop', 'microanatomy', 'epitheli', 'specimen'],
  },
};

// Checked by hand: questions the rules above sort wrongly (question id → topic).
// A question id is the same in every paper it appears in; a correction for one
// true/false statement applies to its whole stem.
const OVERRIDES = {
  'hb2-biochemistry': {},
  'hb2-physiology': {
    b33a47: 'endocrinology', '3af051': 'endocrinology', '6de97c': 'endocrinology', '13fa1e': 'endocrinology',
    '1a0c77': 'reproductive-physiology', '44e7a2': 'reproductive-physiology', '0824c7': 'reproductive-physiology', '0c36da': 'reproductive-physiology', '22e107': 'reproductive-physiology', fb6896: 'reproductive-physiology', '26acfa': 'reproductive-physiology', f6c59c: 'reproductive-physiology',
    '8ade28': 'respiratory-physiology', '2dac95': 'respiratory-physiology', '6049fb': 'respiratory-physiology',
    da59fc: 'cardiovascular-physiology', '002710': 'cardiovascular-physiology', '5c286a': 'cardiovascular-physiology', '116afe': 'cardiovascular-physiology', b7aef7: 'cardiovascular-physiology', d3873b: 'cardiovascular-physiology', bccd05: 'cardiovascular-physiology', '57bec0': 'cardiovascular-physiology', '6b3495': 'cardiovascular-physiology', '355065': 'cardiovascular-physiology', fa32c4: 'cardiovascular-physiology', '164b46': 'cardiovascular-physiology', edd71c: 'cardiovascular-physiology',
    e00212: 'central-nervous-system', '6c81df': 'central-nervous-system', '3db7fb': 'central-nervous-system',
    b8155b: 'metabolism-and-temperature', '7ce32a': 'metabolism-and-temperature', '79927b': 'metabolism-and-temperature', abe281: 'metabolism-and-temperature', '6af61a': 'metabolism-and-temperature', '54039d': 'metabolism-and-temperature',
    d42b80: 'gastrointestinal-physiology', '9af00f': 'gastrointestinal-physiology', '60ca96': 'gastrointestinal-physiology', f7b7be: 'gastrointestinal-physiology', '8f726f': 'gastrointestinal-physiology', ba76f7: 'gastrointestinal-physiology', '0519a1': 'gastrointestinal-physiology', '26cd28': 'gastrointestinal-physiology', '3ab50e': 'gastrointestinal-physiology', '601ef6': 'gastrointestinal-physiology', '4e6b0b': 'gastrointestinal-physiology', '6334f4': 'gastrointestinal-physiology', f0fb70: 'gastrointestinal-physiology',
    e13546: 'renal-physiology', c71ea1: 'renal-physiology', c605fa: 'renal-physiology', '96e182': 'renal-physiology', '3534cc': 'renal-physiology', a311f0: 'renal-physiology', '0e802d': 'renal-physiology', acb051: 'renal-physiology', fb5546: 'renal-physiology', '12a422': 'renal-physiology', '608a0e': 'renal-physiology', '7846a5': 'renal-physiology', '83245d': 'renal-physiology', ec23fe: 'renal-physiology', dadbe5: 'renal-physiology', '12a874': 'renal-physiology', '9ff3a5': 'renal-physiology', b580a4: 'renal-physiology', '8a7f15': 'renal-physiology', b1469c: 'renal-physiology', '384839': 'renal-physiology', '4d7130': 'renal-physiology', '182c02': 'renal-physiology', '626062': 'renal-physiology', fde222: 'renal-physiology', d15b70: 'renal-physiology',
    '1fd1cc': 'special-senses', '7a08f1': 'special-senses', '19a2bd': 'special-senses',
    '1a87a4': 'other',
  },
  'hb2-anatomy': {
    ed5c22: 'general-anatomy', b92f3c: 'general-anatomy', '19ba0c': 'general-anatomy', '83880b': 'general-anatomy', '9be734': 'general-anatomy', '5b94b9': 'general-anatomy',
    '02b2ec': 'general-anatomy', c4fb3b: 'general-anatomy', '9e56f6': 'general-anatomy', '602c7b': 'general-anatomy', d6b5b6: 'general-anatomy', def0e8: 'general-anatomy', '7a23d3': 'general-anatomy', '99fe1e': 'general-anatomy', '817db4': 'general-anatomy', '6f7c28': 'general-anatomy', '9799b3': 'general-anatomy', f6085d: 'general-anatomy',
    '20b7b6': 'histology',
    '6126ff': 'gastrointestinal-system-gross', '0d8d66': 'gastrointestinal-system-gross',
  },
};

const OPTIONS_WEIGHT = 1;
const QUESTION_WEIGHT = 2;

const compiled = Object.fromEntries(
  Object.entries(TOPICS).map(([bank, topics]) => [bank, Object.entries(topics).map(([id, words]) => ({ id, res: words.map((w) => new RegExp(w, 'i')) }))])
);

/** Adds each topic's score for `text`: each of its words counts once. */
function scores(text, topics, weight, into) {
  for (const topic of topics) {
    const n = topic.res.filter((re) => re.test(text)).length;
    into[topic.id] = (into[topic.id] ?? 0) + n * weight;
  }
}

function best(total, allowed) {
  let topic = 'other';
  let top = 0;
  for (const id of allowed) if ((total[id] ?? 0) > top) { top = total[id]; topic = id; }
  return { topic, top };
}

const plain = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ');
const isTrueFalse = (q) => q.o.length === 2 && /^true$/i.test(q.o[0]);
/** The shared stem of a true/false statement ("Collagen is: …", "Stem\n\n(A) …"). */
function stemOf(q) {
  if (!isTrueFalse(q)) return null;
  const text = plain(q.q).replace(/^\(Stem was [^)]*\)\s*/, '');
  const cut = text.search(/\n|: | \([A-E]\) /);
  return cut > 3 ? text.slice(0, cut) : null;
}

const samplesFor = process.argv.includes('--samples') ? process.argv[process.argv.indexOf('--samples') + 1] : null;

for (const bankId of Object.keys(TOPICS)) {
  const path = `public/curriculum/${bankId}.json`;
  const bank = JSON.parse(readFileSync(path, 'utf8'));
  const topics = compiled[bankId];
  const counts = {};
  for (const set of bank.sets) {
    const label = set.name.replace(/^.*? — /, '');
    const allowed = PAPER_TOPICS[bankId][label] ?? topics.map((topic) => topic.id);
    // Group consecutive true/false statements that share a stem.
    const groups = [];
    for (const q of set.questions) {
      const stem = stemOf(q);
      const last = groups[groups.length - 1];
      if (stem && last?.stem === stem) last.items.push(q);
      else groups.push({ stem, items: [q] });
    }
    for (const group of groups) {
      group.total = {};
      for (const q of group.items) {
        scores(plain(q.q), topics, QUESTION_WEIGHT, group.total);
        scores(`${q.o.map(plain).join(' \n ')} \n ${plain(q.e)}`, topics, OPTIONS_WEIGHT, group.total);
      }
      Object.assign(group, best(group.total, allowed));
      const stemText = plain(group.stem ?? group.items[0].q);
      for (const [topic, words] of Object.entries(DECISIVE[bankId] ?? {})) {
        if (allowed.includes(topic) && words.some((word) => new RegExp(word, 'i').test(stemText))) {
          group.topic = topic;
          group.decisive = true;
          break;
        }
      }
      if (allowed.length === 1) group.topic = allowed[0];
    }
    // Papers are written in blocks by system: a weakly sorted question between two
    // questions of the same topic joins them.
    groups.forEach((group, i) => {
      const before = groups[i - 1]?.topic;
      const after = groups[i + 1]?.topic;
      if (group.decisive || !before || before !== after || before === group.topic || before === 'other') return;
      if (group.topic === 'other' || (group.total[before] ?? 0) > 0 || group.top <= 3) group.smoothed = before;
    });
    for (const group of groups) {
      const corrected = group.items.map((q) => OVERRIDES[bankId][q.id]).find(Boolean);
      for (const q of group.items) {
        q.tp = corrected ?? group.smoothed ?? group.topic;
        counts[q.tp] = (counts[q.tp] ?? 0) + 1;
        if (samplesFor === q.tp) console.log(`  [${set.id}] ${plain(q.q).replace(/\s+/g, ' ').slice(0, 150)}`);
      }
    }
  }
  writeFileSync(path, JSON.stringify(bank));
  console.log(`\n${bankId}:`, Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id} ${n}`).join(' · '));
}

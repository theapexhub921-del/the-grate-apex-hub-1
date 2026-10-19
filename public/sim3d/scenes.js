// Scenes for /sim3d/organ.html: which atlas models and parts each simulation shows, and which
// groups of parts can move or glow. Names are matched against a part's full name chain
// ("left ventricle / heart.g / ..."), lower case.

// Must match MODEL_VERSION in /atlas/anatomy.html so the browser reuses saved models
// (tests/deploy-wiring.test.mjs checks this).
export const MODEL_VERSION = '1';

// Tissue colours, from the part's name.
const RULES = [
  [/pleura/, '#cfe3ef'],
  [/lung|lobe of/, '#c9878e'],
  [/leaflet|cusp|chorda/, '#efe2cc'],
  [/^(left |right )?(ventricle|atrium)|^[^/]*papillary|^[^/]*auricle/, '#7e2422'],
  [/pulmonary vein/, '#b01e24'],
  [/pulmonary trunk|pulmonary arter/, '#2f3f8f'],
  [/vena|vein|venous|sinus(?!.*carotid)/, '#2f3f8f'],
  [/aort|arter|carotid|basilar|trunk/, '#b01e24'],
  [/nerve|ganglion|plexus|cord.*nerve|root of/, '#e8c95a'],
  [/spinal cord/, '#e9dccb'],
  [/caudate|putamen|pallidus|lentiform|thalam|nigra|nucleus/, '#a98d86'],
  [/cerebell/, '#c99a95'],
  [/pons|medulla|midbrain|brainstem|peduncle/, '#d8b8a8'],
  [/cerebr|gyrus|lobe|brain|cortex/, '#ddb5b0'],
  [/trachea|bronch|larynx/, '#eadfcc'],
  [/kidney|renal/, '#8f3b32'],
  [/ureter|urethra/, '#e3cfae'],
  [/bladder/, '#d99a8a'],
  [/liver/, '#7a2e22'],
  [/stomach|duoden|jejun|ileum|colon|caecum|cecum|rectum|oesoph|esoph|intestin/, '#d98c80'],
  [/pancrea/, '#e7c08a'],
  [/thyroid|parathyroid|suprarenal|adrenal|hypophysis|pineal|gland/, '#c98a5e'],
  [/eye|sclera|cornea|lens|retina/, '#efe9e2'],
  [/bone|vertebra|rib|sternum|femur|tibia|fibula|patella|skull/, '#efe3cc'],
  [/muscle|vastus|rectus|quadriceps/, '#a8433f'],
  [/uter|ovar|tube|vagina|testis|epididym|prostat|penis|scrot/, '#d78f86'],
];
export function colourFor(chain) {
  for (const [re, c] of RULES) if (re.test(chain)) return c;
  return '#c46a5e';
}

const HEART_VESSELS = [
  /^(ascending aorta|aortic arch 1|pulmonary trunk 1|bifurcation of pulmonary trunk|superior vena cava 1|inferior vena cava \(thoracic part\) 1|(right|left) (superior|inferior) pulmonary vein 1|.*coronary artery.*|anterior interventricular artery.*|septal branches of anterior interventricular artery|right inferolateral branch of right coronary artery|circumflex artery of heart.*|great cardiac vein|middle cardiac vein|inferior vein of left ventricle.*|coronary sinus 1)$/,
];

const NECK_VESSELS = /^(internal jugular vein\.?(r|l)|external jugular vein\.?(r|l)|right common carotid artery|left common carotid artery|external carotid artery\.?(r|l)|internal carotid artery\.?(r|l)|right brachiocephalic vein.*|left brachiocephalic vein.*|brachiocephalic trunk.*|aortic arch.*)( \d+)?$|^(branches|carotid sinus|carotid body)/;

const NECK_ARTERIES = /^(right common carotid artery|left common carotid artery|external carotid artery\.?(r|l)|internal carotid artery\.?(r|l)|brachiocephalic trunk.*|aortic arch.*)( \d+)?$/;

export const SCENES = {
  // The heart with its great vessels. Ventricles and atria shrink towards the valve plane.
  heart: {
    label: 'The heart',
    files: ['CardioVascular41'],
    under: ['heart.g'],
    names: HEART_VESSELS,
    groups: {
      valves: { match: /valv|leaflet/ },
      ventricles: { match: /ventricle|papillary|interventricular|cardiac vein|vein of left ventricle|coronary artery|circumflex|inferolateral|valv|leaflet/, move: true, pivot: 'valves' },
      atria: { match: /atrium|auricle/, move: true, pivot: 'valves' },
      lv: { match: /left ventricle/ },
      rv: { match: /right ventricle/ },
      la: { match: /left atrium/ },
      ra: { match: /right atrium/ },
    },
    view: { dir: [0.07, 0.05, 1], dist: 1.45 },
    spin: true,
  },

  // Heart and neck: the internal jugular veins pulse with the JVP waves.
  'neck-heart': {
    label: 'The heart and the veins and arteries of the neck',
    files: ['CardioVascular41'],
    under: ['heart.g'],
    names: [...HEART_VESSELS, NECK_VESSELS],
    groups: {
      valves: { match: /valv|leaflet/ },
      ventricles: { match: /ventricle|papillary|interventricular|cardiac vein|vein of left ventricle|coronary artery|circumflex|inferolateral|valv|leaflet/, move: true, pivot: 'valves' },
      atria: { match: /atrium|auricle/, move: true, pivot: 'valves' },
      ijv: { match: /^internal jugular vein/, move: true },
      semilunar: { match: /aortic valve|pulmonary valve|ascending aorta|pulmonary trunk/ },
      neck: { match: /jugular|carotid|brachiocephalic|aortic arch|heart\.g/ },
    },
    focus: 'neck',
    view: { dir: [0.15, 0.05, 1], dist: 1.45 },
  },

  // The baroreflex: carotid sinus and aortic arch, their nerves (IX, X) to the medulla, and the heart.
  baroreflex: {
    label: 'Carotid arteries, aortic arch, the glossopharyngeal and vagus nerves, the medulla and the heart',
    files: ['CardioVascular41', 'NervousSystem100'],
    under: ['heart.g', 'medulla oblongata.l', 'medulla oblongata.r', 'pons.l', 'pons.r'],
    names: [...HEART_VESSELS, NECK_ARTERIES, /^(glossopharyngeal nerve|vagus nerve)/, /^sympathetic trunk/],
    exclude: [/vein|vena|abdominal|thoracic aorta|renal|gastric|hepatic|coeliac|celiac/],
    groups: {
      valves: { match: /valv|leaflet/ },
      ventricles: { match: /ventricle|papillary|interventricular|cardiac vein|vein of left ventricle|coronary artery|circumflex|inferolateral|valv|leaflet/, move: true, pivot: 'valves' },
      atria: { match: /atrium|auricle/, move: true, pivot: 'valves' },
      sinus: { match: /carotid|aortic arch/ },
      ix: { match: /glossopharyngeal/ },
      vagus: { match: /vagus/ },
      sympathetic: { match: /sympathetic trunk/ },
      medulla: { match: /medulla oblongata|pons/ },
    },
    view: { dir: [0.3, 0.05, 1], dist: 1.25 },
  },

  // The whole circulation, for shock: arteries, veins and the heart.
  circulation: {
    label: 'The heart, arteries and veins of the whole body',
    files: ['CardioVascular41'],
    under: ['arterial system.g', 'venous system.g'],
    names: [],
    groups: {
      valves: { match: /valv|leaflet/ },
      ventricles: { match: /^[^/]*(ventricle|papillary)|interventricular|valv|leaflet/, move: true, pivot: 'valves' },
      arteries: { match: /arter|aort|carotid|basilar|trunk(?!.*pulmonary)/ },
      veins: { match: /vein|vena|sinus/ },
    },
    view: { dir: [0, 0, 1], dist: 1.25 },
  },

  // The brain's arteries (circle of Willis and the cerebral arteries) inside a see-through brain.
  'brain-arteries': {
    label: 'The brain and its arteries',
    files: ['CardioVascular41', 'NervousSystem100'],
    under: ['brain.g'],
    names: [/cerebral artery|communicating artery|^basilar artery|^vertebral artery|^internal carotid artery|pontine branches|branches of (middle|anterior) cerebral/],
    groups: {
      brain: { match: /brain\.g/, opacity: 0.32 },
      arteries: { match: /arter|basilar|branches/ },
    },
    focus: 'brain',
    view: { dir: [0.55, 0.25, 0.8], dist: 1.6 },
  },

  // The chest: lungs, airways and pleura inside the rib cage, the diaphragm below and the heart
  // between the lungs. The lungs swell downwards and outwards as they fill; either lung can collapse.
  chest: {
    label: 'The lungs, airways, rib cage, diaphragm and heart',
    files: ['VisceralSystem100', 'SkeletalSystem100', 'MuscularSystem100', 'CardioVascular41'],
    under: ['lungs.g', 'tracheobronchial tree.g', 'thoracic cavity.g', 'ribs.g', 'sternum.g', 'heart.g'],
    names: [/^diaphragm( \d+)?$/, ...HEART_VESSELS],
    groups: {
      rightLung: { match: /right lung/, move: true, pivotAt: 'medial' },
      leftLung: { match: /left lung/, move: true, pivotAt: 'medial' },
      airways: { match: /trachea|bronch/ },
      pleura: { match: /pleura/, opacity: 0.05, color: '#cfe3ef' },
      ribs: { match: /rib|sternum|costal|xiphoid|manubrium/, opacity: 0.14 },
      diaphragm: { match: /^diaphragm/, move: true, pivotAt: 'bottom' },
      heart: { match: /heart\.g|aort|pulmonary trunk|vena|pulmonary vein|coronary|cardiac vein|interventricular|circumflex|sinus/ },
      bloodRed: { match: /aort|pulmonary vein|left ventricle|left atrium/ },
      lungsAll: { match: /lung|trachea/ },
    },
    focus: 'lungsAll',
    view: { dir: [0, 0.05, 1], dist: 1.75 },
  },

  // Breathing control: the brainstem (central chemoreceptors), the carotid arteries (carotid
  // bodies at their fork), the phrenic nerves, the diaphragm and the lungs.
  'breath-control': {
    label: 'The brainstem, carotid arteries, phrenic nerves, diaphragm and lungs',
    files: ['VisceralSystem100', 'NervousSystem100', 'CardioVascular41', 'MuscularSystem100'],
    under: ['lungs.g', 'tracheobronchial tree.g', 'brainstem.g'],
    names: [NECK_ARTERIES, /^phrenic nerve/, /^diaphragm( \d+)?$/],
    exclude: [/vein|vena/],
    groups: {
      lungs: { match: /lung/, move: true, pivotAt: 'top' },
      airways: { match: /trachea|bronch/ },
      medulla: { match: /medulla oblongata|pons|midbrain|brainstem/ },
      carotid: { match: /carotid/ },
      phrenic: { match: /phrenic/ },
      diaphragm: { match: /^diaphragm/, move: true, pivotAt: 'bottom' },
    },
    view: { dir: [0.45, 0.05, 1], dist: 1.9 },
  },

  // The urinary system with its blood supply: kidneys (and adrenals), renal arteries and veins
  // from the aorta and vena cava, ureters and bladder.
  urinary: {
    label: 'The kidneys, renal arteries and veins, ureters and bladder',
    files: ['VisceralSystem100', 'CardioVascular41'],
    under: ['urinary system.g'],
    names: [/^(suprarenal gland\.?(r|l))$/, /^(abdominal aorta|(right|left) renal (artery|vein)|anterior branch of renal artery\.?(r|l)|posterior branch of renal artery\.?(r|l)|intrarenal (arteries|veins) of (right|left) kidney|inferior vena cava \(abdominal part\)|common iliac (artery|vein)\.?(r|l))( \d+)?$/],
    exclude: [/urethra/],
    groups: {
      kidneys: { match: /^[^/]*kidney\.?(r|l)|^kidney/ },
      pelvis: { match: /renal pelvis|ureter/ },
      bladder: { match: /urinary bladder/, move: true, pivotAt: 'bottom' },
      arteries: { match: /arter|aorta/ },
      veins: { match: /vein|vena/ },
      adrenals: { match: /suprarenal/ },
    },
    view: { dir: [0, 0.1, 1], dist: 1.6 },
  },

  // The bladder in the pelvis: bladder and urethra, the pelvic floor (levator ani), the hip bones
  // for context, and the pudendal nerves and the spinal cord.
  bladder: {
    label: 'The bladder, urethra and pelvic floor, with the pudendal nerves',
    files: ['VisceralSystem100', 'MuscularSystem100', 'SkeletalSystem100', 'NervousSystem100'],
    under: ['levator ani.g', 'bones of pelvic girdle.g'],
    names: [/^(urinary bladder|urethra)( \d+)?$/, /^(ureter\.?(r|l))( \d+)?$/, /^pudendal nerve/, /^(sacrum|coccyx)$/],
    groups: {
      bladder: { match: /urinary bladder/, move: true, pivotAt: 'bottom' },
      urethra: { match: /urethra/ },
      floor: { match: /levator ani|tendinous arch/ },
      bones: { match: /hip bone|sacrum|coccyx|pelvic girdle/, opacity: 0.22 },
      pudendal: { match: /pudendal/ },
      ureters: { match: /ureter/ },
    },
    focus: 'bladder',
    view: { dir: [0.35, 0.15, 1], dist: 3.2 },
  },

  // Lungs and kidneys together, for acid–base balance.
  'lungs-kidneys': {
    label: 'The lungs and the kidneys',
    files: ['VisceralSystem100'],
    under: ['lungs.g', 'tracheobronchial tree.g', 'urinary system.g'],
    names: [],
    exclude: [/urethra/],
    groups: {
      lungs: { match: /lung/, move: true, pivotAt: 'top' },
      airways: { match: /trachea|bronch/ },
      kidneys: { match: /^[^/]*kidney|^kidney|renal pelvis/ },
      bladder: { match: /urinary bladder|ureter/ },
    },
    view: { dir: [0, 0.05, 1], dist: 1.35 },
  },

  // The brain seen from the left, its lobes tinted, with regions that can light up when damaged.
  brain: {
    label: 'The brain, seen from the left',
    files: ['NervousSystem100'],
    under: ['brain.g'],
    names: [],
    groups: {
      frontal: { match: /frontal lobe/, color: '#e2b2a8' },
      parietal: { match: /parietal lobe/, color: '#d8c0a2' },
      temporal: { match: /temporal lobe/, color: '#c9b4cf' },
      occipital: { match: /occipital lobe/, color: '#b4c7d8' },
      cerebellum: { match: /cerebellum\.g/, color: '#c99a95' },
      brainstem: { match: /brainstem\.g/ },
      broca: { match: /(opercular|triangular) part of inferior frontal gyrus/, side: 'l' },
      prefrontal: { match: /superior frontal gyrus|middle frontal gyrus|orbital (gyri|part)|frontopolar|gyrus rectus|straight gyrus/ },
      wernicke: { match: /superior temporal gyrus|transverse temporal/, side: 'l' },
      parietalL: { match: /parietal lobe/, side: 'l' },
      parietalR: { match: /parietal lobe/, side: 'r' },
      v1: { match: /occipital pole|calcarine|cuneus|lingual gyrus/ },
      visual: { match: /lateral occipital|superior occipital|inferior occipital|occipitotemporal/ },
      hippocampi: { match: /hippocamp|dentate gyrus|parahippocampal/ },
      callosum: { match: /corpus callosum/ },
      pons: { match: /^[^/]*pons/ },
      precentral: { match: /precentral gyrus/ },
    },
    view: { dir: [1, 0.15, 0.25], dist: 1.6 },
  },

  // Deep inside the brain: a see-through cortex around the basal nuclei, thalamus and midbrain.
  'brain-deep': {
    label: 'The basal nuclei, thalamus and midbrain inside a see-through brain',
    files: ['NervousSystem100'],
    under: ['brain.g'],
    names: [],
    exclude: [/sulcus|sulci|fissure|meninges|dura|arachnoid|pia/],
    groups: {
      cortex: { match: /brain\.g/, opacity: 0.018 },
      caudate: { match: /caudate/, opacity: 1, color: '#c98a7a' },
      putamen: { match: /putamen/, opacity: 1, color: '#b9837f' },
      pallidus: { match: /pallidus/, opacity: 1, color: '#c7b7a5' },
      thalamus: { match: /^[^/]*thalamus/, opacity: 1, color: '#9fa7c9' },
      midbrain: { match: /midbrain|red nucleus|nigra|cerebral peduncle/, opacity: 1, color: '#6f5f5c' },
      subthalamic: { match: /subthalam/, opacity: 1, color: '#c4a37a' },
    },
    focus: 'caudate',
    view: { dir: [0.6, 0.55, 1], dist: 1.9 },
  },

  // A segment of the spinal cord around T10, with its tracts and grey matter; tracts can light up
  // on one side, and a band can mark a lesion.
  cord: {
    label: 'A segment of the spinal cord with its tracts',
    files: ['NervousSystem100'],
    under: ['spinal cord.g'],
    names: [],
    slab: [0.245, 0.285],
    groups: {
      white: { match: /^white matter of spinal cord( \/|$)|fasciculus proprius|reticulospinal|vestibulospinal|tectospinal|rubrospinal|spinocerebellar|posterolateral tract|spinotectal/, opacity: 0.1 },
      grey: { match: /horn|intermedi|central canal|nucleus proprius|spinal reticular/, color: '#b7a69f' },
      dorsal: { match: /posterior horn|nucleus proprius|spinal reticular/ },
      ventral: { match: /anterior horn/ },
      dc: { match: /gracile|cuneate/, color: '#7aa7d9' },
      st: { match: /spinothalamic/, color: '#e3a25f' },
      cs: { match: /corticospinal/, color: '#7fbf8a' },
      dcR: { match: /gracile|cuneate/, side: 'r' },
      dcL: { match: /gracile|cuneate/, side: 'l' },
      stR: { match: /spinothalamic/, side: 'r' },
      stL: { match: /spinothalamic/, side: 'l' },
      csR: { match: /corticospinal/, side: 'r' },
      csL: { match: /corticospinal/, side: 'l' },
      lesion: { match: /spinal cord\.g/, level: [0.255, 0.27] },
      lesionR: { match: /spinal cord\.g/, level: [0.255, 0.27], side: 'r' },
    },
    view: { dir: [0.6, 0.9, 1], dist: 1.0 },
  },

  // The right knee seen from the side: thigh muscles, femoral nerve and the bones of the leg,
  // which swing about the knee.
  knee: {
    label: 'The right thigh and leg: quadriceps, hamstrings, femoral nerve and the knee',
    files: ['SkeletalSystem100', 'MuscularSystem100', 'NervousSystem100'],
    under: [],
    names: [/^(femur|patella|tibia|fibula|talus|calcaneus)\.?r( \d+)?$/, /^(rectus femoris muscle|vastus (lateralis|medialis|intermedius) muscle|long head of biceps femoris|short head of biceps femoris|semitendinosus muscle)\.?r( \d+)?$/, /^patellar ligament\.?[oe]?r/, /^femoral nerve\.?r( \d+)?$/],
    groups: {
      leg: { match: /tibia|fibula|talus|calcane|patellar ligament/, move: true, pivotAt: 'top', axis: 'x' },
      quads: { match: /rectus femoris|vastus/ },
      hams: { match: /biceps femoris|semitend/ },
      nerve: { match: /femoral nerve/ },
    },
    view: { dir: [-1, 0.1, 0.35], dist: 1.25 },
  },

  // The motor pathway: motor cortex, spinal cord (corticospinal tracts), the right femoral nerve
  // and the right quadriceps.
  motor: {
    label: 'The motor cortex, spinal cord, femoral nerve and quadriceps',
    files: ['NervousSystem100', 'MuscularSystem100'],
    under: ['brain.g', 'spinal cord.g'],
    names: [/^femoral nerve\.?r( \d+)?$/, /^(rectus femoris muscle|vastus (lateralis|medialis|intermedius) muscle)\.?r( \d+)?$/],
    groups: {
      brain: { match: /brain\.g/ },
      precentralL: { match: /precentral gyrus/, side: 'l' },
      cs: { match: /corticospinal/ },
      cordLesion: { match: /spinal cord\.g/, level: [0.5, 0.53] },
      cordLesionR: { match: /spinal cord\.g/, level: [0.5, 0.53], side: 'r' },
      femoral: { match: /femoral nerve/ },
      quads: { match: /rectus femoris|vastus/, move: true },
    },
    view: { dir: [0.35, 0.05, 1], dist: 2.05 },
  },
};

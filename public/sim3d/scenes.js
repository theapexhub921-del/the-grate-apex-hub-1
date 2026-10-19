// Scenes for /sim3d/organ.html: which atlas models and parts each simulation shows, and which
// groups of parts can move or glow. Names are matched against a part's full name chain
// ("left ventricle / heart.g / ..."), lower case.

// Must match MODEL_VERSION in /atlas/anatomy.html so the browser reuses saved models
// (tests/deploy-wiring.test.mjs checks this).
export const MODEL_VERSION = '1';

// Tissue colours, from the part's name.
const RULES = [
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
  [/pleura/, '#cfe3ef'],
  [/lung|lobe of/, '#c9878e'],
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
    names: [...HEART_VESSELS, NECK_VESSELS, /^(glossopharyngeal nerve|vagus nerve)/, /^sympathetic trunk/],
    exclude: [/abdominal|thoracic aorta|renal|gastric|hepatic|coeliac|celiac/],
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
    focus: 'sinus',
    view: { dir: [0.35, 0.05, 1], dist: 1.6 },
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
};

// Source references, concepts and discrepancies for
// Physiology → Respiratory Physiology (HB2).
//
// Lecture sources (define WHAT is taught; see content-catalog.ts):
//   RS  = "Respiratory System" (Respiratory Notes Video 5 - Copy.pptx, 138 slides)
//   PDF = "Respiratory System (PDF)" (Respiration.pdf, 137 pages): an earlier
//         export of the same lecture without the three airway slides (4–6).
//         Used only where the two versions differ.
// The 1.5 GB deck with embedded video is the same lecture and is not extracted.
// Slides 13, 16, 18, 22, 26, 49, 57, 61–62, 68, 71, 82, 88–90, 96, 102 and 132
// are mainly pictures (pressure traces, spirogram, dissociation curves, V/Q
// diagrams); lessons use the slide text around them.
//
// Reference (clarification only): Guyton and Hall, Textbook of Medical
// Physiology (14th ed.), via GUYTON.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { pages, slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'respiratory-physiology';

const RS = 'resp-respiratory-notes-video-5-copy';
const PDF = 'resp-respiration';
const VISUAL = [13, 16, 18, 22, 26, 49, 57, 61, 62, 68, 71, 82, 88, 89, 90, 96, 102, 132];

/** Slides of the lecture deck: rs([30, 31]). */
export const rs = (numbers: number[]): SourceReference[] => slides(RS, numbers, numbers.filter((n) => VISUAL.includes(n)));
/** Pages of the earlier PDF export. */
export const pdf = (numbers: number[]): SourceReference[] => pages(PDF, numbers);
export const GUYTON: SourceReference[] = [{ sourceId: 'guyton-hall-14e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Respiration, Airways and the Mechanics of Breathing
  'respiration-overview': { lessonId: L(1), name: 'External and internal respiration and the parts of the respiratory system', category: 'core', relevance: 'core', sourceRefs: rs([2, 3]) },
  'respiratory-muscles': { lessonId: L(1), name: 'Muscles of inspiration and expiration, including accessory muscles', category: 'core', relevance: 'core', sourceRefs: rs([3, 14, 15]) },
  'airway-structure': { lessonId: L(1), name: 'The airway from nose to alveoli; cartilage, smooth muscle and alveolar cells', category: 'core', relevance: 'core', sourceRefs: rs([4, 5, 6]) },
  'airway-receptors': { lessonId: L(1), name: 'Bronchoconstriction and bronchodilation: muscarinic and β2 receptors', category: 'core', relevance: 'core', sourceRefs: rs([5]) },
  'gases-and-air': { lessonId: L(1), name: 'Gas laws, partial pressure and the composition of air', category: 'supporting', relevance: 'core', sourceRefs: rs([7, 9]) },
  'breathing-pressures': { lessonId: L(1), name: 'Pressure gradients in inspiration and expiration', category: 'core', relevance: 'core', sourceRefs: rs([10, 13, 14, 15, 16]) },
  'intrapleural-pressure': { lessonId: L(1), name: 'Intrapleural pressure and why the lung does not collapse', category: 'core', relevance: 'core', sourceRefs: rs([11, 12, 13, 14]) },

  // Lesson 2 — Lung Volumes and Capacities
  'lung-volumes': { lessonId: L(2), name: 'Tidal, inspiratory reserve, expiratory reserve and residual volumes', category: 'core', relevance: 'core', sourceRefs: rs([17, 18, 19]) },
  'lung-capacities': { lessonId: L(2), name: 'Vital capacity, inspiratory capacity, functional residual capacity and minute volume', category: 'core', relevance: 'core', sourceRefs: rs([20, 22]) },
  'spirometry-fev1': { lessonId: L(2), name: 'Spirometry, the timed vital capacity (FEV1) and the role of the residual volume', category: 'core', relevance: 'core', sourceRefs: rs([20, 21, 24]) },
  'vital-capacity-factors': { lessonId: L(2), name: 'What raises and lowers the vital capacity', category: 'clinical', relevance: 'core', sourceRefs: rs([21, 23, 25, 26]) },

  // Lesson 3 — Compliance, Surfactant and the Work of Breathing
  'lung-compliance': { lessonId: L(3), name: 'Recoil of the lungs and chest wall, and lung compliance', category: 'core', relevance: 'core', sourceRefs: rs([27]) },
  'compliance-factors': { lessonId: L(3), name: 'What lowers and raises compliance', category: 'clinical', relevance: 'core', sourceRefs: rs([28, 29]) },
  'surfactant': { lessonId: L(3), name: 'Surfactant: what it is, where it comes from and what it does', category: 'core', relevance: 'core', sourceRefs: rs([30, 31]) },
  'surfactant-deficiency': { lessonId: L(3), name: 'Surfactant deficiency and respiratory distress syndrome', category: 'clinical', relevance: 'core', sourceRefs: rs([32]) },
  'work-of-breathing': { lessonId: L(3), name: 'Resistance and the work of breathing', category: 'core', relevance: 'core', sourceRefs: rs([33, 34, 35]) },

  // Lesson 4 — Ventilation, Dead Space and the Pulmonary Circulation
  'ventilation-gravity': { lessonId: L(4), name: 'Ventilation and the effect of gravity on it', category: 'core', relevance: 'core', sourceRefs: rs([36]) },
  'dead-space': { lessonId: L(4), name: 'Anatomical, alveolar and physiological dead space', category: 'core', relevance: 'core', sourceRefs: rs([37, 38]) },
  'alveolar-ventilation': { lessonId: L(4), name: 'Alveolar ventilation and the effect of breathing pattern', category: 'core', relevance: 'core', sourceRefs: rs([39]) },
  'pulmonary-circulation': { lessonId: L(4), name: 'The pulmonary circulation: a low-pressure, distensible reservoir', category: 'core', relevance: 'core', sourceRefs: rs([40, 41]) },
  'hypoxic-vasoconstriction': { lessonId: L(4), name: 'Hypoxic pulmonary vasoconstriction', category: 'core', relevance: 'core', sourceRefs: rs([42]) },

  // Lesson 5 — Oxygen Transport and the Dissociation Curve
  'oxygen-delivery': { lessonId: L(5), name: 'Partial pressure gradients and the factors in oxygen delivery', category: 'core', relevance: 'core', sourceRefs: rs([43, 44, 45]) },
  'haemoglobin-oxygen': { lessonId: L(5), name: 'Haemoglobin structure and oxygenation (not oxidation)', category: 'core', relevance: 'core', sourceRefs: rs([46]) },
  'dissociation-curve': { lessonId: L(5), name: 'The sigmoid oxygen–haemoglobin dissociation curve', category: 'core', relevance: 'core', sourceRefs: rs([47, 48, 49, 50, 51, 52]) },
  'p50-affinity': { lessonId: L(5), name: 'P50 and what right and left shifts mean', category: 'core', relevance: 'core', sourceRefs: rs([52, 53, 54, 55]) },

  // Lesson 6 — Shifting the Curve, Myoglobin, Carbon Monoxide and CO2 Transport
  'curve-shift-factors': { lessonId: L(6), name: 'Factors that shift the dissociation curve right or left', category: 'core', relevance: 'core', sourceRefs: rs([56, 57, 58, 61, 62]) },
  'dpg': { lessonId: L(6), name: '2,3-DPG and the conditions that raise it', category: 'core', relevance: 'core', sourceRefs: rs([58, 63]) },
  'bohr-haldane': { lessonId: L(6), name: 'The Bohr and Haldane effects', category: 'core', relevance: 'core', sourceRefs: rs([59, 60, 64, 70, 71]) },
  'fetal-hb-myoglobin': { lessonId: L(6), name: 'Fetal haemoglobin and myoglobin', category: 'core', relevance: 'core', sourceRefs: rs([64, 65]) },
  'carbon-monoxide': { lessonId: L(6), name: 'Carbon monoxide and carbonmonoxyhaemoglobin', category: 'clinical', relevance: 'core', sourceRefs: rs([66, 126]) },
  'co2-transport': { lessonId: L(6), name: 'How CO2 is carried: dissolved, bicarbonate (chloride shift) and carbamino compounds', category: 'core', relevance: 'core', sourceRefs: rs([67, 68, 69]) },

  // Lesson 7 — Gas Exchange, Diffusion and Ventilation–Perfusion
  'gas-exchange': { lessonId: L(7), name: 'Diffusion down partial pressure gradients; blood gas values', category: 'core', relevance: 'core', sourceRefs: rs([72, 73]) },
  'alveolar-air': { lessonId: L(7), name: 'Alveolar air: why it changes slowly and what sets alveolar PO2 and PCO2', category: 'core', relevance: 'core', sourceRefs: rs([74, 75, 76]) },
  'respiratory-membrane': { lessonId: L(7), name: 'The respiratory membrane and the factors affecting diffusion', category: 'core', relevance: 'core', sourceRefs: rs([77, 78, 79, 80]) },
  'diffusing-capacity': { lessonId: L(7), name: 'Diffusing capacity and its rise in exercise', category: 'core', relevance: 'core', sourceRefs: rs([81, 82]) },
  'ventilation-perfusion': { lessonId: L(7), name: 'The ventilation–perfusion ratio, shunt and wasted ventilation', category: 'core', relevance: 'core', sourceRefs: rs([83, 84, 85, 86]) },
  'regional-vq': { lessonId: L(7), name: 'Regional V/Q differences: the lung apex', category: 'clinical', relevance: 'core', sourceRefs: rs([87, 88, 89, 90]) },

  // Lesson 8 — Control of Breathing and Respiratory Reflexes
  'respiratory-control': { lessonId: L(8), name: 'Voluntary and automatic control of breathing', category: 'core', relevance: 'core', sourceRefs: rs([91, 92]) },
  'medullary-centres': { lessonId: L(8), name: 'Medullary inspiratory and expiratory neurons', category: 'core', relevance: 'core', sourceRefs: rs([93, 94]) },
  'pontine-centres': { lessonId: L(8), name: 'Transection experiments: the pneumotaxic and apneustic centres', category: 'core', relevance: 'core', sourceRefs: rs([95, 96, 98]) },
  'hering-breuer': { lessonId: L(8), name: 'The Hering–Breuer inflation reflex', category: 'core', relevance: 'core', sourceRefs: rs([97]) },
  'chemoreceptors': { lessonId: L(8), name: 'Peripheral and central chemoreceptors', category: 'core', relevance: 'core', sourceRefs: rs([99, 100, 101, 102]) },
  'chemical-responses': { lessonId: L(8), name: 'Ventilatory responses to acidosis, CO2 excess, O2 lack and breath-holding', category: 'core', relevance: 'core', sourceRefs: rs([103, 104, 105, 106]) },
  'protective-reflexes': { lessonId: L(8), name: 'Cough, sneeze and the closure of the glottis in swallowing', category: 'core', relevance: 'core', sourceRefs: rs([107, 108, 109, 110]) },
  'exercise-ventilation': { lessonId: L(8), name: 'Breathing in exercise', category: 'core', relevance: 'core', sourceRefs: rs([111, 112]) },

  // Lesson 9 — Hypoxia, Cyanosis and Breathing in Unusual Conditions
  'hypoxia-types': { lessonId: L(9), name: 'The four types of hypoxia', category: 'core', relevance: 'core', sourceRefs: rs([113, 126]) },
  'hypoxia-effects': { lessonId: L(9), name: 'Effects of hypoxia and terms for abnormal breathing', category: 'clinical', relevance: 'core', sourceRefs: rs([114, 115]) },
  'cyanosis': { lessonId: L(9), name: 'Cyanosis: cause, types and when it is absent', category: 'clinical', relevance: 'core', sourceRefs: rs([116, 117, 118]) },
  'altitude': { lessonId: L(9), name: 'High altitude: hypoxic hypoxia, mountain sickness and acclimatisation', category: 'clinical', relevance: 'core', sourceRefs: rs([119, 120, 121, 122, 123]) },
  'hypoxic-hypoxia-causes': { lessonId: L(9), name: 'Other causes of hypoxic hypoxia: failure of the exchange apparatus', category: 'clinical', relevance: 'core', sourceRefs: rs([124, 125]) },
  'oxygen-therapy': { lessonId: L(9), name: 'Oxygen treatment and oxygen toxicity', category: 'clinical', relevance: 'core', sourceRefs: rs([127, 128]) },
  'co2-disorders': { lessonId: L(9), name: 'Hypercapnia, hypocapnia and asphyxia', category: 'clinical', relevance: 'core', sourceRefs: rs([129, 130, 131]) },
  'pressure-and-drowning': { lessonId: L(9), name: 'High pressure (diving), drowning and life-saving procedures', category: 'clinical', relevance: 'core', sourceRefs: rs([132, 133, 134, 135, 136, 137]) },
  'respiratory-ph': { lessonId: L(9), name: 'Respiratory regulation of pH', category: 'core', relevance: 'core', sourceRefs: rs([138]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'external-intercostal-direction',
    concept: 'Direction of the external intercostal muscles',
    status: 'resolved',
    statements: [
      { text: 'Respiratory System deck, slide 3: “External intercostal (upwards and forward)”.', sourceRefs: rs([3]) },
      { text: 'Earlier PDF export, page 3: “External intercostal (downward and forward)”.', sourceRefs: pdf([3]) },
    ],
    resolution: {
      text: 'Guyton: the external intercostal fibres run downward and forward from one rib to the next, and their contraction pulls the ribs upward and forward, raising the sternum and widening the chest front to back. Both versions describe one of these; the lesson teaches both and the quiz asks only about the effect (raising the ribs in inspiration).',
      sourceRefs: [...rs([3, 14]), ...GUYTON],
    },
  },
  {
    id: 'boyles-law',
    concept: 'Boyle’s law',
    status: 'resolved',
    statements: [{ text: 'Slide 7: “P α T/V (Boyle’s law)”.', sourceRefs: rs([7]) }],
    resolution: {
      text: 'Boyle’s law is P ∝ 1/V at constant temperature; P ∝ T/V combines it with Charles’s law. The lesson teaches that pressure rises as volume falls. The slide formula is not quizzed.',
      sourceRefs: [...rs([7]), ...GUYTON],
    },
  },
  {
    id: 'fev-47-percent',
    concept: 'Which disease gives an FEV1/VC of about 47%',
    status: 'resolved',
    statements: [{ text: 'Slide 24: “Restrictive disease: FEV/VC is about 47 %”.', sourceRefs: rs([24]) }],
    resolution: {
      text: 'Guyton gives FEV1/FVC about 80% normally and about 47% in airway obstruction; in restrictive disease the ratio stays near normal because both volumes fall. Not quizzed — confirm with the lecturer.',
      sourceRefs: [...rs([24]), ...GUYTON],
    },
  },
  {
    id: 'membrane-area',
    concept: 'Surface area of the respiratory membrane',
    status: 'unresolved',
    statements: [
      { text: 'Slide 77: “Alveolar membrane ≈ 160 sq metre”.', sourceRefs: rs([77]) },
      { text: 'Guyton: the total surface area of the respiratory membrane is about 70 m² in the normal adult.', sourceRefs: GUYTON },
    ],
    note: 'The number is not quizzed; only that the area is very large.',
  },
  {
    id: 'co2-diffusing-capacity',
    concept: 'How much greater the diffusing capacity for CO2 is than for O2',
    status: 'resolved',
    statements: [
      { text: 'Slide 81: “More in CO2 than O2 ≈ 20% more”.', sourceRefs: rs([81]) },
      { text: 'Guyton: CO2 diffuses about 20 times as rapidly as O2, so its diffusing capacity is about 20 times greater.', sourceRefs: GUYTON },
    ],
    resolution: {
      text: 'Taught as about 20 times greater (Guyton). The quiz asks only that it is greater for CO2.',
      sourceRefs: [...rs([81]), ...GUYTON],
    },
  },
  {
    id: 'sea-level-po2',
    concept: 'Atmospheric PO2 at sea level',
    status: 'unresolved',
    statements: [
      { text: 'Slide 119: above about 3000 m the PO2 falls to about 60 mmHg, “but ≈ 194mmHg at sea level”.', sourceRefs: rs([119]) },
      { text: 'Guyton: the PO2 of air at sea level is about 159 mmHg (149 mmHg once humidified in the airways).', sourceRefs: GUYTON },
    ],
    note: 'Possibly a typing slip for 159. The sea-level number is not quizzed.',
  },
  {
    id: 'normal-vq',
    concept: 'The normal ventilation–perfusion ratio',
    status: 'resolved',
    statements: [{ text: 'Slide 84: “V/Q = 1 Normal”.', sourceRefs: rs([84]) }],
    resolution: {
      text: 'Guyton: the average for the whole lung is about 0.8 (about 4 L/min of alveolar ventilation for 5 L/min of blood flow). V/Q = 1 is the ideal of perfectly matched ventilation and blood flow. The quiz uses the slide’s V/Q = 0 and V/Q = infinity extremes.',
      sourceRefs: [...rs([84]), ...GUYTON],
    },
  },
];

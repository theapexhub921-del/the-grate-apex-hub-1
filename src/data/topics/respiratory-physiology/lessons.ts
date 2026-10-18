// Physiology → Respiratory Physiology: the nine lessons (reading layer).
import type { LessonDraft } from '@/data/topics/build';
import { interactive } from '@/data/topics/respiratory-physiology/interactive';
import { withSimulation } from '@/data/topics/respiratory-physiology/simulations';
import { GUYTON, pdf, rs, TOPIC_ID, type ConceptId } from '@/data/topics/respiratory-physiology/sources';

type Draft = LessonDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

// ─── Lesson 1: Respiration, Airways and the Mechanics of Breathing ───

const lesson1: Draft = {
  id: L(1),
  title: 'Respiration, Airways and the Mechanics of Breathing',
  description: 'What respiration is, the parts of the respiratory system, the airway from nose to alveoli and how it is narrowed and widened, and how pressure gradients move air in and out.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: rs([2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16]),
  objectives: [
    'Distinguish external from internal respiration.',
    'Name the muscles of inspiration, expiration and the accessory muscles.',
    'Trace the airway from the nose to the alveoli and describe its receptors.',
    'Explain how pressure gradients drive inspiration and expiration.',
    'Explain why intrapleural pressure is negative and what it does.',
  ],
  chunks: [
    {
      title: 'What Respiration Means',
      kind: 'overview',
      paragraphs: [
        'External respiration is the exchange of gases with the air: taking up O₂ and expelling CO₂. Internal respiration is the use of O₂ in the cells to produce energy, with CO₂ as the by-product (slide 2).',
        'The system has three parts: the gas-exchange organs (the left and right lungs), a pump (the chest wall and the respiratory muscles) and a respiratory control centre (slide 3).',
      ],
      terms: [
        { term: 'External respiration', meaning: 'Exchange of O₂ and CO₂ between the air and the blood.' },
        { term: 'Internal respiration', meaning: 'Use of O₂ by cells for energy, producing CO₂.' },
      ],
      sourceRefs: rs([2, 3]),
    },
    {
      title: 'The Respiratory Muscles',
      kind: 'structure',
      paragraphs: [
        'The pump muscles are the diaphragm, the external intercostals, the internal intercostals and the accessory muscles: serratus anterior, the scalenes and sternocleidomastoid (slide 3).',
        'In inspiration the diaphragm moves down and the external intercostals raise the sternum and push it outward, increasing the antero-posterior diameter of the chest (slide 14). In active expiration the internal intercostals pull the rib cage downward and inward, the abdominal muscles contract and the diaphragm moves up (slide 15).',
      ],
      table: {
        columns: ['Phase', 'Muscles'],
        rows: [
          ['Inspiration', 'Diaphragm (moves down), external intercostals (raise the ribs and sternum)'],
          ['Forced inspiration', 'Accessory muscles: scalenes, sternocleidomastoid, serratus anterior'],
          ['Active expiration', 'Internal intercostals (rib cage down and in), abdominal muscles (diaphragm pushed up)'],
        ],
      },
      notes: [
        { kind: 'clarified', text: 'The deck says the external intercostals run “upwards and forward”; the earlier PDF says “downward and forward” (page 3). Guyton: the fibres run downward and forward, and contracting them pulls the ribs upward and forward.' },
      ],
      keyPoints: ['Quiet expiration needs no muscle work; forced expiration uses the internal intercostals and abdominal muscles.'],
      sourceRefs: [...rs([3, 14, 15]), ...pdf([3]), ...GUYTON],
    },
    {
      title: 'The Airway',
      kind: 'pathway',
      paragraphs: [
        'Air passes through the nasal passages (which warm it and add water vapour), the trachea, bronchi, bronchioles, respiratory bronchioles and alveolar ducts to the alveoli (slide 4).',
        'The trachea and bronchi have cartilage, a little smooth muscle and a ciliated epithelial lining. The bronchioles and terminal bronchioles have no cartilage, only smooth muscle; they are kept open by the pressures that keep the lungs open (slides 5–6).',
        'The alveoli are surrounded by capillaries and lined by two types of epithelial cell: type I cells form the lining and type II cells produce surfactant (slide 6).',
      ],
      steps: [
        { label: 'Nasal passages', detail: 'Warm the air and add water vapour.' },
        { label: 'Trachea', detail: 'Cartilage, a little smooth muscle, ciliated lining.' },
        { label: 'Bronchi', detail: 'Cartilage, a little smooth muscle, ciliated lining.' },
        { label: 'Bronchioles', detail: 'No cartilage; smooth muscle only.' },
        { label: 'Respiratory bronchioles', detail: '' },
        { label: 'Alveolar ducts', detail: '' },
        { label: 'Alveoli', detail: 'Type I lining cells; type II cells make surfactant.' },
      ],
      sourceRefs: rs([4, 5, 6]),
    },
    {
      title: 'Narrowing and Widening the Airways',
      kind: 'regulation',
      paragraphs: [
        'Acetylcholine acts on muscarinic receptors to cause bronchospasm, mucus secretion and bronchial vasodilatation; atropine blocks this (slide 5).',
        'β2 receptors cause bronchodilatation; bronchodilator drugs include salbutamol and isoproterenol. Cooling of the airway causes bronchospasm. The airways also have stretch and tactile receptors (slide 5).',
      ],
      table: {
        columns: ['Receptor', 'Effect', 'Drug'],
        rows: [
          ['Muscarinic (acetylcholine)', 'Bronchoconstriction, mucus secretion, bronchial vasodilatation', 'Blocked by atropine'],
          ['β2', 'Bronchodilatation', 'Salbutamol, isoproterenol'],
        ],
      },
      keyPoints: ['Cold air can trigger bronchospasm.'],
      sourceRefs: rs([5]),
    },
    {
      title: 'Gases and Pressure',
      kind: 'definitions',
      paragraphs: [
        'Gas diffuses from an area of high to low pressure, and the membrane it diffuses through has to be considered. Gases dissolve in liquids according to their partial pressure (slides 7, 9).',
        'Normal air is about 21% O₂, 0.04% CO₂ and 78% nitrogen (slide 9).',
      ],
      notes: [
        { kind: 'clarified', text: 'Slide 7 writes Boyle’s law as “P α T/V”. Boyle’s law is P ∝ 1/V at constant temperature: when a volume of gas shrinks, its pressure rises.' },
      ],
      sourceRefs: [...rs([7, 9]), ...GUYTON],
    },
    {
      title: 'Pressure Gradients Move the Air',
      kind: 'mechanism',
      paragraphs: [
        'Breathing has two phases, inspiration and expiration, and each creates a pressure gradient (slide 10).',
        'In inspiration the chest wall expands and pulls the lungs with it, so the pressure in the lungs falls below atmospheric (negative). Air flows from the atmosphere into the lungs (slides 10, 14).',
        'In expiration the lung volume falls and the pressure in the lungs rises above atmospheric, so the gradient runs from the lungs to the atmosphere and air flows out (slide 15).',
      ],
      steps: [
        { label: 'Inspiration', detail: 'Chest expands → lung pressure below atmospheric → air in.' },
        { label: 'Expiration', detail: 'Lung volume falls → lung pressure above atmospheric → air out.' },
      ],
      sourceRefs: rs([10, 13, 14, 15, 16]),
    },
    {
      title: 'Intrapleural Pressure',
      kind: 'mechanism',
      paragraphs: [
        'The lung tends to collapse (recoil) because of its elastic tissue and the surface tension of the fluid lining the alveoli. The pressure in the intrapleural space is what keeps it from collapsing, so the lung always expands to fill the chest (slide 11).',
        'Intrapleural (intrathoracic) pressure is normally slightly below atmospheric — a negative pressure (slide 12). During inspiration it becomes more negative, from about −2.5 to −6 mmHg, which lets the lung expand (slide 14).',
      ],
      terms: [{ term: 'Intrapleural pressure', meaning: 'Pressure in the pleural cavity; normally slightly below atmospheric.' }],
      keyPoints: ['Intrapleural pressure: about −2.5 mmHg, becoming about −6 mmHg in inspiration.'],
      sourceRefs: rs([11, 12, 13, 14]),
    },
  ],
  summary: [
    'External respiration exchanges gases with the air; internal respiration uses O₂ in the cells.',
    'Diaphragm and external intercostals drive inspiration; internal intercostals and abdominal muscles drive forced expiration.',
    'Bronchioles have no cartilage, only smooth muscle; type II alveolar cells make surfactant.',
    'Muscarinic receptors constrict the airways (blocked by atropine); β2 receptors dilate them (salbutamol).',
    'Air moves down pressure gradients created by changing the chest volume.',
    'Intrapleural pressure is negative (about −2.5 mmHg) and more negative (about −6 mmHg) in inspiration.',
  ],
  highYield: [
    'Atropine blocks muscarinic bronchoconstriction; salbutamol is a β2 bronchodilator.',
    'Normal air: 21% O₂, 0.04% CO₂, 78% N₂.',
  ],
  confusions: [
    {
      confusion: 'Thinking quiet expiration is driven by muscles.',
      clarification: 'Quiet expiration is passive recoil; muscles (internal intercostals, abdominal wall) work only in forced expiration (slides 15, 35, 93).',
    },
  ],
};

// ─── Lesson 2: Lung Volumes and Capacities ───────────────────────────

const lesson2: Draft = {
  id: L(2),
  title: 'Lung Volumes and Capacities',
  description: 'The four lung volumes, the capacities made from them, the timed vital capacity (FEV1), and the things that raise or lower the vital capacity.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: rs([17, 18, 19, 20, 21, 22, 23, 24, 25, 26]),
  objectives: [
    'Define tidal, inspiratory reserve, expiratory reserve and residual volumes.',
    'Build vital capacity, inspiratory capacity and functional residual capacity from the volumes.',
    'Explain FEV1 and what spirometry can and cannot measure.',
    'List factors that increase and decrease the vital capacity.',
  ],
  chunks: [
    {
      title: 'Volumes and Capacities',
      kind: 'definitions',
      paragraphs: [
        'Lung volumes and capacities are the volumes of air associated with different phases of the breathing cycle. Volumes are measured directly; capacities are worked out from the volumes (slide 17).',
        'Tidal volume (TV) is the air moved in or out in normal quiet breathing. Inspiratory reserve volume (IRV) is the extra air that can be breathed in after the tidal volume with a maximal effort. Expiratory reserve volume (ERV) is the extra air that can be breathed out with an active effort. Residual volume (RV) is the air left in the lungs after a maximal expiration (slide 19).',
      ],
      table: {
        columns: ['Volume', 'Meaning'],
        rows: [
          ['Tidal volume', 'Moved in or out in quiet breathing (about 500 ml)'],
          ['Inspiratory reserve volume', 'Extra air in after a normal inspiration, with maximal effort'],
          ['Expiratory reserve volume', 'Extra air out after a normal expiration, with active effort'],
          ['Residual volume', 'Left in the lungs after a maximal expiration'],
        ],
      },
      sourceRefs: rs([17, 18, 19, 39]),
    },
    {
      title: 'The Capacities',
      kind: 'definitions',
      paragraphs: [
        'Vital capacity (VC) is the air that can be expelled after a maximal inspiration: IRV + TV + ERV. Inspiratory capacity is TV + IRV. Functional residual capacity is ERV + RV. Minute respiratory volume is the respiratory rate × tidal volume (slide 20).',
      ],
      table: {
        columns: ['Capacity', 'Made of'],
        rows: [
          ['Vital capacity', 'IRV + TV + ERV'],
          ['Inspiratory capacity', 'TV + IRV'],
          ['Functional residual capacity', 'ERV + RV'],
          ['Minute respiratory volume', 'Respiratory rate × TV'],
        ],
      },
      keyPoints: ['Capacities are sums of volumes.'],
      sourceRefs: rs([20, 22]),
    },
    {
      title: 'Spirometry and FEV1',
      kind: 'mechanism',
      paragraphs: [
        'Lung volumes are measured by spirometry. The residual volume cannot be removed by forced expiration, so a spirometer alone cannot measure it (slide 21).',
        'The vital capacity can be timed over one second: the timed vital capacity or forced expiratory volume in one second (FEV1). It is an index of pulmonary function, normally about 83% of the vital capacity (slide 20).',
        'The residual volume provides a constant source of aeration and keeps the fluctuations of O₂ and CO₂ within narrow ranges. The vital capacity reflects the strength of the respiratory muscles and how far the lungs and chest wall can be stretched (slide 21).',
      ],
      notes: [
        { kind: 'check', text: 'Slide 24 says an FEV/VC of about 47% is seen in restrictive disease. Guyton gives 47% for airway obstruction; in restrictive disease the ratio stays near normal. Not quizzed — confirm with the lecturer.' },
      ],
      keyPoints: ['FEV1 ≈ 83% of the vital capacity normally.', 'Residual volume cannot be measured with a simple spirometer.'],
      sourceRefs: [...rs([20, 21, 24]), ...GUYTON],
    },
    {
      title: 'What Changes the Vital Capacity',
      kind: 'clinical',
      paragraphs: [
        'The vital capacity is increased in athletes and decreased by paralysis of the chest and by conditions that reduce the ability of the lungs to expand: tuberculosis, asthma, lung cancer, chronic bronchitis, fibrosis and pulmonary congestion (for example in cardiac failure) (slide 23).',
        'Lung volumes depend on body size and build, are larger in males than in females, and vary with position: the vital capacity is greater standing and smaller lying down, because the abdominal contents push the diaphragm up (slide 25).',
      ],
      keyPoints: ['VC: ↑ athletes, ↑ standing; ↓ lying down, chest paralysis, lung disease, pulmonary congestion.'],
      sourceRefs: rs([23, 25, 26]),
    },
  ],
  summary: [
    'Four volumes: tidal, inspiratory reserve, expiratory reserve and residual.',
    'VC = IRV + TV + ERV; IC = TV + IRV; FRC = ERV + RV; minute volume = rate × TV.',
    'FEV1 is about 83% of the vital capacity.',
    'Spirometry cannot measure the residual volume.',
    'VC is larger in athletes, in males and standing; smaller lying down and in lung disease.',
  ],
  highYield: ['Functional residual capacity = ERV + RV.', 'Residual volume keeps alveolar O₂ and CO₂ steady between breaths.'],
  confusions: [
    {
      confusion: 'Calling the vital capacity “all the air in the lungs”.',
      clarification: 'The vital capacity excludes the residual volume, which can never be breathed out (slides 20–21).',
    },
  ],
};

// ─── Lesson 3: Compliance, Surfactant and the Work of Breathing ──────

const lesson3: Draft = {
  id: L(3),
  title: 'Compliance, Surfactant and the Work of Breathing',
  description: 'How stretchable the lungs are, what lowers or raises compliance, how surfactant reduces surface tension and what happens without it, and the work needed to breathe.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: rs([27, 28, 29, 30, 31, 32, 33, 34, 35]),
  objectives: [
    'Define lung compliance and explain the recoil of the lungs and chest wall.',
    'List conditions that lower and raise compliance.',
    'Describe what surfactant is, which cells make it and its two main effects.',
    'Explain respiratory distress syndrome and its treatment.',
    'Describe the resistances that make breathing work, and when the work increases.',
  ],
  chunks: [
    {
      title: 'Recoil and Compliance',
      kind: 'definitions',
      paragraphs: [
        'The lungs are made of elastic tissue, so they tend to recoil and pull away from the chest wall. The chest wall also recoils after expansion and during expiration (slide 27).',
        'Lung compliance is the change in lung volume per unit change in airway pressure. It describes the “stretchability” or “expansibility” of the lungs and thorax, and is a measure of lung and chest-wall recoil (slide 27).',
      ],
      terms: [{ term: 'Compliance', meaning: 'Change in lung volume per unit change in airway pressure (ΔV/ΔP).' }],
      sourceRefs: rs([27]),
    },
    {
      title: 'What Changes Compliance',
      kind: 'clinical',
      paragraphs: [
        'Compliance depends on lung volume: it is greater during deflation than during inflation (slide 28).',
        'It is reduced by anything that destroys lung tissue or impedes expansion — fibrosis, oedema, bronchial obstruction — and by anything affecting the chest wall: kyphosis, scoliosis, fibrosing pleurisy and fibrotic muscle (slides 28–29).',
        'Compliance is increased in emphysema (slide 29).',
      ],
      table: {
        columns: ['Compliance ↓', 'Compliance ↑'],
        rows: [
          ['Fibrosis, oedema, bronchial obstruction', 'Emphysema'],
          ['Kyphosis, scoliosis, fibrosing pleurisy, fibrotic muscle', ''],
        ],
      },
      sourceRefs: rs([28, 29]),
    },
    {
      title: 'Surfactant',
      kind: 'mechanism',
      paragraphs: [
        'Surfactant is a lipoprotein mixture, mainly dipalmitoyl phosphatidylcholine, secreted by type II alveolar cells (slide 30).',
        'The force of attraction at the alveolar surface (surface tension) tends to collapse the alveoli; surfactant decreases the surface tension (slide 30).',
        'Surfactant also helps prevent pulmonary oedema: a high surface tension would pull fluid from the alveolar wall into the tissue spaces, and surfactant reduces this pull (the negative pressure) between the pulmonary interstitium and the alveolar spaces (slide 31).',
      ],
      terms: [{ term: 'Dipalmitoyl phosphatidylcholine', meaning: 'The main lipid of surfactant.' }],
      keyPoints: ['Surfactant: type II cells → ↓ surface tension → alveoli stay open and dry.'],
      sourceRefs: rs([30, 31]),
    },
    {
      title: 'When Surfactant Is Missing',
      kind: 'clinical',
      paragraphs: [
        'Surfactant is usually absent in premature babies. Its absence leads to collapse of the lungs (atelectasis) — hyaline membrane disease, or respiratory distress syndrome. Treatment can include giving bovine surfactant, and corticosteroids (slide 32).',
      ],
      terms: [
        { term: 'Atelectasis', meaning: 'Collapse of lung tissue.' },
        { term: 'Hyaline membrane disease', meaning: 'Respiratory distress syndrome of premature babies, from lack of surfactant.' },
      ],
      sourceRefs: rs([32]),
    },
    {
      title: 'Resistance and the Work of Breathing',
      kind: 'mechanism',
      paragraphs: [
        'Resistance of the lungs and chest wall is the pressure difference needed for a unit of air to flow. Breathing has to work against the resistance to airflow in the airways, the elastic tissue of the lung and the forces of surface tension (slide 33).',
        'The work is made up of elastic (compliance) work to expand the lungs (ΔP × ΔV), work against viscosity and work against airway resistance (slide 34).',
        'Normal expiration is passive — the lungs recoil — so no work is done. Work increases in heavy breathing (especially asthma), in pulmonary fibrosis and airway obstruction, and in emphysema, congestive cardiac failure, orthopnoea and dyspnoea (slide 35).',
      ],
      keyPoints: ['Quiet expiration costs no work; fibrosis and obstruction increase the work of breathing.'],
      sourceRefs: rs([33, 34, 35]),
    },
  ],
  summary: [
    'Compliance = change in volume per unit change in pressure.',
    'Compliance falls with fibrosis, oedema, obstruction and chest-wall deformity; it rises in emphysema.',
    'Surfactant (dipalmitoyl phosphatidylcholine) from type II cells lowers surface tension and helps prevent oedema.',
    'Lack of surfactant in premature babies causes respiratory distress syndrome.',
    'Quiet expiration is passive; disease increases the work of breathing.',
  ],
  highYield: ['Emphysema increases compliance; fibrosis decreases it.'],
  confusions: [
    {
      confusion: 'Assuming every lung disease lowers compliance.',
      clarification: 'Emphysema increases compliance, because elastic tissue is lost (slide 29).',
    },
  ],
};

// ─── Lesson 4: Ventilation, Dead Space and the Pulmonary Circulation ─

const lesson4: Draft = {
  id: L(4),
  title: 'Ventilation, Dead Space and the Pulmonary Circulation',
  description: 'How gravity spreads ventilation through the lung, the kinds of dead space, alveolar ventilation, and the low-pressure pulmonary circulation and its response to hypoxia.',
  xp: 25,
  estimatedMinutes: 12,
  sourceRefs: rs([36, 37, 38, 39, 40, 41, 42]),
  objectives: [
    'Explain why the lower parts of the upright lung are better ventilated.',
    'Define anatomical, alveolar and physiological dead space.',
    'Work out alveolar ventilation from tidal volume and dead space.',
    'Describe the features of the pulmonary circulation.',
    'Explain hypoxic pulmonary vasoconstriction.',
  ],
  chunks: [
    {
      title: 'Ventilation and Gravity',
      kind: 'mechanism',
      paragraphs: [
        'Ventilation is the movement of air between the environment and the lungs by inhalation and exhalation (slide 36).',
        'Upright, ventilation per unit of lung volume is greater in the lower parts of the lung than the upper. The dependent parts carry more weight and have a less negative intrapleural pressure, so they are more expandable and have a greater ventilation capacity (slide 36).',
        'Clinically, patients should lie on the side of the good lung (slide 36).',
      ],
      keyPoints: ['Upright: the bases are better ventilated than the apices.'],
      sourceRefs: rs([36]),
    },
    {
      title: 'Dead Space',
      kind: 'definitions',
      paragraphs: [
        'Gas exchange happens only at the alveolar surface, but the whole respiratory tree fills with air. Dead space is the part of the air passages that does not exchange gas with blood in the pulmonary vessels (slide 37).',
        'Inhaled air that takes no part in gas exchange either stays in the conducting airways (anatomical dead space) or reaches alveoli that are not perfused or poorly perfused (alveolar or functional dead space — wasted ventilation). Physiological dead space is the sum of the two (slide 38).',
      ],
      table: {
        columns: ['Dead space', 'Where the air goes'],
        rows: [
          ['Anatomical', 'Stays in the conducting airways'],
          ['Alveolar (functional)', 'Reaches unperfused or poorly perfused alveoli'],
          ['Physiological', 'Anatomical + alveolar'],
        ],
      },
      sourceRefs: rs([37, 38]),
    },
    {
      title: 'Alveolar Ventilation',
      kind: 'mechanism',
      paragraphs: [
        'Alveolar ventilation is less than the tidal volume. Of a tidal volume of about 500 ml, about 150 ml is dead space and about 350 ml reaches the alveoli (slide 39).',
        'Shallow breathing reduces alveolar ventilation and deep breathing increases it, because the dead space is a fixed amount taken from every breath (slide 39).',
      ],
      steps: [
        { label: 'Tidal volume', detail: '≈ 500 ml' },
        { label: 'Dead space', detail: '≈ 150 ml' },
        { label: 'Alveolar air', detail: '≈ 350 ml' },
      ],
      keyPoints: ['Shallow breathing ↓ alveolar ventilation; deep breathing ↑ it.'],
      sourceRefs: rs([39]),
    },
    {
      title: 'The Pulmonary Circulation',
      kind: 'structure',
      paragraphs: [
        'The pulmonary circulation carries about 5.5 litres a minute, the same as the cardiac output. It is a distensible, low-pressure system (about 24/9 mmHg) (slide 40).',
        'About 2% of the blood (from the bronchial arteries, branches of the aorta, supplying the airways) does not take part in gas exchange; it returns to the heart through the pulmonary veins and so dilutes the oxygenated blood (slide 40).',
        'Pulmonary capillaries have a high oncotic pressure and a low hydrostatic pressure, so there is little tendency to pulmonary oedema (slide 40).',
        'Pressure in the pulmonary artery rises from apex to base. The distensible veins act as a pulmonary reservoir: lying down moves about 400 ml of extra blood into the pulmonary circulation, and standing upright moves it out again (slide 41).',
      ],
      keyPoints: ['Low pressure (≈ 24/9 mmHg), high flow (≈ 5.5 L/min).', 'Low hydrostatic + high oncotic pressure → little oedema.'],
      sourceRefs: rs([40, 41]),
    },
    {
      title: 'Hypoxic Pulmonary Vasoconstriction',
      kind: 'regulation',
      paragraphs: [
        'If a bronchus is obstructed, the alveoli beyond it become hypoxic, CO₂ accumulates and the pH falls. In the lung this causes vasoconstriction — the opposite of the vasodilatation that hypoxia produces elsewhere — so blood is moved to the areas that need it (slide 42).',
      ],
      keyPoints: ['Lung vessels constrict in hypoxia; systemic vessels dilate.'],
      sourceRefs: rs([42]),
    },
  ],
  summary: [
    'Upright, the lower parts of the lung are better ventilated.',
    'Physiological dead space = anatomical + alveolar dead space.',
    'Tidal volume 500 ml ≈ 150 ml dead space + 350 ml alveolar air.',
    'The pulmonary circulation is low pressure (24/9 mmHg), high flow and a blood reservoir.',
    'Hypoxia constricts pulmonary vessels, diverting blood to ventilated areas.',
  ],
  highYield: ['Lying down moves about 400 ml of blood into the lungs.', 'Patients should lie on the side of the good lung.'],
  confusions: [
    {
      confusion: 'Thinking hypoxia dilates blood vessels everywhere.',
      clarification: 'In the lung, hypoxia causes vasoconstriction, sending blood away from poorly ventilated alveoli (slide 42).',
    },
  ],
};

// ─── Lesson 5: Oxygen Transport and the Dissociation Curve ───────────

const lesson5: Draft = {
  id: L(5),
  title: 'Oxygen Transport and the Dissociation Curve',
  description: 'How oxygen reaches the tissues, how haemoglobin carries it, why the dissociation curve is S-shaped, and what P50 and right or left shifts mean.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: rs([43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]),
  objectives: [
    'List the factors that determine oxygen delivery to the tissues.',
    'State how much oxygen is dissolved and how much is bound to haemoglobin.',
    'Describe the structure of haemoglobin and explain oxygenation.',
    'Explain the sigmoid shape of the dissociation curve and its flat upper part.',
    'Define P50 and explain right and left shifts.',
  ],
  chunks: [
    {
      title: 'Getting Oxygen to the Tissues',
      kind: 'overview',
      paragraphs: [
        'The partial pressures of O₂ and CO₂ drive transport. O₂ is higher in the air than in the tissues and CO₂ higher in the tissues than in the air, so O₂ moves from air to tissue and CO₂ from tissue to air (slide 43).',
        'Oxygen delivery depends on the O₂ entering the lungs (ventilation), adequate gas exchange in the lungs (ventilation–perfusion), the capacity of the blood to carry O₂ (haemoglobin) and the flow of blood to the tissues (cardiac output) (slide 44).',
        'O₂ is relatively insoluble in water: only about 1% of the O₂ in blood is dissolved in plasma; 99% is combined with haemoglobin (slide 45).',
      ],
      keyPoints: ['Blood O₂: 1% dissolved, 99% on haemoglobin.'],
      sourceRefs: rs([43, 44, 45]),
    },
    {
      title: 'Haemoglobin',
      kind: 'structure',
      paragraphs: [
        'Haemoglobin has four protein subunits, two α and two β chains. Each subunit contains a haem group with a ferrous (Fe²⁺) ion at its centre (slide 46).',
        'Fe²⁺ combines with O₂ but its charge does not change — this is oxygenation, not oxidation. Up to four O₂ molecules are added one at a time (Hb₄ → Hb₄O₂ → … → Hb₄O₈), and the reaction is rapid, about 0.01 s (slide 46).',
      ],
      terms: [{ term: 'Oxygenation', meaning: 'Reversible binding of O₂ to Fe²⁺ without changing it to Fe³⁺.' }],
      keyPoints: ['2α + 2β chains, 4 haems, 4 O₂.', 'Oxygenation, not oxidation.'],
      sourceRefs: rs([46]),
    },
    {
      title: 'The Dissociation Curve',
      kind: 'mechanism',
      paragraphs: [
        'The oxygen–haemoglobin dissociation curve plots the percentage saturation of haemoglobin against the partial pressure of oxygen. It relates O₂ saturation to PO₂, and its position is set by haemoglobin’s affinity for oxygen (slides 47, 49).',
        'Each haemoglobin binds up to four O₂ molecules reversibly. Binding the first is difficult, but it causes a change in the shape of the molecule that makes binding the second, third and fourth easier — affinity rises as successive O₂ molecules bind (slides 48, 50).',
        'More O₂ binds as the PO₂ rises until saturation is approached; then very little more binds and the curve levels off. So the curve is sigmoid (S-shaped) (slides 50–51).',
      ],
      terms: [{ term: 'Sigmoid', meaning: 'S-shaped.' }],
      sourceRefs: rs([47, 48, 49, 50, 51]),
    },
    {
      title: 'The Flat and the Steep Parts',
      kind: 'mechanism',
      paragraphs: [
        'Above about 60 mmHg the curve is relatively flat, so the O₂ content of the blood changes little even with large increases in PO₂ (slide 51).',
        'On the steep part below this, as the PO₂ falls, haemoglobin’s affinity diminishes and O₂ is unloaded readily to the tissues (slide 52).',
      ],
      keyPoints: ['Flat above ≈ 60 mmHg: loading is protected. Steep below: unloading is easy.'],
      sourceRefs: rs([51, 52]),
    },
    {
      title: 'P50 and Shifts of the Curve',
      kind: 'definitions',
      paragraphs: [
        'P50 is the PO₂ at which haemoglobin is 50% saturated, about 26.6 mmHg in a healthy person. It is the conventional measure of haemoglobin’s affinity for O₂ (slides 52–53).',
        'An increased P50 means a rightward shift: a higher PO₂ is needed for the same saturation, so affinity is decreased — O₂ is harder to load but easier to release. This raises the O₂ available to the tissues when it is most needed, as in exercise or haemorrhagic shock (slides 53–55).',
        'A lower P50 means a leftward shift and increased affinity: haemoglobin binds O₂ more easily but unloads it more reluctantly, as in the lungs (slides 53, 55).',
      ],
      table: {
        columns: ['Shift', 'P50', 'Affinity', 'Effect'],
        rows: [
          ['Right', '↑', '↓', 'Easier to release O₂ to tissues'],
          ['Left', '↓', '↑', 'Easier to load O₂, harder to release'],
        ],
      },
      terms: [{ term: 'P50', meaning: 'PO₂ at 50% haemoglobin saturation (≈ 26.6 mmHg).' }],
      sourceRefs: rs([52, 53, 54, 55]),
    },
  ],
  summary: [
    'O₂ delivery depends on ventilation, V/Q matching, haemoglobin and cardiac output.',
    'Only 1% of blood O₂ is dissolved; 99% is on haemoglobin.',
    'Haemoglobin: 2α + 2β chains, four Fe²⁺ haems; oxygenation not oxidation.',
    'Cooperative binding makes the curve sigmoid; it is flat above about 60 mmHg.',
    'P50 ≈ 26.6 mmHg; right shift = lower affinity, left shift = higher affinity.',
  ],
  highYield: ['Right shift helps unloading in exercising tissues.', 'P50 is the standard measure of affinity.'],
  confusions: [
    {
      confusion: 'Thinking a right shift means the blood holds more oxygen.',
      clarification: 'A right shift lowers affinity, so haemoglobin gives up O₂ more easily to the tissues (slide 54).',
    },
  ],
};

// ─── Lesson 6: Shifting the Curve, Myoglobin, CO and CO₂ Transport ──

const lesson6: Draft = {
  id: L(6),
  title: 'Shifting the Curve, Myoglobin, Carbon Monoxide and CO₂ Transport',
  description: 'What moves the dissociation curve right or left, 2,3-DPG, the Bohr and Haldane effects, fetal haemoglobin and myoglobin, carbon monoxide, and the three ways CO₂ is carried.',
  xp: 25,
  estimatedMinutes: 15,
  sourceRefs: rs([56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]),
  objectives: [
    'List the factors that shift the curve to the right and to the left.',
    'Describe where 2,3-DPG comes from, how it acts and what raises it.',
    'Explain the Bohr and Haldane effects and where each matters.',
    'Compare fetal haemoglobin and myoglobin with adult haemoglobin.',
    'Explain why carbon monoxide is dangerous and how it is treated.',
    'Describe the transport of CO₂, including the chloride shift.',
  ],
  chunks: [
    {
      title: 'What Shifts the Curve',
      kind: 'regulation',
      paragraphs: [
        'The curve shifts to the right (less affinity) with a rise in temperature, a fall in pH, a rise in CO₂ and a rise in 2,3-diphosphoglycerate (2,3-DPG). It shifts to the left (more affinity) with the opposite changes: lower temperature, higher pH, lower CO₂ and less 2,3-DPG (slide 56).',
        'To work out a shift, ask whether the tissues need O₂: raised metabolism means acidosis and a higher temperature, and these shift the curve right so more O₂ is released (slide 58).',
      ],
      table: {
        columns: ['Right shift (↓ affinity)', 'Left shift (↑ affinity)'],
        rows: [
          ['↑ Temperature', '↓ Temperature'],
          ['↓ pH', '↑ pH'],
          ['↑ CO₂', '↓ CO₂'],
          ['↑ 2,3-DPG', '↓ 2,3-DPG'],
        ],
      },
      keyPoints: ['Active tissue is hot, acidic and high in CO₂ → right shift → more O₂ released.'],
      sourceRefs: rs([56, 57, 58, 61, 62]),
    },
    {
      title: '2,3-DPG',
      kind: 'regulation',
      paragraphs: [
        '2,3-DPG is formed in the glycolytic pathway and binds to the β chains of haemoglobin: HbO₂ + 2,3-DPG ⇌ Hb–2,3-DPG + O₂. So more 2,3-DPG releases more O₂ (slide 58).',
        '2,3-DPG is increased by thyroid hormone, growth hormone and androgens, by exercise, by ascent to high altitude (through the alkalosis), by anaemia and by any condition with chronic hypoxia (slide 63).',
      ],
      keyPoints: ['2,3-DPG binds β chains → right shift.'],
      sourceRefs: rs([58, 63]),
    },
    {
      title: 'The Bohr and Haldane Effects',
      kind: 'mechanism',
      paragraphs: [
        'Bohr effect: haemoglobin’s O₂ binding is inversely related to acidity and to the CO₂ concentration. CO₂ reacts with water to form carbonic acid, so a rise in CO₂ lowers the pH and haemoglobin releases its O₂; a fall in CO₂ raises the pH and haemoglobin picks up more O₂. The right shift when pH falls (CO₂ rises) is the Bohr effect (slides 59, 64, 70).',
        'Haldane effect: in the lungs, oxygenation of the blood displaces CO₂ from haemoglobin, increasing its removal. Oxygen binding makes haemoglobin a stronger acid, so it releases H⁺, which combines with HCO₃⁻ to release CO₂ into the alveoli. So deoxygenated haemoglobin carries more CO₂ than oxygenated haemoglobin: with O₂ present CO₂ is released, and without O₂ it is taken up (slides 60, 70).',
      ],
      table: {
        columns: ['Effect', 'What changes what', 'Where it matters most'],
        rows: [
          ['Bohr', 'CO₂ and H⁺ lower haemoglobin’s affinity for O₂', 'Tissues: helps O₂ unloading'],
          ['Haldane', 'O₂ binding lowers haemoglobin’s capacity for CO₂', 'Lungs: helps CO₂ unloading'],
        ],
      },
      sourceRefs: rs([59, 60, 64, 70, 71]),
    },
    {
      title: 'Fetal Haemoglobin and Myoglobin',
      kind: 'comparison',
      paragraphs: [
        'Fetal haemoglobin has less affinity for 2,3-DPG, so it has more affinity for O₂ than the mother’s blood, and O₂ is given up readily from the mother to the fetus (slide 64).',
        'Myoglobin is an iron-containing pigment found in skeletal muscle. It resembles haemoglobin but binds one O₂, not four. It has more affinity for O₂ than haemoglobin, so it takes up O₂ from the blood, and releases it only at low PO₂ levels (slide 65).',
      ],
      keyPoints: ['Fetal Hb: less 2,3-DPG binding → higher O₂ affinity.', 'Myoglobin: 1 O₂, higher affinity, releases at low PO₂.'],
      sourceRefs: rs([64, 65]),
    },
    {
      title: 'Carbon Monoxide',
      kind: 'clinical',
      paragraphs: [
        'Haemoglobin has a much higher affinity for carbon monoxide than for O₂ — about 210 times — so CO displaces O₂ from haemoglobin (carbonmonoxyhaemoglobin). It also shifts the dissociation curve of the remaining haemoglobin to the left, so less O₂ is released (slides 66, 126).',
        'How much forms depends on the duration of exposure, the concentration of CO and the alveolar ventilation. Carbonmonoxyhaemoglobin is red, so there is no cyanosis. Treatment is a high concentration of O₂ (hyperbaric oxygen) (slide 66).',
      ],
      notes: [{ kind: 'textbook', text: 'Guyton gives the affinity of haemoglobin for CO as about 250 times that for O₂; the lecture gives 210.' }],
      keyPoints: ['CO: displaces O₂ + left shift → tissue hypoxia without cyanosis.'],
      sourceRefs: [...rs([66, 126]), ...GUYTON],
    },
    {
      title: 'How CO₂ Is Carried',
      kind: 'pathway',
      paragraphs: [
        'CO₂ is more than 20 times as soluble in water as O₂. It moves out of the tissues into the capillaries down a partial pressure gradient (arterial 40, venous 46 mmHg) and is carried dissolved, as bicarbonate and as carbamino compounds (slide 67).',
        'In red cells, carbonic anhydrase speeds the reaction CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ (slides 67–68).',
        'As HCO₃⁻ moves out of the red cell, Cl⁻ moves in to keep electrical neutrality — the chloride shift — so venous blood has more Cl⁻ in its red cells than arterial blood (slide 69).',
        'CO₂ also reacts directly with haemoglobin to form carbaminohaemoglobin, and a small amount combines with plasma proteins (slide 69).',
      ],
      steps: [
        { label: 'Dissolved', detail: 'CO₂ is about 20 times as soluble as O₂.' },
        { label: 'Bicarbonate', detail: 'Carbonic anhydrase in red cells; HCO₃⁻ out, Cl⁻ in (chloride shift).' },
        { label: 'Carbamino compounds', detail: 'CO₂ bound to haemoglobin and plasma proteins.' },
      ],
      notes: [{ kind: 'textbook', text: 'Guyton: about 70% of CO₂ is carried as bicarbonate, 20–30% as carbamino compounds and about 7% dissolved. The slide’s “about 30%” is read here as the carbamino share.' }],
      terms: [
        { term: 'Chloride shift', meaning: 'Movement of Cl⁻ into red cells as HCO₃⁻ leaves them.' },
        { term: 'Carbaminohaemoglobin', meaning: 'CO₂ bound directly to haemoglobin.' },
      ],
      sourceRefs: [...rs([67, 68, 69]), ...GUYTON],
    },
  ],
  summary: [
    'Right shift: ↑ temperature, ↓ pH, ↑ CO₂, ↑ 2,3-DPG.',
    '2,3-DPG comes from glycolysis, binds β chains and rises at altitude, in anaemia and in chronic hypoxia.',
    'Bohr: CO₂/H⁺ release O₂ (tissues). Haldane: O₂ releases CO₂ (lungs).',
    'Fetal Hb and myoglobin have higher O₂ affinity than adult Hb.',
    'CO binds Hb about 210 times more strongly than O₂, shifts the curve left and causes no cyanosis.',
    'CO₂ travels dissolved, as bicarbonate (chloride shift) and as carbamino compounds.',
  ],
  highYield: ['Venous red cells have more Cl⁻ than arterial (chloride shift).', 'CO poisoning: cherry-red colour, no cyanosis, treat with hyperbaric O₂.'],
  confusions: [
    {
      confusion: 'Mixing up the Bohr and Haldane effects.',
      clarification: 'Bohr: CO₂/acid lowers O₂ affinity. Haldane: O₂ lowers CO₂ carriage (slides 59–60, 70).',
    },
  ],
};

// ─── Lesson 7: Gas Exchange, Diffusion and Ventilation–Perfusion ────

const lesson7: Draft = {
  id: L(7),
  title: 'Gas Exchange, Diffusion and Ventilation–Perfusion',
  description: 'How gases diffuse across the respiratory membrane, the blood gas values, what sets alveolar PO₂ and PCO₂, diffusing capacity, and the ventilation–perfusion ratio.',
  xp: 25,
  estimatedMinutes: 14,
  sourceRefs: rs([72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]),
  objectives: [
    'State the normal PO₂ and PCO₂ of arterial and venous blood.',
    'Explain why alveolar gas changes only slowly, and what sets alveolar PCO₂.',
    'Describe the respiratory membrane and the factors that affect diffusion.',
    'Define diffusing capacity and explain why it rises in exercise.',
    'Interpret V/Q ratios of 0, infinity, below 1 and above 1.',
    'Explain why the lung apex has a high V/Q and a predilection for tuberculosis.',
  ],
  chunks: [
    {
      title: 'Diffusion and Blood Gases',
      kind: 'mechanism',
      paragraphs: [
        'Gas exchange happens mainly by diffusion: net movement of a gas from an area of high to low partial pressure. The partial pressure of a gas is proportional to its concentration, and its rate of diffusion is proportional to its partial pressure (slide 72).',
      ],
      table: {
        columns: ['Gas (mmHg)', 'Venous blood', 'Arterial blood'],
        rows: [
          ['PO₂', '40', '95–100'],
          ['PCO₂', '46', '40'],
        ],
      },
      sourceRefs: rs([72, 73]),
    },
    {
      title: 'Alveolar Air',
      kind: 'regulation',
      paragraphs: [
        'Alveolar air is replaced only slowly, so its partial pressures stay within narrow limits. This prevents sudden changes in blood gas concentrations and excessive fluctuations of PO₂ and PCO₂ (slide 74).',
        'Alveolar O₂ is continually replenished by air entering the alveoli. It depends on the rate of O₂ absorption into the blood and on ventilation. At normal atmospheric pressure the alveolar PO₂ cannot rise above about 149 mmHg (slide 75).',
        'Alveolar PCO₂ depends on the rate of CO₂ excretion from blood into the alveoli and on its removal by ventilation: it rises in direct proportion to CO₂ excretion and inversely to ventilation (slide 76).',
      ],
      keyPoints: ['Alveolar PCO₂ ∝ CO₂ production ÷ ventilation.'],
      sourceRefs: rs([74, 75, 76]),
    },
    {
      title: 'The Respiratory Membrane',
      kind: 'structure',
      paragraphs: [
        'Gas is exchanged across the alveolar wall and the capillary wall together — the respiratory (pulmonary) membrane — which has a very large surface area with an extensive network of pulmonary capillaries (slide 77).',
        'The capillaries are so narrow that red cells touch the capillary wall as they squeeze through, so O₂ and CO₂ diffuse directly with little fluid in the way. O₂ and CO₂ are fat-soluble and pass through membranes readily, but not as readily through water (slide 78).',
        'The rate of diffusion falls as the membrane thickens (diffusion ∝ 1/thickness), for example with oedema or fibrosis, and as the surface area falls — removing a lung, destroying alveoli, or alveoli coalescing in emphysema (slide 79).',
        'Diffusion also depends on the gas’s diffusion coefficient (its solubility in the membrane and its size) and on the pressure difference across the membrane. Because water is the rate-limiting step, diffusion through the membrane is about the same as diffusion in water (slide 80).',
      ],
      notes: [{ kind: 'check', text: 'Slide 77 gives the alveolar membrane as about 160 m²; Guyton gives about 70 m² for the respiratory membrane. The number is not quizzed.' }],
      keyPoints: ['Diffusion ↓ with thickening (oedema, fibrosis) and ↓ area (lung removal, emphysema).'],
      sourceRefs: [...rs([77, 78, 79, 80]), ...GUYTON],
    },
    {
      title: 'Diffusing Capacity',
      kind: 'definitions',
      paragraphs: [
        'Diffusing capacity is the volume of a gas that diffuses through the membrane each minute for a pressure difference of 1 mmHg. It is greater for CO₂ than for O₂ (slide 81).',
        'It rises in strenuous exercise, with increased alveolar ventilation and blood flow, from the opening of dormant capillaries and dilatation of those already open (slide 81).',
        'When the membrane is damaged, O₂ fails to get in before CO₂ fails to get out (slide 81).',
      ],
      notes: [{ kind: 'clarified', text: 'Slide 81 says CO₂’s diffusing capacity is “≈ 20% more” than O₂’s. Guyton: CO₂ diffuses about 20 times as fast, so its diffusing capacity is about 20 times greater.' }],
      keyPoints: ['Membrane damage hits O₂ uptake before CO₂ removal.'],
      sourceRefs: [...rs([81, 82]), ...GUYTON],
    },
    {
      title: 'The Ventilation–Perfusion Ratio',
      kind: 'mechanism',
      paragraphs: [
        'Ideally every alveolus would be ventilated equally and every capillary perfused equally, but in reality some areas are well ventilated but poorly perfused and others well perfused but poorly ventilated. The ventilation–perfusion ratio (V/Q) takes this mismatch into account (slides 83–84).',
        'V/Q = 0: perfusion but no ventilation, so no gas exchange. The alveolar air (residual volume) equilibrates with venous blood, PO₂ 40 and PCO₂ 46 mmHg (slide 84).',
        'V/Q = infinity: ventilation but no perfusion. The alveolar air is humidified inspired air, high in O₂ and with almost no CO₂ (PO₂ 149, PCO₂ 0); O₂ is not taken away and CO₂ is not delivered (slide 85).',
        'V/Q < 1: some blood is not ventilated, so a fraction is shunted — physiological shunt. V/Q > 1: wasted ventilation — physiological dead space (slide 86).',
      ],
      table: {
        columns: ['V/Q', 'Meaning', 'Alveolar gas'],
        rows: [
          ['0', 'Perfused, not ventilated (shunt)', 'Like venous blood: PO₂ 40, PCO₂ 46'],
          ['< 1', 'Physiological shunt', ''],
          ['> 1', 'Wasted ventilation (physiological dead space)', ''],
          ['∞', 'Ventilated, not perfused (dead space)', 'Like inspired air: PO₂ 149, PCO₂ 0'],
        ],
      },
      notes: [{ kind: 'clarified', text: 'Slide 84 gives V/Q = 1 as normal; Guyton gives the whole-lung average as about 0.8. V/Q = 1 is perfect matching.' }],
      sourceRefs: [...rs([83, 84, 85, 86]), ...GUYTON],
    },
    {
      title: 'The Lung Apex',
      kind: 'clinical',
      paragraphs: [
        'In the upright lung both ventilation and perfusion are low at the apex, but perfusion is reduced much more. So the apex has a high V/Q, a lot of dead space and a high PO₂ — which is why the apex has a predilection for tuberculosis (slide 87).',
      ],
      keyPoints: ['Apex: high V/Q, high PO₂ → TB likes the apex.'],
      sourceRefs: rs([87, 88, 89, 90]),
    },
  ],
  summary: [
    'Arterial PO₂ 95–100 and PCO₂ 40; venous PO₂ 40 and PCO₂ 46 mmHg.',
    'Alveolar air changes slowly; alveolar PCO₂ rises with CO₂ output and falls with ventilation.',
    'Diffusion falls with a thicker or smaller respiratory membrane.',
    'Diffusing capacity is greater for CO₂ and rises in exercise.',
    'V/Q = 0 is shunt; V/Q = ∞ is dead space; the apex has a high V/Q.',
  ],
  highYield: ['Membrane damage: O₂ uptake fails before CO₂ removal.', 'The lung apex is a favoured site for TB.'],
  confusions: [
    {
      confusion: 'Thinking a V/Q of zero means no blood flow.',
      clarification: 'V/Q = 0 means no ventilation with blood still flowing (shunt); V/Q = ∞ is no blood flow (slides 84–85).',
    },
  ],
};

// ─── Lesson 8: Control of Breathing and Respiratory Reflexes ────────

const lesson8: Draft = {
  id: L(8),
  title: 'Control of Breathing and Respiratory Reflexes',
  description: 'The voluntary and automatic control of breathing, the medullary and pontine centres, the Hering–Breuer reflex, the chemoreceptors and their responses, protective reflexes and breathing in exercise.',
  xp: 25,
  estimatedMinutes: 16,
  sourceRefs: rs([91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]),
  objectives: [
    'Distinguish voluntary from automatic control of breathing.',
    'Describe the medullary I and E neurons and their groups.',
    'Explain the transection experiments and the pneumotaxic and apneustic centres.',
    'Describe the Hering–Breuer reflex.',
    'Compare peripheral and central chemoreceptors.',
    'Explain the responses to acidosis, CO₂ excess, O₂ lack and breath-holding.',
    'Describe the cough and sneeze reflexes, glottic closure in swallowing, and breathing in exercise.',
  ],
  chunks: [
    {
      title: 'Voluntary and Automatic Control',
      kind: 'overview',
      paragraphs: [
        'Breathing is spontaneous, from spontaneous discharge of motor neurons to the respiratory muscles. You can hold your breath for a while, but eventually other controlling factors take over and force a breath. The main control is neural; chemical factors — pH, CO₂ and O₂ — also act (slide 91).',
        'Voluntary control comes from the cerebral cortex through the corticospinal tracts to the respiratory motor neurons in the spinal cord. Automatic control comes from the pons and medulla, through fibres between the lateral and ventral corticospinal tracts to the same motor neurons (slide 92).',
      ],
      sourceRefs: rs([91, 92]),
    },
    {
      title: 'The Medullary Centres',
      kind: 'structure',
      paragraphs: [
        'The medulla produces rhythmic, automatic breathing through two neuron systems: inspiratory (I) neurons and expiratory (E) neurons. In quiet breathing the E neurons do not discharge, because expiration is passive; they discharge in forced expiration or increased ventilation (slide 93).',
        'The neurons lie in a dorsal group near the nucleus of the tractus solitarius and a ventral group near the nucleus ambiguus. Although the I neurons fire spontaneously, they are influenced by impulses from the pons and from the vagus (from receptors in the lungs) (slide 94).',
      ],
      table: {
        columns: ['Group', 'Location'],
        rows: [
          ['Dorsal respiratory group', 'Near the nucleus of the tractus solitarius'],
          ['Ventral respiratory group', 'Near the nucleus ambiguus'],
        ],
      },
      sourceRefs: rs([93, 94]),
    },
    {
      title: 'Transection Experiments and the Pons',
      kind: 'mechanism',
      paragraphs: [
        'Transecting below the medulla stops breathing. Transecting above the pons (removing cortical influence, with the vagi intact) leaves regular breathing (slide 95).',
        'Removing the influence of the upper pons and the vagi (transection in the lower pons, vagi cut) leaves the I neurons uncontrolled: sustained contraction of the inspiratory muscles, an arrest of breathing in inspiration called apneusis. The area in the upper pons that prevents apneusis is the pneumotaxic area; the area in the lower pons responsible for apneusis is the apneustic centre (slides 95–96).',
        'When the pontine influence is removed, breathing continues but is gasping, with some rhythm — the pons smooths breathing (slide 98).',
      ],
      steps: [
        { label: 'Cut below the medulla', detail: 'Breathing stops.' },
        { label: 'Cut above the pons', detail: 'Regular breathing continues.' },
        { label: 'Cut lower pons + vagi', detail: 'Apneusis: breath held in inspiration.' },
      ],
      terms: [
        { term: 'Apneusis', meaning: 'Arrest of breathing in inspiration.' },
        { term: 'Pneumotaxic centre', meaning: 'Upper pontine area that prevents apneusis.' },
        { term: 'Apneustic centre', meaning: 'Lower pontine area responsible for apneusis.' },
      ],
      sourceRefs: rs([95, 96, 98]),
    },
    {
      title: 'The Hering–Breuer Reflex',
      kind: 'regulation',
      paragraphs: [
        'When inspiration inflates the lungs, stretch receptors send afferents through the vagus to the medulla, inhibiting the I neurons and so the respiratory drive; this protects against over-inflation. It also reinforces the pneumotaxic centre in preventing apneusis (slide 97).',
      ],
      keyPoints: ['Stretch → vagus → inhibits I neurons → inspiration ends.'],
      sourceRefs: rs([97]),
    },
    {
      title: 'Chemoreceptors',
      kind: 'regulation',
      paragraphs: [
        'Respiratory centre activity is increased by a rise in CO₂, a fall in pH and a fall in O₂; the reverse changes inhibit it. The aim of chemical control is to keep CO₂, O₂ and pH within the normal range. The changes are monitored by peripheral chemoreceptors (carotid and aortic bodies) and central chemoreceptors (cells in the medulla) (slide 99).',
        'The carotid and aortic bodies send afferents in the glossopharyngeal and vagus nerves. They have a very high blood flow and respond to the dissolved O₂ (PO₂), so they are not stimulated in anaemia or CO poisoning. They are stimulated by stasis of blood, a low PO₂, H⁺ accumulation and drugs that stop cells using O₂, such as cyanide (slide 100).',
        'The medullary (central) receptors monitor the H⁺ concentration of the CSF. CO₂ crosses the blood–brain barrier readily, while H⁺ and HCO₃⁻ cross slowly; in the CSF, CO₂ + H₂O forms H⁺ + HCO₃⁻, so CSF H⁺ follows the arterial CO₂ (slide 101).',
      ],
      table: {
        columns: ['', 'Peripheral', 'Central'],
        rows: [
          ['Where', 'Carotid and aortic bodies', 'Medulla'],
          ['Nerves', 'Glossopharyngeal and vagus', '—'],
          ['Respond to', 'Low PO₂, H⁺, stasis, cyanide', 'H⁺ in the CSF (from arterial CO₂)'],
          ['Not stimulated by', 'Anaemia, CO poisoning', ''],
        ],
      },
      sourceRefs: rs([99, 100, 101, 102]),
    },
    {
      title: 'Responses to Chemical Changes',
      kind: 'regulation',
      paragraphs: [
        'Metabolic acidosis stimulates breathing; CO₂ is washed out and H⁺ falls (pH rises) in compensation. Alkalosis depresses the respiratory centre (slide 103).',
        'A rise in CO₂ increases ventilation. But if the inspired air contains more than about 7% CO₂, the alveolar PCO₂ rises despite hyperventilation; arterial CO₂ rises (hypercapnia) and the CNS, including the respiratory centre, is depressed — CO₂ narcosis, with headache, confusion and coma (slide 104).',
        'Reduced inspired PO₂ increases chemoreceptor activity, but ventilation rises little because the extra breathing washes out CO₂, which inhibits respiration. Only a very low arterial PO₂ overcomes this; low O₂ also makes the respiratory system more sensitive to a rise in CO₂ (slide 105).',
        'Breath-holding is voluntary until the breaking point. While the breath is held, CO₂ is not washed out of alveolar air, so arterial CO₂ rises and O₂ falls, which stimulates respiration (slide 106).',
      ],
      terms: [
        { term: 'CO₂ narcosis', meaning: 'CNS depression (headache, confusion, coma) from very high CO₂.' },
        { term: 'Breaking point', meaning: 'The moment breath-holding can no longer be continued.' },
      ],
      sourceRefs: rs([103, 104, 105, 106]),
    },
    {
      title: 'Cough, Sneeze and Swallowing',
      kind: 'pathway',
      paragraphs: [
        'Cough: the bronchi and trachea are sensitive to touch. Afferent impulses pass in the vagus to the medulla, triggering a deep inspiration. The epiglottis and vocal cords close, trapping air in the lungs; the abdominal wall and internal intercostals contract forcefully, pushing the diaphragm up and raising lung pressure. The epiglottis and cords open suddenly and air under pressure explodes outward, carrying foreign matter with it (slides 107–108).',
        'Sneeze: a similar mechanism, but the afferents are in the trigeminal (5th cranial) nerve, and depression of the uvula directs the air through the nose instead of the mouth (slide 109).',
        'Early in inspiration the abductor muscles of the larynx pull the vocal cords apart and open the glottis. In swallowing, reflex contraction of the adductors closes the glottis and prevents aspiration. In the unconscious or anaesthetised, incomplete closure lets vomitus enter the trachea, causing aspiration pneumonia (slide 110).',
      ],
      steps: [
        { label: 'Touch receptors → vagus → medulla', detail: '' },
        { label: 'Deep inspiration', detail: '' },
        { label: 'Epiglottis and vocal cords close', detail: 'Air trapped in the lungs.' },
        { label: 'Abdominal wall and internal intercostals contract', detail: 'Diaphragm pushed up; lung pressure rises.' },
        { label: 'Epiglottis and cords open suddenly', detail: 'Air explodes outward.' },
      ],
      sourceRefs: rs([107, 108, 109, 110]),
    },
    {
      title: 'Breathing in Exercise',
      kind: 'regulation',
      paragraphs: [
        'In exercise, blood flow, respiratory excursions, ventilation rate, the O₂ delivered per minute and the uptake of O₂ by blood all rise. Muscles remove more O₂ from the blood, so the venous PO₂ falls from about 40 mmHg to as low as 25 mmHg, giving a bigger gradient in the lungs and more O₂ uptake (slide 111).',
        'Impulses from proprioceptors in muscles, tendons and joints may cause the initial rise in breathing early in exercise. In severe exercise, lactic acid liberates CO₂, which stimulates the respiratory centre (slide 112).',
      ],
      keyPoints: ['Early exercise: proprioceptors. Severe exercise: lactic acid → CO₂ → respiratory centre.'],
      sourceRefs: rs([111, 112]),
    },
  ],
  summary: [
    'Voluntary control: cortex → corticospinal tracts. Automatic control: pons and medulla.',
    'Medullary I neurons drive inspiration; E neurons fire only in forced expiration.',
    'Lower pontine transection with vagi cut gives apneusis; the pneumotaxic centre prevents it.',
    'Hering–Breuer: lung stretch inhibits inspiration via the vagus.',
    'Peripheral chemoreceptors sense PO₂ (not O₂ content); central ones sense CSF H⁺ from CO₂.',
    'Over 7% inspired CO₂ causes CO₂ narcosis; cough uses the vagus, sneeze the trigeminal nerve.',
  ],
  highYield: [
    'Carotid bodies: glossopharyngeal nerve; aortic bodies: vagus.',
    'Anaemia and CO poisoning do not stimulate the peripheral chemoreceptors.',
  ],
  confusions: [
    {
      confusion: 'Thinking the peripheral chemoreceptors respond to low O₂ content.',
      clarification: 'They respond to dissolved O₂ (PO₂), so anaemia and CO poisoning do not stimulate them (slide 100).',
    },
  ],
};

// ─── Lesson 9: Hypoxia, Cyanosis and Breathing in Unusual Conditions ─

const lesson9: Draft = {
  id: L(9),
  title: 'Hypoxia, Cyanosis and Breathing in Unusual Conditions',
  description: 'The four types of hypoxia and their effects, cyanosis, high altitude and acclimatisation, oxygen therapy, CO₂ disorders, diving, drowning, life-saving procedures and respiratory control of pH.',
  xp: 25,
  estimatedMinutes: 18,
  sourceRefs: rs([113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138]),
  objectives: [
    'Classify hypoxia into its four types with examples.',
    'Describe the effects of hypoxia and define dyspnoea, tachypnoea and hyperpnoea.',
    'Explain cyanosis, its types, and the conditions without it.',
    'Describe the effects of high altitude, mountain sickness and acclimatisation.',
    'Explain the dangers of 100% oxygen.',
    'Describe hypercapnia, hypocapnia, asphyxia, decompression sickness and drowning.',
    'Explain respiratory regulation of pH.',
  ],
  chunks: [
    {
      title: 'The Four Types of Hypoxia',
      kind: 'classification',
      paragraphs: [
        'Hypoxia is a deficiency of O₂ at tissue level; anoxia, the total absence of O₂, is an impossible state (slide 113).',
      ],
      table: {
        columns: ['Type', 'Problem', 'Example'],
        rows: [
          ['Hypoxic', 'Arterial PO₂ reduced', 'High altitude, lung disease'],
          ['Anaemic', 'Not enough haemoglobin to carry O₂', 'Anaemia, CO poisoning'],
          ['Stagnant (ischaemic)', 'Slow blood flow, so O₂ not delivered', 'Shock'],
          ['Histotoxic', 'Toxins stop cells using O₂', 'Cyanide poisoning'],
        ],
      },
      sourceRefs: rs([113, 126]),
    },
    {
      title: 'Effects of Hypoxia',
      kind: 'clinical',
      paragraphs: [
        'O₂ is vital, especially to the brain, so brain effects appear first. Minor effects: mental symptoms like drunkenness, drowsiness, dulled pain sense, excitability, headache, anorexia, nausea and vomiting, tachycardia and, in severe cases, hypertension. Serious effects: loss of consciousness and death (slides 114–115).',
        'Dyspnoea is shortness of breath — laboured or difficult breathing. Tachypnoea is rapid, shallow breathing. Hyperpnoea is an increased rate and depth of breathing (slide 115).',
      ],
      terms: [
        { term: 'Dyspnoea', meaning: 'Shortness of breath; laboured breathing.' },
        { term: 'Tachypnoea', meaning: 'Rapid, shallow breathing.' },
        { term: 'Hyperpnoea', meaning: 'Increased rate and depth of breathing.' },
      ],
      sourceRefs: rs([114, 115]),
    },
    {
      title: 'Cyanosis',
      kind: 'clinical',
      paragraphs: [
        'Cyanosis is a bluish colour of the skin and mucous membranes — nail beds, earlobes, lips, fingers and tongue — from reduced (deoxygenated) haemoglobin. It appears when about 5 g/dl of haemoglobin is deoxygenated. It depends on the amount of haemoglobin, its degree of saturation and the state of the capillary circulation (slides 116–117).',
        'Central cyanosis is seen on the tongue. Peripheral cyanosis is seen in the skin and fingertips, for example with moderate cold: vasoconstriction slows blood flow so more O₂ is removed from haemoglobin. In severe cold there is no cyanosis, because cold shifts the curve to the left and haemoglobin holds its O₂ (slides 117–118).',
        'No cyanosis occurs in anaemic hypoxia (too little haemoglobin to become reduced), histotoxic hypoxia (blood O₂ stays high) or CO poisoning (cherry-red colour). A high level of methaemoglobin (Fe³⁺ instead of Fe²⁺) gives a bluish colour (slide 118).',
      ],
      keyPoints: ['Cyanosis needs about 5 g/dl of deoxygenated Hb.', 'No cyanosis: anaemia, histotoxic hypoxia, CO poisoning, severe cold.'],
      sourceRefs: rs([116, 117, 118]),
    },
    {
      title: 'High Altitude',
      kind: 'clinical',
      paragraphs: [
        'Ascent lowers the barometric pressure and so the atmospheric PO₂ — the commonest cause of hypoxic hypoxia; above about 3000 m the PO₂ falls to about 60 mmHg. Other causes include lung disease (pneumonia), pump failure and failure of the exchange apparatus (slide 119).',
        'Hypoxia stimulates the chemoreceptors, causing hyperventilation, part of acclimatisation (slide 120).',
        'Transient mountain sickness starts 8–24 hours after arriving at altitude: headache, breathlessness, insomnia, irritability, nausea and vomiting. Low arterial O₂ dilates arterioles, raising capillary hydrostatic pressure; fluid transudes, causing cerebral and pulmonary oedema. It is more common if one works early in the ascent; rest or give O₂ (slide 121).',
      ],
      notes: [{ kind: 'check', text: 'Slide 119 gives the sea-level PO₂ as about 194 mmHg; Guyton gives about 159 mmHg. Not quizzed.' }],
      sourceRefs: [...rs([119, 120, 121]), ...GUYTON],
    },
    {
      title: 'Acclimatisation',
      kind: 'regulation',
      paragraphs: [
        'In low O₂, hyperventilation causes alkalosis, which shifts the curve to the left. But the alkalosis raises 2,3-DPG, which lowers the affinity and shifts the curve to the right, making O₂ more available to the tissues. The initial alkalosis may depress breathing, but active transport of H⁺ into the CSF restores the stimulation within 3–4 days (slide 122).',
        'Erythropoietin rises and haemoglobin increases within 2–3 days and stays raised. Myoglobin and mitochondria also increase (slide 123).',
      ],
      steps: [
        { label: 'Hyperventilation', detail: 'Alkalosis.' },
        { label: '↑ 2,3-DPG', detail: 'Curve shifts right; more O₂ to tissues.' },
        { label: 'H⁺ into CSF (3–4 days)', detail: 'Restores respiratory drive.' },
        { label: '↑ Erythropoietin', detail: 'More haemoglobin, myoglobin and mitochondria.' },
      ],
      sourceRefs: rs([122, 123]),
    },
    {
      title: 'Failure of the Exchange Apparatus',
      kind: 'clinical',
      paragraphs: [
        'Other causes of hypoxic hypoxia are failures of the exchange apparatus: ventilation–perfusion mismatch (wasted ventilation and physiological shunts); venous shunts where blood bypasses the lungs, such as cyanotic congenital heart disease; lung collapse (atelectasis) from absent surfactant, obstruction of a main bronchus, or pneumothorax (raised intrapleural pressure), hydrothorax and haemothorax; and emphysema, with loss of elastic tissue and increased physiological dead space (slides 124–125).',
        'CO poisoning is an anaemic hypoxia: haemoglobin cannot take up O₂ (affinity for CO about 210 times that for O₂) and the curve of the remaining HbO₂ shifts left. Shock causes stagnant hypoxia and cyanide poisoning histotoxic hypoxia (slide 126).',
      ],
      sourceRefs: rs([124, 125, 126]),
    },
    {
      title: 'Oxygen Treatment',
      kind: 'clinical',
      paragraphs: [
        'In severe hypoxia with hypercapnia, do not give 100% O₂: the drive for breathing is the raised CO₂ and the low O₂, so pure O₂ depresses the respiratory centre. Give air (slide 127).',
        '100% O₂ is toxic, forming superoxide (O₂⁻) and H₂O₂. Breathing it for more than 8 hours irritates the airways, inhibits surfactant production and kills lung macrophages; lung damage follows in 24–48 hours. In infants it causes bronchopulmonary dysplasia (lung cysts) and retrolental fibroplasia (abnormal vascular tissue developing in the retina) (slides 127–128).',
      ],
      keyPoints: ['Hypoxia + hypercapnia: give air, not 100% O₂.'],
      sourceRefs: rs([127, 128]),
    },
    {
      title: 'CO₂ Disorders and Asphyxia',
      kind: 'clinical',
      paragraphs: [
        'CO₂ retention (hypercapnia) first stimulates breathing, then depresses the CNS: confusion, reduced sensory activity, coma, respiratory depression and death. It causes a respiratory acidosis, compensated by the kidneys reabsorbing more HCO₃⁻. A cause is pump failure (slide 129).',
        'Hypocapnia (low CO₂) is caused by hyperventilation washing out CO₂. It causes respiratory alkalosis, cerebral vasoconstriction and ischaemia, dizziness, paraesthesia (tingling), and tetany from low ionised Ca²⁺ (slide 130).',
        'Asphyxia — low O₂ and high CO₂ from occlusion of the airway — strongly stimulates breathing and raises the blood pressure, heart rate and catecholamines; eventually death follows (slide 131).',
      ],
      table: {
        columns: ['', 'Hypercapnia', 'Hypocapnia'],
        rows: [
          ['Cause', 'Pump failure (CO₂ retention)', 'Hyperventilation'],
          ['Acid–base', 'Respiratory acidosis', 'Respiratory alkalosis'],
          ['Effects', 'Confusion → coma → respiratory depression', 'Cerebral vasoconstriction, dizziness, tingling, tetany'],
        ],
      },
      sourceRefs: rs([129, 130, 131]),
    },
    {
      title: 'Diving and Drowning',
      kind: 'clinical',
      paragraphs: [
        'For every 10 m of depth, one atmosphere is added to the pressure on the chest wall, so divers breathe compressed air at increased pressure. But the raised PN₂ causes nitrogen narcosis: euphoria, symptoms like drunkenness, impaired intellect and loss of manual dexterity (slides 132–133).',
        'Breathing compressed air, N₂ goes into solution. On slow ascent it diffuses out into the lungs; on rapid ascent it forms bubbles in the tissues and blood vessels, causing joint pain, itching, paraesthesia, paralysis, respiratory failure and myocardial damage — decompression sickness (the bends, Caisson’s disease), a risk with SCUBA (slide 134).',
        'In drowning there is first a spasm of the laryngeal muscles, then relaxation of the glottis and flooding of the lungs. Fresh water is hypotonic and is absorbed, lysing red cells in the vessels. Sea water is hypertonic and draws fluid from the plasma into the lungs, reducing plasma volume and causing shock (slide 135).',
      ],
      table: {
        columns: ['Water', 'Tonicity', 'Effect'],
        rows: [
          ['Fresh', 'Hypotonic', 'Absorbed → red cells lyse'],
          ['Sea', 'Hypertonic', 'Fluid drawn into lungs → ↓ plasma volume → shock'],
        ],
      },
      sourceRefs: rs([132, 133, 134, 135]),
    },
    {
      title: 'Life-saving Procedures and pH',
      kind: 'clinical',
      paragraphs: [
        'Mouth-to-mouth resuscitation: extend the neck to lift the tongue from the airway, pinch the nose, inhale deeply, place your mouth over the victim’s and exhale into it (slide 136).',
        'The Heimlich manoeuvre is used in choking: it induces a cough-like expulsion, helping the diaphragm expel air and the obstruction (slide 137).',
        'Blood is part of the buffer system. The Henderson–Hasselbalch equation, pH = 6.1 + log [HCO₃⁻]/[acid], shows that pH depends on HCO₃⁻, regulated by the kidneys, and CO₂, regulated by the respiratory system. Other buffers include haemoglobin and protein groups (slide 138).',
      ],
      keyPoints: ['HCO₃⁻: kidneys. CO₂: lungs.'],
      sourceRefs: rs([136, 137, 138]),
    },
  ],
  summary: [
    'Hypoxia: hypoxic, anaemic, stagnant and histotoxic.',
    'Brain effects of hypoxia appear first.',
    'Cyanosis needs about 5 g/dl of reduced Hb; absent in anaemia, histotoxic hypoxia and CO poisoning.',
    'Altitude: hyperventilation, ↑ 2,3-DPG, H⁺ into CSF, ↑ erythropoietin.',
    'Do not give 100% O₂ in hypoxia with hypercapnia; prolonged 100% O₂ is toxic.',
    'Rapid ascent from depth causes decompression sickness; fresh and sea water drown differently.',
    'pH = 6.1 + log [HCO₃⁻]/[acid]: kidneys set HCO₃⁻, lungs set CO₂.',
  ],
  highYield: ['Every 10 m of water adds one atmosphere.', 'Hypocapnia → tetany from low ionised Ca²⁺.'],
  confusions: [
    {
      confusion: 'Expecting cyanosis in every kind of hypoxia.',
      clarification: 'Anaemic hypoxia, histotoxic hypoxia and CO poisoning cause no cyanosis (slide 118).',
    },
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9].map((lesson) => ({
  ...lesson,
  interactive: withSimulation(lesson.id, interactive[lesson.id]),
}));

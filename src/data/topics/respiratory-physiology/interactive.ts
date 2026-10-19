// Physiology → Respiratory Physiology: each lesson's interactive layer
// (Learn by answering). Checkpoints are asked before the explanation.
import { ask, learn, match, mcq, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { rs, TOPIC_ID, type ConceptId } from '@/data/topics/respiratory-physiology/sources';

type Steps = InteractiveDraft<ConceptId>[];
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const interactive: Record<string, Steps> = {
  [L(1)]: [
    ask(mcq('i1-01', 'respiration-overview', 'Using O₂ inside cells to make energy, with CO₂ as a by-product, is called:', 'Internal respiration', ['External respiration', 'Ventilation', 'Diffusion'], { explanation: 'Slide 2.', skill: 'prediction' })),
    learn('Three parts', ['The lungs exchange gas, the chest wall and respiratory muscles are the pump, and the respiratory control centre runs it.'], { sourceRefs: rs([3]) }),
    ask(order('i1-02', 'airway-structure', 'Put the airway in order from the nose:', ['Nasal passages', 'Trachea', 'Bronchi', 'Bronchioles', 'Respiratory bronchioles', 'Alveolar ducts', 'Alveoli'], { explanation: 'Slide 4.' })),
    learn('No cartilage in the bronchioles', ['Bronchioles have only smooth muscle, so their calibre is set by receptors: muscarinic (acetylcholine) receptors constrict them and β2 receptors dilate them.'], { sourceRefs: rs([5]) }),
    ask(mcq('i1-03', 'airway-receptors', 'A patient is given salbutamol. Which receptor does it act on to open the airways?', 'β2', ['Muscarinic', 'Nicotinic', 'α1'], { explanation: 'Slide 5.', skill: 'application' })),
    learn('Pressure moves the air', ['As the chest expands, lung pressure falls below atmospheric and air flows in. In expiration lung volume falls, pressure rises above atmospheric and air flows out.'], { sourceRefs: rs([10, 14, 15]) }),
    ask(mcq('i1-04', 'intrapleural-pressure', 'What happens to intrapleural pressure in inspiration?', 'It becomes more negative (about −2.5 to −6 mmHg)', ['It becomes positive (about +2.5 to +6 mmHg)', 'It stays at zero throughout the breath', 'It equals atmospheric pressure at the end of inspiration'], { explanation: 'Slide 14.', skill: 'prediction' })),
    ask(match('i1-05', 'respiratory-muscles', 'Match each muscle to its role:', [['Diaphragm', 'Moves down in inspiration'], ['External intercostals', 'Raise the ribs and sternum'], ['Internal intercostals', 'Pull the rib cage down in forced expiration'], ['Scalenes', 'Accessory muscle']], { explanation: 'Slides 3, 14–15.' })),
    recall('r1-01', 'intrapleural-pressure', 'Explain why the lung does not collapse inside the chest.', [
      'The lung tends to recoil because of its elastic tissue and alveolar surface tension.',
      'Intrapleural pressure is slightly below atmospheric (negative).',
      'This negative pressure holds the lung against the chest wall so it expands to fill the chest.',
    ], rs([11, 12])),
  ],

  [L(2)]: [
    ask(mcq('i2-01', 'lung-volumes', 'The air left in the lungs after a maximal expiration is the:', 'Residual volume', ['Expiratory reserve volume', 'Tidal volume', 'Vital capacity'], { explanation: 'Slide 19.', skill: 'prediction' })),
    learn('Volumes add up to capacities', ['VC = IRV + TV + ERV. IC = TV + IRV. FRC = ERV + RV. Minute volume = rate × TV.'], { sourceRefs: rs([20]) }),
    ask(match('i2-02', 'lung-capacities', 'Match each capacity to its volumes:', [['Vital capacity', 'IRV + TV + ERV'], ['Inspiratory capacity', 'TV + IRV'], ['Functional residual capacity', 'ERV + RV']], { explanation: 'Slide 20.' })),
    ask(mcq('i2-03', 'spirometry-fev1', 'Which can a simple spirometer NOT measure?', 'Residual volume', ['Tidal volume', 'Vital capacity', 'Inspiratory reserve volume'], { explanation: 'Slide 21: it cannot be breathed out.', skill: 'cause-effect' })),
    learn('FEV1', ['Timing the vital capacity over one second gives FEV1, normally about 83% of the vital capacity — an index of lung function.'], { sourceRefs: rs([20]) }),
    ask(mcq('i2-04', 'vital-capacity-factors', 'Why is the vital capacity smaller lying down than standing?', 'The abdominal contents push the diaphragm up', ['The lungs receive less blood when lying flat', 'The chest wall becomes stiffer when horizontal', 'Surfactant production falls in the lying position'], { explanation: 'Slide 25.', skill: 'cause-effect' })),
    recall('r2-01', 'vital-capacity-factors', 'List conditions that decrease the vital capacity.', [
      'Paralysis of the chest.',
      'Tuberculosis, asthma, lung cancer, chronic bronchitis, fibrosis.',
      'Pulmonary congestion, e.g. cardiac failure.',
      'Lying down (abdominal contents push up).',
    ], rs([23, 25])),
  ],

  [L(3)]: [
    ask(mcq('i3-01', 'lung-compliance', 'Lung compliance is the:', 'Change in lung volume per unit change in pressure', ['Change in pressure per unit change in lung volume', 'Resistance of the airways to the flow of air', 'Force of surface tension in the alveolar fluid'], { explanation: 'Slide 27.', skill: 'prediction' })),
    learn('Stiff or floppy lungs', ['Fibrosis, oedema, bronchial obstruction and chest-wall deformities lower compliance. Emphysema, with lost elastic tissue, raises it.'], { sourceRefs: rs([28, 29]) }),
    ask(mcq('i3-02', 'compliance-factors', 'Which condition INCREASES lung compliance?', 'Emphysema', ['Pulmonary fibrosis', 'Kyphoscoliosis', 'Pulmonary oedema'], { explanation: 'Slide 29.' })),
    learn('Surfactant', ['Type II alveolar cells secrete surfactant (mainly dipalmitoyl phosphatidylcholine). It lowers surface tension, keeping alveoli open and helping prevent pulmonary oedema.'], { sourceRefs: rs([30, 31]) }),
    ask(mcq('i3-03', 'surfactant-deficiency', 'A baby born very prematurely becomes breathless with collapsing lungs. The most likely cause is:', 'Lack of surfactant', ['Too much surfactant', 'Excess compliance', 'Bronchial cartilage defects'], { explanation: 'Slide 32: respiratory distress syndrome.', skill: 'application' })),
    ask(mcq('i3-04', 'work-of-breathing', 'Why does quiet expiration need no work?', 'It is passive recoil of the lungs', ['The diaphragm contracts strongly upwards', 'Surfactant actively pushes air out', 'Airway resistance falls to zero'], { explanation: 'Slide 35.', skill: 'cause-effect' })),
    recall('r3-01', 'surfactant', 'Give the two main effects of surfactant.', [
      'It lowers alveolar surface tension, so alveoli do not collapse.',
      'It reduces the pull of fluid into the alveoli, helping prevent pulmonary oedema.',
    ], rs([30, 31])),
  ],

  [L(4)]: [
    ask(mcq('i4-01', 'ventilation-gravity', 'In the upright lung, which part has more ventilation per unit volume?', 'The lower parts (bases)', ['The apices (upper parts)', 'All parts equally', 'The hilum and nothing else'], { explanation: 'Slide 36.', skill: 'prediction' })),
    learn('Dead space', ['Anatomical dead space stays in the conducting airways; alveolar dead space reaches unperfused alveoli. Together they make physiological dead space.'], { sourceRefs: rs([38]) }),
    ask(mcq('i4-02', 'alveolar-ventilation', 'With a tidal volume of 500 ml and dead space of 150 ml, how much air reaches the alveoli each breath?', '350 ml', ['500 ml', '150 ml', '650 ml'], { explanation: 'Slide 39.', skill: 'application' })),
    ask(mcq('i4-03', 'alveolar-ventilation', 'Rapid shallow breathing, compared with slow deep breathing of the same minute volume, gives:', 'Less alveolar ventilation', ['More alveolar ventilation', 'The same alveolar ventilation', 'No dead space'], { explanation: 'Slide 39.', skill: 'cause-effect' })),
    learn('A low-pressure circuit', ['The pulmonary circulation takes the whole cardiac output (≈ 5.5 L/min) at only about 24/9 mmHg. Low hydrostatic and high oncotic pressure keep the lungs dry.'], { sourceRefs: rs([40]) }),
    ask(mcq('i4-04', 'hypoxic-vasoconstriction', 'What happens to the blood vessels supplying an area of lung beyond a blocked bronchus?', 'They constrict, diverting blood elsewhere', ['They dilate, bringing more blood to the area', 'They are unaffected by the low alveolar O₂', 'They leak and cause oedema in the blocked area'], { explanation: 'Slide 42.', skill: 'prediction' })),
    recall('r4-01', 'pulmonary-circulation', 'Describe the main features of the pulmonary circulation.', [
      'Carries about 5.5 L/min, the same as the cardiac output.',
      'Distensible, low pressure (about 24/9 mmHg).',
      'High oncotic, low hydrostatic pressure in the capillaries → little oedema.',
      'Acts as a reservoir: about 400 ml moves in when lying down.',
    ], rs([40, 41])),
  ],

  [L(5)]: [
    ask(mcq('i5-01', 'oxygen-delivery', 'How much of the oxygen in blood is dissolved in plasma?', 'About 1%', ['About 50%', 'About 25%', 'About 99%'], { explanation: 'Slide 45.', skill: 'prediction' })),
    learn('Oxygenation, not oxidation', ['Each of haemoglobin’s four haems holds Fe²⁺, which binds O₂ without becoming Fe³⁺.'], { sourceRefs: rs([46]) }),
    ask(mcq('i5-02', 'dissociation-curve', 'Why is the dissociation curve S-shaped?', 'Each O₂ that binds makes the next bind more easily', ['Haemoglobin binds only one O₂ at a time', 'Oxygen is very soluble in the plasma', 'Affinity falls as each O₂ binds to haem'], { explanation: 'Slides 48, 50.', skill: 'cause-effect' })),
    learn('The flat top', ['Above about 60 mmHg the curve is flat, so saturation barely changes even with big changes in PO₂.'], { sourceRefs: rs([51]) }),
    ask(mcq('i5-03', 'p50-affinity', 'An increased P50 means:', 'The curve has shifted right and affinity has fallen', ['The curve has shifted left and affinity has risen', 'Affinity has risen, so less O₂ is released', 'Haemoglobin is fully saturated at that PO₂'], { explanation: 'Slide 53.' })),
    ask(mcq('i5-04', 'p50-affinity', 'During exercise the curve shifts right. The benefit is:', 'More O₂ released to the working tissues', ['More O₂ loaded onto haemoglobin in the lungs', 'Less CO₂ produced by the working muscles', 'Higher haemoglobin concentration in the blood'], { explanation: 'Slide 55.', skill: 'application' })),
    recall('r5-01', 'oxygen-delivery', 'List the factors that determine oxygen delivery to the tissues.', [
      'O₂ entering the lungs (ventilation).',
      'Adequate gas exchange (ventilation–perfusion).',
      'The capacity of blood to carry O₂ (haemoglobin).',
      'Blood flow to the tissues (cardiac output).',
    ], rs([44])),
  ],

  [L(6)]: [
    ask(mcq('i6-01', 'curve-shift-factors', 'A muscle is working hard: hot, acidic and full of CO₂. Which way does its dissociation curve shift?', 'To the right', ['To the left', 'It does not shift', 'Up but not sideways'], { explanation: 'Slides 56, 58.', skill: 'prediction' })),
    learn('2,3-DPG', ['Made in glycolysis, 2,3-DPG binds the β chains and releases O₂. It rises at altitude, in anaemia, chronic hypoxia, exercise and with thyroid hormone, growth hormone and androgens.'], { sourceRefs: rs([58, 63]) }),
    ask(match('i6-02', 'bohr-haldane', 'Match each effect to what it describes:', [['Bohr effect', 'CO₂ and H⁺ lower haemoglobin’s O₂ affinity'], ['Haldane effect', 'O₂ binding releases CO₂ from haemoglobin']], { explanation: 'Slides 59–60.' })),
    ask(mcq('i6-03', 'fetal-hb-myoglobin', 'Why can fetal blood take O₂ from the mother’s blood?', 'Fetal haemoglobin binds 2,3-DPG less, so it has a higher O₂ affinity', ['Fetal blood has a lower haemoglobin concentration than maternal blood', 'Fetal haemoglobin binds 2,3-DPG more, so it has a lower O₂ affinity', 'The placenta pumps O₂ actively from mother to fetus against its gradient'], { explanation: 'Slide 64.', skill: 'cause-effect' })),
    learn('Carbon monoxide', ['CO binds haemoglobin about 210 times more strongly than O₂, displaces it and shifts the remaining curve left. The blood is cherry red, so there is no cyanosis.'], { sourceRefs: rs([66, 126]) }),
    ask(mcq('i6-04', 'co2-transport', 'As bicarbonate leaves the red cell in the tissues, which ion moves in?', 'Chloride', ['Sodium', 'Potassium', 'Hydrogen'], { explanation: 'Slide 69: the chloride shift.' })),
    recall('r6-01', 'co2-transport', 'Describe the ways CO₂ is carried in blood.', [
      'Dissolved (CO₂ is about 20 times as soluble as O₂).',
      'As bicarbonate, formed by carbonic anhydrase in red cells, with the chloride shift.',
      'As carbamino compounds with haemoglobin and plasma proteins.',
    ], rs([67, 68, 69])),
  ],

  [L(7)]: [
    ask(mcq('i7-01', 'gas-exchange', 'What is the normal PO₂ of mixed venous blood?', '40 mmHg', ['95–100 mmHg', '46 mmHg', '149 mmHg'], { explanation: 'Slide 73.', skill: 'prediction' })),
    learn('Alveolar CO₂', ['Alveolar PCO₂ rises with the CO₂ being excreted and falls as ventilation increases.'], { sourceRefs: rs([76]) }),
    ask(mcq('i7-02', 'respiratory-membrane', 'Pulmonary fibrosis reduces gas diffusion mainly because it:', 'Thickens the respiratory membrane', ['Increases the surface area', 'Raises the PO₂ gradient', 'Increases the diffusion coefficient'], { explanation: 'Slide 79.', skill: 'cause-effect' })),
    ask(mcq('i7-03', 'diffusing-capacity', 'When the respiratory membrane is damaged, which fails first?', 'O₂ uptake', ['CO₂ removal', 'Both equally', 'Neither'], { explanation: 'Slide 81: CO₂ diffuses far more readily.', skill: 'prediction' })),
    learn('V/Q extremes', ['V/Q = 0: blood but no air — the alveoli match venous blood (PO₂ 40, PCO₂ 46). V/Q = ∞: air but no blood — the alveoli match inspired air (PO₂ 149, PCO₂ 0).'], { sourceRefs: rs([84, 85]) }),
    ask(match('i7-04', 'ventilation-perfusion', 'Match each V/Q to its meaning:', [['V/Q = 0', 'Perfusion without ventilation'], ['V/Q = ∞', 'Ventilation without perfusion'], ['V/Q < 1', 'Physiological shunt'], ['V/Q > 1', 'Wasted ventilation']], { explanation: 'Slides 84–86.' })),
    ask(mcq('i7-05', 'regional-vq', 'Why is the lung apex a favoured site for tuberculosis?', 'Its high V/Q gives it a high PO₂', ['It has the most blood flow in the lung', 'Its low V/Q gives it the lowest PO₂', 'It has no dead space at all'], { explanation: 'Slide 87.', skill: 'application' })),
    recall('r7-01', 'respiratory-membrane', 'List the factors that affect the rate of gas diffusion across the respiratory membrane.', [
      'Membrane thickness (oedema, fibrosis slow it).',
      'Surface area (lung removal, emphysema reduce it).',
      'The gas’s diffusion coefficient (solubility and size).',
      'The partial pressure difference across the membrane.',
    ], rs([79, 80])),
  ],

  [L(8)]: [
    ask(mcq('i8-01', 'pontine-centres', 'An animal’s brainstem is cut below the medulla. What happens to breathing?', 'It stops', ['It becomes gasping', 'It continues normally', 'It is held in inspiration'], { explanation: 'Slide 95.', skill: 'prediction' })),
    learn('Apneusis', ['Cutting in the lower pons with the vagi cut removes the brakes on the inspiratory neurons: breathing is arrested in inspiration (apneusis). The pneumotaxic area of the upper pons normally prevents it.'], { sourceRefs: rs([95, 96]) }),
    ask(mcq('i8-02', 'hering-breuer', 'The Hering–Breuer reflex is carried to the medulla by the:', 'Vagus nerve', ['Phrenic nerve', 'Glossopharyngeal nerve', 'Intercostal nerves'], { explanation: 'Slide 97.' })),
    learn('Two sets of chemoreceptors', ['Peripheral: carotid bodies (glossopharyngeal) and aortic bodies (vagus), sensing low PO₂ and H⁺. Central: medullary cells sensing H⁺ in the CSF, which follows arterial CO₂.'], { sourceRefs: rs([100, 101]) }),
    ask(mcq('i8-03', 'chemoreceptors', 'Why are the carotid bodies not stimulated in carbon monoxide poisoning?', 'They sense dissolved O₂ (PO₂), which stays normal', ['CO blocks the glossopharyngeal nerve from the carotid bodies', 'Their blood flow stops when CO binds to haemoglobin', 'CO raises the blood pH, which silences the receptors'], { explanation: 'Slide 100.', skill: 'cause-effect' })),
    ask(order('i8-04', 'protective-reflexes', 'Put the steps of a cough in order:', ['Touch receptors fire via the vagus', 'Deep inspiration', 'Epiglottis and vocal cords close', 'Abdominal muscles and internal intercostals contract', 'Epiglottis and cords open suddenly'], { explanation: 'Slides 107–108.' })),
    recall('r8-01', 'chemical-responses', 'Explain why reducing inspired O₂ raises ventilation only a little at first.', [
      'Low arterial PO₂ stimulates the peripheral chemoreceptors.',
      'The extra breathing washes out CO₂.',
      'Low CO₂ inhibits respiration, opposing the hypoxic drive.',
      'Only a very low PO₂ overcomes this.',
    ], rs([105])),
  ],

  [L(9)]: [
    ask(match('i9-01', 'hypoxia-types', 'Match each cause to its type of hypoxia:', [['High altitude', 'Hypoxic'], ['Anaemia', 'Anaemic'], ['Shock', 'Stagnant'], ['Cyanide poisoning', 'Histotoxic']], { explanation: 'Slides 113, 126.', skill: 'prediction' })),
    learn('Cyanosis', ['Cyanosis appears when about 5 g/dl of haemoglobin is deoxygenated. It is absent in anaemic and histotoxic hypoxia and in CO poisoning.'], { sourceRefs: rs([116, 118]) }),
    ask(mcq('i9-02', 'cyanosis', 'Why is a severely anaemic patient often not cyanosed despite hypoxia?', 'There is too little haemoglobin to reach 5 g/dl of reduced Hb', ['Their blood is fully saturated, so there is no reduced Hb', 'Anaemia shifts the curve left, so Hb holds its O₂', 'Their skin capillaries are dilated and look pink'], { explanation: 'Slides 116, 118.', skill: 'cause-effect' })),
    learn('Altitude', ['Low PO₂ → hyperventilation → alkalosis → ↑ 2,3-DPG (right shift). H⁺ moved into the CSF restores the drive in 3–4 days, and erythropoietin raises haemoglobin.'], { sourceRefs: rs([120, 122, 123]) }),
    ask(mcq('i9-03', 'oxygen-therapy', 'A patient has severe hypoxia with a high CO₂. Why should you avoid 100% O₂?', 'It removes the hypoxic drive and depresses the respiratory centre', ['It causes cyanosis by oxidising the haemoglobin', 'It raises the blood pH too much, causing tetany', 'It increases surfactant and makes the lungs too stiff'], { explanation: 'Slide 127.', skill: 'application' })),
    ask(mcq('i9-04', 'pressure-and-drowning', 'A diver rises to the surface too fast. Joint pain and itching follow because:', 'Dissolved N₂ forms bubbles in the tissues', ['O₂ toxicity damages the joints and the skin', 'CO₂ is washed out of the tissues too quickly', 'Water enters the lungs and the bloodstream'], { explanation: 'Slide 134.', skill: 'application' })),
    recall('r9-01', 'co2-disorders', 'Compare the effects of hypercapnia and hypocapnia.', [
      'Hypercapnia: first stimulates breathing, then confusion, coma and respiratory depression; respiratory acidosis.',
      'Hypocapnia: from hyperventilation; respiratory alkalosis.',
      'Hypocapnia: cerebral vasoconstriction, dizziness, tingling and tetany from low Ca²⁺.',
    ], rs([129, 130])),
  ],
};

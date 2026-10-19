// Physiology → Respiratory Physiology — one simulation per lesson (models in
// data/simulations/). Each starts with predictions answered BEFORE the
// model runs the change. Prediction IDs: sN-xx.
import type { InteractiveDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { rs, TOPIC_ID, type ConceptId } from '@/data/topics/respiratory-physiology/sources';
import { direction, insertSimulation, predict } from '@/data/topics/sim-helpers';

type Step = InteractiveDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const simulations: Record<string, Step> = {
  [L(1)]: simulate({
    sim: 'breathing-mechanics',
    title: 'Pressures that move air',
    intro: 'Breathe in harder or more gently, narrow the airways, or let air into the pleural space — and watch the pressures and the air that flows.',
    sourceRefs: rs([5, 10, 12, 14, 15, 125]),
    predictions: [
      {
        question: direction('s1-01', 'intrapleural-pressure', 'You take a deep breath instead of a quiet one. What happens to the intrapleural pressure?', 'down', 'A bigger chest expansion makes intrapleural pressure more negative (it falls further below atmospheric), so the lung expands more (slides 12, 14).'),
        set: { effort: 200 },
        watch: 'intrapleural',
        expect: [
          { readout: 'intrapleural', change: 'down' },
          { readout: 'tidal', change: 'up' },
        ],
      },
      {
        question: mcq('s1-02', 'intrapleural-pressure', 'A stab wound lets air into the pleural space (pneumothorax). What happens to the lung?', 'It collapses: intrapleural pressure becomes atmospheric', ['It over-expands as air rushes into the chest', 'Nothing — the airways still bring air into it'], {
          ...predict,
          explanation: 'The negative intrapleural pressure is what holds the lung against the chest wall; without it the lung recoils and collapses (slides 11, 125).',
        }),
        set: { pleura: 1 },
        watch: 'tidal',
        expect: [
          { readout: 'tidal', equals: 0 },
          { readout: 'intrapleural', equals: 0 },
        ],
      },
      {
        question: direction('s1-03', 'airway-receptors', 'Muscarinic stimulation constricts the bronchioles. With the same quiet effort, how much air is breathed in?', 'down', 'Narrow airways resist flow, so the same pressure gradient moves less air. Atropine blocks the muscarinic effect; salbutamol (β2) dilates (slide 5).'),
        set: { airway: 1 },
        watch: 'tidal',
        expect: [{ readout: 'tidal', change: 'down' }],
      },
    ],
  }),

  [L(2)]: simulate({
    sim: 'spirometry',
    title: 'On the spirometer',
    intro: 'See how the four volumes build the capacities, and how body position and disease change the vital capacity.',
    sourceRefs: rs([19, 20, 21, 23, 25]),
    predictions: [
      {
        question: direction('s2-01', 'vital-capacity-factors', 'A healthy person lies down. What happens to the vital capacity?', 'down', 'Lying down, the abdominal contents push the diaphragm up, so less air can be breathed out: VC is smaller lying than standing (slide 25).'),
        set: { posture: 1 },
        watch: 'vc',
        expect: [
          { readout: 'vc', change: 'down' },
          { readout: 'erv', change: 'down' },
        ],
      },
      {
        question: direction('s2-02', 'vital-capacity-factors', 'The lungs become fibrosed. What happens to the vital capacity?', 'down', 'Fibrosis reduces the ability of the lungs to expand, so the vital capacity falls (slide 23).'),
        set: { person: 2 },
        watch: 'vc',
        expect: [{ readout: 'vc', change: 'down' }],
      },
      {
        question: mcq('s2-03', 'lung-capacities', 'The person breathes with a tidal volume of 1000 ml instead of 500 ml. What happens to the vital capacity?', 'It stays the same — the extra tidal air comes out of the inspiratory reserve', ['It rises by 500 ml, because each breath is bigger', 'It falls by 500 ml, as the reserves are used up'], {
          ...predict,
          explanation: 'VC = IRV + TV + ERV. A bigger ordinary breath uses part of the inspiratory reserve; the maximum that can be breathed out is unchanged (slide 20).',
        }),
        set: { tidal: 1000 },
        watch: 'vc',
        expect: [
          { readout: 'vc', change: 'same' },
          { readout: 'irv', change: 'down' },
        ],
      },
    ],
  }),

  [L(3)]: simulate({
    sim: 'lung-compliance',
    title: 'How stretchable is the lung?',
    intro: 'Change the surfactant and the lung tissue and see how much air the same pressure swing moves.',
    sourceRefs: rs([27, 28, 29, 30, 31, 32]),
    predictions: [
      {
        question: direction('s3-01', 'surfactant-deficiency', 'A premature baby has only 10% of normal surfactant. What happens to lung compliance?', 'down', 'Without surfactant the surface tension is high, the alveoli tend to collapse and the lung is hard to expand — respiratory distress syndrome (slides 30, 32).'),
        set: { surfactant: 10 },
        watch: 'compliance',
        expect: [
          { readout: 'compliance', change: 'down' },
          { readout: 'collapse', change: 'up' },
        ],
      },
      {
        question: direction('s3-02', 'compliance-factors', 'The lung tissue becomes fibrosed. What happens to the size of a quiet breath?', 'down', 'Fibrosis lowers compliance, so the same pressure change moves less air (slides 28–29).'),
        set: { condition: 1 },
        watch: 'tidal',
        expect: [
          { readout: 'tidal', change: 'down' },
          { readout: 'compliance', change: 'down' },
        ],
      },
      {
        question: direction('s3-03', 'compliance-factors', 'Now emphysema instead. What happens to compliance?', 'up', 'Emphysema destroys elastic tissue, so the lung stretches more easily: compliance increases (slide 29).'),
        set: { condition: 3 },
        watch: 'compliance',
        expect: [{ readout: 'compliance', change: 'up' }],
      },
    ],
  }),

  [L(4)]: simulate({
    sim: 'alveolar-ventilation',
    title: 'How much air reaches the alveoli?',
    intro: 'Change the rate and depth of breathing, or add a snorkel, and see how much fresh air actually reaches the alveoli.',
    sourceRefs: rs([20, 37, 38, 39]),
    predictions: [
      {
        question: direction('s4-01', 'alveolar-ventilation', 'Breathing changes to 24 breaths of 250 ml — the same 6 L/min minute volume. What happens to alveolar ventilation?', 'down', 'The 150 ml dead space is taken from every breath, so many shallow breaths waste more: alveolar ventilation falls though the minute volume is unchanged (slide 39).'),
        set: { rate: 24, tidal: 250 },
        watch: 'alveolar',
        expect: [
          { readout: 'alveolar', change: 'down' },
          { readout: 'minute', change: 'same' },
        ],
      },
      {
        question: direction('s4-02', 'alveolar-ventilation', 'Now 6 slow breaths of 1000 ml — again 6 L/min. Alveolar ventilation compared with quiet breathing?', 'up', 'Deep breathing increases alveolar ventilation: each breath loses the same dead space but delivers more fresh air (slide 39).'),
        set: { rate: 6, tidal: 1000 },
        watch: 'alveolar',
        expect: [{ readout: 'alveolar', change: 'up' }],
      },
      {
        question: direction('s4-03', 'dead-space', 'A 300 ml snorkel is added, breathing unchanged. What happens to alveolar ventilation?', 'down', 'The tube adds to the anatomical dead space: more of each breath never reaches the alveoli (slides 37–38).'),
        set: { extra: 300 },
        watch: 'alveolar',
        expect: [{ readout: 'alveolar', change: 'down' }],
      },
    ],
  }),

  [L(5)]: simulate({
    sim: 'o2-dissociation',
    title: 'The dissociation curve',
    intro: 'Move the PO₂ along the curve and see where haemoglobin holds on to O₂ and where it lets go.',
    sourceRefs: rs([45, 47, 50, 51, 52, 53, 54, 55]),
    predictions: [
      {
        question: mcq('s5-01', 'dissociation-curve', 'Arterial PO₂ falls from 100 to 60 mmHg. What happens to haemoglobin saturation?', 'It falls only a little (about 97% → 90%)', ['It halves, in step with the PO₂', 'It falls to zero below 70 mmHg'], {
          ...predict,
          explanation: 'Above about 60 mmHg the curve is flat: O₂ content changes little even with large changes in PO₂ (slide 51).',
        }),
        set: { po2: 60 },
        watch: 'sat',
        expect: [{ readout: 'sat', change: 'down' }],
      },
      {
        question: mcq('s5-02', 'dissociation-curve', 'In the tissues the PO₂ falls further, from 40 to 20 mmHg. Now what happens to saturation?', 'It falls steeply — O₂ is unloaded readily', ['It barely changes on the flat part', 'It rises as the tissues need more'], {
          ...predict,
          explanation: 'Below about 60 mmHg the curve is steep: small falls in PO₂ release a lot of O₂ (slide 52).',
        }),
        from: { po2: 40 },
        set: { po2: 20 },
        watch: 'sat',
        expect: [{ readout: 'sat', change: 'down' }],
      },
      {
        question: direction('s5-03', 'p50-affinity', 'The blood becomes more acid (pH 7.40 → 7.20). What happens to the P50?', 'up', 'Acidity lowers haemoglobin’s affinity: the curve shifts right and P50 rises, so more O₂ is released (slides 53–56).'),
        set: { ph: 7.2 },
        watch: 'p50',
        expect: [
          { readout: 'p50', change: 'up' },
          { readout: 'unload', change: 'up' },
        ],
      },
    ],
  }),

  [L(6)]: simulate({
    sim: 'o2-dissociation',
    title: 'Shifting the curve',
    intro: 'Heat, acid, CO₂, 2,3-DPG, fetal haemoglobin, myoglobin and carbon monoxide: which way does each move the curve?',
    sourceRefs: rs([56, 58, 63, 64, 65, 66]),
    predictions: [
      {
        question: direction('s6-01', 'curve-shift-factors', 'Body temperature rises to 40 °C. What happens to the O₂ released to the tissues?', 'up', 'A rise in temperature shifts the curve right (lower affinity), so more O₂ is released between the lungs and the tissues (slides 56, 58).'),
        set: { temp: 40 },
        watch: 'unload',
        expect: [
          { readout: 'unload', change: 'up' },
          { readout: 'p50', change: 'up' },
        ],
      },
      {
        question: direction('s6-02', 'fetal-hb-myoglobin', 'Switch from adult to fetal haemoglobin. What happens to the P50?', 'down', 'Fetal haemoglobin binds 2,3-DPG poorly, so it has a higher affinity: the curve is to the left and P50 is lower (slide 64).'),
        set: { carrier: 1 },
        watch: 'p50',
        expect: [{ readout: 'p50', change: 'down' }],
      },
      {
        question: mcq('s6-03', 'carbon-monoxide', 'The blood now contains 40% carboxyhaemoglobin. What happens to the O₂ released to the tissues?', 'It falls: less Hb carries O₂ and the rest holds on tighter', ['It rises, because the curve shifts right', 'It is unchanged, because the PO₂ stays normal'], {
          ...predict,
          explanation: 'CO binds haemoglobin about 210 times more avidly than O₂ and shifts the curve of the remaining haemoglobin to the left, so less O₂ is carried and less released (slide 66).',
        }),
        set: { co: 40 },
        watch: 'unload',
        expect: [
          { readout: 'unload', change: 'down' },
          { readout: 'content', change: 'down' },
          { readout: 'p50', change: 'down' },
        ],
      },
    ],
  }),

  [L(7)]: simulate({
    sim: 'vq-matching',
    title: 'Matching air and blood',
    intro: 'Slide one alveolus from no ventilation to almost no blood flow, then thicken its membrane, and follow the gases.',
    sourceRefs: rs([73, 79, 81, 84, 85, 86, 87]),
    predictions: [
      {
        question: mcq('s7-01', 'ventilation-perfusion', 'Mucus blocks the airway to this alveolus completely (V/Q = 0). What are the gases in the blood leaving it?', 'The same as venous blood: PO₂ 40, PCO₂ 46', ['The same as inspired air: PO₂ 149, PCO₂ 0', 'Normal arterial: PO₂ 100, PCO₂ 40'], {
          ...predict,
          explanation: 'With perfusion but no ventilation there is no gas exchange; the alveolar air equilibrates with venous blood — a shunt (slide 84).',
        }),
        set: { vq: 0 },
        watch: 'artO2',
        expect: [
          { readout: 'artO2', equals: 40, tolerance: 0.01 },
          { readout: 'artCO2', equals: 46, tolerance: 0.01 },
        ],
      },
      {
        question: direction('s7-02', 'regional-vq', 'This alveolus is at the lung apex, where blood flow is much lower than ventilation (high V/Q). Its alveolar PO₂ compared with a matched alveolus?', 'up', 'At the apex perfusion falls much more than ventilation: high V/Q, high PO₂ — a reason TB favours the apex (slide 87).'),
        set: { vq: 3.3 },
        watch: 'alvO2',
        expect: [{ readout: 'alvO2', change: 'up' }],
      },
      {
        question: mcq('s7-03', 'diffusing-capacity', 'The respiratory membrane thickens with fibrosis. Which gas is affected first?', 'O₂ uptake falls, while CO₂ removal barely changes', ['CO₂ removal fails first, while O₂ uptake barely changes', 'Both gases fail equally'], {
          ...predict,
          explanation: 'Diffusion falls as the membrane thickens; when it is damaged, O₂ fails to get in before CO₂ fails to get out (slides 79, 81).',
        }),
        set: { membrane: 1 },
        watch: 'artO2',
        expect: [
          { readout: 'artO2', change: 'down' },
          { readout: 'artCO2', change: 'same', tolerance: 0.02 },
        ],
      },
    ],
  }),

  [L(8)]: simulate({
    sim: 'breathing-control',
    title: 'What drives breathing?',
    intro: 'Change the blood gases, the acid–base state and the haemoglobin, and watch which chemoreceptors respond.',
    sourceRefs: rs([99, 100, 101, 103, 104, 105, 127]),
    predictions: [
      {
        question: direction('s8-01', 'chemical-responses', 'Arterial PCO₂ rises from 40 to 50 mmHg. What happens to ventilation?', 'up', 'CO₂ crosses into the CSF and raises H⁺, stimulating the central chemoreceptors: breathing increases (slides 101, 104).'),
        set: { paco2: 50 },
        watch: 'ventilation',
        expect: [
          { readout: 'ventilation', change: 'up' },
          { readout: 'central', change: 'up' },
        ],
      },
      {
        question: direction('s8-02', 'chemoreceptors', 'The person becomes severely anaemic; PO₂ stays 100 mmHg. What happens to ventilation?', 'same', 'The peripheral chemoreceptors respond to dissolved O₂ (PO₂), not to O₂ content, so anaemia does not stimulate them (slide 100).'),
        set: { carriage: 1 },
        watch: 'ventilation',
        expect: [
          { readout: 'ventilation', change: 'same' },
          { readout: 'content', change: 'down' },
        ],
      },
      {
        question: direction('s8-03', 'chemical-responses', 'A metabolic acidosis develops (e.g. diabetic ketoacidosis). What happens to ventilation?', 'up', 'Acidosis stimulates breathing; CO₂ is washed out and pH rises in compensation (slide 103).'),
        set: { metabolic: 1 },
        watch: 'ventilation',
        expect: [{ readout: 'ventilation', change: 'up' }],
      },
    ],
  }),

  [L(9)]: simulate({
    sim: 'altitude-hypoxia',
    title: 'Altitude and the four hypoxias',
    intro: 'Climb a mountain, stay a while, breathe oxygen — or add anaemia, CO, shock or cyanide — and see what happens to O₂ delivery and cyanosis.',
    sourceRefs: rs([113, 116, 117, 118, 119, 120, 122, 123, 126]),
    predictions: [
      {
        question: direction('s9-01', 'altitude', 'A climber goes from sea level to 5000 m. What happens to the arterial PO₂?', 'down', 'Ascent lowers the barometric pressure and so the PO₂ of the air: hypoxic hypoxia (slide 119).'),
        set: { altitude: 5000 },
        watch: 'pao2',
        expect: [
          { readout: 'pao2', change: 'down' },
          { readout: 'cyanosis', equals: 1 },
        ],
      },
      {
        question: direction('s9-02', 'altitude', 'The climber stays at 5000 m for three weeks. Compared with arrival, the O₂ content of the blood…', 'up', 'Acclimatisation: more breathing, more 2,3-DPG and, from erythropoietin, more haemoglobin (slides 120, 122–123).'),
        from: { altitude: 5000 },
        set: { days: 21 },
        watch: 'content',
        expect: [{ readout: 'content', change: 'up' }],
      },
      {
        question: mcq('s9-03', 'cyanosis', 'Back at sea level, a patient has severe anaemia (Hb 7 g/dl). Will they be cyanosed?', 'No — too little haemoglobin to make 5 g/dl reduced', ['Yes — they are hypoxic, so they must be blue', 'Only on the tongue and lips'], {
          ...predict,
          explanation: 'Cyanosis needs about 5 g/dl of reduced haemoglobin; in anaemic hypoxia there is too little haemoglobin to reach that (slides 117–118).',
        }),
        set: { problem: 1 },
        watch: 'cyanosis',
        expect: [
          { readout: 'cyanosis', equals: 0 },
          { readout: 'content', change: 'down' },
        ],
      },
    ],
  }),
};

// A lesson's interactive steps with its simulation added before the final recall.
export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  return insertSimulation(steps, simulations[lessonId]);
}

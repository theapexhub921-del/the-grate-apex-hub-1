// Physiology → Endocrinology — one simulation per lesson (models in data/simulations/). Each
// starts with predictions answered BEFORE the model runs the change. Prediction IDs: sN-xx.
import type { InteractiveDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { ad, ca, intro, pa, th, TOPIC_ID, type ConceptId } from '@/data/topics/endocrinology/sources';
import { direction, insertSimulation, predict } from '@/data/topics/sim-helpers';

type Step = InteractiveDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const simulations: Record<string, Step> = {
  [L(1)]: simulate({
    sim: 'feedback-axis',
    title: 'Feedback along a hormone axis',
    intro: 'Break the gland or the pituitary, cut the feedback, or give the hormone as a drug, and watch the hypothalamus, pituitary and gland respond — then name the pattern.',
    sourceRefs: intro([20, 23, 24, 25, 26]),
    predictions: [
      {
        question: direction('s1-01', 'secretion-control', 'The thyroid gland itself starts to fail, so less T4 is made. What does the pituitary’s TSH do?', 'up', 'Less T4 means less negative feedback on the hypothalamus and pituitary, so TRH and TSH rise — the pituitary tries to drive the failing gland harder (Introduction, p. 23).'),
        set: { fault: 1 },
        watch: 'trophic',
        expect: [
          { readout: 'trophic', change: 'up' },
          { readout: 'hormone', change: 'down' },
        ],
      },
      {
        question: direction('s1-02', 'secretion-control', 'Someone with healthy adrenals takes cortisol tablets equal to their normal output. What happens to the cortisol their own adrenal cortex makes?', 'down', 'The tablets feed back like the body’s own cortisol: CRH and ACTH fall, so the adrenal cortex is stimulated less and makes less (Introduction, p. 23).'),
        from: { axis: 1 },
        set: { given: 100 },
        watch: 'own',
        expect: [
          { readout: 'own', change: 'down' },
          { readout: 'trophic', change: 'down' },
        ],
      },
      {
        question: mcq('s1-03', 'primary-secondary', 'A pituitary tumour secretes too much ACTH, so cortisol is high. How is this classified?', 'Secondary hypersecretion', ['Primary hypersecretion (adrenal)', 'Secondary hyposecretion'], {
          ...predict,
          explanation: 'The adrenal gland is normal but is driven by too much trophic hormone: excess secretion caused by its controller is secondary (Introduction, p. 26).',
        }),
        from: { axis: 1 },
        set: { fault: 4 },
        watch: 'pattern',
        expect: [
          { readout: 'pattern', equals: 4 },
          { readout: 'hormone', change: 'up' },
        ],
      },
    ],
  }),

  [L(2)]: simulate({
    sim: 'adh-water',
    title: 'ADH and water',
    intro: 'Drink or lose water, bleed, feel pain or drink alcohol, and watch the posterior pituitary’s ADH and the urine — then compare diabetes insipidus with SIADH.',
    sourceRefs: intro([11, 16, 17, 18]),
    predictions: [
      {
        question: direction('s2-01', 'adh', 'A person loses 20% of their blood volume. What happens to ADH secretion?', 'up', 'The fall in ECF volume is sensed by the atrial volume receptors (baroreceptors), and ADH secretion increases to hold on to water (Introduction, p. 16).'),
        set: { bleed: 20 },
        watch: 'adh',
        expect: [
          { readout: 'adh', change: 'up' },
          { readout: 'flow', change: 'down' },
        ],
      },
      {
        question: direction('s2-02', 'adh', 'The person drinks alcohol. What happens to the urine flow?', 'up', 'Alcohol inhibits ADH secretion, so less water is reabsorbed and more dilute urine is passed (Introduction, p. 16).'),
        set: { alcohol: 1 },
        watch: 'flow',
        expect: [
          { readout: 'flow', change: 'up' },
          { readout: 'adh', change: 'down' },
        ],
      },
      {
        question: direction('s2-03', 'adh-disorders', 'In SIADH, ADH is secreted inappropriately. What happens to the plasma sodium concentration?', 'down', 'Excess ADH retains water, which dilutes the sodium: hyponatraemia from too much water, not from a loss of Na⁺ (Introduction, p. 18).'),
        set: { condition: 3 },
        watch: 'na',
        expect: [
          { readout: 'na', change: 'down' },
          { readout: 'flow', change: 'down' },
        ],
      },
    ],
  }),

  [L(3)]: simulate({
    sim: 'growth-hormone',
    title: 'Growth hormone and the skeleton',
    intro: 'Change what the pituitary secretes, whether the receptors work and the person’s age, and watch the skeleton — gigantism, acromegaly and the two dwarfisms.',
    sourceRefs: intro([28, 32, 33, 34, 35, 36, 37]),
    predictions: [
      {
        question: direction('s3-01', 'gh-control', 'The child has been fasting and their blood sugar is low. What happens to GH secretion?', 'up', 'Low energy substrate — low blood sugar from fasting or exercise — stimulates GH, which releases fat for energy and spares glucose (Introduction, p. 32).'),
        set: { trigger: 1 },
        watch: 'gh',
        expect: [{ readout: 'gh', change: 'up' }],
      },
      {
        question: direction('s3-02', 'gh-disorders', 'A child — before puberty — develops a GH-secreting pituitary tumour. What happens to the height gained each year?', 'up', 'Before puberty the epiphyseal plates are still open, so excess GH (through the somatomedins) lengthens the long bones: gigantism (Introduction, pp. 35–36).'),
        set: { pituitary: 2 },
        watch: 'height',
        expect: [
          { readout: 'height', change: 'up' },
          { readout: 'diagnosis', equals: 1 },
        ],
      },
      {
        question: mcq('s3-03', 'gh-disorders', 'The same tumour appears in an adult. What happens?', 'The bones widen — hands, feet, jaw — but height does not increase', ['The person grows taller again as the closed growth plates reopen and lengthen', 'Nothing, because adults no longer respond to GH at all'], {
          ...predict,
          explanation: 'After puberty the epiphyses have fused, so bones cannot lengthen; they widen by subperiosteal growth instead: acromegaly (Introduction, pp. 36–37).',
        }),
        from: { age: 1 },
        set: { pituitary: 2 },
        watch: 'diagnosis',
        expect: [
          { readout: 'diagnosis', equals: 2 },
          { readout: 'widen', equals: 1 },
          { readout: 'height', change: 'same' },
        ],
      },
    ],
  }),

  [L(4)]: simulate({
    sim: 'thyroid-axis',
    title: 'The thyroid axis',
    intro: 'Take away iodine, break the thyroid, pituitary or hypothalamus, give T4 tablets, or run the TRH and TSH tests — and watch the gland and the whole body respond.',
    sourceRefs: th([3, 4, 7, 9, 12, 13, 14, 16]),
    predictions: [
      {
        question: direction('s4-01', 'thyroid-control', 'The diet lacks iodine. What happens to TSH?', 'up', 'Iodide is the key factor in making T3 and T4. With less hormone made, negative feedback weakens and TSH rises — and drives the gland to enlarge (Thyroid, pp. 4, 12).'),
        set: { iodine: 0 },
        watch: 'tsh',
        expect: [
          { readout: 'tsh', change: 'up' },
          { readout: 'goitre', change: 'up' },
        ],
      },
      {
        question: direction('s4-02', 'thyroid-systems', 'The thyroid becomes overactive. What happens to the heart rate?', 'up', 'Thyroid hormones increase the number of β receptors, so the heart is more sensitive to catecholamines; the metabolic rate rises too (Thyroid, pp. 7, 9).'),
        set: { condition: 4 },
        watch: 'hr',
        expect: [
          { readout: 'hr', change: 'up' },
          { readout: 'bmr', change: 'up' },
        ],
      },
      {
        question: mcq('s4-03', 'thyroid-control', 'T4 is low because the pituitary has failed. You inject TRH. What do you expect?', 'TSH does not rise', ['TSH rises', 'T4 rises at once to normal'], {
          ...predict,
          explanation: 'A failed pituitary cannot respond to TRH, so TSH stays low. A hypothalamic defect would respond to TRH (Thyroid, p. 13).',
        }),
        from: { condition: 2 },
        set: { test: 1 },
        watch: 'result',
        expect: [{ readout: 'result', equals: 2 }],
      },
    ],
  }),

  [L(5)]: simulate({
    sim: 'adrenal-axis',
    title: 'The adrenal glands',
    intro: 'Switch between Addison’s, Cushing’s, Conn’s and a phaeochromocytoma, give steroid tablets or cut the renal blood flow, and watch cortisol, aldosterone, electrolytes and pressure.',
    sourceRefs: ad([4, 7, 8, 12, 13, 14, 16, 18, 22]),
    predictions: [
      {
        question: direction('s5-01', 'adrenal-disorders', 'In Addison’s disease the adrenal cortex itself fails. What happens to ACTH?', 'up', 'Low cortisol removes negative feedback, so CRH and ACTH rise — and because ACTH has some MSH activity, the skin darkens (Adrenal, pp. 14–15).'),
        set: { condition: 1 },
        watch: 'acth',
        expect: [
          { readout: 'acth', change: 'up' },
          { readout: 'cortisol', change: 'down' },
        ],
      },
      {
        question: direction('s5-02', 'adrenal-disorders', 'An adrenal adenoma secretes aldosterone on its own (Conn’s syndrome). What happens to plasma K⁺?', 'down', 'Aldosterone makes the distal tubule and collecting duct secrete K⁺ (and H⁺) while retaining Na⁺: hypokalaemia, high blood pressure and alkalosis (Adrenal, pp. 12, 18).'),
        set: { condition: 4 },
        watch: 'k',
        expect: [
          { readout: 'k', change: 'down' },
          { readout: 'map', change: 'up' },
        ],
      },
      {
        question: direction('s5-03', 'aldosterone-raas', 'A haemorrhage reduces the blood flow to the kidneys. What happens to aldosterone?', 'up', 'Low renal blood flow makes the juxtaglomerular cells release renin: angiotensin I → (ACE) angiotensin II → aldosterone (Adrenal, p. 13).'),
        set: { bleed: 1 },
        watch: 'aldosterone',
        expect: [
          { readout: 'aldosterone', change: 'up' },
          { readout: 'renin', change: 'up' },
        ],
      },
    ],
  }),

  [L(6)]: simulate({
    sim: 'glucose-insulin',
    title: 'Insulin and blood glucose',
    intro: 'Give a glucose drink, switch on type 1 or type 2 diabetes, inject insulin or exercise, and follow the blood glucose over four hours.',
    sourceRefs: pa([6, 7, 10, 11, 12, 16, 19, 21, 28]),
    predictions: [
      {
        question: direction('s6-01', 'insulin-secretion', 'A healthy person drinks 75 g of glucose. An hour later, how does insulin compare with fasting?', 'up', 'Glucose is the main stimulus of insulin secretion from the β cells (Pancreas, p. 6).'),
        from: { meal: 0 },
        set: { meal: 1 },
        watch: 'insulin',
        expect: [
          { readout: 'insulin', change: 'up' },
          { readout: 'glucose', change: 'up' },
        ],
      },
      {
        question: mcq('s6-02', 'diabetes', 'The same drink is given to someone with type 1 diabetes. Compared with a healthy person, what happens?', 'Glucose climbs above the tubular maximum and appears in the urine', ['Glucose rises a little and falls back to normal within two hours', 'Glucose falls, because no insulin is released to stop it'], {
          ...predict,
          explanation: 'Without insulin, glucose is not taken up and the liver keeps releasing it: blood glucose exceeds the tubular maximum, causing glycosuria and osmotic diuresis (Pancreas, p. 16).',
        }),
        set: { diabetes: 1 },
        watch: 'urine',
        expect: [
          { readout: 'urine', equals: 1 },
          { readout: 'glucose', change: 'up' },
        ],
      },
      {
        question: direction('s6-03', 'insulin-actions', 'The person with type 1 diabetes now injects insulin with the drink. Two hours later, what happens to plasma K⁺?', 'down', 'Insulin stimulates the Na⁺/K⁺-ATPase and moves K⁺ into cells, as well as glucose (Pancreas, p. 10).'),
        from: { diabetes: 1, time: 120 },
        set: { dose: 8 },
        watch: 'k',
        expect: [
          { readout: 'k', change: 'down' },
          { readout: 'glucose', change: 'down' },
        ],
      },
    ],
  }),

  [L(7)]: simulate({
    sim: 'calcium',
    title: 'Calcium balance',
    intro: 'Remove the parathyroids, add a parathyroid tumour, take away vitamin D, damage the kidneys or inject calcitonin — and watch the plasma calcium and the organs that hold it steady.',
    sourceRefs: ca([2, 3, 4, 12, 14, 15, 16, 17, 19]),
    predictions: [
      {
        question: direction('s7-01', 'pth', 'The parathyroid glands are removed during a thyroidectomy. What happens to plasma Ca²⁺?', 'down', 'Without PTH there is less bone resorption, less renal Ca²⁺ reabsorption and less active vitamin D: hypocalcaemia, with excitable nerves and tetany (Calcium, pp. 3, 17).'),
        set: { parathyroid: 1 },
        watch: 'ca',
        expect: [
          { readout: 'ca', change: 'down' },
          { readout: 'nerves', equals: 1 },
        ],
      },
      {
        question: direction('s7-02', 'vitamin-d', 'A person gets no sunlight and little vitamin D in their diet. What happens to PTH?', 'up', 'Less active vitamin D means less calcium absorbed from the gut; the slight fall in plasma Ca²⁺ stimulates PTH, which takes calcium from bone (Calcium, pp. 14, 16).'),
        set: { vitd: 0 },
        watch: 'pth',
        expect: [
          { readout: 'pth', change: 'up' },
          { readout: 'calcitriol', change: 'down' },
        ],
      },
      {
        question: direction('s7-03', 'calcitonin', 'Calcitonin is injected. What happens to bone resorption?', 'down', 'Calcitonin suppresses osteoclast activity — which is why it modestly increases bone mass in osteoporosis (Calcium, p. 19).'),
        set: { calcitonin: 1 },
        watch: 'resorption',
        expect: [{ readout: 'resorption', change: 'down' }],
      },
    ],
  }),
};

export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  return insertSimulation(steps, simulations[lessonId]);
}

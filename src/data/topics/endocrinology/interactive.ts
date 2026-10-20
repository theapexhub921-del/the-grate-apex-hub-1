// Physiology → Endocrinology — layer 1 (learn by answering) and reading
// extras. Checkpoint IDs: cN-xx; recall prompts: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, fill, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { ad, ca, intro, pa, th, type ConceptId } from '@/data/topics/endocrinology/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'endocrinology-1': [
    ask(
      match('c1-01', 'chemical-communication', 'Match each kind of signalling to its route.', [
        ['Autocrine', 'Intracellular fluid — acts on the cell itself'],
        ['Paracrine', 'Extracellular fluid — nearby cells'],
        ['Exocrine', 'Ducts'],
        ['Endocrine', 'Bloodstream'],
      ], { explanation: 'Introduction, p. 2.' })
    ),
    learn('Three classes', ['Amines come from tyrosine (T3, T4, adrenal medulla). Peptides are most hormones. Steroids come from cholesterol (adrenal cortex, gonads, placenta).'], { sourceRefs: intro([3]) }),
    ask(
      mcq('c1-02', 'hormone-classes', 'Cortisol is made in the adrenal cortex from cholesterol. Which class is it?', 'Steroid', ['Peptide', 'Amine', 'Eicosanoid'], { explanation: 'Introduction, p. 3.', skill: 'application' })
    ),
    learn('Solubility decides a lot', ['Water-soluble hormones (peptides, catecholamines) travel free and bind membrane receptors, acting through second messengers. Lipid-soluble ones (thyroid hormones, steroids) travel on binding proteins and bind receptors inside the cell.'], { sourceRefs: intro([6, 7]) }),
    ask(
      mcq('c1-03', 'hormone-action', 'Where is the receptor for a lipid-soluble hormone such as T4?', 'Inside the target cell', ['On the plasma membrane', 'In the blood', 'On the binding protein'], { explanation: 'Introduction, p. 7.', skill: 'cause-effect' })
    ),
    ask(
      mcq('c1-04', 'primary-secondary', 'A patient’s cortisol is low because the pituitary makes too little ACTH. How is this classified?', 'Secondary hyposecretion', ['Primary hyposecretion', 'Primary hypersecretion', 'Secondary hypersecretion'], { explanation: 'Introduction, p. 26: secondary = lack of trophic hormone.', skill: 'application' })
    ),
    recall('r1-01', 'secretion-control', 'Describe the four kinds of input that control endocrine secretion, and explain negative feedback.', [
      'Changes in plasma mineral concentrations, e.g. calcium.',
      'Changes in organic nutrients, e.g. glucose.',
      'Neural input through neurotransmitters.',
      'Another hormone acting on the gland (trophic hormones).',
      'Negative feedback: the hormone’s effect turns down its own secretion, via short, intermediate or long loops.',
    ], intro([9, 23])),
  ],

  'endocrinology-2': [
    ask(
      mcq('c2-01', 'posterior-pituitary', 'Where are ADH and oxytocin actually made?', 'In the hypothalamus (paraventricular and supraoptic nuclei)', ['In the posterior pituitary (pars nervosa)', 'In the anterior pituitary (pars distalis)', 'In the kidney (collecting ducts)'], { explanation: 'Introduction, pp. 10–11: they are made in the hypothalamus and stored in the posterior pituitary.' })
    ),
    learn('The portal system', ['Hypothalamic releasing and inhibiting hormones reach the anterior pituitary through the hypothalamo-pituitary portal system, not the general circulation.'], { sourceRefs: intro([19]) }),
    ask(
      order('c2-02', 'oxytocin', 'Order the milk let-down reflex.', ['Baby sucks', 'Nipple mechanoreceptors stimulated', 'Afferent impulses to the hypothalamus', 'Oxytocin released from the posterior pituitary', 'Myoepithelium contracts', 'Milk ejected'], { explanation: 'Introduction, p. 14.' })
    ),
    learn('ADH control', ['Low ECF volume (atrial volume receptors), a rise in osmolality (hypothalamic osmoreceptors) and stress all raise ADH; alcohol inhibits it.'], { sourceRefs: intro([16]) }),
    ask(
      mcq('c2-03', 'adh', 'After a few drinks, a student passes a lot of dilute urine. Why?', 'Alcohol inhibits ADH secretion', ['Alcohol stimulates aldosterone', 'Alcohol raises ADH', 'Alcohol blocks oxytocin'], { explanation: 'Introduction, p. 16.', skill: 'application' })
    ),
    ask(
      mcq('c2-04', 'adh-disorders', 'A patient has hyponatraemia, low plasma osmolality and concentrated urine. Which is most likely?', 'SIADH', ['Diabetes insipidus', 'Nephrogenic diabetes insipidus', 'Dehydration from diarrhoea'], { explanation: 'Introduction, p. 18: excess water dilutes the sodium.', skill: 'application', clinical: true })
    ),
    recall('r2-01', 'adh-disorders', 'Contrast central diabetes insipidus, nephrogenic diabetes insipidus and SIADH.', [
      'Central DI: the hypothalamo-hypophysial system fails to secrete ADH.',
      'Nephrogenic DI: ADH is present but the kidney’s receptors do not respond.',
      'Both: polyuria, low specific-gravity urine, dehydration and thirst.',
      'SIADH: too much ADH — low volume, concentrated urine, water retention, hyponatraemia and hypo-osmolality from excess water.',
    ], intro([17, 18])),
  ],

  'endocrinology-3': [
    ask(
      mcq('c3-01', 'gh-actions', 'Growth hormone mostly acts through which mediators?', 'Somatomedins (insulin-like growth factors) from the liver', ['Thyroxine released from the thyroid', 'Cortisol (glucocorticoid) from the adrenal cortex', 'Prolactin from the anterior pituitary'], { explanation: 'Introduction, p. 32.' })
    ),
    learn('GH and glucose', ['GH spares glucose: less glucose used for energy, less uptake by muscle, more output by the liver. It is diabetogenic.'], { sourceRefs: intro([30]) }),
    ask(
      multi('c3-02', 'gh-control', 'Which stimulate GH secretion? Select all that apply.', ['Fasting (low blood sugar)', 'Sleep', 'A protein meal', 'Stress'], ['Hyperglycaemia', 'Somatostatin'], { explanation: 'Introduction, pp. 33–34.' })
    ),
    ask(
      mcq('c3-03', 'gh-disorders', 'An adult develops a GH-secreting tumour. Which change is expected?', 'Widening of the hands, feet and jaw, with no increase in height', ['A big increase in height as the long bones lengthen', 'Short stature as the growth plates close early', 'Loss of all bone growth throughout the skeleton'], { explanation: 'Introduction, p. 36: after the epiphyses fuse, growth is subperiosteal — acromegaly.', skill: 'application', clinical: true })
    ),
    learn('Prolactin', ['Dopamine is the main brake on prolactin. A prolactin-secreting adenoma causes galactorrhoea, amenorrhoea and impotence.'], { sourceRefs: intro([41, 43]) }),
    ask(
      mcq('c3-04', 'prolactin', 'Why can a drug that blocks dopamine receptors cause milk secretion?', 'Dopamine normally inhibits prolactin', ['Dopamine stimulates oxytocin', 'Dopamine is needed for milk let-down', 'Dopamine raises oestrogen'], { explanation: 'Introduction, pp. 40–41: dopaminergic antagonists stimulate prolactin.', skill: 'cause-effect' })
    ),
    recall('r3-01', 'gh-actions', 'Describe the effects of growth hormone on protein, fat, carbohydrate and bone.', [
      'Protein: more amino acid uptake and protein synthesis, less protein breakdown.',
      'Fat: releases fat from stores for energy.',
      'Carbohydrate: less glucose use and uptake, more hepatic glucose output — diabetogenic.',
      'Bone: linear growth at the epiphyseal plates via chondrocytes.',
      'Its actions are mediated by somatomedins from the liver.',
    ], intro([29, 30, 31, 32])),
  ],

  'endocrinology-4': [
    ask(
      mcq('c4-01', 'thyroid-hormones', 'Which thyroid hormone is more potent?', 'T3', ['T4', 'Calcitonin', 'TSH'], { explanation: 'Thyroid, p. 3: T3 is about 10% of secretion but more potent; deiodinase makes it from T4.' })
    ),
    learn('Thyroid hormone raises the metabolic rate', ['More O₂ consumption, heat and gluconeogenesis; more LDL receptors so cholesterol falls; more protein breakdown and weight loss.'], { sourceRefs: th([7, 8]) }),
    ask(
      mcq('c4-02', 'thyroid-systems', 'Why does a hyperthyroid patient have a fast, forceful heartbeat?', 'Thyroid hormone increases β1 and β2 receptors, so the heart is more sensitive to catecholamines', ['Thyroid hormone blocks the vagus nerve to the SA node directly', 'Thyroid hormone is itself a catecholamine that acts on the heart', 'Thyroid hormone lowers blood volume, so the heart must beat harder'], { explanation: 'Thyroid, p. 9.', skill: 'cause-effect' })
    ),
    learn('The axis', ['TRH → TSH → T3/T4 → negative feedback. Test the thyroid with TSH and the pituitary with TRH.'], { sourceRefs: th([12, 13]) }),
    ask(
      mcq('c4-03', 'thyroid-control', 'A hypothyroid patient’s thyroid responds to TSH, but the pituitary does not respond to TRH. Where is the defect?', 'The pituitary', ['The thyroid', 'The hypothalamus', 'The tissues'], { explanation: 'Thyroid, p. 13.', skill: 'pathway-reasoning' })
    ),
    ask(
      mcq('c4-04', 'thyroid-disorders', 'A patient feels the cold, thinks slowly, and has coarse hair and yellow skin with white sclerae. Which state?', 'Hypothyroidism', ['Hyperthyroidism', 'Cushing’s syndrome', 'Addison’s disease'], { explanation: 'Thyroid, p. 14.', skill: 'application', clinical: true })
    ),
    recall('r4-01', 'thyroid-control', 'Explain how TSH and TRH tests locate the cause of hypothyroidism.', [
      'Primary (thyroid) hypothyroidism: the thyroid does not respond to TSH.',
      'Secondary (pituitary or hypothalamic): the thyroid does respond to TSH.',
      'Hypothalamic defect: the pituitary responds to TRH.',
      'Pituitary defect: the pituitary does not respond to TRH.',
    ], th([13])),
  ],

  'endocrinology-5': [
    ask(
      match('c5-01', 'adrenal-zones', 'Match each part of the adrenal to its hormones.', [
        ['Zona glomerulosa', 'Mineralocorticoids'],
        ['Zona fasciculata', 'Glucocorticoids'],
        ['Zona reticularis', 'Androgens'],
        ['Medulla', 'Catecholamines'],
      ], { explanation: 'Adrenal, p. 6.' })
    ),
    learn('Cortisol raises glucose', ['Cortisol drives gluconeogenesis, breaks down protein and counteracts insulin. It is also anti-inflammatory and suppresses immunity.'], { sourceRefs: ad([8, 10]) }),
    ask(
      multi('c5-02', 'cortisol-actions', 'Which are actions of cortisol? Select all that apply.', ['Promotes gluconeogenesis', 'Inhibits collagen synthesis', 'Anti-inflammatory', 'Inhibits bone formation'], ['Increases protein synthesis', 'Lowers blood glucose'], { explanation: 'Adrenal, pp. 8–11.' })
    ),
    ask(
      order('c5-03', 'aldosterone-raas', 'Order the renin–angiotensin–aldosterone sequence.', ['Renal blood flow falls', 'Juxtaglomerular cells secrete renin', 'Angiotensinogen → angiotensin I', 'ACE in the lungs → angiotensin II', 'Aldosterone released'], { explanation: 'Adrenal, pp. 12–13.' })
    ),
    ask(
      mcq('c5-04', 'adrenal-disorders', 'A patient has low BP, low Na⁺, high K⁺ and darkened skin. Which disorder?', 'Addison’s disease', ['Cushing’s syndrome', 'Conn’s syndrome', 'Phaeochromocytoma'], { explanation: 'Adrenal, p. 15.', skill: 'application', clinical: true })
    ),
    ask(
      mcq('c5-05', 'adrenal-medulla', 'Which finding points to a phaeochromocytoma?', 'Episodic hypertension with VMA in the urine', ['Hyperkalaemia with hypotension and salt craving', 'Moon face, central obesity and purple striae', 'Hypoglycaemia with skin and mucosal pigmentation'], { explanation: 'Adrenal, p. 22.', clinical: true })
    ),
    recall('r5-01', 'adrenal-disorders', 'Compare Addison’s disease, Cushing’s syndrome and Conn’s syndrome.', [
      'Addison’s: primary adrenal failure — too little glucocorticoid and often mineralocorticoid: hyponatraemia, hyperkalaemia, acidosis, low BP, hyperpigmentation, hypoglycaemia.',
      'Cushing’s: too much cortisol (syndrome if primary, disease if from ACTH/CRH): weight gain, moon face, striae, hypertension, impaired immunity.',
      'Conn’s: aldosterone-secreting adenoma: sodium retention, high BP, hypokalaemia, metabolic alkalosis.',
    ], ad([14, 15, 16, 17, 18])),
  ],

  'endocrinology-6': [
    ask(
      mcq('c6-01', 'islets', 'Which islet cells secrete insulin?', 'β cells', ['α cells', 'δ cells', 'F cells'], { explanation: 'Pancreas, p. 2.' })
    ),
    learn('Insulin is the storage hormone', ['It drives glucose into cells and into glycogen, builds fat and protein, and stops their breakdown. It also moves K⁺ into cells.'], { sourceRefs: pa([7, 8, 9, 10]) }),
    ask(
      mcq('c6-02', 'insulin-actions', 'What does insulin do to gluconeogenesis?', 'Inhibits it', ['Stimulates it', 'No effect', 'Only stimulates it in muscle'], { explanation: 'Pancreas, p. 7.' })
    ),
    ask(
      mcq('c6-03', 'insulin-secretion', 'Why are thiazide diuretics called diabetogenic?', 'They cause hypokalaemia, which reduces insulin secretion', ['They destroy the β cells of the islets', 'They raise glucagon secretion from α cells', 'They block insulin receptors in muscle and fat'], { explanation: 'Pancreas, pp. 6 and 10.', skill: 'cause-effect' })
    ),
    learn('From no insulin to coma', ['High glucose exceeds the renal Tm → osmotic diuresis → loss of water and electrolytes → dehydration → hypotension. Fat breakdown → ketones → acidosis → Kussmaul breathing.'], { sourceRefs: pa([14, 15, 16]) }),
    ask(
      order('c6-04', 'diabetes', 'Order the path from hyperglycaemia to hypotension.', ['High blood sugar', 'Tubular maximum exceeded', 'Osmotic diuresis', 'Water and electrolytes lost', 'Dehydration and hypovolaemia', 'Hypotension'], { explanation: 'Pancreas, pp. 15–16.' })
    ),
    ask(
      mcq('c6-05', 'diabetes', 'A 55-year-old obese man has diabetes with normal insulin levels and no ketosis. Which type?', 'Type 2', ['Type 1', 'Diabetes insipidus', 'Insulinoma'], { explanation: 'Pancreas, p. 19.', skill: 'application', clinical: true })
    ),
    recall('r6-01', 'diabetes', 'Explain why untreated type 1 diabetes causes deep, rapid breathing.', [
      'Without insulin, fat breakdown increases and fatty acids are oxidised to acetyl-CoA.',
      'Acetyl-CoA is not made into fatty acids, so it forms ketone bodies: acetoacetate, acetone and β-hydroxybutyrate.',
      'These acids lower the blood pH (ketoacidosis).',
      'The acidosis drives deep, rapid Kussmaul breathing to blow off CO₂.',
    ], pa([13, 14])),
  ],

  'endocrinology-7': [
    ask(
      mcq('c7-01', 'calcium-roles', 'A patient after thyroid surgery has twitching of the face when the facial nerve is tapped. What is the likely problem?', 'Hypocalcaemia', ['Hypercalcaemia', 'Hyperkalaemia', 'Hypoglycaemia'], { explanation: 'Calcium, p. 3: Chvostek’s sign; the parathyroids may have been removed (p. 16).', skill: 'application', clinical: true })
    ),
    learn('Activating vitamin D', ['Skin (UV) makes cholecalciferol; the liver adds a 25-hydroxyl group; the kidney adds a 1α-hydroxyl group to make active 1,25-dihydroxycholecalciferol.'], { sourceRefs: ca([13]) }),
    ask(
      order('c7-02', 'vitamin-d', 'Order the activation of vitamin D.', ['7-dehydrocholesterol', 'Previtamin D', 'Cholecalciferol', '25-hydroxycholecalciferol', '1,25-dihydroxycholecalciferol'], { explanation: 'Calcium, p. 13.' })
    ),
    ask(
      fill('c7-03', 'vitamin-d', 'The kidney enzyme that makes active vitamin D is 1α-____.', ['hydroxylase', '1α-hydroxylase', '1-alpha-hydroxylase'], { explanation: 'Calcium, p. 13. The liver enzyme is 25-hydroxylase.', skill: 'terminology' })
    ),
    learn('PTH versus calcitonin', ['PTH raises Ca²⁺ and lowers phosphate (bone resorption, renal Ca²⁺ reabsorption, phosphaturia, more active vitamin D). Calcitonin lowers Ca²⁺ by inhibiting osteoclasts.'], { sourceRefs: ca([15, 19]) }),
    ask(
      mcq('c7-04', 'pth', 'What does PTH do to urinary phosphate?', 'Increases it, by reducing tubular reabsorption', ['Decreases it, by increasing tubular reabsorption', 'No effect on phosphate excretion', 'Converts it to calcium in the tubule'], { explanation: 'Calcium, p. 15.' })
    ),
    ask(
      mcq('c7-05', 'pth', 'A patient has hypercalcaemia, kidney stones, bone cysts and raised alkaline phosphatase. Which is most likely?', 'Primary hyperparathyroidism', ['Hypoparathyroidism', 'Vitamin D deficiency (osteomalacia)', 'Excess calcitonin secretion'], { explanation: 'Calcium, p. 17.', skill: 'application', clinical: true })
    ),
    recall('r7-01', 'pth', 'Explain how PTH raises plasma calcium, acting on bone, kidney and gut.', [
      'Bone: increases resorption, mobilising Ca²⁺.',
      'Kidney: increases Ca²⁺ reabsorption and increases phosphate excretion.',
      'Kidney: increases formation of 1,25-dihydroxycholecalciferol.',
      'Gut: 1,25-DHCC increases Ca²⁺ absorption.',
    ], ca([15])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'endocrinology-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Amines (tyrosine), peptides (most), steroids (cholesterol).', 'Lipid-soluble hormones: carried bound, intracellular receptors.', '1° = gland; 2° = trophic hormone.'],
    confusions: [{ confusion: 'Steroid hormones act on membrane receptors with second messengers.', clarification: 'Lipid-soluble hormones have receptors inside the cell (Introduction, p. 7).' }],
  },
  'endocrinology-2': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['ADH and oxytocin: made in the hypothalamus, stored in the posterior pituitary.', 'Alcohol inhibits ADH.', 'SIADH: hyponatraemia from excess water.'],
    confusions: [{ confusion: 'The posterior pituitary makes ADH.', clarification: 'It only stores it; the paraventricular and supraoptic nuclei make it (Introduction, pp. 10–11).' }],
  },
  'endocrinology-3': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['GH acts via somatomedins; it is diabetogenic.', 'Gigantism before puberty, acromegaly after.', 'Dopamine inhibits prolactin.'],
    confusions: [{ confusion: 'Acromegaly makes adults taller.', clarification: 'After the epiphyses fuse, bones widen instead (Introduction, p. 36).' }],
  },
  'endocrinology-4': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['T4 90%, T3 10% but more potent.', 'Thyroid hormone raises BMR and β-receptor numbers.', 'No response to TSH = primary; no response to TRH = pituitary.'],
    confusions: [{ confusion: 'Thyroid hormone raises cholesterol.', clarification: 'It lowers cholesterol by increasing LDL receptors (Thyroid, p. 8).' }],
  },
  'endocrinology-5': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Outside in: glomerulosa (salt), fasciculata (sugar), reticularis (sex hormones).', 'Aldosterone: Na⁺ in, K⁺ and H⁺ out.', 'Addison’s: low Na⁺, high K⁺, pigmentation.'],
    confusions: [{ confusion: 'Cushing’s syndrome and Cushing’s disease are the same.', clarification: 'The lecture uses “syndrome” for primary and “disease” for secondary to ACTH or CRH (Adrenal, p. 16).' }],
  },
  'endocrinology-6': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['β cells: insulin; α: glucagon; δ: somatostatin.', 'Diabetes: glycosuria, polyuria, polydipsia, ketoacidosis.', 'Type 2: normal insulin, fewer receptors, no ketosis.'],
    confusions: [{ confusion: 'Type 2 diabetics have no insulin.', clarification: 'Insulin levels are normal; receptors are reduced (Pancreas, p. 19).' }],
  },
  'endocrinology-7': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Plasma Ca²⁺ 2.16–2.65 mmol/L.', 'PTH raises Ca²⁺ and lowers phosphate; calcitonin lowers Ca²⁺.', 'Liver 25-hydroxylase, kidney 1α-hydroxylase.'],
    confusions: [{ confusion: 'Vitamin D from sunlight is already active.', clarification: 'It must be hydroxylated in the liver and kidney (Calcium, p. 12).' }],
  },
};

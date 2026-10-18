// Physiology → Endocrinology — the seven lessons (reading layer).
// Sources: the five endocrinology lectures (intro, th, ad, pa, ca in
// sources.ts). References name the lecture and page: "Introduction, p. 6".
import type { LessonDraft } from '@/data/topics/build';
import { interactive, readingExtras } from '@/data/topics/endocrinology/interactive';
import { ad, ca, GUYTON, intro, pa, th, type ConceptId } from '@/data/topics/endocrinology/sources';

type Draft = LessonDraft<ConceptId>;

// ─── Lesson 1 ───────────────────────────────────────────────────────

const lesson1: Draft = {
  id: 'endocrinology-1',
  title: 'Principles of Endocrinology',
  description: 'How cells signal, the three chemical classes of hormone, how hormones travel and act, and how their secretion is controlled.',
  xp: 25,
  sourceRefs: intro([2, 3, 6, 7, 9, 23, 26]),
  objectives: [
    'Distinguish autocrine, paracrine, exocrine and endocrine signalling',
    'Classify hormones as amines, peptides or steroids, with examples',
    'Explain how water- and lipid-soluble hormones travel and where their receptors are',
    'List the four kinds of input that control endocrine secretion',
    'Explain negative and positive feedback',
    'Distinguish primary from secondary hypo- and hypersecretion',
  ],
  chunks: [
    {
      title: 'Ways cells communicate',
      kind: 'overview',
      paragraphs: ['Cells communicate through neurons and through chemicals. Chemical signals are named by the route they take (Introduction, p. 2):'],
      terms: [
        { term: 'Autocrine', meaning: 'Acts on the cell that made it — via the intracellular fluid.' },
        { term: 'Paracrine', meaning: 'Acts on nearby cells — via the extracellular fluid.' },
        { term: 'Exocrine', meaning: 'Released through ducts.' },
        { term: 'Endocrine', meaning: 'Carried in the bloodstream to distant targets.' },
      ],
      sourceRefs: intro([2]),
    },
    {
      title: 'Three chemical classes',
      kind: 'classification',
      table: {
        columns: ['Class', 'Made from', 'Examples'],
        rows: [
          ['Amines', 'Amino acids (tyrosine)', 'T3 and T4; adrenal medullary hormones'],
          ['Peptides', 'Amino acids in chains', 'The majority of hormones'],
          ['Steroids', 'Cholesterol', 'Hormones of the adrenal cortex, gonads and placenta'],
        ],
      },
      sourceRefs: intro([3]),
    },
    {
      title: 'Travelling in the blood',
      kind: 'comparison',
      table: {
        columns: ['', 'Water soluble', 'Lipid soluble'],
        rows: [
          ['Examples', 'Peptides, catecholamines', 'Thyroid hormones, steroids'],
          ['In plasma', 'Travel free', 'Bound to proteins: free hormone + binding protein ⇌ hormone–protein complex'],
          ['Receptor', 'On the plasma membrane', 'Inside the cell'],
        ],
      },
      keyPoints: [
        'A hormone acts only on target cells with its receptor — a lock-and-key relationship (Introduction, p. 7).',
        'Hormones acting on membrane receptors work through second messengers: signal transduction.',
      ],
      sourceRefs: intro([6, 7]),
    },
    {
      title: 'Control of secretion',
      kind: 'regulation',
      paragraphs: ['Secretion may come in short bursts, at fluctuating levels, or cyclically with a 24-hour variation. It is controlled by four main kinds of input (Introduction, p. 9):'],
      steps: [
        { label: 'Changes in plasma mineral concentration', detail: 'e.g. calcium controlling PTH (Lesson 7).' },
        { label: 'Changes in organic nutrients', detail: 'e.g. glucose controlling insulin (Lesson 6).' },
        { label: 'Neurons, via neurotransmitters', detail: 'So secretion can be altered by drugs.' },
        { label: 'Another hormone acting on the gland', detail: 'e.g. TSH on the thyroid.' },
      ],
      keyPoints: ['Hormonal control works by feedback: negative feedback (the commonest) and positive feedback, through short, intermediate and long loops (p. 23).'],
      sourceRefs: intro([9, 23, 24, 25]),
    },
    {
      title: 'Primary and secondary disorders',
      kind: 'clinical',
      paragraphs: ['The anterior pituitary mainly makes trophic hormones — hormones that stimulate the production and secretion of other hormones. A defect can lie in the gland itself or in its trophic control (Introduction, p. 26):'],
      table: {
        columns: ['', 'Primary (1°)', 'Secondary (2°)'],
        rows: [
          ['Hyposecretion', 'Fault in the gland itself', 'Lack of trophic hormone'],
          ['Hypersecretion', 'Fault in the gland itself', 'Excess trophic hormone'],
        ],
      },
      sourceRefs: intro([26]),
    },
  ],
  summary: [
    'Autocrine (ICF), paracrine (ECF), exocrine (ducts), endocrine (blood).',
    'Amines (from tyrosine: T3, T4, adrenal medulla), peptides (most hormones), steroids (from cholesterol: adrenal cortex, gonads, placenta).',
    'Water-soluble hormones travel free and act on membrane receptors via second messengers; lipid-soluble ones travel bound to proteins and act on intracellular receptors.',
    'Control: minerals, nutrients, neurons, other hormones; negative and positive feedback (short, intermediate, long loops).',
    '1° = the gland itself; 2° = its trophic hormone.',
  ],
};

// ─── Lesson 2 ───────────────────────────────────────────────────────

const lesson2: Draft = {
  id: 'endocrinology-2',
  title: 'Hypothalamus and Posterior Pituitary',
  description: 'The hypothalamic releasing and inhibiting hormones, the portal system, oxytocin, ADH, diabetes insipidus and SIADH.',
  xp: 25,
  sourceRefs: intro([10, 11, 12, 13, 14, 16, 17, 18, 19, 21]),
  objectives: [
    'Explain how the hypothalamus controls the anterior and posterior pituitary',
    'List the hypothalamic releasing and inhibiting hormones',
    'Describe the actions and stimuli of oxytocin, including the let-down reflex',
    'Describe the actions and control of ADH',
    'Contrast diabetes insipidus with SIADH',
  ],
  chunks: [
    {
      title: 'The hypothalamus',
      kind: 'overview',
      paragraphs: [
        'The hypothalamus synthesises two hormones in its paraventricular and supraoptic nuclei, and controls the anterior pituitary (Introduction, p. 10).',
        'It regulates the anterior pituitary by secreting releasing and inhibiting factors. These pass down the hypothalamo-pituitary portal system and do not enter the systemic circulation (p. 19).',
      ],
      table: {
        columns: ['Hypothalamic hormone', 'Effect on the anterior pituitary'],
        rows: [
          ['Gonadotropin-releasing hormone', 'Stimulates (FSH, LH)'],
          ['Growth hormone-releasing hormone', 'Stimulates GH'],
          ['Growth hormone-inhibiting hormone (somatostatin)', 'Inhibits GH'],
          ['Thyrotrophin-releasing hormone', 'Stimulates TSH'],
          ['Prolactin-releasing hormone', 'Stimulates prolactin'],
          ['Prolactin-inhibiting hormone', 'Inhibits prolactin'],
          ['Corticotropin-releasing hormone', 'Stimulates ACTH'],
        ],
      },
      sourceRefs: intro([10, 19, 21]),
    },
    {
      title: 'The posterior pituitary',
      kind: 'structure',
      paragraphs: [
        'The anterior pituitary is the adenohypophysis; the posterior pituitary is the neurohypophysis. The posterior hormones — ADH (vasopressin) and oxytocin — are formed in the hypothalamus and move down the nerve fibres for storage in the posterior pituitary, carried by proteins called neurophysins (Introduction, p. 11).',
      ],
      sourceRefs: intro([11]),
    },
    {
      title: 'Oxytocin',
      kind: 'mechanism',
      paragraphs: [
        'Oxytocin is a peptide. It contracts the uterus at the end of pregnancy and causes milk ejection — the let-down reflex. It is secreted in response to afferent impulses from the cervix in late pregnancy, and the uterus has more receptors in pregnancy because of uterine distension and oestrogen (Introduction, p. 12).',
        'Milk has already been secreted into the alveoli, but it cannot be sucked out unless it is ejected into the ducts (p. 13):',
      ],
      steps: [
        { label: 'Baby sucks' },
        { label: 'Nipple mechanoreceptors stimulated' },
        { label: 'Afferent impulses to the hypothalamus' },
        { label: 'More oxytocin from the posterior pituitary' },
        { label: 'Myoepithelium contracts' },
        { label: 'Milk ejection' },
      ],
      sourceRefs: intro([12, 13, 14]),
    },
    {
      title: 'ADH (arginine vasopressin)',
      kind: 'regulation',
      paragraphs: ['ADH is a peptide that controls water and electrolyte balance (Introduction, p. 16). Its secretion is controlled by:'],
      terms: [
        { term: 'Baroreceptors', meaning: 'Atrial volume receptors: a reduced ECF volume (diarrhoea, haemorrhage) increases ADH.' },
        { term: 'Osmoreceptors', meaning: 'Located in the hypothalamus.' },
        { term: 'Higher centres', meaning: 'Stress, trauma, pain, anxiety and fear increase ADH.' },
        { term: 'Drugs', meaning: 'Alcohol inhibits ADH.' },
      ],
      sourceRefs: intro([16]),
    },
    {
      title: 'Too little or too much ADH',
      kind: 'clinical',
      table: {
        columns: ['', 'Diabetes insipidus (too little effect)', 'SIADH (too much)'],
        rows: [
          ['Cause', 'Failure of the supraoptico-hypophysial system to secrete ADH; or kidney receptors that do not respond (nephrogenic DI)', 'Inappropriate ADH secretion'],
          ['Urine', 'Polyuria, low specific gravity', 'Low volume, concentrated, high specific gravity'],
          ['Body', 'Dehydration and thirst', 'Mild water retention; hyponatraemia and hypo-osmolality'],
        ],
      },
      keyPoints: ['In SIADH the low sodium is due to excess water, not to a loss of Na⁺ (Introduction, p. 18).'],
      sourceRefs: intro([17, 18]),
    },
  ],
  summary: [
    'Hypothalamus: paraventricular and supraoptic nuclei make ADH and oxytocin; releasing and inhibiting hormones reach the anterior pituitary by the portal system.',
    'GnRH, GHRH, TRH, PRH, CRH stimulate; somatostatin (GHIH) and PIH inhibit.',
    'Posterior pituitary stores ADH and oxytocin, carried down by neurophysins.',
    'Oxytocin: uterine contraction and milk let-down (suckling → hypothalamus → oxytocin → myoepithelium).',
    'ADH: raised by low ECF volume, osmoreceptors and stress; inhibited by alcohol.',
    'DI: polyuria, dilute urine, thirst. SIADH: concentrated urine, water retention, dilutional hyponatraemia.',
  ],
};

// ─── Lesson 3 ───────────────────────────────────────────────────────

const lesson3: Draft = {
  id: 'endocrinology-3',
  title: 'Anterior Pituitary: Growth Hormone and Prolactin',
  description: 'The anterior pituitary hormones, the actions and control of growth hormone, gigantism, acromegaly and dwarfism, prolactin and MSH.',
  xp: 25,
  sourceRefs: intro([20, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45]),
  objectives: [
    'Match each anterior pituitary hormone to its target',
    'Describe the effects of growth hormone on protein, fat, carbohydrate and bone',
    'Explain why growth hormone acts through somatomedins',
    'List what stimulates and inhibits growth hormone',
    'Contrast gigantism and acromegaly',
    'Describe the actions, control and disorders of prolactin',
  ],
  chunks: [
    {
      title: 'Anterior pituitary hormones',
      kind: 'overview',
      table: {
        columns: ['Hormone', 'Target', 'Action'],
        rows: [
          ['FSH, LH', 'Gonads', 'Stimulate germ cells and the secretion of oestrogens, progesterone and testosterone'],
          ['GH', 'All cells', 'Growth of all tissues; organic metabolism; stimulates IGFs'],
          ['TSH', 'Thyroid', 'T3 and T4'],
          ['Prolactin', 'Breast', 'Breast development and milk production'],
          ['ACTH', 'Adrenal cortex', 'Cortisol'],
          ['MSH', 'Melanocytes', ''],
        ],
      },
      sourceRefs: intro([20]),
    },
    {
      title: 'What growth hormone does',
      kind: 'mechanism',
      paragraphs: ['Growth hormone is a peptide that stimulates postnatal somatic growth and development — hypertrophy and hyperplasia of all tissues. Its metabolic effects are directed at promoting growth (Introduction, p. 28):'],
      table: {
        columns: ['Target', 'Effects'],
        rows: [
          ['Protein (muscle)', '↑ amino acid transport into cells, ↑ protein synthesis, ↑ transcription, ↓ protein catabolism'],
          ['Fat', 'Releases fat from stores for energy'],
          ['Carbohydrate', '↓ use of glucose for energy, ↓ glucose uptake (e.g. muscle), ↑ glucose output by the liver — it is diabetogenic'],
          ['Bone (chondrocytes)', '↑ linear growth at the epiphyseal plates; ↑ amino acid uptake, protein, RNA and DNA synthesis, collagen, chondroitin sulphate, cell size and number'],
        ],
      },
      keyPoints: ['Its action is not direct: it is mediated by insulin-like growth factors made in the liver — the somatomedins (p. 32).'],
      sourceRefs: intro([28, 29, 30, 31, 32]),
    },
    {
      title: 'Control of growth hormone',
      kind: 'regulation',
      paragraphs: ['Secretion varies through the day. It is slightly higher in children, peaks at puberty and falls to adult levels and in old age (Introduction, p. 32).'],
      table: {
        columns: ['Stimulate GH', 'Inhibit GH'],
        rows: [
          ['Low energy substrate, e.g. low blood sugar (exercise, fasting)', 'Hyperglycaemia'],
          ['Raised amino acids after a protein meal', 'Cortisol'],
          ['Stress, fever, sleep', 'GH itself'],
          ['GHRH', 'Somatostatin'],
          ['Androgens, oestrogens', 'Pregnancy'],
        ],
      },
      sourceRefs: intro([32, 33, 34]),
    },
    {
      title: 'Too much or too little growth hormone',
      kind: 'clinical',
      paragraphs: ['Hypersecretion, from hyperactive cells or tumours, looks different depending on age (Introduction, pp. 35–37):'],
      table: {
        columns: ['', 'Before puberty: gigantism', 'After puberty: acromegaly'],
        rows: [
          ['Height', 'Long bones lengthen before the epiphyses fuse', 'No increase in height'],
          ['Bone', 'Exaggerated growth of all tissues', 'Subperiosteal growth — bones widen: hands, feet, cranium, nose, forehead, supraorbital ridge, lower jaw, parts of vertebrae'],
        ],
      },
      keyPoints: [
        'Other effects: growth of other glands, hirsutism, visual field changes, gynaecomastia and lactation (p. 37).',
        'Hyposecretion: pituitary dwarfism. Lack of GH receptors: Laron dwarfism (p. 37).',
      ],
      sourceRefs: intro([35, 36, 37]),
    },
    {
      title: 'Prolactin',
      kind: 'regulation',
      paragraphs: ['Prolactin is a peptide that stimulates breast development and milk production (lactation) (Introduction, p. 40).'],
      table: {
        columns: ['Stimulate prolactin', 'Inhibit prolactin'],
        rows: [
          ['Pregnancy, oestrogen', 'Dopamine (used clinically to suppress lactation)'],
          ['Nursing (breast manipulation)', 'Dopaminergic agonists, somatostatin, GABA'],
          ['Exercise, psychological stress, sleep', 'Prolactin itself — short-loop negative feedback by raising dopamine'],
          ['Dopaminergic antagonists, TRH', ''],
        ],
      },
      steps: [
        { label: 'Before and after puberty', detail: 'With oestrogen, progesterone, cortisol and GH: proliferation and branching of the ducts.' },
        { label: 'Pregnancy', detail: 'With oestrogen and progesterone: development of the lobules of alveoli where milk is made.' },
        { label: 'After delivery', detail: 'With insulin and cortisol: milk secretion.' },
      ],
      keyPoints: ['Hypersecretion (pituitary adenoma): galactorrhoea, amenorrhoea (it blocks gonadotropins and ovulation) and impotence (it blocks sperm production). Hyposecretion: inability to lactate (p. 43).'],
      sourceRefs: intro([40, 41, 42, 43]),
    },
    {
      title: 'Melanocyte-stimulating hormone',
      kind: 'definitions',
      paragraphs: [
        'α-MSH (a melanocortin) is secreted from the intermediate lobe. Its precursor, pro-opiomelanocortin (POMC), is made in the anterior and intermediate lobes. MSH corresponds to the first 13 amino acids of ACTH, so ACTH has some MSH activity. MSH acts on skin melanocytes to make melanin, darkening the skin (Introduction, pp. 44–45).',
      ],
      sourceRefs: intro([44, 45]),
    },
  ],
  summary: [
    'Anterior pituitary: FSH, LH (gonads), GH (all cells), TSH (thyroid), prolactin (breast), ACTH (adrenal cortex), MSH (melanocytes).',
    'GH: ↑ protein synthesis, fat mobilisation, ↓ glucose use (diabetogenic), linear bone growth — acting through somatomedins (IGFs) from the liver.',
    'GH up: hypoglycaemia, amino acids, stress, fever, sleep, GHRH, sex steroids. Down: hyperglycaemia, cortisol, GH, somatostatin, pregnancy.',
    'Excess before puberty → gigantism; after → acromegaly (bones widen). Deficiency → pituitary dwarfism; no receptors → Laron dwarfism.',
    'Prolactin: inhibited mainly by dopamine; excess → galactorrhoea, amenorrhoea, impotence.',
    'MSH: from POMC; the first 13 amino acids of ACTH; darkens skin.',
  ],
};

// ─── Lesson 4 ───────────────────────────────────────────────────────

const lesson4: Draft = {
  id: 'endocrinology-4',
  title: 'The Thyroid Gland',
  description: 'T3 and T4, iodine and the follicle, the effects of thyroid hormones, the hypothalamic–pituitary–thyroid axis and thyroid disease.',
  xp: 25,
  sourceRefs: th([3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
  objectives: [
    'Compare T3 and T4',
    'Describe the thyroid follicle and the uptake of iodide',
    'List the metabolic effects of thyroid hormones',
    'Describe their effects on the heart, muscle, CNS and growth',
    'Trace the hypothalamic–pituitary–thyroid axis and locate a defect with TSH and TRH tests',
    'Describe hypothyroidism, cretinism and hyperthyroidism',
  ],
  chunks: [
    {
      title: 'The hormones',
      kind: 'definitions',
      table: {
        columns: ['', 'T4 (thyroxine)', 'T3 (tri-iodothyronine)'],
        rows: [
          ['Share of secretion', 'About 90%', 'About 10%'],
          ['Potency', 'Less potent', 'More potent, with smaller blood levels and a shorter half-life'],
        ],
      },
      keyPoints: [
        'T4 is converted to T3 in the tissues by the enzyme deiodinase (Thyroid, p. 3).',
        'The thyroid also makes calcitonin (Lesson 7).',
      ],
      sourceRefs: th([3]),
    },
    {
      title: 'Iodine and the follicle',
      kind: 'structure',
      paragraphs: [
        'The synthetic pathway matters because it explains thyroid disease. Iodine is the key factor: it is taken up as iodide by active transport. The gland is made of many follicles, each lined by epithelial cells and filled with colloid; the epithelial cells secrete into the colloid (Thyroid, pp. 4–5).',
      ],
      sourceRefs: th([4, 5]),
    },
    {
      title: 'Metabolic effects',
      kind: 'mechanism',
      table: {
        columns: ['Area', 'Effect'],
        rows: [
          ['Calorigenic', 'Raises O₂ consumption — the metabolic rate (BMR); more protein breakdown with more urinary nitrogen; more food intake; loss of fat and protein, so weight loss'],
          ['Carbohydrate', 'More absorption from the gut; more gluconeogenesis'],
          ['Fat', 'Lowers cholesterol by increasing LDL receptors; converts carotene to vitamin A'],
          ['Heat', 'More heat production: higher body temperature, peripheral vasodilation, ↓ peripheral resistance'],
        ],
      },
      sourceRefs: th([7, 8]),
    },
    {
      title: 'Heart, muscle, brain and growth',
      kind: 'mechanism',
      terms: [
        { term: 'Heart', meaning: 'Positive inotropy: it increases the number of β1 and β2 receptors, so the heart is more sensitive to catecholamines.' },
        { term: 'β effects', meaning: 'Sweating and tremor.' },
        { term: 'Muscle', meaning: 'Weakness from protein breakdown; changes in myosin isoforms (in deficiency the ankle jerk becomes slow).' },
        { term: 'CNS', meaning: 'Faster thinking, restlessness, irritability. In deficiency: defective myelination, abnormal synapses and retarded mental development — irreversible unless replacement starts early.' },
        { term: 'Growth', meaning: 'Important for growth; needed for proper bone growth.' },
      ],
      notes: [{ kind: 'check', text: 'Page 11 also says thyroid hormone “slows bone growth and delays epiphyseal healing” — probably describing deficiency. Ask your lecturer.' }],
      sourceRefs: th([9, 10, 11]),
    },
    {
      title: 'The thyroid axis',
      kind: 'regulation',
      steps: [
        { label: 'Hypothalamus', detail: 'TRH (TRF).' },
        { label: 'Anterior pituitary', detail: 'TSH.' },
        { label: 'Thyroid', detail: 'T3 and T4, which feed back on the pituitary and hypothalamus.' },
      ],
      table: {
        columns: ['Where the defect is', 'Test result'],
        rows: [
          ['Thyroid (primary)', 'Thyroid does not respond to TSH'],
          ['Pituitary or hypothalamus (secondary)', 'Thyroid responds to TSH'],
          ['Hypothalamus', 'Responds to TRH'],
          ['Pituitary', 'Does not respond to TRH'],
        ],
      },
      sourceRefs: th([12, 13]),
    },
    {
      title: 'Thyroid disease',
      kind: 'clinical',
      table: {
        columns: ['', 'Hypothyroidism', 'Hyperthyroidism'],
        rows: [
          ['Metabolism', 'Reduced heat production; cold poorly tolerated', 'Increased BMR; heat intolerance'],
          ['CNS', 'Slow thinking, mentally dull, poor memory', 'Hyperactivity, tremor'],
          ['General', 'Myxoedema, coarse hair, yellow skin (but not sclera)', 'Protruding eyeballs'],
        ],
      },
      keyPoints: ['Cretinism (thyroid deficiency from birth): short stature, mental retardation, protruding tongue and belly, jaundice (Thyroid, p. 15).'],
      sourceRefs: th([14, 15, 16]),
    },
  ],
  summary: [
    'T4 ~90%, T3 ~10% (more potent, shorter half-life); deiodinase converts T4 to T3.',
    'Iodide taken up by active transport; follicles of epithelial cells around colloid.',
    'Raise BMR, O₂ use, heat, gluconeogenesis; lower cholesterol (more LDL receptors); weight loss.',
    'More β1/β2 receptors → heart more sensitive to catecholamines; needed for brain development and growth.',
    'TRH → TSH → T3/T4 with negative feedback. 1°: no response to TSH. Pituitary: no response to TRH.',
    'Hypo: cold intolerance, slow, myxoedema; cretinism in infants. Hyper: heat intolerance, tremor, protruding eyes.',
  ],
};

// ─── Lesson 5 ───────────────────────────────────────────────────────

const lesson5: Draft = {
  id: 'endocrinology-5',
  title: 'The Adrenal Gland',
  description: 'The zones of the adrenal cortex, cortisol and its control, aldosterone and the renin–angiotensin system, adrenal disorders and the adrenal medulla.',
  xp: 25,
  sourceRefs: ad([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]),
  objectives: [
    'Match each zone of the adrenal cortex to its hormones',
    'Trace the CRH–ACTH–cortisol axis',
    'List the actions of cortisol',
    'Explain the actions of aldosterone and the renin–angiotensin system',
    'Compare Addison’s disease, Cushing’s syndrome and disease, Conn’s syndrome and hypoaldosteronism',
    'Describe the adrenal medulla and phaeochromocytoma',
  ],
  chunks: [
    {
      title: 'Cortex and medulla',
      kind: 'structure',
      paragraphs: ['The two adrenal glands sit on top of the kidneys. Each has an outer cortex and an inner medulla (Adrenal, p. 2).'],
      table: {
        columns: ['Part', 'Hormones'],
        rows: [
          ['Zona glomerulosa (outer cortex)', 'Mineralocorticoids'],
          ['Zona fasciculata', 'Glucocorticoids'],
          ['Zona reticularis (inner cortex)', 'Androgens'],
          ['Medulla', 'Catecholamines'],
        ],
      },
      keyPoints: [
        'Glucocorticoids are triggered from the hypothalamus and anterior pituitary; mineralocorticoids by signals from the kidneys. The cortex also makes precursors of androgens and oestrogens (p. 3).',
      ],
      sourceRefs: ad([2, 3, 6]),
    },
    {
      title: 'The cortisol axis',
      kind: 'regulation',
      steps: [
        { label: 'Hypothalamus', detail: 'CRH (corticotropin-releasing hormone).' },
        { label: 'Anterior pituitary', detail: 'ACTH — a peptide that regulates the growth and secretion of the adrenal gland.' },
        { label: 'Adrenal cortex', detail: 'Corticosteroids, which feed back negatively.' },
      ],
      paragraphs: [
        'The precursor is cholesterol. The main glucocorticoid is cortisol, with some corticosterone, made in the zona fasciculata. Little is stored, so it has to be made from scratch (Adrenal, p. 7).',
      ],
      sourceRefs: ad([4, 5, 7]),
    },
    {
      title: 'What cortisol does',
      kind: 'mechanism',
      paragraphs: ['Glucocorticoids are essential for life (Adrenal, pp. 8–11).'],
      table: {
        columns: ['Area', 'Effect'],
        rows: [
          ['Glucose', 'Maintains glucose production from protein; promotes gluconeogenesis; counteracts insulin, contributing to hyperglycaemia'],
          ['Protein', 'Accelerates protein breakdown, inhibits protein synthesis; raises free amino acids in serum'],
          ['Fat', 'Facilitates fat metabolism'],
          ['Bone and connective tissue', 'Inhibits bone formation (favouring osteoporosis); antagonises vitamin D, reducing Ca²⁺ absorption; inhibits collagen, thinning skin and vessel walls'],
          ['Circulation and water', 'Supports vascular responsiveness to catecholamines; needed for normal BP and for rapid excretion of a water load'],
          ['Inflammation and immunity', 'Anti-inflammatory (used for allergic reactions); weakens the immune system; stress and cortisol lengthen wound healing'],
          ['CNS', 'Modulates CNS function'],
        ],
      },
      sourceRefs: ad([8, 9, 10, 11]),
    },
    {
      title: 'Aldosterone and the renin–angiotensin system',
      kind: 'regulation',
      paragraphs: [
        'Aldosterone, the main mineralocorticoid, is central to the regulation of blood pressure. It acts on the distal tubules and collecting ducts to increase Na⁺ and water reabsorption — raising blood volume and pressure — and to secrete K⁺ and H⁺ (Adrenal, p. 12).',
      ],
      steps: [
        { label: 'Renal blood flow falls' },
        { label: 'Juxtaglomerular cells convert prorenin to renin and secrete it' },
        { label: 'Renin converts angiotensinogen (from the liver) to angiotensin I' },
        { label: 'ACE in the lungs converts angiotensin I to angiotensin II' },
        { label: 'Aldosterone is released', detail: 'Part of the renin–angiotensin system.' },
      ],
      sourceRefs: ad([12, 13]),
    },
    {
      title: 'Disorders of the adrenal cortex',
      kind: 'clinical',
      table: {
        columns: ['Disorder', 'What is wrong', 'Features'],
        rows: [
          ['Addison’s disease', 'Primary failure: too little glucocorticoid and often mineralocorticoid (2° and 3° insufficiency are from lack of ACTH and CRH)', 'Hyponatraemia, hyperkalaemia, metabolic acidosis, low BP, hyperpigmentation, hypoglycaemia, low testosterone'],
          ['Cushing’s syndrome / disease', 'Too much cortisol: “syndrome” when primary, “disease” when secondary to ACTH or CRH', 'Weight gain, fat around the neck, moon face, red stretch marks, hypertension, poor memory and concentration, irritability, hirsutism, irregular periods, impaired immunity, metabolic alkalosis'],
          ['Conn’s syndrome', 'Primary hyperaldosteronism — an aldosterone-producing adenoma', 'Na⁺ retention → volume expansion and high BP; hypokalaemia; metabolic alkalosis'],
          ['Hypoaldosteronism', 'Too little aldosterone', 'High K⁺, urinary Na⁺ loss, low plasma volume, hypotension, circulatory insufficiency, eventually fatal shock'],
        ],
      },
      keyPoints: ['The hyperpigmentation of Addison’s disease fits Lesson 3: ACTH has some MSH activity.'],
      sourceRefs: ad([14, 15, 16, 17, 18, 19]),
    },
    {
      title: 'The adrenal medulla',
      kind: 'mechanism',
      paragraphs: [
        'The medulla secretes catecholamines — mainly adrenaline, with small amounts of noradrenaline. It is an arm of the sympathetic system without its own neurons, and its secretion is an integral part of the fight-or-flight reaction (Adrenal, p. 20).',
        'Stimuli: anticipation of danger, trauma, pain, hypovolaemia from haemorrhage or fluid loss, hypotension, anoxia, extreme temperature, hypoglycaemia and severe exercise.',
        'Acting on α1, α2, β1 and β2 receptors, catecholamines affect glycogenolysis, lipolysis and ketosis, insulin and glucagon secretion, muscle K⁺ uptake, cardiac contractility, heart rate and conduction velocity, and cause arteriolar dilatation in muscle and liver (p. 21).',
      ],
      keyPoints: ['Phaeochromocytoma (excess secretion): episodic hypertension with headaches, palpitations and chest pain; vanillylmandelic acid (VMA) in the urine (p. 22).'],
      sourceRefs: ad([20, 21, 22]),
    },
  ],
  summary: [
    'Glomerulosa: mineralocorticoids; fasciculata: glucocorticoids; reticularis: androgens; medulla: catecholamines.',
    'CRH → ACTH → cortisol, with negative feedback; cortisol is made from cholesterol on demand.',
    'Cortisol: gluconeogenesis, protein breakdown, anti-insulin, anti-inflammatory, immunosuppressive, bone loss, thin skin; needed for BP.',
    'Aldosterone: Na⁺ and water reabsorption, K⁺ and H⁺ secretion. Renin → angiotensin I → (ACE, lungs) angiotensin II → aldosterone.',
    'Addison’s: low Na⁺, high K⁺, low BP, pigmentation. Cushing’s: moon face, striae, hypertension. Conn’s: hypertension, hypokalaemia, alkalosis.',
    'Medulla: adrenaline for fight or flight. Phaeochromocytoma: episodic hypertension, VMA in urine.',
  ],
};

// ─── Lesson 6 ───────────────────────────────────────────────────────

const lesson6: Draft = {
  id: 'endocrinology-6',
  title: 'The Endocrine Pancreas',
  description: 'The islet cells, insulin and its control and actions, diabetes mellitus, hypoglycaemia and glucagon.',
  xp: 25,
  sourceRefs: pa([2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 28]),
  objectives: [
    'Match each islet cell to its hormone',
    'Describe the structure, synthesis and breakdown of insulin',
    'List what stimulates and inhibits insulin secretion',
    'Describe insulin’s effects on carbohydrate, fat, protein and potassium',
    'Explain the features of diabetes mellitus from the loss of insulin',
    'Contrast type 1 and type 2 diabetes',
    'Describe hypoglycaemia and the actions of glucagon',
  ],
  chunks: [
    {
      title: 'The islets of Langerhans',
      kind: 'structure',
      paragraphs: ['The islets are innervated by parasympathetic, sympathetic and peptidergic nerves. Their hormones mainly control carbohydrate metabolism, but protein and fat are linked to it (Pancreas, p. 2).'],
      table: {
        columns: ['Cell', 'Hormone'],
        rows: [
          ['α', 'Glucagon'],
          ['β', 'Insulin'],
          ['δ', 'Somatostatin'],
          ['F', 'Pancreatic polypeptide'],
        ],
      },
      sourceRefs: pa([2]),
    },
    {
      title: 'Insulin: structure and fate',
      kind: 'definitions',
      paragraphs: [
        'Insulin is a polypeptide of A and B chains linked by disulphide bonds; its amino acid sequence differs between species. It is made as a large preprohormone → proinsulin → insulin + connecting (C) peptide (Pancreas, p. 3).',
        'It is broken down in almost all tissues, mainly liver and kidney, with a half-life of 5–8 minutes, by breaking the disulphide links — “insulinase” (hepatic glutathione–insulin transhydrogenase) (p. 5).',
      ],
      sourceRefs: pa([3, 5]),
    },
    {
      title: 'Control of insulin secretion',
      kind: 'regulation',
      table: {
        columns: ['Stimulate insulin', 'Inhibit insulin'],
        rows: [
          ['Glucose, amino acids', 'Somatostatin'],
          ['Gut hormones: gastrin, secretin, CCK, gastric inhibitory polypeptide', 'α-adrenergic stimulation'],
          ['Glucagon', 'Exercise'],
          ['Parasympathetic (vagal) activity; β-adrenergic stimulation', 'Prostaglandin E₂, β-blockers'],
          ['K⁺, Ca²⁺; sulphonylureas', 'K⁺ depletion; thiazide diuretics'],
        ],
      },
      sourceRefs: pa([6]),
    },
    {
      title: 'What insulin does',
      kind: 'mechanism',
      table: {
        columns: ['', 'Effects', 'Net result'],
        rows: [
          ['Carbohydrate', 'Stimulates glucose uptake, glycolysis and glycogen synthesis; inhibits glycogen breakdown and gluconeogenesis', 'Plasma glucose falls; the liver takes glucose up rather than releasing it'],
          ['Fat', 'Stimulates triacylglycerol synthesis and endothelial lipoprotein lipase; inhibits triacylglycerol breakdown', 'Less plasma glycerol and free fatty acids; fat is stored, not used'],
          ['Protein', 'Stimulates amino acid uptake and protein synthesis; inhibits protein breakdown', 'Lower plasma amino acids; net protein anabolism'],
        ],
      },
      keyPoints: [
        'Insulin moves K⁺ into cells (by stimulating Na⁺/K⁺-ATPase). Hypokalaemia reduces insulin secretion — so thiazide diuretics, which cause hypokalaemia, are diabetogenic (Pancreas, pp. 6, 10).',
        'Exercise moves glucose into cells and raises the affinity of muscle glucose receptors, lowering blood sugar (p. 10).',
      ],
      notes: [{ kind: 'clarified', text: 'Page 10 reads “Hypokalemia causes insulin secretion”, but p. 6 lists K⁺ as a stimulator and K⁺ depletion as an inhibitor, and the next line says thiazides (which cause hypokalaemia) are diabetogenic. Guyton agrees: low K⁺ reduces insulin secretion.' }],
      sourceRefs: [...pa([6, 7, 8, 9, 10]), ...GUYTON],
    },
    {
      title: 'Diabetes mellitus',
      kind: 'clinical',
      paragraphs: ['Diabetes is a lack of insulin or abnormal receptors: all of insulin’s effects are reversed (Pancreas, p. 11).'],
      steps: [
        { label: 'Carbohydrate', detail: 'Glucose is not used → hyperglycaemia.' },
        { label: 'Protein', detail: 'Less protein synthesis; more conversion to glucose → hyperglycaemia; wasting; lower resistance to infection (blood sugar is a good culture medium).' },
        { label: 'Fat', detail: 'More lipid breakdown, less fatty acid synthesis. Acetyl-CoA is not made into fatty acids, so it forms acetoacetate, acetone and β-hydroxybutyrate (ketone bodies) → acid → low pH → deep rapid Kussmaul breathing.' },
        { label: 'Kidney', detail: 'Blood sugar exceeds the tubular maximum (Tm) → osmotic diuresis → polyuria, glycosuria, polydipsia, polyphagia.' },
        { label: 'Fluid', detail: 'Water, Na⁺ and K⁺ lost → electrolyte imbalance → dehydration → hypovolaemia → hypotension.' },
        { label: 'Coma', detail: 'From acidosis, hyperosmolality, lactic acidosis or cerebral oedema.' },
        { label: 'Long term', detail: 'Hypercholesterolaemia → arteriosclerotic vascular disease, with complications in the kidneys, eyes and peripheral nerves.' },
      ],
      table: {
        columns: ['', 'Type 1 (juvenile onset, IDDM)', 'Type 2 (adult onset, NIDDM)'],
        rows: [
          ['Insulin', 'Lacking', 'Normal levels'],
          ['Ketosis', 'Acidosis and ketosis', 'No ketosis'],
          ['Typical patient', 'Young', 'Usually over 40 and obese; fewer insulin receptors on fat (losing weight increases receptor sites)'],
        ],
      },
      keyPoints: ['A hypothesis for type 2: obesity and overeating → constant stimulation of insulin receptors → down-regulation → insulin insensitivity → pancreatic reserve exceeded → failure to recognise glucose as a stimulus for insulin (p. 20).'],
      sourceRefs: pa([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
    },
    {
      title: 'Too much insulin',
      kind: 'clinical',
      paragraphs: [
        'Insulin excess is iatrogenic or from an insulinoma (islet tumour). More glucose uptake causes hypoglycaemia, whose main effects are on the CNS: confusion, weakness, dizziness and hunger. Sympathetic activity is stimulated, with nervousness and sweating. How severe the effects are depends on how fast blood sugar falls relative to the compensatory mechanisms (Pancreas, pp. 21–22).',
      ],
      notes: [{ kind: 'check', text: 'Page 22 lists “↓ excitability of cardiac muscle” among the sympathetic effects of hypoglycaemia; sympathetic stimulation would normally increase it. Not quizzed.' }],
      sourceRefs: pa([21, 22]),
    },
    {
      title: 'Glucagon',
      kind: 'regulation',
      paragraphs: ['Glucagon is a polypeptide with a half-life of 5–10 minutes. It is gluconeogenic, lipolytic and ketogenic — effects opposite to insulin, and similar to a lack of insulin (Pancreas, p. 28).'],
      table: {
        columns: ['Stimulate glucagon', 'Inhibit glucagon'],
        rows: [
          ['Low glucose', 'Glucose'],
          ['β-sympathetic activity, exercise, infection', 'α-adrenergic stimulation'],
          ['Cortisol, vagal stimulation, protein and amino acids', ''],
        ],
      },
      sourceRefs: pa([28]),
    },
  ],
  summary: [
    'α glucagon, β insulin, δ somatostatin, F pancreatic polypeptide.',
    'Insulin: A and B chains joined by disulphide bonds; preproinsulin → proinsulin → insulin + C peptide; half-life 5–8 min.',
    'Stimulated by glucose, amino acids, gut hormones, vagus, β stimulation, sulphonylureas; inhibited by somatostatin, α stimulation, low K⁺, thiazides.',
    'Insulin stores glucose, fat and protein and moves K⁺ into cells.',
    'Diabetes: hyperglycaemia, ketosis (Kussmaul breathing), osmotic diuresis (polyuria, polydipsia), dehydration, coma; long-term vascular disease.',
    'Type 1: no insulin, ketosis. Type 2: over 40, obese, normal insulin, fewer receptors, no ketosis.',
    'Glucagon: gluconeogenic, lipolytic, ketogenic; raised by low glucose, exercise, stress hormones and amino acids.',
  ],
};

// ─── Lesson 7 ───────────────────────────────────────────────────────

const lesson7: Draft = {
  id: 'endocrinology-7',
  title: 'Calcium Metabolism',
  description: 'Why calcium matters, hypo- and hypercalcaemia, bone, vitamin D, parathyroid hormone and calcitonin.',
  xp: 25,
  sourceRefs: ca([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19]),
  objectives: [
    'List the roles of calcium and its normal plasma range',
    'Contrast the effects of hypocalcaemia and hypercalcaemia',
    'Describe the cells of bone and its disorders',
    'Trace the activation of vitamin D and list its actions',
    'Describe the actions and control of PTH, and hypo- and hyperparathyroidism',
    'Describe the actions of calcitonin',
  ],
  chunks: [
    {
      title: 'Why calcium matters',
      kind: 'overview',
      paragraphs: [
        'Calcium is involved in action potentials, contraction, enzyme modulation, synaptic transmission, bone and teeth, secretion, as a second messenger and in blood clotting. Its plasma range is 2.16–2.65 mmol/L (Calcium, p. 2).',
      ],
      table: {
        columns: ['Hypocalcaemia', 'Hypercalcaemia'],
        rows: [
          ['Nerves more excitable (more Na⁺ permeability) → spontaneous discharge', 'Nerves less excitable'],
          ['Spontaneous muscle contraction: tetany, convulsions', 'Sluggish reflexes, muscle weakness'],
          ['Tests: Chvostek’s and Trousseau’s signs', 'Poor appetite; depressed relaxation of the heart in diastole'],
        ],
      },
      sourceRefs: ca([2, 3, 4]),
    },
    {
      title: 'Hormones, organs and absorption',
      kind: 'overview',
      table: {
        columns: ['Hormone', 'Source'],
        rows: [
          ['Calcitonin', 'Parafollicular cells of the thyroid'],
          ['Parathyroid hormone', 'Chief cells of the parathyroid glands'],
          ['1,25-dihydroxycholecalciferol', 'Vitamin D derivative'],
        ],
      },
      keyPoints: [
        'Skin, liver, bone, kidney and gut are involved (Calcium, p. 5).',
        'Calcium is absorbed from the gut mostly by active transport (a little passively), helped by proteins and inhibited by phosphates and oxalates; it is reabsorbed in the proximal tubule. Phosphate is absorbed in the duodenum and small intestine and reabsorbed in the proximal tubule (p. 6).',
      ],
      sourceRefs: ca([5, 6]),
    },
    {
      title: 'Bone',
      kind: 'structure',
      paragraphs: [
        'Bone is a type 1 collagen matrix impregnated with mineral salts, especially calcium hydroxyapatite. It turns over actively and is constantly remodelled, faster (and in positive balance) in children (Calcium, p. 7). It grows laterally (subperiosteal) and in length (epiphyseal), and takes up Pb²⁺, Mg²⁺, fluoride and drugs (p. 9).',
      ],
      terms: [
        { term: 'Osteoblast', meaning: 'Bone-forming cell that secretes collagen which calcifies; its activity goes with high alkaline phosphatase.' },
        { term: 'Osteoclast', meaning: 'Erodes and absorbs bone, digesting it in its cytoplasm.' },
        { term: 'Osteocyte', meaning: 'Transfers Ca²⁺ from bone’s large interior surface out into the ECF.' },
      ],
      table: {
        columns: ['Disorder', 'Problem'],
        rows: [
          ['Osteopetrosis', 'Defective osteoclasts: denser bone, narrowed skull foramina, marrow spaces crowded out'],
          ['Osteoporosis', 'Loss of bone matrix'],
          ['Osteomalacia / rickets', 'Loss of bone mineralisation'],
        ],
      },
      keyPoints: ['Mineralisation needs normal plasma Ca²⁺, PO₄³⁻ and vitamin D (p. 8).'],
      sourceRefs: ca([7, 8, 9, 10]),
    },
    {
      title: 'Vitamin D',
      kind: 'pathway',
      paragraphs: ['Vitamin D₃ (cholecalciferol) and D₂ (ergocalciferol) can be eaten, but synthesis in the skin under UV light is the major source. Either way it is inactive until hydroxylated by the liver and kidney (Calcium, p. 12):'],
      steps: [
        { label: '7-dehydrocholesterol', detail: 'Skin, UV light.' },
        { label: 'Previtamin D', detail: 'Skin, UV light.' },
        { label: 'Cholecalciferol', detail: 'Plus dietary vitamin D.' },
        { label: '25-hydroxycholecalciferol', detail: 'Liver, 25-hydroxylase.' },
        { label: '1,25-dihydroxycholecalciferol (active)', detail: 'Kidney, 1α-hydroxylase. (24,25-dihydroxycholecalciferol is an inactive metabolite.)' },
      ],
      keyPoints: [
        'It raises plasma Ca²⁺: more intestinal absorption of Ca²⁺ and PO₄, more renal reabsorption of Ca²⁺, and mobilisation of Ca²⁺ and PO₄ from bone (p. 14).',
        'Deficiency: rickets in children (lack of ossification, demineralisation); osteomalacia in adults (demineralisation, softening) (p. 18).',
      ],
      sourceRefs: ca([12, 13, 14, 18]),
    },
    {
      title: 'Parathyroid hormone',
      kind: 'regulation',
      paragraphs: [
        'Four parathyroid glands lie at the superior and inferior poles of the thyroid. PTH raises plasma Ca²⁺ and lowers plasma phosphate (Calcium, p. 15) by:',
      ],
      steps: [
        { label: 'Bone', detail: 'More resorption, mobilising Ca²⁺.' },
        { label: 'Kidney', detail: 'More Ca²⁺ reabsorption; more phosphate excretion (less phosphate reabsorption).' },
        { label: 'Vitamin D', detail: 'More 1,25-dihydroxycholecalciferol, so more absorption from the gut.' },
      ],
      table: {
        columns: ['', 'Hypoparathyroidism', 'Hyperparathyroidism'],
        rows: [
          ['Cause', 'e.g. thyroidectomy', 'Usually primary — tumours'],
          ['Features', 'Hypocalcaemia and its consequences', 'More osteoclast and less osteoblast activity; hypercalcaemia, hyperphosphaturia, hypercalciuria, kidney stones, metastatic calcification, bone cysts from demineralisation, raised alkaline phosphatase'],
          ['Treatment', 'PTH; large doses of vitamin D', ''],
        ],
      },
      keyPoints: ['PTH secretion is controlled by plasma Ca²⁺: high Ca²⁺ favours deposition in bone; low Ca²⁺ favours resorption (p. 16).'],
      sourceRefs: ca([15, 16, 17]),
    },
    {
      title: 'Calcitonin',
      kind: 'regulation',
      paragraphs: [
        'Calcitonin, from the thyroid, opposes PTH: it lowers blood calcium by suppressing osteoclast activity and increasing urinary calcium excretion. Given to patients with osteoporosis (by injection or nasal spray) it produces modest increases in bone mass because it slows bone resorption (Calcium, p. 19).',
      ],
      sourceRefs: ca([19]),
    },
  ],
  summary: [
    'Plasma Ca²⁺ 2.16–2.65 mmol/L. Low: excitable nerves, tetany (Chvostek, Trousseau). High: sluggish reflexes, weakness.',
    'Calcitonin (thyroid parafollicular cells), PTH (parathyroid chief cells), 1,25-DHCC (vitamin D).',
    'Osteoblasts build (alkaline phosphatase), osteoclasts resorb, osteocytes move Ca²⁺ to the ECF. Osteopetrosis, osteoporosis, osteomalacia/rickets.',
    'Vitamin D: skin (UV) → liver 25-hydroxylase → kidney 1α-hydroxylase → 1,25-DHCC; raises Ca²⁺ via gut, kidney and bone.',
    'PTH: raises Ca²⁺, lowers phosphate (bone resorption, renal Ca²⁺ reabsorption, phosphaturia, more 1,25-DHCC).',
    'Calcitonin: lowers Ca²⁺ by inhibiting osteoclasts and increasing urinary calcium.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: interactive[lesson.id],
}));

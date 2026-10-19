// Physiology → Endocrinology — the topic question bank.
//
// Rules: only what the lessons teach (the five endocrinology lectures).
// Not asked: thyroid hormone "slowing bone growth", cardiac excitability in
// hypoglycaemia, or the timing of the fall in prolactin (see
// discrepancies). Options are shuffled at quiz time. IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/endocrinology/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  mcq('q1-01', 'chemical-communication', 'A hormone carried in the blood to a distant target is…', 'Endocrine', ['Paracrine', 'Autocrine', 'Exocrine'], { explanation: 'Introduction, p. 2.' }),
  mcq('q1-02', 'chemical-communication', 'Paracrine signals travel via…', 'The extracellular fluid', ['The bloodstream', 'Ducts', 'The intracellular fluid'], { explanation: 'Introduction, p. 2.' }),
  mcq('q1-03', 'hormone-classes', 'Thyroid hormones (T3, T4) are derived from…', 'The amino acid tyrosine', ['Cholesterol (like steroids)', 'Fatty acids', 'Glucose'], { explanation: 'Introduction, p. 3: they are amines.' }),
  multi('q1-04', 'hormone-classes', 'Which glands make steroid hormones? Select all that apply.', ['Adrenal cortex', 'Gonads', 'Placenta'], ['Adrenal medulla', 'Posterior pituitary'], { explanation: 'Introduction, p. 3.' }),
  mcq('q1-05', 'hormone-classes', 'Most hormones are…', 'Peptides', ['Steroids', 'Amines', 'Lipids'], { explanation: 'Introduction, p. 3.' }),
  mcq('q1-06', 'hormone-transport', 'How do catecholamines travel in plasma?', 'Free, because they are water soluble', ['Bound to specific binding proteins', 'Inside the red blood cells', 'In chylomicrons with lipids'], { explanation: 'Introduction, p. 6.' }),
  tf({ id: 'q1-07', conceptId: 'hormone-transport', statement: 'Steroid and thyroid hormones are carried in the blood largely bound to proteins.', answer: true, explanation: 'Introduction, p. 6.' }),
  mcq('q1-08', 'hormone-action', 'Water-soluble hormones act through…', 'Receptors on the plasma membrane and second messengers', ['Receptors in the nucleus only, after entering the cell', 'Diffusing freely through the membrane into the cell', 'Binding proteins in the cytoplasm that carry them inward'], { explanation: 'Introduction, p. 7.' }),
  mcq('q1-09', 'hormone-action', 'The receptor–hormone relationship is described as…', 'A lock-and-key phenomenon', ['A random interaction', 'A covalent bond', 'An enzyme cascade'], { explanation: 'Introduction, p. 7.' }),
  multi('q1-10', 'secretion-control', 'Which are the four main kinds of input controlling endocrine secretion? Select all that apply.', ['Changes in plasma minerals', 'Changes in organic nutrients', 'Neurotransmitters', 'Another hormone'], ['Body posture'], { explanation: 'Introduction, p. 9.' }),
  multi('q1-11', 'secretion-control', 'Which patterns of secretion does the lecture describe? Select all that apply.', ['Short bursts', 'Fluctuating levels', 'A 24-hour cycle'], ['Constant, unchanging output'], { explanation: 'Introduction, p. 9.' }),
  tf({ id: 'q1-12', conceptId: 'secretion-control', statement: 'Because neural control of secretion uses neurotransmitters, it can be altered by drugs.', answer: true, explanation: 'Introduction, p. 23.' }),
  mcq('q1-13', 'primary-secondary', 'A trophic hormone is one that…', 'Stimulates the production and secretion of another hormone', ['Inhibits the growth of its target tissue', 'Is stored in the posterior pituitary until released', 'Acts only locally on neighbouring cells'], { explanation: 'Introduction, p. 26.', skill: 'terminology' }),
  mcq('q1-14', 'primary-secondary', 'Too much thyroid hormone caused by a TSH-secreting tumour is…', 'Secondary hypersecretion', ['Primary hypersecretion', 'Primary hyposecretion (thyroid)', 'Secondary hyposecretion'], { explanation: 'Introduction, p. 26: excess trophic hormone.', skill: 'application' }),
];

const lesson2: Q[] = [
  mcq('q2-01', 'hypothalamus', 'In which hypothalamic nuclei are ADH and oxytocin made?', 'Paraventricular and supraoptic', ['Arcuate and ventromedial', 'Suprachiasmatic and preoptic', 'Mammillary and posterior'], { explanation: 'Introduction, p. 10.' }),
  mcq('q2-02', 'hypothalamus', 'How do releasing hormones reach the anterior pituitary?', 'Through the hypothalamo-pituitary portal system', ['Down nerve fibres in the pituitary stalk', 'Through the general systemic circulation', 'Through the CSF of the third ventricle'], { explanation: 'Introduction, p. 19.' }),
  mcq('q2-03', 'hypothalamus', 'Somatostatin is also called…', 'Growth hormone-inhibiting hormone', ['Growth hormone-releasing hormone', 'Prolactin-releasing hormone', 'Corticotropin-releasing hormone'], { explanation: 'Introduction, p. 21.', skill: 'terminology' }),
  multi('q2-04', 'hypothalamus', 'Which hypothalamic hormones are inhibitory? Select all that apply.', ['Somatostatin (GHIH)', 'Prolactin-inhibiting hormone'], ['TRH', 'CRH', 'GnRH'], { explanation: 'Introduction, p. 21.' }),
  mcq('q2-05', 'posterior-pituitary', 'The posterior pituitary is also called the…', 'Neurohypophysis', ['Adenohypophysis', 'Pars intermedia', 'Infundibulum'], { explanation: 'Introduction, p. 11.', skill: 'terminology' }),
  mcq('q2-06', 'posterior-pituitary', 'What carries ADH and oxytocin down to the posterior pituitary?', 'Neurophysins', ['Albumin', 'Portal blood', 'Thyroglobulin'], { explanation: 'Introduction, p. 11.' }),
  multi('q2-07', 'oxytocin', 'What are the actions of oxytocin? Select all that apply.', ['Uterine contraction at the end of pregnancy', 'Milk ejection'], ['Milk production', 'Water reabsorption'], { explanation: 'Introduction, p. 12. Milk production is prolactin.' }),
  mcq('q2-08', 'oxytocin', 'Why is the uterus more sensitive to oxytocin in pregnancy?', 'It has more receptors, from uterine distension and oestrogen', ['Oxytocin levels in the blood are 100 times higher', 'Progesterone sensitises the myometrium to oxytocin', 'The cervix makes its own oxytocin near term'], { explanation: 'Introduction, p. 12.' }),
  mcq('q2-09', 'oxytocin', 'In the let-down reflex, what does oxytocin contract?', 'The myoepithelium around the alveoli', ['The smooth muscle of the nipple', 'The uterus only, not the breast', 'The walls of the lactiferous ducts'], { explanation: 'Introduction, p. 14.' }),
  mcq('q2-10', 'adh', 'Where are the osmoreceptors controlling ADH?', 'In the hypothalamus', ['In the kidney', 'In the atria', 'In the carotid sinus'], { explanation: 'Introduction, p. 16.' }),
  multi('q2-11', 'adh', 'Which increase ADH secretion? Select all that apply.', ['Haemorrhage', 'Pain', 'Fear', 'Diarrhoea'], ['Alcohol'], { explanation: 'Introduction, p. 16.' }),
  mcq('q2-12', 'adh-disorders', 'Diabetes insipidus in which the kidney does not respond to ADH is called…', 'Nephrogenic diabetes insipidus', ['Central (cranial) diabetes insipidus', 'SIADH', 'Diabetes mellitus'], { explanation: 'Introduction, p. 17.', skill: 'terminology' }),
  multi('q2-13', 'adh-disorders', 'Which are features of diabetes insipidus? Select all that apply.', ['Polyuria', 'Low specific-gravity urine', 'Thirst', 'Dehydration'], ['Hyponatraemia from water retention'], { explanation: 'Introduction, p. 17.' }),
  tf({ id: 'q2-14', conceptId: 'adh-disorders', statement: 'In SIADH the plasma sodium is low because sodium is lost in the urine.', answer: false, explanation: 'Introduction, p. 18: it is low because of excess water, not decreased Na⁺.', skill: 'misconception' }),
  mcq('q2-15', 'adh-disorders', 'Urine in SIADH is…', 'Low volume and concentrated', ['Large volume and dilute', 'Normal volume and concentration', 'Full of glucose (glycosuria)'], { explanation: 'Introduction, p. 18.' }),
];

const lesson3: Q[] = [
  match('q3-01', 'anterior-pituitary', 'Match each anterior pituitary hormone to its target.', [
    ['TSH', 'Thyroid'],
    ['ACTH', 'Adrenal cortex'],
    ['FSH and LH', 'Gonads'],
    ['Prolactin', 'Breast'],
  ], { explanation: 'Introduction, p. 20.' }),
  mcq('q3-02', 'gh-actions', 'Growth hormone is…', 'A peptide', ['A steroid', 'An amine', 'A glycoprotein made in the liver'], { explanation: 'Introduction, p. 28.' }),
  mcq('q3-03', 'gh-actions', 'Why is growth hormone called diabetogenic?', 'It reduces glucose use and uptake and increases hepatic glucose output', ['It destroys the β cells of the pancreatic islets', 'It blocks insulin secretion from the pancreas', 'It causes glycosuria directly through the kidney'], { explanation: 'Introduction, p. 30.', skill: 'cause-effect' }),
  multi('q3-04', 'gh-actions', 'What does GH do in muscle? Select all that apply.', ['Increases amino acid transport into cells', 'Increases protein synthesis', 'Decreases protein catabolism'], ['Increases glucose uptake'], { explanation: 'Introduction, p. 29.' }),
  mcq('q3-05', 'gh-actions', 'GH increases linear growth by acting on…', 'Chondrocytes of the epiphyseal growth plates', ['Osteoclasts throughout the skeleton', 'The periosteum of the shaft only', 'The red bone marrow'], { explanation: 'Introduction, p. 31.' }),
  mcq('q3-06', 'gh-control', 'When does GH secretion peak?', 'At puberty', ['In infancy', 'In middle age', 'In old age'], { explanation: 'Introduction, p. 32.' }),
  multi('q3-07', 'gh-control', 'Which inhibit GH secretion? Select all that apply.', ['Hyperglycaemia', 'Cortisol', 'Somatostatin', 'Pregnancy'], ['Sleep', 'Fever'], { explanation: 'Introduction, p. 34.' }),
  mcq('q3-08', 'gh-disorders', 'GH excess before the epiphyses fuse causes…', 'Gigantism', ['Acromegaly', 'Dwarfism', 'Cretinism'], { explanation: 'Introduction, p. 35.' }),
  multi('q3-09', 'gh-disorders', 'Which bones enlarge in acromegaly? Select all that apply.', ['Hands and feet', 'Lower jaw', 'Supraorbital ridge'], ['Femur length'], { explanation: 'Introduction, p. 36.' }),
  mcq('q3-10', 'gh-disorders', 'Dwarfism from a lack of GH receptors is…', 'Laron dwarfism', ['Pituitary dwarfism', 'Cretinism', 'Achondroplasia'], { explanation: 'Introduction, p. 37.' }),
  multi('q3-11', 'gh-disorders', 'Besides bone changes, which can GH excess cause? Select all that apply.', ['Visual field changes', 'Hirsutism', 'Growth of other glands'], ['Hypotension'], { explanation: 'Introduction, p. 37.' }),
  mcq('q3-12', 'prolactin', 'What is the main inhibitor of prolactin?', 'Dopamine', ['TRH', 'Oestrogen', 'Oxytocin'], { explanation: 'Introduction, p. 41.' }),
  multi('q3-13', 'prolactin', 'Which stimulate prolactin? Select all that apply.', ['Pregnancy', 'Suckling', 'TRH', 'Sleep'], ['Dopamine agonists'], { explanation: 'Introduction, p. 40.' }),
  multi('q3-14', 'prolactin', 'A prolactin-secreting adenoma can cause… Select all that apply.', ['Galactorrhoea', 'Amenorrhoea', 'Impotence'], ['Acromegaly'], { explanation: 'Introduction, p. 43.', clinical: true }),
  mcq('q3-15', 'prolactin', 'Why does high prolactin cause amenorrhoea?', 'It blocks gonadotropin synthesis and release, preventing ovulation', ['It destroys the ovarian follicles directly', 'It raises oestrogen until the cycle stops', 'It contracts the uterus and expels the lining'], { explanation: 'Introduction, p. 43.', skill: 'cause-effect' }),
  mcq('q3-16', 'prolactin', 'After delivery, prolactin acts with which hormones to stimulate milk secretion?', 'Insulin and cortisol', ['Oestrogen and progesterone', 'GH and thyroxine', 'Oxytocin and ADH'], { explanation: 'Introduction, p. 42.' }),
  mcq('q3-17', 'msh', 'MSH comes from which precursor?', 'Pro-opiomelanocortin (POMC)', ['Proinsulin', 'Thyroglobulin', 'Angiotensinogen'], { explanation: 'Introduction, p. 44.' }),
  tf({ id: 'q3-18', conceptId: 'msh', statement: 'ACTH has some MSH activity.', answer: true, explanation: 'Introduction, p. 44: MSH corresponds to the first 13 amino acids of ACTH.' }),
];

const lesson4: Q[] = [
  mcq('q4-01', 'thyroid-hormones', 'About what proportion of thyroid secretion is T4?', '90%', ['10%', '50%', '99%'], { explanation: 'Thyroid, p. 3.' }),
  mcq('q4-02', 'thyroid-hormones', 'Which enzyme converts T4 to T3 in the tissues?', 'Deiodinase', ['Peroxidase', 'Hydroxylase', 'Kinase'], { explanation: 'Thyroid, p. 3.' }),
  mcq('q4-03', 'thyroid-hormones', 'How is iodide taken up by the thyroid?', 'By active transport', ['By simple diffusion', 'By endocytosis of colloid', 'Bound to albumin'], { explanation: 'Thyroid, p. 4.' }),
  mcq('q4-04', 'thyroid-hormones', 'Thyroid follicles are filled with…', 'Colloid', ['Blood', 'Lymph', 'Calcitonin'], { explanation: 'Thyroid, p. 5.' }),
  multi('q4-05', 'thyroid-metabolic', 'Which are effects of thyroid hormones? Select all that apply.', ['Raised O₂ consumption', 'Increased gluconeogenesis', 'Lower cholesterol', 'Weight loss'], ['Lower body temperature'], { explanation: 'Thyroid, pp. 7–8.' }),
  mcq('q4-06', 'thyroid-metabolic', 'How do thyroid hormones lower cholesterol?', 'By increasing LDL receptors', ['By blocking cholesterol synthesis completely', 'By excreting it in urine', 'By converting it to vitamin A'], { explanation: 'Thyroid, p. 8.' }),
  mcq('q4-07', 'thyroid-metabolic', 'What do thyroid hormones do to peripheral resistance?', 'Lower it, through peripheral vasodilation', ['Raise it, through vasoconstriction', 'No change in resistance', 'Raise it only in the skin'], { explanation: 'Thyroid, p. 8.' }),
  tf({ id: 'q4-08', conceptId: 'thyroid-metabolic', statement: 'Thyroid hormones convert carotene to vitamin A.', answer: true, explanation: 'Thyroid, p. 8.' }),
  mcq('q4-09', 'thyroid-systems', 'Why does excess thyroid hormone cause muscle weakness?', 'Protein breakdown', ['Low plasma calcium', 'Nerve damage', 'Too little ATP'], { explanation: 'Thyroid, p. 9.', skill: 'cause-effect' }),
  mcq('q4-10', 'thyroid-systems', 'Without early replacement, thyroid deficiency in infancy causes…', 'Irreversible retarded mental development', ['Reversible mental slowing only', 'Gigantism with excess growth', 'Hyperactivity and restlessness'], { explanation: 'Thyroid, p. 10: defective myelination and abnormal synapses.' }),
  multi('q4-11', 'thyroid-systems', 'Which CNS effects come with excess thyroid hormone? Select all that apply.', ['Restlessness', 'Irritability', 'Faster thinking'], ['Poor memory'], { explanation: 'Thyroid, p. 10.' }),
  order('q4-12', 'thyroid-control', 'Order the thyroid axis.', ['Hypothalamus releases TRH', 'Anterior pituitary releases TSH', 'Thyroid releases T3 and T4'], { explanation: 'Thyroid, p. 12.' }),
  mcq('q4-13', 'thyroid-control', 'A hypothyroid patient’s thyroid does not respond to TSH. The defect is…', 'Primary — in the thyroid', ['Secondary — in the pituitary', 'Tertiary — in the hypothalamus', 'Peripheral — in the tissues'], { explanation: 'Thyroid, p. 13.', skill: 'pathway-reasoning' }),
  mcq('q4-14', 'thyroid-control', 'The pituitary responds to TRH, but TSH is low. Where is the defect?', 'The hypothalamus', ['The pituitary', 'The thyroid gland itself', 'Nowhere'], { explanation: 'Thyroid, p. 13.', skill: 'pathway-reasoning' }),
  multi('q4-15', 'thyroid-disorders', 'Which are features of cretinism? Select all that apply.', ['Short stature', 'Mental retardation', 'Protruding tongue', 'Jaundice'], ['Exophthalmos'], { explanation: 'Thyroid, p. 15.', clinical: true }),
  multi('q4-16', 'thyroid-disorders', 'Which are features of hyperthyroidism? Select all that apply.', ['Heat intolerance', 'Tremor', 'Protruding eyeballs', 'Increased BMR'], ['Myxoedema'], { explanation: 'Thyroid, p. 16.', clinical: true }),
  mcq('q4-17', 'thyroid-disorders', 'In hypothyroidism the skin is yellow but the sclerae are…', 'Not yellow', ['Yellow too', 'Blue', 'Red'], { explanation: 'Thyroid, p. 14.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'adrenal-zones', 'Which zone makes cortisol?', 'Zona fasciculata', ['Zona glomerulosa', 'Zona reticularis', 'Medulla'], { explanation: 'Adrenal, pp. 6–7.' }),
  mcq('q5-02', 'adrenal-zones', 'Mineralocorticoid secretion is triggered mainly by…', 'Signals from the kidneys', ['ACTH from the pituitary', 'Sympathetic nerves', 'Thyroxine'], { explanation: 'Adrenal, p. 3.' }),
  mcq('q5-03', 'glucocorticoid-control', 'What stimulates ACTH release?', 'CRH from the hypothalamus', ['Cortisol from the adrenal', 'Aldosterone', 'Renin from the kidney'], { explanation: 'Adrenal, p. 5.' }),
  tf({ id: 'q5-04', conceptId: 'glucocorticoid-control', statement: 'Large amounts of cortisol are stored in the adrenal, ready for release.', answer: false, explanation: 'Adrenal, p. 7: little is stored, so it is made from scratch.', skill: 'misconception' }),
  mcq('q5-05', 'glucocorticoid-control', 'The precursor of glucocorticoids is…', 'Cholesterol', ['Tyrosine', 'Tryptophan', 'Arachidonic acid'], { explanation: 'Adrenal, p. 7.' }),
  mcq('q5-06', 'cortisol-actions', 'What does cortisol do to protein?', 'Accelerates its breakdown and inhibits its synthesis', ['Builds muscle protein, like testosterone', 'Has no effect on protein metabolism', 'Increases collagen formation in the skin'], { explanation: 'Adrenal, p. 8.' }),
  mcq('q5-07', 'cortisol-actions', 'Why does long-term cortisol excess thin the skin?', 'It inhibits collagen synthesis', ['It causes dehydration of the skin', 'It lowers blood pressure in the skin', 'It raises plasma calcium'], { explanation: 'Adrenal, p. 9.', skill: 'cause-effect' }),
  mcq('q5-08', 'cortisol-actions', 'How does cortisol favour osteoporosis?', 'It inhibits bone formation and reduces calcium absorption by antagonising vitamin D', ['It stimulates osteoblasts to lay down excess, brittle bone', 'It raises PTH only, without any direct effect on bone', 'It increases calcitonin, which removes calcium from bone'], { explanation: 'Adrenal, pp. 9–10.' }),
  multi('q5-09', 'cortisol-actions', 'Cortisol is required for… Select all that apply.', ['Normal blood pressure', 'Rapid excretion of a water load', 'Vascular responsiveness to catecholamines'], ['Milk ejection'], { explanation: 'Adrenal, pp. 8–9.' }),
  mcq('q5-10', 'aldosterone-raas', 'Where does aldosterone mainly act?', 'Distal tubules and collecting ducts', ['Proximal convoluted tubule', 'Loop of Henle only', 'Glomerulus'], { explanation: 'Adrenal, p. 12.' }),
  multi('q5-11', 'aldosterone-raas', 'What does aldosterone do in the kidney? Select all that apply.', ['Increases Na⁺ reabsorption', 'Increases K⁺ secretion', 'Increases H⁺ secretion'], ['Increases K⁺ reabsorption'], { explanation: 'Adrenal, p. 12.' }),
  mcq('q5-12', 'aldosterone-raas', 'Where is angiotensin-converting enzyme found mainly?', 'In the lungs', ['In the liver', 'In the kidney', 'In the adrenal'], { explanation: 'Adrenal, p. 13.' }),
  mcq('q5-13', 'aldosterone-raas', 'Angiotensinogen is released by the…', 'Liver', ['Kidney', 'Lungs', 'Adrenal cortex'], { explanation: 'Adrenal, p. 13.' }),
  multi('q5-14', 'adrenal-disorders', 'Which are features of Addison’s disease? Select all that apply.', ['Hyponatraemia', 'Hyperkalaemia', 'Hypoglycaemia', 'Hyperpigmentation'], ['Hypertension'], { explanation: 'Adrenal, p. 15.', clinical: true }),
  mcq('q5-15', 'adrenal-disorders', 'According to the lecture, Cushing’s disease (rather than syndrome) is…', 'Secondary, due to ACTH or CRH', ['Primary, due to an adrenal tumour', 'Adrenal failure (Addison’s)', 'Excess aldosterone (Conn’s)'], { explanation: 'Adrenal, p. 16.', skill: 'terminology' }),
  multi('q5-16', 'adrenal-disorders', 'Which are features of Cushing’s? Select all that apply.', ['Moon face', 'Red stretch marks', 'High blood pressure', 'Impaired immunity'], ['Hyperkalaemia'], { explanation: 'Adrenal, pp. 16–17.', clinical: true }),
  multi('q5-17', 'adrenal-disorders', 'Conn’s syndrome causes… Select all that apply.', ['Hypertension', 'Hypokalaemia', 'Metabolic alkalosis'], ['Hyperkalaemia', 'Hypotension'], { explanation: 'Adrenal, p. 18.', clinical: true }),
  mcq('q5-18', 'adrenal-disorders', 'Untreated hypoaldosteronism can end in…', 'Fatal shock, from sodium loss and low plasma volume', ['Hypertensive crisis from fluid overload', 'Tetany from low plasma calcium', 'Gigantism'], { explanation: 'Adrenal, p. 19.' }),
  mcq('q5-19', 'adrenal-medulla', 'The adrenal medulla mainly secretes…', 'Adrenaline', ['Noradrenaline', 'Dopamine', 'Cortisol'], { explanation: 'Adrenal, p. 20.' }),
  multi('q5-20', 'adrenal-medulla', 'Which stimulate the adrenal medulla? Select all that apply.', ['Haemorrhage', 'Hypoglycaemia', 'Severe exercise', 'Pain'], ['Sleep'], { explanation: 'Adrenal, p. 20.' }),
];

const lesson6: Q[] = [
  mcq('q6-01', 'islets', 'Glucagon is secreted by which islet cells?', 'α cells', ['β cells', 'δ cells', 'F cells'], { explanation: 'Pancreas, p. 2.' }),
  mcq('q6-02', 'islets', 'δ cells secrete…', 'Somatostatin', ['Insulin', 'Glucagon', 'Pancreatic polypeptide'], { explanation: 'Pancreas, p. 2.' }),
  mcq('q6-03', 'insulin-synthesis', 'The A and B chains of insulin are linked by…', 'Disulphide bonds', ['Peptide bonds only', 'Hydrogen bonds', 'Glycosidic bonds'], { explanation: 'Pancreas, p. 3.' }),
  order('q6-04', 'insulin-synthesis', 'Order insulin synthesis.', ['Preprohormone', 'Proinsulin', 'Insulin + connecting peptide'], { explanation: 'Pancreas, p. 3.' }),
  mcq('q6-05', 'insulin-synthesis', 'What is the half-life of insulin?', '5–8 minutes', ['5–8 hours', '1 day', 'About 30 seconds'], { explanation: 'Pancreas, p. 5.' }),
  multi('q6-06', 'insulin-secretion', 'Which stimulate insulin secretion? Select all that apply.', ['Glucose', 'Amino acids', 'Vagal activity', 'Sulphonylureas'], ['Somatostatin', 'α-adrenergic stimulation'], { explanation: 'Pancreas, p. 6.' }),
  multi('q6-07', 'insulin-secretion', 'Which inhibit insulin secretion? Select all that apply.', ['Somatostatin', 'β-blockers', 'Exercise', 'K⁺ depletion'], ['Secretin'], { explanation: 'Pancreas, p. 6.' }),
  multi('q6-08', 'insulin-actions', 'Insulin stimulates… Select all that apply.', ['Glycogen synthesis', 'Glycolysis', 'Triacylglycerol synthesis', 'Protein synthesis'], ['Gluconeogenesis', 'Lipolysis'], { explanation: 'Pancreas, pp. 7–9.' }),
  mcq('q6-09', 'insulin-actions', 'What does insulin do to plasma K⁺?', 'Lowers it, by moving K⁺ into cells', ['Raises it, by releasing K⁺ from cells', 'No effect on plasma K⁺', 'Excretes it in the urine'], { explanation: 'Pancreas, p. 10: it stimulates Na⁺/K⁺-ATPase.' }),
  mcq('q6-10', 'insulin-actions', 'Insulin stimulates which enzyme in endothelial cells?', 'Lipoprotein lipase', ['Hormone-sensitive lipase', 'Glycogen phosphorylase', 'Pyruvate carboxylase'], { explanation: 'Pancreas, p. 8.' }),
  multi('q6-11', 'diabetes', 'Which are classic symptoms of diabetes mellitus? Select all that apply.', ['Polyuria', 'Polydipsia', 'Polyphagia', 'Glycosuria'], ['Oliguria'], { explanation: 'Pancreas, p. 15.' }),
  multi('q6-12', 'diabetes', 'Which are ketone bodies? Select all that apply.', ['Acetoacetate', 'Acetone', 'β-hydroxybutyrate'], ['Lactate', 'Pyruvate'], { explanation: 'Pancreas, p. 14.' }),
  mcq('q6-13', 'diabetes', 'Why does glucose appear in the urine in diabetes?', 'Blood glucose exceeds the renal tubular maximum', ['The glomerulus is damaged and leaks glucose', 'Insulin is excreted and carries glucose with it', 'ADH is lacking, so glucose is not reabsorbed'], { explanation: 'Pancreas, p. 15.', skill: 'cause-effect' }),
  mcq('q6-14', 'diabetes', 'Why do diabetics have lower resistance to infection?', 'Reduced protein synthesis, and sugary blood is a good culture medium', ['Too much insulin suppresses the white cells', 'High blood pressure damages the skin barrier', 'Hypokalaemia weakens the immune cells'], { explanation: 'Pancreas, p. 12.' }),
  multi('q6-15', 'diabetes', 'Which are causes of coma in diabetes? Select all that apply.', ['Acidosis', 'Hyperosmolality', 'Lactic acidosis', 'Cerebral oedema'], ['Hypercalcaemia'], { explanation: 'Pancreas, p. 18.' }),
  multi('q6-16', 'diabetes', 'Which describe type 1 diabetes? Select all that apply.', ['Juvenile onset', 'Lack of insulin', 'Ketosis'], ['Normal insulin levels', 'Usually obese, over 40'], { explanation: 'Pancreas, p. 19.' }),
  mcq('q6-17', 'diabetes', 'In type 2 diabetes, weight loss helps because…', 'It increases insulin receptor sites', ['It raises insulin secretion tenfold', 'It removes ketones', 'It lowers glucagon to zero'], { explanation: 'Pancreas, p. 19.' }),
  mcq('q6-18', 'hypoglycaemia', 'A tumour of the islets that secretes insulin is an…', 'Insulinoma', ['Glucagonoma', 'Adenoma of the pituitary', 'Phaeochromocytoma'], { explanation: 'Pancreas, p. 21.', skill: 'terminology' }),
  multi('q6-19', 'hypoglycaemia', 'Which are effects of hypoglycaemia? Select all that apply.', ['Confusion', 'Dizziness', 'Hunger', 'Sweating'], ['Polyuria'], { explanation: 'Pancreas, pp. 21–22.', clinical: true }),
  multi('q6-20', 'glucagon', 'Glucagon is… Select all that apply.', ['Gluconeogenic', 'Lipolytic', 'Ketogenic'], ['Glycogen-storing'], { explanation: 'Pancreas, p. 28.' }),
  multi('q6-21', 'glucagon', 'Which stimulate glucagon? Select all that apply.', ['Low glucose', 'Exercise', 'Amino acids', 'Cortisol'], ['α-adrenergic stimulation'], { explanation: 'Pancreas, p. 28.' }),
];

const lesson7: Q[] = [
  mcq('q7-01', 'calcium-roles', 'What is the normal plasma calcium range given in the lecture?', '2.16–2.65 mmol/L', ['1.0–1.5 mmol/L', '3.5–5.0 mmol/L', '135–145 mmol/L'], { explanation: 'Calcium, p. 2.' }),
  mcq('q7-02', 'calcium-roles', 'Why does hypocalcaemia make nerves excitable?', 'It increases neuronal membrane permeability to Na⁺', ['It blocks the K⁺ channels of the neurons', 'It raises the threshold for firing', 'It destroys the myelin sheath'], { explanation: 'Calcium, p. 3.', skill: 'cause-effect' }),
  multi('q7-03', 'calcium-roles', 'Which are features of hypercalcaemia? Select all that apply.', ['Sluggish reflexes', 'Muscle weakness', 'Lack of appetite'], ['Tetany', 'Convulsions'], { explanation: 'Calcium, p. 4.' }),
  multi('q7-04', 'calcium-roles', 'Which tests show latent tetany? Select all that apply.', ['Chvostek’s sign', 'Trousseau’s sign'], ['Babinski sign', 'Romberg test'], { explanation: 'Calcium, p. 3.' }),
  mcq('q7-05', 'calcium-handling', 'Calcitonin is secreted by…', 'Parafollicular cells of the thyroid', ['Chief cells of the parathyroid', 'Follicular cells of the thyroid', 'Juxtaglomerular cells of the kidney'], { explanation: 'Calcium, p. 5.' }),
  mcq('q7-06', 'calcium-handling', 'Which inhibit calcium absorption from the gut?', 'Phosphates and oxalates', ['Vitamin D (calcitriol)', 'Dietary proteins', 'Parathyroid hormone'], { explanation: 'Calcium, p. 6.' }),
  mcq('q7-07', 'bone', 'High alkaline phosphatase is associated with the activity of…', 'Osteoblasts', ['Osteoclasts', 'Osteocytes', 'Chondrocytes'], { explanation: 'Calcium, p. 8.' }),
  match('q7-08', 'bone', 'Match each bone cell to its role.', [
    ['Osteoblast', 'Forms bone, secreting collagen that calcifies'],
    ['Osteoclast', 'Erodes and absorbs bone'],
    ['Osteocyte', 'Transfers Ca²⁺ from bone interior to the ECF'],
  ], { explanation: 'Calcium, p. 8.' }),
  match('q7-09', 'bone', 'Match each disorder to its problem.', [
    ['Osteopetrosis', 'Defective osteoclasts — denser bone'],
    ['Osteoporosis', 'Loss of bone matrix'],
    ['Osteomalacia', 'Loss of mineralisation'],
  ], { explanation: 'Calcium, p. 10.' }),
  mcq('q7-10', 'bone', 'Bone matrix is made of which collagen?', 'Type 1', ['Type 2', 'Type 3', 'Type 4'], { explanation: 'Calcium, p. 7.' }),
  mcq('q7-11', 'vitamin-d', 'The major source of vitamin D is…', 'Synthesis in the skin under UV light', ['Cow’s milk', 'Fish liver oil', 'Synthesis in the liver'], { explanation: 'Calcium, p. 12.' }),
  mcq('q7-12', 'vitamin-d', 'Where is vitamin D 25-hydroxylated?', 'The liver', ['The kidney', 'The skin', 'The gut'], { explanation: 'Calcium, p. 13.' }),
  multi('q7-13', 'vitamin-d', 'What does active vitamin D do? Select all that apply.', ['Increases intestinal absorption of Ca²⁺ and PO₄', 'Increases renal reabsorption of Ca²⁺', 'Mobilises Ca²⁺ and PO₄ from bone'], ['Lowers plasma calcium'], { explanation: 'Calcium, p. 14.' }),
  mcq('q7-14', 'vitamin-d', 'Vitamin D deficiency in children causes…', 'Rickets', ['Osteopetrosis', 'Osteomalacia', 'Gigantism'], { explanation: 'Calcium, p. 18.' }),
  fill('q7-15', 'vitamin-d', 'The inactive metabolite of vitamin D is 24,25-dihydroxy____.', ['cholecalciferol', 'Cholecalciferol'], { explanation: 'Calcium, p. 13.' }),
  mcq('q7-16', 'pth', 'How many parathyroid glands are there?', 'Four', ['Two', 'Six', 'One'], { explanation: 'Calcium, p. 15.' }),
  mcq('q7-17', 'pth', 'What does PTH do to plasma phosphate?', 'Lowers it', ['Raises it', 'No effect', 'Doubles it'], { explanation: 'Calcium, p. 15.' }),
  mcq('q7-18', 'pth', 'What controls PTH secretion?', 'Plasma calcium', ['TSH', 'ACTH', 'Plasma glucose'], { explanation: 'Calcium, p. 16.' }),
  mcq('q7-19', 'pth', 'A common cause of hypoparathyroidism is…', 'Thyroidectomy', ['Vitamin D excess', 'A parathyroid tumour', 'Renal failure'], { explanation: 'Calcium, p. 16.', clinical: true }),
  mcq('q7-20', 'calcitonin', 'How does calcitonin lower blood calcium?', 'Suppresses osteoclasts and increases urinary calcium', ['Stimulates osteoclasts to resorb bone', 'Increases calcium absorption from the gut', 'Activates vitamin D in the kidney'], { explanation: 'Calcium, p. 19.' }),
  tf({ id: 'q7-21', conceptId: 'calcitonin', statement: 'Calcitonin and PTH have the same effect on blood calcium.', answer: false, explanation: 'Calcium, p. 19: calcitonin opposes PTH.', skill: 'misconception' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7];

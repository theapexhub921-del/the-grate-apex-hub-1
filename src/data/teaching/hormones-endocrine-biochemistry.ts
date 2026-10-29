import type { Teaching } from '@/data/teaching/types';

export const teaching: Teaching = {
  'hormones-endocrine-biochemistry-1': {
    0: [
      'The body has two great systems for coordinating its cells. The nervous system sends fast, targeted electrical signals along nerves. The endocrine system sends chemical messages, hormones, through the blood; these act more slowly but can reach every cell and their effects can last much longer. The two systems are closely linked, with the brain controlling much of the endocrine system through the hypothalamus.',
      'The endocrine glands are scattered through the body. In the brain lie the hypothalamus, which links the nervous and endocrine systems, the pituitary gland beneath it, with its anterior and posterior parts, and the pineal gland, which helps regulate daily rhythms. In the neck lie the thyroid and the four small parathyroid glands, and in the chest the thymus, important for the immune system in childhood.',
      'In the abdomen lie the adrenal glands, on top of the kidneys, and the islets of the pancreas, which make insulin and glucagon. Finally, the gonads, the ovaries in women and the testes in men, make the sex hormones. Each gland makes particular hormones, and together they control almost every aspect of the body’s function.',
    ],
    1: [
      'A hormone is a chemical messenger. It is made by a ductless (endocrine) gland, which releases it not into a duct but into the fluid around its cells, from where it enters the blood. The blood carries it around the body, and it regulates the activity of cells in other tissues and organs. For this reason, endocrine glands have a very rich blood supply.',
      'Not all hormones come from dedicated endocrine glands. Some organs have both endocrine and exocrine parts: the pancreas makes digestive enzymes, released through ducts, and hormones, released into the blood; the gonads make gametes as well as hormones. Many other organs that are not usually thought of as glands also make hormones: the stomach and small intestine make gut hormones, and the kidney makes erythropoietin and renin.',
      'Fat (adipose) tissue is now recognised as an endocrine organ too, although it is usually left out of drawings of the endocrine system. It releases hormones, such as leptin, that affect appetite, metabolism and inflammation, so it helps control the body’s energy balance and contributes to diseases such as type 2 diabetes. White adipose tissue stores energy, while brown adipose tissue burns it to produce heat.',
    ],
    2: [
      'A hormone circulates throughout the body, reaching almost every tissue, yet it affects only certain cells, its target cells. The reason is that only the target cells have receptors for that hormone: proteins that recognise and bind it specifically, like a lock that accepts only one key. A cell without the receptor simply ignores the hormone.',
      'The distribution of receptors determines how widespread a hormone’s effects are. Receptors for ACTH are found mainly on cells of the adrenal cortex, so ACTH acts almost only there. Receptors for thyroid hormone are found on nearly all cells, so thyroid hormone affects the metabolism of the whole body.',
      'The strength of a target cell’s response depends on three things. First, the level of the hormone in the blood: more hormone means more binding. Second, the number of receptors the cell has: a cell can increase or decrease its receptors, becoming more or less sensitive. Third, the affinity of the receptor, how tightly it holds the hormone. Changes in any of these can alter the response; for example, in some forms of type 2 diabetes, insulin levels are high but the response is weak because the receptor system works poorly.',
    ],
    3: [
      'Hormones control and coordinate several major processes in the body. Reproduction depends on hormones, for example the sex hormones, and the pituitary hormones FSH and LH, which control the ovaries and testes.',
      'Growth and development are controlled by hormones such as growth hormone and thyroid hormone, which are essential for normal growth in children. Hormones also mobilise the body’s defences against stress: in an emergency, adrenaline and cortisol raise blood glucose and blood pressure and prepare the body for action.',
      'Hormones maintain the balance of water, salts and nutrients: aldosterone and antidiuretic hormone control salt and water; parathyroid hormone controls calcium. And hormones regulate metabolism and energy balance: insulin and glucagon control blood glucose, and thyroid hormone controls the rate of metabolism.',
    ],
  },
  'hormones-endocrine-biochemistry-2': {
    0: [
      'Hormones can be grouped by their chemical structure, and this classification is useful because structure determines how a hormone travels in the blood and how it acts on its target cells.',
      'Many hormones are proteins or peptides, chains of amino acids. Some are large proteins, such as growth hormone, prolactin, insulin and parathyroid hormone. Some are glycoproteins, proteins with sugar chains attached, such as FSH, LH and TSH. Others are shorter polypeptides, such as oxytocin, antidiuretic hormone, calcitonin and glucagon.',
      'Some hormones are derived from single amino acids, mostly tyrosine: adrenaline (epinephrine) and noradrenaline (norepinephrine), and the thyroid hormones thyroxine and tri-iodothyronine. Others are derived from lipids: the steroid hormones, made from cholesterol, including oestrogen, progestins, testosterone, cortisol and aldosterone; and eicosanoids, made from fatty acids, such as leukotrienes and thromboxanes.',
      'As a general rule, protein, peptide and catecholamine hormones are water-soluble and cannot cross cell membranes, so they act on receptors on the cell surface; steroid and thyroid hormones are fat-soluble, cross membranes and act on receptors inside the cell.',
    ],
    1: [
      'When a hormone reaches its target cell and binds its receptor, it changes the cell’s activity in one or more ways. It may change the permeability or electrical state of the cell membrane, by opening or closing ion channels. It may make the cell produce new proteins, such as enzymes or other regulatory molecules, by switching genes on or off.',
      'It may activate or deactivate enzymes that are already present, for example by adding or removing phosphate groups. It may make the cell secrete something, such as another hormone. And it may stimulate the cell to divide (mitosis).',
      'These effects are produced by two main mechanisms. Water-soluble hormones, which cannot enter the cell, bind receptors on the surface and act through intracellular messengers called second messengers, often via G proteins. Fat-soluble hormones, such as steroids, enter the cell and act directly on its genes. The next sections describe both.',
    ],
    2: [
      'Water-soluble hormones face a problem: they cannot cross the cell membrane, yet they need to change what happens inside. The solution is a relay. The hormone, the first messenger, binds a receptor on the outside of the cell, and this triggers the production of a second messenger inside the cell, which carries the signal onwards.',
      'The best known second messenger is cyclic AMP (cAMP). Its production involves three components in the membrane. The receptor binds the hormone. A G protein, a protein that binds GTP, relays the signal: when the hormone binds, the G protein swaps GDP for GTP and becomes active, and it switches on the third component, the enzyme adenylate cyclase. Adenylate cyclase converts ATP into cAMP. The G protein has a built-in timer: it slowly splits its GTP into GDP and phosphate, which switches it off, so the signal stops when the hormone leaves.',
      'Inside the cell, cAMP activates protein kinase A, an enzyme that adds phosphate groups to other proteins. Phosphorylation changes their activity, producing the cell’s response: activating enzymes, triggering secretion, changing membrane permeability or switching on genes. The cascade amplifies the signal enormously, since each step activates many molecules. Many hormones use cAMP, including ACTH, FSH, LH, TSH, parathyroid hormone, glucagon, calcitonin and the catecholamines acting on β receptors. Some receptors are linked to inhibitory G proteins, which switch adenylate cyclase off instead.',
    ],
    3: [
      'A second major messenger system uses molecules made from a membrane phospholipid. When the hormone binds its receptor, a G protein activates a different enzyme, phospholipase C. This enzyme splits a phospholipid in the membrane, phosphatidylinositol bisphosphate (PIP₂), into two parts, and each part is a second messenger.',
      'One part, diacylglycerol (DAG), stays in the membrane, where it activates protein kinase C, which phosphorylates proteins and changes their activity. The other part, inositol trisphosphate (IP₃), is water-soluble and diffuses into the cytoplasm, where it opens calcium channels in the endoplasmic reticulum, releasing stored calcium.',
      'The calcium acts as a further messenger. It can directly change the activity of enzymes and ion channels, or it can bind to calmodulin, a calcium-binding protein, which then activates many enzymes. Hormones using this system include the catecholamines acting on α₁ receptors, thyrotropin-releasing hormone, antidiuretic hormone (on blood vessels), gonadotropin-releasing hormone and oxytocin.',
    ],
  },
  'hormones-endocrine-biochemistry-3': {
    0: [
      'Steroid hormones are all made from cholesterol, and they share its four-ring structure, which makes them fat-soluble. They fall into two functional groups, made in different glands.',
      'The sex hormones, made mainly by the gonads, include androgens (such as testosterone), oestrogens and progestins (such as progesterone). They control sexual development and reproductive function.',
      'The corticosteroids are made by the adrenal cortex. Mineralocorticoids, chiefly aldosterone, control the balance of salts in the body fluids: aldosterone makes the kidney retain sodium and excrete potassium. When it is lacking, the kidney loses sodium and retains potassium, so blood sodium falls and potassium rises. Glucocorticoids, chiefly cortisol in humans, control metabolism: they promote the breakdown of protein and the making of glucose from it (gluconeogenesis) and glycogen storage, raising blood glucose, and they suppress inflammation, which is why they are used as anti-inflammatory drugs.',
      'Steroid hormones are inactivated mainly in the liver, which attaches groups such as sulphate or glucuronic acid to make them water-soluble, and they are then excreted in the urine.',
    ],
    1: [
      'The adrenal cortex makes its steroid hormones from cholesterol, which it either makes itself from acetyl-CoA or takes up from the blood in LDL particles made by the liver.',
      'The first step, which occurs in the mitochondria, cuts off most of cholesterol’s side chain, turning it into pregnenolone. This is the rate-limiting step for all steroid hormones, and it is where their production is controlled: ACTH from the pituitary stimulates it in the inner zones of the cortex, and angiotensin stimulates it in the outer zone. Pregnenolone is then converted to progesterone, a step shared by the pathways to both cortisol and aldosterone.',
      'What happens next depends on which enzymes each zone of the cortex has. The middle zone (fasciculata) and inner zone (reticularis) have the enzyme 17-hydroxylase. They add hydroxyl groups to progesterone at positions 17, 21 and 11, making cortisol. The outer zone (glomerulosa) lacks 17-hydroxylase, so it cannot make cortisol. Instead, it adds hydroxyl groups at positions 21, 11 and 18, making aldosterone.',
      'This explains why each zone makes its own hormone: the differences come down to which hydroxylase enzymes each zone contains. It also explains certain inherited disorders: if one of the hydroxylases is missing, the precursors before the block pile up and are diverted into other products.',
    ],
    2: [
      'Steroid hormones act in a completely different way from peptide hormones. Because they are small and fat-soluble, they pass straight through the cell membrane by simple diffusion, so they do not need surface receptors or second messengers.',
      'Inside the cell, the steroid binds to its specific receptor protein. Some steroid receptors wait in the cytoplasm and move into the nucleus once they have bound the hormone; others are already in the nucleus. The hormone–receptor complex then binds to specific sequences of DNA in the chromatin, near particular genes.',
      'Binding switches the transcription of these genes on (or sometimes off). The resulting messenger RNA moves to the cytoplasm, where it directs the making of specific proteins, such as enzymes, which then produce the hormone’s effects.',
      'Because they work by making new proteins, steroid hormones act more slowly than peptide hormones, typically over hours, but their effects last longer.',
    ],
    3: [
      'The level of cortisol in the blood is kept steady by a feedback loop involving three glands: the hypothalamus, the anterior pituitary and the adrenal cortex, together called the hypothalamic–pituitary–adrenal (HPA) axis.',
      'When cortisol levels fall, the hypothalamus releases corticotropin-releasing factor (CRF) into small blood vessels leading to the anterior pituitary. CRF stimulates the pituitary to release ACTH into the general circulation. ACTH travels to the adrenal cortex and stimulates it to make and release cortisol.',
      'As cortisol rises, it acts back on the hypothalamus and pituitary, binding to their receptors and inhibiting the release of CRF and ACTH. This negative feedback lowers the stimulus to the adrenal cortex, so cortisol production falls back. ACTH also inhibits CRF release. The result is that cortisol is held near a set level.',
      'This loop explains some clinical observations. Patients who take steroid drugs for a long time suppress their own CRF and ACTH, so their adrenal glands shrink; if the drugs are stopped suddenly, they cannot make enough cortisol. Measuring ACTH also helps doctors tell whether a cortisol problem lies in the adrenal or the pituitary.',
    ],
  },
};

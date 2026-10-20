// Physiology → Reproductive Physiology — layer 1 (learn by answering) and
// reading-layer extras. Checkpoint IDs: cN-xx; recall prompts: rN-xx.
import type { LessonConfusion } from '@/data/lesson-types';
import { ask, learn, match, mcq, multi, order, recall, type InteractiveDraft } from '@/data/topics/build';
import { fe, ma, sr, type ConceptId } from '@/data/topics/reproductive-physiology/sources';

type Steps = InteractiveDraft<ConceptId>[];

export const interactive: Record<string, Steps> = {
  'reproductive-physiology-1': [
    ask(mcq('c1-01', 'male-organs', 'The testes have two functions. What are they?', 'Making sperm and making androgens', ['Making sperm and storing them until ejaculation', 'Making semen and the fructose that feeds sperm', 'Making FSH and LH for the pituitary'], { explanation: 'Male, slide 7: spermatogenesis and steroidogenesis.' })),
    learn('Inside the testis', ['Three tunics (vaginalis, albuginea, vasculosa). 250–300 lobules, each with 1–4 looped seminiferous tubules (~80 cm). Tubulus rectus → rete testis → efferent ductules → epididymis.'], { sourceRefs: ma([11, 12, 15]) }),
    ask(order('c1-02', 'testis-structure', 'Order the path of sperm out of the testis.', ['Seminiferous tubule', 'Tubulus rectus', 'Rete testis', 'Efferent ductules', 'Epididymis'], { explanation: 'Male, slide 15.' })),
    learn('Two cell types', ['Sertoli cells span the tubule wall and nurse germ cells; their tight junctions form the blood–testis barrier (basal and adluminal compartments). Leydig cells, between tubules, make testosterone from puberty.'], { sourceRefs: ma([18, 19, 20]) }),
    ask(mcq('c1-03', 'sertoli-leydig', 'What forms the blood–testis barrier?', 'Tight junctions between neighbouring Sertoli cells', ['Leydig cells in the interstitial tissue', 'The tunica albuginea around the testis', 'The pampiniform plexus of veins'], { explanation: 'Male, slides 18–19.' })),
    recall('r1-01', 'sertoli-leydig', 'Compare Sertoli and Leydig cells: where they are and what they do.', [
      'Sertoli cells: inside the seminiferous tubules, from basement membrane to lumen; surround and support developing germ cells.',
      'Their tight junctions form the blood–testis barrier, dividing the tubule into basal and adluminal compartments.',
      'Leydig cells: in the interstitial tissue between tubules; almost absent before puberty; produce testosterone.',
    ], ma([18, 19, 20])),
  ],
  'reproductive-physiology-2': [
    ask(mcq('c2-01', 'spermatogenesis', 'About how long does spermatogenesis take?', 'About 74 days', ['About 7 days', 'About 28 days', 'About a year'], { explanation: 'Male, slide 22.' })),
    learn('Three phases', ['Mitotic: type A spermatogonia renew themselves and make type B → primary spermatocytes. Meiotic: meiosis I → secondary spermatocytes; meiosis II → spermatids. Spermiogenic: Golgi, cap, acrosome and maturation phases.'], { sourceRefs: ma([22, 23, 24, 25]) }),
    ask(order('c2-02', 'spermatogenesis', 'Order the cells of spermatogenesis.', ['Type A spermatogonium', 'Type B spermatogonium', 'Primary spermatocyte', 'Secondary spermatocyte', 'Spermatid', 'Spermatozoon'], { explanation: 'Male, slides 22–25.' })),
    ask(match('c2-03', 'sperm-structure', 'Match each part of the sperm to its content.', [
      ['Head', 'Nucleus and acrosome'],
      ['Midpiece', 'Helical mitochondria'],
      ['Tail', 'Microtubules'],
    ], { explanation: 'Male, slides 28–29.' })),
    learn('Capacitation', ['Fresh sperm can barely fertilise. In the female tract over 5–7 hours they lose seminal proteins, reorganise their membranes, take in Ca²⁺, raise cAMP and lower pH — then show hyperactivated motility and can undergo the acrosome reaction.'], { sourceRefs: ma([42, 43]) }),
    ask(mcq('c2-04', 'capacitation', 'Where does capacitation happen?', 'In the female reproductive tract', ['In the epididymis, during storage', 'In the seminiferous tubules', 'In the prostate, during ejaculation'], { explanation: 'Male, slide 42. Maturation and motility develop in the epididymis.' })),
    recall('r2-01', 'spermatogenesis', 'Describe the three phases of spermatogenesis.', [
      'Proliferative: type A spermatogonia divide by mitosis to renew themselves and form type B spermatogonia, which become primary spermatocytes.',
      'Meiotic: meiosis I gives two haploid secondary spermatocytes; meiosis II gives round spermatids. Cells stay linked by intercellular bridges.',
      'Spermiogenic: spermatids become sperm (Golgi, cap, acrosome, maturation phases); spermiation releases them into the lumen.',
    ], ma([22, 23, 24, 25])),
  ],
  'reproductive-physiology-3': [
    ask(mcq('c3-01', 'spermatogenesis-hormones', 'Once spermatogenesis has started, which hormone alone can maintain it?', 'Testosterone', ['FSH (with LH)', 'Inhibin B', 'Prolactin'], { explanation: 'Male, slide 33: FSH is needed to start it.' })),
    learn('Sertoli products', ['Under FSH, Sertoli cells make inhibin (feeds back to cut FSH), activin (boosts FSH) and androgen-binding protein, which keeps testosterone 20–50 times higher than in blood.'], { sourceRefs: ma([31, 32]) }),
    ask(mcq('c3-02', 'testis-temperature', 'In a cold room the testes are drawn up towards the body. Which muscle does this?', 'Cremaster', ['Dartos', 'Bulbospongiosus', 'Detrusor'], { explanation: 'Male, slide 38: the cremaster raises the testes to warm them; the dartos changes scrotal surface area.', skill: 'application' })),
    learn('Semen in order', ['Cowper’s glands first (< 5%, mucus), then prostate (~30%: alkaline, zinc, PSA, citric acid), then seminal vesicles (~60%: fructose, prostaglandins). Normal: 1.5–5 mL, pH 7.0–8.3, ≥ 15 million sperm/mL.'], { sourceRefs: ma([47, 48, 49, 50]) }),
    ask(mcq('c3-03', 'semen', 'Which gland supplies fructose, the sperm’s main energy source?', 'The seminal vesicles', ['The prostate', 'The bulbourethral glands', 'The epididymis'], { explanation: 'Male, slide 50.' })),
    recall('r3-01', 'testis-temperature', 'Explain how the testes are kept about 3 °C below body temperature.', [
      'Countercurrent heat exchange: the pampiniform plexus of veins cools blood in the testicular artery.',
      'The cremaster lowers or raises the testes.',
      'The dartos relaxes or contracts to change scrotal surface area.',
      'Scrotal sweat glands aid cooling.',
    ], ma([35, 38])),
  ],
  'reproductive-physiology-4': [
    ask(mcq('c4-01', 'testosterone-transport', 'Which fraction of plasma testosterone is the most biologically active?', 'The free fraction (1–2%)', ['The SHBG-bound fraction (65%)', 'The albumin-bound fraction (33%)', 'They are equally active'], { explanation: 'Male, slide 52.' })),
    learn('DHT', ['5α-reductase turns testosterone into DHT, which binds the same androgen receptor more tightly (3–10× potency) and cannot be aromatised, so its effects are purely androgenic.'], { sourceRefs: ma([55, 56]) }),
    ask(mcq('c4-02', 'testosterone-action', 'A child with male internal genitalia has ambiguous external genitalia, then virilises strongly at puberty. Which enzyme is likely deficient?', '5α-reductase', ['Aromatase', '21-hydroxylase', 'Carbonic anhydrase'], { explanation: 'Male, slides 56–57.', skill: 'application', clinical: true })),
    ask(multi('c4-03', 'androgen-effects', 'Which are effects of androgens? Select all that apply.', ['Deepening of the voice', 'Increased erythropoiesis', 'Increased muscle mass'], ['Higher HDL', 'Breast duct growth'], { explanation: 'Male, slides 61–63: androgens lower HDL.' })),
    learn('When testosterone is lacking', ['Fetal: female, ambiguous or underdeveloped genitals. Before puberty: a eunuch — high voice, little muscle, long limbs, gynaecomastia. Adult: erectile dysfunction, infertility, less hair, more fat, osteoporosis.'], { sourceRefs: ma([68, 69, 70, 71]) }),
    ask(mcq('c4-04', 'testicular-disorders', 'Transabdominal descent of the testis depends on…', 'Insulin-like hormone 3 (INSL3)', ['Androgens (testosterone and DHT)', 'Estrogen from the placenta', 'Prolactin from the fetal pituitary'], { explanation: 'Male, slide 64: inguinoscrotal descent depends on androgens.' })),
    recall('r4-01', 'testicular-disorders', 'Describe how the features of male hypogonadism depend on when it begins.', [
      'Fetal: impaired external genital growth — female, ambiguous or underdeveloped genitals.',
      'Before puberty (eunuch): poor muscle, high-pitched voice, little body hair, small penis and testes, long arms and legs, gynaecomastia, female shape.',
      'Adult: erectile dysfunction, infertility, less beard and body hair, more fat, smaller testes, less muscle, gynaecomastia, osteoporosis.',
    ], ma([67, 68, 69, 70, 71])),
  ],
  'reproductive-physiology-5': [
    ask(mcq('c5-01', 'oogenesis', 'At what stage do primary oocytes wait from fetal life until puberty?', 'Prophase of meiosis I', ['Metaphase of meiosis II', 'Interphase before mitosis', 'Anaphase of meiosis I'], { explanation: 'Female, slides 8–9.' })),
    learn('Numbers fall', ['About 7 million oogonia at 24 weeks → about 2 million primary oocytes at birth → about 400,000 at puberty → only 400–500 ever ovulate.'], { sourceRefs: fe([8, 9]) }),
    ask(mcq('c5-02', 'oogenesis', 'When does the secondary oocyte complete meiosis II?', 'Only if it is fertilised', ['Just before ovulation, with the LH surge', 'At puberty, when cycles begin', 'In fetal life, before birth'], { explanation: 'Female, slides 10–11.' })),
    ask(order('c5-03', 'ovarian-cycle', 'Order the stages of follicle development.', ['Primordial follicle', 'Primary follicle', 'Preantral (secondary) follicle', 'Antral follicle', 'Graafian follicle'], { explanation: 'Female, slides 14–17.' })),
    learn('After ovulation', ['The ruptured follicle fills with blood (corpus haemorrhagicum), then lutein cells form the corpus luteum, an endocrine unit. Without implantation it becomes the corpus albicans in 14 days.'], { sourceRefs: fe([19, 20]) }),
    recall('r5-01', 'oogenesis', 'Trace oogenesis from the fetal oogonium to the ovum.', [
      'Oogonia (46 chromosomes) grow into primary oocytes, which start meiosis I and arrest in prophase until puberty.',
      'Each month a dominant primary oocyte completes meiosis I: a secondary oocyte and a first polar body.',
      'The secondary oocyte begins meiosis II and arrests in metaphase before ovulation.',
      'Meiosis II completes only at fertilisation, giving the ovum and a second polar body; polar bodies degenerate.',
    ], fe([8, 9, 10, 11])),
  ],
  'reproductive-physiology-6': [
    ask(mcq('c6-01', 'uterine-cycle', 'Which phase of the uterine cycle has a constant length of 14 days?', 'The secretory phase', ['The proliferative phase', 'The menstrual phase', 'The premenstrual phase'], { explanation: 'Female, slide 26. Variation in cycle length comes from the follicular/proliferative phase.' })),
    learn('Two arteries', ['The stratum functionale, supplied by long coiled spiral arteries, is shed; the stratum basale, with short straight basilar arteries, stays to regrow the lining.'], { sourceRefs: fe([23]) }),
    ask(mcq('c6-02', 'cyclic-changes', 'Cervical mucus at ovulation is…', 'Clear, watery and elastic, forming ferns when dried', ['Thick, pasty and sticky, with no ferning', 'Absent from the cervical canal', 'Full of leucocytes, cloudy and scanty'], { explanation: 'Female, slides 31–32: estrogen; progesterone thickens it.' })),
    learn('The surge', ['Estrogen first inhibits FSH and LH, but when high it switches to positive feedback: more GnRH pulses and an LH surge 34–36 hours before ovulation.'], { sourceRefs: fe([38, 39]) }),
    ask(mcq('c6-03', 'hpo-axis', 'Which cells make androgens that granulosa cells then aromatise to estradiol?', 'Theca cells, under LH', ['Granulosa cells, under FSH', 'Corpus albicans cells', 'Leydig cells'], { explanation: 'Female, slide 37.' })),
    ask(mcq('c6-04', 'hpo-axis', 'In early pregnancy, what keeps the corpus luteum alive?', 'hCG from the trophoblast', ['FSH from the pituitary', 'Prolactin from the decidua', 'Oxytocin from the ovary'], { explanation: 'Female, slide 40.' })),
    recall('r6-01', 'hpo-axis', 'Explain the hormonal events that lead to ovulation.', [
      'Pulsatile GnRH releases FSH and LH, which grow the follicles.',
      'LH makes theca cells produce androgens; FSH makes granulosa cells aromatise them to estradiol.',
      'Rising estrogen and inhibin first inhibit FSH and LH (negative feedback).',
      'High estrogen then has positive feedback: an LH surge 34–36 h before ovulation completes meiosis I and triggers rupture.',
    ], fe([36, 37, 38, 39])),
  ],
  'reproductive-physiology-7': [
    ask(mcq('c7-01', 'menstrual-disorders', 'A woman has not had a period for 4 months; she is not pregnant or breastfeeding but has lost a lot of weight. What is this?', 'Secondary amenorrhoea', ['Primary amenorrhoea', 'Menorrhagia (heavy periods)', 'Dysmenorrhoea'], { explanation: 'Female, slides 47–48.', skill: 'application', clinical: true })),
    learn('Definitions', ['Oligomenorrhoea: cycles > 36 days. Polymenorrhoea: < 21 days. Menorrhagia: heavy bleeding. Dysmenorrhoea: painful, from prostaglandins.'], { sourceRefs: fe([49, 50, 51]) }),
    ask(mcq('c7-02', 'estrogens', 'Which is the most abundant and potent natural estrogen?', '17β-estradiol', ['Estrone (E1)', 'Estriol', 'Progesterone'], { explanation: 'Female, slide 52.' })),
    ask(match('c7-03', 'progestins', 'Match each hormone to an effect on the uterus.', [
      ['Estrogen', 'Excites the myometrium'],
      ['Progesterone', 'Decreases myometrial excitability'],
      ['Relaxin', 'Inhibits uterine contraction and helps dilate the cervix'],
    ], { explanation: 'Female, slides 56, 60–62.' })),
    recall('r7-01', 'estrogens', 'Compare the effects of estrogen and progesterone on the breast, uterus and body.', [
      'Breast: estrogen grows the ducts; progesterone grows the lobules and alveoli.',
      'Uterus: estrogen grows the endometrium and excites the myometrium; progesterone gives secretory changes and quiets the myometrium.',
      'Body: estrogen inhibits bone resorption, lowers cholesterol and retains salt and water; progesterone is thermogenic and in large doses natriuretic.',
    ], fe([55, 56, 60, 61])),
  ],
  'reproductive-physiology-8': [
    ask(mcq('c8-01', 'puberty', 'What is usually the first sign of puberty in girls?', 'Breast development (thelarche)', ['The first menstrual period (menarche)', 'Pubic hair (pubarche)', 'Acne on the face'], { explanation: 'Sexual Response, slide 4: menarche usually comes last.' })),
    learn('The trigger', ['Kisspeptin acting on its receptor GPR54 in the hypothalamus changes GnRH release, which drives LH and FSH. Leptin from fat may signal that the body is ready.'], { sourceRefs: sr([1, 2]) }),
    ask(mcq('c8-02', 'climacteric', 'In andropause, why does bioavailable testosterone fall faster than total testosterone?', 'SHBG rises and binds more testosterone', ['The testes stop working abruptly at about 50', 'Testosterone is converted to DHT in the prostate', 'LH secretion stops, so no testosterone is made'], { explanation: 'Sexual Response, slide 11.', skill: 'cause-effect' })),
    ask(order('c8-03', 'sexual-response', 'Order the phases of the human sexual response.', ['Excitement', 'Plateau', 'Orgasm', 'Resolution'], { explanation: 'Sexual Response, slide 23.' })),
    learn('Erection', ['Parasympathetic nervi erigentes release NO, which makes cGMP; VIP and PGE1 make cAMP. Both relax cavernous smooth muscle, the corpora fill and the veins are compressed. α-adrenergic activity ends it.'], { sourceRefs: sr([26, 27, 32, 34, 38]) }),
    ask(mcq('c8-04', 'erection', 'Which molecule is the principal mediator of erection?', 'Nitric oxide', ['Noradrenaline', 'Testosterone', 'Oxytocin'], { explanation: 'Sexual Response, slide 32.' })),
    recall('r8-01', 'erection', 'Explain the mechanism of penile erection and how it ends.', [
      'Stimulation is integrated in the sacral cord; parasympathetic fibres in the nervi erigentes reach the penis.',
      'NANC nerves (and endothelium via ACh → eNOS) release NO → guanylate cyclase → cGMP; VIP and PGE1 → cAMP.',
      'PKG/PKA lower intracellular Ca²⁺ (K⁺ channels open, Ca²⁺ channels blocked, Ca²⁺ stored), so cavernous smooth muscle relaxes; blood fills and venules are compressed.',
      'Erection ends with adrenergic activity: α1/α2 constriction and α2 inhibition of the vasodilator nerves.',
    ], sr([26, 27, 32, 33, 34, 35, 38])),
  ],
  'reproductive-physiology-9': [
    ask(mcq('c9-01', 'fertilisation', 'Where does fertilisation usually take place?', 'The ampulla of the uterine tube', ['The body of the uterus', 'The surface of the ovary, at ovulation', 'The isthmus of the cervix'], { explanation: 'Sexual Response, slide 40.' })),
    learn('Getting in', ['Hyperactivated motility and hyaluronidases carry the sperm through the cumulus. Binding to ZP3 on the zona triggers the acrosome reaction; the sperm crosses the zona and fuses with the oolemma.'], { sourceRefs: sr([41, 42]) }),
    ask(mcq('c9-02', 'fertilisation', 'How is polyspermy blocked?', 'The cortical reaction hardens the zona and destroys its sperm receptors', ['The acrosome reaction of the first sperm stops all the others', 'The cumulus cells close around the oocyte after one sperm enters', 'hCG released by the oocyte repels the other sperm'], { explanation: 'Sexual Response, slide 43.' })),
    ask(match('c9-03', 'implantation', 'Match each blastocyst part to what it becomes.', [
      ['Inner cell mass', 'The embryo'],
      ['Trophoblast', 'Helps form the placenta'],
    ], { explanation: 'Sexual Response, slide 49.' })),
    ask(mcq('c9-04', 'implantation', 'What prevents menstruation after implantation?', 'hCG from the chorionic villi maintaining the corpus luteum', ['Oxytocin released from the posterior pituitary', 'FSH from the pituitary keeping the ruptured follicle alive', 'Relaxin from the decidua holding the lining in place'], { explanation: 'Sexual Response, slide 54.' })),
    recall('r9-01', 'placenta', 'List the functions of the placenta.', [
      'Immunological: passive immunity; suppresses the mother’s immune response to the fetus.',
      'Endocrine: estrogen, progesterone, hCG, hCS/hPL, relaxin and others.',
      'Transport: gases, wastes, antibodies and nutrients, by concentration and electrical gradients.',
      'Metabolic: makes glycogen, cholesterol and fatty acids early in pregnancy.',
    ], sr([58, 59, 60, 61])),
  ],
  'reproductive-physiology-10': [
    ask(mcq('c10-01', 'parturition-hormones', 'Near term, how does the estrogen/progesterone balance change, and with what effect?', 'The effective estrogen/progesterone ratio rises, increasing uterine motility', ['Progesterone rises above estrogen, relaxing the uterus', 'Both hormones fall to zero, so the uterus is unopposed', 'Estrogen falls, which allows the uterus to contract'], { explanation: 'Sexual Response, slides 65–66.', skill: 'cause-effect' })),
    learn('A positive loop', ['The fetal head stretches the cervix → oxytocin → stronger contractions → more stretch, until the cervix is fully dilated.'], { sourceRefs: sr([74]) }),
    ask(mcq('c10-02', 'parturition-hormones', 'Which prostaglandin is essential for labour to progress?', 'PGF2α', ['PGE1', 'PGI2', 'Thromboxane A2'], { explanation: 'Sexual Response, slide 67. PGE2 may ripen the cervix.' })),
    ask(order('c10-03', 'lactation', 'Order the milk ejection reflex.', ['Suckling stimulates the areola', 'Paraventricular and supraoptic nuclei activated', 'Oxytocin released from the posterior pituitary', 'Myoepithelial cells contract', 'Milk expelled into the ducts'], { explanation: 'Sexual Response, slides 83–84.' })),
    ask(mcq('c10-04', 'milk-amenorrhoea', 'How does breastfeeding suppress ovulation?', 'β-endorphin inhibits GnRH and dopamine, so LH pulses fall and prolactin rises', ['Oxytocin released during suckling blocks the ovary directly', 'Breast milk contains estrogen that feeds back on the pituitary', 'FSH rises too high and exhausts the developing follicles'], { explanation: 'Sexual Response, slides 88–90.', skill: 'cause-effect' })),
    recall('r10-01', 'parturition-hormones', 'Explain how the fetal adrenal helps start labour.', [
      'Placental CRH rises at the end of gestation and stimulates the fetal adrenal axis (CRH, ACTH → cortisol, DHEAS).',
      'Adrenal steroids shift placental output to estrogen and away from progesterone, and stop placental inactivation of prostaglandins.',
      'More estrogen and less progesterone increase oxytocin receptors, oxytocin release and myometrial gap junctions → coordinated contractions.',
      'Cortisol also matures the fetal lungs.',
    ], sr([68, 69, 70])),
  ],
};

type ReadingExtras = { estimatedMinutes: number; xp: number; highYield: string[]; confusions: LessonConfusion[] };

export const readingExtras: Record<string, ReadingExtras> = {
  'reproductive-physiology-1': {
    estimatedMinutes: 8,
    xp: 25,
    highYield: ['Testes: sperm + androgens.', 'Tubules → tubulus rectus → rete testis → efferent ductules → epididymis.', 'Sertoli tight junctions = blood–testis barrier; Leydig cells = testosterone.'],
    confusions: [{ confusion: 'Leydig cells are inside the seminiferous tubules.', clarification: 'They lie in the interstitial tissue between the tubules; Sertoli cells are inside (Male, slides 18–20).' }],
  },
  'reproductive-physiology-2': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['~74 days; mitotic → meiotic → spermiogenic.', 'Midpiece mitochondria power swimming.', 'Capacitation: 5–7 h in the female tract.'],
    confusions: [{ confusion: 'Sperm are able to fertilise as soon as they are ejaculated.', clarification: 'They must first be capacitated in the female tract (Male, slide 42).' }],
  },
  'reproductive-physiology-3': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['FSH starts, testosterone maintains spermatogenesis.', 'ABP keeps testosterone 20–50× blood levels.', 'Seminal vesicles 60% (fructose), prostate 30% (alkaline, zinc).'],
    confusions: [{ confusion: 'The prostate makes most of the semen.', clarification: 'The seminal vesicles make about 60%; the prostate about 30% (Male, slides 48–49).' }],
  },
  'reproductive-physiology-4': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['65% SHBG, 33% loosely bound, 1–2% free.', 'DHT: 3–10× more potent, not aromatised.', 'Cryptorchidism: INSL3 then androgens.'],
    confusions: [{ confusion: 'DHT can be converted to estrogen.', clarification: 'DHT cannot be aromatised; its effects are purely androgenic (Male, slide 56).' }],
  },
  'reproductive-physiology-5': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['7 million → 2 million → 400,000 → 400–500 ovulate.', 'Meiosis I arrests in prophase; meiosis II in metaphase.', 'Corpus luteum → albicans in 14 days.'],
    confusions: [{ confusion: 'The ovum is released at ovulation.', clarification: 'A secondary oocyte arrested in metaphase II is released; it becomes an ovum only on fertilisation (Female, slides 10–11).' }],
  },
  'reproductive-physiology-6': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Secretory phase always 14 days.', 'LH surge 34–36 h before ovulation.', 'Temperature rises ~1 °C after ovulation (progesterone).'],
    confusions: [{ confusion: 'Estrogen only ever inhibits LH.', clarification: 'At high levels it switches to positive feedback and triggers the LH surge (Female, slide 38).' }],
  },
  'reproductive-physiology-7': {
    estimatedMinutes: 10,
    xp: 25,
    highYield: ['Primary amenorrhoea: no menarche by 15.', 'Estradiol most potent estrogen.', 'Dysmenorrhoea from prostaglandins.'],
    confusions: [{ confusion: 'Progesterone excites the uterus.', clarification: 'It decreases myometrial excitability; estrogen excites it (Female, slides 56, 60).' }],
  },
  'reproductive-physiology-8': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Kisspeptin–GPR54 triggers puberty.', 'Menopause: 12 months without a period.', 'Erection: NO → cGMP; ends via α-adrenergic activity.'],
    confusions: [{ confusion: 'Erection is a sympathetic response.', clarification: 'It is parasympathetic (nervi erigentes, NO); adrenergic activity ends it (Sexual Response, slides 26–38).' }],
  },
  'reproductive-physiology-9': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Fertilisation in the ampulla.', 'ZP3 binding → acrosome reaction; cortical reaction blocks polyspermy.', 'hCG maintains the corpus luteum.'],
    confusions: [{ confusion: 'The acrosome reaction blocks polyspermy.', clarification: 'The egg’s cortical reaction does; the acrosome reaction lets the sperm through the zona (Sexual Response, slides 42–43).' }],
  },
  'reproductive-physiology-10': {
    estimatedMinutes: 12,
    xp: 25,
    highYield: ['Oxytocin receptors rise > 100-fold.', 'Lactogenesis II ~40 h after birth.', 'β-endorphin → ↓GnRH, ↓dopamine (↑prolactin).'],
    confusions: [{ confusion: 'Prolactin ejects milk.', clarification: 'Prolactin maintains milk production; oxytocin ejects it (Sexual Response, slides 82–84).' }],
  },
};

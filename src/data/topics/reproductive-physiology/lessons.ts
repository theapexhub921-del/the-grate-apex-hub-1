// Physiology → Reproductive Physiology — the ten lessons (reading layer).
// Sources: the Male, Female and Sexual Response decks (ma, fe, sr in
// sources.ts). References name the deck: "Male, slide 22".
import type { LessonDraft } from '@/data/topics/build';
import { interactive, readingExtras } from '@/data/topics/reproductive-physiology/interactive';
import { withSimulation } from '@/data/topics/reproductive-physiology/simulations';
import { fe, ma, sr, type ConceptId } from '@/data/topics/reproductive-physiology/sources';

type Draft = LessonDraft<ConceptId>;

const lesson1: Draft = {
  id: 'reproductive-physiology-1',
  title: 'The Male Reproductive System and the Testis',
  description: 'The organs, ducts and glands of the male system, the structure of the testis, and its Sertoli and Leydig cells.',
  xp: 25,
  sourceRefs: ma([6, 7, 8, 11, 12, 15, 16, 18, 19, 20]),
  objectives: [
    'Explain why reproduction matters for the species but not the individual',
    'Name the primary organs, ducts, accessory glands and genitalia of the male',
    'Describe the tunics, lobules and seminiferous tubules of the testis',
    'Describe Sertoli cells, the blood–testis barrier and Leydig cells',
  ],
  chunks: [
    {
      title: 'Reproduction',
      kind: 'overview',
      paragraphs: [
        'Reproduction is the biological process by which new offspring are produced from their parents. It is a fundamental feature of all life — not essential for the survival of the individual, but essential for the survival of the species. The organs that work together for it make up the reproductive system, which differs between males and females (Male, slide 6).',
      ],
      sourceRefs: ma([6]),
    },
    {
      title: 'Parts of the male system',
      kind: 'structure',
      table: {
        columns: ['Part', 'Members', 'Role'],
        rows: [
          ['Primary organs', 'Testes', 'Dual function: sperm (spermatogenesis) and androgens (steroidogenesis)'],
          ['Ducts', 'Epididymis, ductus deferens, ejaculatory duct, urethra', 'Carry sperm from the testes to the exterior'],
          ['Accessory glands', 'Seminal vesicles, prostate, bulbourethral (Cowper’s) glands', 'Secretions that combine with sperm to make semen'],
          ['Genitalia', 'Scrotum and penis', 'External sex organs'],
        ],
      },
      sourceRefs: ma([7, 8]),
    },
    {
      title: 'The testis',
      kind: 'structure',
      paragraphs: [
        'The testis, the male gonad, lies in the scrotum and measures about 3.8 cm long and 2.5 cm wide. It is surrounded by three tunics (Male, slides 11–12):',
      ],
      terms: [
        { term: 'Tunica vaginalis', meaning: 'Serous covering derived from peritoneum, with visceral and parietal layers.' },
        { term: 'Tunica albuginea', meaning: 'Fibrous covering; its extensions divide the testis into 250–300 lobules.' },
        { term: 'Tunica vasculosa', meaning: 'Vascular layer — a plexus of vessels lining the inner tunica albuginea.' },
      ],
      steps: [
        { label: 'Seminiferous tubules', detail: '1–4 per lobule, each about 80 cm long and looped; sperm are made here.' },
        { label: 'Tubulus rectus' },
        { label: 'Rete testis', detail: 'A network of tubules.' },
        { label: 'Efferent ductules', detail: 'Carry sperm out of the testis into the epididymis.' },
      ],
      keyPoints: [
        'The testicular artery supplies the testis and epididymis; the veins drain into the pampiniform plexus, which forms the bulk of the spermatic cord. Lymph drains to the lumbar (aortic) nodes (slides 15–16).',
      ],
      sourceRefs: ma([11, 12, 15, 16]),
    },
    {
      title: 'Sertoli and Leydig cells',
      kind: 'structure',
      paragraphs: [
        'Seminiferous tubules contain germ cells at every stage of development and Sertoli (sustentacular) cells. Sertoli cells reach from the basement membrane to the lumen and wrap their processes around many spermatogenic cells (Male, slide 18).',
        'Tight junctions between neighbouring Sertoli cells near the base form the blood–testis barrier, which divides each tubule into a basal and an adluminal compartment (slides 18–19).',
        'Leydig cells lie in the interstitial tissue between the tubules. They are almost absent before puberty, when testosterone production begins, and they produce testosterone (slide 20).',
      ],
      sourceRefs: ma([18, 19, 20]),
    },
  ],
  summary: [
    'Reproduction: essential for the species, not the individual.',
    'Testes (sperm + androgens); ducts (epididymis, ductus deferens, ejaculatory duct, urethra); glands (seminal vesicles, prostate, Cowper’s); scrotum and penis.',
    'Testis ~3.8 × 2.5 cm; tunica vaginalis, albuginea (250–300 lobules) and vasculosa.',
    'Seminiferous tubules → tubulus rectus → rete testis → efferent ductules → epididymis. Pampiniform plexus.',
    'Sertoli cells: support germ cells; their tight junctions form the blood–testis barrier. Leydig cells: testosterone.',
  ],
};

const lesson2: Draft = {
  id: 'reproductive-physiology-2',
  title: 'Spermatogenesis and the Spermatozoon',
  description: 'The proliferative, meiotic and spermiogenic phases of spermatogenesis, the structure of a sperm, and how sperm mature and are capacitated.',
  xp: 25,
  sourceRefs: ma([22, 23, 24, 25, 28, 29, 41, 42, 43]),
  objectives: [
    'Describe the three phases of spermatogenesis and how long it takes',
    'Explain the role of intercellular bridges and spermiation',
    'Describe the head, midpiece and tail of a sperm',
    'Describe where sperm mature and are stored',
    'Explain capacitation and what it involves',
  ],
  chunks: [
    {
      title: 'Spermatogenesis',
      kind: 'pathway',
      paragraphs: [
        'Spermatogenesis is the development of spermatozoa from spermatogonia. It begins at puberty and continues throughout life, occurs in the seminiferous tubules and takes about 74 days (Male, slide 22).',
      ],
      steps: [
        { label: 'Proliferative (mitotic) phase', detail: 'Type A spermatogonia (stem cells on the basal lamina) divide by mitosis to renew themselves and to make type B spermatogonia, which divide again to form primary spermatocytes.' },
        { label: 'Meiotic phase', detail: 'Each primary spermatocyte undergoes meiosis I to form two haploid secondary spermatocytes; each of these undergoes meiosis II to form two round spermatids.' },
        { label: 'Spermiogenic phase', detail: 'Spermatids become mature sperm through four stages: Golgi, cap, acrosome and maturation phases.' },
      ],
      keyPoints: [
        'Incomplete cytokinesis leaves the cells joined by intercellular bridges, thought to synchronise their maturation (slides 23–24).',
        'Each generation moves closer to the lumen. Release of sperm into the lumen is spermiation; leftover cytoplasm and organelles are removed then (slide 25).',
      ],
      sourceRefs: ma([22, 23, 24, 25]),
    },
    {
      title: 'The spermatozoon',
      kind: 'structure',
      table: {
        columns: ['Part', 'Contents', 'Role'],
        rows: [
          ['Head', 'Condensed nucleus capped by the acrosome, a vesicle of hydrolytic enzymes', 'The acrosome is important in fertilisation'],
          ['Midpiece', 'Large helical mitochondria', 'Energy for swimming'],
          ['Tail', 'Microtubules', 'Propels the sperm'],
        ],
      },
      sourceRefs: ma([28, 29]),
    },
    {
      title: 'Maturation and storage',
      kind: 'mechanism',
      paragraphs: [
        'Sperm pass from the seminiferous tubules into the epididymis, where they are stored for up to 2 weeks, mature and develop motility, bathed in a fluid rich in proteins and ions. They are then stored in the vas deferens until ejaculation (Male, slide 41).',
      ],
      sourceRefs: ma([41]),
    },
    {
      title: 'Capacitation',
      kind: 'mechanism',
      paragraphs: [
        'Freshly ejaculated sperm can barely fertilise an egg. They acquire the ability — capacitation — while in the female tract, stimulated by secretions of the vagina, uterus and uterine tubes; it takes 5–7 hours (Male, slide 42).',
      ],
      steps: [
        { label: 'Removal of adherent seminal plasma proteins' },
        { label: 'Reorganisation of membrane lipids and proteins' },
        { label: 'Influx of extracellular Ca²⁺' },
        { label: 'Rise in cAMP and fall in intracellular pH' },
      ],
      keyPoints: ['Capacitated sperm show hyperactivated motility and can undergo the acrosome reaction (slide 43).'],
      sourceRefs: ma([42, 43]),
    },
  ],
  summary: [
    'Spermatogenesis: puberty onwards, seminiferous tubules, ~74 days.',
    'Mitotic (type A → type B → primary spermatocyte) → meiotic (secondary spermatocytes → spermatids) → spermiogenic (Golgi, cap, acrosome, maturation).',
    'Intercellular bridges synchronise maturation; spermiation releases sperm.',
    'Head (nucleus + acrosome), midpiece (mitochondria), tail (microtubules).',
    'Epididymis: up to 2 weeks, motility develops; stored in the vas deferens.',
    'Capacitation: 5–7 h in the female tract; Ca²⁺ influx, ↑cAMP, ↓pH → hyperactivation and acrosome reaction.',
  ],
};

const lesson3: Draft = {
  id: 'reproductive-physiology-3',
  title: 'Control of Spermatogenesis and Semen',
  description: 'How FSH, LH, testosterone, inhibin, activin and ABP control spermatogenesis, how the testes are kept cool, and what semen contains.',
  xp: 25,
  sourceRefs: ma([31, 32, 33, 35, 38, 40, 47, 48, 49, 50]),
  objectives: [
    'Describe the roles of FSH, inhibin, activin and androgen-binding protein',
    'Explain which hormone starts and which maintains spermatogenesis',
    'Describe how the scrotum keeps the testes about 3 °C below body temperature',
    'List other factors that impair spermatogenesis',
    'Describe the order and content of the secretions that make up semen, and normal semen values',
  ],
  chunks: [
    {
      title: 'Hormonal control',
      kind: 'regulation',
      paragraphs: [
        'The hypothalamus, pituitary and local testicular regulators control spermatogenesis. Sertoli and Leydig cells both regulate it through steroids and growth factors (Male, slide 31).',
      ],
      table: {
        columns: ['Factor', 'From', 'Effect'],
        rows: [
          ['Inhibin', 'Sertoli cells (under FSH)', 'Negative feedback on the pituitary and FSH; binds Leydig cells, regulating testosterone; blocks aromatase'],
          ['Activin', 'Sertoli cells', 'Enhances FSH; acts on spermatids and spermatogonia; blocks testosterone synthesis in Leydig cells'],
          ['Androgen-binding protein (ABP)', 'Sertoli cells', 'Concentrates testosterone 20–50 times above blood levels — essential to start and maintain spermatogenesis'],
          ['FSH and LH', 'Anterior pituitary', 'Suppress germ cell apoptosis'],
          ['Epidermal growth factor', 'Leydig cells', 'Regulates division of spermatogonia and spermatids'],
        ],
      },
      keyPoints: [
        'Much testosterone is converted to estrogen by aromatase in Sertoli cells; inhibin blocks this (slide 33).',
        'FSH is needed to start spermatogenesis; once started, testosterone alone maintains it (slide 33).',
      ],
      sourceRefs: ma([31, 32, 33]),
    },
    {
      title: 'Temperature',
      kind: 'regulation',
      paragraphs: ['Body temperature is too warm for sperm production, so the scrotum holds the testes about 3 °C below it (Male, slides 35–38), by:'],
      steps: [
        { label: 'Countercurrent heat exchange', detail: 'The pampiniform plexus of veins surrounds the testicular artery and cools arterial blood before it reaches the testis.' },
        { label: 'Cremaster muscle', detail: 'Lowers the testes to cool them, raises them to warm them.' },
        { label: 'Dartos muscle', detail: 'Relaxed: more scrotal surface for heat loss; contracted: less.' },
        { label: 'Sweat glands', detail: 'The scrotum is well supplied, presumably aiding cooling.' },
      ],
      keyPoints: ['Other factors that impair spermatogenesis: deficiency of vitamins B, E and A; anabolic steroids; cadmium and lead; X-rays; dioxin; alcohol; infections (slide 40).'],
      notes: [{ kind: 'annotation', text: 'Speaker notes on slide 40 explain how X-rays, metals and dioxin act. They were added to the deck and are not quizzed.' }],
      sourceRefs: ma([35, 38, 40]),
    },
    {
      title: 'Semen',
      kind: 'definitions',
      paragraphs: [
        'Semen is the greyish-white fluid ejaculated at orgasm: sperm (2–3%) plus secretions of the testis, epididymis (< 5%), seminal vesicles, prostate and bulbourethral glands (Male, slide 47). They arrive in order:',
      ],
      table: {
        columns: ['Secretion', 'Share', 'Content and role'],
        rows: [
          ['Bulbourethral (Cowper’s), first', '< 5%', 'Just before emission; mucus — possibly a lubricant, gives semen its jelly-like consistency and aids sperm movement in the cervix and vagina'],
          ['Prostate, next', '~30%', 'Alkaline: citric acid, prostate-specific antigen, acid phosphatase, zinc, proteolytic enzymes. Neutralises urine and vaginal acidity; liquefies coagulated semen. Zinc stabilises sperm chromatin — deficiency lowers fertility'],
          ['Seminal vesicles, last', '~60%', 'Mucus, amino acids, fructose (the sperm’s main energy source), prostaglandins (uterine contractions move semen up)'],
        ],
      },
      keyPoints: ['Normal semen: 1.5–5.0 mL, pH 7.0–8.3, ≥ 15 million sperm/mL; below 15 million/mL is low (slide 50).'],
      sourceRefs: ma([47, 48, 49, 50]),
    },
  ],
  summary: [
    'Sertoli cells (FSH) make inhibin (− FSH), activin (+ FSH) and ABP (testosterone 20–50× blood).',
    'FSH starts spermatogenesis; testosterone alone maintains it.',
    'Testes ~3 °C cooler: pampiniform countercurrent, cremaster, dartos, sweat glands.',
    'Semen: Cowper’s (<5%, first) → prostate (30%, alkaline, zinc, PSA) → seminal vesicles (60%, fructose, prostaglandins).',
    'Normal: 1.5–5 mL, pH 7.0–8.3, ≥15 million/mL.',
  ],
};

const lesson4: Draft = {
  id: 'reproductive-physiology-4',
  title: 'Testosterone and Disorders of the Testis',
  description: 'How testosterone travels and acts, the role of DHT and 5α-reductase, the effects of androgens, cryptorchidism and male hypogonadism.',
  xp: 25,
  sourceRefs: ma([52, 53, 55, 56, 57, 61, 62, 63, 64, 65, 67, 68, 69, 70, 71]),
  objectives: [
    'Describe how testosterone is carried in blood and which fraction is active',
    'Name the three epochs of adult-level testosterone secretion',
    'Explain how testosterone and DHT act, and the effect of 5α-reductase deficiency',
    'List the effects of androgens in males',
    'Describe cryptorchidism and the features of hypogonadism at different ages',
  ],
  chunks: [
    {
      title: 'Transport and secretion',
      kind: 'definitions',
      table: {
        columns: ['Fraction', 'Share'],
        rows: [
          ['Bound avidly to sex hormone–binding globulin (SHBG)', '~65%'],
          ['Loosely bound (albumin, α1-acid glycoprotein, transcortin)', '~33%'],
          ['Free', '1–2%'],
        ],
      },
      paragraphs: [
        'The free fraction is the most biologically active; with the loosely bound fraction it makes up the larger “bioavailable” testosterone. Levels show circhoral and diurnal rhythms (Male, slides 52–53).',
        'Testosterone reaches adult levels in three epochs: transiently in the first trimester of fetal life, in neonatal life, and after puberty to maintain virilisation. It is metabolised to active metabolites and to inactive conjugates excreted in urine and bile (slide 53).',
      ],
      notes: [{ kind: 'annotation', text: 'A speaker note explains “circhoral” as hourly pulses driven by GnRH. It was added to the deck and is not quizzed.' }],
      sourceRefs: ma([52, 53]),
    },
    {
      title: 'How it acts',
      kind: 'mechanism',
      steps: [
        { label: 'Conversion', detail: 'In most target cells some testosterone becomes dihydrotestosterone (DHT) by 5α-reductase; some becomes estradiol.' },
        { label: 'Androgen receptor', detail: 'Testosterone and DHT bind the same intracytoplasmic receptor; DHT binds more tightly and is 3–10 times more potent.' },
        { label: 'DNA', detail: 'The hormone–receptor complex binds DNA → mRNA → proteins → growth and other androgen effects.' },
      ],
      keyPoints: [
        'DHT cannot be aromatised to estrogen, so its effects are purely androgenic (slide 56).',
        '5α-reductase deficiency: male internal genitalia, but external genitalia from small penis with hypospadias to ambiguous or female. High testosterone at puberty brings marked virilisation, sometimes masculine gender reorientation, though the prostate stays rudimentary (slides 56–57).',
      ],
      sourceRefs: ma([55, 56, 57]),
    },
    {
      title: 'Effects of androgens',
      kind: 'classification',
      steps: [
        { label: 'Fetus', detail: 'Differentiation of the male internal and external genitalia.' },
        { label: 'Puberty — genitalia', detail: 'Development of scrotum, epididymis, vas deferens, seminal vesicles, prostate and penis.' },
        { label: 'Hair and skin', detail: 'Diamond-shaped pubic hair, axillary, facial, chest and back hair, receding temporal hairline; sebaceous glands and sebum.' },
        { label: 'Reproduction and behaviour', detail: 'Start spermatogenesis and sperm maturation; libido and sexual behaviour.' },
        { label: 'Growth and muscle', detail: 'Pubertal growth spurt; more protein synthesis, less breakdown → muscle mass; greater bone mass.' },
        { label: 'Other', detail: 'Enlarged larynx and thick vocal cords → deeper voice; more erythropoiesis; higher VLDL, lower HDL.' },
      ],
      sourceRefs: ma([61, 62, 63]),
    },
    {
      title: 'Cryptorchidism',
      kind: 'clinical',
      paragraphs: [
        'Failure of one or both testes to descend, in up to 30% of premature and 3–4% of term boys. Descent may complete in the first year; persistent failure can cause sterility. It is corrected surgically, and gonadotropin therapy succeeds in 10–50% (Male, slides 64–65).',
      ],
      table: {
        columns: ['Phase of descent', 'Depends on'],
        rows: [
          ['Transabdominal', 'Insulin-like hormone 3 (INSL3)'],
          ['Inguinoscrotal', 'Androgens'],
        ],
      },
      sourceRefs: ma([64, 65]),
    },
    {
      title: 'Male hypogonadism',
      kind: 'clinical',
      paragraphs: [
        'The body does not make enough testosterone. Primary hypogonadism (testicular failure) arises in the testes; secondary from the hypothalamus or pituitary. It may be congenital or follow injury or infection, and its signs depend on when it begins (Male, slides 67–68).',
      ],
      table: {
        columns: ['When', 'Features'],
        rows: [
          ['Fetal life', 'Female, ambiguous or underdeveloped male genitals'],
          ['Before puberty (eunuch)', 'Little muscle, high-pitched voice, scant body hair, small penis and testes, long arms and legs, gynaecomastia, female body shape and pubic hair'],
          ['Adulthood', 'Erectile dysfunction, infertility, less beard and body hair, more body fat, smaller softer testes, less muscle, gynaecomastia, osteoporosis'],
        ],
      },
      sourceRefs: ma([67, 68, 69, 70, 71]),
    },
  ],
  summary: [
    'Testosterone: 65% SHBG, 33% loosely bound, 1–2% free (most active).',
    'Adult levels in the first trimester, neonatal life and after puberty.',
    '5α-reductase → DHT (3–10× more potent, not aromatised). Same receptor → DNA → proteins.',
    'Androgens: genital development, hair, sebum, spermatogenesis, libido, growth spurt, muscle, bone, voice, erythropoiesis, ↑VLDL ↓HDL.',
    'Cryptorchidism: 30% premature, 3–4% term; INSL3 then androgens; surgery or gonadotropins.',
    'Hypogonadism: primary (testis) vs secondary (hypothalamus/pituitary); features depend on age.',
  ],
};

const lesson5: Draft = {
  id: 'reproductive-physiology-5',
  title: 'The Female System, Oogenesis and the Ovarian Cycle',
  description: 'The female reproductive organs, the ovary, oogenesis from fetus to fertilisation, and the follicular, ovulatory and luteal phases.',
  xp: 25,
  sourceRefs: fe([1, 2, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20]),
  objectives: [
    'Name the female reproductive organs and their roles',
    'Describe the structure of the ovary',
    'Trace oogenesis and the numbers of oocytes from fetus to puberty',
    'Describe the stages of follicle development to the Graafian follicle',
    'Describe ovulation and the corpus luteum',
  ],
  chunks: [
    {
      title: 'The female reproductive system',
      kind: 'structure',
      table: {
        columns: ['Organ', 'Role'],
        rows: [
          ['Ovaries (primary organs)', 'Mature ova and female sex steroid hormones'],
          ['Fallopian (uterine) tubes', 'Connect the ovaries to the uterus'],
          ['Uterus', 'Site where a fertilised egg attaches and is nourished'],
          ['Vagina', 'Exit for menstrual fluid, receives the penis, birth canal'],
          ['Vulva', 'Mons pubis, labia majora and minora, clitoris, greater vestibular glands'],
          ['Mammary glands', 'Present in both sexes; normally function only in women'],
        ],
      },
      sourceRefs: fe([1, 2]),
    },
    {
      title: 'The ovary',
      kind: 'structure',
      paragraphs: [
        'Two almond-shaped ovaries lie on either side of the uterus. Each is covered by simple cuboidal germinal epithelium over a dense capsule, the tunica albuginea. The outer cortex is dense and granular with follicles, each containing an oocyte; the inner medulla is loose connective tissue with vessels, lymphatics and nerves (Female, slides 5–6).',
      ],
      sourceRefs: fe([5, 6]),
    },
    {
      title: 'Oogenesis',
      kind: 'pathway',
      steps: [
        { label: 'Fetus', detail: 'Primitive germ cells become oogonia (46 chromosomes) — about 7 million at 24 weeks. They grow into primary oocytes, which begin meiosis I and stop in prophase until puberty.' },
        { label: 'Attrition', detail: 'About 2 million primary oocytes at birth, about 400,000 at puberty; only 400–500 will ever ovulate.' },
        { label: 'Each month from puberty', detail: 'Under FSH several primary oocytes grow; one outgrows the rest and resumes meiosis I; the others degenerate.' },
        { label: 'Meiosis I completed', detail: 'Unequal division: a haploid secondary oocyte with nearly all the cytoplasm, and a small first polar body.' },
        { label: 'Meiosis II', detail: 'Begins and stops in metaphase just before ovulation. It is completed only if fertilisation occurs, giving the ovum and a second polar body; otherwise the secondary oocyte degenerates.' },
      ],
      keyPoints: ['All three polar bodies degenerate (slide 11).'],
      sourceRefs: fe([8, 9, 10, 11]),
    },
    {
      title: 'The follicular phase',
      kind: 'pathway',
      paragraphs: ['The ovarian cycle has a follicular phase (variable length), an ovulatory phase (~1 day) and a luteal phase (13–14 days). At the start of each cycle 30–40 primordial follicles are recruited (Female, slides 13–14).'],
      steps: [
        { label: 'Primordial follicle', detail: 'A non-growing oocyte with one layer of flat granulosa cells.' },
        { label: 'Primary follicle', detail: 'Granulosa cells become cuboidal; the oocyte grows and lays down the zona pellucida.' },
        { label: 'Preantral (secondary) follicle', detail: 'Granulosa cells multiply into several layers; under FSH the surrounding tissue becomes theca interna (glandular, vascular) and theca externa. The oocyte grows 60-fold to about 120 µm; the follicle reaches 10–15 mm.' },
        { label: 'Antral follicle', detail: 'Fluid cavities coalesce into an antrum. A dominant follicle is selected; the rest degenerate.' },
        { label: 'Graafian follicle', detail: 'Contains follicular fluid (liquor folliculi); the oocyte with its zona sits in the cumulus oophorus on a stalk of granulosa cells; 1.5–2.5 cm across.' },
      ],
      sourceRefs: fe([13, 14, 15, 16, 17]),
    },
    {
      title: 'Ovulation and the luteal phase',
      kind: 'pathway',
      steps: [
        { label: 'Ovulation', detail: 'The Graafian follicle bulges from the ovary, the wall ruptures and the secondary oocyte is expelled with its zona and cumulus cells — around day 14 after recruitment.' },
        { label: 'Corpus haemorrhagicum', detail: 'Blood and lymph fill the ruptured follicle.' },
        { label: 'Corpus luteum', detail: 'Granulosa and theca cells proliferate and yellow lipid-rich lutein cells replace the clot — an endocrine unit.' },
        { label: 'Corpus albicans', detail: 'Without fertilisation and implantation the corpus luteum degenerates in 14 days.' },
      ],
      sourceRefs: fe([19, 20]),
    },
  ],
  summary: [
    'Ovaries (ova + steroids), tubes, uterus, vagina, vulva, mammary glands.',
    'Ovary: germinal epithelium, tunica albuginea, cortex (follicles), medulla (vessels).',
    'Oogonia ~7 million (24 weeks) → ~2 million primary oocytes at birth → ~400,000 at puberty → 400–500 ovulate.',
    'Meiosis I arrested in prophase until puberty; meiosis II arrested in metaphase until fertilisation.',
    'Primordial → primary (zona pellucida) → preantral (theca) → antral → Graafian (1.5–2.5 cm).',
    'Ovulation ~day 14 → corpus haemorrhagicum → corpus luteum → corpus albicans in 14 days.',
  ],
};

const lesson6: Draft = {
  id: 'reproductive-physiology-6',
  title: 'The Uterine Cycle and Control of the Menstrual Cycle',
  description: 'The four phases of the uterine cycle, cyclic changes in the cervix, vagina, breast and temperature, and the hypothalamic–pituitary–ovarian axis.',
  xp: 25,
  sourceRefs: fe([22, 23, 24, 25, 26, 27, 31, 32, 34, 35, 36, 37, 38, 39, 40, 44]),
  objectives: [
    'Describe the menstrual, proliferative, secretory and premenstrual phases',
    'Explain why menstrual blood does not clot',
    'Describe how cervical mucus, vaginal cytology, the breast and body temperature change',
    'Explain how GnRH, FSH, LH, estrogen and inhibin control the cycle',
    'Explain the LH surge and what maintains the corpus luteum',
  ],
  chunks: [
    {
      title: 'The uterine cycle',
      kind: 'pathway',
      paragraphs: ['The menstrual cycle comprises the ovarian and uterine cycles. The uterine cycle is the monthly change in the endometrium in response to the ovary (Female, slides 13, 22):'],
      steps: [
        { label: 'Menstrual phase (days 1–5)', detail: 'Most of the stratum functionale (supplied by long coiled spiral arteries) detaches and bleeds; the stratum basale (short straight basilar arteries) stays. Flow lasts 4–6 days on average (range 2–8).' },
        { label: 'Proliferative phase (days 6–14)', detail: 'Rising estrogen in the follicular phase thickens the endometrium; tubular glands and spiral arteries form. Ovulation ends this phase.' },
        { label: 'Secretory phase (days 15–26)', detail: 'Progesterone and estrogen from the corpus luteum enlarge the glands, which secrete mucus and glycogen for implantation. Its length is constant (14 days).' },
        { label: 'Premenstrual phase (days 27–28)', detail: 'The corpus luteum degenerates; the endometrium thins; prostaglandins constrict the spiral arteries; leucocytes and lysosomal enzymes break down the ischaemic tissue; uterine contractions slough it as menstrual flow.' },
      ],
      keyPoints: ['Menstrual blood does not clot because degenerating endometrium releases fibrinolysin. More than 80 mL of blood loss is abnormal (slides 23–24).'],
      sourceRefs: fe([13, 22, 23, 24, 25, 26, 27]),
    },
    {
      title: 'Changes in other organs',
      kind: 'comparison',
      table: {
        columns: ['', 'Under estrogen (before ovulation)', 'Under progesterone (after ovulation)'],
        rows: [
          ['Cervical mucus', 'Copious, watery, “egg white”, elastic; ferns when dried — helps sperm through', 'Thick, pasty, non-elastic, no ferning — blocks sperm'],
          ['Vaginal epithelium', 'Cornified', 'Infiltrated by leucocytes'],
          ['Breast', 'Ducts proliferate', 'Lobules and alveoli grow; breasts swell and are tender'],
        ],
      },
      keyPoints: [
        'Basal body temperature rises about 1 °C on the morning of ovulation and stays up until menstruation, because of progesterone (slide 35).',
        'Other premenstrual changes: oedema, muscle sensitivity, emotional tension and headache (slide 35).',
      ],
      sourceRefs: fe([31, 32, 34, 35]),
    },
    {
      title: 'The hypothalamic–pituitary–ovarian axis',
      kind: 'regulation',
      steps: [
        { label: 'GnRH', detail: 'Released in pulses by the hypothalamus; stimulates FSH and LH from the anterior pituitary.' },
        { label: 'Two cells, two hormones', detail: 'LH (on theca cells) drives androgen production; the androgens cross to granulosa cells and are aromatised to estradiol under FSH. LH also makes granulosa cells produce progesterone, which theca cells turn into androgens.' },
        { label: 'Negative feedback', detail: 'Rising estrogen and inhibin (made under FSH) inhibit FSH and LH — transiently.' },
        { label: 'Positive feedback — the LH surge', detail: 'High estrogen increases GnRH pulses, giving a burst of LH (and less FSH) 34–36 hours before ovulation. It completes meiosis I and drives the enzymes for follicle rupture.' },
        { label: 'Luteal phase', detail: 'LH forms and maintains the corpus luteum, whose progesterone and estrogen inhibit FSH and LH, preventing new follicles. Without fertilisation it regresses after 12–16 days.' },
      ],
      keyPoints: [
        'In pregnancy, hCG from the trophoblast maintains the corpus luteum until the luteo-placental shift (slide 40).',
        'Caloric deprivation, strenuous exercise, stress and emotional disturbance can override the signals for ovulation — neuro-endocrine control (slide 44).',
      ],
      sourceRefs: fe([36, 37, 38, 39, 40, 44]),
    },
  ],
  summary: [
    'Uterine cycle: menstrual (1–5) → proliferative (6–14, estrogen) → secretory (15–26, progesterone, constant 14 days) → premenstrual (27–28, prostaglandins).',
    'Fibrinolysin stops menstrual blood clotting; > 80 mL is abnormal.',
    'Estrogen: watery ferning mucus, cornified vaginal cells, duct growth. Progesterone: thick mucus, leucocytes, lobules; temperature up ~1 °C.',
    'GnRH → FSH, LH. Theca (LH) androgens → granulosa (FSH) aromatase → estradiol.',
    'Estrogen first inhibits, then (high) triggers the LH surge 34–36 h before ovulation.',
    'Corpus luteum lasts 12–16 days unless hCG rescues it.',
  ],
};

const lesson7: Draft = {
  id: 'reproductive-physiology-7',
  title: 'Menstrual Disorders and Ovarian Hormones',
  description: 'Anovulatory cycles, amenorrhoea and abnormal bleeding, and the transport and effects of estrogens, progestins, relaxin and inhibin.',
  xp: 25,
  sourceRefs: fe([45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 60, 61, 62]),
  objectives: [
    'List causes of anovulatory cycles',
    'Define primary and secondary amenorrhoea and their causes',
    'Define oligomenorrhoea, polymenorrhoea, menorrhagia and dysmenorrhoea',
    'Describe the sources, transport and effects of estrogens',
    'Describe the effects of progesterone, relaxin and inhibin',
  ],
  chunks: [
    {
      title: 'Anovulatory cycles',
      kind: 'clinical',
      paragraphs: [
        'Ovulation fails when part of the control system — hypothalamus, pituitary or ovary — malfunctions: for example no GnRH from the hypothalamus, or hyperprolactinaemia (often a prolactinoma) lowering the hormones that trigger ovulation (Female, slides 45–46).',
        'Other causes: polycystic ovarian syndrome, thyroid and adrenal disorders, excessive exercise, diabetes, weight loss, obesity and psychological stress (slides 46–47).',
      ],
      sourceRefs: fe([45, 46, 47]),
    },
    {
      title: 'Amenorrhoea and abnormal bleeding',
      kind: 'clinical',
      terms: [
        { term: 'Amenorrhoea', meaning: 'No vaginal bleeding for three months or more — from an anatomical abnormality or very low or non-cyclic estrogen.' },
        { term: 'Primary amenorrhoea', meaning: 'Menarche delayed beyond 15 years; about 6.4% of the population.' },
        { term: 'Secondary amenorrhoea', meaning: 'After menarche; 1–2%. Commonest causes: pregnancy, lactation, undernutrition or weight loss, stress, eating disorders, strenuous exercise.' },
        { term: 'Oligomenorrhoea', meaning: 'Intervals over 36 (but under 180) days — 4–9 periods a year; common at the extremes of reproductive life and with rising BMI.' },
        { term: 'Polymenorrhoea', meaning: 'Cycles under 21 days; implies higher estrogen; often with abnormal ovulation and heavier flow.' },
        { term: 'Menorrhagia', meaning: 'Heavy bleeding: hormonal imbalance (adolescence, menopause), fibroids, cervical or endometrial polyps.' },
        { term: 'Dysmenorrhoea', meaning: 'Painful menstruation, mostly from accumulated prostaglandins.' },
      ],
      sourceRefs: fe([47, 48, 49, 50, 51]),
    },
    {
      title: 'Estrogens',
      kind: 'definitions',
      paragraphs: [
        'Steroid hormones made mainly in ovarian follicles, the corpus luteum and the placenta, with small amounts from the testes, adrenals, brain and fat. 17β-estradiol is the most abundant and potent; estrone and estriol are the others. Aromatase converts androgens to estrogens (Female, slide 52).',
        'Transport: 60% bound to albumin, 38% to the sex hormone–binding globulin, 2% free. They act on receptors on the membrane or inside the cell (slide 53).',
      ],
      steps: [
        { label: 'Development', detail: 'Form the female tract and external genitals in the fetus; secondary sex characteristics at puberty; fuel then halt the adolescent growth spurt.' },
        { label: 'Reproduction', detail: 'Follicular development, growth of the endometrium, excitation of the myometrium, growth of breast ducts, libido.' },
        { label: 'Metabolic', detail: 'Slight rise in body protein, inhibition of bone resorption, lower plasma cholesterol, some salt and water retention.' },
      ],
      sourceRefs: fe([52, 53, 55, 56]),
    },
    {
      title: 'Progestins',
      kind: 'definitions',
      paragraphs: [
        'Made mainly in ovarian follicles, the corpus luteum, the placenta and the testes. Progesterone is the most abundant and potent; it is the building block for the other steroids. Transport: 80% albumin, 18% binding globulin, 2% free (Female, slides 57–58).',
      ],
      steps: [
        { label: 'Breast', detail: 'Growth of lobules and alveoli.' },
        { label: 'Uterus', detail: 'Secretory changes in the endometrium; less excitable myometrium.' },
        { label: 'Body', detail: 'Thermogenic; large doses cause natriuresis.' },
        { label: 'CNS', detail: 'More appetite, less wakefulness, a respiratory centre more sensitive to CO₂.' },
      ],
      sourceRefs: fe([57, 58, 60, 61]),
    },
    {
      title: 'Relaxin and inhibin',
      kind: 'definitions',
      terms: [
        { term: 'Relaxin', meaning: 'Peptide resembling proinsulin, from the corpus luteum, placenta and decidua under hCG. Inhibits uterine contraction (preventing abortion), loosens the pelvic joint and helps dilate the cervix for birth.' },
        { term: 'Inhibin', meaning: 'From granulosa cells. Stimulates ovarian androgen production (androgens in turn stimulate inhibin) and inhibits FSH release.' },
      ],
      sourceRefs: fe([61, 62]),
    },
  ],
  summary: [
    'Anovulation: no GnRH, hyperprolactinaemia, PCOS, thyroid/adrenal disease, exercise, weight change, stress.',
    'Primary amenorrhoea: no menarche by 15. Secondary: commonest causes pregnancy and lactation.',
    'Oligo- (> 36 days), poly- (< 21 days), menorrhagia (heavy), dysmenorrhoea (prostaglandins).',
    'Estrogens: estradiol most potent; 60% albumin, 38% globulin, 2% free; growth of tract, ducts, endometrium; excite myometrium; protect bone.',
    'Progesterone: 80% albumin; lobules, secretory endometrium, quiet myometrium, thermogenic.',
    'Relaxin quiets the uterus and loosens the pelvis; inhibin inhibits FSH.',
  ],
};

const lesson8: Draft = {
  id: 'reproductive-physiology-8',
  title: 'Puberty, Climacteric and Sexual Response',
  description: 'The triggers and signs of puberty, andropause and menopause, the human sexual response and the mechanism of penile erection.',
  xp: 25,
  sourceRefs: sr([1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 17, 18, 19, 20, 23, 26, 27, 32, 33, 34, 35, 36, 38]),
  objectives: [
    'Explain what triggers puberty, including leptin and kisspeptin',
    'List the order of pubertal signs in girls and boys',
    'Define precocious and delayed puberty',
    'Compare andropause and menopause',
    'Name the four phases of the sexual response',
    'Explain the NO/cGMP and cAMP pathways of erection and how erection ends',
  ],
  chunks: [
    {
      title: 'Puberty',
      kind: 'regulation',
      paragraphs: [
        'Puberty is the transition to adulthood ending in mature gametes — usually 10–14 years in girls and 12–16 in boys. It requires maturation of the hypothalamic–pituitary–gonadal axis; body fat may play a part, with leptin from adipocytes a possible mediator (Sexual Response, slides 1–2).',
        'The trigger is a change in hypothalamic kisspeptin and its receptor GPR54, which changes GnRH. Neurokinin B and dynorphin A, made with kisspeptin, may regulate it. Kisspeptin releases GnRH directly and LH and FSH indirectly, starting gonadal activity (slides 2–3).',
      ],
      table: {
        columns: ['Girls', 'Boys'],
        rows: [
          ['Breast development (thelarche) first', 'Testes and penis enlarge first'],
          ['Pubic (pubarche) and axillary hair, acne', 'Pubic and axillary hair'],
          ['Menstruation (menarche) last', 'Muscle growth, deeper voice, acne, facial hair'],
        ],
      },
      keyPoints: [
        'Precocious puberty: before 7–8 in girls, before 9 in boys — central (true) or peripheral (pseudopuberty) (slide 7).',
        'Delayed puberty: no testicular enlargement by 14 in boys; no breast development by 13.5 or no menstruation by 16 in girls. “Pubertal arrest” = no progress over 2 years (slides 7–8).',
      ],
      sourceRefs: sr([1, 2, 3, 4, 5, 7, 8]),
    },
    {
      title: 'The climacteric',
      kind: 'comparison',
      paragraphs: ['The climacteric (Greek klimaktēr, “rung of a ladder”) is the passage out of the reproductive phase of life. Men keep reproductive competence into their eighties; women lose it completely at menopause (Sexual Response, slide 10).'],
      table: {
        columns: ['', 'Andropause', 'Menopause'],
        rows: [
          ['When', 'Gradually, from about 40', '45–55; no period for 12 months in a row'],
          ['Why', 'Testosterone declines; SHBG rises, lowering bioavailable testosterone; estrogen rises', 'Fewer oocytes; follicles resist FSH; estrogen falls; no ovulation or corpus luteum; endometrium no longer maintained'],
          ['Features', 'Low energy, low mood, poor concentration, insomnia, more fat, less muscle, gynaecomastia, erectile dysfunction, low libido, infertility, small testes, hot flushes, osteoporosis', 'Period changes, spotting, hot flushes, night sweats, vaginal changes, osteoporosis, mood change, urinary problems, palpitations'],
        ],
      },
      sourceRefs: sr([10, 11, 12, 13, 17, 18, 19, 20]),
    },
    {
      title: 'The sexual response',
      kind: 'definitions',
      paragraphs: ['The sequence of physical and emotional changes with sexual arousal follows four phases — the “EPOR” model: excitement, plateau, orgasm and resolution. Timing can differ between the sexes (Sexual Response, slide 23).'],
      sourceRefs: sr([23]),
    },
    {
      title: 'Penile erection',
      kind: 'pathway',
      steps: [
        { label: 'Stimulus', detail: 'Sensory or mental, or both; brain (descending tracts) and internal pudendal nerve inputs are integrated in the sacral cord.' },
        { label: 'Parasympathetic outflow', detail: 'Nervi erigentes carry it to the penis.' },
        { label: 'NO', detail: 'Released by NANC nerves (and from endothelium, where ACh on muscarinic receptors raises Ca²⁺–calmodulin, activating eNOS). NO activates guanylate cyclase: GTP → cGMP.' },
        { label: 'cAMP', detail: 'VIP and PGE1 activate adenylate cyclase: ATP → cAMP.' },
        { label: 'Relaxation', detail: 'Via PKG and PKA: K⁺ channels open (hyperpolarisation), Ca²⁺ channels are blocked and Ca²⁺ is stored in the SR. Low Ca²⁺ slows myosin light-chain kinase, so the cavernous smooth muscle relaxes.' },
        { label: 'Filling', detail: 'Arterioles dilate, the corpora cavernosa fill, and compressed venules against the tunica albuginea trap the blood.' },
      ],
      keyPoints: [
        'NO is the principal mediator of erection (slide 32).',
        'Termination: adrenergic activity — directly, α1 and α2 constriction via IP₃/DAG; indirectly, prejunctional α2 inhibition of the vasodilator nerves (slide 38).',
      ],
      sourceRefs: sr([26, 27, 32, 33, 34, 35, 36, 38]),
    },
  ],
  summary: [
    'Puberty: girls 10–14, boys 12–16; kisspeptin–GPR54 → GnRH; leptin may signal readiness.',
    'Girls: thelarche → pubarche → menarche. Boys: testes and penis first.',
    'Precocious: < 7–8 (girls), < 9 (boys). Delayed: no testicular growth by 14; no breasts by 13.5 or menses by 16.',
    'Andropause: gradual from ~40, ↓testosterone, ↑SHBG. Menopause: 45–55, ↓estrogen, 12 months without a period.',
    'Sexual response: excitement, plateau, orgasm, resolution.',
    'Erection: sacral cord → nervi erigentes → NO → cGMP (and VIP/PGE1 → cAMP) → smooth muscle relaxes. Ends via α-adrenergic activity.',
  ],
};

const lesson9: Draft = {
  id: 'reproductive-physiology-9',
  title: 'Fertilisation, Implantation and the Placenta',
  description: 'How a sperm reaches and fertilises the oocyte, how the blastocyst implants, the functions of the placenta and the changes of pregnancy.',
  xp: 25,
  sourceRefs: sr([40, 41, 42, 43, 44, 49, 52, 53, 54, 55, 58, 59, 60, 61, 62, 63]),
  objectives: [
    'Describe where fertilisation occurs and the losses of sperm on the way',
    'Explain how the sperm crosses the cumulus and zona, and how polyspermy is blocked',
    'Trace the zygote to the blastocyst and its implantation',
    'List the immunological, endocrine, transport and metabolic functions of the placenta',
    'Describe the main hormonal changes of pregnancy',
  ],
  chunks: [
    {
      title: 'Fertilisation',
      kind: 'pathway',
      paragraphs: [
        'Fertilisation — fusion of male and female gametes — usually occurs in the ampulla of the uterine tube. Of the millions of sperm ejaculated, over 99% never enter the cervix (leakage, or death in the acidic vagina); about 1% reach the ampulla, capacitating on the way (Sexual Response, slides 40–41).',
      ],
      steps: [
        { label: 'Cumulus oophorus', detail: 'Crossed using hyperactivated motility and hyaluronidases.' },
        { label: 'Zona pellucida', detail: 'A sperm-head molecule binds the species-specific ZP3 glycoprotein, triggering the acrosome reaction; tail propulsion and acrosomal enzymes carry the sperm through.' },
        { label: 'Fusion', detail: 'The sperm fuses with the oolemma, triggering oocyte activation.' },
        { label: 'Oocyte activation', detail: 'A wave of Ca²⁺ from the ER; meiosis II completes; the cortical reaction (exocytosis of cortical granules) hardens the zona and destroys its sperm receptors — the block to polyspermy.' },
        { label: 'Zygote', detail: 'The male and female pronuclei fuse into a diploid zygote.' },
      ],
      sourceRefs: sr([40, 41, 42, 43, 44]),
    },
    {
      title: 'Implantation',
      kind: 'pathway',
      steps: [
        { label: 'Morula', detail: 'Rapid division for 2–3 days; reaches the uterus in about 4 days.' },
        { label: 'Blastocyst', detail: 'A hollow, fluid-filled ball: the inner cell mass (becomes the embryo) and trophoblast (helps form the placenta).' },
        { label: 'Decidua', detail: 'Under corpus luteum estrogen and progesterone the endometrium becomes vascular and its surface forms rounded decidual cells.' },
        { label: 'Invasion', detail: 'Trophoblast at the contact point forms syncytiotrophoblast and cytotrophoblast. The syncytiotrophoblast grows chorionic villi, digests the decidua so the blastocyst sinks in, and breaches maternal vessels — the villi are bathed in maternal blood.' },
        { label: 'Placenta', detail: 'Fetal vessels grow into the villi and exchange begins. The villi secrete hCG, maintaining the corpus luteum and preventing menstruation. The placenta is complete by the third to fourth month.' },
      ],
      sourceRefs: sr([49, 52, 53, 54, 55]),
    },
    {
      title: 'Functions of the placenta',
      kind: 'classification',
      table: {
        columns: ['Function', 'Details'],
        rows: [
          ['Immunological', 'Passive immunity to the fetus; suppresses the mother’s immune response against the fetus'],
          ['Endocrine', 'Syncytiotrophoblast secretes estrogen, progesterone, hCG, hCS/hPL and relaxin; also chorionic thyrotropin, chorionic ACTH, IGFs and growth factors'],
          ['Transport', 'Gases, wastes, antibodies and nutrients, driven by concentration and electrical gradients'],
          ['Metabolic', 'Early in pregnancy makes glycogen, cholesterol and fatty acids for the embryo'],
        ],
      },
      sourceRefs: sr([58, 59, 60, 61]),
    },
    {
      title: 'Changes of pregnancy',
      kind: 'regulation',
      steps: [
        { label: 'Gonadotropins', detail: 'Suppressed by estrogen and progesterone.' },
        { label: 'Thyroid', detail: 'Estrogen stimulates it; it may enlarge.' },
        { label: 'Adrenals', detail: 'More aldosterone and cortisol → salt and water retention.' },
        { label: 'Pancreas', detail: 'More insulin in the second half in response to glucose.' },
        { label: 'Parathyroid', detail: 'Enlarges (especially with low Ca²⁺); PTH rises.' },
      ],
      keyPoints: ['The mother also adjusts: larger sex organs, weight gain, and metabolic, haematological, cardiovascular, respiratory, renal and GI changes (slide 63).'],
      sourceRefs: sr([61, 62, 63]),
    },
  ],
  summary: [
    'Fertilisation in the ampulla; ~1% of sperm get there.',
    'Hyaluronidase through the cumulus; ZP3 binding → acrosome reaction; fusion → Ca²⁺ wave → meiosis II and cortical reaction (block to polyspermy) → zygote.',
    'Morula (2–3 days, uterus by ~4) → blastocyst (inner cell mass + trophoblast) → syncytiotrophoblast invades the decidua.',
    'hCG maintains the corpus luteum; placenta complete by months 3–4.',
    'Placenta: immunity, hormones (estrogen, progesterone, hCG, hPL, relaxin), transport, metabolism.',
    'Pregnancy: gonadotropins suppressed; ↑thyroid, aldosterone, cortisol, insulin, PTH.',
  ],
};

const lesson10: Draft = {
  id: 'reproductive-physiology-10',
  title: 'Parturition and Lactation',
  description: 'The endocrine and mechanical signals of labour, lactogenesis and the milk ejection reflex, milk composition and lactational amenorrhoea.',
  xp: 25,
  sourceRefs: sr([65, 66, 67, 68, 69, 70, 71, 74, 75, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]),
  objectives: [
    'Explain the roles of the estrogen/progesterone ratio, oxytocin and prostaglandins in labour',
    'Describe how the fetal adrenal and placental CRH help start labour',
    'Describe the mechanical positive-feedback loop of labour',
    'Describe lactogenesis I, II and III and the hormones needed',
    'Trace the milk ejection reflex',
    'Compare colostrum with mature milk and explain lactational amenorrhoea',
  ],
  chunks: [
    {
      title: 'Endocrine factors in labour',
      kind: 'regulation',
      paragraphs: [
        'Parturition delivers the baby and placenta; gestation is about 38 weeks. It is started by the fetal–placental unit and needs coordinated endocrine and mechanical signals (Sexual Response, slide 65).',
      ],
      table: {
        columns: ['Factor', 'Role'],
        rows: [
          ['Estrogen/progesterone ratio', 'Progesterone quiets, estrogen excites the uterus. Near term rising estrogen may increase placental progesterone binding, raising the effective ratio. Progesterone inhibits, estrogen stimulates local prostaglandins'],
          ['Oxytocin', 'Released by cervical stretch; increases contractions. Myometrial receptors rise > 100-fold, peaking in early labour; it also increases prostaglandin synthesis'],
          ['Prostaglandins', 'Raise intracellular Ca²⁺. PGF2α is essential for labour to progress; PGE2 may ripen the cervix'],
          ['Fetal adrenal', 'Placental CRH rises at term and stimulates the fetal adrenal (CRH, ACTH → cortisol, DHEAS). This favours estrogen over progesterone and stops placental inactivation of prostaglandins → more oxytocin receptors, more oxytocin, gap junctions → coordinated contractions. Cortisol also matures the fetal lungs'],
          ['Relaxin', 'Local relaxin may keep the uterus quiet in pregnancy by down-regulating oxytocin receptors; relaxes the pubic ligament before birth'],
        ],
      },
      sourceRefs: sr([65, 66, 67, 68, 69, 70, 71]),
    },
    {
      title: 'Mechanical factors and delivery',
      kind: 'pathway',
      steps: [
        { label: 'Stretch', detail: 'The grown fetus stretches the uterus; the head presses on the cervix.' },
        { label: 'Oxytocin', detail: 'The posterior pituitary releases more, strengthening contractions and pushing the head harder on the cervix — positive feedback.' },
        { label: 'Dilation', detail: 'Contractions pull the cervix open until the baby can pass; the head enters the vagina.' },
        { label: 'Delivery', detail: 'The mother bears down with abdominal muscles.' },
        { label: 'Placenta', detail: 'Detached and expelled within minutes to an hour, often with contractions.' },
      ],
      keyPoints: ['Multiple pregnancies tend to be shorter because the mechanical stimuli come early (slide 75).'],
      sourceRefs: sr([74, 75]),
    },
    {
      title: 'Lactogenesis',
      kind: 'regulation',
      paragraphs: [
        'In pregnancy estrogen, progesterone, rising prolactin and placental lactogen (hPL/hCS) develop the ducts, lobules and alveoli (Sexual Response, slide 80).',
      ],
      steps: [
        { label: 'Lactogenesis I', detail: 'Begins late in pregnancy.' },
        { label: 'Lactogenesis II', detail: 'Copious secretion, held back until after birth; starts about 40 hours after delivery and is largely complete in 5 days. Needs a developed epithelium, high prolactin and a fall in estrogen and progesterone.' },
        { label: 'Lactogenesis III', detail: 'Local control once secretion is established: a feedback inhibitor of lactation (FIL) builds up if milk stays in the breast, so milk removal is essential.' },
      ],
      keyPoints: ['Milk continues while the infant suckles more than once a day; oxytocin and prolactin are needed, prolactin for long-term maintenance (slides 81–82).'],
      sourceRefs: sr([80, 81, 82, 83]),
    },
    {
      title: 'The milk ejection reflex',
      kind: 'pathway',
      steps: [
        { label: 'Suckling', detail: 'Sensory nerves from the areola.' },
        { label: 'Hypothalamus', detail: 'Paraventricular and supraoptic nuclei.' },
        { label: 'Posterior pituitary', detail: 'Oxytocin released into the blood.' },
        { label: 'Breast', detail: 'Myoepithelial cells around the alveoli contract, expelling milk into the ducts.' },
      ],
      keyPoints: ['The reflex can be conditioned (the baby’s cry, a picture) and inhibited by emotional distress through higher centres (slides 84–85).'],
      sourceRefs: sr([83, 84, 85]),
    },
    {
      title: 'Milk and lactational amenorrhoea',
      kind: 'comparison',
      table: {
        columns: ['Colostrum (first week)', 'Mature milk'],
        rows: [
          ['More protein, IgA and lactoferrin; more fat-soluble vitamins (A, D, E, K); some minerals', 'Low protein and IgA'],
          ['Less fat, lactose and water-soluble vitamins', 'High lactose, high fat and calories'],
        ],
      },
      paragraphs: [
        'Full breastfeeding (every 4 hours by day and 6 hours at night, with little supplementation) usually stops ovarian cycles and menstruation (Sexual Response, slides 87–88). Suckling releases β-endorphin in the hypothalamus, which:',
      ],
      steps: [
        { label: 'Inhibits GnRH', detail: 'Pulsatile LH secretion is impaired — the main mechanism suppressing follicles and ovulation.' },
        { label: 'Suppresses dopamine', detail: 'Dopamine is the prolactin-inhibiting hormone, so prolactin rises — and prolactin also inhibits GnRH.' },
      ],
      sourceRefs: sr([86, 87, 88, 89, 90]),
    },
  ],
  summary: [
    'Labour: ↑estrogen/progesterone ratio, oxytocin (receptors ↑ > 100×), PGF2α (progression), PGE2 (cervical ripening).',
    'Placental CRH → fetal adrenal cortisol → more estrogen, less progesterone → oxytocin receptors, gap junctions. Cortisol matures the lungs.',
    'Stretch → oxytocin → contraction → more stretch (positive feedback).',
    'Lactogenesis II ~40 h after birth: high prolactin, falling estrogen and progesterone. FIL controls local supply.',
    'Suckling → PVN/SON → oxytocin → myoepithelial contraction.',
    'Colostrum: protein, IgA, fat-soluble vitamins. β-endorphin ↓GnRH and ↓dopamine (↑prolactin) → lactational amenorrhoea.',
  ],
};

export const lessons: Draft[] = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9, lesson10].map((lesson) => ({
  ...lesson,
  ...readingExtras[lesson.id],
  interactive: withSimulation(lesson.id, interactive[lesson.id]),
}));

// Physiology → Reproductive Physiology — the topic question bank.
//
// Rules: only what the lessons teach (the three reproductive decks). Not
// asked: speaker-note annotations, the gestation length or the average
// menstrual blood loss (see discrepancies). IDs: qN-xx.
import { fill, match, mcq, multi, order, tf, type QuestionDraft } from '@/data/topics/build';
import type { ConceptId } from '@/data/topics/reproductive-physiology/sources';

type Q = QuestionDraft<ConceptId>;

const lesson1: Q[] = [
  tf({ id: 'q1-01', conceptId: 'reproduction', statement: 'Reproduction is essential for the survival of the individual.', answer: false, explanation: 'Male, slide 6: it is essential for the species, not the individual.', skill: 'misconception' }),
  multi('q1-02', 'male-organs', 'Which are male reproductive ducts? Select all that apply.', ['Epididymis', 'Ductus deferens', 'Ejaculatory duct', 'Urethra'], ['Seminal vesicle', 'Prostate'], { explanation: 'Male, slide 7.' }),
  multi('q1-03', 'male-organs', 'Which are male accessory glands? Select all that apply.', ['Seminal vesicles', 'Prostate', 'Bulbourethral glands'], ['Epididymis'], { explanation: 'Male, slide 8.' }),
  mcq('q1-04', 'testis-structure', 'Which tunic of the testis is derived from peritoneum?', 'Tunica vaginalis', ['Tunica albuginea', 'Tunica vasculosa', 'Dartos'], { explanation: 'Male, slide 11.' }),
  mcq('q1-05', 'testis-structure', 'Extensions of the tunica albuginea divide the testis into about how many lobules?', '250–300', ['10–20 lobules', '1000', '50'], { explanation: 'Male, slide 12.' }),
  mcq('q1-06', 'testis-structure', 'How many seminiferous tubules does each lobule contain?', '1 to 4', ['10 to 20', 'Exactly one', 'Over 100'], { explanation: 'Male, slide 15.' }),
  mcq('q1-07', 'testis-structure', 'Testicular veins drain into the…', 'Pampiniform plexus', ['Rete testis', 'Tubulus rectus', 'Lumbar lymph nodes'], { explanation: 'Male, slide 15; it forms the bulk of the spermatic cord.' }),
  mcq('q1-08', 'testis-structure', 'Testicular lymph drains to the…', 'Lumbar (aortic) nodes', ['Superficial inguinal nodes', 'Axillary nodes', 'Deep cervical nodes'], { explanation: 'Male, slide 16.' }),
  mcq('q1-09', 'sertoli-leydig', 'The blood–testis barrier divides the tubule into…', 'Basal and adluminal compartments', ['Cortex and medulla', 'Head, body and tail', 'Separate lobules of the testis'], { explanation: 'Male, slide 19.' }),
  mcq('q1-10', 'sertoli-leydig', 'Leydig cells produce…', 'Testosterone', ['Inhibin', 'Androgen-binding protein', 'Sperm'], { explanation: 'Male, slide 20.' }),
  tf({ id: 'q1-11', conceptId: 'sertoli-leydig', statement: 'Leydig cells are almost absent before puberty.', answer: true, explanation: 'Male, slide 20.' }),
  mcq('q1-12', 'testis-structure', 'About how long is each seminiferous tubule?', 'About 80 cm', ['About 8 mm', 'About 8 m', 'About 3.8 cm'], { explanation: 'Male, slide 15.' }),
  multi('q1-13', 'male-organs', 'Which are the male external genitalia? Select all that apply.', ['Scrotum', 'Penis'], ['Prostate', 'Epididymis'], { explanation: 'Male, slide 8.' }),
  mcq('q1-14', 'sertoli-leydig', 'Where are Leydig cells found?', 'In the interstitial tissue between seminiferous tubules', ['Inside the seminiferous tubules, beside the Sertoli cells', 'In the head of the epididymis', 'In the rete testis and efferent ductules'], { explanation: 'Male, slide 20.' }),
];

const lesson2: Q[] = [
  mcq('q2-01', 'spermatogenesis', 'Where does spermatogenesis occur?', 'In the seminiferous tubules', ['In the epididymis', 'In the vas deferens', 'In the prostate gland'], { explanation: 'Male, slide 22.' }),
  mcq('q2-02', 'spermatogenesis', 'Which cells are the stem cells of spermatogenesis?', 'Type A spermatogonia', ['Type B spermatogonia', 'Primary spermatocytes', 'Sertoli cells'], { explanation: 'Male, slides 22–23.' }),
  mcq('q2-03', 'spermatogenesis', 'Which cell first has a haploid number of chromosomes?', 'Secondary spermatocyte', ['Primary spermatocyte', 'Type B spermatogonium', 'Type A spermatogonium'], { explanation: 'Male, slide 23: after meiosis I.' }),
  mcq('q2-04', 'spermatogenesis', 'What are intercellular bridges thought to do?', 'Allow synchrony of germ cell maturation', ['Form the blood–testis barrier between cells', 'Release mature sperm into the tubule lumen', 'Carry testosterone between germ cells'], { explanation: 'Male, slide 24.' }),
  order('q2-05', 'spermatogenesis', 'Order the stages of spermiogenesis.', ['Golgi phase', 'Cap phase', 'Acrosome phase', 'Maturation phase'], { explanation: 'Male, slides 24–25.' }),
  fill('q2-06', 'spermatogenesis', 'Release of sperm into the lumen of the seminiferous tubule is called ____.', ['spermiation', 'Spermiation'], { explanation: 'Male, slide 25.', skill: 'terminology' }),
  mcq('q2-07', 'sperm-structure', 'The acrosome contains…', 'Hydrolytic enzymes', ['Mitochondria and fructose', 'Microtubules', 'Fructose'], { explanation: 'Male, slide 28.' }),
  mcq('q2-08', 'sperm-structure', 'What generates the energy for sperm swimming?', 'Mitochondria in the midpiece', ['The acrosome at the tip of the head', 'The condensed nucleus of the head', 'Fructose stored in the sperm head'], { explanation: 'Male, slide 29.' }),
  mcq('q2-09', 'sperm-maturation', 'How long can sperm be stored in the epididymis?', 'Up to 2 weeks', ['Up to 2 hours', 'Up to 6 months', '74 days'], { explanation: 'Male, slide 41.' }),
  mcq('q2-10', 'sperm-maturation', 'Where do sperm develop motility?', 'In the epididymis', ['In the seminiferous tubule', 'In the prostate', 'In the urethra'], { explanation: 'Male, slide 41.' }),
  mcq('q2-11', 'capacitation', 'How long does capacitation take?', '5–7 hours', ['5–7 minutes', '5–7 days', '74 days'], { explanation: 'Male, slide 42.' }),
  multi('q2-12', 'capacitation', 'Which changes are associated with capacitation? Select all that apply.', ['Influx of Ca²⁺', 'Increase in cAMP', 'Decrease in intracellular pH', 'Removal of seminal plasma proteins'], ['Loss of the tail'], { explanation: 'Male, slide 43.' }),
  multi('q2-13', 'capacitation', 'What can capacitated sperm do? Select all that apply.', ['Show hyperactivated motility', 'Undergo the acrosome reaction'], ['Divide by mitosis'], { explanation: 'Male, slide 43.' }),
];

const lesson3: Q[] = [
  mcq('q3-01', 'spermatogenesis-hormones', 'Which hormone is required to initiate spermatogenesis?', 'FSH', ['Testosterone', 'Prolactin', 'Oxytocin'], { explanation: 'Male, slide 33.' }),
  mcq('q3-02', 'spermatogenesis-hormones', 'Inhibin from Sertoli cells…', 'Has negative feedback on pituitary FSH secretion', ['Enhances FSH production by the pituitary', 'Concentrates testosterone in the tubules', 'Produces sperm from the spermatids'], { explanation: 'Male, slides 31–32.' }),
  mcq('q3-03', 'spermatogenesis-hormones', 'Activin…', 'Enhances FSH production', ['Inhibits FSH', 'Is made by Leydig cells', 'Increases testosterone synthesis'], { explanation: 'Male, slide 32: it also blocks testosterone synthesis in Leydig cells.' }),
  mcq('q3-04', 'spermatogenesis-hormones', 'Androgen-binding protein keeps testicular testosterone how much higher than in blood?', '20–50 times', ['2 times', '1000 times', 'The same as in blood'], { explanation: 'Male, slide 32.' }),
  mcq('q3-05', 'spermatogenesis-hormones', 'Where is testosterone converted to estrogen in the testis?', 'Sertoli cells, by aromatase', ['Leydig cells, by 5α-reductase', 'Spermatids', 'The epididymis'], { explanation: 'Male, slide 33; blocked by inhibin.' }),
  mcq('q3-06', 'testis-temperature', 'About how much cooler than the body are the testes kept?', 'About 3 °C', ['About 10 °C', 'About 0.5 °C', 'The same'], { explanation: 'Male, slide 38.' }),
  mcq('q3-07', 'testis-temperature', 'When the dartos muscle relaxes, the scrotal surface area…', 'Increases, so more heat is lost', ['Decreases, keeping heat in', 'Stays the same as before', 'Disappears into the inguinal canal'], { explanation: 'Male, slide 38.' }),
  multi('q3-08', 'testis-temperature', 'Which impair spermatogenesis? Select all that apply.', ['Anabolic steroids', 'Cadmium and lead', 'X-ray exposure', 'Alcohol'], ['Fructose'], { explanation: 'Male, slide 40.' }),
  order('q3-09', 'semen', 'Order the secretions as they appear in semen.', ['Bulbourethral glands', 'Prostate', 'Seminal vesicles'], { explanation: 'Male, slides 47–49.' }),
  mcq('q3-10', 'semen', 'What does the zinc in prostatic fluid do?', 'Stabilises the chromatin of sperm', ['Provides energy for the swimming sperm', 'Stimulates contraction of the uterus', 'Coagulates the semen after ejaculation'], { explanation: 'Male, slide 48.' }),
  mcq('q3-11', 'semen', 'Why is prostatic fluid alkaline?', 'To neutralise acidic residual urine and vaginal secretions', ['To feed the sperm with fructose and citrate', 'To coagulate the semen in the vagina', 'To lubricate the urethra before ejaculation'], { explanation: 'Male, slide 49.', skill: 'cause-effect' }),
  mcq('q3-12', 'semen', 'A sperm count below what value is considered low?', '15 million/mL', ['150 million/mL', '1 million/mL', '50 million/mL'], { explanation: 'Male, slide 50.' }),
  mcq('q3-13', 'semen', 'What is the normal pH of semen?', '7.0–8.3', ['4.5–5.5', '6.0–6.5', '9.0–10.0'], { explanation: 'Male, slide 50.' }),
  mcq('q3-14', 'semen', 'Prostaglandins in seminal fluid…', 'Stimulate uterine contractions that move semen up into the uterus', ['Feed the sperm on their way through the cervix', 'Neutralise the acid of the vagina and residual urine', 'Coagulate the semen so it stays near the cervix'], { explanation: 'Male, slide 50.' }),
];

const lesson4: Q[] = [
  mcq('q4-01', 'testosterone-transport', 'About what proportion of testosterone binds avidly to SHBG?', '65%', ['33%', '2%', '90%'], { explanation: 'Male, slide 52.' }),
  multi('q4-02', 'testosterone-transport', 'When is testosterone secreted at adult levels? Select all that apply.', ['First trimester of fetal life', 'Neonatal life', 'After puberty'], ['Throughout childhood'], { explanation: 'Male, slide 53.' }),
  mcq('q4-03', 'testosterone-action', 'Which enzyme converts testosterone to DHT?', '5α-reductase', ['Aromatase', '21-hydroxylase', '1α-hydroxylase'], { explanation: 'Male, slide 55.' }),
  mcq('q4-04', 'testosterone-action', 'How potent is DHT compared with testosterone?', '3–10 times more potent', ['Half as potent as testosterone', 'Equally potent', '100 times more potent'], { explanation: 'Male, slide 56.' }),
  tf({ id: 'q4-05', conceptId: 'testosterone-action', statement: 'Testosterone and DHT bind the same androgen receptor.', answer: true, explanation: 'Male, slide 56.' }),
  mcq('q4-06', 'testosterone-action', 'Where is the androgen receptor?', 'In the cytoplasm; the complex then binds DNA', ['On the cell membrane only, acting through cAMP', 'In the mitochondria of target cells', 'In the blood, bound to SHBG'], { explanation: 'Male, slide 56.' }),
  multi('q4-07', 'androgen-effects', 'Which are effects of androgens at puberty? Select all that apply.', ['Growth of the penis and prostate', 'Facial and chest hair', 'Pubertal growth spurt', 'Sebum production'], ['Breast enlargement'], { explanation: 'Male, slides 61–62.' }),
  mcq('q4-08', 'androgen-effects', 'How do androgens affect plasma lipoproteins?', 'Raise VLDL and lower HDL', ['Lower VLDL and raise HDL', 'No effect', 'Lower both'], { explanation: 'Male, slide 63.' }),
  mcq('q4-09', 'testicular-disorders', 'Cryptorchidism occurs in about what proportion of term boys?', '3–4%', ['30%', '0.1%', '15%'], { explanation: 'Male, slide 64; up to 30% of premature boys.' }),
  mcq('q4-10', 'testicular-disorders', 'Inguinoscrotal descent of the testis depends on…', 'Androgens', ['INSL3 (insulin-like 3)', 'Estrogen', 'Oxytocin'], { explanation: 'Male, slide 64.' }),
  mcq('q4-11', 'testicular-disorders', 'Secondary hypogonadism originates in…', 'The hypothalamus or pituitary', ['The testes themselves', 'The adrenal cortex', 'The prostate gland'], { explanation: 'Male, slide 67.' }),
  multi('q4-12', 'testicular-disorders', 'Which are features of a eunuch (hypogonadism before puberty)? Select all that apply.', ['High-pitched voice', 'Long arms and legs relative to the trunk', 'Gynaecomastia'], ['Increased muscle mass'], { explanation: 'Male, slide 69.' }),
  mcq('q4-13', 'testicular-disorders', 'Gonadotropin therapy for undescended testes succeeds in about…', '10–50%', ['100%', 'Under 1%', '90–95%'], { explanation: 'Male, slide 65.' }),
];

const lesson5: Q[] = [
  mcq('q5-01', 'female-organs', 'What connects the ovaries to the uterus?', 'The fallopian (uterine) tubes', ['The vagina', 'The cervix', 'The broad ligament (mesovarium)'], { explanation: 'Female, slide 1.' }),
  multi('q5-02', 'female-organs', 'Which make up the vulva? Select all that apply.', ['Mons pubis', 'Labia majora and minora', 'Clitoris', 'Greater vestibular glands'], ['Cervix'], { explanation: 'Female, slide 2.' }),
  mcq('q5-03', 'ovary', 'The ovary is covered by…', 'Simple cuboidal germinal epithelium', ['Stratified squamous epithelium', 'Peritoneum only, with no epithelium', 'Ciliated simple columnar epithelium'], { explanation: 'Female, slide 5.' }),
  mcq('q5-04', 'ovary', 'Where are the follicles?', 'In the ovarian cortex', ['In the medulla', 'In the tunica albuginea', 'In the fallopian tube'], { explanation: 'Female, slides 5–6.' }),
  mcq('q5-05', 'oogenesis', 'About how many oogonia are there at 24 weeks of gestation?', 'About 7 million', ['About 400,000', 'About 2 million', 'About 500'], { explanation: 'Female, slide 8.' }),
  mcq('q5-06', 'oogenesis', 'About how many oocytes remain at puberty?', 'About 400,000', ['About 7 million', 'About 2 million', 'About 40'], { explanation: 'Female, slide 9.' }),
  mcq('q5-07', 'oogenesis', 'How many oocytes complete the changes leading to ovulation in a lifetime?', '400–500', ['4,000–5,000', '40–50', 'About 2 million'], { explanation: 'Female, slide 9.' }),
  mcq('q5-08', 'oogenesis', 'Meiosis I divides the oocyte…', 'Unequally — a large secondary oocyte and a small polar body', ['Equally into two secondary oocytes of the same size', 'Into four ova, one of which survives', 'Without forming any polar body at all'], { explanation: 'Female, slide 10.' }),
  mcq('q5-09', 'ovarian-cycle', 'How long is the luteal phase?', '13–14 days', ['Variable, 7–21 days', '1 day', '28 days'], { explanation: 'Female, slide 14.' }),
  mcq('q5-10', 'ovarian-cycle', 'How many primordial follicles are recruited at the start of each cycle?', '30–40', ['1', '400–500', 'About 1000'], { explanation: 'Female, slide 14.' }),
  mcq('q5-11', 'ovarian-cycle', 'In which follicle does the zona pellucida first appear?', 'The primary follicle', ['The primordial follicle', 'The Graafian follicle', 'The corpus luteum'], { explanation: 'Female, slide 15.' }),
  mcq('q5-12', 'ovarian-cycle', 'The cumulus oophorus is…', 'Layers of granulosa cells around the oocyte in the Graafian follicle', ['The fluid that fills the antrum of the follicle', 'The theca externa around the whole follicle', 'The remnant of the corpus luteum after it regresses'], { explanation: 'Female, slide 17.' }),
  order('q5-13', 'ovarian-cycle', 'Order what happens to the follicle after ovulation without fertilisation.', ['Corpus haemorrhagicum', 'Corpus luteum', 'Corpus albicans'], { explanation: 'Female, slides 19–20.' }),
  mcq('q5-14', 'ovarian-cycle', 'How large is a Graafian follicle?', '1.5–2.5 cm', ['1–2 mm (0.1–0.2 cm)', '10–15 cm', '120 µm'], { explanation: 'Female, slide 17.' }),
];

const lesson6: Q[] = [
  order('q6-01', 'uterine-cycle', 'Order the phases of the uterine cycle.', ['Menstrual', 'Proliferative', 'Secretory', 'Premenstrual'], { explanation: 'Female, slide 22.' }),
  mcq('q6-02', 'uterine-cycle', 'Which layer of the endometrium is shed at menstruation?', 'Stratum functionale', ['Stratum basale', 'Myometrium', 'Perimetrium'], { explanation: 'Female, slide 23.' }),
  mcq('q6-03', 'uterine-cycle', 'Why does menstrual blood not clot?', 'Fibrinolysin from the degenerating endometrium', ['It contains heparin from the endometrium', 'It lacks platelets after leaving the uterus', 'Estrogen in the blood prevents clotting'], { explanation: 'Female, slide 24.', skill: 'cause-effect' }),
  mcq('q6-04', 'uterine-cycle', 'Menstrual blood loss above what volume is abnormal?', '80 mL', ['30 mL', '10 mL', '200 mL'], { explanation: 'Female, slide 24.' }),
  mcq('q6-05', 'uterine-cycle', 'Which hormone drives the proliferative phase?', 'Estrogen', ['Progesterone', 'Prolactin', 'hCG'], { explanation: 'Female, slide 25.' }),
  mcq('q6-06', 'uterine-cycle', 'In the premenstrual phase, what constricts the spiral arteries?', 'Locally produced prostaglandins', ['Estrogen from the dominant follicle', 'Oxytocin from the posterior pituitary', 'Noradrenaline released from the ovary'], { explanation: 'Female, slide 26.' }),
  mcq('q6-07', 'cyclic-changes', 'Under progesterone, the vaginal epithelium…', 'Becomes infiltrated with leucocytes', ['Becomes cornified and thick', 'Is shed completely', 'Secretes clear mucus'], { explanation: 'Female, slide 34.' }),
  mcq('q6-08', 'cyclic-changes', 'Why does basal body temperature rise after ovulation?', 'Progesterone secretion increases', ['Estrogen secretion falls', 'FSH secretion rises', 'The ruptured follicle bleeds'], { explanation: 'Female, slide 35.', skill: 'cause-effect' }),
  mcq('q6-09', 'hpo-axis', 'FSH receptors are on…', 'Granulosa cells', ['Theca cells', 'The oocyte', 'The endometrium only'], { explanation: 'Female, slide 37: LH receptors are on theca cells.' }),
  mcq('q6-10', 'hpo-axis', 'The LH surge occurs how long before ovulation?', '34–36 hours', ['14 days', '2–3 hours', 'About 7 days'], { explanation: 'Female, slide 39.' }),
  mcq('q6-11', 'hpo-axis', 'What triggers the LH surge?', 'High estrogen switching to positive feedback', ['Falling estrogen at the end of the follicular phase', 'Rising progesterone from the corpus luteum', 'Inhibin from the dominant follicle'], { explanation: 'Female, slide 38.' }),
  mcq('q6-12', 'hpo-axis', 'Without pregnancy, the corpus luteum lasts about…', '12–16 days', ['2–3 days', 'About 40 days', 'Six months'], { explanation: 'Female, slide 40.' }),
  multi('q6-13', 'hpo-axis', 'Which can override the signals for ovulation? Select all that apply.', ['Caloric deprivation', 'Habitual strenuous exercise', 'Stress'], ['A normal diet'], { explanation: 'Female, slide 44.' }),
];

const lesson7: Q[] = [
  mcq('q7-01', 'menstrual-disorders', 'How can hyperprolactinaemia cause anovulation?', 'It lowers the hormones that trigger ovulation', ['It raises LH too high for ovulation', 'It destroys the oocytes in the ovary', 'It blocks the cervix with thick mucus'], { explanation: 'Female, slide 46.' }),
  mcq('q7-02', 'menstrual-disorders', 'Primary amenorrhoea is…', 'Menarche delayed beyond 15 years', ['No period for 3 months after menarche', 'Painful periods', 'Cycles under 21 days'], { explanation: 'Female, slide 47.', skill: 'terminology' }),
  mcq('q7-03', 'menstrual-disorders', 'The most common cause of secondary amenorrhoea listed is…', 'Pregnancy', ['A uterine abnormality', 'Prolactinoma', 'Menopause'], { explanation: 'Female, slide 48.' }),
  mcq('q7-04', 'menstrual-disorders', 'Oligomenorrhoea means cycles…', 'Longer than 36 days', ['Shorter than 21 days', 'With heavy bleeding', 'With pain'], { explanation: 'Female, slide 49.', skill: 'terminology' }),
  mcq('q7-05', 'menstrual-disorders', 'Polymenorrhoea implies…', 'Higher estrogen production', ['Lower estrogen production', 'No ovulation in any cycle', 'An early pregnancy'], { explanation: 'Female, slide 50.' }),
  mcq('q7-06', 'menstrual-disorders', 'Dysmenorrhoea is mostly due to…', 'Accumulation of prostaglandins', ['Excess estrogen from the ovary', 'Fibrinolysin from the endometrium', 'Low prolactin during menstruation'], { explanation: 'Female, slide 51.' }),
  multi('q7-07', 'menstrual-disorders', 'Which are causes of menorrhagia? Select all that apply.', ['Uterine fibroids', 'Cervical polyps', 'Endometrial polyps'], ['Lactation'], { explanation: 'Female, slides 50–51.' }),
  mcq('q7-08', 'estrogens', 'Which enzyme converts androgens to estrogens?', 'Aromatase', ['5α-reductase', 'Carbonic anhydrase', '17α-hydroxylase'], { explanation: 'Female, slide 52.' }),
  mcq('q7-09', 'estrogens', 'What proportion of plasma estrogen is free?', '2%', ['38%', '60%', '80%'], { explanation: 'Female, slide 53.' }),
  multi('q7-10', 'estrogens', 'Which are effects of estrogens? Select all that apply.', ['Inhibit bone resorption', 'Lower plasma cholesterol', 'Some salt and water retention', 'Growth of breast ducts'], ['Thermogenic effect'], { explanation: 'Female, slides 55–56: progesterone is thermogenic.' }),
  mcq('q7-11', 'progestins', 'What proportion of progesterone is bound to albumin?', '80%', ['60%', '18%', '2%'], { explanation: 'Female, slide 58.' }),
  multi('q7-12', 'progestins', 'Which are CNS effects of progesterone? Select all that apply.', ['Increased appetite', 'Decreased wakefulness', 'Greater respiratory sensitivity to CO₂'], ['Increased libido'], { explanation: 'Female, slide 61.' }),
  mcq('q7-13', 'relaxin-inhibin', 'Relaxin structurally resembles…', 'Proinsulin', ['Growth hormone', 'Oxytocin', 'Cholesterol'], { explanation: 'Female, slide 61.' }),
  mcq('q7-14', 'relaxin-inhibin', 'Inhibin from granulosa cells…', 'Inhibits FSH release', ['Stimulates FSH', 'Causes ovulation', 'Maintains the corpus luteum'], { explanation: 'Female, slide 62.' }),
];

const lesson8: Q[] = [
  mcq('q8-01', 'puberty', 'Which receptor does kisspeptin act on?', 'GPR54', ['The androgen receptor', 'The LH receptor', 'The leptin receptor'], { explanation: 'Sexual Response, slide 2.' }),
  mcq('q8-02', 'puberty', 'Which hormone from fat cells may help time puberty?', 'Leptin', ['Insulin', 'Adiponectin', 'Ghrelin'], { explanation: 'Sexual Response, slides 1–2.' }),
  order('q8-03', 'puberty', 'Order the usual signs of puberty in girls.', ['Thelarche (breasts)', 'Pubarche (pubic hair)', 'Menarche'], { explanation: 'Sexual Response, slide 4.' }),
  mcq('q8-04', 'puberty', 'In boys, puberty usually begins with…', 'Enlargement of the testes and penis', ['Growth of facial hair', 'Deepening of the voice', 'Acne on the face and back'], { explanation: 'Sexual Response, slide 5.' }),
  mcq('q8-05', 'puberty', 'Precocious puberty in boys is puberty before age…', '9', ['12', '14', '6'], { explanation: 'Sexual Response, slide 7.' }),
  mcq('q8-06', 'puberty', 'Delayed puberty in boys is defined by no testicular enlargement by age…', '14', ['10', '16', '18'], { explanation: 'Sexual Response, slide 7.' }),
  mcq('q8-07', 'climacteric', 'A woman has reached menopause when she has had no period for…', '12 months in a row', ['3 months in a row', '6 months in a row', '24 months in a row'], { explanation: 'Sexual Response, slide 17.' }),
  mcq('q8-08', 'climacteric', 'Why do the ovaries fail at menopause?', 'Oocytes decline and the remaining follicles resist FSH', ['FSH secretion stops at about 50', 'The uterus stops responding to the ovary', 'Prolactin rises and suppresses the follicles'], { explanation: 'Sexual Response, slides 17–18.' }),
  tf({ id: 'q8-09', conceptId: 'climacteric', statement: 'Men lose reproductive competence completely, as women do at menopause.', answer: false, explanation: 'Sexual Response, slide 10: it persists into the eighth decade in men.', skill: 'misconception' }),
  mcq('q8-10', 'erection', 'Which nerves carry the parasympathetic outflow for erection?', 'Nervi erigentes', ['Pudendal motor nerves', 'Hypogastric nerves', 'Vagus'], { explanation: 'Sexual Response, slides 26–27.' }),
  mcq('q8-11', 'erection', 'NO causes erection by activating…', 'Guanylate cyclase, raising cGMP', ['Adenylate cyclase, raising cAMP', 'Phospholipase C', 'Myosin light-chain kinase'], { explanation: 'Sexual Response, slides 32–33.' }),
  multi('q8-12', 'erection', 'Which raise cAMP in cavernous smooth muscle? Select all that apply.', ['VIP', 'PGE1'], ['NO', 'Noradrenaline'], { explanation: 'Sexual Response, slide 34.' }),
  mcq('q8-13', 'erection', 'Why is blood trapped in the corpora cavernosa?', 'Venules are compressed against the tunica albuginea', ['Valves close in the deep dorsal vein', 'The helicine arteries constrict', 'Blood clots in the sinusoids'], { explanation: 'Sexual Response, slide 27.' }),
  mcq('q8-14', 'erection', 'How does erection end?', 'Increased adrenergic activity constricting the smooth muscle', ['More NO release from the nerves, relaxing the smooth muscle further', 'Increased parasympathetic activity', 'Rising cGMP in the smooth muscle'], { explanation: 'Sexual Response, slide 38.' }),
];

const lesson9: Q[] = [
  mcq('q9-01', 'fertilisation', 'What proportion of ejaculated sperm reach the ampulla?', 'About 1%', ['About 50%', 'About 99%', 'About 10%'], { explanation: 'Sexual Response, slide 41.' }),
  mcq('q9-02', 'fertilisation', 'Why do many sperm die in the vagina?', 'Its environment is slightly acidic', ['It is too alkaline for them', 'It is too cold for them', 'Antibodies attack them at once'], { explanation: 'Sexual Response, slides 40–41.' }),
  mcq('q9-03', 'fertilisation', 'Which zona pellucida glycoprotein does the sperm bind?', 'ZP3', ['ZP1', 'hCG', 'Inhibin'], { explanation: 'Sexual Response, slide 42.' }),
  mcq('q9-04', 'fertilisation', 'The earliest event of oocyte activation is…', 'Release of Ca²⁺ from the ER as a wave', ['Completion of the first meiotic division', 'Formation of the blastocyst cavity', 'Secretion of hCG by the trophoblast'], { explanation: 'Sexual Response, slide 43.' }),
  order('q9-05', 'fertilisation', 'Order the events of fertilisation.', ['Sperm crosses the cumulus', 'Binds ZP3 and undergoes the acrosome reaction', 'Fuses with the oolemma', 'Cortical reaction', 'Pronuclei fuse into a zygote'], { explanation: 'Sexual Response, slides 41–44.' }),
  mcq('q9-06', 'implantation', 'When does the morula reach the uterus?', 'In about 4 days', ['Within hours', 'In about 14 days', 'In about a month'], { explanation: 'Sexual Response, slide 49.' }),
  mcq('q9-07', 'implantation', 'Which trophoblast layer invades the decidua and forms chorionic villi?', 'Syncytiotrophoblast', ['Cytotrophoblast', 'Inner cell mass (embryoblast)', 'Decidual cells'], { explanation: 'Sexual Response, slide 53.' }),
  mcq('q9-08', 'implantation', 'By when is the placenta fully developed?', 'Between the third and fourth months', ['By the end of the first week', 'At term, just before birth', 'By the end of the second month'], { explanation: 'Sexual Response, slide 54.' }),
  multi('q9-09', 'placenta', 'Which hormones does the syncytiotrophoblast secrete? Select all that apply.', ['hCG', 'hCS/hPL', 'Progesterone', 'Relaxin'], ['FSH'], { explanation: 'Sexual Response, slides 58–59.' }),
  multi('q9-10', 'placenta', 'What are the two driving forces for placental transport? Select all that apply.', ['Concentration gradient', 'Electrical gradient'], ['Gravity'], { explanation: 'Sexual Response, slide 60.' }),
  multi('q9-11', 'placenta', 'What are the placenta’s two immunological roles? Select all that apply.', ['Passive immunity to the fetus', 'Suppressing the mother’s immune response to the fetus'], ['Making the fetus’s antibodies'], { explanation: 'Sexual Response, slide 58.' }),
  mcq('q9-12', 'pregnancy-changes', 'Why is gonadotropin secretion suppressed in pregnancy?', 'Inhibitory effects of estrogens and progesterone', ['The pituitary shrinks in pregnancy', 'hCG blocks the gonadotroph receptors', 'Prolactin falls and removes stimulation'], { explanation: 'Sexual Response, slide 61.' }),
  multi('q9-13', 'pregnancy-changes', 'Which increase during pregnancy? Select all that apply.', ['Aldosterone and cortisol', 'PTH', 'Insulin secretion (second half)'], ['FSH and LH'], { explanation: 'Sexual Response, slides 61–62.' }),
];

const lesson10: Q[] = [
  mcq('q10-01', 'parturition-hormones', 'Which hormone decreases uterine motility?', 'Progesterone', ['Estrogen', 'Oxytocin', 'PGF2α'], { explanation: 'Sexual Response, slides 65–66.' }),
  mcq('q10-02', 'parturition-hormones', 'By how much do myometrial oxytocin receptors increase in pregnancy?', 'More than 100-fold', ['About 2-fold', 'About 10% more', 'They decrease in number'], { explanation: 'Sexual Response, slide 67.' }),
  mcq('q10-03', 'parturition-hormones', 'Which prostaglandin may ripen the cervix?', 'PGE2', ['PGF2α', 'PGI2', 'Thromboxane'], { explanation: 'Sexual Response, slide 68.' }),
  mcq('q10-04', 'parturition-hormones', 'What produces markedly more CRH at the end of gestation?', 'The placenta', ['The maternal hypothalamus only', 'The uterus', 'The fetal lungs'], { explanation: 'Sexual Response, slide 68.' }),
  mcq('q10-05', 'parturition-hormones', 'Fetal cortisol is required for…', 'Maturation of the fetal lungs', ['Growth of the fetal bones', 'Production of milk after birth', 'Ripening of the cervix only'], { explanation: 'Sexual Response, slide 70.' }),
  mcq('q10-06', 'parturition-hormones', 'How may relaxin keep the uterus quiet in pregnancy?', 'By down-regulating oxytocin receptors', ['By raising oxytocin release', 'By raising prostaglandin output', 'By blocking progesterone receptors'], { explanation: 'Sexual Response, slide 71.' }),
  mcq('q10-07', 'parturition-mechanics', 'Why do multiple pregnancies tend to be shorter?', 'The mechanical stretch stimuli come earlier', ['They produce less progesterone than one placenta', 'They have less oxytocin acting on the uterus', 'They have more relaxin, which shortens labour'], { explanation: 'Sexual Response, slide 75.', skill: 'cause-effect' }),
  mcq('q10-08', 'lactation', 'When does copious milk secretion (lactogenesis II) start?', 'About 40 hours after birth', ['During the second trimester', 'Immediately at delivery', 'Two weeks after birth'], { explanation: 'Sexual Response, slide 81.' }),
  multi('q10-09', 'lactation', 'What is needed for lactogenesis II? Select all that apply.', ['A developed mammary epithelium', 'High plasma prolactin', 'A fall in estrogen and progesterone'], ['High progesterone'], { explanation: 'Sexual Response, slide 81.' }),
  mcq('q10-10', 'lactation', 'The feedback inhibitor of lactation (FIL)…', 'Builds up if milk stays in the breast, slowing production', ['Is released by the anterior pituitary during suckling', 'Ejects milk from the alveoli into the ducts', 'Triggers the return of menstruation after birth'], { explanation: 'Sexual Response, slides 82–83.' }),
  mcq('q10-11', 'lactation', 'Which cells contract to eject milk?', 'Myoepithelial cells around the alveoli', ['Alveolar secretory cells', 'Smooth muscle of the nipple only', 'Epithelium lining the lactiferous ducts'], { explanation: 'Sexual Response, slide 84.' }),
  mcq('q10-12', 'milk-amenorrhoea', 'Compared with mature milk, colostrum has…', 'More protein and IgA', ['More lactose', 'More fat', 'More water-soluble vitamins'], { explanation: 'Sexual Response, slides 86–87.' }),
  mcq('q10-13', 'milk-amenorrhoea', 'Which hypothalamic substance links suckling to lactational amenorrhoea?', 'β-endorphin', ['Dopamine', 'Oxytocin', 'GnRH'], { explanation: 'Sexual Response, slide 88.' }),
  mcq('q10-14', 'milk-amenorrhoea', 'The principal mechanism suppressing ovulation in lactational amenorrhoea is…', 'Impaired pulsatile LH secretion', ['Excess FSH secretion', 'Destruction of the follicles', 'A high progesterone level'], { explanation: 'Sexual Response, slide 89.' }),
  match('q10-15', 'milk-amenorrhoea', 'Match each hormone to its role in lactation.', [
    ['Prolactin', 'Long-term maintenance of milk production'],
    ['Oxytocin', 'Milk ejection'],
    ['Dopamine', 'Inhibits prolactin'],
  ], { explanation: 'Sexual Response, slides 82–89.' }),
];

export const questions: Q[] = [...lesson1, ...lesson2, ...lesson3, ...lesson4, ...lesson5, ...lesson6, ...lesson7, ...lesson8, ...lesson9, ...lesson10];

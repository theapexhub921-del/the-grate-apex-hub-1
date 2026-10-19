// Physiology → Reproductive Physiology — one simulation per lesson (models in
// data/simulations/). Each starts with predictions answered BEFORE the model runs the change.
// Prediction IDs: sN-xx.
import type { InteractiveDraft } from '@/data/topics/build';
import { mcq, simulate } from '@/data/topics/build';
import { fe, ma, sr, TOPIC_ID, type ConceptId } from '@/data/topics/reproductive-physiology/sources';
import { direction, insertSimulation, predict } from '@/data/topics/sim-helpers';

type Step = InteractiveDraft<ConceptId>;
const L = (n: number) => `${TOPIC_ID}-${n}`;

export const simulations: Record<string, Step> = {
  [L(1)]: simulate({
    sim: 'male-tract',
    title: 'The testis’s two jobs',
    intro: 'Cut or block the ducts, or lose the Leydig or Sertoli cells, and see what happens to the sperm, the semen and the testosterone.',
    sourceRefs: ma([7, 8, 18, 20, 47, 50]),
    predictions: [
      {
        question: direction('s1-01', 'male-organs', 'Both ductus deferens are cut (a vasectomy). What happens to the testosterone in the blood?', 'same', 'The testes have two separate jobs: the ducts carry sperm out, but Leydig cells release testosterone straight into the blood (slides 7, 20).'),
        set: { block: 1 },
        watch: 'testosterone',
        expect: [
          { readout: 'testosterone', change: 'same' },
          { readout: 'count', change: 'down' },
        ],
      },
      {
        question: mcq('s1-02', 'semen', 'After the vasectomy, what happens to the volume of semen?', 'It falls only a little', ['It falls to almost nothing', 'It doubles'], {
          ...predict,
          explanation: 'Sperm are only 2–3% of semen; the seminal vesicles (~60%) and prostate (~30%) still add their secretions (slide 47).',
        }),
        set: { block: 1 },
        watch: 'volume',
        expect: [
          { readout: 'volume', change: 'down' },
          { readout: 'volume', equals: 2.98, tolerance: 0.01 },
        ],
      },
      {
        question: direction('s1-03', 'sertoli-leydig', 'The Leydig cells are lost. What happens to sperm production?', 'down', 'Leydig cells make testosterone, which spermatogenesis needs to be maintained (slides 20, 33).'),
        set: { leydig: 0 },
        watch: 'count',
        expect: [{ readout: 'count', change: 'down' }],
      },
    ],
  }),

  [L(2)]: simulate({
    sim: 'spermatogenesis',
    title: 'From spermatogonium to sperm',
    intro: 'Follow one cell for 100 days — through the tubule wall, into the epididymis — then into the female tract until it can fertilise.',
    sourceRefs: ma([22, 23, 24, 25, 41, 42, 43]),
    predictions: [
      {
        question: mcq('s2-01', 'spermatogenesis', 'Day 39: the primary spermatocyte has completed meiosis I. How many chromosomes does each daughter cell have?', '23', ['46', '92'], {
          ...predict,
          explanation: 'Meiosis I produces two haploid secondary spermatocytes (slide 22).',
        }),
        set: { day: 39 },
        watch: 'chromosomes',
        expect: [{ readout: 'chromosomes', equals: 23 }],
      },
      {
        question: mcq('s2-02', 'sperm-maturation', 'Day 80: the sperm has been released from the tubule. Where is it, and what is happening?', 'In the epididymis, maturing and gaining motility', ['In the vas deferens, already able to fertilise', 'Still in the tubule, as a spermatid'], {
          ...predict,
          explanation: 'Sperm pass into the epididymis, where they are stored for up to two weeks, mature and develop motility (slide 41).',
        }),
        set: { day: 80 },
        watch: 'place',
        expect: [{ readout: 'place', equals: 3 }],
      },
      {
        question: mcq('s2-03', 'capacitation', 'The sperm has just been ejaculated (1 hour in the female tract). Can it fertilise yet?', 'No — capacitation takes 5–7 hours', ['Yes, straight away', 'Only after several days'], {
          ...predict,
          explanation: 'Freshly ejaculated sperm can barely fertilise; capacitation in the female tract takes 5–7 hours (slide 42).',
        }),
        from: { day: 96 },
        set: { hours: 1 },
        watch: 'capacitated',
        expect: [{ readout: 'capacitated', equals: 0 }],
      },
    ],
  }),

  [L(3)]: simulate({
    sim: 'testis-control',
    title: 'Control of sperm production',
    intro: 'Switch GnRH off, take anabolic steroids, or warm the testes to body temperature, and watch the hormones and the sperm count.',
    sourceRefs: ma([31, 32, 33, 35, 38, 40]),
    predictions: [
      {
        question: direction('s3-01', 'testis-temperature', 'The testes sit at body temperature instead of in the scrotum. What happens to the sperm count?', 'down', 'Body temperature is too warm for spermatogenesis; the scrotum normally keeps the testes about 3 °C cooler (slides 35–38).'),
        set: { warm: 1 },
        watch: 'count',
        expect: [{ readout: 'count', change: 'down' }],
      },
      {
        question: direction('s3-02', 'spermatogenesis-hormones', 'A bodybuilder takes anabolic steroids. What happens to the testosterone in his blood?', 'up', 'The drug adds to the blood level — even though the testes themselves are switched off (slide 40).'),
        set: { steroids: 1 },
        watch: 'blood',
        expect: [{ readout: 'blood', change: 'up' }],
      },
      {
        question: direction('s3-03', 'spermatogenesis-hormones', 'And his sperm count?', 'down', 'Testosterone inside the tubules — kept 20–50 times higher than the blood’s by ABP — comes from his own Leydig cells. With LH suppressed they make little, so spermatogenesis falls (slides 32–33, 40).'),
        set: { steroids: 1 },
        watch: 'count',
        expect: [
          { readout: 'count', change: 'down' },
          { readout: 'inside', change: 'down' },
        ],
      },
    ],
  }),

  [L(4)]: simulate({
    sim: 'androgens',
    title: 'Testosterone and DHT',
    intro: 'Change SHBG, remove 5α-reductase, or make the testes or the pituitary fail — and follow testosterone, its free fraction, DHT and LH.',
    sourceRefs: ma([52, 55, 56, 57, 67, 68]),
    predictions: [
      {
        question: direction('s4-01', 'testosterone-transport', 'SHBG in the blood doubles, as in andropause. What happens to the free fraction of testosterone?', 'down', 'More SHBG binds more testosterone avidly; only the free (and loosely bound) fraction is bioavailable (slide 52).'),
        set: { shbg: 2 },
        watch: 'free',
        expect: [{ readout: 'free', change: 'down' }],
      },
      {
        question: mcq('s4-02', 'testosterone-action', 'A genetically male fetus lacks 5α-reductase. What are the external genitalia like?', 'Underdeveloped or ambiguous', ['Normal male', 'Normal, but the internal ducts are missing'], {
          ...predict,
          explanation: 'Without DHT the external genitalia (and prostate) do not develop fully, though the internal genitalia — driven by testosterone — are male (slides 56–57).',
        }),
        set: { reductase: 0 },
        watch: 'external',
        expect: [
          { readout: 'external', equals: 1 },
          { readout: 'dht', change: 'down' },
        ],
      },
      {
        question: direction('s4-03', 'testicular-disorders', 'The testes themselves fail (primary hypogonadism). What happens to LH?', 'up', 'With little testosterone to feed back, the pituitary releases more LH — the testes simply cannot respond (slides 67–68).'),
        set: { gonads: 1 },
        watch: 'lh',
        expect: [{ readout: 'lh', change: 'up' }],
      },
    ],
  }),

  [L(5)]: simulate({
    sim: 'ovarian-cycle',
    title: 'The follicle and the corpus luteum',
    intro: 'Move through the 28 days of the ovarian cycle: watch the follicle grow, ovulate and turn into a corpus luteum — and see what fertilisation changes.',
    sourceRefs: fe([9, 10, 13, 14, 15, 16, 17, 19, 20]),
    predictions: [
      {
        question: mcq('s5-01', 'oogenesis', 'On day 6, where is the oocyte in its meiosis?', 'Arrested in prophase of meiosis I', ['Arrested in metaphase of meiosis II', 'Meiosis completed'], {
          ...predict,
          explanation: 'Primary oocytes stop in prophase of meiosis I in fetal life and stay there until just before ovulation (slides 8–10).',
        }),
        set: { day: 6 },
        watch: 'oocyte',
        expect: [{ readout: 'oocyte', equals: 0 }],
      },
      {
        question: direction('s5-02', 'ovarian-cycle', 'From day 6 to day 13, what happens to the size of the dominant follicle?', 'up', 'The antral follicle becomes the Graafian follicle, 1.5–2.5 cm across, filled with follicular fluid (slides 16–17).'),
        set: { day: 13 },
        watch: 'size',
        expect: [{ readout: 'size', change: 'up' }],
      },
      {
        question: direction('s5-03', 'ovarian-cycle', 'Day 27, and the oocyte was fertilised. Compared with no fertilisation, how active is the corpus luteum?', 'up', 'Without fertilisation the corpus luteum degenerates after about 14 days; hCG from the implanting embryo rescues it (slide 20).'),
        from: { day: 27 },
        set: { fertilised: 1 },
        watch: 'luteum',
        expect: [{ readout: 'luteum', change: 'up' }],
      },
    ],
  }),

  [L(6)]: simulate({
    sim: 'menstrual-cycle',
    title: 'Hormones of the menstrual cycle',
    intro: 'Move day by day through the cycle and watch FSH, LH, estradiol and progesterone — and the endometrium, the cervical mucus and the temperature they control.',
    sourceRefs: fe([22, 24, 26, 31, 35, 36, 37, 38, 40, 44]),
    predictions: [
      {
        question: direction('s6-01', 'hpo-axis', 'From day 12 to day 14, what happens to LH?', 'up', 'High estrogen switches to positive feedback: a surge of LH 34–36 hours before ovulation (slide 38).'),
        from: { day: 12 },
        set: { day: 14 },
        watch: 'lh',
        expect: [{ readout: 'lh', change: 'up' }],
      },
      {
        question: direction('s6-02', 'cyclic-changes', 'From day 10 to day 21, what happens to the basal body temperature?', 'up', 'Progesterone from the corpus luteum is thermogenic: the temperature rises at ovulation and stays up until menstruation (slide 35).'),
        from: { day: 10 },
        set: { day: 21 },
        watch: 'temp',
        expect: [
          { readout: 'temp', change: 'up' },
          { readout: 'p4', change: 'up' },
        ],
      },
      {
        question: direction('s6-03', 'hpo-axis', 'On day 28, compared with a cycle without pregnancy, what is progesterone like when the woman is pregnant?', 'up', 'hCG from the trophoblast maintains the corpus luteum, so progesterone stays high and the endometrium is not shed (slide 40).'),
        from: { day: 28 },
        set: { condition: 1 },
        watch: 'p4',
        expect: [{ readout: 'p4', change: 'up' }],
      },
    ],
  }),

  [L(7)]: simulate({
    sim: 'ovulation-disorders',
    title: 'When ovulation stops',
    intro: 'Choose a cause — a prolactinoma, low body weight, pregnancy or menopause — and see which hormones change and whether ovulation and periods continue.',
    sourceRefs: fe([45, 46, 47, 48, 55, 61, 62]),
    predictions: [
      {
        question: direction('s7-01', 'menstrual-disorders', 'A prolactinoma makes prolactin very high. What happens to GnRH pulses?', 'down', 'Hyperprolactinaemia lowers the hormones that trigger ovulation, starting with GnRH (slides 45–46).'),
        set: { cause: 1 },
        watch: 'gnrh',
        expect: [
          { readout: 'gnrh', change: 'down' },
          { readout: 'ovulates', equals: 0 },
        ],
      },
      {
        question: direction('s7-02', 'menstrual-disorders', 'A young athlete trains very hard and loses weight. What happens to her estrogen?', 'down', 'Caloric deprivation and strenuous exercise override the hypothalamic signals: less GnRH, FSH and LH, so the follicles make little estrogen (slides 44, 47).'),
        set: { cause: 2 },
        watch: 'e2',
        expect: [{ readout: 'e2', change: 'down' }],
      },
      {
        question: direction('s7-03', 'estrogens', 'At menopause estrogen falls. What happens to the rate of bone loss?', 'up', 'Estrogens inhibit bone resorption; without them bone is lost faster (slide 56).'),
        set: { cause: 4 },
        watch: 'bone',
        expect: [{ readout: 'bone', change: 'up' }],
      },
    ],
  }),

  [L(8)]: simulate({
    sim: 'lifespan',
    title: 'From puberty to the climacteric',
    intro: 'Choose a sex and move through the years: watch kisspeptin switch on GnRH at puberty, the signs appear in order, and the hormones change at menopause and andropause.',
    sourceRefs: sr([1, 2, 3, 4, 5, 7, 10, 12, 17]),
    predictions: [
      {
        question: direction('s8-01', 'puberty', 'A girl grows from 8 to 12. What happens to GnRH activity?', 'up', 'A change in hypothalamic kisspeptin and its receptor switches on GnRH, which drives LH and FSH (slides 2–3).'),
        set: { age: 12 },
        watch: 'gnrh',
        expect: [{ readout: 'gnrh', change: 'up' }],
      },
      {
        question: mcq('s8-02', 'puberty', 'At 12, which is usually the first sign of puberty in a girl?', 'Breast development (thelarche)', ['First period (menarche)', 'Pubic hair (pubarche)'], {
          ...predict,
          explanation: 'In girls thelarche comes first, then pubarche, and menarche last (slides 4–5).',
        }),
        set: { age: 12 },
        watch: 'sign',
        expect: [{ readout: 'sign', equals: 1 }],
      },
      {
        question: direction('s8-03', 'climacteric', 'A woman goes from 45 to 55. What happens to her FSH?', 'up', 'At menopause the follicles resist FSH and estrogen falls, so FSH is no longer held down (slides 17–18).'),
        from: { age: 45 },
        set: { age: 55 },
        watch: 'fsh',
        expect: [
          { readout: 'fsh', change: 'up' },
          { readout: 'steroid', change: 'down' },
        ],
      },
    ],
  }),

  [L(9)]: simulate({
    sim: 'fertilisation',
    title: 'Fertilisation and implantation',
    intro: 'Follow the embryo from the ampulla to the uterus over ten days. Change the sperm count, break the block to polyspermy, or stop hCG.',
    sourceRefs: sr([40, 41, 43, 44, 49, 52, 55]),
    predictions: [
      {
        question: mcq('s9-01', 'fertilisation', 'Where does fertilisation usually take place?', 'In the ampulla of the uterine tube', ['In the uterus', 'In the ovary'], {
          ...predict,
          explanation: 'Fertilisation usually occurs in the ampulla; only about 1% of sperm get there (slides 40–41).',
        }),
        set: { day: 0 },
        watch: 'place',
        expect: [{ readout: 'place', equals: 0 }],
      },
      {
        question: mcq('s9-02', 'implantation', 'Day 4 after fertilisation. Where is the embryo?', 'Entering the uterus, as a morula', ['Still in the ampulla, as a zygote', 'Implanted in the decidua'], {
          ...predict,
          explanation: 'Rapid division for 2–3 days makes a morula, which reaches the uterus in about 4 days (slide 49).',
        }),
        set: { day: 4 },
        watch: 'stage',
        expect: [{ readout: 'stage', equals: 3 }],
      },
      {
        question: direction('s9-03', 'implantation', 'Day 10: the embryo implants but makes no hCG. Compared with when hCG is made, how active is the corpus luteum?', 'down', 'hCG from the syncytiotrophoblast maintains the corpus luteum and prevents menstruation; without it the corpus luteum regresses (slide 55).'),
        from: { day: 10 },
        set: { hcg: 0 },
        watch: 'luteum',
        expect: [{ readout: 'luteum', change: 'down' }],
      },
    ],
  }),

  [L(10)]: simulate({
    sim: 'labour-lactation',
    title: 'Labour and breastfeeding',
    intro: 'Watch labour build by positive feedback — and break it by blocking oxytocin or prostaglandins. Then switch to breastfeeding: suckling, milk ejection and lactational amenorrhoea.',
    sourceRefs: sr([66, 67, 68, 74, 75, 81, 82, 84, 85, 88, 89]),
    predictions: [
      {
        question: direction('s10-01', 'parturition-mechanics', 'Labour goes on from 2 to 6 hours. What happens to the oxytocin released?', 'up', 'Stretch of the cervix releases oxytocin, which strengthens contractions, which stretch the cervix more — positive feedback (slide 74).'),
        set: { hours: 6 },
        watch: 'oxytocin',
        expect: [
          { readout: 'oxytocin', change: 'up' },
          { readout: 'dilation', change: 'up' },
        ],
      },
      {
        question: direction('s10-02', 'parturition-hormones', 'At 8 hours, prostaglandin synthesis is blocked. Compared with normal, how far has the cervix dilated?', 'down', 'Prostaglandins raise Ca²⁺ in the myometrium; PGF2α is essential for labour to progress (slide 68).'),
        from: { hours: 8 },
        set: { pgBlock: 1 },
        watch: 'dilation',
        expect: [{ readout: 'dilation', change: 'down' }],
      },
      {
        question: direction('s10-03', 'lactation', 'A breastfeeding mother is very distressed. What happens to the milk supply?', 'down', 'Emotional distress inhibits the milk ejection reflex through higher centres; milk not removed lets FIL build up (slides 82, 85).'),
        from: { mode: 1 },
        set: { stress: 1 },
        watch: 'milk',
        expect: [{ readout: 'milk', change: 'down' }],
      },
    ],
  }),
};

export function withSimulation(lessonId: string, steps: Step[] | undefined): Step[] | undefined {
  return insertSimulation(steps, simulations[lessonId]);
}

// Source references, concepts and discrepancies for Physiology → Reproductive Physiology.
//
// Lecture sources (content-catalog.ts):
//   MA = "Male Reproductive System" — 71 slides (also the course outline)
//   FE = "Female Reproductive System" — 62 slides
//   SR = "Sexual Response" — 92 slides: puberty, climacteric, sexual
//        response, erection, pregnancy, parturition and lactation
// Speaker notes added to the male deck (a web link and explanations of
// X-rays, metals, dioxin and circhoral rhythm) are annotations, not
// lecture material, and are not quizzed. Picture-only slides are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'reproductive-physiology';

export const ma = (numbers: number[]): SourceReference[] => slides('repro-male-reproductive-system', numbers);
export const fe = (numbers: number[]): SourceReference[] => slides('repro-female-reproductive-system', numbers);
export const sr = (numbers: number[]): SourceReference[] => slides('repro-sexual-response', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — The male reproductive system and testis
  'reproduction': { lessonId: L(1), name: 'Reproduction and the reproductive system', category: 'core', relevance: 'core', sourceRefs: ma([6]) },
  'male-organs': { lessonId: L(1), name: 'Organs, ducts and glands of the male system', category: 'core', relevance: 'core', sourceRefs: ma([7, 8]) },
  'testis-structure': { lessonId: L(1), name: 'The testis: tunics, lobules and tubules', category: 'core', relevance: 'core', sourceRefs: ma([11, 12, 15, 16]) },
  'sertoli-leydig': { lessonId: L(1), name: 'Sertoli cells, the blood–testis barrier and Leydig cells', category: 'core', relevance: 'core', sourceRefs: ma([18, 19, 20]) },

  // Lesson 2 — Spermatogenesis and sperm
  'spermatogenesis': { lessonId: L(2), name: 'The three phases of spermatogenesis', category: 'visual-process', relevance: 'core', sourceRefs: ma([22, 23, 24, 25]) },
  'sperm-structure': { lessonId: L(2), name: 'Structure of the spermatozoon', category: 'core', relevance: 'core', sourceRefs: ma([28, 29]) },
  'sperm-maturation': { lessonId: L(2), name: 'Maturation and storage of sperm', category: 'core', relevance: 'core', sourceRefs: ma([41]) },
  'capacitation': { lessonId: L(2), name: 'Sperm capacitation', category: 'core', relevance: 'core', sourceRefs: ma([42, 43]) },

  // Lesson 3 — Regulation of spermatogenesis and semen
  'spermatogenesis-hormones': { lessonId: L(3), name: 'Hormonal control of spermatogenesis', category: 'core', relevance: 'core', sourceRefs: ma([31, 32, 33]) },
  'testis-temperature': { lessonId: L(3), name: 'Temperature and other factors', category: 'core', relevance: 'core', sourceRefs: ma([35, 38, 40]) },
  'semen': { lessonId: L(3), name: 'Semen and the accessory glands', category: 'core', relevance: 'core', sourceRefs: ma([47, 48, 49, 50]) },

  // Lesson 4 — Testosterone and testicular disorders
  'testosterone-transport': { lessonId: L(4), name: 'Transport and secretion of testosterone', category: 'core', relevance: 'core', sourceRefs: ma([52, 53]) },
  'testosterone-action': { lessonId: L(4), name: 'How testosterone and DHT act', category: 'core', relevance: 'core', sourceRefs: ma([55, 56, 57]) },
  'androgen-effects': { lessonId: L(4), name: 'Effects of androgens', category: 'core', relevance: 'core', sourceRefs: ma([61, 62, 63]) },
  'testicular-disorders': { lessonId: L(4), name: 'Cryptorchidism and male hypogonadism', category: 'clinical', relevance: 'core', sourceRefs: ma([64, 65, 67, 68, 69, 70, 71]) },

  // Lesson 5 — The female system, oogenesis and the ovarian cycle
  'female-organs': { lessonId: L(5), name: 'Organs of the female reproductive system', category: 'core', relevance: 'core', sourceRefs: fe([1, 2]) },
  'ovary': { lessonId: L(5), name: 'Structure of the ovary', category: 'core', relevance: 'core', sourceRefs: fe([5, 6]) },
  'oogenesis': { lessonId: L(5), name: 'Oogenesis', category: 'visual-process', relevance: 'core', sourceRefs: fe([8, 9, 10, 11]) },
  'ovarian-cycle': { lessonId: L(5), name: 'Follicular, ovulatory and luteal phases', category: 'visual-process', relevance: 'core', sourceRefs: fe([13, 14, 15, 16, 17, 19, 20]) },

  // Lesson 6 — The uterine cycle and its control
  'uterine-cycle': { lessonId: L(6), name: 'The four phases of the uterine cycle', category: 'visual-process', relevance: 'core', sourceRefs: fe([22, 23, 24, 25, 26, 27]) },
  'cyclic-changes': { lessonId: L(6), name: 'Cyclic changes in the cervix, vagina, breast and body temperature', category: 'core', relevance: 'core', sourceRefs: fe([31, 32, 34, 35]) },
  'hpo-axis': { lessonId: L(6), name: 'Control by the hypothalamic–pituitary–ovarian axis', category: 'core', relevance: 'core', sourceRefs: fe([36, 37, 38, 39, 40, 44]) },

  // Lesson 7 — Menstrual disorders and ovarian hormones
  'menstrual-disorders': { lessonId: L(7), name: 'Disorders of the menstrual cycle', category: 'clinical', relevance: 'core', sourceRefs: fe([45, 46, 47, 48, 49, 50, 51]) },
  'estrogens': { lessonId: L(7), name: 'Estrogens', category: 'core', relevance: 'core', sourceRefs: fe([52, 53, 55, 56]) },
  'progestins': { lessonId: L(7), name: 'Progestins', category: 'core', relevance: 'core', sourceRefs: fe([57, 58, 60, 61]) },
  'relaxin-inhibin': { lessonId: L(7), name: 'Relaxin and inhibin', category: 'supporting', relevance: 'supporting', sourceRefs: fe([61, 62]) },

  // Lesson 8 — Puberty, climacteric and sexual response
  'puberty': { lessonId: L(8), name: 'Puberty, its triggers and signs', category: 'core', relevance: 'core', sourceRefs: sr([1, 2, 3, 4, 5, 7, 8]) },
  'climacteric': { lessonId: L(8), name: 'Andropause and menopause', category: 'core', relevance: 'core', sourceRefs: sr([10, 11, 12, 13, 17, 18, 19, 20]) },
  'sexual-response': { lessonId: L(8), name: 'The human sexual response', category: 'core', relevance: 'core', sourceRefs: sr([23]) },
  'erection': { lessonId: L(8), name: 'Penile erection and its termination', category: 'visual-process', relevance: 'core', sourceRefs: sr([26, 27, 32, 33, 34, 35, 36, 38]) },

  // Lesson 9 — Fertilisation, implantation and the placenta
  'fertilisation': { lessonId: L(9), name: 'Fertilisation', category: 'visual-process', relevance: 'core', sourceRefs: sr([40, 41, 42, 43, 44]) },
  'implantation': { lessonId: L(9), name: 'Implantation', category: 'visual-process', relevance: 'core', sourceRefs: sr([49, 52, 53, 54, 55]) },
  'placenta': { lessonId: L(9), name: 'Functions of the placenta', category: 'core', relevance: 'core', sourceRefs: sr([58, 59, 60, 61]) },
  'pregnancy-changes': { lessonId: L(9), name: 'Hormonal and maternal changes in pregnancy', category: 'core', relevance: 'core', sourceRefs: sr([61, 62, 63]) },

  // Lesson 10 — Parturition and lactation
  'parturition-hormones': { lessonId: L(10), name: 'Endocrine factors in parturition', category: 'core', relevance: 'core', sourceRefs: sr([65, 66, 67, 68, 69, 70, 71]) },
  'parturition-mechanics': { lessonId: L(10), name: 'Mechanical factors and delivery', category: 'core', relevance: 'core', sourceRefs: sr([74, 75]) },
  'lactation': { lessonId: L(10), name: 'Lactogenesis and the milk ejection reflex', category: 'core', relevance: 'core', sourceRefs: sr([80, 81, 82, 83, 84, 85]) },
  'milk-amenorrhoea': { lessonId: L(10), name: 'Milk composition and lactational amenorrhoea', category: 'core', relevance: 'core', sourceRefs: sr([86, 87, 88, 89, 90]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'menstrual-blood-loss',
    concept: 'Menstrual blood loss',
    status: 'unresolved',
    statements: [
      { text: 'Female, slide 23: blood loss is usually between 30 and 80 mL.', sourceRefs: fe([23]) },
      { text: 'Slide 24: the average loss is 30 mL, and more than 80 mL is abnormal.', sourceRefs: fe([24]) },
    ],
    note: 'Both figures agree that more than 80 mL is abnormal; only that is quizzed.',
  },
  {
    id: 'gestation-length',
    concept: 'Length of human gestation',
    status: 'unresolved',
    statements: [{ text: 'Sexual Response, slide 65: “about 38 weeks”.', sourceRefs: sr([65]) }],
    note: 'Gestation is often quoted as 40 weeks from the last menstrual period; 38 weeks counts from fertilisation. Only the lecture figure is shown, and it is not quizzed.',
  },
];

import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'reproductive-physiology-2': [
    { term: 'Spermatogenesis', meaning: 'Making spermatozoa from spermatogonia, in the seminiferous tubules (about 74 days).' },
    { term: 'Meiosis', meaning: 'The divisions that halve the chromosome number, making haploid cells.' },
    { term: 'Acrosome', meaning: 'The cap of enzymes on the sperm head, important in fertilisation.' },
    { term: 'Epididymis', meaning: 'Where sperm are stored, mature and become motile.' },
    { term: 'Capacitation', meaning: 'Sperm gaining the ability to fertilise, in the female tract over 5–7 hours.' },
  ],
  'reproductive-physiology-3': [
    { term: 'Sertoli cells', meaning: 'Make inhibin, activin and androgen-binding protein.' },
    { term: 'Inhibin', meaning: 'From Sertoli cells: negative feedback that cuts FSH.' },
    { term: 'Androgen-binding protein', meaning: 'Keeps testosterone 20–50 times higher in the testis than in blood.' },
    { term: 'Pampiniform plexus', meaning: 'Veins around the testicular artery that cool its blood.' },
    { term: 'Semen', meaning: 'Sperm plus the secretions of the glands, ejaculated at orgasm.' },
    { term: 'Fructose', meaning: 'The sperm’s main energy source, from the seminal vesicles.' },
  ],
  'reproductive-physiology-4': [
    { term: 'SHBG', meaning: 'Sex hormone–binding globulin, which binds most testosterone tightly.' },
    { term: 'Dihydrotestosterone', meaning: 'DHT: made from testosterone by 5α-reductase; more potent and purely androgenic.' },
    { term: '5α-reductase', meaning: 'Turns testosterone into DHT.' },
    { term: 'Virilisation', meaning: 'Development of male characteristics, maintained by testosterone after puberty.' },
    { term: 'Cryptorchidism', meaning: 'Failure of one or both testes to descend.' },
    { term: 'Hypogonadism', meaning: 'The body does not make enough testosterone.' },
  ],
  'reproductive-physiology-5': [
    { term: 'Oogenesis', meaning: 'Making eggs: oogonia → primary oocytes, arrested in meiosis I until puberty.' },
    { term: 'Primary oocytes', meaning: 'About 2 million at birth; only 400–500 ever ovulate.' },
    { term: 'Graafian follicle', meaning: 'The mature follicle that ruptures at ovulation.' },
    { term: 'Ovulation', meaning: 'Release of the secondary oocyte from the follicle, around day 14.' },
    { term: 'Corpus luteum', meaning: 'The endocrine unit formed from the ruptured follicle.' },
    { term: 'Polar body', meaning: 'The small cell made by the unequal division of the oocyte.' },
  ],
  'reproductive-physiology-6': [
    { term: 'Endometrium', meaning: 'The lining of the uterus, which changes each month.' },
    { term: 'Menstrual', meaning: 'The phase when the functional layer is shed as menstrual flow.' },
    { term: 'Proliferative', meaning: 'Rising estrogen thickens the endometrium before ovulation.' },
    { term: 'Secretory', meaning: 'After ovulation, progesterone makes the glands secrete for implantation.' },
    { term: 'GnRH', meaning: 'Released in pulses by the hypothalamus; drives FSH and LH.' },
    { term: 'LH surge', meaning: 'A burst of LH 34–36 hours before ovulation, triggered by high estrogen.' },
  ],
  'reproductive-physiology-8': [
    { term: 'Puberty', meaning: 'The transition to adulthood, ending in mature gametes.' },
    { term: 'Kisspeptin', meaning: 'A hypothalamic signal that changes GnRH and triggers puberty.' },
    { term: 'Menarche', meaning: 'The first menstruation, the last sign of puberty in girls.' },
    { term: 'Menopause', meaning: 'The end of menstruation, with no period for 12 months in a row.' },
    { term: 'Andropause', meaning: 'The gradual decline of testosterone in men from about 40.' },
    { term: 'Nitric oxide', meaning: 'NO: the principal mediator of erection, acting through cGMP.' },
  ],
  'reproductive-physiology-9': [
    { term: 'Fertilisation', meaning: 'Fusion of male and female gametes, usually in the ampulla of the uterine tube.' },
    { term: 'Acrosome reaction', meaning: 'Release of the acrosome’s enzymes when the sperm binds the zona.' },
    { term: 'Polyspermy', meaning: 'Entry of more than one sperm, blocked by the cortical reaction.' },
    { term: 'Zygote', meaning: 'The single diploid cell formed when the pronuclei fuse.' },
    { term: 'Blastocyst', meaning: 'A hollow ball: inner cell mass (embryo) and trophoblast (placenta).' },
    { term: 'Implantation', meaning: 'The blastocyst sinking into the endometrium.' },
  ],
  'reproductive-physiology-10': [
    { term: 'Parturition', meaning: 'Delivery of the baby and placenta.' },
    { term: 'Oxytocin', meaning: 'Strengthens uterine contractions and ejects milk.' },
    { term: 'Prostaglandins', meaning: 'Raise intracellular Ca²⁺ in the uterus; PGF2α is essential for labour.' },
    { term: 'Lactogenesis', meaning: 'The start of milk production, in three stages.' },
    { term: 'Milk ejection reflex', meaning: 'Suckling → oxytocin → myoepithelial cells push milk into the ducts.' },
    { term: 'Colostrum', meaning: 'First-week milk, rich in protein and IgA.' },
  ],
};

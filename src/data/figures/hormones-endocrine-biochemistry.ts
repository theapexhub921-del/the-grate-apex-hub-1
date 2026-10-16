// Tappable lecture diagrams for hormones-endocrine-biochemistry (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/hormones-endocrine-biochemistry/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/hormones-endocrine-biochemistry/sources';

export const hpaAxis: LessonFigure = {
  id: 'hormones-endocrine-biochemistry:hpa-axis',
  title: "Hypothalamic–pituitary–adrenal axis",
  src: '/figures/hormones-endocrine-biochemistry/hpa-axis.jpg',
  width: 1360,
  height: 1170,
  caption: "Lecture slide 26: control of cortisol secretion, with negative feedback.",
  sourceRefs: ref([26]),
  spots: [
    { id: 'hypothalamus', label: "Hypothalamus", note: "Secretes CRF.", x: 0.5, y: 0.0897, boxes: [[0.3529, 0.0513, 0.2941, 0.0641]] },
    { id: 'crf', label: "CRF (corticotropin-releasing factor)", note: "Stimulates the anterior pituitary.", x: 0.3529, y: 0.2051, boxes: [[0.3088, 0.1667, 0.0882, 0.0641]] },
    { id: 'anterior-pituitary', label: "Anterior pituitary", note: "Secretes ACTH.", x: 0.5, y: 0.359, boxes: [[0.3382, 0.3205, 0.4118, 0.0641]] },
    { id: 'acth', label: "ACTH", note: "Stimulates the adrenal cortex.", x: 0.3676, y: 0.5128, boxes: [[0.3088, 0.4744, 0.1176, 0.0641]] },
    { id: 'adrenal-cortex', label: "Adrenal cortex", note: "Makes cortisol (a glucocorticoid).", x: 0.5441, y: 0.6667, boxes: [[0.4265, 0.6282, 0.2647, 0.0641]] },
    { id: 'cortisol', label: "Cortisol", note: "Feeds back to inhibit the pituitary and hypothalamus.", x: 0.5147, y: 0.9359, boxes: [[0.4412, 0.8974, 0.1618, 0.0641]] },
  ],
};

export const figures: LessonFigure[] = [hpaAxis];

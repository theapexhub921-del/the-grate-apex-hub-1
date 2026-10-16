// Tappable lecture diagrams for cholesterol-and-bile-biosynthesis (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/cholesterol-and-bile-biosynthesis/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/cholesterol-and-bile-biosynthesis/sources';

export const cholesterolStructure: LessonFigure = {
  id: 'cholesterol-and-bile-biosynthesis:cholesterol-structure',
  title: "Cholesterol: the four-ring nucleus",
  src: '/figures/cholesterol-and-bile-biosynthesis/cholesterol-structure.png',
  width: 1400,
  height: 753,
  caption: "Lecture slide 4: cholesterol, with its four rings lettered A–D and key carbons numbered.",
  sourceRefs: ref([4]),
  spots: [
    { id: 'ring-a', label: "Ring A", note: "One of the three six-membered rings of the steroid nucleus; carries the 3-OH group.", x: 0.234, y: 0.7123, boxes: [[0.2021, 0.6575, 0.0638, 0.1096]] },
    { id: 'ring-b', label: "Ring B", note: "Six-membered ring; holds the C5=C6 double bond.", x: 0.383, y: 0.7123, boxes: [[0.3511, 0.6575, 0.0638, 0.1096]] },
    { id: 'ring-c', label: "Ring C", note: "The third six-membered ring of the nucleus.", x: 0.4468, y: 0.4521, boxes: [[0.4149, 0.3973, 0.0638, 0.1096]] },
    { id: 'ring-d', label: "Ring D", note: "The five-membered ring; the side chain is attached at C17.", x: 0.5957, y: 0.4384, boxes: [[0.5638, 0.3836, 0.0638, 0.1096]] },
    { id: 'oh-c3', label: "Hydroxyl group at C3", note: "The only polar group of cholesterol (3-OH).", x: 0.0745, y: 0.8493, boxes: [[0.0213, 0.7945, 0.0957, 0.1096], [0.1596, 0.7123, 0.0426, 0.0822]] },
    { id: 'double-bond', label: "Double bond between C5 and C6", note: "Cholesterol has one double bond in ring B, between C5 and C6.", x: 0.3404, y: 0.8082, boxes: [[0.2872, 0.8082, 0.0426, 0.0822], [0.3511, 0.8904, 0.0426, 0.0959]] },
    { id: 'side-chain', label: "Side chain at C17", note: "The hydrocarbon side chain is attached to C17 of ring D.", x: 0.766, y: 0.1233, boxes: [[0.5957, 0.2466, 0.0638, 0.0959]] },
  ],
};

export const cholesterolSummary: LessonFigure = {
  id: 'cholesterol-and-bile-biosynthesis:cholesterol-summary',
  title: "Summary of cholesterol biosynthesis",
  src: '/figures/cholesterol-and-bile-biosynthesis/cholesterol-summary.png',
  width: 1400,
  height: 628,
  caption: "Lecture slide 12: from acetyl-CoA to cholesterol, and what cholesterol becomes (after M. W. King, 1996).",
  sourceRefs: ref([12]),
  spots: [
    { id: 'hmg-coa', label: "HMG-CoA", note: "Made from acetyl-CoA + acetoacetyl-CoA.", x: 0.3846, y: 0.1186, boxes: [[0.3077, 0.0678, 0.1429, 0.0847]] },
    { id: 'hmgr', label: "HMG-CoA reductase", note: "Reduces HMG-CoA to mevalonate using 2 NADPH; the main control point of the pathway.", x: 0.5165, y: 0.1695, boxes: [[0.5165, 0.1186, 0.1209, 0.1017]] },
    { id: 'mevalonate', label: "Mevalonate", note: "Product of HMG-CoA reductase.", x: 0.8022, y: 0.1186, boxes: [[0.7143, 0.0678, 0.1868, 0.0847]] },
    { id: 'ipp', label: "Isopentenyl pyrophosphate", note: "The isoprene unit (uses 3 ATP, loses CO₂).", x: 0.8022, y: 0.322, boxes: [[0.5714, 0.2712, 0.4176, 0.0847]] },
    { id: 'gpp', label: "Geranyl pyrophosphate", note: "Two isoprene units (C10).", x: 0.7912, y: 0.5254, boxes: [[0.6154, 0.4746, 0.3516, 0.0847]] },
    { id: 'fpp', label: "Farnesyl pyrophosphate", note: "Three isoprene units (C15); also used for prenylated proteins, dolichol, ubiquinone and heme a.", x: 0.7802, y: 0.7288, boxes: [[0.6044, 0.678, 0.3626, 0.0847]] },
    { id: 'squalene', label: "Squalene", note: "Two farnesyl units joined (C30).", x: 0.8022, y: 0.9492, boxes: [[0.7253, 0.8983, 0.1538, 0.0847]] },
    { id: 'lanosterol', label: "Lanosterol", note: "The first ring-closed sterol; converted to cholesterol.", x: 0.4945, y: 0.9492, boxes: [[0.4176, 0.8983, 0.1538, 0.0847]] },
    { id: 'cholesterol', label: "Cholesterol", note: "Made into bile salts in the liver and steroids in the endocrine glands.", x: 0.1319, y: 0.9661, boxes: [[0.044, 0.9153, 0.1868, 0.0847]] },
    { id: 'bile-salts', label: "Bile salts", note: "Made from cholesterol in the liver.", x: 0.0769, y: 0.7458, boxes: [[0, 0.6949, 0.1429, 0.0847]] },
  ],
};

export const figures: LessonFigure[] = [cholesterolStructure, cholesterolSummary];

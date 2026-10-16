// Tappable lecture diagrams for oxygen-carriers (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/oxygen-carriers/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/oxygen-carriers/sources';

export const oxygenBindingSite: LessonFigure = {
  id: 'oxygen-carriers:oxygen-binding-site',
  title: "The oxygen-binding site of myoglobin",
  src: '/figures/oxygen-carriers/oxygen-binding-site.png',
  width: 1400,
  height: 650,
  caption: "Lecture slide 17 (textbook figure 3-14): the fifth and sixth coordination positions of the haem iron.",
  sourceRefs: ref([17]),
  spots: [
    { id: 'his-f8', label: "Histidine F8 (proximal histidine)", note: "Occupies the fifth coordination position of the iron.", x: 0.25, y: 0.4808, boxes: [[0.0357, 0.1538, 0.2381, 0.0769]] },
    { id: 'fe', label: "Iron (Fe)", note: "Bonded to four nitrogens of the haem and to His F8.", x: 0.4643, y: 0.5, boxes: [[0.4167, 0.4423, 0.0714, 0.0962]] },
    { id: 'o2', label: "Oxygen (O₂)", note: "Bound at the sixth coordination position.", x: 0.5595, y: 0.5192, boxes: [[0.5357, 0.4615, 0.0714, 0.0962]] },
    { id: 'his-e7', label: "Histidine E7 (distal histidine)", note: "Near the sixth position; makes CO bind at an angle and helps keep the iron ferrous.", x: 0.6786, y: 0.3077, boxes: [[0.7262, 0.5962, 0.25, 0.0962]] },
    { id: 'heme-plane', label: "Haem plane", note: "The flat porphyrin ring holding the iron.", x: 0.4524, y: 0.8077, boxes: [[0.5595, 0.8462, 0.131, 0.1346]] },
  ],
};

export const haemoglobin: LessonFigure = {
  id: 'oxygen-carriers:haemoglobin',
  title: "Haemoglobin A (α₂β₂)",
  src: '/figures/oxygen-carriers/haemoglobin.jpg',
  width: 1400,
  height: 1145,
  caption: "Lecture slide 25: haemoglobin, closer view: two α and two β chains, each with a haem group.",
  sourceRefs: ref([25]),
  spots: [
    { id: 'alpha-1', label: "α chain", note: "Each α chain has 141 amino acids.", x: 0.0909, y: 0.7083, boxes: [[0.0568, 0.6667, 0.0682, 0.0729]] },
    { id: 'alpha-2', label: "α chain (141 amino acids)", note: "Each α chain is in contact with both β chains.", x: 0.8977, y: 0.3333, boxes: [[0.875, 0.2917, 0.0682, 0.0729], [0.7841, 0.0729, 0.2045, 0.125]] },
    { id: 'beta-1', label: "β chain", note: "Each β chain has 146 amino acids.", x: 0.1591, y: 0.1875, boxes: [[0.1364, 0.1458, 0.0568, 0.0729]] },
    { id: 'beta-2', label: "β chain (146 amino acids)", note: "The haems sit in crevices near the outside of the molecule, far apart.", x: 0.7841, y: 0.8021, boxes: [[0.7614, 0.7604, 0.0682, 0.0833], [0.7273, 0.8854, 0.2045, 0.1042]] },
    { id: 'haem', label: "Haem group", note: "One per chain (red discs): four in all, each binding one O₂.", x: 0.3523, y: 0.8438 },
  ],
};

export const figures: LessonFigure[] = [oxygenBindingSite, haemoglobin];

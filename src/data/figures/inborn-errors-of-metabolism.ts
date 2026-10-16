// Tappable lecture diagrams for inborn-errors-of-metabolism (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/inborn-errors-of-metabolism/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/inborn-errors-of-metabolism/sources';

export const garrodHypothesis: LessonFigure = {
  id: 'inborn-errors-of-metabolism:garrod-hypothesis',
  title: "Garrod’s hypothesis",
  src: '/figures/inborn-errors-of-metabolism/garrod-hypothesis.jpg',
  width: 1160,
  height: 705,
  caption: "Lecture page 3: a defective enzyme blocks a pathway (one gene → one enzyme).",
  sourceRefs: ref([3]),
  spots: [
    { id: 'a', label: "A: substrate", note: "The start of the pathway.", x: 0.2069, y: 0.5106, boxes: [[0.1552, 0.4255, 0.069, 0.1489]] },
    { id: 'b', label: "B: intermediate before the block", note: "Builds up: substrate excess.", x: 0.4138, y: 0.5106, boxes: [[0.3793, 0.4255, 0.069, 0.1489], [0.1207, 0.6383, 0.2759, 0.0851]] },
    { id: 'block', label: "The enzyme block", note: "A defective enzyme stops B being converted to C.", x: 0.5345, y: 0.5106 },
    { id: 'c', label: "C: product", note: "Not made: product deficiency.", x: 0.6207, y: 0.5106, boxes: [[0.6034, 0.4255, 0.069, 0.1489], [0.6034, 0.5319, 0.3276, 0.0851]] },
    { id: 'd', label: "D: toxic metabolite", note: "The excess is diverted into another pathway, giving a toxic product.", x: 0.5862, y: 0.7021, boxes: [[0.569, 0.617, 0.069, 0.1489], [0.6034, 0.7447, 0.2931, 0.0851]] },
  ],
};

export const galactosaemia: LessonFigure = {
  id: 'inborn-errors-of-metabolism:galactosaemia',
  title: "Galactose metabolism (galactosaemia)",
  src: '/figures/inborn-errors-of-metabolism/galactosaemia.png',
  width: 990,
  height: 653,
  caption: "Lecture page 21: the enzymes of galactose metabolism; GALT is the one deficient in classic galactosaemia.",
  sourceRefs: ref([21]),
  spots: [
    { id: 'lactose', label: "Lactose", note: "Split by lactase into glucose and galactose.", x: 0.1212, y: 0.7701, boxes: [[0.0606, 0.7241, 0.1414, 0.0805]] },
    { id: 'lactase', label: "Lactase", note: "Lactose → glucose + galactose.", x: 0.202, y: 0.6782, boxes: [[0.1414, 0.6322, 0.1212, 0.0805]] },
    { id: 'glucose', label: "Glucose (Glc)", note: "The other product of lactose.", x: 0.2424, y: 0.5172, boxes: [[0.1818, 0.4483, 0.1212, 0.1379]] },
    { id: 'galactose', label: "Galactose (Gal)", note: "Phosphorylated by galactokinase.", x: 0.1212, y: 0.4023, boxes: [[0.0404, 0.3333, 0.1616, 0.1379]] },
    { id: 'galk', label: "Galactokinase (GALK)", note: "Galactose → galactose-1-phosphate (uses ATP).", x: 0.2424, y: 0.1034, boxes: [[0.1414, 0.0805, 0.2222, 0.1379]] },
    { id: 'gal-1p', label: "Galactose-1-phosphate (Gal-1P)", note: "Builds up when GALT is deficient.", x: 0.3838, y: 0.3793, boxes: [[0.3232, 0.3333, 0.101, 0.0805]] },
    { id: 'galt', label: "Galactose-1-phosphate uridylyltransferase (GALT)", note: "Gal-1P + UDP-glucose → glucose-1-P + UDP-galactose.", x: 0.6061, y: 0.1494, boxes: [[0.4141, 0.069, 0.3434, 0.1264], [0.4141, 0.069, 0.2525, 0.2069]] },
    { id: 'udpglc', label: "UDP-glucose (UDPGlc)", note: "Donates UDP to galactose-1-phosphate.", x: 0.4848, y: 0.4943, boxes: [[0.4242, 0.4483, 0.1414, 0.0805]] },
    { id: 'udpgal', label: "UDP-galactose (UDPGal)", note: "Converted back to UDP-glucose by the epimerase.", x: 0.7475, y: 0.3793, boxes: [[0.7071, 0.3333, 0.1212, 0.0805]] },
    { id: 'gale', label: "UDP-galactose 4′-epimerase (GALE)", note: "UDP-galactose ⇌ UDP-glucose.", x: 0.6263, y: 0.6782, boxes: [[0.5253, 0.6322, 0.202, 0.1839]] },
  ],
};

export const figures: LessonFigure[] = [garrodHypothesis, galactosaemia];

// Tappable lecture diagrams for fatty-acid-biosynthesis (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/fatty-acid-biosynthesis/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/fatty-acid-biosynthesis/sources';

export const pyruvateMalateCycle: LessonFigure = {
  id: 'fatty-acid-biosynthesis:pyruvate-malate-cycle',
  title: "Pyruvate–malate cycle",
  src: '/figures/fatty-acid-biosynthesis/pyruvate-malate-cycle.png',
  width: 1400,
  height: 976,
  caption: "Lecture slide: how acetyl-CoA made in the mitochondria reaches the cytosol as citrate, and how the cycle also supplies NADPH for fatty acid synthesis.",
  sourceRefs: ref([17], [14]),
  spots: [
    { id: 'citrate-synthase', label: "Citrate synthase", note: "In the mitochondria, acetyl-CoA joins oxaloacetate to make citrate.", x: 0.6267, y: 0.828, boxes: [[0.5467, 0.8065, 0.1467, 0.043]] },
    { id: 'citrate-mito', label: "Citrate (mitochondria)", note: "Citrate is the form in which acetyl-CoA leaves the mitochondria: the inner membrane does not let acetyl-CoA through.", x: 0.7867, y: 0.828, boxes: [[0.76, 0.8065, 0.0933, 0.043]] },
    { id: 'citrate-cyto', label: "Citrate (cytosol)", note: "Carried out of the mitochondria by a transporter, then cleaved in the cytosol.", x: 0.8267, y: 0.3871, boxes: [[0.7867, 0.3656, 0.0933, 0.043]] },
    { id: 'atp-citrate-lyase', label: "ATP-citrate lyase", note: "Cleaves citrate in the cytosol into acetyl-CoA and oxaloacetate, using ATP.", x: 0.8667, y: 0.2903, boxes: [[0.8267, 0.2581, 0.1067, 0.0645]] },
    { id: 'acetyl-coa-cyto', label: "Acetyl-CoA (cytosol)", note: "Now available in the cytosol for fatty acid synthesis.", x: 0.7867, y: 0.172, boxes: [[0.7333, 0.1505, 0.1333, 0.043]] },
    { id: 'oaa-cyto', label: "Oxaloacetate (cytosol)", note: "Reduced to malate by malate dehydrogenase (NADH → NAD⁺).", x: 0.68, y: 0.2796, boxes: [[0.6133, 0.2581, 0.1467, 0.043]] },
    { id: 'malate-dh', label: "Malate dehydrogenase", note: "Oxaloacetate → malate in the cytosol.", x: 0.5467, y: 0.3011, boxes: [[0.5067, 0.2796, 0.0933, 0.0376]] },
    { id: 'malic-enzyme', label: "Malic enzyme", note: "Oxidises malate to pyruvate and CO₂, making NADPH for fatty acid synthesis.", x: 0.4, y: 0.3226, boxes: [[0.3333, 0.3011, 0.12, 0.043]] },
    { id: 'nadph', label: "NADPH + H⁺", note: "The reducing power fatty acid synthesis needs; the malic enzyme step supplies some of it.", x: 0.2, y: 0.3548, boxes: [[0.1733, 0.3226, 0.08, 0.0753]] },
    { id: 'pyruvate-carboxylase', label: "Pyruvate carboxylase", note: "In the mitochondria, pyruvate → oxaloacetate (uses ATP and CO₂).", x: 0.36, y: 0.7849, boxes: [[0.3067, 0.7527, 0.12, 0.0645]] },
    { id: 'pdh', label: "Pyruvate dehydrogenase complex", note: "In the mitochondria, pyruvate → acetyl-CoA (releases CO₂, makes NADH).", x: 0.1467, y: 0.9032, boxes: [[0.0933, 0.8817, 0.12, 0.0538]] },
  ],
};

export const figures: LessonFigure[] = [pyruvateMalateCycle];

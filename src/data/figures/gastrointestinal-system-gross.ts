// Tappable lecture diagram for gastrointestinal-system-gross (see data/figures/index.ts).
// Made from the lecture slide (labels and pointers measured from the slide);
// pins and label boxes are fractions of the picture. Image: public/figures/gastrointestinal-system-gross/.
import type { LessonFigure } from '@/data/lesson-types';
import { nv } from '@/data/topics/gastrointestinal-system-gross/sources';

export const portalVenousSystem: LessonFigure = {
  id: 'gastrointestinal-system-gross:portal-venous-system',
  title: 'The Hepatic Portal Vein and Its Tributaries',
  src: '/figures/gastrointestinal-system-gross/portal-venous-system.jpg',
  width: 1205,
  height: 1030,
  caption: 'Lecture slide 19 (Neurovasculature of the GI tract): the portal venous system.',
  sourceRefs: nv([19]),
  spots: [
    {
      id: 'portal-vein',
      label: 'Portal vein',
      note: 'Formed behind the neck of the pancreas at L1–L2 by the SMV and the splenic vein; runs to the porta hepatis.',
      x: 0.448,
      y: 0.374,
      boxes: [[0.071, 0.304, 0.1, 0.027]],
    },
    {
      id: 'splenic-vein',
      label: 'Splenic vein',
      note: 'Joins the SMV to form the portal vein; the IMV usually joins it.',
      x: 0.714,
      y: 0.372,
      boxes: [[0.886, 0.474, 0.112, 0.027]],
    },
    {
      id: 'smv',
      label: 'Superior mesenteric vein',
      note: 'Unites with the splenic vein behind the neck of the pancreas to form the portal vein.',
      x: 0.496,
      y: 0.61,
      boxes: [[0.008, 0.595, 0.217, 0.027]],
    },
    {
      id: 'imv',
      label: 'Inferior mesenteric vein',
      note: 'Usually joins the splenic vein.',
      x: 0.674,
      y: 0.532,
      boxes: [[0.783, 0.519, 0.191, 0.027]],
    },
    {
      id: 'left-gastric-vein',
      label: 'Left gastric vein',
      note: 'The left (coronary) gastric vein drains directly into the portal vein.',
      x: 0.502,
      y: 0.369,
      boxes: [[0.564, 0.008, 0.133, 0.027]],
    },
    {
      id: 'middle-colic-vein',
      label: 'Middle colic vein',
      x: 0.427,
      y: 0.68,
      boxes: [[0.111, 0.663, 0.138, 0.027]],
    },
    {
      id: 'right-colic-vein',
      label: 'Right colic vein',
      x: 0.423,
      y: 0.743,
      boxes: [[0.121, 0.727, 0.128, 0.027]],
    },
    {
      id: 'ileocolic-vein',
      label: 'Ileocolic vein',
      x: 0.365,
      y: 0.903,
      boxes: [[0.138, 0.888, 0.111, 0.027]],
    },
    {
      id: 'jejunal-ileal-veins',
      label: 'Jejunal and ileal veins',
      x: 0.498,
      y: 0.701,
      boxes: [[0.7, 0.671, 0.181, 0.027]],
    },
    {
      id: 'pancreas',
      label: 'Pancreas',
      note: 'The portal vein forms behind its neck.',
      x: 0.415,
      y: 0.532,
      boxes: [[0.12, 0.517, 0.085, 0.027]],
    },
    {
      id: 'spleen',
      label: 'Spleen',
      note: 'Its blood reaches the liver through the splenic and portal veins.',
      x: 0.822,
      y: 0.136,
      boxes: [[0.883, 0.042, 0.066, 0.027]],
    },
    {
      id: 'liver',
      label: 'Liver',
      note: 'Receives the portal vein at the porta hepatis.',
      x: 0.339,
      y: 0.209,
      boxes: [[0.299, 0.008, 0.05, 0.027]],
    },
  ],
};

export const figures: LessonFigure[] = [portalVenousSystem];

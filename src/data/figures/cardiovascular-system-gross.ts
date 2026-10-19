// Tappable lecture diagram for cardiovascular-system-gross (see data/figures/index.ts).
// Made from the lecture slide (labels and pointers measured from the slide);
// pins and label boxes are fractions of the picture. Image: public/figures/cardiovascular-system-gross/.
import type { LessonFigure } from '@/data/lesson-types';
import { c1 } from '@/data/topics/cardiovascular-system-gross/sources';

export const rightAtrium: LessonFigure = {
  id: 'cardiovascular-system-gross:right-atrium',
  title: 'The Interior of the Right Atrium',
  src: '/figures/cardiovascular-system-gross/right-atrium.jpg',
  width: 1094,
  height: 1200,
  caption: 'Lecture slides 115–116: the right atrium opened from the front.',
  sourceRefs: c1([115, 116]),
  spots: [
    {
      id: 'svc',
      label: 'Superior vena cava',
      note: 'Opens into the smooth sinus part of the right atrium.',
      x: 0.262,
      y: 0.33,
    },
    {
      id: 'ivc',
      label: 'Inferior vena cava',
      note: 'Opens into the smooth sinus part of the right atrium.',
      x: 0.3,
      y: 0.89,
    },
    {
      id: 'tricuspid',
      label: 'Tricuspid valve',
      note: 'Guards the right atrioventricular (tricuspid) opening, the atrium’s one outflow.',
      x: 0.5,
      y: 0.64,
    },
    {
      id: 'coronary-sinus',
      label: 'Coronary sinus opening',
      note: 'One of the three inflows, with the SVC and IVC.',
      x: 0.41,
      y: 0.79,
    },
    {
      id: 'fossa-ovalis',
      label: 'Fossa ovalis',
      note: 'Depression on the interatrial septum, the remnant of the fetal foramen ovale.',
      x: 0.317,
      y: 0.66,
    },
    {
      id: 'limbus',
      label: 'Limbus fossa ovalis',
      note: 'The raised margin of the fossa ovalis (annulus ovalis).',
      x: 0.325,
      y: 0.61,
    },
    {
      id: 'pectinati',
      label: 'Musculi pectinati',
      note: 'Parallel muscular ridges in the rough auricular part.',
      x: 0.12,
      y: 0.58,
    },
    {
      id: 'crista',
      label: 'Crista terminalis',
      note: 'Muscular ridge between the smooth sinus part and the rough auricular part; the sulcus terminalis on the outside.',
      x: 0.232,
      y: 0.498,
    },
    {
      id: 'auricle',
      label: 'Auricular part',
      note: 'The rough part of the atrium, where the musculi pectinati are.',
      x: 0.473,
      y: 0.45,
    },
  ],
};

export const figures: LessonFigure[] = [rightAtrium];

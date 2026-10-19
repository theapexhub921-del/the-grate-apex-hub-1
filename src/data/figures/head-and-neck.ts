// Tappable lecture diagram for head-and-neck (see data/figures/index.ts).
// Made from the lecture slide (labels and pointers measured from the slide);
// pins and label boxes are fractions of the picture. Image: public/figures/head-and-neck/.
import type { LessonFigure } from '@/data/lesson-types';
import { hn } from '@/data/topics/head-and-neck/sources';

export const auricle: LessonFigure = {
  id: 'head-and-neck:auricle',
  title: 'The Auricle',
  src: '/figures/head-and-neck/auricle.jpg',
  width: 747,
  height: 1074,
  caption: 'Lecture slide 365: features of the auricle.',
  sourceRefs: hn([365]),
  spots: [
    {
      id: 'helix',
      label: 'Helix',
      note: 'The curved rim of the auricle.',
      x: 0.769,
      y: 0.389,
    },
    {
      id: 'antihelix',
      label: 'Antihelix',
      note: 'Divides the scaphoid fossa from the concha.',
      x: 0.48,
      y: 0.411,
    },
    {
      id: 'lobule',
      label: 'Lobule of auricle',
      note: 'Areolar tissue and fat, with no cartilage.',
      x: 0.319,
      y: 0.915,
    },
    {
      id: 'tragus',
      label: 'Tragus',
      note: 'Projection in front of the concha.',
      x: 0.199,
      y: 0.601,
    },
    {
      id: 'eam',
      label: 'External acoustic meatus',
      note: 'About 2.5 cm long: outer third cartilage, inner two-thirds bone.',
      x: 0.271,
      y: 0.553,
    },
    {
      id: 'notch',
      label: 'Intertragic notch',
      x: 0.271,
      y: 0.702,
    },
    {
      id: 'antitragus',
      label: 'Antitragus',
      x: 0.385,
      y: 0.702,
    },
    {
      id: 'crus',
      label: 'Crura of helix',
      x: 0.31,
      y: 0.443,
    },
    {
      id: 'triangular',
      label: 'Triangular fossa',
      x: 0.372,
      y: 0.311,
    },
  ],
};

export const figures: LessonFigure[] = [auricle];

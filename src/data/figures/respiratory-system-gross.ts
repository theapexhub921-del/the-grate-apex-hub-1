// Tappable lecture diagram for respiratory-system-gross (see data/figures/index.ts).
// Made from the lecture slide (labels and pointers measured from the slide);
// pins and label boxes are fractions of the picture. Image: public/figures/respiratory-system-gross/.
import type { LessonFigure } from '@/data/lesson-types';
import { rs } from '@/data/topics/respiratory-system-gross/sources';

export const thoracicJoints: LessonFigure = {
  id: 'respiratory-system-gross:thoracic-joints',
  title: 'Joints of the Thoracic Wall',
  src: '/figures/respiratory-system-gross/thoracic-joints.jpg',
  width: 1053,
  height: 1197,
  caption: 'Lecture slide 201: joints of the thoracic wall, from the front.',
  sourceRefs: rs([201]),
  spots: [
    {
      id: 'sternoclavicular',
      label: 'Sternoclavicular joint',
      note: 'Saddle-type synovial joint.',
      x: 0.505,
      y: 0.134,
    },
    {
      id: 'sternocostal',
      label: 'Sternocostal joint',
      note: 'Synovial plane joint.',
      x: 0.494,
      y: 0.358,
    },
    {
      id: 'manubriosternal',
      label: 'Manubriosternal joint',
      note: 'Synchondrosis.',
      x: 0.555,
      y: 0.276,
    },
    {
      id: 'costochondral',
      label: 'Costochondral joint',
      note: 'Synchondrosis.',
      x: 0.394,
      y: 0.356,
    },
    {
      id: 'xiphisternal',
      label: 'Xiphisternal joint',
      note: 'Synchondrosis.',
      x: 0.573,
      y: 0.591,
    },
    {
      id: 'interchondral',
      label: 'Interchondral joint',
      note: 'Synovial joint.',
      x: 0.43,
      y: 0.624,
    },
    {
      id: 'intervertebral',
      label: 'Intervertebral joint',
      note: 'Symphysis.',
      x: 0.532,
      y: 0.758,
    },
  ],
};

export const figures: LessonFigure[] = [thoracicJoints];

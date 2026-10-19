// Tappable lecture diagram for neuroanatomy (see data/figures/index.ts).
// Made from the lecture slide (labels and pointers measured from the slide);
// pins and label boxes are fractions of the picture. Image: public/figures/neuroanatomy/.
import type { LessonFigure } from '@/data/lesson-types';
import { cns } from '@/data/topics/neuroanatomy/sources';

export const brainArteries: LessonFigure = {
  id: 'neuroanatomy:brain-arteries',
  title: 'Arteries at the Base of the Brain',
  src: '/figures/neuroanatomy/brain-arteries.jpg',
  width: 1599,
  height: 1335,
  caption: 'Lecture slide 89: arteries at the base of the brain and the circle of Willis.',
  sourceRefs: cns([89]),
  spots: [
    {
      id: 'acoa',
      label: 'Anterior communicating artery',
      note: 'Part of the circle of Willis.',
      x: 0.708,
      y: 0.36,
      boxes: [[0.197, 0.112, 0.256, 0.027]],
    },
    {
      id: 'aca',
      label: 'Anterior cerebral artery',
      note: 'Branch of the internal carotid artery; part of the circle of Willis.',
      x: 0.675,
      y: 0.376,
      boxes: [[0.222, 0.154, 0.206, 0.028]],
    },
    {
      id: 'ica',
      label: 'Internal carotid artery',
      note: 'Gives the anterior cerebral, middle cerebral and posterior communicating arteries.',
      x: 0.673,
      y: 0.433,
      boxes: [[0.2, 0.259, 0.183, 0.027]],
    },
    {
      id: 'mca',
      label: 'Middle cerebral artery',
      note: 'Branch of the internal carotid artery.',
      x: 0.629,
      y: 0.458,
      boxes: [[0.164, 0.342, 0.194, 0.028]],
    },
    {
      id: 'pcoa',
      label: 'Posterior communicating artery',
      note: 'Branch of the internal carotid artery; part of the circle of Willis.',
      x: 0.677,
      y: 0.497,
      boxes: [[0.068, 0.509, 0.259, 0.027]],
    },
    {
      id: 'pca',
      label: 'Posterior cerebral artery',
      note: 'Terminal branch of the basilar artery; part of the circle of Willis.',
      x: 0.654,
      y: 0.524,
      boxes: [[0.11, 0.549, 0.209, 0.028]],
    },
    {
      id: 'sca',
      label: 'Superior cerebellar artery',
      note: 'Branch of the basilar artery.',
      x: 0.65,
      y: 0.551,
      boxes: [[0.104, 0.592, 0.209, 0.027]],
    },
    {
      id: 'basilar',
      label: 'Basilar artery',
      note: 'Formed by the union of the two vertebral arteries.',
      x: 0.719,
      y: 0.592,
      boxes: [[0.2, 0.634, 0.113, 0.027]],
    },
    {
      id: 'vertebral',
      label: 'Vertebral artery',
      note: 'Gives meningeal, spinal, posterior inferior cerebellar and medullary branches.',
      x: 0.695,
      y: 0.718,
      boxes: [[0.206, 0.801, 0.131, 0.027]],
    },
    {
      id: 'asa',
      label: 'Anterior spinal artery',
      note: 'Branch of the vertebral artery.',
      x: 0.716,
      y: 0.745,
      boxes: [[0.188, 0.844, 0.175, 0.027]],
    },
    {
      id: 'pica',
      label: 'Posterior inferior cerebellar artery (PICA)',
      note: 'Branch of the vertebral artery.',
      x: 0.672,
      y: 0.787,
      boxes: [[0.022, 0.886, 0.37, 0.027]],
    },
  ],
};

export const figures: LessonFigure[] = [brainArteries];

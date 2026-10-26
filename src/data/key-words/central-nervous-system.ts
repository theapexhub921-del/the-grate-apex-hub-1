import type { LessonTerm } from '@/data/lesson-types';

// Key words for "Start simple" (see ./index.ts), from each lesson's own text.
export const keyWords: Record<string, LessonTerm[]> = {
  'central-nervous-system-3': [
    { term: 'Afferent', meaning: 'Carrying signals towards the CNS: the sensory fibres (Aβ, Aδ, C).' },
    { term: 'Dorsal column', meaning: 'The pathway for fine touch, proprioception and vibration; it crosses in the medulla.' },
    { term: 'Proprioception', meaning: 'The sense of joint position.' },
    { term: 'Spinothalamic', meaning: 'The pathway for pain, temperature and crude touch; it crosses in the spinal cord.' },
    { term: 'Brown-Séquard syndrome', meaning: 'Half-cord damage: fine touch lost on the same side, pain and temperature on the opposite side.' },
    { term: 'Homunculus', meaning: 'The upside-down body map on the sensory cortex, sized by number of receptors.' },
  ],
};

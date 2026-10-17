// Source references, concepts and discrepancies for Physiology → Special Senses.
//
// Lecture sources (content-catalog.ts):
//   VS = "Visual System" — 100 slides
//   AV = "Auditory and Vestibular Systems" — 74 slides
//   CS = "Chemical Senses" — 36 slides
// The "Answers" and study-guide PDFs found with them are study aids and
// are not used as sources of facts. Picture-only slides are not cited.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'special-senses';

export const vs = (numbers: number[]): SourceReference[] => slides('senses-visual-system', numbers);
export const av = (numbers: number[]): SourceReference[] => slides('senses-auditory-and-vestibular-systems', numbers);
export const cs = (numbers: number[]): SourceReference[] => slides('senses-chemical-senses', numbers);

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — Structure of the eye
  'eye-coats': { lessonId: L(1), name: 'Sclera, choroid and retina', category: 'core', relevance: 'core', sourceRefs: vs([1, 2, 3, 4, 5, 6]) },
  'eye-cavities': { lessonId: L(1), name: 'Cavities, lens, conjunctiva and lacrimal glands', category: 'core', relevance: 'core', sourceRefs: vs([6, 7, 8, 9]) },
  'aqueous-humour': { lessonId: L(1), name: 'Aqueous humour, vitreous humour and glaucoma', category: 'core', relevance: 'core', sourceRefs: vs([11, 12, 14]) },

  // Lesson 2 — Focusing
  'refraction': { lessonId: L(2), name: 'Image formation and refraction', category: 'core', relevance: 'core', sourceRefs: vs([15, 16]) },
  'accommodation': { lessonId: L(2), name: 'Accommodation, near point and the near response', category: 'visual-process', relevance: 'core', sourceRefs: vs([18, 19, 22, 23]) },
  'refractive-errors': { lessonId: L(2), name: 'Myopia, hyperopia, astigmatism and cataract', category: 'clinical', relevance: 'core', sourceRefs: vs([23, 24, 25, 27, 30, 31]) },

  // Lesson 3 — Retina and photoreception
  'retina-layers': { lessonId: L(3), name: 'Cells and layers of the retina', category: 'core', relevance: 'core', sourceRefs: vs([34, 35, 36, 37, 40, 41]) },
  'rods-cones': { lessonId: L(3), name: 'Rods and cones', category: 'core', relevance: 'core', sourceRefs: vs([43, 44, 45]) },
  'phototransduction': { lessonId: L(3), name: 'Phototransduction in dark and light', category: 'visual-process', relevance: 'core', sourceRefs: vs([47, 48, 49, 51, 52, 56, 57]) },
  'photopigment-recovery': { lessonId: L(3), name: 'Recovery of the photopigment and photoreceptor', category: 'core', relevance: 'core', sourceRefs: vs([58, 60, 61]) },

  // Lesson 4 — Visual processing and pathways
  'retinal-processing': { lessonId: L(4), name: 'Processing in the retina: convergence and on/off bipolars', category: 'core', relevance: 'core', sourceRefs: vs([63, 64, 65]) },
  'optic-pathway': { lessonId: L(4), name: 'The optic pathway', category: 'visual-process', relevance: 'core', sourceRefs: vs([68, 69]) },
  'field-defects': { lessonId: L(4), name: 'Visual field defects', category: 'clinical', relevance: 'core', sourceRefs: vs([71, 72]) },

  // Lesson 5 — Colour, adaptation, the pupil and eye movements
  'colour-vision': { lessonId: L(5), name: 'Colour vision and colour blindness', category: 'core', relevance: 'core', sourceRefs: vs([74, 76, 77, 78]) },
  'adaptation': { lessonId: L(5), name: 'Dark and light adaptation', category: 'core', relevance: 'core', sourceRefs: vs([82, 83, 85]) },
  'pupil': { lessonId: L(5), name: 'Control of light and the pupillary light reflex', category: 'visual-process', relevance: 'core', sourceRefs: vs([86, 87, 88, 89]) },
  'eye-movements': { lessonId: L(5), name: 'Eye movements and the extraocular muscles', category: 'core', relevance: 'core', sourceRefs: vs([92, 93, 94, 95, 97, 99, 100]) },

  // Lesson 6 — The ear and sound transmission
  'ear-structure': { lessonId: L(6), name: 'External, middle and inner ear', category: 'core', relevance: 'core', sourceRefs: av([1, 2, 3, 4, 5, 6, 7]) },
  'cochlea': { lessonId: L(6), name: 'The cochlea and organ of Corti', category: 'core', relevance: 'core', sourceRefs: av([12, 13, 14, 20, 22, 23, 26]) },
  'sound': { lessonId: L(6), name: 'Sound and its intensity', category: 'core', relevance: 'core', sourceRefs: av([28, 29, 30, 31]) },
  'sound-transmission': { lessonId: L(6), name: 'Transmission of sound to the inner ear', category: 'visual-process', relevance: 'core', sourceRefs: av([32, 33, 34]) },

  // Lesson 7 — Hearing: transduction, pathways and deafness
  'auditory-transduction': { lessonId: L(7), name: 'Sound transduction by hair cells', category: 'visual-process', relevance: 'core', sourceRefs: av([36, 37, 38]) },
  'pitch': { lessonId: L(7), name: 'Pitch perception', category: 'core', relevance: 'core', sourceRefs: av([41]) },
  'auditory-pathway': { lessonId: L(7), name: 'Central auditory pathways and processing', category: 'visual-process', relevance: 'core', sourceRefs: av([43, 44, 47]) },
  'deafness': { lessonId: L(7), name: 'Conductive and sensorineural hearing loss', category: 'clinical', relevance: 'core', sourceRefs: av([48, 49, 50, 51]) },

  // Lesson 8 — The vestibular system
  'vestibular-overview': { lessonId: L(8), name: 'The vestibular system', category: 'core', relevance: 'core', sourceRefs: av([52, 53]) },
  'semicircular-canals': { lessonId: L(8), name: 'Semicircular canals and angular acceleration', category: 'visual-process', relevance: 'core', sourceRefs: av([54, 55, 56, 57]) },
  'otolith-organs': { lessonId: L(8), name: 'Utricle, saccule and linear acceleration', category: 'core', relevance: 'core', sourceRefs: av([62, 63, 64, 68]) },
  'vestibular-pathway': { lessonId: L(8), name: 'Central vestibular pathways', category: 'core', relevance: 'core', sourceRefs: av([71, 72]) },

  // Lesson 9 — Taste
  'chemical-senses': { lessonId: L(9), name: 'The chemical senses', category: 'core', relevance: 'core', sourceRefs: cs([1, 2]) },
  'taste-modalities': { lessonId: L(9), name: 'The five taste submodalities', category: 'core', relevance: 'core', sourceRefs: cs([4, 5, 6]) },
  'taste-buds': { lessonId: L(9), name: 'Taste buds and papillae', category: 'core', relevance: 'core', sourceRefs: cs([8, 9, 10, 11, 12]) },
  'taste-transduction': { lessonId: L(9), name: 'Taste transduction', category: 'visual-process', relevance: 'core', sourceRefs: cs([15, 16, 17, 18, 19, 20, 21]) },
  'taste-pathway': { lessonId: L(9), name: 'The central taste pathway', category: 'core', relevance: 'core', sourceRefs: cs([24, 25]) },

  // Lesson 10 — Smell
  'olfactory-epithelium': { lessonId: L(10), name: 'Primary odours and the olfactory epithelium', category: 'core', relevance: 'core', sourceRefs: cs([26, 27, 28]) },
  'olfactory-transduction': { lessonId: L(10), name: 'Olfactory transduction', category: 'visual-process', relevance: 'core', sourceRefs: cs([29, 30, 31]) },
  'olfactory-pathway': { lessonId: L(10), name: 'The central olfactory pathway', category: 'core', relevance: 'core', sourceRefs: cs([32, 33]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'glutamate-bipolar',
    concept: 'Whether glutamate from photoreceptors excites or inhibits bipolar cells',
    status: 'unresolved',
    statements: [
      { text: 'Visual System, slide 64: in the dark, photoreceptors secrete an “inhibitory transmitter (glutamate)” onto bipolar cells; light removes the inhibition of on-centre cells and inhibits off-centre cells.', sourceRefs: vs([64, 65]) },
    ],
    note: 'Glutamate inhibits on-centre and excites off-centre bipolar cells. The quiz asks only what light does to each type, as the slide states.',
  },
];

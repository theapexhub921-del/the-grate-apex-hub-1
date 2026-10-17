// Source references, concepts and discrepancies for
// Anatomy → Head and Neck (gross anatomy, HB2).
//
// Lecture source (defines WHAT is taught; see content-catalog.ts):
//   HN = "Head and Neck (HB2, June–July 2026)" — PPTX, 476 slides
//
// Reference (clarification only): Gray's Anatomy for Students (4th ed.), via GRAYS.
import type { SourceDiscrepancy, SourceReference } from '@/data/lesson-types';
import { slides, type ConceptDraft } from '@/data/topics/build';

export const TOPIC_ID = 'head-and-neck';

export const hn = (numbers: number[]): SourceReference[] => slides('anat-head-neck', numbers);
export const GRAYS: SourceReference[] = [{ sourceId: 'grays-anatomy-students-4e' }];

const L = (n: number) => `${TOPIC_ID}-${n}`;

export const concepts = {
  // Lesson 1 — The Neck: Fascia and Triangles
  'neck-overview': { lessonId: L(1), name: 'Functions of the head and neck and the general plan of the neck', category: 'core', relevance: 'core', sourceRefs: hn([2, 6, 7, 8, 10]) },
  'cervical-fascia': { lessonId: L(1), name: 'Cervical fascia, the carotid sheath and the retropharyngeal space', category: 'core', relevance: 'core', sourceRefs: hn([12, 15, 18, 19]) },
  'anterior-triangle': { lessonId: L(1), name: 'The anterior triangle: carotid, submandibular and submental triangles', category: 'core', relevance: 'core', sourceRefs: hn([21, 23, 24, 26, 27, 28, 32, 36, 37, 38]) },
  'posterior-triangle-cervical-plexus': { lessonId: L(1), name: 'The posterior triangle and the cervical plexus', category: 'core', relevance: 'core', sourceRefs: hn([41, 42, 45, 46, 50, 51, 52, 54]) },

  // Lesson 2 — Scalp and Face
  'scalp-layers': { lessonId: L(2), name: 'Layers of the scalp and their clinical importance', category: 'core', relevance: 'core', sourceRefs: hn([56, 57, 60, 61, 62, 63, 64]) },
  'scalp-supply': { lessonId: L(2), name: 'Nerve and blood supply of the scalp', category: 'core', relevance: 'core', sourceRefs: hn([66, 67, 68]) },
  'facial-muscles': { lessonId: L(2), name: 'The face and the muscles of facial expression', category: 'core', relevance: 'core', sourceRefs: hn([69, 70, 71, 72, 74, 75, 76, 80, 81, 84, 86]) },

  // Lesson 3 — The Orbit
  'orbit-walls-openings': { lessonId: L(3), name: 'Orbital margin, walls, fissures, canals and foramina', category: 'core', relevance: 'core', sourceRefs: hn([89, 90, 93, 94, 95, 96, 97, 98, 99, 100]) },
  'orbit-vessels': { lessonId: L(3), name: 'Ophthalmic artery branches and ophthalmic veins', category: 'core', relevance: 'core', sourceRefs: hn([101, 102, 107, 108, 109, 110, 113, 114, 118, 122]) },
  'extraocular-muscles': { lessonId: L(3), name: 'Extraocular muscles, eye movements and the common tendinous ring', category: 'core', relevance: 'core', sourceRefs: hn([124, 128, 129, 130]) },
  'lacrimal-apparatus-eye': { lessonId: L(3), name: 'The lacrimal apparatus and the coats of the eyeball', category: 'core', relevance: 'core', sourceRefs: hn([132, 133, 134, 135, 137, 139, 140]) },

  // Lesson 4 — Pterygopalatine Fossa
  'ppf-boundaries': { lessonId: L(4), name: 'Pterygopalatine fossa: position, boundaries and openings', category: 'core', relevance: 'core', sourceRefs: hn([143, 147, 148, 151, 153, 155, 157]) },
  'ppf-contents': { lessonId: L(4), name: 'Contents of the fossa: maxillary nerve, pterygopalatine ganglion and maxillary artery', category: 'core', relevance: 'core', sourceRefs: hn([159, 162, 164, 167, 172, 175, 178]) },

  // Lesson 5 — Nasal Cavity and Paranasal Sinuses
  'nasal-walls': { lessonId: L(5), name: 'Walls, openings and regions of the nasal cavity', category: 'core', relevance: 'core', sourceRefs: hn([189, 191, 195, 196, 199, 202, 204, 208, 209, 210]) },
  'nasal-blood-epistaxis': { lessonId: L(5), name: 'Blood supply of the nasal cavity and epistaxis', category: 'clinical', relevance: 'core', sourceRefs: hn([211, 213, 215, 216]) },
  'paranasal-sinuses': { lessonId: L(5), name: 'The paranasal sinuses, their drainage and sinusitis', category: 'core', relevance: 'core', sourceRefs: hn([221, 223, 225, 227, 228, 230, 231, 232, 235, 237, 239]) },

  // Lesson 6 — The Ear
  'external-ear': { lessonId: L(6), name: 'The external ear and the tympanic membrane', category: 'core', relevance: 'core', sourceRefs: hn([240, 241, 245, 247, 248, 250, 256, 258, 264, 266, 267, 269, 274, 275]) },
  'middle-ear': { lessonId: L(6), name: 'The middle ear: cavity, walls, muscles, ossicles and auditory tube', category: 'core', relevance: 'core', sourceRefs: hn([280, 282, 284, 287, 289, 290, 292, 295, 297, 299, 302, 307, 308, 310, 312, 313, 315, 316]) },
  'inner-ear-development': { lessonId: L(6), name: 'The inner ear and development of the ear', category: 'core', relevance: 'core', sourceRefs: hn([318, 320, 322, 324, 325, 329, 332, 335, 336, 340, 341, 343, 346, 347, 349]) },

  // Lesson 7 — Tongue and Salivary Glands
  'tongue': { lessonId: L(7), name: 'Intrinsic and extrinsic muscles of the tongue', category: 'core', relevance: 'core', sourceRefs: hn([367, 369, 370, 373, 374]) },
  'salivary-glands': { lessonId: L(7), name: 'The salivary glands, saliva and calculi', category: 'core', relevance: 'core', sourceRefs: hn([377, 379, 380, 381]) },
  'salivary-innervation': { lessonId: L(7), name: 'Parasympathetic innervation of the salivary glands', category: 'core', relevance: 'core', sourceRefs: hn([382, 383, 387, 388, 389]) },

  // Lesson 8 — Cranial Nerves I–VI
  'cranial-nerve-components': { lessonId: L(8), name: 'Peripheral nervous system and the functional components of nerves', category: 'core', relevance: 'core', sourceRefs: hn([392, 393, 394, 395]) },
  'olfactory-optic': { lessonId: L(8), name: 'Olfactory and optic nerves and the optic chiasma', category: 'core', relevance: 'core', sourceRefs: hn([396, 397, 399, 400, 401]) },
  'eye-movement-nerves': { lessonId: L(8), name: 'Oculomotor, trochlear and abducent nerves', category: 'core', relevance: 'core', sourceRefs: hn([402, 403, 404, 405]) },
  'trigeminal-nerve': { lessonId: L(8), name: 'The trigeminal nerve and its three divisions', category: 'core', relevance: 'core', sourceRefs: hn([406, 408, 409, 410, 411]) },

  // Lesson 9 — Cranial Nerves VII–XII
  'facial-nerve': { lessonId: L(9), name: 'The facial nerve: course, branches and Bell’s palsy', category: 'core', relevance: 'core', sourceRefs: hn([412, 413, 414, 415]) },
  'cn-viii-ix': { lessonId: L(9), name: 'Vestibulocochlear and glossopharyngeal nerves', category: 'core', relevance: 'core', sourceRefs: hn([415, 416]) },
  'vagus-accessory-hypoglossal': { lessonId: L(9), name: 'Vagus, accessory and hypoglossal nerves', category: 'core', relevance: 'core', sourceRefs: hn([417, 418, 419, 420]) },

  // Lesson 10 — The Larynx
  'larynx-functions-cartilages': { lessonId: L(10), name: 'Functions and cartilages of the larynx', category: 'core', relevance: 'core', sourceRefs: hn([421, 422, 423, 424, 427, 429, 431, 433, 436, 438, 439, 441]) },
  'larynx-ligaments-cavity': { lessonId: L(10), name: 'Ligaments, cavity and folds of the larynx', category: 'core', relevance: 'core', sourceRefs: hn([443, 445, 446, 448, 450, 452, 454, 455, 456, 457, 460]) },
  'larynx-muscles-supply': { lessonId: L(10), name: 'Extrinsic muscles, blood supply, lymph and nerves of the larynx', category: 'core', relevance: 'core', sourceRefs: hn([461, 462, 463, 465, 468, 470, 471, 472]) },
} satisfies Record<string, ConceptDraft>;

export type ConceptId = keyof typeof concepts;

export const discrepancies: SourceDiscrepancy[] = [
  {
    id: 'vagus-pharyngeal-motor',
    concept: 'Origin of the motor fibres in the pharyngeal branch of the vagus',
    status: 'resolved',
    statements: [
      { text: 'Slide 418: the motor fibres of the pharyngeal branch originate in the cranial root of the accessory nerve and join the vagus.', sourceRefs: hn([418, 419]) },
      { text: 'Gray’s: these fibres arise in the nucleus ambiguus and are usually described as vagal; the “cranial root of the accessory” is now regarded as part of the vagus.', sourceRefs: GRAYS },
    ],
    resolution: { text: 'Both describe the same nucleus ambiguus fibres; the naming differs.', sourceRefs: [...hn([418]), ...GRAYS] },
  },
];

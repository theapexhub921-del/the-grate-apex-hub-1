// Textbook pages for each reading section of special-senses (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "special-senses-1": {
    0: [["costanzo-physiology", [85]]], // The eye and light
    2: [["guyton-hall-14e", [633, 634, 635]], ["costanzo-physiology", [85]]], // Cavities, lens and tears
    3: [["guyton-hall-14e", [636, 638]], ["costanzo-physiology", [85]]], // Aqueous humour and glaucoma
  },
  "special-senses-2": {
    0: [["guyton-hall-14e", [629, 630, 631]], ["costanzo-physiology", [85]]], // Image formation
    1: [["guyton-hall-14e", [661]], ["costanzo-physiology", [57]]], // Accommodation
    3: [["guyton-hall-14e", [634]]], // Cataract
  },
  "special-senses-3": {
    0: [["guyton-hall-14e", [639, 640]], ["costanzo-physiology", [85, 86, 87]]], // Layers of the retina
    1: [["guyton-hall-14e", [639, 640, 641]], ["costanzo-physiology", [86, 87, 88]]], // Rods and cones
    2: [["guyton-hall-14e", [642, 643]], ["costanzo-physiology", [87, 88, 89]]], // In the dark
    3: [["guyton-hall-14e", [643, 644]], ["costanzo-physiology", [88]]], // In the light
    4: [["guyton-hall-14e", [642, 643, 644]], ["costanzo-physiology", [88]]], // Recovery
  },
  "special-senses-4": {
    0: [["guyton-hall-14e", [648, 649, 650]], ["costanzo-physiology", [88, 89, 90]]], // Processing in the retina
    1: [["guyton-hall-14e", [653]], ["costanzo-physiology", [91]]], // The optic pathway
  },
  "special-senses-5": {
    0: [["guyton-hall-14e", [645, 646, 647]]], // Colour vision
    2: [["guyton-hall-14e", [661, 662]], ["costanzo-physiology", [56, 57, 58]]], // The pupil
    3: [["guyton-hall-14e", [659]]], // Eye movements
  },
  "special-senses-6": {
    1: [["guyton-hall-14e", [665, 666, 667]]], // The cochlea
    2: [["guyton-hall-14e", [665, 666, 667]], ["costanzo-physiology", [93, 94, 95]]], // The organ of Corti
    3: [["guyton-hall-14e", [672, 673]], ["costanzo-physiology", [91, 92]]], // Sound
    4: [["guyton-hall-14e", [663, 664, 665]], ["costanzo-physiology", [93, 94]]], // Transmission of sound
  },
  "special-senses-7": {
    0: [["guyton-hall-14e", [667, 668]], ["costanzo-physiology", [94, 95]]], // Transduction
    2: [["guyton-hall-14e", [669, 670, 671]], ["costanzo-physiology", [95]]], // Central pathway
    3: [["guyton-hall-14e", [672, 673]]], // Deafness
  },
  "special-senses-8": {
    0: [["guyton-hall-14e", [705, 706, 707]], ["costanzo-physiology", [96]]], // Overview
    1: [["guyton-hall-14e", [705, 706, 707]], ["costanzo-physiology", [96, 97, 98]]], // Semicircular canals
    2: [["guyton-hall-14e", [705, 706]], ["costanzo-physiology", [96]]], // Otolith organs
    3: [["guyton-hall-14e", [707, 708]], ["costanzo-physiology", [98]]], // Central connections
  },
  "special-senses-9": {
    2: [["guyton-hall-14e", [675, 676]], ["costanzo-physiology", [101]]], // Taste buds and papillae
    3: [["guyton-hall-14e", [674, 675, 676]], ["costanzo-physiology", [102]]], // Transduction
    4: [["guyton-hall-14e", [677]]], // Central pathway
  },
  "special-senses-10": {
    0: [["guyton-hall-14e", [681, 682]], ["costanzo-physiology", [99]]], // Odours and the olfactory epithelium
    1: [["guyton-hall-14e", [681, 682]], ["costanzo-physiology", [99, 100]]], // Olfactory transduction
    2: [["guyton-hall-14e", [683]], ["costanzo-physiology", [99, 100]]], // The olfactory pathway
  },
};

// Textbook pages for each reading section of urinary-system-gross (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "urinary-system-gross-1": {
    1: [["grays-anatomy-students-4e", [377, 378, 379]]], // Position, Size and Surface Anatomy
    2: [["grays-anatomy-students-4e", [377]]], // Coverings of the Kidney
    3: [["grays-anatomy-students-4e", [375, 376]]], // Relations of the Kidneys
  },
  "urinary-system-gross-2": {
    0: [["grays-anatomy-students-4e", [378]]], // Internal Structure
    1: [["grays-anatomy-students-4e", [379, 380, 381]]], // Blood Supply and Variations
    3: [["grays-anatomy-students-4e", [386, 387, 388]]], // The Suprarenal Glands
  },
  "urinary-system-gross-3": {
    0: [["grays-anatomy-students-4e", [380, 381]]], // Course and Relations
    1: [["grays-anatomy-students-4e", [381]]], // Constrictions and Renal Stones
    2: [["grays-anatomy-students-4e", [381]]], // Blood Supply, Lymph and Nerves; Ureteric Colic
  },
  "urinary-system-gross-4": {
    0: [["grays-anatomy-students-4e", [456]]], // Position, Parts and Relations
    1: [["grays-anatomy-students-4e", [456]]], // Interior of the Bladder
  },
  "urinary-system-gross-5": {
    1: [["grays-anatomy-students-4e", [461]]], // The Male Urethra
    2: [["grays-anatomy-students-4e", [460, 461, 462]]], // Supply of the Urethra and Incontinence
  },
};

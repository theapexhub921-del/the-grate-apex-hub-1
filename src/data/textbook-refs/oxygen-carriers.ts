// Textbook pages for each reading section of oxygen-carriers (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "oxygen-carriers-2": {
    1: [["guyton-hall-14e", [443, 444, 446]]], // Keeping the iron ferrous
  },
  "oxygen-carriers-4": {
    0: [["guyton-hall-14e", [529]]], // The Bohr–Haldane effect
  },
};

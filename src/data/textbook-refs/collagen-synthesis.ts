// Textbook pages for each reading section of collagen-synthesis (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "collagen-synthesis-2": {
    0: [["guyton-hall-14e", [994]]], // Collagen
  },
  "collagen-synthesis-3": {
    2: [["guyton-hall-14e", [890]]], // Prolyl hydroxylase
  },
  "collagen-synthesis-5": {
    0: [["guyton-hall-14e", [890]]], // Scurvy
  },
};

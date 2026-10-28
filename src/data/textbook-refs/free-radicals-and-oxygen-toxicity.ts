// Textbook pages for each reading section of free-radicals-and-oxygen-toxicity (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "free-radicals-and-oxygen-toxicity-1": {
    1: [["guyton-hall-14e", [562]]], // What a free radical is
  },
  "free-radicals-and-oxygen-toxicity-3": {
    3: [["guyton-hall-14e", [862, 863]]], // Oxidised LDL and atherosclerosis
  },
  "free-radicals-and-oxygen-toxicity-5": {
    0: [["guyton-hall-14e", [45, 46, 47]]], // Oxidative stress and disease
    1: [["guyton-hall-14e", [45, 46, 47]]], // Carcinogenesis
  },
};

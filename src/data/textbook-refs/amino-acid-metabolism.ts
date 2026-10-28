// Textbook pages for each reading section of amino-acid-metabolism (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "amino-acid-metabolism-1": {
    0: [["guyton-hall-14e", [865]]], // The α-amino acid
  },
  "amino-acid-metabolism-2": {
    2: [["guyton-hall-14e", [866]]], // Glucogenic and ketogenic
  },
  "amino-acid-metabolism-3": {
    0: [["guyton-hall-14e", [835]]], // Digestion and the amino acid pool
    2: [["guyton-hall-14e", [868, 869]]], // Transamination
    3: [["guyton-hall-14e", [868, 869]]], // Oxidative deamination and transdeamination
  },
  "amino-acid-metabolism-4": {
    0: [["guyton-hall-14e", [868, 869]]], // Capturing ammonia
    1: [["guyton-hall-14e", [868, 869]]], // Glutamine and alanine as carriers
    2: [["guyton-hall-14e", [893]]], // Why ammonia is toxic
  },
  "amino-acid-metabolism-7": {
    3: [["guyton-hall-14e", [866]]], // Histidine, serine and glycine
  },
  "amino-acid-metabolism-8": {
    0: [["guyton-hall-14e", [866]]], // Methionine
  },
};

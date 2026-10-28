// Textbook pages for each reading section of immunology (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "immunology-1": {
    2: [["guyton-hall-14e", [459, 460, 461]]], // Cells or serum?
  },
  "immunology-2": {
    1: [["guyton-hall-14e", [459]]], // Innate immunity
    2: [["guyton-hall-14e", [459, 460, 461]]], // Adaptive immunity
  },
  "immunology-3": {
    2: [["guyton-hall-14e", [454, 455]]], // Acute inflammation
  },
  "immunology-4": {
    0: [["guyton-hall-14e", [449, 450]]], // Blood and haematopoiesis
    2: [["guyton-hall-14e", [452]]], // Macrophages and neutrophils
    4: [["guyton-hall-14e", [468]]], // NK and NKT cells
  },
  "immunology-6": {
    3: [["guyton-hall-14e", [467, 468, 469]]], // Classes of antigen
  },
  "immunology-7": {
    0: [["guyton-hall-14e", [463, 464]]], // Structure
    2: [["guyton-hall-14e", [464, 465, 466]]], // Binding antigen
  },
  "immunology-9": {
    0: [["guyton-hall-14e", [465]]], // What complement is
    2: [["guyton-hall-14e", [465]]], // The membrane attack complex and other effects
  },
  "immunology-10": {
    0: [["guyton-hall-14e", [459, 460]]], // General principles
    1: [["guyton-hall-14e", [459]]], // Viruses
    2: [["guyton-hall-14e", [459]]], // Bacteria
  },
};

// Textbook pages for each reading section of nucleic-acids (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "nucleic-acids-1": {
    0: [["guyton-hall-14e", [33, 34, 35]]], // Bases
    1: [["guyton-hall-14e", [33, 34, 35]]], // Nucleosides and nucleotides
    2: [["guyton-hall-14e", [34, 35, 36]]], // What nucleotides do
  },
  "nucleic-acids-2": {
    0: [["guyton-hall-14e", [34, 35]]], // Building on ribose phosphate
  },
  "nucleic-acids-4": {
    1: [["guyton-hall-14e", [40, 41]]], // Regulation
  },
  "nucleic-acids-5": {
    0: [["guyton-hall-14e", [42]]], // The double helix
    1: [["guyton-hall-14e", [33, 34, 35]]], // RNA versus DNA
    2: [["guyton-hall-14e", [42]]], // Absorbance and melting
    3: [["guyton-hall-14e", [39, 40]]], // Forms, supercoiling and chromatin
  },
  "nucleic-acids-6": {
    0: [["guyton-hall-14e", [42]]], // Three rules
    1: [["guyton-hall-14e", [42]]], // At the E. coli fork
    3: [["guyton-hall-14e", [44, 45]]], // Telomeres
  },
  "nucleic-acids-7": {
    1: [["guyton-hall-14e", [42, 43]]], // Mutations
  },
  "nucleic-acids-8": {
    1: [["guyton-hall-14e", [42]]], // Transcription in E. coli
    2: [["guyton-hall-14e", [39]]], // Eukaryotic transcription
  },
  "nucleic-acids-9": {
    1: [["guyton-hall-14e", [37, 38, 39]]], // On the ribosome
    2: [["guyton-hall-14e", [34, 35, 36]]], // The genetic code
  },
  "nucleic-acids-10": {
    0: [["guyton-hall-14e", [39, 40]]], // Genes and their expression
    1: [["guyton-hall-14e", [39, 40]]], // Operons
  },
  "nucleic-acids-11": {
    0: [["guyton-hall-14e", [39, 40]]], // Many control points
    1: [["guyton-hall-14e", [39, 40]]], // Chromatin and methylation
    2: [["guyton-hall-14e", [39, 40]]], // Transcription control
    3: [["guyton-hall-14e", [36, 37, 38]]], // After transcription
  },
  "nucleic-acids-12": {
    1: [["guyton-hall-14e", [45, 46, 47]]], // Causes and stages
    2: [["guyton-hall-14e", [46]]], // Oncogenes and tumour suppressors
    3: [["guyton-hall-14e", [45, 46, 47]]], // Hallmarks, cell death and treatment
  },
  "nucleic-acids-14": {
    0: [["guyton-hall-14e", [42, 43, 44]]], // PCR
  },
};

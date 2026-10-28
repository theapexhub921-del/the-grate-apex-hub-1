// Textbook pages for each reading section of neuroanatomy (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "neuroanatomy-1": {
    1: [["grays-anatomy-students-4e", [867]]], // Parts of the Brain
    2: [["grays-anatomy-students-4e", [867]]], // Lobes and Main Sulci
    3: [["grays-anatomy-students-4e", [867]]], // Gyri and Sulci of Each Surface
  },
  "neuroanatomy-5": {
    1: [["grays-anatomy-students-4e", [869, 870, 871]]], // Arteries of the Brain and the Circle of Willis
  },
  "neuroanatomy-6": {
    0: [["grays-anatomy-students-4e", [861]]], // The Meninges and the Layers of the Dura
    1: [["grays-anatomy-students-4e", [862]]], // The Dural Folds
    2: [["grays-anatomy-students-4e", [863, 864]]], // Nerve and Arterial Supply of the Dura
  },
  "neuroanatomy-7": {
    0: [["grays-anatomy-students-4e", [874, 875, 876]]], // The Major Sinuses
    1: [["grays-anatomy-students-4e", [875, 876, 877]]], // The Cavernous Sinus
  },
  "neuroanatomy-8": {
    0: [["grays-anatomy-students-4e", [865]]], // Arachnoid and Pia Mater
    1: [["grays-anatomy-students-4e", [865]]], // Meningeal Spaces and Cisterns
    2: [["grays-anatomy-students-4e", [864, 865, 866]]], // Intracranial Haemorrhage and Meningitis
  },
};

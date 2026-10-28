// Textbook pages for each reading section of cardiovascular-system-gross (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "cardiovascular-system-gross-1": {
    1: [["grays-anatomy-students-4e", [185]]], // The Mediastinum and its Subdivisions
    2: [["grays-anatomy-students-4e", [215, 216]]], // Contents of the Superior Mediastinum
    3: [["grays-anatomy-students-4e", [215]]], // Anterior, Middle and Posterior Mediastinum
  },
  "cardiovascular-system-gross-2": {
    0: [["grays-anatomy-students-4e", [185, 186]]], // Fibrous and Serous Pericardium
    1: [["grays-anatomy-students-4e", [185]]], // Position and Relations of the Pericardial Sac
    2: [["grays-anatomy-students-4e", [188]]], // The Pericardial Sinuses
    3: [["grays-anatomy-students-4e", [189]]], // Blood Supply, Nerve Supply and Clinical Notes
  },
  "cardiovascular-system-gross-3": {
    1: [["grays-anatomy-students-4e", [191, 192, 193]]], // Borders and Surfaces
    3: [["grays-anatomy-students-4e", [193]]], // The Cardiac Wall, Chambers and Grooves
  },
  "cardiovascular-system-gross-4": {
    0: [["grays-anatomy-students-4e", [196, 197]]], // The Right Atrium
    1: [["grays-anatomy-students-4e", [197, 198, 199]]], // The Right Ventricle
    2: [["grays-anatomy-students-4e", [197, 198, 199]]], // The Left Atrium and Left Ventricle
    3: [["grays-anatomy-students-4e", [202, 203]]], // The Cardiac Skeleton
    4: [["grays-anatomy-students-4e", [209]]], // Surface Marking of the Valves and Heart Sounds
  },
  "cardiovascular-system-gross-5": {
    0: [["grays-anatomy-students-4e", [211]]], // The Conduction System
    1: [["grays-anatomy-students-4e", [204, 205, 206]]], // The Coronary Arteries
    2: [["grays-anatomy-students-4e", [209]]], // Venous Drainage of the Heart
  },
  "cardiovascular-system-gross-6": {
    1: [["grays-anatomy-students-4e", [25]]], // The Vessel Wall and Arteries
  },
  "cardiovascular-system-gross-7": {
    0: [["grays-anatomy-students-4e", [215]]], // The Ascending Aorta and the Arch
    1: [["grays-anatomy-students-4e", [191]]], // The Pulmonary Trunk
  },
};

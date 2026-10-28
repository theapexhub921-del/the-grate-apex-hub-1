// Textbook pages for each reading section of respiratory-system-gross (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "respiratory-system-gross-1": {
    1: [["grays-anatomy-students-4e", [1065, 1066]]], // The Nose and Nasal Cavity
    2: [["grays-anatomy-students-4e", [1035, 1036, 1037]]], // The Pharynx
    3: [["grays-anatomy-students-4e", [1037]]], // Waldeyer’s Tonsillar Ring
  },
  "respiratory-system-gross-2": {
    2: [["grays-anatomy-students-4e", [1045, 1046, 1047]]], // Cartilages, Ligaments and Membranes
    3: [["grays-anatomy-students-4e", [1048, 1049, 1050]]], // The Laryngeal Aditus (Inlet)
  },
  "respiratory-system-gross-4": {
    0: [["grays-anatomy-students-4e", [125, 126]]], // Components and Structure of the Thoracic Wall
    1: [["grays-anatomy-students-4e", [153, 154, 155]]], // Muscles of the Thoracic Wall
    2: [["grays-anatomy-students-4e", [151]]], // The Thoracic Apertures
    3: [["grays-anatomy-students-4e", [162]]], // Intercostal Spaces and Joints
  },
  "respiratory-system-gross-5": {
    0: [["grays-anatomy-students-4e", [370]]], // Muscular Parts and Arcuate Ligaments
    2: [["grays-anatomy-students-4e", [370]]], // Openings of the Diaphragm
    3: [["grays-anatomy-students-4e", [371]]], // Nerve and Blood Supply
    4: [["grays-anatomy-students-4e", [372]]], // Development and Clinical Notes
  },
  "respiratory-system-gross-6": {
    0: [["grays-anatomy-students-4e", [166, 167]]], // The Thoracic Cavity and the Pleura
    1: [["grays-anatomy-students-4e", [166, 167, 168]]], // Surface Markings of the Pleural Reflections
    2: [["grays-anatomy-students-4e", [167, 168]]], // The Costodiaphragmatic Recess and Lines of Reflection
    3: [["grays-anatomy-students-4e", [169]]], // Clinical Notes
  },
  "respiratory-system-gross-7": {
    0: [["grays-anatomy-students-4e", [170, 171]]], // General Features, Surfaces and Borders
    1: [["grays-anatomy-students-4e", [172, 173, 174]]], // Lung Roots, Fissures and Lobes
    2: [["grays-anatomy-students-4e", [173]]], // The Main Bronchi
    3: [["grays-anatomy-students-4e", [175, 176]]], // Bronchopulmonary Segments
    4: [["grays-anatomy-students-4e", [179]]], // Blood, Lymph and Nerve Supply
  },
};

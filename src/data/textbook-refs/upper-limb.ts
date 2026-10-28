// Textbook pages for each reading section of upper-limb (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "upper-limb-1": {
    1: [["grays-anatomy-students-4e", [783, 784, 785]]], // Bones of the Forearm and Wrist
  },
  "upper-limb-2": {
    0: [["grays-anatomy-students-4e", [693, 694]]], // Articulations of the Pectoral Girdle
    1: [["grays-anatomy-students-4e", [695, 696, 697]]], // The Glenohumeral Joint and Stability
    2: [["grays-anatomy-students-4e", [700]]], // Shoulder Dislocation and Labral Injuries
  },
  "upper-limb-3": {
    0: [["grays-anatomy-students-4e", [712, 713, 714]]], // Muscles of the Pectoral Region and Shoulder Girdle
    1: [["grays-anatomy-students-4e", [706]]], // The Rotator Cuff (SITS)
    2: [["grays-anatomy-students-4e", [707, 708, 709]]], // Posterior Scapular Spaces (Quadrangular and Triangular)
  },
  "upper-limb-4": {
    0: [["grays-anatomy-students-4e", [743, 744]]], // Anterior Compartment of the Arm
    1: [["grays-anatomy-students-4e", [743, 744, 745]]], // Posterior Compartment of the Arm
    2: [["grays-anatomy-students-4e", [758, 759, 760]]], // The Cubital Fossa: Boundaries, Floor, Roof and Contents
  },
  "upper-limb-5": {
    0: [["grays-anatomy-students-4e", [771, 772]]], // Anterior Forearm: Flexor-Pronator Compartment
    1: [["grays-anatomy-students-4e", [777, 778, 779]]], // Posterior Forearm: Extensor-Supinator Compartment
    2: [["grays-anatomy-students-4e", [791, 792, 793]]], // Extensor Tendon Compartments and the Anatomical Snuffbox
  },
  "upper-limb-6": {
    1: [["grays-anatomy-students-4e", [772, 773, 774]]], // Brachial, Radial and Ulnar Arteries
    2: [["grays-anatomy-students-4e", [752]]], // Peripheral Nerves: Course, Distribution and Lesions
  },
};

// Textbook pages for each reading section of head-and-neck (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "head-and-neck-1": {
    1: [["grays-anatomy-students-4e", [990, 991, 992]]], // Cervical Fascia and the Carotid Sheath
    2: [["grays-anatomy-students-4e", [1011]]], // The Anterior Triangle
    3: [["grays-anatomy-students-4e", [1016, 1017]]], // The Posterior Triangle and the Cervical Plexus
  },
  "head-and-neck-2": {
    0: [["grays-anatomy-students-4e", [911, 912]]], // The Five Layers of the Scalp
    1: [["grays-anatomy-students-4e", [913, 914, 915]]], // Nerves and Arteries of the Scalp
    2: [["grays-anatomy-students-4e", [893, 894, 895]]], // The Face and its Muscles
  },
  "head-and-neck-3": {
    0: [["grays-anatomy-students-4e", [923, 924]]], // Bony Orbit and its Openings
    1: [["grays-anatomy-students-4e", [931, 932]]], // Vessels of the Orbit
    2: [["grays-anatomy-students-4e", [932, 933, 934]]], // Extraocular Muscles and the Common Tendinous Ring
    3: [["grays-anatomy-students-4e", [921]]], // Lacrimal Apparatus and the Eye
  },
  "head-and-neck-4": {
    0: [["grays-anatomy-students-4e", [982, 983, 984]]], // Position, Walls and Openings
    1: [["grays-anatomy-students-4e", [983, 984, 985]]], // Contents and Clinical Importance
  },
  "head-and-neck-5": {
    0: [["grays-anatomy-students-4e", [1066, 1067, 1068]]], // Walls and Openings of the Nasal Cavity
    1: [["grays-anatomy-students-4e", [1071, 1072, 1073]]], // Blood Supply and Epistaxis
    2: [["grays-anatomy-students-4e", [1063, 1064, 1065]]], // The Paranasal Sinuses
  },
  "head-and-neck-6": {
    0: [["grays-anatomy-students-4e", [944, 945, 946]]], // The External Ear
    1: [["grays-anatomy-students-4e", [950, 951, 952]]], // The Middle Ear
    2: [["grays-anatomy-students-4e", [955, 956, 957]]], // The Inner Ear and Development of the Ear
  },
  "head-and-neck-7": {
    2: [["grays-anatomy-students-4e", [976, 977]]], // Secretomotor Supply
  },
  "head-and-neck-8": {
    0: [["grays-anatomy-students-4e", [883]]], // Functional Components of Nerves
    1: [["grays-anatomy-students-4e", [885, 886]]], // Olfactory and Optic Nerves
    2: [["grays-anatomy-students-4e", [886]]], // Oculomotor, Trochlear and Abducent Nerves
    3: [["grays-anatomy-students-4e", [887, 888]]], // The Trigeminal Nerve
  },
  "head-and-neck-9": {
    0: [["grays-anatomy-students-4e", [888]]], // The Facial Nerve
    1: [["grays-anatomy-students-4e", [888]]], // Vestibulocochlear and Glossopharyngeal Nerves
    2: [["grays-anatomy-students-4e", [883, 884]]], // Vagus, Accessory and Hypoglossal Nerves
  },
  "head-and-neck-10": {
    0: [["grays-anatomy-students-4e", [1049, 1050, 1051]]], // Functions and Cartilages
    1: [["grays-anatomy-students-4e", [1049, 1050, 1051]]], // Ligaments, Cavity and Folds
    2: [["grays-anatomy-students-4e", [1056, 1057, 1058]]], // Muscles, Blood Supply, Lymph and Nerves
  },
};

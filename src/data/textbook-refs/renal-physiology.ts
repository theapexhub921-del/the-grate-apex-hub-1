// Textbook pages for each reading section of renal-physiology (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "renal-physiology-1": {
    0: [["guyton-hall-14e", [321, 322, 323]], ["costanzo-physiology", [245]]], // The urinary system
    1: [["guyton-hall-14e", [322, 323]], ["costanzo-physiology", [245]]], // Gross structure
    3: [["guyton-hall-14e", [323, 324]], ["costanzo-physiology", [246]]], // The vascular component
    4: [["guyton-hall-14e", [323, 324]], ["costanzo-physiology", [245]]], // The tubular component
    5: [["guyton-hall-14e", [339, 340]], ["costanzo-physiology", [259]]], // The juxtaglomerular apparatus
  },
  "renal-physiology-2": {
    0: [["guyton-hall-14e", [331, 332, 333]], ["costanzo-physiology", [261, 262]]], // The filtration barrier
    2: [["guyton-hall-14e", [333, 334, 335]], ["costanzo-physiology", [263]]], // Glomerular filtration rate
    4: [["guyton-hall-14e", [337, 338, 339]], ["costanzo-physiology", [257, 258, 259]]], // Extrinsic control
  },
  "renal-physiology-3": {
    0: [["guyton-hall-14e", [343, 344, 345]]], // Reabsorption and its routes
    1: [["guyton-hall-14e", [344, 345, 346]], ["costanzo-physiology", [270]]], // Sodium
    2: [["guyton-hall-14e", [345, 346, 347]], ["costanzo-physiology", [270, 271]]], // Glucose, amino acids and the tubular maximum
    4: [["guyton-hall-14e", [371, 372, 373]], ["costanzo-physiology", [283, 284, 285]]], // Segment by segment
    5: [["guyton-hall-14e", [358, 359, 360]], ["costanzo-physiology", [273]]], // Tubular secretion
  },
  "renal-physiology-4": {
    0: [["guyton-hall-14e", [368, 369]]], // Why a countercurrent?
    1: [["guyton-hall-14e", [368, 369, 370]], ["costanzo-physiology", [300, 301, 302]]], // The countercurrent multiplier
    2: [["guyton-hall-14e", [368, 369, 370]], ["costanzo-physiology", [302, 303]]], // The countercurrent exchanger
    3: [["guyton-hall-14e", [359, 360]], ["costanzo-physiology", [306, 307, 308]]], // ADH
  },
  "renal-physiology-5": {
    0: [["guyton-hall-14e", [360, 361, 362]], ["costanzo-physiology", [255, 256]]], // Clearance
    1: [["guyton-hall-14e", [360, 361, 362]], ["costanzo-physiology", [265, 266, 267]]], // Measuring GFR
    2: [["guyton-hall-14e", [361, 362, 363]], ["costanzo-physiology", [259, 260]]], // Renal plasma and blood flow
  },
  "renal-physiology-6": {
    0: [["guyton-hall-14e", [325, 326]], ["costanzo-physiology", [55]]], // The bladder
    2: [["guyton-hall-14e", [325, 326, 327]], ["costanzo-physiology", [55]]], // Storage
    3: [["guyton-hall-14e", [326, 327, 328]], ["costanzo-physiology", [55]]], // Voiding
  },
  "renal-physiology-7": {
    0: [["guyton-hall-14e", [403, 404]], ["costanzo-physiology", [336]]], // pH and acids
    1: [["guyton-hall-14e", [404, 405, 406]], ["costanzo-physiology", [312, 313, 314]]], // Chemical buffers
    2: [["guyton-hall-14e", [407, 408, 409]]], // The lungs
    3: [["guyton-hall-14e", [410, 411, 412]], ["costanzo-physiology", [318, 319, 320]]], // The kidneys
    4: [["guyton-hall-14e", [415, 416, 417]], ["costanzo-physiology", [335, 336]]], // Disorders and compensation
  },
};

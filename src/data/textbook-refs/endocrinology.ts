// Textbook pages for each reading section of endocrinology (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "endocrinology-1": {
    3: [["guyton-hall-14e", [919]], ["costanzo-physiology", [399, 400, 401]]], // Control of secretion
  },
  "endocrinology-2": {
    0: [["costanzo-physiology", [407, 408, 409]]], // The hypothalamus
    1: [["guyton-hall-14e", [938]], ["costanzo-physiology", [415, 416]]], // The posterior pituitary
    2: [["guyton-hall-14e", [940]], ["costanzo-physiology", [418, 419]]], // Oxytocin
    3: [["guyton-hall-14e", [938, 939]], ["costanzo-physiology", [416]]], // ADH (arginine vasopressin)
  },
  "endocrinology-3": {
    1: [["costanzo-physiology", [411, 412, 413]]], // What growth hormone does
    2: [["costanzo-physiology", [413]]], // Control of growth hormone
    3: [["guyton-hall-14e", [936, 937]], ["costanzo-physiology", [413]]], // Too much or too little growth hormone
    4: [["guyton-hall-14e", [917]], ["costanzo-physiology", [413, 414]]], // Prolactin
    5: [["costanzo-physiology", [410, 411]]], // Melanocyte-stimulating hormone
  },
  "endocrinology-4": {
    1: [["guyton-hall-14e", [941, 942, 943]], ["costanzo-physiology", [419, 420]]], // Iodine and the follicle
    5: [["guyton-hall-14e", [953]]], // Thyroid disease
  },
  "endocrinology-5": {
    0: [["costanzo-physiology", [427, 428]]], // Cortex and medulla
    1: [["guyton-hall-14e", [955, 956]], ["costanzo-physiology", [431, 432, 433]]], // The cortisol axis
    3: [["guyton-hall-14e", [960, 961, 962]], ["costanzo-physiology", [434, 435]]], // Aldosterone and the renin–angiotensin system
  },
  "endocrinology-6": {
    1: [["guyton-hall-14e", [974]], ["costanzo-physiology", [441, 442]]], // Insulin: structure and fate
    4: [["guyton-hall-14e", [984, 985, 986]], ["costanzo-physiology", [445, 446]]], // Diabetes mellitus
  },
  "endocrinology-7": {
    2: [["guyton-hall-14e", [994, 995, 996]]], // Bone
    3: [["guyton-hall-14e", [997, 998]], ["costanzo-physiology", [456, 457, 458]]], // Vitamin D
    4: [["guyton-hall-14e", [998, 999, 1000]], ["costanzo-physiology", [451, 452, 453]]], // Parathyroid hormone
    5: [["costanzo-physiology", [455]]], // Calcitonin
  },
};

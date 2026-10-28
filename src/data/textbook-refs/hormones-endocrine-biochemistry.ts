// Textbook pages for each reading section of hormones-endocrine-biochemistry (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "hormones-endocrine-biochemistry-1": {
    0: [["guyton-hall-14e", [915, 916, 917]]], // The endocrine glands
    1: [["guyton-hall-14e", [915, 916, 917]]], // What a hormone is
  },
  "hormones-endocrine-biochemistry-2": {
    1: [["guyton-hall-14e", [922, 923, 924]]], // What a hormone does
    2: [["guyton-hall-14e", [922, 923, 924]]], // cAMP as second messenger
    3: [["guyton-hall-14e", [924, 925]]], // DAG, IP₃ and calcium
  },
  "hormones-endocrine-biochemistry-3": {
    2: [["guyton-hall-14e", [925, 926]]], // How steroid hormones act
    3: [["guyton-hall-14e", [966, 967, 968]]], // Feedback control: the HPA axis
  },
};

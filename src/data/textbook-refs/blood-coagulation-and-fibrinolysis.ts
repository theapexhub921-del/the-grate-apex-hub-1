// Textbook pages for each reading section of blood-coagulation-and-fibrinolysis (printed page numbers),
// matched to the section's own lecture text: Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "blood-coagulation-and-fibrinolysis-1": {
    0: [["guyton-hall-14e", [479, 480, 481]]], // A cascade of proteases
    1: [["guyton-hall-14e", [477, 478, 479]]], // Haemostasis
    2: [["guyton-hall-14e", [480, 481, 482]]], // Three pathways
    3: [["guyton-hall-14e", [482, 483, 484]]], // What starts the intrinsic pathway
  },
  "blood-coagulation-and-fibrinolysis-2": {
    1: [["guyton-hall-14e", [479, 480, 481]]], // Fibrinogen (factor I)
    2: [["guyton-hall-14e", [479, 480]]], // Fibrinopeptides and the fibrin monomer
    3: [["guyton-hall-14e", [479, 480]]], // Cross-linking the clot
  },
  "blood-coagulation-and-fibrinolysis-3": {
    1: [["guyton-hall-14e", [481, 482, 483]]], // Phospholipid and calcium
    2: [["guyton-hall-14e", [487, 488]]], // Vitamin K and γ-carboxyglutamate
    3: [["guyton-hall-14e", [484, 485]]], // Vitamin K deficiency bleeding
    4: [["guyton-hall-14e", [488]]], // Haemophilia
    5: [["guyton-hall-14e", [488]]], // Von Willebrand factor and kallikreins
  },
  "blood-coagulation-and-fibrinolysis-4": {
    0: [["guyton-hall-14e", [482, 483, 484]]], // Keeping clotting local
    1: [["guyton-hall-14e", [483, 484]]], // Antithrombin III and heparin
    2: [["guyton-hall-14e", [483, 484]]], // Fibrinolysis: plasmin
    3: [["guyton-hall-14e", [486]]], // Aspirin and thrombolytic drugs
  },
};

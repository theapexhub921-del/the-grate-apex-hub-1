// Textbook pages for each reading section of gastrointestinal-physiology (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "gastrointestinal-physiology-1": {
    1: [["guyton-hall-14e", [807]], ["costanzo-physiology", [339]]], // Tract and accessory organs
  },
  "gastrointestinal-physiology-2": {
    0: [["guyton-hall-14e", [824]], ["costanzo-physiology", [376]]], // Carbohydrate: digestion
    2: [["guyton-hall-14e", [824, 825]], ["costanzo-physiology", [377, 378, 379]]], // Protein: digestion
    3: [["guyton-hall-14e", [831]], ["costanzo-physiology", [379, 380]]], // Protein: absorption
    4: [["guyton-hall-14e", [825, 826]], ["costanzo-physiology", [380, 381, 382]]], // Lipid: digestion
    5: [["guyton-hall-14e", [831]], ["costanzo-physiology", [381, 382]]], // Lipid: absorption
  },
  "gastrointestinal-physiology-3": {
    0: [["guyton-hall-14e", [828, 829]], ["costanzo-physiology", [384, 385]]], // Water
    1: [["guyton-hall-14e", [829, 830, 831]], ["costanzo-physiology", [385]]], // Sodium, chloride and bicarbonate
    2: [["costanzo-physiology", [384, 385]]], // Calcium
    3: [["guyton-hall-14e", [829, 830, 831]], ["costanzo-physiology", [384, 385]]], // Iron
    4: [["costanzo-physiology", [384]]], // Vitamins
  },
  "gastrointestinal-physiology-4": {
    1: [["guyton-hall-14e", [809]], ["costanzo-physiology", [356, 357]]], // Salivary glands
    2: [["guyton-hall-14e", [808, 809]], ["costanzo-physiology", [357, 358]]], // Making saliva
    4: [["guyton-hall-14e", [810]]], // Control of salivation
    5: [["guyton-hall-14e", [834]], ["costanzo-physiology", [360, 361]]], // Gastric mucus
    6: [["guyton-hall-14e", [811, 812, 813]], ["costanzo-physiology", [360, 361]]], // How the parietal cell makes acid
    7: [["guyton-hall-14e", [811, 812, 813]], ["costanzo-physiology", [366]]], // Intrinsic factor, enzymes and gastrin
  },
  "gastrointestinal-physiology-5": {
    0: [["guyton-hall-14e", [815, 816, 817]], ["costanzo-physiology", [367, 368]]], // The exocrine pancreas
    1: [["guyton-hall-14e", [815, 816, 817]], ["costanzo-physiology", [368, 369, 370]]], // Pancreatic enzymes
    2: [["guyton-hall-14e", [815, 816, 817]], ["costanzo-physiology", [361]]], // Bicarbonate
    4: [["guyton-hall-14e", [820, 821]], ["costanzo-physiology", [392]]], // Small intestinal secretion
    5: [["guyton-hall-14e", [820, 821]]], // Large intestinal secretion
  },
  "gastrointestinal-physiology-6": {
    0: [["costanzo-physiology", [342, 343, 344]]], // Endocrine and paracrine control
    2: [["guyton-hall-14e", [789, 790, 791]], ["costanzo-physiology", [342]]], // The enteric nervous system
    4: [["guyton-hall-14e", [813, 814]], ["costanzo-physiology", [363, 364]]], // Three phases of gastric secretion
  },
  "gastrointestinal-physiology-7": {
    0: [["guyton-hall-14e", [787]], ["costanzo-physiology", [348]]], // GI smooth muscle
    1: [["guyton-hall-14e", [787, 788, 789]], ["costanzo-physiology", [349, 350]]], // Slow waves and spikes
    3: [["guyton-hall-14e", [797, 798, 799]], ["costanzo-physiology", [350, 351]]], // Swallowing
    4: [["guyton-hall-14e", [800, 801, 802]], ["costanzo-physiology", [351, 352, 353]]], // The stomach
    5: [["guyton-hall-14e", [813, 814]], ["costanzo-physiology", [353]]], // Control of gastric motility
  },
  "gastrointestinal-physiology-8": {
    0: [["costanzo-physiology", [353]]], // The small intestine
    1: [["guyton-hall-14e", [836, 837, 838]], ["costanzo-physiology", [355, 356]]], // The large intestine
    2: [["guyton-hall-14e", [814]], ["costanzo-physiology", [355, 356]]], // Colonic movements
    3: [["guyton-hall-14e", [837]], ["costanzo-physiology", [355, 356]]], // Defecation
    4: [["guyton-hall-14e", [837, 838]], ["costanzo-physiology", [355]]], // Vomiting
  },
  "gastrointestinal-physiology-9": {
    0: [["guyton-hall-14e", [818, 819, 820]], ["costanzo-physiology", [389, 390]]], // The liver
    1: [["guyton-hall-14e", [818, 819, 820]], ["costanzo-physiology", [370, 371, 372]]], // Bile
    2: [["guyton-hall-14e", [818, 819, 820]], ["costanzo-physiology", [373]]], // The gallbladder
    3: [["guyton-hall-14e", [818, 819, 820]], ["costanzo-physiology", [389, 390, 391]]], // What bile does and how it is released
    4: [["costanzo-physiology", [389]]], // Jaundice
  },
};

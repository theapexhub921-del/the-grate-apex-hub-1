// Textbook pages for each reading section of respiratory-physiology (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "respiratory-physiology-1": {
    0: [["guyton-hall-14e", [489, 490]]], // What Respiration Means
    1: [["guyton-hall-14e", [489, 490]], ["costanzo-physiology", [197, 198]]], // The Respiratory Muscles
    2: [["guyton-hall-14e", [498, 499, 500]], ["costanzo-physiology", [189, 190]]], // The Airway
    5: [["guyton-hall-14e", [489, 490]], ["costanzo-physiology", [206]]], // Pressure Gradients Move the Air
    6: [["guyton-hall-14e", [490, 493, 494]], ["costanzo-physiology", [200]]], // Intrapleural Pressure
  },
  "respiratory-physiology-2": {
    0: [["guyton-hall-14e", [495, 496, 497]], ["costanzo-physiology", [191]]], // Volumes and Capacities
    1: [["guyton-hall-14e", [495, 496, 497]], ["costanzo-physiology", [191, 192, 193]]], // The Capacities
    2: [["guyton-hall-14e", [495, 496, 497]], ["costanzo-physiology", [191]]], // Spirometry and FEV1
    3: [["guyton-hall-14e", [494, 495, 496]], ["costanzo-physiology", [197, 198]]], // What Changes the Vital Capacity
  },
  "respiratory-physiology-3": {
    0: [["guyton-hall-14e", [494]], ["costanzo-physiology", [201, 202, 203]]], // Recoil and Compliance
    1: [["costanzo-physiology", [201, 202, 203]]], // What Changes Compliance
    2: [["guyton-hall-14e", [493, 494]], ["costanzo-physiology", [204]]], // Surfactant
    3: [["guyton-hall-14e", [494]], ["costanzo-physiology", [204]]], // When Surfactant Is Missing
    4: [["guyton-hall-14e", [494]], ["costanzo-physiology", [201, 202, 203]]], // Resistance and the Work of Breathing
  },
  "respiratory-physiology-4": {
    0: [["costanzo-physiology", [229]]], // Ventilation and Gravity
    1: [["guyton-hall-14e", [497, 498]], ["costanzo-physiology", [229]]], // Dead Space
    2: [["guyton-hall-14e", [496, 497, 498]], ["costanzo-physiology", [229]]], // Alveolar Ventilation
    3: [["guyton-hall-14e", [503, 504]], ["costanzo-physiology", [227, 228, 229]]], // The Pulmonary Circulation
    4: [["guyton-hall-14e", [505]], ["costanzo-physiology", [225, 226]]], // Hypoxic Pulmonary Vasoconstriction
  },
  "respiratory-physiology-5": {
    0: [["guyton-hall-14e", [521]], ["costanzo-physiology", [216]]], // Getting Oxygen to the Tissues
    2: [["guyton-hall-14e", [524, 525, 526]], ["costanzo-physiology", [218, 219, 220]]], // The Dissociation Curve
    3: [["costanzo-physiology", [219, 220, 221]]], // The Flat and the Steep Parts
    4: [["guyton-hall-14e", [524, 525, 526]], ["costanzo-physiology", [219, 220, 221]]], // P50 and Shifts of the Curve
  },
  "respiratory-physiology-6": {
    0: [["guyton-hall-14e", [525, 526]], ["costanzo-physiology", [220, 221]]], // What Shifts the Curve
    2: [["guyton-hall-14e", [529]], ["costanzo-physiology", [224, 225]]], // The Bohr and Haldane Effects
    3: [["costanzo-physiology", [221]]], // Fetal Haemoglobin and Myoglobin
    4: [["guyton-hall-14e", [525, 526, 527]], ["costanzo-physiology", [221, 222, 223]]], // Carbon Monoxide
    5: [["guyton-hall-14e", [528, 529]], ["costanzo-physiology", [211]]], // How CO₂ Is Carried
  },
  "respiratory-physiology-7": {
    1: [["guyton-hall-14e", [513, 514]], ["costanzo-physiology", [213, 214, 215]]], // Alveolar Air
    2: [["guyton-hall-14e", [516, 517, 518]], ["costanzo-physiology", [210, 211]]], // The Respiratory Membrane
    3: [["guyton-hall-14e", [517, 518]], ["costanzo-physiology", [241, 242]]], // Diffusing Capacity
    4: [["guyton-hall-14e", [518, 519]], ["costanzo-physiology", [229]]], // The Ventilation–Perfusion Ratio
    5: [["costanzo-physiology", [229, 230, 231]]], // The Lung Apex
  },
  "respiratory-physiology-8": {
    0: [["guyton-hall-14e", [531, 532, 533]], ["costanzo-physiology", [232, 233]]], // Voluntary and Automatic Control
    1: [["guyton-hall-14e", [531, 532]], ["costanzo-physiology", [232, 233]]], // The Medullary Centres
    2: [["guyton-hall-14e", [531, 532]], ["costanzo-physiology", [232, 233]]], // Transection Experiments and the Pons
    3: [["guyton-hall-14e", [532]], ["costanzo-physiology", [232, 233]]], // The Hering–Breuer Reflex
    4: [["guyton-hall-14e", [533, 534, 535]], ["costanzo-physiology", [234, 235]]], // Chemoreceptors
    5: [["guyton-hall-14e", [537, 538, 539]], ["costanzo-physiology", [236, 237, 238]]], // Responses to Chemical Changes
    6: [["guyton-hall-14e", [531, 532]], ["costanzo-physiology", [205, 206]]], // Cough, Sneeze and Swallowing
    7: [["costanzo-physiology", [235, 236, 237]]], // Breathing in Exercise
  },
  "respiratory-physiology-9": {
    2: [["guyton-hall-14e", [547, 548]]], // Cyanosis
    3: [["guyton-hall-14e", [553, 554, 555]], ["costanzo-physiology", [237, 238, 239]]], // High Altitude
    4: [["costanzo-physiology", [238, 239]]], // Acclimatisation
    5: [["guyton-hall-14e", [519]], ["costanzo-physiology", [241, 242]]], // Failure of the Exchange Apparatus
    6: [["guyton-hall-14e", [546, 547, 548]]], // Oxygen Treatment
    8: [["guyton-hall-14e", [563, 564, 565]]], // Diving and Drowning
  },
};

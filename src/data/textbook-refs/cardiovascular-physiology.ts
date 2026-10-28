// Textbook pages for each reading section of cardiovascular-physiology (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "cardiovascular-physiology-1": {
    1: [["guyton-hall-14e", [129]], ["costanzo-physiology", [131, 132]]], // The conducting system
    2: [["guyton-hall-14e", [118, 119, 120]], ["costanzo-physiology", [155, 156, 157]]], // Diastole and atrial systole
    3: [["guyton-hall-14e", [118, 119, 120]], ["costanzo-physiology", [155, 156, 157]]], // Ventricular systole
    4: [["guyton-hall-14e", [122]], ["costanzo-physiology", [149, 150]]], // Volumes in the cycle
    5: [["guyton-hall-14e", [119, 120, 121]], ["costanzo-physiology", [157]]], // Right versus left, inspiration versus expiration
    6: [["guyton-hall-14e", [118, 119, 120]], ["costanzo-physiology", [144]]], // Why a fast heart rate is dangerous
  },
  "cardiovascular-physiology-2": {
    0: [["costanzo-physiology", [128, 129, 130]]], // The arterial pulse
    1: [["guyton-hall-14e", [282, 283, 284]], ["costanzo-physiology", [155, 156, 157]]], // The jugular venous pulse
    3: [["guyton-hall-14e", [284, 285, 287]], ["costanzo-physiology", [155, 156, 157]]], // Heart sounds
    4: [["guyton-hall-14e", [282, 283, 284]], ["costanzo-physiology", [155, 156, 157]]], // Murmurs and bruits
  },
  "cardiovascular-physiology-3": {
    0: [["guyton-hall-14e", [123, 124, 125]], ["costanzo-physiology", [149, 150, 151]]], // Cardiac output
    1: [["guyton-hall-14e", [122, 123]], ["costanzo-physiology", [149]]], // Preload, afterload and Starling’s law
    3: [["costanzo-physiology", [145, 146, 147]]], // Contractility
    4: [["costanzo-physiology", [178, 179, 180]]], // Cardiac output in exercise and other states
    5: [["costanzo-physiology", [154]]], // Fick’s principle
    6: [["guyton-hall-14e", [121, 122, 123]], ["costanzo-physiology", [153]]], // Work done by the heart
  },
  "cardiovascular-physiology-4": {
    0: [["guyton-hall-14e", [188, 189, 190]], ["costanzo-physiology", [117, 118, 119]]], // What moves blood forward
    2: [["guyton-hall-14e", [177, 178, 179]], ["costanzo-physiology", [123, 124]]], // Flow, pressure and resistance
    3: [["guyton-hall-14e", [175, 176]], ["costanzo-physiology", [126]]], // Laminar and turbulent flow
    4: [["costanzo-physiology", [120, 121, 122]]], // Velocity and cross-sectional area
    5: [["guyton-hall-14e", [178, 179]]], // Viscosity
    6: [["guyton-hall-14e", [183, 184]], ["costanzo-physiology", [128, 129, 130]]], // Capacitance and distribution of blood
    7: [["guyton-hall-14e", [185, 186, 187]], ["costanzo-physiology", [128, 129, 130]]], // Arterial blood pressure
    8: [["guyton-hall-14e", [186, 187]]], // Measuring blood pressure
  },
  "cardiovascular-physiology-5": {
    3: [["guyton-hall-14e", [200, 201, 202]], ["costanzo-physiology", [173]]], // Lymphatic drainage
    4: [["guyton-hall-14e", [189, 190, 191]], ["costanzo-physiology", [184, 185, 186]]], // Venous circulation
  },
  "cardiovascular-physiology-6": {
    1: [["guyton-hall-14e", [209]], ["costanzo-physiology", [173, 174, 175]]], // Autoregulation: the metabolic theory
    2: [["guyton-hall-14e", [208, 209]], ["costanzo-physiology", [174]]], // Autoregulation: the myogenic theory
    3: [["guyton-hall-14e", [214, 215]], ["costanzo-physiology", [175]]], // Systemic control: humoral and nervous
    4: [["guyton-hall-14e", [218, 219, 220]], ["costanzo-physiology", [164, 165, 166]]], // The vasomotor centre
    5: [["guyton-hall-14e", [221, 222]], ["costanzo-physiology", [164, 165, 166]]], // The baroreceptor reflex
    6: [["guyton-hall-14e", [224, 225]]], // Atrial (volume) receptors
  },
  "cardiovascular-physiology-7": {
    0: [["guyton-hall-14e", [275, 276]], ["costanzo-physiology", [184, 185, 186]]], // Standing up
    4: [["guyton-hall-14e", [275, 276, 277]], ["costanzo-physiology", [181]]], // Signs of hypovolaemic shock — and why
    5: [["costanzo-physiology", [181, 182]]], // Irreversible shock
    6: [["guyton-hall-14e", [299, 300, 303]], ["costanzo-physiology", [183, 184, 185]]], // Other causes of shock, and syncope
  },
  "cardiovascular-physiology-8": {
    0: [["guyton-hall-14e", [776]]], // Cerebral blood supply and the meninges
    1: [["guyton-hall-14e", [779, 783]]], // Cerebrospinal fluid
    4: [["guyton-hall-14e", [778, 779]], ["costanzo-physiology", [174, 175, 176]]], // Cerebral blood flow
    5: [["costanzo-physiology", [174, 175, 176]]], // Coronary circulation
    6: [["costanzo-physiology", [184, 185, 186]]], // Pulmonary circulation
    7: [["guyton-hall-14e", [794]], ["costanzo-physiology", [173]]], // Splanchnic and liver circulation
  },
  "cardiovascular-physiology-9": {
    0: [["guyton-hall-14e", [140, 141]]], // What the ECG records
    4: [["guyton-hall-14e", [157, 158]], ["costanzo-physiology", [142]]], // Cardiac rhythms
  },
};

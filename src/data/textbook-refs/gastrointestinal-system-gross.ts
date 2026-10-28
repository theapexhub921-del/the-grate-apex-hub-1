// Textbook pages for each reading section of gastrointestinal-system-gross (printed page numbers),
// matched to the section's own lecture text: Gray's Anatomy for Students (4th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "gastrointestinal-system-gross-1": {
    0: [["grays-anatomy-students-4e", [273, 274]]], // Boundaries, Quadrants and Regions
    1: [["grays-anatomy-students-4e", [282, 283]]], // Surface Landmarks: McBurney’s and Murphy’s Points
    2: [["grays-anatomy-students-4e", [276, 277]]], // Layers of the Wall and the Superficial Fascia
    3: [["grays-anatomy-students-4e", [281, 282, 283]]], // Muscles of the Anterolateral Wall
  },
  "gastrointestinal-system-gross-2": {
    0: [["grays-anatomy-students-4e", [282, 283]]], // The Rectus Sheath
    1: [["grays-anatomy-students-4e", [288]]], // Vessels and Lymphatics of the Wall
  },
  "gastrointestinal-system-gross-3": {
    0: [["grays-anatomy-students-4e", [291, 292, 293]]], // The Inguinal Canal
    1: [["grays-anatomy-students-4e", [289, 290]]], // Testicular Descent and the Spermatic Cord
    2: [["grays-anatomy-students-4e", [297, 298, 299]]], // Inguinal and Femoral Hernias
    3: [["grays-anatomy-students-4e", [298, 299, 300]]], // Umbilical Hernia, Wall Defects and the Inner Surface of the Wall
  },
  "gastrointestinal-system-gross-4": {
    0: [["grays-anatomy-students-4e", [368, 369, 370]]], // Boundaries, Fascia and Muscles
    1: [["grays-anatomy-students-4e", [392, 393]]], // Aorta, IVC and Lumbar Lymph Nodes
    2: [["grays-anatomy-students-4e", [392, 393]]], // Lymphatic Trunks, Cisterna Chyli and Ducts
    3: [["grays-anatomy-students-4e", [395, 396, 397]]], // Autonomic Nerves and the Lumbar Plexus
  },
  "gastrointestinal-system-gross-5": {
    3: [["grays-anatomy-students-4e", [373]]], // Hiatal Hernia
  },
  "gastrointestinal-system-gross-6": {
    0: [["grays-anatomy-students-4e", [309, 310]]], // The Duodenum
    1: [["grays-anatomy-students-4e", [309, 310]]], // Duodenal Ulcers, the Ligament of Treitz and Recesses
    2: [["grays-anatomy-students-4e", [310, 311]]], // Jejunum, Ileum and Meckel’s Diverticulum
  },
  "gastrointestinal-system-gross-7": {
    0: [["grays-anatomy-students-4e", [316, 317]]], // The Large Intestine and its Special Features
    1: [["grays-anatomy-students-4e", [320]]], // Caecum, Appendix and Colon
  },
  "gastrointestinal-system-gross-8": {
    0: [["grays-anatomy-students-4e", [329, 330]]], // The Liver
    1: [["grays-anatomy-students-4e", [340]]], // The Gallbladder
    2: [["grays-anatomy-students-4e", [334]]], // The Pancreas
    3: [["grays-anatomy-students-4e", [337]]], // The Spleen
  },
  "gastrointestinal-system-gross-9": {
    0: [["grays-anatomy-students-4e", [344]]], // The Three Gut Arteries and Watershed Zones
    1: [["grays-anatomy-students-4e", [346, 347]]], // The Coeliac Trunk
    2: [["grays-anatomy-students-4e", [349, 350, 351]]], // The Superior and Inferior Mesenteric Arteries
  },
  "gastrointestinal-system-gross-10": {
    0: [["grays-anatomy-students-4e", [354]]], // The Hepatic Portal Vein
    1: [["grays-anatomy-students-4e", [356, 357]]], // Portocaval Anastomoses and Portal Hypertension
    2: [["grays-anatomy-students-4e", [358]]], // Lymphatic Drainage of the Abdominal Viscera
    3: [["grays-anatomy-students-4e", [364]]], // Innervation of the Gut and Referred Pain
  },
};

// Tappable lecture diagrams for collagen-synthesis (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/collagen-synthesis/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/collagen-synthesis/sources';

export const collagenFormation: LessonFigure = {
  id: 'collagen-synthesis:collagen-formation',
  title: "Steps in the formation of mature collagen fibres",
  src: '/figures/collagen-synthesis/collagen-formation.png',
  width: 1400,
  height: 798,
  caption: "Lecture slide 33 (textbook figure 9-17).",
  sourceRefs: ref([33]),
  spots: [
    { id: 'fibroblast', label: "Fibroblast", note: "The cell that makes collagen; steps 1–4 happen inside it.", x: 0.32, y: 0.0789, boxes: [[0.33, 0.0263, 0.11, 0.0658]] },
    { id: 'step-1', label: "1 · Polypeptide synthesis", note: "The pro-α chains are made on ribosomes.", x: 0.14, y: 0.2105, boxes: [[0.16, 0.1711, 0.21, 0.0658]] },
    { id: 'step-2', label: "2 · Hydroxylation and glycosylation", note: "Proline and lysine are hydroxylated (needs ascorbate); sugars are added to hydroxylysine.", x: 0.14, y: 0.3553, boxes: [[0.16, 0.3026, 0.2, 0.1316]] },
    { id: 'step-3', label: "3 · Triple-helix formation", note: "Three chains wind together.", x: 0.14, y: 0.5263, boxes: [[0.16, 0.4868, 0.21, 0.0658]] },
    { id: 'step-4', label: "4 · Secretion", note: "Procollagen leaves the cell.", x: 0.14, y: 0.6579, boxes: [[0.16, 0.6184, 0.1, 0.0658]] },
    { id: 'procollagen', label: "Procollagen bundles", note: "Still carry the extension peptides at each end.", x: 0.37, y: 0.8684, boxes: [[0.34, 0.8026, 0.12, 0.1316]] },
    { id: 'step-5', label: "5 · Hydrolysis of peptide bonds", note: "Procollagen peptidases cut off the extensions, giving tropocollagen.", x: 0.5, y: 0.9079, boxes: [[0.52, 0.8684, 0.15, 0.1316]] },
    { id: 'tropocollagen', label: "Tropocollagen bundles", note: "The structural unit of collagen.", x: 0.78, y: 0.8553, boxes: [[0.72, 0.7895, 0.15, 0.1316]] },
    { id: 'step-6', label: "6 · Assembly near the cell surface", note: "Tropocollagen lines up into fibres.", x: 0.79, y: 0.6974, boxes: [[0.84, 0.6447, 0.15, 0.1184]] },
    { id: 'collagen-fiber', label: "Collagen fibre", note: "Before cross-linking.", x: 0.71, y: 0.5395, boxes: [[0.71, 0.5, 0.15, 0.0658]] },
    { id: 'step-7', label: "7 · Formation of cross-links", note: "Lysyl oxidase makes the cross-links that give strength.", x: 0.79, y: 0.3684, boxes: [[0.84, 0.3421, 0.14, 0.1184]] },
    { id: 'mature', label: "Mature collagen fibre", note: "Cross-linked and strong.", x: 0.74, y: 0.1447, boxes: [[0.69, 0.0395, 0.2, 0.1579]] },
  ],
};

export const connectiveTissue: LessonFigure = {
  id: 'collagen-synthesis:connective-tissue',
  title: "Connective tissue under the epithelium",
  src: '/figures/collagen-synthesis/connective-tissue.jpg',
  width: 1400,
  height: 765,
  caption: "Lecture slide 5 (Molecular Biology of the Cell, figure 19-34): cells and extracellular matrix components.",
  sourceRefs: ref([5]),
  spots: [
    { id: 'epithelium', label: "Epithelium", note: "Sits on the basal lamina.", x: 0.4891, y: 0.0597, boxes: [[0.1196, 0, 0.1848, 0.0448]] },
    { id: 'basal-lamina', label: "Basal lamina", note: "A thin sheet of matrix under the epithelium.", x: 0.5109, y: 0.1493, boxes: [[0.0978, 0.1045, 0.2174, 0.0746]] },
    { id: 'collagen-fiber', label: "Collagen fibre", note: "Gives tensile strength.", x: 0.6196, y: 0.209, boxes: [[0.7174, 0.1642, 0.2174, 0.0746]] },
    { id: 'macrophage', label: "Macrophage", note: "A cell found in connective tissue.", x: 0.3696, y: 0.3134, boxes: [[0.0978, 0.2836, 0.2065, 0.0746]] },
    { id: 'capillary', label: "Capillary", note: "Blood supply.", x: 0.6304, y: 0.4179, boxes: [[0.7174, 0.3731, 0.1413, 0.0746]] },
    { id: 'elastic-fiber', label: "Elastic fibre", note: "Made of elastin; stretches and recoils.", x: 0.663, y: 0.5075, boxes: [[0.7174, 0.4776, 0.1848, 0.0746]] },
    { id: 'fibroblast', label: "Fibroblast", note: "Makes collagen, elastin and ground substance.", x: 0.3804, y: 0.5672, boxes: [[0.1413, 0.5075, 0.1522, 0.0746]] },
    { id: 'mast-cell', label: "Mast cell", note: "A cell found in connective tissue.", x: 0.5978, y: 0.6269, boxes: [[0.7174, 0.5672, 0.1522, 0.0746]] },
    { id: 'ground-substance', label: "Hyaluronan, proteoglycans and glycoproteins", note: "The ground substance of the matrix.", x: 0.413, y: 0.7612, boxes: [[0, 0.6716, 0.2935, 0.209]] },
  ],
};

export const figures: LessonFigure[] = [collagenFormation, connectiveTissue];

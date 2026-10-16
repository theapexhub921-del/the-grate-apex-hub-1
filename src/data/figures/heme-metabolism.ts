// Tappable lecture diagrams for heme-metabolism (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/heme-metabolism/.
import type { LessonFigure } from '@/data/lesson-types';
import { cat, syn } from '@/data/topics/heme-metabolism/sources';

export const haemBreakdown: LessonFigure = {
  id: 'heme-metabolism:haem-breakdown',
  title: "Haem breakdown to bilirubin",
  src: '/figures/heme-metabolism/haem-breakdown.jpg',
  width: 1400,
  height: 1110,
  caption: "Catabolism lecture slide 20: haem → biliverdin → bilirubin → bilirubin glucuronides.",
  sourceRefs: cat([20]),
  spots: [
    { id: 'heme', label: "Haem", note: "From haemoglobin of old red cells and from other haem proteins.", x: 0.4429, y: 0.1757, boxes: [[0.3714, 0.1486, 0.1429, 0.0608]] },
    { id: 'heme-oxygenase', label: "Haem oxygenase", note: "Opens the haem ring, releasing iron and carbon monoxide.", x: 0.4429, y: 0.2973, boxes: [[0.3286, 0.2703, 0.2429, 0.0541]] },
    { id: 'cyp-reductase', label: "Cytochrome P450 reductase", note: "Supplies electrons from NADPH to the haem oxygenase reaction.", x: 0.6714, y: 0.4054, boxes: [[0.4, 0.3784, 0.4143, 0.0541]] },
    { id: 'iron', label: "Iron (Fe²⁺)", note: "Released from haem and reused.", x: 0.2571, y: 0.5405, boxes: [[0.2143, 0.5, 0.1, 0.0676]] },
    { id: 'co', label: "Carbon monoxide", note: "Released when the haem ring is opened.", x: 0.1571, y: 0.6351, boxes: [[0.0143, 0.5946, 0.3143, 0.0676]] },
    { id: 'biliverdin', label: "Biliverdin", note: "The green pigment made when haem is opened.", x: 0.6571, y: 0.5946, boxes: [[0.5571, 0.5541, 0.1714, 0.0676]] },
    { id: 'biliverdin-reductase', label: "Biliverdin reductase", note: "Reduces biliverdin to bilirubin.", x: 0.7143, y: 0.6622, boxes: [[0.5857, 0.6351, 0.2857, 0.0541]] },
    { id: 'bilirubin', label: "Bilirubin", note: "Carried to the liver bound to albumin.", x: 0.6429, y: 0.7568, boxes: [[0.5714, 0.7162, 0.1429, 0.0676]] },
    { id: 'ugt', label: "UGT (UDP-glucuronosyltransferase)", note: "Conjugates bilirubin with glucuronic acid in the liver.", x: 0.6714, y: 0.8243, boxes: [[0.6286, 0.7973, 0.0714, 0.0541]] },
    { id: 'bmg-bdg', label: "Bilirubin mono- and diglucuronide", note: "The water-soluble conjugated bilirubin excreted in bile.", x: 0.6286, y: 0.9189, boxes: [[0.5857, 0.8649, 0.0857, 0.0946]] },
    { id: 'enterohepatic', label: "Enterohepatic recirculation", note: "Some bilirubin products are reabsorbed from the gut and return to the liver.", x: 0.8857, y: 0.8514, boxes: [[0.7857, 0.7973, 0.1857, 0.0946]] },
  ],
};

export const leadPoisoning: LessonFigure = {
  id: 'heme-metabolism:lead-poisoning',
  title: "Lead and the haem pathway",
  src: '/figures/heme-metabolism/lead-poisoning.png',
  width: 1400,
  height: 810,
  caption: "Haem synthesis lecture slide 36 (textbook figure): lead inhibits ALA dehydratase and ferrochelatase.",
  sourceRefs: syn([36]),
  spots: [
    { id: 'ala', label: "δ-Aminolevulinic acid (ALA)", note: "Substrate of ALA dehydratase; accumulates in lead poisoning.", x: 0.3478, y: 0.0563, boxes: [[0.1196, 0.0282, 0.4565, 0.0704]] },
    { id: 'ala-dehydratase', label: "ALA dehydratase (porphobilinogen synthase, a zinc enzyme)", note: "Joins two ALA to make porphobilinogen; inhibited by lead.", x: 0.5978, y: 0.1972, boxes: [[0.3043, 0.169, 0.587, 0.0563], [0, 0.2113, 0.2283, 0.1127]] },
    { id: 'pbg', label: "Porphobilinogen", note: "Product of ALA dehydratase.", x: 0.3478, y: 0.3803, boxes: [[0.1848, 0.3521, 0.2826, 0.0563]] },
    { id: 'protoporphyrin', label: "Protoporphyrin IX", note: "Substrate of ferrochelatase; accumulates in lead poisoning.", x: 0.3478, y: 0.6197, boxes: [[0.1304, 0.5915, 0.4565, 0.0704]] },
    { id: 'ferrochelatase', label: "Ferrochelatase", note: "Inserts iron into protoporphyrin IX to make haem; inhibited by lead.", x: 0.4348, y: 0.7606, boxes: [[0.2283, 0.7324, 0.3478, 0.0563]] },
    { id: 'heme', label: "Haem", note: "Protoporphyrin IX + iron.", x: 0.2935, y: 0.9437, boxes: [[0.2174, 0.9155, 0.1196, 0.0563]] },
    { id: 'lead', label: "Lead poisoning", note: "Lead inhibits both marked enzymes, so ALA and protoporphyrin build up (measured for diagnosis).", x: 0.7609, y: 0.0986, boxes: [[0.7065, 0.0282, 0.2609, 0.0704]] },
  ],
};

export const figures: LessonFigure[] = [haemBreakdown, leadPoisoning];

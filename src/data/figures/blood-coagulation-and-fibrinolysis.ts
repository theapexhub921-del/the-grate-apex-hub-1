// Tappable lecture diagrams for blood-coagulation-and-fibrinolysis (see data/figures/index.ts).
// Crops of the lecture slides; pins and label boxes are fractions of the
// picture. Images: public/figures/blood-coagulation-and-fibrinolysis/.
import type { LessonFigure } from '@/data/lesson-types';
import { ref } from '@/data/topics/blood-coagulation-and-fibrinolysis/sources';

export const threePathways: LessonFigure = {
  id: 'blood-coagulation-and-fibrinolysis:three-pathways',
  title: "Intrinsic, extrinsic and common pathways",
  src: '/figures/blood-coagulation-and-fibrinolysis/three-pathways.png',
  width: 1400,
  height: 1073,
  caption: "Lecture slide 7: formation of a fibrin clot involves the interplay of three pathways.",
  sourceRefs: ref([7]),
  spots: [
    { id: 'intrinsic-trigger', label: "Trigger: contact with an abnormal surface", note: "Starts the intrinsic pathway.", x: 0.3626, y: 0.1505, boxes: [[0.2637, 0.0323, 0.2088, 0.2043]] },
    { id: 'extrinsic-trigger', label: "Trigger: trauma to tissue", note: "Starts the extrinsic pathway (tissue factor).", x: 0.7692, y: 0.1505, boxes: [[0.6703, 0.0323, 0.1978, 0.2043]] },
    { id: 'activators', label: "In vivo activators: damaged vascular endothelium, collagen, foreign surface", note: "What exposes the \"abnormal surface\" for the intrinsic pathway.", x: 0.1429, y: 0.3871, boxes: [[0.011, 0.2473, 0.2527, 0.3011]] },
    { id: 'intrinsic', label: "Intrinsic pathway", note: "All its factors are in the blood.", x: 0.3956, y: 0.5054, boxes: [[0.3407, 0.4516, 0.1209, 0.1075]] },
    { id: 'extrinsic', label: "Extrinsic pathway", note: "Needs tissue factor from outside the blood.", x: 0.7363, y: 0.5054, boxes: [[0.6703, 0.4516, 0.1319, 0.1075]] },
    { id: 'common', label: "Common pathway", note: "Both pathways activate factor X; then prothrombin → thrombin, fibrinogen → fibrin.", x: 0.5714, y: 0.6882, boxes: [[0.5934, 0.6774, 0.1319, 0.1075]] },
    { id: 'fibrin-clot', label: "Fibrin clot", note: "The end product, stabilised by cross-linking.", x: 0.5714, y: 0.957, boxes: [[0.4835, 0.9247, 0.1868, 0.0645]] },
  ],
};

export const platelet: LessonFigure = {
  id: 'blood-coagulation-and-fibrinolysis:platelet',
  title: "The platelet",
  src: '/figures/blood-coagulation-and-fibrinolysis/platelet.jpg',
  width: 1400,
  height: 877,
  caption: "Lecture slide 16: structure of a platelet.",
  sourceRefs: ref([16]),
  spots: [
    { id: 'ocs', label: "Surface-connected canalicular system", note: "Channels open to the platelet surface.", x: 0.3402, y: 0.3333, boxes: [[0.0722, 0.0864, 0.268, 0.1111]] },
    { id: 'mitochondrion', label: "Mitochondrion", note: "Platelets have mitochondria but no nucleus.", x: 0.433, y: 0.321, boxes: [[0.3711, 0.1358, 0.1959, 0.0617]] },
    { id: 'glycogen', label: "Glycogen", note: "Energy store.", x: 0.5361, y: 0.4568, boxes: [[0.5773, 0.1728, 0.1237, 0.0617]] },
    { id: 'dts', label: "Dense tubular system", note: "An internal membrane system.", x: 0.6907, y: 0.3827, boxes: [[0.7216, 0.2099, 0.2062, 0.1111]] },
    { id: 'microtubules', label: "Microtubules", note: "A ring under the membrane that keeps the disc shape.", x: 0.7732, y: 0.5185, boxes: [[0.8351, 0.4198, 0.1649, 0.0617], [0.1237, 0.8272, 0.1753, 0.0617]] },
    { id: 'dense-granule', label: "Dense granule", note: "Contains ADP, ATP, Ca²⁺ and serotonin.", x: 0.4124, y: 0.5926, boxes: [[0.3505, 0.8642, 0.1134, 0.1111]] },
    { id: 'alpha-granule', label: "α granule", note: "Contains platelet factor IV, β-thromboglobulin, PDGF, thrombospondin, fibrinogen and von Willebrand factor.", x: 0.4948, y: 0.6173, boxes: [[0.5052, 0.8519, 0.134, 0.0617]] },
    { id: 'lysosomal', label: "Lysosomal granule", note: "Contains hydrolytic enzymes.", x: 0.6392, y: 0.5926, boxes: [[0.701, 0.7654, 0.1546, 0.1111]] },
  ],
};

export const figures: LessonFigure[] = [threePathways, platelet];

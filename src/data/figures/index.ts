// Tappable lecture diagrams: shown in a lesson's reading section
// (LessonChunk.figure) and with quiz questions (Question.figure,
// "What is the highlighted part?").
//
// Each topic's figures are in data/figures/<topic>.ts and their pictures in
// public/figures/<topic>/ — crops of the lecture slides, so what learners see
// is the lecture's own diagram. To add one: crop the slide into
// public/figures/<topic>/, describe its spots in the topic file, list it
// below, then set `figure` on a reading section and/or questions.
import { figures as bloodCoagulation } from '@/data/figures/blood-coagulation-and-fibrinolysis';
import { figures as cardiovascular } from '@/data/figures/cardiovascular-physiology';
import { figures as cholesterol } from '@/data/figures/cholesterol-and-bile-biosynthesis';
import { figures as collagen } from '@/data/figures/collagen-synthesis';
import { figures as fattyAcids } from '@/data/figures/fatty-acid-biosynthesis';
import { figures as haem } from '@/data/figures/heme-metabolism';
import { figures as hormones } from '@/data/figures/hormones-endocrine-biochemistry';
import { figures as inbornErrors } from '@/data/figures/inborn-errors-of-metabolism';
import { figures as oxygenCarriers } from '@/data/figures/oxygen-carriers';
import { figures as upperLimb } from '@/data/figures/upper-limb';
import { figures as rightAtriumFigures } from '@/data/figures/cardiovascular-system-gross';
import { figures as thoracicJointsFigures } from '@/data/figures/respiratory-system-gross';
import { figures as portalVenousSystemFigures } from '@/data/figures/gastrointestinal-system-gross';
import { figures as kidneyInternalFigures } from '@/data/figures/urinary-system-gross';
import { figures as auricleFigures } from '@/data/figures/head-and-neck';
import { figures as brainArteriesFigures } from '@/data/figures/neuroanatomy';
import { figures as cardiovascularSystemGrossPictures } from '@/data/figures/pictures/cardiovascular-system-gross';
import { figures as respiratorySystemGrossPictures } from '@/data/figures/pictures/respiratory-system-gross';
import { figures as gastrointestinalSystemGrossPictures } from '@/data/figures/pictures/gastrointestinal-system-gross';
import { figures as urinarySystemGrossPictures } from '@/data/figures/pictures/urinary-system-gross';
import { figures as upperLimbPictures } from '@/data/figures/pictures/upper-limb';
import { figures as headAndNeckPictures } from '@/data/figures/pictures/head-and-neck';
import { figures as neuroanatomyPictures } from '@/data/figures/pictures/neuroanatomy';
import type { FigureSpot, LessonFigure } from '@/data/lesson-types';

export const allFigures: LessonFigure[] = [
  ...cardiovascular,
  ...upperLimb,
  ...fattyAcids,
  ...cholesterol,
  ...haem,
  ...oxygenCarriers,
  ...bloodCoagulation,
  ...hormones,
  ...collagen,
  ...inbornErrors,
  ...rightAtriumFigures,
  ...thoracicJointsFigures,
  ...portalVenousSystemFigures,
  ...kidneyInternalFigures,
  ...auricleFigures,
  ...brainArteriesFigures,
  // Lecture pictures added to every anatomy lesson (data/figures/pictures/).
  ...cardiovascularSystemGrossPictures,
  ...respiratorySystemGrossPictures,
  ...gastrointestinalSystemGrossPictures,
  ...urinarySystemGrossPictures,
  ...upperLimbPictures,
  ...headAndNeckPictures,
  ...neuroanatomyPictures,
];

const byId = new Map(allFigures.map((figure) => [figure.id, figure]));

export function getFigure(id: string | undefined | null): LessonFigure | undefined {
  return id ? byId.get(id) : undefined;
}

export function getSpot(figure: LessonFigure, spotId: string | undefined | null): FigureSpot | undefined {
  return spotId ? figure.spots.find((spot) => spot.id === spotId) : undefined;
}

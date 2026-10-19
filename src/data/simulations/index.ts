// Every lesson simulation, by id. Models only (pure, testable); the
// drawings are in components/learning/simulations/.
import { acidBase } from '@/data/simulations/acid-base';
import { glomerularFiltration } from '@/data/simulations/glomerular-filtration';
import { glucoseTm } from '@/data/simulations/glucose-tm';
import { micturition } from '@/data/simulations/micturition';
import { renalClearance } from '@/data/simulations/renal-clearance';
import { renalVessels } from '@/data/simulations/renal-vessels';
import { urineConcentration } from '@/data/simulations/urine-concentration';
import { feedbackAxis } from '@/data/simulations/feedback-axis';
import { adhWater } from '@/data/simulations/adh-water';
import { growthHormone } from '@/data/simulations/growth-hormone';
import { thyroidAxis } from '@/data/simulations/thyroid-axis';
import { adrenalAxis } from '@/data/simulations/adrenal-axis';
import { glucoseInsulin } from '@/data/simulations/glucose-insulin';
import { calcium } from '@/data/simulations/calcium';
import { gutTransit } from '@/data/simulations/gut-transit';
import { nutrientDigestion } from '@/data/simulations/nutrient-digestion';
import { gutWater } from '@/data/simulations/gut-water';
import { saliva } from '@/data/simulations/saliva';
import { pancreaticSecretion } from '@/data/simulations/pancreatic-secretion';
import { gastricPhases } from '@/data/simulations/gastric-phases';
import { gutMuscle } from '@/data/simulations/gut-muscle';
import { defecation } from '@/data/simulations/defecation';
import { bilirubin } from '@/data/simulations/bilirubin';
import { maleTract } from '@/data/simulations/male-tract';
import { spermatogenesis } from '@/data/simulations/spermatogenesis';
import { testisControl } from '@/data/simulations/testis-control';
import { androgens } from '@/data/simulations/androgens';
import { ovarianCycle } from '@/data/simulations/ovarian-cycle';
import { menstrualCycle } from '@/data/simulations/menstrual-cycle';
import { ovulationDisorders } from '@/data/simulations/ovulation-disorders';
import { lifespan } from '@/data/simulations/lifespan';
import { fertilisation } from '@/data/simulations/fertilisation';
import { labourLactation } from '@/data/simulations/labour-lactation';
import type { SimulationId } from '@/data/lesson-types';
import { basalGanglia } from '@/data/simulations/basal-ganglia';
import { baroreflex } from '@/data/simulations/baroreflex';
import { brainLesion } from '@/data/simulations/brain-lesion';
import { cardiacCycle } from '@/data/simulations/cardiac-cycle';
import { cerebellarReach } from '@/data/simulations/cerebellar-reach';
import { capillaryStarling } from '@/data/simulations/capillary-starling';
import { cerebralFlow } from '@/data/simulations/cerebral-flow';
import { dorsalHorn } from '@/data/simulations/dorsal-horn';
import { ecg } from '@/data/simulations/ecg';
import { motorLesion } from '@/data/simulations/motor-lesion';
import { painGate } from '@/data/simulations/pain-gate';
import { pvLoop } from '@/data/simulations/pv-loop';
import { receptorAdaptation } from '@/data/simulations/receptor-adaptation';
import { sensoryTracts } from '@/data/simulations/sensory-tracts';
import { shock } from '@/data/simulations/shock';
import { soundsJvp } from '@/data/simulations/sounds-jvp';
import { stretchReflex } from '@/data/simulations/stretch-reflex';
import { breathingMechanics } from '@/data/simulations/breathing-mechanics';
import { spirometry } from '@/data/simulations/spirometry';
import { lungCompliance } from '@/data/simulations/lung-compliance';
import { alveolarVentilation } from '@/data/simulations/alveolar-ventilation';
import { o2Dissociation } from '@/data/simulations/o2-dissociation';
import { vqMatching } from '@/data/simulations/vq-matching';
import { breathingControl } from '@/data/simulations/breathing-control';
import { altitudeHypoxia } from '@/data/simulations/altitude-hypoxia';
import type { SimDefinition, SimValues } from '@/data/simulations/types';
import { vesselFlow } from '@/data/simulations/vessel-flow';

export const SIMULATIONS: Record<SimulationId, SimDefinition> = {
  'cardiac-cycle': cardiacCycle,
  'sounds-jvp': soundsJvp,
  'pv-loop': pvLoop,
  'vessel-flow': vesselFlow,
  'capillary-starling': capillaryStarling,
  baroreflex,
  shock,
  'cerebral-flow': cerebralFlow,
  ecg,
  // Central Nervous System
  'receptor-adaptation': receptorAdaptation,
  'stretch-reflex': stretchReflex,
  'sensory-tracts': sensoryTracts,
  'pain-gate': painGate,
  'dorsal-horn': dorsalHorn,
  'motor-lesion': motorLesion,
  'cerebellar-reach': cerebellarReach,
  'basal-ganglia': basalGanglia,
  'brain-lesion': brainLesion,
  // Respiratory Physiology
  'breathing-mechanics': breathingMechanics,
  'spirometry': spirometry,
  'lung-compliance': lungCompliance,
  'alveolar-ventilation': alveolarVentilation,
  'o2-dissociation': o2Dissociation,
  'vq-matching': vqMatching,
  'breathing-control': breathingControl,
  'altitude-hypoxia': altitudeHypoxia,
  // Renal Physiology
  'renal-vessels': renalVessels,
  'glomerular-filtration': glomerularFiltration,
  'glucose-tm': glucoseTm,
  'urine-concentration': urineConcentration,
  'renal-clearance': renalClearance,
  'micturition': micturition,
  'acid-base': acidBase,
  // Endocrinology
  'feedback-axis': feedbackAxis,
  'adh-water': adhWater,
  'growth-hormone': growthHormone,
  'thyroid-axis': thyroidAxis,
  'adrenal-axis': adrenalAxis,
  'glucose-insulin': glucoseInsulin,
  'calcium': calcium,
  // Gastrointestinal Physiology
  'gut-transit': gutTransit,
  'nutrient-digestion': nutrientDigestion,
  'gut-water': gutWater,
  'saliva': saliva,
  'pancreatic-secretion': pancreaticSecretion,
  'gastric-phases': gastricPhases,
  'gut-muscle': gutMuscle,
  'defecation': defecation,
  'bilirubin': bilirubin,
  // Reproductive Physiology
  'male-tract': maleTract,
  'spermatogenesis': spermatogenesis,
  'testis-control': testisControl,
  'androgens': androgens,
  'ovarian-cycle': ovarianCycle,
  'menstrual-cycle': menstrualCycle,
  'ovulation-disorders': ovulationDisorders,
  'lifespan': lifespan,
  'fertilisation': fertilisation,
  'labour-lactation': labourLactation,
};

export function getSimulation(id: SimulationId): SimDefinition | undefined {
  return SIMULATIONS[id];
}

// The values a prediction starts from and runs to.
export function predictionValues(definition: SimDefinition, prediction: { from?: SimValues; set: SimValues }) {
  const before = { ...definition.initial, ...(prediction.from ?? {}) };
  return { before, after: { ...before, ...prediction.set } };
}

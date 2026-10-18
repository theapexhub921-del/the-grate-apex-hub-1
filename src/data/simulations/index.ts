// Every lesson simulation, by id. Models only (pure, testable); the
// drawings are in components/learning/simulations/.
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
};

export function getSimulation(id: SimulationId): SimDefinition | undefined {
  return SIMULATIONS[id];
}

// The values a prediction starts from and runs to.
export function predictionValues(definition: SimDefinition, prediction: { from?: SimValues; set: SimValues }) {
  const before = { ...definition.initial, ...(prediction.from ?? {}) };
  return { before, after: { ...before, ...prediction.set } };
}

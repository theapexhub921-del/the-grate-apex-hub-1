// Every lesson simulation, by id. Models only (pure, testable); the
// drawings are in components/learning/simulations/.
import type { SimulationId } from '@/data/lesson-types';
import { baroreflex } from '@/data/simulations/baroreflex';
import { cardiacCycle } from '@/data/simulations/cardiac-cycle';
import { capillaryStarling } from '@/data/simulations/capillary-starling';
import { cerebralFlow } from '@/data/simulations/cerebral-flow';
import { ecg } from '@/data/simulations/ecg';
import { pvLoop } from '@/data/simulations/pv-loop';
import { shock } from '@/data/simulations/shock';
import { soundsJvp } from '@/data/simulations/sounds-jvp';
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
};

export function getSimulation(id: SimulationId): SimDefinition | undefined {
  return SIMULATIONS[id];
}

// The values a prediction starts from and runs to.
export function predictionValues(definition: SimDefinition, prediction: { from?: SimValues; set: SimValues }) {
  const before = { ...definition.initial, ...(prediction.from ?? {}) };
  return { before, after: { ...before, ...prediction.set } };
}

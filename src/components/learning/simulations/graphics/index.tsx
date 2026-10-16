import type { SimulationId } from '@/data/lesson-types';
import type { BaroState } from '@/data/simulations/baroreflex';
import type { StarlingState } from '@/data/simulations/capillary-starling';
import type { CycleState } from '@/data/simulations/cardiac-cycle';
import type { CerebralState } from '@/data/simulations/cerebral-flow';
import type { EcgState } from '@/data/simulations/ecg';
import type { PvState } from '@/data/simulations/pv-loop';
import type { ShockState } from '@/data/simulations/shock';
import type { SoundsState } from '@/data/simulations/sounds-jvp';
import type { SimState } from '@/data/simulations/types';
import type { FlowState } from '@/data/simulations/vessel-flow';

import { BaroreflexGraphic } from './baroreflex';
import { CapillaryStarlingGraphic } from './capillary-starling';
import { CardiacCycleGraphic } from './cardiac-cycle';
import { CerebralFlowGraphic } from './cerebral-flow';
import { EcgGraphic } from './ecg';
import { PvLoopGraphic } from './pv-loop';
import type { GraphicProps } from './shared';
import { ShockGraphic } from './shock';
import { SoundsJvpGraphic } from './sounds-jvp';
import { VesselFlowGraphic } from './vessel-flow';

// The drawing for each simulation (models: data/simulations/).
export function SimulationGraphic({ id, ...props }: GraphicProps<SimState> & { id: SimulationId }) {
  switch (id) {
    case 'cardiac-cycle':
      return <CardiacCycleGraphic {...(props as GraphicProps<CycleState>)} />;
    case 'sounds-jvp':
      return <SoundsJvpGraphic {...(props as GraphicProps<SoundsState>)} />;
    case 'pv-loop':
      return <PvLoopGraphic {...(props as GraphicProps<PvState>)} />;
    case 'vessel-flow':
      return <VesselFlowGraphic {...(props as GraphicProps<FlowState>)} />;
    case 'capillary-starling':
      return <CapillaryStarlingGraphic {...(props as GraphicProps<StarlingState>)} />;
    case 'baroreflex':
      return <BaroreflexGraphic {...(props as GraphicProps<BaroState>)} />;
    case 'shock':
      return <ShockGraphic {...(props as GraphicProps<ShockState>)} />;
    case 'cerebral-flow':
      return <CerebralFlowGraphic {...(props as GraphicProps<CerebralState>)} />;
    case 'ecg':
      return <EcgGraphic {...(props as GraphicProps<EcgState>)} />;
    default:
      return null;
  }
}

import type { SimulationId } from '@/data/lesson-types';
import type { BasalState } from '@/data/simulations/basal-ganglia';
import type { BaroState } from '@/data/simulations/baroreflex';
import type { BrainState } from '@/data/simulations/brain-lesion';
import type { StarlingState } from '@/data/simulations/capillary-starling';
import type { CycleState } from '@/data/simulations/cardiac-cycle';
import type { ReachState } from '@/data/simulations/cerebellar-reach';
import type { CerebralState } from '@/data/simulations/cerebral-flow';
import type { HornState } from '@/data/simulations/dorsal-horn';
import type { EcgState } from '@/data/simulations/ecg';
import type { MotorState } from '@/data/simulations/motor-lesion';
import type { PainState } from '@/data/simulations/pain-gate';
import type { PvState } from '@/data/simulations/pv-loop';
import type { AdaptationState } from '@/data/simulations/receptor-adaptation';
import type { TractState } from '@/data/simulations/sensory-tracts';
import type { ShockState } from '@/data/simulations/shock';
import type { SoundsState } from '@/data/simulations/sounds-jvp';
import type { ReflexState } from '@/data/simulations/stretch-reflex';
import type { MechanicsState } from '@/data/simulations/breathing-mechanics';
import type { SpiroState } from '@/data/simulations/spirometry';
import type { ComplianceState } from '@/data/simulations/lung-compliance';
import type { VentilationState } from '@/data/simulations/alveolar-ventilation';
import type { DissociationState } from '@/data/simulations/o2-dissociation';
import type { VqState } from '@/data/simulations/vq-matching';
import type { ControlState } from '@/data/simulations/breathing-control';
import type { AltitudeState } from '@/data/simulations/altitude-hypoxia';
import type { SimState } from '@/data/simulations/types';
import type { FlowState } from '@/data/simulations/vessel-flow';

import { BasalGangliaGraphic } from './basal-ganglia';
import { BaroreflexGraphic } from './baroreflex';
import { BrainLesionGraphic } from './brain-lesion';
import { CapillaryStarlingGraphic } from './capillary-starling';
import { CardiacCycleGraphic } from './cardiac-cycle';
import { CerebellarReachGraphic } from './cerebellar-reach';
import { CerebralFlowGraphic } from './cerebral-flow';
import { DorsalHornGraphic } from './dorsal-horn';
import { EcgGraphic } from './ecg';
import { MotorLesionGraphic } from './motor-lesion';
import { PainGateGraphic } from './pain-gate';
import { PvLoopGraphic } from './pv-loop';
import { ReceptorAdaptationGraphic } from './receptor-adaptation';
import { SensoryTractsGraphic } from './sensory-tracts';
import { BreathingMechanicsGraphic } from './breathing-mechanics';
import { SpirometryGraphic } from './spirometry';
import { LungComplianceGraphic } from './lung-compliance';
import { AlveolarVentilationGraphic } from './alveolar-ventilation';
import { O2DissociationGraphic } from './o2-dissociation';
import { VqMatchingGraphic } from './vq-matching';
import { BreathingControlGraphic } from './breathing-control';
import { AltitudeHypoxiaGraphic } from './altitude-hypoxia';
import type { GraphicProps } from './shared';
import { ShockGraphic } from './shock';
import { SoundsJvpGraphic } from './sounds-jvp';
import { StretchReflexGraphic } from './stretch-reflex';
import { VesselFlowGraphic } from './vessel-flow';
import { GlomerularFiltrationGraphic } from './glomerular-filtration';
import type { FiltrationState } from '@/data/simulations/glomerular-filtration';
import { GlucoseTmGraphic } from './glucose-tm';
import type { GlucoseState } from '@/data/simulations/glucose-tm';
import { UrineConcentrationGraphic } from './urine-concentration';
import type { ConcentrationState } from '@/data/simulations/urine-concentration';
import { RenalClearanceGraphic } from './renal-clearance';
import type { ClearanceState } from '@/data/simulations/renal-clearance';
import { MicturitionGraphic } from './micturition';
import type { BladderState } from '@/data/simulations/micturition';
import { AcidBaseGraphic } from './acid-base';
import type { AcidBaseState } from '@/data/simulations/acid-base';
import { RenalVesselsGraphic } from './renal-vessels';
import type { VesselsState } from '@/data/simulations/renal-vessels';

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
    case 'receptor-adaptation':
      return <ReceptorAdaptationGraphic {...(props as GraphicProps<AdaptationState>)} />;
    case 'stretch-reflex':
      return <StretchReflexGraphic {...(props as GraphicProps<ReflexState>)} />;
    case 'sensory-tracts':
      return <SensoryTractsGraphic {...(props as GraphicProps<TractState>)} />;
    case 'pain-gate':
      return <PainGateGraphic {...(props as GraphicProps<PainState>)} />;
    case 'dorsal-horn':
      return <DorsalHornGraphic {...(props as GraphicProps<HornState>)} />;
    case 'motor-lesion':
      return <MotorLesionGraphic {...(props as GraphicProps<MotorState>)} />;
    case 'cerebellar-reach':
      return <CerebellarReachGraphic {...(props as GraphicProps<ReachState>)} />;
    case 'basal-ganglia':
      return <BasalGangliaGraphic {...(props as GraphicProps<BasalState>)} />;
    case 'brain-lesion':
      return <BrainLesionGraphic {...(props as GraphicProps<BrainState>)} />;
    case 'breathing-mechanics':
      return <BreathingMechanicsGraphic {...(props as GraphicProps<MechanicsState>)} />;
    case 'spirometry':
      return <SpirometryGraphic {...(props as GraphicProps<SpiroState>)} />;
    case 'lung-compliance':
      return <LungComplianceGraphic {...(props as GraphicProps<ComplianceState>)} />;
    case 'alveolar-ventilation':
      return <AlveolarVentilationGraphic {...(props as GraphicProps<VentilationState>)} />;
    case 'o2-dissociation':
      return <O2DissociationGraphic {...(props as GraphicProps<DissociationState>)} />;
    case 'vq-matching':
      return <VqMatchingGraphic {...(props as GraphicProps<VqState>)} />;
    case 'breathing-control':
      return <BreathingControlGraphic {...(props as GraphicProps<ControlState>)} />;
    case 'altitude-hypoxia':
      return <AltitudeHypoxiaGraphic {...(props as GraphicProps<AltitudeState>)} />;
    case 'renal-vessels':
      return <RenalVesselsGraphic {...(props as GraphicProps<VesselsState>)} />;
    case 'glomerular-filtration':
      return <GlomerularFiltrationGraphic {...(props as GraphicProps<FiltrationState>)} />;
    case 'glucose-tm':
      return <GlucoseTmGraphic {...(props as GraphicProps<GlucoseState>)} />;
    case 'urine-concentration':
      return <UrineConcentrationGraphic {...(props as GraphicProps<ConcentrationState>)} />;
    case 'renal-clearance':
      return <RenalClearanceGraphic {...(props as GraphicProps<ClearanceState>)} />;
    case 'micturition':
      return <MicturitionGraphic {...(props as GraphicProps<BladderState>)} />;
    case 'acid-base':
      return <AcidBaseGraphic {...(props as GraphicProps<AcidBaseState>)} />;
    default:
      return null;
  }
}

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

import { FeedbackAxisGraphic } from './feedback-axis';
import type { FeedbackState } from '@/data/simulations/feedback-axis';
import { AdhWaterGraphic } from './adh-water';
import type { AdhState } from '@/data/simulations/adh-water';
import { GrowthHormoneGraphic } from './growth-hormone';
import type { GhState } from '@/data/simulations/growth-hormone';
import { ThyroidAxisGraphic } from './thyroid-axis';
import type { ThyroidState } from '@/data/simulations/thyroid-axis';
import { AdrenalAxisGraphic } from './adrenal-axis';
import type { AdrenalState } from '@/data/simulations/adrenal-axis';
import { GlucoseInsulinGraphic } from './glucose-insulin';
import type { GlucoseInsulinState } from '@/data/simulations/glucose-insulin';
import { CalciumGraphic } from './calcium';
import type { CalciumState } from '@/data/simulations/calcium';

import { GutTransitGraphic } from './gut-transit';
import type { TransitState } from '@/data/simulations/gut-transit';
import { NutrientDigestionGraphic } from './nutrient-digestion';
import type { NutrientState } from '@/data/simulations/nutrient-digestion';
import { GutWaterGraphic } from './gut-water';
import type { WaterState } from '@/data/simulations/gut-water';
import { SalivaGraphic } from './saliva';
import type { SalivaState } from '@/data/simulations/saliva';
import { PancreaticSecretionGraphic } from './pancreatic-secretion';
import type { PancreasState } from '@/data/simulations/pancreatic-secretion';
import { GastricPhasesGraphic } from './gastric-phases';
import type { GastricState } from '@/data/simulations/gastric-phases';
import { GutMuscleGraphic } from './gut-muscle';
import type { MuscleState } from '@/data/simulations/gut-muscle';
import { DefecationGraphic } from './defecation';
import type { DefecationState } from '@/data/simulations/defecation';
import { BilirubinGraphic } from './bilirubin';
import type { BilirubinState } from '@/data/simulations/bilirubin';

import { MaleTractGraphic } from './male-tract';
import type { MaleTractState } from '@/data/simulations/male-tract';
import { SpermatogenesisGraphic } from './spermatogenesis';
import type { SpermState } from '@/data/simulations/spermatogenesis';
import { TestisControlGraphic } from './testis-control';
import type { TestisState } from '@/data/simulations/testis-control';
import { AndrogensGraphic } from './androgens';
import type { AndrogenState } from '@/data/simulations/androgens';
import { OvarianCycleGraphic } from './ovarian-cycle';
import type { OvaryState } from '@/data/simulations/ovarian-cycle';
import { MenstrualCycleGraphic } from './menstrual-cycle';
import type { MenstrualState } from '@/data/simulations/menstrual-cycle';
import { OvulationDisordersGraphic } from './ovulation-disorders';
import type { DisorderState } from '@/data/simulations/ovulation-disorders';
import { LifespanGraphic } from './lifespan';
import type { LifespanState } from '@/data/simulations/lifespan';
import { FertilisationGraphic } from './fertilisation';
import type { FertilisationState } from '@/data/simulations/fertilisation';
import { LabourLactationGraphic } from './labour-lactation';
import type { LabourState } from '@/data/simulations/labour-lactation';

import { AqueousHumourGraphic } from './aqueous-humour';
import type { AqueousState } from '@/data/simulations/aqueous-humour';
import { AccommodationGraphic } from './accommodation';
import type { AccommodationState } from '@/data/simulations/accommodation';
import { PhototransductionGraphic } from './phototransduction';
import type { PhotoState } from '@/data/simulations/phototransduction';
import { VisualFieldsGraphic } from './visual-fields';
import type { FieldState } from '@/data/simulations/visual-fields';
import { PupilReflexGraphic } from './pupil-reflex';
import type { PupilState } from '@/data/simulations/pupil-reflex';
import { SoundTransmissionGraphic } from './sound-transmission';
import type { SoundState } from '@/data/simulations/sound-transmission';
import { HearingLossGraphic } from './hearing-loss';
import type { HearingState } from '@/data/simulations/hearing-loss';
import { VestibularGraphic } from './vestibular';
import type { VestibularState } from '@/data/simulations/vestibular';
import { TasteGraphic } from './taste';
import type { TasteState } from '@/data/simulations/taste';
import { SmellGraphic } from './smell';
import type { SmellState } from '@/data/simulations/smell';

// The drawing for each simulation (models: data/simulations/).
export function SimulationGraphic({ id, ...props }: GraphicProps<SimState> & { id: SimulationId }) {
  switch (id) {
    case 'aqueous-humour':
      return <AqueousHumourGraphic {...(props as GraphicProps<AqueousState>)} />;
    case 'accommodation':
      return <AccommodationGraphic {...(props as GraphicProps<AccommodationState>)} />;
    case 'phototransduction':
      return <PhototransductionGraphic {...(props as GraphicProps<PhotoState>)} />;
    case 'visual-fields':
      return <VisualFieldsGraphic {...(props as GraphicProps<FieldState>)} />;
    case 'pupil-reflex':
      return <PupilReflexGraphic {...(props as GraphicProps<PupilState>)} />;
    case 'sound-transmission':
      return <SoundTransmissionGraphic {...(props as GraphicProps<SoundState>)} />;
    case 'hearing-loss':
      return <HearingLossGraphic {...(props as GraphicProps<HearingState>)} />;
    case 'vestibular':
      return <VestibularGraphic {...(props as GraphicProps<VestibularState>)} />;
    case 'taste':
      return <TasteGraphic {...(props as GraphicProps<TasteState>)} />;
    case 'smell':
      return <SmellGraphic {...(props as GraphicProps<SmellState>)} />;
    case 'male-tract':
      return <MaleTractGraphic {...(props as GraphicProps<MaleTractState>)} />;
    case 'spermatogenesis':
      return <SpermatogenesisGraphic {...(props as GraphicProps<SpermState>)} />;
    case 'testis-control':
      return <TestisControlGraphic {...(props as GraphicProps<TestisState>)} />;
    case 'androgens':
      return <AndrogensGraphic {...(props as GraphicProps<AndrogenState>)} />;
    case 'ovarian-cycle':
      return <OvarianCycleGraphic {...(props as GraphicProps<OvaryState>)} />;
    case 'menstrual-cycle':
      return <MenstrualCycleGraphic {...(props as GraphicProps<MenstrualState>)} />;
    case 'ovulation-disorders':
      return <OvulationDisordersGraphic {...(props as GraphicProps<DisorderState>)} />;
    case 'lifespan':
      return <LifespanGraphic {...(props as GraphicProps<LifespanState>)} />;
    case 'fertilisation':
      return <FertilisationGraphic {...(props as GraphicProps<FertilisationState>)} />;
    case 'labour-lactation':
      return <LabourLactationGraphic {...(props as GraphicProps<LabourState>)} />;
    case 'gut-transit':
      return <GutTransitGraphic {...(props as GraphicProps<TransitState>)} />;
    case 'nutrient-digestion':
      return <NutrientDigestionGraphic {...(props as GraphicProps<NutrientState>)} />;
    case 'gut-water':
      return <GutWaterGraphic {...(props as GraphicProps<WaterState>)} />;
    case 'saliva':
      return <SalivaGraphic {...(props as GraphicProps<SalivaState>)} />;
    case 'pancreatic-secretion':
      return <PancreaticSecretionGraphic {...(props as GraphicProps<PancreasState>)} />;
    case 'gastric-phases':
      return <GastricPhasesGraphic {...(props as GraphicProps<GastricState>)} />;
    case 'gut-muscle':
      return <GutMuscleGraphic {...(props as GraphicProps<MuscleState>)} />;
    case 'defecation':
      return <DefecationGraphic {...(props as GraphicProps<DefecationState>)} />;
    case 'bilirubin':
      return <BilirubinGraphic {...(props as GraphicProps<BilirubinState>)} />;
    case 'feedback-axis':
      return <FeedbackAxisGraphic {...(props as GraphicProps<FeedbackState>)} />;
    case 'adh-water':
      return <AdhWaterGraphic {...(props as GraphicProps<AdhState>)} />;
    case 'growth-hormone':
      return <GrowthHormoneGraphic {...(props as GraphicProps<GhState>)} />;
    case 'thyroid-axis':
      return <ThyroidAxisGraphic {...(props as GraphicProps<ThyroidState>)} />;
    case 'adrenal-axis':
      return <AdrenalAxisGraphic {...(props as GraphicProps<AdrenalState>)} />;
    case 'glucose-insulin':
      return <GlucoseInsulinGraphic {...(props as GraphicProps<GlucoseInsulinState>)} />;
    case 'calcium':
      return <CalciumGraphic {...(props as GraphicProps<CalciumState>)} />;
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

import { View } from 'react-native';
import { G } from 'react-native-svg';

import { DISORDERS, type AcidBaseState } from '@/data/simulations/acid-base';

import { KidneySection } from './anatomy/kidney';
import { Diaphragm, Heart, Lungs, Torso } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;

// The two organs that correct pH: the lungs (breathing faster or slower to
// change CO₂, within minutes) and the kidneys (excreting H⁺ and making
// HCO₃⁻, over days). Each works visibly harder or less hard.
export function AcidBaseGraphic({ state, time, reduceMotion }: GraphicProps<AcidBaseState>) {
  const rate = 12 * state.ventilation;
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time * rate) / 60)) / 2;
  const depth = Math.min(1.3, 0.45 * state.ventilation);
  const inflate = 0.1 + phase * depth;
  const kidneyWork = Math.max(0, Math.min(1, (state.renal - 0.4) / 2));
  const lungText = state.ventilation > 1.08 ? 'Lungs: blowing off CO₂' : state.ventilation < 0.92 ? 'Lungs: holding CO₂' : 'Lungs: normal breathing';
  const kidneyText = state.renal > 1.08 ? 'Kidneys: more H⁺ out, new HCO₃⁻' : state.renal < 0.92 ? 'Kidneys: less HCO₃⁻ kept' : 'Kidneys: steady';

  return (
    <View>
      <Canvas width={W} height={H} label={`${DISORDERS[state.disorder]}: pH ${state.ph.toFixed(2)}, PaCO₂ ${Math.round(state.paco2)} mmHg, HCO₃⁻ ${state.hco3.toFixed(1)} mEq/L. ${lungText}. ${kidneyText}.`}>
        <G transform="translate(0 36) scale(0.86)">
          <Torso />
          <Diaphragm inflate={inflate} />
          <Heart />
          <Lungs inflate={inflate} />
        </G>
        <G transform="translate(222 40) scale(0.78)">
          <KidneySection glow={kidneyWork} />
        </G>
        <Tag x={104} y={18} text={lungText} size={10} tone={state.ventilation > 1.08 || state.ventilation < 0.92 ? 'warning' : 'primary'} />
        <Tag x={300} y={18} text={kidneyText} size={10} tone={state.renal > 1.08 || state.renal < 0.92 ? 'warning' : 'primary'} />
        <Tag x={200} y={286} text={`${DISORDERS[state.disorder]} · pH ${state.ph.toFixed(2)}`} tone={state.ph < 7.35 || state.ph > 7.45 ? 'error' : 'success'} />
      </Canvas>
    </View>
  );
}

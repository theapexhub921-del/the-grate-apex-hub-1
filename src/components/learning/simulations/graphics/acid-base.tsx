import { View } from 'react-native';

import { DISORDERS, type AcidBaseState } from '@/data/simulations/acid-base';

import { Organ3D } from '../organ-3d';
import { chestFrame, rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

// The two organs that correct pH, on the real anatomy: the lungs breathe faster or slower to
// change CO₂ (within minutes), and the kidneys glow as they excrete more H⁺ and make new HCO₃⁻
// (over days) or dim as they keep less.
export function AcidBaseGraphic({ state, time, reduceMotion }: GraphicProps<AcidBaseState>) {
  const rate = 12 * state.ventilation;
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time * rate) / 60)) / 2;
  const kidneyWork = Math.max(0, Math.min(1, (state.renal - 0.4) / 2));
  const frame = chestFrame({
    inflate: rounded(0.1 + phase * Math.min(1.2, 0.45 * state.ventilation), 0.02),
    extra: { glow: { kidneys: rounded(0.15 + 0.6 * kidneyWork, 0.05), airways: rounded(Math.max(0, state.ventilation - 1) * 0.6, 0.05) }, glowColor: { kidneys: '#ffd25a', airways: '#7fc4ff' } },
  });
  const lungText = state.ventilation > 1.08 ? 'Lungs: blowing off CO₂' : state.ventilation < 0.92 ? 'Lungs: holding CO₂' : 'Lungs: normal breathing';
  const kidneyText = state.renal > 1.08 ? 'Kidneys: more H⁺ out, new HCO₃⁻' : state.renal < 0.92 ? 'Kidneys: less HCO₃⁻ kept' : 'Kidneys: steady';
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="lungs-kidneys" frame={frame} height={320} label={`${DISORDERS[state.disorder]}: pH ${state.ph.toFixed(2)}. ${lungText}. ${kidneyText}.`} />
      <Canvas width={400} height={44} label={`${lungText}. ${kidneyText}.`}>
        <Tag x={100} y={22} text={lungText} size={10} tone={state.ventilation > 1.08 || state.ventilation < 0.92 ? 'warning' : 'primary'} />
        <Tag x={300} y={22} text={kidneyText} size={10} tone={state.renal > 1.08 || state.renal < 0.92 ? 'warning' : 'primary'} />
      </Canvas>
    </View>
  );
}

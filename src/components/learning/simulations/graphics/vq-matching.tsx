import { View } from 'react-native';
import { Circle, Path } from 'react-native-svg';

import { alveolarGas, MEMBRANES, VQ_KINDS, type VqState } from '@/data/simulations/vq-matching';
import { useTheme } from '@/hooks/use-theme';

import { Caption } from './kit';
import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 50;
const R = 384;
const T = 24;
const B = 236;

// The O₂–CO₂ diagram: every alveolus lies on the line from venous blood
// (V/Q = 0) to inspired air (V/Q = ∞).
const LINE: [number, number][] = (() => {
  const pts: [number, number][] = [];
  for (let v = 0; v <= 40; v += v < 2 ? 0.05 : 0.5) {
    const gas = alveolarGas(v);
    pts.push([gas.alvO2, gas.alvCO2]);
  }
  pts.push([149, 0]);
  return pts;
})();

export function VqMatchingGraphic({ state, baseline }: GraphicProps<VqState>) {
  const colors = useTheme();
  const x = linear([30, 160], [L, R]);
  const y = linear([0, 50], [B, T]);

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`V/Q ${state.vq.toFixed(2)}: alveolar PO₂ ${Math.round(state.alvO2)}, PCO₂ ${Math.round(state.alvCO2)}; blood leaving PO₂ ${Math.round(state.artO2)}, PCO₂ ${Math.round(state.artCO2)} mmHg. ${MEMBRANES[state.membrane]}.`}>
        <Axes x={x} y={y} xTicks={[40, 60, 80, 100, 120, 140, 160]} yTicks={[0, 10, 20, 30, 40, 50]} left={L} right={R} top={T} bottom={B} xLabel="PO₂ (mmHg)" yLabel="PCO₂ (mmHg)" />
        <Path d={pathOf(LINE, x, y)} stroke={colors.textTertiary} strokeWidth={2.5} fill="none" />
        <Caption x={x(40) + 6} y={y(46) - 8} text="V/Q = 0 (venous)" tone="tertiary" size={11} />
        <Caption x={x(149) - 4} y={y(0) - 8} anchor="end" text="V/Q = ∞ (inspired air)" tone="tertiary" size={11} />
        <Circle cx={x(baseline.alvO2)} cy={y(baseline.alvCO2)} r={6} fill="none" stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="3 2" />
        <Circle cx={x(state.alvO2)} cy={y(state.alvCO2)} r={8} fill={colors.primary} stroke={colors.surface} strokeWidth={2.5} />
        {state.membrane > 0 ? <Circle cx={x(state.artO2)} cy={y(state.artCO2)} r={6} fill={colors.error} stroke={colors.surface} strokeWidth={2} /> : null}
        <Caption x={R} y={T + 4} anchor="end" text={`V/Q ${state.vq.toFixed(2)} · ${VQ_KINDS[state.readouts.kind]}`} tone="primary" />
      </Canvas>
      <Legend
        items={[
          { label: 'Alveolar gas', color: colors.primary },
          ...(state.membrane > 0 ? [{ label: 'Blood leaving (thick membrane)', color: colors.error }] : []),
          { label: 'Before', color: colors.textTertiary, dashed: true },
        ]}
      />
    </View>
  );
}

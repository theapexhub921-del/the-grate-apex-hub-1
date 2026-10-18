import { View } from 'react-native';
import { Circle, Line, Path } from 'react-native-svg';

import { ARTERIAL, CARRIERS, saturationAt, TISSUE, type DissociationState } from '@/data/simulations/o2-dissociation';
import { useTheme } from '@/hooks/use-theme';

import { Caption } from './kit';
import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 50;
const R = 384;
const T = 24;
const B = 236;

function curve(s: DissociationState): [number, number][] {
  const pts: [number, number][] = [];
  for (let p = 0; p <= 150; p += 2) pts.push([p, saturationAt(p, s.p50, s.hill) * s.available * 100]);
  return pts;
}

export function O2DissociationGraphic({ state, baseline }: GraphicProps<DissociationState>) {
  const colors = useTheme();
  const x = linear([0, 150], [L, R]);
  const y = linear([0, 100], [B, T]);
  const sat = (p: number) => saturationAt(p, state.p50, state.hill) * state.available * 100;
  const changed = Math.abs(baseline.p50 - state.p50) > 0.05 || baseline.available !== state.available;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${CARRIERS[state.carrier]}: P50 ${state.p50.toFixed(1)} mmHg; at PO₂ ${Math.round(state.po2)} mmHg saturation is ${Math.round(state.readouts.sat)}%.`}>
        <Axes x={x} y={y} xTicks={[0, 25, 50, 75, 100, 125, 150]} yTicks={[0, 25, 50, 75, 100]} left={L} right={R} top={T} bottom={B} xLabel="PO₂ (mmHg)" yLabel="Saturation (%)" />
        {/* tissue and lung marks, and the O₂ released between them */}
        <Line x1={x(TISSUE)} x2={x(TISSUE)} y1={T} y2={B} stroke={colors.warning} strokeDasharray="4 4" />
        <Line x1={x(ARTERIAL)} x2={x(ARTERIAL)} y1={T} y2={B} stroke={colors.success} strokeDasharray="4 4" />
        <Caption x={x(TISSUE) + 4} y={B - 40} text="Tissues" tone="warning" size={11} />
        <Caption x={x(ARTERIAL) + 4} y={B - 40} text="Lungs" tone="success" size={11} />
        <Line x1={x(TISSUE) - 8} x2={x(TISSUE) - 8} y1={y(sat(ARTERIAL))} y2={y(sat(TISSUE))} stroke={colors.accent} strokeWidth={5} strokeLinecap="round" />
        {/* P50 */}
        <Line x1={L} x2={x(state.p50)} y1={y(50 * state.available)} y2={y(50 * state.available)} stroke={colors.textTertiary} strokeDasharray="2 3" />
        <Line x1={x(state.p50)} x2={x(state.p50)} y1={y(50 * state.available)} y2={B} stroke={colors.textTertiary} strokeDasharray="2 3" />
        <Caption x={x(state.p50) + 4} y={B - 6} text={`P50 ${state.p50.toFixed(1)}`} tone="tertiary" size={11} />
        {changed ? <Path d={pathOf(curve(baseline), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(curve(state), x, y)} stroke={colors.primary} strokeWidth={3} fill="none" />
        <Circle cx={x(state.po2)} cy={y(state.readouts.sat)} r={7} fill={colors.accent} stroke={colors.surface} strokeWidth={2.5} />
        <Caption x={R} y={H - 2} anchor="end" text={`${CARRIERS[state.carrier]} · released ${state.readouts.unload.toFixed(1)} ml/dl`} tone="primary" />
      </Canvas>
      <Legend
        items={[
          { label: 'Curve now', color: colors.primary },
          ...(changed ? [{ label: 'Before', color: colors.textTertiary, dashed: true }] : []),
          { label: 'O₂ released (lungs → tissues)', color: colors.accent },
        ]}
      />
    </View>
  );
}

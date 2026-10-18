import { View } from 'react-native';
import { Circle, Line, Path } from 'react-native-svg';

import { CONDITIONS, type ComplianceState } from '@/data/simulations/lung-compliance';
import { useTheme } from '@/hooks/use-theme';

import { Caption } from './kit';
import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 54;
const R = 270;
const T = 24;
const B = 240;

export function LungComplianceGraphic({ state, baseline }: GraphicProps<ComplianceState>) {
  const colors = useTheme();
  const x = linear([0, 10], [L, R]);
  const y = linear([0, 1500], [B, T]);
  const line = (c: number): [number, number][] => [
    [0, 0],
    [Math.min(10, 1500 / c), Math.min(1500, c * 10)],
  ];
  // An alveolus: open with surfactant, shrinking as surface tension rises.
  const radius = Math.max(8, 44 - (state.collapse - 100) / 8);
  const baseRadius = Math.max(8, 44 - (baseline.collapse - 100) / 8);

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${CONDITIONS[state.condition]}, surfactant ${state.surfactant}%: compliance ${Math.round(state.compliance)} ml per mmHg; breath ${Math.round(state.tidal)} ml.`}>
        <Axes x={x} y={y} xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[0, 500, 1000, 1500]} left={L} right={R} top={T} bottom={B} xLabel="Pressure change (mmHg)" yLabel="Volume (ml)" />
        <Path d={pathOf(line(baseline.compliance), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" />
        <Path d={pathOf(line(state.compliance), x, y)} stroke={colors.primary} strokeWidth={3} />
        <Line x1={x(state.pressure)} x2={x(state.pressure)} y1={B} y2={y(Math.min(1500, state.tidal))} stroke={colors.accent} strokeDasharray="4 3" />
        <Circle cx={x(state.pressure)} cy={y(Math.min(1500, state.tidal))} r={6} fill={colors.accent} stroke={colors.surface} strokeWidth={2} />
        <Caption x={(L + R) / 2} y={T - 6} anchor="middle" text="Slope = compliance" tone="tertiary" size={11} />

        <Caption x={335} y={46} anchor="middle" text="An alveolus" />
        <Circle cx={335} cy={120} r={baseRadius} fill="none" stroke={colors.textTertiary} strokeDasharray="4 3" />
        <Circle cx={335} cy={120} r={radius} fill={colors.primary} opacity={0.3} stroke={colors.primary} strokeWidth={2} />
        <Caption x={335} y={190} anchor="middle" text={`Surfactant ${state.surfactant}%`} size={11} />
        <Caption x={335} y={206} anchor="middle" text={state.surfactant < 40 ? 'Collapsing' : 'Open'} tone={state.surfactant < 40 ? 'error' : 'success'} size={11} />
      </Canvas>
      <Legend
        items={[
          { label: 'Now', color: colors.primary },
          { label: 'Before', color: colors.textTertiary, dashed: true },
          { label: 'This breath', color: colors.accent, dashed: true },
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';
import { Circle, Line, Path } from 'react-native-svg';

import { END, type GlucoseInsulinState } from '@/data/simulations/glucose-insulin';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { levelGlow } from '../organ-frames';
import { Caption } from './kit';
import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 210;
const L = 44;
const R = 14;
const T = 16;
const B = 170;

// The pancreas glows with the insulin its β cells secrete; below, blood glucose after the drink,
// with a healthy person's curve and the level above which glucose spills into the urine.
export function GlucoseInsulinGraphic({ state }: GraphicProps<GlucoseInsulinState>) {
  const colors = useTheme();
  const x = linear([0, END], [L, W - R]);
  const y = linear([0, 22], [B, T]);
  const pts = (c: number[]) => c.map((v, i) => [i * 5, Math.min(22, v)] as [number, number]);
  const g = state.readouts.glucose;
  const frame = {
    glow: { pancreas: levelGlow(state.insulin), kidneys: g > 10 ? 0.35 : 0 },
    glowColor: { pancreas: '#ffcf5a', kidneys: '#9fd0ff' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="endocrine-abdomen" frame={frame} label={`${state.time} minutes: glucose ${g.toFixed(1)} mmol/L, insulin ${Math.round(state.readouts.insulin)}% of fasting.`} />
      <Canvas width={W} height={H} label={`Blood glucose over four hours; now ${g.toFixed(1)} mmol/L at ${state.time} minutes.`}>
        <Axes x={x} y={y} xTicks={[0, 60, 120, 180, 240]} yTicks={[0, 5, 10, 15, 20]} left={L} right={W - R} top={T} bottom={B} xLabel="Minutes after the drink" yLabel="Glucose (mmol/L)" />
        <Line x1={L} x2={W - R} y1={y(10)} y2={y(10)} stroke={colors.warning} strokeWidth={1.5} strokeDasharray="4 3" />
        <Caption x={W - R - 2} y={y(10) - 5} text="Glucose spills into urine" anchor="end" tone="warning" size={10} />
        <Path d={pathOf(pts(state.normal), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" />
        <Path d={pathOf(pts(state.curve), x, y)} stroke={colors.primary} strokeWidth={3} fill="none" />
        <Line x1={x(state.time)} x2={x(state.time)} y1={T} y2={B} stroke={colors.accent} strokeWidth={2} />
        <Circle cx={x(state.time)} cy={y(Math.min(22, g))} r={6} fill={colors.primary} stroke={colors.surface} strokeWidth={2} />
      </Canvas>
      <Legend
        items={[
          { label: 'Blood glucose', color: colors.primary },
          { label: 'Healthy person', color: colors.textTertiary, dashed: true },
        ]}
      />
    </View>
  );
}

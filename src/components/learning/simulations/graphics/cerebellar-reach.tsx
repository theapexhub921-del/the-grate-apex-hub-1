import { View } from 'react-native';
import { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { SPAN, type ReachState } from '@/data/simulations/cerebellar-reach';
import { useTheme } from '@/hooks/use-theme';

import { along, Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 48;
const R = 14;
const T = 84;
const B = 250;
const TRACK_Y = 40;
const PAUSE = 0.8;

export function CerebellarReachGraphic({ state, baseline, time, reduceMotion }: GraphicProps<ReachState>) {
  const colors = useTheme();
  const x = linear([0, SPAN], [L, W - R]);
  const y = linear([0, 1.6], [B, T]);
  const clip = (points: [number, number][]) => points.map(([t, v]) => [t, Math.max(0, Math.min(1.6, v))] as [number, number]);
  const changed = baseline.cerebellum !== state.cerebellum || baseline.speed !== state.speed;

  // The finger replays the reach (slowed 2×), then pauses.
  const loop = SPAN * 2 + PAUSE;
  const t = reduceMotion ? SPAN : Math.min(SPAN, (((time % loop) + loop) % loop) / 2);
  const [, position] = along(state.path, t / SPAN);
  const track = linear([0, 1.6], [L, W - R]);

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Cerebellar function ${Math.round(state.cerebellum)}%. The finger overshoots the target by ${Math.round(state.overshoot)}% and swings past it ${state.swings} times.`}>
        {/* The reach, seen from above */}
        <Rect x={L} y={TRACK_Y - 3} width={W - R - L} height={6} rx={3} fill={colors.track} />
        <Rect x={track(0.95)} y={TRACK_Y - 16} width={track(1.05) - track(0.95)} height={32} rx={6} fill={colors.successSubtle} stroke={colors.successBorder} />
        <SvgText x={track(1)} y={TRACK_Y - 22} fontSize={11} fontWeight="800" fill={colors.successText} textAnchor="middle">
          Target
        </SvgText>
        <SvgText x={L} y={TRACK_Y - 12} fontSize={11} fontWeight="800" fill={colors.textTertiary}>
          Start
        </SvgText>
        <Circle cx={track(Math.max(0, Math.min(1.6, position)))} cy={TRACK_Y} r={9} fill={colors.accent} stroke={colors.surface} strokeWidth={2.5} />

        {/* Position over time */}
        <Rect x={L} y={y(1.05)} width={W - R - L} height={y(0.95) - y(1.05)} fill={colors.successSubtle} />
        <Axes x={x} y={y} xTicks={[0, 1, 2, 3]} yTicks={[0, 0.5, 1, 1.5]} left={L} right={W - R} top={T} bottom={B} xLabel="Time (s)" yLabel="Finger position" />
        {changed ? <Path d={pathOf(clip(baseline.path), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(clip(state.path), x, y)} stroke={colors.primary} strokeWidth={3} fill="none" />
        <Line x1={x(t)} x2={x(t)} y1={T} y2={B} stroke={colors.accent} strokeWidth={1.5} opacity={0.6} />
        <Circle cx={x(t)} cy={y(Math.max(0, Math.min(1.6, position)))} r={6} fill={colors.accent} stroke={colors.surface} strokeWidth={2} />
      </Canvas>
      <Legend
        items={[
          { label: 'Finger path', color: colors.primary },
          ...(changed ? [{ label: 'Before', color: colors.textTertiary, dashed: true }] : []),
          { label: 'On target (±5%)', color: colors.successBorder },
        ]}
      />
    </View>
  );
}

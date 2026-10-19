import { View } from 'react-native';
import { Circle, Line, Path, Rect } from 'react-native-svg';

import { SPAN, type ReachState } from '@/data/simulations/cerebellar-reach';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { along, Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 230;
const L = 48;
const R = 14;
const T = 20;
const B = 190;
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

  // the real brain from the left: the cerebellum glows with how well it is working and greys
  // out when damaged
  const fn = Math.max(0, Math.min(1, state.cerebellum / 100));
  const organ = {
    glow: { cerebellum: rounded(0.15 + 0.45 * fn, 0.05) },
    glowColor: { cerebellum: '#9fd0ff' },
    color: { cerebellum: fn < 0.6 ? '#9c9090' : '#c99a95' },
  };

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="brain" frame={organ} label={`The brain from the left: cerebellar function ${Math.round(state.cerebellum)}%`} />
      <Canvas width={W} height={H} label={`Cerebellar function ${Math.round(state.cerebellum)}%. The finger overshoots the target by ${Math.round(state.overshoot)}% and swings past it ${state.swings} times.`}>
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

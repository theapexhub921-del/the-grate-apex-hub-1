import { View } from 'react-native';
import { Circle, Line, Path } from 'react-native-svg';

import { SPAN, type PainState } from '@/data/simulations/pain-gate';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 256;
const L = 44;
const R = 14;
const T = 24;
const B = 196;

export function PainGateGraphic({ state, baseline }: GraphicProps<PainState>) {
  const colors = useTheme();
  const x = linear([0, SPAN], [L, W - R]);
  const y = linear([0, 100], [B, T]);
  const clampY = (v: number) => y(Math.min(100, v));
  const total = (s: PainState) => s.fastTrace.map(([t, v], i) => [t, Math.min(100, v + s.slowTrace[i][1])] as [number, number]);
  const changed = Math.abs(baseline.factor - state.factor) > 1e-6 || baseline.fastTrace[0][1] !== state.fastTrace[0][1];
  const cursor = x(Math.min(SPAN, state.t));
  const open = state.factor;

  // the real spinal cord: the dorsal horn glows where the gate is worked, and the spinothalamic
  // tracts glow with the pain signal sent up to the brain
  const pain = Math.min(1, (state.fast + state.slow) / 100);
  const organ = {
    glow: { dorsal: rounded(0.3 + 0.5 * (1 - open), 0.05), st: rounded(pain * open, 0.05) },
    glowColor: { dorsal: '#9fd0ff', st: '#ff5a3a' },
  };

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="cord" frame={organ} label={`The spinal cord: ${Math.round(open * 100)}% of the pain signal passes the dorsal horn`} />
      <Canvas width={W} height={H} label={`${state.t.toFixed(1)} s after the injury: fast pain ${Math.round(state.fast)}, slow pain ${Math.round(state.slow)}; ${Math.round(open * 100)}% of the pain signal gets through.`}>
        <Axes x={x} y={y} xTicks={[0, 5, 10, 15, 20]} yTicks={[0, 50, 100]} left={L} right={W - R} top={T} bottom={B} xLabel="Seconds after the injury" yLabel="Pain felt" />
        {changed ? <Path d={pathOf(total(baseline), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(state.fastTrace.map(([t, v]) => [t, Math.min(100, v)]), x, y)} stroke={colors.primary} strokeWidth={3} fill="none" />
        <Path d={pathOf(state.slowTrace.map(([t, v]) => [t, Math.min(100, v)]), x, y)} stroke={colors.warning} strokeWidth={3} fill="none" />
        <Line x1={cursor} x2={cursor} y1={T} y2={B} stroke={colors.accent} strokeWidth={2} />
        <Circle cx={cursor} cy={clampY(state.fast)} r={6} fill={colors.primary} stroke={colors.surface} strokeWidth={2} />
        <Circle cx={cursor} cy={clampY(state.slow)} r={6} fill={colors.warning} stroke={colors.surface} strokeWidth={2} />

        <Tag x={W / 2} y={B + 44} text={`Pain signal getting through: ${Math.round(open * 100)}%${state.factor < 0.999 ? ' (turned down)' : ''}`} size={10} tone={open < 0.999 ? 'success' : 'error'} />
      </Canvas>
      <Legend
        items={[
          { label: 'Fast pain (Aδ)', color: colors.primary },
          { label: 'Slow pain (C, substance P)', color: colors.warning },
          ...(changed ? [{ label: 'Total before', color: colors.textTertiary, dashed: true }] : []),
        ]}
      />
    </View>
  );
}

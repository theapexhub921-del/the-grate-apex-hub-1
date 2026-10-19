import { View } from 'react-native';
import { Line, Path, Rect } from 'react-native-svg';

import { CONDITIONS, PHASES, type MenstrualState } from '@/data/simulations/menstrual-cycle';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Caption } from './kit';
import { Axes, Canvas, Legend, linear, type GraphicProps } from './shared';

const W = 400;
const H = 200;
const L = 30;
const R = 12;
const T = 22;
const B = 160;

// The uterus thickens with its endometrium and reddens as it is shed; the ovary glows with its
// hormones. Below, the four hormones across the cycle (each scaled to its own peak).
export function MenstrualCycleGraphic({ state }: GraphicProps<MenstrualState>) {
  const colors = useTheme();
  const r = state.readouts;
  const x = linear([1, 28], [L, W - R]);
  const y = linear([0, 1.05], [B, T]);
  const line = (v: number[]) => {
    const max = Math.max(...v);
    return v.map((k, i) => `${i ? 'L' : 'M'}${x(1 + i * 0.5).toFixed(1)} ${y(k / max).toFixed(1)}`).join(' ');
  };
  const shedding = state.phase === 0 ? 1 : 0;
  const frame = {
    move: { uterus: rounded(0.95 + state.endometrium / 120, 0.01) },
    glow: { uterus: shedding ? 0.7 : 0, ovaryR: rounded(Math.min(1, (r.e2 / 400) * 0.5 + (r.p4 / 1000) * 0.5), 0.05) },
    glowColor: { uterus: '#ff2a1a', ovaryR: r.p4 > 300 ? '#ffd23a' : '#ffcf5a' },
  };
  const bands: [number, number, string][] = [
    [1, 5, PHASES[0]],
    [5, 14, PHASES[1]],
    [14, 26, PHASES[2]],
    [26, 28, ''],
  ];
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="female" frame={frame} height={250} label={`Day ${state.day}, ${PHASES[state.phase].toLowerCase()} phase (${CONDITIONS[state.condition].toLowerCase()}): endometrium ${r.endometrium.toFixed(1)} mm.`} />
      <Canvas width={W} height={H} label={`FSH, LH, estradiol and progesterone over the cycle; now day ${state.day}.`}>
        {bands.map(([a, b, label], i) => (
          <Rect key={i} x={x(a)} y={T - 16} width={x(b) - x(a)} height={12} fill={i === 0 ? colors.errorSubtle : i === 2 ? colors.warningSubtle : colors.surfaceMuted} />
        ))}
        {bands.map(([a, b, label], i) => (label ? <Caption key={`c${i}`} x={(x(a) + x(b)) / 2} y={T - 7} text={label} anchor="middle" size={8} tone="secondary" /> : null))}
        <Axes x={x} y={y} xTicks={[1, 7, 14, 21, 28]} yTicks={[]} left={L} right={W - R} top={T} bottom={B} xLabel="Day of the cycle" yLabel="" />
        <Path d={line(state.curves.fsh)} stroke={colors.primary} strokeWidth={2} fill="none" />
        <Path d={line(state.curves.lh)} stroke={colors.error} strokeWidth={2} fill="none" />
        <Path d={line(state.curves.e2)} stroke={colors.success} strokeWidth={2.5} fill="none" />
        <Path d={line(state.curves.p4)} stroke={colors.warning} strokeWidth={2.5} fill="none" />
        <Line x1={x(state.day)} x2={x(state.day)} y1={T} y2={B} stroke={colors.accent} strokeWidth={2} />
      </Canvas>
      <Legend
        items={[
          { label: 'FSH', color: colors.primary },
          { label: 'LH', color: colors.error },
          { label: 'Estradiol', color: colors.success },
          { label: 'Progesterone', color: colors.warning },
        ]}
      />
    </View>
  );
}

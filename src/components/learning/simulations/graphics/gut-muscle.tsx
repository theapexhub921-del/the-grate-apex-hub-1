import { View } from 'react-native';
import { Line, Path } from 'react-native-svg';

import { REGIONS, THRESHOLD, type MuscleState } from '@/data/simulations/gut-muscle';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Caption } from './kit';
import { Axes, Canvas, linear, type GraphicProps } from './shared';

const W = 400;
const H = 190;
const L = 44;
const R = 14;
const T = 14;
const B = 150;
const SPAN = 40; // seconds shown

// A slow wave: a smooth rise to a plateau and back, once per period (0–1).
const wave = (phase: number) => Math.max(0, Math.sin(Math.PI * Math.min(1, phase / 0.6))) ** 0.8;

// The region contracts in the 3D gut with every slow wave that carries spikes; below, the
// membrane potential: slow waves from the interstitial cells of Cajal, with spikes where they
// cross threshold.
export function GutMuscleGraphic({ state, time, reduceMotion }: GraphicProps<MuscleState>) {
  const colors = useTheme();
  const x = linear([0, SPAN], [L, W - R]);
  const y = linear([-70, -10], [B, T]);
  const period = 60 / state.freq;
  const vAt = (t: number) => state.base + state.amplitude * wave(((t % period) + period) % period / period);
  let d = '';
  for (let t = 0; t <= SPAN; t += 0.1) d += `${t === 0 ? 'M' : 'L'}${x(t).toFixed(1)} ${y(vAt(t)).toFixed(1)} `;
  const spikes: number[] = [];
  for (let k = 0; k * period < SPAN; k += 1) {
    for (let i = 0; i < state.spikes; i += 1) spikes.push(k * period + period * (0.15 + (0.3 * (i + 0.5)) / state.spikes));
  }
  const now = reduceMotion ? SPAN * 0.4 : (time % SPAN + SPAN) % SPAN;
  const crest = wave(((now % period) + period) % period / period);
  const squeeze = state.spikes ? rounded(1 - 0.08 * (state.force / 100) * crest, 0.01) : 1;
  const part = ['stomach', 'duodenum', 'jejunum'][state.region];
  const frame = {
    move: { stomach: state.region === 0 ? squeeze : 1 },
    glow: { [part]: rounded(0.15 + 0.7 * (state.force / 100) * crest, 0.05) },
    glowColor: { [part]: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut" frame={frame} height={300} label={`${REGIONS[state.region].label}: ${state.freq} slow waves a minute with ${state.spikes} spikes each; contraction ${Math.round(state.force)}%.`} />
      <Canvas width={W} height={H} label={`Membrane potential: slow waves at ${state.freq} per minute, ${state.spikes} spikes on each.`}>
        <Axes x={x} y={y} xTicks={[0, 10, 20, 30, 40]} yTicks={[-70, -50, -30, -10]} left={L} right={W - R} top={T} bottom={B} xLabel="Seconds" yLabel="mV" />
        <Line x1={L} x2={W - R} y1={y(THRESHOLD)} y2={y(THRESHOLD)} stroke={colors.warning} strokeWidth={1.5} strokeDasharray="4 3" />
        <Caption x={W - R - 2} y={y(THRESHOLD) - 5} text="Threshold" anchor="end" tone="warning" size={10} />
        <Path d={d} stroke={colors.primary} strokeWidth={2.5} fill="none" />
        {spikes.map((t) => (
          <Line key={t} x1={x(t)} x2={x(t)} y1={y(vAt(t))} y2={y(-14)} stroke={colors.error} strokeWidth={1.6} />
        ))}
        <Line x1={x(now)} x2={x(now)} y1={T} y2={B} stroke={colors.accent} strokeWidth={2} />
      </Canvas>
    </View>
  );
}

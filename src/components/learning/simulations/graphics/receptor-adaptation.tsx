import { View } from 'react-native';
import { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { frequencyFrom, RECEPTORS, SPAN, THRESHOLD, type AdaptationState } from '@/data/simulations/receptor-adaptation';
import { useTheme } from '@/hooks/use-theme';

import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 44;
const R = 14;
const T = 30;
const B = 190;
const SPIKE_TOP = 238;
const SPIKE_BOTTOM = 260;

// Impulse times over the trace, from the firing rate at each moment.
function spikeTimes(trace: [number, number][]) {
  const times: number[] = [];
  let phase = 0;
  for (let i = 1; i < trace.length; i++) {
    const [t0, g0] = trace[i - 1];
    const [t1, g1] = trace[i];
    const steps = 10;
    for (let k = 0; k < steps; k++) {
      const g = g0 + ((g1 - g0) * k) / steps;
      const dt = (t1 - t0) / steps;
      phase += frequencyFrom(g) * dt;
      while (phase >= 1) {
        phase -= 1;
        times.push(t0 + dt * (k + 1));
      }
    }
  }
  return times;
}

export function ReceptorAdaptationGraphic({ state, baseline }: GraphicProps<AdaptationState>) {
  const colors = useTheme();
  const x = linear([0, SPAN], [L, W - R]);
  const y = linear([0, 32], [B, T]);
  const spikes = spikeTimes(state.trace);
  const spikePath = spikes.map((t) => `M${x(t).toFixed(1)} ${SPIKE_TOP}V${SPIKE_BOTTOM}`).join(' ');
  const changed = baseline.strength !== state.strength || baseline.receptor !== state.receptor;
  const cursor = x(Math.min(SPAN, state.t));

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${RECEPTORS[state.receptor]}. After ${state.t.toFixed(1)} s the generator potential is ${state.generator.toFixed(1)} mV and the fibre fires ${Math.round(state.frequency)} times a second.`}>
        <SvgText x={L} y={18} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          {`${RECEPTORS[state.receptor]} · stimulus ${Math.round(state.strength)}%, held steady`}
        </SvgText>
        <Axes x={x} y={y} xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[0, 10, 20, 30]} left={L} right={W - R} top={T} bottom={B} yLabel="Generator potential (mV)" />
        <Line x1={L} x2={W - R} y1={y(THRESHOLD)} y2={y(THRESHOLD)} stroke={colors.warning} strokeWidth={2} strokeDasharray="6 4" />
        <SvgText x={W - R - 4} y={y(THRESHOLD) - 6} fontSize={11} fontWeight="800" fill={colors.warningText} textAnchor="end">
          Threshold
        </SvgText>
        {changed ? <Path d={pathOf(baseline.trace, x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(state.trace, x, y)} stroke={colors.primary} strokeWidth={3} fill="none" />
        <Line x1={cursor} x2={cursor} y1={T} y2={SPIKE_BOTTOM + 4} stroke={colors.accent} strokeWidth={2} />
        <Circle cx={cursor} cy={y(state.generator)} r={7} fill={colors.accent} stroke={colors.surface} strokeWidth={2.5} />
        <Rect x={L} y={SPIKE_TOP - 4} width={W - R - L} height={SPIKE_BOTTOM - SPIKE_TOP + 8} rx={6} fill={colors.surfaceMuted} />
        <Path d={spikePath} stroke={colors.text} strokeWidth={1.2} />
        <SvgText x={L} y={SPIKE_TOP - 10} fontSize={11} fontWeight="800" fill={colors.textSecondary}>
          Action potentials in the nerve fibre
        </SvgText>
        <SvgText x={(L + W - R) / 2} y={H - 10} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          Time since the stimulus began (s)
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: 'Generator potential', color: colors.primary },
          ...(changed ? [{ label: 'Before', color: colors.textTertiary, dashed: true }] : []),
          { label: 'Firing needs the threshold', color: colors.warning, dashed: true },
        ]}
      />
    </View>
  );
}

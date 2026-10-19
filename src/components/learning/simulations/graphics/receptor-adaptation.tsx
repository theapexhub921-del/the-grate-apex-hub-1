import { View } from 'react-native';
import { Circle, Ellipse, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { frequencyFrom, RECEPTORS, SPAN, THRESHOLD, type AdaptationState } from '@/data/simulations/receptor-adaptation';
import { useTheme } from '@/hooks/use-theme';

import { Anatomy as A } from '@/constants/theme';

import { mix } from './anatomy/cells';
import { Tube } from './anatomy/kidney';
import { Tag } from './kit';
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

// The receptor itself: for touch, a Pacinian corpuscle (layers like an onion) deep in the skin
// under a pressing fingertip; for blood pressure, the stretched wall of the carotid sinus with
// nerve endings in it. Impulses travel up the nerve fibre as fast as the receptor fires.
function ReceptorPicture({ state, time }: { state: AdaptationState; time: number }) {
  const press = state.strength / 100;
  const spacing = 300 / Math.max(1, state.frequency * 0.6);
  const spikes = state.frequency > 0.5 ? Array.from({ length: Math.min(30, Math.ceil(300 / spacing) + 1) }, (_, k) => ((k * spacing + time * 90) % 300)) : [];
  const fibre = 'M150 128 C200 128 220 96 260 96 L400 96';
  if (state.receptor === 1) {
    const stretch = 1 + 0.35 * press;
    return (
      <Canvas width={400} height={170} label="The carotid sinus wall, stretched by blood pressure, with its nerve endings firing up the fibre.">
        <Tube d={`M20 86 L140 86`} width={44 * stretch} wall={mix(A.artery, '#000000', 0.15)} fluid={mix(A.artery, '#FFFFFF', 0.2)} time={time} flow={1} />
        {[30, 60, 90, 120].map((x) => (
          <Tube key={x} d={`M${x} ${86 - 24 * stretch} C${x + 6} ${70 - 30 * stretch} ${x + 30} 120 150 128`} width={2.4} wall={A.nerve} fluid={mix(A.nerve, '#FFFFFF', 0.4)} shine={false} />
        ))}
        <Tube d={fibre} width={7} wall={A.nerve} fluid={mix(A.nerve, '#FFFFFF', 0.45)} />
        {spikes.map((x, i) => (
          <Circle key={i} cx={260 + x * 0.47} cy={96} r={4.2} fill="#FFF3A8" stroke={A.nerveDark} strokeWidth={1} />
        ))}
        <Tag x={80} y={20} text={`Carotid sinus wall · stretch ${Math.round(press * 100)}%`} size={10} />
        <Tag x={320} y={140} text={`${Math.round(state.frequency)} impulses a second`} size={10} />
      </Canvas>
    );
  }
  return (
    <Canvas width={400} height={170} label="Skin with a Pacinian corpuscle under a pressing fingertip; impulses travel up its nerve fibre.">
      {/* fingertip pressing on the skin */}
      <Ellipse cx={80} cy={8 + 14 * press} rx={46} ry={22} fill={mix(A.skin, '#FFFFFF', 0.1)} stroke={A.skinShade} strokeWidth={1.4} />
      {/* skin layers */}
      <Path d={`M0 30 Q80 ${30 + 12 * press} 160 30 L400 30 L400 52 L0 52 Z`} fill={mix(A.skin, '#FFFFFF', 0.3)} stroke={A.skinShade} />
      <Path d="M0 52 L400 52 L400 110 L0 110 Z" fill={mix(A.mucosa, '#FFFFFF', 0.45)} />
      <Path d="M0 110 L400 110 L400 170 L0 170 Z" fill={mix(A.fat, '#FFFFFF', 0.35)} />
      {/* Pacinian corpuscle: concentric lamellae around the nerve ending */}
      {[1, 0.82, 0.64, 0.48, 0.32].map((k) => (
        <Ellipse key={k} cx={100} cy={128} rx={46 * k * (1 - 0.12 * press)} ry={22 * k * (1 + 0.1 * press)} fill={mix(A.calyx, '#FFFFFF', 0.4 * k)} stroke={A.calyxShade} strokeWidth={1} opacity={0.95} />
      ))}
      <Tube d="M90 128 L150 128" width={4} wall={A.nerve} fluid={mix(A.nerve, '#FFFFFF', 0.45)} shine={false} />
      <Tube d={fibre} width={7} wall={A.nerve} fluid={mix(A.nerve, '#FFFFFF', 0.45)} />
      {spikes.map((x, i) => (
        <Circle key={i} cx={150 + x * 0.83} cy={x < 110 ? 128 - (x / 110) * 32 : 96} r={4.2} fill="#FFF3A8" stroke={A.nerveDark} strokeWidth={1} />
      ))}
      <Tag x={300} y={20} text="Epidermis · dermis · fat" size={9} />
      <Tag x={100} y={160} text="Pacinian corpuscle" size={10} />
      <Tag x={320} y={140} text={`${Math.round(state.frequency)} impulses a second`} size={10} />
    </Canvas>
  );
}

export function ReceptorAdaptationGraphic({ state, baseline, time, reduceMotion }: GraphicProps<AdaptationState>) {
  const colors = useTheme();
  const x = linear([0, SPAN], [L, W - R]);
  const y = linear([0, 32], [B, T]);
  const spikes = spikeTimes(state.trace);
  const spikePath = spikes.map((t) => `M${x(t).toFixed(1)} ${SPIKE_TOP}V${SPIKE_BOTTOM}`).join(' ');
  const changed = baseline.strength !== state.strength || baseline.receptor !== state.receptor;
  const cursor = x(Math.min(SPAN, state.t));

  return (
    <View style={{ gap: 10 }}>
      <ReceptorPicture state={state} time={reduceMotion ? 0 : time} />
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

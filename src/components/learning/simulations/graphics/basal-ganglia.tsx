import { View } from 'react-native';
import { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import type { BasalState } from '@/data/simulations/basal-ganglia';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 150;
const TRACE_T = 4; // seconds of movement drawn
const PLOT_L = 40;
const PLOT_R = W - 14;
const PLOT_T = 44;
const PLOT_B = 124;



// Hand position while trying to make one smooth movement from 0 to 1.
export function handTrace(s: BasalState): [number, number][] {
  const delay = Math.max(0, (s.brake - 100) / 100) * 1.2; // trouble starting
  const duration = 1.2 / (s.speed / 100);
  const points: [number, number][] = [];
  for (let i = 0; i <= 200; i++) {
    const t = (TRACE_T * i) / 200;
    const progress = Math.min(1, Math.max(0, (t - delay) / duration));
    const smooth = progress * progress * (3 - 2 * progress);
    const tremor = (s.rigidity / 100) * 0.06 * Math.sin(2 * Math.PI * 5 * t);
    const unwanted = (s.involuntary / 100) * (0.22 * Math.sin(2.3 * t) + 0.16 * Math.sin(5.1 * t + 1) + 0.1 * Math.sin(9.7 * t + 2));
    points.push([t, smooth + tremor + unwanted]);
  }
  return points;
}

export function BasalGangliaGraphic({ state, baseline, time, reduceMotion }: GraphicProps<BasalState>) {
  const colors = useTheme();


  const x = linear([0, TRACE_T], [PLOT_L, PLOT_R]);
  const y = linear([-0.3, 1.3], [PLOT_B, PLOT_T]);
  const trace = handTrace(state);
  const changed = baseline.dopamine !== state.dopamine || baseline.striatum !== state.striatum || baseline.stn !== state.stn;
  const loop = TRACE_T + 1;
  const t = reduceMotion ? TRACE_T : Math.min(TRACE_T, ((time % loop) + loop) % loop);
  const dot = trace[Math.round((t / TRACE_T) * 200)];

  // the real basal nuclei inside a see-through brain: the striatum (caudate, putamen) glows with
  // its activity, the midbrain (substantia nigra) with its dopamine, the subthalamic nucleus with
  // its drive, and the thalamus dims as the pallidal brake on it rises
  const g = (v: number) => rounded(Math.max(0, Math.min(1, v)), 0.05);
  const organ = {
    glow: { caudate: g((state.striatalActivity - 60) / 120), putamen: g((state.striatalActivity - 60) / 120), midbrain: g(state.dopamine / 140), subthalamic: g(state.stn / 140), pallidus: g((state.brake - 60) / 120), thalamus: g((180 - state.brake) / 200) },
    glowColor: { caudate: '#ff8a6a', putamen: '#ff8a6a', midbrain: '#ffd25a', subthalamic: '#ffd25a', pallidus: '#ff5a4a', thalamus: '#9fd0ff' },
    color: { caudate: state.striatum < 80 ? '#8f8580' : '#c98a7a', midbrain: state.dopamine < 60 ? '#a39a96' : '#6f5f5c' },
  };

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="brain-deep" frame={organ} label={`Basal nuclei: dopamine ${Math.round(state.dopamine)}%, striatal activity ${Math.round(state.striatalActivity)}%, brake on the thalamus ${Math.round(state.brake)}%`} />
      <Canvas width={W} height={H} label={`Brake ${Math.round(state.brake)}% of normal. Speed ${Math.round(state.speed)}%, rigidity ${Math.round(state.rigidity)}%, unwanted movements ${Math.round(state.involuntary)}%.`}>
        {/* Hand trace */}
        <SvgText x={PLOT_L} y={PLOT_T - 22} fontSize={11} fontWeight="800" fill={colors.textSecondary}>
          Trying to move the hand smoothly from A to B
        </SvgText>
        <Line x1={PLOT_L} x2={PLOT_R} y1={y(1)} y2={y(1)} stroke={colors.successBorder} strokeWidth={1.5} strokeDasharray="4 4" />
        <Line x1={PLOT_L} x2={PLOT_R} y1={y(0)} y2={y(0)} stroke={colors.border} strokeWidth={1} />
        <SvgText x={PLOT_L - 6} y={y(1) + 4} fontSize={11} fontWeight="900" fill={colors.successText} textAnchor="end">
          B
        </SvgText>
        <SvgText x={PLOT_L - 6} y={y(0) + 4} fontSize={11} fontWeight="900" fill={colors.textTertiary} textAnchor="end">
          A
        </SvgText>
        {changed ? <Path d={pathOf(handTrace(baseline), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(trace, x, y)} stroke={colors.primary} strokeWidth={2.5} fill="none" />
        {dot ? <Circle cx={x(dot[0])} cy={y(dot[1])} r={6} fill={colors.accent} stroke={colors.surface} strokeWidth={2} /> : null}
        <SvgText x={PLOT_R} y={H - 6} fontSize={10} fontWeight="700" fill={colors.textTertiary} textAnchor="end">
          {`${TRACE_T} seconds`}
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: 'Hand position', color: colors.primary },
          ...(changed ? [{ label: 'Before', color: colors.textTertiary, dashed: true }] : []),
        ]}
      />
    </View>
  );
}

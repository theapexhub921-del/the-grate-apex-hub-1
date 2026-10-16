import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { BasalState } from '@/data/simulations/basal-ganglia';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 340;
const TRACE_T = 4; // seconds of movement drawn
const PLOT_L = 40;
const PLOT_R = W - 14;
const PLOT_T = 232;
const PLOT_B = 312;

type Box = { x: number; y: number; w: number; h: number; title: string; sub?: string };

const CORTEX: Box = { x: 140, y: 8, w: 120, h: 34, title: 'Motor cortex' };
const STRIATUM: Box = { x: 20, y: 72, w: 140, h: 40, title: 'Striatum', sub: 'caudate + putamen' };
const GP: Box = { x: 240, y: 72, w: 140, h: 40, title: 'Globus pallidus' };
const THALAMUS: Box = { x: 240, y: 150, w: 140, h: 34, title: 'Thalamus' };
const SN: Box = { x: 20, y: 150, w: 140, h: 34, title: 'Substantia nigra' };
const STN: Box = { x: 160, y: 118, w: 80, h: 28, title: 'Subthalamic' };

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

const width = (activity: number) => 1.5 + Math.min(7, activity / 22);

export function BasalGangliaGraphic({ state, baseline, time, reduceMotion }: GraphicProps<BasalState>) {
  const colors = useTheme();

  const box = (b: Box, fill: string) => (
    <G key={b.title}>
      <Rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill={fill} stroke={colors.borderStrong} />
      <SvgText x={b.x + b.w / 2} y={b.y + (b.sub ? 17 : 21)} fontSize={12} fontWeight="900" fill={colors.text} textAnchor="middle">
        {b.title}
      </SvgText>
      {b.sub ? (
        <SvgText x={b.x + b.w / 2} y={b.y + 31} fontSize={10} fontWeight="700" fill={colors.textTertiary} textAnchor="middle">
          {b.sub}
        </SvgText>
      ) : null}
    </G>
  );

  const x = linear([0, TRACE_T], [PLOT_L, PLOT_R]);
  const y = linear([-0.3, 1.3], [PLOT_B, PLOT_T]);
  const trace = handTrace(state);
  const changed = baseline.dopamine !== state.dopamine || baseline.striatum !== state.striatum || baseline.stn !== state.stn;
  const loop = TRACE_T + 1;
  const t = reduceMotion ? TRACE_T : Math.min(TRACE_T, ((time % loop) + loop) % loop);
  const dot = trace[Math.round((t / TRACE_T) * 200)];
  const brakeColor = state.brake > 110 ? colors.error : state.brake < 90 ? colors.warning : colors.success;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Brake ${Math.round(state.brake)}% of normal. Speed ${Math.round(state.speed)}%, rigidity ${Math.round(state.rigidity)}%, unwanted movements ${Math.round(state.involuntary)}%.`}>
        {/* Connections */}
        <Path d={`M${CORTEX.x + 10} ${CORTEX.y + CORTEX.h} L${STRIATUM.x + 100} ${STRIATUM.y}`} stroke={colors.success} strokeWidth={3} />
        <Path d={`M${SN.x + 70} ${SN.y} L${STRIATUM.x + 70} ${STRIATUM.y + STRIATUM.h}`} stroke={colors.error} strokeWidth={width(state.dopamine)} strokeDasharray="6 3" opacity={0.4 + state.dopamine / 170} />
        <Path d={`M${STRIATUM.x + STRIATUM.w} ${STRIATUM.y + 20} L${GP.x} ${GP.y + 20}`} stroke={colors.error} strokeWidth={width(state.striatalActivity * 0.8)} />
        <Path d={`M${STN.x + STN.w} ${STN.y + 6} L${GP.x + 20} ${GP.y + GP.h}`} stroke={colors.success} strokeWidth={width(state.stn * 0.8)} opacity={0.4 + state.stn / 170} />
        <Path d={`M${GP.x + 70} ${GP.y + GP.h} L${THALAMUS.x + 70} ${THALAMUS.y}`} stroke={brakeColor} strokeWidth={width(state.brake)} />
        <Path d={`M${THALAMUS.x + THALAMUS.w} ${THALAMUS.y + 17} Q${W - 2} 90 ${CORTEX.x + CORTEX.w} ${CORTEX.y + 17}`} stroke={colors.success} strokeWidth={3} fill="none" />
        <SvgText x={GP.x + 62} y={136} fontSize={11} fontWeight="900" fill={brakeColor} textAnchor="end">
          {`Brake ${Math.round(state.brake)}%`}
        </SvgText>
        <SvgText x={SN.x + 76} y={140} fontSize={10} fontWeight="800" fill={colors.textTertiary}>
          dopamine
        </SvgText>
        <SvgText x={(STRIATUM.x + STRIATUM.w + GP.x) / 2} y={STRIATUM.y + 14} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="middle">
          GABA
        </SvgText>
        <SvgText x={CORTEX.x - 8} y={CORTEX.y + 50} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="end">
          ACh
        </SvgText>

        {box(CORTEX, colors.surfaceMuted)}
        {box(STRIATUM, state.striatalActivity > 115 ? colors.errorSubtle : state.striatum < 80 ? colors.warningSubtle : colors.surfaceMuted)}
        {box(GP, colors.surfaceMuted)}
        {box(THALAMUS, colors.surfaceMuted)}
        {box(SN, state.dopamine < 80 ? colors.warningSubtle : colors.surfaceMuted)}
        {box(STN, state.stn < 80 ? colors.warningSubtle : colors.surfaceMuted)}

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
          { label: 'Excites', color: colors.success },
          { label: 'Inhibits', color: colors.error },
          { label: 'Hand position', color: colors.primary },
          ...(changed ? [{ label: 'Before', color: colors.textTertiary, dashed: true }] : []),
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { BaroState } from '@/data/simulations/baroreflex';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, linear, type GraphicProps } from './shared';

const W = 400;
const H = 320;

type Box = { x: number; y: number; w: number; h: number; title: string; value: string };

export function BaroreflexGraphic({ state, time, reduceMotion }: GraphicProps<BaroState>) {
  const colors = useTheme();
  const receptors: Box = { x: 8, y: 188, w: 146, h: 56, title: 'Carotid sinus & arch', value: `firing ${Math.round(state.baroFiring)}%` };
  const medulla: Box = { x: 96, y: 14, w: 150, h: 56, title: 'Medulla (NTS · VMC)', value: state.reflexIntact ? 'receiving' : 'no signal' };
  const heart: Box = { x: 284, y: 104, w: 108, h: 56, title: 'Heart (SA node)', value: `${Math.round(state.hr)} /min` };
  const vessels: Box = { x: 262, y: 188, w: 130, h: 56, title: 'Arterioles', value: `resistance ${Math.round(state.readouts.tpr)}%` };

  const box = (b: Box) => (
    <G key={b.title}>
      <Rect x={b.x} y={b.y} width={b.w} height={b.h} rx={12} fill={colors.surfaceMuted} stroke={colors.borderStrong} />
      <SvgText x={b.x + b.w / 2} y={b.y + 22} fontSize={13} fontWeight="800" fill={colors.text} textAnchor="middle">
        {b.title}
      </SvgText>
      <SvgText x={b.x + b.w / 2} y={b.y + 42} fontSize={13} fontWeight="700" fill={colors.primaryText} textAnchor="middle">
        {b.value}
      </SvgText>
    </G>
  );

  // A nerve: thicker and with faster pulses the more it fires.
  const nerve = (from: [number, number], to: [number, number], activity: number, label: string, color: string, at: [number, number], cut = false) => {
    const width = 1.5 + Math.min(7, activity / 25);
    const pulses = cut || reduceMotion ? [] : [0, 1, 2].map((k) => ((time * (0.3 + activity / 80) + k / 3) % 1));
    const mx = (from[0] + to[0]) / 2;
    const my = (from[1] + to[1]) / 2;
    return (
      <G key={label}>
        <Line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={cut ? '6 6' : undefined} opacity={cut ? 0.5 : 0.9} />
        {pulses.map((p, i) => (
          <Circle key={i} cx={from[0] + (to[0] - from[0]) * p} cy={from[1] + (to[1] - from[1]) * p} r={3.5} fill={colors.surface} stroke={color} strokeWidth={2} />
        ))}
        {cut ? (
          <Path d={`M${mx - 9} ${my - 9} L${mx + 9} ${my + 9} M${mx + 9} ${my - 9} L${mx - 9} ${my + 9}`} stroke={colors.error} strokeWidth={4} strokeLinecap="round" />
        ) : null}
        <Rect x={at[0] - 50} y={at[1] - 13} width={100} height={18} rx={9} fill={colors.surface} opacity={0.92} />
        <SvgText x={at[0]} y={at[1]} fontSize={12} fontWeight="800" fill={color} textAnchor="middle">
          {`${label} ${Math.round(activity)}%`}
        </SvgText>
      </G>
    );
  };

  const gauge = linear([40, 140], [24, 376]);
  const gy = 292;
  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Baroreceptor reflex. Mean BP ${Math.round(state.map)} mmHg, heart rate ${Math.round(state.hr)} per minute.`}>
        {nerve([receptors.x + 60, receptors.y], [medulla.x + 40, medulla.y + medulla.h], state.baroFiring, 'IX & X', colors.textSecondary, [56, 130], !state.reflexIntact)}
        {nerve([medulla.x + medulla.w, medulla.y + 34], [heart.x + 50, heart.y], state.vagal, 'Vagus', colors.primary, [340, 46])}
        {nerve([medulla.x + medulla.w - 40, medulla.y + medulla.h], [vessels.x + 24, vessels.y], state.sympathetic, 'Sympathetic', colors.warning, [196, 160])}
        {box(receptors)}
        {box(medulla)}
        {box(heart)}
        {box(vessels)}
        <Rect x={gauge(85)} y={gy - 8} width={gauge(100) - gauge(85)} height={16} rx={4} fill={colors.successSubtle} />
        <Line x1={gauge(40)} x2={gauge(140)} y1={gy} y2={gy} stroke={colors.borderStrong} strokeWidth={2} />
        {[40, 60, 80, 100, 120, 140].map((tick) => (
          <SvgText key={tick} x={gauge(tick)} y={gy + 20} fontSize={10} fontWeight="700" fill={colors.textTertiary} textAnchor="middle">
            {String(tick)}
          </SvgText>
        ))}
        {Math.abs(state.openLoopMap - state.map) > 1 ? (
          <G>
            <Circle cx={gauge(Math.max(40, Math.min(140, state.openLoopMap)))} cy={gy} r={6} fill="none" stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="2 2" />
          </G>
        ) : null}
        <Circle cx={gauge(Math.max(40, Math.min(140, state.map)))} cy={gy} r={7} fill={colors.accent} stroke={colors.surface} strokeWidth={2} />
        <SvgText x={24} y={gy - 14} fontSize={11} fontWeight="800" fill={colors.textSecondary}>
          {`Mean BP ${Math.round(state.map)} mmHg`}
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: 'Afferent (IX, X)', color: colors.textSecondary },
          { label: 'Vagal', color: colors.primary },
          { label: 'Sympathetic', color: colors.warning },
          { label: 'BP without the reflex', color: colors.textTertiary, dashed: true },
        ]}
      />
    </View>
  );
}

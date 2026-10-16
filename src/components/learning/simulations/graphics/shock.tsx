import { View } from 'react-native';
import { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { SHOCK_TYPES, type ShockState } from '@/data/simulations/shock';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, linear, type GraphicProps } from './shared';

const W = 400;
const H = 290;
const TOP = 44;
const BOTTOM = 220;

type Gauge = { x: number; label: string; unit: string; min: number; max: number; normal: [number, number]; value: number; before: number };

export function ShockGraphic({ state, baseline, time, reduceMotion }: GraphicProps<ShockState>) {
  const colors = useTheme();
  const gauges: Gauge[] = [
    { x: 46, label: 'Mean BP', unit: 'mmHg', min: 30, max: 130, normal: [85, 100], value: state.map, before: baseline.map },
    { x: 136, label: 'Pulse', unit: '/min', min: 40, max: 180, normal: [60, 100], value: state.hr, before: baseline.hr },
    { x: 226, label: 'JVP', unit: 'mmHg', min: 0, max: 25, normal: [4, 6], value: state.cvp, before: baseline.cvp },
  ];
  const beatPhase = reduceMotion ? 0 : ((time * 4 * state.hr) / 60) % 1; // the clock runs 4× slow; show the real rate
  const pulse = 1 + 0.25 * Math.max(0, Math.sin(beatPhase * Math.PI * 2)) ** 8;
  const skinFill = state.skin === 1 ? colors.surfaceMuted : state.skin === 2 ? colors.errorSubtle : colors.warningSubtle;
  const skinText = ['Normal', 'Pale, cool', 'Vasodilated'][state.skin];
  const urineH = linear([0, 72], [0, 70])(Math.min(72, state.urine));

  return (
    <View>
      <Canvas width={W} height={H} label={`${SHOCK_TYPES[state.type]}${state.standing ? ', standing' : ', lying'}. Mean BP ${Math.round(state.map)}, pulse ${Math.round(state.hr)}, JVP ${Math.round(state.cvp)}.`}>
        <SvgText x={14} y={22} fontSize={13} fontWeight="900" fill={colors.text}>
          {`${state.type === 0 ? 'No shock' : `${SHOCK_TYPES[state.type]} shock`} · ${state.standing ? 'standing' : 'lying'}`}
        </SvgText>
        {gauges.map((g) => {
          const y = linear([g.min, g.max], [BOTTOM, TOP]);
          const clampV = (v: number) => Math.max(g.min, Math.min(g.max, v));
          return (
            <G key={g.label}>
              <Rect x={g.x - 14} y={TOP} width={28} height={BOTTOM - TOP} rx={14} fill={colors.track} />
              <Rect x={g.x - 14} y={y(g.normal[1])} width={28} height={Math.max(3, y(g.normal[0]) - y(g.normal[1]))} fill={colors.successSubtle} stroke={colors.successBorder} />
              <Rect x={g.x - 10} y={y(clampV(g.value))} width={20} height={BOTTOM - y(clampV(g.value)) - 4} rx={10} fill={colors.primary} opacity={0.85} />
              <Line x1={g.x - 20} x2={g.x + 20} y1={y(clampV(g.before))} y2={y(clampV(g.before))} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="3 3" />
              <SvgText x={g.x} y={BOTTOM + 18} fontSize={13} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
                {g.label}
              </SvgText>
              <SvgText x={g.x} y={BOTTOM + 34} fontSize={13} fontWeight="900" fill={colors.text} textAnchor="middle">
                {`${Math.round(g.value)} ${g.unit}`}
              </SvgText>
            </G>
          );
        })}
        <Circle cx={136} cy={TOP - 10} r={7 * pulse} fill={colors.error} />
        <Circle cx={330} cy={82} r={26} fill={skinFill} stroke={colors.borderStrong} />
        <SvgText x={330} y={124} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          Skin
        </SvgText>
        <SvgText x={330} y={140} fontSize={12} fontWeight="900" fill={colors.text} textAnchor="middle">
          {skinText}
        </SvgText>
        <Rect x={316} y={160} width={28} height={70} rx={8} fill={colors.track} />
        <Rect x={316} y={230 - urineH} width={28} height={urineH} rx={8} fill={colors.accent} />
        <SvgText x={330} y={246} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          Urine
        </SvgText>
        <SvgText x={330} y={262} fontSize={12} fontWeight="900" fill={colors.text} textAnchor="middle">
          {`${Math.round(state.urine)} mL/h`}
        </SvgText>
        <SvgText x={14} y={H - 4} fontSize={11} fontWeight="700" fill={colors.textTertiary}>
          {`Green band: normal range · dashed line: before · breathing ${Math.round(state.breathing)} /min`}
        </SvgText>
      </Canvas>
    </View>
  );
}

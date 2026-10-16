import { View } from 'react-native';
import { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { LESIONS, REFLEXES, SHOCK_DAYS, TONES, type MotorState } from '@/data/simulations/motor-lesion';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, linear, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const KICK = [0, 10, 22, 42]; // degrees drawn for each reflex grade
const TL = 24;
const TR = W - 24;
const TY = 262;

export function MotorLesionGraphic({ state, time, reduceMotion }: GraphicProps<MotorState>) {
  const colors = useTheme();

  // The neuraxis (left): brain, cord, nerve to the right leg.
  const lesionAt: Record<number, { x: number; y: number }> = {
    1: { x: 62, y: 38 },
    2: { x: 112, y: 210 },
    3: { x: 74, y: 140 },
    4: { x: 80, y: 140 },
  };
  const mark = lesionAt[state.lesion];

  // The right leg (right side of the drawing).
  const hip = { x: 196, y: 70 };
  const knee = { x: 316, y: 110 };
  const a = (KICK[state.reflex] * Math.PI) / 180;
  const foot = { x: knee.x + 90 * Math.sin(a), y: knee.y + 90 * Math.cos(a) };
  const bulk = 6 + (state.bulk / 100) * 14;
  const shaking = state.fibrillation && !reduceMotion ? Math.sin(time * 40) * 1.5 : 0;
  const days = linear([0, 60], [TL, TR]);
  const showShock = state.lesion === 3 || state.lesion === 4;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${LESIONS[state.lesion]}, day ${state.days}. Right leg: strength ${state.strength}%, tone ${TONES[state.tone]}, knee jerk ${REFLEXES[state.reflex]}, bulk ${Math.round(state.bulk)}%.`}>
        {/* Neuraxis */}
        <Ellipse cx={70} cy={40} rx={44} ry={28} fill={colors.surfaceMuted} stroke={colors.borderStrong} />
        <SvgText x={70} y={44} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="middle">
          Brain
        </SvgText>
        <Rect x={64} y={68} width={20} height={130} rx={10} fill={colors.surfaceMuted} stroke={colors.borderStrong} />
        <SvgText x={92} y={144} fontSize={10} fontWeight="800" fill={colors.textTertiary}>
          T10
        </SvgText>
        <Path d={`M84 186 Q110 196 ${hip.x - 10} ${hip.y + 10}`} stroke={colors.success} strokeWidth={3} fill="none" opacity={state.lesion === 2 ? 0.3 : 0.9} />
        <Path d="M62 40 L62 60 L80 70 L80 186" stroke={colors.success} strokeWidth={2} strokeDasharray="5 4" fill="none" opacity={state.lesion === 0 ? 0.9 : 0.4} />
        <SvgText x={14} y={240} fontSize={10} fontWeight="700" fill={colors.textTertiary}>
          Upper (dashed) and lower motor neuron
        </SvgText>
        {mark ? <Path d={`M${mark.x - 8} ${mark.y - 8} L${mark.x + 8} ${mark.y + 8} M${mark.x + 8} ${mark.y - 8} L${mark.x - 8} ${mark.y + 8}`} stroke={colors.error} strokeWidth={4} strokeLinecap="round" /> : null}

        {/* Right leg */}
        <Line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke={colors.textTertiary} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
        <Line x1={knee.x} y1={knee.y} x2={foot.x} y2={foot.y} stroke={colors.textTertiary} strokeWidth={9} strokeLinecap="round" opacity={0.45} />
        <Path d={`M${hip.x + 10} ${hip.y - 6 + shaking} Q${(hip.x + knee.x) / 2} ${hip.y + 2 - bulk * 1.6 + shaking} ${knee.x - 12} ${knee.y - 8}`} stroke={state.tone === 2 ? colors.warning : colors.primary} strokeWidth={bulk} strokeLinecap="round" fill="none" opacity={0.8} />
        <SvgText x={hip.x} y={hip.y - 34} fontSize={11} fontWeight="800" fill={colors.textSecondary}>
          Right quadriceps
        </SvgText>
        {state.fibrillation ? (
          <SvgText x={(hip.x + knee.x) / 2} y={hip.y - 34} fontSize={10} fontWeight="900" fill={colors.error}>
            fibrillation
          </SvgText>
        ) : null}
        <Circle cx={knee.x} cy={knee.y} r={5} fill={colors.text} />

        {/* Findings */}
        {[
          ['Strength', `${state.strength}%`],
          ['Tone', TONES[state.tone]],
          ['Knee jerk', REFLEXES[state.reflex]],
          ['Bulk', `${Math.round(state.bulk)}%`],
        ].map(([label, value], i) => (
          <G key={label}>
            <SvgText x={230} y={160 + i * 17} fontSize={11} fontWeight="800" fill={colors.textTertiary}>
              {label}
            </SvgText>
            <SvgText x={300} y={160 + i * 17} fontSize={12} fontWeight="900" fill={colors.text}>
              {value}
            </SvgText>
          </G>
        ))}

        {/* Timeline */}
        <Rect x={TL} y={TY - 6} width={TR - TL} height={12} rx={6} fill={colors.track} />
        {showShock ? <Rect x={TL} y={TY - 6} width={days(SHOCK_DAYS) - TL} height={12} rx={6} fill={colors.warningSubtle} stroke={colors.warning} /> : null}
        {showShock ? (
          <SvgText x={TL + 2} y={TY - 12} fontSize={10} fontWeight="800" fill={colors.warningText}>
            Spinal shock (~2 weeks)
          </SvgText>
        ) : null}
        <Circle cx={days(state.days)} cy={TY} r={8} fill={colors.accent} stroke={colors.surface} strokeWidth={2.5} />
        {[0, 14, 30, 45, 60].map((d) => (
          <SvgText key={d} x={days(d)} y={TY + 24} fontSize={10} fontWeight="700" fill={colors.textTertiary} textAnchor="middle">
            {`${d} d`}
          </SvgText>
        ))}
      </Canvas>
    </View>
  );
}

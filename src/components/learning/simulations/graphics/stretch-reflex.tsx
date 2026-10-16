import { View } from 'react-native';
import { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { GRADES, type ReflexState } from '@/data/simulations/stretch-reflex';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 320;

// Fixed points of the drawing.
const HIP = { x: 40, y: 190 };
const KNEE = { x: 210, y: 200 };
const SHANK = 96;
const SPINDLE = { x: 120, y: 178 };
const TENDON = { x: 196, y: 190 };
const HAM = { x: 120, y: 214 };
const CORD = { x: 246, y: 18, w: 140, h: 112 };
const DORSAL = { x: 296, y: 42 };
const ALPHA = { x: 300, y: 100 };
const INHIB_HAM = { x: 352, y: 92 };
const INHIB_GTO = { x: 350, y: 52 };

const width = (rate: number) => 1.5 + Math.min(6, rate / 18);

function Cut({ x, y, color }: { x: number; y: number; color: string }) {
  return <Path d={`M${x - 8} ${y - 8} L${x + 8} ${y + 8} M${x + 8} ${y - 8} L${x - 8} ${y + 8}`} stroke={color} strokeWidth={4} strokeLinecap="round" />;
}

export function StretchReflexGraphic({ state, baseline }: GraphicProps<ReflexState>) {
  const colors = useTheme();
  const shankEnd = (kick: number) => {
    const a = (kick * Math.PI) / 180;
    return { x: KNEE.x + SHANK * Math.sin(a), y: KNEE.y + SHANK * Math.cos(a) };
  };
  const foot = shankEnd(state.kick);
  const ghost = shankEnd(baseline.kick);
  const cutDorsal = state.lesion === 1;
  const cutVentral = state.lesion === 2;
  const gtoOn = state.ipsp > 0;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Knee jerk ${Math.round(state.kick)} degrees (${GRADES[state.readouts.grade]}). Spindle firing ${Math.round(state.ia)}, α-motor neuron ${Math.round(state.alpha)} per second.`}>
        {/* Spinal cord */}
        <Rect x={CORD.x} y={CORD.y} width={CORD.w} height={CORD.h} rx={40} fill={colors.surfaceMuted} stroke={colors.borderStrong} />
        <Ellipse cx={DORSAL.x + 6} cy={DORSAL.y + 6} rx={26} ry={16} fill={colors.surface} stroke={colors.border} />
        <Ellipse cx={ALPHA.x + 4} cy={ALPHA.y} rx={30} ry={18} fill={colors.surface} stroke={colors.border} />
        <SvgText x={CORD.x + CORD.w / 2} y={CORD.y - 4} fontSize={11} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          Spinal cord
        </SvgText>
        <SvgText x={CORD.x + CORD.w - 8} y={CORD.y + 18} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="end">
          Dorsal horn
        </SvgText>
        <SvgText x={CORD.x + CORD.w - 8} y={CORD.y + CORD.h - 8} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="end">
          Ventral horn
        </SvgText>

        {/* Leg */}
        <Line x1={HIP.x} y1={HIP.y} x2={KNEE.x} y2={KNEE.y} stroke={colors.textTertiary} strokeWidth={14} strokeLinecap="round" opacity={0.35} />
        <Line x1={KNEE.x} y1={KNEE.y} x2={ghost.x} y2={ghost.y} stroke={colors.textTertiary} strokeWidth={12} strokeLinecap="round" opacity={0.2} />
        <Line x1={KNEE.x} y1={KNEE.y} x2={foot.x} y2={foot.y} stroke={colors.textTertiary} strokeWidth={12} strokeLinecap="round" opacity={0.45} />
        <Path d={`M${HIP.x + 16} ${HIP.y - 12} Q${(HIP.x + KNEE.x) / 2} ${HIP.y - 34 - state.alpha / 12} ${TENDON.x} ${TENDON.y - 4}`} stroke={colors.primary} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.75} />
        <Path d={`M${HIP.x + 16} ${HIP.y + 14} Q${(HIP.x + KNEE.x) / 2} ${HIP.y + 34} ${KNEE.x - 12} ${KNEE.y + 14}`} stroke={colors.accent} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.25 + state.hamstrings / 50} />
        <Ellipse cx={SPINDLE.x} cy={SPINDLE.y} rx={24} ry={6} fill={colors.surface} stroke={colors.text} strokeWidth={1.5} />
        <Rect x={TENDON.x - 6} y={TENDON.y - 7} width={12} height={10} rx={3} fill={gtoOn ? colors.error : colors.surface} stroke={colors.text} strokeWidth={1.5} />
        {state.tap > 0 ? (
          <G>
            <Rect x={KNEE.x + 10} y={KNEE.y + 6} width={30} height={9} rx={3} fill={colors.textSecondary} />
            <Line x1={KNEE.x + 40} y1={KNEE.y + 10} x2={KNEE.x + 70} y2={KNEE.y + 30} stroke={colors.textSecondary} strokeWidth={4} strokeLinecap="round" />
          </G>
        ) : null}
        <SvgText x={HIP.x} y={HIP.y - 44} fontSize={11} fontWeight="800" fill={colors.primaryText}>
          Quadriceps
        </SvgText>
        <SvgText x={HIP.x} y={HIP.y + 54} fontSize={11} fontWeight="800" fill={colors.accentText}>
          Hamstrings
        </SvgText>
        <SvgText x={SPINDLE.x} y={SPINDLE.y + 3} fontSize={8} fontWeight="900" fill={colors.text} textAnchor="middle">
          spindle
        </SvgText>

        {/* Ia afferent: spindle → dorsal root → α-motor neuron */}
        <Path d={`M${SPINDLE.x} ${SPINDLE.y - 4} Q${SPINDLE.x + 40} ${60} ${DORSAL.x} ${DORSAL.y}`} stroke={colors.primary} strokeWidth={width(state.ia)} fill="none" strokeLinecap="round" />
        <Path d={`M${DORSAL.x} ${DORSAL.y} L${ALPHA.x} ${ALPHA.y}`} stroke={colors.primary} strokeWidth={width(state.iaCord)} strokeLinecap="round" opacity={cutDorsal ? 0.25 : 1} />
        {/* Ia branch to the inhibitory interneuron for the hamstrings */}
        <Path d={`M${DORSAL.x} ${DORSAL.y + 10} Q${INHIB_HAM.x - 10} ${DORSAL.y + 20} ${INHIB_HAM.x} ${INHIB_HAM.y}`} stroke={colors.primary} strokeWidth={1.5} fill="none" opacity={cutDorsal ? 0.25 : 0.8} />
        {/* α efferent: ventral root → quadriceps */}
        <Path d={`M${ALPHA.x} ${ALPHA.y} Q${230} ${150} ${150} ${168}`} stroke={colors.success} strokeWidth={width(state.alpha)} fill="none" strokeLinecap="round" opacity={cutVentral ? 0.35 : 1} />
        {/* γ efferent → spindle */}
        <Path d={`M${ALPHA.x - 12} ${ALPHA.y + 6} Q${200} ${165} ${SPINDLE.x + 18} ${SPINDLE.y}`} stroke={colors.warning} strokeWidth={1 + state.gamma / 30} strokeDasharray="5 4" fill="none" />
        {/* Golgi tendon organ → inhibitory interneuron → α */}
        <Path d={`M${TENDON.x} ${TENDON.y - 7} Q${260} ${120} ${INHIB_GTO.x} ${INHIB_GTO.y}`} stroke={colors.error} strokeWidth={width(state.gto)} fill="none" opacity={0.85} />
        <Path d={`M${INHIB_GTO.x} ${INHIB_GTO.y} L${ALPHA.x + 8} ${ALPHA.y - 6}`} stroke={colors.error} strokeWidth={width(state.ipsp)} opacity={gtoOn ? 1 : 0.3} />
        {/* inhibitory interneuron → hamstrings */}
        <Path d={`M${INHIB_HAM.x} ${INHIB_HAM.y} Q${396} ${270} ${HAM.x + 40} ${HAM.y + 10}`} stroke={colors.accent} strokeWidth={1.5} strokeDasharray="2 3" fill="none" />

        <Circle cx={ALPHA.x} cy={ALPHA.y} r={9} fill={colors.success} stroke={colors.surface} strokeWidth={2} />
        <Circle cx={INHIB_GTO.x} cy={INHIB_GTO.y} r={6} fill={colors.error} stroke={colors.surface} strokeWidth={2} />
        <Circle cx={INHIB_HAM.x} cy={INHIB_HAM.y} r={6} fill={colors.accent} stroke={colors.surface} strokeWidth={2} />
        <SvgText x={ALPHA.x} y={ALPHA.y + 4} fontSize={10} fontWeight="900" fill={colors.onPrimary} textAnchor="middle">
          α
        </SvgText>

        {cutDorsal ? <Cut x={262} y={52} color={colors.error} /> : null}
        {cutVentral ? <Cut x={262} y={128} color={colors.error} /> : null}

        <SvgText x={W - 8} y={H - 40} fontSize={13} fontWeight="900" fill={colors.text} textAnchor="end">
          {`Knee jerk: ${GRADES[state.readouts.grade]}`}
        </SvgText>
        <SvgText x={W - 8} y={H - 22} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="end">
          {`${Math.round(state.kick)}° kick · γ ${Math.round(state.gamma)}%`}
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: 'Ia afferent', color: colors.primary },
          { label: 'α-motor neuron', color: colors.success },
          { label: 'γ-efferent', color: colors.warning, dashed: true },
          { label: 'Tendon organ (inhibits)', color: colors.error },
          { label: 'Reciprocal inhibition', color: colors.accent, dashed: true },
        ]}
      />
    </View>
  );
}

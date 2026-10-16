import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { LESIONS, type TractState } from '@/data/simulations/sensory-tracts';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 350;
const MID = 200;
const THAL_Y = 52;
const MEDULLA_Y = 104;
const CORD_TOP = 128;
const CORD_BOTTOM = 252;
const LEVEL_Y = 176; // T10
const ENTRY_Y = 236; // where the leg's fibres enter
const CROSS_Y = 224; // where spinothalamic fibres cross
const LEG_Y = 284;

// Column positions (x) on each side of the cord.
const DC = { L: 182, R: 218 };
const ST = { L: 132, R: 268 };
const CS = { L: 156, R: 244 };
const THAL = { L: 152, R: 248 };

export function SensoryTractsGraphic({ state }: GraphicProps<TractState>) {
  const colors = useTheme();
  const cut = state.cut;
  const fade = (ok: number) => (ok ? 1 : 0.18);

  // A leg's dorsal column: up its own side, cross in the medulla, to the opposite thalamus.
  const dcPath = (leg: 'L' | 'R') => {
    const own = DC[leg];
    const other = leg === 'L' ? 'R' : 'L';
    const legX = leg === 'L' ? 112 : 288;
    return `M${legX} ${LEG_Y - 10} L${own} ${ENTRY_Y} L${own} ${MEDULLA_Y + 6} L${DC[other]} ${MEDULLA_Y - 8} L${THAL[other]} ${THAL_Y + 8}`;
  };
  // A leg's spinothalamic fibres: enter, cross in the cord, up the opposite side.
  const stPath = (leg: 'L' | 'R') => {
    const other = leg === 'L' ? 'R' : 'L';
    const legX = leg === 'L' ? 104 : 296;
    const entry = leg === 'L' ? ST.L + 10 : ST.R - 10;
    return `M${legX} ${LEG_Y - 10} L${entry} ${ENTRY_Y + 6} L${ST[other]} ${CROSS_Y} L${ST[other]} ${MEDULLA_Y} L${THAL[other]} ${THAL_Y + 8}`;
  };
  // Corticospinal: from the opposite cortex, cross at the pyramids, down the leg's own side.
  const csPath = (leg: 'L' | 'R') => {
    const other = leg === 'L' ? 'R' : 'L';
    const legX = leg === 'L' ? 120 : 280;
    return `M${THAL[other] + (other === 'L' ? -26 : 26)} 22 L${CS[other]} ${MEDULLA_Y - 12} L${CS[leg]} ${MEDULLA_Y + 12} L${CS[leg]} ${CORD_BOTTOM - 6} L${legX} ${LEG_Y - 10}`;
  };

  const lesionBoxes: { x: number; w: number }[] = [];
  if (cut.dcR) lesionBoxes.push({ x: DC.R - 9, w: 18 });
  if (cut.dcL) lesionBoxes.push({ x: DC.L - 9, w: 18 });
  if (cut.stR) lesionBoxes.push({ x: ST.R - 9, w: 18 });
  if (cut.stL) lesionBoxes.push({ x: ST.L - 9, w: 18 });
  if (cut.csR) lesionBoxes.push({ x: CS.R - 9, w: 18 });
  if (cut.csL) lesionBoxes.push({ x: CS.L - 9, w: 18 });

  const leg = (side: 'L' | 'R') => {
    const x = side === 'L' ? 16 : 210;
    const touch = side === 'L' ? state.touchL : state.touchR;
    const pain = side === 'L' ? state.painL : state.painR;
    const move = side === 'L' ? state.moveL : state.moveR;
    const row = (label: string, ok: number, y: number) => (
      <SvgText x={x + 10} y={y} fontSize={11} fontWeight="800" fill={ok ? colors.textSecondary : colors.error}>
        {`${label}: ${ok ? 'normal' : 'lost'}`}
      </SvgText>
    );
    return (
      <G key={side}>
        <Rect x={x} y={LEG_Y - 4} width={174} height={62} rx={10} fill={colors.surfaceMuted} stroke={colors.border} />
        <SvgText x={x + 10} y={LEG_Y + 12} fontSize={12} fontWeight="900" fill={colors.text}>
          {side === 'L' ? 'Left leg' : 'Right leg'}
        </SvgText>
        {row('Vibration, position', touch, LEG_Y + 28)}
        {row('Pain, temperature', pain, LEG_Y + 42)}
        {row('Movement', move, LEG_Y + 56)}
      </G>
    );
  };

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${LESIONS[state.lesion]}. ${state.readouts.lost} of 6 leg functions lost.`}>
        {/* Brain and thalami */}
        <Rect x={92} y={8} width={216} height={24} rx={12} fill={colors.surfaceMuted} />
        <SvgText x={MID} y={25} fontSize={11} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          Cortex
        </SvgText>
        {(['L', 'R'] as const).map((side) => (
          <G key={side}>
            <Circle cx={THAL[side]} cy={THAL_Y} r={13} fill={side === 'R' && cut.thalR ? colors.errorSubtle : colors.surface} stroke={side === 'R' && cut.thalR ? colors.error : colors.borderStrong} strokeWidth={2} />
            <SvgText x={THAL[side] + (side === 'L' ? -18 : 18)} y={THAL_Y + 4} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor={side === 'L' ? 'end' : 'start'}>
              {side === 'L' ? 'Left thalamus' : 'Right thalamus'}
            </SvgText>
          </G>
        ))}
        <Line x1={96} x2={304} y1={MEDULLA_Y} y2={MEDULLA_Y} stroke={colors.border} strokeWidth={1} strokeDasharray="3 3" />
        <SvgText x={W - 6} y={MEDULLA_Y + 4} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="end">
          Medulla
        </SvgText>

        {/* Cord */}
        <Rect x={112} y={CORD_TOP} width={176} height={CORD_BOTTOM - CORD_TOP} rx={30} fill={colors.surfaceMuted} stroke={colors.borderStrong} />
        <Line x1={MID} x2={MID} y1={CORD_TOP + 4} y2={CORD_BOTTOM - 4} stroke={colors.border} strokeWidth={1} />
        <SvgText x={W - 6} y={LEVEL_Y + 4} fontSize={10} fontWeight="800" fill={colors.textTertiary} textAnchor="end">
          T10
        </SvgText>
        <SvgText x={6} y={CROSS_Y + 4} fontSize={10} fontWeight="800" fill={colors.textTertiary}>
          Cord
        </SvgText>
        {lesionBoxes.map((box, i) => (
          <Rect key={i} x={box.x} y={LEVEL_Y - 12} width={box.w} height={24} rx={4} fill={colors.errorSubtle} stroke={colors.error} strokeWidth={2} />
        ))}

        {/* Pathways */}
        {(['L', 'R'] as const).map((side) => (
          <G key={`p${side}`}>
            <Path d={csPath(side)} stroke={colors.success} strokeWidth={2.5} strokeDasharray="6 4" fill="none" opacity={fade(side === 'L' ? state.moveL : state.moveR)} />
            <Path d={dcPath(side)} stroke={colors.primary} strokeWidth={3} fill="none" strokeLinejoin="round" opacity={fade(side === 'L' ? state.touchL : state.touchR)} />
            <Path d={stPath(side)} stroke={colors.warning} strokeWidth={3} fill="none" strokeLinejoin="round" opacity={fade(side === 'L' ? state.painL : state.painR)} />
          </G>
        ))}

        {leg('L')}
        {leg('R')}
      </Canvas>
      <Legend
        items={[
          { label: 'Dorsal columns (cross in medulla)', color: colors.primary },
          { label: 'Spinothalamic (cross in cord)', color: colors.warning },
          { label: 'Corticospinal (motor)', color: colors.success, dashed: true },
        ]}
      />
    </View>
  );
}

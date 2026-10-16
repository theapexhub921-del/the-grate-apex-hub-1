import { View } from 'react-native';
import { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { edpvr, type PvState } from '@/data/simulations/pv-loop';
import { useTheme } from '@/hooks/use-theme';

import { along, Axes, BeatBar, Canvas, Legend, linear, locate, pathOf, StatusRow, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 48;
const R = 14;
const T = 34;
const B = 254;

export function PvLoopGraphic({ state, baseline, time, reduceMotion }: GraphicProps<PvState>) {
  const colors = useTheme();
  const x = linear([0, 200], [L, W - R]);
  const y = linear([0, 160], [B, T]);
  const loopPath = (s: PvState) =>
    pathOf(
      s.segments.flatMap((segment) => segment.points.map(([v, p]) => [v, Math.min(160, p)] as [number, number])),
      x,
      y,
      true
    );

  let filling = '';
  for (let v = 10; v <= 200; v += 2) {
    const p = edpvr(v);
    if (p > 160) break;
    filling += `${v === 10 ? 'M' : 'L'}${x(v).toFixed(1)} ${y(p).toFixed(1)} `;
  }
  const vTop = Math.min(200, 10 + 160 / state.ees);

  const { segment, fraction, t } = locate(state.segments, time);
  const [dv, dp] = along(segment.points, fraction);
  const bracketY = T - 14;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Pressure–volume loop. Stroke volume ${Math.round(state.sv)} mL.`}>
        <Axes x={x} y={y} xTicks={[0, 50, 100, 150, 200]} yTicks={[0, 40, 80, 120, 160]} left={L} right={W - R} top={T} bottom={B} xLabel="Left ventricular volume (mL)" yLabel="Pressure (mmHg)" />
        <Path d={filling} stroke={colors.borderStrong} strokeWidth={2} fill="none" />
        <Line x1={x(10)} y1={y(0)} x2={x(vTop)} y2={y(state.ees * (vTop - 10))} stroke={colors.accentText} strokeWidth={2} strokeDasharray="2 4" strokeLinecap="round" />
        <Path d={loopPath(baseline)} stroke={colors.textTertiary} strokeWidth={1.8} strokeDasharray="5 4" fill="none" />
        <Path d={loopPath(state)} stroke={colors.primary} strokeWidth={3} fill={colors.primarySubtle} fillOpacity={0.7} strokeLinejoin="round" />
        {state.opened ? (
          <>
            <Line x1={x(state.esv)} x2={x(state.esv)} y1={bracketY} y2={y(state.pes)} stroke={colors.primaryText} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
            <Line x1={x(state.edv)} x2={x(state.edv)} y1={bracketY} y2={y(state.diastolic)} stroke={colors.primaryText} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
            <Path d={`M${x(state.esv)} ${bracketY + 5}V${bracketY}H${x(state.edv)}V${bracketY + 5}`} stroke={colors.primaryText} strokeWidth={2} fill="none" />
            <Rect x={(x(state.esv) + x(state.edv)) / 2 - 42} y={bracketY - 12} width={84} height={18} rx={9} fill={colors.surface} />
            <SvgText x={(x(state.esv) + x(state.edv)) / 2} y={bracketY + 2} fontSize={13} fontWeight="900" fill={colors.primaryText} textAnchor="middle">
              {`SV ${Math.round(state.sv)} mL`}
            </SvgText>
          </>
        ) : null}
        {!reduceMotion ? <Circle cx={x(dv)} cy={y(Math.min(160, dp))} r={7} fill={colors.accent} stroke={colors.surface} strokeWidth={2.5} /> : null}
      </Canvas>
      <Legend
        items={[
          { label: 'This beat', color: colors.primary },
          { label: 'Before', color: colors.textTertiary, dashed: true },
          { label: 'Contractility line', color: colors.accentText, dashed: true },
          { label: 'Filling curve', color: colors.borderStrong },
        ]}
      />
      {!reduceMotion ? (
        <StatusRow
          title={segment.phase}
          chips={[
            { label: `Mitral ${segment.mitral ? 'open' : 'shut'}`, on: segment.mitral },
            { label: `Aortic ${segment.aortic ? 'open' : 'shut'}`, on: segment.aortic },
          ]}
        />
      ) : null}
      <BeatBar systole={state.systole} diastole={state.diastole} cursor={reduceMotion ? undefined : timeInBeat(t, state)} />
    </View>
  );
}

// The loop starts at isovolumetric contraction; the bar starts at systole too.
function timeInBeat(t: number, state: PvState) {
  return Math.min(state.beat, t);
}

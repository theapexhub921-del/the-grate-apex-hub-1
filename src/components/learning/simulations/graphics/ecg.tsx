import { View } from 'react-native';
import { G, Line, Path, Text as SvgText } from 'react-native-svg';

import { STRIP_SECONDS, type EcgState } from '@/data/simulations/ecg';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { heartFrame, rounded } from '../organ-frames';

import { Canvas, Legend, type GraphicProps } from './shared';

const MM = 2.5; // px per millimetre of ECG paper
const LEFT = 12;
const WIDTH = STRIP_SECONDS * 25 * MM; // 25 mm/s
const W = LEFT * 2 + WIDTH;
const TOP = 46;
const MM_TALL = 24; // −0.7 … +1.7 mV
const BASE = TOP + 17 * MM; // 0 mV line
const H = TOP + MM_TALL * MM + 40;

const xAt = (seconds: number) => LEFT + seconds * 25 * MM;
const yAt = (mv: number) => BASE - mv * 10 * MM;

export function EcgGraphic({ state, time, reduceMotion }: GraphicProps<EcgState>) {
  const colors = useTheme();
  const smallLines: string[] = [];
  const bigLines: string[] = [];
  for (let i = 0; i <= STRIP_SECONDS * 25; i++) {
    const x = LEFT + i * MM;
    (i % 5 === 0 ? bigLines : smallLines).push(`M${x} ${TOP}V${TOP + MM_TALL * MM}`);
  }
  for (let j = 0; j <= MM_TALL; j++) {
    const y = TOP + j * MM;
    (j % 5 === 0 ? bigLines : smallLines).push(`M${LEFT} ${y}H${LEFT + WIDTH}`);
  }
  const trace = state.trace.map(([s, v], i) => `${i === 0 ? 'M' : 'L'}${xAt(s).toFixed(1)} ${yAt(v).toFixed(1)}`).join(' ');

  const conducted = state.beats.filter((b) => b.qrs !== null);
  const first = conducted[0];
  const second = conducted[1];
  const regular = state.readouts.rhythm === 0 || state.readouts.rhythm === 1;
  const caliperY = TOP + MM_TALL * MM + 14;

  // The heart follows the strip as it is drawn: the atria light up with each P wave, the
  // ventricles with each QRS and then squeeze; dropped beats leave the ventricles still.
  const t = reduceMotion ? (first?.qrs ?? 0) + 0.02 : ((time % STRIP_SECONDS) + STRIP_SECONDS) % STRIP_SECONDS;
  const qrsTimes = [...conducted.map((b) => b.qrs as number), ...state.escape].sort((a, b) => a - b);
  const lastQrs = qrsTimes.filter((q) => q <= t).pop();
  const since = lastQrs === undefined ? 9 : t - lastQrs;
  const atrial = state.beats.some((b) => t >= b.p && t < b.p + 0.1);
  const frame = heartFrame({
    lv: rounded(since < 0.3 ? 1 - since / 0.3 : Math.min(1, (since - 0.3) / 0.35)),
    la: atrial ? 0 : 1,
    pressure: since < 0.3 ? 0.7 : 0,
    atria: atrial ? 1 : 0,
    ventricles: since < 0.12 ? 1 : 0,
  });

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="heart" frame={frame} label="The heart, lit by each wave of the ECG as it passes" />
      <Canvas width={W} height={H} label={`ECG strip, ${STRIP_SECONDS} seconds. Heart rate ${Math.round(state.readouts.ventricularRate)} per minute.`}>
        <Path d={smallLines.join(' ')} stroke={colors.error} strokeOpacity={0.14} strokeWidth={0.6} />
        <Path d={bigLines.join(' ')} stroke={colors.error} strokeOpacity={0.35} strokeWidth={1} />
        <Path d={trace} stroke={colors.text} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
        <Line x1={xAt(t)} x2={xAt(t)} y1={TOP} y2={TOP + MM_TALL * MM} stroke={colors.accent} strokeWidth={2} opacity={0.8} />
        {first ? (
          <G>
            <SvgText x={xAt(first.p + 0.045)} y={yAt(0.15) - 6} fontSize={11} fontWeight="900" fill={colors.primaryText} textAnchor="middle">
              P
            </SvgText>
            <SvgText x={xAt((first.qrs as number) + 0.035)} y={yAt(1.2) - 6} fontSize={11} fontWeight="900" fill={colors.primaryText} textAnchor="middle">
              QRS
            </SvgText>
            <SvgText x={xAt((first.qrs as number) + 0.28)} y={yAt(0.3) - 8} fontSize={11} fontWeight="900" fill={colors.primaryText} textAnchor="middle">
              T
            </SvgText>
            <Path d={`M${xAt(first.p)} ${TOP - 22}V${TOP - 16}H${xAt(first.qrs as number)}V${TOP - 22}`} stroke={colors.primary} strokeWidth={1.5} fill="none" />
            <SvgText x={(xAt(first.p) + xAt(first.qrs as number)) / 2} y={TOP - 26} fontSize={11} fontWeight="800" fill={colors.primaryText} textAnchor="middle">
              {`PR ${Math.round((first.pr ?? 0) * 1000)} ms`}
            </SvgText>
          </G>
        ) : null}
        {state.beats
          .filter((b) => b.qrs === null)
          .map((b) => (
            <SvgText key={`d${b.p}`} x={xAt(b.p + 0.045)} y={yAt(0.15) - 6} fontSize={11} fontWeight="900" fill={colors.warningText} textAnchor="middle">
              P
            </SvgText>
          ))}
        {regular && first && second ? (
          <G>
            <Line x1={xAt((first.qrs as number) + 0.035)} x2={xAt((second.qrs as number) + 0.035)} y1={caliperY} y2={caliperY} stroke={colors.accentText} strokeWidth={2} />
            <Line x1={xAt((first.qrs as number) + 0.035)} x2={xAt((first.qrs as number) + 0.035)} y1={caliperY - 5} y2={caliperY + 5} stroke={colors.accentText} strokeWidth={2} />
            <Line x1={xAt((second.qrs as number) + 0.035)} x2={xAt((second.qrs as number) + 0.035)} y1={caliperY - 5} y2={caliperY + 5} stroke={colors.accentText} strokeWidth={2} />
            <SvgText x={xAt((second.qrs as number) + 0.035) + 6} y={caliperY + 4} fontSize={11} fontWeight="800" fill={colors.accentText}>
              {`${state.readouts.squares.toFixed(1)} small squares → ${Math.round(1500 / state.readouts.squares)} /min`}
            </SvgText>
          </G>
        ) : null}
      </Canvas>
      <Legend
        items={[
          { label: 'Small square 0.04 s · large square 0.2 s', color: colors.error },
          ...(state.beats.some((b) => b.qrs === null) ? [{ label: 'P wave with no QRS', color: colors.warningText }] : []),
        ]}
      />
    </View>
  );
}

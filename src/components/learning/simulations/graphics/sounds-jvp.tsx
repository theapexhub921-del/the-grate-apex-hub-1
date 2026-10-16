import { View } from 'react-native';
import { G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { BEAT, TIMES, type MurmurBand, type SoundsState } from '@/data/simulations/sounds-jvp';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 280;
const L = 58;
const R = 12;
const SOUND_MID = 92; // baseline of the phonocardiogram row
const JVP_TOP = 150;
const JVP_BOTTOM = 240;

function murmurPath(band: MurmurBand, x: (t: number) => number) {
  const points: string[] = [];
  const n = 30;
  const height = (s: number) => {
    switch (band.shape) {
      case 'diamond':
        return 26 * (1 - Math.abs(2 * s - 1));
      case 'plateau':
        return 18;
      case 'decrescendo':
        return 26 * (1 - s);
      default:
        return 10 + 6 * Math.sin(s * Math.PI * 6) ** 2;
    }
  };
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const t = band.start + (band.end - band.start) * s;
    points.push(`${i === 0 ? 'M' : 'L'}${x(t).toFixed(1)} ${(SOUND_MID - height(s)).toFixed(1)}`);
  }
  for (let i = n; i >= 0; i--) {
    const s = i / n;
    const t = band.start + (band.end - band.start) * s;
    points.push(`L${x(t).toFixed(1)} ${(SOUND_MID + height(s)).toFixed(1)}`);
  }
  return `${points.join(' ')} Z`;
}

export function SoundsJvpGraphic({ state, time, reduceMotion }: GraphicProps<SoundsState>) {
  const colors = useTheme();
  const x = linear([0, BEAT], [L, W - R]);
  const yJ = linear([0, 20], [JVP_BOTTOM, JVP_TOP]);
  const moment = ((time % BEAT) + BEAT) % BEAT;
  const sound = (t: number, label: string, height = 30) => (
    <G key={label}>
      <Rect x={x(t) - 3} y={SOUND_MID - height} width={6} height={height * 2} rx={3} fill={colors.text} />
      <SvgText x={x(t)} y={SOUND_MID - height - 6} fontSize={12} fontWeight="900" fill={colors.text} textAnchor="middle">
        {label}
      </SvgText>
    </G>
  );
  const split = state.split > 0.02;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label="Heart sounds, murmur and jugular venous pulse over one beat.">
        <Rect x={x(TIMES.s1)} y={6} width={x(TIMES.a2) - x(TIMES.s1)} height={22} rx={4} fill={colors.primary} />
        <SvgText x={(x(TIMES.s1) + x(TIMES.a2)) / 2} y={21} fontSize={11} fontWeight="800" fill={colors.onPrimary} textAnchor="middle">
          Ventricular systole
        </SvgText>
        <Rect x={x(TIMES.a2)} y={6} width={x(BEAT) - x(TIMES.a2)} height={22} rx={4} fill={colors.primarySubtle} />
        <SvgText x={(x(TIMES.a2) + x(BEAT)) / 2} y={21} fontSize={11} fontWeight="800" fill={colors.primaryText} textAnchor="middle">
          Diastole
        </SvgText>
        <SvgText x={8} y={SOUND_MID + 4} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          Sounds
        </SvgText>
        <Line x1={L} x2={W - R} y1={SOUND_MID} y2={SOUND_MID} stroke={colors.border} strokeWidth={1} />
        {state.murmur.map((band, i) => (
          <Path key={i} d={murmurPath(band, x)} fill={colors.warning} opacity={0.75} />
        ))}
        {sound(TIMES.s1, 'S1', 30)}
        {split ? (
          <>
            {sound(TIMES.a2, 'A2', 24)}
            {sound(TIMES.a2 + state.split, 'P2', 18)}
          </>
        ) : (
          sound(TIMES.a2, 'S2', 24)
        )}
        <SvgText x={8} y={(JVP_TOP + JVP_BOTTOM) / 2 + 4} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          JVP
        </SvgText>
        <Line x1={L} x2={W - R} y1={JVP_BOTTOM} y2={JVP_BOTTOM} stroke={colors.border} strokeWidth={1} />
        <Path d={pathOf(state.jvp, x, yJ)} stroke={colors.primary} strokeWidth={3} fill="none" />
        {state.jvpLabels.map((label) => {
          const point = state.jvp.reduce((best, p) => (Math.abs(p[0] - label.t) < Math.abs(best[0] - label.t) ? p : best), state.jvp[0]);
          const down = label.label === 'x' || label.label === 'y';
          return (
            <SvgText key={label.label} x={x(label.t)} y={down ? yJ(point[1]) + 16 : yJ(point[1]) - 8} fontSize={12} fontWeight="900" fill={colors.primaryText} textAnchor="middle">
              {label.label}
            </SvgText>
          );
        })}
        {!reduceMotion ? <Line x1={x(moment)} x2={x(moment)} y1={6} y2={JVP_BOTTOM + 8} stroke={colors.accent} strokeWidth={2.5} /> : null}
        <SvgText x={W - R} y={H - 12} fontSize={11} fontWeight="700" fill={colors.textTertiary} textAnchor="end">
          {`One beat at 70 /min (${BEAT.toFixed(2)} s)`}
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: 'Heart sound', color: colors.text },
          { label: 'Murmur', color: colors.warning },
          { label: 'Jugular venous pulse', color: colors.primary },
        ]}
      />
    </View>
  );
}

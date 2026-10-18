import { View } from 'react-native';
import { Circle, G, Line, Path } from 'react-native-svg';

import { PEOPLE, POSTURES, type SpiroState } from '@/data/simulations/spirometry';
import { useTheme } from '@/hooks/use-theme';

import { Diaphragm, Heart, Lungs } from './anatomy/lungs';
import { Caption, Tag } from './kit';
import { Axes, Canvas, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 232;
const R = 390;
const T = 30;
const B = 250;

// Lung volume over time: three tidal breaths, a maximal breath in, a
// maximal breath out, then back to quiet breathing.
function trace(s: SpiroState): [number, number][] {
  const frc = s.erv + s.rv;
  const pts: [number, number][] = [];
  for (let t = 0; t <= 6; t += 0.1) pts.push([t, frc + (s.tv * (1 - Math.cos((t / 2) * 2 * Math.PI))) / 2]);
  const tlc = frc + s.tv + s.irv;
  pts.push([7, tlc], [8.5, s.rv], [9.5, frc]);
  for (let t = 9.6; t <= 12; t += 0.1) pts.push([t, frc + (s.tv * (1 - Math.cos(((t - 9.5) / 2) * 2 * Math.PI))) / 2]);
  return pts;
}

export function SpirometryGraphic({ state, baseline, time, reduceMotion }: GraphicProps<SpiroState>) {
  const colors = useTheme();
  const x = linear([0, 12], [L, R]);
  const y = linear([0, 7500], [B, T]);
  const changed = baseline.person !== state.person || baseline.posture !== state.posture || baseline.tv !== state.tv;
  // The lungs follow the trace: a dot runs along it and they fill to match.
  const pts = trace(state);
  const tc = reduceMotion ? 7 : (time % 12);
  let vol = pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][0] >= tc) {
      const [t0, v0] = pts[i - 1];
      const [t1, v1] = pts[i];
      vol = v0 + ((v1 - v0) * (tc - t0)) / Math.max(1e-6, t1 - t0);
      break;
    }
  }
  const tlc = state.rv + state.erv + state.tv + state.irv;
  const inflate = -0.45 + 1.7 * ((vol - state.rv) / Math.max(1, 6000 - state.rv));

  return (
    <View>
      <Canvas width={W} height={H} label={`${PEOPLE[state.person]}, ${POSTURES[state.posture].toLowerCase()}: vital capacity ${Math.round(state.readouts.vc)} ml; total lung capacity ${Math.round(tlc)} ml.`}>
        <G transform="translate(0 64) scale(0.72)">
          <Diaphragm inflate={inflate} />
          <Heart />
          <Lungs inflate={inflate} stiff={state.person === 2 ? 1 : 0} />
        </G>
        <Tag x={86} y={36} text={`${Math.round(vol)} ml in the lungs`} />
        <Axes x={x} y={y} xTicks={[0, 4, 8, 12]} yTicks={[0, 2000, 4000, 6000]} left={L} right={R} top={T} bottom={B} xLabel="Time (s)" />
        <Caption x={L} y={T - 6} text="Lung volume (ml)" tone="tertiary" size={10} />
        {changed ? <Path d={pathOf(trace(baseline), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(pts, x, y)} stroke={colors.primary} strokeWidth={2.5} fill="none" />
        <Line x1={L} x2={R} y1={y(state.rv)} y2={y(state.rv)} stroke={colors.textTertiary} strokeDasharray="3 3" />
        <Caption x={L + 4} y={y(state.rv) + 13} text="Residual volume" tone="tertiary" size={10} />
        <Circle cx={x(tc)} cy={y(vol)} r={5} fill={colors.primary} stroke={colors.surface} strokeWidth={2} />
        <Tag x={86} y={288} text={`${PEOPLE[state.person]} · ${POSTURES[state.posture]}`} size={10} tone={state.person >= 2 ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

import { View } from 'react-native';
import { G, Line, Path, Rect } from 'react-native-svg';

import { PEOPLE, POSTURES, type SpiroState } from '@/data/simulations/spirometry';
import { useTheme } from '@/hooks/use-theme';

import { Caption } from './kit';
import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const L = 66;
const R = 300;
const T = 26;
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

export function SpirometryGraphic({ state, baseline }: GraphicProps<SpiroState>) {
  const colors = useTheme();
  const x = linear([0, 12], [L, R]);
  const y = linear([0, 7500], [B, T]);
  const parts = [
    { label: 'RV', value: state.rv, color: colors.textTertiary },
    { label: 'ERV', value: state.erv, color: colors.success },
    { label: 'TV', value: state.tv, color: colors.primary },
    { label: 'IRV', value: state.irv, color: colors.accent },
  ];
  let level = 0;
  const changed = baseline.person !== state.person || baseline.posture !== state.posture || baseline.tv !== state.tv;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${PEOPLE[state.person]}, ${POSTURES[state.posture].toLowerCase()}: vital capacity ${Math.round(state.readouts.vc)} ml.`}>
        <Axes x={x} y={y} xTicks={[0, 4, 8, 12]} yTicks={[0, 2000, 4000, 6000]} left={L} right={R} top={T} bottom={B} xLabel="Time (s)" yLabel="Lung volume (ml)" />
        {changed ? <Path d={pathOf(trace(baseline), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(trace(state), x, y)} stroke={colors.primary} strokeWidth={3} fill="none" />
        <Line x1={L} x2={R} y1={y(state.rv)} y2={y(state.rv)} stroke={colors.textTertiary} strokeDasharray="3 3" />
        <Caption x={L + 4} y={y(state.rv) + 14} text="Residual volume: never breathed out" tone="tertiary" size={10} />
        {/* stacked volumes */}
        <G>
          {parts.map((part) => {
            const top = y(level + part.value);
            const bottom = y(level);
            level += part.value;
            return (
              <G key={part.label}>
                <Rect x={322} y={top} width={34} height={Math.max(1, bottom - top)} fill={part.color} opacity={0.75} stroke={colors.surface} />
                <Caption x={362} y={(top + bottom) / 2 + 4} text={part.label} size={11} />
              </G>
            );
          })}
        </G>
        <Caption x={339} y={T - 8} anchor="middle" text={`VC ${Math.round(state.readouts.vc)}`} tone="primary" />
      </Canvas>
      <Legend
        items={[
          { label: 'Spirometer trace', color: colors.primary },
          ...(changed ? [{ label: 'Before', color: colors.textTertiary, dashed: true }] : []),
        ]}
      />
    </View>
  );
}

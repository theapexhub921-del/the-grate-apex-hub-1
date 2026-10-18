import { View } from 'react-native';
import { Circle, G, Line, Path } from 'react-native-svg';

import { ARTERIAL, CARRIERS, saturationAt, TISSUE, type DissociationState } from '@/data/simulations/o2-dissociation';
import { useTheme } from '@/hooks/use-theme';

import { RedCell } from './anatomy/cells';
import { Caption, Tag } from './kit';
import { Axes, Canvas, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 330;
const L = 50;
const R = 384;
const T = 16;
const B = 176;

function curve(s: DissociationState): [number, number][] {
  const pts: [number, number][] = [];
  for (let p = 0; p <= 150; p += 2) pts.push([p, saturationAt(p, s.p50, s.hill) * s.available * 100]);
  return pts;
}

// The lecture's dissociation curve, with the red cells themselves below:
// leaving the lungs, at the chosen PO₂, and in the tissues — each coloured
// by how much O₂ its haemoglobin holds (cherry red with CO).
export function O2DissociationGraphic({ state, baseline, time, reduceMotion }: GraphicProps<DissociationState>) {
  const colors = useTheme();
  const x = linear([0, 150], [L, R]);
  const y = linear([0, 100], [B, T]);
  const sat = (p: number) => saturationAt(p, state.p50, state.hill) * state.available;
  const changed = Math.abs(baseline.p50 - state.p50) > 0.05 || baseline.available !== state.available;
  const co = 1 - state.available;
  const t = reduceMotion ? 0 : time;
  const groups = [
    { label: `Lungs · ${ARTERIAL}`, p: ARTERIAL, cx: 72 },
    { label: `Now · ${Math.round(state.po2)}`, p: state.po2, cx: 200 },
    { label: `Tissues · ${TISSUE}`, p: TISSUE, cx: 328 },
  ];

  return (
    <View>
      <Canvas width={W} height={H} label={`${CARRIERS[state.carrier]}: P50 ${state.p50.toFixed(1)} mmHg; at PO₂ ${Math.round(state.po2)} mmHg saturation is ${Math.round(state.readouts.sat)}%.`}>
        <Axes x={x} y={y} xTicks={[0, 25, 50, 75, 100, 125, 150]} yTicks={[0, 50, 100]} left={L} right={R} top={T} bottom={B} xLabel="PO₂ (mmHg)" yLabel="Saturation (%)" />
        <Line x1={x(TISSUE)} x2={x(TISSUE)} y1={T} y2={B} stroke={colors.warning} strokeDasharray="4 4" />
        <Line x1={x(ARTERIAL)} x2={x(ARTERIAL)} y1={T} y2={B} stroke={colors.success} strokeDasharray="4 4" />
        {changed ? <Path d={pathOf(curve(baseline), x, y)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={pathOf(curve(state), x, y)} stroke={colors.error} strokeWidth={3} fill="none" />
        <Circle cx={x(state.po2)} cy={y(state.readouts.sat)} r={6} fill={colors.error} stroke={colors.surface} strokeWidth={2} />
        <Caption x={R} y={B - 10} anchor="end" text={`${CARRIERS[state.carrier]} · P50 ${state.p50.toFixed(1)}`} size={11} />

        {groups.map((g, gi) => (
          <G key={g.label}>
            {[0, 1, 2, 3, 4].map((k) => {
              const ang = (k / 5) * Math.PI * 2 + gi + t * 0.4;
              return <RedCell key={k} x={g.cx + Math.cos(ang) * 24 * (k % 2 ? 1 : 0.55)} y={262 + Math.sin(ang) * 16 * (k % 2 ? 1 : 0.55)} r={15} sat={sat(g.p)} co={co} tilt={ang} />;
            })}
            <Tag x={g.cx} y={306} text={g.label} size={10} tone={gi === 1 ? 'primary' : gi === 0 ? 'success' : 'warning'} />
            <Caption x={g.cx} y={326} anchor="middle" text={`${Math.round(sat(g.p) * 100)}% saturated`} tone="tertiary" size={10} />
          </G>
        ))}
      </Canvas>
    </View>
  );
}

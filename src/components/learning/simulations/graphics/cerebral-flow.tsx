import { View } from 'react-native';
import { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

import { autoregulated, co2Factor, PLATEAU_HIGH, PLATEAU_LOW, type CerebralState } from '@/data/simulations/cerebral-flow';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';

import { Axes, Canvas, Legend, linear, pathOf, type GraphicProps } from './shared';

const W = 400;
const H = 290;
const L = 48;
const R = 14;
const T = 40;
const B = 236;

export function CerebralFlowGraphic({ state, baseline }: GraphicProps<CerebralState>) {
  const colors = useTheme();
  const x = linear([0, 200], [L, W - R]);
  const y = linear([0, 200], [B, T]);
  const curve = (factor: number) => {
    const points: [number, number][] = [];
    for (let cpp = 0; cpp <= 200; cpp += 2) points.push([cpp, Math.min(200, autoregulated(cpp) * factor)]);
    return pathOf(points, x, y);
  };
  const point = (s: CerebralState) => [x(Math.max(0, Math.min(200, s.cpp))), y(Math.min(200, s.flow))] as const;
  const [cx, cy] = point(state);
  const [bx, by] = point(baseline);
  const changedCo2 = Math.abs(state.co2 - 40) > 0.5;
  // the brain's arteries glow with the flow through them; a starved brain turns pale and grey
  const flow = Math.max(0, Math.min(1.6, state.flow / 100));
  const frame = {
    glow: { arteries: rounded(0.15 + 0.5 * Math.min(1, flow / 1.4), 0.05) },
    glowColor: { arteries: '#ff6a4a' },
    color: { brain: flow < 0.6 ? '#b9b7c9' : flow > 1.3 ? '#e6a4a0' : '#ddb5b0' },
  };

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="brain-arteries" frame={frame} label={`The brain and its arteries: blood flow ${Math.round(state.flow)}% of normal`} />
      <Canvas width={W} height={H} label={`Cerebral blood flow ${Math.round(state.flow)}% of normal at a perfusion pressure of ${Math.round(state.cpp)} mmHg.`}>
        <Rect x={x(PLATEAU_LOW)} y={T} width={x(PLATEAU_HIGH) - x(PLATEAU_LOW)} height={B - T} fill={colors.successSubtle} opacity={0.6} />
        <SvgText x={(x(PLATEAU_LOW) + x(PLATEAU_HIGH)) / 2} y={T + 16} fontSize={11} fontWeight="800" fill={colors.successText} textAnchor="middle">
          Autoregulation range
        </SvgText>
        <Axes x={x} y={y} xTicks={[0, 50, 100, 150, 200]} yTicks={[0, 50, 100, 150, 200]} left={L} right={W - R} top={T} bottom={B} xLabel="Perfusion pressure = mean BP − ICP (mmHg)" yLabel="Flow (% of normal)" />
        {changedCo2 ? <Path d={curve(1)} stroke={colors.textTertiary} strokeWidth={2} strokeDasharray="5 4" fill="none" /> : null}
        <Path d={curve(co2Factor(state.co2))} stroke={colors.primary} strokeWidth={3} fill="none" />
        {Math.abs(bx - cx) > 1 || Math.abs(by - cy) > 1 ? <Circle cx={bx} cy={by} r={6} fill="none" stroke={colors.textTertiary} strokeWidth={2} /> : null}
        <Circle cx={cx} cy={cy} r={8} fill={colors.accent} stroke={colors.surface} strokeWidth={2.5} />
        {state.cushing ? (
          <>
            <Rect x={L + 8} y={T - 32} width={170} height={22} rx={11} fill={colors.warningSubtle} />
            <SvgText x={L + 93} y={T - 17} fontSize={12} fontWeight="900" fill={colors.warningText} textAnchor="middle">
              Cushing’s reflex active
            </SvgText>
          </>
        ) : null}
        <SvgText x={W - R} y={T - 16} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="end">
          {`ICP ${Math.round(state.icp)} · PCO₂ ${Math.round(state.co2)} mmHg`}
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: `Flow curve at PCO₂ ${Math.round(state.co2)}`, color: colors.primary },
          ...(changedCo2 ? [{ label: 'At PCO₂ 40', color: colors.textTertiary, dashed: true }] : []),
          { label: 'Before', color: colors.textTertiary },
        ]}
      />
    </View>
  );
}

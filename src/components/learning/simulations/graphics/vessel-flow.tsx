import { useMemo } from 'react';
import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { FlowState } from '@/data/simulations/vessel-flow';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 200;
const X0 = 24;
const X1 = W - 16;
const CY = 90;
const NARROW_START = 190;
const NARROW_END = 250;
const TAPER = 24;
const LANES = [-0.8, -0.55, -0.28, 0, 0.28, 0.55, 0.8];

function halfWidthAt(x: number, half: number, narrowHalf: number) {
  if (x < NARROW_START - TAPER || x > NARROW_END + TAPER) return half;
  if (x >= NARROW_START && x <= NARROW_END) return narrowHalf;
  const s = x < NARROW_START ? (NARROW_START - x) / TAPER : (x - NARROW_END) / TAPER; // 1 at the outer edge
  const blend = s * s * (3 - 2 * s);
  return narrowHalf + (half - narrowHalf) * blend;
}

export function VesselFlowGraphic({ state, time, reduceMotion }: GraphicProps<FlowState>) {
  const colors = useTheme();
  const half = Math.min(64, 32 * state.radius);
  const narrowHalf = Math.max(3, half * (1 - state.stenosis));

  // Time to cross each slice of the vessel (faster where it is narrow), so
  // particles speed up through the narrowing.
  const table = useMemo(() => {
    const speed = 70 * Math.min(3, Math.max(0.06, state.flow / 100)) / (state.radius * state.radius);
    const xs: number[] = [];
    const ts: number[] = [];
    let total = 0;
    for (let i = 0; i <= 120; i++) {
      const x = X0 + ((X1 - X0) * i) / 120;
      xs.push(x);
      ts.push(total);
      const local = halfWidthAt(x, half, narrowHalf);
      total += (X1 - X0) / 120 / (speed * (half / local) ** 2);
    }
    return { xs, ts, total };
  }, [state.flow, state.radius, half, narrowHalf]);

  const positionAt = (t: number) => {
    const lap = ((t % table.total) + table.total) % table.total;
    let lo = 0;
    let hi = table.ts.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (table.ts[mid] <= lap) lo = mid;
      else hi = mid;
    }
    const span = table.ts[hi] - table.ts[lo] || 1;
    return table.xs[lo] + ((lap - table.ts[lo]) / span) * (table.xs[hi] - table.xs[lo]);
  };

  let top = '';
  let bottom = '';
  for (let i = 0; i <= 80; i++) {
    const x = X0 + ((X1 - X0) * i) / 80;
    const h = halfWidthAt(x, half, narrowHalf);
    top += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(CY - h).toFixed(1)} `;
    bottom = `L${x.toFixed(1)} ${(CY + h).toFixed(1)} ` + bottom;
  }
  const outline = `${top}${bottom}Z`;

  const particles: { x: number; y: number; key: string }[] = [];
  LANES.forEach((lane, li) => {
    const laneSpeed = state.turbulent ? 0.85 : 1 - lane * lane * 0.9; // parabolic profile when laminar
    for (let k = 0; k < 4; k++) {
      const offset = (k / 4) * table.total + li * 0.37;
      const x = positionAt((reduceMotion ? 0 : time) * laneSpeed * 1 + offset);
      const h = halfWidthAt(x, half, narrowHalf);
      let y = CY + lane * h * 0.9;
      if (state.turbulent && x > NARROW_START - 10) {
        y += Math.sin(time * 9 + li * 1.7 + x * 0.12) * h * 0.35;
      }
      particles.push({ x, y: Math.max(CY - h + 2, Math.min(CY + h - 2, y)), key: `${li}-${k}` });
    }
  });

  const profileX = X0 + 44;
  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Blood vessel. Flow ${Math.round(state.flow)}% of normal, ${state.turbulent ? 'turbulent' : 'laminar'}.`}>
        <Path d={outline} fill={colors.error} fillOpacity={0.12} stroke={colors.error} strokeWidth={2} />
        {state.stenosis > 0 ? (
          <SvgText x={(NARROW_START + NARROW_END) / 2} y={CY - narrowHalf - 10} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
            {`${Math.round(state.stenosis * 100)}% narrowed`}
          </SvgText>
        ) : null}
        {LANES.map((lane) => {
          const length = (state.turbulent ? 0.7 : 1 - lane * lane * 0.9) * 34;
          const y = CY + lane * half * 0.9;
          return (
            <G key={`p${lane}`}>
              <Line x1={profileX} x2={profileX + length} y1={y} y2={y} stroke={colors.primary} strokeWidth={2} />
              <Path d={`M${profileX + length} ${y} l-6 -4 l0 8 Z`} fill={colors.primary} />
            </G>
          );
        })}
        <Line x1={profileX} x2={profileX} y1={CY - half} y2={CY + half} stroke={colors.primary} strokeWidth={1.5} strokeDasharray="3 3" />
        {particles.map((p) => (
          <Circle key={p.key} cx={p.x} cy={p.y} r={3.2} fill={colors.error} />
        ))}
        <Rect x={X0} y={H - 30} width={150} height={22} rx={11} fill={state.turbulent ? colors.warningSubtle : colors.successSubtle} />
        <SvgText x={X0 + 75} y={H - 15} fontSize={12} fontWeight="900" fill={state.turbulent ? colors.warningText : colors.successText} textAnchor="middle">
          {state.turbulent ? 'Turbulent — bruit' : 'Laminar — silent'}
        </SvgText>
        <SvgText x={X1} y={H - 15} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="end">
          {`Flow ${Math.round(state.flow)}%`}
        </SvgText>
      </Canvas>
      <Legend
        items={[
          { label: 'Velocity profile', color: colors.primary },
          { label: 'Red cells', color: colors.error },
        ]}
      />
    </View>
  );
}

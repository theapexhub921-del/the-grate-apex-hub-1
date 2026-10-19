import { useMemo } from 'react';
import { View } from 'react-native';
import { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import type { FlowState } from '@/data/simulations/vessel-flow';

import { mix, RedCell } from './anatomy/cells';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 240;
const X0 = 24;
const X1 = W - 16;
const CY = 104;
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
  const half = Math.min(76, 40 * state.radius);
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

  // the wall around the lumen: intima (thin, pale), media (smooth muscle), adventitia
  const wallW = 10 + 4 * state.radius;
  let outerTop = '';
  let outerBottom = '';
  for (let i = 0; i <= 80; i++) {
    const x = X0 + ((X1 - X0) * i) / 80;
    const h = half + wallW;
    outerTop += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(CY - h).toFixed(1)} `;
    outerBottom = `L${x.toFixed(1)} ${(CY + h).toFixed(1)} ` + outerBottom;
  }
  const outer = `${outerTop}${outerBottom}Z`;
  // a fatty plaque bulging into the lumen where it is narrowed
  const plaque = (sign: 1 | -1) => {
    let d = '';
    for (let i = 0; i <= 30; i++) {
      const x = NARROW_START - TAPER + ((NARROW_END - NARROW_START + 2 * TAPER) * i) / 30;
      const h = halfWidthAt(x, half, narrowHalf);
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(CY + sign * h).toFixed(1)} `;
    }
    return `${d}L${NARROW_END + TAPER} ${CY + sign * half} L${NARROW_START - TAPER} ${CY + sign * half} Z`;
  };
  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`An artery cut along its length. Flow ${Math.round(state.flow)}% of normal, ${state.turbulent ? 'turbulent' : 'laminar'}.`}>
        <Defs>
          <LinearGradient id="vfWall" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={A.muscleDark} />
            <Stop offset="0.5" stopColor={A.muscleLight} />
            <Stop offset="1" stopColor={A.muscleDark} />
          </LinearGradient>
          <LinearGradient id="vfLumen" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mix(A.artery, '#FFFFFF', 0.5)} />
            <Stop offset="0.5" stopColor={mix(A.artery, '#FFFFFF', 0.68)} />
            <Stop offset="1" stopColor={mix(A.artery, '#FFFFFF', 0.5)} />
          </LinearGradient>
        </Defs>
        <Path d={outer} fill="url(#vfWall)" stroke={A.calyxShade} strokeWidth={3} />
        {Array.from({ length: 24 }, (_, i) => (
          <Path key={i} d={`M${X0 + 6 + i * 15} ${CY - half - wallW + 3} l8 ${wallW - 6} M${X0 + 6 + i * 15} ${CY + half + 3} l8 ${wallW - 6}`} stroke={A.muscleDark} strokeWidth={0.8} opacity={0.4} />
        ))}
        <Path d={outline} fill="url(#vfLumen)" stroke={A.calyx} strokeWidth={2} />
        {state.stenosis > 0 ? (
          <G>
            <Path d={plaque(-1)} fill={A.fat} stroke={A.urineDark} strokeWidth={1} />
            <Path d={plaque(1)} fill={A.fat} stroke={A.urineDark} strokeWidth={1} />
          </G>
        ) : null}
        {particles.map((p, i) => (
          <RedCell key={p.key} x={p.x} y={p.y} r={Math.min(6, 2.5 + half / 12)} sat={0.97} tilt={state.turbulent ? time * 6 + i : i * 0.4} />
        ))}
        {state.stenosis > 0 ? <Tag x={(NARROW_START + NARROW_END) / 2} y={Math.max(10, CY - half - wallW - 10)} text={`Plaque: ${Math.round(state.stenosis * 100)}% narrowed`} size={10} /> : null}
        <Tag x={X0 + 78} y={H - 12} text={state.turbulent ? 'Turbulent: a bruit is heard' : 'Laminar: silent'} tone={state.turbulent ? 'warning' : 'success'} size={10} />
      </Canvas>
    </View>
  );
}

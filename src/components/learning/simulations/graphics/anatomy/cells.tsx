// Magnified tissue for the respiratory simulations: alveoli with their
// capillaries, and red blood cells coloured by how much O₂ they carry.
import { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';

import { seeded, useSvgIds } from './lungs';

// Blend two #rrggbb colours (t = 0 → a, 1 → b).
export function mix(a: string, b: string, t: number) {
  const k = Math.min(1, Math.max(0, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

// The colour of blood at a given saturation (0–1); CO makes it cherry red.
export function bloodColour(sat: number, co = 0) {
  const base = mix(A.bloodDeoxy, A.bloodOxy, Math.pow(Math.min(1, Math.max(0, sat)), 1.4));
  return co > 0 ? mix(base, '#E8505B', Math.min(1, co * 1.6)) : base;
}

// A red blood cell seen face-on: a disc with a paler, dimpled centre.
export function RedCell({ x, y, r, sat, co = 0, tilt = 0 }: { x: number; y: number; r: number; sat: number; co?: number; tilt?: number }) {
  const c = bloodColour(sat, co);
  const ry = r * (1 - 0.45 * Math.abs(Math.sin(tilt)));
  return (
    <G>
      <Ellipse cx={x} cy={y} rx={r} ry={ry} fill={c} stroke={mix(c, '#000000', 0.35)} strokeWidth={0.8} />
      <Ellipse cx={x} cy={y} rx={r * 0.48} ry={ry * 0.48} fill={mix(c, '#FFFFFF', 0.28)} opacity={0.75} />
      <Ellipse cx={x - r * 0.3} cy={y - ry * 0.35} rx={r * 0.28} ry={ry * 0.16} fill="#FFFFFF" opacity={0.25} />
    </G>
  );
}

// A capillary seen from the side, with red cells moving through it.
// `satAt(f)` gives the saturation at fraction f (0 = inlet, 1 = outlet).
export function Capillary({ x, y, w, h, time, speed = 1, satAt, co = 0, count = 7 }: { x: number; y: number; w: number; h: number; time: number; speed?: number; satAt: (f: number) => number; co?: number; count?: number }) {
  const id = useSvgIds('cap');
  const cells = Array.from({ length: count }, (_, i) => {
    const f = (((i / count + time * 0.12 * speed) % 1) + 1) % 1;
    return { f, x: x + f * w, tilt: i * 0.9 };
  });
  return (
    <G>
      <Defs>
        <LinearGradient id={id('wall')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={A.mucosa} />
          <Stop offset="0.5" stopColor="#FBE3DD" />
          <Stop offset="1" stopColor={A.mucosa} />
        </LinearGradient>
      </Defs>
      <Path d={`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`} fill={`url(#${id('wall')})`} />
      <Path d={`M${x} ${y} L${x + w} ${y} M${x} ${y + h} L${x + w} ${y + h}`} stroke={A.lungEdge} strokeWidth={1.4} />
      {cells.map((c, i) => (
        <RedCell key={i} x={c.x} y={y + h / 2} r={h * 0.36} sat={satAt(c.f)} co={co} tilt={c.tilt} />
      ))}
    </G>
  );
}

export type ClusterProps = {
  cx: number;
  cy: number;
  size?: number; // radius of the whole cluster
  inflate?: number; // 0–1
  surfactant?: number; // 0–1 (low → alveoli collapse)
  condition?: 'normal' | 'fibrosis' | 'oedema' | 'emphysema';
  fresh?: number; // 0–1 how much fresh air is in the alveoli
  bloodSat?: number; // saturation of blood in the capillaries
};

// A cluster of alveoli at the end of a respiratory bronchiole, wrapped in
// capillaries. Collapsed alveoli, scarred walls, fluid or merged sacs show
// the chosen condition.
export function AlveolarCluster({ cx, cy, size = 70, inflate = 0.5, surfactant = 1, condition = 'normal', fresh = 0.6, bloodSat = 0.97 }: ClusterProps) {
  const id = useSvgIds('alv');
  const rand = seeded(5);
  const emphysema = condition === 'emphysema';
  const spots = emphysema
    ? [
        [-0.22, -0.05, 0.62],
        [0.36, 0.18, 0.5],
        [0.05, 0.5, 0.34],
      ]
    : [
        [-0.42, -0.3, 0.3],
        [-0.02, -0.46, 0.3],
        [0.38, -0.26, 0.3],
        [-0.5, 0.12, 0.3],
        [-0.1, 0.02, 0.32],
        [0.32, 0.14, 0.3],
        [-0.3, 0.48, 0.28],
        [0.1, 0.5, 0.3],
        [0.5, 0.48, 0.24],
      ];
  const air = mix(A.airDeep, A.air, fresh);
  return (
    <G>
      <Defs>
        <RadialGradient id={id('sac')} cx="38%" cy="32%" r="70%">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.55" stopColor={condition === 'fibrosis' ? A.cartilage : A.lungLight} />
          <Stop offset="1" stopColor={condition === 'fibrosis' ? A.cartilageShade : A.lung} />
        </RadialGradient>
        <LinearGradient id={id('fluid')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={A.fat} stopOpacity={0.85} />
          <Stop offset="1" stopColor={A.urineDark} stopOpacity={0.9} />
        </LinearGradient>
      </Defs>
      {/* respiratory bronchiole leading in */}
      <Path d={`M${cx - size * 1.1} ${cy - size * 1.05} Q${cx - size * 0.6} ${cy - size * 0.75} ${cx - size * 0.1} ${cy - size * 0.15}`} stroke={A.cartilageShade} strokeWidth={size * 0.22} strokeLinecap="round" fill="none" />
      <Path d={`M${cx - size * 1.1} ${cy - size * 1.05} Q${cx - size * 0.6} ${cy - size * 0.75} ${cx - size * 0.1} ${cy - size * 0.15}`} stroke={A.cartilage} strokeWidth={size * 0.15} strokeLinecap="round" fill="none" />
      {spots.map(([dx, dy, rr], i) => {
        // lower surfactant → the smaller alveoli (higher surface tension pull) collapse first
        const fragile = (i % 3) / 3;
        const collapsed = !emphysema && surfactant < 0.75 && fragile >= surfactant * 0.9 ? 1 - surfactant : 0;
        const r = size * rr * (0.82 + 0.26 * inflate) * (1 - 0.55 * collapsed);
        const x = cx + dx * size;
        const y = cy + dy * size;
        const wobble = Array.from({ length: 14 }, (_, k) => {
          const a = (k / 14) * Math.PI * 2;
          const jag = emphysema ? 1 + (rand() - 0.5) * 0.18 : collapsed ? 1 + (rand() - 0.5) * 0.35 * collapsed : 1 + (rand() - 0.5) * 0.05;
          return `${k === 0 ? 'M' : 'L'}${(x + Math.cos(a) * r * jag).toFixed(1)} ${(y + Math.sin(a) * r * jag).toFixed(1)}`;
        }).join(' ');
        return (
          <G key={i}>
            <Path d={`${wobble} Z`} fill={`url(#${id('sac')})`} stroke={condition === 'fibrosis' ? A.cartilageShade : A.lungEdge} strokeWidth={condition === 'fibrosis' ? 4 : 1.3} strokeLinejoin="round" />
            <Circle cx={x} cy={y} r={r * 0.68} fill={air} opacity={collapsed ? 0.25 : 0.55} />
            {surfactant > 0.05 && !collapsed ? <Circle cx={x} cy={y} r={r * 0.86} fill="none" stroke={A.urine} strokeWidth={1.2} opacity={0.35 + 0.4 * surfactant} /> : null}
            {condition === 'oedema' ? <Path d={`M${x - r * 0.86} ${y - r * 0.1} Q${x} ${y} ${x + r * 0.86} ${y - r * 0.1} A${r * 0.86} ${r * 0.86} 0 0 1 ${x - r * 0.86} ${y - r * 0.1} Z`} fill={`url(#${id('fluid')})`} /> : null}
          </G>
        );
      })}
      {/* capillaries winding over the alveoli: blue in, red out */}
      {(emphysema ? [0, 1] : [0, 1, 2]).map((k) => {
        const yy = cy - size * 0.45 + k * size * 0.45;
        const d = `M${cx - size * 0.85} ${yy} C${cx - size * 0.45} ${yy - size * 0.2} ${cx - size * 0.1} ${yy + size * 0.22} ${cx + size * 0.25} ${yy} S${cx + size * 0.7} ${yy - size * 0.12} ${cx + size * 0.85} ${yy + size * 0.05}`;
        return (
          <G key={k} opacity={0.85}>
            <Path d={d} stroke={A.vein} strokeWidth={size * 0.05} fill="none" strokeLinecap="round" strokeDasharray={`${size * 0.8} ${size * 3}`} />
            <Path d={d} stroke={bloodColour(bloodSat)} strokeWidth={size * 0.05} fill="none" strokeLinecap="round" strokeDasharray={`0 ${size * 0.8} ${size * 3}`} />
          </G>
        );
      })}
    </G>
  );
}

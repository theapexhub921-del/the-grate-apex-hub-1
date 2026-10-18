// Illustrated lungs, airways, ribs and diaphragm for the respiratory
// simulations. Drawn in a 240 × 240 box (midline x = 120) and placed with
// <G transform>. Tissue colours come from `Anatomy` in constants/theme.ts.
import { useId } from 'react';
import { Circle, ClipPath, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';

// Unique gradient / clip ids (several drawings can share a page).
export function useSvgIds(prefix: string) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (name: string) => `${prefix}${id}${name}`;
}

// A repeatable pseudo-random sequence, so textures never flicker.
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Viewer's left = the patient's right lung (three lobes).
export const RIGHT_LUNG =
  'M84 24 C62 28 44 58 35 96 C27 134 20 178 16 216 C38 203 72 198 104 208 C110 210 113 202 112 192 C111 172 109 156 104 140 C111 126 111 108 108 90 C105 58 99 26 84 24 Z';
// The patient's left lung: two lobes, with the cardiac notch and lingula.
export const LEFT_LUNG =
  'M156 24 C178 28 196 58 205 96 C213 134 220 178 224 216 C206 204 182 199 160 207 C152 210 148 202 152 194 C158 186 168 180 170 166 C171 152 160 146 148 142 C136 138 132 126 132 110 C132 84 133 62 136 48 C140 32 146 25 156 24 Z';

const RIGHT_FISSURES = ['M31 128 C56 123 82 126 106 134', 'M102 68 C88 108 62 160 42 206'];
const LEFT_FISSURES = ['M139 70 C158 110 182 160 200 207'];

const RIGHT_HILUM: [number, number] = [104, 120];
const LEFT_HILUM: [number, number] = [138, 122];

type Branch = { x1: number; y1: number; x2: number; y2: number; w: number };

// A bronchial tree: each airway divides in two, narrower and shorter.
function tree(x: number, y: number, angle: number, len: number, w: number, depth: number, rand: () => number, out: Branch[]) {
  const rad = (angle * Math.PI) / 180;
  const x2 = x + Math.cos(rad) * len;
  const y2 = y + Math.sin(rad) * len;
  out.push({ x1: x, y1: y, x2, y2, w });
  if (depth <= 0) return;
  const spread = 24 + rand() * 14;
  tree(x2, y2, angle - spread, len * (0.7 + rand() * 0.1), w * 0.7, depth - 1, rand, out);
  tree(x2, y2, angle + spread * (0.8 + rand() * 0.3), len * (0.68 + rand() * 0.1), w * 0.66, depth - 1, rand, out);
}

function airwaysFor(side: 'right' | 'left') {
  const out: Branch[] = [];
  const rand = seeded(side === 'right' ? 11 : 29);
  if (side === 'right') {
    // the right main bronchus is shorter, wider and more vertical
    out.push({ x1: 120, y1: 62, x2: 104, y2: 92, w: 12 });
    tree(104, 92, 200, 26, 8, 4, rand, out); // upper lobe
    tree(104, 92, 112, 34, 9, 5, rand, out); // middle and lower lobes
  } else {
    out.push({ x1: 120, y1: 62, x2: 142, y2: 98, w: 10.5 });
    tree(142, 98, -24, 26, 7.5, 4, rand, out); // upper lobe
    tree(142, 98, 66, 36, 8.5, 5, rand, out); // lower lobe
  }
  return out;
}
const AIRWAYS = { right: airwaysFor('right'), left: airwaysFor('left') };

// Mottled lobules on the lung surface.
function lobules(seed: number) {
  const rand = seeded(seed);
  return Array.from({ length: 150 }, () => ({ x: 14 + rand() * 212, y: 22 + rand() * 196, r: 2.5 + rand() * 4.5, o: 0.06 + rand() * 0.12 }));
}
const LOBULES = lobules(7);

// Where the lung bases sit for a given inflation (box coordinates).
export function lungBase(inflate: number) {
  return RIGHT_HILUM[1] + (204 - RIGHT_HILUM[1]) * (0.84 + 0.2 * inflate);
}

// The heart in the middle of the chest, behind the lungs.
export function Heart() {
  const id = useSvgIds('heart');
  return (
    <G>
      <Defs>
        <RadialGradient id={id('m')} cx="40%" cy="35%" r="70%">
          <Stop offset="0" stopColor={A.muscleLight} />
          <Stop offset="1" stopColor={A.muscleDark} />
        </RadialGradient>
      </Defs>
      <Path d="M112 112 C96 116 92 140 98 162 C104 186 126 200 150 206 C166 198 174 178 170 156 C166 132 150 116 132 112 Z" fill={`url(#${id('m')})`} stroke={A.muscleDark} strokeWidth={1.2} />
      <Path d="M126 114 C122 94 126 80 138 78 C150 76 157 86 155 102 L155 132" stroke={A.arteryDark} strokeWidth={11} fill="none" strokeLinecap="round" />
      <Path d="M126 114 C122 94 126 80 138 78 C150 76 157 86 155 102 L155 132" stroke={A.artery} strokeWidth={8} fill="none" strokeLinecap="round" />
      <Path d="M128 122 C140 150 150 176 152 200" stroke={A.fat} strokeWidth={3} fill="none" opacity={0.8} />
    </G>
  );
}

export type LungsProps = {
  inflate?: number; // 0 = after a quiet breath out, 1 = deep breath in
  collapse?: { right?: number; left?: number }; // 0–1, pneumothorax
  airway?: number; // 1 = normal calibre, below 1 = narrowed
  stiff?: number; // 0–1: fibrosis (pale, firm, scarred)
  showAirways?: boolean;
  showTrachea?: boolean;
  tint?: number; // 0–1: dusky blue (low O₂)
  fresh?: number; // 0–1: fresh air reaching the alveoli (bluish glow)
  lumen?: string; // colour inside the airways (default dark)
};

// The two lungs with their airways (240 × 240 box).
export function Lungs({ inflate = 0.4, collapse = {}, airway = 1, stiff = 0, showAirways = true, showTrachea = true, tint = 0, fresh = 0, lumen = A.lumen }: LungsProps) {
  const id = useSvgIds('lung');
  const scaleFor = (c: number) => ({ sx: (0.9 + 0.12 * inflate) * (1 - 0.55 * c), sy: (0.84 + 0.2 * inflate) * (1 - 0.6 * c) });
  const lung = (side: 'right' | 'left') => {
    const c = collapse[side] ?? 0;
    const { sx, sy } = scaleFor(c);
    const [hx, hy] = side === 'right' ? RIGHT_HILUM : LEFT_HILUM;
    const d = side === 'right' ? RIGHT_LUNG : LEFT_LUNG;
    const clip = id(`clip${side}`);
    return (
      <G key={side} transform={`translate(${hx} ${hy}) scale(${sx} ${sy}) translate(${-hx} ${-hy})`}>
        <Defs>
          <ClipPath id={clip}>
            <Path d={d} />
          </ClipPath>
        </Defs>
        <Path d={d} fill={`url(#${id('body')})`} stroke={A.lungEdge} strokeWidth={1.6} />
        <G clipPath={`url(#${clip})`}>
          {LOBULES.map((l, i) => (
            <Circle key={i} cx={l.x} cy={l.y} r={l.r} fill={A.lungDark} opacity={l.o * (1 - stiff * 0.4)} />
          ))}
          {stiff > 0
            ? LOBULES.filter((_, i) => i % 3 === 0).map((l, i) => (
                <Path key={`s${i}`} d={`M${l.x - 6} ${l.y} q4 -${3 + l.r} 9 0 t9 0`} stroke={A.cartilageShade} strokeWidth={1.4} fill="none" opacity={stiff * 0.8} />
              ))
            : null}
          <Ellipse cx={side === 'right' ? 58 : 182} cy={84} rx={34} ry={50} fill={`url(#${id('shine')})`} />
          {tint > 0 ? <Path d={d} fill={A.vein} opacity={tint * 0.35} /> : null}
          {fresh > 0 ? <Path d={d} fill={A.airDeep} opacity={fresh * 0.45} /> : null}
          {(side === 'right' ? RIGHT_FISSURES : LEFT_FISSURES).map((f) => (
            <G key={f}>
              <Path d={f} stroke={A.lungEdge} strokeWidth={2.2} fill="none" opacity={0.75} />
              <Path d={f} stroke={A.lungLight} strokeWidth={0.8} fill="none" opacity={0.6} transform="translate(0.8 1)" />
            </G>
          ))}
          {showAirways
            ? AIRWAYS[side].slice(1).map((b, i) => (
                <G key={i} opacity={0.82}>
                  <Path d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2}`} stroke={A.cartilageShade} strokeWidth={b.w * airway + 1.6} strokeLinecap="round" />
                  <Path d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2}`} stroke={A.cartilage} strokeWidth={b.w * airway} strokeLinecap="round" />
                  <Path d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2}`} stroke={lumen} strokeWidth={Math.max(0.6, b.w * airway * 0.4)} strokeLinecap="round" opacity={lumen === A.lumen ? 0.55 : 0.9} />
                </G>
              ))
            : null}
        </G>
      </G>
    );
  };
  const trunk = [AIRWAYS.right[0], AIRWAYS.left[0]];
  return (
    <G>
      <Defs>
        <RadialGradient id={id('body')} cx="40%" cy="35%" r="75%">
          <Stop offset="0" stopColor={stiff > 0.5 ? A.lungLight : A.lung} />
          <Stop offset="0.7" stopColor={stiff > 0.5 ? A.lung : A.lung} />
          <Stop offset="1" stopColor={A.lungDark} />
        </RadialGradient>
        <RadialGradient id={id('shine')} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.45} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id={id('trachea')} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={A.cartilageShade} />
          <Stop offset="0.45" stopColor={A.cartilage} />
          <Stop offset="1" stopColor={A.cartilageShade} />
        </LinearGradient>
      </Defs>
      {lung('right')}
      {lung('left')}
      {showTrachea ? <Trachea airway={airway} gradient={`url(#${id('trachea')})`} trunk={trunk} lumen={lumen === A.lumen ? undefined : lumen} /> : null}
    </G>
  );
}

// The trachea with its C-shaped cartilage rings, and the main bronchi.
function Trachea({ airway, gradient, trunk, lumen }: { airway: number; gradient: string; trunk: Branch[]; lumen?: string }) {
  const w = 18 * Math.max(0.6, airway);
  const rings = Array.from({ length: 9 }, (_, i) => 6 + i * 6);
  return (
    <G>
      {trunk.map((b, i) => (
        <G key={i}>
          <Path d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2}`} stroke={A.cartilageShade} strokeWidth={b.w * airway + 2} strokeLinecap="round" />
          <Path d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2}`} stroke={A.cartilage} strokeWidth={b.w * airway} strokeLinecap="round" />
        </G>
      ))}
      <Path d={`M${120 - w / 2} 0 L${120 - w / 2} 60 Q120 70 ${120 + w / 2} 60 L${120 + w / 2} 0 Z`} fill={gradient} stroke={A.cartilageShade} strokeWidth={1} />
      {rings.map((y) => (
        <Path key={y} d={`M${120 - w / 2 + 0.5} ${y} Q120 ${y + 3} ${120 + w / 2 - 0.5} ${y}`} stroke={A.cartilageShade} strokeWidth={1.6} fill="none" />
      ))}
      {lumen ? (
        <G opacity={0.85}>
          <Path d={`M120 0 L120 62`} stroke={lumen} strokeWidth={w * 0.45} strokeLinecap="round" />
          {trunk.map((b, i) => (
            <Path key={i} d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2}`} stroke={lumen} strokeWidth={b.w * airway * 0.45} strokeLinecap="round" />
          ))}
        </G>
      ) : null}
    </G>
  );
}

// Ribs (seven pairs) for the chest wall, drawn in the same box. Draw them
// before the lungs; `front` adds a faint copy over the lungs.
export function Ribs({ front = false, lift = 0 }: { front?: boolean; lift?: number }) {
  const ribs = Array.from({ length: 7 }, (_, i) => i);
  return (
    <G opacity={front ? 0.2 : 1}>
      {ribs.map((i) => {
        const y = 40 + i * 25 - lift * (4 + i * 0.6);
        const spread = 74 + i * 6;
        const drop = 22 + i * 3 - lift * 6;
        const right = `M116 ${y} C${120 - spread * 0.6} ${y - 6} ${120 - spread} ${y + 4} ${120 - spread - 4} ${y + drop}`;
        const left = `M124 ${y} C${120 + spread * 0.6} ${y - 6} ${120 + spread} ${y + 4} ${120 + spread + 4} ${y + drop}`;
        return (
          <G key={i}>
            {[right, left].map((d) => (
              <G key={d}>
                <Path d={d} stroke={A.boneShade} strokeWidth={9} fill="none" strokeLinecap="round" />
                <Path d={d} stroke={A.bone} strokeWidth={6} fill="none" strokeLinecap="round" />
              </G>
            ))}
          </G>
        );
      })}
      {!front ? <Path d="M114 30 L126 30 L127 176 Q120 186 113 176 Z" fill={A.bone} stroke={A.boneShade} strokeWidth={1.5} /> : null}
    </G>
  );
}

// The diaphragm: a muscular dome under the lungs; it moves down as the
// lungs inflate (it contracts during a breath in).
export function Diaphragm({ inflate = 0.4 }: { inflate?: number }) {
  const id = useSvgIds('dia');
  const top = lungBase(inflate) + 12;
  const d = `M4 232 C10 ${top - 16} 50 ${top - 18} 86 ${top - 6} C104 ${top} 112 ${top + 6} 120 ${top + 6} C128 ${top + 6} 136 ${top} 154 ${top - 6} C190 ${top - 18} 230 ${top - 16} 236 232 Z`;
  return (
    <G>
      <Defs>
        <LinearGradient id={id('m')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={A.muscleLight} />
          <Stop offset="1" stopColor={A.muscleDark} />
        </LinearGradient>
      </Defs>
      <Path d={d} fill={`url(#${id('m')})`} stroke={A.muscleDark} strokeWidth={1.2} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 14 + i * 19;
        return <Path key={i} d={`M${x} ${top + 2 + Math.abs(120 - x) * 0.05} L${x + 6} 230`} stroke={A.muscleDark} strokeWidth={0.8} opacity={0.4} />;
      })}
    </G>
  );
}

// A soft torso silhouette (neck, shoulders, chest wall) behind the ribs.
export function Torso() {
  const id = useSvgIds('torso');
  return (
    <G>
      <Defs>
        <LinearGradient id={id('skin')} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={A.skinShade} stopOpacity={0.55} />
          <Stop offset="0.5" stopColor={A.skin} stopOpacity={0.35} />
          <Stop offset="1" stopColor={A.skinShade} stopOpacity={0.55} />
        </LinearGradient>
      </Defs>
      <Path
        d="M98 -20 L99 10 C72 16 34 20 18 38 C4 56 4 140 8 244 L232 244 C236 140 236 56 222 38 C206 20 168 16 141 10 L142 -20 Z"
        fill={`url(#${id('skin')})`}
        stroke={A.skinShade}
        strokeWidth={1.2}
      />
    </G>
  );
}

// A magnified bronchiole cut across: folded mucosa, a ring of smooth
// muscle and the open lumen. `open` 0–1 sets how wide the lumen is.
export function BronchioleSection({ cx, cy, r, open }: { cx: number; cy: number; r: number; open: number }) {
  const id = useSvgIds('bro');
  const lumen = r * (0.18 + 0.4 * open);
  const muscleW = r * (0.16 + 0.16 * (1 - open));
  const folds = 12;
  const mucosaR = lumen + r * 0.12;
  let d = '';
  for (let i = 0; i <= folds * 2; i++) {
    const a = (i / (folds * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? mucosaR : lumen * (1 - 0.18 * (1 - open)) + 1;
    d += `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} `;
  }
  return (
    <G>
      <Defs>
        <RadialGradient id={id('wall')} cx="45%" cy="40%" r="60%">
          <Stop offset="0" stopColor={A.lungLight} />
          <Stop offset="1" stopColor={A.lung} />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r} fill={`url(#${id('wall')})`} stroke={A.lungEdge} strokeWidth={1.4} />
      <Circle cx={cx} cy={cy} r={mucosaR + muscleW / 2 + 1} fill="none" stroke={A.muscle} strokeWidth={muscleW} />
      <Circle cx={cx} cy={cy} r={mucosaR + muscleW / 2 + 1} fill="none" stroke={A.muscleDark} strokeWidth={0.8} strokeDasharray="2 3" opacity={0.6} />
      <Path d={`${d}Z`} fill={A.mucosa} stroke={A.lungEdge} strokeWidth={0.8} />
      <Circle cx={cx} cy={cy} r={lumen * 0.82} fill={A.air} stroke={A.airDeep} strokeWidth={1} />
    </G>
  );
}

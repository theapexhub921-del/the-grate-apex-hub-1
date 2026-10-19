// Illustrated kidney for the renal simulations: a coronal (front-to-back)
// cut through the kidney showing capsule, cortex, pyramids, calyces, pelvis,
// ureter and the renal vessels. Drawn in a 220 × 270 box, hilum on the right.
import { Circle, ClipPath, Defs, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';

import { mix } from './cells';
import { seeded, useSvgIds } from './lungs';

export const KIDNEY_OUTLINE =
  'M98 8 C150 6 182 48 182 98 C182 116 168 122 164 130 C162 136 166 142 172 148 C182 160 184 176 182 190 C178 236 146 264 98 262 C46 260 16 214 16 136 C16 62 46 10 98 8 Z';
const CORTEX_INNER =
  'M98 26 C140 24 164 58 164 98 C164 112 152 120 148 130 C146 138 150 146 156 152 C164 162 166 176 164 188 C160 226 136 246 98 244 C58 242 34 206 34 136 C34 72 58 28 98 26 Z';

const SINUS: [number, number] = [136, 136];
type Pyramid = { apex: [number, number]; left: [number, number]; right: [number, number]; mid: [number, number] };

// Seven pyramids fanning out from the sinus towards the cortex.
const PYRAMIDS: Pyramid[] = [-118, -146, -172, 164, 138, 112, -92].map((deg) => {
  const t = (deg * Math.PI) / 180;
  const spread = 0.3;
  const at = (a: number, rx: number, ry: number): [number, number] => [100 + Math.cos(a) * rx, 136 + Math.sin(a) * ry];
  const apex: [number, number] = [SINUS[0] + Math.cos(t) * 30, SINUS[1] + Math.sin(t) * 34];
  return { apex, left: at(t - spread, 60, 104), right: at(t + spread, 60, 104), mid: at(t, 64, 110) };
});

export type KidneyProps = {
  urine?: string; // colour of urine in the pelvis and ureter
  arteryTint?: string; // colour of blood in the renal artery (e.g. with a tracer)
  veinTint?: string;
  highlight?: number; // index of a pyramid to outline (where a nephron sits), -1 for none
  glow?: number; // 0–1 overall activity (brighter cortex)
};

// The cut kidney with its vessels and ureter.
export function KidneySection({ urine = A.urine, arteryTint = A.artery, veinTint = A.vein, highlight = -1, glow = 0 }: KidneyProps) {
  const id = useSvgIds('kid');
  const rand = seeded(17);
  const grains = Array.from({ length: 160 }, () => ({ x: 20 + rand() * 160, y: 12 + rand() * 248, r: 0.8 + rand() * 1.6 }));
  return (
    <G>
      <Defs>
        <RadialGradient id={id('cortex')} cx="40%" cy="35%" r="75%">
          <Stop offset="0" stopColor={mix(A.kidneyLight, '#FFFFFF', 0.1 + glow * 0.15)} />
          <Stop offset="0.6" stopColor={A.kidney} />
          <Stop offset="1" stopColor={A.kidneyDark} />
        </RadialGradient>
        <LinearGradient id={id('pyr')} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={A.medulla} />
          <Stop offset="1" stopColor={mix(A.medulla, '#000000', 0.25)} />
        </LinearGradient>
        <LinearGradient id={id('urine')} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={mix(A.calyx, urine, urine === A.urine ? 0 : 0.55)} />
          <Stop offset="1" stopColor={mix(A.calyxShade, urine, urine === A.urine ? 0 : 0.55)} />
        </LinearGradient>
        <LinearGradient id={id('art')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={mix(arteryTint, '#FFFFFF', 0.25)} />
          <Stop offset="1" stopColor={mix(arteryTint, '#000000', 0.2)} />
        </LinearGradient>
        <ClipPath id={id('clip')}>
          <Path d={KIDNEY_OUTLINE} />
        </ClipPath>
      </Defs>
      {/* soft shadow */}
      <Path d={KIDNEY_OUTLINE} fill="#000000" opacity={0.12} transform="translate(4 6)" />
      {/* capsule and cortex */}
      <Path d={KIDNEY_OUTLINE} fill={`url(#${id('cortex')})`} stroke={A.kidneyDark} strokeWidth={2} />
      <G clipPath={`url(#${id('clip')})`}>
        {grains.map((g, i) => (
          <Circle key={i} cx={g.x} cy={g.y} r={g.r} fill={i % 3 ? A.kidneyDark : A.kidneyLight} opacity={0.18} />
        ))}
      </G>
      <Path d={CORTEX_INNER} fill="none" stroke={A.kidneyDark} strokeWidth={0.8} opacity={0.35} />
      {/* fat in the sinus */}
      <Path d="M114 84 C142 76 162 104 162 132 C162 162 142 190 116 184 C96 176 92 96 114 84 Z" fill={mix(A.fat, '#FFFFFF', 0.45)} />
      {/* pyramids with striations (collecting ducts) */}
      {PYRAMIDS.map((p, i) => (
        <G key={i}>
          <Path d={`M${p.apex[0]} ${p.apex[1]} C${(p.apex[0] * 2 + p.left[0]) / 3} ${(p.apex[1] * 2 + p.left[1]) / 3} ${p.left[0]} ${p.left[1]} ${p.left[0]} ${p.left[1]} Q${p.mid[0]} ${p.mid[1]} ${p.right[0]} ${p.right[1]} C${p.right[0]} ${p.right[1]} ${(p.apex[0] * 2 + p.right[0]) / 3} ${(p.apex[1] * 2 + p.right[1]) / 3} ${p.apex[0]} ${p.apex[1]} Z`} fill={`url(#${id('pyr')})`} stroke={highlight === i ? A.urine : A.kidneyDark} strokeWidth={highlight === i ? 2.4 : 0.8} />
          {[0.2, 0.4, 0.6, 0.8].map((f) => {
            const bx = p.left[0] + (p.right[0] - p.left[0]) * f;
            const by = p.left[1] + (p.right[1] - p.left[1]) * f;
            return <Path key={f} d={`M${p.apex[0]} ${p.apex[1]} L${bx} ${by}`} stroke={A.kidneyDark} strokeWidth={0.6} opacity={0.35} />;
          })}
        </G>
      ))}
      {/* renal columns' vessels: interlobar arteries to arcuate arteries */}
      {PYRAMIDS.map((p, i) => (
        <Path key={`v${i}`} d={`M${SINUS[0]} ${SINUS[1]} L${p.left[0]} ${p.left[1]}`} stroke={arteryTint} strokeWidth={1.1} opacity={0.7} />
      ))}
      {/* minor calyces cupping each apex, draining to the pelvis */}
      {PYRAMIDS.map((p, i) => {
        const dx = SINUS[0] + 6 - p.apex[0];
        const dy = SINUS[1] - p.apex[1];
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const cx = p.apex[0] + (dx / len) * 6;
        const cy = p.apex[1] + (dy / len) * 6;
        return (
          <Path
            key={`c${i}`}
            d={`M${cx + nx * 9} ${cy + ny * 9} Q${p.apex[0] - (dx / len) * 2} ${p.apex[1] - (dy / len) * 2} ${cx - nx * 9} ${cy - ny * 9} L${SINUS[0] + 6 - nx * 4} ${SINUS[1] - ny * 4} L${SINUS[0] + 6 + nx * 4} ${SINUS[1] + ny * 4} Z`}
            fill={`url(#${id('urine')})`}
            stroke={A.calyxShade}
            strokeWidth={0.8}
          />
        );
      })}
      {/* renal pelvis and ureter */}
      <Path d="M130 116 C150 112 168 122 176 136 C184 150 190 170 192 200 L194 270 L184 270 L182 204 C180 178 172 160 158 156 C142 154 126 150 124 138 C122 126 124 118 130 116 Z" fill={`url(#${id('urine')})`} stroke={A.calyxShade} strokeWidth={1.2} />
      {/* renal vein and artery at the hilum */}
      <Path d="M218 118 C196 118 176 120 160 124" stroke={mix(veinTint, '#000000', 0.25)} strokeWidth={13} strokeLinecap="round" fill="none" />
      <Path d="M218 118 C196 118 176 120 160 124" stroke={veinTint} strokeWidth={10} strokeLinecap="round" fill="none" />
      <Path d="M218 102 C198 102 178 106 162 112" stroke={mix(arteryTint, '#000000', 0.3)} strokeWidth={10} strokeLinecap="round" fill="none" />
      <Path d="M218 102 C198 102 178 106 162 112" stroke={`url(#${id('art')})`} strokeWidth={7.5} strokeLinecap="round" fill="none" />
      <Path d="M218 99 C198 99 180 103 164 109" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.35} fill="none" />
    </G>
  );
}

export { PYRAMIDS };

// A tube drawn with a wall, a fluid-filled lumen and a soft highlight, so
// tubules and vessels look round. `flow` (with `time`) moves faint streaks
// along the lumen to show fluid moving.
export function Tube({ d, width, wall, fluid, time = 0, flow = 0, shine = true }: { d: string; width: number; wall: string; fluid: string; time?: number; flow?: number; shine?: boolean }) {
  return (
    <G>
      <Path d={d} stroke={mix(wall, '#000000', 0.3)} strokeWidth={width + 1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d={d} stroke={wall} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d={d} stroke={fluid} strokeWidth={width * 0.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {flow > 0 ? <Path d={d} stroke="#FFFFFF" strokeWidth={width * 0.22} fill="none" strokeLinecap="round" strokeDasharray="3 11" strokeDashoffset={-time * 18 * flow} opacity={0.55} /> : null}
      {shine ? <Path d={d} stroke="#FFFFFF" strokeWidth={Math.max(0.6, width * 0.14)} fill="none" strokeLinecap="round" opacity={0.3} transform={`translate(${-width * 0.18} ${-width * 0.18})`} /> : null}
    </G>
  );
}

export const CORTEX_LINE = 128;
const AFF = 'M2 14 C22 20 40 34 56 48';
const EFF = 'M86 46 C100 34 116 28 132 30 C150 32 160 40 174 46';
const PCT = 'M88 80 C102 96 120 88 118 72 C116 58 134 52 140 66 C146 80 128 94 142 104 C154 112 168 100 170 116 L170 128';
const DCT = 'M190 128 C190 112 200 98 188 86 C176 74 190 60 172 54 C152 48 120 46 98 42 C86 40 76 36 70 30';
const TO_DUCT = 'M70 30 C84 16 120 12 160 12 C196 12 222 18 228 34';

export type NephronProps = {
  afferent?: number; // relative radius, 1 = normal
  efferent?: number;
  long?: boolean; // juxtamedullary
  renin?: number; // 0–1 glow of the granular cells
  bloodFlow?: number; // 0–2
  filtrate?: number; // 0–2 flow of filtrate
  time?: number;
  ductFluid?: string; // colour in the collecting duct (urine)
  water?: number; // 0–1 water leaving the collecting duct (ADH)
  medulla?: number; // 0–1 strength of the medullary salt gradient (shading)
  blockedLimb?: boolean; // thick ascending limb transporter blocked (Lasix)
};

// One nephron in its place: glomerulus and arterioles in the cortex, the
// loop of Henle dipping into the medulla, the distal tubule returning to
// touch its own afferent arteriole (the juxtaglomerular apparatus) and the
// collecting duct running down to the papilla. Drawn in a 250 × 300 box.
export function Nephron({ afferent = 1, efferent = 1, long = false, renin = 0, bloodFlow = 1, filtrate = 1, time = 0, ductFluid = A.urine, water = 0.5, medulla = 1, blockedLimb = false }: NephronProps) {
  const id = useSvgIds('nep');
  const bottom = long ? 282 : 196;
  const loop = `M170 128 L170 ${bottom} C170 ${bottom + 14} 190 ${bottom + 14} 190 ${bottom} L190 128`;
  const tubeWall = A.mucosa;
  const filtrateColour = mix(A.urine, '#FFFFFF', 0.6);
  const capillaries = [0, 1, 2, 3].map((k) => `M${110 + k * 16} 40 C${104 + k * 16} 70 ${122 + k * 16} 92 ${112 + k * 16} 124`);
  return (
    <G>
      <Defs>
        <LinearGradient id={id('zones')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={mix(A.kidneyLight, '#FFFFFF', 0.55)} />
          <Stop offset={`${CORTEX_LINE / 300}`} stopColor={mix(A.kidneyLight, '#FFFFFF', 0.45)} />
          <Stop offset={`${CORTEX_LINE / 300 + 0.01}`} stopColor={mix(A.medulla, '#FFFFFF', 0.62)} />
          <Stop offset="1" stopColor={mix(A.medulla, '#FFFFFF', 0.62 - 0.4 * medulla)} />
        </LinearGradient>
        <RadialGradient id={id('caps')} cx="50%" cy="50%" r="50%">
          <Stop offset="0.7" stopColor={filtrateColour} />
          <Stop offset="1" stopColor={mix(tubeWall, '#FFFFFF', 0.2)} />
        </RadialGradient>
        <RadialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFF3A8" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#FFF3A8" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Path d="M12 0 L238 0 Q250 0 250 12 L250 288 Q250 300 238 300 L12 300 Q0 300 0 288 L0 12 Q0 0 12 0 Z" fill={`url(#${id('zones')})`} />
      {/* peritubular capillaries around the cortical tubules */}
      {capillaries.map((c) => (
        <Path key={c} d={c} stroke={A.artery} strokeWidth={1.4} fill="none" opacity={0.45} />
      ))}
      {/* vasa recta beside a long loop */}
      {long ? (
        <G opacity={0.9}>
          <Tube d={`M150 46 L150 ${bottom + 4} C150 ${bottom + 26} 212 ${bottom + 26} 212 ${bottom + 4} L212 60`} width={4} wall={A.artery} fluid={mix(A.artery, A.vein, 0.4)} time={time} flow={bloodFlow * 0.6} shine={false} />
        </G>
      ) : null}
      {/* collecting duct, with water leaving it under ADH */}
      <Tube d={`${TO_DUCT} L228 298`} width={11} wall={tubeWall} fluid={ductFluid} time={time} flow={filtrate * 0.4} />
      {water > 0.05
        ? [0, 1, 2, 3, 4].map((k) => {
            const y = 150 + k * 28 + ((time * 14) % 28);
            return <Circle key={k} cx={240 + ((time * 6 + k * 3) % 6)} cy={y} r={1.6 + water * 1.6} fill={A.airDeep} opacity={water * 0.85} />;
          })
        : null}
      {/* the tubule: PCT, loop, DCT */}
      <Tube d={PCT} width={10} wall={tubeWall} fluid={filtrateColour} time={time} flow={filtrate} />
      <Tube d={loop} width={7} wall={tubeWall} fluid={filtrateColour} time={time} flow={filtrate * 0.8} />
      <Path d={`M190 ${Math.min(bottom, 180)} L190 128`} stroke={blockedLimb ? A.boneShade : A.mucosa} strokeWidth={10} strokeLinecap="round" opacity={blockedLimb ? 0.9 : 0.6} />
      <Tube d={DCT} width={8} wall={tubeWall} fluid={filtrateColour} time={time} flow={filtrate * 0.6} />
      {/* arterioles and glomerulus */}
      <Tube d={AFF} width={10 * afferent} wall={A.artery} fluid={mix(A.artery, '#FFFFFF', 0.15)} time={time} flow={bloodFlow} />
      <Tube d={EFF} width={8 * efferent} wall={A.artery} fluid={mix(A.artery, '#FFFFFF', 0.1)} time={time} flow={bloodFlow} />
      <Circle cx={70} cy={62} r={27} fill={`url(#${id('caps')})`} stroke={mix(tubeWall, '#000000', 0.25)} strokeWidth={2.5} />
      <GlomerularTuft cx={70} cy={63} r={19} />
      {/* juxtaglomerular apparatus: granular cells glow with renin release */}
      <Circle cx={60} cy={34} r={10 + 10 * renin} fill={`url(#${id('glow')})`} opacity={0.2 + 0.8 * renin} />
      {[0, 1, 2, 3].map((k) => (
        <Circle key={`g${k}`} cx={52 + k * 5} cy={36 - (k % 2) * 3} r={2.6} fill={mix(A.fat, A.artery, 0.3)} stroke={A.arteryDark} strokeWidth={0.6} />
      ))}
    </G>
  );
}

// The glomerulus: a ball of looping capillaries, drawn with depth (darker
// loops behind, brighter in front).
export function GlomerularTuft({ cx, cy, r, tone = 1 }: { cx: number; cy: number; r: number; tone?: number }) {
  const id = useSvgIds('tuft');
  const rand = seeded(3);
  const loops = Array.from({ length: 16 }, (_, i) => {
    const a = rand() * Math.PI * 2;
    const d = r * (0.15 + rand() * 0.6);
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d;
    const size = r * (0.32 + rand() * 0.22);
    const rot = rand() * 180;
    return { x, y, size, rot, depth: i / 16 };
  });
  return (
    <G>
      <Defs>
        <RadialGradient id={id('ball')} cx="40%" cy="35%" r="65%">
          <Stop offset="0" stopColor={mix(A.artery, '#FFFFFF', 0.2)} />
          <Stop offset="1" stopColor={A.arteryDark} />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r} fill={`url(#${id('ball')})`} opacity={0.9} />
      {loops.map((l, i) => (
        <G key={i} transform={`rotate(${l.rot} ${l.x} ${l.y})`}>
          <Path
            d={`M${l.x - l.size} ${l.y} C${l.x - l.size} ${l.y - l.size * 1.1} ${l.x + l.size} ${l.y - l.size * 1.1} ${l.x + l.size} ${l.y} C${l.x + l.size} ${l.y + l.size * 0.5} ${l.x + l.size * 0.2} ${l.y + l.size * 0.6} ${l.x} ${l.y + l.size * 0.2}`}
            stroke={mix(A.arteryDark, A.artery, l.depth * tone)}
            strokeWidth={r * 0.17}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M${l.x - l.size * 0.8} ${l.y - l.size * 0.3} C${l.x - l.size * 0.6} ${l.y - l.size * 0.85} ${l.x + l.size * 0.4} ${l.y - l.size * 0.95} ${l.x + l.size * 0.7} ${l.y - l.size * 0.4}`}
            stroke="#FFFFFF"
            strokeWidth={r * 0.04}
            fill="none"
            opacity={0.35 * l.depth}
          />
        </G>
      ))}
    </G>
  );
}

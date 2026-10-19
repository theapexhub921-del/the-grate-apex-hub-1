import { View } from 'react-native';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import type { StarlingState } from '@/data/simulations/capillary-starling';

import { Capillary, mix } from './anatomy/cells';
import { Tube } from './anatomy/kidney';
import { seeded } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 280;
const X0 = 20;
const X1 = 320;
const CAP_Y = 196; // top of the capillary
const CAP_H = 30;

const signed = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`;

// A capillary in its tissue, magnified: blood flows from the arteriole (left) to the venule
// (right); drops of fluid leave at the arterial end and return at the venous end; what is left
// drains into a lymphatic vessel. When filtration outruns drainage the tissue swells (oedema):
// the cells drift apart in pale fluid.
export function CapillaryStarlingGraphic({ state, time, reduceMotion }: GraphicProps<StarlingState>) {
  const t = reduceMotion ? 0 : time;
  const swell = Math.min(1, state.oedema / 60);
  const rand = seeded(12);
  const cells = Array.from({ length: 14 }, (_, i) => ({ x: X0 + 18 + (i % 7) * 42 + rand() * 10, y: 50 + Math.floor(i / 7) * 62 + rand() * 10, r: 16 + rand() * 4 }));
  const spread = 1 + 0.16 * swell;
  const outDrops = Math.round(Math.min(10, state.filtered * 0.9));
  const inDrops = Math.round(Math.min(10, state.reabsorbed * 0.9));
  const blocked = state.lymphCapacity < 2;
  const drop = (x: number, y: number, k: number) => <Ellipse key={k} cx={x} cy={y} rx={3} ry={4} fill={A.pleura} stroke={A.airDeep} strokeWidth={0.8} opacity={0.95} />;

  return (
    <View>
      <Canvas width={W} height={H} label={`A capillary in its tissue. Net pressure ${signed(state.netArterial)} mmHg at the arterial end, ${signed(state.netVenous)} at the venous end.${swell > 0.2 ? ' The tissue is swollen with fluid (oedema).' : ''}`}>
        <Defs>
          <LinearGradient id="csTissue" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mix(A.mucosa, '#FFFFFF', 0.55 + 0.2 * swell)} />
            <Stop offset="1" stopColor={mix(A.mucosa, A.pleura, 0.3 + 0.5 * swell)} />
          </LinearGradient>
        </Defs>
        {/* tissue and interstitial fluid */}
        <Rect x={0} y={10} width={W} height={CAP_Y - 4} rx={12} fill="url(#csTissue)" />
        {swell > 0.05 ? <Rect x={0} y={10} width={W} height={CAP_Y - 4} rx={12} fill={A.pleura} opacity={0.35 * swell} /> : null}
        {cells.map((c, i) => {
          const cx = X0 + (c.x - X0) * spread - 10 * swell;
          return (
            <G key={i}>
              <Path d={`M${cx - c.r} ${c.y} Q${cx - c.r} ${c.y - c.r} ${cx} ${c.y - c.r * 0.9} Q${cx + c.r} ${c.y - c.r} ${cx + c.r * 0.95} ${c.y} Q${cx + c.r} ${c.y + c.r} ${cx} ${c.y + c.r * 0.9} Q${cx - c.r} ${c.y + c.r} ${cx - c.r} ${c.y} Z`} fill={mix(A.mucosa, '#FFFFFF', 0.25)} stroke={mix(A.mucosa, '#000000', 0.2)} strokeWidth={1} />
              <Circle cx={cx + 2} cy={c.y} r={c.r * 0.33} fill={A.nucleus} opacity={0.8} />
            </G>
          );
        })}
        {/* lymphatic vessel draining the tissue */}
        <Tube d={`M352 20 C344 80 360 140 352 ${CAP_Y + 70}`} width={blocked ? 8 : 12 + Math.min(10, state.lymph * 0.6)} wall={mix(A.fat, '#FFFFFF', 0.3)} fluid={mix(A.fat, '#FFFFFF', 0.6)} time={t} flow={blocked ? 0 : 0.6} />
        {blocked ? <Path d="M340 110 L364 122 M340 122 L364 110" stroke={A.muscleDark} strokeWidth={3} strokeLinecap="round" /> : null}
        {/* the capillary: arteriole (red) to venule (bluer) */}
        <Capillary x={X0 - 20} y={CAP_Y} w={X1 - X0 + 40} h={CAP_H} time={t} speed={1} satAt={(f) => 0.97 - 0.25 * f} count={9} />
        {state.leaky
          ? [0.2, 0.45, 0.7].map((f) => <Rect key={f} x={X0 + (X1 - X0) * f} y={CAP_Y - 2} width={6} height={4} fill="url(#csTissue)" />)
          : null}
        {/* fluid out at the arterial end, back in at the venous end */}
        {Array.from({ length: outDrops }, (_, k) => {
          const f = ((k / Math.max(1, outDrops) + t * 0.35) % 1 + 1) % 1;
          return drop(X0 + 20 + (k % 4) * 22, CAP_Y - 6 - f * 70, k);
        })}
        {Array.from({ length: inDrops }, (_, k) => {
          const f = ((k / Math.max(1, inDrops) + t * 0.35) % 1 + 1) % 1;
          return drop(X1 - 80 + (k % 4) * 22, CAP_Y - 76 + f * 70, 100 + k);
        })}
        {state.leaky
          ? Array.from({ length: 6 }, (_, k) => <Circle key={`p${k}`} cx={X0 + 60 + k * 36} cy={CAP_Y - 10 - ((t * 20 + k * 13) % 50)} r={2.2} fill={A.urine} stroke={A.urineDark} strokeWidth={0.6} />)
          : null}
        <Tag x={80} y={CAP_Y + CAP_H + 18} text={`Arterial end: net ${signed(state.netArterial)} mmHg`} size={10} tone={state.netArterial > 0 ? 'warning' : 'primary'} />
        <Tag x={256} y={CAP_Y + CAP_H + 18} text={`Venous end: net ${signed(state.netVenous)} mmHg`} size={10} tone={state.netVenous < 0 ? 'success' : 'warning'} />
        <Tag x={352} y={14} text={blocked ? 'Lymphatic blocked' : 'Lymphatic'} size={10} tone={blocked ? 'error' : 'primary'} />
        {swell > 0.2 ? <Tag x={160} y={22} text="Oedema: tissue swollen with fluid" size={10} tone="error" /> : null}
      </Canvas>
    </View>
  );
}

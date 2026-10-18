import { View } from 'react-native';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { type GlucoseState } from '@/data/simulations/glucose-tm';

import { Capillary, mix } from './anatomy/cells';
import { seeded, useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const CELLS = 5;
const CW = 76;
const TOP = 96; // apical surface (brush border)
const BASE = 214; // basolateral surface

function Glucose({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  const r = 4.2 * s;
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
    return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
  return <Path d={`M${pts.replace(/ /g, ' L')} Z`} fill="#FFFFFF" stroke={A.urineDark} strokeWidth={1.1} opacity={opacity} />;
}

// Cells of the proximal tubule wall, magnified. Glucose in the tubular
// fluid (top) is carried into the cells on Na⁺-linked carriers in the
// brush border and on into the capillary (bottom). When the carriers are
// all busy, the rest flows on to the urine.
export function GlucoseTmGraphic({ state, time, reduceMotion }: GraphicProps<GlucoseState>) {
  const id = useSvgIds('tm');
  const t = reduceMotion ? 0 : time;
  const load = Math.min(1, state.filtered / 500);
  const taken = state.filtered > 0 ? state.reabsorbed / state.filtered : 0;
  const rand = seeded(4);
  const lumen = Array.from({ length: 34 }, () => ({ x: rand(), y: 26 + rand() * 56, k: rand() }));
  const carriers = Math.max(1, Math.round((3 * state.carriers) / 100));
  const busy = state.tm > 0 ? Math.min(1, state.filtered / state.tm) : 0;
  const crossing = Math.round(6 * Math.min(1.4, state.reabsorbed / 250));

  return (
    <View>
      <Canvas width={W} height={H} label={`Proximal tubule: ${Math.round(state.filtered)} mg/min of glucose filtered, ${Math.round(state.reabsorbed)} reabsorbed, ${Math.round(state.excreted)} left in the urine.`}>
        <Defs>
          <LinearGradient id={id('lumen')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mix(A.urine, '#FFFFFF', 0.75)} />
            <Stop offset="1" stopColor={mix(A.urine, '#FFFFFF', 0.55)} />
          </LinearGradient>
          <LinearGradient id={id('cell')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mix(A.mucosa, '#FFFFFF', 0.35)} />
            <Stop offset="1" stopColor={A.mucosa} />
          </LinearGradient>
        </Defs>
        {/* tubular fluid */}
        <Rect x={0} y={14} width={W} height={TOP - 4} fill={`url(#${id('lumen')})`} />
        {lumen.map((g, i) => {
          const x = ((g.x + t * 0.05) % 1) * W;
          // glucose is taken up along the tubule: fewer remain downstream
          const left = 1 - taken * (x / W);
          if (g.k > load * left * 1.6) return null;
          return <Glucose key={i} x={x} y={g.y} />;
        })}
        {/* epithelial cells with brush border, nuclei, mitochondria */}
        {Array.from({ length: CELLS + 1 }, (_, c) => {
          const x = c * CW - CW / 2 + 12;
          return (
            <G key={c}>
              <Rect x={x + 2} y={TOP} width={CW - 4} height={BASE - TOP} rx={10} fill={`url(#${id('cell')})`} stroke={mix(A.mucosa, '#000000', 0.25)} strokeWidth={1.2} />
              {Array.from({ length: 12 }, (_, k) => (
                <Rect key={k} x={x + 6 + k * 5.6} y={TOP - 9} width={3} height={11} rx={1.5} fill={mix(A.mucosa, '#FFFFFF', 0.2)} stroke={mix(A.mucosa, '#000000', 0.2)} strokeWidth={0.5} />
              ))}
              <Ellipse cx={x + CW / 2} cy={TOP + 62} rx={14} ry={12} fill={A.nucleus} opacity={0.85} />
              <Ellipse cx={x + CW / 2 - 4} cy={TOP + 58} rx={4} ry={3} fill="#FFFFFF" opacity={0.25} />
              {[0, 1, 2].map((m) => (
                <Ellipse key={m} cx={x + 16 + m * 22} cy={BASE - 18} rx={8} ry={3.5} fill={A.mitochondria} stroke={mix(A.mitochondria, '#000000', 0.3)} strokeWidth={0.6} transform={`rotate(${70 + m * 20} ${x + 16 + m * 22} ${BASE - 18})`} />
              ))}
              {/* Na⁺-glucose carriers in the apical membrane */}
              {Array.from({ length: carriers }, (_, k) => {
                const cx = x + 18 + (k * (CW - 32)) / Math.max(1, carriers - 1 || 1);
                return <Rect key={`c${k}`} x={cx - 4} y={TOP - 3} width={8} height={10} rx={3} fill={mix(A.tracer, '#FFFFFF', 0.2 + 0.4 * (1 - busy))} stroke={A.tracer} strokeWidth={0.8} />;
              })}
              {/* Na⁺/K⁺ pump in the basolateral membrane */}
              <Circle cx={x + CW / 2 + 18} cy={BASE} r={5} fill={state.pump ? A.boneShade : A.artery} stroke={state.pump ? A.boneShade : A.arteryDark} strokeWidth={1} opacity={state.pump ? 0.5 : 1} />
              {/* glucose crossing the cell */}
              {Array.from({ length: crossing }, (_, k) => {
                const f = (k / Math.max(1, crossing) + t * 0.18 + c * 0.13) % 1;
                return <Glucose key={`g${k}`} x={x + 18 + ((k * 13) % (CW - 30))} y={TOP + 6 + f * (BASE - TOP + 30)} s={0.85} opacity={0.95} />;
              })}
            </G>
          );
        })}
        <Capillary x={0} y={234} w={W} h={34} time={t} speed={0.8} satAt={() => 0.95} count={8} />
        <Tag x={58} y={22} text="Tubular fluid" size={10} />
        <Tag x={W - 80} y={22} text={state.excreted > 0 ? 'Glucose to urine' : 'No glucose left'} tone={state.excreted > 0 ? 'error' : 'success'} size={10} />
        <Tag x={W - 60} y={BASE + 6} text={state.pump ? 'Pump blocked' : 'Na⁺/K⁺ pump'} tone={state.pump ? 'error' : 'primary'} size={9} />
        <Tag x={70} y={284} text="Capillary" size={10} />
        <Tag x={210} y={TOP - 18} text={busy >= 1 ? 'Carriers saturated (Tm)' : 'Na⁺–glucose carriers'} tone={busy >= 1 ? 'warning' : 'primary'} size={9} />
      </Canvas>
    </View>
  );
}

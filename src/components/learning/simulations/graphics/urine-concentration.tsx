import { View } from 'react-native';
import { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { DRUGS, type ConcentrationState } from '@/data/simulations/urine-concentration';

import { mix } from './anatomy/cells';
import { Nephron } from './anatomy/kidney';
import { useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 320;

// The colour of urine from very dilute (pale straw) to concentrated (amber).
export function urineColour(mosm: number) {
  return mix('#F7F0C2', '#C98A1E', Math.min(1, Math.max(0, (mosm - 100) / 1100)));
}

// A long-looped nephron in the medulla, shaded by the salt gradient, the
// collecting duct losing water under ADH, and the urine that results
// dripping into a specimen cup.
export function UrineConcentrationGraphic({ state, time, reduceMotion }: GraphicProps<ConcentrationState>) {
  const id = useSvgIds('uc');
  const t = reduceMotion ? 0 : time;
  const urine = urineColour(state.urineOsm);
  const level = Math.min(1, state.flow / 9);
  const dripEvery = Math.max(0.25, 2.2 / Math.max(0.2, state.flow));
  const drip = (t % dripEvery) / dripEvery;
  const depthTag = (frac: number) => Math.round(300 + (state.peak - 300) * frac);

  return (
    <View>
      <Canvas width={W} height={H} label={`Medullary gradient up to ${Math.round(state.peak)} mOsm; urine ${Math.round(state.urineOsm)} mOsm, ${state.flow.toFixed(1)} L a day. ${DRUGS[state.drug]}.`}>
        <Defs>
          <LinearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.15} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.5} />
          </LinearGradient>
        </Defs>
        <G transform="translate(36 8) scale(1.0 1.02)">
          <Nephron long time={t} filtrate={1} bloodFlow={0.6} ductFluid={urine} water={state.adh} medulla={state.gradient} blockedLimb={state.drug === 1} />
        </G>
        {/* osmolality down the medulla */}
        {[0, 0.33, 0.66, 1].map((f) => (
          <Tag key={f} x={18} y={140 + f * 150} text={`${depthTag(f)}`} size={9} tone={f === 1 && state.peak > 1000 ? 'warning' : 'primary'} />
        ))}
        <Tag x={18} y={124} text="mOsm" size={9} />
        {/* urine dripping into a cup */}
        {/* drop falls from the collecting duct */}
        <Path d={`M330 ${150 + drip * 70} q-5 8 0 11 q5 -3 0 -11 Z`} fill={urine} stroke={mix(urine, '#000000', 0.3)} strokeWidth={0.6} opacity={drip < 0.95 ? 1 : 0} />
        <Path d="M300 230 L306 312 L354 312 L360 230 Z" fill="none" stroke={A.boneShade} strokeWidth={2} />
        <Path d={`M${302 + 2 * (1 - level)} ${312 - 80 * level} L306 312 L354 312 L${358 - 2 * (1 - level)} ${312 - 80 * level} Z`} fill={urine} opacity={0.92} />
        <Path d="M300 230 L306 312 L354 312 L360 230 Z" fill={`url(#${id('glass')})`} />
        <Tag x={330} y={136} text={`Urine ${Math.round(state.urineOsm)} mOsm`} size={10} tone={state.urineOsm < 200 ? 'warning' : 'primary'} />
        <Tag x={330} y={220} text={`${state.flow.toFixed(1)} L a day`} size={10} />
        {state.drug === 1 ? <Tag x={262} y={196} text="Na⁺-K⁺-2Cl⁻ blocked" tone="error" size={9} /> : null}
        {state.adh > 0.5 ? <Tag x={330} y={110} text="ADH: water out" tone="success" size={9} /> : state.adh < 0.1 ? <Tag x={330} y={110} text="No ADH: duct watertight" tone="error" size={9} /> : null}
      </Canvas>
    </View>
  );
}

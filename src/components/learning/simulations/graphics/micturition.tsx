import { View } from 'react-native';
import { Circle, ClipPath, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { LESIONS, type BladderState } from '@/data/simulations/micturition';

import { mix } from './anatomy/cells';
import { Tube } from './anatomy/kidney';
import { useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 320;
const BX = 236; // bladder centre
const NECK = 236; // bladder neck (internal sphincter)

// The bladder in the pelvis, cut open: the detrusor wall, folded lining,
// the urine inside, the internal sphincter at the neck and the external
// sphincter in the pelvic floor, with the three nerves from the spinal
// cord glowing with their activity. Voiding shows the stream.
export function MicturitionGraphic({ state, time, reduceMotion }: GraphicProps<BladderState>) {
  const id = useSvgIds('bl');
  const t = reduceMotion ? 0 : time;
  const v = state.voiding ? Math.max(60, state.volume * (0.55 - 0.25 * ((t * 0.25) % 1))) : state.volume;
  const r = 34 + 62 * Math.cbrt(Math.max(0, v) / 600);
  const top = NECK - 2 * r + 8;
  const wall = state.voiding ? 11 : 9 - Math.min(4, state.volume / 150);
  const folds = Math.max(0, 1 - state.volume / 350);
  const fill = Math.min(1, state.volume / 500);
  const sac = `M${BX} ${NECK} C${BX - r * 1.25} ${NECK - 4} ${BX - r * 1.15} ${top} ${BX} ${top} C${BX + r * 1.15} ${top} ${BX + r * 1.25} ${NECK - 4} ${BX} ${NECK} Z`;
  const nerve = (k: number, cut: boolean) => (cut ? A.boneShade : mix(A.nerveDark, '#FFF3A8', k));
  const urineTop = NECK - (NECK - top - wall) * (0.15 + 0.85 * fill);

  return (
    <View>
      <Canvas width={W} height={H} label={`Bladder holding ${Math.round(state.volume)} ml at ${Math.round(state.pressure)} cm H₂O. ${state.voiding ? 'Voiding.' : 'Storing.'} Nerve injury: ${LESIONS[state.lesion]}.`}>
        <Defs>
          <RadialGradient id={id('wall')} cx="40%" cy="35%" r="70%">
            <Stop offset="0" stopColor={A.muscleLight} />
            <Stop offset="1" stopColor={A.muscleDark} />
          </RadialGradient>
          <LinearGradient id={id('urine')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={mix(A.urine, '#FFFFFF', 0.35)} />
            <Stop offset="1" stopColor={A.urine} />
          </LinearGradient>
          <LinearGradient id={id('bone')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={A.bone} />
            <Stop offset="1" stopColor={A.boneShade} />
          </LinearGradient>
          <RadialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFF3A8" stopOpacity={0.9} />
            <Stop offset="1" stopColor="#FFF3A8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {/* spinal cord with its segments */}
        <Rect x={22} y={20} width={30} height={250} rx={14} fill={A.cartilage} stroke={A.cartilageShade} strokeWidth={1.4} />
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <Path key={k} d={`M24 ${50 + k * 32} L50 ${50 + k * 32}`} stroke={A.cartilageShade} strokeWidth={1} opacity={0.6} />
        ))}
        <Tag x={37} y={72} text="T12–L2" size={9} />
        <Tag x={37} y={200} text="S2–S4" size={9} />
        {/* pelvic bones and floor */}
        <Path d="M110 300 C120 262 150 250 176 262 C188 270 190 290 186 312 L110 312 Z" fill={`url(#${id('bone')})`} stroke={A.boneShade} />
        <Path d="M362 300 C352 262 322 250 296 262 C284 270 282 290 286 312 L362 312 Z" fill={`url(#${id('bone')})`} stroke={A.boneShade} />
        <Path d="M150 262 C190 252 282 252 322 262 L322 280 C282 270 190 270 150 280 Z" fill={A.muscle} opacity={0.85} />
        {Array.from({ length: 14 }, (_, k) => (
          <Path key={k} d={`M${156 + k * 12} 262 L${160 + k * 12} 278`} stroke={A.muscleDark} strokeWidth={0.8} opacity={0.5} />
        ))}
        {/* ureters arriving */}
        <Tube d={`M${BX - 120} 10 C${BX - 120} ${top + 30} ${BX - r * 1.0} ${NECK - r * 0.7} ${BX - r * 0.7} ${NECK - r * 0.45}`} width={7} wall={A.mucosa} fluid={A.urine} time={t} flow={0.5} />
        <Tube d={`M${BX + 120} 10 C${BX + 120} ${top + 30} ${BX + r * 1.0} ${NECK - r * 0.7} ${BX + r * 0.7} ${NECK - r * 0.45}`} width={7} wall={A.mucosa} fluid={A.urine} time={t} flow={0.5} />
        {/* bladder wall (detrusor), lining and urine */}
        <Path d={sac} fill={`url(#${id('wall')})`} stroke={A.muscleDark} strokeWidth={1.4} />
        {Array.from({ length: 10 }, (_, k) => {
          const a = Math.PI * (0.1 + 0.08 * k);
          return <Path key={k} d={`M${BX - Math.cos(a) * r} ${NECK - r * 0.2 - Math.sin(a) * r * 0.9} q${8} ${-6} ${16} ${-2}`} stroke={A.muscleDark} strokeWidth={1} fill="none" opacity={0.45} />;
        })}
        <G transform={`translate(${BX} ${NECK}) scale(${(r - wall) / r}) translate(${-BX} ${-NECK})`}>
          <Defs>
            <ClipPath id={id('inside')}>
              <Path d={sac} />
            </ClipPath>
          </Defs>
          <Path d={sac} fill={A.mucosa} />
          <Path clipPath={`url(#${id('inside')})`} d={`M${BX - r * 1.4} ${urineTop} L${BX + r * 1.4} ${urineTop} L${BX + r * 1.4} ${NECK + 4} L${BX - r * 1.4} ${NECK + 4} Z`} fill={`url(#${id('urine')})`} opacity={0.95} />
        </G>
        {folds > 0.05
          ? Array.from({ length: 6 }, (_, k) => (
              <Path key={`f${k}`} d={`M${BX - r * 0.6 + k * r * 0.24} ${top + wall + 6} q4 ${10 * folds} 0 ${20 * folds} q-4 ${10 * folds} 0 ${18 * folds}`} stroke={mix(A.mucosa, '#000000', 0.25)} strokeWidth={1.4} fill="none" opacity={folds} />
            ))
          : null}
        {/* internal sphincter (bladder neck) and urethra through the pelvic floor */}
        <Rect x={BX - 12} y={NECK - 4} width={24} height={12} rx={6} fill={state.voiding ? A.muscleLight : A.muscleDark} />
        <Path d={`M${BX} ${NECK + 6} L${BX} 310`} stroke={A.mucosa} strokeWidth={10} strokeLinecap="round" />
        <Path d={`M${BX} ${NECK + 6} L${BX} 310`} stroke={state.voiding ? A.urine : mix(A.mucosa, '#000000', 0.25)} strokeWidth={state.voiding ? 5 : 1.4} strokeDasharray={state.voiding ? '8 4' : undefined} strokeDashoffset={-t * 40} />
        <Rect x={BX - 16} y={262} width={32} height={16} rx={6} fill={state.pudendal > 0.5 ? A.muscle : A.muscleLight} stroke={A.muscleDark} strokeWidth={1} />
        {[0, 1, 2, 3].map((k) => (
          <Path key={`e${k}`} d={`M${BX - 14 + k * 9} 263 L${BX - 12 + k * 9} 277`} stroke={A.muscleDark} strokeWidth={0.8} opacity={0.6} />
        ))}
        {/* nerves: hypogastric (sympathetic), pelvic (parasympathetic), pudendal (somatic) */}
        <Path d={`M52 66 C110 70 150 150 ${BX - 14} ${NECK - 2}`} stroke={nerve(state.sympathetic, state.lesion === 2)} strokeWidth={2 + 2 * state.sympathetic} fill="none" strokeLinecap="round" strokeDasharray={state.lesion === 2 ? '6 8' : undefined} />
        <Path d={`M52 196 C110 190 140 ${NECK - r * 0.6} ${BX - r * 0.8} ${NECK - r * 0.6}`} stroke={nerve(state.parasympathetic, state.lesion === 1)} strokeWidth={2 + 2.5 * state.parasympathetic} fill="none" strokeLinecap="round" strokeDasharray={state.lesion === 1 ? '6 8' : undefined} />
        <Path d={`M52 220 C100 236 140 280 ${BX - 16} 270`} stroke={nerve(state.pudendal, state.lesion === 3)} strokeWidth={2 + 2 * state.pudendal} fill="none" strokeLinecap="round" strokeDasharray={state.lesion === 3 ? '6 8' : undefined} />
        {state.voiding ? <Circle cx={BX} cy={(top + NECK) / 2} r={r * 1.1} fill={`url(#${id('glow')})`} opacity={0.25} /> : null}
        <Tag x={106} y={98} text="Hypogastric" size={9} tone={state.lesion === 2 ? 'error' : 'primary'} />
        <Tag x={112} y={178} text="Pelvic" size={9} tone={state.lesion === 1 ? 'error' : 'primary'} />
        <Tag x={112} y={246} text="Pudendal" size={9} tone={state.lesion === 3 ? 'error' : 'primary'} />
        <Tag x={BX} y={Math.max(14, top - 14)} text={`${Math.round(state.volume)} ml · ${state.voiding ? 'voiding' : 'storing'}`} size={10} tone={state.voiding ? 'success' : 'primary'} />
        <Tag x={352} y={278} text="External sphincter" size={9} />
      </Canvas>
    </View>
  );
}

import { View } from 'react-native';
import { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { SUBSTANCES, type ClearanceState } from '@/data/simulations/renal-clearance';

import { mix } from './anatomy/cells';
import { KidneySection } from './anatomy/kidney';
import { useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 320;

// The kidney with the substance shown in green: particles in the renal
// artery (plasma concentration), fewer left in the renal vein (the plasma
// cleared of it) and the green urine it ends up in.
export function RenalClearanceGraphic({ state, time, reduceMotion }: GraphicProps<ClearanceState>) {
  const t = reduceMotion ? 0 : time;
  const id = useSvgIds('cl');
  const p = Math.min(1, state.plasma / 2);
  const tint = (k: number, base: string) => mix(base, A.tracer, Math.min(0.85, k));
  const artery = A.artery;
  const vein = A.vein;
  // tracer particles: denser where the concentration is higher
  const gap = (k: number) => (k <= 0.02 ? 0 : Math.max(3, 28 * (1 - k)));
  const inArtery = 0.3 + 0.6 * p;
  const inVein = inArtery * (1 - state.extraction);
  const urineK = Math.min(1, state.urineConc / 400);
  const urine = tint(0.15 + 0.75 * urineK, A.urine);
  const cleared = Math.round(state.extraction * 100);

  return (
    <View>
      <Canvas width={W} height={H} label={`${SUBSTANCES[state.substance]}: clearance ${Math.round(state.clearance)} ml/min; about ${cleared}% removed from the plasma passing through the kidney.`}>
        <Defs>
          <LinearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.5} />
          </LinearGradient>
        </Defs>
        <G transform="translate(30 14) scale(1.06)">
          <KidneySection arteryTint={artery} veinTint={vein} urine={urine} />
        </G>
        {/* the vessels run on to the right */}
        <Path d="M262 122 L400 122" stroke={mix(artery, '#000000', 0.3)} strokeWidth={11} />
        <Path d="M262 122 L400 122" stroke={artery} strokeWidth={8} />
        <Path d="M262 140 L400 140" stroke={mix(vein, '#000000', 0.25)} strokeWidth={14} />
        <Path d="M262 140 L400 140" stroke={vein} strokeWidth={11} />
        <Path d="M262 122 L400 122" stroke={A.tracer} strokeWidth={4} strokeLinecap="round" strokeDasharray={`0.1 ${gap(inArtery)}`} strokeDashoffset={t * 30} opacity={0.95} />
        {gap(inVein) > 0 ? <Path d="M400 140 L262 140" stroke={A.tracer} strokeWidth={4} strokeLinecap="round" strokeDasharray={`0.1 ${gap(inVein)}`} strokeDashoffset={t * 30} opacity={0.95} /> : null}
        {/* urine collected */}
        <Path d="M300 228 L306 306 L354 306 L360 228 Z" fill="none" stroke={A.boneShade} strokeWidth={2} />
        <Path d="M303 262 L306 306 L354 306 L357 262 Z" fill={urine} opacity={0.95} />
        <Path d="M300 228 L306 306 L354 306 L360 228 Z" fill={`url(#${id('glass')})`} />
        <Tag x={340} y={104} text={`Renal artery · P ${state.plasma.toFixed(1)} mg/ml`} size={9} />
        <Tag x={340} y={160} text={`Renal vein · ${cleared}% cleared`} size={9} tone={cleared > 50 ? 'success' : 'primary'} />
        <Tag x={330} y={214} text={`Urine · ${state.readouts.excretion.toFixed(0)} mg/min`} size={9} />
        <Tag x={120} y={302} text={SUBSTANCES[state.substance]} />
      </Canvas>
    </View>
  );
}

import { View } from 'react-native';
import { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { type VentilationState } from '@/data/simulations/alveolar-ventilation';

import { AlveolarCluster, mix } from './anatomy/cells';
import { Diaphragm, Heart, Lungs, Torso, useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;

// Breathing at the chosen rate and depth. Each breath fills the airways
// (and any snorkel) first — that air never reaches the alveoli — and only
// the rest freshens the alveoli, shown magnified on the right.
export function AlveolarVentilationGraphic({ state, time, reduceMotion }: GraphicProps<VentilationState>) {
  const id = useSvgIds('av');
  const period = 60 / Math.max(1, state.rate);
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time) / period)) / 2;
  const fraction = state.tidal > 0 ? state.perBreath / state.tidal : 0;
  const inflate = 0.1 + phase * Math.min(1.2, state.tidal / 900);
  const snorkel = (state.dead - 150) / 500; // 0–1
  const airwayAir = mix(A.cartilageShade, A.airDeep, phase);
  const fresh = Math.min(1, state.readouts.alveolar / 8);

  return (
    <View>
      <Canvas width={W} height={H} label={`${Math.round(state.rate)} breaths a minute of ${Math.round(state.tidal)} ml: ${Math.round(Math.min(state.tidal, state.dead))} ml stays in the airways${snorkel > 0 ? ' and snorkel' : ''}, ${Math.round(state.perBreath)} ml reaches the alveoli.`}>
        <Defs>
          <LinearGradient id={id('tube')} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={A.boneShade} />
            <Stop offset="0.5" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor={A.boneShade} />
          </LinearGradient>
        </Defs>
        <G transform="translate(4 56) scale(0.98)">
          <Torso />
          <Diaphragm inflate={inflate} />
          <Heart />
          <Lungs inflate={inflate} lumen={airwayAir} fresh={phase * fraction} />
        </G>
        {snorkel > 0 ? (
          <G>
            <Rect x={110} y={56 - 120 * snorkel} width={12} height={120 * snorkel + 4} rx={4} fill={`url(#${id('tube')})`} stroke={A.boneShade} />
            <Rect x={113} y={56 - 120 * snorkel} width={6} height={(120 * snorkel + 4) * phase} fill={A.airDeep} opacity={0.8} />
            <Tag x={160} y={Math.max(14, 50 - 120 * snorkel)} text={`Snorkel +${Math.round(state.dead - 150)} ml`} size={10} anchor="start" tone="error" />
          </G>
        ) : null}
        <Tag x={160} y={snorkel > 0 ? 70 : 40} text="Airways: dead space 150 ml" size={10} anchor="start" />
        <AlveolarCluster cx={330} cy={170} size={54} inflate={inflate} fresh={fresh} />
        <Tag x={330} y={246} text="Alveoli" />
        <Tag x={330} y={268} text={`${Math.round(state.perBreath)} ml fresh per breath`} size={10} tone={state.perBreath < 200 ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

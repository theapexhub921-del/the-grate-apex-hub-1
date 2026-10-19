import { View } from 'react-native';
import { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { type VentilationState } from '@/data/simulations/alveolar-ventilation';

import { AlveolarCluster } from './anatomy/cells';
import { useSvgIds } from './anatomy/lungs';
import { Organ3D } from '../organ-3d';
import { chestFrame, rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 180;

// Breathing at the chosen rate and depth. Each breath fills the airways
// (and any snorkel) first — that air never reaches the alveoli — and only
// the rest freshens the alveoli, shown magnified on the right.
export function AlveolarVentilationGraphic({ state, time, reduceMotion }: GraphicProps<VentilationState>) {
  const id = useSvgIds('av');
  const period = 60 / Math.max(1, state.rate);
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time) / period)) / 2;
  const inflate = 0.1 + phase * Math.min(1.2, state.tidal / 900);
  const snorkel = (state.dead - 150) / 500; // 0–1
  const fresh = Math.min(1, state.readouts.alveolar / 8);

  // the airways glow as each breath fills them (dead space); the lungs swell with the rest
  const frame = chestFrame({ inflate: rounded(inflate, 0.02), extra: { glow: { airways: rounded(0.25 + 0.6 * phase, 0.05) }, glowColor: { airways: '#7fc4ff' } } });

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="chest" frame={frame} label={`Breathing ${Math.round(state.rate)} times a minute: the airways fill first (dead space), then the alveoli`} />
      <Canvas width={W} height={H} label={`${Math.round(state.rate)} breaths a minute of ${Math.round(state.tidal)} ml: ${Math.round(Math.min(state.tidal, state.dead))} ml stays in the airways${snorkel > 0 ? ' and snorkel' : ''}, ${Math.round(state.perBreath)} ml reaches the alveoli.`}>
        <Defs>
          <LinearGradient id={id('tube')} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={A.boneShade} />
            <Stop offset="0.5" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor={A.boneShade} />
          </LinearGradient>
        </Defs>
        {snorkel > 0 ? (
          <G>
            <Rect x={20} y={40} width={150 * snorkel + 20} height={14} rx={6} fill={`url(#${id('tube')})`} stroke={A.boneShade} />
            <Rect x={23} y={43} width={(150 * snorkel + 14) * phase} height={8} rx={4} fill={A.airDeep} opacity={0.85} />
            <Tag x={20} y={22} text={`Snorkel +${Math.round(state.dead - 150)} ml`} size={10} anchor="start" tone="error" />
          </G>
        ) : null}
        <Tag x={20} y={snorkel > 0 ? 80 : 30} text="Airways: dead space 150 ml" size={10} anchor="start" />
        <AlveolarCluster cx={300} cy={90} size={54} inflate={inflate} fresh={fresh} />
        <Tag x={100} y={130} text="Alveoli (magnified)" />
        <Tag x={100} y={156} text={`${Math.round(state.perBreath)} ml fresh per breath`} size={10} tone={state.perBreath < 200 ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

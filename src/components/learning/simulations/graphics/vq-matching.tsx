import { View } from 'react-native';
import { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { MEMBRANES, VQ_KINDS, type VqState } from '@/data/simulations/vq-matching';

import { Capillary, mix } from './anatomy/cells';
import { useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;

// O₂ saturation from PO₂ (adult Hb, P50 ≈ 26.6) for colouring the blood.
const sat = (po2: number) => 1 / (1 + Math.pow(26.6 / Math.max(1, po2), 2.7));

// One alveolus and the capillary under it. Air comes in down the
// bronchiole (fresh air drawn bluer), blood flows left to right and
// leaves the colour its PO₂ allows.
export function VqMatchingGraphic({ state, time, reduceMotion }: GraphicProps<VqState>) {
  const id = useSvgIds('vq');
  const v = state.vq <= 1 ? state.vq : 1;
  const q = state.vq <= 1 ? 1 : 1 / state.vq;
  const t = reduceMotion ? 0 : time;
  const air = mix(A.airDeep, A.air, Math.min(1, state.alvO2 / 150));
  const wall = state.membrane === 1 ? 9 : 3;
  const sacR = state.membrane === 2 ? 72 : 84;
  const bronchW = 6 + 22 * v;
  const puffs = Array.from({ length: 5 }, (_, i) => ((i / 5 + t * 0.25 * (0.2 + v)) % 1));

  return (
    <View>
      <Canvas width={W} height={H} label={`V/Q ${state.vq.toFixed(2)}: ${VQ_KINDS[state.readouts.kind] ?? ''}. Alveolar PO₂ ${Math.round(state.alvO2)}, blood leaves at PO₂ ${Math.round(state.artO2)} mmHg.`}>
        <Defs>
          <RadialGradient id={id('sac')} cx="40%" cy="35%" r="70%">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="0.6" stopColor={A.lungLight} />
            <Stop offset="1" stopColor={A.lung} />
          </RadialGradient>
        </Defs>
        {/* bronchiole: wide when well ventilated, nearly shut when blocked */}
        <Path d={`M${200 - bronchW / 2 - 6} 0 L${200 - bronchW / 2 - 6} 50 L${200 + bronchW / 2 + 6} 50 L${200 + bronchW / 2 + 6} 0 Z`} fill={A.cartilage} stroke={A.cartilageShade} strokeWidth={1.4} />
        <Path d={`M${200 - bronchW / 2} 0 L${200 - bronchW / 2} 54 L${200 + bronchW / 2} 54 L${200 + bronchW / 2} 0 Z`} fill={air} />
        {/* the alveolus */}
        <Circle cx={200} cy={136} r={sacR} fill={`url(#${id('sac')})`} stroke={state.membrane === 1 ? A.cartilageShade : A.lungEdge} strokeWidth={wall} strokeDasharray={state.membrane === 2 ? '40 10 22 14' : undefined} />
        <Circle cx={200} cy={136} r={sacR - wall - 6} fill={air} opacity={0.75} />
        {v > 0.02
          ? puffs.map((p, i) => <Circle key={i} cx={200 + Math.sin(i * 2.1) * bronchW * 0.25} cy={p * 120} r={2.2 + v * 1.5} fill="#FFFFFF" opacity={0.75 * (1 - p)} />)
          : null}
        <Tag x={200} y={122} text={`Alveolar PO₂ ${Math.round(state.alvO2)}`} />
        <Tag x={200} y={146} text={`PCO₂ ${Math.round(state.alvCO2)}`} size={10} />
        {/* the capillary: blood flow shrinks as perfusion falls */}
        <Capillary x={20} y={226} w={360} h={10 + 20 * q} time={t} speed={0.3 + q} satAt={(f) => 0.75 + (sat(state.artO2) - 0.75) * Math.min(1, f * 2.2)} />
        <Tag x={64} y={286} text="Blood in · PO₂ 40" size={10} />
        <Tag x={326} y={286} text={`Out · PO₂ ${Math.round(state.artO2)}`} size={10} tone={state.artO2 < 80 ? 'error' : 'primary'} />
        <Tag x={312} y={30} text={MEMBRANES[state.membrane]} size={10} tone={state.membrane ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

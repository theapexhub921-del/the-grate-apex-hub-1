import { View } from 'react-native';
import { G } from 'react-native-svg';

import { CONDITIONS, type ComplianceState } from '@/data/simulations/lung-compliance';

import { AlveolarCluster } from './anatomy/cells';
import { Diaphragm, Heart, Lungs } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const BREATH = 4;
const KIND = ['normal', 'fibrosis', 'oedema', 'emphysema'] as const;

// The lungs breathing with the same pressure change, and a magnified
// cluster of alveoli showing surfactant, scarring, fluid or broken walls.
export function LungComplianceGraphic({ state, time, reduceMotion }: GraphicProps<ComplianceState>) {
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time) / BREATH)) / 2;
  const depth = Math.min(1.3, state.tidal / 800);
  const inflate = (state.condition === 3 ? 0.45 : 0.1) + phase * depth;
  const surfactant = state.surfactant / 100;

  return (
    <View>
      <Canvas width={W} height={H} label={`${CONDITIONS[state.condition]}, surfactant ${Math.round(state.surfactant)}%: each breath is ${Math.round(state.tidal)} ml.`}>
        <G transform="translate(4 30) scale(0.98)">
          <Diaphragm inflate={inflate} />
          <Heart />
          <Lungs inflate={inflate} stiff={state.condition === 1 ? 1 : 0} showAirways={false} />
        </G>
        <AlveolarCluster cx={322} cy={150} size={64} inflate={0.2 + phase * Math.min(1, depth)} surfactant={surfactant} condition={KIND[state.condition] ?? 'normal'} />
        <Tag x={322} y={254} text="Alveoli (magnified)" />
        <Tag x={322} y={276} text={surfactant < 0.4 && state.condition === 0 ? 'Collapsing: little surfactant' : CONDITIONS[state.condition]} tone={state.condition === 0 && surfactant >= 0.4 ? 'primary' : 'error'} size={10} />
      </Canvas>
    </View>
  );
}

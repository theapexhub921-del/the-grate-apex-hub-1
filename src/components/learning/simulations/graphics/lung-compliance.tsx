import { View } from 'react-native';

import { CONDITIONS, type ComplianceState } from '@/data/simulations/lung-compliance';

import { AlveolarCluster } from './anatomy/cells';
import { Organ3D } from '../organ-3d';
import { chestFrame, rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 210;
const BREATH = 4;
const KIND = ['normal', 'fibrosis', 'oedema', 'emphysema'] as const;

// The lungs breathing with the same pressure change, and a magnified
// cluster of alveoli showing surfactant, scarring, fluid or broken walls.
export function LungComplianceGraphic({ state, time, reduceMotion }: GraphicProps<ComplianceState>) {
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time) / BREATH)) / 2;
  const depth = Math.min(1.3, state.tidal / 800);
  const inflate = (state.condition === 3 ? 0.45 : 0.1) + phase * depth;
  const surfactant = state.surfactant / 100;

  const lungColour = ['#c9878e', '#bfa3a3', '#a8646e', '#d9a9ae'][state.condition];
  const frame = chestFrame({ inflate: rounded(inflate, 0.02), extra: { color: { rightLung: lungColour, leftLung: lungColour } } });

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="chest" frame={frame} label={`The lungs breathing ${Math.round(state.tidal)} ml with each breath: ${CONDITIONS[state.condition].toLowerCase()}`} />
      <Canvas width={W} height={H} label={`${CONDITIONS[state.condition]}, surfactant ${Math.round(state.surfactant)}%: each breath is ${Math.round(state.tidal)} ml.`}>
        <AlveolarCluster cx={120} cy={110} size={70} inflate={0.2 + phase * Math.min(1, depth)} surfactant={surfactant} condition={KIND[state.condition] ?? 'normal'} />
        <Tag x={290} y={90} text="Alveoli (magnified)" />
        <Tag x={290} y={118} text={surfactant < 0.4 && state.condition === 0 ? 'Collapsing: little surfactant' : CONDITIONS[state.condition]} tone={state.condition === 0 && surfactant >= 0.4 ? 'primary' : 'error'} size={10} />
      </Canvas>
    </View>
  );
}

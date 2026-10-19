import { View } from 'react-native';

import { FUNCTIONS, REGIONS, type BrainState } from '@/data/simulations/brain-lesion';

import { Organ3D } from '../organ-3d';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

// Which part of the real brain (scenes.js → brain) each lesion damages.
const DAMAGE = ['', 'broca', 'prefrontal', 'wernicke', 'parietalL', 'parietalR', 'v1', 'visual', 'hippocampi', 'callosum', 'pons'];

// The real brain from the left, its lobes tinted; the damaged area glows red. Below, every
// function checked, lost or kept.
export function BrainLesionGraphic({ state }: GraphicProps<BrainState>) {
  const region = DAMAGE[state.region];
  const frame = region ? { glow: { [region]: 1 }, glowColor: { [region]: '#ff2a1a' }, color: { [region]: '#d8261a' } } : {};
  const rows = Math.ceil(FUNCTIONS.length / 2);
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="brain" frame={frame} label={`The brain from the left. ${REGIONS[state.region]}. ${state.lost.length} functions affected.`} />
      <Canvas width={400} height={rows * 26 + 8} label={`Functions: ${FUNCTIONS.map((f) => `${f.label} ${state.lost.includes(f.key) ? 'lost' : 'kept'}`).join(', ')}.`}>
        {FUNCTIONS.map((f, i) => {
          const lost = state.lost.includes(f.key);
          return <Tag key={f.key} x={i < rows ? 100 : 300} y={18 + (i % rows) * 26} text={`${f.label}: ${lost ? 'lost' : 'kept'}`} tone={lost ? 'error' : 'success'} size={10} />;
        })}
      </Canvas>
    </View>
  );
}

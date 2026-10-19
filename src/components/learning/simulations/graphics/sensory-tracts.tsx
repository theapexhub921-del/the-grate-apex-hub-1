import { View } from 'react-native';

import { LESIONS, type TractState } from '@/data/simulations/sensory-tracts';

import { Organ3D } from '../organ-3d';
import type { OrganFrame } from '../organ-3d-types';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const GREY = '#9b9b9b';
const RED = '#ff2a1a';

// The real spinal cord at T10 with its tracts colour-coded: dorsal columns (blue),
// spinothalamic (orange), corticospinal (green). Cut tracts turn grey and the lesion glows red,
// on the side it is on. A thalamic lesion is shown on the deep brain instead.
export function SensoryTractsGraphic({ state }: GraphicProps<TractState>) {
  const c = state.cut;
  const thalamic = state.lesion === 5;
  const frame: OrganFrame = thalamic
    ? { glow: { thalamus: 1 }, glowColor: { thalamus: RED } }
    : {
        color: {
          ...(state.lesion === 4 ? { lesion: RED } : state.lesion >= 1 && state.lesion <= 3 ? { lesionR: RED } : {}),
          ...Object.fromEntries((['dcR', 'dcL', 'stR', 'stL', 'csR', 'csL'] as const).filter((k) => c[k]).map((k) => [k, GREY])),
        },
        glow: { lesion: state.lesion === 4 ? 1 : 0, lesionR: state.lesion >= 1 && state.lesion <= 3 ? 1 : 0 },
        glowColor: { lesion: RED, lesionR: RED },
        // the damaged band is drawn solid red so it shows through the clear white matter
        opacity: state.lesion === 4 ? { lesion: 1 } : state.lesion >= 1 && state.lesion <= 3 ? { lesionR: 1 } : {},
      };
  const side = (label: string, touch: number, pain: number, move: number, x: number) => (
    <>
      <Tag x={x} y={16} text={label} size={11} />
      <Tag x={x} y={42} text={`Vibration, position: ${touch ? 'normal' : 'lost'}`} size={10} tone={touch ? 'success' : 'error'} />
      <Tag x={x} y={66} text={`Pain, temperature: ${pain ? 'normal' : 'lost'}`} size={10} tone={pain ? 'success' : 'error'} />
      <Tag x={x} y={90} text={`Movement: ${move ? 'normal' : 'weak'}`} size={10} tone={move ? 'success' : 'error'} />
    </>
  );
  return (
    <View style={{ gap: 10 }}>
      <Organ3D key={thalamic ? 'brain' : 'cord'} scene={thalamic ? 'brain-deep' : 'cord'} frame={frame} label={`${LESIONS[state.lesion]}: ${thalamic ? 'the right thalamus is damaged' : 'the spinal cord at T10 with its tracts'}`} />
      <Canvas width={400} height={104} label={`Left leg: touch ${state.touchL ? 'normal' : 'lost'}, pain ${state.painL ? 'normal' : 'lost'}, movement ${state.moveL ? 'normal' : 'weak'}. Right leg: touch ${state.touchR ? 'normal' : 'lost'}, pain ${state.painR ? 'normal' : 'lost'}, movement ${state.moveR ? 'normal' : 'weak'}.`}>
        {side('Left leg', state.touchL, state.painL, state.moveL, 100)}
        {side('Right leg', state.touchR, state.painR, state.moveR, 300)}
      </Canvas>
    </View>
  );
}

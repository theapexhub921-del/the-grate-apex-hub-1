import { View } from 'react-native';

import type { HornState } from '@/data/simulations/dorsal-horn';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

// The real spinal cord: the dorsal horn (where the LT, NS and WDR cells sit) glows with their
// firing, the spinothalamic tracts glow with the pain signal sent up, and the corticospinal
// region stands in for the descending fibres from the brainstem that turn it down.
export function DorsalHornGraphic({ state }: GraphicProps<HornState>) {
  const level = (v: number) => rounded(Math.max(0, Math.min(1, v / 120)), 0.05);
  const organ = {
    glow: { dorsal: level(state.lt + state.ns + state.wdr), st: level(state.output * 1.5), cs: rounded(Math.min(1, state.descending / 100) * 0.5, 0.05) },
    glowColor: { dorsal: '#ffd25a', st: '#ff5a3a', cs: '#9fd0ff' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="cord" frame={organ} label={`The spinal cord's dorsal horn: pain signal sent up ${Math.round(state.output)} a second`} />
      <Canvas width={400} height={74} label={`LT cell ${Math.round(state.lt)}, NS cell ${Math.round(state.ns)}, WDR cell ${Math.round(state.wdr)} per second; pain signal sent up ${Math.round(state.output)} per second.`}>
        <Tag x={70} y={18} text={`LT (touch) ${Math.round(state.lt)}/s`} size={10} />
        <Tag x={200} y={18} text={`NS (pain) ${Math.round(state.ns)}/s`} size={10} />
        <Tag x={330} y={18} text={`WDR ${Math.round(state.wdr)}/s`} size={10} />
        <Tag x={200} y={52} text={`Up the spinothalamic tract: ${Math.round(state.output)}/s`} size={10} tone={state.output > 20 ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

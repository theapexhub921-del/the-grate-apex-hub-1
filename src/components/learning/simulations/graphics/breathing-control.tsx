import { View } from 'react-native';

import { type ControlState } from '@/data/simulations/breathing-control';

import { Organ3D } from '../organ-3d';
import { chestFrame, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';

// The breathing control loop on the real anatomy: the brainstem (central chemoreceptors, CSF
// H⁺) and the carotid arteries (carotid bodies at their fork, low PO₂) glow with how hard each
// drives breathing; the phrenic nerves glow with the output, and the lungs and diaphragm move
// at the resulting rate and depth. CO₂ narcosis dims the brainstem.
export function BreathingControlGraphic({ state, time, reduceMotion }: GraphicProps<ControlState>) {
  const vent = state.ventilation;
  const rate = 12 * Math.sqrt(Math.max(0.2, vent / 6));
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time * rate) / 60)) / 2;
  const depth = Math.min(1.2, Math.sqrt(vent / 6) * 0.45);
  const level = (drive: number) => rounded(Math.min(1, drive / 3), 0.05);
  const frame = chestFrame({
    inflate: rounded(0.1 + phase * depth, 0.02),
    extra: {
      glow: { medulla: state.narcosis ? 0 : level(state.central), carotid: level(state.peripheral), phrenic: rounded(Math.min(1, vent / 25), 0.05) },
      glowColor: { medulla: '#fff2b0', carotid: '#ffd25a', phrenic: '#fff2b0' },
      color: { medulla: state.narcosis ? '#9a8f99' : '#d8b8a8' },
    },
  });
  return (
    <View>
      <Organ3D
        scene="breath-control"
        frame={frame}
        height={340}
        label={`Ventilation ${vent.toFixed(1)} L/min. Central chemoreceptor drive ${Math.round(state.central * 100)}%, peripheral ${Math.round(state.peripheral * 100)}%${state.narcosis ? '; CO₂ narcosis depresses the brainstem' : ''}.`}
      />
    </View>
  );
}

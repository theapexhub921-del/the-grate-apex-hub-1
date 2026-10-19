import { View } from 'react-native';

import { LESIONS, REFLEXES, TONES, type MotorState } from '@/data/simulations/motor-lesion';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

// The motor pathway on the real anatomy: the left motor cortex, the corticospinal tracts in the
// cord, the right femoral nerve and the right quadriceps. The damaged part glows red; the
// pathway glows with the strength that gets through, and the muscle wastes (shrinks) with an
// LMN lesion.
export function MotorLesionGraphic({ state }: GraphicProps<MotorState>) {
  const strength = Math.max(0, Math.min(1, state.strength / 100));
  const red = '#ff2a1a';
  const frame = {
    move: { quads: [rounded(0.8 + 0.2 * (state.bulk / 100), 0.02), 1, rounded(0.8 + 0.2 * (state.bulk / 100), 0.02)] as [number, number, number] },
    glow: {
      precentralL: state.lesion === 1 ? 1 : rounded(0.5 * strength, 0.05),
      cs: rounded(0.4 * strength, 0.05),
      cordLesion: state.lesion === 3 ? 1 : 0,
      cordLesionR: state.lesion === 4 ? 1 : 0,
      femoral: state.lesion === 2 ? 1 : rounded(0.6 * strength, 0.05),
      quads: rounded(0.45 * strength, 0.05),
    },
    color: { ...(state.lesion === 3 ? { cordLesion: red } : {}), ...(state.lesion === 4 ? { cordLesionR: red } : {}), ...(state.lesion === 1 ? { precentralL: red } : {}), ...(state.lesion === 2 ? { femoral: red } : {}) },
    glowColor: { precentralL: state.lesion === 1 ? red : '#fff2b0', cs: '#fff2b0', cordLesion: red, cordLesionR: red, femoral: state.lesion === 2 ? red : '#fff2b0', quads: '#ff8a6a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="motor" frame={frame} height={360} label={`${LESIONS[state.lesion]}, day ${Math.round(state.days)}: strength ${Math.round(state.strength)}%, tone ${TONES[state.tone].toLowerCase()}, knee jerk ${REFLEXES[state.reflex].toLowerCase()}.`} />
      <Canvas width={400} height={44} label="Right quadriceps examination.">
        <Tag x={70} y={22} text={`Strength ${Math.round(state.strength)}%`} size={10} tone={state.strength < 60 ? 'error' : 'primary'} />
        <Tag x={170} y={22} text={`Tone: ${TONES[state.tone]}`} size={10} tone={state.tone === 1 ? 'primary' : 'warning'} />
        <Tag x={272} y={22} text={`Knee jerk: ${REFLEXES[state.reflex]}`} size={10} tone={state.reflex === 2 ? 'primary' : 'warning'} />
        <Tag x={360} y={22} text={`Bulk ${Math.round(state.bulk)}%`} size={10} tone={state.bulk < 85 ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

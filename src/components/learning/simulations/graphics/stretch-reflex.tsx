import { View } from 'react-native';

import { GRADES, LESIONS, type ReflexState } from '@/data/simulations/stretch-reflex';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const TAP_EVERY = 2.4; // seconds between taps of the hammer
const SEATED = -60; // the knee bent as when sitting on the edge of a couch

// The knee jerk on the real right thigh and leg: every couple of seconds the patellar tendon is
// tapped, the femoral nerve lights up (spindle afferents in, α-motor neurons out), the
// quadriceps glow as they contract and the leg kicks forward by the model's angle. Reciprocal
// inhibition keeps the hamstrings dark; a cut root leaves the nerve dark and the leg still.
export function StretchReflexGraphic({ state, time, reduceMotion }: GraphicProps<ReflexState>) {
  const since = reduceMotion ? 0.35 : ((time % TAP_EVERY) + TAP_EVERY) % TAP_EVERY;
  const envelope = since < 0.12 ? 0 : since < 0.9 ? Math.sin(((since - 0.12) / 0.78) * Math.PI) : 0;
  const active = state.tap > 0 ? envelope : 0;
  const frame = {
    turn: { leg: rounded(SEATED + state.kick * active, 0.5) },
    glow: {
      nerve: state.lesion === 0 ? rounded(Math.min(1, state.iaCord / 100) * (0.3 + 0.7 * active), 0.05) : 0,
      quads: rounded(Math.min(1, state.alpha / 100) * active * 0.8, 0.05),
      hams: rounded(Math.min(1, state.hamstrings / 100) * 0.6, 0.05),
    },
    glowColor: { nerve: '#fff2b0', quads: '#ff8a6a', hams: '#ff8a6a' },
    color: { nerve: state.lesion === 0 ? '#e8c95a' : '#9b9b9b' },
  };
  const grade = GRADES[state.readouts.grade] ?? '';
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="knee" frame={frame} height={320} label={`Knee jerk: ${grade}, a ${Math.round(state.kick)}° kick. Nerve roots: ${LESIONS[state.lesion]}.`} />
      <Canvas width={400} height={44} label="Knee jerk result.">
        <Tag x={90} y={22} text={`Knee jerk: ${grade || '—'}`} size={10} tone={state.readouts.grade === 2 ? 'success' : 'warning'} />
        <Tag x={210} y={22} text={`${Math.round(state.kick)}° kick`} size={10} />
        <Tag x={320} y={22} text={`Roots: ${LESIONS[state.lesion]}`} size={10} tone={state.lesion ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

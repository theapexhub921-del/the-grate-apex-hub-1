import { View } from 'react-native';

import { SHOCK_TYPES, type ShockState } from '@/data/simulations/shock';

import { Organ3D } from '../organ-3d';
import { beatAt, heartFrame, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';

// The whole circulation: the heart beats at the patient's rate, the arteries glow with the
// pressure in them (dim in shock), and the veins fade when they hold little blood (low JVP) or
// darken when blood pools in them.
export function ShockGraphic({ state, time, reduceMotion }: GraphicProps<ShockState>) {
  const beat = beatAt(reduceMotion ? 0.2 : time * 4, state.hr); // the clock runs 4× slow; show the real rate
  const pressure = Math.max(0, Math.min(1, (state.map - 30) / 80));
  const veins = Math.max(0.35, Math.min(1, 0.45 + state.cvp / 12));
  const frame = heartFrame({
    lv: beat.lv,
    la: beat.la,
    pressure: beat.systole ? rounded(pressure, 0.05) : 0,
    extra: {
      glow: { arteries: rounded(0.15 + 0.35 * pressure * (beat.systole ? 1 : 0.6), 0.05) },
      glowColor: { arteries: '#ff6a4a' },
      color: { arteries: pressure < 0.45 ? '#c9686a' : '#b01e24', veins: state.type === 2 ? '#283478' : '#2f3f8f' },
      opacity: { veins: rounded(veins, 0.05) },
    },
  });
  return (
    <View>
      <Organ3D
        scene="circulation"
        frame={frame}
        height={380}
        label={`${SHOCK_TYPES[state.type] ?? 'Circulation'}: mean BP ${Math.round(state.map)} mmHg, pulse ${Math.round(state.hr)} a minute, JVP ${Math.round(state.cvp)} mmHg.`}
      />
    </View>
  );
}

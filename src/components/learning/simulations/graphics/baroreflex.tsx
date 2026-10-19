import { View } from 'react-native';

import type { BaroState } from '@/data/simulations/baroreflex';

import { Organ3D } from '../organ-3d';
import { beatAt, heartFrame, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';

// The baroreflex on the real anatomy: the carotid arteries and aortic arch (where the
// baroreceptors sit) glow with their firing, the glossopharyngeal and vagus nerves carry it to
// the medulla, the vagus and the sympathetic chain glow with their outflow, and the heart beats
// at the rate the reflex sets. A cut reflex leaves the nerves dark.
export function BaroreflexGraphic({ state, time, reduceMotion }: GraphicProps<BaroState>) {
  const beat = beatAt(reduceMotion ? 0.2 : time, state.hr);
  const level = (pct: number) => rounded(Math.max(0, Math.min(1, pct / 160)), 0.05);
  const frame = heartFrame({
    lv: beat.lv,
    la: beat.la,
    extra: {
      glow: {
        sinus: level(state.baroFiring),
        ix: state.reflexIntact ? level(state.baroFiring) : 0,
        vagus: level(state.vagal),
        sympathetic: level(state.sympathetic),
        medulla: state.reflexIntact ? 0.35 : 0,
      },
      glowColor: { sinus: '#ff9a7a', ix: '#fff2b0', vagus: '#9fd0ff', sympathetic: '#ffb347', medulla: '#fff2b0' },
    },
  });
  return (
    <View>
      <Organ3D
        scene="baroreflex"
        frame={frame}
        height={340}
        label={`Baroreceptors firing ${Math.round(state.baroFiring)}%, vagal ${Math.round(state.vagal)}%, sympathetic ${Math.round(state.sympathetic)}%; heart rate ${Math.round(state.hr)} a minute; mean BP ${Math.round(state.map)} mmHg.${state.reflexIntact ? '' : ' The baroreceptor nerves are cut.'}`}
      />
    </View>
  );
}



import { View } from 'react-native';

import { GENITALIA, GONADS, type AndrogenState } from '@/data/simulations/androgens';

import { Organ3D } from '../organ-3d';
import { levelGlow } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The testes glow with the testosterone they secrete; the prostate and penis — DHT's targets —
// glow with DHT and shrink when it is missing.
export function AndrogensGraphic({ state, values }: GraphicProps<AndrogenState>) {
  const r = state.readouts;
  const frame = {
    move: { prostate: state.dht < 0.3 ? 0.6 : 1 },
    glow: { testes: levelGlow(state.total), prostate: levelGlow(state.dht), penis: levelGlow(state.dht) * 0.6 },
    glowColor: { testes: '#ffcf5a', prostate: '#ffcf5a', penis: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="male" frame={frame} label={`${GONADS[values.gonads]}: testosterone ${Math.round(r.total)}%, DHT ${Math.round(r.dht)}%, LH ${Math.round(r.lh)}%.`} />
      <TagRows
        label="Testosterone, its fractions, DHT and LH."
        items={[
          { text: `Testosterone ${Math.round(r.total)}%`, tone: r.total < 50 ? 'error' : 'success' },
          { text: `Free ${r.free.toFixed(1)}% · bioavailable ${Math.round(r.bioavailable)}%` },
          { text: `DHT ${Math.round(r.dht)}%`, tone: r.dht < 50 ? 'error' : 'success' },
          { text: `LH ${Math.round(r.lh)}%`, tone: r.lh > 150 ? 'warning' : r.lh < 50 ? 'error' : 'success' },
          { text: `Genitalia: ${GENITALIA[r.external].toLowerCase()}`, tone: r.external ? 'warning' : 'primary' },
        ]}
      />
    </View>
  );
}

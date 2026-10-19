import { View } from 'react-native';

import { NERVES, TASTES, type TasteState } from '@/data/simulations/taste';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The tongue lights up with the taste; the signal glows along the facial (chorda tympani) or
// glossopharyngeal nerve to the nucleus of the solitary tract, the thalamus and the insula.
export function TasteGraphic({ state }: GraphicProps<TasteState>) {
  const r = state.readouts;
  const k = rounded(Math.min(1, state.firing / 100), 0.05);
  const nerve = state.nerve === 0 ? 'vii' : 'ix';
  const frame = {
    glow: { tongue: rounded(0.15 + 0.5 * k, 0.05), [nerve]: k, nts: k, thalamus: k * 0.8, insula: k * 0.8 },
    glowColor: { tongue: '#ffcf5a', [nerve]: '#ffcf5a', nts: '#ffcf5a', thalamus: '#ffcf5a', insula: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="taste" frame={frame} label={`${TASTES[state.taste]}: afferent firing ${Math.round(state.firing)}% through the ${NERVES[state.nerve].toLowerCase()}.`} />
      <TagRows
        label="Taste cell, receptor, nerve and firing."
        items={[
          { text: TASTES[state.taste], tone: 'success' },
          { text: `Firing ${Math.round(r.firing)}%`, tone: r.firing < 10 ? 'error' : 'primary' },
          { text: NERVES[state.nerve] },
          { text: 'Solitary nucleus → thalamus → cortex' },
        ]}
      />
    </View>
  );
}

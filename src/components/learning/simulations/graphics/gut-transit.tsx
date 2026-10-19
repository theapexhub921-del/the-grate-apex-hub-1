import { View } from 'react-native';

import { PLACES, PROCESSES, type TransitState } from '@/data/simulations/gut-transit';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The real digestive tract: the part holding the meal glows, the stomach is swollen while it
// still holds food, and the small intestine lights up as it absorbs.
export function GutTransitGraphic({ state }: GraphicProps<TransitState>) {
  const r = state.readouts;
  const here = ['stomach', 'jejunum', 'colon', 'sigmoid'][state.place];
  const frame = {
    move: { stomach: rounded(1 + 0.15 * state.stomachFull, 0.01) },
    glow: { [here]: 0.75, ...(state.place === 1 ? { duodenum: 0.6 } : {}), ...(state.place === 0 ? { stomach: 0.75 } : {}) },
    glowColor: { [here]: '#ffcf5a', duodenum: '#ffcf5a', stomach: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut" frame={frame} height={340} label={`The meal is in the ${PLACES[state.place].toLowerCase()}: ${PROCESSES[state.place].toLowerCase()}. ${Math.round(r.absorbed)}% of the nutrients absorbed.`} />
      <TagRows
        label="Where the meal is and what is happening."
        items={[
          { text: PLACES[state.place] },
          { text: PROCESSES[state.place], tone: 'success' },
          { text: `Absorbed ${Math.round(r.absorbed)}%` },
          { text: `Mouth to anus ${Math.round(r.total)} h` },
        ]}
      />
    </View>
  );
}

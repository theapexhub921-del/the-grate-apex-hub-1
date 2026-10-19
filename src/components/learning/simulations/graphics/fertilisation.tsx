import { View } from 'react-native';

import { PLACES, STAGES, type FertilisationState } from '@/data/simulations/fertilisation';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// Where the embryo is today glows — the ampulla, the rest of the tube, then the uterus — and the
// corpus luteum in the ovary glows while hCG keeps it alive.
export function FertilisationGraphic({ state }: GraphicProps<FertilisationState>) {
  const r = state.readouts;
  const here = state.fertilised && state.stage !== 6 ? ['ampulla', 'tubes', 'uterus', 'uterus'][state.place] : null;
  const frame = {
    glow: { ...(here ? { [here]: 0.75 } : {}), ovaryR: rounded(0.7 * (state.luteum / 100), 0.05) },
    glowColor: { ampulla: '#ffcf5a', tubes: '#ffcf5a', uterus: '#ffcf5a', ovaryR: '#ffd23a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="female" frame={frame} label={`Day ${state.day}: ${STAGES[state.stage].toLowerCase()}${state.fertilised ? ` in the ${PLACES[state.place].toLowerCase()}` : ''}; corpus luteum ${Math.round(state.luteum)}%.`} />
      <TagRows
        label="The embryo, where it is, and the corpus luteum."
        items={[
          { text: `${Math.round(r.ampulla)} thousand sperm reach the ampulla`, tone: r.fertilised ? 'success' : 'error' },
          { text: STAGES[state.stage], tone: state.stage === 6 || !state.fertilised ? 'error' : 'success' },
          ...(state.fertilised ? [{ text: PLACES[state.place] }] : []),
          { text: `Corpus luteum ${Math.round(state.luteum)}%`, tone: state.luteum < 100 ? 'warning' : 'success' },
        ]}
      />
    </View>
  );
}

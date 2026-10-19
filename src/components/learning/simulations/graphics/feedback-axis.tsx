import { View } from 'react-native';

import { AXES, type FeedbackState } from '@/data/simulations/feedback-axis';
import { PATTERNS } from '@/data/simulations/endocrine-axis';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const tone = (v: number) => (v > 1.25 ? 'warning' : v < 0.8 ? 'error' : 'success') as 'warning' | 'error' | 'success';

// The real glands: the hypothalamus, the anterior pituitary and the thyroid (or the adrenal
// glands) glow with how much each secretes; the gland shrinks without its trophic hormone and
// grows when driven by it.
export function FeedbackAxisGraphic({ state }: GraphicProps<FeedbackState>) {
  const names = AXES[state.axis];
  const gland = state.axis === 0 ? 'thyroid' : 'adrenals';
  const size = rounded(Math.max(0.75, Math.min(1.35, state.own ** 0.25)), 0.02);
  const frame = {
    move: { [gland]: size },
    glow: { hypothalamus: levelGlow(state.releasing), anterior: levelGlow(state.trophic), [gland]: levelGlow(state.hormone) },
    glowColor: { hypothalamus: '#ffcf5a', anterior: '#ffcf5a', [gland]: '#ffcf5a' },
  };
  const pc = (v: number) => `${Math.round(v * 100)}%`;
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene={state.axis === 0 ? 'endocrine-neck' : 'endocrine'} frame={frame} label={`${names.releasing} ${pc(state.releasing)}, ${names.trophic} ${pc(state.trophic)}, ${names.hormone} ${pc(state.hormone)}: ${PATTERNS[state.pattern]}.`} />
      <TagRows
        label="Each level of the axis as a percentage of normal."
        items={[
          { text: `Hypothalamus · ${names.releasing} ${pc(state.releasing)}`, tone: tone(state.releasing) },
          { text: `Pituitary · ${names.trophic} ${pc(state.trophic)}`, tone: tone(state.trophic) },
          { text: `${names.gland} · ${names.hormone} ${pc(state.hormone)}`, tone: tone(state.hormone) },
          { text: PATTERNS[state.pattern], tone: state.pattern ? 'error' : 'success' },
        ]}
      />
    </View>
  );
}

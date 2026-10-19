import { View } from 'react-native';

import { CONDITIONS, RESULTS, type ThyroidState } from '@/data/simulations/thyroid-axis';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const tone = (v: number) => (v > 1.25 ? 'warning' : v < 0.8 ? 'error' : 'success') as 'warning' | 'error' | 'success';

// The hypothalamus, pituitary and thyroid in the head and neck: each glows with its hormone, and
// the thyroid swells into a goitre when TSH drives it.
export function ThyroidAxisGraphic({ state }: GraphicProps<ThyroidState>) {
  const frame = {
    move: { thyroid: rounded(Math.max(0.7, Math.min(1.6, (state.goitre / 100) ** 0.8)), 0.02) },
    glow: { hypothalamus: levelGlow(state.releasing), anterior: levelGlow(state.trophic), thyroid: levelGlow(state.hormone) },
    glowColor: { hypothalamus: '#ffcf5a', anterior: '#ffcf5a', thyroid: '#ffcf5a' },
  };
  const pc = (v: number) => `${Math.round(v * 100)}%`;
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="endocrine-neck" frame={frame} label={`${CONDITIONS[state.condition]}: TRH ${pc(state.releasing)}, TSH ${pc(state.trophic)}, T4 ${pc(state.hormone)}; thyroid ${Math.round(state.goitre)}% of its normal size.`} />
      <TagRows
        label="TRH, TSH, T4, the size of the thyroid and the test result."
        items={[
          { text: `TRH ${pc(state.releasing)}`, tone: tone(state.releasing) },
          { text: `TSH ${pc(state.trophic)}`, tone: tone(state.trophic) },
          { text: `T4 ${pc(state.hormone)}`, tone: tone(state.hormone) },
          { text: `Thyroid ${Math.round(state.goitre)}% size`, tone: state.goitre > 120 ? 'warning' : 'primary' },
          ...(state.result ? [{ text: RESULTS[state.result], tone: (state.result === 2 || state.result === 4 ? 'error' : 'success') as 'error' | 'success' }] : []),
        ]}
      />
    </View>
  );
}

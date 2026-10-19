import { View } from 'react-native';

import { CONDITIONS, type AdrenalState } from '@/data/simulations/adrenal-axis';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The adrenal glands on top of the kidneys: they glow with cortisol (or red with catecholamines
// from a phaeochromocytoma), enlarge when ACTH drives them or a tumour grows, and shrink when
// they fail.
export function AdrenalAxisGraphic({ state }: GraphicProps<AdrenalState>) {
  const r = state.readouts;
  const size = state.condition === 1 ? 0.78 : state.condition === 2 ? 1.25 : state.condition === 3 || state.condition === 4 || state.condition === 5 ? 1.15 : rounded(Math.max(0.8, Math.min(1.2, state.acth ** 0.15)), 0.02);
  const frame = {
    move: { adrenals: size },
    glow: { adrenals: state.condition === 5 ? 0.9 : levelGlow(Math.max(state.cortisol, state.aldosterone)) },
    glowColor: { adrenals: state.condition === 5 ? '#ff3a1e' : '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="adrenals" frame={frame} label={`${CONDITIONS[state.condition]}: cortisol ${Math.round(r.cortisol)}%, aldosterone ${Math.round(r.aldosterone)}%, Na⁺ ${Math.round(r.na)}, K⁺ ${r.k.toFixed(1)} mmol/L, blood pressure ${Math.round(r.map)} mmHg.`} />
      <TagRows
        label="Adrenal hormones, electrolytes, pressure and glucose."
        items={[
          { text: `ACTH ${Math.round(r.acth)}%`, tone: r.acth > 150 ? 'warning' : r.acth < 50 ? 'error' : 'success' },
          { text: `Cortisol ${Math.round(r.cortisol)}%`, tone: r.cortisol > 150 ? 'warning' : r.cortisol < 70 ? 'error' : 'success' },
          { text: `Aldosterone ${Math.round(r.aldosterone)}%`, tone: r.aldosterone > 150 ? 'warning' : r.aldosterone < 60 ? 'error' : 'success' },
          { text: `Na⁺ ${Math.round(r.na)}`, tone: r.na < 135 ? 'error' : r.na > 145 ? 'warning' : 'success' },
          { text: `K⁺ ${r.k.toFixed(1)}`, tone: r.k < 3.5 || r.k > 5 ? 'error' : 'success' },
          { text: `BP ${Math.round(r.map)} mmHg`, tone: r.map > 105 ? 'warning' : r.map < 80 ? 'error' : 'success' },
          { text: `Glucose ${r.glucose.toFixed(1)}`, tone: r.glucose < 4 ? 'error' : r.glucose > 6.5 ? 'warning' : 'success' },
          ...(state.pigment ? [{ text: 'Skin darkens', tone: 'warning' as const }] : []),
        ]}
      />
    </View>
  );
}

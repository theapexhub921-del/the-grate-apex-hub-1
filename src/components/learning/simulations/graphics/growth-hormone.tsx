import { View } from 'react-native';

import { DIAGNOSES, type GhState } from '@/data/simulations/growth-hormone';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The skeleton with the pituitary and the liver: the pituitary glows with GH, the liver with the
// somatomedins it makes. A child grows taller or shorter than usual; in acromegaly the hands,
// feet, jaw and forehead — the bones that widen — are marked.
export function GrowthHormoneGraphic({ state }: GraphicProps<GhState>) {
  const tall = state.child ? Math.max(0.85, Math.min(1.14, 1 + (state.height - 5.5) / 45)) : 1;
  const frame = {
    move: { body: rounded(tall, 0.01) },
    glow: { pituitary: levelGlow(state.gh), liver: levelGlow(state.igf), acral: state.widen ? 0.5 : 0 },
    glowColor: { pituitary: '#ffcf5a', liver: '#ffcf5a', acral: '#ff7a4a' },
    color: state.widen ? { acral: '#e9a27f' } : undefined,
  };
  const r = state.readouts;
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="skeleton" frame={frame} height={340} label={`${DIAGNOSES[state.diagnosis]}: GH ${Math.round(r.gh)}%, somatomedins ${Math.round(r.igf)}%.`} />
      <TagRows
        label="Growth hormone, somatomedins and growth."
        items={[
          { text: `Pituitary · GH ${Math.round(r.gh)}%`, tone: r.gh > 150 ? 'warning' : r.gh < 50 ? 'error' : 'success' },
          { text: `Liver · somatomedins ${Math.round(r.igf)}%`, tone: r.igf > 150 ? 'warning' : r.igf < 50 ? 'error' : 'success' },
          { text: state.child ? `Grows ${r.height.toFixed(1)} cm a year` : state.widen ? 'Hands, feet, jaw widen' : 'Epiphyses fused: no growth in height' },
          { text: DIAGNOSES[state.diagnosis], tone: state.diagnosis ? 'error' : 'success' },
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';

import type { PancreasState } from '@/data/simulations/pancreatic-secretion';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { mix } from './anatomy/cells';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The pancreas glows gold with its enzymes and blue with its bicarbonate; the duodenum reddens
// while acid chyme sits in it unneutralised.
export function PancreaticSecretionGraphic({ state }: GraphicProps<PancreasState>) {
  const r = state.readouts;
  const acidic = Math.max(0, Math.min(1, (6.5 - state.ph) / 4.5));
  const blue = state.hco3 > state.enzymes;
  const frame = {
    glow: { pancreas: rounded(Math.min(1, Math.max(state.hco3, state.enzymes) / 90), 0.05), duodenum: rounded(0.7 * acidic, 0.05) },
    glowColor: { pancreas: blue ? '#6fb8ff' : '#ffcf5a', duodenum: '#ff4a2a' },
    color: { duodenum: mix('#d98c80', '#c2402e', rounded(acidic, 0.1)) },
    opacity: { stomach: 0.3 },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut-upper" frame={frame} label={`Pancreas: HCO₃⁻ ${Math.round(r.hco3)}%, enzymes ${Math.round(r.enzymes)}% of maximum; duodenal pH ${r.ph.toFixed(1)}.`} />
      <TagRows
        label="Pancreatic secretion and the duodenum."
        items={[
          { text: `HCO₃⁻ ${Math.round(r.hco3)}%`, tone: r.hco3 > 40 ? 'success' : 'primary' },
          { text: `Enzymes ${Math.round(r.enzymes)}%`, tone: r.enzymes > 40 ? 'success' : 'primary' },
          { text: `Duodenal pH ${r.ph.toFixed(1)}`, tone: r.ph < 5 ? 'error' : 'success' },
          ...(state.secretin ? [{ text: 'Secretin (S cells)', tone: 'warning' as const }] : []),
          ...(state.cck ? [{ text: 'CCK (I cells)', tone: 'warning' as const }] : []),
        ]}
      />
    </View>
  );
}

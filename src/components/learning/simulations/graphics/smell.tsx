import { View } from 'react-native';

import type { SmellState } from '@/data/simulations/smell';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The nasal mucosa glows with the receptors firing; the olfactory nerves carry it on (red where torn
// at the cribriform plate) to the amygdala and hippocampus.
export function SmellGraphic({ state }: GraphicProps<SmellState>) {
  const r = state.readouts;
  const k = (v: number) => rounded(Math.min(1, v / 100), 0.05);
  const frame = {
    glow: { mucosa: k(state.firing) * 0.7, nerves: state.cut ? 1 : k(state.perceived), amygdala: k(state.limbic), hippocampus: k(state.limbic) },
    glowColor: { mucosa: '#ffcf5a', nerves: state.cut ? '#ff2a1a' : '#ffcf5a', amygdala: '#ffcf5a', hippocampus: '#ffcf5a' },
    color: state.cut ? { nerves: '#d23a2a' } : undefined,
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="smell" frame={frame} label={`Receptors firing ${Math.round(r.firing)}%; smell perceived ${Math.round(r.perceived)}%.`} />
      <TagRows
        label="Receptors, smell and the limbic system."
        items={[
          { text: `Receptors ${Math.round(r.firing)}%`, tone: r.firing < 10 ? 'error' : 'primary' },
          { text: `Smell perceived ${Math.round(r.perceived)}%`, tone: r.perceived < 10 ? 'error' : 'success' },
          { text: `Amygdala and hippocampus ${Math.round(r.limbic)}%` },
          ...(state.cut ? [{ text: 'Olfactory nerves torn', tone: 'error' as const }] : []),
        ]}
      />
    </View>
  );
}

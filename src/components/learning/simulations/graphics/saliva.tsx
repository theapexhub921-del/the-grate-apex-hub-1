import { View } from 'react-native';

import type { SalivaState } from '@/data/simulations/saliva';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The parotid, submandibular and sublingual glands glow and swell slightly with the saliva they
// pour out.
export function SalivaGraphic({ state }: GraphicProps<SalivaState>) {
  const r = state.readouts;
  const k = Math.min(1, state.flow / 4.5);
  const frame = {
    move: { salivary: rounded(1 + 0.08 * k, 0.01) },
    glow: { salivary: rounded(0.2 + 0.7 * k, 0.05) },
    glowColor: { salivary: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="mouth" frame={frame} label={`The salivary glands: ${r.flow.toFixed(1)} mL a minute of saliva at ${Math.round(r.osm)} mOsm/kg.`} />
      <TagRows
        label="Saliva flow and composition."
        items={[
          { text: `Flow ${r.flow.toFixed(1)} mL/min`, tone: r.flow < 0.6 ? 'warning' : 'success' },
          { text: `Na⁺ ${Math.round(r.na)} · K⁺ ${Math.round(r.k)} · HCO₃⁻ ${Math.round(r.hco3)}` },
          { text: `${Math.round(r.osm)} mOsm/kg: hypotonic`, tone: 'success' },
          { text: `Protein ${Math.round(r.protein)}%`, tone: r.protein > 200 ? 'warning' : 'primary' },
        ]}
      />
    </View>
  );
}

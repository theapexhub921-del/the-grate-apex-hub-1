import { View } from 'react-native';

import type { CalciumState } from '@/data/simulations/calcium';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The organs of calcium balance: the parathyroids glow with PTH, the kidneys with the active
// vitamin D they make, the small intestine with the calcium absorbed, and the bones redden as
// osteoclasts resorb them.
export function CalciumGraphic({ state }: GraphicProps<CalciumState>) {
  const r = state.readouts;
  const resorb = Math.max(0, Math.min(1, (state.resorption - 1) / 2.5));
  const frame = {
    glow: { parathyroids: levelGlow(state.pth), kidneys: rounded(0.6 * levelGlow(state.calcitriol), 0.05), gut: rounded(0.6 * levelGlow(state.absorption), 0.05), bones: rounded(0.6 * resorb, 0.05) },
    glowColor: { parathyroids: '#ffcf5a', kidneys: '#ffcf5a', gut: '#ffcf5a', bones: '#ff6a4a' },
  };
  const nerves = ['Nerves normal', 'Tetany: nerves excitable', 'Sluggish reflexes, weakness'][r.nerves];
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="calcium" frame={frame} height={330} label={`Plasma calcium ${r.ca.toFixed(2)} mmol/L; PTH ${Math.round(r.pth)}%, active vitamin D ${Math.round(r.calcitriol)}%.`} />
      <TagRows
        label="Calcium, PTH, vitamin D, phosphate and the nerves."
        items={[
          { text: `Ca²⁺ ${r.ca.toFixed(2)} mmol/L`, tone: r.ca < 2.16 || r.ca > 2.65 ? 'error' : 'success' },
          { text: `Parathyroids · PTH ${Math.round(r.pth)}%`, tone: r.pth > 150 ? 'warning' : r.pth < 50 ? 'error' : 'success' },
          { text: `Kidney · 1,25-DHCC ${Math.round(r.calcitriol)}%`, tone: r.calcitriol < 50 ? 'error' : 'primary' },
          { text: `Gut absorbs ${Math.round(r.absorption)}%` },
          { text: `Bone resorption ${Math.round(r.resorption)}%`, tone: r.resorption > 150 ? 'warning' : 'primary' },
          { text: `Phosphate ${r.phosphate.toFixed(2)}` },
          { text: nerves, tone: r.nerves ? 'error' : 'success' },
        ]}
      />
    </View>
  );
}

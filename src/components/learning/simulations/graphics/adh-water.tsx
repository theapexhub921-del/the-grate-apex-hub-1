import { View } from 'react-native';

import { CONDITIONS, type AdhState } from '@/data/simulations/adh-water';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The hypothalamus and posterior pituitary glow with the ADH secreted; the kidneys take on the
// colour of the urine they make (pale and dilute, or dark and concentrated); the bladder swells
// with the urine flow.
export function AdhWaterGraphic({ state }: GraphicProps<AdhState>) {
  const dark = Math.max(0, Math.min(1, (state.uosm - 50) / 1150));
  const urine = `rgb(${Math.round(245 - 20 * dark)}, ${Math.round(236 - 70 * dark)}, ${Math.round(200 - 150 * dark)})`;
  const frame = {
    move: { bladder: rounded(Math.min(1.45, 0.82 + 0.12 * state.flow), 0.02) },
    glow: { posterior: levelGlow(state.adh / 100), hypothalamus: levelGlow(Math.sqrt(state.adh / 100)) },
    glowColor: { posterior: '#ffcf5a', hypothalamus: '#ffcf5a' },
    color: { bladder: urine },
  };
  const r = state.readouts;
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="endocrine" frame={frame} label={`${CONDITIONS[state.condition]}: ADH ${Math.round(r.adh)}% of normal, urine ${r.flow.toFixed(1)} litres a day at ${Math.round(r.uosm)} mOsm/kg.`} />
      <TagRows
        label="ADH, urine and plasma sodium."
        items={[
          { text: `Posterior pituitary · ADH ${Math.round(r.adh)}%`, tone: r.adh > 150 ? 'warning' : r.adh < 50 ? 'error' : 'success' },
          { text: `Urine ${r.flow.toFixed(1)} L/day`, tone: r.flow > 3 ? 'error' : 'primary' },
          { text: `SG ${r.sg.toFixed(3)}` },
          { text: `Na⁺ ${Math.round(r.na)} mmol/L`, tone: r.na < 135 ? 'error' : r.na > 145 ? 'warning' : 'success' },
          ...(r.thirst ? [{ text: 'Thirsty', tone: 'warning' as const }] : []),
        ]}
      />
    </View>
  );
}

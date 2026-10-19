import { View } from 'react-native';

import type { WaterState } from '@/data/simulations/gut-water';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The small intestine and colon glow blue with the water they absorb; in cholera the small
// intestine turns red where it pours fluid out.
export function GutWaterGraphic({ state }: GraphicProps<WaterState>) {
  const r = state.readouts;
  const frame = {
    glow: { jejunum: rounded(Math.min(1, state.small / 12), 0.05), colon: rounded(Math.min(1, state.colon / 4.5), 0.05), ...(state.cholera ? { duodenum: 0.6 } : {}) },
    glowColor: { jejunum: state.cholera ? '#ff7a5a' : '#6fb8ff', colon: '#6fb8ff', duodenum: '#ff7a5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut" frame={frame} height={340} label={`${r.entering.toFixed(1)} L a day enters the gut; ${r.small.toFixed(1)} L absorbed by the small intestine and ${r.colon.toFixed(1)} L by the colon; ${Math.round(r.faeces)} mL lost in faeces.`} />
      <TagRows
        label="Daily water in and out of the gut."
        items={[
          { text: `In ${r.entering.toFixed(1)} L/day` },
          { text: `Small intestine absorbs ${r.small.toFixed(1)} L`, tone: 'success' },
          { text: `Colon absorbs ${r.colon.toFixed(1)} L`, tone: 'success' },
          { text: `Faeces ${Math.round(r.faeces)} mL`, tone: r.faeces > 300 ? 'error' : 'primary' },
          { text: `Body water ${r.balance >= 0 ? '+' : ''}${r.balance.toFixed(1)} L/day`, tone: r.balance < 0 ? 'error' : 'success' },
        ]}
      />
    </View>
  );
}

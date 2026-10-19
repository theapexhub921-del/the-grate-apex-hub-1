import { View } from 'react-native';

import { TYPES, type BilirubinState } from '@/data/simulations/bilirubin';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { mix } from './anatomy/cells';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The liver yellows as bilirubin builds up; the gallbladder fills or empties (CCK); a blocked bile
// duct glows red.
export function BilirubinGraphic({ state }: GraphicProps<BilirubinState>) {
  const r = state.readouts;
  const yellow = Math.min(1, Math.max(0, (state.total - 1) / 6));
  const frame = {
    move: { gallbladder: rounded(state.gallbladder, 0.02) },
    color: { liver: mix('#7a2e22', '#c9a43a', rounded(yellow, 0.05)) },
    opacity: { liver: 0.75 },
    glow: { bileduct: state.blocked ? 1 : 0, gallbladder: r.gallbladder < 90 ? 0.5 : 0 },
    glowColor: { bileduct: '#ff2a1a', gallbladder: '#b8e06a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut-upper" frame={frame} label={`Total bilirubin ${r.total.toFixed(1)} mg/dL: ${TYPES[r.type].toLowerCase()}.`} />
      <TagRows
        label="Bilirubin, urine and stools."
        items={[
          { text: `Unconjugated ${r.unconjugated.toFixed(1)}`, tone: r.unconjugated > 1.5 ? 'warning' : 'primary' },
          { text: `Conjugated ${r.conjugated.toFixed(1)}`, tone: r.conjugated > 1 ? 'warning' : 'primary' },
          { text: `Total ${r.total.toFixed(1)} mg/dL`, tone: r.total > 2.5 ? 'error' : 'success' },
          { text: TYPES[r.type], tone: r.type ? 'error' : 'success' },
          ...(r.urine ? [{ text: 'Dark urine', tone: 'warning' as const }] : []),
          ...(r.stool ? [{ text: 'Pale stools', tone: 'warning' as const }] : []),
        ]}
      />
    </View>
  );
}

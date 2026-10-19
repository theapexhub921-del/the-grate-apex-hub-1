import { View } from 'react-native';

import { DRUGS, PHASES, type GastricState } from '@/data/simulations/gastric-phases';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The stomach glows with the acid its parietal cells secrete; in the intestinal phases the
// duodenum lights up — gold while it still stimulates, blue when it switches the stomach off.
export function GastricPhasesGraphic({ state, values }: GraphicProps<GastricState>) {
  const r = state.readouts;
  const frame = {
    move: { stomach: state.phase >= 2 ? 1.08 : 1 },
    glow: { stomach: rounded(Math.min(1, 0.1 + state.acid / 100), 0.05), duodenum: state.phase >= 3 ? 0.6 : 0 },
    glowColor: { stomach: '#ff8a3a', duodenum: state.inhibition ? '#6fb8ff' : '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut-upper" frame={frame} label={`${PHASES[state.phase]}: acid secretion ${Math.round(r.acid)}% of maximum.`} />
      <TagRows
        label="Acid secretion and its controls."
        items={[
          { text: PHASES[state.phase] },
          { text: `Acid ${Math.round(r.acid)}% of max`, tone: r.acid > 60 ? 'warning' : 'primary' },
          { text: `Gastrin ${Math.round(r.gastrin)}%` },
          { text: `Alkaline tide +${r.tide.toFixed(1)} mmol/L` },
          ...(state.inhibition ? [{ text: 'Enterogastric reflex on', tone: 'success' as const }] : []),
          ...(values.drug ? [{ text: DRUGS[values.drug], tone: 'success' as const }] : []),
        ]}
      />
    </View>
  );
}

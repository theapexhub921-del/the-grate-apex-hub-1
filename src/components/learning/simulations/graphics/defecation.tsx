import { View } from 'react-native';

import type { DefecationState } from '@/data/simulations/defecation';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The sigmoid colon fills; the external anal sphincter and the pelvic floor (puborectalis) glow
// when they contract and fade when they relax.
export function DefecationGraphic({ state }: GraphicProps<DefecationState>) {
  const r = state.readouts;
  const frame = {
    move: { colon: rounded(1 + state.volume / 1500, 0.01) },
    glow: { external: state.externalShut ? 0.7 : 0, puborectalis: state.angle <= 95 ? 0.6 : 0, sigmoid: state.passing ? 0.6 : rounded(Math.min(0.5, state.volume / 500), 0.05) },
    glowColor: { external: '#ff5a3a', puborectalis: '#ff5a3a', sigmoid: '#ffcf5a' },
    opacity: { floor: state.angle > 95 ? 0.55 : 1 },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="pelvic-colon" frame={frame} label={`${state.volume} mL in the rectum: internal sphincter ${state.internalOpen ? 'relaxed' : 'closed'}, external sphincter ${state.externalShut ? 'contracted' : 'relaxed'}, anorectal angle ${state.angle}°.`} />
      <TagRows
        label="The sphincters, angle and urge."
        items={[
          { text: `Urge ${Math.round(r.urge)}%`, tone: r.urge > 50 ? 'warning' : 'primary' },
          { text: `Internal sphincter ${state.internalOpen ? 'relaxed' : 'closed'}` },
          { text: `External sphincter ${state.externalShut ? 'contracted' : 'relaxed'}`, tone: state.externalShut ? 'success' : 'warning' },
          { text: `Angle ${state.angle}°` },
          ...(r.emptied ? [{ text: `Emptied ${Math.round(r.emptied)}%`, tone: 'success' as const }] : []),
          ...(!r.continent ? [{ text: 'Incontinent', tone: 'error' as const }] : []),
        ]}
      />
    </View>
  );
}

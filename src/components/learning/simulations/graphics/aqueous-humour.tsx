import { View } from 'react-native';

import { NERVE, type AqueousState } from '@/data/simulations/aqueous-humour';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { mix } from './anatomy/cells';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The real eye: the anterior chamber reddens as the pressure rises, and the retina and optic nerve
// glow red once the pressure is high enough to damage them.
export function AqueousHumourGraphic({ state }: GraphicProps<AqueousState>) {
  const k = Math.max(0, Math.min(1, (state.iop - 15) / 25));
  const frame = {
    color: { chamber: mix('#cfe6f2', '#e2786a', rounded(k, 0.05)) },
    opacity: { chamber: rounded(0.3 + 0.4 * k, 0.05) },
    glow: { retina: state.nerve === 2 ? 0.7 : state.nerve === 1 ? 0.3 : 0, nerve: state.nerve === 2 ? 0.8 : 0 },
    glowColor: { retina: '#ff3a1e', nerve: '#ff3a1e' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="eye" frame={frame} label={`Intraocular pressure ${Math.round(state.iop)} mmHg; optic nerve ${NERVE[state.nerve].toLowerCase()}.`} />
      <TagRows
        label="Pressure and the optic nerve."
        items={[
          { text: `Pressure ${Math.round(state.iop)} mmHg`, tone: state.iop > 21 ? 'error' : 'success' },
          { text: state.closed ? 'Filtration angle closed' : 'Filtration angle open', tone: state.closed ? 'error' : 'primary' },
          { text: `Optic nerve: ${NERVE[state.nerve].toLowerCase()}`, tone: state.nerve ? 'error' : 'success' },
        ]}
      />
    </View>
  );
}

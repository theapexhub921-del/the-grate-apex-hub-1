import { View } from 'react-native';

import { STAGES, type LifespanState } from '@/data/simulations/lifespan';

import { Organ3D } from '../organ-3d';
import type { OrganFrame } from '../organ-3d-types';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The gonads and reproductive organs grow through puberty and glow with the sex steroids they
// make; after menopause the ovaries shrink.
export function LifespanGraphic({ state, values }: GraphicProps<LifespanState>) {
  const r = state.readouts;
  const grow = rounded(0.6 + 0.4 * state.development, 0.02);
  const female = state.female;
  const shrink = state.stage === 3 ? 0.7 : 1;
  const frame: OrganFrame = female
    ? { move: { ovaryR: grow * shrink, ovaryL: grow * shrink, uterus: grow }, glow: { ovaries: levelGlow(state.steroid / 100) }, glowColor: { ovaries: '#ffcf5a' } }
    : { move: { testes: grow, prostate: grow, seminal: grow }, glow: { testes: levelGlow(state.steroid / 100) }, glowColor: { testes: '#ffcf5a' } };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene={female ? 'female' : 'male'} frame={frame} label={`${female ? 'Female' : 'Male'}, ${values.age} years: ${STAGES[state.stage].toLowerCase()}; sex steroids ${Math.round(r.steroid)}% of adult.`} />
      <TagRows
        label="Stage, hormones and fertility."
        items={[
          { text: STAGES[state.stage], tone: 'success' },
          { text: `GnRH ${Math.round(r.gnrh)}% · FSH ${Math.round(r.fsh)}%`, tone: r.fsh > 300 ? 'warning' : 'primary' },
          { text: `${female ? 'Estrogen' : 'Testosterone'} ${Math.round(r.steroid)}%`, tone: r.steroid < 50 ? 'error' : 'success' },
          ...(!female && r.shbg > 100 ? [{ text: `SHBG ${Math.round(r.shbg)}%`, tone: 'warning' as const }] : []),
          { text: r.fertile ? 'Fertile' : 'Not fertile', tone: r.fertile ? 'success' : 'primary' },
        ]}
      />
    </View>
  );
}

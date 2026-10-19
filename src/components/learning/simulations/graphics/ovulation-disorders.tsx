import { View } from 'react-native';

import { CAUSES, type DisorderState } from '@/data/simulations/ovulation-disorders';

import { Organ3D } from '../organ-3d';
import { levelGlow, rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The ovaries glow with the estrogen they make and the uterus with the progesterone it receives;
// in menopause the ovaries shrink.
export function OvulationDisordersGraphic({ state }: GraphicProps<DisorderState>) {
  const r = state.readouts;
  const small = state.cause === 4 ? 0.7 : 1;
  const frame = {
    move: { ovaryR: small, ovaryL: small, uterus: state.cause === 3 ? 1.15 : 1 },
    glow: { ovaries: levelGlow(Math.min(4, state.e2 / 100)), uterus: rounded(Math.min(0.8, state.p4 / 1500), 0.05) },
    glowColor: { ovaries: '#ffcf5a', uterus: '#ffd23a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="female" frame={frame} label={`${CAUSES[state.cause]}: ovulation ${r.ovulates ? 'occurs' : 'does not occur'}; estrogen ${Math.round(r.e2)}%.`} />
      <TagRows
        label="Hormones, ovulation and periods."
        items={[
          { text: r.ovulates ? 'Ovulates' : 'No ovulation', tone: r.ovulates ? 'success' : 'error' },
          { text: r.periods ? 'Periods absent' : 'Periods regular', tone: r.periods ? 'error' : 'success' },
          { text: `GnRH ${Math.round(r.gnrh)}%` },
          { text: `FSH ${Math.round(r.fsh)}% · LH ${Math.round(r.lh)}%`, tone: r.fsh > 200 ? 'warning' : 'primary' },
          { text: `Estrogen ${Math.round(r.e2)}%`, tone: r.e2 < 60 ? 'error' : 'primary' },
          { text: `Prolactin ${Math.round(r.prolactin)}%`, tone: r.prolactin > 200 ? 'warning' : 'primary' },
        ]}
      />
    </View>
  );
}

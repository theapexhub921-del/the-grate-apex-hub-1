import { View } from 'react-native';

import type { LabourState } from '@/data/simulations/labour-lactation';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// Labour: the uterus glows and tightens with each contraction. Breastfeeding: the breast lobes
// fill with milk and the ducts light up when oxytocin ejects it.
export function LabourLactationGraphic({ state, time, reduceMotion }: GraphicProps<LabourState>) {
  const r = state.readouts;
  if (state.mode === 0) {
    const wave = reduceMotion ? 1 : Math.max(0, Math.sin((time * Math.PI) / 3)) ** 2;
    const frame = {
      move: { uterus: rounded(1 - 0.06 * state.contraction * wave, 0.01), cervix: rounded(1 + state.dilation / 40, 0.01) },
      glow: { uterus: rounded(0.8 * state.contraction * wave, 0.05), cervix: rounded(state.dilation / 12, 0.05) },
      glowColor: { uterus: '#ff7a4a', cervix: '#ffcf5a' },
    };
    return (
      <View style={{ gap: 10 }}>
        <Organ3D scene="female" frame={frame} label={`Labour: cervix ${r.dilation.toFixed(1)} cm dilated, contractions ${Math.round(r.contraction)}%, oxytocin ${Math.round(r.oxytocin)}%.`} />
        <TagRows
          label="Labour."
          items={[
            { text: `Cervix ${r.dilation.toFixed(1)} cm`, tone: r.dilation >= 10 ? 'success' : 'primary' },
            { text: `Contractions ${Math.round(r.contraction)}%` },
            { text: `Oxytocin ${Math.round(r.oxytocin)}%` },
            ...(r.delivered ? [{ text: 'Baby delivered', tone: 'success' as const }] : []),
          ]}
        />
      </View>
    );
  }
  const frame = {
    move: { lobes: rounded(0.9 + 0.2 * Math.min(1, state.milk / 100), 0.02) },
    glow: { lobes: rounded(0.6 * Math.min(1, state.milk / 100), 0.05), ducts: state.ejection ? 0.8 : 0 },
    glowColor: { lobes: '#fff2d0', ducts: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="breasts" frame={frame} label={`Breastfeeding: milk supply ${Math.round(r.milk)}%, prolactin ${Math.round(r.prolactin)}%; milk ejection ${r.ejection ? 'working' : 'inhibited'}.`} />
      <TagRows
        label="Breastfeeding."
        items={[
          { text: `Milk supply ${Math.round(r.milk)}%`, tone: r.milk >= 80 ? 'success' : 'warning' },
          { text: `Prolactin ${Math.round(r.prolactin)}%` },
          { text: r.ejection ? 'Milk ejected (oxytocin)' : 'No let-down', tone: r.ejection ? 'success' : 'error' },
          { text: r.cycles ? 'Ovarian cycles suppressed' : 'Cycles may return' },
        ]}
      />
    </View>
  );
}

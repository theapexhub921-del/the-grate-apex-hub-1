import { View } from 'react-native';

import type { TestisState } from '@/data/simulations/testis-control';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The testes glow with the sperm they produce; warm testes glow red. Anabolic steroids shrink them.
export function TestisControlGraphic({ state, values }: GraphicProps<TestisState>) {
  const r = state.readouts;
  const frame = {
    move: { testes: rounded(0.75 + 0.25 * Math.min(1, state.inside / 30), 0.02) },
    glow: { testes: rounded(0.15 + 0.7 * Math.min(1, state.count / 70), 0.05) },
    glowColor: { testes: values.warm ? '#ff5a3a' : '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="male" frame={frame} label={`LH ${Math.round(r.lh)}%, FSH ${Math.round(r.fsh)}%, blood testosterone ${Math.round(r.blood)}%, sperm ${Math.round(r.count)} million per mL.`} />
      <TagRows
        label="Gonadotropins, testosterone and sperm."
        items={[
          { text: `LH ${Math.round(r.lh)}% · FSH ${Math.round(r.fsh)}%`, tone: r.lh < 60 ? 'error' : 'success' },
          { text: `Blood testosterone ${Math.round(r.blood)}%`, tone: r.blood > 150 ? 'warning' : r.blood < 60 ? 'error' : 'success' },
          { text: `In the tubules ${Math.round(r.inside)}%`, tone: r.inside < 60 ? 'error' : 'success' },
          { text: `Sperm ${Math.round(r.count)} million/mL`, tone: r.count >= 15 ? 'success' : 'error' },
          { text: `Testes ${r.temp} °C`, tone: r.temp > 35 ? 'warning' : 'primary' },
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';

import { BLOCKS, type MaleTractState } from '@/data/simulations/male-tract';

import { Organ3D } from '../organ-3d';
import type { OrganFrame } from '../organ-3d-types';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

// The real male tract: the testes glow with the sperm they make, the ducts carry them on, and the
// seminal glands and prostate glow with the fluid they add. A cut or blocked duct turns red.
export function MaleTractGraphic({ state }: GraphicProps<MaleTractState>) {
  const r = state.readouts;
  const red = '#d23a2a';
  const making = Math.min(1, state.count / 70);
  const frame: OrganFrame = {
    glow: {
      testes: state.leydig ? 0.25 + 0.5 * making : 0.05,
      epididymis: state.block === 0 ? 0.5 * making : 0.4,
      vas: state.block === 0 ? 0.5 * making : 0,
      seminal: state.block === 2 ? 0 : 0.55,
      prostate: 0.5,
      ejaculatory: state.block === 2 ? 0.9 : 0.3,
    },
    glowColor: { testes: '#ffcf5a', epididymis: '#ffcf5a', vas: '#ffcf5a', seminal: '#9fd0ff', prostate: '#9fd0ff', ejaculatory: state.block === 2 ? '#ff2a1a' : '#9fd0ff' },
    color: state.block === 1 ? { vas: red } : state.block === 2 ? { ejaculatory: red } : undefined,
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="male" frame={frame} label={`${BLOCKS[state.block]}: ${Math.round(r.count)} million sperm per mL, ${r.volume.toFixed(1)} mL of semen, testosterone ${Math.round(r.testosterone)}%.`} />
      <TagRows
        label="Sperm, semen and testosterone."
        items={[
          { text: `Sperm ${Math.round(r.count)} million/mL`, tone: r.count >= 15 ? 'success' : 'error' },
          { text: `Semen ${r.volume.toFixed(1)} mL`, tone: r.volume < 1.5 ? 'error' : 'success' },
          { text: `Testosterone ${Math.round(r.testosterone)}%`, tone: r.testosterone < 50 ? 'error' : 'success' },
          { text: r.fructose ? 'Fructose present' : 'No fructose', tone: r.fructose ? 'primary' : 'error' },
        ]}
      />
    </View>
  );
}

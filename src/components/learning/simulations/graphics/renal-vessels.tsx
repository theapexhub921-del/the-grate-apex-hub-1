import { View } from 'react-native';
import { G } from 'react-native-svg';

import { NEPHRONS, type VesselsState } from '@/data/simulations/renal-vessels';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Nephron } from './anatomy/kidney';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 300;
const H = 320;

// The kidney cut open, and one nephron from it: blood in by the afferent
// arteriole, out by the efferent, with the juxtaglomerular apparatus
// glowing as it releases renin.
export function RenalVesselsGraphic({ state, time, reduceMotion }: GraphicProps<VesselsState>) {
  const t = reduceMotion ? 0 : time;
  const radius = (c: number) => 1 - 0.6 * c;
  // the real kidneys: the renal arteries glow with the blood flow, and the kidneys glow amber
  // as the juxtaglomerular cells release renin
  const frame = {
    glow: { arteries: rounded(Math.min(1, state.flow / 140) * 0.5, 0.05), kidneys: rounded(Math.max(0, Math.min(1, (state.renin - 100) / 250)) * 0.7, 0.05) },
    glowColor: { arteries: '#ff6a4a', kidneys: '#ffb347' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="urinary" frame={frame} label={`The kidneys and their blood supply; renin ${Math.round(state.renin)}% of normal`} />
      <Canvas width={W} height={H} label={`${NEPHRONS[state.nephron]}. Glomerular pressure ${Math.round(state.gbhp)} mmHg; renin ${Math.round(state.renin)}% of normal.`}>
        <G transform="translate(30 10) scale(1 1)">
          <Nephron afferent={radius(state.afferent)} efferent={radius(state.efferent)} long={state.nephron === 1} renin={Math.min(1, (state.renin - 60) / 200)} bloodFlow={state.flow / 100} filtrate={Math.min(2, state.gfr / 125)} time={t} />
        </G>
        <Tag x={58} y={102} text="Glomerulus" size={10} />
        <Tag x={78} y={26} text={state.renin > 130 ? 'JGA: renin' : 'JGA'} size={10} tone={state.renin > 130 ? 'warning' : 'primary'} />
        <Tag x={94} y={126} text="Cortex" size={9} />
        <Tag x={94} y={150} text="Medulla" size={9} />
        <Tag x={208} y={state.nephron === 1 ? 300 : 222} text={state.nephron === 1 ? 'Long loop + vasa recta' : 'Short loop'} size={10} />
      </Canvas>
    </View>
  );
}

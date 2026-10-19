import { View } from 'react-native';
import { G } from 'react-native-svg';

import { NEPHRONS, type VesselsState } from '@/data/simulations/renal-vessels';

import { KidneySection, Nephron } from './anatomy/kidney';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 320;

// The kidney cut open, and one nephron from it: blood in by the afferent
// arteriole, out by the efferent, with the juxtaglomerular apparatus
// glowing as it releases renin.
export function RenalVesselsGraphic({ state, time, reduceMotion }: GraphicProps<VesselsState>) {
  const t = reduceMotion ? 0 : time;
  const radius = (c: number) => 1 - 0.6 * c;
  return (
    <View>
      <Canvas width={W} height={H} label={`${NEPHRONS[state.nephron]}. Glomerular pressure ${Math.round(state.gbhp)} mmHg; renin ${Math.round(state.renin)}% of normal.`}>
        <G transform="translate(0 70) scale(0.66)">
          <KidneySection highlight={state.nephron === 1 ? 3 : 2} />
        </G>
        <Tag x={72} y={60} text="Kidney (cut)" size={10} />
        <G transform="translate(148 10) scale(1 1)">
          <Nephron afferent={radius(state.afferent)} efferent={radius(state.efferent)} long={state.nephron === 1} renin={Math.min(1, (state.renin - 60) / 200)} bloodFlow={state.flow / 100} filtrate={Math.min(2, state.gfr / 125)} time={t} />
        </G>
        <Tag x={176} y={102} text="Glomerulus" size={10} />
        <Tag x={196} y={26} text={state.renin > 130 ? 'JGA: renin' : 'JGA'} size={10} tone={state.renin > 130 ? 'warning' : 'primary'} />
        <Tag x={212} y={126} text="Cortex" size={9} />
        <Tag x={212} y={150} text="Medulla" size={9} />
        <Tag x={326} y={state.nephron === 1 ? 300 : 222} text={state.nephron === 1 ? 'Long loop + vasa recta' : 'Short loop'} size={10} />
      </Canvas>
    </View>
  );
}

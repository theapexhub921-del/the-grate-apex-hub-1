import { View } from 'react-native';
import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import type { PhotoState } from '@/data/simulations/phototransduction';
import { useTheme } from '@/hooks/use-theme';

import { mix } from './anatomy/cells';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 230;

// One photoreceptor lying on its side: outer segment (discs of pigment, purple when unbleached),
// inner segment with mitochondria, nucleus and synaptic terminal. Na⁺ flows in through open CNG
// channels in the dark; glutamate vesicles leave the terminal in proportion to the release.
export function PhototransductionGraphic({ state, time, reduceMotion }: GraphicProps<PhotoState>) {
  const colors = useTheme();
  const pigment = mix(A.rhodopsin, A.bleached, Math.round(state.bleached * 20) / 20);
  const discs = Array.from({ length: 14 });
  const t = reduceMotion ? 0 : time;
  const ions = Math.round(state.open / 12);
  const vesicles = Math.round(state.glutamate / 12);
  const cone = state.cone;
  const outer = cone ? `M30 70 L150 92 L150 138 L30 160 Z` : `M30 82 H150 V148 H30 Z`;
  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`A ${cone ? 'cone' : 'rod'}: ${Math.round(state.open)}% of channels open, membrane at ${Math.round(state.potential)} mV, glutamate ${Math.round(state.glutamate)}%.`}>
        <Rect x={0} y={0} width={W} height={H} fill={A.lumenFluid} />
        <Path d={outer} fill={A.sertoli} stroke={A.germEdge} strokeWidth={2} />
        {discs.map((_, i) => {
          const x = 38 + i * 8.2;
          const half = cone ? 42 - i * 1.4 : 30;
          return <Rect key={i} x={x} y={115 - half + 4} width={4} height={2 * half - 8} rx={2} fill={pigment} />;
        })}
        {/* CNG channels along the outer segment: gaps when open */}
        {[48, 88, 128].map((x) => (
          <G key={x}>
            <Rect x={x} y={cone ? 70 + (x - 30) * 0.18 - 5 : 77} width={10} height={9} rx={2} fill={state.open > 50 ? colors.success : colors.textTertiary} />
          </G>
        ))}
        {Array.from({ length: ions }).map((_, i) => {
          const phase = (t * 0.8 + i / Math.max(1, ions)) % 1;
          return <Circle key={`na${i}`} cx={50 + (i % 3) * 40} cy={40 + phase * 40} r={3.5} fill={colors.primary} />;
        })}
        <Path d="M150 98 Q 165 96 170 92 H 235 Q 245 115 235 138 H 170 Q 165 134 150 132 Z" fill={A.germCell} stroke={A.germEdge} strokeWidth={2} />
        {[185, 205, 222].map((x) => (
          <Ellipse key={x} cx={x} cy={115} rx={7} ry={4} fill={A.mitochondria} />
        ))}
        <Path d="M235 104 H 270 V 126 H 235 Z" fill={A.germCell} stroke={A.germEdge} strokeWidth={2} />
        <Ellipse cx={290} cy={115} rx={24} ry={20} fill={A.germCell} stroke={A.germEdge} strokeWidth={2} />
        <Ellipse cx={290} cy={115} rx={13} ry={11} fill={A.nucleus} />
        <Path d="M314 112 H 346 L 360 100 V 130 L 346 118 H 314 Z" fill={A.germCell} stroke={A.germEdge} strokeWidth={2} />
        {Array.from({ length: vesicles }).map((_, i) => {
          const phase = (t * 0.6 + i / Math.max(1, vesicles)) % 1;
          return <Circle key={`g${i}`} cx={364 + phase * 26} cy={102 + (i % 4) * 8} r={3} fill={colors.warning} />;
        })}
        <Tag x={90} y={20} text={state.open > 50 ? 'Na⁺ flows in (dark current)' : 'Channels closed'} size={9} tone={state.open > 50 ? 'primary' : 'warning'} />
        <Tag x={90} y={196} text={cone ? 'Cone outer segment' : 'Rod outer segment'} size={9} />
        <Tag x={290} y={160} text={`${Math.round(state.potential)} mV`} size={10} tone={state.potential < -60 ? 'warning' : 'primary'} />
        <Tag x={330} y={196} text={`Glutamate ${Math.round(state.glutamate)}%`} size={9} />
      </Canvas>
    </View>
  );
}

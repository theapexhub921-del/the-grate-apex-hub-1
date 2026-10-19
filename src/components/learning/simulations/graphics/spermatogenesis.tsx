import { View } from 'react-native';
import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { PLACES, STAGES, type SpermState } from '@/data/simulations/spermatogenesis';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const W = 400;
const H = 230;
const BASE = 200; // basal lamina
const LUMEN = 34;

// A wedge of seminiferous tubule wall, basal lamina at the bottom and the lumen at the top: Sertoli
// cells rise between the germ cells, joined by tight junctions (the blood–testis barrier); each
// generation sits nearer the lumen. The cell this sperm is now is ringed.
function TubuleWall({ stage }: { stage: number }) {
  const colors = useTheme();
  const cell = A.germCell;
  const nucleus = A.nucleus;
  const ring = (k: number) => (stage === k ? { stroke: colors.accent, strokeWidth: 3 } : { stroke: A.germEdge, strokeWidth: 1 });
  const columns = [40, 120, 200, 280, 360];
  return (
    <G>
      <Rect x={0} y={0} width={W} height={LUMEN} fill={A.lumenFluid} />
      <Rect x={0} y={LUMEN} width={W} height={BASE - LUMEN} fill={A.tubuleWall} />
      <Rect x={0} y={BASE} width={W} height={H - BASE} fill={A.interstitium} />
      <Line x1={0} x2={W} y1={BASE} y2={BASE} stroke={A.basalLamina} strokeWidth={3} />
      {/* Sertoli cells: tall columns from the basal lamina to the lumen */}
      {[80, 160, 240, 320].map((x) => (
        <G key={x}>
          <Path d={`M${x - 14} ${BASE} C ${x - 10} 140, ${x - 8} 80, ${x - 4} ${LUMEN} L ${x + 4} ${LUMEN} C ${x + 8} 80, ${x + 10} 140, ${x + 14} ${BASE} Z`} fill={A.sertoli} stroke={A.sertoliEdge} strokeWidth={1} />
          <Ellipse cx={x} cy={BASE - 26} rx={6} ry={9} fill={A.sertoliNucleus} />
        </G>
      ))}
      {/* tight junctions: the blood–testis barrier */}
      <Line x1={0} x2={W} y1={BASE - 46} y2={BASE - 46} stroke={colors.primary} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.7} />
      {columns.map((x, i) => (
        <G key={x}>
          <Circle cx={x} cy={BASE - 16} r={11} fill={cell} {...ring(i % 2 === 0 ? 0 : 1)} />
          <Circle cx={x} cy={BASE - 16} r={5} fill={nucleus} />
          <Circle cx={x} cy={BASE - 72} r={17} fill={cell} {...ring(2)} />
          <Circle cx={x} cy={BASE - 72} r={8} fill={nucleus} />
          {i % 2 === 0 ? (
            <G>
              <Circle cx={x - 8} cy={BASE - 112} r={11} fill={cell} {...ring(3)} />
              <Circle cx={x - 8} cy={BASE - 112} r={5} fill={nucleus} />
            </G>
          ) : null}
          <Circle cx={x + 8} cy={BASE - 132} r={8} fill={cell} {...ring(4)} />
          <Circle cx={x + 8} cy={BASE - 132} r={3.5} fill={nucleus} />
          <Ellipse cx={x} cy={LUMEN + 14} rx={3} ry={6} fill={nucleus} {...ring(5)} />
          <Path d={`M${x} ${LUMEN + 8} q 4 -12 -2 -22 q -5 -8 3 -14`} stroke={A.spermTail} strokeWidth={1.3} fill="none" />
        </G>
      ))}
      <Tag x={60} y={BASE + 16} text="Basal lamina" size={9} />
      <Tag x={W - 70} y={BASE - 46} text="Blood–testis barrier" size={9} />
      <Tag x={W / 2} y={14} text="Lumen" size={9} />
    </G>
  );
}

export function SpermatogenesisGraphic({ state }: GraphicProps<SpermState>) {
  const r = state.readouts;
  const where = ['testes', 'testes', 'testes', 'epididymis', 'vas', 'vas'][state.place];
  const frame = { glow: { [where]: 0.8 }, glowColor: { [where]: '#ffcf5a' } };
  return (
    <View style={{ gap: 10 }}>
      {state.stage <= 5 ? (
        <Canvas width={W} height={H} label={`Inside the seminiferous tubule: the cell is now a ${STAGES[state.stage].toLowerCase()}.`}>
          <TubuleWall stage={state.stage} />
        </Canvas>
      ) : (
        <Organ3D scene="male" frame={frame} label={`${STAGES[state.stage]}: ${PLACES[state.place].toLowerCase()}.`} />
      )}
      <TagRows
        label="The cell, its chromosomes and where it is."
        items={[
          { text: STAGES[state.stage], tone: 'success' },
          { text: `${r.chromosomes} chromosomes` },
          { text: PLACES[state.place] },
          ...(r.capacitated ? [{ text: 'Capacitated: can fertilise', tone: 'success' as const }] : r.motile ? [{ text: 'Motile' }] : []),
        ]}
      />
    </View>
  );
}

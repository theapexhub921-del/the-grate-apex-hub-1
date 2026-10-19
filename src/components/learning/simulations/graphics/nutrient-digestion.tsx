import { View } from 'react-native';

import { NUTRIENTS, PRODUCTS, PROBLEMS, ROUTES, type NutrientState } from '@/data/simulations/nutrient-digestion';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import type { GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const GREY = '#9b9b9b';

// The organs that digest each nutrient glow gold — the salivary glands, stomach, pancreas, liver
// and gallbladder (bile) and the small intestine where it is absorbed. A missing step turns
// grey, and what is not absorbed lights the colon red.
export function NutrientDigestionGraphic({ state }: GraphicProps<NutrientState>) {
  const r = state.readouts;
  const p = state.problem;
  const sources: Record<string, number> = {};
  const greyed: Record<string, string> = {};
  const on = (k: string, v: number, missing: boolean) => {
    sources[k] = missing ? 0 : v;
    if (missing) greyed[k] = GREY;
  };
  if (state.nutrient === 0) {
    on('salivary', 0.5, false);
    on('pancreas', 0.9, p === 1);
  }
  if (state.nutrient === 2) {
    on('stomach', 0.6, p === 5);
    on('pancreas', 0.9, p === 1);
    if (p === 3) greyed.duodenum = GREY;
  }
  if (state.nutrient === 3) {
    on('gallbladder', 0.9, p === 2);
    on('liver', 0.4, p === 2);
    on('pancreas', 0.9, p === 1);
  }
  if (state.nutrient === 1 && p === 4) greyed.jejunum = GREY;
  const frame = {
    glow: { ...sources, jejunum: rounded(0.8 * state.absorbed, 0.05), colon: rounded(Math.min(1, (r.toColon / 60) ** 0.7), 0.05) },
    glowColor: { salivary: '#ffcf5a', stomach: '#ffcf5a', pancreas: '#ffcf5a', gallbladder: '#ffcf5a', liver: '#ffcf5a', jejunum: '#7fd18a', colon: '#ff4a2a' },
    color: greyed,
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="gut" frame={frame} height={340} label={`${NUTRIENTS[state.nutrient]}${p ? `, ${PROBLEMS[p].toLowerCase()}` : ''}: ${Math.round(r.digested)}% digested, ${Math.round(r.absorbed)}% absorbed.`} />
      <TagRows
        label="How much is digested and absorbed, and where it goes."
        items={[
          { text: `Digested ${Math.round(r.digested)}%`, tone: r.digested < 80 ? 'error' : 'success' },
          { text: `Absorbed ${Math.round(r.absorbed)}%`, tone: r.absorbed < 80 ? 'error' : 'success' },
          { text: `As ${PRODUCTS[state.nutrient].toLowerCase()}` },
          { text: `Into the ${ROUTES[r.route].toLowerCase()}` },
          ...(r.toColon > 10 ? [{ text: `${Math.round(r.toColon)}% reaches the colon`, tone: 'error' as const }] : []),
        ]}
      />
    </View>
  );
}

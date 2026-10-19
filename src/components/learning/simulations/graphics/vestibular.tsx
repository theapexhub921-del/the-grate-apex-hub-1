import { View } from 'react-native';
import { G, Line, Path, Rect } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { PHASES, SENSE, type VestibularState } from '@/data/simulations/vestibular';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const W = 400;
const H = 200;

// The ampulla of the right horizontal canal, cut open: the crista with its hair cells, and the
// gelatinous cupula above them, bent by the endolymph. Below, the nerve fibre's spikes.
function Ampulla({ cupula, rate, t }: { cupula: number; rate: number; t: number }) {
  const colors = useTheme();
  const bend = cupula * 26;
  const cx = 200;
  const base = 128;
  const spikes: number[] = [];
  const period = 1 / Math.max(1, rate);
  for (let s = (t % period); s < 1.2; s += period) spikes.push(s);
  return (
    <G>
      <Path d="M 20 70 Q 200 -20 380 70 L 380 150 Q 200 60 20 150 Z" fill={A.endolymph} stroke={A.scleraShade} strokeWidth={3} />
      <Path d={`M ${cx - 60} ${base} Q ${cx} ${base - 26} ${cx + 60} ${base} Z`} fill={A.hairCell} stroke={A.germEdge} strokeWidth={1.5} />
      {[-36, -18, 0, 18, 36].map((dx) => (
        <Path key={dx} d={`M ${cx + dx} ${base - 16 + Math.abs(dx) * 0.3} q ${bend * 0.2} -10 ${bend * 0.4} -22`} stroke={A.germEdge} strokeWidth={2} fill="none" />
      ))}
      <Path d={`M ${cx - 46} ${base - 18} Q ${cx - 40 + bend * 0.5} ${base - 70} ${cx + bend} ${base - 104} Q ${cx + 40 + bend * 0.5} ${base - 70} ${cx + 46} ${base - 18} Z`} fill={A.cupula} stroke={A.scleraShade} strokeWidth={1.5} opacity={0.9} />
      {cupula !== 0 ? <Path d={`M ${cupula > 0 ? 70 : 330} 42 L ${cupula > 0 ? 110 : 290} 36`} stroke={colors.primary} strokeWidth={3} /> : null}
      <Rect x={20} y={168} width={360} height={26} rx={6} fill={colors.surfaceMuted} />
      {spikes.map((s) => (
        <Line key={s} x1={20 + (s / 1.2) * 360} x2={20 + (s / 1.2) * 360} y1={172} y2={190} stroke={colors.error} strokeWidth={1.4} />
      ))}
    </G>
  );
}

export function VestibularGraphic({ state, time, reduceMotion }: GraphicProps<VestibularState>) {
  const r = state.readouts;
  const t = reduceMotion ? 0 : time;
  const frame = {
    glow: { vestibularNerve: rounded(Math.min(1, state.right / 160), 0.05), vestibule: rounded(Math.abs(state.cupula) * 0.6, 0.05) },
    glowColor: { vestibularNerve: '#ffcf5a', vestibule: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="ear" frame={frame} height={220} label={`${PHASES[state.phase]}: right canal ${Math.round(state.right)} spikes a second, left ${Math.round(state.left)}.`} />
      <Canvas width={W} height={H} label={`Inside the right ampulla: the cupula is ${state.cupula > 0 ? 'bent towards the kinocilium' : state.cupula < 0 ? 'bent away from the kinocilium' : 'upright'}; the nerve fires ${Math.round(state.right)} times a second.`}>
        <Ampulla cupula={state.cupula} rate={state.right / 30} t={t} />
        <Tag x={200} y={14} text="Ampulla, right horizontal canal" size={9} />
        <Tag x={330} y={110} text="Cupula" size={9} />
        <Tag x={90} y={128} text="Crista: hair cells" size={9} />
      </Canvas>
      <TagRows
        label="Firing and sensation."
        items={[
          { text: `Right canal ${Math.round(r.right)}/s`, tone: r.right > 100 ? 'warning' : r.right < 80 ? 'error' : 'primary' },
          { text: `Left canal ${Math.round(r.left)}/s`, tone: r.left > 100 ? 'warning' : r.left < 80 ? 'error' : 'primary' },
          { text: `Feels: ${SENSE[r.sense].toLowerCase()}`, tone: r.sense === 2 && state.phase === 3 ? 'error' : 'primary' },
        ]}
      />
    </View>
  );
}

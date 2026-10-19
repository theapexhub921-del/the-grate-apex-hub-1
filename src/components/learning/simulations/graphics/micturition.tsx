import { View } from 'react-native';

import { LESIONS, type BladderState } from '@/data/simulations/micturition';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

// The real bladder in the pelvis: it swells as it fills and squeezes down when voiding, the
// detrusor glowing as it contracts; the pelvic floor (external sphincter) glows while it is
// held shut; the pudendal nerves glow with their activity and stay dark when cut. Urine runs
// down the urethra while voiding.
export function MicturitionGraphic({ state, time, reduceMotion }: GraphicProps<BladderState>) {
  const t = reduceMotion ? 0 : time;
  const v = state.voiding ? Math.max(60, state.volume * (0.55 - 0.25 * ((t * 0.25) % 1))) : state.volume;
  const size = rounded(0.55 + 0.75 * Math.cbrt(Math.max(0, v) / 500), 0.02);
  const frame = {
    move: { bladder: size },
    glow: { bladder: state.voiding ? 0.7 : rounded(state.parasympathetic * 0.4, 0.05), floor: rounded(state.pudendal * 0.45, 0.05), pudendal: state.lesion === 3 ? 0 : rounded(state.pudendal, 0.05), urethra: state.voiding ? 0.8 : 0 },
    glowColor: { bladder: '#ff6a4a', floor: '#ff8a6a', pudendal: '#fff2b0', urethra: '#ffd25a' },
    color: { pudendal: state.lesion === 3 ? '#9b9b9b' : '#e8c95a' },
  };
  const nerves = [
    { name: 'Hypogastric (T12–L2)', on: state.sympathetic > 0.5, cut: state.lesion === 2, role: 'store' },
    { name: 'Pelvic (S2–S4)', on: state.parasympathetic > 0.5, cut: state.lesion === 1, role: 'void' },
    { name: 'Pudendal (S2–S4)', on: state.pudendal > 0.5, cut: state.lesion === 3, role: 'hold' },
  ];
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="bladder" frame={frame} label={`The bladder holding ${Math.round(state.volume)} ml at ${Math.round(state.pressure)} cm H₂O. ${state.voiding ? 'Voiding.' : 'Storing.'} Nerve injury: ${LESIONS[state.lesion]}.`} />
      <Canvas width={400} height={96} label="Activity of the bladder's three nerve supplies.">
        {nerves.map((n, i) => (
          <Tag key={n.name} x={200} y={18 + i * 30} text={`${n.name}: ${n.cut ? 'cut' : n.on ? 'active' : 'quiet'} (${n.role})`} size={10} tone={n.cut ? 'error' : n.on ? 'success' : 'primary'} />
        ))}
      </Canvas>
    </View>
  );
}

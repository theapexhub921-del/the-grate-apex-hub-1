import { View } from 'react-native';
import { Circle, Ellipse, G, Path } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { LESIONS, LIGHTS, type PupilState } from '@/data/simulations/pupil-reflex';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import type { OrganFrame } from '../organ-3d-types';
import { Caption } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 150;

// An eye seen from the front: white sclera, iris with its fibres, and a pupil of the given size.
function Eye({ cx, mm, lit, label }: { cx: number; mm: number; lit: boolean; label: string }) {
  const colors = useTheme();
  const cy = 64;
  const iris = 30;
  const pupil = (mm / 12) * iris * 2;
  return (
    <G>
      <Path d={`M ${cx - 72} ${cy} Q ${cx} ${cy - 54} ${cx + 72} ${cy} Q ${cx} ${cy + 54} ${cx - 72} ${cy} Z`} fill={A.sclera} stroke={A.scleraShade} strokeWidth={2} />
      <Circle cx={cx} cy={cy} r={iris} fill={A.iris} />
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return <Path key={i} d={`M ${cx + Math.cos(a) * pupil} ${cy + Math.sin(a) * pupil} L ${cx + Math.cos(a) * iris * 0.95} ${cy + Math.sin(a) * iris * 0.95}`} stroke={A.irisDark} strokeWidth={1.2} />;
      })}
      <Circle cx={cx} cy={cy} r={pupil} fill={A.pupil} />
      <Ellipse cx={cx - 9} cy={cy - 10} rx={5} ry={3.5} fill="#ffffff" opacity={0.85} />
      {lit ? <Circle cx={cx} cy={cy} r={iris + 14} fill={colors.accent} opacity={0.18} /> : null}
      <Caption x={cx} y={cy + 66} text={`${label}: ${mm.toFixed(1)} mm`} anchor="middle" size={11} tone="secondary" />
    </G>
  );
}

// The two pupils (facing the patient: their right eye on the left), and the reflex pathway in the
// real brain — optic nerves and tracts, the Edinger–Westphal nuclei and the oculomotor nerves.
export function PupilReflexGraphic({ state }: GraphicProps<PupilState>) {
  const on = state.signal ? 0.8 : 0.15;
  const frame: OrganFrame = {
    glow: {
      nerveR: state.light === 1 && state.lesion !== 1 ? 0.8 : 0.1,
      nerveL: state.light === 2 ? 0.8 : 0.1,
      chiasm: on * 0.7,
      tractR: on * 0.7,
      tractL: on * 0.7,
      ew: on,
      cnIII: on,
    },
    glowColor: { nerveR: '#ffcf5a', nerveL: '#ffcf5a', chiasm: '#ffcf5a', tractR: '#ffcf5a', tractL: '#ffcf5a', ew: '#ffcf5a', cnIII: '#ffcf5a' },
    color: state.lesion === 1 ? { nerveR: '#d23a2a' } : undefined,
  };
  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${LIGHTS[state.light]}, ${LESIONS[state.lesion].toLowerCase()}: right pupil ${state.right.toFixed(1)} mm, left pupil ${state.left.toFixed(1)} mm.`}>
        <Eye cx={105} mm={state.right} lit={state.light === 1} label="Right" />
        <Eye cx={295} mm={state.left} lit={state.light === 2} label="Left" />
      </Canvas>
      <Organ3D scene="visual-pathway" frame={frame} height={240} label={`The pupillary reflex pathway is ${state.signal ? 'active' : 'quiet'}.`} />
    </View>
  );
}

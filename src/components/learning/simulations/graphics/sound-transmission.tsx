import { View } from 'react-native';
import { G, Path } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { EARS, FREQS, type SoundState } from '@/data/simulations/sound-transmission';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Caption, Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const W = 400;
const H = 120;
const X0 = 30;
const X1 = 380;

// The basilar membrane uncoiled: narrow and stiff at the base, wide at the apex, with the
// travelling wave peaking at the place this frequency stimulates.
function Membrane({ place, size, t }: { place: number; size: number; t: number }) {
  const colors = useTheme();
  const x = (mm: number) => X0 + (mm / 35) * (X1 - X0);
  const half = (mm: number) => 8 + (mm / 35) * 22;
  const peak = x(place);
  let wave = '';
  for (let mm = 0; mm <= 35; mm += 0.25) {
    const env = Math.exp(-(((mm - place) / 4) ** 2)) * (mm <= place ? 1 : Math.exp(-(mm - place) / 1.5));
    const y = 58 - env * size * 26 * Math.sin(mm * 1.6 - t * 8);
    wave += `${mm === 0 ? 'M' : 'L'}${x(mm).toFixed(1)} ${y.toFixed(1)} `;
  }
  return (
    <G>
      <Path d={`M ${X0} ${58 - half(0)} L ${X1} ${58 - half(35)} L ${X1} ${58 + half(35)} L ${X0} ${58 + half(0)} Z`} fill={A.basilar} opacity={0.75} />
      <Path d={wave} stroke={colors.primary} strokeWidth={2.5} fill="none" />
      <Path d={`M ${peak} 20 L ${peak - 6} 10 H ${peak + 6} Z`} fill={colors.error} />
      <Caption x={X0} y={108} text="Base (oval window): high pitch" size={10} tone="secondary" />
      <Caption x={X1} y={108} text="Apex: low pitch" anchor="end" size={10} tone="secondary" />
    </G>
  );
}

// The real middle and inner ear: the eardrum and ossicles glow and quiver with the sound that
// gets through, the cochlea glows — red when the level is damaging.
export function SoundTransmissionGraphic({ state, values, time, reduceMotion }: GraphicProps<SoundState>) {
  const r = state.readouts;
  const t = reduceMotion ? 0 : time;
  const shake = rounded(1 + 0.04 * state.vibration * Math.sin(t * 20), 0.01);
  const frame = {
    move: { drum: shake },
    glow: { ossicles: rounded(state.vibration * 0.8, 0.05), cochlea: rounded(state.vibration * 0.7, 0.05) },
    glowColor: { ossicles: '#ffcf5a', cochlea: state.danger ? '#ff2a1a' : '#ffcf5a' },
    color: values.ear === 4 ? { ossicles: '#b9a68a' } : undefined,
  };
  const f = FREQS[values.freq];
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="ear" frame={frame} height={250} label={`${values.level} dB at ${f} Hz; ${Math.round(r.atCochlea)} dB reaches the cochlea.`} />
      <Canvas width={W} height={H} label={`The basilar membrane: the wave peaks ${r.place.toFixed(1)} mm from the base.`}>
        <Membrane place={state.place} size={state.audible ? Math.min(1, 0.3 + state.vibration) : 0.05} t={t} />
        <Tag x={W / 2} y={12} text="Basilar membrane, uncoiled" size={9} />
      </Canvas>
      <TagRows
        label="Sound, middle ear and risk."
        items={[
          { text: EARS[values.ear], tone: values.ear ? 'warning' : 'primary' },
          { text: `${Math.round(r.atCochlea)} dB reaches the cochlea` },
          { text: r.audible ? 'Heard' : 'Not heard', tone: r.audible ? 'success' : 'error' },
          ...(r.danger ? [{ text: r.danger === 2 ? 'Immediate damage' : 'Can damage hearing', tone: 'error' as const }] : []),
        ]}
      />
    </View>
  );
}

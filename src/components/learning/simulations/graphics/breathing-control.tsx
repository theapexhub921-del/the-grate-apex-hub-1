import { View } from 'react-native';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { type ControlState } from '@/data/simulations/breathing-control';

import { mix } from './anatomy/cells';
import { useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 340;

const BODY =
  'M66 92 C60 40 104 10 150 16 C192 22 210 54 206 84 L216 104 L206 110 C208 124 204 134 198 138 L200 150 C194 160 180 164 168 160 L166 186 C198 196 240 204 268 214 C306 228 326 280 330 340 L20 340 C18 268 40 214 84 196 L92 170 C74 152 66 124 66 92 Z';
const CEREBRUM = 'M80 88 C76 48 108 28 144 30 C176 32 194 56 190 84 C188 100 172 108 152 106 L112 108 C94 108 82 100 80 88 Z';
const GYRI = [
  'M96 60 C104 52 112 64 120 56 S136 50 142 58',
  'M90 78 C100 70 108 82 118 74 S134 70 142 78 S160 72 172 80',
  'M150 44 C158 40 166 50 176 48',
  'M100 96 C110 90 120 100 132 94 S150 92 162 98',
  'M156 64 C164 58 172 68 182 64',
];
// A lung seen from the side, in the chest.
const LUNG = 'M232 220 C214 224 204 252 200 282 C198 304 200 324 206 338 L300 338 C306 312 300 280 288 256 C276 234 254 218 232 220 Z';

// The breathing control loop, seen from the side: the medulla in the
// brainstem (central chemoreceptors sense CSF H⁺), the carotid body at the
// fork of the carotid artery (peripheral chemoreceptors sense low PO₂) with
// its nerve to the medulla, and the phrenic nerve to the breathing muscles.
// Glowing nerves and receptors show how hard each is driving breathing.
export function BreathingControlGraphic({ state, time, reduceMotion }: GraphicProps<ControlState>) {
  const id = useSvgIds('ctl');
  const vent = state.ventilation;
  const rate = 12 * Math.sqrt(Math.max(0.2, vent / 6));
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time * rate) / 60)) / 2;
  const depth = Math.min(1, Math.sqrt(vent / 6) * 0.35);
  const s = 0.86 + phase * depth * 0.3;
  const glow = (drive: number) => Math.min(1, drive / 3);
  const central = glow(state.central);
  const peripheral = glow(state.peripheral);
  const out = Math.min(1, vent / 25);
  const nerve = (k: number) => mix(A.nerveDark, '#FFF3A8', k);

  return (
    <View>
      <Canvas width={W} height={H} label={`Ventilation ${vent.toFixed(1)} L/min. Central chemoreceptor drive ${Math.round(state.central * 100)}%, peripheral ${Math.round(state.peripheral * 100)}%${state.narcosis ? '; CO₂ narcosis depresses the brain' : ''}.`}>
        <Defs>
          <LinearGradient id={id('skin')} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={A.skinShade} stopOpacity={0.5} />
            <Stop offset="1" stopColor={A.skin} stopOpacity={0.35} />
          </LinearGradient>
          <RadialGradient id={id('brain')} cx="45%" cy="40%" r="65%">
            <Stop offset="0" stopColor={state.narcosis ? '#C9B3BF' : '#F3D3D0'} />
            <Stop offset="1" stopColor={state.narcosis ? '#8D7482' : '#D9A3A3'} />
          </RadialGradient>
          <RadialGradient id={id('hot')} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFF3A8" stopOpacity={0.95} />
            <Stop offset="1" stopColor="#FFF3A8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Path d={BODY} fill={`url(#${id('skin')})`} stroke={A.skinShade} strokeWidth={1.4} />
        {/* brain */}
        <Path d={CEREBRUM} fill={`url(#${id('brain')})`} stroke={A.lungEdge} strokeWidth={1.2} />
        {GYRI.map((g) => (
          <Path key={g} d={g} stroke={A.lungEdge} strokeWidth={1} fill="none" opacity={0.45} />
        ))}
        <Ellipse cx={100} cy={116} rx={22} ry={13} fill={A.lung} stroke={A.lungEdge} strokeWidth={1} />
        {[0, 1, 2, 3].map((k) => (
          <Path key={k} d={`M${82 + k * 2} ${110 + k * 4} Q100 ${106 + k * 4} ${118 - k * 2} ${110 + k * 4}`} stroke={A.lungEdge} strokeWidth={0.8} fill="none" opacity={0.5} />
        ))}
        {/* brainstem and spinal cord */}
        <Path d="M120 100 C132 100 136 112 134 124 C132 136 130 148 128 160 L122 220 L114 220 L116 160 C114 148 112 132 112 118 C112 108 114 100 120 100 Z" fill={A.cartilage} stroke={A.cartilageShade} strokeWidth={1.2} />
        <Ellipse cx={123} cy={140} rx={16 + 10 * central} ry={14 + 8 * central} fill={`url(#${id('hot')})`} opacity={0.25 + 0.75 * central} />
        <Tag x={42} y={150} text="Medulla" size={10} />
        {/* carotid artery, its fork and the carotid body */}
        <Path d="M156 300 C152 260 150 210 150 168 C148 150 142 132 136 118" stroke={A.arteryDark} strokeWidth={9} fill="none" strokeLinecap="round" />
        <Path d="M156 300 C152 260 150 210 150 168 C148 150 142 132 136 118" stroke={A.artery} strokeWidth={6} fill="none" strokeLinecap="round" />
        <Path d="M150 170 C160 156 170 146 180 132" stroke={A.artery} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Path d="M146 168 C138 160 132 150 128 142" stroke={nerve(peripheral)} strokeWidth={1.6 + 2.6 * peripheral} fill="none" strokeLinecap="round" />
        <Circle cx={150} cy={170} r={14 + 10 * peripheral} fill={`url(#${id('hot')})`} opacity={0.2 + 0.8 * peripheral} />
        <Circle cx={150} cy={170} r={4.5} fill={A.fat} stroke={A.nerveDark} strokeWidth={1} />
        <Tag x={206} y={176} text="Carotid body" size={10} anchor="start" />
        {/* phrenic nerve to the diaphragm, and the lung */}
        <Path d="M122 196 C140 222 176 250 196 300 L206 330" stroke={nerve(out)} strokeWidth={1.8 + 2.4 * out} fill="none" strokeLinecap="round" />
        <G transform={`translate(250 330) scale(${s}) translate(-250 -330)`}>
          <Path d={LUNG} fill={A.lung} stroke={A.lungEdge} strokeWidth={1.4} />
          <Path d="M236 236 C244 262 252 290 262 330" stroke={A.lungEdge} strokeWidth={1.4} fill="none" opacity={0.6} />
          <Ellipse cx={238} cy={262} rx={14} ry={26} fill="#FFFFFF" opacity={0.25} />
        </G>
        <Tag x={344} y={250} text={`${vent.toFixed(1)} L/min`} tone={vent < 4 ? 'error' : 'primary'} />
        <Tag x={344} y={274} text="Breathing" size={10} />
        {state.narcosis ? <Tag x={140} y={18} text="CO₂ narcosis" tone="error" /> : null}
      </Canvas>
    </View>
  );
}

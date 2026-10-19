import { View } from 'react-native';
import { Circle, Ellipse, G, Line, Path } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { FOCUS, GLASSES, type AccommodationState } from '@/data/simulations/accommodation';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const W = 400;
const H = 190;
const CY = 95;
const RETINA = 326;

// A cut eye: cornea, lens (thicker as it accommodates) and retina, with light from the object
// meeting where the eye focuses it — on the retina, in front of it or behind it.
function EyeSection({ used, defocus, glasses }: { used: number; defocus: number; glasses: number }) {
  const colors = useTheme();
  const lensW = 9 + used * 1.6;
  const focusX = RETINA - Math.max(-3, Math.min(3, defocus)) * 22;
  const corneaX = 150;
  const lensX = 178;
  const rays = [-34, 34];
  return (
    <G>
      <Circle cx={250} cy={CY} r={82} fill={A.sclera} stroke={A.scleraShade} strokeWidth={6} />
      <Path d={`M 288 ${CY - 66} A 76 76 0 0 1 288 ${CY + 66}`} stroke={A.retina} strokeWidth={5} fill="none" />
      <Path d={`M ${corneaX + 22} ${CY - 50} Q ${corneaX - 14} ${CY} ${corneaX + 22} ${CY + 50}`} fill={A.cornea} stroke={A.scleraShade} strokeWidth={2} />
      <Line x1={lensX} x2={lensX} y1={CY - 44} y2={CY - 28} stroke={A.iris} strokeWidth={6} />
      <Line x1={lensX} x2={lensX} y1={CY + 28} y2={CY + 44} stroke={A.iris} strokeWidth={6} />
      <Ellipse cx={lensX + 8} cy={CY} rx={lensW} ry={30} fill={A.lens} stroke={A.scleraShade} strokeWidth={1.5} />
      {glasses ? (
        <Path d={glasses === 1 ? `M 70 ${CY - 40} q 10 40 0 80 h 14 q -10 -40 0 -80 z` : `M 70 ${CY - 40} q -12 40 0 80 h 14 q 12 -40 0 -80 z`} fill={A.cornea} stroke={colors.textTertiary} strokeWidth={1.5} />
      ) : null}
      {rays.map((dy) => (
        <G key={dy}>
          <Line x1={10} x2={corneaX} y1={CY + dy} y2={CY + dy * 0.9} stroke={colors.accent} strokeWidth={2} />
          <Line x1={corneaX} x2={focusX} y1={CY + dy * 0.9} y2={CY} stroke={colors.accent} strokeWidth={2} />
          {focusX < RETINA ? <Line x1={focusX} x2={RETINA} y1={CY} y2={CY - (dy * 0.9 * (RETINA - focusX)) / (focusX - corneaX)} stroke={colors.accent} strokeWidth={2} strokeDasharray="4 3" /> : null}
        </G>
      ))}
      <Circle cx={focusX} cy={CY} r={4} fill={colors.error} />
      <Tag x={RETINA - 6} y={18} text="Retina" size={9} />
      <Tag x={lensX + 8} y={H - 14} text="Lens" size={9} />
      <Tag x={corneaX - 6} y={18} text="Cornea" size={9} />
    </G>
  );
}

export function AccommodationGraphic({ state, values }: GraphicProps<AccommodationState>) {
  const r = state.readouts;
  const frame = {
    move: { lens: [1, 1, rounded(1 + 0.04 * state.used, 0.01)] as [number, number, number] },
    glow: { zonules: state.used > 0.5 ? 0 : 0.4, retina: state.focus === 1 ? 0.35 : 0 },
    glowColor: { zonules: '#ffcf5a', retina: '#7fd18a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="eye" frame={frame} height={240} label={`Object at ${values.distance} cm: light focuses ${FOCUS[state.focus].toLowerCase()}; ${state.used.toFixed(1)} dioptres of accommodation.`} />
      <Canvas width={W} height={H} label={`Light from the object focuses ${FOCUS[state.focus].toLowerCase()}.`}>
        <EyeSection used={state.used} defocus={state.focus === 1 ? 0 : state.defocus} glasses={values.glasses} />
      </Canvas>
      <TagRows
        label="Focus, accommodation and the near point."
        items={[
          { text: `Focus ${FOCUS[state.focus].toLowerCase()}`, tone: state.focus === 1 ? 'success' : 'error' },
          { text: `Ciliary muscle ${r.ciliary ? 'contracted' : 'relaxed'}` },
          { text: `Near point ${r.near >= 999 ? '—' : `${r.near} cm`}` },
          ...(values.glasses ? [{ text: GLASSES[values.glasses] }] : []),
        ]}
      />
    </View>
  );
}

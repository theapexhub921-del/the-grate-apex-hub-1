import { View } from 'react-native';
import { G, Line, Path, Text as SvgText } from 'react-native-svg';

import { CONDITIONS, FREQS, TYPES, type HearingState } from '@/data/simulations/hearing-loss';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import type { OrganFrame } from '../organ-3d-types';
import { Caption } from './kit';
import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 210;
const L = 44;
const R = 16;
const T = 26;
const B = 186;

// The audiogram: hearing thresholds at each frequency, 0 dB at the top and worse hearing lower
// down. Circles: air conduction; brackets: bone conduction.
export function HearingLossGraphic({ state }: GraphicProps<HearingState>) {
  const colors = useTheme();
  const x = (i: number) => L + (i / (FREQS.length - 1)) * (W - L - R);
  const y = (db: number) => T + (Math.min(100, Math.max(-10, db)) + 10) / 110 * (B - T);
  const path = (v: number[]) => v.map((d, i) => `${i ? 'L' : 'M'}${x(i)} ${y(d)}`).join(' ');
  const right = state.ear === 0;
  const lesion = state.condition === 5 ? 'nerveR' : state.condition === 6 ? 'cortexL' : state.condition === 3 || state.condition === 4 ? 'cochleaR' : null;
  const frame: OrganFrame = {
    glow: { nerveR: 0.3, nerveL: 0.3, colliculi: 0.3, mgb: 0.3, cortexR: 0.3, cortexL: 0.3, ...(lesion ? { [lesion]: 1 } : {}), ...(state.condition === 3 || state.condition === 4 ? { cochleaL: 1 } : {}) },
    glowColor: { nerveR: '#ffcf5a', nerveL: '#ffcf5a', colliculi: '#ffcf5a', mgb: '#ffcf5a', cortexR: '#ffcf5a', cortexL: '#ffcf5a', ...(lesion ? { [lesion]: '#ff2a1a' } : {}), cochleaL: '#ff2a1a' },
  };
  const line = right ? colors.error : colors.primary;
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="hearing-pathway" frame={frame} height={240} label={`${CONDITIONS[state.condition]}: ${TYPES[state.readouts.type].toLowerCase()} hearing in the ${right ? 'right' : 'left'} ear.`} />
      <Canvas width={W} height={H} label={`Audiogram of the ${right ? 'right' : 'left'} ear: average air conduction ${Math.round(state.readouts.air)} dB HL.`}>
        {[0, 20, 40, 60, 80, 100].map((d) => (
          <G key={d}>
            <Line x1={L} x2={W - R} y1={y(d)} y2={y(d)} stroke={colors.border} strokeWidth={1} />
            <Caption x={L - 6} y={y(d) + 4} text={String(d)} anchor="end" size={9} tone="tertiary" />
          </G>
        ))}
        {FREQS.map((f, i) => (
          <Caption key={f} x={x(i)} y={T - 8} text={f >= 1000 ? `${f / 1000}k` : String(f)} anchor="middle" size={9} tone="tertiary" />
        ))}
        <Line x1={L} x2={W - R} y1={y(20)} y2={y(20)} stroke={colors.success} strokeWidth={1.5} strokeDasharray="4 3" />
        <Path d={path(state.bone)} stroke={colors.textTertiary} strokeWidth={1.5} strokeDasharray="5 4" fill="none" />
        {state.bone.map((d, i) => (
          <SvgText key={`b${i}`} x={x(i) - 9} y={y(d) + 5} fontSize={14} fontWeight="700" fill={colors.textSecondary}>
            [
          </SvgText>
        ))}
        <Path d={path(state.air)} stroke={line} strokeWidth={2.5} fill="none" />
        {state.air.map((d, i) => (
          <G key={`a${i}`}>
            <Path d={`M ${x(i) - 6} ${y(d)} a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0`} fill={colors.surface} stroke={line} strokeWidth={2.5} />
          </G>
        ))}
      </Canvas>
      <Legend
        items={[
          { label: 'Air conduction', color: line },
          { label: 'Bone conduction', color: colors.textTertiary, dashed: true },
          { label: 'Normal (≤ 20 dB)', color: colors.success, dashed: true },
        ]}
      />
    </View>
  );
}

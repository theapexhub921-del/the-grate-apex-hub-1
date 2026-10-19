import { View } from 'react-native';
import { Circle, G, Line, Path } from 'react-native-svg';

import { DEFECTS, LESIONS, type Field, type FieldState } from '@/data/simulations/visual-fields';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import type { OrganFrame } from '../organ-3d-types';
import { Caption } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 150;
const R = 52;

// A field chart: what one eye sees, as the patient sees it; lost quadrants are dark.
function FieldChart({ cx, field, label }: { cx: number; field: Field; label: string }) {
  const colors = useTheme();
  const cy = 72;
  const quad = (i: number) => {
    const left = i < 2;
    const upper = i % 2 === 0;
    const sx = left ? -1 : 1;
    const sy = upper ? -1 : 1;
    return `M ${cx} ${cy} L ${cx + sx * R} ${cy} A ${R} ${R} 0 0 ${sx * sy > 0 ? 1 : 0} ${cx} ${cy + sy * R} Z`;
  };
  return (
    <G>
      <Circle cx={cx} cy={cy} r={R} fill={colors.surface} stroke={colors.border} strokeWidth={2} />
      {field.map((lost, i) => (lost ? <Path key={i} d={quad(i)} fill={colors.text} opacity={0.85} /> : null))}
      <Line x1={cx - R} x2={cx + R} y1={cy} y2={cy} stroke={colors.border} strokeWidth={1} />
      <Line x1={cx} x2={cx} y1={cy - R} y2={cy + R} stroke={colors.border} strokeWidth={1} />
      <Circle cx={cx} cy={cy} r={3} fill={colors.error} />
      <Caption x={cx} y={cy + R + 18} text={label} anchor="middle" size={11} tone="secondary" />
    </G>
  );
}

// The real pathway from below, the lesion in red; and what each eye can still see.
export function VisualFieldsGraphic({ state }: GraphicProps<FieldState>) {
  const red = '#d23a2a';
  const part = [null, 'nerveR', 'chiasm', 'tractR', 'cortexR'][state.lesion];
  const frame: OrganFrame = {
    glow: { nerveL: 0.3, nerveR: 0.3, chiasm: 0.3, tractL: 0.3, tractR: 0.3, lgn: 0.3, ...(part ? { [part]: 1 } : {}) },
    glowColor: { nerveL: '#ffcf5a', nerveR: '#ffcf5a', chiasm: '#ffcf5a', tractL: '#ffcf5a', tractR: '#ffcf5a', lgn: '#ffcf5a', ...(part ? { [part]: '#ff2a1a' } : {}) },
    color: part ? { [part]: red } : undefined,
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="visual-pathway" frame={frame} label={`${LESIONS[state.lesion]}: ${DEFECTS[state.lesion].toLowerCase()}.`} />
      <Canvas width={W} height={H} label={`Visual fields: ${DEFECTS[state.lesion].toLowerCase()}.`}>
        <FieldChart cx={110} field={state.leftEye} label="Left eye" />
        <FieldChart cx={290} field={state.rightEye} label="Right eye" />
      </Canvas>
    </View>
  );
}

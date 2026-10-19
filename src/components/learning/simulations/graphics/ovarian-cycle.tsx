import { View } from 'react-native';
import { Circle, Ellipse, G, Path } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { FOLLICLES, OOCYTE, type OvaryState } from '@/data/simulations/ovarian-cycle';
import { useTheme } from '@/hooks/use-theme';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { Canvas, type GraphicProps } from './shared';
import { TagRows } from './tag-rows';

const W = 400;
const H = 170;

// The follicle under the microscope at today's stage: oocyte and zona, granulosa layers, theca,
// antrum; then the ruptured follicle, corpus luteum and corpus albicans.
function Follicle({ stage }: { stage: number }) {
  const colors = useTheme();
  const cx = W / 2;
  const cy = H / 2;
  const outer = [16, 22, 34, 52, 70, 70, 50, 58, 34][stage];
  const layers = [1, 1, 3, 4, 3, 3, 0, 0, 0][stage];
  return (
    <G>
      <Path d={`M0 0 H${W} V${H} H0 Z`} fill={A.stroma} />
      {stage >= 6 ? (
        <G>
          <Circle cx={cx} cy={cy} r={outer} fill={stage === 8 ? A.albicans : A.luteum} stroke={A.theca} strokeWidth={3} />
          {stage === 6 ? <Circle cx={cx} cy={cy} r={outer * 0.55} fill={A.bloodOxy} opacity={0.7} /> : null}
          {stage === 7 ? <Path d={`M${cx - outer * 0.6} ${cy} q ${outer * 0.6} -${outer * 0.5} ${outer * 1.2} 0`} stroke={A.theca} strokeWidth={2} fill="none" opacity={0.6} /> : null}
        </G>
      ) : (
        <G>
          {stage >= 2 ? <Circle cx={cx} cy={cy} r={outer + 8} fill={A.theca} opacity={0.75} /> : null}
          <Circle cx={cx} cy={cy} r={outer} fill={A.granulosa} />
          {stage >= 3 ? <Ellipse cx={cx + outer * 0.18} cy={cy - outer * 0.05} rx={outer * 0.68} ry={outer * 0.62} fill={A.antrum} /> : null}
          {Array.from({ length: layers }).map((_, i) => (
            <Circle key={i} cx={stage >= 3 ? cx - outer * 0.55 : cx} cy={cy} r={(stage >= 3 ? 14 : outer * 0.55) + i * 2} fill="none" stroke={A.granulosa} strokeWidth={2} />
          ))}
          <Circle cx={stage >= 3 ? cx - outer * 0.55 : cx} cy={cy} r={stage === 0 ? 9 : 12} fill={A.zona} />
          <Circle cx={stage >= 3 ? cx - outer * 0.55 : cx} cy={cy} r={stage === 0 ? 7 : 9.5} fill={A.oocyte} stroke={stage >= 1 ? colors.border : 'none'} />
          <Circle cx={stage >= 3 ? cx - outer * 0.55 : cx} cy={cy} r={3} fill={A.nucleus} />
          {stage === 5 ? <Path d={`M${cx + outer} ${cy} l 26 -10 M${cx + outer} ${cy} l 26 10`} stroke={colors.error} strokeWidth={3} /> : null}
        </G>
      )}
    </G>
  );
}

export function OvarianCycleGraphic({ state, values }: GraphicProps<OvaryState>) {
  const r = state.readouts;
  const swell = state.stage <= 5 ? 1 + state.size / 70 : 1 + 0.12 * state.luteum;
  const frame = {
    move: { ovaryR: rounded(swell, 0.02) },
    glow: { ovaryR: state.stage >= 6 ? rounded(0.7 * state.luteum, 0.05) : rounded(0.2 + state.size / 40, 0.05), ...(state.stage === 5 ? { ampulla: 0.6 } : {}) },
    glowColor: { ovaryR: state.stage >= 6 ? '#ffd23a' : '#ffcf5a', ampulla: '#ffcf5a' },
  };
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="female" frame={frame} height={250} label={`Day ${values.day}: ${FOLLICLES[state.stage].toLowerCase()} in the right ovary.`} />
      <Canvas width={W} height={H} label={`The follicle on day ${values.day}: ${FOLLICLES[state.stage].toLowerCase()}.`}>
        <Follicle stage={state.stage} />
      </Canvas>
      <TagRows
        label="The follicle and the oocyte."
        items={[
          { text: FOLLICLES[state.stage], tone: 'success' },
          ...(r.size > 0 ? [{ text: `Dominant follicle ${Math.round(r.size)} mm` }] : []),
          { text: OOCYTE[r.oocyte] },
          ...(r.luteum > 0 ? [{ text: `Corpus luteum ${Math.round(r.luteum)}%`, tone: 'warning' as const }] : []),
        ]}
      />
    </View>
  );
}

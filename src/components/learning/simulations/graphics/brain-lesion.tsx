import { View } from 'react-native';
import { Circle, Ellipse, G, Path, Text as SvgText } from 'react-native-svg';

import { FUNCTIONS, REGIONS, type BrainState } from '@/data/simulations/brain-lesion';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 280;

// A left-side view of the brain, drawn in a 230 × 220 box.
const LOBES = {
  frontal: 'M18 128 C8 80 38 40 112 36 L116 120 C90 128 60 136 18 128 Z',
  parietal: 'M112 36 C152 34 182 46 198 72 L152 102 L116 120 Z',
  occipital: 'M198 72 C218 96 218 120 204 136 L170 132 L152 102 Z',
  temporal: 'M18 128 C60 136 90 128 116 120 L152 102 L170 132 C142 160 82 166 42 150 Z',
};
const LOBE_LABELS: [string, number, number][] = [
  ['Frontal', 64, 86],
  ['Parietal', 150, 68],
  ['Occipital', 192, 112],
  ['Temporal', 92, 146],
];

export function BrainLesionGraphic({ state }: GraphicProps<BrainState>) {
  const colors = useTheme();
  const r = state.region;
  const hit = { fill: colors.errorSubtle, stroke: colors.error, strokeWidth: 3 };
  const lobeStyle = (on: boolean) => (on ? hit : { fill: colors.surfaceMuted, stroke: colors.borderStrong, strokeWidth: 1.5 });

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${REGIONS[r]}. ${state.lost.length} functions affected.`}>
        <G>
          <Path d={LOBES.frontal} {...lobeStyle(r === 2)} />
          <Path d={LOBES.parietal} {...lobeStyle(r === 4 || r === 5)} />
          <Path d={LOBES.occipital} {...lobeStyle(r === 7)} />
          <Path d={LOBES.temporal} {...lobeStyle(false)} />
          <Ellipse cx={180} cy={160} rx={30} ry={17} fill={colors.surfaceMuted} stroke={colors.borderStrong} strokeWidth={1.5} />
          <Path d="M128 146 L148 142 L152 206 L136 206 Z" {...lobeStyle(r === 10)} />
          {LOBE_LABELS.map(([label, lx, ly]) => (
            <SvgText key={label} x={lx} y={ly} fontSize={11} fontWeight="800" fill={colors.textTertiary} textAnchor="middle">
              {label}
            </SvgText>
          ))}
          <SvgText x={180} y={164} fontSize={9} fontWeight="800" fill={colors.textTertiary} textAnchor="middle">
            Cerebellum
          </SvgText>
          <SvgText x={156} y={222} fontSize={9} fontWeight="800" fill={colors.textTertiary} textAnchor="middle">
            Brainstem
          </SvgText>
          {r === 1 ? <Circle cx={92} cy={110} r={12} {...hit} /> : null}
          {r === 3 ? <Circle cx={140} cy={126} r={12} {...hit} /> : null}
          {r === 6 ? <Circle cx={206} cy={106} r={10} {...hit} /> : null}
          {r === 8 ? <Circle cx={118} cy={136} r={12} fill={colors.errorSubtle} stroke={colors.error} strokeWidth={3} strokeDasharray="4 3" /> : null}
          {r === 9 ? <Path d="M60 84 C100 60 150 62 182 88" stroke={colors.error} strokeWidth={6} strokeDasharray="8 5" strokeLinecap="round" fill="none" /> : null}
          <SvgText x={14} y={250} fontSize={10} fontWeight="700" fill={colors.textTertiary}>
            Seen from the left. Dashed = deep inside.
          </SvgText>
          {r === 5 ? (
            <SvgText x={14} y={264} fontSize={10} fontWeight="800" fill={colors.errorBorder}>
              Right hemisphere: same place on the other side.
            </SvgText>
          ) : null}
        </G>

        {/* Functions checklist */}
        {FUNCTIONS.map((f, i) => {
          const ok = state.readouts[f.key] === 1;
          const yy = 22 + i * 22;
          return (
            <G key={f.key}>
              <Circle cx={240} cy={yy - 4} r={6} fill={ok ? colors.successSubtle : colors.error} stroke={ok ? colors.successBorder : colors.error} />
              <SvgText x={252} y={yy} fontSize={11} fontWeight={ok ? '700' : '900'} fill={ok ? colors.textSecondary : colors.text}>
                {f.label}
              </SvgText>
            </G>
          );
        })}
      </Canvas>
    </View>
  );
}

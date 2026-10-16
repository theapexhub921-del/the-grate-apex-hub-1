import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { StarlingState } from '@/data/simulations/capillary-starling';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 260;
const X0 = 40;
const X1 = 318;
const TISSUE_TOP = 16;
const TISSUE_BOTTOM = 112;
const TUBE_TOP = 128;
const TUBE_BOTTOM = 160;
const POSITIONS = [0.06, 0.2, 0.34, 0.5, 0.66, 0.8, 0.94];

const signed = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`;

export function CapillaryStarlingGraphic({ state, time, reduceMotion }: GraphicProps<StarlingState>) {
  const colors = useTheme();
  const level = Math.min(1, state.oedema / 60);
  const fluidTop = TISSUE_BOTTOM - 12 - level * (TISSUE_BOTTOM - TISSUE_TOP - 24);
  const lymphWidth = 4 + Math.min(14, state.lymph * 0.6);
  const blocked = state.lymphCapacity < 2;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Capillary. Net pressure ${signed(state.netArterial)} mmHg at the arterial end, ${signed(state.netVenous)} at the venous end.`}>
        <Rect x={X0 - 10} y={TISSUE_TOP} width={X1 - X0 + 20} height={TISSUE_BOTTOM - TISSUE_TOP} rx={12} fill={colors.surfaceMuted} stroke={colors.border} />
        <Rect x={X0 - 10} y={fluidTop} width={X1 - X0 + 20} height={TISSUE_BOTTOM - fluidTop} rx={12} fill={colors.info} opacity={0.18 + level * 0.35} />
        <SvgText x={X0} y={TISSUE_TOP + 18} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          {level > 0 ? 'Tissue fluid — building up (oedema)' : 'Tissue fluid (interstitium)'}
        </SvgText>
        <Rect x={X0} y={TUBE_TOP} width={X1 - X0} height={TUBE_BOTTOM - TUBE_TOP} rx={16} fill={colors.error} fillOpacity={0.14} stroke={colors.error} strokeWidth={2} />
        <SvgText x={X0} y={TUBE_BOTTOM + 20} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          {`Arterial end ${Math.round(state.pc)} mmHg`}
        </SvgText>
        <SvgText x={X1} y={TUBE_BOTTOM + 20} fontSize={12} fontWeight="800" fill={colors.textSecondary} textAnchor="end">
          {`Venous end ${Math.round(state.pc - 20)} mmHg`}
        </SvgText>
        {POSITIONS.map((p) => {
          const net = state.netArterial + (state.netVenous - state.netArterial) * p;
          const x = X0 + (X1 - X0) * p;
          const out = net > 0;
          const length = Math.min(70, Math.abs(net) * 2.4 + (Math.abs(net) > 0.2 ? 6 : 0));
          if (length < 2) return null;
          const color = out ? colors.warning : colors.primary;
          const yStart = out ? TUBE_TOP - 2 : TUBE_TOP - 2 - length;
          const yEnd = out ? TUBE_TOP - 2 - length : TUBE_TOP - 2;
          const phase = reduceMotion ? 0.5 : (time * 1.5 + p) % 1;
          return (
            <G key={p}>
              <Line x1={x} x2={x} y1={yStart} y2={yEnd} stroke={color} strokeWidth={3 + Math.min(4, Math.abs(net) * 0.2)} strokeLinecap="round" />
              <Path d={out ? `M${x - 6} ${yEnd + 7} L${x} ${yEnd - 1} L${x + 6} ${yEnd + 7} Z` : `M${x - 6} ${yEnd - 7} L${x} ${yEnd + 1} L${x + 6} ${yEnd - 7} Z`} fill={color} />
              <Circle cx={x} cy={yStart + (yEnd - yStart) * phase} r={2.5} fill={colors.surface} />
            </G>
          );
        })}
        <SvgText x={X0} y={TUBE_BOTTOM + 40} fontSize={12} fontWeight="900" fill={state.netArterial > 0 ? colors.warningText : colors.primaryText}>
          {`Net ${signed(state.netArterial)} mmHg`}
        </SvgText>
        <SvgText x={X1} y={TUBE_BOTTOM + 40} fontSize={12} fontWeight="900" fill={state.netVenous > 0 ? colors.warningText : colors.primaryText} textAnchor="end">
          {`Net ${signed(state.netVenous)} mmHg`}
        </SvgText>
        <Rect x={W - 58} y={TISSUE_TOP + 30} width={lymphWidth} height={TUBE_BOTTOM + 40 - TISSUE_TOP - 30} rx={lymphWidth / 2} fill={colors.success} opacity={blocked ? 0.35 : 0.8} />
        <SvgText x={W - 58 + lymphWidth / 2} y={TISSUE_TOP + 22} fontSize={12} fontWeight="800" fill={colors.successText} textAnchor="middle">
          Lymph
        </SvgText>
        {blocked ? (
          <G>
            <Line x1={W - 70} x2={W - 34} y1={TUBE_TOP - 18} y2={TUBE_TOP + 18} stroke={colors.error} strokeWidth={4} strokeLinecap="round" />
            <Line x1={W - 34} x2={W - 70} y1={TUBE_TOP - 18} y2={TUBE_TOP + 18} stroke={colors.error} strokeWidth={4} strokeLinecap="round" />
          </G>
        ) : null}
        <SvgText x={W - 58 + lymphWidth / 2} y={TUBE_BOTTOM + 58} fontSize={11} fontWeight="700" fill={colors.textTertiary} textAnchor="middle">
          {`${state.lymph.toFixed(1)} L/day`}
        </SvgText>
        {state.leaky ? (
          <SvgText x={(X0 + X1) / 2} y={TUBE_BOTTOM - 10} fontSize={11} fontWeight="800" fill={colors.error} textAnchor="middle">
            leaky wall
          </SvgText>
        ) : null}
      </Canvas>
      <Legend
        items={[
          { label: 'Fluid pushed out', color: colors.warning },
          { label: 'Fluid drawn back in', color: colors.primary },
          { label: 'Lymph', color: colors.success },
        ]}
      />
    </View>
  );
}

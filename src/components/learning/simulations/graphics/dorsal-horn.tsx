import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { HornState } from '@/data/simulations/dorsal-horn';
import { useTheme } from '@/hooks/use-theme';

import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const X0 = 96;
const X1 = 316;

const LAMINAE = [
  { label: 'I', top: 30, bottom: 52 },
  { label: 'II · substantia gelatinosa', top: 52, bottom: 96 },
  { label: 'III–IV', top: 96, bottom: 156 },
  { label: 'V', top: 156, bottom: 200 },
  { label: 'VI', top: 200, bottom: 236 },
];

const NS = { x: 236, y: 42 };
const LT = { x: 214, y: 126 };
const WDR = { x: 262, y: 178 };

const width = (rate: number) => 1.2 + Math.min(7, rate / 16);

export function DorsalHornGraphic({ state }: GraphicProps<HornState>) {
  const colors = useTheme();

  const cell = (p: { x: number; y: number }, rate: number, name: string, color: string) => (
    <G key={name}>
      <Circle cx={p.x} cy={p.y} r={8 + Math.min(10, rate / 12)} fill={color} opacity={0.15 + Math.min(0.85, rate / 90)} />
      <Circle cx={p.x} cy={p.y} r={7} fill={rate > 0 ? color : colors.surface} stroke={color} strokeWidth={2} />
      <SvgText x={p.x + 20} y={p.y - 2} fontSize={11} fontWeight="900" fill={colors.text}>
        {name}
      </SvgText>
      <SvgText x={p.x + 20} y={p.y + 12} fontSize={10} fontWeight="800" fill={colors.textSecondary}>
        {`${Math.round(rate)} /s`}
      </SvgText>
    </G>
  );

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Dorsal horn: LT cell ${Math.round(state.lt)}, NS cell ${Math.round(state.ns)}, WDR cell ${Math.round(state.wdr)} per second; pain signal sent up ${Math.round(state.output)} per second.`}>
        {LAMINAE.map((lamina, i) => (
          <G key={lamina.label}>
            <Rect x={X0} y={lamina.top} width={X1 - X0} height={lamina.bottom - lamina.top} fill={i % 2 === 0 ? colors.surfaceMuted : colors.surface} stroke={colors.border} />
            <SvgText x={X0 + 6} y={lamina.top + 14} fontSize={10} fontWeight="800" fill={colors.textTertiary}>
              {lamina.label}
            </SvgText>
          </G>
        ))}
        <SvgText x={(X0 + X1) / 2} y={18} fontSize={11} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          Dorsal horn (laminae)
        </SvgText>

        {/* Afferents entering from the dorsal root */}
        <Path d={`M8 70 Q60 70 ${NS.x - 10} ${NS.y + 4}`} stroke={colors.warning} strokeWidth={width(state.noxious * 1.2)} fill="none" strokeLinecap="round" />
        <Path d={`M8 76 Q120 90 ${WDR.x - 30} 80`} stroke={colors.warning} strokeWidth={width(state.noxious)} fill="none" strokeLinecap="round" />
        <Path d={`M8 132 Q120 132 ${LT.x - 10} ${LT.y}`} stroke={colors.primary} strokeWidth={width(state.touch * 1.2)} fill="none" strokeLinecap="round" />
        <Path d={`M8 138 Q140 150 ${WDR.x - 10} ${WDR.y - 4}`} stroke={colors.primary} strokeWidth={width(state.touch)} fill="none" strokeLinecap="round" />
        <SvgText x={8} y={60} fontSize={10} fontWeight="900" fill={colors.warningText}>
          C, Aδ
        </SvgText>
        <SvgText x={8} y={122} fontSize={10} fontWeight="900" fill={colors.primaryText}>
          Aβ
        </SvgText>

        {/* WDR dendrite reaching up into laminae I–II */}
        <Line x1={WDR.x} y1={WDR.y} x2={WDR.x - 30} y2={80} stroke={colors.accent} strokeWidth={2} strokeDasharray="3 3" />

        {/* Descending fibres */}
        <Path d={`M${X1 + 70} 14 Q${X1 + 20} 40 ${NS.x + 30} ${NS.y + 30}`} stroke={colors.success} strokeWidth={width(state.descending)} strokeDasharray="6 4" fill="none" opacity={state.descending > 0 ? 1 : 0.3} />
        <SvgText x={X1 + 6} y={20} fontSize={10} fontWeight="800" fill={colors.successText}>
          From brainstem
        </SvgText>

        {/* Output: crosses to the spinothalamic tract */}
        <Path d={`M${NS.x} ${NS.y} Q${X1 + 30} 60 ${X1 + 30} 250 L${X1 + 30} ${H - 22}`} stroke={colors.error} strokeWidth={width(state.output)} fill="none" strokeLinecap="round" />
        <SvgText x={W - 6} y={H - 8} fontSize={10} fontWeight="800" fill={colors.textSecondary} textAnchor="end">
          {`Up the spinothalamic tract: ${Math.round(state.output)} /s`}
        </SvgText>

        {cell(NS, state.ns, 'NS', colors.warning)}
        {cell(LT, state.lt, 'LT', colors.primary)}
        {cell(WDR, state.wdr, 'WDR', colors.accent)}
      </Canvas>
      <Legend
        items={[
          { label: 'Aβ (touch)', color: colors.primary },
          { label: 'C and Aδ (noxious)', color: colors.warning },
          { label: 'Descending inhibition', color: colors.success, dashed: true },
          { label: 'Pain signal sent up', color: colors.error },
        ]}
      />
    </View>
  );
}

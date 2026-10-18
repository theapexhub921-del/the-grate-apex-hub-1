import { View } from 'react-native';
import { Ellipse, Line, Path, Rect } from 'react-native-svg';

import { AIRWAYS, type MechanicsState } from '@/data/simulations/breathing-mechanics';
import { useTheme } from '@/hooks/use-theme';

import { Bars, Caption } from './kit';
import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 320;

export function BreathingMechanicsGraphic({ state, baseline }: GraphicProps<MechanicsState>) {
  const colors = useTheme();
  const lungW = (s: MechanicsState) => (s.pneumothorax ? 18 : 30 + s.tidal / 36);
  const lungH = (s: MechanicsState) => (s.pneumothorax ? 22 : 40 + s.tidal / 40);
  const airway = 10 / Math.sqrt(state.resistance);
  const cx = 200;
  const cy = 112;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Tidal volume ${Math.round(state.tidal)} ml; intrapleural pressure ${state.intrapleural.toFixed(1)} mmHg; ${state.pneumothorax ? 'lung collapsed' : 'lung expanded'}.`}>
        {/* chest wall */}
        <Path d={`M${cx - 120} 40 Q${cx} 6 ${cx + 120} 40 L${cx + 128} 196 L${cx - 128} 196 Z`} fill={state.pneumothorax ? colors.errorSubtle : colors.surfaceMuted} stroke={colors.borderStrong} strokeWidth={2} />
        {/* diaphragm */}
        <Path d={`M${cx - 128} 196 Q${cx} ${196 - 34 + state.effort / 6} ${cx + 128} 196`} stroke={colors.textSecondary} strokeWidth={4} fill="none" />
        {/* trachea and bronchi */}
        <Rect x={cx - airway / 2} y={6} width={airway} height={44} fill={colors.surface} stroke={colors.text} strokeWidth={1.5} />
        <Line x1={cx} y1={50} x2={cx - 40} y2={78} stroke={colors.text} strokeWidth={airway} strokeLinecap="round" opacity={0.6} />
        <Line x1={cx} y1={50} x2={cx + 40} y2={78} stroke={colors.text} strokeWidth={airway} strokeLinecap="round" opacity={0.6} />
        {/* lungs: before (dashed) and now */}
        <Ellipse cx={cx - 62} cy={cy + 14} rx={lungW(baseline)} ry={lungH(baseline)} fill="none" stroke={colors.textTertiary} strokeDasharray="5 4" />
        <Ellipse cx={cx + 62} cy={cy + 14} rx={lungW(baseline)} ry={lungH(baseline)} fill="none" stroke={colors.textTertiary} strokeDasharray="5 4" />
        <Ellipse cx={cx - 62} cy={cy + 14} rx={lungW(state)} ry={lungH(state)} fill={colors.primary} opacity={0.35} stroke={colors.primary} strokeWidth={2} />
        <Ellipse cx={cx + 62} cy={cy + 14} rx={lungW(state)} ry={lungH(state)} fill={colors.primary} opacity={0.35} stroke={colors.primary} strokeWidth={2} />
        <Caption x={cx} y={214} anchor="middle" text={`Airways: ${AIRWAYS[state.airway]}${state.pneumothorax ? ' · pneumothorax' : ''}`} />

        <Bars
          x={16}
          y={226}
          width={W - 16}
          rows={[
            { label: 'Air breathed in', value: state.tidal, baseline: baseline.tidal, max: 1000, color: colors.primary, text: `${Math.round(state.tidal)} ml` },
            { label: 'Intrapleural', value: state.intrapleural, baseline: baseline.intrapleural, min: -10, max: 0, color: colors.accent, text: `${state.intrapleural.toFixed(1)} mmHg` },
            { label: 'Lung pressure', value: state.lungPressure, baseline: baseline.lungPressure, min: -4, max: 0, color: colors.success, text: `${state.lungPressure.toFixed(1)} mmHg` },
          ]}
        />
      </Canvas>
      <Legend
        items={[
          { label: 'Lung now', color: colors.primary },
          { label: 'Before', color: colors.textTertiary, dashed: true },
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';
import { Rect } from 'react-native-svg';

import { type VentilationState } from '@/data/simulations/alveolar-ventilation';
import { useTheme } from '@/hooks/use-theme';

import { Bars, Caption } from './kit';
import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 300;

// One breath as a bar split into dead space and fresh alveolar air, then
// the per-minute totals.
export function AlveolarVentilationGraphic({ state, baseline }: GraphicProps<VentilationState>) {
  const colors = useTheme();
  const scale = 300 / 1500;
  const deadW = Math.min(state.tidal, state.dead) * scale;
  const freshW = state.perBreath * scale;

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Each breath ${Math.round(state.tidal)} ml: ${Math.round(Math.min(state.tidal, state.dead))} ml dead space, ${Math.round(state.perBreath)} ml to the alveoli. Alveolar ventilation ${state.readouts.alveolar.toFixed(1)} L/min.`}>
        <Caption x={20} y={24} text={`One breath: ${Math.round(state.tidal)} ml × ${Math.round(state.rate)} breaths a minute`} tone="primary" />
        <Rect x={20} y={36} width={300} height={34} rx={8} fill={colors.surfaceMuted} />
        <Rect x={20} y={36} width={deadW} height={34} rx={8} fill={colors.textTertiary} opacity={0.6} />
        <Rect x={20 + deadW} y={36} width={freshW} height={34} rx={8} fill={colors.primary} opacity={0.85} />
        <Caption x={20} y={88} text={`Dead space ${Math.round(Math.min(state.tidal, state.dead))} ml`} tone="tertiary" size={11} />
        <Caption x={320} y={88} anchor="end" text={`To the alveoli ${Math.round(state.perBreath)} ml`} size={11} />

        <Bars
          x={20}
          y={120}
          width={W - 20}
          labelWidth={130}
          rows={[
            { label: 'Minute volume', value: state.readouts.minute, baseline: baseline.readouts.minute, max: 30, color: colors.textSecondary, text: `${state.readouts.minute.toFixed(1)} L` },
            { label: 'Alveolar ventilation', value: state.readouts.alveolar, baseline: baseline.readouts.alveolar, max: 30, color: colors.primary, text: `${state.readouts.alveolar.toFixed(1)} L` },
            { label: 'Wasted (dead space)', value: state.readouts.deadVent, baseline: baseline.readouts.deadVent, max: 30, color: colors.warning, text: `${state.readouts.deadVent.toFixed(1)} L` },
          ]}
        />
        <Caption x={20} y={240} text="Per minute. Dashed marks: before your change." tone="tertiary" size={11} />
      </Canvas>
      <Legend
        items={[
          { label: 'Fresh air to alveoli', color: colors.primary },
          { label: 'Dead space', color: colors.textTertiary },
        ]}
      />
    </View>
  );
}

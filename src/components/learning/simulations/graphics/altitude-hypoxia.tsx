import { View } from 'react-native';
import { Circle, Path, Rect } from 'react-native-svg';

import { HYPOXIA_TYPES, PROBLEMS, type AltitudeState } from '@/data/simulations/altitude-hypoxia';
import { useTheme } from '@/hooks/use-theme';

import { Bars, Caption } from './kit';
import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 320;

// A mountain with the climber at the chosen altitude, a fingertip that turns
// blue with cyanosis, and bars for O₂ along the chain.
export function AltitudeHypoxiaGraphic({ state, baseline, values }: GraphicProps<AltitudeState>) {
  const colors = useTheme();
  const base = 130;
  const peak = 24;
  const climberY = base - ((base - peak) * state.altitude) / 8000;
  const climberX = 40 + ((150 - 40) * state.altitude) / 8000;
  const problem = Math.round(values.problem ?? 0);

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`${Math.round(state.altitude)} m. Arterial PO₂ ${Math.round(state.pao2)} mmHg, saturation ${Math.round(state.readouts.sat)}%. Cyanosis ${state.cyanosis ? 'present' : 'absent'}. ${HYPOXIA_TYPES[state.type]} hypoxia.`}>
        <Path d={`M20 ${base} L150 ${peak} L270 ${base} Z`} fill={colors.surfaceMuted} stroke={colors.borderStrong} />
        <Path d={`M128 52 L150 ${peak} L170 50 L158 46 L150 54 L140 46 Z`} fill={colors.surface} />
        <Circle cx={climberX} cy={climberY - 6} r={7} fill={colors.primary} stroke={colors.surface} strokeWidth={2} />
        <Caption x={climberX + 12} y={climberY - 2} text={`${Math.round(state.altitude)} m`} tone="primary" size={11} />

        {/* fingertip colour: pink, blue (cyanosis) or cherry red (CO) */}
        <Rect x={300} y={40} width={60} height={70} rx={28} fill={state.cyanosis ? colors.info : colors.error} opacity={state.cyanosis ? 0.6 : problem === 2 ? 0.75 : 0.28} stroke={colors.borderStrong} />
        <Caption x={330} y={128} anchor="middle" text={state.cyanosis ? 'Cyanosis' : problem === 2 ? 'Cherry red' : 'No cyanosis'} tone={state.cyanosis ? 'error' : 'secondary'} size={11} />
        <Caption x={330} y={30} anchor="middle" text="Fingertip" tone="tertiary" size={10} />

        <Bars
          x={16}
          y={150}
          width={W - 16}
          labelWidth={120}
          rows={[
            { label: 'Arterial PO₂', value: state.pao2, baseline: baseline.pao2, max: 150, color: colors.primary, text: `${Math.round(state.pao2)} mmHg` },
            { label: 'Saturation', value: state.readouts.sat, baseline: baseline.readouts.sat, max: 100, color: colors.primary, text: `${Math.round(state.readouts.sat)}%` },
            { label: 'O₂ delivered', value: state.readouts.delivery, baseline: baseline.readouts.delivery, max: 120, color: colors.success, text: `${Math.round(state.readouts.delivery)}%` },
            { label: 'O₂ used by cells', value: state.readouts.used, baseline: baseline.readouts.used, max: 120, color: colors.accent, text: `${Math.round(state.readouts.used)}%` },
            { label: 'Reduced Hb', value: state.reduced, baseline: baseline.reduced, max: 12, color: colors.info, text: `${state.reduced.toFixed(1)} g/dl` },
          ]}
        />
        <Caption x={16} y={H - 8} text={`${PROBLEMS[problem]} · cyanosis at about 5 g/dl reduced Hb`} tone="tertiary" size={11} />
      </Canvas>
      <Legend
        items={[
          { label: 'Now', color: colors.primary },
          { label: 'Before (dashed mark)', color: colors.text, dashed: true },
        ]}
      />
    </View>
  );
}

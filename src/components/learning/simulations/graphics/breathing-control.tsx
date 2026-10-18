import { View } from 'react-native';
import { Circle, Line, Rect } from 'react-native-svg';

import { type ControlState } from '@/data/simulations/breathing-control';
import { useTheme } from '@/hooks/use-theme';

import { Bars, Caption } from './kit';
import { Canvas, Legend, type GraphicProps } from './shared';

const W = 400;
const H = 300;

// The two sets of chemoreceptors feeding the medullary centre, with the
// resulting ventilation.
export function BreathingControlGraphic({ state, baseline, values }: GraphicProps<ControlState>) {
  const colors = useTheme();
  const thick = (drive: number) => 1.5 + Math.min(8, drive * 3);

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`Ventilation ${state.ventilation.toFixed(1)} L/min. Central drive ${Math.round(state.central * 100)}%, peripheral ${Math.round(state.peripheral * 100)}%.`}>
        {/* medulla */}
        <Rect x={150} y={20} width={100} height={52} rx={14} fill={state.narcosis ? colors.errorSubtle : colors.surfaceMuted} stroke={colors.borderStrong} />
        <Caption x={200} y={42} anchor="middle" text="Medulla" tone="primary" />
        <Caption x={200} y={60} anchor="middle" text={state.narcosis ? 'depressed' : 'respiratory centre'} tone={state.narcosis ? 'error' : 'tertiary'} size={10} />
        {/* central chemoreceptors */}
        <Circle cx={70} cy={46} r={18} fill={colors.primary} opacity={0.25} stroke={colors.primary} />
        <Caption x={70} y={84} anchor="middle" text="Central (CSF H⁺)" size={10} />
        <Line x1={88} y1={46} x2={150} y2={46} stroke={colors.primary} strokeWidth={thick(state.central)} strokeLinecap="round" />
        {/* peripheral chemoreceptors */}
        <Circle cx={330} cy={46} r={18} fill={colors.accent} opacity={0.3} stroke={colors.accent} />
        <Caption x={330} y={84} anchor="middle" text="Carotid, aortic (PO₂)" size={10} />
        <Line x1={312} y1={46} x2={250} y2={46} stroke={colors.accent} strokeWidth={thick(state.peripheral)} strokeLinecap="round" />
        {/* output */}
        <Line x1={200} y1={72} x2={200} y2={110} stroke={colors.success} strokeWidth={thick(state.ventilation / 6)} strokeLinecap="round" />
        <Caption x={200} y={128} anchor="middle" text={`Breathing ${state.ventilation.toFixed(1)} L/min`} tone="primary" />

        <Bars
          x={16}
          y={150}
          width={W - 16}
          labelWidth={120}
          rows={[
            { label: 'Ventilation', value: state.ventilation, baseline: baseline.ventilation, max: 60, color: colors.success, text: `${state.ventilation.toFixed(1)} L` },
            { label: 'Central drive', value: state.central * 100, baseline: baseline.central * 100, max: 600, color: colors.primary, text: `${Math.round(state.central * 100)}%` },
            { label: 'Peripheral drive', value: state.peripheral * 100, baseline: baseline.peripheral * 100, max: 600, color: colors.accent, text: `${Math.round(state.peripheral * 100)}%` },
            { label: 'O₂ carried', value: state.readouts.content, baseline: baseline.readouts.content, max: 110, color: colors.error, text: `${Math.round(state.readouts.content)}%` },
          ]}
        />
        <Caption x={16} y={H - 8} text={`PCO₂ ${Math.round(values.paco2 ?? 40)} · PO₂ ${Math.round(values.pao2 ?? 100)} mmHg`} tone="tertiary" size={11} />
      </Canvas>
      <Legend
        items={[
          { label: 'Central chemoreceptors', color: colors.primary },
          { label: 'Peripheral chemoreceptors', color: colors.accent },
          { label: 'Ventilation', color: colors.success },
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';
import { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { CYCLE_PHASES, phaseAt, type CycleState } from '@/data/simulations/cardiac-cycle';
import { useTheme } from '@/hooks/use-theme';

import { BeatBar, Canvas, Legend, linear, pathOf, StatusRow, type GraphicProps } from './shared';

const W = 400;
const H = 360;
const L = 46;
const R = 12;
const BAND = 26; // phase band at the top
const P_TOP = 44;
const P_BOTTOM = 190;
const V_TOP = 214;
const V_BOTTOM = 296;
const CONDUCTION_Y = 334;

const SHORT = ['Atrial', 'IVC', 'Ejection', 'IVR', 'Filling'];
const SHORT_NODE = ['SA node', 'Atria', 'AV node', 'His', 'Purkinje'];

export function CardiacCycleGraphic({ state, values, time, reduceMotion }: GraphicProps<CycleState>) {
  const colors = useTheme();
  const paused = values.paused === 1 || reduceMotion;
  const moment = paused ? state.moment : ((time % state.beat) + state.beat) % state.beat;
  const x = linear([0, state.beat], [L, W - R]);
  const yP = linear([0, 130], [P_BOTTOM, P_TOP]);
  const yV = linear([40, 140], [V_BOTTOM, V_TOP]);
  const phase = phaseAt(moment, state.bounds);
  const info = CYCLE_PHASES[phase];
  const series = (key: 'lv' | 'ao' | 'la') => pathOf(state.samples.map((s) => [s.t, s[key]] as [number, number]), x, yP);
  const volume = pathOf(state.samples.map((s) => [s.t, s.volume] as [number, number]), x, yV);
  const nodeX = (i: number) => L + 20 + i * ((W - R - L - 40) / 4);
  const active = (window: { start: number; end: number }) =>
    window.start <= window.end ? moment >= window.start && moment < window.end : moment >= window.start || moment < window.end;
  const nearest = state.samples.reduce((best, s) => (Math.abs(s.t - moment) < Math.abs(best.t - moment) ? s : best), state.samples[0]);

  return (
    <View style={{ gap: 10 }}>
      <Canvas width={W} height={H} label={`One heartbeat at ${Math.round(values.hr)} per minute. Now: ${info.name}.`}>
        {CYCLE_PHASES.map((p, i) => {
          const x0 = x(state.bounds[i]);
          const x1 = x(state.bounds[i + 1]);
          return (
            <G key={p.name}>
              <Rect x={x0} y={4} width={Math.max(0, x1 - x0)} height={BAND - 6} rx={4} fill={p.systole ? colors.primary : colors.primarySubtle} opacity={i === phase ? 1 : 0.55} />
              {x1 - x0 > 30 ? (
                <SvgText x={(x0 + x1) / 2} y={20} fontSize={11} fontWeight="800" fill={p.systole ? colors.onPrimary : colors.primaryText} textAnchor="middle">
                  {SHORT[i]}
                </SvgText>
              ) : null}
            </G>
          );
        })}
        {[0, 40, 80, 120].map((tick) => (
          <G key={tick}>
            <Line x1={L} x2={W - R} y1={yP(tick)} y2={yP(tick)} stroke={colors.border} strokeWidth={1} />
            <SvgText x={L - 6} y={yP(tick) + 4} fontSize={11} fontWeight="700" fill={colors.textTertiary} textAnchor="end">
              {String(tick)}
            </SvgText>
          </G>
        ))}
        <SvgText x={L} y={P_TOP - 6} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          Pressure (mmHg)
        </SvgText>
        <Path d={series('ao')} stroke={colors.textSecondary} strokeWidth={2} fill="none" strokeDasharray="6 3" />
        <Path d={series('la')} stroke={colors.accentText} strokeWidth={2} fill="none" />
        <Path d={series('lv')} stroke={colors.primary} strokeWidth={3} fill="none" />
        {[50, 100].map((tick) => (
          <G key={`v${tick}`}>
            <Line x1={L} x2={W - R} y1={yV(tick)} y2={yV(tick)} stroke={colors.border} strokeWidth={1} />
            <SvgText x={L - 6} y={yV(tick) + 4} fontSize={11} fontWeight="700" fill={colors.textTertiary} textAnchor="end">
              {String(tick)}
            </SvgText>
          </G>
        ))}
        <SvgText x={L} y={V_TOP - 6} fontSize={12} fontWeight="800" fill={colors.textSecondary}>
          Ventricular volume (mL)
        </SvgText>
        <Path d={volume} stroke={colors.success} strokeWidth={3} fill="none" />
        <Line x1={x(moment)} x2={x(moment)} y1={4} y2={V_BOTTOM} stroke={colors.accent} strokeWidth={2.5} />
        <Circle cx={x(moment)} cy={yP(nearest.lv)} r={5} fill={colors.accent} stroke={colors.surface} strokeWidth={2} />
        <Circle cx={x(moment)} cy={yV(nearest.volume)} r={5} fill={colors.accent} stroke={colors.surface} strokeWidth={2} />
        <Line x1={nodeX(0)} x2={nodeX(4)} y1={CONDUCTION_Y - 6} y2={CONDUCTION_Y - 6} stroke={colors.border} strokeWidth={2} />
        {state.conduction.map((node, i) => {
          const on = active(node);
          return (
            <G key={node.name}>
              <Circle cx={nodeX(i)} cy={CONDUCTION_Y - 6} r={on ? 8 : 5} fill={on ? colors.accent : colors.surfaceMuted} stroke={on ? colors.accentText : colors.borderStrong} strokeWidth={1.5} />
              <SvgText x={nodeX(i)} y={CONDUCTION_Y + 18} fontSize={11} fontWeight="700" fill={on ? colors.text : colors.textTertiary} textAnchor="middle">
                {SHORT_NODE[i]}
              </SvgText>
            </G>
          );
        })}
      </Canvas>
      <Legend
        items={[
          { label: 'Left ventricle', color: colors.primary },
          { label: 'Aorta', color: colors.textSecondary, dashed: true },
          { label: 'Left atrium', color: colors.accentText },
          { label: 'Volume', color: colors.success },
        ]}
      />
      <StatusRow
        title={info.name}
        chips={[
          { label: `Mitral & tricuspid ${info.av ? 'open' : 'shut'}`, on: info.av },
          { label: `Aortic & pulmonary ${info.semilunar ? 'open' : 'shut'}`, on: info.semilunar },
        ]}
      />
      <BeatBar systole={state.systole} diastole={state.diastole} />
    </View>
  );
}

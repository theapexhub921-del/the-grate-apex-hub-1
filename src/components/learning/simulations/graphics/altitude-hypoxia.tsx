import { View } from 'react-native';

import { Anatomy as A } from '@/constants/theme';
import { HYPOXIA_TYPES, PROBLEMS, type AltitudeState } from '@/data/simulations/altitude-hypoxia';

import { mix, RedCell } from './anatomy/cells';
import { Organ3D } from '../organ-3d';
import { chestFrame, rounded } from '../organ-frames';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;

// The real chest breathing at altitude: the blood leaving the lungs (aorta, pulmonary veins,
// left heart) turns dusky as saturation falls, or cherry red with CO; below, the red cells
// themselves, coloured by their O₂.
export function AltitudeHypoxiaGraphic({ state, values, time, reduceMotion }: GraphicProps<AltitudeState>) {
  const problem = Math.round(values.problem ?? 0);
  const co = problem === 2 ? 0.4 : 0;
  const t = reduceMotion ? 0 : time;
  const cells = problem === 1 ? 3 : 6;

  // blood leaving the lungs: bright red when saturated, dusky purple when not (cyanosis)
  const blood = mix(A.bloodDeoxy, A.bloodOxy, Math.max(0, Math.min(1, (state.sat - 0.5) / 0.47)));
  const frame = chestFrame({
    inflate: rounded(0.1 + (reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * t) / 3)) / 2) * Math.min(1.2, 0.5 * (40 / Math.max(15, state.readouts.paco2))), 0.02),
    extra: { color: { bloodRed: problem === 2 ? '#e8505b' : blood, rightLung: state.cyanosis ? '#b48a9e' : '#c9878e', leftLung: state.cyanosis ? '#b48a9e' : '#c9878e' } },
  });

  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="chest" frame={frame} label={`${Math.round(state.altitude)} m: arterial PO₂ ${Math.round(state.pao2)} mmHg, saturation ${Math.round(state.readouts.sat)}%. ${HYPOXIA_TYPES[state.type]} hypoxia.${state.cyanosis ? ' Cyanosis.' : ''}`} />
      <Canvas width={W} height={110} label={`Red cells in arterial blood, ${Math.round(state.readouts.sat)}% saturated.`}>
        {Array.from({ length: cells }, (_, k) => {
          const x = 30 + ((k * 64 + t * 22) % 340);
          return <RedCell key={k} x={x} y={44 + (k % 2) * 10} r={16} sat={state.sat} co={co} tilt={k * 0.8 + t * 0.3} />;
        })}
        <Tag x={200} y={94} text={`${Math.round(state.altitude)} m · arterial blood ${Math.round(state.readouts.sat)}% saturated${problem ? ' · ' + PROBLEMS[problem] : ''}`} size={10} />
        <Tag x={200} y={12} text={state.cyanosis ? 'Cyanosis: blue lips and fingertips' : problem === 2 ? 'Cherry-red skin (CO)' : problem === 1 ? 'Pale, no cyanosis' : 'Pink skin'} size={10} tone={state.cyanosis || problem === 2 ? 'error' : 'primary'} />
      </Canvas>
    </View>
  );
}

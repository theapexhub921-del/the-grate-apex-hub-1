import { View } from 'react-native';
import { Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { HYPOXIA_TYPES, PROBLEMS, type AltitudeState } from '@/data/simulations/altitude-hypoxia';

import { mix, RedCell } from './anatomy/cells';
import { useSvgIds } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 320;

// The mountain with the climber at the chosen altitude, a fingertip whose
// colour shows cyanosis (blue), CO (cherry red) or normal pink, and the
// red cells in the blood.
export function AltitudeHypoxiaGraphic({ state, values, time, reduceMotion }: GraphicProps<AltitudeState>) {
  const id = useSvgIds('alt');
  const problem = Math.round(values.problem ?? 0);
  const base = 200;
  const peak = 26;
  const frac = state.altitude / 8000;
  const climberY = base - (base - peak) * frac;
  const climberX = 30 + (150 - 30) * frac;
  const co = problem === 2 ? 0.4 : 0;
  const skin = state.cyanosis ? mix(A.skin, A.vein, Math.min(0.75, 0.35 + (state.reduced - 5) * 0.08)) : problem === 2 ? mix(A.skin, '#E8505B', 0.45) : problem === 1 ? mix(A.skin, '#F3E3D6', 0.5) : mix(A.skin, '#E89A90', 0.35);
  const t = reduceMotion ? 0 : time;
  const cells = problem === 1 ? 3 : 6;

  return (
    <View>
      <Canvas width={W} height={H} label={`${Math.round(state.altitude)} m. Arterial PO₂ ${Math.round(state.pao2)} mmHg, saturation ${Math.round(state.readouts.sat)}%. Cyanosis ${state.cyanosis ? 'present' : 'absent'}. ${HYPOXIA_TYPES[state.type]} hypoxia.`}>
        <Defs>
          <LinearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7FB2DE" />
            <Stop offset="1" stopColor="#DCEBF6" />
          </LinearGradient>
          <LinearGradient id={id('rock')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8C8F9C" />
            <Stop offset="1" stopColor="#4F5363" />
          </LinearGradient>
          <LinearGradient id={id('nail')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.7} />
            <Stop offset="1" stopColor={skin} />
          </LinearGradient>
        </Defs>
        {/* mountain scene */}
        <Rect x={10} y={10} width={240} height={200} rx={12} fill={`url(#${id('sky')})`} />
        <Path d={`M10 ${base + 10} L60 120 L96 150 L150 ${peak} L198 110 L250 70 L250 ${base + 10} Z`} fill={`url(#${id('rock')})`} />
        <Path d={`M128 70 L150 ${peak} L172 66 L162 62 L152 74 L142 62 Z`} fill="#FFFFFF" />
        <Path d="M232 84 L250 70 L250 96 L242 90 Z" fill="#FFFFFF" opacity={0.9} />
        <Path d={`M10 ${base + 10} L10 ${base - 14} C60 ${base - 30} 120 ${base - 10} 250 ${base - 24} L250 ${base + 10} Z`} fill="#6E8F5E" opacity={0.85} />
        {/* climber */}
        <G transform={`translate(${climberX} ${climberY - 18})`}>
          <Ellipse cx={0} cy={0} rx={4} ry={4.4} fill={A.skin} stroke={A.outline} strokeWidth={0.8} />
          <Path d="M-4 5 L4 5 L5 16 L-5 16 Z" fill="#D9534F" stroke={A.outline} strokeWidth={0.8} />
          <Path d="M-3 16 L-5 26 M3 16 L5 26 M4 7 L11 14" stroke={A.outline} strokeWidth={2} strokeLinecap="round" />
          <Path d="M11 4 L11 26" stroke="#5A4632" strokeWidth={1.4} />
        </G>
        <Tag x={climberX + 18} y={climberY - 30} text={`${Math.round(state.altitude)} m`} anchor="start" size={10} />
        {/* fingertip */}
        <Path d="M296 210 L296 90 C296 52 362 52 362 90 L362 210 Z" fill={skin} stroke={A.skinShade} strokeWidth={1.6} />
        <Path d="M306 104 C306 74 352 74 352 104 L352 140 C340 146 318 146 306 140 Z" fill={`url(#${id('nail')})`} stroke={A.skinShade} strokeWidth={1.2} />
        <Path d="M300 176 C318 182 340 182 358 176 M300 192 C318 198 340 198 358 192" stroke={A.skinShade} strokeWidth={1} fill="none" opacity={0.7} />
        <Tag x={329} y={226} text={state.cyanosis ? 'Cyanosis' : problem === 2 ? 'Cherry red' : problem === 1 ? 'Pale, no cyanosis' : 'Pink'} tone={state.cyanosis || problem === 2 ? 'error' : 'primary'} size={10} />
        {/* red cells in the arterial blood */}
        {Array.from({ length: cells }, (_, k) => {
          const x = 40 + ((k * 60 + t * 22) % 340);
          return <RedCell key={k} x={x} y={276 + (k % 2) * 8} r={15} sat={state.sat} co={co} tilt={k * 0.8 + t * 0.3} />;
        })}
        <Tag x={200} y={308} text={`Arterial blood · ${Math.round(state.readouts.sat)}% saturated${problem ? ' · ' + PROBLEMS[problem] : ''}`} size={10} />
      </Canvas>
    </View>
  );
}

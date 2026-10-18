import { View } from 'react-native';
import { G, Path } from 'react-native-svg';

import { Anatomy as A } from '@/constants/theme';
import { AIRWAYS, type MechanicsState } from '@/data/simulations/breathing-mechanics';

import { BronchioleSection, Diaphragm, Heart, Lungs, RIGHT_LUNG, Ribs, Torso } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const W = 400;
const H = 300;
const BREATH = 4; // seconds per breath (15 a minute)

// The chest: ribs, diaphragm and lungs that breathe with the chosen effort.
// A pneumothorax lets air into the right pleural space and the lung
// collapses; narrowed bronchioles are shown magnified.
export function BreathingMechanicsGraphic({ state, time, reduceMotion }: GraphicProps<MechanicsState>) {
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time) / BREATH)) / 2;
  const depth = Math.min(1.2, state.tidal / 900);
  const inflate = 0.1 + phase * depth;
  const open = Math.min(1, 1 / Math.sqrt(state.resistance));

  return (
    <View>
      <Canvas width={W} height={H} label={`Chest: ${state.pneumothorax ? 'right lung collapsed by air in the pleural space' : 'both lungs expanded'}; airways ${AIRWAYS[state.airway].toLowerCase()}; ${Math.round(state.tidal)} ml per breath.`}>
        <G transform="translate(20 22) scale(1.1)">
          <Torso />
          <Ribs lift={phase * Math.min(1, state.effort / 150)} />
          <Diaphragm inflate={inflate} />
          <Heart />
          {state.pneumothorax ? (
            <G transform="translate(104 120) scale(1.02 1.0) translate(-104 -120)">
              <Path d={RIGHT_LUNG} fill={A.air} stroke={A.airDeep} strokeWidth={1.4} strokeDasharray="4 3" />
            </G>
          ) : null}
          <Lungs inflate={inflate} airway={open} collapse={{ right: state.pneumothorax ? 1 : 0 }} />
          <Ribs front lift={phase * Math.min(1, state.effort / 150)} />
        </G>
        {state.pneumothorax ? <Tag x={82} y={86} text="Air in pleural space" tone="error" /> : null}
        <BronchioleSection cx={350} cy={86} r={36} open={open} />
        <Tag x={350} y={140} text="Bronchiole" />
        <Tag x={350} y={158} text={AIRWAYS[state.airway]} tone={state.airway === 1 ? 'error' : state.airway === 2 ? 'success' : 'primary'} size={10} />
        <Tag x={160} y={288} text="Diaphragm" size={10} />
      </Canvas>
    </View>
  );
}

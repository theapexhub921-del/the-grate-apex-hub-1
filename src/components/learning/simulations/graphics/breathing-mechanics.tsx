import { View } from 'react-native';

import { AIRWAYS, type MechanicsState } from '@/data/simulations/breathing-mechanics';

import { Organ3D } from '../organ-3d';
import { chestFrame, rounded } from '../organ-frames';
import { BronchioleSection } from './anatomy/lungs';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

const BREATH = 4; // seconds per breath (15 a minute)

// The real chest breathing with the chosen effort: the lungs swell and the diaphragm flattens.
// A pneumothorax lets air into the right pleural space and that lung collapses. Narrowed or
// widened bronchioles are shown magnified beside it.
export function BreathingMechanicsGraphic({ state, time, reduceMotion }: GraphicProps<MechanicsState>) {
  const phase = reduceMotion ? 1 : (1 - Math.cos((2 * Math.PI * time) / BREATH)) / 2;
  const depth = Math.min(1.2, state.tidal / 900);
  const inflate = rounded(0.1 + phase * depth, 0.02);
  const open = Math.min(1, 1 / Math.sqrt(state.resistance));
  const frame = chestFrame({
    inflate,
    collapseRight: state.pneumothorax ? 1 : 0,
    extra: {
      opacity: { pleura: state.pneumothorax ? 0.2 : 0.05 },
      color: { pleura: state.pneumothorax ? '#9cc7e2' : '#cfe3ef' },
      glow: { airways: state.airway === 1 ? 0.6 : 0 },
      glowColor: { airways: '#ff7a4a' },
    },
  });

  return (
    <View style={{ gap: 10 }}>
      <Organ3D
        scene="chest"
        frame={frame}
        label={`The chest breathing: ${state.pneumothorax ? 'the right lung has collapsed with air in the pleural space' : 'both lungs expanding'}; airways ${AIRWAYS[state.airway].toLowerCase()}; ${Math.round(state.tidal)} ml per breath.`}
      />
      <Canvas width={400} height={110} label={`A bronchiole, magnified: ${AIRWAYS[state.airway].toLowerCase()}.`}>
        <BronchioleSection cx={60} cy={55} r={42} open={open} />
        <Tag x={120} y={40} anchor="start" text="A bronchiole, magnified" />
        <Tag x={120} y={66} anchor="start" text={AIRWAYS[state.airway]} tone={state.airway === 1 ? 'error' : state.airway === 2 ? 'success' : 'primary'} size={10} />
        {state.pneumothorax ? <Tag x={120} y={92} anchor="start" text="Air in the right pleural space: lung collapsed" tone="error" size={10} /> : null}
      </Canvas>
    </View>
  );
}

import { View } from 'react-native';

import { Anatomy as A } from '@/constants/theme';
import { SUBSTANCES, type ClearanceState } from '@/data/simulations/renal-clearance';

import { Organ3D } from '../organ-3d';
import { rounded } from '../organ-frames';
import { mix } from './anatomy/cells';
import { Tag } from './kit';
import { Canvas, type GraphicProps } from './shared';

// The real kidneys with the substance shown in green: the renal arteries carry it in at the
// plasma concentration, the renal veins carry out what was not cleared, and the urine in the
// ureters and bladder shows how much was excreted.
export function RenalClearanceGraphic({ state }: GraphicProps<ClearanceState>) {
  const p = Math.min(1, state.plasma / 2);
  const inArtery = 0.25 + 0.5 * p;
  const inVein = inArtery * (1 - state.extraction);
  const urineK = Math.min(1, state.urineConc / 400);
  const tint = (base: string, k: number) => mix(base, A.tracer, Math.round(Math.min(0.85, k) * 20) / 20);
  const frame = {
    color: { arteries: tint('#b01e24', inArtery * 0.5), veins: tint('#2f3f8f', inVein * 0.6), pelvis: tint('#e3cfae', 0.15 + 0.7 * urineK), bladder: tint('#d99a8a', 0.1 + 0.6 * urineK) },
    glow: { kidneys: rounded(0.2 * state.extraction, 0.05) },
  };
  const cleared = Math.round(state.extraction * 100);
  return (
    <View style={{ gap: 10 }}>
      <Organ3D scene="urinary" frame={frame} label={`${SUBSTANCES[state.substance]}: clearance ${Math.round(state.clearance)} ml/min; about ${cleared}% removed from the plasma passing through the kidneys.`} />
      <Canvas width={400} height={44} label={`${SUBSTANCES[state.substance]} in the renal artery, renal vein and urine.`}>
        <Tag x={66} y={22} text={`${SUBSTANCES[state.substance]} · P ${state.plasma.toFixed(1)} mg/ml`} size={10} />
        <Tag x={200} y={22} text={`Renal vein: ${cleared}% cleared`} size={10} tone={cleared > 50 ? 'success' : 'primary'} />
        <Tag x={334} y={22} text={`Urine: ${state.readouts.excretion.toFixed(0)} mg/min`} size={10} />
      </Canvas>
    </View>
  );
}

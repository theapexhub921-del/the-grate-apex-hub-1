// A small closed-loop circulation shared by the baroreflex (Lesson 6) and
// shock (Lesson 7) simulations.
//
//   BP (mean) = cardiac output × total peripheral resistance   (Regulation slide 4)
//   cardiac output = heart rate × stroke volume                 (The Heart slide 41)
//
// The baroreceptor reflex (Regulation slides 23–28) answers a fall in
// pressure with more sympathetic and less vagal discharge: faster heart,
// stronger beat, vasoconstriction; and the reverse for a rise. Here that
// is one "sympathetic drive" number, solved until pressure and drive agree.
import { clamp } from '@/data/simulations/types';

export const REST_HR = 70;
export const REST_CO = 5.5; // L/min
export const REST_MAP = 93; // mmHg (≈ 120/80)
export const REST_SV = (REST_CO / REST_HR) * 1000; // mL
export const REST_TPR = REST_MAP / REST_CO; // mmHg per L/min

export type CirculationInput = {
  volume: number; // change in blood volume as a fraction (−0.2 = lost 20%)
  preload?: number; // other changes in filling (pooling, obstruction), multiplier
  contractility?: number; // multiplier
  tone?: number; // intrinsic arteriolar tone (drugs, vasodilatation), multiplier
  reflex: number; // 1 = intact, 0 = cut or failed
};

export type Circulation = {
  map: number;
  hr: number;
  sv: number;
  co: number;
  tpr: number;
  drive: number; // −0.6 … 1.2: sympathetic drive above (+) or below (−) rest
  openLoopMap: number; // BP if there were no reflex
  baroFiring: number; // % of resting discharge
  sympathetic: number; // % of resting discharge
  vagal: number; // % of resting discharge
};

function pressures(input: CirculationInput, drive: number) {
  const filling = Math.max(0.05, (1 + 1.5 * input.volume) * (input.preload ?? 1));
  const sv = Math.max(5, REST_SV * filling * Math.pow(input.contractility ?? 1, 0.6) * (1 + 0.25 * drive));
  const hr = clamp(REST_HR * (1 + 1.6 * drive), 35, 180);
  const tpr = REST_TPR * (input.tone ?? 1) * (1 + 0.6 * drive);
  const co = (hr * sv) / 1000;
  return { sv, hr, tpr, co, map: co * tpr };
}

export function solveCirculation(input: CirculationInput): Circulation {
  let drive = 0;
  for (let i = 0; i < 400; i++) {
    const { map } = pressures(input, drive);
    const wanted = clamp(-0.9 * ((map - REST_MAP) / REST_MAP) * input.reflex, -0.6, 1.2);
    drive = drive + 0.3 * (wanted - drive);
  }
  const result = pressures(input, drive);
  const openLoopMap = pressures(input, 0).map;
  return {
    ...result,
    drive,
    openLoopMap,
    baroFiring: 100 * clamp(1 + 2.2 * ((result.map - REST_MAP) / REST_MAP), 0.05, 3),
    sympathetic: 100 * (1 + drive),
    vagal: 100 * clamp(1 - drive, 0.2, 1.8),
  };
}

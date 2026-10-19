// A hypothalamus → anterior pituitary → gland axis with negative feedback, shared by the
// endocrinology simulations (feedback-axis, thyroid-axis, adrenal-axis). Not a simulation itself.
//
// Every level is a fraction of its normal output (1 = normal):
//   releasing hormone   R = hyp · H^−b          (the hypothalamus is held back by the hormone)
//   trophic hormone     T = pit · R · H^−a      (so is the pituitary: two feedback loops)
//   gland's own output  E = gland · T
//   hormone in blood    H = E + given           (given = hormone taken as a drug)
// A tumour secretes regardless of its controller: an autonomous gland fixes E, an autonomous
// pituitary fixes T. a = b = 1 when feedback works and 0 when it is cut. Teaching model only:
// it shows which way each level moves (Introduction, pp. 23–26).

export type AxisInput = {
  hyp?: number;
  pit?: number;
  gland?: number;
  autonomousGland?: number | null; // E fixed (gland tumour)
  autonomousPit?: number | null; // T fixed (pituitary tumour)
  given?: number;
  feedback?: number; // 0–1
};

export type AxisLevels = { releasing: number; trophic: number; own: number; hormone: number };

export function solveAxis({ hyp = 1, pit = 1, gland = 1, autonomousGland = null, autonomousPit = null, given = 0, feedback = 1 }: AxisInput): AxisLevels {
  const a = feedback;
  const b = feedback;
  if (autonomousGland !== null) {
    const hormone = autonomousGland + given;
    const releasing = hyp * hormone ** -b;
    const trophic = autonomousPit ?? pit * releasing * hormone ** -a;
    return { releasing, trophic, own: autonomousGland, hormone };
  }
  if (autonomousPit !== null) {
    const own = gland * autonomousPit;
    const hormone = own + given;
    return { releasing: hyp * hormone ** -b, trophic: autonomousPit, own, hormone };
  }
  // H = gland·pit·hyp·H^−(a+b) + given: the left side minus H falls as H rises, so bisect.
  const k = gland * pit * hyp;
  const f = (h: number) => k * h ** -(a + b) + given - h;
  let lo = 1e-4;
  let hi = 1e3;
  for (let i = 0; i < 80; i += 1) {
    const mid = Math.sqrt(lo * hi);
    if (f(mid) > 0) lo = mid;
    else hi = mid;
  }
  const hormone = Math.sqrt(lo * hi);
  const releasing = hyp * hormone ** -b;
  const trophic = pit * releasing * hormone ** -a;
  return { releasing, trophic, own: gland * trophic, hormone };
}

// The lecture's classification (Introduction, p. 26), read from the levels as a doctor would:
// 0 normal, 1 primary hyposecretion, 2 secondary hyposecretion, 3 primary hypersecretion
// (or hormone taken as a drug), 4 secondary hypersecretion.
export const PATTERNS = ['Normal', 'Primary hyposecretion', 'Secondary hyposecretion', 'Primary hypersecretion', 'Secondary hypersecretion'];

export function axisPattern({ trophic, hormone }: AxisLevels): number {
  if (hormone < 0.8) return trophic > 1.2 ? 1 : 2;
  if (hormone > 1.25) return trophic > 1.2 ? 4 : 3;
  return 0;
}

export const pct = (v: number) => Math.round(Math.min(999, v * 100));

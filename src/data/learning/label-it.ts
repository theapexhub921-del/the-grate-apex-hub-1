// "Label it" (2026-10-28): drag-free labelling of a lecture diagram. The
// learner picks a name, then taps the pin it belongs to. Pure, so
// tests/learning-boosts.test.mjs can check it.
import type { FigureSpot } from '@/data/lesson-types';

const norm = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');

/** The names to place, one chip per distinct label, in a fixed shuffled order. */
export function labelChips(spots: readonly FigureSpot[], seed: string): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const spot of spots) {
    const key = norm(spot.label);
    if (seen.has(key)) continue;
    seen.add(key);
    labels.push(spot.label);
  }
  // Small deterministic shuffle (the pins are numbered in slide order, so the
  // names must not be).
  let state = 0;
  for (const char of seed) state = (state * 31 + char.charCodeAt(0)) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  for (let i = labels.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }
  return labels;
}

/** Whether a name belongs on a pin (parts labelled the same on the slide are interchangeable). */
export const labelFits = (spot: FigureSpot, label: string) => norm(spot.label) === norm(label);

/** A name is used up once every pin with that name has been placed. */
export function chipDone(spots: readonly FigureSpot[], placed: ReadonlySet<string>, label: string): boolean {
  return spots.filter((spot) => labelFits(spot, label)).every((spot) => placed.has(spot.id));
}

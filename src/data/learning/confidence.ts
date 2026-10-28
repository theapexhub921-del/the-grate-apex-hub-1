// "Sure / Guessing" (2026-10-28): what a quiz's answers say once the learner's
// confidence is known. Pure: checked by tests/learning-boosts.test.mjs.
import type { Confidence } from '@/data/learning/scheduler';

export type ConfidenceRow = { id: string; correct: boolean; confidence?: Confidence };

export type ConfidenceSummary = {
  /** How many answers had a confidence picked. */
  rated: number;
  /** Sure and right: known. */
  known: number;
  /** Guessing but right: not yet known, comes back sooner. */
  luckyGuesses: string[];
  /** Sure but wrong: a misconception, the most useful thing to fix. */
  confidentMistakes: string[];
  /** Guessing and wrong: an honest gap. */
  gaps: number;
};

export function confidenceSummary(rows: readonly ConfidenceRow[]): ConfidenceSummary {
  const summary: ConfidenceSummary = { rated: 0, known: 0, luckyGuesses: [], confidentMistakes: [], gaps: 0 };
  for (const row of rows) {
    if (!row.confidence) continue;
    summary.rated += 1;
    if (row.confidence === 'sure') {
      if (row.correct) summary.known += 1;
      else summary.confidentMistakes.push(row.id);
    } else if (row.correct) summary.luckyGuesses.push(row.id);
    else summary.gaps += 1;
  }
  return summary;
}

/** How well the learner's confidence matched their results (0–100), or null with too few rated answers. */
export function calibration(summary: ConfidenceSummary): number | null {
  if (summary.rated < 3) return null;
  const matched = summary.known + summary.gaps;
  return Math.round((matched / summary.rated) * 100);
}

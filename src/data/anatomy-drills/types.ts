// Anatomy drills (owner, 2026-10-28): ways to learn where things are without
// reading lists. Every item is written from its lesson's own lecture text
// (tests/anatomy-drills.test.mjs checks the key words appear in that lesson).
//
// - Stack the layers: put structures in order (front to back, outside in,
//   top to bottom, or along a route), as the lecture lists them.
// - What gets hit?: a short case — an injury, a needle, a blockage — and
//   which structure it reaches or what follows, from the lecture's facts.
// - Why is it there?: the reason behind a position or arrangement, as the
//   lecture gives it.

export type LayerDrill = {
  id: string;
  lessonId: string;
  /** What to order, and in which direction ("From front to back: …"). */
  prompt: string;
  /** In the CORRECT order (shown shuffled). */
  items: string[];
  /** Shown after answering. */
  explanation: string;
  /** The lesson concept it tests, when the automatic match picks the wrong one. */
  conceptId?: string;
};

export type HitCase = {
  id: string;
  lessonId: string;
  /** The situation and the question. */
  scenario: string;
  answer: string;
  wrong: [string, string, string];
  explanation: string;
  /** The lesson concept it tests, when the automatic match picks the wrong one. */
  conceptId?: string;
};

export type WhyCard = {
  id: string;
  lessonId: string;
  question: string;
  answer: string;
};

export type TopicDrills = {
  topicId: string;
  layers: LayerDrill[];
  cases: HitCase[];
  why: WhyCard[];
};

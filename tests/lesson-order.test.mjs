// Lessons follow the order of the lecture slides (owner, 2026-10-24). Where a
// topic's decks are numbered (aa-1 … aa-4, imm-01 … imm-07, na-1 …), a lesson
// taught mostly from a later deck never comes before one from an earlier deck.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { builtTopics } from '../src/data/topics/index.ts';

// Deliberate exceptions, each with its reason.
const EXCEPTIONS = new Set([
  // "Nucleotides: building blocks" (bases, nucleosides, nucleotides) is the shared
  // foundation of both nucleic acid decks, so it opens the topic.
  'nucleic-acids-1',
]);

const deckNumber = (sourceId) => {
  const match = /^[a-z]+-(\d+)-/.exec(sourceId);
  return match ? Number(match[1]) : null;
};

test('lessons from numbered lecture decks follow the deck order', () => {
  for (const { topic } of builtTopics) {
    let highest = 0;
    let highestLesson = '';
    for (const lesson of topic.lessons) {
      const counts = {};
      for (const ref of lesson.sourceRefs ?? []) if (ref.slide || ref.page) counts[ref.sourceId] = (counts[ref.sourceId] ?? 0) + 1;
      const main = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const number = main ? deckNumber(main) : null;
      if (number === null || EXCEPTIONS.has(lesson.id)) continue;
      assert.ok(number >= highest, `${lesson.id} (deck ${number}) comes after ${highestLesson} (deck ${highest}) in ${topic.id}`);
      highest = number;
      highestLesson = lesson.id;
    }
  }
});

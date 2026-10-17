// HB2 past questions sorted by topic (scripts/sort-past-questions-by-topic.mjs):
// every question has a known topic, and the topic exam mode is wired.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { PAST_TOPICS } from '../src/data/past-question-topics.ts';
import { modeSettings, modeTitle, parsePracticeMode } from '../src/data/practice-modes.ts';

for (const courseId of Object.keys(PAST_TOPICS)) {
  test(`${courseId}: every past question has a listed topic`, () => {
    const bank = JSON.parse(readFileSync(`public/curriculum/${courseId}.json`, 'utf8'));
    const known = new Set(PAST_TOPICS[courseId].map((topic) => topic.id));
    const questions = bank.sets.flatMap((set) => set.questions);
    const missing = questions.filter((q) => !known.has(q.tp));
    assert.equal(missing.length, 0, `run node scripts/sort-past-questions-by-topic.mjs (e.g. ${missing[0]?.id} has topic ${missing[0]?.tp})`);
    // Most questions are sorted into a real topic, not "other".
    assert.ok(questions.filter((q) => q.tp === 'other').length < questions.length * 0.05);
  });
}

test('past questions on a topic are sat as an exam', () => {
  const mode = parsePracticeMode((key) => ({ ptopic: 'immunology' })[key]);
  assert.deepEqual(mode, { kind: 'pastTopic', topicId: 'immunology' });
  const settings = modeSettings(mode);
  assert.equal(settings.count, Infinity);
  assert.equal(settings.feedback, 'submit');
  assert.equal(settings.variants, false);
  assert.equal(settings.key, 'topic-immunology');
  assert.equal(modeTitle(mode, 'Biochemistry', { topic: 'Immunology' }), 'Biochemistry · Past questions: Immunology');
});

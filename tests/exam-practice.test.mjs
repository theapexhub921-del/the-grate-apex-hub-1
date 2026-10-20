import assert from 'node:assert/strict';
import { test } from 'node:test';

import { defaultMockMinutes, examQuery, examTitle, parseExam, scoreByTopic } from '../src/data/exam-practice-rules.ts';
import { weakestQuestionIds } from '../src/data/learning/weakest.ts';

const fromQuery = (values) => parseExam((name) => (values[name] === undefined ? undefined : String(values[name])));

test('exam settings survive the quiz link both ways', () => {
  for (const exam of [
    { kind: 'mock', bank: 'hb2-anatomy', size: 60, minutes: 60 },
    { kind: 'spotter', subject: 'all', size: 20, seconds: 45 },
    { kind: 'weakest' },
  ]) {
    assert.deepEqual(fromQuery(examQuery(exam)), exam);
  }
});

test('odd values in a link fall back to safe ones', () => {
  assert.equal(fromQuery({ exam: 'mock', bank: '../secret' }), null);
  assert.equal(fromQuery({ exam: 'spotter', subject: 'chemistry' }), null);
  assert.equal(fromQuery({ exam: 'nothing' }), null);
  assert.deepEqual(fromQuery({ exam: 'mock', bank: 'hb2-physiology', size: 9999, minutes: 1 }), { kind: 'mock', bank: 'hb2-physiology', size: 40, minutes: 45 });
  assert.deepEqual(fromQuery({ exam: 'spotter', subject: 'anatomy', size: 3, seconds: 1 }), { kind: 'spotter', subject: 'anatomy', size: 20, seconds: 45 });
});

test('a mock exam defaults to about a minute a question', () => {
  assert.equal(defaultMockMinutes(20), 15);
  assert.equal(defaultMockMinutes(40), 45);
  assert.equal(defaultMockMinutes(60), 60);
  assert.equal(defaultMockMinutes(100), 90);
  assert.equal(examTitle({ kind: 'spotter', subject: 'anatomy', size: 10, seconds: 30 }), 'Spotter · Anatomy');
});

test('score by topic lists the weakest topic first', () => {
  const rows = [
    { topic: 'Heart', correct: true },
    { topic: 'Heart', correct: true },
    { topic: 'Kidney', correct: false },
    { topic: 'Kidney', correct: true },
    { topic: 'Lungs', correct: false },
  ];
  assert.deepEqual(
    scoreByTopic(rows).map((item) => [item.topic, item.right, item.total, item.percent]),
    [
      ['Lungs', 0, 1, 0],
      ['Kidney', 1, 2, 50],
      ['Heart', 2, 2, 100],
    ]
  );
});

const memory = (questionId, attempts, correct, lastCorrect, correctStreak, lastSeenAt = 0) => ({
  questionId,
  attempts,
  correct,
  lastSeenAt,
  lastCorrect,
  correctStreak,
  wrongCount: attempts - correct,
  seenIn: [],
  restUntil: 0,
});

test('the weakest questions: most and latest misses first; two right in a row leaves the list', () => {
  const list = [
    memory('never-wrong', 3, 3, true, 3),
    memory('missed-once-then-fixed', 3, 2, true, 2),
    memory('missed-once-right-since', 2, 1, true, 1),
    memory('missed-last-time', 2, 1, false, 0),
    memory('missed-often', 5, 1, false, 0),
    memory('removed', 4, 0, false, 0),
  ];
  const ids = weakestQuestionIds(list, (id) => id !== 'removed');
  assert.deepEqual(ids, ['missed-often', 'missed-last-time', 'missed-once-right-since']);
  assert.equal(weakestQuestionIds(list, () => true, 2).length, 2);
});

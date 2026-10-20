import assert from 'node:assert/strict';
import { test } from 'node:test';

import { gradeBlock, parseGrade } from '../api/_grade.mjs';

test('a typed answer is sent with the question and the model answer', () => {
  const block = gradeBlock({ prompt: 'Synthase vs synthetase?', model: ['Synthetase uses ATP'], answer: 'one needs ATP' });
  assert.match(block, /QUESTION/);
  assert.match(block, /- Synthetase uses ATP/);
  assert.match(block, /one needs ATP/);
  assert.equal(gradeBlock({ prompt: 'Q', model: ['a'], answer: '   ' }), null);
  assert.equal(gradeBlock({ prompt: 'Q', model: [], answer: 'x' }), null);
});

test('only a valid mark is accepted from the AI', () => {
  assert.deepEqual(parseGrade('```json\n{"verdict":"partial","feedback":"Good start.","missing":["ATP use"],"beyond":""}\n```'), {
    verdict: 'partial',
    feedback: 'Good start.',
    missing: ['ATP use'],
    beyond: '',
  });
  assert.equal(parseGrade('{"verdict":"maybe","feedback":"x"}'), null);
  assert.equal(parseGrade('{"verdict":"yes"}'), null);
  assert.equal(parseGrade('not json'), null);
});

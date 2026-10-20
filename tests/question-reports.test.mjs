import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { questionKey, questionUnderReview, REPORT_REASONS } from '../src/data/question-report-rules.ts';

test('question ids become safe database keys', () => {
  assert.equal(questionKey('legacy:hb2-anatomy:abc123'), 'legacy:hb2-anatomy:abc123');
  assert.equal(questionKey('a/b/c'), 'a|b|c');
  assert.equal(questionKey('..'), '_');
  assert.equal(questionKey('__x__'), 'q__x__');
  assert.ok(questionKey('x'.repeat(400)).length <= 300);
});

test('a question shows "being checked" after two wrong-answer reports since the last check', () => {
  assert.equal(questionUnderReview({ wrong: 1, cleared: 0 }), false);
  assert.equal(questionUnderReview({ wrong: 2, cleared: 0 }), true);
  assert.equal(questionUnderReview({ wrong: 2, cleared: 2 }), false);
  assert.equal(questionUnderReview({ wrong: 4, cleared: 2 }), true);
});

test('the database rules accept exactly the app’s report reasons', () => {
  const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  const block = rules.slice(rules.indexOf('match /questionReports/'), rules.indexOf('match /questionFlags/'));
  for (const reason of REPORT_REASONS) assert.ok(block.includes(`'${reason.id}'`), reason.id);
  assert.ok(rules.includes('match /questionFlags/{qkey}'));
});

// The battle banks in public/battle-bank/ must match the questions they are built from
// (the battle server marks answers from these files). After changing questions, run:
//   node --import ./tests/register.mjs scripts/build-battle-bank.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { buildBattleBanks, serialise } from '../scripts/build-battle-bank.mjs';

const read = (name) => readFileSync(new URL(`../public/battle-bank/${name}.json`, import.meta.url), 'utf8');

test('the battle banks are up to date (run scripts/build-battle-bank.mjs)', () => {
  const { index, files } = buildBattleBanks();
  assert.equal(read('index').replace(/\r\n/g, '\n'), serialise(index), 'index.json is out of date');
  for (const [id, file] of Object.entries(files)) {
    assert.equal(read(id).replace(/\r\n/g, '\n'), serialise(file), `${id}.json is out of date`);
  }
});

test('every battle question has a real answer and distinct options', () => {
  const { files } = buildBattleBanks();
  for (const file of Object.values(files)) {
    for (const question of file.questions) {
      assert.ok(question.prompt, `${file.id} ${question.id} has a prompt`);
      assert.ok(question.answer >= 0 && question.answer < question.options.length, `${file.id} ${question.id} answer`);
      assert.equal(new Set(question.options).size, question.options.length, `${file.id} ${question.id} options`);
    }
    assert.equal(new Set(file.questions.map((question) => question.id)).size, file.questions.length, `${file.id}: ids are unique`);
  }
});

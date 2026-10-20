// True/false questions are written as one plain statement (owner, 2026-10-20),
// never as "For “<question>”, the answer is “<option>”".
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const { trueFalseStatement } = await import('@/data/true-false');
const { buildPractice } = await import('@/data/legacy-questions');

describe('true/false statements', () => {
  it('turns a question and an option into one statement', () => {
    assert.equal(trueFalseStatement('Which enzyme type REMOVES water from its substrate?', 'Hydrolase (adds water)'), 'Hydrolase is the enzyme type that REMOVES water from its substrate.');
    assert.equal(trueFalseStatement('What is the rate-limiting enzyme of fatty acid synthesis?', 'Acetyl-CoA carboxylase'), 'The rate-limiting enzyme of fatty acid synthesis is Acetyl-CoA carboxylase.');
    assert.equal(trueFalseStatement('The enzyme ___ catalyses an anaplerotic reaction', 'PEP carboxylase'), 'The enzyme PEP carboxylase catalyses an anaplerotic reaction.');
    assert.equal(trueFalseStatement('Fatty acid synthesis takes place in the', 'Cytosol'), 'Fatty acid synthesis takes place in the cytosol.');
  });

  it('leaves out questions that do not read as a statement', () => {
    assert.equal(trueFalseStatement('Which enzyme does citrate activate?', 'ACC'), null);
    assert.equal(trueFalseStatement('Where does fatty acid synthesis occur?', 'Cytosol'), null);
    assert.equal(trueFalseStatement('Which of the following is true?', 'Both'), null);
    assert.equal(trueFalseStatement('Glucose is stored as:', 'All of the above'), null);
  });

  it('no practice true/false question says "the answer is"', () => {
    const all = readdirSync('public/curriculum').flatMap((file) => JSON.parse(readFileSync(`public/curriculum/${file}`, 'utf8')).sets.flatMap((set) => set.questions));
    for (const seed of ['a', 'b', 'c']) {
      for (const q of buildPractice(all, { course: 'mixed' }, 400, seed)) {
        if (q.id.endsWith(':tf')) assert.doesNotMatch(q.prompt, /the answer is|^True or false\?/i, q.prompt);
      }
    }
  });

  it('no question bank puts "— the answer is" inside a question', () => {
    for (const file of readdirSync('public/curriculum')) {
      for (const set of JSON.parse(readFileSync(`public/curriculum/${file}`, 'utf8')).sets) {
        for (const q of set.questions) assert.doesNotMatch(q.q, /the answer is|is the established answer/i, `${file} ${q.id}`);
      }
    }
  });
});

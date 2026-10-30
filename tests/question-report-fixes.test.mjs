// Fixes for learner question reports (2026-10-30). Each test pins one reported problem.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const { toQuestion } = await import('@/data/legacy-questions');
const { typedAnswerMatches, isAnswerCorrect } = await import('@/data/questions');

const find = (course, id) => {
  const bank = JSON.parse(readFileSync(`public/curriculum/${course}.json`, 'utf8'));
  return bank.sets.flatMap((set) => set.questions).find((q) => q.id === id);
};

describe('typed set answers (report: algebra ipb4yr, a correct answer in another order was marked wrong)', () => {
  const accept = ['{−3, −2, −1, 0}'];
  it('accepts the elements in any order, with any spacing or minus sign', () => {
    assert.equal(typedAnswerMatches('{-3,-2,-1,0}', accept), true);
    assert.equal(typedAnswerMatches('{0, -1, -2, -3}', accept), true);
    assert.equal(typedAnswerMatches('0, −1, −2, −3', accept), true);
  });
  it('still rejects a different set, including one that only differs by a sign', () => {
    assert.equal(typedAnswerMatches('{3, 2, 1, 0}', accept), false);
    assert.equal(typedAnswerMatches('{-3, -2, -1}', accept), false);
    assert.equal(typedAnswerMatches('{-3, -2, -1, 0, 1}', accept), false);
  });
  it('the reported question marks its own answer right', () => {
    const q = toQuestion(find('algebra', 'ipb4yr'), { course: 'algebra', concept: 'x' });
    assert.equal(isAnswerCorrect({ ...q, id: `${q.id}:type`, type: 'type', accept: ['{−3, −2, −1, 0}'] }, '{0,-3,-1,-2}'), true);
  });
  it('ordinary typed answers behave as before', () => {
    assert.equal(typedAnswerMatches('malonyl coa', ['Malonyl-CoA']), true);
    assert.equal(typedAnswerMatches('NADH', ['NADPH']), false);
  });
});

describe('options that point at other options by letter (report: medgen 56v4sb)', () => {
  it('keep their order, so "Both (a) and (b)" still points at the right options', () => {
    for (const id of ['56v4sb', 'knu1dc', '1ipcknd', 'cs25n6', '13dzqyq']) {
      const q = toQuestion(find('medgen', id), { course: 'medgen', concept: 'x' });
      assert.equal(q.fixedOrder, true, id);
    }
  });
  it('ordinary questions can still be shuffled', () => {
    const q = toQuestion({ id: 'z', q: 'Which is largest?', o: ['Aorta', 'Vein', 'Capillary', 'Venule'], a: 0, e: '', t: 't' }, { course: 'x', concept: 'x' });
    assert.equal(q.fixedOrder, false);
  });
});

describe('damaged duality questions (reports: algebra 1is6tdq, 1fd692, ppswc3, 18acuf3)', () => {
  const dual = {
    '1is6tdq': '(A ∪ B) ∩ D',
    '1fd692': 'A ∪ ((B′ ∪ A) ∩ B)′ = U',
    ppswc3: 'A ∩ (B ∪ A) = A',
    '18acuf3': '(A ∩ B′)′ ∪ B = A′ ∪ B',
  };
  for (const [id, correct] of Object.entries(dual)) {
    it(`${id} has four different, complete options and the right one is marked`, () => {
      const q = find('algebra', id);
      assert.equal(new Set(q.o).size, q.o.length);
      assert.equal(q.o[q.a], correct);
      assert.ok(q.o.every((option) => option.length >= 5), q.o.join(' | '));
      assert.ok(q.e.replace(/\s+/g, '').includes(correct.replace(/\s+/g, '')), 'the explanation states the same answer');
    });
  }
});

describe('Big Bang timeline question (report: biolchem m2rrr4)', () => {
  it('asks about the time its answer belongs to', () => {
    const q = find('biolchem', 'm2rrr4');
    assert.match(q.q, /300,000 years/);
    assert.doesNotMatch(q.q, /one second/i);
    assert.match(q.o[q.a], /atoms/i);
  });
});

describe('heart figure (report: cardiovascular-physiology fig-heart-mitral)', () => {
  // Read as text: the figure file imports the whole topic, which this test does not need.
  const source = readFileSync('src/data/figures/cardiovascular-physiology.ts', 'utf8');
  const heartBlock = source.slice(source.indexOf('export const heart'), source.indexOf('export const conduction'));
  const spot = (id) => {
    const match = new RegExp(`id: '${id}'[^\\n]*?x: ([0-9.]+), y: ([0-9.]+)`).exec(heartBlock);
    assert.ok(match, id);
    return { x: Number(match[1]), y: Number(match[2]) };
  };
  it('the mitral valve pin is on label 9 (under the left atrium) and the aortic valve pin on label 8', () => {
    // Label 9 sits to the right of label 8, with the left atrium (label 10) directly above it.
    assert.ok(spot('mitral').x > spot('aortic-valve').x);
    assert.ok(Math.abs(spot('mitral').x - spot('left-atrium').x) < 0.1);
    assert.ok(spot('mitral').y > spot('left-atrium').y);
  });
});

// correctAnswerOf (data/questions.ts): the correct answer of every checkpoint in
// every published topic is marked correct (it is shown when looking back in a lesson).
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { correctAnswerOf, isAnswerCorrect } = await import('@/data/questions');
const { builtTopics } = await import('@/data/topics');

describe('correctAnswerOf', () => {
  it('is correct for every question in every topic', () => {
    let checked = 0;
    for (const built of builtTopics) {
      for (const question of built.questions) {
        assert.equal(isAnswerCorrect(question, correctAnswerOf(question)), true, question.id);
        checked++;
      }
    }
    assert.ok(checked > 100, `only ${checked} checked`);
  });
});

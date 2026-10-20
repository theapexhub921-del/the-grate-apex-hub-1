// The correct option must not give itself away by being the longest (owner, 2026-10-20:
// "the most worded answers tend to be the correct answers… do not make the answers too
// predictable"). Wrong options are written as long and specific as the right one.
// Single-answer questions only; True/False and Assertion–Reason have fixed options, and
// diagram questions use the lecture diagram's own labels.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { builtTopics } = await import('@/data/topics');

function singleAnswerQuestions(built) {
  return built.questions.filter(
    (q) => q.type === 'choice' && !q.fixedOrder && !q.figure && Array.isArray(q.options) && q.options.length >= 3 && typeof q.answer === 'number',
  );
}

const lengths = (q) => {
  const right = String(q.options[q.answer]).length;
  const longestWrong = Math.max(...q.options.filter((_, i) => i !== q.answer).map((o) => String(o).length));
  return { right, longestWrong };
};

describe('answer option lengths', () => {
  it('no correct option is far longer than every wrong one', () => {
    const offenders = [];
    for (const built of builtTopics) {
      for (const q of singleAnswerQuestions(built)) {
        const { right, longestWrong } = lengths(q);
        // 1.5× and at least 10 characters longer than the longest wrong option.
        if (right >= longestWrong * 1.5 && right - longestWrong >= 10) offenders.push(`${built.topic.id} ${q.id}`);
      }
    }
    assert.deepEqual(offenders, [], 'Give these questions a wrong option as long and specific as the answer');
  });

  it('“pick the longest option” is not a winning strategy in any topic', () => {
    let all = 0;
    let longest = 0;
    for (const built of builtTopics) {
      const qs = singleAnswerQuestions(built);
      const n = qs.filter((q) => {
        const { right, longestWrong } = lengths(q);
        return right > longestWrong;
      }).length;
      all += qs.length;
      longest += n;
      if (qs.length >= 20) assert.ok(n / qs.length <= 0.5, `${built.topic.id}: the answer is the longest option in ${Math.round((100 * n) / qs.length)}% of questions`);
    }
    assert.ok(longest / all <= 0.35, `overall the answer is the longest option in ${Math.round((100 * longest) / all)}% of questions`);
  });

  it('no question repeats an option', () => {
    for (const built of builtTopics) {
      for (const q of built.questions) {
        if (!Array.isArray(q.options)) continue;
        const seen = new Set(q.options.map((o) => String(o).trim().toLowerCase()));
        assert.equal(seen.size, q.options.length, `${built.topic.id} ${q.id} has two identical options`);
      }
    }
  });
});

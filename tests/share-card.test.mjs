// Sharing questions and quizzes outside the app (data/share-card-rules.ts,
// lib/return-to.ts). Run with: npm test
// - the picture never gives the answer away (options are shuffled, nothing is marked)
// - the message carries the brand and the link
// - only study links are reopened after signing in
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { questionShareCard, quizShareCard, shareFileName, stableShuffle } from '../src/data/share-card-rules.ts';

const { isReturnPath } = await import('@/lib/return-to');
const { builtTopics } = await import('@/data/topics');

describe('share cards', () => {
  it('shuffle options the same way every time, without always putting the answer first', () => {
    assert.deepEqual(stableShuffle([1, 2, 3, 4], 'q'), stableShuffle([1, 2, 3, 4], 'q'));
    const choice = builtTopics.flatMap((built) => built.questions).filter((question) => question.type === 'choice' && !question.fixedOrder).slice(0, 200);
    let firstIsAnswer = 0;
    for (const question of choice) {
      const card = questionShareCard(question, 'Anatomy · Upper Limb', 'https://grateapex.vercel.app/learn/quiz?practice=x');
      assert.equal(card.lines.length, question.options.length);
      assert.deepEqual([...card.lines.map((line) => line.text)].sort(), [...question.options].sort());
      if (card.lines[0].text === question.options[question.answer]) firstIsAnswer += 1;
      assert.ok(!card.message.includes(question.options[question.answer]) || question.prompt.includes(question.options[question.answer]), `${question.id}: the message gives the answer away`);
    }
    assert.ok(firstIsAnswer < choice.length * 0.5, `the answer is first in ${firstIsAnswer} of ${choice.length}`);
  });

  it('carry the brand and the link', () => {
    const quiz = quizShareCard({ title: 'Upper Limb quiz', where: 'Anatomy · Upper Limb', score: 7, total: 10, url: 'https://grateapex.vercel.app/learn/quiz?practice=a,b' });
    assert.match(quiz.message, /GrAte Apex/);
    assert.match(quiz.message, /https:\/\/grateapex\.vercel\.app\/learn\/quiz\?practice=a,b/);
    assert.match(quiz.title, /7\/10/);
    assert.equal(quiz.kicker, 'ANATOMY · UPPER LIMB');
    assert.equal(shareFileName(quiz), 'grateapex-anatomy-upper-limb.png');
  });

  it('reopen only study links after signing in', () => {
    assert.ok(isReturnPath('/learn/quiz?practice=a,b&attempt=1'));
    assert.ok(isReturnPath('/learn/anatomy-drills'));
    assert.ok(!isReturnPath('/login'));
    assert.ok(!isReturnPath('/settings'));
    assert.ok(!isReturnPath('//evil.example/learn/quiz'));
    assert.ok(!isReturnPath('/learn/quiz?x=1#y'));
  });
});

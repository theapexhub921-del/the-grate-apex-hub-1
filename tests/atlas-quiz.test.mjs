import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { parseAtlasQuizMessage } from '../src/data/learning/atlas-quiz-rules.ts';
import { atlasQuizXp, XP_RULES } from '../src/data/learning/xp-rules.ts';

describe('atlas quiz message', () => {
  it('reads a whole-body round', () => {
    assert.deepEqual(parseAtlasQuizMessage({ type: 'quiz', system: 'skeletal', score: 7, total: 10 }), {
      system: 'skeletal',
      region: null,
      side: null,
      score: 7,
      total: 10,
    });
  });

  it('reads a region round with a limb side', () => {
    const r = parseAtlasQuizMessage({ type: 'quiz', system: 'muscular', region: 'upper-limb', side: 'left', score: 5, total: 5 });
    assert.equal(r?.region, 'upper-limb');
    assert.equal(r?.side, 'left');
  });

  it('ignores anything that is not a sensible quiz result', () => {
    const bad = [
      null,
      'quiz',
      { type: 'select', name: 'Femur' },
      { type: 'quiz', score: 3, total: 5 }, // no system
      { type: 'quiz', system: 'skeletal', score: 11, total: 10 }, // more right than asked
      { type: 'quiz', system: 'skeletal', score: -1, total: 10 },
      { type: 'quiz', system: 'skeletal', score: 1.5, total: 10 },
      { type: 'quiz', system: 'skeletal', score: 0, total: 0 },
      { type: 'quiz', system: 'skeletal', score: 5, total: 5000 },
      { type: 'quiz', system: 'skeletal', score: '5', total: '10' },
    ];
    for (const message of bad) assert.equal(parseAtlasQuizMessage(message), null, JSON.stringify(message));
  });

  it('drops an unknown side instead of trusting it', () => {
    assert.equal(parseAtlasQuizMessage({ type: 'quiz', system: 'skeletal', side: 'up', score: 1, total: 5 })?.side, null);
  });
});

describe('atlas quiz XP', () => {
  it('pays for finishing, with a bonus for a good score and no penalty', () => {
    assert.equal(atlasQuizXp({ correct: 0, total: 10 }).net, XP_RULES.atlasQuiz.completion);
    assert.equal(atlasQuizXp({ correct: 8, total: 10 }).net, XP_RULES.atlasQuiz.completion + XP_RULES.atlasQuiz.bonusAt75);
    assert.equal(atlasQuizXp({ correct: 9, total: 10 }).net, XP_RULES.atlasQuiz.completion + XP_RULES.atlasQuiz.bonusAt90);
    assert.equal(atlasQuizXp({ correct: 10, total: 10 }).penalty, 0);
  });

  it('stays inside the 10–50 XP task range and pays nothing for an empty round', () => {
    const best = atlasQuizXp({ correct: 10, total: 10 }).net;
    assert.ok(best >= XP_RULES.taskMin && best <= XP_RULES.taskMax);
    assert.equal(atlasQuizXp({ correct: 0, total: 0 }).net, 0);
  });
});

// The atlas is a plain HTML page, so these are source checks (like tests/deploy-wiring.test.mjs).
describe('atlas page wiring', () => {
  const html = readFileSync(new URL('../public/atlas/anatomy.html', import.meta.url), 'utf8');

  it('the limb regions are cut by side, on the CPU and in the shader', () => {
    assert.match(html, /function inRegion\(p, id = region, side = limbSide\)/);
    assert.match(html, /if \(id === 6\) return arm && onSide;/);
    assert.match(html, /if \(uRegion == 6\) return arm && onSide;/);
    assert.match(html, /uRegion == 7\) return [^;]*&& onSide;/);
    assert.match(html, /case 7: return [^;]*&& onSide;/);
  });

  it('the quiz can be limited to a region and reports it', () => {
    assert.match(html, /id="quizRegion"/);
    assert.match(html, /if \(!inRegion\(mid, quiz\.reg, quiz\.side\)\) continue;/);
    assert.match(html, /post\(\{ type: 'quiz', system: quiz\.sys\.id, region:/);
  });

  it('a finished round reaches the web app, which answers with the XP earned', () => {
    assert.match(html, /window\.parent\.postMessage\(msg, window\.location\.origin\)/);
    assert.match(html, /m\.type === 'quizXp'/);
    const host = readFileSync(new URL('../src/components/learning/skeleton-atlas.web.tsx', import.meta.url), 'utf8');
    assert.match(host, /event\.source !== frame\.current\?\.contentWindow/);
    assert.match(host, /parseAtlasQuizMessage\(event\.data\)/);
    assert.match(host, /recordAtlasQuiz\(result\)/);
  });
});

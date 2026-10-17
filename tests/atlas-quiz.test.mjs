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
      part: null,
      score: 7,
      total: 10,
    });
  });

  it('reads a region round with a limb side and part', () => {
    const r = parseAtlasQuizMessage({ type: 'quiz', system: 'muscular', region: 'upper-limb', side: 'left', part: 'forearm', score: 5, total: 5 });
    assert.equal(r?.region, 'upper-limb');
    assert.equal(r?.side, 'left');
    assert.equal(r?.part, 'forearm');
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

  it('the limb regions are cut by side and part, on the CPU and in the shader', () => {
    assert.match(html, /function inRegion\(p, id = region, side = limbSide, rng = limbRange\)/);
    assert.match(html, /if \(id === 6\) return arm && onSide;/);
    assert.match(html, /if \(uRegion == 6\) return arm && onSide;/);
    assert.match(html, /uRegion == 7\) return [^;]*&& onSide;/);
    assert.match(html, /case 7: return [^;]*&& onSide;/);
    // the shader gets the same side and height band as the CPU test
    assert.match(html, /bool onSide = p\.x \* uLimbSide >= 0\.0 && y >= uLimbLo && y < uLimbHi;/);
    assert.match(html, /sh\.uniforms\.uLimbLo = limbLoU;/);
    assert.match(html, /sh\.uniforms\.uLimbHi = limbHiU;/);
  });

  it('the quiz can be limited to a region (and limb part) and reports it', () => {
    assert.match(html, /id="quizRegion"/);
    assert.match(html, /id="quizPart"/);
    assert.match(html, /if \(!inRegion\(mid, quiz\.reg, quiz\.side, limbPartOf\(quiz\.reg, quiz\.part\) \|\| WHOLE_LIMB\)\) continue;/);
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

// Runs the page's own region code (the CPU test that the Explore tab and the quiz use) against the model's landmarks.
// Model coordinates: metres, y up, anatomical right is -x and left is +x.
describe('limb regions and parts', () => {
  const html = readFileSync(new URL('../public/atlas/anatomy.html', import.meta.url), 'utf8');
  const start = html.indexOf('let limbSide = -1;');
  const end = html.indexOf('// same test on the GPU');
  assert.ok(start > 0 && end > start, 'could not find the region code in anatomy.html');
  const page = new Function(`let region = 0; ${html.slice(start, end)}; return { inRegion, LIMB_PARTS, WHOLE_LIMB };`)();
  const { inRegion, LIMB_PARTS, WHOLE_LIMB } = page;
  const RIGHT = -1, LEFT = 1, UPPER = 6, LOWER = 7;

  const landmarks = Object.values(JSON.parse(readFileSync(new URL('../public/atlas/landmarks.json', import.meta.url), 'utf8'))).flat();
  const named = (name) => {
    const row = landmarks.find((r) => r[0] === name && r[1] === 'R');
    assert.ok(row, `landmark "${name}" not found`);
    return { x: row[2], y: row[3], z: row[4] };
  };
  // which part (by name) of the given limb a point is in, or null when it is not in that limb at all
  const partOf = (point, id, side) => {
    if (!inRegion(point, id, side, WHOLE_LIMB)) return null;
    const hits = LIMB_PARTS[id].filter((part) => inRegion(point, id, side, part));
    assert.equal(hits.length, 1, `a point must be in exactly one part, got ${hits.length}`);
    return hits[0].label;
  };

  it('puts real landmarks in the right part of the right arm', () => {
    assert.equal(partOf(named('Head of humerus'), UPPER, RIGHT), 'Shoulder');
    assert.equal(partOf(named('Lateral epicondyle of humerus'), UPPER, RIGHT), 'Arm');
    assert.equal(partOf(named('Body of radius'), UPPER, RIGHT), 'Forearm');
    assert.equal(partOf(named('Tubercle of scaphoid bone'), UPPER, RIGHT), 'Hand');
  });

  it('puts real landmarks in the right part of the right leg', () => {
    assert.equal(partOf(named('Lateral condyle of femur'), LOWER, RIGHT), 'Thigh');
    assert.equal(partOf(named('Tibial tuberosity'), LOWER, RIGHT), 'Leg');
    assert.equal(partOf(named('Calcaneal tuberosity'), LOWER, RIGHT), 'Foot');
  });

  it('shows one side only: the right limb is not in the left limb and the other way round', () => {
    const humerus = named('Head of humerus');
    const mirrored = { ...humerus, x: -humerus.x };
    assert.equal(partOf(humerus, UPPER, LEFT), null);
    assert.equal(partOf(mirrored, UPPER, LEFT), 'Shoulder');
    assert.equal(partOf(mirrored, UPPER, RIGHT), null);
    const condyle = named('Lateral condyle of femur');
    assert.equal(partOf(condyle, LOWER, LEFT), null);
    assert.equal(partOf({ ...condyle, x: -condyle.x }, LOWER, LEFT), 'Thigh');
  });

  it('every sided limb landmark is on exactly the side its letter says', () => {
    for (const [name, side, x, y, z] of landmarks) {
      if (side !== 'R' && side !== 'L') continue;
      const p = { x, y, z };
      const mine = side === 'R' ? RIGHT : LEFT;
      for (const id of [UPPER, LOWER]) {
        if (inRegion(p, id, mine, WHOLE_LIMB)) assert.equal(inRegion(p, id, -mine, WHOLE_LIMB), false, `${name} is in both limbs`);
      }
    }
  });

  it('the parts of a limb tile it: no gaps and no overlaps', () => {
    for (const id of [UPPER, LOWER]) {
      const parts = LIMB_PARTS[id];
      const sorted = [...parts].sort((a, b) => a.lo - b.lo);
      assert.equal(sorted[0].lo, WHOLE_LIMB.lo);
      assert.equal(sorted[sorted.length - 1].hi, WHOLE_LIMB.hi);
      for (let i = 1; i < sorted.length; i++) assert.equal(sorted[i].lo, sorted[i - 1].hi, `gap or overlap in region ${id}`);
    }
    // and for every point on a grid, the whole limb is exactly the union of its parts
    for (const id of [UPPER, LOWER]) {
      for (let x = -0.5; x <= 0.5; x += 0.025) {
        for (let y = 0; y <= 1.6; y += 0.02) {
          for (const side of [RIGHT, LEFT]) {
            const p = { x, y, z: 0 };
            const inLimb = inRegion(p, id, side, WHOLE_LIMB);
            const inParts = LIMB_PARTS[id].filter((part) => inRegion(p, id, side, part)).length;
            assert.equal(inParts, inLimb ? 1 : 0, `x=${x} y=${y}`);
          }
        }
      }
    }
  });

  it('the other regions ignore the limb side and part', () => {
    const thorax = { x: 0.05, y: 1.3, z: 0 };
    for (const side of [RIGHT, LEFT]) assert.equal(inRegion(thorax, 3, side, LIMB_PARTS[UPPER][0]), true);
  });
});

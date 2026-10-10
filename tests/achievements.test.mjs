// Achievements: every original-app milestone plus this app's six, five levels each.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { ACHIEVEMENTS, computeMetrics, evaluateAchievements, legacyStats, newLevels, NO_LEGACY } = await import('@/data/achievements');

const app = (over = {}) => ({ answers: [], quizzes: [], xp: 0, lessonsCompleted: 0, lessonCompletedAt: [], topicsCompleted: 0, conceptsMastered: 0, ...over });

describe('achievement definitions', () => {
  it('imports all 66 original milestones plus 6 of this app’s, with unique ids', () => {
    assert.equal(ACHIEVEMENTS.length, 72);
    assert.equal(new Set(ACHIEVEMENTS.map((a) => a.id)).size, 72);
  });
  it('every achievement has five strictly increasing, measurable levels', () => {
    for (const a of ACHIEVEMENTS) {
      assert.equal(a.levels.length, 5, a.id);
      a.levels.forEach((n, i) => { assert.ok(Number.isInteger(n) && n > 0, a.id); if (i) assert.ok(n > a.levels[i - 1], a.id); });
      assert.ok(a.goal(a.levels[0]).length > 0);
    }
  });
});

describe('measuring progress', () => {
  it('adds the original app’s counts to this app’s', () => {
    const legacy = legacyStats({ subjects: { biolchem: { answered: 90, correct: 80, quizzes: 3, best: 100 } }, days: { '2026-10-01': 5 }, lessons: { 'biolchem-1': 2 } });
    const m = computeMetrics(app({ answers: Array.from({ length: 10 }, (_, i) => ({ questionId: `q${i}`, correct: true, attemptedAt: Date.parse('2026-10-02T10:00:00') })) }), legacy);
    assert.equal(m.answered, 100);
    assert.equal(m.longestStreak, 2);
    assert.equal(m.perfectRounds, 1);
    assert.equal(m.lessonsStarted, 1);
  });
  it('counts a fixed mistake only when a wrong answer is later answered right', () => {
    const at = (h) => Date.parse(`2026-10-02T0${h}:00:00`);
    const m = computeMetrics(app({ answers: [{ questionId: 'a', correct: false, attemptedAt: at(1) }, { questionId: 'a', correct: true, attemptedAt: at(2) }, { questionId: 'b', correct: true, attemptedAt: at(3) }] }), NO_LEGACY);
    assert.equal(m.fixed, 1);
  });
});

describe('levels and rewards', () => {
  it('a ladder never completes two milestones’ levels with one step', () => {
    const states = evaluateAchievements(computeMetrics(app({ answers: Array.from({ length: 100 }, (_, i) => ({ questionId: `q${i}`, correct: true, attemptedAt: 1_791_000_000_000 })) })));
    const level = (id) => states.find((s) => s.def.id === id).level;
    assert.equal(level('q1'), 5);
    assert.equal(level('q100'), 5);
    assert.equal(level('q250'), 0);
  });
  it('new levels are reported once, in order, above what was recorded', () => {
    const states = evaluateAchievements(computeMetrics(app({ xp: 450 })));
    assert.deepEqual(newLevels({ l5: 3, xp1k: 2 }, states).filter((x) => ['l5', 'xp1k'].includes(x.id)), [{ id: 'l5', level: 4 }, { id: 'l5', level: 5 }]);
    assert.deepEqual(newLevels({ l5: 5, xp1k: 2 }, states).filter((x) => ['l5', 'xp1k'].includes(x.id)), []);
  });
});

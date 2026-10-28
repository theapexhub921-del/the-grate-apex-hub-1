// The study boosts added on 2026-10-28. Run with: npm test
// - Sure / Guessing confidence in the scheduler and on Results
// - Daily 10, confused pairs, the daily quest and sprints
// - "Label it" diagrams, the memory map, cross-course links and memory hooks
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { applyAnswer, emptyMemory, SCHEDULER } from '../src/data/learning/scheduler.ts';
import { calibration, confidenceSummary } from '../src/data/learning/confidence.ts';
import {
  bestSprint,
  confusedPairs,
  dailyMixConcepts,
  dailyMixIds,
  dailyQuest,
  pairDrillIds,
} from '../src/data/learning/daily-practice.ts';
import { chipDone, labelChips, labelFits } from '../src/data/learning/label-it.ts';
import { mapFocus, memoryMap } from '../src/data/learning/memory-map.ts';
import { cleanHooks, mergeHooks } from '../src/data/learning/memory-hook-rules.ts';
import { normWord, relatedLessons } from '../src/data/learning/related-lessons.ts';
import { examQuery, examTitle, parseExam } from '../src/data/exam-practice-rules.ts';

const DAY = 86_400_000;

describe('Sure / Guessing', () => {
  // A concept answered right once, then reviewed on time.
  const learned = () => {
    let record = emptyMemory('introductory');
    record = applyAnswer(record, { at: 0, correct: true, mode: 'lesson-quiz' });
    return record;
  };

  it('a lucky guess grows the interval less than a sure answer', () => {
    const at = 2 * DAY;
    const sure = applyAnswer(learned(), { at, correct: true, mode: 'review', confidence: 'sure' });
    const guess = applyAnswer(learned(), { at, correct: true, mode: 'review', confidence: 'guess' });
    assert.ok(guess.intervalDays <= sure.intervalDays);
    const later = 9 * DAY;
    const sure2 = applyAnswer(sure, { at: later, correct: true, mode: 'review', confidence: 'sure' });
    const guess2 = applyAnswer(sure, { at: later, correct: true, mode: 'review', confidence: 'guess' });
    assert.ok(guess2.intervalDays < sure2.intervalDays, `${guess2.intervalDays} < ${sure2.intervalDays}`);
  });

  it('a confident mistake costs more ease than an unsure one', () => {
    const at = 2 * DAY;
    const sureWrong = applyAnswer(learned(), { at, correct: false, mode: 'review', confidence: 'sure' });
    const plainWrong = applyAnswer(learned(), { at, correct: false, mode: 'review' });
    assert.ok(Math.abs(plainWrong.ease - sureWrong.ease - SCHEDULER.confidentWrongEasePenalty) < 1e-9);
  });

  it('Results sorts answers into known, lucky guesses and confident mistakes', () => {
    const summary = confidenceSummary([
      { id: 'a', correct: true, confidence: 'sure' },
      { id: 'b', correct: true, confidence: 'guess' },
      { id: 'c', correct: false, confidence: 'sure' },
      { id: 'd', correct: false, confidence: 'guess' },
      { id: 'e', correct: true },
    ]);
    assert.equal(summary.rated, 4);
    assert.equal(summary.known, 1);
    assert.deepEqual(summary.luckyGuesses, ['b']);
    assert.deepEqual(summary.confidentMistakes, ['c']);
    assert.equal(summary.gaps, 1);
    assert.equal(calibration(summary), 50);
    assert.equal(calibration(confidenceSummary([{ id: 'a', correct: true, confidence: 'sure' }])), null);
  });
});

const concept = (key, topicId, extra = {}) => ({
  ...emptyMemory(),
  key,
  topicId,
  lessonId: `${topicId}-l1`,
  conceptId: key,
  name: key,
  state: 'learning',
  due: false,
  mastery: 0.5,
  priority: 1,
  attempts: 1,
  ...extra,
});

describe('Daily 10', () => {
  const concepts = [
    concept('a1', 'A', { due: true, priority: 5 }),
    concept('a2', 'A', { due: true, priority: 4 }),
    concept('a3', 'A', { due: true, priority: 3 }),
    concept('b1', 'B', { due: true, priority: 2 }),
    concept('c1', 'C', { state: 'struggling' }),
    concept('c2', 'C', { state: 'mastered', mastery: 0.95 }),
    concept('n1', 'D', { attempts: 0, learnedAt: null }),
  ];

  it('puts due concepts first and mixes topics', () => {
    const order = dailyMixConcepts(concepts, 6).map((item) => item.key);
    assert.deepEqual(order.slice(0, 2).sort(), ['a1', 'b1']);
    assert.ok(!order.includes('n1'), 'never-studied concepts are left out');
    for (let i = 1; i < 3; i += 1) assert.notEqual(order[i].charAt(0), order[i - 1].charAt(0), 'topics alternate');
  });

  it('asks one question per concept, the missed one first', () => {
    const memory = new Map([['q-a1-2', { lastCorrect: false, lastSeenAt: 5 }]]);
    const ids = dailyMixIds(concepts, (item) => [`q-${item.key}-1`, `q-${item.key}-2`], (id) => memory.get(id), 4);
    assert.equal(ids.length, 4);
    assert.ok(ids.includes('q-a1-2'));
    assert.equal(new Set(ids.map((id) => id.split('-')[1])).size, 4);
  });
});

describe('Confused pairs', () => {
  const mixUps = [
    { questionId: 'q1', picked: 'Ulnar nerve', right: 'Median nerve', at: 1 },
    { questionId: 'q2', picked: 'Median nerve', right: 'Ulnar nerve', at: 10 * 3_600_000 },
    { questionId: 'q1', picked: 'Ulnar nerve', right: 'Median nerve', at: 2 }, // same sitting: counted once
    { questionId: 'q3', picked: 'All of the above', right: 'Radial nerve', at: 3 },
    { questionId: 'q4', picked: 'Systole', right: 'Diastole', at: 4 },
  ];

  it('finds the answers mixed up most, in either direction', () => {
    const pairs = confusedPairs(mixUps);
    assert.deepEqual(pairs[0].terms, ['Median nerve', 'Ulnar nerve']);
    assert.equal(pairs[0].count, 2);
    assert.deepEqual(pairs[0].questionIds.sort(), ['q1', 'q2']);
    assert.ok(!pairs.some((pair) => pair.terms.includes('All of the above')), 'not a term');
  });

  it('drills both sides of a pair in turn', () => {
    const pairs = confusedPairs(mixUps);
    const bank = [
      { id: 'm1', options: ['Median nerve', 'Ulnar nerve', 'Radial nerve'], right: 'Median nerve' },
      { id: 'm2', options: ['Median nerve', 'Ulnar nerve'], right: 'Median nerve' },
      { id: 'u1', options: ['Ulnar nerve', 'Median nerve'], right: 'Ulnar nerve' },
      { id: 'x1', options: ['Median nerve', 'Axillary nerve'], right: 'Median nerve' },
      { id: 's1', options: ['Systole', 'Diastole'], right: 'Diastole' },
    ];
    const ids = pairDrillIds(pairs, bank);
    // Pairs take turns; within a pair, one side then the other.
    assert.deepEqual(ids, ['m1', 's1', 'u1', 'm2']);
    assert.ok(!ids.includes('x1'), 'the other term must be one of the options');
    assert.equal(new Set(ids).size, ids.length);
  });
});

describe('Daily quest and sprints', () => {
  it('is complete only when all three steps are done', () => {
    assert.equal(dailyQuest({ daily: true, label: true, study: false }).complete, false);
    assert.equal(dailyQuest({ daily: true, label: true, study: true }).complete, true);
    assert.equal(dailyQuest({ daily: false, label: false, study: false }).steps.length, 3);
  });

  it('keeps the best sprint', () => {
    assert.equal(bestSprint([]), null);
    assert.equal(bestSprint([4, 12, 9]), 12);
  });

  it('new practice kinds survive the quiz link', () => {
    for (const kind of ['daily', 'sprint', 'pairs']) {
      assert.deepEqual(parseExam((name) => examQuery({ kind })[name]?.toString()), { kind });
      assert.ok(examTitle({ kind }).length > 3);
    }
  });
});

describe('Label it', () => {
  const spots = [
    { id: 'a', label: 'Aorta', x: 0.1, y: 0.1 },
    { id: 'b', label: 'Pulmonary trunk', x: 0.2, y: 0.2 },
    { id: 'c', label: 'aorta ', x: 0.3, y: 0.3 },
    { id: 'd', label: 'Left atrium', x: 0.4, y: 0.4 },
  ];

  it('lists each name once, in a fixed shuffle', () => {
    const chips = labelChips(spots, 'seed');
    assert.equal(chips.length, 3);
    assert.deepEqual(labelChips(spots, 'seed'), chips);
    assert.deepEqual([...chips].sort(), ['Aorta', 'Left atrium', 'Pulmonary trunk']);
  });

  it('accepts a name on any pin with that label, and uses it up once all are placed', () => {
    assert.ok(labelFits(spots[2], 'Aorta'));
    assert.ok(!labelFits(spots[1], 'Aorta'));
    assert.equal(chipDone(spots, new Set(['a']), 'Aorta'), false);
    assert.equal(chipDone(spots, new Set(['a', 'c']), 'Aorta'), true);
  });
});

describe('Memory map', () => {
  it('shows every concept, lesson by lesson, with its state and strength', () => {
    const rows = memoryMap(
      [
        { id: 'l1', title: 'One', concepts: [{ key: 't/a', name: 'A' }, { key: 't/b', name: 'B' }] },
        { id: 'l2', title: 'Two', concepts: [] },
      ],
      (key) => (key === 't/a' ? { state: 'struggling', mastery: 0.2, due: true, dueAt: 5 } : undefined)
    );
    assert.equal(rows.length, 1, 'lessons without concepts are left out');
    assert.deepEqual(rows[0].cells.map((cell) => cell.state), ['struggling', 'new']);
    assert.equal(rows[0].strength, 0.1);
    assert.deepEqual(mapFocus(rows).map((cell) => cell.key), ['t/a']);
  });
});

describe('Memory hooks', () => {
  it('keeps the newer change from either device, removals too', () => {
    const merged = mergeHooks({ a: { text: 'old', at: 1 }, b: { text: 'keep', at: 5 } }, { a: { text: 'new', at: 2 }, b: { text: '', at: 3 } });
    assert.deepEqual(merged, { a: { text: 'new', at: 2 }, b: { text: 'keep', at: 5 } });
    assert.deepEqual(cleanHooks({ a: { text: 'x', at: 1 }, b: 'junk', c: { text: 3, at: 1 } }), { a: { text: 'x', at: 1 } });
  });
});

describe('Links across courses', () => {
  it('links lessons in other subjects on shared key words', () => {
    const lessons = [
      { id: 'anat', title: 'Heart', subject: 'anatomy', topicId: 'cvs', words: ['Right atrium', 'Sinoatrial node'] },
      { id: 'phys', title: 'Cardiac cycle', subject: 'physiology', topicId: 'cvp', words: ['Sinoatrial node (SA node)', 'Stroke volume'] },
      { id: 'anat2', title: 'Thorax', subject: 'anatomy', topicId: 'cvs', words: ['Right atrium'] },
      { id: 'bio', title: 'Lipids', subject: 'biochemistry', topicId: 'fa', words: ['Malonyl-CoA'] },
    ];
    const related = relatedLessons('anat', lessons);
    assert.deepEqual(related.map((item) => item.id), ['phys']);
    assert.deepEqual(related[0].shared, ['Sinoatrial node']);
    assert.equal(normWord('Arteries (main)'), 'artery');
  });

  it('finds links for many real lessons, never in the same subject', async () => {
    const { lessonWordIndex, relatedLessonsFor } = await import('@/data/related-lessons');
    const index = lessonWordIndex();
    const subjectOf = new Map(index.map((lesson) => [lesson.id, lesson.subject]));
    let linked = 0;
    for (const lesson of index) {
      const related = relatedLessonsFor(lesson.id);
      if (related.length) linked += 1;
      for (const item of related) assert.notEqual(subjectOf.get(item.id), lesson.subject);
    }
    assert.ok(linked >= index.length * 0.3, `${linked} of ${index.length} lessons have links`);
  });
});

describe('Label it on the real diagrams', () => {
  it('every diagram shown in a lesson has a lesson to come from', async () => {
    const { allFigures } = await import('@/data/figures');
    const { figureLessons, pickLabelFigure, spotQuestionFor } = await import('@/data/figure-practice');
    const lessons = figureLessons();
    assert.ok(lessons.size > 50);
    const figure = pickLabelFigure(new Set(), 0.5);
    assert.ok(figure && figure.spots.length >= 3);
    // Pictures in anatomy lessons have quiz questions for their spots.
    const pictured = allFigures.find((item) => item.spots.some((spot) => spotQuestionFor(item.id, spot.id)));
    assert.ok(pictured, 'some diagram parts have quiz questions');
  });
});

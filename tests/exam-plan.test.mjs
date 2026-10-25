import assert from 'node:assert/strict';
import { test } from 'node:test';

import { daysUntil, examPlan, isValidExamDate, REVISION_DAYS } from '../src/data/exam-plan-rules.ts';

test('days to the exam count whole calendar days', () => {
  assert.equal(daysUntil('2026-10-25', '2026-10-26'), 1);
  assert.equal(daysUntil('2026-10-25', '2026-10-25'), 0);
  assert.equal(daysUntil('2026-10-25', '2026-10-20'), -5);
  assert.equal(daysUntil('2026-10-25', '2027-01-01'), 68);
  // Across the clock change at the end of March
  assert.equal(daysUntil('2027-03-27', '2027-03-29'), 2);
  assert.equal(daysUntil('2026-10-25', '2026-02-30'), null);
  assert.equal(daysUntil('2026-10-25', 'soon'), null);
});

test('an exam date must be a real day from tomorrow to two years ahead', () => {
  assert.equal(isValidExamDate('2026-10-26', '2026-10-25'), true);
  assert.equal(isValidExamDate('2026-10-25', '2026-10-25'), false);
  assert.equal(isValidExamDate('2026-10-01', '2026-10-25'), false);
  assert.equal(isValidExamDate('2030-01-01', '2026-10-25'), false);
  assert.equal(isValidExamDate('2026-13-01', '2026-10-25'), false);
});

test('lessons are spread over the days before the revision days', () => {
  // 20 days left: 17 learning days, 34 lessons → 2 a day
  const plan = examPlan({ today: '2026-10-25', examDate: '2026-11-14', lessonsLeft: 34, lessonsDoneToday: 0, reviewsDue: 5 });
  assert.equal(plan.phase, 'learn');
  assert.equal(plan.daysLeft, 20);
  assert.equal(plan.learningDays, 20 - REVISION_DAYS);
  assert.equal(plan.lessonTarget, 2);
  assert.equal(plan.lessonsStillToday, 2);
  assert.equal(plan.reviewsDue, 5);
});

test("today's target stays the same while the learner works through it", () => {
  const before = examPlan({ today: '2026-10-25', examDate: '2026-11-14', lessonsLeft: 35, lessonsDoneToday: 0, reviewsDue: 0 });
  const after = examPlan({ today: '2026-10-25', examDate: '2026-11-14', lessonsLeft: 33, lessonsDoneToday: 2, reviewsDue: 0 });
  assert.equal(before.lessonTarget, 3);
  assert.equal(after.lessonTarget, 3);
  assert.equal(after.lessonsStillToday, 1);
  const done = examPlan({ today: '2026-10-25', examDate: '2026-11-14', lessonsLeft: 30, lessonsDoneToday: 5, reviewsDue: 0 });
  assert.equal(done.lessonsStillToday, 0);
});

test('never asks for more lessons than are left', () => {
  const plan = examPlan({ today: '2026-10-25', examDate: '2026-10-29', lessonsLeft: 2, lessonsDoneToday: 0, reviewsDue: 0 });
  assert.equal(plan.learningDays, 1);
  assert.equal(plan.lessonsStillToday, 2);
});

test('revision once the lessons are done or the last days begin', () => {
  assert.equal(examPlan({ today: '2026-10-25', examDate: '2026-11-30', lessonsLeft: 0, lessonsDoneToday: 0, reviewsDue: 3 }).phase, 'revise');
  assert.equal(examPlan({ today: '2026-10-25', examDate: '2026-10-28', lessonsLeft: 10, lessonsDoneToday: 0, reviewsDue: 3 }).phase, 'revise');
  assert.equal(examPlan({ today: '2026-10-25', examDate: '2026-10-25', lessonsLeft: 10, lessonsDoneToday: 0, reviewsDue: 3 }).phase, 'exam-day');
  assert.equal(examPlan({ today: '2026-10-25', examDate: '2026-10-01', lessonsLeft: 10, lessonsDoneToday: 0, reviewsDue: 3 }).phase, 'passed');
  assert.equal(examPlan({ today: '2026-10-25', examDate: 'nope', lessonsLeft: 1, lessonsDoneToday: 0, reviewsDue: 0 }), null);
});

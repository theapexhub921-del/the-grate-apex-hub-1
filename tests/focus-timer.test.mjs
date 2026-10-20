import assert from 'node:assert/strict';
import { test } from 'node:test';

import { addFocus, clock, emptyFocusLog, focusTotals, mergeFocusLogs } from '../src/data/focus-rules.ts';

const at = (day, hour = 10) => new Date(2026, 9, day, hour).getTime(); // October 2026; the 19th is a Monday

test('focus minutes add up per day, week and in all', () => {
  let log = emptyFocusLog();
  log = addFocus(log, 25, at(18), true); // Sunday, last week
  log = addFocus(log, 25, at(19), true);
  log = addFocus(log, 7, at(20), false); // stopped early: minutes, no block
  log = addFocus(log, 50, at(20, 18), true);
  assert.deepEqual(focusTotals(log, at(20, 20)), { today: 57, week: 82, total: 107, sessionsToday: 1 });
});

test('two devices merge: each day keeps the larger count', () => {
  const phone = { days: { '2026-10-19': 25, '2026-10-20': 10 }, sessions: { '2026-10-19': 1 } };
  const laptop = { days: { '2026-10-20': 50 }, sessions: { '2026-10-20': 2 } };
  assert.deepEqual(mergeFocusLogs(phone, laptop), { days: { '2026-10-19': 25, '2026-10-20': 50 }, sessions: { '2026-10-19': 1, '2026-10-20': 2 } });
  assert.deepEqual(mergeFocusLogs(undefined, undefined), emptyFocusLog());
});

test('the clock shows minutes and seconds', () => {
  assert.equal(clock(25 * 60), '25:00');
  assert.equal(clock(61.2), '01:02');
  assert.equal(clock(-3), '00:00');
});

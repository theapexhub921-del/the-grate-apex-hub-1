import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  applyActivity,
  canRestore,
  currentStreak,
  freezeEarned,
  restoredState,
  streakStatus,
  weekKeyOf,
} from '../src/data/learning/streak-rules.ts';
import { friendStreakStatus } from '../src/data/friend-streaks.ts';

const state = (streak, lastActivityDate, freezes = 0) => ({ streak, lastActivityDate, freezes });

test('studying on consecutive days grows the streak; the same day does not', () => {
  assert.deepEqual(applyActivity(state(0, null), '2026-10-16').state, state(1, '2026-10-16'));
  assert.equal(applyActivity(state(4, '2026-10-15'), '2026-10-16').state.streak, 5);
  assert.equal(applyActivity(state(4, '2026-10-16'), '2026-10-16').state.streak, 4);
});

test('a whole missed day ends the streak at midnight (shown as 0) and records it as lost', () => {
  assert.equal(currentStreak(state(6, '2026-10-14'), '2026-10-15'), 6); // yesterday: still alive today
  assert.equal(currentStreak(state(6, '2026-10-14'), '2026-10-16'), 0); // the 15th was missed
  assert.equal(streakStatus(state(6, '2026-10-14'), '2026-10-16'), 'lapsed');
  const result = applyActivity(state(6, '2026-10-14'), '2026-10-16');
  assert.equal(result.state.streak, 1);
  assert.deepEqual(result.lost, { streak: 6, on: '2026-10-16' });
});

test('a freeze covers one missed day and is used automatically', () => {
  assert.equal(currentStreak(state(6, '2026-10-14', 1), '2026-10-16'), 6);
  assert.equal(streakStatus(state(6, '2026-10-14', 1), '2026-10-16'), 'frozen');
  const result = applyActivity(state(6, '2026-10-14', 1), '2026-10-16');
  assert.deepEqual(result.state, state(7, '2026-10-16', 0));
  assert.equal(result.freezesUsed, 1);
  assert.equal(result.lost, null);
  // Two missed days need two freezes.
  assert.equal(applyActivity(state(6, '2026-10-13', 1), '2026-10-16').state.streak, 1);
  assert.equal(applyActivity(state(6, '2026-10-13', 2), '2026-10-16').state.streak, 7);
});

test('a lost streak can be restored for a few days, keeping today’s study', () => {
  const lost = { streak: 9, on: '2026-10-16' };
  assert.equal(canRestore(lost, '2026-10-18'), true);
  assert.equal(canRestore(lost, '2026-10-20'), false);
  assert.equal(canRestore({ streak: 1, on: '2026-10-16' }, '2026-10-16'), false);
  // Not studied since: back to 9, standing on yesterday.
  assert.deepEqual(restoredState(state(0, '2026-10-13'), lost, '2026-10-16'), state(9, '2026-10-15'));
  // Already studied today (a new streak of 1): 9 + today.
  assert.equal(restoredState(state(1, '2026-10-16'), lost, '2026-10-16').streak, 10);
});

test('five lessons in one week earn one freeze, once, up to the cap', () => {
  const monday = new Date(2026, 9, 12, 10).getTime();
  const week = weekKeyOf(monday);
  const five = [0, 1, 2, 3, 4].map((day) => monday + day * 86_400_000);
  assert.equal(weekKeyOf(five[4]), week);
  assert.equal(freezeEarned(five, week, [], 0), true);
  assert.equal(freezeEarned(five.slice(0, 4), week, [], 0), false);
  assert.equal(freezeEarned(five, week, [week], 0), false);
  assert.equal(freezeEarned(five, week, [], 2), false);
});

const NOW = new Date(2026, 9, 16, 18).getTime();
const DAY = 86_400_000;
const msg = (from, daysAgo) => ({ sender_id: from, created_at: new Date(new Date(NOW - daysAgo * DAY).setHours(12, 0, 0, 0)).toISOString() });
const both = (daysAgo) => [msg('me', daysAgo), msg('f', daysAgo)];

test('friend streak: at risk until both message today', () => {
  const status = friendStreakStatus([...both(1), ...both(2), msg('me', 0)], 'me', 'f', NOW);
  assert.equal(status.streak, 2);
  assert.equal(status.atRisk, true);
  assert.equal(status.meToday, true);
  assert.equal(status.friendToday, false);
});

test('friend streak: a missed day ends it; covering the day restores it', () => {
  const messages = [...both(2), ...both(3), ...both(4)]; // yesterday (1 day ago) missed
  const ended = friendStreakStatus(messages, 'me', 'f', NOW);
  assert.equal(ended.streak, 0);
  assert.equal(ended.lost?.streak, 3);
  assert.equal(ended.lost?.missed.length, 1);
  const covered = friendStreakStatus(messages, 'me', 'f', NOW, ended.lost.missed);
  assert.equal(covered.streak, 4);
  assert.equal(covered.lost, null);
});

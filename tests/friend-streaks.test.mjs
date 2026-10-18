import assert from 'node:assert/strict';
import { test } from 'node:test';

import { friendStreak } from '../src/data/friend-streaks.ts';

const DAY = 86_400_000;
const NOW = new Date(2026, 9, 12, 18).getTime();
const at = (daysAgo, hour = 12) => new Date(NOW - daysAgo * DAY).setHours(hour, 0, 0, 0);
const msg = (from, daysAgo) => ({ sender_id: from, created_at: new Date(at(daysAgo)).toISOString() });

test('a streak counts days on which both friends messaged', () => {
  const messages = [msg('me', 0), msg('f', 0), msg('me', 1), msg('f', 1), msg('me', 2), msg('f', 2), msg('me', 4), msg('f', 4)];
  assert.equal(friendStreak(messages, 'me', 'f', NOW), 3);
});

test('today not done yet keeps yesterday’s streak; one-sided days do not count', () => {
  const messages = [msg('me', 0), msg('me', 1), msg('f', 1), msg('me', 2), msg('f', 2)];
  assert.equal(friendStreak(messages, 'me', 'f', NOW), 2);
  assert.equal(friendStreak([msg('me', 1), msg('me', 2)], 'me', 'f', NOW), 0);
});

// Owner's rule from 2026-10-18: friend streaks are kept by stumping each other
// (data/friend-streaks.ts, STUMP_STREAKS_FROM = 2026-10-21). Days before that
// still count with any message, so streaks that already existed carry on.
const { friendStreakStatus, STUMP_STREAKS_FROM } = await import('../src/data/friend-streaks.ts');
const AFTER = new Date(2026, 9, 23, 18).getTime(); // 23 Oct: two days after the switch
const onDay = (now, from, daysAgo, stump = false) => ({ sender_id: from, created_at: new Date(new Date(now - daysAgo * DAY).setHours(12, 0, 0, 0)).toISOString(), stump });

test('the switch day is 21 October 2026', () => assert.equal(STUMP_STREAKS_FROM, '2026-10-21'));

test('after the switch, ordinary messages no longer keep a friend streak', () => {
  const messages = [onDay(AFTER, 'me', 0), onDay(AFTER, 'f', 0), onDay(AFTER, 'me', 1), onDay(AFTER, 'f', 1)];
  const status = friendStreakStatus(messages, 'me', 'f', AFTER);
  assert.equal(status.streak, 0);
  assert.equal(status.stumpsNeeded, true);
});

test('after the switch, both stumping each other keeps the streak; one side alone does not', () => {
  const both = [onDay(AFTER, 'me', 0, true), onDay(AFTER, 'f', 0, true), onDay(AFTER, 'me', 1, true), onDay(AFTER, 'f', 1, true)];
  assert.equal(friendStreakStatus(both, 'me', 'f', AFTER).streak, 2);
  const oneSided = [onDay(AFTER, 'me', 0, true), onDay(AFTER, 'f', 0), onDay(AFTER, 'me', 1, true), onDay(AFTER, 'f', 1, true)];
  const status = friendStreakStatus(oneSided, 'me', 'f', AFTER);
  assert.equal(status.today, false);
  assert.equal(status.meToday, true);
  assert.equal(status.friendToday, false);
  assert.equal(status.atRisk, true);
  assert.equal(status.streak, 1);
});

test('a streak built by messages before the switch carries on when the friends stump each other', () => {
  // 17–20 Oct: ordinary messages (old rule). 21–23 Oct: stumps.
  const messages = [];
  for (let daysAgo = 6; daysAgo >= 3; daysAgo -= 1) messages.push(onDay(AFTER, 'me', daysAgo), onDay(AFTER, 'f', daysAgo));
  for (let daysAgo = 2; daysAgo >= 0; daysAgo -= 1) messages.push(onDay(AFTER, 'me', daysAgo, true), onDay(AFTER, 'f', daysAgo, true));
  assert.equal(friendStreakStatus(messages, 'me', 'f', AFTER).streak, 7);
});

test('during the changeover days a message still counts and stumps are not yet required', () => {
  const during = new Date(2026, 9, 19, 18).getTime();
  const status = friendStreakStatus([onDay(during, 'me', 0), onDay(during, 'f', 0)], 'me', 'f', during);
  assert.equal(status.streak, 1);
  assert.equal(status.stumpsNeeded, false);
});

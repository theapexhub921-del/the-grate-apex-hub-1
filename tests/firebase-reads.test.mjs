// The project is on Firebase's free plan (50,000 document reads a day for the
// whole app). These checks keep the fixes of 2026-10-18 in place:
//  - chats, groups and the bell are live listeners, not "read everything every
//    few seconds" loops;
//  - a group loads its NEWEST messages (limit() on an oldest-first order showed
//    a busy group's first 300 messages forever);
//  - the account doesn't rebuild on every presence write;
//  - every collection the app uses has a rule in firestore.rules.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { mergeDevices } from '../api/_push-logic.mjs';
import { todaysStreakKey } from '../src/data/friend-streaks.ts';
import { samePresenceAside } from '../src/lib/presence.ts';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (file) => readFileSync(join(ROOT, file), 'utf8');

test('an open chat listens instead of re-reading every few seconds', () => {
  const thread = read('src/components/chat/chat-thread.tsx');
  assert.doesNotMatch(thread, /setInterval\(/, 'chat-thread.tsx must not poll');
  assert.match(thread, /watchConversationMessages\(/);
  assert.match(thread, /watchGroupMessages\(/);
});

test('groups load their newest messages', () => {
  const groups = read('src/data/group-chat.ts');
  assert.match(groups, /orderBy\('createdAt', 'asc'\), limitToLast\(300\)/);
  assert.doesNotMatch(groups, /orderBy\('createdAt', 'asc'\), limit\(/);
});

test('the bell and the chats list are live, not polled from Firebase', () => {
  assert.match(read('src/data/account-notifications.ts'), /onSnapshot\(/);
  assert.doesNotMatch(read('src/data/account-notifications.ts'), /getDocs\(/);
  assert.match(read('src/data/community.ts'), /function myChatDocs[\s\S]*?onSnapshot\(/);
});

// 2026-10-24: the free daily reads ran out by mid-afternoon. The league load (the
// whole tier and everyone's XP) ran on every app open and every return to the app.
test('the league is loaded rarely: promotions come from the live account', () => {
  const watcher = read('src/components/league-promotion.tsx');
  assert.match(watcher, /savedLeague\(/);
  assert.doesNotMatch(watcher, /visibilitychange/, 'returning to the app must not load the league');
  assert.match(read('src/data/leagues.ts'), /LEAGUE_REUSE_MS/);
});

test('presence is written every few minutes, not every 45 seconds', () => {
  const presence = read('src/lib/presence.ts');
  const every = Number(/PRESENCE_EVERY_MS = (\d+) \* 60_000/.exec(presence)?.[1]);
  const online = Number(/ONLINE_WITHIN_MS = (\d+) \* 60_000/.exec(presence)?.[1]);
  assert.ok(every >= 3, 'presence at most every 3 minutes');
  assert.ok(online > every, 'someone still counts as online between two writes');
  assert.match(read('src/components/online-presence-sync.tsx'), /PRESENCE_EVERY_MS/);
});

test('the coin balance and read marks are not re-read on a timer', () => {
  for (const file of ['src/components/apex-coin-button.tsx', 'src/components/apex-coin-wallet-card.tsx']) {
    assert.doesNotMatch(read(file), /setInterval\(/, `${file} must not poll`);
    assert.doesNotMatch(read(file), /readApexCoinBalance\(/, `${file} reads the live account`);
  }
  assert.doesNotMatch(read('src/data/notifications.ts'), /setInterval\(\(\) => void refresh\(\), REMOTE_EVERY_MS\)/);
});

test('battles follow opponents only while they are on screen', () => {
  assert.match(read('src/components/social/battles-card.tsx'), /useFocusEffect\(useCallback\(\(\) => \{[\s\S]*?watchBattles\(/);
  assert.match(read('src/app/social/battle.tsx'), /useFocusEffect\(useCallback\(\(\) => \{[\s\S]*?watchBattles\(/);
});

test('a presence-only change keeps the same account', () => {
  const before = { username: 'ama', xp: 10, isOnline: true, lastSeen: 1, appActiveAt: 1 };
  assert.equal(samePresenceAside(before, { ...before, lastSeen: 2, appActiveAt: 2, isOnline: false }), true);
  assert.equal(samePresenceAside(before, { ...before, xp: 11 }), false);
  assert.equal(samePresenceAside(before, { ...before, hall: 'HB2' }), false);
});

test('the friend streak reloads only when today\'s part changes', () => {
  const now = Date.parse('2026-10-25T12:00:00');
  const at = (hour) => new Date(`2026-10-25T${String(hour).padStart(2, '0')}:00:00`).toISOString();
  const chat = [{ sender_id: 'me', created_at: at(9) }, { sender_id: 'you', created_at: at(10) }];
  const plain = todaysStreakKey(chat, 'me', now);
  // Ordinary messages don't count after the switch to stumps.
  assert.equal(todaysStreakKey([...chat, { sender_id: 'me', created_at: at(11) }], 'me', now), plain);
  const stumped = todaysStreakKey([...chat, { sender_id: 'me', created_at: at(11), share: { kind: 'stump' } }], 'me', now);
  assert.notEqual(stumped, plain);
});

test('push devices from both places are merged once each, newest place first', () => {
  const a = { endpoint: 'https://fcm.googleapis.com/a', keys: {} };
  const b = { endpoint: 'https://fcm.googleapis.com/b', keys: {} };
  assert.deepEqual(mergeDevices([a], [a, b]), [a, b]);
  assert.deepEqual(mergeDevices(undefined, [b]), [b]);
  assert.equal(mergeDevices(Array.from({ length: 8 }, (_, i) => ({ endpoint: `https://fcm.googleapis.com/${i}` }))).length, 5);
});

// Collections used by Table Conferences, which is hidden and not built on the
// rules yet (the owner will come back to it).
const KNOWN_WITHOUT_RULES = new Set(['calls/*/participants', 'calls/*/messages']);

function sources(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

test('every collection the app uses has a rule', () => {
  const rules = read('firestore.rules');
  const missing = [];
  for (const file of sources(join(ROOT, 'src'))) {
    for (const match of readFileSync(file, 'utf8').matchAll(/(?:collection|doc)\(db,\s*'([A-Za-z]+)'(?:,\s*[^,)]+,\s*'([A-Za-z]+)')?/g)) {
      const [, top, sub] = match;
      const key = sub ? `${top}/*/${sub}` : top;
      if (KNOWN_WITHOUT_RULES.has(key)) continue;
      const covered = sub
        ? new RegExp(`match /${top}/\\{[^}]+\\}/${sub}/`).test(rules) || new RegExp(`match /${top}/\\{[^}]+\\} \\{[\\s\\S]*?match /${sub}/`).test(rules)
        : new RegExp(`match /${top}/`).test(rules);
      if (!covered) missing.push(`${key} (${file.split(/src[\\/]/)[1]})`);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});

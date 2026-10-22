import assert from 'node:assert/strict';
import { test } from 'node:test';

import { battleStatus, battleWinner } from '../src/data/battles.ts';

const battle = (overrides = {}) => ({
  id: 'btest123',
  challengerId: 'challenger',
  challengerName: 'challenger',
  opponentId: 'opponent',
  opponentName: 'opponent',
  course: { kind: 'topic', id: 'topic', name: 'Topic' },
  seed: 'btest123',
  count: 10,
  createdAt: 0,
  challenger: null,
  opponent: null,
  declined: false,
  ...overrides,
});

test('a battle stays waiting until both players finish, then chooses the higher score', () => {
  const waiting = battle({ challenger: { score: 8, total: 10, seconds: 60 } });
  assert.equal(battleStatus(waiting, 'challenger'), 'waiting-for-them');
  assert.equal(battleStatus(waiting, 'opponent'), 'waiting-for-you');

  const completed = battle({ challenger: { score: 8, total: 10, seconds: 60 }, opponent: { score: 7, total: 10, seconds: 45 } });
  assert.equal(battleWinner(completed), 'challenger');
  assert.equal(battleStatus(completed, 'challenger'), 'won');
  assert.equal(battleStatus(completed, 'opponent'), 'lost');
});

test('a tied score uses total time, then records a draw', () => {
  assert.equal(battleWinner(battle({ challenger: { score: 8, total: 10, seconds: 55 }, opponent: { score: 8, total: 10, seconds: 56 } })), 'challenger');
  assert.equal(battleWinner(battle({ challenger: { score: 8, total: 10, seconds: 55 }, opponent: { score: 8, total: 10, seconds: 55 } })), 'draw');
});

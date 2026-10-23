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
  accepted: false,
  declined: false,
  ...overrides,
});

test('a challenge is a waiting room until the invited player accepts or declines', () => {
  const waiting = battle();
  assert.equal(battleStatus(waiting, 'challenger'), 'waiting-for-response');
  assert.equal(battleStatus(waiting, 'opponent'), 'incoming-challenge');
  const joined = battle({ accepted: true });
  assert.equal(battleStatus(joined, 'challenger'), 'waiting-for-you');
  assert.equal(battleStatus(joined, 'opponent'), 'waiting-for-you');
  assert.equal(battleStatus(battle({ declined: true }), 'challenger'), 'declined');
});

test('a battle stays waiting until both players finish, then chooses the higher score', () => {
  const waiting = battle({ accepted: true, challenger: { score: 8, total: 10, seconds: 60 } });
  assert.equal(battleStatus(waiting, 'challenger'), 'waiting-for-them');
  assert.equal(battleStatus(waiting, 'opponent'), 'waiting-for-you');

  const completed = battle({ accepted: true, challenger: { score: 8, total: 10, seconds: 60 }, opponent: { score: 7, total: 10, seconds: 45 } });
  assert.equal(battleWinner(completed), 'challenger');
  assert.equal(battleStatus(completed, 'challenger'), 'won');
  assert.equal(battleStatus(completed, 'opponent'), 'lost');
});

test('a tied score uses total time, then records a draw', () => {
  assert.equal(battleWinner(battle({ accepted: true, challenger: { score: 8, total: 10, seconds: 55 }, opponent: { score: 8, total: 10, seconds: 56 } })), 'challenger');
  assert.equal(battleWinner(battle({ accepted: true, challenger: { score: 8, total: 10, seconds: 55 }, opponent: { score: 8, total: 10, seconds: 55 } })), 'draw');
});

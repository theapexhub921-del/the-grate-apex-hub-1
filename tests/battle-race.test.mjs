// XP battles (owner, 2026-10-26): whole battles played against the real referee
// (server/battle-referee.mjs) with an in-memory database, so the rules hold end to end:
// +5 right, −1 wrong, 0 skip, most XP wins, level → first to finish everything,
// 5-minute invites, leaving finishes you, no question twice, nobody can fake a score.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
  COUNTS, decideWinner, IDLE_MS, INVITE_MS, pickQuestions, pointsFor, RIGHT_XP, tierFor, WIN_BONUS_XP, WRONG_XP,
} from '../api/_battle-rules.mjs';
import { handleBattle } from '../server/battle-referee.mjs';
import { BATTLE_RULES } from '../src/data/battle-race-rules.ts';

const read = (file) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
const BANK = read('public/battle-bank/hb2-biochemistry.json');
const COURSE = { kind: 'hb', id: 'hb2-biochemistry', name: 'Biochemistry', topicIds: ['fatty-acid-biosynthesis'], topicNames: ['Fatty Acid Biosynthesis'] };

function memoryStore() {
  const docs = new Map();
  let version = 0;
  const put = (path, data) => docs.set(path, { data: structuredClone(data), version: String(++version) });
  const conflict = () => Object.assign(new Error('precondition'), { code: 9 });
  const store = {
    docs,
    notes: [],
    async getRoom(id) { const d = docs.get(`rooms/${id}`); return d ? { room: structuredClone(d.data), version: d.version } : null; },
    async saveRoom(room, v) { if (docs.get(`rooms/${room.id}`)?.version !== v) throw conflict(); put(`rooms/${room.id}`, room); },
    async createRoom(room, key) { put(`keys/${room.id}`, key); put(`rooms/${room.id}`, room); },
    async getKey(id) { return docs.get(`keys/${id}`)?.data ?? null; },
    async getStats(uid) { const d = docs.get(`stats/${uid}`); return d ? { stats: structuredClone(d.data), version: d.version } : null; },
    async saveStats(uid, stats, v) { if ((docs.get(`stats/${uid}`)?.version ?? null) !== v) throw conflict(); put(`stats/${uid}`, stats); },
    async openRooms(uid) { return [...docs].filter(([k, d]) => k.startsWith('rooms/') && d.data.players.includes(uid) && d.data.open).map(([, d]) => structuredClone(d.data)); },
    async notify(to, note) { store.notes.push({ to, ...note }); },
  };
  return store;
}

function game(store = memoryStore()) {
  let clock = 1_800_000_000_000;
  const call = (uid, body) => handleBattle({ uid, body, store, loadBank: async (id) => (id === BANK.id ? BANK : null), now: () => clock });
  return { store, call, tick: (ms) => { clock += ms; }, now: () => clock };
}

async function started(g, options = {}) {
  const { room } = await g.call('amaAmaAma', { action: 'create', opponent: { uid: 'kofiKofiK', name: 'kofi' }, course: COURSE, count: 10, difficulty: 'mixed', ...options });
  await g.call('kofiKofiK', { action: 'accept', id: room.id });
  await g.call('amaAmaAma', { action: 'ready', id: room.id });
  const live = await g.call('kofiKofiK', { action: 'ready', id: room.id });
  g.tick(5_000);
  return live.room;
}

const keyOf = (g, id) => g.store.docs.get(`keys/${id}`).data.answers;

test('the app and the server agree on the rules', () => {
  assert.equal(BATTLE_RULES.right, RIGHT_XP);
  assert.equal(BATTLE_RULES.wrong, WRONG_XP);
  assert.equal(BATTLE_RULES.winBonus, WIN_BONUS_XP);
  assert.deepEqual(BATTLE_RULES.counts, COUNTS);
  assert.equal(BATTLE_RULES.inviteMinutes * 60_000, INVITE_MS);
});

test('fatty acid biosynthesis is in the biochemistry battle bank', () => {
  const index = read('public/battle-bank/index.json');
  const biochemistry = index.courses.find((course) => course.id === 'hb2-biochemistry');
  const topic = biochemistry.topics.find((item) => item.id === 'fatty-acid-biosynthesis');
  assert.ok(topic, 'Fatty Acid Biosynthesis is offered');
  assert.ok(topic.easy + topic.medium + topic.hard + topic.unrated >= 30, 'enough for a 30-question battle');
});

test('questions: the chosen topics only, never twice, the chosen difficulty first', () => {
  const { questions, answers, note } = pickQuestions(BANK, { topicIds: ['fatty-acid-biosynthesis'], difficulty: 'medium', count: 30, seed: 'x' });
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map((q) => q.id)).size, 30, 'no repeats');
  assert.equal(new Set(questions.map((q) => q.prompt)).size, 30, 'no repeated prompts');
  assert.ok(questions.every((q) => q.topic === 'fatty-acid-biosynthesis'));
  assert.ok(questions.every((q) => q.level === 'medium'));
  assert.equal(note, null);
  assert.ok(questions.every((q) => !('answer' in q)), 'the players never get the answers');
  answers.forEach((answer, i) => assert.ok(answer >= 0 && answer < questions[i].options.length));
  // Hard has only a few on this topic: topped up from the nearest level, and the room says so.
  const hard = pickQuestions(BANK, { topicIds: ['fatty-acid-biosynthesis'], difficulty: 'hard', count: 20, seed: 'y' });
  assert.equal(hard.questions.length, 20);
  assert.match(hard.note, /Hard/);
  assert.ok(hard.questions.filter((q) => q.level === 'hard').length >= 1);
  // The same seed gives both players the same battle.
  assert.deepEqual(pickQuestions(BANK, { topicIds: [], difficulty: 'mixed', count: 10, seed: 's' }), pickQuestions(BANK, { topicIds: [], difficulty: 'mixed', count: 10, seed: 's' }));
});

test('a whole battle: +5 right, −1 wrong, 0 skip; most XP wins and takes the bonus', async () => {
  const g = game();
  const room = await started(g);
  const key = keyOf(g, room.id);
  assert.equal(room.status, 'live');
  assert.equal(room.answers, null, 'answers are hidden while playing');
  const wrong = (i) => (key[i] + 1) % room.questions[i].options.length;
  for (let i = 0; i < 10; i++) {
    g.tick(1_000);
    // Ama: all right except question 3 wrong and 4 skipped. Kofi: right on the even ones, wrong on the odd ones.
    await g.call('amaAmaAma', { action: 'answer', id: room.id, index: i, pick: i === 3 ? wrong(i) : i === 4 ? 'skip' : key[i] });
    await g.call('kofiKofiK', { action: 'answer', id: room.id, index: i, pick: i % 2 ? wrong(i) : key[i] });
  }
  const { room: done } = await g.call('amaAmaAma', { action: 'get', id: room.id });
  assert.equal(done.status, 'done');
  assert.equal(done.sides.amaAmaAma.score, 8 * RIGHT_XP + WRONG_XP);
  assert.equal(done.sides.kofiKofiK.score, 5 * RIGHT_XP + 5 * WRONG_XP);
  assert.equal(done.sides.amaAmaAma.marks, 'rrrwsrrrrr');
  assert.equal(done.winner, 'amaAmaAma');
  assert.deepEqual(done.xp, { amaAmaAma: 39 + WIN_BONUS_XP, kofiKofiK: 20 });
  assert.deepEqual(done.answers, key, 'answers are shown once it is over');
  const stats = g.store.docs.get('stats/amaAmaAma').data;
  assert.equal(stats.wins, 1);
  assert.equal(stats.points, pointsFor('win', done));
  assert.equal(g.store.docs.get('stats/kofiKofiK').data.losses, 1);
});

test('level on XP: whoever answered everything first wins', async () => {
  const g = game();
  const room = await started(g);
  const key = keyOf(g, room.id);
  for (let i = 0; i < 10; i++) {
    g.tick(1_000);
    await g.call('kofiKofiK', { action: 'answer', id: room.id, index: i, pick: key[i] });
  }
  for (let i = 0; i < 10; i++) {
    g.tick(1_000);
    await g.call('amaAmaAma', { action: 'answer', id: room.id, index: i, pick: key[i] });
  }
  const { room: done } = await g.call('kofiKofiK', { action: 'get', id: room.id });
  assert.equal(done.sides.kofiKofiK.score, done.sides.amaAmaAma.score);
  assert.equal(done.winner, 'kofiKofiK');
});

test('scores cannot be faked: only the next question, only real options, no replays', async () => {
  const g = game();
  const room = await started(g);
  const key = keyOf(g, room.id);
  await assert.rejects(g.call('amaAmaAma', { action: 'answer', id: room.id, index: 5, pick: key[5] }), /already been answered/);
  await assert.rejects(g.call('amaAmaAma', { action: 'answer', id: room.id, index: 0, pick: 9 }), /Pick an option/);
  await g.call('amaAmaAma', { action: 'answer', id: room.id, index: 0, pick: key[0] });
  g.tick(1_000);
  await assert.rejects(g.call('amaAmaAma', { action: 'answer', id: room.id, index: 0, pick: key[0] }), /already been answered/);
  await assert.rejects(g.call('someoneElse', { action: 'answer', id: room.id, index: 0, pick: key[0] }), /could not be found/);
  const { room: now } = await g.call('amaAmaAma', { action: 'get', id: room.id });
  assert.equal(now.sides.amaAmaAma.score, RIGHT_XP);
  // Nothing about a score is taken from the request.
  await g.call('amaAmaAma', { action: 'answer', id: room.id, index: 1, pick: key[1], score: 999 });
  assert.equal((await g.call('amaAmaAma', { action: 'get', id: room.id })).room.sides.amaAmaAma.score, 2 * RIGHT_XP);
});

test('no answers before the countdown ends', async () => {
  const g = game();
  const { room } = await g.call('amaAmaAma', { action: 'create', opponent: { uid: 'kofiKofiK' }, course: COURSE, count: 10, difficulty: 'easy' });
  await g.call('kofiKofiK', { action: 'accept', id: room.id });
  await g.call('amaAmaAma', { action: 'ready', id: room.id });
  await g.call('kofiKofiK', { action: 'ready', id: room.id });
  await assert.rejects(g.call('amaAmaAma', { action: 'answer', id: room.id, index: 0, pick: 0 }), /countdown/);
});

test('a challenge expires after 5 minutes', async () => {
  const g = game();
  const { room } = await g.call('amaAmaAma', { action: 'create', opponent: { uid: 'kofiKofiK' }, course: COURSE, count: 20, difficulty: 'mixed' });
  assert.equal(g.store.notes.length, 1, 'the other player is told');
  g.tick(INVITE_MS + 1);
  await assert.rejects(g.call('kofiKofiK', { action: 'accept', id: room.id }), /expired/);
  assert.equal((await g.call('kofiKofiK', { action: 'get', id: room.id })).room.status, 'expired');
  assert.deepEqual((await g.call('kofiKofiK', { action: 'mine' })).rooms, []);
});

test('leaving mid-battle finishes you where you are; going quiet does too', async () => {
  const g = game();
  const room = await started(g);
  const key = keyOf(g, room.id);
  await g.call('amaAmaAma', { action: 'answer', id: room.id, index: 0, pick: key[0] });
  await g.call('amaAmaAma', { action: 'leave', id: room.id });
  for (let i = 0; i < 3; i++) {
    g.tick(1_000);
    await g.call('kofiKofiK', { action: 'answer', id: room.id, index: i, pick: key[i] });
  }
  g.tick(IDLE_MS + 1);
  const { room: done } = await g.call('kofiKofiK', { action: 'get', id: room.id });
  assert.equal(done.status, 'done');
  assert.equal(done.sides.amaAmaAma.left, true);
  assert.equal(done.sides.kofiKofiK.left, true);
  assert.equal(done.winner, 'kofiKofiK');
});

test('a rematch points the old room at the new one', async () => {
  const g = game();
  const room = await started(g);
  await g.call('amaAmaAma', { action: 'leave', id: room.id });
  await g.call('kofiKofiK', { action: 'leave', id: room.id });
  const { room: next } = await g.call('kofiKofiK', { action: 'create', opponent: { uid: 'amaAmaAma' }, course: COURSE, count: 10, difficulty: 'mixed', rematchOf: room.id });
  assert.equal((await g.call('amaAmaAma', { action: 'get', id: room.id })).room.rematch, next.id);
});

test('tiers climb with battle points', () => {
  assert.equal(tierFor(0).name, 'Bronze');
  assert.equal(tierFor(10).name, 'Silver');
  assert.equal(tierFor(24).next.needed, 1);
  assert.equal(tierFor(500).name, 'Apex');
  assert.equal(tierFor(500).next, null);
  assert.equal(pointsFor('win', { difficulty: 'hard', count: 30 }), 5);
  assert.equal(pointsFor('draw', { difficulty: 'easy', count: 10 }), 1);
  assert.equal(pointsFor('loss', { difficulty: 'hard', count: 30 }), 0);
});

test('a draw only when XP is level and nobody finished first', () => {
  const side = (score, completed, finishedAt) => ({ score, completed, finishedAt });
  assert.equal(decideWinner({ players: ['a', 'b'], sides: { a: side(10, true, 5), b: side(10, true, 5) } }), 'draw');
  assert.equal(decideWinner({ players: ['a', 'b'], sides: { a: side(10, false, 5), b: side(10, true, 9) } }), 'b');
  assert.equal(decideWinner({ players: ['a', 'b'], sides: { a: side(11, false, 5), b: side(10, true, 2) } }), 'a');
});

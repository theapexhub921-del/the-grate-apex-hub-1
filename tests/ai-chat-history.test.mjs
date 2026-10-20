// AI chat history (src/data/ai-chat-history.ts): every AI chat in the app is
// saved in the learner's tutorChats, so ids and saved turns must fit the
// deployed rules (id /^[a-z0-9_-]{1,80}$/, at most 100 turns, title ≤ 120).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { aiChatTitle, canContinue, kindOfChatId, lessonChatPrefix, MAX_SAVED_TURNS, newAiChatId, packTurns, unpackTurns } from '../src/data/ai-chat-history.ts';

const RULE_ID = /^[a-z0-9_-]{1,80}$/;

test('every kind of chat gets an id the rules accept, and is recognised again', () => {
  for (const kind of ['study', 'lesson', 'explain', 'voice']) {
    const id = newAiChatId(kind, 'Hb2:Anatomy/Cardiovascular System — L4 (Gross) with a very long lesson id indeed', 1_760_000_000_000, 0.5);
    assert.match(id, RULE_ID, id);
    assert.equal(kindOfChatId(id), kind);
  }
  assert.equal(kindOfChatId('tc_mgx1abc_k3j2'), 'study', 'Study chats saved before this change');
});

test('a lesson chat id starts with that lesson only', () => {
  const id = newAiChatId('lesson', 'fatty-acid-biosynthesis-l1');
  assert.ok(id.startsWith(lessonChatPrefix('fatty-acid-biosynthesis-l1')));
  assert.ok(!id.startsWith(lessonChatPrefix('fatty-acid-biosynthesis-l10')));
});

test('saved turns keep their context and stay within the rules', () => {
  const turns = Array.from({ length: 130 }, (_, i) => ({ role: i % 2 ? 'model' : 'user', text: `message ${i}` }));
  const item = { kind: 'question', prompt: 'Which enzyme commits fatty acid synthesis?', correct: 'Acetyl-CoA carboxylase', picked: 'Fatty acid synthase' };
  const stored = packTurns({ kind: 'explain', lessonId: 'fab-l1', lessonTitle: 'Fatty acid synthesis', item }, turns);
  assert.ok(stored.length <= 100);
  assert.equal(stored.length, MAX_SAVED_TURNS + 1);
  const back = unpackTurns(JSON.parse(JSON.stringify(stored)));
  assert.deepEqual(back.context, { kind: 'explain', lessonId: 'fab-l1', lessonTitle: 'Fatty acid synthesis', item });
  assert.equal(back.turns.at(-1).text, 'message 129', 'the newest messages are kept');
  assert.ok(back.turns.every((turn) => turn.role === 'user' || turn.role === 'model'));
});

test('older Study chats (no context note) still read', () => {
  const back = unpackTurns([{ role: 'user', text: 'Hi' }, { role: 'model', text: 'Hello' }, { role: 'oops' }, null]);
  assert.equal(back.context, null);
  assert.equal(back.turns.length, 2);
});

test('titles fit the rules and say what the chat was about', () => {
  const long = 'Explain '.repeat(40);
  assert.ok(aiChatTitle({ kind: 'study' }, [{ role: 'user', text: long }]).length <= 80);
  assert.equal(aiChatTitle({ kind: 'explain', item: { kind: 'card', prompt: 'What is the fossa ovalis?', correct: 'x' } }, [{ role: 'user', text: 'Explain this flashcard to me.' }]), 'What is the fossa ovalis?');
  assert.equal(aiChatTitle({ kind: 'voice' }, []), 'Voice tutor session');
  assert.equal(canContinue('voice'), false);
  assert.equal(canContinue('lesson'), true);
});

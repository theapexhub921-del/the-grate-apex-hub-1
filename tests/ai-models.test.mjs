// The AI keeps answering when a provider retires or overloads a model (api/_ai-models.mjs).
// Replays 2026-10-19: Groq said llama-3.3-70b-versatile "does not exist" and Gemini's
// model answered 503 "high demand", so every AI request failed.
import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

import { geminiCall, isModelGone, ModelCallError, openAiCompatibleCall, rankChatModels, resetModelMemory } from '../api/_ai-models.mjs';

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const GONE = { error: { message: 'The model `llama-3.3-70b-versatile` does not exist or you do not have access to it.', type: 'invalid_request_error', code: 'model_not_found' } };
const BUSY = { error: { code: 503, message: 'This model is currently experiencing high demand.', status: 'UNAVAILABLE' } };
const reply = (text) => ({ choices: [{ message: { content: text } }] });

// A fake service: `models` answer, anything else is "gone"; records which models were asked.
function fakeOpenAi(models, listed = models) {
  const asked = [];
  const impl = async (url, init) => {
    if (url.endsWith('/models')) return json(200, { data: listed.map((id) => ({ id, active: true })) });
    const model = JSON.parse(init.body).model;
    asked.push(model);
    return models.includes(model) ? json(200, reply(`answer from ${model}`)) : json(404, GONE);
  };
  return { impl, asked };
}

beforeEach(() => resetModelMemory());

test('a retired Groq model is replaced by one the key can use', async () => {
  const { impl, asked } = fakeOpenAi(['qwen/qwen3-32b', 'whisper-large-v3'], ['whisper-large-v3', 'qwen/qwen3-32b', 'llama-guard-4-12b']);
  const data = await openAiCompatibleCall({ key: 'k', configured: 'llama-3.3-70b-versatile', payload: { messages: [] }, timeoutMs: 5000, label: 'test', fetchImpl: impl });
  assert.equal(data.choices[0].message.content, 'answer from qwen/qwen3-32b');
  assert.ok(!asked.includes('whisper-large-v3'), 'never asks a speech model to chat');
  // The working model is remembered: the next request goes straight to it.
  asked.length = 0;
  await openAiCompatibleCall({ key: 'k', configured: 'llama-3.3-70b-versatile', payload: { messages: [] }, timeoutMs: 5000, label: 'test', fetchImpl: impl });
  assert.deepEqual(asked, ['qwen/qwen3-32b']);
});

test('a busy Groq hands over (429 means busy, not a retired model)', async () => {
  const impl = async () => json(429, { error: { message: 'Rate limit reached' } });
  await assert.rejects(
    openAiCompatibleCall({ key: 'k', payload: { messages: [] }, timeoutMs: 5000, label: 'test', fetchImpl: impl }),
    (problem) => problem instanceof ModelCallError && problem.status === 429,
  );
});

test('an overloaded Gemini model is followed by another Flash model', async () => {
  const asked = [];
  const impl = async (url) => {
    const model = decodeURIComponent(url.split('/models/')[1].split(':')[0]);
    asked.push(model);
    return asked.length === 1 ? json(503, BUSY) : json(200, { candidates: [{ content: { parts: [{ text: `from ${model}` }] } }] });
  };
  const data = await geminiCall({ key: 'k', configured: 'gemini-3.1-flash-lite', body: {}, timeoutMs: 5000, label: 'test', fetchImpl: impl });
  assert.equal(asked.length, 2);
  assert.notEqual(asked[0], asked[1]);
  assert.equal(data.candidates[0].content.parts[0].text, `from ${asked[1]}`);
});

test('a bad Gemini key is not retried on every model', async () => {
  let calls = 0;
  const impl = async () => {
    calls++;
    return json(400, { error: { message: 'API key not valid.' } });
  };
  await assert.rejects(geminiCall({ key: 'k', body: {}, timeoutMs: 5000, label: 'test', fetchImpl: impl }), ModelCallError);
  assert.equal(calls, 1);
});

test('model lists are ranked best chat model first', () => {
  assert.deepEqual(rankChatModels(['whisper-large-v3', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b', 'playai-tts']), ['openai/gpt-oss-120b', 'llama-3.1-8b-instant']);
  assert.ok(isModelGone(404, ''));
  assert.ok(isModelGone(400, 'The model `x` has been decommissioned'));
  assert.ok(!isModelGone(400, 'messages: too long'));
  assert.ok(!isModelGone(429, 'model_not_found'));
});

// Which AI model to ask, shared by api/ai.mjs (lesson AI) and api/chat.mjs (Apex AI).
//
// Providers retire models: on 2026-10-19 Groq dropped llama-3.3-70b-versatile and
// every request failed with "model does not exist", while Gemini's model was
// overloaded ("high demand"), so learners got no answer at all. So:
//  - OpenAI-compatible (Groq by default): try CHAT_MODEL, then the model that last
//    worked; if a model is gone, ask the service which models this key can use
//    (GET /models) and pick the best chat model from that list.
//  - Gemini: try GEMINI_MODEL, then other Flash models in turn when one is
//    overloaded, rate-limited, failing or gone.
// The model that worked is logged ("AI answered with …") so Vercel's logs show it.

const DEFAULT_BASE = 'https://api.groq.com/openai/v1';

// Best first. Patterns, so new versions of the same family still match.
const OPENAI_PREFERENCE = [/gpt-oss-120b/, /llama-4-maverick/, /kimi-k2/, /llama-3\.3-70b/, /qwen3/, /llama-4-scout/, /gpt-oss-20b/, /llama/];
// Listed by the service but not chat models.
const NOT_CHAT = /whisper|tts|guard|embed|orpheus|playai|transcri|audio|vision-preview|compound|allam/i;
const OPENAI_FALLBACKS = ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'];

export const GEMINI_FALLBACKS = ['gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'];

const LIST_TTL_MS = 60 * 60_000;
const lists = new Map(); // base -> { at, ids }
const working = new Map(); // base or 'gemini' -> model id that last answered
const gone = new Set(); // `${base}|${model}` the service said does not exist

export class ModelCallError extends Error {
  constructor(status, detail) {
    super(`status ${status}`);
    this.status = status;
    this.detail = detail;
  }
}

const unique = (list) => [...new Set(list.filter((item) => typeof item === 'string' && item.trim()))];

/** Chat models from a /models list, best first (pure: tested in tests/ai-models.test.mjs). */
export function rankChatModels(ids) {
  const usable = unique(ids).filter((id) => !NOT_CHAT.test(id));
  const score = (id) => {
    const at = OPENAI_PREFERENCE.findIndex((pattern) => pattern.test(id));
    return at === -1 ? OPENAI_PREFERENCE.length : at;
  };
  return usable.sort((a, b) => score(a) - score(b) || a.localeCompare(b));
}

/** True when the service's answer means "this model does not exist / was retired". */
export function isModelGone(status, detail) {
  if (status === 404) return true;
  return status === 400 && /model_not_found|decommission|does not exist|not supported|no longer|unknown model|invalid model/i.test(String(detail ?? ''));
}

async function listModels(base, key, fetchImpl) {
  const cached = lists.get(base);
  if (cached && Date.now() - cached.at < LIST_TTL_MS) return cached.ids;
  try {
    const response = await fetchImpl(`${base}/models`, { headers: { authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return cached?.ids ?? [];
    const data = await response.json();
    const ids = (Array.isArray(data?.data) ? data.data : []).filter((model) => model?.active !== false).map((model) => model?.id);
    const ranked = rankChatModels(ids);
    lists.set(base, { at: Date.now(), ids: ranked });
    return ranked;
  } catch {
    return cached?.ids ?? [];
  }
}

/**
 * POST {base}/chat/completions with the first model that exists.
 * `payload` is everything except `model`. Returns the parsed JSON reply.
 * Throws ModelCallError (status 429 = busy) when no model answers.
 */
export async function openAiCompatibleCall({ key, base = DEFAULT_BASE, configured, payload, timeoutMs, label, fetchImpl = fetch }) {
  base = base.replace(/\/+$/, '');
  const queue = unique([working.get(base), configured, ...OPENAI_FALLBACKS]).filter((model) => !gone.has(`${base}|${model}`));
  const tried = new Set();
  let listed = false;
  let last = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    let model = queue.find((id) => !tried.has(id));
    if (!model && !listed) {
      listed = true;
      queue.push(...(await listModels(base, key, fetchImpl)).filter((id) => !gone.has(`${base}|${id}`)));
      model = queue.find((id) => !tried.has(id));
    }
    if (!model) break;
    tried.add(model);
    const response = await fetchImpl(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ ...payload, model }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.ok) {
      if (working.get(base) !== model) console.log(`${label}: AI answered with ${model}`);
      working.set(base, model);
      return response.json();
    }
    const detail = await response.text().catch(() => '');
    console.error(`${label} error`, model, response.status, detail.slice(0, 300));
    last = new ModelCallError(response.status, detail);
    if (isModelGone(response.status, detail)) {
      gone.add(`${base}|${model}`);
      if (working.get(base) === model) working.delete(base);
      if (!listed) {
        listed = true;
        queue.push(...(await listModels(base, key, fetchImpl)).filter((id) => !gone.has(`${base}|${id}`)));
      }
      continue;
    }
    // JSON mode not supported by this model: the next model may support it.
    if (response.status === 400 && payload.response_format && /response_format|json/i.test(detail)) continue;
    throw last; // busy, bad key, outage: let the next provider try
  }
  throw last ?? new ModelCallError(404, 'no usable model');
}

/** Gemini's statuses worth trying another model for: gone, rate-limited, overloaded, failing. */
const GEMINI_RETRY = new Set([404, 429, 500, 503, 504]);

/**
 * POST …/models/{model}:generateContent, moving to another Flash model when one is
 * overloaded or gone. Returns the parsed JSON reply; throws ModelCallError otherwise.
 */
export async function geminiCall({ key, configured, body, timeoutMs, label, fetchImpl = fetch, maxModels = 4 }) {
  const models = unique([working.get('gemini'), configured, ...GEMINI_FALLBACKS]).filter((model) => !gone.has(`gemini|${model}`)).slice(0, maxModels);
  let last = null;
  for (const model of models) {
    const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.ok) {
      if (working.get('gemini') !== model) console.log(`${label}: AI answered with ${model}`);
      working.set('gemini', model);
      return response.json();
    }
    const detail = await response.text().catch(() => '');
    console.error(`${label} error`, model, response.status, detail.slice(0, 300));
    last = new ModelCallError(response.status, detail);
    if (response.status === 404) gone.add(`gemini|${model}`);
    if (!GEMINI_RETRY.has(response.status)) throw last;
    if (working.get('gemini') === model) working.delete('gemini');
  }
  throw last ?? new ModelCallError(404, 'no usable model');
}

/** For tests: forget what was learned about models. */
export function resetModelMemory() {
  lists.clear();
  working.clear();
  gone.clear();
}

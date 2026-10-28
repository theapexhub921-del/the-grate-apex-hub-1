// Memory hooks (2026-10-28): the learner's own mnemonic or picture for a
// concept, shown again whenever that concept comes up. Pure: merging the copy
// on this device with the account's copy (tests/learning-boosts.test.mjs).

/** concept key → the hook and when it was last changed ('' = removed). */
export type HookMap = Record<string, { text: string; at: number }>;

export const HOOK_MAX_LENGTH = 280;
export const HOOK_LIMIT = 600;

export function cleanHooks(value: unknown): HookMap {
  if (!value || typeof value !== 'object') return {};
  const out: HookMap = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const item = entry as { text?: unknown; at?: unknown } | null;
    if (typeof item?.text === 'string' && typeof item.at === 'number') out[key] = { text: item.text.slice(0, HOOK_MAX_LENGTH), at: item.at };
  }
  return out;
}

/** Both copies together: for each concept the newer change wins (a removal too). Oldest dropped past the limit. */
export function mergeHooks(a: HookMap, b: HookMap): HookMap {
  const out: HookMap = { ...a };
  for (const [key, entry] of Object.entries(b)) if (!out[key] || entry.at > out[key].at) out[key] = entry;
  const entries = Object.entries(out).sort((x, y) => y[1].at - x[1].at).slice(0, HOOK_LIMIT);
  return Object.fromEntries(entries);
}

/** The text shared to the feed. */
export const hookPostText = (concept: string, hook: string) => `Memory hook for ${concept}: ${hook.trim()}`;

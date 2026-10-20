// Small per-account records kept the same on every device the learner signs in
// to (owner, 2026-10-19): watched stories, viewed posts, which alerts were already
// shown, lessons in progress, flashcard schedules and pre/post tests.
//
// They live on the learner's own private document, progress/{uid}, as
// `synced.<name>` (owner-only in firestore.rules: no rules change needed). The
// document is read once per sign-in (one read), and changes are written a few
// seconds after they happen, each name replaced whole. Every module merges the
// account's copy with its device copy when it loads, so nothing is lost when
// the same account is used on two devices.
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

let cache: { uid: string; data: Promise<Record<string, unknown>> } | null = null;

async function currentUid() {
  await auth.authStateReady();
  return auth.currentUser?.uid ?? null;
}

/** The account's copy of one synced record (undefined when signed out, offline or never saved). */
export async function syncedValue<T>(name: string): Promise<T | undefined> {
  const uid = await currentUid();
  if (!uid) return undefined;
  if (cache?.uid !== uid) {
    cache = {
      uid,
      data: getDoc(doc(db, 'progress', uid))
        .then((snap) => (snap.data()?.synced ?? {}) as Record<string, unknown>)
        .catch(() => ({})),
    };
  }
  const data = await cache.data;
  return data[name] as T | undefined;
}

const pending = new Map<string, unknown>();
let timer: ReturnType<typeof setTimeout> | null = null;

/** Saves one synced record to the account (a few seconds later, together with any others). */
export function saveSynced(name: string, value: unknown) {
  pending.set(name, value);
  // The copy read at sign-in follows what this device saves.
  void cache?.data.then((data) => { data[name] = value; });
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void flush(), 3000);
}

async function flush() {
  timer = null;
  const uid = await currentUid();
  if (!uid || !pending.size) return;
  const entries = [...pending.entries()];
  pending.clear();
  const values = JSON.parse(JSON.stringify(Object.fromEntries(entries))) as Record<string, unknown>;
  try {
    // mergeFields: each record is replaced whole (so removals stick); the rest of the document is untouched.
    await setDoc(doc(db, 'progress', uid), { synced: values }, { mergeFields: entries.map(([name]) => `synced.${name}`) });
  } catch {
    // Offline: put them back for the next change or the next start.
    for (const [name, value] of entries) if (!pending.has(name)) pending.set(name, value);
  }
}

/** Both lists of ids together, without repeats, the newest last, at most `limit`. */
export function unionIds(local: readonly string[], remote: readonly unknown[] | undefined, limit: number): string[] {
  const out = new Set<string>();
  for (const id of remote ?? []) if (typeof id === 'string') out.add(id);
  for (const id of local) out.add(id);
  return [...out].slice(-limit);
}

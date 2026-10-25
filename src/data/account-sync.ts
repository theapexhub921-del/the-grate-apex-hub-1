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
import { deleteField, doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

// The whole progress document as read at sign-in; synced records are under `synced`.
let cache: { uid: string; data: Promise<Record<string, unknown>> } | null = null;

async function currentUid() {
  await auth.authStateReady();
  return auth.currentUser?.uid ?? null;
}

async function progressDocument(): Promise<Record<string, unknown> | null> {
  const uid = await currentUid();
  if (!uid) return null;
  if (cache?.uid !== uid) {
    cache = {
      uid,
      data: getDoc(doc(db, 'progress', uid))
        .then((snap) => ({ ...(snap.data() ?? {}), synced: { ...((snap.data()?.synced ?? {}) as Record<string, unknown>) } }))
        .catch(() => ({ synced: {} })),
    };
  }
  return cache.data;
}

/** The account's copy of one synced record (undefined when signed out, offline or never saved). */
export async function syncedValue<T>(name: string): Promise<T | undefined> {
  const data = await progressDocument();
  return (data?.synced as Record<string, unknown> | undefined)?.[name] as T | undefined;
}

/** A top-level field of progress/{uid} from the same sign-in read (e.g. the original app's examDate). */
export async function progressField<T>(name: string): Promise<T | undefined> {
  const data = await progressDocument();
  return data?.[name] as T | undefined;
}

/** Saves a top-level field of progress/{uid} now (null removes it). */
export async function saveProgressField(name: string, value: unknown) {
  const uid = await currentUid();
  if (!uid) return;
  void cache?.data.then((data) => { if (value === null) delete data[name]; else data[name] = value; });
  await setDoc(doc(db, 'progress', uid), { [name]: value === null ? deleteField() : value }, { merge: true });
}

const pending = new Map<string, unknown>();
let timer: ReturnType<typeof setTimeout> | null = null;

/** Saves one synced record to the account (a few seconds later, together with any others). */
export function saveSynced(name: string, value: unknown) {
  pending.set(name, value);
  // The copy read at sign-in follows what this device saves.
  void cache?.data.then((data) => { (data.synced as Record<string, unknown>)[name] = value; });
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

// Memory hooks (2026-10-28): the learner's own mnemonics, one per concept, kept
// on the device and on the account (`synced.hooks` on progress/{uid}, so they
// follow the learner to other devices; no rules change). Rules in
// data/learning/memory-hook-rules.ts.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { saveSynced, syncedValue } from '@/data/account-sync';
import { cleanHooks, HOOK_MAX_LENGTH, type HookMap, mergeHooks } from '@/data/learning/memory-hook-rules';
import { auth } from '@/lib/firebase';

const KEY = 'grateapex_memory_hooks';
let hooks: HookMap = {};
let loadedFor: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

async function load() {
  const uid = auth.currentUser?.uid ?? 'local';
  if (loadedFor === uid) return;
  loadedFor = uid;
  hooks = {}; // another account's hooks never carry over
  const local = cleanHooks(JSON.parse((await AsyncStorage.getItem(`${KEY}:${uid}`).catch(() => null)) ?? 'null'));
  hooks = mergeHooks(hooks, local);
  emit();
  if (uid === 'local') return;
  const remote = cleanHooks(await syncedValue<unknown>('hooks').catch(() => undefined));
  const merged = mergeHooks(hooks, remote);
  hooks = merged;
  emit();
  if (JSON.stringify(merged) !== JSON.stringify(remote)) saveSynced('hooks', merged);
}

/** Saves (or, with empty text, removes) the learner's hook for a concept. */
export function saveMemoryHook(conceptKey: string, text: string) {
  const uid = auth.currentUser?.uid ?? 'local';
  hooks = mergeHooks(hooks, { [conceptKey]: { text: text.trim().slice(0, HOOK_MAX_LENGTH), at: Date.now() } });
  emit();
  void AsyncStorage.setItem(`${KEY}:${uid}`, JSON.stringify(hooks)).catch(() => undefined);
  if (uid !== 'local') saveSynced('hooks', hooks);
}

let watching = false;
const subscribe = (listener: () => void) => {
  if (!watching) {
    watching = true;
    auth.onAuthStateChanged(() => void load());
  }
  void load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The learner's hook for one concept ('' when there is none). */
export function useMemoryHook(conceptKey: string | undefined): string {
  const map = useSyncExternalStore(subscribe, () => hooks, () => hooks);
  return conceptKey ? map[conceptKey]?.text ?? '' : '';
}

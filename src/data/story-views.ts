// Which stories I have watched, like Instagram and WhatsApp statuses: a watched
// person's ring turns grey and moves behind the unwatched. Kept on the device and
// on the account (data/account-sync.ts), so every device knows.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { saveSynced, syncedValue, unionIds } from '@/data/account-sync';

const KEY = 'grateapex_seen_stories';
let seen: ReadonlySet<string> = new Set();
let loaded = false;
const listeners = new Set<() => void>();

async function load() {
  if (loaded) return;
  loaded = true;
  try {
    const saved = JSON.parse((await AsyncStorage.getItem(KEY)) ?? '[]') as string[];
    seen = new Set(saved);
    listeners.forEach((listener) => listener());
  } catch {
    // nothing saved yet
  }
  // Stories watched on my other devices.
  const remote = await syncedValue<string[]>('seenStories').catch(() => undefined);
  const merged = unionIds([...seen], remote, 400);
  if (merged.length !== seen.size) {
    seen = new Set(merged);
    listeners.forEach((listener) => listener());
    void AsyncStorage.setItem(KEY, JSON.stringify(merged)).catch(() => {});
  }
  if (merged.length !== (remote?.length ?? 0)) saveSynced('seenStories', merged);
}

export function markStorySeen(id: string) {
  if (seen.has(id)) return;
  // Stories last 24 hours, so a few hundred ids are plenty.
  const next = [...seen, id].slice(-400);
  seen = new Set(next);
  listeners.forEach((listener) => listener());
  void AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  saveSynced('seenStories', next);
}

export function useSeenStories(): ReadonlySet<string> {
  return useSyncExternalStore((listener) => { void load(); listeners.add(listener); return () => { listeners.delete(listener); }; }, () => seen, () => seen);
}

// Pin, archive and mute chats, like WhatsApp (owner, 2026-10-26). Personal: kept on
// this device and on the learner's own account (account-sync `synced.chatList`), so
// they are the same on every device and nobody else sees them. Ids are chat ids
// (two uids joined with "_") and group ids.
//   pinned   — at the top of the chats list, at most PIN_LIMIT
//   archived — out of the main list, under "Archived"; a new message does not bring it back
//   muted    — no bell entry, device alert or toast until the given time
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { saveSynced, syncedValue } from '@/data/account-sync';
import { auth } from '@/lib/firebase';

export type ChatListPrefs = { pinned: string[]; archived: string[]; muted: Record<string, number>; updatedAt: number };

export const PIN_LIMIT = 3;
/** "Always" is stored as a time far in the future. */
export const MUTE_ALWAYS = 8_640_000_000_000_000;
export const MUTE_CHOICES = [
  { label: '8 hours', ms: 8 * 3_600_000 },
  { label: '1 week', ms: 7 * 86_400_000 },
  { label: 'Always', ms: Infinity },
] as const;

const KEY = 'grateapex_chat_list';
const EMPTY: ChatListPrefs = { pinned: [], archived: [], muted: {}, updatedAt: 0 };
let prefs: ChatListPrefs = EMPTY;
let loadedFor: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function clean(value: unknown): ChatListPrefs | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<ChatListPrefs>;
  const ids = (list: unknown) => (Array.isArray(list) ? list.filter((id): id is string => typeof id === 'string').slice(0, 500) : []);
  const muted: Record<string, number> = {};
  for (const [id, until] of Object.entries(v.muted && typeof v.muted === 'object' ? v.muted : {})) if (typeof until === 'number') muted[id] = until;
  return { pinned: ids(v.pinned).slice(0, PIN_LIMIT), archived: ids(v.archived), muted, updatedAt: Number(v.updatedAt) || 0 };
}

async function load() {
  const uid = auth.currentUser?.uid ?? null;
  if (!uid || loadedFor === uid) return;
  loadedFor = uid;
  const local = clean(JSON.parse((await AsyncStorage.getItem(`${KEY}:${uid}`).catch(() => null)) ?? 'null'));
  if (local && auth.currentUser?.uid === uid) { prefs = local; emit(); }
  const remote = clean(await syncedValue<unknown>('chatList').catch(() => undefined));
  // The newer copy wins (they were changed on another device).
  if (remote && auth.currentUser?.uid === uid && remote.updatedAt > prefs.updatedAt) { prefs = remote; emit(); }
}

function change(next: Omit<ChatListPrefs, 'updatedAt'>) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const now = Date.now();
  // Mutes that have run out are dropped.
  const muted = Object.fromEntries(Object.entries(next.muted).filter(([, until]) => until > now));
  prefs = { ...next, muted, updatedAt: now };
  emit();
  void AsyncStorage.setItem(`${KEY}:${uid}`, JSON.stringify(prefs)).catch(() => {});
  saveSynced('chatList', prefs);
}

let watching = false;
function watchAccount() {
  if (watching) return;
  watching = true;
  auth.onAuthStateChanged((user) => {
    if (user) { void load(); return; }
    loadedFor = null;
    prefs = EMPTY;
    emit();
  });
}

export function useChatListPrefs(): ChatListPrefs {
  return useSyncExternalStore((listener) => { watchAccount(); void load(); listeners.add(listener); return () => { listeners.delete(listener); }; }, () => prefs, () => prefs);
}

/** The current choices (for code outside React, e.g. notifications). */
export async function chatListPrefs(): Promise<ChatListPrefs> {
  watchAccount();
  await load();
  return prefs;
}

/** Pins or unpins a chat. Returns false when PIN_LIMIT chats are already pinned. */
export function togglePinnedChat(id: string): boolean {
  if (prefs.pinned.includes(id)) {
    change({ ...prefs, pinned: prefs.pinned.filter((item) => item !== id) });
    return true;
  }
  if (prefs.pinned.length >= PIN_LIMIT) return false;
  // Pinning brings an archived chat back to the main list.
  change({ ...prefs, pinned: [id, ...prefs.pinned], archived: prefs.archived.filter((item) => item !== id) });
  return true;
}

export function toggleArchivedChat(id: string) {
  if (prefs.archived.includes(id)) change({ ...prefs, archived: prefs.archived.filter((item) => item !== id) });
  else change({ ...prefs, archived: [id, ...prefs.archived], pinned: prefs.pinned.filter((item) => item !== id) });
}

/** Mutes a chat for `ms` milliseconds (Infinity: always), or unmutes it (null). */
export function muteChat(id: string, ms: number | null) {
  const muted = { ...prefs.muted };
  if (ms === null) delete muted[id];
  else muted[id] = Number.isFinite(ms) ? Date.now() + ms : MUTE_ALWAYS;
  change({ ...prefs, muted });
}

/** Called whenever the choices change (the bell drops a newly muted chat at once). */
export function onChatListPrefsChanged(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export const isChatMuted = (p: ChatListPrefs, id: string, now = Date.now()) => (p.muted[id] ?? 0) > now;

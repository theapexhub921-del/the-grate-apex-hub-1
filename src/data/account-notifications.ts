// Notifications written to my account by other learners (both apps write them):
// users/{uid}/notifications = { type, from, fromName, text?, read, createdAt }.
// like · comment · reply · reshare · follow · message · support. Shown in the
// bell (and as device alerts); follows come with a Follow back button. Read
// marks are saved on the account (the rules let me change only `read`).
import type { Href } from 'expo-router';
import { collection, doc, limit, onSnapshot, orderBy, query, type QueryDocumentSnapshot, type Unsubscribe, updateDoc } from 'firebase/firestore';
import { useSyncExternalStore } from 'react';

import type { AppNotification } from '@/data/notifications';
import { auth, db } from '@/lib/firebase';

export type AccountNotification = AppNotification & { kind: string; from: string; fromName: string | null; read: boolean; docId: string };

let items: AccountNotification[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

const TITLES: Record<string, (name: string) => string> = {
  follow: (name) => `${name} started following you`,
  like: (name) => `${name} liked your post`,
  comment: (name) => `${name} commented on your post`,
  reply: (name) => `${name} replied to you`,
  reshare: (name) => `${name} reposted your post`,
  message: (name) => `New message from ${name}`,
  battle: (name) => `${name} challenged you to a battle`,
  support: () => 'Reply from GrAte Apex Hub support',
};

const millis = (value: unknown) => (typeof value === 'number' ? value : (value as { toMillis?: () => number } | null)?.toMillis?.() ?? 0);

function apply(docs: readonly QueryDocumentSnapshot[]) {
  const next: AccountNotification[] = docs.map((item) => {
    const d = item.data();
    const kind = String(d.type ?? '');
    const name = d.fromName ? `@${d.fromName}` : 'Someone';
    return {
      id: `acct:${item.id}`,
      docId: item.id,
      kind,
      from: String(d.from ?? ''),
      fromName: (d.fromName as string) ?? null,
      read: d.read === true,
      group: 'updates',
      title: (TITLES[kind] ?? (() => `${name} sent you a notification`))(name),
      body: kind === 'follow' ? 'Follow back to become friends — then you can message and battle.' : String(d.text ?? ''),
      at: millis(d.createdAt),
      href: (kind === 'battle' && typeof d.battleId === 'string'
        ? `/social/battle?id=${encodeURIComponent(d.battleId)}`
        : kind === 'message'
          ? '/social/messages'
          : kind === 'follow'
            ? `/social/person?user=${encodeURIComponent(String(d.from ?? ''))}`
            : '/') as Href,
      icon: kind === 'battle' ? 'challenge' : kind === 'follow' ? 'profile' : kind === 'like' ? 'heart' : kind === 'reshare' ? 'repost' : kind === 'message' ? 'comment' : 'comment',
      tone: kind === 'battle' ? 'gold' : kind === 'follow' ? 'gold' : 'primary',
    };
  });
  if (JSON.stringify(next.map((n) => [n.id, n.read])) !== JSON.stringify(items.map((n) => [n.id, n.read]))) {
    items = next;
    notify();
  }
}

/** Marks notifications read on the account. */
export async function markAccountNotificationsRead(ids: readonly string[]) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const targets = items.filter((item) => ids.includes(item.id) && !item.read);
  if (!targets.length) return;
  items = items.map((item) => (targets.includes(item) ? { ...item, read: true } : item));
  notify();
  await Promise.all(targets.map((item) => updateDoc(doc(db, 'users', uid, 'notifications', item.docId), { read: true }).catch(() => {})));
}

// Live: one listener on my newest 40 notifications, so Firebase sends only new
// ones (reading all 40 every 30 seconds used a lot of the free plan's reads).
let watching: string | null = null;
let stop: Unsubscribe | null = null;
let retry: ReturnType<typeof setTimeout> | null = null;

function watch(uid: string | null) {
  if (uid === watching) return;
  stop?.();
  stop = null;
  if (retry) { clearTimeout(retry); retry = null; }
  watching = uid;
  if (!uid) {
    if (items.length) { items = []; notify(); }
    return;
  }
  stop = onSnapshot(
    query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc'), limit(40)),
    (snap) => apply(snap.docs),
    () => {
      // Offline or signing out: keep the last list and try again shortly.
      if (watching !== uid) return;
      stop = null;
      watching = null;
      retry = setTimeout(() => watch(auth.currentUser?.uid ?? null), 30_000);
    }
  );
}

let started = false;
function start() {
  if (started) return;
  started = true;
  auth.onAuthStateChanged((user) => watch(user?.uid ?? null));
  watch(auth.currentUser?.uid ?? null);
}

export function useAccountNotifications(): AccountNotification[] {
  return useSyncExternalStore((listener) => { start(); listeners.add(listener); return () => { listeners.delete(listener); }; }, () => items, () => items);
}

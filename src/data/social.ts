import type { Href } from 'expo-router';
import { useEffect, useSyncExternalStore } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { subscribeToLearningAuthChanges } from '@/data/learning-sync';
import type { AppNotification } from '@/data/notifications';
import { auth, db } from '@/lib/firebase';

export type Relationship = 'none' | 'friends' | 'outgoing' | 'incoming';

export type SocialPerson = {
  userId: string;
  friendshipId: string | null;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  relationship: Relationship;
  totalXp: number | null;
  weeklyXp: number | null;
  streak: number | null;
  since: number | null;
  isOnline: boolean;
};

export type SocialRecommendation = SocialPerson & {
  sameClass: boolean;
  sharedConnections: number;
};

export type SocialActivity = {
  id: string;
  userId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  type: string;
  eventType?: 'lesson' | 'topic' | 'apex' | string;
  name: string;
  at: number;
  title: string;
  subtitle: string;
  xpEarned: number;
  occurredAt: number;
  topicId?: string;
  lessonId?: string;
};

export type FriendActivity = SocialActivity;

export type SocialNotification = {
  id: string;
  type: string;
  actorName: string;
  actorAvatarUrl: string | null;
  readAt: number | null;
  createdAt: number;
  title: string;
  body: string;
  href: Href;
};

type State = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  userId: string | null;
  username: string | null;
  shareActivity: boolean;
  people: SocialPerson[];
  activity: SocialActivity[];
  activityError: string | null;
  notifications: SocialNotification[];
};

const EMPTY: State = {
  status: 'idle',
  error: null,
  userId: null,
  username: null,
  shareActivity: true,
  people: [],
  activity: [],
  activityError: null,
  notifications: [],
};

let state: State = EMPTY;
const listeners = new Set<() => void>();

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function personName(
  person: { username?: string | null; displayName?: string | null } | null | undefined
): string {
  if (!person) return 'Learner';
  return person.displayName?.trim() || person.username?.trim() || 'Learner';
}

async function loadSocial(userId: string) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.data() || {};

    const followsQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      limit(100)
    );
    const followsSnap = await getDocs(followsQuery);

    const people: SocialPerson[] = followsSnap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        userId: d.followingId || docSnap.id,
        friendshipId: docSnap.id,
        username: d.username || null,
        displayName: d.displayName || d.username || null,
        avatarUrl: d.avatarUrl || null,
        relationship: 'friends',
        totalXp: Number(d.totalXp || 0),
        weeklyXp: Number(d.weeklyXp || 0),
        streak: Number(d.streak || 0),
        since: d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now(),
        isOnline: Boolean(d.isOnline),
      };
    });

    setState({
      status: 'ready',
      error: null,
      username: userData.username || null,
      shareActivity: userData.share_activity !== false,
      people,
      activity: [],
      notifications: [],
    });
  } catch (err: any) {
    setState({
      status: 'ready',
      error: null,
    });
  }
}

export async function refreshSocial() {
  if (!state.userId) return;
  await loadSocial(state.userId);
}

export async function refreshFriendPresence() {}

function startFor(userId: string | null) {
  if (userId === state.userId) return;
  state = { ...EMPTY, userId };
  listeners.forEach((listener) => listener());
  if (!userId) return;

  setState({ status: 'loading' });
  void loadSocial(userId);
}

let started = false;
function ensureStarted() {
  if (started) return;
  started = true;
  subscribeToLearningAuthChanges((userId) => startFor(userId));
  startFor(auth.currentUser?.uid ?? null);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSocial(): State {
  useEffect(ensureStarted, []);
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function useSocialUsername(): string | null {
  const social = useSocial();
  return social.username;
}

export function useFriendList(): SocialPerson[] {
  const social = useSocial();
  return social.people;
}

export async function sendFriendRequest(targetUserId: string) {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) throw new Error('Sign in to add friends.');

  const followId = `${currentUid}_${targetUserId}`;
  await setDoc(doc(db, 'follows', followId), {
    followerId: currentUid,
    followingId: targetUserId,
    createdAt: serverTimestamp(),
  });
  await refreshSocial();
}

export async function respondToFriendRequest(friendshipId: string, accept: boolean) {
  if (accept) {
    await setDoc(doc(db, 'follows', friendshipId), { accepted: true }, { merge: true });
  }
  await refreshSocial();
}

export async function removeFriendship(friendshipId: string) {
  await setDoc(doc(db, 'follows', friendshipId), { status: 'removed' }, { merge: true });
  await refreshSocial();
}

export async function setUsername(username: string) {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) throw new Error('Sign in to set username.');
  const trimmed = username.trim().toLowerCase();

  await setDoc(doc(db, 'users', currentUid), { username: trimmed }, { merge: true });
  await setDoc(doc(db, 'usernames', trimmed), { userId: currentUid }, { merge: true });
  setState({ username: trimmed });
}

export async function setShareActivity(share: boolean) {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;
  await setDoc(doc(db, 'users', currentUid), { share_activity: share }, { merge: true });
  setState({ shareActivity: share });
}

export async function searchLearners(searchQuery: string): Promise<SocialPerson[]> {
  const term = searchQuery.trim().toLowerCase();
  if (term.length < 2) return [];

  try {
    const q = query(collection(db, 'users'), limit(20));
    const snap = await getDocs(q);

    return snap.docs
      .filter((d) => {
        const u = d.data();
        const username = String(u.username || '').toLowerCase();
        return username.includes(term);
      })
      .map((d) => {
        const u = d.data();
        return {
          userId: d.id,
          friendshipId: null,
          username: u.username || null,
          displayName: u.username || 'Learner',
          avatarUrl: u.avatar_url || null,
          relationship: 'none',
          totalXp: Number(u.xp || 0),
          weeklyXp: 0,
          streak: 0,
          since: null,
          isOnline: false,
        };
      });
  } catch {
    return [];
  }
}

export async function getRecommendedFriends(): Promise<SocialRecommendation[]> {
  return [];
}

export function toAppNotification(n: SocialNotification): AppNotification {
  return {
    id: n.id,
    group: 'updates',
    title: n.title,
    body: n.body,
    at: n.createdAt,
    href: n.href,
    icon: 'bell',
    tone: 'primary',
  };
}

export async function markNotificationRead(id: string) {}
export async function markAllNotificationsRead() {}
export function markSocialNotificationsRead(ids: string[]) {}
export function readSocialNotificationIds(records?: any): string[] {
  return [];
}
export function socialAppNotifications(records?: any): AppNotification[] {
  return [];
}

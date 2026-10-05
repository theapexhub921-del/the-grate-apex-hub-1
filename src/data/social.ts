// Social data — real friends, requests, search and social notifications,
// backed by Supabase (supabase/migrations/20261005000000_social.sql).
//
// Every call goes through a SECURITY DEFINER function that identifies the
// learner with auth.uid(), so the client never sends its own user ID and
// only public fields (username, name, avatar, XP figures) come back.
// One shared store: it loads on first use, refreshes on realtime changes
// (friend requests / notifications), and clears on sign-out so the next
// learner on the same device never sees someone else's friends.
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Href } from 'expo-router';
import { useEffect, useSyncExternalStore } from 'react';

import { subscribeToLearningAuthChanges } from '@/data/learning-sync';
import type { AppNotification } from '@/data/notifications';
import { supabase } from '@/lib/supabase';

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
};

export type SocialNotification = {
  id: string;
  type: 'friend_request' | 'friend_accepted';
  actorName: string;
  actorAvatarUrl: string | null;
  readAt: number | null;
  createdAt: number;
};

type State = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  userId: string | null;
  username: string | null;
  people: SocialPerson[];
  notifications: SocialNotification[];
  error: string | null;
};

const EMPTY: State = { status: 'idle', userId: null, username: null, people: [], notifications: [], error: null };
let state: State = EMPTY;
const listeners = new Set<() => void>();
let channel: RealtimeChannel | null = null;
let loading: Promise<void> | null = null;

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

// ── Names and messages ──────────────────────────────────────────────

export function personName(person: Pick<SocialPerson, 'displayName' | 'username'>) {
  return person.displayName?.trim() || (person.username ? `@${person.username}` : 'GRATEAPEX learner');
}

const MESSAGES: Record<string, string> = {
  username_taken: 'That username is already taken — try another.',
  invalid_username: 'Use 3–20 lowercase letters, numbers or underscores.',
  invalid_friend: 'That learner could not be found.',
  request_not_found: 'That request is no longer available.',
};

export function friendlySocialError(error: unknown) {
  const message = error instanceof Error ? error.message : typeof error === 'object' && error && 'message' in error ? String((error as { message: unknown }).message) : '';
  for (const [code, text] of Object.entries(MESSAGES)) if (message.includes(code)) return text;
  if (/fetch|network|Failed to/i.test(message)) return 'Could not reach GRATEAPEX. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

function report(operation: string, error: unknown) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(`Social: ${operation} failed`, error);
}

// ── Rows from the database functions ────────────────────────────────

type PersonRow = {
  user_id: string;
  friendship_id: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  relationship: Relationship;
  total_xp?: number | null;
  weekly_xp?: number | null;
  current_streak?: number | null;
  since?: string | null;
};

type NotificationRow = {
  id: string;
  type: SocialNotification['type'];
  actor_username: string | null;
  actor_display_name: string | null;
  actor_avatar_url: string | null;
  read_at: string | null;
  created_at: string;
};

function toPerson(row: PersonRow): SocialPerson {
  return {
    userId: row.user_id,
    friendshipId: row.friendship_id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    relationship: row.relationship,
    totalXp: row.total_xp ?? null,
    weeklyXp: row.weekly_xp ?? null,
    streak: row.current_streak ?? null,
    since: row.since ? Date.parse(row.since) : null,
  };
}

function toNotification(row: NotificationRow): SocialNotification {
  return {
    id: row.id,
    type: row.type,
    actorName: personName({ displayName: row.actor_display_name, username: row.actor_username }),
    actorAvatarUrl: row.actor_avatar_url,
    readAt: row.read_at ? Date.parse(row.read_at) : null,
    createdAt: Date.parse(row.created_at),
  };
}

// ── Loading ─────────────────────────────────────────────────────────

async function load(userId: string) {
  const [friends, notes, profile] = await Promise.all([
    supabase.rpc('grateapex_list_friends'),
    supabase.rpc('grateapex_list_notifications'),
    supabase.from('profiles').select('username').eq('id', userId).maybeSingle(),
  ]);
  if (state.userId !== userId) return; // signed out meanwhile
  const error = friends.error ?? notes.error;
  if (error) {
    report('load', error);
    setState({ status: state.people.length ? 'ready' : 'error', error: friendlySocialError(error) });
    return;
  }
  setState({
    status: 'ready',
    error: null,
    people: ((friends.data ?? []) as PersonRow[]).map(toPerson),
    notifications: ((notes.data ?? []) as NotificationRow[]).map(toNotification),
    username: (profile.data as { username: string | null } | null)?.username ?? state.username,
  });
}

export function refreshSocial() {
  const userId = state.userId;
  if (!userId) return Promise.resolve();
  loading ??= load(userId).finally(() => {
    loading = null;
  });
  return loading;
}

function stopRealtime() {
  if (channel) void supabase.removeChannel(channel);
  channel = null;
}

function startRealtime(userId: string) {
  stopRealtime();
  const refresh = () => void refreshSocial();
  channel = supabase
    .channel(`social:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships', filter: `requester_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships', filter: `addressee_id=eq.${userId}` }, refresh)
    .subscribe();
}

function startFor(userId: string | null) {
  if (userId === state.userId && state.status !== 'idle') return;
  stopRealtime();
  state = { ...EMPTY, userId };
  listeners.forEach((listener) => listener());
  if (!userId) return;
  setState({ status: 'loading' });
  startRealtime(userId);
  void refreshSocial();
}

let started = false;
function ensureStarted() {
  if (started) return;
  started = true;
  void supabase.auth.getSession().then(({ data }) => startFor(data.session?.user.id ?? null));
  subscribeToLearningAuthChanges((userId) => startFor(userId));
}

// ── Hooks ───────────────────────────────────────────────────────────

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSocial(): State {
  useEffect(ensureStarted, []);
  return useSyncExternalStore(subscribe, () => state, () => state);
}

// ── Actions (each refreshes the shared store) ───────────────────────

async function run<T>(operation: string, call: () => PromiseLike<{ data: T; error: unknown }>) {
  const { data, error } = await call();
  if (error) {
    report(operation, error);
    throw new Error(friendlySocialError(error));
  }
  await refreshSocial();
  return data;
}

export function sendFriendRequest(userId: string) {
  return run('send request', () => supabase.rpc('grateapex_send_friend_request', { p_user_id: userId }));
}

export function respondToFriendRequest(friendshipId: string, accept: boolean) {
  return run('respond', () => supabase.rpc('grateapex_respond_friend_request', { p_friendship_id: friendshipId, p_accept: accept }));
}

export function removeFriendship(friendshipId: string) {
  return run('remove', () => supabase.rpc('grateapex_remove_friendship', { p_friendship_id: friendshipId }));
}

export async function setUsername(username: string) {
  const saved = await run('set username', () => supabase.rpc('grateapex_set_username', { p_username: username }));
  setState({ username: typeof saved === 'string' ? saved : username.trim().toLowerCase() });
}

export async function searchLearners(query: string): Promise<SocialPerson[]> {
  if (query.trim().length < 2) return [];
  const { data, error } = await supabase.rpc('grateapex_search_profiles', { p_query: query.trim() });
  if (error) {
    report('search', error);
    throw new Error(friendlySocialError(error));
  }
  return ((data ?? []) as PersonRow[]).map(toPerson);
}

// ── Social notifications in the notification centre ─────────────────

const SOCIAL_PREFIX = 'social:';
const FRIENDS_HREF = '/social/friends' as Href;

export function socialAppNotifications(notifications: readonly SocialNotification[]): AppNotification[] {
  return notifications.map((note) => ({
    id: `${SOCIAL_PREFIX}${note.id}`,
    group: 'updates',
    title: note.type === 'friend_request' ? 'Friend request' : 'Request accepted',
    body: note.type === 'friend_request' ? `${note.actorName} wants to connect.` : `${note.actorName} is now your friend.`,
    at: note.createdAt,
    href: FRIENDS_HREF,
    icon: 'social',
    tone: note.type === 'friend_request' ? 'gold' : 'success',
  }));
}

export function readSocialNotificationIds(notifications: readonly SocialNotification[]) {
  return new Set(notifications.filter((note) => note.readAt).map((note) => `${SOCIAL_PREFIX}${note.id}`));
}

export function markSocialNotificationsRead(ids: string[]) {
  const socialIds = ids.filter((id) => id.startsWith(SOCIAL_PREFIX)).map((id) => id.slice(SOCIAL_PREFIX.length));
  if (socialIds.length === 0 || !state.userId) return;
  const now = Date.now();
  setState({ notifications: state.notifications.map((note) => (socialIds.includes(note.id) && !note.readAt ? { ...note, readAt: now } : note)) });
  void supabase
    .from('notifications')
    .update({ read_at: new Date(now).toISOString() })
    .in('id', socialIds)
    .is('read_at', null)
    .then(({ error }) => {
      if (error) report('mark read', error);
    });
}

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
  type: 'friend_request' | 'friend_accepted' | 'mention' | 'comment' | 'message' | 'group_activity' | 'social_activity';
  actorName: string;
  actorAvatarUrl: string | null;
  readAt: number | null;
  createdAt: number;
  title?: string;
  body?: string;
  href?: Href;
};

export type FriendActivity = {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  type: 'LESSON_COMPLETED' | 'TOPIC_COMPLETED' | 'APEX_CHALLENGE_COMPLETED';
  topicId: string | null;
  lessonId: string | null;
  at: number;
};

type State = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  userId: string | null;
  username: string | null;
  shareActivity: boolean;
  activity: FriendActivity[];
  people: SocialPerson[];
  notifications: SocialNotification[];
  error: string | null;
  activityError: string | null;
};

const EMPTY: State = { status: 'idle', userId: null, username: null, shareActivity: true, activity: [], people: [], notifications: [], error: null, activityError: null };
let state: State = EMPTY;
const listeners = new Set<() => void>();
let channel: RealtimeChannel | null = null;
let channelGeneration = 0;
let loading: { userId: string; promise: Promise<void> } | null = null;

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

// ── Names and messages ──────────────────────────────────────────────

export function personName(person: Pick<SocialPerson, 'displayName' | 'username'>) {
  return person.displayName?.trim() || (person.username ? `@${person.username}` : 'GrAteApex Hub learner');
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
  if (/fetch|network|Failed to/i.test(message)) return 'Could not reach GrAteApex Hub. Check your connection and try again.';
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

type InAppNotificationRow = {
  id: string;
  kind: SocialNotification['type'];
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  data: { source_type?: string } | null;
};

type ActivityRow = {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  event_type: FriendActivity['type'];
  topic_id: string | null;
  lesson_id: string | null;
  occurred_at: string;
};

function toActivity(row: ActivityRow): FriendActivity {
  return {
    id: `${row.user_id}:${row.event_type}:${row.lesson_id ?? row.topic_id ?? ''}:${row.occurred_at}`,
    userId: row.user_id,
    name: personName({ displayName: row.display_name, username: row.username }),
    avatarUrl: row.avatar_url,
    type: row.event_type,
    topicId: row.topic_id,
    lessonId: row.lesson_id,
    at: Date.parse(row.occurred_at),
  };
}

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

function toInAppNotification(row: InAppNotificationRow): SocialNotification {
  const source = row.data?.source_type;
  const href: Href = source === 'messages' ? '/social/messages'
    : source === 'group_discussions' ? '/social/groups'
      : source === 'table_conference_messages' ? '/social/conferences'
        : '/';
  return {
    id: `inapp:${row.id}`,
    type: row.kind,
    actorName: '',
    actorAvatarUrl: null,
    readAt: row.read_at ? Date.parse(row.read_at) : null,
    createdAt: Date.parse(row.created_at),
    title: row.title,
    body: row.body,
    href,
  };
}

// ── Loading ─────────────────────────────────────────────────────────

async function load(userId: string) {
  const [friends, notes, profile, activity, inAppNotes] = await Promise.all([
    supabase.rpc('grateapex_list_friends'),
    supabase.rpc('grateapex_list_notifications'),
    supabase.from('profiles').select('username, share_activity').eq('id', userId).maybeSingle(),
    supabase.rpc('grateapex_friend_activity'),
    supabase.from('in_app_notifications').select('id, kind, title, body, read_at, created_at, data').order('created_at', { ascending: false }).limit(50),
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
    notifications: [
      ...((notes.data ?? []) as NotificationRow[]).map(toNotification),
      ...((inAppNotes.data ?? []) as InAppNotificationRow[]).map(toInAppNotification),
    ],
    username: (profile.data as { username: string | null } | null)?.username ?? state.username,
    shareActivity: (profile.data as { share_activity?: boolean } | null)?.share_activity ?? state.shareActivity,
    activity: activity.error ? state.activity : ((activity.data ?? []) as ActivityRow[]).map(toActivity),
    activityError: activity.error ? friendlySocialError(activity.error) : null,
  });
  if (activity.error) report('activity', activity.error);
}

export function refreshSocial() {
  const userId = state.userId;
  if (!userId) return Promise.resolve();
  if (loading?.userId === userId) return loading.promise;

  const promise = load(userId).finally(() => {
    if (loading?.promise === promise) loading = null;
  });
  loading = { userId, promise };
  return promise;
}

function stopRealtime() {
  if (channel) void supabase.removeChannel(channel);
  channel = null;
}

function startRealtime(userId: string) {
  stopRealtime();
  const refresh = () => void refreshSocial();
  channel = supabase
    // A fresh topic also protects the web dev server from reusing an already
    // joined channel after a fast auth refresh or hot module reload.
    .channel(`social:${userId}:${++channelGeneration}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'in_app_notifications', filter: `recipient_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships', filter: `requester_id=eq.${userId}` }, refresh)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships', filter: `addressee_id=eq.${userId}` }, refresh)
    .subscribe();
}

function startFor(userId: string | null) {
  // getSession() and the auth-change listener can both report the same
  // initial session. Do not subscribe twice for one account.
  if (userId === state.userId) return;
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

// Whether friends see your lesson/topic/Apex completions.
export async function setShareActivity(share: boolean) {
  const userId = state.userId;
  if (!userId) return;
  const previous = state.shareActivity;
  setState({ shareActivity: share });
  const { error } = await supabase.from('profiles').update({ share_activity: share }).eq('id', userId);
  if (error) {
    setState({ shareActivity: previous });
    report('share activity', error);
    throw new Error(friendlySocialError(error));
  }
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
  return notifications.map((note) => {
    const inApp = note.id.startsWith('inapp:');
    return {
      id: inApp ? note.id : `${SOCIAL_PREFIX}${note.id}`,
      group: 'updates',
      title: note.title ?? (note.type === 'friend_request' ? 'Friend request' : 'Request accepted'),
      body: note.body ?? (note.type === 'friend_request' ? `${note.actorName} wants to connect.` : `${note.actorName} is now your friend.`),
      at: note.createdAt,
      href: note.href ?? FRIENDS_HREF,
      icon: note.type === 'mention' ? 'social' : 'social',
      tone: note.type === 'friend_request' ? 'gold' : note.type === 'friend_accepted' ? 'success' : 'primary',
    };
  });
}

export function readSocialNotificationIds(notifications: readonly SocialNotification[]) {
  return new Set(notifications.filter((note) => note.readAt).map((note) => note.id.startsWith('inapp:') ? note.id : `${SOCIAL_PREFIX}${note.id}`));
}

export function markSocialNotificationsRead(ids: string[]) {
  const socialIds = ids.filter((id) => id.startsWith(SOCIAL_PREFIX)).map((id) => id.slice(SOCIAL_PREFIX.length));
  const inAppIds = ids.filter((id) => id.startsWith('inapp:')).map((id) => id.slice('inapp:'.length));
  if ((socialIds.length === 0 && inAppIds.length === 0) || !state.userId) return;
  const now = Date.now();
  setState({ notifications: state.notifications.map((note) => {
    const sourceIds = note.id.startsWith('inapp:') ? inAppIds : socialIds;
    const localId = note.id.startsWith('inapp:') ? note.id.slice('inapp:'.length) : note.id;
    return sourceIds.includes(localId) && !note.readAt ? { ...note, readAt: now } : note;
  }) });
  if (socialIds.length) void supabase.from('notifications').update({ read_at: new Date(now).toISOString() }).in('id', socialIds).is('read_at', null).then(({ error }) => { if (error) report('mark read', error); });
  if (inAppIds.length) void supabase.from('in_app_notifications').update({ read_at: new Date(now).toISOString() }).in('id', inAppIds).is('read_at', null).then(({ error }) => { if (error) report('mark in-app read', error); });
}

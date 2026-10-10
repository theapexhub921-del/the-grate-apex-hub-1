import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export type CommunityMedia = {
  uri: string;
  type: 'image' | 'video';
  mimeType: string;
  size?: number;
  filename: string;
};

export type CommunityStory = {
  id: string;
  author_id: string;
  body: string | null;
  media_path: string | null;
  media_url?: string | null;
  media_type?: 'image' | 'video' | null;
  created_at: string;
  expires_at: string;
};

export type CommunityPost = {
  id: string;
  author_id: string;
  author_name?: string | null;
  author_avatar?: string | null;
  body: string;
  media_path: string | null;
  media_type: 'image' | 'video' | null;
  media_url?: string | null;
  reshared_post_id: string | null;
  reshared_author_id?: string | null;
  reshared_body?: string | null;
  reshared_media_url?: string | null;
  reshared_media_type?: string | null;
  created_at: string;
  reactions: number;
  comments: number;
  reshares: number;
  my_reaction: 'like' | null;
};

export type StudyGroup = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  visibility: 'open' | 'friends' | 'private';
  created_at: string;
  is_member?: boolean;
  membership_status?: 'active' | 'invited' | 'declined';
  membership_role?: 'owner' | 'admin' | 'member';
};

export type GroupDiscussionPost = {
  id: string;
  group_id: string;
  author_id: string;
  author_name?: string | null;
  author_avatar?: string | null;
  body: string;
  created_at: string;
};

export type CommunityConversation = {
  id: string;
  updated_at: string;
};

export type CommunityMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  deleted_at?: string | null;
};

export type FriendChallenge = {
  id: string;
  challenger_id: string;
  opponent_id: string;
  course_id: string;
  topic_id?: string | null;
  title?: string | null;
  xp_stake: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled' | 'active';
  created_at: string;
  starts_at: string | null;
  ends_at: string | null;
};

export type StreakFreezeBalance = {
  user_id: string;
  available: number;
  updated_at: string;
};

async function signedInUserId(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to use community features.');
  return user.uid;
}

export async function listLiveStories(): Promise<CommunityStory[]> {
  return [];
}

export async function createCommunityStory(body: string, media?: CommunityMedia): Promise<CommunityStory> {
  const authorId = await signedInUserId();
  const id = `story_${Date.now()}`;
  const now = new Date().toISOString();
  return {
    id,
    author_id: authorId,
    body: body.trim() || null,
    media_path: null,
    media_url: media?.uri ?? null,
    media_type: media?.type ?? null,
    created_at: now,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  };
}

export async function deleteCommunityStory(storyId: string, mediaPath: string | null) {}

// ─── Posts (shared discussion board with the original app) ───────────────
// posts/{id} = { board, title, body, authorUid, authorName, replyCount,
// likeCount, createdAt, lastActivityAt, media? } — authorName must be the real
// username. Likes are posts/{id}/likes/{uid} with likeCount moved by one in the
// same batch; comments are posts/{id}/replies with replyCount moved by one.
// Errors are passed on: nothing is shown as posted when it wasn't.

const BLOCKED_KEY = 'grateapex_blocked_learners';

async function myUsername(): Promise<{ uid: string; username: string }> {
  const uid = await signedInUserId();
  const username = (await getDoc(doc(db, 'users', uid))).data()?.username;
  if (typeof username !== 'string' || !/^[a-z0-9_]{3,20}$/.test(username)) throw new Error('Choose a username first — posts show your username.');
  return { uid, username };
}

const iso = (value: any) => (value?.toDate ? value.toDate().toISOString() : typeof value === 'number' ? new Date(value).toISOString() : new Date(0).toISOString());

// Old-app posts have a separate title; show it above the body when it isn't just the body's start.
const postText = (d: Record<string, any>) => {
  const title = String(d.title ?? '').trim();
  const body = String(d.body ?? '').trim();
  return title && !body.startsWith(title) ? `${title}\n\n${body}` : body;
};

/** Learners hidden on this device. The shared rules have no block list, so blocking is per device. */
export async function blockedLearners(): Promise<Set<string>> {
  try {
    const uid = auth.currentUser?.uid;
    const saved = uid ? await AsyncStorage.getItem(`${BLOCKED_KEY}:${uid}`) : null;
    return new Set(saved ? (JSON.parse(saved) as string[]) : []);
  } catch {
    return new Set();
  }
}

export async function listCommunityFeed(limitCount = 50): Promise<CommunityPost[]> {
  const userId = auth.currentUser?.uid ?? null;
  const [snap, blocked] = await Promise.all([getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount))), blockedLearners()]);
  const rows = snap.docs.filter((item) => !blocked.has(String(item.data().authorUid)));
  const liked = await Promise.all(rows.map((item) => (userId ? getDoc(doc(db, 'posts', item.id, 'likes', userId)).then((like) => like.exists()).catch(() => false) : Promise.resolve(false))));
  const originals = new Map<string, Record<string, any>>();
  await Promise.all(
    [...new Set(rows.map((item) => item.data().resharedPostId).filter((id): id is string => typeof id === 'string'))].map(async (id) => {
      const original = await getDoc(doc(db, 'posts', id)).catch(() => null);
      if (original?.exists()) originals.set(id, original.data());
    })
  );
  return rows.map((item, index) => {
    const d = item.data();
    const original = typeof d.resharedPostId === 'string' ? originals.get(d.resharedPostId) : undefined;
    const media = Array.isArray(d.media) ? d.media[0] : null;
    return {
      id: item.id,
      author_id: String(d.authorUid ?? ''),
      author_name: d.authorName ?? null,
      author_avatar: null,
      body: postText(d),
      media_path: null,
      media_type: media?.t === 'video' ? 'video' : media?.t === 'image' ? 'image' : null,
      media_url: typeof media?.url === 'string' ? media.url : null,
      reshared_post_id: typeof d.resharedPostId === 'string' ? d.resharedPostId : null,
      reshared_author_id: original?.authorUid ?? null,
      reshared_body: original ? postText(original) : null,
      reshared_media_url: null,
      reshared_media_type: null,
      created_at: iso(d.createdAt),
      reactions: Number(d.likeCount) || 0,
      comments: Number(d.replyCount) || 0,
      reshares: 0, // not counted by the shared rules
      my_reaction: liked[index] ? 'like' : null,
    };
  });
}

export async function createCommunityPost(body: string, media?: CommunityMedia, resharedPostId?: string | null): Promise<CommunityPost> {
  if (media) throw new Error('Photos and videos in posts aren’t available yet. Post text only for now.');
  const text = body.trim();
  if (text.length < 3) throw new Error('Posts need at least 3 characters.');
  if (text.length > 2000) throw new Error('Posts can be up to 2,000 characters.');
  const me = await myUsername();
  // The shared board needs a title (3–120 characters): the first line.
  const firstLine = text.split('\n')[0].trim();
  const title = (firstLine.length >= 3 ? firstLine : text).slice(0, 120);
  const ref = doc(collection(db, 'posts'));
  await setDoc(ref, {
    board: 'general',
    title,
    body: text,
    authorUid: me.uid,
    authorName: me.username,
    replyCount: 0,
    likeCount: 0,
    createdAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
    ...(resharedPostId ? { resharedPostId } : {}),
  });
  return {
    id: ref.id, author_id: me.uid, author_name: me.username, body: text, media_path: null, media_type: null, media_url: null,
    reshared_post_id: resharedPostId ?? null, created_at: new Date().toISOString(), reactions: 0, comments: 0, reshares: 0, my_reaction: null,
  };
}

/** Only the author can delete their post (rules). */
export async function deleteCommunityPost(postId: string) {
  await deleteDoc(doc(db, 'posts', postId));
}

/** Like or unlike; returns whether the post is now liked. */
export async function togglePostLike(postId: string): Promise<boolean> {
  const me = await myUsername();
  const likeRef = doc(db, 'posts', postId, 'likes', me.uid);
  const liked = (await getDoc(likeRef)).exists();
  const batch = writeBatch(db);
  if (liked) batch.delete(likeRef);
  else batch.set(likeRef, { username: me.username, createdAt: serverTimestamp() });
  batch.update(doc(db, 'posts', postId), { likeCount: increment(liked ? -1 : 1) });
  await batch.commit();
  return !liked;
}

export async function addPostComment(postId: string, body: string) {
  const text = body.trim();
  if (text.length < 1) throw new Error('Write a comment first.');
  if (text.length > 1000) throw new Error('Comments can be up to 1,000 characters.');
  const me = await myUsername();
  const batch = writeBatch(db);
  batch.set(doc(collection(db, 'posts', postId, 'replies')), { body: text, authorUid: me.uid, authorName: me.username, createdAt: serverTimestamp() });
  batch.update(doc(db, 'posts', postId), { replyCount: increment(1), lastActivityAt: serverTimestamp() });
  await batch.commit();
}

/**
 * A report becomes a support ticket for the admins (the shared rules' review
 * channel): only the reporter and admins can read it.
 */
export async function reportCommunityContent(
  targetType: 'post' | 'comment' | 'user' | 'group' | 'message',
  targetId: string,
  reason = 'Reported for review'
) {
  const me = await myUsername();
  await setDoc(doc(collection(db, 'supportTickets')), {
    uid: me.uid,
    username: me.username,
    category: targetType === 'user' ? 'other' : 'content',
    message: `Report · ${targetType} ${targetId}: ${reason}`.slice(0, 1000),
    status: 'open',
    createdAt: serverTimestamp(),
  });
}

/** Hides a learner on this device and stops following them (the shared rules have no block list). */
export async function blockCommunityUser(blockedId: string, friendshipId?: string | null) {
  const uid = await signedInUserId();
  const blocked = await blockedLearners();
  blocked.add(blockedId);
  await AsyncStorage.setItem(`${BLOCKED_KEY}:${uid}`, JSON.stringify([...blocked]));
  await deleteDoc(doc(db, 'follows', `${uid}_${blockedId}`)).catch(() => undefined);
  void friendshipId;
}

export async function listPostComments(postId: string) {
  const [snap, blocked] = await Promise.all([getDocs(query(collection(db, 'posts', postId, 'replies'), orderBy('createdAt', 'asc'), limit(200))), blockedLearners()]);
  return snap.docs
    .filter((item) => !blocked.has(String(item.data().authorUid)))
    .map((item) => {
      const d = item.data();
      return { id: item.id, author_id: String(d.authorUid ?? ''), author_name: d.authorName ?? null, body: String(d.body ?? ''), created_at: iso(d.createdAt) };
    });
}

// ─── Study groups (shared with the original app) ─────────────────────────
// groups/{gid} = { ownerUid, memberUids, members: { uid: username }, name,
// description, createdAt }. Only members can see a group. It starts with its
// creator; the owner adds one mutual friend at a time; a member can leave.
// Messages: groups/{gid}/messages = { authorUid, authorName, text, createdAt }.

function toGroup(id: string, d: Record<string, any>, me: string | null): StudyGroup {
  const members: string[] = Array.isArray(d.memberUids) ? d.memberUids : [];
  return {
    id,
    owner_id: String(d.ownerUid ?? ''),
    title: String(d.name ?? ''),
    description: String(d.description ?? ''),
    visibility: 'private', // the shared rules: only members can see a group
    created_at: iso(d.createdAt),
    is_member: me ? members.includes(me) : false,
    membership_status: 'active',
    membership_role: me && d.ownerUid === me ? 'owner' : 'member',
  };
}

/** The groups I belong to (the only ones the rules let me see). */
export async function listOpenStudyGroups(): Promise<StudyGroup[]> {
  const me = await signedInUserId();
  const snap = await getDocs(query(collection(db, 'groups'), where('memberUids', 'array-contains', me), limit(100)));
  return snap.docs.map((item) => toGroup(item.id, item.data(), me));
}

export async function listVisibleStudyGroups(): Promise<StudyGroup[]> {
  return listOpenStudyGroups();
}

export async function createStudyGroup(input: { title: string; description?: string; visibility?: StudyGroup['visibility'] }): Promise<string> {
  const name = input.title.trim();
  const description = (input.description ?? '').trim();
  if (name.length < 2 || name.length > 40) throw new Error('Group names are 2–40 characters.');
  if (description.length > 200) throw new Error('Descriptions can be up to 200 characters.');
  const me = await myUsername();
  const ref = doc(collection(db, 'groups'));
  await setDoc(ref, { ownerUid: me.uid, memberUids: [me.uid], members: { [me.uid]: me.username }, name, description, createdAt: serverTimestamp() });
  return ref.id;
}

/** Groups can't be joined by asking: the owner adds members (shared rules). */
export async function joinStudyGroup(groupId: string): Promise<boolean> {
  void groupId;
  throw new Error('Ask the group’s owner to add you. Owners can add friends who follow each other.');
}

/** The owner adds a friend (you must follow each other). */
export async function inviteFriendToGroup(groupId: string, friendId: string) {
  const me = await signedInUserId();
  const ref = doc(db, 'groups', groupId);
  const group = await getDoc(ref);
  const data = group.data();
  if (!data) throw new Error('This group could not be found.');
  if (data.ownerUid !== me) throw new Error('Only the group’s owner can add members.');
  const members: string[] = Array.isArray(data.memberUids) ? data.memberUids : [];
  if (members.includes(friendId)) return;
  if (members.length >= 20) throw new Error('A group can have up to 20 members.');
  const friendName = (await getDoc(doc(db, 'users', friendId))).data()?.username ?? null;
  try {
    await updateDoc(ref, { memberUids: [...members, friendId], [`members.${friendId}`]: friendName });
  } catch (error) {
    if ((error as { code?: string }).code === 'permission-denied') throw new Error('You can add friends who follow you back.');
    throw error;
  }
}

/** There are no invitations in the shared model: members are added directly. */
export async function respondToGroupInvite(membershipId: string, accept: boolean) {
  void membershipId;
  void accept;
}

/** A member (not the owner) leaves, with the "left the group" notice the original app shows. */
export async function leaveStudyGroup(groupId: string) {
  const me = await myUsername();
  const ref = doc(db, 'groups', groupId);
  const data = (await getDoc(ref)).data();
  if (!data) return;
  if (data.ownerUid === me.uid) throw new Error('Owners can’t leave their own group.');
  const batch = writeBatch(db);
  batch.set(doc(collection(db, 'groups', groupId, 'messages')), { text: `@${me.username} left the group`, system: true, authorUid: me.uid, authorName: me.username, createdAt: serverTimestamp() });
  batch.update(ref, { memberUids: (data.memberUids as string[]).filter((uid) => uid !== me.uid), [`members.${me.uid}`]: deleteField() });
  await batch.commit();
}

export async function listGroupDiscussion(groupId: string): Promise<GroupDiscussionPost[]> {
  const snap = await getDocs(query(collection(db, 'groups', groupId, 'messages'), orderBy('createdAt', 'asc'), limit(200)));
  return snap.docs.map((item) => {
    const d = item.data();
    return { id: item.id, group_id: groupId, author_id: String(d.authorUid ?? ''), author_name: d.authorName ?? null, body: String(d.text ?? ''), created_at: iso(d.createdAt) };
  });
}

export async function postToGroupDiscussion(groupId: string, body: string): Promise<GroupDiscussionPost> {
  const text = body.trim();
  if (text.length < 1) throw new Error('Write a message first.');
  if (text.length > 500) throw new Error('Messages can be up to 500 characters.');
  const me = await myUsername();
  const ref = doc(collection(db, 'groups', groupId, 'messages'));
  await setDoc(ref, { authorUid: me.uid, authorName: me.username, text, createdAt: serverTimestamp() });
  return { id: ref.id, group_id: groupId, author_id: me.uid, author_name: me.username, body: text, created_at: new Date().toISOString() };
}

// ─── Direct messages (shared with the original app) ──────────────────────
// chats/{a_b} (the two uids sorted, joined with "_") = { members, names,
// lastText, lastAt, lastFrom, seen }; messages = { from, text, createdAt }.
// Only friends (who follow each other) can start or keep chatting.

/** The conversation id with a friend; the chat document is created the first time. */
export async function getOrCreateFriendConversation(friendId: string): Promise<string> {
  const me = await myUsername();
  const members = [me.uid, friendId].sort();
  const id = members.join('_');
  const ref = doc(db, 'chats', id);
  if ((await getDoc(ref)).exists()) return id;
  try {
    await setDoc(ref, { members, names: { [me.uid]: me.username }, lastText: '', lastAt: serverTimestamp(), lastFrom: me.uid, seen: { [me.uid]: serverTimestamp() } });
  } catch (error) {
    if ((error as { code?: string }).code === 'permission-denied') throw new Error('You can message friends who follow you back.');
    throw error;
  }
  return id;
}

export async function listConversationMessages(conversationId: string): Promise<CommunityMessage[]> {
  const snap = await getDocs(query(collection(db, 'chats', conversationId, 'messages'), orderBy('createdAt', 'asc'), limit(200)));
  return snap.docs.map((item) => {
    const d = item.data();
    return { id: item.id, conversation_id: conversationId, sender_id: String(d.from ?? ''), body: String(d.text ?? ''), created_at: iso(d.createdAt) };
  });
}

export async function sendCommunityMessage(conversationId: string, body: string): Promise<CommunityMessage> {
  const text = body.trim();
  if (text.length < 1) throw new Error('Write a message first.');
  if (text.length > 500) throw new Error('Messages can be up to 500 characters.');
  const me = await signedInUserId();
  const ref = doc(collection(db, 'chats', conversationId, 'messages'));
  const batch = writeBatch(db);
  batch.set(ref, { from: me, text, createdAt: serverTimestamp() });
  batch.update(doc(db, 'chats', conversationId), { lastText: text.slice(0, 120), lastAt: serverTimestamp(), lastFrom: me, [`seen.${me}`]: serverTimestamp() });
  try {
    await batch.commit();
  } catch (error) {
    if ((error as { code?: string }).code === 'permission-denied') throw new Error('Messages can only be sent between friends who follow each other.');
    throw error;
  }
  return { id: ref.id, conversation_id: conversationId, sender_id: me, body: text, created_at: new Date().toISOString() };
}

/** Only the sender can delete their own message. */
export async function deleteCommunityMessage(conversationId: string, messageId: string) {
  await deleteDoc(doc(db, 'chats', conversationId, 'messages', messageId));
}

export async function listFriendChallenges(): Promise<FriendChallenge[]> {
  try {
    const snap = await getDocs(collection(db, 'battles'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FriendChallenge);
  } catch {
    return [];
  }
}

export async function createFriendChallenge(
  inputOrOpponentId: string | { opponentId: string; courseId: string; xpStake: number },
  courseId?: string,
  xpStake?: any
): Promise<string> {
  const challengerId = await signedInUserId();
  const id = `battle_${Date.now()}`;
  const opponentId = typeof inputOrOpponentId === 'string' ? inputOrOpponentId : inputOrOpponentId.opponentId;
  const course = typeof inputOrOpponentId === 'string' ? (courseId || '') : inputOrOpponentId.courseId;
  const stake = typeof inputOrOpponentId === 'string' ? (typeof xpStake === 'number' ? xpStake : 50) : inputOrOpponentId.xpStake;

  const battle: FriendChallenge = {
    id,
    challenger_id: challengerId,
    opponent_id: opponentId,
    course_id: course,
    xp_stake: stake,
    status: 'pending',
    created_at: new Date().toISOString(),
    starts_at: null,
    ends_at: null,
  };
  await setDoc(doc(db, 'battles', id), battle);
  return id;
}

export async function respondToFriendChallenge(challengeId: string, accept: boolean) {
  await updateDoc(doc(db, 'battles', challengeId), {
    status: accept ? 'accepted' : 'declined',
  });
}

export async function readStreakFreezeBalance(): Promise<StreakFreezeBalance | null> {
  return {
    user_id: auth.currentUser?.uid || '',
    available: 0,
    updated_at: new Date().toISOString(),
  };
}

export async function getStreakFreezeBalance(): Promise<{ available: number }> {
  return { available: 0 };
}

export async function recordStreakActivityWithFreeze(todayKey: any): Promise<number> {
  return 1;
}

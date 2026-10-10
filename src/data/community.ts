import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
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

export async function listOpenStudyGroups(): Promise<StudyGroup[]> {
  try {
    const snap = await getDocs(collection(db, 'groups'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StudyGroup);
  } catch {
    return [];
  }
}

export async function listVisibleStudyGroups(): Promise<StudyGroup[]> {
  return listOpenStudyGroups();
}

export async function createStudyGroup(input: {
  title: string;
  description?: string;
  visibility?: StudyGroup['visibility'];
}): Promise<string> {
  const ownerId = await signedInUserId();
  const id = `group_${Date.now()}`;
  const group: StudyGroup = {
    id,
    owner_id: ownerId,
    title: input.title,
    description: input.description ?? '',
    visibility: input.visibility ?? 'friends',
    created_at: new Date().toISOString(),
    is_member: true,
  };
  await setDoc(doc(db, 'groups', id), group);
  return id;
}

export async function joinStudyGroup(groupId: string): Promise<boolean> {
  const userId = await signedInUserId();
  await setDoc(
    doc(db, 'groups', groupId, 'members', userId),
    { status: 'active', role: 'member' },
    { merge: true }
  );
  return true;
}

export async function inviteFriendToGroup(groupId: string, friendId: string) {}
export async function respondToGroupInvite(membershipId: string, accept: boolean) {}

export async function listGroupDiscussion(groupId: string): Promise<GroupDiscussionPost[]> {
  try {
    const snap = await getDocs(collection(db, 'groups', groupId, 'discussions'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GroupDiscussionPost);
  } catch {
    return [];
  }
}

export async function postToGroupDiscussion(groupId: string, body: string): Promise<GroupDiscussionPost> {
  const authorId = await signedInUserId();
  const id = `post_${Date.now()}`;
  const item: GroupDiscussionPost = {
    id,
    group_id: groupId,
    author_id: authorId,
    author_name: auth.currentUser?.displayName || 'Student',
    body: body.trim(),
    created_at: new Date().toISOString(),
  };
  await setDoc(doc(db, 'groups', groupId, 'discussions', id), item);
  return item;
}

export async function getOrCreateFriendConversation(friendId: string): Promise<string> {
  const userId = await signedInUserId();
  const id = [userId, friendId].sort().join('_');
  return id;
}

export async function listConversationMessages(conversationId: string): Promise<CommunityMessage[]> {
  try {
    const snap = await getDocs(collection(db, 'chats', conversationId, 'messages'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CommunityMessage);
  } catch {
    return [];
  }
}

export async function sendCommunityMessage(conversationId: string, body: string): Promise<CommunityMessage> {
  const senderId = await signedInUserId();
  const id = `msg_${Date.now()}`;
  const msg: CommunityMessage = {
    id,
    conversation_id: conversationId,
    sender_id: senderId,
    body: body.trim(),
    created_at: new Date().toISOString(),
  };
  await setDoc(doc(db, 'chats', conversationId, 'messages', id), msg);
  return msg;
}

export async function deleteCommunityMessage(messageId: string) {}

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

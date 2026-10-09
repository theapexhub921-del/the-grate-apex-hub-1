import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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

export async function listCommunityFeed(limitCount = 50): Promise<CommunityPost[]> {
  try {
    const q = query(collection(db, 'posts'), orderBy('created_at', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const userId = auth.currentUser?.uid;

    return snap.docs.map((d) => {
      const data = d.data();
      const reactions = data.reactions || [];
      return {
        id: d.id,
        author_id: data.author_id,
        author_name: data.author_name || 'Student',
        author_avatar: data.author_avatar || null,
        body: data.body || '',
        media_path: null,
        media_type: data.media_type || null,
        media_url: data.media_url || null,
        reshared_post_id: null,
        created_at: data.created_at || new Date().toISOString(),
        reactions: Array.isArray(reactions) ? reactions.length : Number(reactions || 0),
        comments: Number(data.comment_count || 0),
        reshares: 0,
        my_reaction: Array.isArray(reactions) && userId && reactions.includes(userId) ? 'like' : null,
      };
    });
  } catch {
    return [];
  }
}

export async function createCommunityPost(
  body: string,
  media?: CommunityMedia,
  resharedPostId?: string | null
): Promise<CommunityPost> {
  const authorId = await signedInUserId();
  const id = `post_${Date.now()}`;
  const now = new Date().toISOString();

  const post: CommunityPost = {
    id,
    author_id: authorId,
    author_name: auth.currentUser?.displayName || 'Student',
    body: body.trim(),
    media_path: null,
    media_type: media?.type ?? null,
    media_url: media?.uri ?? null,
    reshared_post_id: resharedPostId ?? null,
    created_at: now,
    reactions: 0,
    comments: 0,
    reshares: 0,
    my_reaction: null,
  };

  try {
    await setDoc(doc(db, 'posts', id), {
      ...post,
      createdAt: serverTimestamp(),
    });
  } catch {}

  return post;
}

export async function deleteCommunityPost(postId: string) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch {}
}

export async function togglePostLike(postId: string): Promise<boolean> {
  const userId = await signedInUserId();
  try {
    const postRef = doc(db, 'posts', postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return false;
    const data = snap.data();
    const reactions = Array.isArray(data.reactions) ? data.reactions : [];
    const hasLiked = reactions.includes(userId);
    const updated = hasLiked ? reactions.filter((id: string) => id !== userId) : [...reactions, userId];
    await updateDoc(postRef, { reactions: updated });
    return !hasLiked;
  } catch {
    return false;
  }
}

export async function addPostComment(postId: string, body: string) {
  const authorId = await signedInUserId();
  const text = body.trim();
  const commentId = `comment_${Date.now()}`;
  try {
    await setDoc(doc(db, 'posts', postId, 'comments', commentId), {
      author_id: authorId,
      body: text,
      created_at: new Date().toISOString(),
    });
  } catch {}
}

export async function reportCommunityContent(
  targetType: 'post' | 'comment' | 'user' | 'group' | 'message',
  targetId: string,
  reason = 'Reported for review'
) {}

export async function blockCommunityUser(blockedId: string, friendshipId?: string | null) {}

export async function listPostComments(postId: string) {
  try {
    const snap = await getDocs(collection(db, 'posts', postId, 'comments'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
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

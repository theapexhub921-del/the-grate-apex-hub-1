// Client access for the community tables in
// supabase/migrations/20261005020000_community_backend.sql.
// Row access is still enforced by Supabase RLS; IDs supplied here are never
// treated as proof of ownership or friendship.
import { supabase } from '@/lib/supabase';
import { dayKey } from '@/data/learning/time';

export type CommunityStory = {
  id: string;
  author_id: string;
  body: string | null;
  media_path: string | null;
  created_at: string;
  expires_at: string;
  media_url?: string | null;
  media_type?: 'image' | 'video' | null;
};

export type CommunityPost = {
  id: string;
  author_id: string;
  body: string;
  media_path: string | null;
  media_type: 'image' | 'video' | null;
  reshared_post_id: string | null;
  reshared_body?: string | null;
  reshared_author_id?: string | null;
  reshared_media_url?: string | null;
  reshared_media_type?: 'image' | 'video' | null;
  created_at: string;
  media_url?: string | null;
  reactions: number;
  comments: number;
  my_reaction: string | null;
};

export type CommunityMedia = { uri: string; type: 'image' | 'video'; mimeType: string; filename: string; size?: number | null };

export type StudyGroup = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  visibility: 'open' | 'friends' | 'private';
  created_at: string;
  is_member?: boolean;
  membership_status?: 'invited' | 'active' | 'left' | 'removed';
  membership_role?: 'owner' | 'moderator' | 'member';
};

export type GroupDiscussionPost = {
  id: string;
  group_id: string;
  author_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

export type CommunityMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

export type FriendChallenge = {
  id: string;
  challenger_id: string;
  opponent_id: string;
  title: string;
  topic_id: string | null;
  status: 'pending' | 'active' | 'declined' | 'completed' | 'expired';
  created_at: string;
  starts_at: string | null;
  ends_at: string | null;
};

export type StreakFreezeBalance = {
  user_id: string;
  available: number;
  updated_at: string;
};

async function signedInUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const userId = data.session?.user.id;
  if (!userId) throw new Error('Sign in to use community features.');
  return userId;
}

export async function listLiveStories() {
  const { data, error } = await supabase
    .from('community_stories')
    .select('id, author_id, body, media_path, created_at, expires_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all(((data ?? []) as CommunityStory[]).map(async (story) => {
    if (!story.media_path) return { ...story, media_url: null, media_type: null };
    const { data: signed, error: mediaError } = await supabase.storage.from('community-media').createSignedUrl(story.media_path, 24 * 60 * 60);
    if (mediaError) throw mediaError;
    const mediaType: 'image' | 'video' = story.media_path.includes('-video-') ? 'video' : 'image';
    return { ...story, media_url: signed.signedUrl, media_type: mediaType };
  }));
}

export async function createCommunityStory(body: string, media?: CommunityMedia) {
  const text = body.trim();
  if (text.length > 500 || (!text && !media)) throw new Error('Add a message or photo/video. Story text can be up to 500 characters.');
  if (media && media.size != null && media.size > 100 * 1024 * 1024) throw new Error('Stories must be smaller than 100 MB.');
  if (media && !['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'].includes(media.mimeType)) {
    throw new Error('Choose a JPG, PNG, WebP, MP4 or QuickTime media file.');
  }
  const authorId = await signedInUserId();
  let mediaPath: string | null = null;
  if (media) {
    const response = await fetch(media.uri);
    if (!response.ok) throw new Error('Could not read the selected photo or video.');
    const bytes = await response.arrayBuffer();
    mediaPath = `${authorId}/${Date.now()}-story-${media.type}-${safeFileName(media.filename)}`;
    const { error: uploadError } = await supabase.storage.from('community-media').upload(mediaPath, bytes, {
      contentType: media.mimeType,
      upsert: false,
    });
    if (uploadError) throw uploadError;
  }
  const { data, error } = await supabase
    .from('community_stories')
    .insert({ author_id: authorId, body: text || null, media_path: mediaPath })
    .select('id, author_id, body, media_path, created_at, expires_at')
    .single();
  if (error) {
    if (mediaPath) await supabase.storage.from('community-media').remove([mediaPath]);
    throw error;
  }
  return data as CommunityStory;
}

export async function listCommunityFeed(limit = 50): Promise<CommunityPost[]> {
  const { data: rows, error } = await supabase.from('community_posts')
    .select('id, author_id, body, media_path, media_type, reshared_post_id, created_at')
    .is('deleted_at', null).order('created_at', { ascending: false }).limit(Math.min(Math.max(limit, 1), 100));
  if (error) throw error;
  const posts = (rows ?? []) as Omit<CommunityPost, 'media_url' | 'reactions' | 'comments' | 'my_reaction'>[];
  if (!posts.length) return [];
  const ids = posts.map((post) => post.id);
  const [{ data: reactionRows, error: reactionError }, { data: commentRows, error: commentError }, userId] = await Promise.all([
    supabase.from('community_post_reactions').select('post_id, user_id').in('post_id', ids),
    supabase.from('community_post_comments').select('post_id').in('post_id', ids).is('deleted_at', null),
    signedInUserId(),
  ]);
  if (reactionError) throw reactionError;
  if (commentError) throw commentError;
  const originalIds = [...new Set(posts.flatMap((post) => post.reshared_post_id ? [post.reshared_post_id] : []))];
  const originalsById = new Map<string, { body: string; author_id: string; media_path: string | null; media_type: 'image' | 'video' | null }>();
  if (originalIds.length) {
    const { data: originals, error: originalsError } = await supabase.from('community_posts')
      .select('id, body, author_id, media_path, media_type').in('id', originalIds).is('deleted_at', null);
    if (originalsError) throw originalsError;
    for (const original of originals ?? []) originalsById.set(original.id, original);
  }
  return Promise.all(posts.map(async (post) => {
    const mediaUrl = post.media_path
      ? (await supabase.storage.from('community-media').createSignedUrl(post.media_path, 60 * 60)).data?.signedUrl ?? null
      : null;
    const original = post.reshared_post_id ? originalsById.get(post.reshared_post_id) : undefined;
    const resharedMediaUrl = original?.media_path
      ? (await supabase.storage.from('community-media').createSignedUrl(original.media_path, 60 * 60)).data?.signedUrl ?? null
      : null;
    const reactions = (reactionRows ?? []).filter((row) => row.post_id === post.id);
    return {
      ...post,
      media_url: mediaUrl,
      reshared_body: original?.body ?? null,
      reshared_author_id: original?.author_id ?? null,
      reshared_media_url: resharedMediaUrl,
      reshared_media_type: original?.media_type ?? null,
      reactions: reactions.length,
      comments: (commentRows ?? []).filter((row) => row.post_id === post.id).length,
      my_reaction: reactions.find((row) => row.user_id === userId) ? 'like' : null,
    };
  }));
}

export async function createCommunityPost(body: string, media?: CommunityMedia, resharedPostId?: string) {
  const text = body.trim();
  if (text.length > 5000 || (!text && !media && !resharedPostId)) throw new Error('Add a message or media before posting.');
  if (media && media.size != null && media.size > 100 * 1024 * 1024) throw new Error('Photos and videos must be smaller than 100 MB.');
  if (media && !['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'].includes(media.mimeType)) {
    throw new Error('Choose a JPG, PNG, WebP, MP4 or QuickTime file.');
  }
  const authorId = await signedInUserId();
  let mediaPath: string | null = null;
  if (media) {
    const response = await fetch(media.uri);
    if (!response.ok) throw new Error('Could not read the selected photo or video.');
    const bytes = await response.arrayBuffer();
    mediaPath = `${authorId}/${Date.now()}-${safeFileName(media.filename)}`;
    const { error: uploadError } = await supabase.storage.from('community-media').upload(mediaPath, bytes, {
      contentType: media.mimeType,
      upsert: false,
    });
    if (uploadError) throw uploadError;
  }
  const { data, error } = await supabase.from('community_posts').insert({
    author_id: authorId,
    body: text,
    media_path: mediaPath,
    media_type: media?.type ?? null,
    reshared_post_id: resharedPostId ?? null,
  }).select('id, author_id, body, media_path, media_type, reshared_post_id, created_at').single();
  if (error) {
    if (mediaPath) await supabase.storage.from('community-media').remove([mediaPath]);
    throw error;
  }
  return data;
}

function safeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-80) || 'media';
}

export async function togglePostLike(postId: string) {
  const userId = await signedInUserId();
  const { data: existing, error: readError } = await supabase.from('community_post_reactions')
    .select('post_id').eq('post_id', postId).eq('user_id', userId).maybeSingle();
  if (readError) throw readError;
  if (existing) {
    const { error } = await supabase.from('community_post_reactions').delete().eq('post_id', postId).eq('user_id', userId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from('community_post_reactions').insert({ post_id: postId, user_id: userId, reaction: 'like' });
  if (error) throw error;
  return true;
}

export async function addPostComment(postId: string, body: string) {
  const text = body.trim();
  if (text.length < 1 || text.length > 2000) throw new Error('Comments must be 1–2,000 characters.');
  const authorId = await signedInUserId();
  const { error } = await supabase.from('community_post_comments').insert({ post_id: postId, author_id: authorId, body: text });
  if (error) throw error;
}

export async function reportCommunityContent(targetType: 'post' | 'comment' | 'user' | 'group' | 'message', targetId: string, reason = 'Reported for review') {
  const reporterId = await signedInUserId();
  const { error } = await supabase.from('content_reports').insert({
    reporter_id: reporterId,
    target_type: targetType,
    target_id: targetId,
    reason: reason.trim().slice(0, 1000),
  });
  if (error) throw error;
}

export async function blockCommunityUser(blockedId: string, friendshipId?: string | null) {
  const blockerId = await signedInUserId();
  if (blockedId === blockerId) throw new Error('You cannot block your own account.');
  const { error } = await supabase.from('user_blocks').upsert({ blocker_id: blockerId, blocked_id: blockedId }, { onConflict: 'blocker_id,blocked_id' });
  if (error) throw error;
  if (friendshipId) {
    const { error: removeError } = await supabase.rpc('grateapex_remove_friendship', { p_friendship_id: friendshipId });
    if (removeError) throw removeError;
  }
}

export async function listPostComments(postId: string) {
  const { data, error } = await supabase.from('community_post_comments')
    .select('id, author_id, body, created_at').eq('post_id', postId).is('deleted_at', null)
    .order('created_at', { ascending: true }).limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function listOpenStudyGroups() {
  const { data, error } = await supabase
    .from('study_groups')
    .select('id, owner_id, title, description, visibility, created_at')
    .eq('visibility', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as StudyGroup[];
}

/** Lists open rooms plus groups visible through the current learner's membership/friendships. */
export async function listVisibleStudyGroups() {
  const userId = await signedInUserId();
  const { data, error } = await supabase
    .from('study_groups')
    .select('id, owner_id, title, description, visibility, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const { data: memberships, error: memberError } = await supabase.from('group_memberships')
    .select('group_id, status, role').eq('user_id', userId);
  if (memberError) throw memberError;
  const membershipByGroup = new Map((memberships ?? []).map((row) => [row.group_id as string, row]));
  return ((data ?? []) as StudyGroup[]).map((group) => {
    const membership = membershipByGroup.get(group.id);
    return {
      ...group,
      is_member: membership?.status === 'active',
      membership_status: membership?.status,
      membership_role: membership?.role,
    };
  });
}

export async function createStudyGroup(input: { title: string; description?: string; visibility?: StudyGroup['visibility'] }) {
  const { data, error } = await supabase.rpc('grateapex_create_study_group', {
    p_title: input.title,
    p_description: input.description ?? '',
    p_visibility: input.visibility ?? 'friends',
  });
  if (error) throw error;
  return data as string;
}

export async function joinStudyGroup(groupId: string) {
  const { data, error } = await supabase.rpc('grateapex_join_open_study_group', { p_group: groupId });
  if (error) throw error;
  return Boolean(data);
}

export async function inviteFriendToGroup(groupId: string, friendId: string) {
  const { data, error } = await supabase.rpc('grateapex_invite_group_friend', {
    p_group: groupId,
    p_friend: friendId,
  });
  if (error) throw error;
  return Boolean(data);
}

export async function respondToGroupInvite(groupId: string, accept: boolean) {
  const { data, error } = await supabase.rpc('grateapex_respond_group_invite', {
    p_group: groupId,
    p_accept: accept,
  });
  if (error) throw error;
  return Boolean(data);
}

export async function listGroupDiscussion(groupId: string, limit = 100) {
  const { data, error } = await supabase
    .from('group_discussions')
    .select('id, group_id, author_id, parent_id, body, created_at, edited_at, deleted_at')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 200));
  if (error) throw error;
  return ((data ?? []) as GroupDiscussionPost[]).reverse();
}

export async function postToGroupDiscussion(groupId: string, body: string, parentId?: string) {
  const text = body.trim();
  if (text.length < 1 || text.length > 5000) throw new Error('Posts must be 1–5,000 characters.');
  const authorId = await signedInUserId();
  const { data, error } = await supabase
    .from('group_discussions')
    .insert({ group_id: groupId, author_id: authorId, body: text, parent_id: parentId ?? null })
    .select('id, group_id, author_id, parent_id, body, created_at, edited_at, deleted_at')
    .single();
  if (error) throw error;
  return data as GroupDiscussionPost;
}

export async function getOrCreateFriendConversation(friendId: string) {
  const { data, error } = await supabase.rpc('grateapex_get_or_create_dm', { p_other: friendId });
  if (error) throw error;
  return data as string;
}

export async function listConversationMessages(conversationId: string, limit = 100) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, created_at, edited_at, deleted_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 200));
  if (error) throw error;
  return ((data ?? []) as CommunityMessage[]).reverse();
}

export async function sendCommunityMessage(conversationId: string, body: string) {
  const text = body.trim();
  if (text.length < 1 || text.length > 5000) throw new Error('Messages must be 1–5,000 characters.');
  const senderId = await signedInUserId();
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body: text })
    .select('id, conversation_id, sender_id, body, created_at, edited_at, deleted_at')
    .single();
  if (error) throw error;
  return data as CommunityMessage;
}

export async function deleteCommunityMessage(messageId: string) {
  const userId = await signedInUserId();
  const { error } = await supabase.from('messages').update({ deleted_at: new Date().toISOString() }).eq('id', messageId).eq('sender_id', userId);
  if (error) throw error;
}

export async function listFriendChallenges() {
  const { data, error } = await supabase
    .from('friend_challenges')
    .select('id, challenger_id, opponent_id, title, topic_id, status, created_at, starts_at, ends_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as FriendChallenge[];
}

export async function createFriendChallenge(friendId: string, title = 'Study challenge', topicId?: string) {
  const { data, error } = await supabase.rpc('grateapex_create_friend_challenge', {
    p_opponent: friendId,
    p_title: title,
    p_topic_id: topicId ?? null,
  });
  if (error) throw error;
  return data as string;
}

export async function respondToFriendChallenge(challengeId: string, accept: boolean) {
  const { data, error } = await supabase.rpc('grateapex_respond_friend_challenge', {
    p_challenge: challengeId,
    p_accept: accept,
  });
  if (error) throw error;
  return data as FriendChallenge['status'];
}

export async function getStreakFreezeBalance() {
  const userId = await signedInUserId();
  const { data, error } = await supabase
    .from('streak_freeze_inventory')
    .select('user_id, available, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data as StreakFreezeBalance | null) ?? { user_id: userId, available: 0, updated_at: '' };
}

export async function recordStreakActivityWithFreeze(at = Date.now()) {
  const { data, error } = await supabase.rpc('grateapex_record_streak_activity', {
    p_today: dayKey(at),
  });
  if (error) throw error;
  return Number(data ?? 0);
}

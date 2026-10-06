import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform, Share, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Sheet } from '@/components/ui/sheet';
import { addPostComment, createCommunityPost, deleteCommunityPost, listCommunityFeed, listPostComments, reportCommunityContent, togglePostLike, type CommunityMedia, type CommunityPost } from '@/data/community';
import { personName, type SocialPerson, useSocial } from '@/data/social';
import { useDisplayName } from '@/data/user';
import { Radius, Type, type ThemeColors } from '@/constants/theme';
import { MentionInput } from '@/components/social/mention-input';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

type PostComment = { id: string; author_id: string; body: string; created_at: string };

export function CommunityPostsFeed() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const social = useSocial();
  const displayName = useDisplayName();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [media, setMedia] = useState<CommunityMedia | undefined>();
  const [busy, setBusy] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const nextPosts = await listCommunityFeed();
      setPosts(nextPosts);
      setSelectedPost((current) => current ? nextPosts.find((post) => post.id === current.id) ?? current : current);
    }
    catch (caught) { setError(getErrorMessage(caught, 'Could not load posts.')); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { queueMicrotask(() => { void refresh(); }); }, [refresh]);

  useEffect(() => {
    const channel = supabase
      .channel('community-posts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => { void refresh(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_post_comments' }, () => { void refresh(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_post_reactions' }, () => { void refresh(); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [refresh]);

  async function chooseMedia() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { setError('Allow photo library access to attach media.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 0.85, videoMaxDuration: 60 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type = asset.type === 'video' ? 'video' : 'image';
    setMedia({ uri: asset.uri, type, mimeType: asset.mimeType ?? (type === 'video' ? 'video/mp4' : 'image/jpeg'), filename: asset.fileName ?? `grateapex-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`, size: asset.fileSize });
    setError(null);
  }

  async function publish(resharedPostId?: string) {
    if ((!draft.trim() && !media && !resharedPostId) || busy) return;
    setBusy(true);
    setError(null);
    try {
      await createCommunityPost(draft, media, resharedPostId);
      setDraft('');
      setMedia(undefined);
      setComposeOpen(false);
      setNotice(resharedPostId ? 'Reposted to your feed.' : 'Your post is live for your friends.');
      await refresh();
    } catch (caught) { setError(getErrorMessage(caught, 'Could not publish this post.')); }
    finally { setBusy(false); }
  }

  async function like(post: CommunityPost) {
    try {
      const liked = await togglePostLike(post.id);
      setPosts((all) => all.map((item) => item.id === post.id ? { ...item, my_reaction: liked ? 'like' : null, reactions: Math.max(0, item.reactions + (liked ? 1 : -1)) } : item));
      setSelectedPost((item) => item?.id === post.id ? { ...item, my_reaction: liked ? 'like' : null, reactions: Math.max(0, item.reactions + (liked ? 1 : -1)) } : item);
    } catch (caught) {
      setError(getErrorMessage(caught, 'Could not update this reaction.'));
    }
  }

  async function sharePost(post: CommunityPost) {
    const appUrl = 'https://grateapex.vercel.app/';
    const message = `${post.body.trim() || 'A post from my GrAteApex Hub community'}\n\n${appUrl}`;
    try {
      if (Platform.OS === 'web') {
        const browserNavigator = globalThis.navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (typeof browserNavigator.share === 'function') {
          await browserNavigator.share({ title: 'GrAteApex Hub', text: post.body.trim(), url: appUrl });
        } else if (browserNavigator.clipboard?.writeText) {
          await browserNavigator.clipboard.writeText(message);
          setNotice('Post text and app link copied.');
        } else {
          setNotice(message);
        }
        return;
      }
      const result = await Share.share({ message, title: 'GrAteApex Hub' });
      if (result.action === Share.sharedAction) setNotice('Post shared.');
    } catch (caught) {
      if (caught instanceof Error && caught.name === 'AbortError') return;
      setError(getErrorMessage(caught, 'Could not share this post.'));
    }
  }

  async function openPost(post: CommunityPost) {
    setSelectedPost(post);
    setComments([]);
    setCommentDraft('');
    try { setComments(await listPostComments(post.id) as PostComment[]); }
    catch (caught) { setError(getErrorMessage(caught, 'Could not load comments.')); }
  }

  async function sendComment() {
    if (!selectedPost || !commentDraft.trim()) return;
    setBusy(true);
    try {
      await addPostComment(selectedPost.id, commentDraft);
      setCommentDraft('');
      setComments(await listPostComments(selectedPost.id) as PostComment[]);
      setPosts((all) => all.map((post) => post.id === selectedPost.id ? { ...post, comments: post.comments + 1 } : post));
      setSelectedPost((post) => post?.id === selectedPost.id ? { ...post, comments: post.comments + 1 } : post);
    } catch (caught) { setError(getErrorMessage(caught, 'Could not add your comment.')); }
    finally { setBusy(false); }
  }

  async function report(targetType: 'post' | 'comment' | 'user', id: string) {
    try { await reportCommunityContent(targetType, id); setNotice('Thanks. Your report has been sent privately for review.'); }
    catch (caught) { setError(getErrorMessage(caught, 'Could not send the report.')); }
  }

  async function deletePost(post: CommunityPost) {
    try {
      await deleteCommunityPost(post.id, post.media_path);
      setPosts((all) => all.filter((item) => item.id !== post.id));
      setSelectedPost((current) => current?.id === post.id ? null : current);
      setNotice('Post and its attached upload were deleted.');
      setError(null);
    } catch (caught) {
      setError(getErrorMessage(caught, 'Could not delete this post.'));
    }
  }

  function confirmDeletePost(post: CommunityPost) {
    if (Platform.OS === 'web') {
      if (globalThis.confirm('Delete this post and its attached photo or video?')) void deletePost(post);
      return;
    }
    Alert.alert('Delete this post?', 'This removes the post and its attached photo or video from your feed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { void deletePost(post); } },
    ]);
  }

  return (
    <View style={styles.feed}>
      <Card style={styles.composerCard}>
        <View style={styles.composerHeader}>
          <Avatar name={displayName || 'You'} size={40} ring="subtle" />
          <Text style={styles.composerPrompt}>Share what’s on your mind</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Write a post" variant="secondary" size="sm" onPress={() => setComposeOpen(true)} />
          <Button label="Add photo or video" variant="ghost" size="sm" icon={<Icon name="image" size={16} color={colors.primaryText} />} onPress={() => { setComposeOpen(true); void chooseMedia(); }} />
        </View>
      </Card>
      {notice ? <Text accessibilityRole="text" style={styles.notice}>{notice}</Text> : null}
      {error ? <Card style={styles.errorCard}><Text style={styles.errorTitle}>Community feed issue</Text><Text style={styles.muted}>{error}</Text><Button label="Try again" size="sm" variant="secondary" onPress={() => void refresh()} /></Card> : null}
      {loading ? <Text style={styles.muted}>Loading your friends’ posts…</Text> : null}
      {!loading && !posts.length && !error ? <Card style={styles.empty}><Icon name="social" size={22} color={colors.primaryText} /><Text style={styles.emptyTitle}>Your feed is ready for your circle</Text><Text style={styles.muted}>Posts from you and accepted friends will appear here.</Text></Card> : null}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} socialPeople={social.people} ownId={social.userId} ownName={displayName || 'You'} onOpen={() => void openPost(post)} onLike={() => void like(post)} onComment={() => void openPost(post)} onReshare={() => void publish(post.id)} onShare={() => void sharePost(post)} onReport={() => void report('post', post.id)} onDelete={() => confirmDeletePost(post)} />
      ))}
      <Sheet visible={composeOpen} onClose={() => setComposeOpen(false)} title="Create a post" subtitle="Share something with accepted friends.">
        <View style={styles.composeSheet}>
        <Text style={styles.muted}>Share how you’re feeling, what’s happening in your life, or anything you’d like your friends to know.</Text>
        <MentionInput people={social.people} value={draft} onChangeText={setDraft} multiline maxLength={5000} placeholder="What’s on your mind today?" placeholderTextColor={colors.textTertiary} accessibilityLabel="Write a post" style={styles.postInput} />
          {media ? <View style={styles.mediaSelected}><Icon name={media.type === 'video' ? 'play' : 'image'} size={16} color={colors.primaryText} /><Text style={styles.muted}>{media.filename}</Text><Button label="Remove" size="sm" variant="ghost" onPress={() => setMedia(undefined)} /></View> : null}
          <View style={styles.actions}>
            <Button label="Choose photo or video" variant="secondary" size="sm" onPress={() => void chooseMedia()} />
            <Button label="Publish" size="sm" onPress={() => void publish()} loading={busy} disabled={(!draft.trim() && !media) || busy} />
          </View>
        </View>
      </Sheet>
      <Sheet visible={selectedPost !== null} onClose={() => setSelectedPost(null)} title="Post" subtitle={selectedPost ? `${selectedPost.comments} comments · ${selectedPost.reshares} reshares` : undefined} width={800}>
        <View style={styles.postDetailSheet}>
          {selectedPost ? <PostCard post={selectedPost} socialPeople={social.people} ownId={social.userId} ownName={displayName || 'You'} verticalActions onOpen={() => {}} onLike={() => void like(selectedPost)} onComment={() => void openPost(selectedPost)} onReshare={() => void publish(selectedPost.id)} onShare={() => void sharePost(selectedPost)} onReport={() => void report('post', selectedPost.id)} onDelete={() => confirmDeletePost(selectedPost)} /> : null}
          <View style={styles.commentSheet}>
          {comments.map((comment) => <View key={comment.id} style={styles.comment}><View style={styles.commentHead}><Text style={styles.commentAuthor}>{comment.author_id === social.userId ? 'You' : 'Friend'}</Text><Button label="Report" variant="ghost" size="sm" onPress={() => void report('comment', comment.id)} /></View><Text style={styles.body}>{comment.body}</Text></View>)}
          {!comments.length ? <Text style={styles.muted}>Be the first to comment.</Text> : null}
          <MentionInput people={social.people} value={commentDraft} onChangeText={setCommentDraft} maxLength={2000} placeholder="Add a comment…" placeholderTextColor={colors.textTertiary} accessibilityLabel="Write a comment" style={styles.input} />
          <Button label="Comment" size="sm" onPress={() => void sendComment()} loading={busy} disabled={!commentDraft.trim() || busy} />
          </View>
        </View>
      </Sheet>
    </View>
  );
}

function getErrorMessage(caught: unknown, fallback: string) {
  if (typeof caught === 'string' && caught.trim()) return caught;
  if (caught instanceof Error && caught.message) return caught.message;
  if (caught && typeof caught === 'object' && 'message' in caught && typeof caught.message === 'string' && caught.message.trim()) {
    const code = 'code' in caught && typeof caught.code === 'string' ? ` (${caught.code})` : '';
    return `${caught.message}${code}`;
  }
  return fallback;
}

function PostCard({ post, socialPeople, ownId, ownName, onOpen, onLike, onComment, onReshare, onShare, onReport, onDelete, verticalActions = false }: {
  post: CommunityPost; socialPeople: readonly SocialPerson[]; ownId: string | null; ownName: string;
  onOpen: () => void; verticalActions?: boolean;
  onLike: () => void; onComment: () => void; onReshare: () => void; onShare: () => void; onReport: () => void; onDelete: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const friend = socialPeople.find((person) => person.userId === post.author_id);
  const name = friend ? personName(friend) : post.author_id === ownId ? ownName : 'Friend';
  const resharedFriend = socialPeople.find((person) => person.userId === post.reshared_author_id);
  const resharedName = post.reshared_author_id === ownId ? ownName : resharedFriend ? personName(resharedFriend) : 'Friend';
  return (
    <Card style={[styles.postCard, verticalActions && styles.postDetailCard]}>
      <View style={verticalActions ? styles.postDetailLayout : undefined}>
      <View style={verticalActions ? styles.postDetailContent : styles.postContent}>
      <View style={styles.postHead}><Interactive onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Open post by ${name}`} style={styles.postAuthor}><Avatar uri={friend?.avatarUrl ?? null} name={name} size={42} ring="subtle" /><View style={styles.flex}><Text style={styles.author}>{name}</Text><Text style={styles.muted}>{new Date(post.created_at).toLocaleString()}</Text></View></Interactive>{post.reshared_post_id ? <Pill label="Reposted" /> : null}{post.author_id === ownId ? <Interactive onPress={onDelete} accessibilityLabel="Delete post" style={styles.deleteAction}><Icon name="trash" size={18} color={colors.error} /></Interactive> : null}</View>
      {post.body ? <Interactive onPress={onOpen} accessibilityRole="button" accessibilityLabel="Open post" style={styles.postBodyOpen}><Text style={styles.body}>{post.body}</Text></Interactive> : null}
      {post.reshared_post_id ? (
        <View style={styles.reshareBox}>
          <Text style={styles.muted}>Original post by {resharedName}</Text>
          {post.reshared_body ? <Text style={styles.body}>{post.reshared_body}</Text> : null}
          {post.reshared_media_url && post.reshared_media_type === 'image' ? <Image source={{ uri: post.reshared_media_url }} contentFit="cover" style={styles.image} accessibilityLabel="Reshared photo" /> : null}
          {post.reshared_media_url && post.reshared_media_type === 'video' ? <Interactive onPress={() => void Linking.openURL(post.reshared_media_url!).catch(() => {})} style={styles.video}><Icon name="play" size={22} color={colors.onPrimary} filled /><Text style={styles.videoText}>Open reshared video</Text></Interactive> : null}
        </View>
      ) : null}
      {post.media_url && post.media_type === 'image' ? <Interactive onPress={onOpen} accessibilityRole="button" accessibilityLabel="Open photo post"><Image source={{ uri: post.media_url }} contentFit="cover" style={styles.image} accessibilityLabel="Photo in community post" /></Interactive> : null}
      {post.media_url && post.media_type === 'video' ? <Interactive onPress={() => void Linking.openURL(post.media_url!).catch(() => {})} accessibilityRole="link" accessibilityLabel="Open video" style={styles.video}><Icon name="play" size={26} color={colors.onPrimary} filled /><Text style={styles.videoText}>Open video</Text></Interactive> : null}
      {!verticalActions ? <Text style={styles.counts}>{post.reactions} likes · {post.comments} comments · {post.reshares} reshares</Text> : <Text style={styles.counts}>{post.reactions} likes</Text>}
      {!verticalActions ? <View style={styles.postActions}>
        <Interactive onPress={onLike} accessibilityRole="button" accessibilityLabel={post.my_reaction ? 'Unlike post' : 'Like post'} style={styles.action}><Icon name="heart" size={17} color={post.my_reaction ? colors.primaryText : colors.textSecondary} filled={Boolean(post.my_reaction)} /><Text style={[styles.actionText, post.my_reaction && { color: colors.primaryText }]}>Like</Text></Interactive>
        <Interactive onPress={onComment} accessibilityRole="button" accessibilityLabel={`Comment on post, ${post.comments} comments`} style={styles.action}><Icon name="mail" size={17} color={colors.textSecondary} /><Text style={styles.actionText}>Comment · {post.comments}</Text></Interactive>
        <Interactive onPress={onReshare} accessibilityRole="button" accessibilityLabel={`Repost, ${post.reshares} reshares`} style={styles.action}><Icon name="connection" size={17} color={colors.textSecondary} /><Text style={styles.actionText}>Repost · {post.reshares}</Text></Interactive>
        <Interactive onPress={onShare} accessibilityRole="button" accessibilityLabel="Share post" style={styles.action}><Icon name="share" size={17} color={colors.textSecondary} /><Text style={styles.actionText}>Share</Text></Interactive>
        <Interactive onPress={onReport} accessibilityRole="button" accessibilityLabel="Report post" style={styles.action}><Icon name="warning" size={17} color={colors.textSecondary} /><Text style={styles.actionText}>Report</Text></Interactive>
      </View> : null}
      </View>
      {verticalActions ? <View style={styles.postActionsVertical}>
        <Interactive onPress={onLike} accessibilityRole="button" accessibilityLabel={`${post.my_reaction ? 'Unlike' : 'Like'} post, ${post.reactions} likes`} style={styles.railAction}><Icon name="heart" size={21} color={post.my_reaction ? colors.primaryText : colors.textSecondary} filled={Boolean(post.my_reaction)} /><Text style={styles.railCount}>{post.reactions}</Text></Interactive>
        <Interactive onPress={onComment} accessibilityRole="button" accessibilityLabel={`Comment, ${post.comments} comments`} style={styles.railAction}><Icon name="mail" size={21} color={colors.textSecondary} /><Text style={styles.railCount}>{post.comments}</Text></Interactive>
        <Interactive onPress={onReshare} accessibilityRole="button" accessibilityLabel={`Repost, ${post.reshares} reshares`} style={styles.railAction}><Icon name="connection" size={21} color={colors.textSecondary} /><Text style={styles.railCount}>{post.reshares}</Text></Interactive>
        <Interactive onPress={onShare} accessibilityRole="button" accessibilityLabel="Share post" style={styles.railAction}><Icon name="share" size={21} color={colors.textSecondary} /><Text style={styles.railLabel}>Share</Text></Interactive>
        <Interactive onPress={onReport} accessibilityRole="button" accessibilityLabel="Report post" style={styles.railAction}><Icon name="warning" size={19} color={colors.textSecondary} /><Text style={styles.railLabel}>Report</Text></Interactive>
      </View> : null}
      </View>
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    feed: { gap: 12, marginBottom: 16 },
    notice: { ...Type.caption, color: colors.successText },
    composerCard: { gap: 12 },
    composerHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    composerPrompt: { ...Type.callout, color: colors.textSecondary },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    postCard: { gap: 11 },
    postDetailCard: { padding: 0, borderWidth: 0, backgroundColor: 'transparent', elevation: 0 },
    postDetailLayout: { flexDirection: 'row', alignItems: 'stretch', gap: 12 },
    postDetailContent: { flex: 1, minWidth: 0, gap: 11 },
    postContent: { gap: 11 },
    postBodyOpen: { alignSelf: 'stretch' },
    postHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    postAuthor: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 },
    deleteAction: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    flex: { flex: 1, minWidth: 0 },
    author: { ...Type.headline, color: colors.text },
    body: { ...Type.callout, color: colors.text, lineHeight: 21 },
    muted: { ...Type.caption, color: colors.textTertiary },
    counts: { ...Type.caption, color: colors.textTertiary },
    image: { width: '100%', height: 320, borderRadius: 14, backgroundColor: colors.surfaceMuted },
    video: { minHeight: 180, borderRadius: 14, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', gap: 8 },
    videoText: { ...Type.caption, color: colors.onSecondary },
    reshareBox: { gap: 9, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, backgroundColor: colors.surfaceMuted },
    postActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 8, gap: 8 },
    postActionsVertical: { width: 62, alignItems: 'center', gap: 14, borderLeftWidth: 1, borderLeftColor: colors.divider, paddingLeft: 8, paddingTop: 8 },
    railAction: { minWidth: 48, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 3 },
    railCount: { ...Type.caption, fontWeight: '800', color: colors.textSecondary },
    railLabel: { ...Type.caption, color: colors.textSecondary },
    action: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 7 },
    actionText: { ...Type.caption, fontWeight: '700', color: colors.textSecondary },
    composeSheet: { gap: 12 },
    postInput: { minHeight: 140, textAlignVertical: 'top', padding: 13, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 14, backgroundColor: colors.surfaceSunken, color: colors.text, fontSize: 15 },
    mediaSelected: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    input: { minHeight: 42, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: Radius.md, backgroundColor: colors.surfaceSunken, paddingHorizontal: 12, color: colors.text, fontSize: 14 },
    postDetailSheet: { gap: 16 },
    commentSheet: { gap: 10, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 },
    comment: { gap: 4, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.divider },
    commentAuthor: { ...Type.caption, fontWeight: '800', color: colors.primaryText },
    commentHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    empty: { gap: 9, alignItems: 'center', padding: 20 },
    emptyTitle: { ...Type.title3, color: colors.text, textAlign: 'center' },
    errorCard: { gap: 8 },
    errorTitle: { ...Type.headline, color: colors.error },
  });
}

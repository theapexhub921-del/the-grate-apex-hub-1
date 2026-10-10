import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { PageHeader, Screen } from '@/components/ui/screen';
import { InlineNotice, LoadingState } from '@/components/ui/state-views';
import { MentionInput } from '@/components/social/mention-input';
import { Radius, Type, type ThemeColors } from '@/constants/theme';
import { deleteCommunityMessage, getOrCreateFriendConversation, listConversationMessages, sendCommunityMessage, type CommunityMessage } from '@/data/community';
import { useSocial } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

export default function DirectMessageScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { user } = useAuth();
  const social = useSocial();
  const params = useLocalSearchParams<{ friend?: string | string[]; name?: string | string[] }>();
  const friendId = Array.isArray(params.friend) ? params.friend[0] : params.friend;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CommunityMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ScrollView>(null);

  const refresh = useCallback(async (id: string) => {
    setError(null);
    try {
      setMessages(await listConversationMessages(id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!friendId) {
      queueMicrotask(() => { if (active) { setLoading(false); setError('Choose a friend to start messaging.'); } });
      return () => { active = false; };
    }
    getOrCreateFriendConversation(friendId).then(async (id) => {
      if (!active) return;
      setConversationId(id);
      await refresh(id);
    }).catch((caught) => {
      if (!active) return;
      setError(caught instanceof Error ? caught.message : 'Could not open this conversation.');
      setLoading(false);
    });
    return () => { active = false; };
  }, [friendId, refresh]);

  // Messages reload on user actions

  async function send() {
    if (!conversationId || !draft.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await sendCommunityMessage(conversationId, draft);
      setDraft('');
      await refresh(conversationId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send this message.');
    } finally {
      setBusy(false);
    }
  }

  async function removeMessage() {
    if (!deleteTarget || !conversationId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await deleteCommunityMessage(conversationId, deleteTarget.id);
      setDeleteTarget(null);
      await refresh(conversationId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete this message.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen width="prose">
      <BackLink fallback={'/social/messages' as never} />
      <PageHeader title={name ? `Chat with ${name}` : 'Direct message'} subtitle="Text conversation with your friend." />
      {error ? <InlineNotice tone="warning" title="Conversation unavailable" message={`${error} Direct messages work between friends who follow each other.`} /> : null}
      {loading ? <LoadingState label="Loading conversation" /> : null}
      <ScrollView ref={messagesRef} style={styles.messages} contentContainerStyle={styles.messageList} onContentSizeChange={() => messagesRef.current?.scrollToEnd({ animated: true })}>
        {messages.map((message) => {
          const mine = message.sender_id === user?.id;
          return (
            <View key={message.id} style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.messageText, mine && styles.mineText]}>{message.deleted_at ? 'This message was deleted.' : message.body}</Text>
              <View style={styles.messageFooter}>
                <Text style={[styles.time, mine && styles.mineTime]}>{new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
                {mine && !message.deleted_at ? <Interactive onPress={() => setDeleteTarget(message)} accessibilityLabel="Delete this message" style={styles.deleteButton}><Icon name="trash" size={14} color={mine ? colors.onPrimaryMuted : colors.error} /></Interactive> : null}
              </View>
            </View>
          );
        })}
        {!messages.length && !loading && !error ? <Text style={styles.empty}>Say hello or share what you’re studying.</Text> : null}
      </ScrollView>
      <Card style={styles.composer}>
        <MentionInput people={social.people} value={draft} onChangeText={setDraft} maxLength={5000} multiline placeholder="Write a message…" placeholderTextColor={colors.textTertiary} accessibilityLabel="Write a message" style={styles.input} />
        <Button label="Send" onPress={() => void send()} loading={busy} disabled={!draft.trim() || busy || !conversationId} />
      </Card>
      <Sheet visible={deleteTarget !== null} onClose={() => { if (!busy) setDeleteTarget(null); }} title="Delete this message?" subtitle="The message will be marked as deleted for everyone in this conversation." footer={<View style={styles.confirmActions}><Button label="Cancel" variant="secondary" onPress={() => setDeleteTarget(null)} disabled={busy} /><Button label="Delete message" variant="danger" onPress={() => void removeMessage()} loading={busy} /></View>}>
        <Text style={styles.empty}>You can’t undo this action.</Text>
      </Sheet>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    messages: { maxHeight: 470, minHeight: 180, marginBottom: 12 },
    messageList: { gap: 8, justifyContent: 'flex-end', paddingVertical: 6 },
    bubble: { maxWidth: '86%', paddingHorizontal: 13, paddingVertical: 9, borderRadius: Radius.lg, gap: 4 },
    mine: { alignSelf: 'flex-end', backgroundColor: colors.primary },
    theirs: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    messageText: { ...Type.callout, color: colors.text },
    mineText: { color: colors.onPrimary },
    time: { fontSize: 10, color: colors.textTertiary, alignSelf: 'flex-end' },
    messageFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 9 },
    deleteButton: { padding: 4 },
    confirmActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    mineTime: { color: colors.onPrimaryMuted },
    empty: { ...Type.callout, color: colors.textTertiary, textAlign: 'center', marginTop: 30 },
    composer: { gap: 10 },
    input: { minHeight: 52, maxHeight: 140, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.borderStrong, borderRadius: Radius.md, backgroundColor: colors.surfaceSunken, padding: 12, color: colors.text, fontSize: 14 },
  });
}

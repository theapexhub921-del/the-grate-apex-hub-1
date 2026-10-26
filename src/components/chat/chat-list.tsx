import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { PersonAvatar } from '@/components/social/profile-card';
import { NewGroupSheet } from '@/components/chat/group-info';
import { Avatar } from '@/components/ui/avatar';
import { listMyGroups, type GroupSummary } from '@/data/group-chat';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { Text, TextInput } from '@/components/ui/text';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { Type, type ThemeColors } from '@/constants/theme';
import { isChatMuted, MUTE_ALWAYS, MUTE_CHOICES, muteChat, PIN_LIMIT, toggleArchivedChat, togglePinnedChat, useChatListPrefs } from '@/data/chat-list-prefs';
import { listMyConversations, type ConversationSummary } from '@/data/community';
import { loadFriendStreak } from '@/data/friend-streak-store';
import { personName, refreshFriendPresence, useSocial } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

const streaks = new Map<string, { at: number; value: number }>();

function when(at: number) {
  const minutes = Math.max(0, Math.round((Date.now() - at) / 60_000));
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return days < 7 ? `${days}d` : `${Math.round(days / 7)}w`;
}

// The chats list (like Instagram / WhatsApp): you, a new-message button,
// search, friends to start a chat with, then every chat with its last message,
// time, unread dot and friend streak. Chats can be pinned (top), archived (under
// "Archived") and muted, from a long-press or right-click (data/chat-list-prefs.ts).
export function ChatList({ activeId, onOpen, onOpenGroup }: { activeId?: string | null; onOpen: (friendId: string, name: string) => void; onOpenGroup: (groupId: string, name: string) => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { user } = useAuth();
  const social = useSocial();
  const [chats, setChats] = useState<ConversationSummary[] | null>(null);
  const [query, setQuery] = useState('');
  const [compose, setCompose] = useState(false);
  const [newGroup, setNewGroup] = useState(false);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [, setTick] = useState(0);
  const prefs = useChatListPrefs();
  const [showArchived, setShowArchived] = useState(false);
  const [actions, setActions] = useState<{ id: string; label: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const friends = social.people.filter((person) => person.relationship === 'friends');
  const requests = social.people.filter((person) => person.relationship === 'incoming').length;
  const known = new Map(social.people.map((person) => [person.userId, person]));

  useFocusEffect(useCallback(() => {
    let live = true;
    void refreshFriendPresence(); // friends' online dots (at most every 10 minutes)
    const load = async () => {
      const [list, mine] = await Promise.all([listMyConversations(40).catch(() => [] as ConversationSummary[]), listMyGroups().catch(() => [] as GroupSummary[])]);
      if (!live) return;
      setChats(list);
      setGroups(mine);
      // Friend streaks for the first chats (cached for 10 minutes).
      for (const chat of list.slice(0, 12)) {
        const hit = streaks.get(chat.id);
        if (hit && Date.now() - hit.at < 10 * 60_000) continue;
        const status = user && chat.otherId ? await loadFriendStreak(chat.otherId).catch(() => null) : null;
        streaks.set(chat.id, { at: Date.now(), value: status?.streak ?? 0 });
        if (live) setTick((n) => n + 1);
      }
    };
    void load();
    const timer = setInterval(() => void load(), 15_000);
    return () => { live = false; clearInterval(timer); };
  }, [user]));

  const q = query.trim().toLowerCase();
  const nameOf = (uid: string, fallback: string | null) => {
    const person = known.get(uid);
    return person ? personName(person) : fallback ? `@${fallback}` : 'Friend';
  };
  const shown = (chats ?? []).filter((chat) => !q || nameOf(chat.otherId, chat.otherName).toLowerCase().includes(q) || chat.lastText.toLowerCase().includes(q));
  const shownGroups = groups.filter((group) => !q || group.name.toLowerCase().includes(q));
  // Chats and groups together: pinned first, then newest first (like WhatsApp). Archived chats
  // have their own list; a search looks through all of them.
  const all = [...shown.map((chat) => ({ kind: 'chat' as const, id: chat.id, at: chat.lastAt, chat })), ...shownGroups.map((group) => ({ kind: 'group' as const, id: group.id, at: group.lastAt, group }))];
  const archivedCount = all.filter((entry) => prefs.archived.includes(entry.id)).length;
  const pinRank = (id: string) => { const index = prefs.pinned.indexOf(id); return index < 0 ? Infinity : index; };
  const rows = all
    .filter((entry) => q || (showArchived ? prefs.archived.includes(entry.id) : !prefs.archived.includes(entry.id)))
    .sort((a, b) => (showArchived || q ? 0 : pinRank(a.id) - pinRank(b.id) || 0) || b.at - a.at);
  const flags = (id: string) => (
    <>
      {isChatMuted(prefs, id) ? <Icon name="bellOff" size={13} color={colors.textTertiary} /> : null}
      {!showArchived && prefs.pinned.includes(id) ? <Icon name="pin" size={13} color={colors.textTertiary} /> : null}
    </>
  );
  const openActions = (id: string, label: string) => { setNotice(null); setActions({ id, label }); };
  const chatting = new Set((chats ?? []).map((chat) => chat.otherId));
  const starters = friends.filter((friend) => !q || personName(friend).toLowerCase().includes(q)).sort((a, b) => Number(b.isOnline) - Number(a.isOnline));

  return (
    <View style={styles.list}>
      <View style={styles.top}>
        <Text style={styles.me} numberOfLines={1}>{social.username ? social.username : 'Messages'}</Text>
        <Interactive onPress={() => setCompose(true)} accessibilityRole="button" accessibilityLabel="New message" style={styles.iconButton}><Icon name="edit" size={21} color={colors.text} /></Interactive>
      </View>
      <View style={styles.searchBox}>
        <Icon name="search" size={16} color={colors.textTertiary} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search" placeholderTextColor={colors.textTertiary} accessibilityLabel="Search chats" style={styles.search} />
      </View>
      {starters.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.starters} style={styles.startersWrap}>
          {starters.slice(0, 12).map((friend) => (
            <Interactive key={friend.userId} onPress={() => onOpen(friend.userId, personName(friend))} accessibilityLabel={`Message ${personName(friend)}`} style={styles.starter}>
              <PersonAvatar uid={friend.userId} uri={friend.avatarUrl} name={personName(friend)} size={58} status={friend.isOnline ? 'online' : null} />
              <Text style={styles.starterName} numberOfLines={1}>{personName(friend)}</Text>
            </Interactive>
          ))}
        </ScrollView>
      ) : null}
      <View style={styles.sectionRow}>
        <Text style={styles.section}>Messages</Text>
        <Interactive onPress={() => router.push('/social/friends' as Href)} accessibilityRole="link" style={styles.requests}>
          <Text style={styles.requestsText}>Requests{requests ? ` (${requests})` : ''}</Text>
        </Interactive>
      </View>
      <ScrollView style={styles.rows}>
        {chats === null ? <Text style={styles.muted}>Loading your chats…</Text> : null}
        {!q && (showArchived || archivedCount) ? (
          <Interactive onPress={() => setShowArchived((value) => !value)} accessibilityRole="button" accessibilityLabel={showArchived ? 'Back to chats' : `Archived chats, ${archivedCount}`} style={({ hovered }) => [styles.row, hovered && styles.rowActive]}>
            <View style={styles.archiveIcon}><Icon name={showArchived ? 'chevronLeft' : 'archive'} size={20} color={colors.textSecondary} /></View>
            <Text style={[styles.name, styles.rowText]}>{showArchived ? 'Back to chats' : 'Archived'}</Text>
            {!showArchived ? <Text style={styles.preview}>{archivedCount}</Text> : null}
          </Interactive>
        ) : null}
        {rows.map((entry) => {
          if (entry.kind === 'group') {
            const group = entry.group;
            const active = group.id === activeId;
            return (
              <Interactive key={group.id} onPress={() => onOpenGroup(group.id, group.name)} onLongPress={() => openActions(group.id, group.name)} onContextMenu={() => openActions(group.id, group.name)} accessibilityRole="link" accessibilityLabel={`Group ${group.name}`} accessibilityHint="Long-press for pin, archive and mute" style={({ hovered }) => [styles.row, (active || hovered) && styles.rowActive]}>
                <Avatar name={group.name} size={52} ring="gold" />
                <View style={styles.rowText}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
                    {flags(group.id)}
                  </View>
                  <Text style={styles.preview} numberOfLines={1}>{group.lastFrom === user?.id ? 'You: ' : group.lastName ? `${group.lastName}: ` : ''}{group.lastText} · {when(group.lastAt)}</Text>
                </View>
              </Interactive>
            );
          }
          const chat = entry.chat;
          const person = known.get(chat.otherId);
          const label = nameOf(chat.otherId, chat.otherName);
          const streak = streaks.get(chat.id)?.value ?? 0;
          const active = chat.otherId === activeId;
          return (
            <Interactive key={chat.id} onPress={() => onOpen(chat.otherId, label)} onLongPress={() => openActions(chat.id, label)} onContextMenu={() => openActions(chat.id, label)} accessibilityHint="Long-press for pin, archive and mute" accessibilityRole="link" accessibilityLabel={`Chat with ${label}${chat.unread ? ', unread' : ''}`} style={({ hovered }) => [styles.row, (active || hovered) && styles.rowActive]}>
              <PersonAvatar uid={chat.otherId} uri={person?.avatarUrl ?? null} name={label} size={52} status={person?.isOnline ? 'online' : null} />
              <View style={styles.rowText}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, chat.unread && styles.bold]} numberOfLines={1}>{label}</Text>
                  <VerifiedBadge username={person?.username ?? chat.otherName} uid={chat.otherId} size={13} />
                  {flags(chat.id)}
                  {streak > 0 ? (
                    <View style={styles.streakBadge} accessibilityLabel={`${streak}-day friend streak`}>
                      <Icon name="streak" size={12} color={colors.accentText} filled />
                      <Text style={styles.streak}>{streak}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.preview, chat.unread && styles.previewUnread]} numberOfLines={1}>{chat.lastFromMe ? 'You: ' : ''}{chat.lastText} · {when(chat.lastAt)}</Text>
              </View>
              {chat.unread ? <View style={styles.dot} /> : null}
            </Interactive>
          );
        })}
        {chats && !rows.length && !showArchived ? <Text style={styles.muted}>{q ? 'No chats match.' : friends.length ? 'No chats yet — tap a friend above to say hello.' : 'Follow classmates; when they follow you back you can message each other.'}</Text> : null}
      </ScrollView>

      <Sheet visible={compose} onClose={() => setCompose(false)} title="New message" width={420}>
        <Interactive onPress={() => { setCompose(false); setNewGroup(true); }} accessibilityRole="button" style={styles.composeRow}>
          <View style={styles.groupIcon}><Icon name="social" size={20} color={colors.onPrimary} /></View>
          <Text style={styles.name}>New group</Text>
        </Interactive>
        {friends.map((friend) => (
          <Interactive key={friend.userId} onPress={() => { setCompose(false); onOpen(friend.userId, personName(friend)); }} style={styles.composeRow} accessibilityLabel={`Message ${personName(friend)}`}>
            <PersonAvatar uid={friend.userId} uri={friend.avatarUrl} name={personName(friend)} size={40} />
            <View style={styles.rowText}>
              <Text style={styles.name}>{personName(friend)}</Text>
              <Text style={styles.preview}>{friend.username ? `@${friend.username}` : ''}{chatting.has(friend.userId) ? ' · chatting' : ''}</Text>
            </View>
          </Interactive>
        ))}
        {!friends.length ? <Text style={styles.muted}>You can message friends who follow you back.</Text> : null}
      </Sheet>
      <NewGroupSheet visible={newGroup} onClose={() => setNewGroup(false)} />
      <Sheet visible={actions !== null} onClose={() => setActions(null)} title={actions?.label ?? 'Chat'} width={380}>
        {actions ? (
          <View>
            <ChatAction
              icon="pin"
              label={prefs.pinned.includes(actions.id) ? 'Unpin chat' : 'Pin chat'}
              onPress={() => {
                if (togglePinnedChat(actions.id)) setActions(null);
                else setNotice(`You can pin up to ${PIN_LIMIT} chats. Unpin one first.`);
              }}
            />
            <ChatAction icon="archive" label={prefs.archived.includes(actions.id) ? 'Unarchive chat' : 'Archive chat'} onPress={() => { toggleArchivedChat(actions.id); setActions(null); }} />
            {isChatMuted(prefs, actions.id) ? (
              <ChatAction
                icon="bell"
                label={prefs.muted[actions.id] >= MUTE_ALWAYS ? 'Unmute (muted always)' : `Unmute (muted until ${new Date(prefs.muted[actions.id]).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })})`}
                onPress={() => { muteChat(actions.id, null); setActions(null); }}
              />
            ) : (
              MUTE_CHOICES.map((choice) => <ChatAction key={choice.label} icon="bellOff" label={choice.ms === Infinity ? 'Mute always' : `Mute for ${choice.label}`} onPress={() => { muteChat(actions.id, choice.ms); setActions(null); }} />)
            )}
            {notice ? <Text style={styles.muted}>{notice}</Text> : null}
          </View>
        ) : null}
      </Sheet>
    </View>
  );
}

function ChatAction({ icon, label, onPress }: { icon: 'pin' | 'archive' | 'bell' | 'bellOff'; label: string; onPress: () => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <Interactive onPress={onPress} accessibilityRole="button" style={({ hovered }) => [styles.actionRow, hovered && styles.rowActive]}>
      <Icon name={icon} size={18} color={colors.text} />
      <Text style={styles.name}>{label}</Text>
    </Interactive>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: { flex: 1, minHeight: 0 },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
    me: { ...Type.title3, color: colors.text, flexShrink: 1 },
    iconButton: { padding: 8, borderRadius: 999 },
    searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 12, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.surfaceSunken, borderWidth: 1, borderColor: colors.border },
    search: { flex: 1, paddingVertical: 9, color: colors.text, fontSize: 14.5 },
    startersWrap: { flexGrow: 0 },
    starters: { gap: 14, paddingHorizontal: 14, paddingVertical: 14 },
    starter: { width: 70, alignItems: 'center', gap: 4 },
    starterName: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6 },
    section: { ...Type.headline, color: colors.text },
    requests: { padding: 4 },
    requestsText: { fontSize: 13.5, fontWeight: '700', color: colors.textSecondary },
    rows: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, marginHorizontal: 4 },
    rowActive: { backgroundColor: colors.surfaceMuted },
    rowText: { flex: 1, minWidth: 0, gap: 2 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    name: { fontSize: 14.5, fontWeight: '600', color: colors.text, flexShrink: 1 },
    bold: { fontWeight: '800' },
    streak: { fontSize: 12, fontWeight: '800', color: colors.accentText },
    streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    preview: { fontSize: 12.5, color: colors.textSecondary },
    previewUnread: { color: colors.text, fontWeight: '700' },
    dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
    muted: { fontSize: 13, color: colors.textTertiary, padding: 16, textAlign: 'center' },
    groupIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
    archiveIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 10 },
    composeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  });
}

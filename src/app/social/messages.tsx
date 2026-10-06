import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, Interactive } from '@/components/ui/interactive';
import { PageHeader, Screen } from '@/components/ui/screen';
import { EmptyState, InlineNotice, LoadingState } from '@/components/ui/state-views';
import { Type, type ThemeColors } from '@/constants/theme';
import { personName, useSocial } from '@/data/social';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

export default function MessagesScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const social = useSocial();
  const friends = social.people.filter((person) => person.relationship === 'friends');

  return (
    <Screen width="prose">
      <BackLink fallback={'/social' as never} />
      <PageHeader title="Messages" subtitle="Private text conversations with accepted friends." />
      {social.status === 'loading' && !friends.length ? <LoadingState label="Loading friends" /> : null}
      {social.status === 'error' ? <InlineNotice tone="warning" title="Messages unavailable" message={social.error ?? 'Could not load friends.'} /> : null}
      {friends.length ? friends.map((friend) => (
        <Interactive
          key={friend.userId}
          onPress={() => router.push({ pathname: '/social/message', params: { friend: friend.userId, name: personName(friend) } } as never)}
          accessibilityRole="button"
          accessibilityLabel={`Message ${personName(friend)}`}
          style={styles.friend}
        >
          <Avatar uri={friend.avatarUrl} name={personName(friend)} size={46} ring="subtle" />
          <View style={styles.friendCopy}>
            <Text style={styles.name}>{personName(friend)}</Text>
            <Text style={styles.detail}>{friend.username ? `@${friend.username}` : 'Friend'}</Text>
          </View>
          <Text style={[styles.open, { color: colors.primaryText }]}>Message ›</Text>
        </Interactive>
      )) : social.status === 'ready' ? (
        <Card style={styles.empty}>
          <EmptyState icon="mail" title="No friends to message yet" message="Add a classmate first. Private messages are only available between accepted friends." />
          <Button label="Find classmates" variant="secondary" onPress={() => router.push('/social/friends')} />
        </Card>
      ) : null}
      <Text style={styles.notice}>Text messages are available when the community database migration has been applied. Photo and video sharing and voice calls are not connected yet.</Text>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    friend: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
    friendCopy: { flex: 1, gap: 3 },
    name: { ...Type.headline, color: colors.text },
    detail: { ...Type.caption, color: colors.textSecondary },
    open: { ...Type.caption, fontWeight: '800' },
    empty: { gap: 14, alignItems: 'center', padding: 20 },
    notice: { ...Type.caption, color: colors.textTertiary, marginTop: 14 },
  });
}

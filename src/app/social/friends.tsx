import type { Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Avatar } from '@/components/ui/avatar';
import { Pill } from '@/components/ui/pill';
import { PageHeader, Screen } from '@/components/ui/screen';
import { EmptyState, InlineNotice } from '@/components/ui/state-views';
import { elevation, Radius, Type, type ThemeColors } from '@/constants/theme';
import { getFriendRequests, getFriends } from '@/data/friends';
import { useThemedStyles } from '@/hooks/use-theme';

// '/social' is the Social hub (social/index.tsx). Cast because the
// generated route types can lag behind newly added routes.
const SOCIAL_HREF = '/social' as Href;

// Opened from Social and from Profile. Back returns to whichever screen
// opened it (Social if opened directly). Everything here is clearly
// labelled sample data until classmates can really connect.
export default function FriendsScreen() {
  const styles = useThemedStyles(createStyles);
  const friends = getFriends();
  const requests = getFriendRequests();

  return (
    <Screen width="prose">
      <BackLink fallback={SOCIAL_HREF} />
      <PageHeader title="Friends" subtitle="Your study circle." style={styles.header} />
      <InlineNotice tone="warning" title="SAMPLE DATA" message="These people are a preview of the Friends layout. Connecting with real classmates is coming soon." />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Friend requests</Text>
        {requests.length > 0 ? <Pill label={`${requests.length}`} tone="gold" /> : null}
      </View>
      {requests.length > 0 ? (
        <View style={styles.list}>
          {requests.map((request, index) => (
            <View key={request.id} style={[styles.row, index > 0 && styles.rowDivider]}>
              <Avatar name={request.name} size={44} />
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{request.name}</Text>
                <Text style={styles.rowDetail}>{request.detail}</Text>
              </View>
              <Pill label="Sample" />
            </View>
          ))}
        </View>
      ) : (
        <EmptyState icon="social" title="No friend requests" message="Requests from classmates will appear here." />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your friends</Text>
        <Text style={styles.sectionCount}>{friends.length}</Text>
      </View>
      {friends.length > 0 ? (
        <View style={styles.list}>
          {friends.map((friend, index) => (
            <View key={friend.id} style={[styles.row, index > 0 && styles.rowDivider]}>
              <Avatar name={friend.name} size={44} ring="subtle" />
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{friend.name}</Text>
                <Text style={styles.rowDetail}>{friend.detail}</Text>
              </View>
              <Pill label="Sample" />
            </View>
          ))}
        </View>
      ) : (
        <EmptyState icon="social" title="No friends yet" message="When classmates connect, they will appear here." />
      )}
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    header: { marginTop: 14, marginBottom: 14 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 10 },
    sectionTitle: { ...Type.title3, color: colors.text },
    sectionCount: { ...Type.numeral, fontSize: 14, color: colors.textTertiary },
    list: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.hairline,
      overflow: 'hidden',
      ...elevation(colors, 1),
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 16 },
    rowDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
    rowInfo: { flex: 1, minWidth: 0 },
    rowName: { fontSize: 15, fontWeight: '700', color: colors.text },
    rowDetail: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  });
}

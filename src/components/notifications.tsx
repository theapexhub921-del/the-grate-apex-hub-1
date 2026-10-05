import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Interactive } from '@/components/ui/interactive';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Sheet } from '@/components/ui/sheet';
import { EmptyState } from '@/components/ui/state-views';
import { Type, type ThemeColors } from '@/constants/theme';
import { useLearningEvents } from '@/data/learning/events';
import { describeAgo, startOfDay } from '@/data/learning/time';
import { useLearning } from '@/data/learning/use-learning';
import { type AppNotification, buildNotifications, markNotificationsRead, useReadNotifications } from '@/data/notifications';
import { markSocialNotificationsRead, readSocialNotificationIds, socialAppNotifications, useSocial } from '@/data/social';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

type Filter = 'all' | 'learning' | 'updates';

function useNotifications() {
  const { memory, progress, now } = useLearning();
  const events = useLearningEvents();
  const localRead = useReadNotifications();
  const social = useSocial();
  const items = useMemo(
    () =>
      [
        ...socialAppNotifications(social.notifications),
        ...buildNotifications({
          memory,
          events,
          streak: progress.streak,
          lastActivityDate: progress.lastActivityDate,
          xp: progress.xp,
          now,
        }),
      ].sort((a, b) => b.at - a.at),
    [social.notifications, memory, events, progress.streak, progress.lastActivityDate, progress.xp, now]
  );
  const read = useMemo(() => new Set([...localRead, ...readSocialNotificationIds(social.notifications)]), [localRead, social.notifications]);
  const unread = items.filter((item) => !read.has(item.id)).length;
  return { items, read, unread, now };
}

// Local read marks for derived notifications; social ones are also marked
// read on the account (so the badge clears on every device).
function markRead(ids: string[]) {
  markNotificationsRead(ids);
  markSocialNotificationsRead(ids);
}

// The bell in the Home header: unread badge + the notification centre.
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unread } = useNotifications();
  return (
    <>
      <IconButton icon="bell" label="Notifications" badge={unread} onPress={() => setOpen(true)} />
      <NotificationCenter visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function NotificationCenter({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const styles = useThemedStyles(createStyles);
  const { items, read, unread, now } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');
  const shown = items.filter((item) => filter === 'all' || item.group === filter);
  const today = startOfDay(now);
  const groups = [
    { title: 'Today', items: shown.filter((item) => item.at >= today) },
    { title: 'Earlier', items: shown.filter((item) => item.at < today) },
  ].filter((group) => group.items.length > 0);

  function open(item: AppNotification) {
    markRead([item.id]);
    if (item.href) {
      onClose();
      router.push(item.href);
    }
  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread` : 'You are all caught up.'}
      footer={
        unread > 0 ? (
          <Button label="Mark all as read" variant="secondary" onPress={() => markRead(items.map((item) => item.id))} fullWidth />
        ) : undefined
      }
    >
      <SegmentedControl<Filter>
        label="Filter notifications"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'learning', label: 'Learning', count: items.filter((item) => item.group === 'learning' && !read.has(item.id)).length },
          { value: 'updates', label: 'Updates', count: items.filter((item) => item.group === 'updates' && !read.has(item.id)).length },
        ]}
      />
      {groups.length === 0 ? (
        <EmptyState icon="bell" title="Nothing new" message="Reviews that come due, streak reminders, milestones and new features appear here." />
      ) : (
        groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title.toUpperCase()}</Text>
            <View style={styles.list}>
              {group.items.map((item, index) => (
                <NotificationItem key={item.id} item={item} unread={!read.has(item.id)} now={now} first={index === 0} onPress={() => open(item)} />
              ))}
            </View>
          </View>
        ))
      )}
    </Sheet>
  );
}

function NotificationItem({ item, unread, now, first, onPress }: { item: AppNotification; unread: boolean; now: number; first: boolean; onPress: () => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const tint =
    item.tone === 'gold'
      ? { bg: colors.accentSubtle, fg: colors.accentText }
      : item.tone === 'warning'
        ? { bg: colors.warningSubtle, fg: colors.warningStrong }
        : item.tone === 'success'
          ? { bg: colors.successSubtle, fg: colors.successText }
          : { bg: colors.primarySubtle, fg: colors.primaryText };
  return (
    <Interactive
      onPress={onPress}
      accessibilityLabel={`${unread ? 'Unread. ' : ''}${item.title} ${item.body}`}
      style={({ hovered }) => [styles.item, !first && styles.itemDivider, hovered && styles.itemHover]}
    >
      <View style={[styles.medallion, { backgroundColor: tint.bg }]}>
        <Icon name={item.icon} size={18} color={tint.fg} filled={item.icon === 'xp' || item.icon === 'streak'} />
      </View>
      <View style={styles.itemText}>
        <Text style={[styles.itemTitle, unread && styles.itemTitleUnread]}>{item.title}</Text>
        <Text style={styles.itemBody}>{item.body}</Text>
        <Text style={styles.itemTime}>{describeAgo(item.at, now)}</Text>
      </View>
      {unread ? <View style={styles.unreadDot} /> : null}
    </Interactive>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    group: { gap: 8 },
    groupTitle: { ...Type.overline, color: colors.textTertiary },
    list: { borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline, overflow: 'hidden' },
    item: { flexDirection: 'row', gap: 12, padding: 14, alignItems: 'flex-start' },
    itemDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
    itemHover: { backgroundColor: colors.surfaceMuted },
    medallion: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    itemText: { flex: 1, minWidth: 0, gap: 2 },
    itemTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    itemTitleUnread: { fontWeight: '800', color: colors.text },
    itemBody: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
    itemTime: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6 },
  });
}

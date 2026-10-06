import { type Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { RankProgressCard } from '@/components/rank-progress';
import { ApexCoinWalletCard } from '@/components/apex-coin-wallet-card';
import { AvatarPicker } from '@/components/avatar/avatar-picker';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Card, Interactive } from '@/components/ui/interactive';
import { Columns, PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { webStyle } from '@/components/ui/web';
import { elevation, isDesktopWidth, Radius, Type, type ThemeColors } from '@/constants/theme';
import { curriculumProgress } from '@/data/learning/progress-model';
import { dayKey } from '@/data/learning/time';
import { useLearning } from '@/data/learning/use-learning';
import { getRankProgress } from '@/data/ranks';
import { useAvatarUrl, useDisplayName } from '@/data/user';
import { personName, useSocial } from '@/data/social';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

type MenuItem = { icon: IconName; label: string; detail: string; href: Href };

const menuItems: MenuItem[] = [
  { icon: 'chart', label: 'My Progress', detail: 'Quizzes, subjects and memory', href: '/progress' },
  { icon: 'social', label: 'Friends', detail: 'Find classmates and requests', href: '/social/friends' },
  { icon: 'settings', label: 'Settings', detail: 'Appearance, navigation, account', href: '/settings' as Href },
];

// Profile — academic identity: who you are in GRATEAPEX, your rank, your
// record and the milestones you have actually reached.
export default function ProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const { progress, inputs, quizzes, attempts } = useLearning();
  const overall = useMemo(() => curriculumProgress(inputs), [inputs]);
  const displayName = useDisplayName();
  const avatarUrl = useAvatarUrl();
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const social = useSocial();
  const friends = social.people.filter((person) => person.relationship === 'friends');
  const rank = getRankProgress(progress.xp);

  // Milestones are derived from the learning record — earned, never given.
  const reviewDays = new Set(attempts.filter((attempt) => attempt.mode === 'review' || attempt.mode === 'recall').map((attempt) => dayKey(attempt.attemptedAt))).size;
  const achievements: { icon: IconName; title: string; detail: string; earned: boolean }[] = [
    { icon: 'lesson', title: 'First lesson', detail: 'Complete a lesson', earned: progress.lessonsCompleted >= 1 },
    { icon: 'xp', title: 'Quiz ace', detail: 'Score 90%+ on a quiz', earned: quizzes.some((quiz) => (quiz.kind === 'lesson' || quiz.kind === 'topic') && quiz.percentage >= 90) },
    { icon: 'course', title: 'Topic complete', detail: 'Finish every lesson in a topic', earned: overall.topicsCompleted >= 1 },
    { icon: 'mastery', title: 'First mastery', detail: 'Master a concept', earned: overall.counts.mastered >= 1 },
    { icon: 'reinforce', title: 'Consistent reviewer', detail: 'Review on 5 different days', earned: reviewDays >= 5 },
    { icon: 'challenge', title: 'Apex contender', detail: 'Finish an Apex Challenge', earned: quizzes.some((quiz) => quiz.kind === 'apex') },
  ];
  const earned = achievements.filter((item) => item.earned).length;

  const stats: { icon: IconName; value: number; label: string }[] = [
    { icon: 'xp', value: progress.xp, label: 'Lifetime XP' },
    { icon: 'lesson', value: progress.lessonsCompleted, label: 'Lessons' },
    { icon: 'streak', value: progress.streak, label: 'Day streak' },
    { icon: 'course', value: overall.topicsCompleted, label: 'Topics' },
    { icon: 'mastery', value: overall.counts.mastered, label: 'Mastered' },
    { icon: 'reinforce', value: overall.due, label: 'Due now' },
  ];

  const identity = (
    <View style={[styles.identity, elevation(colors, 2)]}>
      <View style={styles.profileAvatar}>
        <Avatar uri={avatarUrl} name={displayName ?? 'Doc.'} size={76} ring="gold" />
        <Interactive
          onPress={() => setAvatarPickerOpen(true)}
          accessibilityLabel="Change profile picture"
          style={styles.changeAvatar}
        >
          <Icon name="camera" size={15} color={colors.onPrimary} />
        </Interactive>
      </View>
      <View style={styles.identityText}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName ? `Doc. ${displayName}` : 'Doc.'}
        </Text>
        <Text style={styles.username}>{social.username ? '@' + social.username : social.status === 'loading' ? 'Loading username...' : 'Add a username in Connect'}</Text>
        <View style={styles.badges}>
          <View style={styles.rankBadge}>
            <Icon name="rank" size={14} color="#0A1F5C" strokeWidth={2.2} />
            <Text style={styles.rankBadgeText}>{rank ? rank.rank.name : 'Medical Student'}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Icon name="level" size={13} color={colors.primaryText} />
            <Text style={styles.levelBadgeText}>Level {progress.level}</Text>
          </View>
        </View>
        <View style={styles.identityActions}>
          <Button label={displayName ? 'Edit name' : 'Set your name'} size="sm" variant="ghost" onPress={() => router.push('/settings' as Href)} />
          <Button label="Change picture" size="sm" variant="ghost" onPress={() => setAvatarPickerOpen(true)} />
        </View>
      </View>
    </View>
  );

  const socialConnections = (
    <Card style={styles.socialCard}>
      <SectionHeader
        title="Your circle"
        subtitle="Friends make the GrAteApex Hub journey more social."
        style={styles.noMargin}
        right={<Text style={styles.cardMeta}>{friends.length} friends</Text>}
      />
      {friends.length ? friends.slice(0, 3).map((friend) => (
        <View key={friend.userId} style={styles.friendRow}>
          <Avatar uri={friend.avatarUrl} name={personName(friend)} size={40} status={friend.isOnline ? 'online' : null} />
          <View style={styles.friendText}>
            <Text style={styles.friendName}>{personName(friend)}</Text>
            <Text style={styles.friendHandle}>{friend.isOnline ? 'Online' : friend.username ? '@' + friend.username : 'GrAteApex Hub friend'}</Text>
          </View>
          {friend.totalXp !== null ? <Text style={styles.friendXp}>{friend.totalXp} XP</Text> : null}
        </View>
      )) : (
        <Text style={styles.cardMeta}>
          {social.status === 'loading' ? 'Loading your friends...' : 'Your friend list is empty. Find classmates to build your circle.'}
        </Text>
      )}
      <Button
        label={friends.length ? 'Manage friends' : 'Find classmates'}
        variant="secondary"
        size="sm"
        onPress={() => router.push('/social/friends' as Href)}
      />
    </Card>
  );
  const statGrid = (
    <View style={styles.statGrid}>
      {stats.map((stat) => (
        <View key={stat.label} style={[styles.stat, desktop ? styles.statDesktop : styles.statMobile]}>
          <Icon name={stat.icon} size={16} color={stat.icon === 'xp' || stat.icon === 'streak' ? colors.accentText : colors.primaryText} filled={stat.icon === 'xp' || stat.icon === 'streak'} />
          <AnimatedNumber value={stat.value} style={styles.statValue} />
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );

  const achievementsCard = (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Milestones</Text>
        <Text style={styles.cardMeta}>
          {earned} of {achievements.length} earned
        </Text>
      </View>
      <View style={styles.achievementGrid}>
        {achievements.map((item) => (
          <View key={item.title} style={[styles.achievement, !item.earned && styles.achievementLocked]} accessibilityLabel={`${item.title}: ${item.detail}. ${item.earned ? 'Earned' : 'Not yet earned'}`}>
            <View style={[styles.achievementMark, item.earned ? styles.achievementMarkEarned : null]}>
              <Icon name={item.earned ? item.icon : 'lock'} size={18} color={item.earned ? '#0A1F5C' : colors.textTertiary} filled={item.earned && (item.icon === 'xp')} />
            </View>
            <Text style={styles.achievementTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.achievementDetail} numberOfLines={2}>
              {item.detail}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const menu = (
    <View style={[styles.menu, elevation(colors, 1)]}>
      {menuItems.map((item, index) => (
        <Interactive
          key={item.label}
          onPress={() => router.push(item.href)}
          accessibilityRole="link"
          accessibilityLabel={item.label}
          style={({ hovered }) => [styles.menuItem, index > 0 && styles.menuDivider, hovered && styles.menuHover]}
        >
          {({ hovered }) => (
            <>
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={18} color={colors.primaryText} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.menuText}>{item.label}</Text>
                <Text style={styles.menuDetail}>{item.detail}</Text>
              </View>
              <Icon name="chevronRight" size={18} color={hovered ? colors.text : colors.textTertiary} />
            </>
          )}
        </Interactive>
      ))}
    </View>
  );

  return (
    <Screen width="content">
      <PageHeader title="Profile" subtitle="Your identity, connections and achievements." right={<IconButton icon="settings" label="Settings" onPress={() => router.push('/settings' as Href)} />} />
      {identity}
      <View style={styles.gap} />
      <ApexCoinWalletCard />
      <AvatarPicker visible={avatarPickerOpen} onClose={() => setAvatarPickerOpen(false)} />
      <View style={styles.gap} />
      {desktop ? (
        <Columns
          sideWidth={360}
          main={
            <View style={styles.column}>
              {statGrid}
              {achievementsCard}
            </View>
          }
          side={
            <View style={styles.column}>
              <RankProgressCard lifetimeXp={progress.xp} />
              {socialConnections}
              {menu}
            </View>
          }
        />
      ) : (
        <View style={styles.column}>
          <RankProgressCard lifetimeXp={progress.xp} />
          {statGrid}
          {achievementsCard}
          {socialConnections}
          {menu}
        </View>
      )}
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    gap: { height: 16 },
    column: { gap: 16 },
    pressed: { transform: [{ scale: 0.97 }] },
    identity: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 20,
      padding: 22,
      borderRadius: Radius.xl,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      overflow: 'hidden',
      ...webStyle({ backgroundImage: `radial-gradient(90% 140% at 100% 0%, ${colors.accent}1F, transparent 55%)` }),
    },
    editBadge: {
      position: 'absolute',
      right: 2,
      bottom: 2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.surfaceElevated,
    },
    identityText: { flex: 1, minWidth: 220, gap: 8 },
    profileAvatar: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
    changeAvatar: { position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
    username: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
    name: { ...Type.title1, color: colors.text },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    rankBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.accent,
    },
    rankBadgeText: { fontSize: 12, fontWeight: '800', color: '#0A1F5C' },
    levelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.primarySubtle,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    levelBadgeText: { fontSize: 12, fontWeight: '800', color: colors.primaryText },
    identityActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    stat: {
      gap: 4,
      padding: 14,
      borderRadius: Radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.hairline,
      ...elevation(colors, 1),
    },
    statDesktop: { width: '31.8%', flexGrow: 1 },
    statMobile: { width: '30%', flexGrow: 1, minWidth: 96 },
    statValue: { ...Type.numeral, fontSize: 22, color: colors.text, marginTop: 4 },
    statLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
    card: { gap: 14 },
    socialCard: { gap: 12, marginTop: 12 },
    noMargin: { marginBottom: 0 },
    friendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 3 },
    friendText: { flex: 1, minWidth: 0, gap: 2 },
    friendName: { fontSize: 13.5, fontWeight: '800', color: colors.text },
    friendHandle: { fontSize: 11.5, color: colors.textTertiary },
    friendXp: { fontSize: 11.5, fontWeight: '800', color: colors.accentText },
    cardHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    cardTitle: { ...Type.title3, color: colors.text },
    cardMeta: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
    achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    achievement: { width: '31%', flexGrow: 1, minWidth: 96, alignItems: 'center', gap: 4, padding: 12, borderRadius: 14, backgroundColor: colors.surfaceMuted },
    achievementLocked: { opacity: 0.6 },
    achievementMark: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceSunken,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 4,
    },
    achievementMarkEarned: { backgroundColor: colors.accent, borderColor: colors.accent },
    achievementTitle: { fontSize: 12.5, fontWeight: '800', color: colors.text, textAlign: 'center' },
    achievementDetail: { fontSize: 11, lineHeight: 15, color: colors.textTertiary, textAlign: 'center' },
    menu: { backgroundColor: colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: colors.hairline, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
    menuDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
    menuHover: { backgroundColor: colors.surfaceMuted },
    menuIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    menuText: { fontSize: 15, fontWeight: '700', color: colors.text },
    menuDetail: { fontSize: 12, color: colors.textTertiary, marginTop: 1 },
  });
}

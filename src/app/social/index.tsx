import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AnimatedNumber } from '@/components/ui/animated-number';
import { AvatarStack } from '@/components/ui/avatar';
import { Icon, type IconName } from '@/components/ui/icon';
import { Card, PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Columns, PageHeader, Screen } from '@/components/ui/screen';
import { Type, type ThemeColors } from '@/constants/theme';
import { getFriendRequests, getFriends } from '@/data/friends';
import { addDays, startOfDay } from '@/data/learning/time';
import { useLearning } from '@/data/learning/use-learning';
import { getRankProgress, LEAGUE_RULES } from '@/data/ranks';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// Features that need classmate connections — shown honestly as upcoming.
const comingSoon: { id: string; icon: IconName; title: string; description: string }[] = [
  { id: 'classmate-activity', icon: 'announcement', title: 'Classmate activity', description: 'See what your study circle is working on.' },
  { id: 'leaderboard', icon: 'rank', title: 'Weekly leagues', description: 'Compete with learners at your rank.' },
  { id: 'study-groups', icon: 'social', title: 'Study groups', description: 'Revise a topic together in small groups.' },
];

// Social — the academic community. Your own week is real; classmate
// features wait for real connections (nothing here is a fake person).
export default function SocialScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const friends = getFriends();
  const requests = getFriendRequests();
  const { progress, attempts, now } = useLearning();
  const rank = getRankProgress(progress.xp);

  const today = startOfDay(now);
  const weekStart = addDays(today, -6);
  const lessonsThisWeek = Object.values(progress.lessonCompletedAt).filter((at) => at >= weekStart).length;
  const answersThisWeek = attempts.filter((attempt) => attempt.attemptedAt >= weekStart).length;
  const xpThisWeek = progress.xpLedger.filter((entry) => entry.at >= weekStart).reduce((sum, entry) => sum + entry.amount, 0);

  // XP per day for the last seven days (real ledger).
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const start = addDays(today, index - 6);
        const end = addDays(start, 1);
        const xp = progress.xpLedger.filter((entry) => entry.at >= start && entry.at < end).reduce((sum, entry) => sum + Math.max(0, entry.amount), 0);
        return { start, xp, label: new Date(start).toLocaleDateString(undefined, { weekday: 'narrow' }), isToday: start === today };
      }),
    [progress.xpLedger, today]
  );
  const maxXp = Math.max(1, ...days.map((day) => day.xp));

  const week = (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Your learning this week</Text>
        <Pill label="Real activity" tone="success" />
      </View>
      <View style={styles.weekStats}>
        <WeekStat icon="lesson" value={lessonsThisWeek} label="lessons" />
        <WeekStat icon="check" value={answersThisWeek} label="answers" />
        <WeekStat icon="xp" value={xpThisWeek} label="XP" />
        <WeekStat icon="streak" value={progress.streak} label="streak" />
      </View>
      <View style={styles.chart} accessibilityLabel={`XP per day this week: ${days.map((day) => day.xp).join(', ')}`}>
        {days.map((day) => (
          <View key={day.start} style={styles.chartColumn}>
            <View style={styles.chartTrack}>
              <View
                style={[
                  styles.chartBar,
                  { height: `${Math.max(day.xp > 0 ? 8 : 0, (day.xp / maxXp) * 100)}%`, backgroundColor: day.isToday ? colors.accent : colors.primary },
                ]}
              />
            </View>
            <Text style={[styles.chartLabel, day.isToday && styles.chartLabelToday]}>{day.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>When classmates can connect, this is the activity your league will compare.</Text>
    </Card>
  );

  const promote = Math.round(LEAGUE_RULES.promotionShare * 100);
  const relegate = Math.round(LEAGUE_RULES.relegationShare * 100);
  const leagues = (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Weekly leagues</Text>
        <Pill label="Opening soon" />
      </View>
      <Text style={styles.body}>
        Each week you compete with learners at your rank{rank ? ` — the ${rank.rank.name} league` : ''}. Ranks themselves only change with lifetime XP.
      </Text>
      <View style={styles.zones} accessibilityLabel={`Top ${promote}% advance, middle stay, bottom ${relegate}% move down`}>
        <View style={[styles.zone, { flex: promote, backgroundColor: colors.success }]} />
        <View style={[styles.zone, { flex: 100 - promote - relegate, backgroundColor: colors.track }]} />
        <View style={[styles.zone, { flex: relegate, backgroundColor: colors.warning }]} />
      </View>
      <View style={styles.zoneLegend}>
        <ZoneRule color={colors.success} text={`Top ${promote}% advance — if they also meet the next level's XP requirement`} />
        <ZoneRule color={colors.track} text="The middle stays in the league" />
        <ZoneRule color={colors.warning} text={`Bottom ${relegate}% move down a league`} />
      </View>
    </Card>
  );

  const circle = (
    <PressableCard
      onPress={() => router.push('/social/friends')}
      accessibilityLabel="Friends preview. Shows sample data until connecting with classmates is available."
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Study circle</Text>
        <Pill label="Sample preview" tone="warning" />
      </View>
      <View style={styles.circleRow}>
        <AvatarStack people={friends.map((friend) => ({ id: friend.id, name: friend.name }))} size={38} />
        <Icon name="chevronRight" size={18} color={colors.textTertiary} />
      </View>
      <View>
          <Text style={styles.circleText}>
            {friends.length} sample friend{friends.length === 1 ? '' : 's'}
            {requests.length ? ` · ${requests.length} sample request${requests.length === 1 ? '' : 's'}` : ''}
          </Text>
          <Text style={styles.note}>A preview of how friends will look. Real connections are coming.</Text>
      </View>
    </PressableCard>
  );

  const soon = (
    <Card style={styles.card} tone="outline">
      <Text style={styles.cardTitle}>Coming next</Text>
      {comingSoon.map((item) => (
        <View key={item.id} style={styles.soonRow}>
          <View style={styles.soonIcon}>
            <Icon name={item.icon} size={18} color={colors.primaryText} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.soonTitle}>{item.title}</Text>
            <Text style={styles.note}>{item.description}</Text>
          </View>
        </View>
      ))}
    </Card>
  );

  return (
    <Screen width="content">
      <PageHeader title="Social" subtitle="Learn alongside your classmates." />
      <Columns
        sideWidth={width >= 1180 ? 380 : 340}
        main={
          <View style={styles.column}>
            {week}
            {leagues}
          </View>
        }
        side={
          <View style={styles.column}>
            {circle}
            {soon}
          </View>
        }
      />
    </Screen>
  );
}

function WeekStat({ icon, value, label }: { icon: IconName; value: number; label: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const gold = icon === 'xp' || icon === 'streak';
  return (
    <View style={styles.weekStat}>
      <Icon name={icon} size={15} color={gold ? colors.accentText : colors.primaryText} filled={gold} />
      <AnimatedNumber value={value} style={styles.weekValue} />
      <Text style={styles.weekLabel}>{label}</Text>
    </View>
  );
}

function ZoneRule({ color, text }: { color: string; text: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.zoneRule}>
      <View style={[styles.zoneDot, { backgroundColor: color }]} />
      <Text style={styles.note}>{text}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    column: { gap: 16 },
    card: { gap: 14 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    cardTitle: { ...Type.title3, color: colors.text },
    body: { ...Type.callout, color: colors.textSecondary },
    note: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary },
    weekStats: { flexDirection: 'row', gap: 8 },
    weekStat: { flex: 1, minWidth: 0, gap: 4, padding: 12, borderRadius: 14, backgroundColor: colors.surfaceMuted },
    weekValue: { ...Type.numeral, fontSize: 20, color: colors.text },
    weekLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
    chart: { flexDirection: 'row', gap: 8, height: 96, alignItems: 'flex-end' },
    chartColumn: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
    chartTrack: { flex: 1, width: '70%', maxWidth: 28, borderRadius: 8, backgroundColor: colors.surfaceSunken, justifyContent: 'flex-end', overflow: 'hidden' },
    chartBar: { width: '100%', borderRadius: 8 },
    chartLabel: { fontSize: 11, fontWeight: '700', color: colors.textTertiary },
    chartLabelToday: { color: colors.text },
    zones: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 3 },
    zone: { height: '100%', borderRadius: 4 },
    zoneLegend: { gap: 6 },
    zoneRule: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    zoneDot: { width: 10, height: 10, borderRadius: 3 },
    circleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
    circleText: { fontSize: 14, fontWeight: '700', color: colors.text },
    soonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    soonIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    soonTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  });
}

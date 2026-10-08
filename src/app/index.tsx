import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedContent } from '@/components/motion';
import { ApexCoinButton } from '@/components/apex-coin-button';
import { LogoMark } from '@/components/logo-mark';
import { SupabaseSocialFeed } from '@/components/social/supabase-social-feed';
import { CommunityPostsFeed } from '@/components/social/community-posts-feed';
import { ReviewCalendar } from '@/components/learning/review-calendar';
import { RankProgressCard } from '@/components/rank-progress';
import { NotificationBell } from '@/components/notifications';
import { IconButton } from '@/components/ui/icon-button';
import { Card } from '@/components/ui/interactive';
import { Button } from '@/components/ui/button';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { Type, type ThemeColors } from '@/constants/theme';
import { useLearning } from '@/data/learning/use-learning';
import { useThemedStyles } from '@/hooks/use-theme';

// Home is the social front door. Course progress, planning and review live in Learn.
export default function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const { progress, memory, attempts, now } = useLearning();
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const lessonsThisWeek = Object.values(progress.lessonCompletedAt).filter((at) => at >= weekStart.getTime()).length;
  const reviewsThisWeek = attempts.filter((attempt) => attempt.attemptedAt >= weekStart.getTime()).length;

  return (
    <Screen width="content">
      <View style={styles.feedColumn}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <LogoMark height={28} />
          <Text style={styles.wordmark}>GrAteApex Hub</Text>
        </View>
        <View style={styles.headerActions}>
          <NotificationBell />
          <ApexCoinButton />
          <IconButton icon="settings" label="Settings" onPress={() => router.push('/settings')} />
        </View>
      </View>

      <AnimatedContent style={styles.welcome}>
        <Text style={styles.eyebrow}>YOUR STUDY SPACE</Text>
        <Text style={styles.title} accessibilityRole="header">Welcome to the community 👋</Text>
        <Text style={styles.subtitle}>Study alongside fellow learners, share your progress and cheer each other on.</Text>
      </AnimatedContent>

      <View style={styles.socialFeed}>
        <SupabaseSocialFeed>
          <CommunityPostsFeed />
        </SupabaseSocialFeed>
      </View>

      <View style={styles.progressRail}>
        <RankProgressCard lifetimeXp={progress.xp} />
        <Card style={styles.goalCard}>
          <SectionHeader title="Personal goals" subtitle="Keep a study target in sight." style={styles.calendarHeading} />
          <Button label="View goals" variant="secondary" onPress={() => router.push('/goals')} />
        </Card>
        <Card style={styles.calendarCard}>
          <SectionHeader title="Your week" subtitle={`${lessonsThisWeek} lessons · ${reviewsThisWeek} reviews`} style={styles.calendarHeading} />
          <ReviewCalendar memory={memory} attempts={attempts} now={now} />
        </Card>
      </View>

      <Text style={styles.motto}>Reach the Apex of GrAteness</Text>
      </View>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    wordmark: { fontSize: 20, fontWeight: '800', letterSpacing: 0.9, color: colors.logoLetters },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    welcome: { alignItems: 'flex-start', marginBottom: 12, minHeight: 96, justifyContent: 'center' },
    eyebrow: { ...Type.overline, color: colors.primaryText },
    title: { ...Type.display, color: colors.text, marginTop: 2 },
    subtitle: { ...Type.callout, color: colors.textSecondary, marginTop: 4 },
    feedColumn: { width: '100%', maxWidth: 760, alignSelf: 'center' },
    socialFeed: { width: '100%' },
    progressRail: { gap: 12, marginTop: 18 },
    calendarCard: { gap: 12 },
    goalCard: { gap: 12 },
    calendarHeading: { marginBottom: 0 },
    motto: { textAlign: 'center', ...Type.overline, letterSpacing: 1.6, color: colors.textTertiary, marginTop: 28 },
  });
}

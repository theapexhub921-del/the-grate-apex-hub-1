import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { AnimatedContent } from '@/components/motion';
import { ApexCoinButton } from '@/components/apex-coin-button';
import { LogoMark } from '@/components/logo-mark';
import { SocialActivityFeed } from '@/components/social/supabase-social-feed';
import { CommunityPostsFeed } from '@/components/social/community-posts-feed';
import { NotificationBell } from '@/components/notifications';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { Type, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

// Feed is the social front door: people's stories and posts. Course progress,
// planning and review live in Study; rank and goals in You.
export default function HomeScreen() {
  const styles = useThemedStyles(createStyles);

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

      {/* Feed is people's posts: stories and community posts only. Rank is in
          You, "Your week" in Study, personal goals in Study and You. */}
      <View style={styles.socialFeed}>
        <SocialActivityFeed showActivity={false}>
          <CommunityPostsFeed />
        </SocialActivityFeed>
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
    motto: { textAlign: 'center', ...Type.overline, letterSpacing: 1.6, color: colors.textTertiary, marginTop: 28 },
  });
}

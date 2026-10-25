import { useGlobalSearchParams, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { isDesktopWidth, Type, type ThemeColors } from '@/constants/theme';
import { dismissTip, TIPS, tipForPage, useFirstTimeTip } from '@/data/first-time-tips';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// The first time a learner opens one of these pages after the short welcome tour, a small
// card explains it (data/first-time-tips.ts). "Got it" closes it for good. One component
// in the app shell, so the pages themselves don't change.
export function FirstTimeTips() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ layer?: string }>();
  const layer = typeof params.layer === 'string' ? params.layer : undefined;
  const tip = useFirstTimeTip(user ? tipForPage(pathname, layer) : null);
  // A moment after the page opens, so it doesn't appear while the page is still drawing.
  const [shownFor, setShownFor] = useState<string | null>(null);
  useEffect(() => {
    if (!tip) return;
    const timer = setTimeout(() => setShownFor(tip), 1200);
    return () => clearTimeout(timer);
  }, [tip]);

  if (!tip || shownFor !== tip) return null;
  const desktop = isDesktopWidth(width);
  const { title, body } = TIPS[tip];
  return (
    <View style={[styles.card, desktop ? styles.desktop : styles.phone]} accessibilityRole="alert">
      <View style={styles.head}>
        <View style={styles.icon}><Icon name="sparkle" size={18} color={colors.onPrimary} /></View>
        <View style={styles.flex}>
          <Text style={styles.kicker}>TIP</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{body}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button label="Got it" size="sm" onPress={() => void dismissTip(tip)} />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { position: 'absolute', zIndex: 64, gap: 10, padding: 14, borderRadius: 18, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, boxShadow: `0px 12px 32px ${colors.shadowStrong}` },
    desktop: { right: 24, bottom: 56, width: 360 },
    phone: { left: 12, right: 12, bottom: 96 },
    head: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
    flex: { flex: 1, minWidth: 0, gap: 2 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.textTertiary },
    title: { ...Type.headline, color: colors.text },
    text: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  });
}

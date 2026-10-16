import { forwardRef, type ReactNode, useEffect } from 'react';
import {
  ScrollView,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui/text';

import { useTabBarScroll } from '@/components/tab-bar-visibility';
import {
  CONTENT_MAX_WIDTH,
  isDesktopWidth,
  LEARNING_MAX_WIDTH,
  pageContainer,
  PROSE_MAX_WIDTH,
  Type,
  type ThemeColors,
} from '@/constants/theme';
import { MOTION, MOTION_EASING } from '@/constants/motion';
import { webStyle } from '@/components/ui/web';
import { useExperience } from '@/hooks/use-experience';
import { useThemedStyles } from '@/hooks/use-theme';

export const WIDE_MAX_WIDTH = 1480;

const WIDTHS = {
  prose: PROSE_MAX_WIDTH,
  learning: LEARNING_MAX_WIDTH,
  content: CONTENT_MAX_WIDTH,
  wide: WIDE_MAX_WIDTH,
} as const;

// The standard GRATEAPEX page: scrollable, transparent (the shell's
// atmosphere is the background), centred at an intentional max width,
// and padded at the bottom so nothing hides behind the floating tab bar.
export const Screen = forwardRef<
  ScrollView,
  {
    children: ReactNode;
    width?: keyof typeof WIDTHS;
    contentStyle?: StyleProp<ViewStyle>;
    background?: string;
  }
>(function Screen({ children, width = 'content', contentStyle, background }, ref) {
  const styles = useThemedStyles(createStyles);
  const { width: windowWidth } = useWindowDimensions();
  const tabBarScroll = useTabBarScroll();
  // Originate: each page arrives with a short fade (opacity only, so nothing
  // fixed inside the page moves; skipped under reduced motion).
  const reduceMotion = useReducedMotion();
  const fadeIn = useExperience() === 'originate' && !reduceMotion;
  const shown = useSharedValue(fadeIn ? 0 : 1);
  useEffect(() => {
    shown.value = withTiming(1, { duration: fadeIn ? MOTION.significant - 100 : 0, easing: MOTION_EASING.entrance });
  }, [fadeIn, shown]);
  const fade = useAnimatedStyle(() => ({ opacity: shown.value }));
  return (
    <Animated.View style={[styles.fill, fade]}>
      <ScrollView
        {...tabBarScroll}
        ref={ref}
        style={[styles.scroll, background ? { backgroundColor: background } : null]}
        contentContainerStyle={[
          styles.container,
          pageContainer(windowWidth, WIDTHS[width]),
          isDesktopWidth(windowWidth) && styles.containerDesktop,
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </Animated.View>
  );
});

// A page title block: optional eyebrow, title, subtitle and actions.
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  right,
  style,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(createStyles);
  // The Originals: the original ScreenHeader — a 30pt title, muted subtitle, no eyebrow.
  // Hybrid: the original 30pt title over this app's eyebrow and subtitle.
  const experience = useExperience();
  const originals = experience === 'originals';
  const originate = experience === 'originate';
  const legacyTitle = !originate;
  return (
    <View style={[styles.pageHeader, originals && styles.legacyHeader, style]}>
      <View style={styles.sectionText}>
        {eyebrow && originate ? (
          // Originate: the eyebrow leads with a small gold-to-blue mark.
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowMark} />
            <Text style={[styles.eyebrow, styles.eyebrowOriginate]}>{eyebrow.toUpperCase()}</Text>
          </View>
        ) : eyebrow && !originals ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={[styles.pageTitle, legacyTitle && styles.legacyTitle]} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={[styles.pageSubtitle, originals && styles.legacySubtitle]}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.pageRight}>{right}</View> : null}
    </View>
  );
}

export function SectionHeader({
  title,
  subtitle,
  right,
  style,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.sectionText}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Eyebrow({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={style}>
      <Text style={styles.eyebrow}>{children.toUpperCase()}</Text>
    </View>
  );
}

// Two columns on desktop (main + side), stacked on narrow screens.
export function Columns({
  main,
  side,
  sideWidth = 340,
  gap = 24,
  sideFirstOnMobile = false,
}: {
  main: ReactNode;
  side: ReactNode;
  sideWidth?: number;
  gap?: number;
  sideFirstOnMobile?: boolean;
}) {
  const { width } = useWindowDimensions();
  if (!isDesktopWidth(width)) {
    return (
      <View style={{ gap }}>
        {sideFirstOnMobile ? side : main}
        {sideFirstOnMobile ? main : side}
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap }}>
      <View style={{ flex: 1, minWidth: 0 }}>{main}</View>
      <View style={{ width: sideWidth }}>{side}</View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    fill: { flex: 1 },
    scroll: { flex: 1, backgroundColor: 'transparent' },
    container: { paddingTop: 24, paddingBottom: 24 },
    containerDesktop: { paddingTop: 36 },
    bottomSpace: { height: 120 },
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 22,
    },
    pageTitle: { ...Type.title1, color: colors.text },
    pageSubtitle: { ...Type.body, color: colors.textSecondary, marginTop: 4 },
    pageRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
    },
    sectionText: { flex: 1, minWidth: 0 },
    sectionTitle: { ...Type.title3, color: colors.text },
    sectionSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
    eyebrow: { ...Type.overline, color: colors.textTertiary, marginBottom: 6 },
    eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    eyebrowMark: {
      width: 18,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent,
      ...webStyle({ backgroundImage: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})` }),
    },
    eyebrowOriginate: { color: colors.primaryText, marginBottom: 0 },
    legacyHeader: { alignItems: 'flex-start', marginBottom: 16 },
    legacyTitle: { fontFamily: undefined, fontSize: 30, lineHeight: undefined, fontWeight: '800', letterSpacing: -0.5 },
    legacySubtitle: { fontSize: undefined, color: colors.textTertiary, marginTop: 4, lineHeight: 20 },
  });
}

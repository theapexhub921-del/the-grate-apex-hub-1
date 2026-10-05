import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarClearance } from '@/components/floating-tab-bar';
import { useTabBarHidden } from '@/components/tab-bar-visibility';
import { webStyle } from '@/components/ui/web';
import { MOTION } from '@/constants/motion';
import { DESKTOP_BREAKPOINT, Fonts, type ThemeColors } from '@/constants/theme';
import { useTabBarMode } from '@/data/navigation-settings';
import { useThemedStyles } from '@/hooks/use-theme';

/**
 * The "OrigiNate" signature, bottom-right on every screen.
 *
 * A small frosted chip, so content scrolling underneath never collides
 * with its letters. Never interactive (it can never cover or block a
 * button). On phones it rides just above the floating tab bar and settles
 * to the corner when the bar slides away.
 */
export function Signature({ aboveTabBar }: { aboveTabBar: boolean }) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const clearance = useTabBarClearance();
  const reduceMotion = useReducedMotion();
  const mode = useTabBarMode();
  const barHidden = useTabBarHidden() && mode === 'autoHide';
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  // Phones: the introduction keeps Back/Next at the bottom — sit above them.
  const aboveTourControls = pathname.startsWith('/onboarding') && width < DESKTOP_BREAKPOINT;

  const bottom = aboveTabBar && !barHidden ? clearance + 8 : aboveTourControls ? insets.bottom + 84 : insets.bottom + 10;
  const offset = useSharedValue(bottom);

  useEffect(() => {
    offset.value = withTiming(bottom, { duration: reduceMotion ? 0 : MOTION.standard });
  }, [bottom, offset, reduceMotion]);

  const style = useAnimatedStyle(() => ({ bottom: offset.value }));

  return (
    <Animated.View style={[styles.wrap, style]} aria-hidden>
      <Text style={styles.text}>
        Origi<Text style={styles.accent}>N</Text>ate
      </Text>
    </Animated.View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      position: 'absolute',
      right: 14,
      zIndex: 45,
      pointerEvents: 'none',
      paddingVertical: 4,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: colors.navSurface,
      borderWidth: 1,
      borderColor: colors.navBorder,
      ...webStyle({ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }),
    },
    text: {
      fontFamily: Fonts.display,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 1.3,
      color: colors.textSecondary,
      opacity: 0.85,
    },
    accent: { color: colors.accentText, fontWeight: '800' },
  });
}

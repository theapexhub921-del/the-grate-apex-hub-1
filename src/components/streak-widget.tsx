// Streak widget card — shown on the home screen and on the /widget page.
// Compact on home, expanded on /widget. Features a breathing flame animation,
// streak count, and a status message. The design mirrors the Dribbble streak
// animation style: dark card, warm orange glow, animated flame.

import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { router } from 'expo-router';

import { MOTION, SPRING } from '@/constants/motion';
import { Type, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { useProgress } from '@/data/progress';
import { getStreakStatus } from '@/data/progression';
import { routes } from '@/lib/routes';

// ── Flame SVG (shared with modal but smaller) ─────────────────────────────────

function FlameSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <RadialGradient id="wfg" cx="50%" cy="70%" r="55%">
          <Stop offset="0%" stopColor="#FFF176" stopOpacity="1" />
          <Stop offset="30%" stopColor="#FFA726" stopOpacity="1" />
          <Stop offset="65%" stopColor="#F4511E" stopOpacity="1" />
          <Stop offset="100%" stopColor="#BF360C" stopOpacity="0.9" />
        </RadialGradient>
        <RadialGradient id="wfi" cx="50%" cy="80%" r="40%">
          <Stop offset="0%" stopColor="#FFF9C4" stopOpacity="1" />
          <Stop offset="55%" stopColor="#FFCC02" stopOpacity="1" />
          <Stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Path
        d="M60 10 C60 10 82 36 84 56 C87 67 82 74 77 78
           C80 66 74 56 64 53 C67 61 65 69 58 73
           C60 65 56 56 48 53 C40 61 40 74 42 81
           C36 75 32 66 36 53 C30 59 28 69 32 79
           C24 71 20 57 26 43 C30 31 40 18 60 10Z"
        fill="url(#wfg)"
      />
      <Path
        d="M60 40 C60 40 71 54 71 63 C71 71 66 76 60 78
           C54 76 49 71 49 63 C49 54 60 40 60 40Z"
        fill="url(#wfi)"
        opacity={0.88}
      />
    </Svg>
  );
}

// ── Status labels ──────────────────────────────────────────────────────────────

function getStatusText(streak: number, status: ReturnType<typeof getStreakStatus>): string {
  if (status === 'none') return 'Start your streak today';
  if (status === 'lapsed') return 'Streak ended — restart today';
  if (status === 'continueToday') return `Keep your ${streak}-day streak alive`;
  if (streak >= 100) return 'Century streak — legendary';
  if (streak >= 30) return `${streak} days and counting`;
  if (streak >= 7) return `${streak} days of dedication`;
  if (streak === 1) return 'Day 1 — great start!';
  return `${streak} days in a row`;
}

// ── Compact widget (home screen) ───────────────────────────────────────────────

type CompactProps = { onPress?: () => void };

export function StreakWidgetCompact({ onPress }: CompactProps) {
  const styles = useThemedStyles(createCompactStyles);
  const progress = useProgress();
  const reduced = useReducedMotion();

  const flameScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const cardScale = useSharedValue(0.92);

  useEffect(() => {
    cardScale.value = withSpring(1, SPRING.pop);
    if (reduced) return;
    flameScale.value = withRepeat(withSequence(
      withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.94, { duration: 900, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    glowOpacity.value = withRepeat(withSequence(
      withTiming(0.75, { duration: 1000 }),
      withTiming(0.3, { duration: 1000 })
    ), -1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: flameScale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const cardAnim = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));

  const status = getStreakStatus(progress.streak, progress.lastActivityDate);
  const isLapsed = status === 'lapsed';
  const hasStreak = progress.streak > 0 && !isLapsed;
  const label = getStatusText(progress.streak, status);

  function handlePress() {
    onPress?.();
    router.push(routes.learn());
  }

  return (
    <Animated.View style={cardAnim}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Streak: ${progress.streak} days. ${label}.`}
        style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
      >
        <View style={[styles.card, isLapsed && styles.cardLapsed]}>
          {/* Glow */}
          {hasStreak && (
            <Animated.View style={[styles.glow, glowStyle]} />
          )}

          {/* Left: flame + count */}
          <View style={styles.left}>
            <View style={styles.flameWrap}>
              {hasStreak ? (
                <Animated.View style={flameStyle}>
                  <FlameSvg size={38} />
                </Animated.View>
              ) : (
                <View style={styles.coldFlame}>
                  <FlameSvg size={38} />
                </View>
              )}
            </View>
            <Text style={[styles.count, isLapsed && styles.countLapsed]}>
              {progress.streak}
            </Text>
          </View>

          {/* Right: label + status */}
          <View style={styles.right}>
            <Text style={[styles.dayLabel, isLapsed && styles.dayLabelLapsed]}>
              {progress.streak === 1 ? 'DAY STREAK' : 'DAY STREAK'}
            </Text>
            <Text style={[styles.statusText, isLapsed && styles.statusTextLapsed]} numberOfLines={2}>
              {label}
            </Text>
          </View>

          {/* Status dot */}
          <View style={[styles.dot, hasStreak ? styles.dotActive : styles.dotInactive]} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Full widget (for /widget page) ────────────────────────────────────────────

export function StreakWidgetFull() {
  const styles = useThemedStyles(createFullStyles);
  const progress = useProgress();
  const reduced = useReducedMotion();

  const flameScale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.55);

  useEffect(() => {
    if (reduced) return;
    flameScale.value = withRepeat(withSequence(
      withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.95, { duration: 1000, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    glowScale.value = withRepeat(withSequence(
      withTiming(1.2, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.9, { duration: 1100, easing: Easing.inOut(Easing.sin) })
    ), -1, true);
    glowOpacity.value = withRepeat(withSequence(
      withTiming(0.85, { duration: 1000 }),
      withTiming(0.38, { duration: 1000 })
    ), -1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: flameScale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value, transform: [{ scale: glowScale.value }] }));

  const status = getStreakStatus(progress.streak, progress.lastActivityDate);
  const isLapsed = status === 'lapsed';
  const hasStreak = progress.streak > 0 && !isLapsed;
  const label = getStatusText(progress.streak, status);

  return (
    <View style={styles.card}>
      {/* Glow */}
      {hasStreak && <Animated.View style={[styles.glow, glowStyle]} />}

      {/* Flame */}
      <View style={styles.flameArea}>
        <Animated.View style={[styles.flameInner, hasStreak ? flameStyle : null, !hasStreak && styles.flameGrey]}>
          <FlameSvg size={90} />
        </Animated.View>
      </View>

      {/* Count */}
      <Text style={[styles.count, !hasStreak && styles.countGrey]}>{progress.streak}</Text>
      <Text style={styles.dayLabel}>DAY STREAK</Text>
      <Text style={styles.statusText}>{label}</Text>

      {/* Study button */}
      <Pressable
        onPress={() => router.push(routes.learn())}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        accessibilityRole="button"
        accessibilityLabel="Continue studying"
      >
        <Text style={styles.btnText}>Continue studying</Text>
      </Pressable>
    </View>
  );
}

// ── Compact styles ─────────────────────────────────────────────────────────────

function createCompactStyles(colors: ThemeColors) {
  const cardBg = colors.surface === '#FFFEFC' ? '#0D1526' : colors.surface;
  return StyleSheet.create({
    card: {
      backgroundColor: cardBg,
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderColor: 'rgba(253,192,10,0.2)',
      overflow: 'hidden',
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 4px 24px rgba(0,0,0,0.25), 0 0 30px rgba(255,138,0,0.1)' } as object)
        : {
            shadowColor: '#FF8800',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
          }),
    },
    cardLapsed: {
      borderColor: colors.border,
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 4px 14px rgba(0,0,0,0.18)' } as object)
        : {}),
    },
    glow: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255,140,0,0.18)',
      left: -10,
      top: -20,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    flameWrap: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    coldFlame: { opacity: 0.28 },
    count: {
      ...Type.numeral,
      fontSize: 28,
      fontWeight: '900',
      color: '#FFFFFF',
      lineHeight: 32,
    },
    countLapsed: { color: colors.textSecondary },
    right: { flex: 1, gap: 2 },
    dayLabel: {
      ...Type.overline,
      color: '#FFA726',
      letterSpacing: 2.5,
      fontSize: 9,
    },
    dayLabelLapsed: { color: colors.textTertiary },
    statusText: {
      fontSize: 12.5,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.62)',
      lineHeight: 17,
    },
    statusTextLapsed: { color: colors.textSecondary },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    dotActive: { backgroundColor: '#FFA726' },
    dotInactive: { backgroundColor: colors.textDisabled },
  });
}

// ── Full widget styles ─────────────────────────────────────────────────────────

function createFullStyles(colors: ThemeColors) {
  const cardBg = colors.surface === '#FFFEFC' ? '#0D1526' : colors.surface;
  return StyleSheet.create({
    card: {
      backgroundColor: cardBg,
      borderRadius: 28,
      paddingTop: 8,
      paddingBottom: 24,
      paddingHorizontal: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(253,192,10,0.2)',
      overflow: 'hidden',
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 40px rgba(255,138,0,0.12)' } as object)
        : {
            shadowColor: '#FF8800',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 12,
          }),
    },
    flameArea: {
      width: 120,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    flameInner: { alignItems: 'center', justifyContent: 'center' },
    flameGrey: { opacity: 0.28 },
    glow: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255,140,0,0.22)',
    },
    count: {
      fontSize: 56,
      fontWeight: '900',
      color: '#FFFFFF',
      lineHeight: 62,
      letterSpacing: -1.5,
    },
    countGrey: { color: colors.textSecondary },
    dayLabel: {
      ...Type.overline,
      color: '#FFA726',
      letterSpacing: 3.5,
      fontSize: 10,
      marginTop: 2,
      marginBottom: 8,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.62)',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
    },
    btn: {
      backgroundColor: '#1677F2',
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 32,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    btnPressed: { opacity: 0.85 },
    btnText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}

import { useEffect, useRef } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { MOTION, SPRING } from '@/constants/motion';
import { Type, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// ── Types ──────────────────────────────────────────────────────────────────────

export type StreakCelebrationData = {
  streak: number;
  isNew: boolean; // true = streak grew today, false = already active today
};

// ── In-memory singleton (no persistence — only for the current session) ─────────
// progress.ts calls triggerStreakCelebration() once the streak updates.
// StreakCelebrationWatcher (in _layout.tsx) renders the modal when it fires.

let pendingCelebration: StreakCelebrationData | null = null;
const celebrationListeners = new Set<(data: StreakCelebrationData | null) => void>();

export function triggerStreakCelebration(data: StreakCelebrationData) {
  if (data.streak < 1) return;
  pendingCelebration = data;
  celebrationListeners.forEach((l) => l(data));
}

export function clearStreakCelebration() {
  pendingCelebration = null;
  celebrationListeners.forEach((l) => l(null));
}

export function subscribeStreakCelebration(fn: (data: StreakCelebrationData | null) => void) {
  celebrationListeners.add(fn);
  return () => { celebrationListeners.delete(fn); };
}

export function getPendingStreakCelebration() {
  return pendingCelebration;
}

// ── Message copy ───────────────────────────────────────────────────────────────

function getMessage(streak: number, isNew: boolean): string {
  if (!isNew) return "You've already studied today — great work!";
  if (streak === 1) return 'First day of your streak. Keep going!';
  if (streak === 7) return 'One week straight. You\'re unstoppable.';
  if (streak === 14) return 'Two weeks! Your dedication is showing.';
  if (streak === 30) return 'A whole month of daily study. Incredible.';
  if (streak === 100) return 'One hundred days. That\'s legendary.';
  if (streak % 100 === 0) return `${streak} days. You are extraordinary.`;
  if (streak % 10 === 0) return `${streak} days in a row. Impressive.`;
  if (streak >= 30) return `${streak} days and counting. You\'re on fire.`;
  if (streak >= 7) return `${streak}-day streak. Keep the fire burning.`;
  return `${streak} days in a row. Keep it up!`;
}

// ── Flame SVG ─────────────────────────────────────────────────────────────────

function FlameSvg({ size = 110 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <RadialGradient id="fg" cx="50%" cy="70%" r="55%">
          <Stop offset="0%" stopColor="#FFF176" stopOpacity="1" />
          <Stop offset="30%" stopColor="#FFA726" stopOpacity="1" />
          <Stop offset="65%" stopColor="#F4511E" stopOpacity="1" />
          <Stop offset="100%" stopColor="#BF360C" stopOpacity="0.9" />
        </RadialGradient>
        <RadialGradient id="fi" cx="50%" cy="80%" r="40%">
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
        fill="url(#fg)"
      />
      <Path
        d="M60 40 C60 40 71 54 71 63 C71 71 66 76 60 78
           C54 76 49 71 49 63 C49 54 60 40 60 40Z"
        fill="url(#fi)"
        opacity={0.88}
      />
    </Svg>
  );
}

// ── Particle ──────────────────────────────────────────────────────────────────

type ParticleProps = { x: number; y: number; delay: number; reduced: boolean };
const PARTICLE_COLORS = ['#FFA726', '#FDC00A', '#FF7043', '#FFEE58', '#FF8C00'];

function Particle({ x, y, delay, reduced }: ParticleProps) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(0);
  const sc = useSharedValue(0.5);

  useEffect(() => {
    if (reduced) return;
    const dur = 1200 + delay;
    const run = () => {
      opacity.value = withDelay(delay, withSequence(
        withTiming(1, { duration: 280 }),
        withTiming(0, { duration: 720 })
      ));
      ty.value = withDelay(delay, withTiming(-52 - Math.random() * 20, {
        duration: 1000, easing: Easing.out(Easing.cubic),
      }));
      sc.value = withDelay(delay, withSequence(
        withTiming(1, { duration: 280 }),
        withTiming(0.15, { duration: 720 })
      ));
    };
    run();
    const id = setInterval(run, dur);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }, { scale: sc.value }],
  }));

  const color = PARTICLE_COLORS[Math.abs(Math.floor(x + y * 3)) % PARTICLE_COLORS.length];

  return (
    <Animated.View style={[
      { position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 3, backgroundColor: color },
      style,
    ]} />
  );
}

const PARTICLES: ParticleProps[] = [
  { x: 28, y: 22, delay: 0, reduced: false },
  { x: 88, y: 16, delay: 180, reduced: false },
  { x: 55, y: 4, delay: 350, reduced: false },
  { x: 12, y: 48, delay: 90, reduced: false },
  { x: 108, y: 42, delay: 260, reduced: false },
  { x: 42, y: -8, delay: 430, reduced: false },
  { x: 78, y: -4, delay: 130, reduced: false },
  { x: 18, y: 10, delay: 520, reduced: false },
  { x: 102, y: 20, delay: 310, reduced: false },
];

// ── Modal ─────────────────────────────────────────────────────────────────────

type Props = {
  data: StreakCelebrationData;
  onDismiss: () => void;
};

export function StreakCelebrationModal({ data, onDismiss }: Props) {
  const styles = useThemedStyles(createStyles);
  const reduced = useReducedMotion();

  const backdropOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.86);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.55);
  const flameScale = useSharedValue(1);

  useEffect(() => {
    backdropOpacity.value = withTiming(1, { duration: MOTION.standard });
    cardOpacity.value = withDelay(80, withTiming(1, { duration: MOTION.standard }));
    cardScale.value = withDelay(80, withSpring(1, SPRING.pop));

    if (!reduced) {
      flameScale.value = withRepeat(withSequence(
        withTiming(1.07, { duration: 950, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.96, { duration: 950, easing: Easing.inOut(Easing.sin) })
      ), -1, true);

      glowScale.value = withRepeat(withSequence(
        withTiming(1.18, { duration: 1050, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.93, { duration: 1050, easing: Easing.inOut(Easing.sin) })
      ), -1, true);

      glowOpacity.value = withRepeat(withSequence(
        withTiming(0.88, { duration: 950 }),
        withTiming(0.4, { duration: 950 })
      ), -1, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value, transform: [{ scale: cardScale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value, transform: [{ scale: glowScale.value }] }));
  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: flameScale.value }] }));

  const message = getMessage(data.streak, data.isNew);

  return (
    <Modal transparent animationType="none" visible onRequestClose={onDismiss} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} accessibilityLabel="Dismiss streak celebration" />

        <Animated.View
          style={[styles.card, cardStyle]}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${data.streak} day streak. ${message}`}
        >
          {/* Flame area */}
          <View style={styles.flameArea}>
            <Animated.View style={[styles.glow, glowStyle]} />
            {!reduced && PARTICLES.map((p, i) => (
              <Particle key={i} x={p.x} y={p.y} delay={p.delay} reduced={reduced} />
            ))}
            <Animated.View style={flameStyle}>
              <FlameSvg size={110} />
            </Animated.View>
          </View>

          {/* Numbers */}
          <Text style={styles.number}>{data.streak}</Text>
          <Text style={styles.label}>DAY STREAK</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.actions}>
            <Button label="Keep studying" variant="primary" fullWidth onPress={() => { onDismiss(); router.push(routes.learn()); }} />
            <Button label="Nice!" variant="ghost" fullWidth onPress={onDismiss} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

function createStyles(colors: ThemeColors) {
  // Always use a rich dark card regardless of app theme — matches the design.
  const cardBg = '#0D1526';

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.74)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 32,
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 28,
      paddingHorizontal: 28,
      borderWidth: 1,
      borderColor: 'rgba(253,192,10,0.22)',
      overflow: 'hidden',
      ...(Platform.OS === 'web'
        ? ({ boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(255,138,0,0.16)' } as object)
        : {
            shadowColor: '#FF8800',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.35,
            shadowRadius: 30,
            elevation: 20,
          }),
    },
    flameArea: {
      width: 160,
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    glow: {
      position: 'absolute',
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: 'rgba(255,140,0,0.24)',
    },
    number: {
      fontSize: 72,
      fontWeight: '900',
      color: '#FFFFFF',
      lineHeight: 80,
      letterSpacing: -2,
    },
    label: {
      ...Type.overline,
      color: '#FFA726',
      letterSpacing: 3.5,
      fontSize: 11,
      marginTop: 2,
      marginBottom: 16,
    },
    message: {
      fontSize: 15.5,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.68)',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 28,
      paddingHorizontal: 4,
    },
    actions: {
      width: '100%',
      gap: 8,
    },
  });
}

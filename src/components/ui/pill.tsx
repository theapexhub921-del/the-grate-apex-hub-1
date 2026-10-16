import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/components/ui/text';

import { ORadius } from '@/constants/originate';
import type { ThemeColors } from '@/constants/theme';
import { useExperience } from '@/hooks/use-experience';
import { useThemedStyles } from '@/hooks/use-theme';

export type PillTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'gold';

// A small label: status, tag, difficulty, memory state…
// Originate: a small rectangle (radius 4), sentence case, weight 600.
export function Pill({
  label,
  tone = 'neutral',
  style,
  dotColor,
}: {
  label: string;
  tone?: PillTone;
  style?: StyleProp<ViewStyle>;
  dotColor?: string;
}) {
  const styles = useThemedStyles(createStyles);
  const originate = useExperience() === 'originate';
  return (
    <View style={[styles.pill, styles[tone], originate && styles.tag, style]}>
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <Text style={[styles.text, styles[`${tone}Text` as const], originate && styles.tagText]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      // Never wider than its container: a long label ends in "…" instead of running off the screen.
      maxWidth: '100%',
      gap: 6,
      borderRadius: 999,
      paddingVertical: 3,
      paddingHorizontal: 9,
    },
    dot: { width: 7, height: 7, borderRadius: 4 },
    tag: { borderRadius: ORadius.tag, paddingVertical: 2, paddingHorizontal: 6 },
    tagText: { fontSize: 12, fontWeight: '600', letterSpacing: 0 },
    text: { flexShrink: 1, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
    neutral: { backgroundColor: colors.surfaceMuted },
    neutralText: { color: colors.textSecondary },
    primary: { backgroundColor: colors.primarySubtle },
    primaryText: { color: colors.primaryText },
    success: { backgroundColor: colors.successSubtle },
    successText: { color: colors.successText },
    warning: { backgroundColor: colors.warningSubtle },
    warningText: { color: colors.warningText },
    error: { backgroundColor: colors.errorSubtle },
    errorText: { color: colors.error },
    gold: { backgroundColor: colors.accentSubtle },
    goldText: { color: colors.accentText },
  });
}

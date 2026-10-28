// "How sure are you?" — Sure / Guessing, picked after choosing an answer and
// before it is checked (2026-10-28). Optional: leaving it blank changes nothing.
// The scheduler uses it (data/learning/scheduler.ts): a lucky guess comes back
// sooner, a confident mistake is treated as a misconception.
import { StyleSheet, View } from 'react-native';

import { Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import type { Confidence } from '@/data/learning/scheduler';
import { useThemedStyles } from '@/hooks/use-theme';

const CHOICES: { value: Confidence; label: string }[] = [
  { value: 'sure', label: 'Sure' },
  { value: 'guess', label: 'Guessing' },
];

export function ConfidenceToggle({
  value,
  onChange,
  disabled,
}: {
  value: Confidence | undefined;
  onChange: (value: Confidence | undefined) => void;
  disabled?: boolean;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>How sure are you?</Text>
      {CHOICES.map((choice) => {
        const on = value === choice.value;
        return (
          <Interactive
            key={choice.value}
            disabled={disabled}
            onPress={() => onChange(on ? undefined : choice.value)}
            accessibilityLabel={choice.label}
            accessibilityState={{ selected: on, disabled }}
            style={({ hovered }) => [styles.chip, on && styles.chipOn, hovered && !on && styles.chipHover]}
          >
            <Text style={[styles.chipText, on && styles.chipTextOn]}>{choice.label}</Text>
          </Interactive>
        );
      })}
    </View>
  );
}

/** One-line note shown with the answer, when the learner's confidence matters. */
export function confidenceNote(confidence: Confidence | undefined, correct: boolean): string | null {
  if (confidence === 'guess' && correct) return 'Right, but you were guessing: it comes back sooner to make it stick.';
  if (confidence === 'sure' && !correct) return 'You were sure, so this is worth a second look: it comes back for review soon.';
  return null;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginRight: 2 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipHover: { borderColor: colors.primaryBorder },
    chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    chipTextOn: { color: '#FFFFFF' },
  });
}

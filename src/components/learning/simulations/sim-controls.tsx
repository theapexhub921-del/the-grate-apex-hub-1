import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { controlRange, type SimChallenge, type SimControl, type SimValues } from '@/data/simulations/types';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

import { SimSlider } from './slider';

export function formatControl(control: SimControl, value: number): string {
  if (control.kind === 'choice') return control.options.find((option) => option.value === value)?.label ?? '';
  if (control.format) return control.format(value);
  const decimals = control.step < 1 ? Math.min(2, String(control.step).split('.')[1]?.length ?? 0) : 0;
  return `${value.toFixed(decimals)}${control.unit ? ` ${control.unit}` : ''}`;
}

// The sliders and choices of a simulation. `lockAll` freezes everything
// (before a prediction is answered); a challenge locks some and limits others.
export function SimControls({
  controls,
  values,
  onChange,
  lockAll,
  challenge,
}: {
  controls: SimControl[];
  values: SimValues;
  onChange: (key: string, value: number) => void;
  lockAll?: boolean;
  challenge?: SimChallenge;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <View style={styles.grid}>
      {controls.map((control) => {
        const locked = Boolean(lockAll) || Boolean(challenge?.locked?.includes(control.key));
        const value = values[control.key] ?? 0;
        const range = controlRange(control, challenge);
        return (
          <View key={control.key} style={[styles.control, locked && styles.locked]}>
            <View style={styles.top}>
              <View style={styles.name}>
                {locked ? <Icon name="lock" size={13} color={colors.textTertiary} /> : null}
                <Text style={styles.label}>{control.label}</Text>
              </View>
              <Text style={styles.value}>{formatControl(control, value)}</Text>
            </View>
            {control.kind === 'slider' && range ? (
              <SimSlider
                value={value}
                min={range.min}
                max={range.max}
                step={control.step}
                disabled={locked}
                onChange={(next) => onChange(control.key, next)}
                accessibilityLabel={control.label}
                valueText={formatControl(control, value)}
              />
            ) : null}
            {control.kind === 'choice' ? (
              <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={control.label}>
                {control.options.map((option) => {
                  const selected = option.value === value;
                  return (
                    <Interactive
                      key={option.value}
                      onPress={() => onChange(control.key, option.value)}
                      disabled={locked}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={option.label}
                      style={[styles.option, selected && styles.optionOn]}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextOn]}>{option.label}</Text>
                    </Interactive>
                  );
                })}
              </View>
            ) : null}
            <Text style={styles.hint}>{locked && !lockAll ? 'Locked for this task' : control.hint ?? ''}</Text>
          </View>
        );
      })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    control: { flexGrow: 1, flexBasis: 260, minWidth: 0, backgroundColor: colors.surfaceMuted, borderRadius: 14, padding: 12, gap: 6 },
    locked: { opacity: 0.6 },
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
    name: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
    label: { fontSize: 14, fontWeight: '800', color: colors.text },
    value: { fontSize: 14, fontWeight: '900', color: colors.primaryText },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    option: { borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, paddingVertical: 6, paddingHorizontal: 12 },
    optionOn: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    optionText: { fontSize: 13, fontWeight: '800', color: colors.textSecondary },
    optionTextOn: { color: colors.primaryText },
    hint: { fontSize: 12, lineHeight: 17, color: colors.textTertiary },
  });
}

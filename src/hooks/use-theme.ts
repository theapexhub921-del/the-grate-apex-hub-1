import { useMemo } from 'react';

import { ColorSchemeName, Colors, ThemeColors } from '@/constants/theme';
import { useAppearancePreference } from '@/data/settings';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Uses the learner's selected palette from Settings.
// "System" follows the device / browser appearance (light or dark).
export function useResolvedColorScheme(): ColorSchemeName {
  const preference = useAppearancePreference();
  const systemScheme = useColorScheme();

  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return preference;
}

// The active GRATEAPEX color palette.
export function useTheme(): ThemeColors {
  return Colors[useResolvedColorScheme()];
}

// Builds a screen's styles from the active palette.
// Usage: const styles = useThemedStyles(createStyles);
// Styles are rebuilt only when the theme changes.
export function useThemedStyles<T>(
  createStyles: (colors: ThemeColors) => T
): T {
  const colors = useTheme();

  return useMemo(() => createStyles(colors), [createStyles, colors]);
}

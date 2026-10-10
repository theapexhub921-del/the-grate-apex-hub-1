import { useMemo } from 'react';

import { ColorSchemeName, Colors, ThemeColors } from '@/constants/theme';
import type { ExperienceId } from '@/data/experience';
import { hybridGlass } from '@/data/experience-style';
import { legacyThemeById, legacyThemeColors, originalsThemeColors } from '@/data/legacy-theme-colors';
import { type HybridThemeFamily, useAppearancePreference, useHybridThemeFamily, useLegacyThemePreference } from '@/data/settings';
import { useExperience } from '@/hooks/use-experience';
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

/**
 * Which colours an experience uses:
 *   The Originals — the original app's theme (its own 15 themes only);
 *   Originate     — this app's Appearance palette;
 *   Hybrid        — either family, as chosen in Appearance, with glass panels.
 * The two saved choices are independent: switching experience never changes them.
 */
export function themeColorsFor(experience: ExperienceId, scheme: ColorSchemeName, legacyTheme: string, family: HybridThemeFamily): ThemeColors {
  if (experience === 'originals') return originalsThemeColors(legacyThemeById(legacyTheme));
  if (experience === 'hybrid') return family === 'originals' ? legacyThemeColors(legacyThemeById(legacyTheme)) : hybridGlass(Colors[scheme]);
  return Colors[scheme];
}

/** True when the experience is coloured by an original-app theme. */
export function useUsesLegacyTheme() {
  const experience = useExperience();
  const family = useHybridThemeFamily();
  return experience === 'originals' || (experience === 'hybrid' && family === 'originals');
}

// The active GRATEAPEX color palette.
export function useTheme(): ThemeColors {
  const experience = useExperience();
  const scheme = useResolvedColorScheme();
  const legacyTheme = useLegacyThemePreference();
  const family = useHybridThemeFamily();
  return themeColorsFor(experience, scheme, legacyTheme, family);
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

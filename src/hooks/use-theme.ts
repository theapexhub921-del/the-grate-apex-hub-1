import { useMemo } from 'react';

import { ColorSchemeName, Colors, ThemeColors } from '@/constants/theme';
import type { ExperienceId } from '@/data/experience';
import { hybridGlass } from '@/data/experience-style';
import { legacyThemeById, legacyThemeColors, originalsThemeColors } from '@/data/legacy-theme-colors';
import { useAppearancePreference, useLegacyThemePreference, useThemeFamilyPreference } from '@/data/settings';
import { effectiveThemeFamily, originalsFromNewer, originateFromLegacy, type ThemeFamily } from '@/data/theme-portrayal';
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
 * The colours for a theme in an experience. Every theme (newer or legacy) is
 * available in every experience, and each experience draws it its own way
 * (data/theme-portrayal.ts). Switching experience never changes the theme.
 */
export function themeColorsFor(experience: ExperienceId, scheme: ColorSchemeName, legacyTheme: string, chosen: ThemeFamily | null): ThemeColors {
  const family = effectiveThemeFamily(experience, chosen);
  const def = legacyThemeById(legacyTheme);
  if (experience === 'originals') return family === 'legacy' ? originalsThemeColors(def) : originalsFromNewer(Colors[scheme], scheme === 'light');
  if (experience === 'hybrid') return family === 'legacy' ? legacyThemeColors(def) : hybridGlass(Colors[scheme]);
  return family === 'legacy' ? originateFromLegacy(def) : Colors[scheme];
}

/** The theme family in use for this part of the interface. */
export function useThemeFamily(): ThemeFamily {
  return effectiveThemeFamily(useExperience(), useThemeFamilyPreference());
}

/** True when a legacy theme colours the interface. */
export function useUsesLegacyTheme() {
  return useThemeFamily() === 'legacy';
}

// The active GRATEAPEX color palette.
export function useTheme(): ThemeColors {
  const experience = useExperience();
  const scheme = useResolvedColorScheme();
  const legacyTheme = useLegacyThemePreference();
  const family = useThemeFamilyPreference();
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

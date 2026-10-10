import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useIsAdmin, useLegacyThemeUnlocks } from '@/components/experience/experience-sync';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { webStyle } from '@/components/ui/web';
import type { ThemeColors } from '@/constants/theme';
import { legacyLevel, legacyLockText } from '@/data/legacy-theme-colors';
import { LEGACY_THEMES, legacyColorsOf } from '@/data/legacy-themes';
import { useProgress } from '@/data/progress';
import { setHybridThemeFamily, setLegacyThemePreference, useHybridThemeFamily, useLegacyThemePreference } from '@/data/settings';
import { useExperience } from '@/hooks/use-experience';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// The original app's 15 themes with its own unlock rules (screens/ThemePicker.tsx):
// they unlock as the learner levels up (original levels: 1 + every 150 XP), or by
// earning an achievement (Christmas, Valentine); admin-only themes (brat) are
// hidden from everyone else. Rows are drawn as the original picker drew them.
//
// The Originals: the whole Appearance list. Hybrid: the "Original themes"
// family next to this app's themes (choosing one colours Hybrid with it).
export function OriginalThemePicker() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const experience = useExperience();
  const originals = experience === 'originals';
  const family = useHybridThemeFamily();
  const themeId = useLegacyThemePreference();
  const { isAdmin } = useIsAdmin();
  const unlockOf = useLegacyThemeUnlocks();
  const level = legacyLevel(useProgress().xp);
  const inUse = originals || family === 'originals';

  return (
    <View>
      <Text style={styles.sub}>You&apos;re Level {level}. Keep studying to unlock more.</Text>
      {LEGACY_THEMES.filter((theme) => !theme.adminOnly || isAdmin).map((theme) => {
        const lock = unlockOf(theme);
        const locked = !lock.unlocked;
        const on = inUse && themeId === theme.id;
        const c = legacyColorsOf(theme);
        return (
          <TouchableOpacity
            key={theme.id}
            disabled={locked}
            activeOpacity={0.85}
            onPress={() => {
              void setLegacyThemePreference(theme.id);
              if (!originals) void setHybridThemeFamily('originals');
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: on, disabled: locked }}
            accessibilityLabel={`${theme.name} theme. ${lock.unlocked ? theme.desc : legacyLockText(lock, false)}`}
            style={[styles.row, on && { borderColor: colors.accent, borderWidth: 2 }, locked && styles.locked]}
          >
            <View style={[styles.swatch, webStyle({ backgroundImage: `linear-gradient(180deg, ${c.gradient.join(', ')})` }), { backgroundColor: c.bg }]}>
              {originals ? <Text style={styles.swatchIcon}>{theme.icon}</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {theme.name}
                {on && originals ? '  ✓' : ''}
              </Text>
              <View style={styles.descRow}>
                {locked && !originals ? <Icon name="lock" size={12} color={colors.textTertiary} /> : null}
                <Text style={styles.desc}>{lock.unlocked ? theme.desc : legacyLockText(lock, originals)}</Text>
              </View>
            </View>
            {on && !originals ? (
              <View style={[styles.check, { backgroundColor: colors.primary }]}>
                <Icon name="check" size={11} color={colors.onPrimary} strokeWidth={3} />
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    sub: { color: colors.textSecondary, marginBottom: 18 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 18,
      padding: 12,
      marginBottom: 10,
      ...webStyle({ cursor: 'pointer' }),
    },
    locked: { opacity: 0.5, ...webStyle({ cursor: 'not-allowed' }) },
    swatch: { width: 54, height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
    swatchIcon: { fontSize: 22 },
    name: { color: colors.text, fontWeight: '700', fontSize: 16 },
    descRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
    desc: { color: colors.textTertiary, fontSize: 13, flexShrink: 1 },
    check: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  });
}

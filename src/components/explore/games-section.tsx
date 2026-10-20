import { type Href, router } from 'expo-router';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { STUDY_GAMES } from '@/data/games';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { useGameWarmUp } from '@/lib/game-warmup';

export const GAMES_HREF = '/games' as string as Href;

// The Games button, shown in Explore and in Connect where the games used to be.
// One tap opens the Games page (src/app/games/index.tsx) with every study game.
export function GamesEntry({ style }: { style?: StyleProp<ViewStyle> }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  useGameWarmUp();
  if (STUDY_GAMES.length === 0) return null;
  const names = STUDY_GAMES.map((game) => game.title);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  return (
    <PressableCard
      onPress={() => router.push(GAMES_HREF)}
      accessibilityRole="button"
      accessibilityLabel={`Games: ${list}`}
      accessibilityHint="Opens the Games page"
      style={[styles.entry, style]}
    >
      {/* Each game's own colour, stacked: a quick read of "there are several games here". */}
      <View style={styles.stack}>
        {STUDY_GAMES.slice(0, 3).map((game, index) => (
          <View key={game.id} style={[styles.chip, { backgroundColor: game.loadingColor, borderColor: colors.surface, marginLeft: index === 0 ? 0 : -14, zIndex: 3 - index }]}>
            <Text style={[styles.chipText, { color: game.accent }]}>{game.title.charAt(0)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.flex}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Games</Text>
          <Pill label={`${STUDY_GAMES.length} games`} tone="gold" />
        </View>
        <Text style={styles.text} numberOfLines={2}>{list}. Study games for a quick break that still counts.</Text>
      </View>
      <View style={styles.go}>
        <Icon name="play" size={14} color={colors.onPrimary} filled />
        <Text style={styles.goText}>Play</Text>
      </View>
    </PressableCard>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    entry: { flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
    stack: { flexDirection: 'row', alignItems: 'center' },
    chip: { width: 42, height: 42, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    chipText: { ...Type.headline, fontWeight: '800' },
    flex: { flex: 1, minWidth: 180, gap: 3 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    title: { ...Type.title3, color: colors.text },
    text: { fontSize: 13.5, lineHeight: 19, color: colors.textSecondary },
    go: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
    goText: { fontSize: 14, fontWeight: '700', color: colors.onPrimary },
  });
}

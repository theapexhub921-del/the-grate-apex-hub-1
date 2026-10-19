import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { STUDY_GAMES } from '@/data/games';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { useGameWarmUp } from '@/lib/game-warmup';

// Connect → study games, shown under Battles (the same entry style).
// Opens the game; its Multiplayer button creates or joins a live room.
export function StudyGamesCard() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  useGameWarmUp();
  return (
    <>
      {STUDY_GAMES.filter((game) => game.connectText).map((game) => (
        <PressableCard key={game.id} onPress={() => router.push(game.href as Href)} accessibilityLabel={game.title} style={styles.entry}>
          <View style={styles.entryIcon}><Icon name="sparkle" size={22} color={colors.primaryText} /></View>
          <View style={styles.flex}>
            <Text style={styles.entryTitle}>{game.title}</Text>
            <Text style={styles.entryText}>{game.connectText}</Text>
          </View>
          <Pill label="New" tone="gold" />
        </PressableCard>
      ))}
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    entry: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    entryIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    entryTitle: { ...Type.headline, color: colors.text },
    entryText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  });
}

import { type Href, router } from 'expo-router';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { SectionHeader } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { type ThemeColors } from '@/constants/theme';
import { STUDY_GAMES } from '@/data/games';
import { useThemedStyles } from '@/hooks/use-theme';
import { useGameWarmUp } from '@/lib/game-warmup';

// Explore → Games: study games (data in src/data/games.ts).
export function GamesSection({ style }: { style?: StyleProp<ViewStyle> }) {
  const styles = useThemedStyles(createStyles);
  useGameWarmUp();
  if (STUDY_GAMES.length === 0) return null;
  return (
    <View style={style}>
      <SectionHeader title="Games" subtitle="Study games for a quick break that still counts. Play solo or challenge your classmates." />
      <View style={styles.grid}>
        {STUDY_GAMES.map((game) => (
          <Card key={game.id} style={styles.card}>
            <View style={styles.tags}>
              <Pill label="New game" tone="gold" />
              {game.tags.map((tag) => <Pill key={tag} label={tag} tone="primary" />)}
            </View>
            <Text style={styles.title}>{game.title}</Text>
            <Text style={styles.tagline}>{game.tagline}</Text>
            <Text style={styles.description}>{game.description}</Text>
            <Button label="Play" trailing="→" onPress={() => router.push(game.href as Href)} style={styles.play} />
          </Card>
        ))}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 },
    card: { flexGrow: 1, flexBasis: 320, gap: 8 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    title: { fontSize: 22, lineHeight: 28, fontWeight: '800', color: colors.text, marginTop: 4 },
    tagline: { fontSize: 16, lineHeight: 23, fontWeight: '600', color: colors.primaryText },
    description: { fontSize: 15, lineHeight: 22, color: colors.textSecondary },
    play: { alignSelf: 'flex-start', marginTop: 6 },
  });
}

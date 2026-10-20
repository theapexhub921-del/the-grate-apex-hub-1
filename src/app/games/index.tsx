import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { CardGrid } from '@/components/ui/card-grid';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/interactive';
import { List, ListRow } from '@/components/ui/list';
import { Pill } from '@/components/ui/pill';
import { PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Type, type ThemeColors } from '@/constants/theme';
import { STUDY_GAMES, type StudyGame } from '@/data/games';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { useGameWarmUp } from '@/lib/game-warmup';

// Text on a game's cover (the cover is the game's own dark loading colour in every theme).
const ON_COVER = '#FFFFFF';
const ON_COVER_MUTED = 'rgba(255, 255, 255, 0.78)';
const ON_COVER_FAINT = 'rgba(255, 255, 255, 0.22)';

const play = (game: StudyGame) => router.push(game.href as Href);

/** One game: a coloured cover with its name, then what it is, how it works and Play. */
function GameCard({ game, index }: { game: StudyGame; index: number }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const multiplayer = game.tags.some((tag) => /multiplayer/i.test(tag));
  return (
    <Card style={styles.card}>
      <View style={[styles.cover, { backgroundColor: game.loadingColor }]}>
        <View style={styles.coverTop}>
          <Text style={[styles.genre, { color: game.accent }]}>{game.genre.toUpperCase()}</Text>
          <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <View style={styles.coverBottom}>
          <View style={[styles.rule, { backgroundColor: game.accent }]} />
          <Text style={styles.coverTitle} accessibilityRole="header">{game.title}</Text>
          <Text style={styles.coverTagline}>{game.tagline}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.tags}>
          {multiplayer ? <Pill label="Play with classmates" tone="gold" /> : null}
          {game.tags.filter((tag) => !/multiplayer|single player/i.test(tag)).map((tag) => <Pill key={tag} label={tag} tone="primary" />)}
        </View>
        <Text style={styles.description}>{game.description}</Text>

        <View style={styles.steps}>
          <Text style={styles.stepsLabel}>How it works</Text>
          {game.steps.map((step, stepIndex) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{stepIndex + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
        <Button label={`Play ${game.title}`} icon={<Icon name="play" size={16} color={colors.onPrimary} filled />} onPress={() => play(game)} fullWidth />
      </View>
    </Card>
  );
}

// Games: every study game in one place (src/data/games.ts), opened from the
// Games button in Explore and in Connect. Each game plays on its own page.
export default function GamesScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  useGameWarmUp();
  const multiplayerCount = STUDY_GAMES.filter((game) => game.connectText).length;

  return (
    <Screen width="wide">
      <BackLink fallback={'/explore' as Href} />
      <PageHeader
        eyebrow="Study games"
        title="Games"
        subtitle="Study games for a quick break that still counts. Pick one, play a round, and come back to your lessons sharper."
      />

      <View style={styles.facts}>
        <View style={styles.fact}>
          <Text style={styles.factValue}>{STUDY_GAMES.length}</Text>
          <Text style={styles.factLabel}>games to play</Text>
        </View>
        <View style={styles.factDivider} />
        <View style={styles.fact}>
          <Text style={styles.factValue}>{multiplayerCount}</Text>
          <Text style={styles.factLabel}>with live multiplayer</Text>
        </View>
        <View style={styles.factDivider} />
        <View style={styles.fact}>
          <Icon name="check" size={22} color={colors.successText} />
          <Text style={styles.factLabel}>plays offline once opened</Text>
        </View>
      </View>

      <CardGrid minItemWidth={300} maxColumns={3} gap={16} style={styles.grid}>
        {STUDY_GAMES.map((game, index) => <GameCard key={game.id} game={game} index={index} />)}
      </CardGrid>

      <SectionHeader title="Not sure which to play?" subtitle="Choose by what you want to practise right now." style={styles.section} />
      <List>
        {STUDY_GAMES.map((game) => (
          <ListRow
            key={game.id}
            title={game.title}
            detail={game.bestFor}
            meta={game.genre}
            onPress={() => play(game)}
            accessibilityLabel={`Play ${game.title}. ${game.bestFor}`}
            leading={<View style={[styles.swatch, { backgroundColor: game.loadingColor }]}><Text style={[styles.swatchText, { color: game.accent }]}>{game.title.charAt(0)}</Text></View>}
          />
        ))}
      </List>

      <Card tone="muted" style={styles.note}>
        <Icon name="info" size={18} color={colors.textSecondary} />
        <Text style={styles.noteText}>
          Each game saves its own progress in this browser. Once you have opened a game it also plays without a connection.
        </Text>
      </Card>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    facts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 4, paddingVertical: 12, paddingHorizontal: 16, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    fact: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    factValue: { ...Type.title2, ...Type.numeral, color: colors.text },
    factLabel: { ...Type.callout, color: colors.textSecondary },
    factDivider: { width: 1, height: 22, backgroundColor: colors.border },
    grid: { marginTop: 20 },

    card: { flexGrow: 1, padding: 0, overflow: 'hidden' },
    cover: { minHeight: 176, padding: 18, justifyContent: 'space-between', gap: 18 },
    coverTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
    genre: { ...Type.overline },
    number: { ...Type.display, ...Type.numeral, fontSize: 40, lineHeight: 42, color: ON_COVER_FAINT },
    coverBottom: { gap: 6 },
    rule: { width: 28, height: 3, borderRadius: 2, marginBottom: 4 },
    coverTitle: { ...Type.title1, color: ON_COVER },
    coverTagline: { fontSize: 14.5, lineHeight: 20, fontWeight: '600', color: ON_COVER_MUTED },

    body: { flexGrow: 1, padding: 18, gap: 14 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    description: { ...Type.body, color: colors.textSecondary },
    steps: { gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
    stepsLabel: { ...Type.overline, color: colors.textTertiary },
    step: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    stepNumber: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
    stepNumberText: { fontSize: 12, fontWeight: '800', color: colors.primaryText },
    stepText: { flex: 1, ...Type.callout, color: colors.text },
    spacer: { flexGrow: 1 },

    section: { marginTop: 32 },
    swatch: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    swatchText: { ...Type.headline, fontWeight: '800' },
    note: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 20 },
    noteText: { flex: 1, ...Type.callout, color: colors.textSecondary },
  });
}

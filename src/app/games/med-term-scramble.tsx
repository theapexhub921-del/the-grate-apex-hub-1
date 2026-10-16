import { type Href } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createElement } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { PageHeader, Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { isDesktopWidth, type ThemeColors } from '@/constants/theme';
import { getStudyGame, LIVE_SITE } from '@/data/games';
import { useDisplayName } from '@/data/user';
import { useResolvedColorScheme, useThemedStyles } from '@/hooks/use-theme';
import { isLocalPreview } from '@/lib/local-preview';

const EXPLORE_HREF = '/explore' as Href;
const game = getStudyGame('med-term-scramble')!;

// Plays Med Term Scramble (a Godot web build in public/game-builds/).
// The learner's name and light/dark choice are passed to the game in the URL.
// The game keeps its own progress in this browser.
export default function MedTermScrambleScreen() {
  const styles = useThemedStyles(createStyles);
  const scheme = useResolvedColorScheme();
  const name = useDisplayName();
  const { width } = useWindowDimensions();
  const query = new URLSearchParams({ theme: scheme === 'dark' ? 'dark' : 'light', ...(name ? { name } : {}) }).toString();
  // The live site serves play.html as /play (clean URLs), so ask for /play there
  // and skip the redirect; `npm run web` only knows the real file name.
  const page = isLocalPreview() ? game.buildPath : game.buildPath.replace(/\.html$/, '');
  const src = `${page}?${query}`;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.page, !isDesktopWidth(width) && styles.pageMobile]}>
        <View style={styles.bar}>
          <BackLink fallback={EXPLORE_HREF} label="Explore" />
          <Text style={styles.barTitle}>{game.title}</Text>
        </View>
        {createElement('iframe', {
          src,
          title: game.title,
          allow: 'autoplay; fullscreen',
          style: { flex: 1, width: '100%', minHeight: 0, border: 0, borderRadius: 16, backgroundColor: 'transparent' },
        })}
      </View>
    );
  }

  // Phones: the game runs in the browser.
  return (
    <Screen width="prose">
      <BackLink fallback={EXPLORE_HREF} label="Explore" />
      <PageHeader eyebrow="Games" title={game.title} subtitle={game.description} />
      <Button label="Play in your browser" trailing="→" onPress={() => void WebBrowser.openBrowserAsync(`${LIVE_SITE}${src}`)} />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    page: { flex: 1, padding: 16, gap: 10 },
    pageMobile: { paddingBottom: 96 },
    bar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    barTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  });
}

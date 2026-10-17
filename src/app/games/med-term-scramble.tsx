import { type Href, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createElement, useCallback, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { setTabBarLocked } from '@/components/tab-bar-visibility';
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
// The game keeps its own progress in this browser, and once played it also
// opens with no connection (public/sw.js keeps a copy).
// Like a chat, the game takes the whole screen: no bottom bar, no card around it.
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
  const desktop = isDesktopWidth(width);

  // The app keeps pages alive after you leave them, so the game is only on the
  // page while it is open: leaving removes it (sound and all) and coming back
  // starts it again (the game saves its own progress). The bottom bar goes away
  // while the game is open and comes back on leaving.
  const [open, setOpen] = useState(false);
  useFocusEffect(useCallback(() => {
    setOpen(true);
    setTabBarLocked(true);
    return () => {
      setOpen(false);
      setTabBarLocked(false);
    };
  }, []));

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.page, desktop && styles.pageDesktop]}>
        <View style={[styles.bar, !desktop && styles.barMobile]}>
          <BackLink fallback={EXPLORE_HREF} label="Explore" />
          <Text style={styles.barTitle} numberOfLines={1}>{game.title}</Text>
        </View>
        {open ? createElement('iframe', {
          src,
          title: game.title,
          allow: 'autoplay; fullscreen',
          style: { flex: 1, width: '100%', minHeight: 0, border: 0, borderRadius: desktop ? 12 : 0, backgroundColor: '#14101e' },
        }) : null}
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
    // Phones: edge to edge under a slim bar. Computers: the space beside the sidebar, thin margin.
    page: { flex: 1 },
    pageDesktop: { padding: 12, gap: 8 },
    bar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    barMobile: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 4, backgroundColor: colors.background },
    barTitle: { flexShrink: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  });
}

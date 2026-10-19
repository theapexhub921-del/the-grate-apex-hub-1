import { type Href, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createElement, useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { setTabBarLocked } from '@/components/tab-bar-visibility';
import { Button } from '@/components/ui/button';
import { PageHeader, Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { type ThemeColors } from '@/constants/theme';
import { LIVE_SITE, type StudyGame } from '@/data/games';
import { usePageZoomPreference } from '@/data/settings';
import { useDisplayName } from '@/data/user';
import { useResolvedColorScheme, useThemedStyles } from '@/hooks/use-theme';
import { isLocalPreview } from '@/lib/local-preview';

const EXPLORE_HREF = '/explore' as Href;

// Plays a study game (a Godot web build in public/game-builds/, listed in src/data/games.ts).
// The learner's name and light/dark choice are passed to the game in the URL.
// The game keeps its own progress in this browser, and once played it also
// opens with no connection (public/sw.js keeps a copy).
// Like a chat, the game takes the whole screen: no bottom bar, no card around it.
export function GamePlayer({ game }: { game: StudyGame }) {
  const styles = useThemedStyles(createStyles);
  const scheme = useResolvedColorScheme();
  const name = useDisplayName();
  const query = new URLSearchParams({ theme: scheme === 'dark' ? 'dark' : 'light', ...(name ? { name } : {}) }).toString();
  // The live site serves play.html as /play (clean URLs), so ask for /play there
  // and skip the redirect; `npm run web` only knows the real file name.
  const page = isLocalPreview() ? game.buildPath : game.buildPath.replace(/\.html$/, '');
  const src = `${page}?${query}`;
  // Settings → Appearance → page zoom scales the whole page; the game is drawn
  // at its own sharpness, so it is set back to 100% (otherwise it is resampled and blurry).
  const pageZoom = usePageZoomPreference();

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
      <View style={styles.page}>
        <View style={styles.bar}>
          <BackLink fallback={EXPLORE_HREF} label="Explore" />
          <Text style={styles.barTitle} numberOfLines={1}>{game.title}</Text>
        </View>
        {open ? createElement('iframe', {
          src,
          title: game.title,
          allow: 'autoplay; fullscreen',
          style: { flex: 1, width: '100%', minHeight: 0, border: 0, display: 'block', backgroundColor: game.loadingColor, ...(pageZoom !== 100 ? { zoom: 100 / pageZoom } : null) },
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
    // Edge to edge under a slim bar, on phones and computers (beside the sidebar): no card, no margin.
    page: { flex: 1 },
    bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 4, backgroundColor: colors.background },
    barTitle: { flexShrink: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  });
}

import { useEffect } from 'react';
import { Platform } from 'react-native';

import { STUDY_GAMES } from '@/data/games';

type Connection = { saveData?: boolean; effectiveType?: string; type?: string };

const started = new Set<string>();

/**
 * Starts downloading a study game's engine (about 10 MB) in the background, so
 * pressing Play opens the game quickly instead of waiting for the download.
 * Only on a fast connection that is not mobile data or data saver; with no
 * connection details (Safari, Firefox), only on a computer-sized screen. The
 * browser keeps the files for the game page.
 */
export function warmUpGame(buildPath: string) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const folder = buildPath.slice(0, buildPath.lastIndexOf('/') + 1);
  if (started.has(folder)) return;
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (connection?.saveData || connection?.type === 'cellular') return;
  if (connection?.effectiveType && connection.effectiveType !== '4g') return;
  if (!connection?.type && window.innerWidth < 1024) return;
  started.add(folder);
  for (const file of ['index.js', 'index.wasm', 'index.pck']) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = folder + file;
    document.head.appendChild(link);
  }
}

/** Warms up every study game a couple of seconds after a game card is shown. */
export function useGameWarmUp() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const timer = setTimeout(() => STUDY_GAMES.forEach((game) => warmUpGame(game.buildPath)), 2500);
    return () => clearTimeout(timer);
  }, []);
}

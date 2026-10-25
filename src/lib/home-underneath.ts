import { router, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Home underneath (owner, 2026-10-25: "the back button on phones sometimes closes
// the app instead of going to the previous page", reported in the games). When
// the app starts on a page other than Home (Android reopening it there, a
// notification, a shared link), there is no page before it in the browser's
// history, so the phone's Back button closed the app straight away.
//
// Web only. The entry the app opened on is marked and the same page is added on
// top of it; Back from that page lands on the marked entry, which then turns into
// Home (through the router, so it stays in step). Back on Home closes the app.
// - It happens at the learner's first tap or key press: Chrome on Android skips
//   history entries a page adds before the user has touched it.
// - The marker is read by a listener added when this file loads, before the
//   router's own: the browser calls them in that order, and the router rewrites
//   the entry (dropping the marker) when it handles the same Back.

const BASE = 'gxHomeUnderneath';
// Sign-in, setup, legal and embedded pages have their own way out.
const SKIP = /^\/(login|onboarding|choose-|suggested|privacy|terms|widget)/;
let installed = false;

type HistoryState = Record<string, unknown> | null;
const historyState = () => window.history.state as HistoryState;

// The marked entry's router id, and whether Home has been shown from it.
let baseId: unknown = null;
let homeShown = false;

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    const state = historyState();
    if (state?.[BASE] && !homeShown) {
      homeShown = true;
      // After the router has handled the same Back (it restores the page it knows).
      setTimeout(() => router.replace('/'), 0);
    } else if (homeShown && baseId && state?.id === baseId && window.location.pathname !== '/') {
      // The router opens Home on top of the marked entry; Back from that Home
      // lands here again, so carry on out of the app, as Back on Home should.
      window.history.back();
    }
  });
}

function openedFresh() {
  try {
    const entry = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
    return !entry || entry.type === 'navigate'; // a reload or back/forward keeps the history it had
  } catch {
    return true;
  }
}

export function useHomeUnderneath() {
  const ready = Boolean(useRootNavigationState()?.key);
  useEffect(() => {
    if (!ready || installed || Platform.OS !== 'web' || typeof window === 'undefined') return;
    installed = true;
    if (window.location.pathname === '/' || !openedFresh()) return;
    const firstEntry = historyState()?.id;

    const insert = () => {
      window.removeEventListener('pointerup', insert, true);
      window.removeEventListener('keydown', insert, true);
      const state = historyState();
      const { pathname, search, hash } = window.location;
      // Only while still on the entry the app opened on (the router keeps its id when it replaces).
      if (pathname === '/' || SKIP.test(pathname) || state?.id !== firstEntry) return;
      const here = pathname + search + hash;
      baseId = state?.id ?? null;
      window.history.replaceState({ ...state, [BASE]: true }, '', here);
      window.history.pushState(state, '', here);
    };
    window.addEventListener('pointerup', insert, true);
    window.addEventListener('keydown', insert, true);
  }, [ready]);
}

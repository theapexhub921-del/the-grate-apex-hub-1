// A shared link opened by someone who is signed out (owner, 2026-10-29: shared
// questions and quizzes bring new learners in). The guard in _layout.tsx sends
// them to sign in; the link is kept here and opened once they are signed in and
// set up, instead of dropping them on Home. Web only (shared links are web
// addresses); kept for this tab only.
import { Platform } from 'react-native';

const KEY = 'grateapex_return_to';

/** Only links into the study pages are kept (never login, settings or anything odd). */
export const isReturnPath = (path: string) => /^\/learn\/[a-z-]+(\?[^#\s]*)?$/.test(path);

export function rememberReturnTo() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  const path = `${window.location.pathname}${window.location.search}`;
  if (!isReturnPath(path)) return;
  try {
    window.sessionStorage.setItem(KEY, path);
  } catch {
    // Storage blocked: the learner lands on Home instead.
  }
}

/** The kept link, once (it is cleared). */
export function takeReturnTo(): string | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const path = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return path && isReturnPath(path) ? path : null;
  } catch {
    return null;
  }
}

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Platform } from 'react-native';

import { auth } from '@/lib/firebase';
import { track } from '@/lib/analytics';

export type GoogleResult =
  | { status: 'redirecting' }
  | { status: 'signed-in' }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

const PENDING_KEY = 'grateapex_oauth_pending';

export type OAuthFlow = 'installed-pwa' | 'legacy';

export function markOAuthPending(flow: OAuthFlow = 'legacy') {
  try {
    if (typeof window !== 'undefined') {
      // localStorage survives the Store app opening an out-of-scope Google page
      // and then restoring the hosted PWA in a fresh browsing context.
      window.localStorage.setItem(PENDING_KEY, JSON.stringify({ at: Date.now(), flow }));
    }
  } catch {}
}

export function takeOAuthPending(): OAuthFlow | null {
  try {
    if (typeof window === 'undefined') return null;
    const value = window.localStorage.getItem(PENDING_KEY);
    window.localStorage.removeItem(PENDING_KEY);
    if (value) {
      try {
        const pending = JSON.parse(value) as { at?: number; flow?: OAuthFlow };
        if (pending.at && Date.now() - pending.at < 30 * 60 * 1000) return pending.flow === 'installed-pwa' ? 'installed-pwa' : 'legacy';
      } catch {
        // Older releases stored the time directly in sessionStorage.
      }
    }

    const oldValue = window.sessionStorage.getItem(PENDING_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    return Boolean(oldValue) && Date.now() - Number(oldValue) < 30 * 60 * 1000 ? 'legacy' : null;
  } catch {
    return null;
  }
}

function isInstalledPwa() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches === true
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function friendlyGoogleError(message: string | null | undefined) {
  const text = (message ?? '').toLowerCase();
  if (text.includes('popup-closed') || text.includes('cancelled') || text.includes('user cancelled')) {
    return 'Google sign-in was cancelled.';
  }
  if (text.includes('unauthorized') || text.includes('not enabled')) {
    return 'Google sign-in isn’t enabled in Firebase yet. Please use your email and password for now.';
  }
  return message || 'Google sign-in didn’t complete. Please try again, or use your email and password.';
}

export async function signInWithGoogle(): Promise<GoogleResult> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    // No profile is created here: a first Google sign-in has no username yet,
    // so the route guard sends the learner to /choose-username, which reserves
    // one and creates the profile (lib/accounts.ts).
    // A Store PWA can return from Google's out-of-scope page in a fresh
    // browsing context, so use Firebase's same-origin redirect helper there.
    // Regular browsers keep the popup flow, which does not need redirect state.
    if (isInstalledPwa()) {
      const { getPwaOAuthAuth } = await import('@/lib/firebase-pwa-auth');
      markOAuthPending('installed-pwa');
      await signInWithRedirect(getPwaOAuthAuth(), provider);
      return { status: 'redirecting' };
    }

    await signInWithPopup(auth, provider);
    track('login', { method: 'google' });

    return { status: 'signed-in' };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      return { status: 'cancelled' };
    }
    return { status: 'error', message: friendlyGoogleError(error?.message) };
  }
}

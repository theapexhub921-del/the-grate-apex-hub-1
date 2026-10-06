import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

// "Continue with Google" through the existing Supabase auth (no separate
// auth system). Supabase handles the Google account; we only start the
// flow and bring the learner back.
//
//   web    → leave for Google, return to /login with the session in the
//            address (picked up automatically: detectSessionInUrl)
//   native → system browser sheet, then hand the tokens to Supabase
//
// Google must be switched on in the Supabase dashboard
// (Authentication → Providers → Google). If it is not, the learner gets a
// clear message instead of a raw error page.

export type GoogleResult =
  | { status: 'redirecting' } // web: the browser is leaving for Google
  | { status: 'signed-in' } // native: session established
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

// Remembers (for this browser tab) that we left for Google, so an error in
// the return address is explained as a Google problem, not an email link.
const PENDING_KEY = 'grateapex_oauth_pending';

export function markOAuthPending() {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(PENDING_KEY, String(Date.now()));
  } catch {}
}

/** True (once) when this page load is the return from a Google sign-in. */
export function takeOAuthPending(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const value = window.sessionStorage.getItem(PENDING_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    return Boolean(value) && Date.now() - Number(value) < 30 * 60 * 1000;
  } catch {
    return false;
  }
}

export function friendlyGoogleError(message: string | null | undefined) {
  const text = (message ?? '').toLowerCase();
  if (text.includes('provider is not enabled') || text.includes('unsupported provider')) {
    return 'Google sign-in isn’t switched on for GrAteApex Hub yet. Please use your email and password for now.';
  }
  if (text.includes('access_denied') || text.includes('cancel')) {
    return 'Google sign-in was cancelled.';
  }
  return 'Google sign-in didn’t complete. Please try again, or use your email and password.';
}

function readParams(url: string) {
  const query = url.includes('?') ? url.slice(url.indexOf('?') + 1).split('#')[0] : '';
  const hash = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
  return new URLSearchParams(`${query}&${hash}`);
}

export async function signInWithGoogle(): Promise<GoogleResult> {
  const redirectTo = Platform.OS === 'web' && typeof window !== 'undefined' ? `${window.location.origin}/login` : Linking.createURL('/login');

  let url: string | undefined;
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
    });
    if (error) return { status: 'error', message: friendlyGoogleError(error.message) };
    url = data?.url ?? undefined;
  } catch {
    return { status: 'error', message: 'Could not reach the server. Check your connection and try again.' };
  }
  if (!url) return { status: 'error', message: friendlyGoogleError(null) };

  if (Platform.OS === 'web') {
    // Check Google is switched on before leaving the app. A working
    // provider answers with a redirect (opaque to us); a disabled one
    // answers 400 with a reason. If the check itself fails, just go.
    try {
      const probe = await fetch(url, { redirect: 'manual' });
      if (probe.type !== 'opaqueredirect' && probe.status >= 400) {
        let reason = '';
        try {
          const body = await probe.json();
          reason = String(body?.msg ?? body?.error_description ?? body?.message ?? '');
        } catch {}
        return { status: 'error', message: friendlyGoogleError(reason) };
      }
    } catch {}
    markOAuthPending();
    window.location.assign(url);
    return { status: 'redirecting' };
  }

  // Native: system browser sheet that returns to the app.
  try {
    const result = await WebBrowser.openAuthSessionAsync(url, redirectTo);
    if (result.type !== 'success') return { status: 'cancelled' };
    const params = readParams(result.url);
    const failure = params.get('error_description') ?? params.get('error');
    if (failure) return { status: 'error', message: friendlyGoogleError(failure) };
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const code = params.get('code');
    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) return { status: 'error', message: friendlyGoogleError(error.message) };
      return { status: 'signed-in' };
    }
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return { status: 'error', message: friendlyGoogleError(error.message) };
      return { status: 'signed-in' };
    }
    return { status: 'error', message: friendlyGoogleError(null) };
  } catch {
    return { status: 'error', message: 'Could not open Google sign-in. Please try again.' };
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { deleteUser, EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, signOut, type User } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

import { friendlyError } from '@/lib/errors';
import { auth, db } from '@/lib/firebase';
import { isInstalledPwa } from '@/lib/google-auth';
import { API_BASE } from '@/lib/live-site';

// Firebase only deletes an account that signed in within the last 5 minutes
// (otherwise "auth/requires-recent-login"). Check this BEFORE deleting any
// data, so a refused final step never leaves a half-deleted account.
const RECENT_SIGN_IN_MS = 4 * 60 * 1000;

/**
 * Full deletion (profile, username, leaderboard entry, everything shared) runs on
 * the server with the admin key: api/delete-account.mjs. Where there is no such
 * server (a local preview, or the key is missing: 503) the app deletes what the
 * rules allow instead (the login and private progress).
 */
export const ACCOUNT_DELETION_URL = process.env.EXPO_PUBLIC_ACCOUNT_DELETION_URL || `${API_BASE}/api/delete-account`;
export const FULL_ACCOUNT_DELETION = true;

const SIGN_IN_AGAIN =
  'For your security, please sign out, sign in again, and then delete your account within a few minutes.';

/** How the learner confirms who they are before deleting: their password, or Google. */
export type DeleteConfirmation = 'password' | 'google' | 'sign-in-again';

/**
 * Firebase asks for a fresh sign-in before an account can be deleted. Rather
 * than sending the learner away to sign out and in again, the delete dialog
 * confirms their identity on the spot: a password field for email accounts,
 * a Google pop-up for Google accounts (web). Phones signed in with Google
 * still need to sign in again, as before.
 */
export function deleteConfirmationFor(user: User | null = auth.currentUser): DeleteConfirmation {
  const providers = (user?.providerData ?? []).map((info) => info.providerId);
  if (providers.includes('password')) return 'password';
  // The installed app (Android, installed web app) cannot open Google's pop-up.
  if (providers.includes('google.com') && Platform.OS === 'web' && !isInstalledPwa()) return 'google';
  return 'sign-in-again';
}

async function confirmIdentity(user: User, password: string | undefined): Promise<string | null> {
  const way = deleteConfirmationFor(user);
  try {
    if (way === 'password') {
      if (!password) return 'Please enter your password to confirm.';
      if (!user.email) return SIGN_IN_AGAIN;
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      return null;
    }
    if (way === 'google') {
      await reauthenticateWithPopup(user, new GoogleAuthProvider());
      return null;
    }
    return SIGN_IN_AGAIN;
  } catch (error: any) {
    const code = String(error?.code ?? '');
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') return 'That password is not right. Please try again.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes and try again.';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return 'Google confirmation was cancelled, so nothing was deleted.';
    if (code === 'auth/user-mismatch') return 'Please confirm with the same Google account you are signed in with.';
    if (code === 'auth/network-request-failed') return 'No connection. Please check your internet and try again.';
    // Google's pop-up could not open (blocked, or not allowed here): signing in again works everywhere.
    if (way === 'google') return SIGN_IN_AGAIN;
    return 'We could not confirm it is you. Please try again.';
  }
}

async function clearLocalCache(userId: string) {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys.filter((key) => key.includes(userId)));
  } catch {
    // Leftover cache is harmless
  }
}

export async function deleteMyAccount(options: { password?: string } = {}): Promise<{ error: string | null }> {
  const user = auth.currentUser;
  if (!user) return { error: 'You are not signed in.' };
  const userId = user.uid;

  try {
    // Confirm who it is first, unless they signed in moments ago.
    const { authTime } = await user.getIdTokenResult();
    if (!(Date.now() - Date.parse(authTime) < RECENT_SIGN_IN_MS)) {
      const problem = await confirmIdentity(user, options.password);
      if (problem) return { error: problem };
    }
    const { token } = await user.getIdTokenResult(true);

    // Everything, on the trusted server (api/delete-account.mjs).
    const response = await fetch(ACCOUNT_DELETION_URL, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
    const body = response ? ((await response.json().catch(() => null)) as { deleted?: boolean; error?: string } | null) : null;
    if (response?.ok && body?.deleted) {
      await clearLocalCache(userId);
      await signOut(auth).catch(() => undefined);
      return { error: null };
    }
    // The server answered but refused (sign in again) or failed part-way (safe to retry).
    if (response && body && response.status !== 503) return { error: body.error || 'Your account could not be deleted. Please try again.' };
    if (!response && typeof navigator !== 'undefined' && navigator.onLine === false) return { error: 'No connection. Please check your internet and try again.' };

    // No deletion server here (a local preview, or not set up yet): what the rules allow.

    // Private progress (the rules allow the owner to delete it). The
    // deployed rules refuse deletes of users/{uid}, scores/{uid} and
    // usernames/{name} from the app, so those stay until a trusted server
    // removes them — see docs/firestore-compatibility.md.
    await deleteDoc(doc(db, 'progress', userId));

    // Delete Firebase Auth user
    await deleteUser(user);

    await clearLocalCache(userId);

    return { error: null };
  } catch (error: any) {
    if (error?.code === 'auth/requires-recent-login') return { error: SIGN_IN_AGAIN };
    return { error: friendlyError(error, 'Your account could not be deleted. Please try again.') };
  }
}

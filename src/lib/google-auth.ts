import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export type GoogleResult =
  | { status: 'redirecting' }
  | { status: 'signed-in' }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

const PENDING_KEY = 'grateapex_oauth_pending';

export function markOAuthPending() {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(PENDING_KEY, String(Date.now()));
  } catch {}
}

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
    const cred = await signInWithPopup(auth, provider);

    const userDocRef = doc(db, 'users', cred.user.uid);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      await setDoc(
        userDocRef,
        {
          username: cred.user.displayName || cred.user.email?.split('@')[0] || 'Learner',
          createdAt: serverTimestamp(),
          onboardingDone: false,
          tutorialDone: false,
          semester: 1,
          hall: '',
          autoHideNav: true,
          classLocked: false,
          remindersOff: false,
        },
        { merge: true }
      );
    }

    return { status: 'signed-in' };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      return { status: 'cancelled' };
    }
    return { status: 'error', message: friendlyGoogleError(error?.message) };
  }
}

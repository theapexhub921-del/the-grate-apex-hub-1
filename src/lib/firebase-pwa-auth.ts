import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { app } from '@/lib/firebase';

const PWA_AUTH_APP_NAME = 'grateapex-pwa-oauth';
let pwaAuth: ReturnType<typeof getAuth> | null = null;

/**
 * Store/installed PWAs use an auth helper on the app's own origin. This avoids
 * losing Firebase's redirect state when Edge returns from Google's sign-in page.
 * Set EXPO_PUBLIC_PWA_AUTH_DOMAIN if the production app domain changes.
 */
export function getPwaOAuthAuth() {
  if (pwaAuth) return pwaAuth;

  const existingApp = getApps().find((item) => item.name === PWA_AUTH_APP_NAME);
  const pwaApp = existingApp ?? initializeApp({
    ...app.options,
    authDomain: process.env.EXPO_PUBLIC_PWA_AUTH_DOMAIN || 'grateapex.vercel.app',
  }, PWA_AUTH_APP_NAME);

  pwaAuth = getAuth(pwaApp);
  return pwaAuth;
}

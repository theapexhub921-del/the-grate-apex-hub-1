// The Android app (docs/android-app.md): a Trusted Web Activity that opens the
// live site full screen. Its APK is served from public/downloads.
import { Platform } from 'react-native';

import { LIVE_SITE } from '@/lib/live-site';

export const ANDROID_PACKAGE = 'com.grateapex.app';
export const ANDROID_APK_URL = `${LIVE_SITE}/downloads/grateapex.apk`;
export const ANDROID_APK_SIZE = '1.4 MB';

const KEY = 'grateapex_in_android_app';

/**
 * True when this page is running inside the Android app. The app opens the
 * site with an android-app:// referrer on its first page only, so it is
 * remembered for the session (not longer: the app shares storage with Chrome).
 */
export function inAndroidApp(): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return false;
  try {
    if (document.referrer.startsWith(`android-app://${ANDROID_PACKAGE}`)) {
      window.sessionStorage.setItem(KEY, '1');
      return true;
    }
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return document.referrer.startsWith(`android-app://${ANDROID_PACKAGE}`);
  }
}

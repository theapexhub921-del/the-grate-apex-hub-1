import { Platform } from 'react-native';

import { app } from '@/lib/firebase';

// Usage numbers (owner, 2026-10-20): Google Analytics for Firebase, web only.
//
// The Firebase project already has Google Analytics linked (measurementId in
// lib/firebase.ts). Page views are counted automatically; the events below are
// the few that show whether the app is working for learners:
//   sign_up, login, lesson_complete (+ first_lesson_complete), quiz_complete,
//   apex_challenge_complete, battle_start, battle_finish, stamp_sent.
// Read them in the Firebase console → Analytics (or Google Analytics → Reports).
//
// Nothing personal is sent: no names, emails or answers, only the event, a few
// counts and Firebase's own anonymous user id. Analytics never blocks the app:
// every call is fire-and-forget and errors are ignored. On phones (native) it
// does nothing; the Android app is the website, so it is counted as web.

type Params = Record<string, string | number | boolean>;
type AnalyticsModule = typeof import('firebase/analytics');

let ready: Promise<{ mod: AnalyticsModule; analytics: import('firebase/analytics').Analytics } | null> | null = null;

function load() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return Promise.resolve(null);
  // Local checks with the Firebase emulators should not count as real use.
  if (process.env.EXPO_PUBLIC_FIREBASE_EMULATOR === '1') return Promise.resolve(null);
  if (!ready) {
    ready = import('firebase/analytics')
      .then(async (mod) => ((await mod.isSupported()) ? { mod, analytics: mod.getAnalytics(app) } : null))
      .catch(() => null);
  }
  return ready;
}

/** Start Analytics early (page views are counted from here). Safe to call more than once. */
export function initAnalytics() {
  void load();
}

/** Record one event, e.g. track('lesson_complete', { lesson_id: 'fab-1' }). */
export function track(name: string, params?: Params) {
  void load().then((a) => {
    if (a) a.mod.logEvent(a.analytics, name, params);
  }).catch(() => undefined);
}

/** Link events to the signed-in account (Firebase's anonymous id, never an email), or clear it on sign-out. */
export function setAnalyticsUser(uid: string | null) {
  void load().then((a) => {
    if (a) a.mod.setUserId(a.analytics, uid);
  }).catch(() => undefined);
}

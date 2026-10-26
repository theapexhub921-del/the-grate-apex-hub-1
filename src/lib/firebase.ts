import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, type Firestore, getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { Platform } from 'react-native';

import { createAuth } from '@/lib/firebase-auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCy4HizcdGEYEMC45mbrq4S4U2znUM9k6I',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'grate-apex.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'grate-apex',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'grate-apex.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '24083972640',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:24083972640:web:3d01b201dfc51be7b93245',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-V1QW3SBBPT',
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
// Sign-ins are saved on the device (web storage, or AsyncStorage on phones: lib/firebase-auth*.ts).
export const auth = createAuth(app);
export const db = makeFirestore();

/**
 * On the web, what the app reads from Firebase is also kept in the browser (IndexedDB),
 * like the original app kept its data on the device (owner, 2026-10-26): when Firebase
 * can't be reached — no connection, or the free plan's daily reads used up — learners
 * still see what they had already opened, and what they do is kept and sent once
 * Firebase answers again. Shared by all open tabs. If the browser refuses storage
 * (e.g. some private windows), Firebase keeps working in memory as before.
 */
function makeFirestore(): Firestore {
  if (Platform.OS === 'web' && typeof indexedDB !== 'undefined') {
    try {
      return initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
    } catch {
      // Already set up (a hot reload in development): use it.
    }
  }
  return getFirestore(app);
}

// Local checks only: a web build made with EXPO_PUBLIC_FIREBASE_EMULATOR=1 talks to
// the local Firebase emulators instead of the live project. Never set for a release.
if (process.env.EXPO_PUBLIC_FIREBASE_EMULATOR === '1') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8085);
}

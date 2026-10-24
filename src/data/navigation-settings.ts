import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Dimensions, Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Navigation preferences for this device.
// Saved under its own key — separate from appearance (settings.ts)
// and from learning progress/XP.

export type TabBarMode = 'autoHide' | 'alwaysVisible';

type NavigationSettings = {
  tabBarMode: TabBarMode;
  /** The learner picked the mode in Settings on THIS device (not only synced from the account). */
  chosenHere?: boolean;
};

/**
 * A tablet or iPad: a touch screen whose short side is at least 600 px (iPads that
 * present themselves as a Mac included). Navigation is always visible there by default
 * (owner, 2026-10-24), whatever the account's choice from a phone or laptop says.
 */
export function isTabletDevice(): boolean {
  if (Platform.OS !== 'web') {
    const { width, height } = Dimensions.get('screen');
    return (Platform.OS === 'ios' && (Platform as { isPad?: boolean }).isPad === true) || Math.min(width, height) >= 600;
  }
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const touch = (navigator.maxTouchPoints ?? 0) > 1 || 'ontouchstart' in window;
  const screen = window.screen;
  return touch && Boolean(screen) && Math.min(screen.width, screen.height) >= 600;
}

const tablet = isTabletDevice();

const STORAGE_KEY = 'grateapex_navigation';

// Auto-hide is the default until the learner changes it; tablets start always visible.
const defaultSettings: NavigationSettings = {
  tabBarMode: tablet ? 'alwaysVisible' : 'autoHide',
};

let settings: NavigationSettings = { ...defaultSettings };
let loadPromise: Promise<void> | null = null;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Load the saved preference the first time anything asks for it.
  ensureLoaded();

  return () => {
    listeners.delete(listener);
  };
}

function isTabBarMode(value: unknown): value is TabBarMode {
  return value === 'autoHide' || value === 'alwaysVisible';
}

async function load() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    const data = JSON.parse(saved);

    const chosenHere = data?.chosenHere === true;
    settings = {
      // On a tablet only a choice made on the tablet counts (an earlier synced one doesn't).
      tabBarMode: isTabBarMode(data?.tabBarMode) && (!tablet || chosenHere)
        ? data.tabBarMode
        : defaultSettings.tabBarMode,
      chosenHere,
    };

    notify();
  } catch (error) {
    console.log('Could not load navigation settings:', error);
  }
}

function ensureLoaded() {
  if (!loadPromise) {
    loadPromise = load();
  }

  return loadPromise;
}

export async function getTabBarModePreference(): Promise<TabBarMode> {
  await ensureLoaded();
  return settings.tabBarMode;
}

async function save() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.log('Could not save navigation settings:', error);
  }
}

// 'autoHide' or 'alwaysVisible'.
export function useTabBarMode(): TabBarMode {
  return useSyncExternalStore(
    subscribe,
    () => settings.tabBarMode,
    () => defaultSettings.tabBarMode
  );
}

// Applies immediately everywhere and is saved for next time.
export async function setTabBarMode(tabBarMode: TabBarMode) {
  // Make sure a slow first load can't overwrite this choice later.
  await ensureLoaded();

  settings = { ...settings, tabBarMode, chosenHere: true };
  notify();

  await save();
  try {
    const userId = auth.currentUser?.uid;
    if (userId) {
      await setDoc(doc(db, 'users', userId), { autoHideNav: tabBarMode === 'autoHide' }, { merge: true });
    }
  } catch (error) { console.warn('Could not sync navigation preference:', error); }
}

/** Apply the account's navigation choice locally without writing it back. */
export async function setTabBarModeFromAccount(tabBarMode: TabBarMode) {
  await ensureLoaded();
  // A tablet keeps always-visible navigation unless the learner chose otherwise on it.
  if (tablet && !settings.chosenHere) return;
  settings = { ...settings, tabBarMode };
  notify();
  await save();
}

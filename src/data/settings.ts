import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// App settings that belong to this device (not to an account).
// Saved with AsyncStorage under its own key, separate from progress.
//
// Account-related settings (name, Google account, privacy, …) will come
// from the future account/backend system — do not add them here.

export type AppearancePreference = 'apex' | 'light' | 'dark' | 'system';

type SettingsData = {
  appearance: AppearancePreference;
};

const STORAGE_KEY = 'grateapex_settings';

// Apex (light-blue GRATEAPEX theme) is the default for now.
const defaultSettings: SettingsData = {
  appearance: 'apex',
};

let settings: SettingsData = { ...defaultSettings };
let loadPromise: Promise<void> | null = null;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Load the saved settings the first time any screen asks for them.
  ensureSettingsLoaded();

  return () => {
    listeners.delete(listener);
  };
}

function isAppearance(value: unknown): value is AppearancePreference {
  return (
    value === 'apex' ||
    value === 'light' ||
    value === 'dark' ||
    value === 'system'
  );
}

async function loadSettings() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    const data = JSON.parse(saved);

    settings = {
      appearance: isAppearance(data?.appearance)
        ? data.appearance
        : defaultSettings.appearance,
    };

    notify();
  } catch (error) {
    console.log('Could not load settings:', error);
  }
}

function ensureSettingsLoaded() {
  if (!loadPromise) {
    loadPromise = loadSettings();
  }

  return loadPromise;
}

async function saveSettings() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.log('Could not save settings:', error);
  }
}

// The learner's appearance choice: 'light', 'dark' or 'system'.
export function useAppearancePreference(): AppearancePreference {
  return useSyncExternalStore(
    subscribe,
    () => settings.appearance,
    // Web pages are pre-rendered with the default (light) theme.
    () => defaultSettings.appearance
  );
}

// Changes the appearance immediately and saves it for next time.
export async function setAppearancePreference(
  appearance: AppearancePreference
) {
  // Make sure a slow first load can't overwrite this choice later.
  await ensureSettingsLoaded();

  settings = { ...settings, appearance };
  notify();

  await saveSettings();
}

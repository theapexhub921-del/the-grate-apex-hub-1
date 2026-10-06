import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { supabase } from '@/lib/supabase';
import { getTabBarModePreference, setTabBarModeFromAccount } from '@/data/navigation-settings';

// App settings that belong to this device (not to an account).
// Saved with AsyncStorage under its own key, separate from progress.
//
// Account-related settings (name, Google account, privacy, …) will come
// from the future account/backend system — do not add them here.

export type AppearancePreference = 'apex' | 'light' | 'dark' | 'system' | 'violet' | 'black' | 'pink';
export type PageZoomPreference = 80 | 90 | 100 | 110 | 125;
export type FontSizePreference = 'small' | 'default' | 'large' | 'extra_large';
export type ProfileVisibility = 'public' | 'friends' | 'private';
export type MessagingPermission = 'everyone' | 'friends';
export type NotificationCategory =
  | 'friendActivity' | 'friendRequests' | 'messages' | 'groupActivity'
  | 'studyReminders' | 'learningReminders' | 'goalReminders' | 'streakReminders'
  | 'announcements' | 'socialEngagement';
export type NotificationPreferences = Record<NotificationCategory, boolean>;

const defaultNotificationPreferences: NotificationPreferences = {
  friendActivity: true,
  friendRequests: true,
  messages: true,
  groupActivity: true,
  studyReminders: true,
  learningReminders: true,
  goalReminders: true,
  streakReminders: true,
  announcements: true,
  socialEngagement: true,
};

type SettingsData = {
  appearance: AppearancePreference;
  pushNotificationsEnabled: boolean;
  pageZoom: PageZoomPreference;
  notifications: NotificationPreferences;
  fontSize: FontSizePreference;
  profileVisibility: ProfileVisibility;
  activityVisible: boolean;
  messagingPermission: MessagingPermission;
  friendRequestPermission: MessagingPermission;
  discoverable: boolean;
};

const STORAGE_KEY = 'grateapex_settings';

// Apex (light-blue GRATEAPEX theme) is the default for now.
const defaultSettings: SettingsData = {
  appearance: 'apex',
  pushNotificationsEnabled: false,
  pageZoom: 100,
  notifications: { ...defaultNotificationPreferences },
  fontSize: 'default',
  profileVisibility: 'friends',
  activityVisible: true,
  messagingPermission: 'friends',
  friendRequestPermission: 'everyone',
  discoverable: true,
};

type PrivacySettings = Pick<SettingsData, 'profileVisibility' | 'activityVisible' | 'messagingPermission' | 'friendRequestPermission' | 'discoverable'>;
const defaultPrivacySettings: PrivacySettings = {
  profileVisibility: defaultSettings.profileVisibility,
  activityVisible: defaultSettings.activityVisible,
  messagingPermission: defaultSettings.messagingPermission,
  friendRequestPermission: defaultSettings.friendRequestPermission,
  discoverable: defaultSettings.discoverable,
};
let cachedPrivacySettings: PrivacySettings = { ...defaultPrivacySettings };

function getPrivacySnapshot(): PrivacySettings {
  if (Object.keys(defaultPrivacySettings).some((key) => cachedPrivacySettings[key as keyof PrivacySettings] !== settings[key as keyof SettingsData])) {
    cachedPrivacySettings = {
      profileVisibility: settings.profileVisibility,
      activityVisible: settings.activityVisible,
      messagingPermission: settings.messagingPermission,
      friendRequestPermission: settings.friendRequestPermission,
      discoverable: settings.discoverable,
    };
  }
  return cachedPrivacySettings;
}

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
    || value === 'violet'
    || value === 'black'
    || value === 'pink'
  );
}

function isPageZoom(value: unknown): value is PageZoomPreference {
  return value === 80 || value === 90 || value === 100 || value === 110 || value === 125;
}

async function loadSettings() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    const data = saved ? JSON.parse(saved) : {};

    settings = {
      appearance: isAppearance(data?.appearance)
        ? data.appearance
        : defaultSettings.appearance,
      pushNotificationsEnabled: data?.pushNotificationsEnabled === true,
      pageZoom: isPageZoom(data?.pageZoom) ? data.pageZoom : defaultSettings.pageZoom,
      notifications: Object.fromEntries(
        Object.keys(defaultNotificationPreferences).map((key) => [
          key,
          typeof data?.notifications?.[key] === 'boolean' ? data.notifications[key] : defaultNotificationPreferences[key as NotificationCategory],
        ])
      ) as NotificationPreferences,
      fontSize: ['small', 'default', 'large', 'extra_large'].includes(data?.fontSize) ? data.fontSize : 'default',
      profileVisibility: ['public', 'friends', 'private'].includes(data?.profileVisibility) ? data.profileVisibility : 'friends',
      activityVisible: data?.activityVisible !== false,
      messagingPermission: data?.messagingPermission === 'everyone' ? 'everyone' : 'friends',
      friendRequestPermission: data?.friendRequestPermission === 'friends' ? 'friends' : 'everyone',
      discoverable: data?.discoverable !== false,
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
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (userId) {
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: userId,
        appearance: settings.appearance,
        font_size: settings.fontSize,
        zoom: settings.pageZoom,
        navigation_auto_hide: (await getTabBarModePreference()) === 'autoHide',
        notification_preferences: { pushEnabled: settings.pushNotificationsEnabled, ...settings.notifications },
        privacy_preferences: {
          profileVisibility: settings.profileVisibility,
          activityVisible: settings.activityVisible,
          messagingPermission: settings.messagingPermission,
          friendRequestPermission: settings.friendRequestPermission,
          discoverable: settings.discoverable,
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (error) console.warn('Could not sync account settings:', error.message);
    }
  } catch (error) { console.warn('Could not sync account settings:', error); }
}

/** Load account preferences onto this device after sign-in, seeding the account on first use. */
export async function syncSettingsFromAccount(userId: string) {
  await ensureSettingsLoaded();
  const { data, error } = await supabase.from('user_preferences')
    .select('appearance, font_size, zoom, notification_preferences, privacy_preferences, navigation_auto_hide')
    .eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data) {
    await saveSettings();
    return;
  }

  const notifications = data.notification_preferences as Record<string, unknown> | null;
  const privacy = data.privacy_preferences as Record<string, unknown> | null;
  settings = {
    ...settings,
    appearance: isAppearance(data.appearance) ? data.appearance : settings.appearance,
    fontSize: ['small', 'default', 'large', 'extra_large'].includes(data.font_size) ? data.font_size as FontSizePreference : settings.fontSize,
    pageZoom: isPageZoom(data.zoom) ? data.zoom : settings.pageZoom,
    pushNotificationsEnabled: typeof notifications?.pushEnabled === 'boolean' ? notifications.pushEnabled : settings.pushNotificationsEnabled,
    notifications: Object.fromEntries(
      Object.keys(defaultNotificationPreferences).map((key) => [
        key,
        typeof notifications?.[key] === 'boolean' ? notifications[key] : settings.notifications[key as NotificationCategory],
      ])
    ) as NotificationPreferences,
    profileVisibility: ['public', 'friends', 'private'].includes(String(privacy?.profileVisibility)) ? privacy?.profileVisibility as ProfileVisibility : settings.profileVisibility,
    activityVisible: typeof privacy?.activityVisible === 'boolean' ? privacy.activityVisible : settings.activityVisible,
    messagingPermission: privacy?.messagingPermission === 'everyone' ? 'everyone' : privacy?.messagingPermission === 'friends' ? 'friends' : settings.messagingPermission,
    friendRequestPermission: privacy?.friendRequestPermission === 'friends' ? 'friends' : privacy?.friendRequestPermission === 'everyone' ? 'everyone' : settings.friendRequestPermission,
    discoverable: typeof privacy?.discoverable === 'boolean' ? privacy.discoverable : settings.discoverable,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  if (typeof data.navigation_auto_hide === 'boolean') {
    await setTabBarModeFromAccount(data.navigation_auto_hide ? 'autoHide' : 'alwaysVisible');
  }
  notify();
}

export function useFontSizePreference(): FontSizePreference {
  return useSyncExternalStore(subscribe, () => settings.fontSize, () => defaultSettings.fontSize);
}

export async function setFontSizePreference(fontSize: FontSizePreference) {
  await ensureSettingsLoaded();
  settings = { ...settings, fontSize };
  notify();
  await saveSettings();
}

export function usePrivacyPreferences() {
  return useSyncExternalStore(subscribe, getPrivacySnapshot, () => defaultPrivacySettings);
}

export async function setPrivacyPreference<K extends 'profileVisibility' | 'activityVisible' | 'messagingPermission' | 'friendRequestPermission' | 'discoverable'>(key: K, value: SettingsData[K]) {
  await ensureSettingsLoaded();
  settings = { ...settings, [key]: value };
  notify();
  await saveSettings();
  if (key === 'activityVisible') {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (userId) {
      const { error } = await supabase.from('profiles').update({ share_activity: value }).eq('id', userId);
      if (error) console.warn('Could not sync activity visibility:', error.message);
    }
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

/** The learner's notification preference, saved on this device. */
export function usePushNotificationsPreference(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => settings.pushNotificationsEnabled,
    () => defaultSettings.pushNotificationsEnabled
  );
}

export async function setPushNotificationsPreference(enabled: boolean) {
  await ensureSettingsLoaded();
  settings = { ...settings, pushNotificationsEnabled: enabled };
  notify();
  await saveSettings();
}

export function useNotificationPreferences(): NotificationPreferences {
  return useSyncExternalStore(subscribe, () => settings.notifications, () => defaultSettings.notifications);
}

export async function setNotificationPreference(category: NotificationCategory, enabled: boolean) {
  await ensureSettingsLoaded();
  settings = { ...settings, notifications: { ...settings.notifications, [category]: enabled } };
  notify();
  await saveSettings();
}

export function usePageZoomPreference(): PageZoomPreference {
  return useSyncExternalStore(subscribe, () => settings.pageZoom, () => defaultSettings.pageZoom);
}

export async function setPageZoomPreference(pageZoom: PageZoomPreference) {
  await ensureSettingsLoaded();
  settings = { ...settings, pageZoom };
  notify();
  await saveSettings();
}

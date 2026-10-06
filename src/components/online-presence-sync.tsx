import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { usePrivacyPreferences } from '@/data/settings';
import { refreshFriendPresence } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

/** Keeps opt-in online presence fresh, and clears it when the app backgrounds. */
export function OnlinePresenceSync() {
  const { user } = useAuth();
  const { shareOnlineStatus } = usePrivacyPreferences();

  useEffect(() => {
    if (!user) return;
    let foreground = Platform.OS !== 'web' || (typeof document !== 'undefined' && document.visibilityState === 'visible');
    const update = async () => {
      await supabase.rpc('grateapex_set_online_status', { p_is_online: shareOnlineStatus && foreground });
      if (foreground) await refreshFriendPresence();
    };
    void update();
    const timer = setInterval(() => void update(), 45_000);
    const appState = AppState.addEventListener('change', (state) => {
      foreground = state === 'active';
      void update();
    });
    const visibility = () => {
      foreground = document.visibilityState === 'visible';
      void update();
    };
    if (Platform.OS === 'web' && typeof document !== 'undefined') document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(timer);
      appState.remove();
      if (Platform.OS === 'web' && typeof document !== 'undefined') document.removeEventListener('visibilitychange', visibility);
      void supabase.rpc('grateapex_set_online_status', { p_is_online: false });
    };
  }, [user?.id, shareOnlineStatus]);

  return null;
}

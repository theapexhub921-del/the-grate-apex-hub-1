// Permanent account deletion.
//
// The database function grateapex_delete_account deletes the signed-in
// learner's auth user; every GRATEAPEX table cascades from it (profile,
// progress, quiz/question history, reviews, XP, learning events,
// friendships, notifications). Afterwards this device forgets the
// learner's cached data and signs out.
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';

export async function deleteMyAccount(): Promise<{ error: string | null }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return { error: 'You are not signed in.' };

  const { error } = await supabase.rpc('grateapex_delete_account');
  if (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('Account deletion failed', error);
    return {
      error: /fetch|network|Failed to/i.test(error.message)
        ? 'Could not reach GRATEAPEX. Check your connection and try again.'
        : 'Your account could not be deleted. Please try again.',
    };
  }

  // Cached learning data on this device is stored per account ("<key>:<userId>").
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys.filter((key) => key.includes(userId)));
  } catch {
    // The account is already gone; leftover cache is harmless and unreachable.
  }

  // The session's user no longer exists; clear it locally.
  await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
  return { error: null };
}

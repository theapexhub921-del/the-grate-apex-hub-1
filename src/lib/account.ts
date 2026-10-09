import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

// Firebase only deletes an account that signed in within the last 5 minutes
// (otherwise "auth/requires-recent-login"). Check this BEFORE deleting any
// data, so a refused final step never leaves a half-deleted account.
const RECENT_SIGN_IN_MS = 4 * 60 * 1000;

const SIGN_IN_AGAIN =
  'For your security, please sign out, sign in again, and then delete your account within a few minutes.';

export async function deleteMyAccount(): Promise<{ error: string | null }> {
  const user = auth.currentUser;
  if (!user) return { error: 'You are not signed in.' };
  const userId = user.uid;

  try {
    const { authTime } = await user.getIdTokenResult();
    if (!(Date.now() - Date.parse(authTime) < RECENT_SIGN_IN_MS)) return { error: SIGN_IN_AGAIN };

    // Private progress (the rules allow the owner to delete it). The
    // deployed rules refuse deletes of users/{uid}, scores/{uid} and
    // usernames/{name} from the app, so those stay until a trusted server
    // removes them — see docs/firestore-compatibility.md.
    await deleteDoc(doc(db, 'progress', userId));

    // Delete Firebase Auth user
    await deleteUser(user);

    // Clear local cached learning data
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys.filter((key) => key.includes(userId)));
    } catch {
      // Leftover cache is harmless
    }

    return { error: null };
  } catch (error: any) {
    if (error?.code === 'auth/requires-recent-login') return { error: SIGN_IN_AGAIN };
    return { error: error?.message || 'Your account could not be deleted. Please try again.' };
  }
}

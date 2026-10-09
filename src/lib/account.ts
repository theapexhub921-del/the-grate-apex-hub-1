import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export async function deleteMyAccount(): Promise<{ error: string | null }> {
  const user = auth.currentUser;
  if (!user) return { error: 'You are not signed in.' };
  const userId = user.uid;

  try {
    // Clean up Firestore documents
    await deleteDoc(doc(db, 'users', userId)).catch(() => undefined);
    await deleteDoc(doc(db, 'progress', userId)).catch(() => undefined);

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
    if (error?.code === 'auth/requires-recent-login') {
      return {
        error: 'Please sign in again before deleting your account for security confirmation.',
      };
    }
    return { error: error?.message || 'Your account could not be deleted. Please try again.' };
  }
}

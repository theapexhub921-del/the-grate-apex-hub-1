// Friend streaks, loaded and protected (rules: data/friend-streaks.ts).
//
//   load     the chat's recent messages (newest STREAK_WINDOW_DAYS days) plus the
//            days already covered by a freeze or restore, saved for both
//            friends in friendStreaks/{chatId} (chat id = the two uids, sorted).
//   protect  covers the missed days of a recently ended streak, paid with the
//            learner's own streak freezes (one per day) or RESTORE_COST coins.
import { arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore';

import { refundApexCoins, spendApexCoins } from '@/data/apex-coins';
import { friendStreakStatus, type FriendStreakStatus } from '@/data/friend-streaks';
import { RESTORE_COST } from '@/data/learning/streak-rules';
import { spendStreakFreezes, streakProtection } from '@/data/progress';
import { auth, db } from '@/lib/firebase';

const STREAK_WINDOW_DAYS = 400;
const CACHE_MS = 5 * 60_000;

export const friendChatId = (a: string, b: string) => [a, b].sort().join('_');

const cache = new Map<string, { at: number; status: FriendStreakStatus }>();
const listeners = new Set<() => void>();

/** Called when a friend streak changes (sent message, freeze used), so screens can reload. */
export function onFriendStreaksChanged(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function forgetFriendStreak(chatId: string) {
  cache.delete(chatId);
  listeners.forEach((listener) => listener());
}

async function coveredDays(chatId: string): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, 'friendStreaks', chatId));
    const list = snap.data()?.covered;
    return Array.isArray(list) ? list.filter((day): day is string => typeof day === 'string') : [];
  } catch {
    return []; // rules not deployed yet, or offline
  }
}

/** The streak between me and a friend (cached for a few minutes; `fresh` reloads it). */
export async function loadFriendStreak(friendId: string, options: { fresh?: boolean } = {}): Promise<FriendStreakStatus | null> {
  const me = auth.currentUser?.uid;
  if (!me || !friendId || friendId === me) return null;
  const chatId = friendChatId(me, friendId);
  const hit = cache.get(chatId);
  if (hit && !options.fresh && Date.now() - hit.at < CACHE_MS) return hit.status;
  try {
    const since = Timestamp.fromMillis(Date.now() - STREAK_WINDOW_DAYS * 86_400_000);
    const [snap, covered] = await Promise.all([
      getDocs(query(collection(db, 'chats', chatId, 'messages'), where('createdAt', '>=', since), orderBy('createdAt', 'asc'))),
      coveredDays(chatId),
    ]);
    const messages = snap.docs.map((item) => {
      const d = item.data();
      const at = d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now();
      return { sender_id: String(d.from ?? ''), created_at: new Date(at).toISOString(), stump: d.share?.kind === 'stump' };
    });
    const status = friendStreakStatus(messages, me, friendId, Date.now(), covered);
    cache.set(chatId, { at: Date.now(), status });
    return status;
  } catch {
    return null; // no chat yet, or offline
  }
}

/** Covers the missed days of a recently ended friend streak. Returns the restored streak. */
export async function protectFriendStreak(friendId: string, method: 'freeze' | 'coins'): Promise<number> {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error('Sign in first.');
  const status = await loadFriendStreak(friendId, { fresh: true });
  if (!status?.lost) throw new Error('There is no ended streak to restore with this friend.');
  const chatId = friendChatId(me, friendId);
  const days = status.lost.missed;

  if (method === 'freeze') {
    // Check first, save the covered days, then spend: a failed save costs nothing.
    if (streakProtection().freezes < days.length) throw new Error(`You need ${days.length} streak freeze${days.length === 1 ? '' : 's'} for this. You have ${streakProtection().freezes}.`);
  } else {
    await spendApexCoins(RESTORE_COST);
  }
  try {
    await setDoc(doc(db, 'friendStreaks', chatId), { covered: arrayUnion(...days), updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    if (method === 'coins') await refundApexCoins(RESTORE_COST);
    if ((error as { code?: string })?.code === 'permission-denied') throw new Error('Friend streak restores are not switched on yet. Nothing was spent.');
    throw error;
  }
  if (method === 'freeze') await spendStreakFreezes(days.length);
  forgetFriendStreak(chatId);
  const after = await loadFriendStreak(friendId, { fresh: true });
  return after?.streak ?? status.lost.streak;
}

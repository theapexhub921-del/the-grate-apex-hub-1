import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { dayKey } from '@/data/learning/time';

export type ApexCoinReward = 'apex_challenge' | 'topic_completion';
export type StreakRecoveryOffer = { id: string; lost_streak: number; lost_on: string };

export async function readApexCoinBalance(): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    return Number(snap.data()?.coins ?? snap.data()?.apexCoins ?? 0);
  } catch {
    return 0;
  }
}

export async function sendApexCoins(recipientId: string, amount: number): Promise<number> {
  if (!recipientId) throw new Error('Choose a friend first.');
  if (!Number.isSafeInteger(amount) || amount < 1) throw new Error('Enter a whole number greater than zero.');
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to send coins.');

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  const current = Number(snap.data()?.coins ?? 0);
  if (current < amount) throw new Error('Insufficient coins.');

  await updateDoc(userRef, { coins: current - amount });
  return current - amount;
}

export async function awardApexCoins(reward: ApexCoinReward, sourceId: string): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  const current = Number(snap.data()?.coins ?? 0);
  const added = reward === 'apex_challenge' ? 10 : 5;
  await updateDoc(userRef, { coins: current + added });
  return current + added;
}

export async function buyStreakRecoveryWithCoins(at = Date.now()) {
  const user = auth.currentUser;
  if (!user) return { balance: 0, streak: 0 };
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  const current = Number(snap.data()?.coins ?? 0);
  const price = 20;
  if (current < price) throw new Error('You need 20 coins to recover your streak.');

  await updateDoc(userRef, { coins: current - price });
  return { balance: current - price, streak: 1 };
}

export async function readStreakRecoveryOffer(): Promise<StreakRecoveryOffer | null> {
  return null;
}

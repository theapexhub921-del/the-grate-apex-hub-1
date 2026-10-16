// Gifting XP boosts to a friend. XP itself is never transferable; a boost is.
//
//   send   the boost leaves the sender's inventory and a boostTransfers document
//          is written (friends only, at most 3 per friend per day, by the rules).
//          If the document can't be written, the boost goes back.
//   claim  the friend's app marks each waiting gift claimed (one transaction, so
//          it can never be counted twice) and adds the boost to their inventory.
//
// Document id: "<from>_<to>_<day>_<n>" (day = days since 1970, n = 0, 1 or 2):
// the rules check it, which is what limits gifts to 3 per friend per day.
import { collection, doc, getDocs, limit, query, runTransaction, serverTimestamp, setDoc, where } from 'firebase/firestore';

import { describeBoost, grantPowerup, type Powerup, returnPowerup, takePowerup } from '@/data/learning/powerups';
import type { PowerupMultiplier } from '@/data/learning/xp-rules';
import { auth, db } from '@/lib/firebase';
import { announceGift } from '@/lib/web-push';

export const BOOST_GIFTS_PER_FRIEND_PER_DAY = 3;
const MULTIPLIERS = [1.5, 2, 2.5, 3] as const;

export type ReceivedBoost = { id: string; fromName: string; multiplier: Exclude<PowerupMultiplier, 1>; kind: 'single' | 'timed'; durationSeconds: number };

/** "×2 XP for 45 minutes" or "×1.5 XP on your next lesson or quiz". */
export function describeGiftBoost(boost: { multiplier: number; kind?: 'single' | 'timed'; durationSeconds?: number }) {
  return boost.kind === 'timed' ? describeBoost(boost) : `×${boost.multiplier} XP on your next lesson or quiz`;
}

const isPermissionDenied = (error: unknown) => (error as { code?: string })?.code === 'permission-denied';

/** Sends one boost from the inventory to a friend. */
export async function sendBoostGift(recipientId: string, powerupId: string, fromName: string): Promise<Powerup> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to gift a boost.');
  if (!recipientId) throw new Error('Choose a friend first.');
  if (recipientId === user.uid) throw new Error('Choose a friend, not yourself.');

  const boost = await takePowerup(powerupId);
  if (!boost) throw new Error('That boost is no longer in your inventory.');
  const kind = boost.kind === 'timed' ? 'timed' : 'single';
  const day = Math.floor(Date.now() / 86_400_000);
  const data = {
    from: user.uid,
    to: recipientId,
    fromName: fromName.slice(0, 60) || 'A friend',
    multiplier: boost.multiplier,
    kind,
    durationSeconds: kind === 'timed' ? Math.max(1, Math.min(3600, Math.round(boost.durationSeconds ?? 3600))) : 0,
    status: 'pending',
    createdAt: serverTimestamp(),
  };
  // Try today's three slots in turn: a slot already used is refused by the rules.
  for (let n = 0; n < BOOST_GIFTS_PER_FRIEND_PER_DAY; n++) {
    const id = `${user.uid}_${recipientId}_${day}_${n}`;
    try {
      await setDoc(doc(db, 'boostTransfers', id), data);
      void announceGift('boost', id, recipientId);
      return boost;
    } catch (error) {
      if (!isPermissionDenied(error)) {
        await returnPowerup(boost);
        throw new Error('The boost could not be sent. Check your connection and try again. Your boost is still yours.');
      }
    }
  }
  await returnPowerup(boost);
  throw new Error(`You can gift up to ${BOOST_GIFTS_PER_FRIEND_PER_DAY} boosts to each friend a day, and only to friends (you follow each other). Your boost is still yours.`);
}

/** Adds every waiting boost gift to the signed-in learner's inventory. Returns what arrived. */
export async function claimIncomingBoosts(): Promise<ReceivedBoost[]> {
  const user = auth.currentUser;
  if (!user) return [];
  const received: ReceivedBoost[] = [];
  try {
    const waiting = await getDocs(query(collection(db, 'boostTransfers'), where('to', '==', user.uid), where('status', '==', 'pending'), limit(25)));
    for (const gift of waiting.docs) {
      const claimed = await runTransaction(db, async (tx) => {
        const snap = await tx.get(gift.ref);
        const data = snap.data();
        if (!data || data.status !== 'pending' || data.to !== user.uid) return null;
        tx.update(gift.ref, { status: 'claimed', claimedAt: serverTimestamp() });
        return data;
      });
      if (!claimed) continue;
      const multiplier = MULTIPLIERS.find((value) => value === Number(claimed.multiplier));
      if (!multiplier) continue;
      const kind = claimed.kind === 'timed' ? 'timed' : 'single';
      const durationSeconds = kind === 'timed' ? Math.max(1, Math.min(3600, Number(claimed.durationSeconds) || 3600)) : 0;
      await grantPowerup('gift', gift.id, multiplier, kind === 'timed' ? durationSeconds : undefined);
      received.push({ id: gift.id, fromName: String(claimed.fromName || 'A friend'), multiplier, kind, durationSeconds });
    }
  } catch {
    // Rules not deployed yet, or offline: gifts stay waiting and are claimed later.
  }
  return received;
}

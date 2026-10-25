import { collection, doc, getDoc, getDocs, limit, query, runTransaction, serverTimestamp, type Transaction, where } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { canRestore, RESTORE_COST } from '@/data/learning/streak-rules';
import { dayKey } from '@/data/learning/time';
import { restoreLostStreak, streakProtection } from '@/data/progress';
import { announceGift } from '@/lib/web-push';

export type ApexCoinReward = 'apex_challenge' | 'topic_completion';

/** Coins for each lesson completed the first time (owner, 2026-10-25). */
export const LESSON_COINS = 10;

// ─── The coin log ──────────────────────────────────────────────────────
// Every coin that comes in is written with an entry in users/{uid}/coinLog/{kind}_{ref},
// in the same transaction. The rules (firestore.rules → coinLog) let the balance go up
// only by a logged amount, once per entry, and only for something real: a lesson
// completed (+10), an Apex Challenge played (+10), a topic finished (+5), a friend's
// gift claimed, or a refund of an earlier payment. Spending writes a 'spend' entry, so
// a refund can only give back what was really paid. Until those rules are published the
// old rules refuse coinLog, so each step falls back to the plain balance update.
type CoinKind = 'lesson' | 'apex' | 'topic' | 'gift' | 'refund' | 'spend';
const isRefused = (error: unknown) => (error as { code?: string })?.code === 'permission-denied';

/**
 * Adds `amount` coins, logged as `{kind}_{ref}`. Nothing happens when that entry is
 * already there (a reward is never paid twice). `extra` adds writes to the same step.
 * Returns the new balance, or null when nothing was added.
 */
async function credit(kind: CoinKind, ref: string, amount: number, extra?: (tx: Transaction, uid: string) => void): Promise<number | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const entry = `${kind}_${ref}`;
  const userRef = doc(db, 'users', user.uid);
  const logRef = doc(db, 'users', user.uid, 'coinLog', entry);
  try {
    return await runTransaction(db, async (tx) => {
      const [log, snap] = await Promise.all([tx.get(logRef), tx.get(userRef)]);
      if (log.exists()) return null;
      extra?.(tx, user.uid);
      const balance = coinsOf(snap.data()) + amount;
      tx.set(logRef, { kind, amount, ref, at: serverTimestamp() });
      tx.update(userRef, { coins: balance, coinEntry: entry });
      return balance;
    });
  } catch (error) {
    if (!isRefused(error)) throw error;
    // The coinLog rules are not published yet: the plain update the old rules allow.
    return runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      extra?.(tx, user.uid);
      const balance = coinsOf(snap.data()) + amount;
      tx.update(userRef, { coins: balance });
      return balance;
    });
  }
}

/**
 * The balance on a users document. Early accounts kept it as `apexCoins`; every
 * write now goes to `coins`, so the balance shown is always the one that can be spent.
 */
export function coinsOf(data: Record<string, unknown> | undefined): number {
  const value = Number(data?.coins ?? data?.apexCoins ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export async function readApexCoinBalance(): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    return coinsOf(snap.data());
  } catch {
    return 0;
  }
}

/** Largest single gift (the rules allow up to 1,000). */
export const MAX_COIN_GIFT = 1000;

/**
 * Gives Apex Coins to a friend (coins only — XP is never transferable).
 * One transaction takes the coins from the sender and records the gift in
 * coinTransfers; the friend's app adds them to their balance when it next
 * runs (claimIncomingCoins). If the gift can't be recorded, nothing is taken.
 */
export async function sendApexCoins(recipientId: string, amount: number): Promise<number> {
  if (!recipientId) throw new Error('Choose a friend first.');
  if (!Number.isSafeInteger(amount) || amount < 1) throw new Error('Enter a whole number greater than zero.');
  if (amount > MAX_COIN_GIFT) throw new Error(`You can send up to ${MAX_COIN_GIFT.toLocaleString()} coins at a time.`);
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to send coins.');
  if (recipientId === user.uid) throw new Error('Choose a friend, not yourself.');

  const userRef = doc(db, 'users', user.uid);
  const giftRef = doc(collection(db, 'coinTransfers'));
  try {
    const balance = await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      const current = coinsOf(snap.data());
      if (current < amount) throw new Error('Insufficient coins.');
      tx.update(userRef, { coins: current - amount });
      tx.set(giftRef, { from: user.uid, to: recipientId, amount, status: 'pending', createdAt: serverTimestamp() });
      return current - amount;
    });
    void announceGift('coins', giftRef.id, recipientId);
    return balance;
  } catch (error) {
    if ((error as { code?: string })?.code === 'permission-denied') {
      throw new Error('Coin gifts are not switched on yet. Your coins were not taken.');
    }
    throw error;
  }
}

/**
 * Adds every waiting gift for the signed-in learner to their balance, each in
 * one transaction (the gift is marked claimed in the same step, so it can
 * never be counted twice). Returns the coins received.
 */
export async function claimIncomingCoins(onGift?: (gift: { from: string; amount: number }) => void): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;
  let received = 0;
  try {
    const waiting = await getDocs(query(collection(db, 'coinTransfers'), where('to', '==', user.uid), where('status', '==', 'pending'), limit(25)));
    const userRef = doc(db, 'users', user.uid);
    for (const gift of waiting.docs) {
      const data = gift.data();
      if (data.status !== 'pending' || data.to !== user.uid) continue;
      const value = Number(data.amount);
      // Logged as gift_<id>: the rules check the gift is this learner's, pending, claimed in the
      // same step, and for exactly this amount.
      const added = await credit('gift', gift.id, value, (tx) => tx.update(gift.ref, { status: 'claimed', claimedAt: serverTimestamp() }));
      const amount = added === null ? 0 : value;
      received += amount;
      if (amount > 0) onGift?.({ from: String(gift.data().from ?? ''), amount });
    }
  } catch {
    // Not switched on yet, or offline: gifts stay waiting and are claimed later.
  }
  return received;
}

/** Apex Challenge (+10, ref: the attempt id) or a finished topic (+5, ref: the topic id). Once each. */
export async function awardApexCoins(reward: ApexCoinReward, sourceId: string): Promise<number | null> {
  return reward === 'apex_challenge' ? credit('apex', sourceId, 10) : credit('topic', sourceId, 5);
}

/**
 * +10 coins the first time a lesson is completed. The lesson's completion record is
 * written in the same step (the rules check it), so the reward never waits for the
 * background save of the learner's progress.
 */
export async function awardLessonCoins(lessonId: string, xp: number, completedAt: number): Promise<number | null> {
  return credit('lesson', lessonId, LESSON_COINS, (tx, uid) => {
    tx.set(doc(db, 'progress', uid, 'completions', lessonId), {
      lessonId,
      completedAt: Math.round(completedAt),
      xp: Math.max(0, Math.min(1000, Math.round(xp))),
      savedAt: serverTimestamp(),
    });
  });
}

/** A coin payment: its id, so it can be refunded if the paid action fails. */
export type CoinPayment = { balance: number; ref: string };

/** Takes `amount` coins in one transaction; refuses (nothing taken) when the balance is too low. */
export async function spendApexCoins(amount: number): Promise<CoinPayment> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to use Apex Coins.');
  const userRef = doc(db, 'users', user.uid);
  const ref = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const pay = (logged: boolean) => runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    const current = coinsOf(snap.data());
    if (current < amount) throw new Error(`You need ${amount} Apex Coins for this. You have ${current}.`);
    if (logged) tx.set(doc(db, 'users', user.uid, 'coinLog', `spend_${ref}`), { kind: 'spend', amount, ref, at: serverTimestamp() });
    tx.update(userRef, { coins: current - amount });
    return { balance: current - amount, ref };
  });
  try {
    return await pay(true);
  } catch (error) {
    if (!isRefused(error)) throw error;
    return pay(false); // coinLog rules not published yet
  }
}

/** Gives a payment back (when the paid action could not be completed). */
export async function refundApexCoins(payment: CoinPayment, amount: number) {
  await credit('refund', payment.ref, amount).catch(() => undefined);
}

/**
 * Restores the learner's lost streak for RESTORE_COST coins (data/learning/streak-rules.ts).
 * The coins are taken first; if the streak can't be restored they are given back.
 */
export async function restoreStreakWithCoins(at = Date.now()) {
  const today = dayKey(at);
  if (!canRestore(streakProtection(at).lost, today)) throw new Error('There is no lost streak to restore right now.');
  const payment = await spendApexCoins(RESTORE_COST);
  try {
    const streak = await restoreLostStreak(at);
    return { balance: payment.balance, streak };
  } catch (error) {
    await refundApexCoins(payment, RESTORE_COST);
    throw error;
  }
}

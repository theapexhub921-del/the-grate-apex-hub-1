// Push notifications that arrive even when GrAte Apex Hub is closed (web app
// on phones and computers). When device alerts are on, this browser registers
// with its push service and its address is kept privately for the learner
// (pushDevices/{uid}.webPush, at most five devices; only the learner and the
// server can read it). After a message is sent, the app asks /api/push
// (api/push.mjs) to alert the friend's devices.
// Older accounts kept the addresses on the public profile (users/{uid}.webPush),
// which every signed-in learner can read. They are moved off it as soon as the
// server says it can read the private copy (GET /api/push); until then both are kept.
// The key below is the public half of the push key pair; the private half is
// only in the server's settings.
import { API_BASE } from '@/lib/live-site';
import { deleteField, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

import { readStreakReminderHour } from '@/data/settings';
import { auth, db } from '@/lib/firebase';

export const VAPID_PUBLIC_KEY = 'BCk5aBexMixVfqDa-M2BoJzVIhYj2lQwkGfVFvu9977rvGTmrJ0A96VGT9V8HgOSjDa4Qj7J6mG-96n9L-uQ4HQ';

const MAX_DEVICES = 5;
const SERVER = API_BASE;
const emulator = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR === '1';

const supported = () =>
  Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

function keyBytes(base64: string) {
  const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

/** Why the last registerWebPush() failed (null when it worked or was skipped). */
export let webPushError: string | null = null;

type Device = { endpoint: string; keys: { p256dh: string; auth: string }; at: number; tz?: number; hour?: number };

/** Minutes behind UTC (e.g. 0 in UTC, -60 in UTC+1): lets the server send streak reminders at a sensible local hour. */
const timeZoneOffset = () => new Date().getTimezoneOffset();

/** Registers this browser for push and saves it on the account (call when alerts are on). */
export async function registerWebPush() {
  webPushError = null;
  let workerProblem = '';
  if (!supported() || emulator || Notification.permission !== 'granted') return false;
  // After a reload the signed-in user is restored a moment later; without waiting,
  // the phone was never re-registered and a rotated push address stayed dead.
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;
  if (!uid) return false;
  try {
    // Make sure the worker is registered (harmless if the page already did it), then wait for it to be active.
    await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch((error) => { workerProblem = error instanceof Error ? error.message : String(error); });
    const registration = await Promise.race([navigator.serviceWorker.ready, new Promise<null>((resolve) => setTimeout(() => resolve(null), 20000))]);
    if (!registration) { webPushError = `The background service is not ready yet${workerProblem ? ` (${workerProblem})` : ''}. Close and reopen the app, then try again.`; return false; }
    const serverKey = keyBytes(VAPID_PUBLIC_KEY);
    let subscription = await registration.pushManager.getSubscription();
    // A subscription made with an older push key can never be reached by the server's current key,
    // so replace it quietly (learners do not have to turn alerts off and on again).
    const savedKey = subscription?.options?.applicationServerKey;
    if (subscription && savedKey) {
      const saved = new Uint8Array(savedKey);
      const same = saved.length === serverKey.length && saved.every((byte, index) => byte === serverKey[index]);
      if (!same) {
        await subscription.unsubscribe();
        subscription = null;
      }
    }
    subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: serverKey });
    const json = subscription.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) { webPushError = 'This device returned an incomplete push address.'; return false; }
    const publicRef = doc(db, 'users', uid);
    const privateRef = doc(db, 'pushDevices', uid);
    const [publicSnap, privateSnap] = await Promise.all([getDoc(publicRef), getDoc(privateRef).catch(() => null)]);
    const publicList = (publicSnap.data()?.webPush ?? []) as Device[];
    const privateList = (privateSnap?.data()?.webPush ?? []) as Device[];
    const hour = await readStreakReminderHour();
    const isThis = (device?: Device) => device?.endpoint === json.endpoint && device?.tz === timeZoneOffset() && (device?.hour ?? null) === hour;
    // Already saved as this account's newest device, privately and nowhere public: nothing to write.
    if (isThis(privateList[0]) && !publicList.length) return true;
    const known = [...privateList, ...publicList].filter((device, index, all) => device?.endpoint && device.endpoint !== json.endpoint && all.findIndex((other) => other?.endpoint === device.endpoint) === index);
    const devices = [{ endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth }, at: Date.now(), tz: timeZoneOffset(), ...(hour === null ? {} : { hour }) }, ...known].slice(0, MAX_DEVICES);
    const savedPrivately = isThis(privateList[0]) || (await setDoc(privateRef, { webPush: devices, updatedAt: serverTimestamp() }).then(() => true, () => false));
    if (savedPrivately && (await serverReadsPrivateDevices())) {
      if (publicList.length) await setDoc(publicRef, { webPush: deleteField() }, { merge: true });
    } else if (!isThis(publicList[0])) {
      // The private rules or the server's key are not set up yet: keep the public copy too.
      await setDoc(publicRef, { webPush: devices }, { merge: true });
    }
    return true;
  } catch (error) {
    webPushError = error instanceof Error ? error.message : 'Could not register this device for push.';
    return false;
  }
}

/** Stops push on this browser and removes it from the account (when alerts are turned off). */
const SEEN_DAY_KEY = 'grateapex_app_seen_day';

/** Today's date on this device, 'YYYY-MM-DD' (the same day api/_push-logic.mjs works out from the time zone). */
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Notes on the account that the learner opened the app today (users/{uid}.appSeenDay),
 * so the daily reminders (api/reminders.mjs) do not repeat what they have already seen
 * in the app. Written at most once a day from this device.
 */
export async function markAppSeenToday() {
  if (typeof window === 'undefined') return;
  const today = todayKey();
  try {
    await auth.authStateReady();
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const key = `${SEEN_DAY_KEY}:${uid}`;
    try {
      if (window.localStorage.getItem(key) === today) return;
    } catch { /* storage blocked: write anyway */ }
    await setDoc(doc(db, 'users', uid), { appSeenDay: today }, { merge: true });
    try { window.localStorage.setItem(key, today); } catch { /* fine */ }
  } catch {
    // worst case a reminder is sent that the learner has already seen
  }
}

export async function unregisterWebPush() {
  if (!supported()) return;
  const uid = auth.currentUser?.uid;
  try {
    const registration = await Promise.race([navigator.serviceWorker.ready, new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))]);
    if (!registration) return false;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe().catch(() => { });
    if (!uid) return;
    for (const ref of [doc(db, 'pushDevices', uid), doc(db, 'users', uid)]) {
      const existing = ((await getDoc(ref).catch(() => null))?.data()?.webPush ?? []) as Device[];
      if (existing.some((device) => device?.endpoint === endpoint)) await setDoc(ref, { webPush: existing.filter((device) => device?.endpoint !== endpoint) }, { merge: true }).catch(() => {});
    }
  } catch {
    // nothing to remove
  }
}

/** True when the server can read private push addresses (it has the project's service account). */
async function serverReadsPrivateDevices() {
  try {
    const response = await fetch(`${SERVER}/api/push`);
    return response.ok && (await response.json()).privateDevices === true;
  } catch {
    return false;
  }
}

/** Asks the server to alert the friend's devices about the message just sent (best effort). */
export async function announceMessage(chatId: string, to: string | null | undefined) {
  if (emulator || !to) return;
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;
    await fetch(`${SERVER}/api/push`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ chat: chatId, to }) });
  } catch {
    // the in-app notification still reaches them when they open the app
  }
}

/** The same for a message just sent in a group (every other member's devices are alerted). */
export async function announceGroupMessage(groupId: string) {
  await announce({ kind: 'group', group: groupId });
}

/** The same for "started following you". */
export async function announceFollow(to: string) {
  await announce({ kind: 'follow', to });
}

/** A battle challenge I just sent to `to` (their phone is alerted). */
export async function announceBattle(battleId: string, to: string) {
  await announce({ kind: 'battle', battle: battleId, to });
}

/** I just played (or declined) a battle: tell the other player how it went. */
export async function announceBattleResult(battleId: string, to: string) {
  await announce({ kind: 'battle-result', battle: battleId, to });
}

/** A challenged learner accepted and joined the shared battle room. */
export async function announceBattleAccepted(battleId: string, to: string) {
  await announce({ kind: 'battle-accepted', battle: battleId, to });
}

/** I just gifted Apex Coins or an XP boost to `to` (their phone is alerted). */
export async function announceGift(type: 'coins' | 'boost', giftId: string, to: string) {
  await announce({ kind: 'gift', type, gift: giftId, to });
}

/** A like or a comment/reply on someone's post: { kind: 'like', post, to } or { kind: 'comment', post, comment, to }. */
export async function announceInteraction(body: Record<string, string>) {
  await announce(body);
}

async function announce(body: Record<string, string>) {
  if (emulator) return;
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;
    await fetch(`${SERVER}/api/push`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
  } catch {
    // the in-app notification still reaches them when they open the app
  }
}
/** Sends a test push to this account's devices; returns a plain-words result. */
export async function sendTestPush(): Promise<string> {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return 'Please sign in again.';
    const response = await fetch(`${SERVER}/api/push`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ kind: 'test' }) });
    const data = (await response.json().catch(() => ({}))) as { error?: string; sent?: number; registered?: number; devices?: { host: string; status: number; detail?: string }[] };
    if (!response.ok) return data.error ?? `The server answered ${response.status}.`;
    if (!data.registered) return 'No device is registered on your account yet. Turn notifications off and on again in this app.';
    const failed = (data.devices ?? []).filter((device) => device.status < 200 || device.status >= 300);
    if (!failed.length) return `Sent to ${data.sent} device(s). If nothing arrives within a minute, check iPhone Settings → Notifications → GrAte Apex Hub.`;
    return `Push failed: ${failed.map((device) => `${device.host} ${device.status}${device.detail ? ` (${device.detail})` : ''}`).join('; ')}`;
  } catch {
    return 'Could not reach the server.';
  }
}

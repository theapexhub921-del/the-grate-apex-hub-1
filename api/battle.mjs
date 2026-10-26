// XP battles: the server referee (owner, 2026-10-26: "no score fakes"). The app sends
// every action here with the learner's sign-in token; server/battle-referee.mjs marks
// answers against keys only this server can read and writes the room both players watch.
//
//   POST /api/battle  { action: 'create' | 'accept' | 'decline' | 'ready' | 'answer' | 'leave' | 'get' | 'mine', ... }
//
// Needs the Vercel setting FIREBASE_SERVICE_ACCOUNT (already there for push, reminders and
// account deletion). The questions come from this deployment's own public/battle-bank/*.json
// (built by scripts/build-battle-bank.mjs). Rules: battleRooms, battleKeys, battleStats in firestore.rules.
import { BattleError, handleBattle } from '../server/battle-referee.mjs';
import { restAdmin } from './_admin-rest.mjs';

const banks = new Map(); // course -> { at, bank }
const BANK_REUSE_MS = 10 * 60_000;
const keys = new Map(); // room -> answers (they never change, so one read per room per server instance)

function origin(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || (String(host).startsWith('localhost') ? 'http' : 'https');
  return host ? `${proto}://${host}` : 'https://grateapex.vercel.app';
}

async function loadBank(base, course) {
  const hit = banks.get(course);
  if (hit && Date.now() - hit.at < BANK_REUSE_MS) return hit.bank;
  const response = await fetch(`${base}/battle-bank/${encodeURIComponent(course)}.json`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Battle bank ${course}: ${response.status}`);
  const bank = await response.json();
  banks.set(course, { at: Date.now(), bank });
  return bank;
}

// Best-effort brake against a client calling again and again (per server instance).
const recent = new Map();
function tooMany(uid) {
  const now = Date.now();
  const list = (recent.get(uid) ?? []).filter((at) => now - at < 10_000);
  list.push(now);
  recent.set(uid, list);
  if (recent.size > 2000) recent.clear();
  return list.length > 40;
}

/** The referee's store: Firestore through the service account. */
function firestoreStore(db) {
  return {
    async getRoom(id) {
      const snap = await db.doc(`battleRooms/${id}`).get();
      return snap.exists ? { room: snap.data(), version: snap.updateTime } : null;
    },
    async saveRoom(room, version) {
      await db.doc(`battleRooms/${room.id}`).set(room, { updateTime: version });
    },
    async createRoom(room, key) {
      await db.doc(`battleKeys/${room.id}`).set(key, { exists: false });
      keys.set(room.id, key.answers);
      await db.doc(`battleRooms/${room.id}`).set(room, { exists: false });
    },
    async getKey(id) {
      if (keys.has(id)) return { answers: keys.get(id) };
      const snap = await db.doc(`battleKeys/${id}`).get();
      const answers = snap.exists ? snap.data().answers : null;
      if (answers) keys.set(id, answers);
      if (keys.size > 500) keys.delete(keys.keys().next().value);
      return answers ? { answers } : null;
    },
    async getStats(uid) {
      const snap = await db.doc(`battleStats/${uid}`).get();
      return snap.exists ? { stats: snap.data(), version: snap.updateTime } : null;
    },
    async saveStats(uid, stats, version) {
      await db.doc(`battleStats/${uid}`).set(stats, version ? { updateTime: version } : { exists: false });
    },
    async openRooms(uid) {
      const { docs } = await db.collection('battleRooms').where('players', 'array-contains', uid).get();
      return docs.map((item) => item.data()).filter((room) => room.open).slice(0, 20);
    },
    async notify(to, { from, fromName, roomId, course, count }) {
      // The bell on the other player's account (the same shape the app writes).
      const id = `race_${roomId}`;
      await db.doc(`users/${to}/notifications/${id}`).set({
        type: 'battle',
        from,
        fromName: fromName ?? '',
        roomId,
        text: `challenged you to a ${count}-question ${course} battle`,
        read: false,
        createdAt: new Date(),
      }, { exists: false });
    },
  };
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only.' });
  const admin = restAdmin();
  if (!admin) return res.status(503).json({ error: 'Battles are not set up on the server yet.', code: 'not-configured' });

  let uid;
  try {
    const token = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
    uid = (await admin.auth.verifyIdToken(token)).uid;
  } catch {
    return res.status(401).json({ error: 'Please sign in again.' });
  }
  if (tooMany(uid)) return res.status(429).json({ error: 'Slow down a little.' });

  let body = req.body ?? {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  try {
    const store = firestoreStore(admin.db);
    const base = origin(req);
    // The challenger's name comes from their own profile, not from what the app sends.
    if (body.action === 'create') {
      const profile = await admin.db.doc(`users/${uid}`).get().catch(() => null);
      body = { ...body, name: profile?.data?.()?.username ?? body.name ?? null };
    }
    const reply = await handleBattle({ uid, body, store, loadBank: (course) => loadBank(base, course) });
    return res.status(200).json(reply);
  } catch (error) {
    if (error instanceof BattleError) return res.status(error.status).json({ error: error.message });
    console.error('Battle failed:', error);
    return res.status(500).json({ error: 'The battle server had a problem. Try again.' });
  }
}

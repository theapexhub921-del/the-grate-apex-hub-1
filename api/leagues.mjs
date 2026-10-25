// GET /api/leagues   (run by Vercel Cron on Mondays at 00:00 UTC, midnight in Ghana; see vercel.json)
//   Authorization: Bearer <CRON_SECRET>      (Vercel adds this itself when CRON_SECRET is set)
//   ?dry=1               count who WOULD move, change nothing
//   ?week=YYYY-MM-DD     settle that week (its Monday) instead of the one that just ended
//
// Weekly leagues end at midnight (owner, 2026-10-25: "the promotion should happen at
// midnight, add it to the server job"). Before, each learner's own app settled their
// week the first time it ran afterwards, so nobody moved until they opened the app.
// Now the server settles everyone when the week ends, the same way the app does
// (src/data/leagues.ts): the top 20% of each tier move up (if they earned XP that
// week), the bottom 20% move down, places by the weekly XP each learner's app saved.
// The app then finds the new week already joined and shows the "promoted" card.
// Learners whose app moved them first are counted but not changed, and an entry
// that changed after it was read is left to that learner's app (never overwritten).
// Needs FIREBASE_SERVICE_ACCOUNT (like api/reminders.mjs).
import { adminToken, serviceAccount } from './_admin.mjs';
import { leagueFinalPlaces, leagueWeek, nextLeagueTier } from './_push-logic.mjs';

const DB = 'projects/grate-apex/databases/(default)/documents';

function plain(value) {
  if (!value || typeof value !== 'object') return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(plain);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, item]) => [key, plain(item)]));
  return undefined;
}

function encode(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, encode(item)])) } };
}

const idOf = (doc) => String(doc.name).split('/').pop();

/** Talks to Firestore with the service account (or the local emulator in checks). */
function firestore(token) {
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const base = emulator ? `http://${emulator}/v1/${DB}` : `https://firestore.googleapis.com/v1/${DB}`;
  return async (path, body) => {
    const response = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${emulator ? 'owner' : token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Firestore ${path} failed (${response.status}): ${(await response.text()).slice(0, 200)}`);
    return response.json();
  };
}

/** Learners whose league entry has `field` == week, with the entry and when the document last changed. */
async function usersWhere(call, field, week) {
  const rows = await call(':runQuery', {
    structuredQuery: {
      from: [{ collectionId: 'users' }],
      where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value: { stringValue: week } } },
      select: { fields: [{ fieldPath: 'league' }] },
    },
  });
  return rows.filter((row) => row.document).map((row) => ({ id: idOf(row.document), updateTime: row.document.updateTime, league: plain(row.document.fields?.league) ?? {} }));
}

/** Lifetime XP from the shared leaderboard (scores/{uid}.xp), 100 at a time. */
async function lifetimeXp(call, ids) {
  const out = new Map();
  for (let i = 0; i < ids.length; i += 100) {
    const rows = await call(':batchGet', { documents: ids.slice(i, i + 100).map((id) => `${DB}/scores/${id}`), mask: { fieldPaths: ['xp'] } });
    for (const row of rows) if (row.found) out.set(idOf(row.found), Number(plain(row.found.fields?.xp)) || 0);
  }
  return out;
}

/** Settles one finished week. Returns what changed (or would, when dry). */
export async function settleLeagueWeek(call, week, newWeek, dry) {
  const [waiting, movedOn] = await Promise.all([usersWhere(call, 'league.week', week), usersWhere(call, 'league.prev.week', week)]);
  const xp = await lifetimeXp(call, waiting.map((person) => person.id));
  const tiers = new Map(); // tier → rows
  const add = (tier, row) => { if (!tiers.has(tier)) tiers.set(tier, []); tiers.get(tier).push(row); };
  for (const person of waiting) {
    const entry = person.league;
    // The weekly figure the learner's app saved; otherwise lifetime XP − the week's start (as the app counts others).
    const trusted = Number(entry.startXp) > 0 || typeof entry.weeklyXp === 'number';
    const weeklyXp = typeof entry.weeklyXp === 'number' ? Math.max(0, entry.weeklyXp) : trusted ? Math.max(0, (xp.get(person.id) ?? 0) - (Number(entry.startXp) || 0)) : 0;
    add(Math.round(Number(entry.tier) || 0), { uid: person.id, weeklyXp, person });
  }
  for (const person of movedOn) {
    const prev = person.league.prev ?? {};
    if (!waiting.some((other) => other.id === person.id)) add(Math.round(Number(prev.tier) || 0), { uid: person.id, weeklyXp: Math.max(0, Number(prev.weeklyXp) || 0), person: null });
  }

  const writes = [];
  const counts = { promoted: 0, stays: 0, relegated: 0 };
  for (const [tier, rows] of tiers) {
    const places = leagueFinalPlaces(rows);
    for (const row of rows) {
      if (!row.person) continue; // already settled by their own app
      const place = places.get(row.uid);
      counts[place.outcome] += 1;
      const league = {
        week: newWeek,
        tier: nextLeagueTier(tier, place.outcome),
        startXp: xp.get(row.uid) ?? 0,
        prev: { week, tier, weeklyXp: place.weeklyXp, position: place.position, size: place.size, outcome: place.outcome, rechecked: true },
      };
      writes.push({
        update: { name: `${DB}/users/${row.uid}`, fields: { league: encode(league) } },
        updateMask: { fieldPaths: ['league'] },
        currentDocument: { updateTime: row.person.updateTime },
      });
    }
  }

  let written = 0;
  let skipped = 0;
  if (!dry) {
    // batchWrite applies each write on its own: one learner whose app changed their
    // entry meanwhile (precondition fails) does not stop the others.
    for (let i = 0; i < writes.length; i += 400) {
      const result = await call(':batchWrite', { writes: writes.slice(i, i + 400) });
      for (const status of result.status ?? []) if (!status.code) written += 1; else skipped += 1;
    }
  }
  return { week, newWeek, learners: waiting.length, alreadyMoved: movedOn.length, ...counts, written, skipped, dry };
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(503).json({ error: 'Set CRON_SECRET in Vercel first.' });
  if (req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Not allowed.' });
  const account = serviceAccount();
  if (!account && !process.env.FIRESTORE_EMULATOR_HOST) return res.status(503).json({ error: 'Set FIREBASE_SERVICE_ACCOUNT in Vercel first.' });

  const now = Date.now();
  const newWeek = leagueWeek(now);
  const asked = typeof req.query?.week === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.week) ? req.query.week : null;
  const week = asked ?? leagueWeek(now - 7 * 86_400_000);
  if (week >= newWeek) return res.status(400).json({ error: `The week of ${week} has not ended yet.` });
  try {
    const call = firestore(account ? await adminToken(account) : '');
    const report = await settleLeagueWeek(call, week, newWeek, req.query?.dry === '1');
    console.log('League week settled:', JSON.stringify(report));
    return res.status(200).json(report);
  } catch (problem) {
    console.error('League settling failed:', problem);
    return res.status(500).json({ error: problem instanceof Error ? problem.message : 'League settling failed.' });
  }
}

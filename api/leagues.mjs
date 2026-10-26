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
import { DB, encode, firestore, lifetimeXp, usersWhere } from './_league-store.mjs';
import { leagueFinalPlaces, leagueWeek, nextLeagueTier, settledLeagueFix } from './_push-logic.mjs';

/** Settles one finished week. Returns what changed (or would, when dry). */
export async function settleLeagueWeek(call, week, newWeek, dry) {
  const [waiting, movedOn] = await Promise.all([usersWhere(call, 'league.week', week), usersWhere(call, 'league.prev.week', week)]);
  const xp = await lifetimeXp(call, waiting.map((person) => person.id));
  const tiers = new Map(); // tier → rows
  const add = (tier, row) => { if (!tiers.has(tier)) tiers.set(tier, []); tiers.get(tier).push(row); };
  for (const person of waiting) {
    const entry = person.league;
    // The higher of the weekly figure the learner's app saved (it may not have saved
    // lately) and leaderboard XP minus the week's start point.
    const trusted = Number(entry.startXp) > 0 || typeof entry.weeklyXp === 'number';
    const saved = typeof entry.weeklyXp === 'number' ? Math.max(0, entry.weeklyXp) : 0;
    const fromScores = trusted ? Math.max(0, (xp.get(person.id) ?? 0) - (Number(entry.startXp) || 0)) : 0;
    add(Math.round(Number(entry.tier) || 0), { uid: person.id, weeklyXp: Math.max(saved, fromScores), person, moved: false });
  }
  for (const person of movedOn) {
    const prev = person.league.prev ?? {};
    // Moved on already: their final figure (counted from their own XP history by their app).
    if (!waiting.some((other) => other.id === person.id)) add(Math.round(Number(prev.tier) || 0), { uid: person.id, weeklyXp: Math.max(0, Number(prev.weeklyXp) || 0), person, moved: true });
  }

  const writes = [];
  const counts = { promoted: 0, stays: 0, relegated: 0, corrected: 0 };
  for (const [tier, rows] of tiers) {
    const places = leagueFinalPlaces(rows);
    for (const row of rows) {
      const place = places.get(row.uid);
      counts[place.outcome] += 1;
      if (row.moved) {
        // Already moved on: put them in the league their final place earned, if they aren't.
        const fix = settledLeagueFix(row.person.league, week, place);
        if (!fix) continue;
        counts.corrected += 1;
        writes.push({
          update: { name: `${DB}/users/${row.uid}`, fields: { league: encode({ tier: fix.tier, prev: fix.prev }) } },
          updateMask: { fieldPaths: ['league.tier', 'league.prev'] },
          currentDocument: { updateTime: row.person.updateTime },
        });
        continue;
      }
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
  return { week, newWeek, learners: waiting.length, alreadyMoved: movedOn.length, ...counts, written, skipped, dry, ...(dry ? { changes: writes.map((write) => ({ uid: write.update.name.split('/').pop(), league: write.update.fields.league })) } : {}) };
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

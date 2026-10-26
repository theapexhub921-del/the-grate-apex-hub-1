// GET /api/league?week=YYYY-MM-DD&tier=0   (Authorization: Bearer <the learner's sign-in token>)
//
// One league table for everyone in it (owner, 2026-10-26). The table is the same for
// every learner in a tier, but each learner's app used to read all of it (and each
// member's leaderboard entry) from Firebase: hundreds of reads per look, which used up
// the free plan's daily reads. The server builds it once and keeps it for a few
// minutes for everyone (src/data/leagues.ts falls back to reading Firebase itself if
// this is not reachable). Same data any signed-in learner can already read.
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { adminToken, serviceAccount } from './_admin.mjs';
import { firestore, tierTable } from './_league-store.mjs';
import { leagueWeek } from './_push-logic.mjs';

const PROJECT = 'grate-apex';
const KEYS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const LIVE_MS = 10 * 60_000; // this week's table: kept 10 minutes
const FINISHED_MS = 60 * 60_000; // a finished week no longer changes much
const cache = new Map(); // `${week}:${tier}` → { at, ttl, rows: Promise }

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only.' });
  const account = serviceAccount();
  if (!account) return res.status(503).json({ error: 'Not set up.', code: 'not-configured' });
  const token = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  try {
    await jwtVerify(token, KEYS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
  } catch {
    return res.status(401).json({ error: 'Please sign in again.', code: 'auth' });
  }
  const week = String(req.query?.week ?? '');
  const tier = Number(req.query?.tier);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week) || !Number.isInteger(tier) || tier < 0 || tier > 9) return res.status(400).json({ error: 'Bad league.' });

  const key = `${week}:${tier}`;
  const now = Date.now();
  let entry = cache.get(key);
  if (!entry || now - entry.at > entry.ttl) {
    const ttl = week < leagueWeek(now) ? FINISHED_MS : LIVE_MS;
    entry = { at: now, ttl, rows: adminToken(account).then((admin) => tierTable(firestore(admin), week, tier)) };
    cache.set(key, entry);
    if (cache.size > 200) cache.delete(cache.keys().next().value);
    entry.rows.catch(() => { if (cache.get(key) === entry) cache.delete(key); });
  }
  try {
    const rows = await entry.rows;
    return res.status(200).json({ week, tier, at: entry.at, rows });
  } catch (error) {
    console.error('League table failed:', error);
    return res.status(502).json({ error: 'The league could not be read.', code: 'upstream' });
  }
}

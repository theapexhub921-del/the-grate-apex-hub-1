// GET /api/learners   (Authorization: Bearer <the learner's sign-in token>)
//
// The list of learner accounts that people search uses to match part of a name
// (owner, 2026-10-26). Each learner's app used to read every account itself, one
// Firebase read per account per search session, on the free plan's daily read
// allowance. The server reads it once and keeps it for everyone for a few hours;
// brand-new accounts are still found by the app's own name-start lookups.
// Only what search needs: names, picture and whether the learner can be found.
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { adminToken, serviceAccount } from './_admin.mjs';
import { DB, idOf, plain } from './_league-store.mjs';

const PROJECT = 'grate-apex';
const KEYS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const KEEP_MS = 6 * 3_600_000;
const FIELDS = ['username', 'displayName', 'avatar_url', 'photo', 'discoverable', 'preferences.privacy_preferences.discoverable'];
let cache = null; // { at, list: Promise }

async function readDirectory(token) {
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const base = emulator ? `http://${emulator}/v1/${DB}` : `https://firestore.googleapis.com/v1/${DB}`;
  const mask = FIELDS.map((field) => `mask.fieldPaths=${encodeURIComponent(field)}`).join('&');
  const out = [];
  let pageToken = '';
  do {
    const response = await fetch(`${base}/users?pageSize=300&${mask}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`, {
      headers: { authorization: `Bearer ${emulator ? 'owner' : token}` },
    });
    if (!response.ok) throw new Error(`Could not read accounts (${response.status}).`);
    const page = await response.json();
    for (const item of page.documents ?? []) {
      const data = plain({ mapValue: { fields: item.fields ?? {} } }) ?? {};
      if (!data.username && !data.displayName) continue;
      const discoverable = data.discoverable !== false && data.preferences?.privacy_preferences?.discoverable !== false;
      out.push({ id: idOf(item), username: data.username ?? null, displayName: data.displayName ?? null, avatar_url: data.avatar_url ?? data.photo ?? null, discoverable });
    }
    pageToken = page.nextPageToken ?? '';
  } while (pageToken && out.length < 5000);
  return out;
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only.' });
  const account = serviceAccount();
  if (!account && !process.env.FIRESTORE_EMULATOR_HOST) return res.status(503).json({ error: 'Not set up.', code: 'not-configured' });
  const token = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  try {
    await jwtVerify(token, KEYS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
  } catch {
    return res.status(401).json({ error: 'Please sign in again.', code: 'auth' });
  }
  if (!cache || Date.now() - cache.at > KEEP_MS) {
    const entry = { at: Date.now(), list: (account ? adminToken(account) : Promise.resolve('')).then(readDirectory) };
    cache = entry;
    entry.list.catch(() => { if (cache === entry) cache = null; });
  }
  try {
    return res.status(200).json({ learners: await cache.list });
  } catch (error) {
    console.error('Learner directory failed:', error);
    return res.status(502).json({ error: 'Could not read accounts.', code: 'upstream' });
  }
}

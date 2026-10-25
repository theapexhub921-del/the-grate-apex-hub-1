// Server-only Firestore access with the project's service account (Vercel
// setting FIREBASE_SERVICE_ACCOUNT: the whole JSON file, or that JSON in
// base64). Used by api/reminders.mjs, and by api/push.mjs to read learners'
// private push addresses (pushDevices/{uid}, which only the learner and this
// key can read). Files starting with "_" are not routes on Vercel.
import { Buffer } from 'node:buffer';

import { importPKCS8, SignJWT } from 'jose';

export function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    const account = JSON.parse(text);
    return account.client_email && account.private_key ? account : null;
  } catch {
    return null;
  }
}

const cache = new Map(); // scope -> { email, token, until }
export const DATASTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';

/** A short-lived Google access token (Firestore by default; kept for 50 minutes per server instance). */
export async function adminToken(account = serviceAccount(), scope = DATASTORE_SCOPE) {
  if (!account) throw new Error('No service account.');
  const cached = cache.get(scope);
  if (cached && cached.email === account.client_email && cached.until > Date.now()) return cached.token;
  const key = await importPKCS8(account.private_key, 'RS256');
  const assertion = await new SignJWT({ scope })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(account.client_email)
    .setSubject(account.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!response.ok) throw new Error(`Google refused the service account (${response.status}).`);
  const token = (await response.json()).access_token;
  cache.set(scope, { email: account.client_email, token, until: Date.now() + 50 * 60_000 });
  return token;
}

/** The admin token, or null when the service account is missing or refused. */
export async function adminTokenOrNull() {
  try {
    return await adminToken();
  } catch {
    return null;
  }
}

// Settings → Delete account (owner, 2026-10-25). The app sends the learner's
// fresh sign-in token; this checks it (signed in within the last 5 minutes)
// and deletes everything of theirs with the service account
// (server/account-deletion.mjs), the login last. Needs the Vercel setting
// FIREBASE_SERVICE_ACCOUNT (already there for push and reminders). Without it
// the app is told 503 and deletes what the rules allow instead (src/lib/account.ts).
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

import { handleAccountDeletion } from '../server/account-deletion.mjs';
import { serviceAccount } from './_admin.mjs';

function adminApp() {
  const existing = getApps().find((app) => app.name === 'account-deletion');
  if (existing) return existing;
  const account = serviceAccount();
  if (!account) return null;
  return initializeApp({ credential: cert(account), projectId: account.project_id || 'grate-apex' }, 'account-deletion');
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only.' });
  let app;
  try {
    app = adminApp();
  } catch (error) {
    console.error('Account deletion: the service account could not be used:', error);
    app = null;
  }
  if (!app) return res.status(503).json({ error: 'Account deletion is not set up on the server.', code: 'not-configured' });
  const { status, body } = await handleAccountDeletion(req.headers.authorization, { auth: getAuth(app), db: getFirestore(app), FieldValue });
  if (status === 200) console.log('Account deleted:', JSON.stringify(body.removed));
  return res.status(status).json(body);
}

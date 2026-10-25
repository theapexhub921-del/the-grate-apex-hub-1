// Settings → Delete account (owner, 2026-10-25). The app sends the learner's
// fresh sign-in token; this checks it (signed in within the last 5 minutes)
// and deletes everything of theirs with the service account
// (server/account-deletion.mjs, through the plain-web-request admin in
// _admin-rest.mjs), the login last. Needs the Vercel setting
// FIREBASE_SERVICE_ACCOUNT (already there for push and reminders). Without it
// the app is told 503 and deletes what the rules allow instead (src/lib/account.ts).
import { handleAccountDeletion } from '../server/account-deletion.mjs';
import { restAdmin } from './_admin-rest.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only.' });
  const admin = restAdmin();
  if (!admin) return res.status(503).json({ error: 'Account deletion is not set up on the server.', code: 'not-configured' });
  try {
    const { status, body } = await handleAccountDeletion(req.headers.authorization, admin);
    if (status === 200) console.log('Account deleted:', JSON.stringify(body.removed));
    return res.status(status).json(body);
  } catch (error) {
    console.error('Account deletion failed:', error);
    return res.status(500).json({ error: 'Your account could not be deleted. Please try again.' });
  }
}

// POST /api/question-report — email a saved question report to the content team.
// Set RESEND_API_KEY in Vercel; the Firestore report remains saved if email fails.
import { createRemoteJWKSet, jwtVerify } from 'jose';

const PROJECT = 'grate-apex';
const KEYS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const DESTINATION = 'theapexhub921@gmail.com';
const REASONS = new Set(['wrong-answer', 'typo', 'unclear', 'options', 'other']);
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only.' });
  const token = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  try {
    const { payload } = await jwtVerify(token, KEYS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
    if (!payload.sub) throw new Error('Missing learner id');
  } catch {
    return res.status(401).json({ error: 'Please sign in again.' });
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'Email notifications are not configured.' });
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body;
  const questionId = clean(body?.questionId, 300);
  const prompt = clean(body?.prompt, 600);
  const reason = clean(body?.reason, 40);
  if (!questionId || !prompt || !REASONS.has(reason)) return res.status(400).json({ error: 'Invalid report.' });
  const details = [
    `Question: ${prompt}`, `Question ID: ${questionId}`, `Reason: ${reason}`,
    `Location: ${clean(body?.place, 120) || 'Not provided'}`,
    `Details: ${clean(body?.note, 500) || 'None'}`,
  ].join('\n\n');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.QUESTION_REPORT_FROM || 'GRATEAPEX Reports <onboarding@resend.dev>',
        to: [DESTINATION],
        subject: `Question report: ${reason}`,
        text: details,
      }),
    });
    if (!response.ok) return res.status(502).json({ error: 'The report email could not be sent.' });
    return res.status(200).json({ sent: true });
  } catch {
    return res.status(502).json({ error: 'The report email could not be sent.' });
  }
}

function safeJson(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

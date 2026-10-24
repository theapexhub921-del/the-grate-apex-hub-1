// POST /api/question-report — email a saved question report to the content team.
// Email goes through Resend (RESEND_API_KEY in Vercel; 3,000 a month free). If Resend
// is not set up or fails, Formspree is the backup (FORMSPREE_FORM_ID in Vercel, the
// id from formspree.io/f/<id>; 50 a month free), so a report is emailed once, never
// twice. The Firestore report is saved first either way, and admins also see it in
// Settings → Help → Reported questions.
import { createRemoteJWKSet, jwtVerify } from 'jose';

const PROJECT = 'grate-apex';
const KEYS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const DESTINATION = 'theapexhub921@gmail.com';
const REASONS = new Set(['wrong-answer', 'typo', 'unclear', 'options', 'other']);
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const recent = new Map();

function tooSoon(uid) {
  const now = Date.now();
  if (recent.size > 500) for (const [key, at] of recent) if (now - at > 60_000) recent.delete(key);
  if (now - (recent.get(uid) ?? 0) < 60_000) return true;
  recent.set(uid, now);
  return false;
}

function firestoreValue(value) {
  if (!value || typeof value !== 'object') return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('timestampValue' in value) return Date.parse(value.timestampValue);
  return undefined;
}

// The saved report, null when there is none, or 'unavailable' when the database
// could not be asked (e.g. its free daily reads ran out).
async function savedReport(uid, questionId, userToken) {
  let qkey = questionId.replace(/\//g, '|').replace(/^\.+$/, '_').slice(0, 300);
  if (/^__.*__$/.test(qkey)) qkey = `q${qkey}`;
  const id = `${qkey}_${uid}`;
  const response = await fetch(`${FIRESTORE}/questionReports/${encodeURIComponent(id)}`, {
    headers: { authorization: `Bearer ${userToken}` },
  });
  if (response.status === 404 || response.status === 403) return null;
  if (!response.ok) return 'unavailable';
  const fields = (await response.json()).fields ?? {};
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, firestoreValue(value)]));
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only.' });
  const token = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  let uid;
  try {
    const { payload } = await jwtVerify(token, KEYS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
    if (!payload.sub) throw new Error('Missing learner id');
    uid = payload.sub;
  } catch {
    return res.status(401).json({ error: 'Please sign in again.' });
  }
  if (req.headers['content-length'] && Number(req.headers['content-length']) > 16_384) {
    return res.status(413).json({ error: 'Report is too large.' });
  }
  if (!process.env.RESEND_API_KEY && !process.env.FORMSPREE_FORM_ID) return res.status(503).json({ error: 'Email notifications are not configured.' });
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid report.' });
  const questionId = clean(body?.questionId, 300);
  const prompt = clean(body?.prompt, 600);
  const reason = clean(body?.reason, 40);
  if (!questionId || !prompt || !REASONS.has(reason)) return res.status(400).json({ error: 'Invalid report.' });
  // The learner must have saved this report. When the database can't be asked (busy, or
  // out of its free daily reads) the email still goes: the sender is a signed-in learner
  // and can send one a minute.
  let checked = true;
  try {
    const report = await savedReport(uid, questionId, token);
    if (report === 'unavailable') checked = false;
    else if (!report || report.uid !== uid || report.qid !== questionId || report.status !== 'open'
      || report.reason !== reason || report.text !== prompt) {
      return res.status(403).json({ error: 'A saved report is required before email can be sent.' });
    }
  } catch {
    checked = false;
  }
  if (tooSoon(uid)) return res.status(429).json({ error: 'Please wait before emailing another report.' });
  const details = [
    `Question: ${prompt}`, `Question ID: ${questionId}`, `Reason: ${reason}`,
    `Location: ${clean(body?.place, 120) || 'Not provided'}`,
    `Details: ${clean(body?.note, 500) || 'None'}`,
    ...(checked ? [] : ['(Not cross-checked against the saved report: the database was busy. See Settings → Help → Reported questions.)']),
  ].join('\n\n');
  const subject = `Question report: ${reason}`;
  if (await sendWithResend(subject, details)) return res.status(200).json({ sent: true, via: 'resend' });
  if (await sendWithFormspree(subject, details, { questionId, reason })) return res.status(200).json({ sent: true, via: 'formspree' });
  return res.status(502).json({ error: 'The report email could not be sent.' });
}

async function sendWithResend(subject, details) {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        // Resend's test sender only delivers to the email the Resend account was made
        // with; for any other address, verify a domain and set QUESTION_REPORT_FROM.
        from: process.env.QUESTION_REPORT_FROM || 'GRATEAPEX Reports <onboarding@resend.dev>',
        to: [DESTINATION],
        subject,
        text: details,
      }),
    });
    if (!response.ok) console.warn('Resend refused the report email:', response.status, await response.text().catch(() => ''));
    return response.ok;
  } catch (error) {
    console.warn('Resend could not be reached:', error);
    return false;
  }
}

// Formspree emails the form's owner: create the form on formspree.io with
// theapexhub921@gmail.com and put its id (formspree.io/f/<id>) in FORMSPREE_FORM_ID.
async function sendWithFormspree(subject, details, fields) {
  const id = clean(process.env.FORMSPREE_FORM_ID, 40);
  if (!id || !/^[a-zA-Z0-9]+$/.test(id)) return false;
  try {
    const response = await fetch(`https://formspree.io/f/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, message: details, ...fields }),
    });
    if (!response.ok) console.warn('Formspree refused the report email:', response.status);
    return response.ok;
  } catch (error) {
    console.warn('Formspree could not be reached:', error);
    return false;
  }
}

function safeJson(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

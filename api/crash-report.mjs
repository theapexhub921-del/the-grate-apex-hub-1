// POST /api/crash-report — a crash in the app (src/lib/crash-report.ts, components/crash-boundary.tsx).
// Every report is written to the function log (Vercel → Logs, search "CRASH"). The team is
// emailed a short summary through Resend (RESEND_API_KEY or RESEND_KEY), at most once an hour
// for the same error and at most 30 a day from one running copy of the function.
// No sign-in is needed (a crash can happen before it); reports are size-limited and each
// address may send only a few a minute.

const DESTINATION = 'theapexhub921@gmail.com';
const clean = (value, max) => (typeof value === 'string' ? value.slice(0, max) : '');
const perAddress = new Map(); // address -> [times]
const emailed = new Map(); // error message -> time last emailed
let emailsToday = { day: '', count: 0 };

function tooMany(address) {
  const now = Date.now();
  const recent = (perAddress.get(address) ?? []).filter((at) => now - at < 60_000);
  recent.push(now);
  perAddress.set(address, recent);
  if (perAddress.size > 1000) perAddress.clear();
  return recent.length > 10;
}

function shouldEmail(message) {
  const now = Date.now();
  const day = new Date().toISOString().slice(0, 10);
  if (emailsToday.day !== day) emailsToday = { day, count: 0 };
  if (emailsToday.count >= 30) return false;
  if (now - (emailed.get(message) ?? 0) < 60 * 60_000) return false;
  emailed.set(message, now);
  emailsToday.count += 1;
  return true;
}

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only.' });
  if (req.headers['content-length'] && Number(req.headers['content-length']) > 16_384) return res.status(413).json({ error: 'Too large.' });
  const address = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
  if (tooMany(address)) return res.status(429).json({ error: 'Too many reports.' });
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid report.' });
  const report = {
    message: clean(body.message, 300) || 'Unknown error',
    where: clean(body.where, 80),
    page: clean(body.page, 300),
    platform: clean(body.platform, 20),
    agent: clean(body.agent, 300),
    user: clean(body.user, 128) || null,
    at: clean(body.at, 40),
    stack: clean(body.stack, 4000),
    extra: clean(body.extra, 2000),
  };
  console.error('CRASH', JSON.stringify(report));

  const key = process.env.RESEND_API_KEY || process.env.RESEND_KEY;
  if (key && shouldEmail(report.message)) {
    const text = [
      `Error: ${report.message}`,
      `Page: ${report.page || '?'} (${report.where || '?'})`,
      `Device: ${report.platform} · ${report.agent}`,
      `Learner: ${report.user ?? 'not signed in'} · ${report.at}`,
      '',
      report.stack,
      report.extra ? `\nWhere in the app:\n${report.extra}` : '',
      '\nThe same error is emailed at most once an hour; every report is in Vercel → Logs (search "CRASH").',
    ].join('\n');
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: process.env.QUESTION_REPORT_FROM || 'GRATEAPEX Reports <onboarding@resend.dev>',
          to: [DESTINATION],
          subject: `App crash: ${report.message.slice(0, 80)}`,
          text,
        }),
      });
      if (!response.ok) console.warn('Resend refused the crash email:', response.status);
    } catch (error) {
      console.warn('Resend could not be reached:', error);
    }
  }
  return res.status(200).json({ received: true });
}

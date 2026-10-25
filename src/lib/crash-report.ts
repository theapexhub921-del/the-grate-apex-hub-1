import { Platform } from 'react-native';

import { auth } from '@/lib/firebase';
import { API_BASE } from '@/lib/live-site';

// Crash reports (owner, 2026-10-25): when something breaks, the team hears about it
// without the learner doing anything. Each report goes to api/crash-report.mjs, which
// logs it (Vercel → Logs) and emails a short summary. A visit sends at most a few
// reports, and the same error only once.

const MAX_PER_VISIT = 5;
const sent = new Set<string>();

export function reportCrash(error: unknown, where: string, extra?: string) {
  try {
    const problem = error instanceof Error ? error : new Error(typeof error === 'string' ? error : JSON.stringify(error));
    const signature = `${problem.name}: ${problem.message}`.slice(0, 300);
    if (sent.has(signature) || sent.size >= MAX_PER_VISIT) return;
    sent.add(signature);
    const page = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
    void fetch(`${API_BASE}/api/crash-report`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        message: signature,
        stack: String(problem.stack ?? '').slice(0, 4000),
        where: where.slice(0, 80),
        extra: extra?.slice(0, 2000),
        page: page.slice(0, 300),
        platform: Platform.OS,
        agent: typeof navigator !== 'undefined' ? String(navigator.userAgent).slice(0, 300) : '',
        user: auth.currentUser?.uid ?? null,
        at: new Date().toISOString(),
      }),
    }).catch(() => undefined);
  } catch {
    // Reporting must never cause a problem of its own.
  }
}

let listening = false;

/** Errors outside React (scripts, promises nobody waited for), on the web. */
export function installCrashReporting() {
  if (listening || Platform.OS !== 'web' || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('error', (event) => {
    // A failed image or script load has no error object: not a crash.
    if (event.error) reportCrash(event.error, 'window');
  });
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    // Network and Firebase hiccups are handled where they happen; report real code errors only.
    if (reason instanceof Error && !/network|offline|Failed to fetch|unavailable|permission-denied/i.test(reason.message)) {
      reportCrash(reason, 'promise');
    }
  });
}

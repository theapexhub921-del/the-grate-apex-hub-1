// Focus timer (owner's request, 2026-10-20): minutes of focused study per day.
// Pure, so tests/focus-timer.test.mjs can check it; src/data/focus.ts stores it.

export type FocusLog = { days: Record<string, number>; sessions: Record<string, number> };

export const FOCUS_PRESETS = [
  { id: '25-5', focus: 25, rest: 5, label: '25 / 5' },
  { id: '50-10', focus: 50, rest: 10, label: '50 / 10' },
  { id: '15-3', focus: 15, rest: 3, label: '15 / 3' },
] as const;
export type FocusPresetId = (typeof FOCUS_PRESETS)[number]['id'];

/** Stopping early still counts once this many minutes were focused. */
export const MIN_COUNTED_MINUTES = 5;
const KEEP_DAYS = 400;

export const emptyFocusLog = (): FocusLog => ({ days: {}, sessions: {} });

export function dayKey(at: number): string {
  const date = new Date(at);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** The log with `minutes` more focus on the day of `at` (and one more session when it was a whole block). */
export function addFocus(log: FocusLog, minutes: number, at: number, wholeBlock: boolean): FocusLog {
  const key = dayKey(at);
  const days = { ...log.days, [key]: (log.days[key] ?? 0) + Math.max(0, Math.round(minutes)) };
  const sessions = wholeBlock ? { ...log.sessions, [key]: (log.sessions[key] ?? 0) + 1 } : { ...log.sessions };
  return trim({ days, sessions });
}

/** Two copies of the log (this device and the account): each day keeps the larger count. */
export function mergeFocusLogs(a: Partial<FocusLog> | undefined, b: Partial<FocusLog> | undefined): FocusLog {
  const pick = (x: Record<string, number> = {}, y: Record<string, number> = {}) => {
    const out: Record<string, number> = { ...x };
    for (const [key, value] of Object.entries(y)) if (typeof value === 'number' && value > (out[key] ?? 0)) out[key] = value;
    return out;
  };
  return trim({ days: pick(a?.days, b?.days), sessions: pick(a?.sessions, b?.sessions) });
}

function trim(log: FocusLog): FocusLog {
  const keep = Object.keys(log.days).sort().slice(-KEEP_DAYS);
  const days = Object.fromEntries(keep.map((key) => [key, log.days[key]]));
  const sessions = Object.fromEntries(keep.filter((key) => log.sessions[key]).map((key) => [key, log.sessions[key]]));
  return { days, sessions };
}

/** Minutes today, this week (Monday to Sunday) and in all. */
export function focusTotals(log: FocusLog, now: number) {
  const today = dayKey(now);
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weekStart = dayKey(monday.getTime());
  let week = 0;
  let total = 0;
  for (const [key, minutes] of Object.entries(log.days)) {
    total += minutes;
    if (key >= weekStart && key <= today) week += minutes;
  }
  return { today: log.days[today] ?? 0, week, total, sessionsToday: log.sessions[today] ?? 0 };
}

/** "mm:ss" for the clock. */
export function clock(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

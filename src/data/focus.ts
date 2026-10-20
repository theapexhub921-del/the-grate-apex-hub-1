// The focus timer's log (src/data/focus-rules.ts): kept on the device and on the
// account (`synced.focus`, src/data/account-sync.ts), so it is the same everywhere.
// A finished focus block (or 5+ minutes before stopping) keeps the learning streak.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { saveSynced, syncedValue } from '@/data/account-sync';
import { addFocus, emptyFocusLog, type FocusLog, focusTotals, MIN_COUNTED_MINUTES, mergeFocusLogs } from '@/data/focus-rules';
import { markStudyActivity } from '@/data/progress';

export * from '@/data/focus-rules';

const KEY = 'grateapex_focus_log';
let log: FocusLog = emptyFocusLog();
let loading: Promise<FocusLog> | null = null;
const listeners = new Set<(value: FocusLog) => void>();

function publish(next: FocusLog) {
  log = next;
  listeners.forEach((listener) => listener(next));
}

export function loadFocusLog(): Promise<FocusLog> {
  if (!loading) {
    loading = (async () => {
      const local = await AsyncStorage.getItem(KEY)
        .then((raw) => (raw ? (JSON.parse(raw) as FocusLog) : undefined))
        .catch(() => undefined);
      const remote = await syncedValue<FocusLog>('focus').catch(() => undefined);
      const merged = mergeFocusLogs(mergeFocusLogs(local, remote), log);
      publish(merged);
      return merged;
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

/** Counts focused minutes; whole blocks and 5+ minutes keep the streak. */
export async function recordFocus(minutes: number, wholeBlock: boolean) {
  if (minutes < (wholeBlock ? 1 : MIN_COUNTED_MINUTES)) return;
  await loadFocusLog().catch(() => undefined);
  const next = addFocus(log, minutes, Date.now(), wholeBlock);
  publish(next);
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
  saveSynced('focus', next);
  await markStudyActivity().catch(() => undefined);
}

/** Focus minutes today, this week and in all (for the timer page and goals). */
export function useFocusTotals() {
  const [value, setValue] = useState(log);
  useEffect(() => {
    listeners.add(setValue);
    void loadFocusLog().then(setValue).catch(() => undefined);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return focusTotals(value, Date.now());
}

/** All focus minutes so far (for the "Focus minutes" goal). */
export async function totalFocusMinutes(): Promise<number> {
  return focusTotals(await loadFocusLog().catch(() => log), Date.now()).total;
}

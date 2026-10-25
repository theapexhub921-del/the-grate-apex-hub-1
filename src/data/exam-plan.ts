import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

import { progressField, saveProgressField } from '@/data/account-sync';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';

// The learner's exam date (owner, 2026-10-25), shown as a countdown with a daily
// plan on the Study page (components/learning/exam-countdown-card.tsx; the plan
// itself is data/exam-plan-rules.ts).
//
// Saved where the original app kept it, progress/{uid}.examDate ("2026-12-10"),
// so both apps and the "Set your exam date" achievement see the same date. No
// extra read: it comes with the progress document account-sync reads at sign-in.
// Clearing saves "" (not a deleted field), so another device can tell "cleared"
// from "not loaded"; a copy on the device shows it straight away and offline.

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const keyFor = (uid: string) => `grateapex_exam_date:${uid}`;
const clean = (value: unknown) => (typeof value === 'string' && DAY.test(value) ? value : null);

type State = { uid: string | null; date: string | null; ready: boolean };
let state: State = { uid: null, date: null, ready: false };
let loadedFor: string | null = null;
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

async function load(uid: string) {
  if (loadedFor === uid) return;
  loadedFor = uid;
  const local = clean(await AsyncStorage.getItem(keyFor(uid)).catch(() => null));
  if (auth.currentUser?.uid !== uid) return;
  emit({ uid, date: local, ready: true });
  const remote = await progressField<unknown>('examDate').catch(() => undefined);
  if (auth.currentUser?.uid !== uid || typeof remote !== 'string') return; // not loaded: keep the device copy
  const date = clean(remote);
  if (date === state.date) return;
  emit({ uid, date, ready: true });
  void (date ? AsyncStorage.setItem(keyFor(uid), date) : AsyncStorage.removeItem(keyFor(uid))).catch(() => undefined);
}

/** Sets (YYYY-MM-DD) or clears (null) the exam date, on this device and the account. */
export async function setExamDate(date: string | null) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const value = clean(date);
  emit({ uid, date: value, ready: true });
  await (value ? AsyncStorage.setItem(keyFor(uid), value) : AsyncStorage.removeItem(keyFor(uid))).catch(() => undefined);
  await saveProgressField('examDate', value ?? '').catch(() => undefined); // offline: Firestore sends it later
}

/** The signed-in learner's exam date (null when none is set). */
export function useExamDate(): { date: string | null; ready: boolean } {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const current = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
  useEffect(() => {
    if (uid) void load(uid);
  }, [uid]);
  if (!uid || current.uid !== uid) return { date: null, ready: false };
  return { date: current.date, ready: current.ready };
}

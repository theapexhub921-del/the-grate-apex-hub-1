// The daily quest's ticks (2026-10-28), kept on this device for today only:
// Daily 10 finished, a diagram labelled, a lesson / quiz / sprint finished.
// The reward is XP, paid once a day (awardXp key practice:daily-quest:<day>).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { localDay } from '@/data/learning/weakest';

// ── Daily quest marks (this device) ─────────────────────────────────

export type QuestMarks = { day: string; daily: boolean; label: boolean; study: boolean };
const QUEST_KEY = 'grateapex_daily_quest';
const fresh = (): QuestMarks => ({ day: localDay(), daily: false, label: false, study: false });
let marks: QuestMarks | null = null;
let loading: Promise<void> | undefined;
const listeners = new Set<() => void>();

function current(): QuestMarks {
  if (!marks || marks.day !== localDay()) marks = fresh();
  return marks;
}

function load(): Promise<void> {
  if (loading) return loading;
  const reading: Promise<void> = AsyncStorage.getItem(QUEST_KEY)
    .then((saved: string | null) => {
      const parsed = saved ? (JSON.parse(saved) as Partial<QuestMarks>) : null;
      if (parsed?.day === localDay()) {
        const now = current();
        marks = { ...now, daily: now.daily || Boolean(parsed.daily), label: now.label || Boolean(parsed.label), study: now.study || Boolean(parsed.study) };
      }
    })
    .catch(() => undefined)
    .finally(() => listeners.forEach((listener) => listener()));
  loading = reading;
  return reading;
}

/** Ticks one of today's quest steps. */
export async function markQuest(step: 'daily' | 'label' | 'study') {
  await load();
  const now = current();
  if (now[step]) return;
  marks = { ...now, [step]: true };
  listeners.forEach((listener) => listener());
  await AsyncStorage.setItem(QUEST_KEY, JSON.stringify(marks)).catch(() => undefined);
}

export function useQuestMarks(): QuestMarks {
  const [value, setValue] = useState<QuestMarks>(() => current());
  useEffect(() => {
    const update = () => setValue({ ...current() });
    listeners.add(update);
    void load().then(update);
    return () => {
      listeners.delete(update);
    };
  }, []);
  return value;
}

/** The XP ledger key for today's quest reward (awardXp adds the "practice:" part). */
export const questAwardId = (day = localDay()) => `daily-quest:${day}`;

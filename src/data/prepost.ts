// Pre-test and post-test (from the original app): take 10 questions before
// studying a course, study, then 10 different ones to see how much you've
// improved. Kept on this device, per course.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSynced, syncedValue } from '@/data/account-sync';

export type TestResult = { correct: number; total: number; ids: string[]; at: number };
export type PrePost = { pre?: TestResult; post?: TestResult };

const KEY = 'grateapex_prepost';

async function readAll(): Promise<Record<string, PrePost>> {
  try {
    const local = JSON.parse((await AsyncStorage.getItem(KEY)) ?? '{}') as Record<string, PrePost>;
    // Results from my other devices: for each course and test, the latest one (data/account-sync.ts).
    const remote = (await syncedValue<Record<string, PrePost>>('prePost').catch(() => undefined)) ?? {};
    const merged: Record<string, PrePost> = { ...remote };
    for (const [course, mine] of Object.entries(local)) {
      const theirs = merged[course] ?? {};
      const later = (a?: TestResult, b?: TestResult) => (!a ? b : !b ? a : (a.at ?? 0) >= (b.at ?? 0) ? a : b);
      merged[course] = { pre: later(mine.pre, theirs.pre), post: later(mine.post, theirs.post) };
    }
    return merged;
  } catch {
    return {};
  }
}

export async function loadPrePost(courseId: string): Promise<PrePost> {
  return (await readAll())[courseId] ?? {};
}

/** Saves a result; a new pre-test starts over (it clears the old post-test). */
export async function savePrePost(courseId: string, phase: 'pre' | 'post', result: TestResult) {
  const all = await readAll();
  const current = all[courseId] ?? {};
  all[courseId] = phase === 'pre' ? { pre: result } : { ...current, post: result };
  await AsyncStorage.setItem(KEY, JSON.stringify(all)).catch(() => {});
  saveSynced('prePost', all);
}

export const percentOf = (result: TestResult | undefined) => (result && result.total ? Math.round((result.correct / result.total) * 100) : null);

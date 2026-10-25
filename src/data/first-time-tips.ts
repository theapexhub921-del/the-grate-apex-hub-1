import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

// One-time tips (owner, 2026-10-25): the welcome tour is six steps; the other features
// explain themselves the first time they are opened (components/first-time-tips.tsx).
// They are switched on when a learner finishes or skips the new tour on this device
// (older learners went through the full tour), and each one shows once.

const KEY = 'grateapex_first_time_tips';

export type TipId = 'feed' | 'read' | 'quiz' | 'review' | 'planner' | 'apex' | 'explore' | 'connect';

export const TIPS: Record<TipId, { title: string; body: string }> = {
  feed: { title: 'Your Feed', body: 'Your social space: watch and share Stories, post photos, videos and study moments, and like, comment on, reply to and reshare friends’ posts.' },
  read: { title: 'The reading version', body: 'Every lesson also has a reading version: the full explanation, the slide sources, high-yield points and common confusions. Use it to revise.' },
  quiz: { title: 'Lesson quizzes', body: 'Choose feedback after each answer or at the end, like an exam. Results show your strengths, what to revise, and let you practise the ones you missed.' },
  review: { title: 'Review', body: 'Each concept you studied comes back just before you would forget it. Your review calendar in Study shows what is due and when.' },
  planner: { title: 'Your planner', body: 'Build your weekly timetable here, and set lesson, XP or streak goals in Your progress. Your next step is always waiting in Study.' },
  apex: { title: 'The Apex Challenge', body: 'A timed run across a whole course: fast, serious and separate from lesson quizzes. Your best score is your benchmark. Battle a friend in Connect.' },
  explore: { title: 'Explore', body: 'How each part of GrAte Apex Hub works, announcements, what is coming next, the study games and the team behind the app.' },
  connect: { title: 'Connect', body: 'Follow classmates and message friends or groups with photos, documents and voice notes (swipe a message to reply). Keep friend streaks going and join study groups.' },
};

type State = { ready: boolean; on: boolean; seen: TipId[] };
let state: State = { ready: false, on: false, seen: [] };
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

function emit(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

function load() {
  if (!loading) {
    loading = AsyncStorage.getItem(KEY)
      .then((saved) => {
        const data = saved ? (JSON.parse(saved) as Partial<State>) : {};
        emit({ ready: true, on: data.on === true, seen: Array.isArray(data.seen) ? (data.seen.filter((id) => id in TIPS) as TipId[]) : [] });
      })
      .catch(() => emit({ ...state, ready: true }));
  }
  return loading;
}

function save() {
  void AsyncStorage.setItem(KEY, JSON.stringify({ on: state.on, seen: state.seen })).catch(() => undefined);
}

/** Called when the new short tour is finished or skipped (not replayed). */
export async function enableFirstTimeTips() {
  await load();
  emit({ ...state, on: true });
  save();
}

export async function dismissTip(id: TipId) {
  await load();
  if (state.seen.includes(id)) return;
  emit({ ...state, seen: [...state.seen, id] });
  save();
}

/** The tip to show for this page, if any (on, and not dismissed yet). */
export function useFirstTimeTip(id: TipId | null): TipId | null {
  const current = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      void load();
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
  if (!id || !current.ready || !current.on || current.seen.includes(id)) return null;
  return id;
}

/** Which tip belongs to a page (pathname, and the lesson's layer). */
export function tipForPage(pathname: string, layer?: string): TipId | null {
  if (pathname === '/') return 'feed';
  if (pathname === '/learn/lesson' && layer === 'read') return 'read';
  if (pathname === '/learn/quiz') return 'quiz';
  if (pathname === '/learn/review') return 'review';
  if (pathname === '/learn/planner') return 'planner';
  if (pathname === '/learn/apex') return 'apex';
  if (pathname === '/explore') return 'explore';
  if (pathname === '/social') return 'connect';
  return null;
}

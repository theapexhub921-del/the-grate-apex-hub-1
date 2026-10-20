// The focus timer's clock (owner's request, 2026-10-20), kept outside the page so
// it runs in the background: on another page of the app, in a background tab or
// with the screen on something else. When a block ends, the alarm rings
// (lib/feedback.ts alarmFeedback), a device alert shows if alerts are allowed,
// the minutes are counted (data/focus.ts) and the break starts.
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import { FOCUS_PRESETS, type FocusPresetId, MIN_COUNTED_MINUTES, recordFocus } from '@/data/focus';
import { alarmFeedback, primeAlarm } from '@/lib/feedback';

export type FocusPhase = 'focus' | 'rest';
export type FocusTimerState = { preset: FocusPresetId; phase: FocusPhase; endsAt: number | null; remainingMs: number; note: string | null };

export const focusPresetOf = (id: FocusPresetId) => FOCUS_PRESETS.find((item) => item.id === id) ?? FOCUS_PRESETS[0];
export const focusPhaseMs = (id: FocusPresetId, phase: FocusPhase) => (phase === 'focus' ? focusPresetOf(id).focus : focusPresetOf(id).rest) * 60_000;

let state: FocusTimerState = { preset: '25-5', phase: 'focus', endsAt: null, remainingMs: focusPhaseMs('25-5', 'focus'), note: null };
const listeners = new Set<() => void>();
let ticker: ReturnType<typeof setInterval> | null = null;

function set(next: FocusTimerState) {
  state = next;
  listeners.forEach((listener) => listener());
  if (state.endsAt !== null && !ticker) {
    ticker = setInterval(check, 1000);
    if (Platform.OS === 'web' && typeof document !== 'undefined') document.addEventListener('visibilitychange', check);
  }
  if (state.endsAt === null && ticker) {
    clearInterval(ticker);
    ticker = null;
    if (Platform.OS === 'web' && typeof document !== 'undefined') document.removeEventListener('visibilitychange', check);
  }
}

/** A device alert when the app is in the background (only if alerts were already allowed). */
function alert(title: string, body: string) {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (typeof document !== 'undefined' && document.visibilityState === 'visible') return;
  const options = { body, tag: 'grateapex-focus', icon: '/icons/grateapex-192.png', badge: '/icons/grateapex-192.png' };
  navigator.serviceWorker?.ready
    .then((registration) => registration.showNotification(title, options))
    .catch(() => {
      try {
        new Notification(title, options);
      } catch {
        // alerts are optional
      }
    });
}

function check() {
  if (state.endsAt === null || Date.now() < state.endsAt) return;
  alarmFeedback();
  const preset = focusPresetOf(state.preset);
  if (state.phase === 'focus') {
    void recordFocus(preset.focus, true);
    alert('Focus block done', `${preset.focus} minutes counted. Take a ${preset.rest}-minute break.`);
    set({ ...state, phase: 'rest', endsAt: Date.now() + focusPhaseMs(state.preset, 'rest'), remainingMs: focusPhaseMs(state.preset, 'rest'), note: `${preset.focus} minutes of focus counted. Take a ${preset.rest}-minute break.` });
  } else {
    alert('Break over', 'Ready for the next focus block?');
    set({ ...state, phase: 'focus', endsAt: null, remainingMs: focusPhaseMs(state.preset, 'focus'), note: 'Break over. Ready for the next block?' });
  }
}

export const remainingOf = (value: FocusTimerState, now = Date.now()) => (value.endsAt !== null ? Math.max(0, value.endsAt - now) : value.remainingMs);

export function startFocusTimer() {
  primeAlarm();
  set({ ...state, endsAt: Date.now() + state.remainingMs, note: null });
}

export function pauseFocusTimer() {
  set({ ...state, endsAt: null, remainingMs: remainingOf(state) });
}

/** Stop: a focus block stopped after 5+ minutes still counts what was done. Also "Skip break". */
export function stopFocusTimer() {
  let note: string | null = null;
  if (state.phase === 'focus') {
    const focused = Math.floor((focusPhaseMs(state.preset, 'focus') - remainingOf(state)) / 60_000);
    if (focused >= MIN_COUNTED_MINUTES) {
      void recordFocus(focused, false);
      note = `${focused} minutes of focus counted.`;
    }
  }
  set({ ...state, phase: 'focus', endsAt: null, remainingMs: focusPhaseMs(state.preset, 'focus'), note });
}

export function chooseFocusPreset(preset: FocusPresetId) {
  set({ preset, phase: 'focus', endsAt: null, remainingMs: focusPhaseMs(preset, 'focus'), note: null });
}

export function useFocusTimer(): FocusTimerState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
}

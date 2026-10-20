// Sounds and vibration when the learner taps and answers (owner's request,
// 2026-10-19: tapping felt "a little too boring").
//
// - tap: a tiny buzz on phones for every button and card (no sound: clicking on
//   every tap was too much, owner 2026-10-19),
// - correct / wrong: a short, quiet chime or a low soft note when an answer is
//   checked (QuestionCard) — the only sounds, where they mean something.
//
// Sounds are made by the browser (Web Audio), so there are no files to load.
// Vibration uses the phone's motor where the browser allows it (Android; Apple
// does not let websites vibrate) and React Native's Vibration in the apps.
// Both can be switched off in Settings → Sounds and vibration, on each device.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Platform, Vibration } from 'react-native';

type Prefs = { sound: boolean; vibration: boolean };
const KEY = 'grateapex_feedback';
let prefs: Prefs = { sound: true, vibration: true };
const listeners = new Set<() => void>();

void AsyncStorage.getItem(KEY)
  .then((saved) => {
    if (!saved) return;
    const parsed = JSON.parse(saved) as Partial<Prefs>;
    prefs = { sound: parsed.sound !== false, vibration: parsed.vibration !== false };
    listeners.forEach((listener) => listener());
  })
  .catch(() => {});

export function useFeedbackPrefs(): Prefs {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => prefs,
    () => prefs
  );
}

export function setFeedbackPref(name: keyof Prefs, on: boolean) {
  prefs = { ...prefs, [name]: on };
  listeners.forEach((listener) => listener());
  void AsyncStorage.setItem(KEY, JSON.stringify(prefs)).catch(() => {});
  // A sample of what was just switched on.
  if (on && name === 'sound') correctFeedback();
  if (on && name === 'vibration') vibrate([20]);
}

// ── Sound (web) ──────────────────────────────────────────────────────────
type Tone = { from: number; to?: number; at: number; length: number; volume: number; wave: OscillatorType };

let audio: AudioContext | null = null;
function context(): AudioContext | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    audio ??= new Ctor();
    if (audio.state === 'suspended') void audio.resume();
    return audio;
  } catch {
    return null;
  }
}

function play(tones: readonly Tone[]) {
  if (!prefs.sound) return;
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const tone of tones) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + tone.at;
    osc.type = tone.wave;
    osc.frequency.setValueAtTime(tone.from, start);
    if (tone.to) osc.frequency.exponentialRampToValueAtTime(tone.to, start + tone.length);
    // A quick rise and a soft fade, so nothing clicks harshly.
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.volume, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + tone.length + 0.02);
  }
}

// ── Vibration ────────────────────────────────────────────────────────────
function vibrate(pattern: number[]) {
  if (!prefs.vibration) return;
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
    } else {
      Vibration.vibrate(pattern.length === 1 ? pattern[0] : [0, ...pattern]);
    }
  } catch {
    // vibration is optional
  }
}

// ── The three feedbacks ──────────────────────────────────────────────────
let lastTap = 0;

/** A tiny buzz for a tap, on phones (at most one every 40 ms). Taps make no sound. */
export function tapFeedback() {
  const now = Date.now();
  if (now - lastTap < 40) return;
  lastTap = now;
  vibrate([8]);
}

/** A right answer: two bright rising notes. */
export function correctFeedback() {
  play([
    { from: 784, at: 0, length: 0.08, volume: 0.035, wave: 'sine' },
    { from: 1175, at: 0.07, length: 0.12, volume: 0.035, wave: 'sine' },
  ]);
  vibrate([15]);
}

/** A wrong answer: a low, soft "bonk" (gentle, not a buzzer). */
export function wrongFeedback() {
  play([{ from: 260, to: 190, at: 0, length: 0.14, volume: 0.04, wave: 'sine' }]);
  vibrate([20, 40, 20]);
}

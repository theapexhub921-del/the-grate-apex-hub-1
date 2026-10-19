// Sounds and vibration when the learner taps and answers (owner's request,
// 2026-10-19: tapping felt "a little too boring").
//
// - tap: a soft click on every button and card (the Interactive primitive),
// - correct / wrong: a short bright chime or a low soft "bonk" when an answer is
//   checked (QuestionCard), so every quiz, lesson checkpoint and review has it.
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
  if (on && name === 'sound') tapFeedback();
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

/** A soft click and a tiny buzz for a tap (at most one every 40 ms). */
export function tapFeedback() {
  const now = Date.now();
  if (now - lastTap < 40) return;
  lastTap = now;
  play([{ from: 1250, to: 780, at: 0, length: 0.035, volume: 0.035, wave: 'sine' }]);
  vibrate([10]);
}

/** A right answer: two bright rising notes. */
export function correctFeedback() {
  play([
    { from: 660, at: 0, length: 0.11, volume: 0.07, wave: 'triangle' },
    { from: 990, at: 0.09, length: 0.18, volume: 0.07, wave: 'triangle' },
  ]);
  vibrate([18]);
}

/** A wrong answer: a low, soft "bonk" (gentle, not a buzzer). */
export function wrongFeedback() {
  play([{ from: 240, to: 150, at: 0, length: 0.2, volume: 0.08, wave: 'triangle' }]);
  vibrate([25, 50, 25]);
}

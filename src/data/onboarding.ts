import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';

import { supabase } from '@/lib/supabase';

// First-run introduction ("onboarding") state.
//
// A learner sees the interactive introduction once, after their first
// sign-in. Completion (finished OR skipped) is remembered in two places:
//   - on this device (AsyncStorage), so it applies instantly and offline
//   - on the Supabase account (auth user metadata), so it follows the
//     learner to other devices — no database table or migration needed.
// Settings → "Replay the introduction" can always show it again.

const STORAGE_KEY = 'grateapex_onboarding';

// Bump these values whenever the published legal copy changes. A learner
// must accept the current versions again before continuing onboarding.
export const TERMS_VERSION = '2026-10-05';
export const PRIVACY_VERSION = '2026-10-05';

// Accounts created before the introduction existed are not sent through
// it automatically (they already know the app); they can replay it.
export const ONBOARDING_RELEASE = Date.parse('2026-10-03T00:00:00Z');

type Entry = { at: number; how: 'finished' | 'skipped' };
type Records = Record<string, Entry>; // by Supabase user id

let records: Records = {};
let ready = false;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function load() {
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed && typeof parsed === 'object') records = parsed as Records;
      } catch (problem) {
        console.warn('Could not load onboarding state:', problem);
      } finally {
        ready = true;
        notify();
      }
    })();
  }
  return loadPromise;
}

type Snapshot = { ready: boolean; records: Records };
let snapshot: Snapshot = { ready, records };

function getSnapshot() {
  if (snapshot.ready !== ready || snapshot.records !== records) snapshot = { ready, records };
  return snapshot;
}

export function useOnboardingState(): Snapshot {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      void load();
      return () => listeners.delete(listener);
    },
    getSnapshot,
    getSnapshot
  );
}

/** True when this signed-in learner should be taken through the introduction. */
export function needsOnboarding(user: User | null | undefined, local: Records): boolean {
  if (!user) return false;
  const created = Date.parse(user.created_at ?? '');
  const isNewAccount = Number.isFinite(created) && created >= ONBOARDING_RELEASE;
  if (!isNewAccount) return false;
  const metadata = user.user_metadata ?? {};
  const legalAccepted = metadata.terms_accepted === true
    && metadata.terms_version === TERMS_VERSION
    && metadata.privacy_acknowledged === true
    && metadata.privacy_version === PRIVACY_VERSION;
  if (!legalAccepted) return true;
  if (metadata.onboarding_completed === true || local[user.id]) return false;
  return true;
}

export function needsLegalAcceptance(user: User | null | undefined): boolean {
  if (!user) return false;
  const created = Date.parse(user.created_at ?? '');
  if (!Number.isFinite(created) || created < ONBOARDING_RELEASE) return false;
  const metadata = user.user_metadata ?? {};
  return !(metadata.terms_accepted === true && metadata.terms_version === TERMS_VERSION
    && metadata.privacy_acknowledged === true && metadata.privacy_version === PRIVACY_VERSION);
}

/** Record explicit legal consent on the signed-in account before the tour. */
export async function acceptCurrentLegalVersions(): Promise<{ error: string | null }> {
  const acceptedAt = new Date().toISOString();
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        terms_accepted: true,
        terms_accepted_at: acceptedAt,
        terms_version: TERMS_VERSION,
        privacy_acknowledged: true,
        privacy_acknowledged_at: acceptedAt,
        privacy_version: PRIVACY_VERSION,
      },
    });
    return { error: error?.message ?? null };
  } catch (problem) {
    return { error: problem instanceof Error ? problem.message : 'Could not save your acceptance. Please try again.' };
  }
}

/** Marks the introduction as done (finished or skipped) for this learner. */
export async function completeOnboarding(userId: string, how: Entry['how']) {
  records = { ...records, [userId]: { at: Date.now(), how } };
  notify();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (problem) {
    console.warn('Could not save onboarding state:', problem);
  }
  // Follow the learner across devices. Failure is harmless: the local
  // record already keeps them out of the introduction on this device.
  try {
    const { error } = await supabase.auth.updateUser({
      data: { onboarding_completed: true, onboarding_completed_at: new Date().toISOString(), onboarding_result: how },
    });
    if (error) console.warn('Could not save onboarding state to the account:', error.message);
  } catch (problem) {
    console.warn('Could not save onboarding state to the account:', problem);
  }
}

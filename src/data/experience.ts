// The learner's app experience: Legacy (id 'originals', formerly named
// "The Originals") or Originate (Hybrid was removed on 2026-10-18; a learner who
// had it is asked to choose again)
// (docs/experiences-architecture.md). An interface choice only — it never
// changes data, and it is independent of Appearance (themes).
//
// Saved on the account as users/{uid}.experience (allowed by the deployed
// rules). There is no default: when EXPERIENCES_ENABLED is on, a learner
// without a saved choice is asked before entering the app.
/** On: every signed-in learner chooses once (no default); Settings → Experience changes it. */
export const EXPERIENCES_ENABLED = true;

export const EXPERIENCES = ['originals', 'originate'] as const;
export type ExperienceId = (typeof EXPERIENCES)[number];

export const EXPERIENCE_INFO: Record<ExperienceId, { name: string; summary: string }> = {
  originals: {
    name: 'Legacy',
    summary: 'The original GrAte Apex Hub, as it was: its colours, emoji, fonts, glass panels, gradient background and navigation — with every new feature inside it.',
  },
  originate: { name: 'Originate', summary: 'The new GrAte Apex Hub design: its themes, layouts, icons and sidebar, in a clean, simple style.' },
};

/** The default experience: shown until a learner chooses, and preselected in the chooser. */
export const DEFAULT_EXPERIENCE: ExperienceId = 'originals';

export function isExperience(value: unknown): value is ExperienceId {
  return typeof value === 'string' && (EXPERIENCES as readonly string[]).includes(value);
}

/** True when the learner must choose (switch on, profile read, no valid choice saved). */
export function needsExperience(profile: Record<string, unknown> | undefined, profileLoaded: boolean, enabled = EXPERIENCES_ENABLED) {
  return enabled && profileLoaded && !isExperience(profile?.experience);
}

// A new learner chooses the interface before the username. A new Google account
// has no account record yet (the rules create it together with the username),
// so the choice is held here, the app is drawn in it, and it is saved on the
// account right after the username is chosen (choose-username).
let held: ExperienceId | null = null;

/** The interface chosen before the account could store it, if any. */
export function heldExperience() {
  return held;
}

export function holdExperience(experience: ExperienceId) {
  held = experience;
}

/** Saves a held choice on the account (after the username exists). Kept held until the profile reloads with it. */
export async function saveHeldExperience() {
  if (held) await saveExperience(held);
}

/** Saves the choice on the account. Throws when it can't be saved. */
export async function saveExperience(experience: ExperienceId) {
  if (!isExperience(experience)) throw new Error('Choose one of the two interfaces.');
  const { updateCurrentProfile } = await import('@/lib/profiles'); // loaded on use: keeps this module testable
  const { error } = await updateCurrentProfile({ experience });
  if (error) {
    console.warn('Could not save the experience:', error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    throw new Error('Your interface could not be saved. Please try again.');
  }
}

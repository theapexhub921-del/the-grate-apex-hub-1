// The learner's app experience: The Originals, Originate or Hybrid
// (docs/experiences-architecture.md). An interface choice only — it never
// changes data, and it is independent of Appearance (themes).
//
// Saved on the account as users/{uid}.experience (allowed by the deployed
// rules). There is no default: when EXPERIENCES_ENABLED is on, a learner
// without a saved choice is asked before entering the app.
/**
 * Off until The Originals and Hybrid really look different: nobody is asked to
 * choose between experiences that would look the same.
 */
export const EXPERIENCES_ENABLED = false;

export const EXPERIENCES = ['originals', 'originate', 'hybrid'] as const;
export type ExperienceId = (typeof EXPERIENCES)[number];

export const EXPERIENCE_INFO: Record<ExperienceId, { name: string; summary: string }> = {
  originals: { name: 'The Originals', summary: 'The original GrAteApex Hub look and layout, with the new features inside it.' },
  originate: { name: 'Originate', summary: 'The new GrAteApex Hub design, layouts and motion.' },
  hybrid: { name: 'Hybrid', summary: 'The new layouts with the original app’s glass panels and buttons.' },
};

export function isExperience(value: unknown): value is ExperienceId {
  return typeof value === 'string' && (EXPERIENCES as readonly string[]).includes(value);
}

/** True when the learner must choose (switch on, profile read, no valid choice saved). */
export function needsExperience(profile: Record<string, unknown> | undefined, profileLoaded: boolean, enabled = EXPERIENCES_ENABLED) {
  return enabled && profileLoaded && !isExperience(profile?.experience);
}

/** Saves the choice on the account. Throws when it can't be saved. */
export async function saveExperience(experience: ExperienceId) {
  if (!isExperience(experience)) throw new Error('Choose one of the three experiences.');
  const { updateCurrentProfile } = await import('@/lib/profiles'); // loaded on use: keeps this module testable
  const { error } = await updateCurrentProfile({ experience });
  if (error) throw new Error('Your experience could not be saved. Please try again.');
}

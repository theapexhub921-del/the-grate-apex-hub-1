// Presence fields the app writes to the learner's own profile every few minutes
// while it is open (components/online-presence-sync.tsx). Pure, for tests.

/** How often an open app refreshes its presence (also on opening and leaving the app). */
export const PRESENCE_EVERY_MS = 3 * 60_000;
/** Someone counts as online for this long after their last presence write. */
export const ONLINE_WITHIN_MS = 5 * 60_000;

const PRESENCE_FIELDS = new Set(['isOnline', 'lastSeen', 'appActiveAt']);

/**
 * True when two reads of a profile differ only in presence fields. The sign-in
 * listener (hooks/use-auth.tsx) then keeps the same learner object, so the
 * whole app doesn't redraw and reload with every presence write.
 */
export function samePresenceAside(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const rest = (profile: Record<string, unknown>) =>
    JSON.stringify(Object.keys(profile).filter((key) => !PRESENCE_FIELDS.has(key)).sort().map((key) => [key, profile[key]]));
  return rest(a) === rest(b);
}

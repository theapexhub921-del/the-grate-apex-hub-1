// Presence fields the app writes to the learner's own profile every 45 seconds
// while it is open (components/online-presence-sync.tsx). Pure, for tests.

const PRESENCE_FIELDS = new Set(['isOnline', 'lastSeen', 'appActiveAt']);

/**
 * True when two reads of a profile differ only in presence fields. The sign-in
 * listener (hooks/use-auth.tsx) then keeps the same learner object, so the
 * whole app doesn't redraw and reload every 45 seconds.
 */
export function samePresenceAside(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const rest = (profile: Record<string, unknown>) =>
    JSON.stringify(Object.keys(profile).filter((key) => !PRESENCE_FIELDS.has(key)).sort().map((key) => [key, profile[key]]));
  return rest(a) === rest(b);
}

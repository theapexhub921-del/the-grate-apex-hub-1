// Turns any failure into a message a learner can read. The app's own errors
// (thrown with friendly text, e.g. "That username is taken.") are shown as
// they are; Firebase and network errors, whose text is technical
// ("FirebaseError: Missing or insufficient permissions."), get a plain
// explanation instead, or the screen's own fallback message.

const BY_CODE: Record<string, string> = {
  'permission-denied': 'You do not have permission to do that.',
  unauthenticated: 'Please sign in again and try once more.',
  unavailable: 'No connection right now. Please check your internet and try again.',
  'deadline-exceeded': 'That took too long. Please check your internet and try again.',
  'resource-exhausted': 'Too many requests just now. Please wait a moment and try again.',
  'not-found': 'That could not be found. It may have been removed.',
  'already-exists': 'That already exists.',
  cancelled: 'That was cancelled.',
  'auth/network-request-failed': 'No connection right now. Please check your internet and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/requires-recent-login': 'For your security, please sign in again and then try once more.',
  'auth/user-token-expired': 'Your sign-in has expired. Please sign in again.',
  'auth/user-disabled': 'This account has been disabled.',
};

const TECHNICAL = /firebase|firestore|auth\/|missing or insufficient permissions|permission[- _]denied|client is offline|failed to fetch|networkerror|network request failed|load failed|typeerror|referenceerror|is not a function|cannot read propert|of undefined|of null|is not valid json|unexpected token|status code|ECONN|ETIMEDOUT/i;
const OFFLINE = /client is offline|failed to fetch|networkerror|network request failed|load failed|ECONN|ETIMEDOUT/i;

/** A learner-friendly message for any error, or `fallback` when the error says nothing useful. */
export function friendlyError(problem: unknown, fallback: string): string {
  const code = typeof (problem as { code?: unknown })?.code === 'string' ? (problem as { code: string }).code : '';
  if (code && BY_CODE[code]) return BY_CODE[code];
  const message = problem instanceof Error ? problem.message : typeof problem === 'string' ? problem : '';
  if (!message) return fallback;
  if (OFFLINE.test(message)) return BY_CODE.unavailable;
  if (code || TECHNICAL.test(message)) return fallback;
  return message;
}

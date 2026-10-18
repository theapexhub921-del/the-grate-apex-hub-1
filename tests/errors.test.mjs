// Learners never see raw Firebase or network errors (lib/errors.ts).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { friendlyError } from '../src/lib/errors.ts';

const FALLBACK = 'That did not work. Please try again.';

test('Firebase errors become plain English', () => {
  const denied = Object.assign(new Error('FirebaseError: Missing or insufficient permissions.'), { code: 'permission-denied' });
  assert.equal(friendlyError(denied, FALLBACK), 'You do not have permission to do that.');
  const odd = Object.assign(new Error('Firebase: Error (auth/something-new).'), { code: 'auth/something-new' });
  assert.equal(friendlyError(odd, FALLBACK), FALLBACK);
});

test('being offline is explained', () => {
  assert.match(friendlyError(new Error('Failed to get document because the client is offline.'), FALLBACK), /No connection/);
  assert.match(friendlyError(new TypeError('Failed to fetch'), FALLBACK), /No connection/);
});

test('programming errors are never shown', () => {
  assert.equal(friendlyError(new TypeError("Cannot read properties of undefined (reading 'uid')"), FALLBACK), FALLBACK);
  assert.equal(friendlyError(undefined, FALLBACK), FALLBACK);
  assert.equal(friendlyError({}, FALLBACK), FALLBACK);
});

test("the app's own messages are kept", () => {
  assert.equal(friendlyError(new Error('Insufficient coins.'), FALLBACK), 'Insufficient coins.');
  assert.equal(friendlyError(new Error('Messages can be up to 500 characters.'), FALLBACK), 'Messages can be up to 500 characters.');
  assert.equal(friendlyError(new Error('That username is taken.'), FALLBACK), 'That username is taken.');
});

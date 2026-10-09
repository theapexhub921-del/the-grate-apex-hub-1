// Sign-in identifiers: an email, or a username from the original app.
// Run with: npm test
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const {
  cleanUsername,
  legacyLoginEmail,
  loginFromRegistry,
  parseLoginIdentifier,
} = await import('@/lib/login-identifier');

describe('sign-in identifiers', () => {
  it('uses an email exactly as typed (trimmed)', () => {
    assert.deepEqual(parseLoginIdentifier('  Amara@Example.com '), { kind: 'email', email: 'Amara@Example.com' });
    // A legacy hidden login typed in full is still an email: never doubled up.
    assert.deepEqual(parseLoginIdentifier('kofi_a@grateapex.app'), { kind: 'email', email: 'kofi_a@grateapex.app' });
  });

  it('treats anything without "@" as a username, cleaned like the old app', () => {
    assert.deepEqual(parseLoginIdentifier('  King_Kube '), { kind: 'username', username: 'king_kube' });
    assert.equal(cleanUsername(' Kofi_A '), 'kofi_a');
  });

  it('builds the legacy hidden email', () => {
    assert.equal(legacyLoginEmail('king_kube'), 'king_kube@grateapex.app');
  });

  it('follows a renamed account to its original login', () => {
    assert.equal(loginFromRegistry('new_name', { uid: 'u1', login: 'old_name' }), 'old_name');
  });

  it('uses the name itself when the registry gives no login', () => {
    assert.equal(loginFromRegistry('kofi_a', { uid: 'u1' }), 'kofi_a');
    assert.equal(loginFromRegistry('kofi_a', { uid: 'u1', login: '' }), 'kofi_a');
    assert.equal(loginFromRegistry('kofi_a', { uid: 'u1', login: 42 }), 'kofi_a');
    assert.equal(loginFromRegistry('kofi_a', undefined), 'kofi_a');
  });
});

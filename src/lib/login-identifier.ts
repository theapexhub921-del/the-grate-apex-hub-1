// Sign-in accepts an email address or a username.
//
// Accounts from the original GRATEAPEX app have no real email: the username
// "kofi_a" was turned into the hidden login "kofi_a@grateapex.app" (old app:
// src/config.ts and src/auth.tsx). Those accounts keep their uid, password and
// data; only this conversion is needed to sign them in.
//
// Kept free of Firebase imports so it can be tested directly (npm test).

export const LEGACY_USERNAME_DOMAIN = 'grateapex.app';

export type LoginIdentifier =
  | { kind: 'email'; email: string }
  | { kind: 'username'; username: string };

// The old app's rule: usernames are trimmed and lowercased.
export function cleanUsername(raw: string) {
  return raw.trim().toLowerCase();
}

// Anything with an "@" is used as an email exactly as typed (trimmed);
// everything else is treated as a username.
export function parseLoginIdentifier(raw: string): LoginIdentifier {
  const text = raw.trim();
  if (text.includes('@')) return { kind: 'email', email: text };
  return { kind: 'username', username: cleanUsername(text) };
}

// The hidden email a legacy password account signs in with.
export function legacyLoginEmail(login: string) {
  return `${login}@${LEGACY_USERNAME_DOMAIN}`;
}

// A renamed account still signs in with its original hidden email: its
// usernames/{name} entry says which one ("login"). Entries without a login
// (Google accounts, or names that were never renamed) use the name itself.
export function loginFromRegistry(username: string, entry: unknown): string {
  const login = (entry as { login?: unknown } | null | undefined)?.login;
  return typeof login === 'string' && login.trim() !== '' ? login : username;
}

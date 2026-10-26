// Reading leagues from Firestore on the server with the service account (api/leagues.mjs
// settles the week; api/league.mjs serves the league table). Files starting with "_" are not routes.

export const DB = 'projects/grate-apex/databases/(default)/documents';

export function plain(value) {
  if (!value || typeof value !== 'object') return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(plain);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, item]) => [key, plain(item)]));
  return undefined;
}

export function encode(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, encode(item)])) } };
}

export const idOf = (doc) => String(doc.name).split('/').pop();

/** Talks to Firestore with the service account (or the local emulator in checks). */
export function firestore(token) {
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const base = emulator ? `http://${emulator}/v1/${DB}` : `https://firestore.googleapis.com/v1/${DB}`;
  return async (path, body) => {
    const response = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${emulator ? 'owner' : token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Firestore ${path} failed (${response.status}): ${(await response.text()).slice(0, 200)}`);
    return response.json();
  };
}

/** Learners whose league entry has `field` == week, with the entry and when the document last changed. */
export async function usersWhere(call, field, week) {
  const rows = await call(':runQuery', {
    structuredQuery: {
      from: [{ collectionId: 'users' }],
      where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value: { stringValue: week } } },
      select: { fields: [{ fieldPath: 'league' }] },
    },
  });
  return rows.filter((row) => row.document).map((row) => ({ id: idOf(row.document), updateTime: row.document.updateTime, league: plain(row.document.fields?.league) ?? {} }));
}

/** Lifetime XP from the shared leaderboard (scores/{uid}.xp), 100 at a time. */
export async function lifetimeXp(call, ids) {
  const out = new Map();
  for (let i = 0; i < ids.length; i += 100) {
    const rows = await call(':batchGet', { documents: ids.slice(i, i + 100).map((id) => `${DB}/scores/${id}`), mask: { fieldPaths: ['xp'] } });
    for (const row of rows) if (row.found) out.set(idOf(row.found), Number(plain(row.found.fields?.xp)) || 0);
  }
  return out;
}

/**
 * Everyone in one tier of one week, with their weekly XP, the way the app counts it
 * (src/data/leagues.ts tierRows): the weekly figure each learner's app saved, or —
 * when there is none yet — leaderboard XP minus the week's start point. Learners who
 * already moved on from that week count with the figure they finished with.
 * Returns [{ userId, username, weeklyXp }].
 */
export async function tierTable(call, week, tier) {
  const both = (prefix) => call(':runQuery', {
    structuredQuery: {
      from: [{ collectionId: 'users' }],
      where: { compositeFilter: { op: 'AND', filters: [
        { fieldFilter: { field: { fieldPath: `${prefix}.week` }, op: 'EQUAL', value: { stringValue: week } } },
        { fieldFilter: { field: { fieldPath: `${prefix}.tier` }, op: 'EQUAL', value: { integerValue: String(tier) } } },
      ] } },
      select: { fields: [{ fieldPath: 'league' }, { fieldPath: 'username' }] },
      limit: 200,
    },
  });
  const [current, moved] = await Promise.all([both('league'), both('league.prev')]);
  const people = (rows) => rows.filter((row) => row.document).map((row) => ({ id: idOf(row.document), username: plain(row.document.fields?.username) ?? null, league: plain(row.document.fields?.league) ?? {} }));
  const live = people(current);
  const xp = await lifetimeXp(call, live.filter((person) => typeof person.league.weeklyXp !== 'number').map((person) => person.id));
  const rows = new Map();
  for (const person of live) {
    const entry = person.league;
    const trusted = Number(entry.startXp) > 0 || typeof entry.weeklyXp === 'number';
    const weeklyXp = typeof entry.weeklyXp === 'number' ? Math.max(0, entry.weeklyXp) : trusted ? Math.max(0, (xp.get(person.id) ?? 0) - (Number(entry.startXp) || 0)) : 0;
    rows.set(person.id, { userId: person.id, username: person.username, weeklyXp });
  }
  for (const person of people(moved)) {
    if (!rows.has(person.id)) rows.set(person.id, { userId: person.id, username: person.username, weeklyXp: Math.max(0, Number(person.league.prev?.weeklyXp) || 0) });
  }
  return [...rows.values()];
}

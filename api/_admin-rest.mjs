// The few Firebase admin calls server/account-deletion.mjs needs, made with plain
// web requests and the service account (like api/push.mjs and api/reminders.mjs),
// in the same shape as the firebase-admin SDK. firebase-admin itself would not
// load on Vercel (FUNCTION_INVOCATION_FAILED, 2026-10-25). Files starting with
// "_" are not routes.
//
// Local checks: with FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST set
// (never on Vercel) it talks to the emulators instead, and reads sign-in tokens
// without a signature, as the emulators make them and as firebase-admin does there.
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';

import { adminToken, DATASTORE_SCOPE, serviceAccount } from './_admin.mjs';

const KEYS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const AUTH_SCOPE = 'https://www.googleapis.com/auth/identitytoolkit';

class FieldValueSentinel {
  constructor(kind, value) {
    this.kind = kind;
    this.value = value;
  }
}
export const FieldValue = {
  increment: (n) => new FieldValueSentinel('increment', n),
  arrayRemove: (...values) => new FieldValueSentinel('arrayRemove', values),
  delete: () => new FieldValueSentinel('delete'),
};

function encode(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encode(v)])) } };
}

function decode(value) {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decode);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([k, v]) => [k, decode(v)]));
  return null;
}

/** A field path for Firestore: segments that are not plain names are quoted. */
const fieldPath = (path) => path.split('.').map((part) => (/^[A-Za-z_][A-Za-z_0-9]*$/.test(part) ? part : `\`${part.replace(/[`\\]/g, '\\$&')}\``)).join('.');

/** An admin `{ auth, db, FieldValue }` for the project, or null without a service account. */
export function restAdmin() {
  const emulatorFirestore = process.env.FIRESTORE_EMULATOR_HOST;
  const emulatorAuth = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const account = serviceAccount();
  if (!account && !emulatorFirestore) return null;
  const project = account?.project_id || 'grate-apex';
  const root = `projects/${project}/databases/(default)/documents`;
  const firestoreBase = emulatorFirestore ? `http://${emulatorFirestore}/v1` : 'https://firestore.googleapis.com/v1';
  const authBase = emulatorAuth ? `http://${emulatorAuth}/identitytoolkit.googleapis.com/v1` : 'https://identitytoolkit.googleapis.com/v1';
  const bearer = async (scope) => (emulatorFirestore ? 'owner' : adminToken(account, scope));

  async function call(url, { method = 'GET', body, scope = DATASTORE_SCOPE, allow404 = false } = {}) {
    const response = await fetch(url, {
      method,
      headers: { authorization: `Bearer ${await bearer(scope)}`, 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (allow404 && response.status === 404) return null;
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      const error = new Error(data?.error?.message || `${method} ${url} failed (${response.status})`);
      error.code = data?.error?.status === 'FAILED_PRECONDITION' || data?.error?.status === 'ALREADY_EXISTS' || data?.error?.status === 'ABORTED' ? 9 : data?.error?.status;
      throw error;
    }
    return data;
  }

  const docUrl = (path) => `${firestoreBase}/${root}/${path}`;

  function docRef(path) {
    const parts = path.split('/');
    return {
      id: parts[parts.length - 1],
      path,
      get parent() {
        return collectionRef(parts.slice(0, -1).join('/'));
      },
      collection: (id) => collectionRef(`${path}/${id}`),
      async get() {
        const data = await call(docUrl(path), { allow404: true });
        return { exists: Boolean(data), id: parts[parts.length - 1], ref: docRef(path), updateTime: data?.updateTime ?? null, data: () => (data ? decode({ mapValue: { fields: data.fields ?? {} } }) : undefined) };
      },
      /**
       * Writes the whole document. `precondition` makes it safe when two requests race:
       * { exists: false } only creates, { updateTime } only replaces the version that was
       * read. A lost race throws an error with code 9 (FAILED_PRECONDITION), so the caller
       * can read again and retry. (Used by api/battle.mjs.)
       */
      async set(data, precondition) {
        const fields = encode(data).mapValue.fields;
        const write = { update: { name: `${root}/${path}`, fields } };
        if (precondition?.updateTime) write.currentDocument = { updateTime: precondition.updateTime };
        else if (precondition && 'exists' in precondition) write.currentDocument = { exists: Boolean(precondition.exists) };
        await call(`${firestoreBase}/${root}:commit`, { method: 'POST', body: { writes: [write] } });
      },
      async delete() {
        await call(docUrl(path), { method: 'DELETE' });
      },
      async update(changes) {
        const fields = {};
        const mask = [];
        const transforms = [];
        for (const [key, value] of Object.entries(changes)) {
          if (value instanceof FieldValueSentinel) {
            if (value.kind === 'delete') mask.push(fieldPath(key));
            else if (value.kind === 'increment') transforms.push({ fieldPath: fieldPath(key), increment: encode(value.value) });
            else if (value.kind === 'arrayRemove') transforms.push({ fieldPath: fieldPath(key), removeAllFromArray: { values: value.value.map(encode) } });
          } else {
            mask.push(fieldPath(key));
            setPath(fields, key.split('.'), encode(value));
          }
        }
        await call(`${firestoreBase}/${root}:commit`, {
          method: 'POST',
          body: {
            writes: [{
              update: { name: `${root}/${path}`, fields },
              updateMask: { fieldPaths: mask },
              updateTransforms: transforms,
              currentDocument: { exists: true },
            }],
          },
        });
      },
    };
  }

  function collectionRef(path) {
    const parts = path.split('/');
    const id = parts[parts.length - 1];
    return {
      id,
      path,
      get parent() {
        return parts.length > 1 ? docRef(parts.slice(0, -1).join('/')) : null;
      },
      where: (field, op, value) => query(parts.length > 1 ? `${root}/${parts.slice(0, -1).join('/')}` : root, id, false, field, op, value),
    };
  }

  function query(parent, collectionId, allDescendants, field, op, value) {
    return {
      async get() {
        const rows = await call(`${firestoreBase}/${parent}:runQuery`, {
          method: 'POST',
          body: {
            structuredQuery: {
              from: [{ collectionId, allDescendants }],
              where: { fieldFilter: { field: { fieldPath: fieldPath(field) }, op: op === 'array-contains' ? 'ARRAY_CONTAINS' : 'EQUAL', value: encode(value) } },
            },
          },
        });
        const docs = (Array.isArray(rows) ? rows : []).filter((row) => row.document).map((row) => {
          const path = row.document.name.slice(root.length + 1);
          const fields = row.document.fields ?? {};
          return { id: path.split('/').pop(), ref: docRef(path), exists: true, data: () => decode({ mapValue: { fields } }) };
        });
        return { docs };
      },
    };
  }

  async function recursiveDelete(ref) {
    let pageToken;
    do {
      const page = await call(`${docUrl(ref.path)}:listCollectionIds`, { method: 'POST', body: { pageSize: 100, pageToken } });
      for (const collectionId of page.collectionIds ?? []) {
        let docsToken;
        do {
          const params = new URLSearchParams({ pageSize: '300', showMissing: 'true' });
          if (docsToken) params.set('pageToken', docsToken);
          const list = await call(`${docUrl(`${ref.path}/${collectionId}`)}?${params}`);
          for (const item of list.documents ?? []) await recursiveDelete(docRef(item.name.slice(root.length + 1)));
          docsToken = list.nextPageToken;
        } while (docsToken);
      }
      pageToken = page.nextPageToken;
    } while (pageToken);
    await call(docUrl(ref.path), { method: 'DELETE' });
  }

  const db = {
    doc: docRef,
    collection: collectionRef,
    collectionGroup: (id) => ({ where: (field, op, value) => query(root, id, true, field, op, value) }),
    recursiveDelete,
  };

  const auth = {
    async verifyIdToken(token) {
      if (emulatorAuth) {
        const payload = decodeJwt(token);
        return { ...payload, uid: payload.user_id ?? payload.sub };
      }
      const { payload } = await jwtVerify(token, KEYS, { issuer: `https://securetoken.google.com/${project}`, audience: project });
      if (!payload.sub) throw new Error('No user in the token.');
      return { ...payload, uid: payload.sub };
    },
    async deleteUser(uid) {
      try {
        await call(`${authBase}/projects/${project}/accounts:delete`, { method: 'POST', body: { localId: uid }, scope: AUTH_SCOPE });
      } catch (error) {
        if (/USER_NOT_FOUND/.test(String(error?.message))) {
          error.code = 'auth/user-not-found';
        }
        throw error;
      }
    },
  };

  return { auth, db, FieldValue };
}

function setPath(target, parts, value) {
  const [head, ...rest] = parts;
  if (!rest.length) {
    target[head] = value;
    return;
  }
  target[head] = target[head] ?? { mapValue: { fields: {} } };
  setPath(target[head].mapValue.fields, rest, value);
}

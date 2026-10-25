// Apex Coins rules (firestore.rules → coinLog, coinsChangeOk), checked as signed-in learners on the
// LOCAL emulators: start them with this repo's firestore.rules (auth 9099, firestore 8085), then
// node tests/rules/coins.rules-test.mjs. Every line should say PASS (2026-10-25: 17 of 17).
const PROJECT = 'grate-apex';
const BASE = `http://127.0.0.1:8085/v1/projects/${PROJECT}/databases/(default)/documents`;
const AUTH = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1';
const owner = { authorization: 'Bearer owner', 'content-type': 'application/json' };

async function learner(email, username) {
  let r = await fetch(`${AUTH}/accounts:signUp?key=x`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'secret123!', returnSecureToken: true }) }).then((x) => x.json());
  if (!r.idToken) r = await fetch(`${AUTH}/accounts:signInWithPassword?key=x`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'secret123!', returnSecureToken: true }) }).then((x) => x.json());
  await fetch(`${BASE}/users/${r.localId}`, { method: 'PATCH', headers: owner, body: JSON.stringify({ fields: { username: { stringValue: username }, coins: { integerValue: '200' } } }) });
  return { uid: r.localId, token: r.idToken };
}
const docName = (path) => `projects/${PROJECT}/databases/(default)/documents/${path}`;
const int = (n) => ({ integerValue: String(n) });
const str = (s) => ({ stringValue: s });

// One atomic commit, as the learner. writes: [{ path, fields, mask?, now?: [field] }]
async function commit(user, writes) {
  const body = {
    writes: writes.map((w) => ({
      update: { name: docName(w.path), fields: w.fields },
      ...(w.mask ? { updateMask: { fieldPaths: w.mask } } : {}),
      ...(w.now ? { updateTransforms: w.now.map((fieldPath) => ({ fieldPath, setToServerValue: 'REQUEST_TIME' })) } : {}),
    })),
  };
  const res = await fetch(`${BASE}:commit`, { method: 'POST', headers: { authorization: `Bearer ${user.token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return res.ok ? 'allowed' : `denied (${res.status})`;
}
const coinsWrite = (u, coins, entry) => ({ path: `users/${u.uid}`, fields: { coins: int(coins), ...(entry ? { coinEntry: str(entry) } : {}) }, mask: entry ? ['coins', 'coinEntry'] : ['coins'] });
const logWrite = (u, kind, ref, amount) => ({ path: `users/${u.uid}/coinLog/${kind}_${ref}`, fields: { kind: str(kind), ref: str(ref), amount: int(amount) }, now: ['at'] });

const a = await learner('coin_a@test.com', 'coin_a');
const results = [];
const check = async (name, expected, writes) => { const got = await commit(a, writes); results.push(`${got.startsWith(expected) ? 'PASS' : 'FAIL'}  ${name}: ${got} (expected ${expected})`); };

await check('set own coins to 1,000,000 directly', 'denied', [coinsWrite(a, 1000000)]);
await check('spend: balance goes down', 'allowed', [coinsWrite(a, 150)]);
await check('presence-style write, coins untouched', 'allowed', [{ path: `users/${a.uid}`, fields: { isOnline: { booleanValue: true } }, mask: ['isOnline'] }]);
await check('lesson reward +10 with its completion', 'allowed', [
  { path: `progress/${a.uid}/completions/upper-limb-1`, fields: { lessonId: str('upper-limb-1'), completedAt: int(Date.now()), xp: int(50) }, now: ['savedAt'] },
  logWrite(a, 'lesson', 'upper-limb-1', 10), coinsWrite(a, 160, 'lesson_upper-limb-1'),
]);
await check('the same lesson reward again', 'denied', [logWrite(a, 'lesson', 'upper-limb-1', 10), coinsWrite(a, 170, 'lesson_upper-limb-1')]);
await check('lesson reward of +500', 'denied', [
  { path: `progress/${a.uid}/completions/upper-limb-2`, fields: { lessonId: str('upper-limb-2'), completedAt: int(Date.now()), xp: int(50) }, now: ['savedAt'] },
  logWrite(a, 'lesson', 'upper-limb-2', 500), coinsWrite(a, 660, 'lesson_upper-limb-2'),
]);
await check('balance up by more than the entry', 'denied', [
  { path: `progress/${a.uid}/completions/upper-limb-3`, fields: { lessonId: str('upper-limb-3'), completedAt: int(Date.now()), xp: int(50) }, now: ['savedAt'] },
  logWrite(a, 'lesson', 'upper-limb-3', 10), coinsWrite(a, 999, 'lesson_upper-limb-3'),
]);
await check('Apex reward without an Apex attempt', 'denied', [logWrite(a, 'apex', '11111111-1111-1111-1111-111111111111', 10), coinsWrite(a, 170, 'apex_11111111-1111-1111-1111-111111111111')]);
await check('a made-up gift', 'denied', [logWrite(a, 'gift', 'nogift', 500), coinsWrite(a, 660, 'gift_nogift')]);
await check('a refund with no payment', 'denied', [logWrite(a, 'refund', 'r9', 100), coinsWrite(a, 260, 'refund_r9')]);
await check('pay 100 (spend entry)', 'allowed', [logWrite(a, 'spend', 'r1', 100), coinsWrite(a, 60)]);
await check('refund that payment', 'allowed', [logWrite(a, 'refund', 'r1', 100), coinsWrite(a, 160, 'refund_r1')]);
await check('refund it twice', 'denied', [logWrite(a, 'refund', 'r1', 100), coinsWrite(a, 260, 'refund_r1')]);
await check('a spend entry without paying', 'denied', [logWrite(a, 'spend', 'r2', 1000)]);

// Gifts between two learners who follow each other.
const b = await learner('coin_b@test.com', 'coin_b');
for (const [x, y] of [[a, b], [b, a]]) await fetch(`${BASE}/follows/${x.uid}_${y.uid}`, { method: 'PATCH', headers: owner, body: JSON.stringify({ fields: { follower: str(x.uid), followee: str(y.uid) } }) });
await check('send a gift of 50 to a friend', 'allowed', [
  { path: `coinTransfers/g1`, fields: { from: str(a.uid), to: str(b.uid), amount: int(50), status: str('pending') }, now: ['createdAt'] },
  coinsWrite(a, 110),
]);
const giftResults = [];
const asB = async (name, expected, writes) => { const got = await commit(b, writes); giftResults.push(`${got.startsWith(expected) ? 'PASS' : 'FAIL'}  ${name}: ${got} (expected ${expected})`); };
await asB('friend claims the gift (+50)', 'allowed', [
  { path: `coinTransfers/g1`, fields: { status: str('claimed') }, mask: ['status', 'claimedAt'], now: ['claimedAt'] },
  logWrite(b, 'gift', 'g1', 50), coinsWrite(b, 250, 'gift_g1'),
]);
await asB('claims it again', 'denied', [logWrite(b, 'gift', 'g1', 50), coinsWrite(b, 300, 'gift_g1')]);
console.log([...results, ...giftResults].join('\n'));

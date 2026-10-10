// Firestore rules tests (emulator only). Not part of npm test: they need Java
// and firebase-tools. Run from a folder with firebase.json (emulators.firestore):
//   PROPOSED_RULES=firestore.rules BASELINE_RULES=<deployed copy> DEPS=<folder with
//   @firebase/rules-unit-testing + firebase installed> \
//   firebase emulators:exec --only firestore --project demo-grateapex "node --test tests/rules/attempts.rules-test.cjs"
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { after, before, beforeEach, describe, it } = require('node:test');

const req = createRequire(path.join(process.env.DEPS, 'package.json'));
const { initializeTestEnvironment, assertFails, assertSucceeds } = req('@firebase/rules-unit-testing');
const { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } = req('firebase/firestore');

const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
const ALICE = 'alice';
const BOB = 'bob';
const ID = '3f2b8c1e-9a4d-4e6f-8b2a-1c5d7e9f0a3b';

function attempt(overrides = {}) {
  return {
    id: ID,
    userId: ALICE,
    attemptType: 'lesson',
    courseId: 'biochemistry',
    lessonId: 'blood-coagulation-and-fibrinolysis-1',
    score: 18,
    total: 25,
    percentage: 72,
    timeSeconds: 410.5,
    wrongConcepts: ['factor-viii'],
    wrongQuestionIds: ['q1-3'],
    practice: false,
    completedAt: 1791591792619,
    savedAt: serverTimestamp(),
    ...overrides,
  };
}
const without = (key) => { const a = attempt(); delete a[key]; return a; };

async function environment(rulesFile, projectId) {
  return initializeTestEnvironment({ projectId, firestore: { rules: fs.readFileSync(rulesFile, 'utf8'), host, port: Number(port) } });
}

describe('proposed rules: progress/{uid}/attempts', () => {
  let env;
  const db = (uid) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();
  const ref = (uid, owner = ALICE, id = ID) => doc(db(uid), 'progress', owner, 'attempts', id);
  const seed = () => env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), 'progress', ALICE, 'attempts', ID), { ...attempt(), savedAt: new Date() }));

  before(async () => { env = await environment(process.env.PROPOSED_RULES, 'demo-grateapex-proposed'); });
  beforeEach(async () => { await env.clearFirestore(); });
  after(async () => { await env.cleanup(); });

  it('ALLOW owner creates a valid attempt', async () => { await assertSucceeds(setDoc(ref(ALICE), attempt())); });
  it('ALLOW owner reads an own attempt', async () => { await seed(); await assertSucceeds(getDoc(ref(ALICE))); });
  it('ALLOW owner lists own attempts (newest first)', async () => {
    await seed();
    await assertSucceeds(getDocs(query(collection(db(ALICE), 'progress', ALICE, 'attempts'), orderBy('completedAt', 'desc'), limit(200))));
  });
  it('ALLOW owner deletes an own attempt (reset / account deletion)', async () => { await seed(); await assertSucceeds(deleteDoc(ref(ALICE))); });
  it('ALLOW optional course and lesson ids may be null', async () => { await assertSucceeds(setDoc(ref(ALICE), attempt({ courseId: null, lessonId: null, attemptType: 'apex_challenge', total: 30, score: 30, percentage: 100 }))); });

  it('DENY sending the same attempt again (no duplicate, no overwrite)', async () => { await seed(); await assertFails(setDoc(ref(ALICE), attempt({ score: 25, percentage: 100 }))); });
  it('DENY editing an attempt', async () => { await seed(); await assertFails(updateDoc(ref(ALICE), { score: 25 })); });
  it('DENY another student reading my attempt', async () => { await seed(); await assertFails(getDoc(ref(BOB))); });
  it('DENY another student listing my attempts', async () => { await seed(); await assertFails(getDocs(collection(db(BOB), 'progress', ALICE, 'attempts'))); });
  it('DENY another student writing into my attempts', async () => { await assertFails(setDoc(ref(BOB), attempt())); });
  it('DENY another student deleting my attempt', async () => { await seed(); await assertFails(deleteDoc(ref(BOB))); });
  it('DENY signed-out read', async () => { await seed(); await assertFails(getDoc(ref(null))); });
  it('DENY signed-out create', async () => { await assertFails(setDoc(ref(null), attempt())); });
  it('DENY an extra field (e.g. xp)', async () => { await assertFails(setDoc(ref(ALICE), attempt({ xp: 500 }))); });
  it('DENY a missing field', async () => { await assertFails(setDoc(ref(ALICE), without('wrongQuestionIds'))); });
  it('DENY id in the data different from the document id', async () => { await assertFails(setDoc(ref(ALICE), attempt({ id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee' }))); });
  it('DENY userId of another student', async () => { await assertFails(setDoc(ref(ALICE), attempt({ userId: BOB }))); });
  it('DENY a document id that is not a UUID', async () => { await assertFails(setDoc(ref(ALICE, ALICE, 'attempt-1'), attempt({ id: 'attempt-1' }))); });
  it('DENY score above total', async () => { await assertFails(setDoc(ref(ALICE), attempt({ score: 26 }))); });
  it('DENY total of 0', async () => { await assertFails(setDoc(ref(ALICE), attempt({ total: 0, score: 0 }))); });
  it('DENY total above 100', async () => { await assertFails(setDoc(ref(ALICE), attempt({ total: 101, score: 50 }))); });
  it('DENY percentage above 100', async () => { await assertFails(setDoc(ref(ALICE), attempt({ percentage: 101 }))); });
  it('DENY negative time', async () => { await assertFails(setDoc(ref(ALICE), attempt({ timeSeconds: -1 }))); });
  it('DENY unknown attempt type', async () => { await assertFails(setDoc(ref(ALICE), attempt({ attemptType: 'bonus' }))); });
  it('DENY a client-chosen savedAt instead of server time', async () => { await assertFails(setDoc(ref(ALICE), attempt({ savedAt: 1791591792619 }))); });
  it('DENY practice that is not true/false', async () => { await assertFails(setDoc(ref(ALICE), attempt({ practice: 'no' }))); });
  it('DENY a decimal score', async () => { await assertFails(setDoc(ref(ALICE), attempt({ score: 18.5 }))); });

  // Everything else must behave exactly as before.
  it('UNCHANGED owner still reads and writes progress/{uid}', async () => {
    await assertSucceeds(setDoc(doc(db(ALICE), 'progress', ALICE), { xp: 10, lessons: { 'biolchem-1': 3 } }));
    await assertSucceeds(getDoc(doc(db(ALICE), 'progress', ALICE)));
  });
  it('UNCHANGED another student still cannot read progress/{uid}', async () => { await assertFails(getDoc(doc(db(BOB), 'progress', ALICE))); });
  it('UNCHANGED other subcollections of progress/{uid} stay closed', async () => { await assertFails(setDoc(doc(db(ALICE), 'progress', ALICE, 'other', 'x'), { a: 1 })); });
  it('UNCHANGED an attempt at scores/{attemptId} is still refused', async () => { await assertFails(setDoc(doc(db(ALICE), 'scores', ID), attempt())); });
  it('UNCHANGED scores/{uid} accepts only the leaderboard summary', async () => {
    await env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), 'users', ALICE), { username: 'alice_a' }));
    await assertSucceeds(setDoc(doc(db(ALICE), 'scores', ALICE), { username: 'alice_a', xp: 120, level: 2 }));
    await assertFails(setDoc(doc(db(ALICE), 'scores', ALICE), { username: 'alice_a', xp: 120, attemptType: 'lesson', score: 18 }));
  });
});

describe('deployed rules today (baseline)', () => {
  let env;
  before(async () => { env = await environment(process.env.BASELINE_RULES, 'demo-grateapex-baseline'); });
  after(async () => { await env.cleanup(); });

  it('DENY today: the attempts path is closed until the new rule is deployed', async () => {
    await assertFails(setDoc(doc(env.authenticatedContext(ALICE).firestore(), 'progress', ALICE, 'attempts', ID), attempt()));
  });
  it('DENY today: the current app\'s write to scores/{attemptId}', async () => {
    await assertFails(setDoc(doc(env.authenticatedContext(ALICE).firestore(), 'scores', ID), { ...attempt(), userId: ALICE }));
  });
});

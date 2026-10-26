// The XP battle referee (api/battle.mjs runs it on Vercel). The app never writes a
// score: it sends each tap here, this marks it against answers only the server holds,
// and writes the room that both players watch. So nobody can fake a score.
//
// Firestore (written only with the service account; firestore.rules lets the two
// players read their room and everyone signed in read battle records):
//   battleRooms/{id}   the room: players, questions (no answers), both players' live
//                      progress and score, the result (answers revealed once it is over)
//   battleKeys/{id}    the answers, never readable by the app
//   battleStats/{uid}  a player's record, battle points, tier and last 15 battles
//
// Everything here goes through a small `store` (tests pass an in-memory one) and
// `loadBank` (the course's public/battle-bank file), so the whole referee is tested
// by tests/battle-race.test.mjs without a network.
import {
  accept, addToStats, answer, BattleError, COUNTS, decline, DIFFICULTIES, leave, newRoom, pickQuestions, publicRoom, ready, settle, tierFor,
} from '../api/_battle-rules.mjs';

export { BattleError };

const ID = /^r[a-z0-9]{8,24}$/;
const USER = /^[A-Za-z0-9]{6,64}$/;
const COURSE = /^[a-z0-9-]{2,40}$/;
const TOPIC = /^[A-Za-z0-9 &:,.'()/+-]{1,80}$/;
const ATTEMPTS = 4;

const text = (value, max) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');

function roomId(now) {
  return `r${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Reads a room, applies `change` (which may throw a BattleError) and writes it back only
 * if nobody wrote it in between; on a lost race it reads again and retries. Returns the
 * room as saved and whatever `change` returned beside it.
 */
async function update(store, id, change) {
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const found = await store.getRoom(id);
    if (!found) throw new BattleError(404, 'This battle could not be found.');
    const outcome = await change(found.room);
    const next = outcome?.room ?? outcome;
    if (next === found.room) return { room: found.room, reply: outcome?.reply };
    try {
      await store.saveRoom(next, found.version);
      return { room: next, reply: outcome?.reply, before: found.room };
    } catch (error) {
      if (error?.code !== 9 || attempt === ATTEMPTS - 1) throw error;
    }
  }
  throw new BattleError(503, 'The battle is busy. Try again.');
}

/** The record and tier of both players, updated once a battle has just ended. */
async function recordResult(store, before, room) {
  if (room.status !== 'done' || before?.status === 'done') return;
  await Promise.all(room.players.map(async (uid) => {
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      const found = await store.getStats(uid);
      try {
        await store.saveStats(uid, addToStats(found?.stats, room, uid), found?.version ?? null);
        return;
      } catch (error) {
        if (error?.code !== 9 || attempt === ATTEMPTS - 1) throw error;
      }
    }
  }));
}

function checkCourse(course) {
  const kind = course?.kind === 'hb' ? 'hb' : null;
  const id = text(course?.id, 40);
  if (!kind || !COURSE.test(id)) throw new BattleError(400, 'Choose a course.');
  const topicIds = Array.isArray(course.topicIds) ? course.topicIds.map((item) => text(item, 80)).filter((item) => TOPIC.test(item)).slice(0, 120) : [];
  const topicNames = Array.isArray(course.topicNames) ? course.topicNames.map((item) => text(item, 80)).filter(Boolean).slice(0, 120) : [];
  return { kind, id, name: text(course.name, 60) || id, topicIds, topicNames };
}

/**
 * One request from a signed-in player: { action, ... }. Returns the JSON to send back.
 * Actions: create, accept, decline, ready, answer, leave, get, mine.
 */
export async function handleBattle({ uid, body, store, loadBank, now = () => Date.now() }) {
  const action = String(body?.action ?? '');

  if (action === 'create') {
    const opponentUid = text(body.opponent?.uid, 64);
    if (!USER.test(opponentUid)) throw new BattleError(400, 'Choose who to battle.');
    if (opponentUid === uid) throw new BattleError(400, 'Challenge someone else.');
    const count = Number(body.count);
    if (!COUNTS.includes(count)) throw new BattleError(400, 'Choose 10, 20 or 30 questions.');
    const difficulty = DIFFICULTIES.includes(body.difficulty) ? body.difficulty : 'mixed';
    const course = checkCourse(body.course);
    const bank = await loadBank(course.id);
    if (!bank) throw new BattleError(404, 'This course has no battle questions yet.');
    const at = now();
    const id = roomId(at);
    const { questions, answers, note } = pickQuestions(bank, { topicIds: course.topicIds, difficulty, count, seed: id });
    const [mine, theirs] = await Promise.all([store.getStats(uid), store.getStats(opponentUid)]);
    const tiers = { [uid]: tierFor(mine?.stats?.points ?? 0).id, [opponentUid]: tierFor(theirs?.stats?.points ?? 0).id };
    const room = newRoom({
      id,
      now: at,
      challenger: { uid, name: text(body.name, 40) || null },
      opponent: { uid: opponentUid, name: text(body.opponent?.name, 40) || null },
      course: { ...course, name: text(bank.name, 60) || course.name },
      count,
      difficulty,
      questions,
      note,
      tiers,
      rematchOf: ID.test(String(body.rematchOf ?? '')) ? body.rematchOf : null,
    });
    await store.createRoom(room, { answers, expiresAt: at + 60 * 60_000 });
    if (room.rematchOf) {
      // Point the old room at the new one so the other player is taken to the rematch.
      await update(store, room.rematchOf, (old) => (old.players.includes(uid) && old.players.includes(opponentUid) && !old.rematch ? { ...old, rematch: id } : old)).catch(() => undefined);
    }
    await store.notify?.(opponentUid, { from: uid, fromName: room.challenger.name ?? '', roomId: id, course: room.course.name, count, difficulty }).catch(() => undefined);
    return { room: publicRoom(room), now: at };
  }

  if (action === 'mine') {
    const [rooms, stats] = await Promise.all([store.openRooms(uid), store.getStats(uid)]);
    const at = now();
    const fresh = rooms.map((room) => settle(room, at)).filter((room) => room.open);
    return { rooms: fresh.map(publicRoom), stats: stats?.stats ?? null, now: at };
  }

  const id = String(body?.id ?? '');
  if (!ID.test(id)) throw new BattleError(400, 'Bad battle.');
  // Answers are needed to mark an answer and to reveal them at the end.
  let answers = null;
  const key = async () => (answers ??= (await store.getKey(id))?.answers ?? null);

  if (action === 'get') {
    const found = await store.getRoom(id);
    if (!found || !found.room.players.includes(uid)) throw new BattleError(404, 'This battle could not be found.');
    const at = now();
    const settled = settle(found.room, at, found.room.status === 'live' ? await key() : null);
    if (settled !== found.room) {
      const saved = await update(store, id, async (room) => settle(room, now(), room.status === 'live' ? await key() : null));
      await recordResult(store, saved.before, saved.room);
      return { room: publicRoom(saved.room), now: now() };
    }
    return { room: publicRoom(found.room), now: at };
  }

  const steps = {
    accept: (room, at) => accept(room, uid, at),
    decline: (room, at) => decline(room, uid, at),
    ready: (room, at) => ready(room, uid, at),
    leave: async (room, at) => leave(room, uid, at, await key()),
    answer: async (room, at) => {
      const pick = body.pick === 'skip' ? 'skip' : Number(body.pick);
      const answersNow = await key();
      if (!answersNow) throw new BattleError(500, 'The answers for this battle are missing.');
      return answer(room, uid, { index: Number(body.index), pick }, at, answersNow);
    },
  };
  const step = steps[action];
  if (!step) throw new BattleError(400, 'Unknown action.');
  const saved = await update(store, id, async (room) => {
    if (!room.players.includes(uid)) throw new BattleError(404, 'This battle could not be found.');
    const at = now();
    const current = settle(room, at, room.status === 'live' ? await key() : null);
    const outcome = await step(current, at);
    // A step that changes nothing still saves what settle() changed.
    if ((outcome?.room ?? outcome) === current && current !== room) return current;
    return outcome;
  });
  await recordResult(store, saved.before, saved.room);
  return { room: publicRoom(saved.room), result: saved.reply ?? null, now: now() };
}

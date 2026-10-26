// XP battle rules (owner, 2026-10-26). Pure: no network, no database, so
// tests/battle-race.test.mjs can play whole battles with them. The server
// (api/battle.mjs) is the only one that applies them; the app only shows the result.
//
//   - The challenger picks 10, 20 or 30 questions, a difficulty and the topics.
//   - The challenge expires if it is not accepted within 5 minutes; then both players
//     press Ready in the live room and start together after a 3-2-1.
//   - Every question at once, one after another: a tap is marked straight away and the
//     next question follows. Right +5 XP, wrong −1, skip 0.
//   - Most XP wins. Level on XP: the player who answered every question first wins
//     (leaving, or going quiet for 90 seconds, finishes you where you are).
//   - No question twice in a battle. Nobody's XP is taken: each keeps what they earned
//     (never below 0), and the winner gets a bonus.
//   - Wins move you up the battle tiers (Bronze → Apex).
// Files starting with "_" are not routes.

export const RIGHT_XP = 5;
export const WRONG_XP = -1;
export const SKIP_XP = 0;
export const WIN_BONUS_XP = 20;
export const COUNTS = [10, 20, 30];
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'mixed'];
export const INVITE_MS = 5 * 60_000;
export const LOBBY_MS = 5 * 60_000;
export const COUNTDOWN_MS = 4_000;
export const IDLE_MS = 90_000;
export const LONGEST_MS = 20 * 60_000;
export const FASTEST_ANSWER_MS = 250;

/** Battle tiers, by battle points: a win 3 (+1 on Hard, +1 for 30 questions), a draw 1. */
export const TIERS = [
  { id: 'bronze', name: 'Bronze', from: 0 },
  { id: 'silver', name: 'Silver', from: 10 },
  { id: 'gold', name: 'Gold', from: 25 },
  { id: 'platinum', name: 'Platinum', from: 50 },
  { id: 'diamond', name: 'Diamond', from: 90 },
  { id: 'apex', name: 'Apex', from: 150 },
];

export class BattleError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function tierFor(points = 0) {
  let index = 0;
  TIERS.forEach((tier, i) => { if (points >= tier.from) index = i; });
  const next = TIERS[index + 1] ?? null;
  return { ...TIERS[index], points, next: next ? { ...next, needed: next.from - points } : null };
}

export function pointsFor(result, room) {
  if (result === 'draw') return 1;
  if (result !== 'win') return 0;
  return 3 + (room.difficulty === 'hard' ? 1 : 0) + (room.count >= 30 ? 1 : 0);
}

// ── Choosing the questions ────────────────────────────────────────

function seeded(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// For each difficulty, where to look when there are not enough of it.
const FALLBACK = {
  easy: ['easy', null, 'medium', 'hard'],
  medium: ['medium', null, 'easy', 'hard'],
  hard: ['hard', 'medium', null, 'easy'],
};
const LEVEL_NAME = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

/**
 * A battle's questions from a course bank (public/battle-bank/<course>.json): only the
 * chosen topics (none chosen = all), the chosen difficulty first and topped up from the
 * nearest one when there are too few, never the same question twice, options shuffled
 * (unless their order matters). Deterministic for a seed. Returns what the players see,
 * the answers (kept by the server) and a note when the difficulty had to be topped up.
 */
export function pickQuestions(bank, { topicIds = [], difficulty = 'mixed', count = 10, seed = 'seed' }) {
  const random = seeded(seed);
  const chosen = new Set(topicIds);
  const pool = (bank?.questions ?? []).filter((question) => !chosen.size || chosen.has(question.topic));
  if (pool.length < count) {
    throw new BattleError(409, pool.length
      ? `These topics have only ${pool.length} questions. Choose more topics or fewer questions.`
      : 'There are no questions on these topics yet. Choose other topics.');
  }
  let picked;
  let note = null;
  if (difficulty === 'mixed' || !FALLBACK[difficulty]) {
    picked = shuffle(pool, random).slice(0, count);
  } else {
    picked = [];
    for (const level of FALLBACK[difficulty]) {
      if (picked.length >= count) break;
      picked.push(...shuffle(pool.filter((question) => (question.level ?? null) === level), random).slice(0, count - picked.length));
    }
    const exact = picked.filter((question) => question.level === difficulty).length;
    if (exact < count) note = `${exact ? `Only ${exact}` : 'No'} ${LEVEL_NAME[difficulty]} questions on these topics, so the rest are the nearest level.`;
    picked = shuffle(picked, random);
  }
  const questions = [];
  const answers = [];
  for (const question of picked) {
    const order = question.fixed ? question.options.map((_, i) => i) : shuffle(question.options.map((_, i) => i), random);
    questions.push({ id: question.id, topic: question.topic, level: question.level ?? null, prompt: question.prompt, options: order.map((i) => question.options[i]) });
    answers.push(order.indexOf(question.answer));
  }
  return { questions, answers, note };
}

// ── A battle room ─────────────────────────────────────────────────

export function emptySide() {
  return { pos: 0, score: 0, right: 0, wrong: 0, skipped: 0, streak: 0, best: 0, marks: '', lastAt: 0, finishedAt: 0, completed: false, left: false };
}

/** A new room (status "invited"): what both players can read. */
export function newRoom({ id, now, challenger, opponent, course, count, difficulty, questions, note, tiers, rematchOf }) {
  return {
    v: 1,
    id,
    players: [challenger.uid, opponent.uid],
    challenger: { uid: challenger.uid, name: challenger.name ?? null },
    opponent: { uid: opponent.uid, name: opponent.name ?? null },
    course,
    count,
    difficulty,
    note: note ?? null,
    status: 'invited',
    open: true,
    createdAt: now,
    expiresAt: now + INVITE_MS,
    acceptedAt: 0,
    startAt: 0,
    endedAt: 0,
    ready: { [challenger.uid]: false, [opponent.uid]: false },
    questions,
    sides: { [challenger.uid]: emptySide(), [opponent.uid]: emptySide() },
    winner: null,
    xp: null,
    answers: null,
    tiers: tiers ?? null,
    rematchOf: rematchOf ?? null,
    rematch: null,
  };
}

const other = (room, uid) => room.players.find((player) => player !== uid);

function assertPlayer(room, uid) {
  if (!room.players.includes(uid)) throw new BattleError(403, 'This is not your battle.');
}

function finishSide(side, now, { completed = false, left = false } = {}) {
  if (side.finishedAt) return side;
  return { ...side, finishedAt: now, completed, left };
}

/** Who won once both are finished: most XP; level → whoever answered everything first; else a draw. */
export function decideWinner(room) {
  const [a, b] = room.players;
  const sa = room.sides[a];
  const sb = room.sides[b];
  if (sa.score !== sb.score) return sa.score > sb.score ? a : b;
  if (sa.completed && sb.completed) {
    if (sa.finishedAt !== sb.finishedAt) return sa.finishedAt < sb.finishedAt ? a : b;
    return 'draw';
  }
  if (sa.completed !== sb.completed) return sa.completed ? a : b;
  return 'draw';
}

/** XP each player takes home: what they scored (never below 0), plus the winner's bonus. */
export function xpEarned(room, winner) {
  return Object.fromEntries(room.players.map((uid) => [uid, Math.max(0, room.sides[uid].score) + (winner === uid ? WIN_BONUS_XP : 0)]));
}

function finish(room, now, answers) {
  if (room.status !== 'live') return room;
  const both = room.players.every((uid) => room.sides[uid].finishedAt);
  if (!both) return room;
  const winner = decideWinner(room);
  return { ...room, status: 'done', open: false, endedAt: now, winner, xp: xpEarned(room, winner), answers: answers ?? room.answers };
}

/**
 * Time-based changes that need no one to act: an invite or lobby running out, the
 * countdown ending, a player gone quiet, a battle running far too long. Applied before
 * every action and on every read, so the room is always up to date.
 */
export function settle(room, now, answers) {
  if (room.status === 'invited' && now > room.expiresAt) return { ...room, status: 'expired', open: false, endedAt: now };
  if (room.status === 'lobby' && now > room.acceptedAt + LOBBY_MS) return { ...room, status: 'expired', open: false, endedAt: now };
  if (room.status !== 'live') return room;
  let next = room;
  const tooLong = now > room.startAt + LONGEST_MS;
  for (const uid of room.players) {
    const side = next.sides[uid];
    if (side.finishedAt) continue;
    const quietSince = Math.max(side.lastAt, room.startAt);
    if (tooLong || now - quietSince > IDLE_MS) next = { ...next, sides: { ...next.sides, [uid]: finishSide(side, now, { left: true }) } };
  }
  return finish(next, now, answers);
}

export function accept(room, uid, now) {
  assertPlayer(room, uid);
  if (uid !== room.opponent.uid) throw new BattleError(403, 'Only the challenged player can accept.');
  if (room.status !== 'invited') throw new BattleError(409, room.status === 'expired' ? 'This challenge expired after 5 minutes.' : 'This challenge is no longer waiting for you.');
  return { ...room, status: 'lobby', acceptedAt: now };
}

export function decline(room, uid, now) {
  assertPlayer(room, uid);
  if (room.status !== 'invited') throw new BattleError(409, 'This challenge is no longer waiting for an answer.');
  // The challenger withdrawing it is a cancel; the challenged player saying no is a decline.
  return { ...room, status: uid === room.challenger.uid ? 'cancelled' : 'declined', open: false, endedAt: now };
}

export function ready(room, uid, now) {
  assertPlayer(room, uid);
  if (room.status !== 'lobby') throw new BattleError(409, room.status === 'live' ? 'The battle has started.' : 'The room is not open.');
  const readyNow = { ...room.ready, [uid]: true };
  const all = room.players.every((player) => readyNow[player]);
  return all ? { ...room, ready: readyNow, status: 'live', startAt: now + COUNTDOWN_MS } : { ...room, ready: readyNow };
}

/**
 * One answer (a picked option, or "skip") to the player's current question. Marked
 * at once; the reply tells the app if it was right and which option was.
 */
export function answer(room, uid, { index, pick }, now, answers) {
  assertPlayer(room, uid);
  if (room.status !== 'live') throw new BattleError(409, room.status === 'done' ? 'The battle is over.' : 'The battle has not started.');
  if (now < room.startAt) throw new BattleError(409, 'Wait for the countdown.');
  const side = room.sides[uid];
  if (side.finishedAt) throw new BattleError(409, 'You have finished this battle.');
  if (index !== side.pos) throw new BattleError(409, 'That question has already been answered.');
  if (side.lastAt && now - side.lastAt < FASTEST_ANSWER_MS) throw new BattleError(429, 'Too fast.');
  const correct = answers[index];
  const skip = pick === 'skip';
  if (!skip && !(Number.isInteger(pick) && pick >= 0 && pick < room.questions[index].options.length)) throw new BattleError(400, 'Pick an option or skip.');
  const right = !skip && pick === correct;
  const streak = right ? side.streak + 1 : 0;
  let next = {
    ...side,
    pos: side.pos + 1,
    score: side.score + (skip ? SKIP_XP : right ? RIGHT_XP : WRONG_XP),
    right: side.right + (right ? 1 : 0),
    wrong: side.wrong + (!skip && !right ? 1 : 0),
    skipped: side.skipped + (skip ? 1 : 0),
    streak,
    best: Math.max(side.best, streak),
    marks: side.marks + (skip ? 's' : right ? 'r' : 'w'),
    lastAt: now,
  };
  if (next.pos >= room.count) next = finishSide(next, now, { completed: true });
  const updated = finish({ ...room, sides: { ...room.sides, [uid]: next } }, now, answers);
  return { room: updated, reply: { right, skip, correct, score: next.score, streak } };
}

/** Leaving the room: before the start it cancels or declines; during the battle it finishes you where you are. */
export function leave(room, uid, now, answers) {
  assertPlayer(room, uid);
  if (room.status === 'invited') return decline(room, uid, now);
  if (room.status === 'lobby') return { ...room, status: 'cancelled', open: false, endedAt: now };
  if (room.status !== 'live') return room;
  const side = room.sides[uid];
  if (side.finishedAt) return room;
  return finish({ ...room, sides: { ...room.sides, [uid]: finishSide(side, now, { left: true }) } }, now, answers);
}

/** The room as a player should see it: the answers only once the battle is over. */
export function publicRoom(room) {
  return room.status === 'done' ? room : { ...room, answers: null };
}

/** A finished battle, as one line of each player's history. */
export function historyEntry(room, uid) {
  const them = other(room, uid);
  const result = room.winner === 'draw' ? 'draw' : room.winner === uid ? 'win' : 'loss';
  const name = room.challenger.uid === them ? room.challenger.name : room.opponent.name;
  return { id: room.id, at: room.endedAt, course: room.course?.name ?? '', count: room.count, difficulty: room.difficulty, with: them, withName: name ?? null, mine: room.sides[uid].score, theirs: room.sides[them].score, result, xp: room.xp?.[uid] ?? 0 };
}

/** A player's battle record after one more finished battle. */
export function addToStats(stats, room, uid) {
  const entry = historyEntry(room, uid);
  const base = { wins: 0, losses: 0, draws: 0, points: 0, played: 0, recent: [], ...(stats ?? {}) };
  if ((base.recent ?? []).some((item) => item.id === room.id)) return base;
  const points = base.points + pointsFor(entry.result, room);
  return {
    ...base,
    played: base.played + 1,
    wins: base.wins + (entry.result === 'win' ? 1 : 0),
    losses: base.losses + (entry.result === 'loss' ? 1 : 0),
    draws: base.draws + (entry.result === 'draw' ? 1 : 0),
    points,
    tier: tierFor(points).id,
    recent: [entry, ...(base.recent ?? [])].slice(0, 15),
  };
}

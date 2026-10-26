// XP battles (owner, 2026-10-26): a live room for two players, refereed by the server.
// The app never writes a score. It asks the server (api/battle.mjs) to create, accept,
// start and mark each tap, and watches the room the server writes (battleRooms/{id}).
// Rules: api/_battle-rules.mjs (shown in the app by data/battle-race-rules.ts).
//
// Reads (free plan): the room is one live listener while the battle page is open, the
// open rooms and my record two listeners while Connect is open. Until the battleRooms
// rules are published the listener is refused; then the page asks the server for the
// room every few seconds, and only while a battle page is open.
import { collection, doc, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';

import type { BankCourse, BattleCount, BattleDifficulty } from '@/data/battle-race-rules';
import { auth, db } from '@/lib/firebase';
import { API_BASE, LIVE_SITE_LABEL, SITE_BASE } from '@/lib/live-site';

export type RaceStatus = 'invited' | 'lobby' | 'live' | 'done' | 'declined' | 'expired' | 'cancelled';
export type RaceSide = { pos: number; score: number; right: number; wrong: number; skipped: number; streak: number; best: number; marks: string; lastAt: number; finishedAt: number; completed: boolean; left: boolean };
export type RaceQuestion = { id: string; topic: string; level: 'easy' | 'medium' | 'hard' | null; prompt: string; options: string[] };
export type RaceCourse = { kind: 'hb'; id: string; name: string; topicIds: string[]; topicNames: string[] };
export type RacePlayer = { uid: string; name: string | null };

export type RaceRoom = {
  id: string;
  players: string[];
  challenger: RacePlayer;
  opponent: RacePlayer;
  course: RaceCourse;
  count: BattleCount;
  difficulty: BattleDifficulty;
  note: string | null;
  status: RaceStatus;
  open: boolean;
  createdAt: number;
  expiresAt: number;
  acceptedAt: number;
  startAt: number;
  endedAt: number;
  ready: Record<string, boolean>;
  questions: RaceQuestion[];
  sides: Record<string, RaceSide>;
  winner: string | 'draw' | null;
  xp: Record<string, number> | null;
  answers: number[] | null;
  tiers: Record<string, string> | null;
  rematchOf: string | null;
  rematch: string | null;
};

export type RaceHistoryEntry = { id: string; at: number; course: string; count: number; difficulty: string; with: string; withName: string | null; mine: number; theirs: number; result: 'win' | 'loss' | 'draw'; xp: number };
export type RaceStats = { wins: number; losses: number; draws: number; points: number; played: number; tier?: string; recent: RaceHistoryEntry[] };
export type AnswerResult = { right: boolean; skip: boolean; correct: number; score: number; streak: number };

export class BattleServerError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// The server's clock minus this device's: the countdown and the 5-minute expiry use the server's time.
let clockOffset = 0;
export const serverNow = () => Date.now() + clockOffset;

async function call<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken().catch(() => undefined);
  if (!token) throw new BattleServerError(401, 'Sign in to battle.');
  let response: Response;
  const sentAt = Date.now();
  try {
    response = await fetch(`${API_BASE}/api/battle`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, ...body }),
    });
  } catch {
    throw new BattleServerError(0, 'No connection to the battle server. Check your internet and try again.');
  }
  const data = await response.json().catch(() => null);
  if (!data) {
    // A local preview (expo start) has no api/ functions.
    throw new BattleServerError(response.status, `Battles are refereed by the server, which runs on the live app (${LIVE_SITE_LABEL}).`);
  }
  if (typeof data.now === 'number') clockOffset = data.now - (sentAt + Date.now()) / 2;
  if (!response.ok) throw new BattleServerError(response.status, String(data.error ?? 'The battle server had a problem. Try again.'));
  return data as T;
}

export type CreateRace = {
  opponent: { uid: string; name: string | null };
  course: RaceCourse;
  count: BattleCount;
  difficulty: BattleDifficulty;
  rematchOf?: string | null;
};

export const createRace = (input: CreateRace) => call<{ room: RaceRoom }>('create', input).then((reply) => reply.room);
export const acceptRace = (id: string) => call<{ room: RaceRoom }>('accept', { id }).then((reply) => reply.room);
export const declineRace = (id: string) => call<{ room: RaceRoom }>('decline', { id }).then((reply) => reply.room);
export const readyRace = (id: string) => call<{ room: RaceRoom }>('ready', { id }).then((reply) => reply.room);
export const leaveRace = (id: string) => call<{ room: RaceRoom }>('leave', { id }).then((reply) => reply.room);
export const getRace = (id: string) => call<{ room: RaceRoom }>('get', { id }).then((reply) => reply.room);
export const myRaces = () => call<{ rooms: RaceRoom[]; stats: RaceStats | null }>('mine');

/** Marks one answer (an option index, or 'skip') to my current question. */
export const answerRace = (id: string, index: number, pick: number | 'skip') =>
  call<{ room: RaceRoom; result: AnswerResult }>('answer', { id, index, pick });

/** Leaving the page mid-battle (best effort, also when the tab is closing). */
export function leaveRaceSoon(id: string) {
  void leaveRace(id).catch(() => undefined);
}

const denied = (error: unknown) => (error as { code?: string })?.code === 'permission-denied';

/**
 * Follows one room live. If the rules for battleRooms are not published yet, it asks
 * the server every 2.5 seconds instead (only while the battle page is open).
 */
export function watchRace(id: string, onRoom: (room: RaceRoom) => void, onError: (error: unknown) => void): Unsubscribe {
  let poll: ReturnType<typeof setInterval> | null = null;
  let stopped = false;
  const ask = () => getRace(id).then((room) => { if (!stopped) onRoom(room); }).catch((error) => { if (!stopped) onError(error); });
  const stopLive = onSnapshot(doc(db, 'battleRooms', id), (snap) => {
    if (snap.exists()) onRoom(snap.data() as RaceRoom);
  }, (error) => {
    if (!denied(error)) return onError(error);
    void ask();
    poll = setInterval(() => void ask(), 2_500);
  });
  return () => {
    stopped = true;
    stopLive();
    if (poll) clearInterval(poll);
  };
}

/**
 * My open rooms and my record, live while Connect is on screen. Without the published
 * rules it asks the server once (and again when `refresh` is called after an action).
 */
export function watchMyRaces(uid: string, onRooms: (rooms: RaceRoom[]) => void, onStats: (stats: RaceStats | null) => void, onError: (error: unknown) => void) {
  let fallback = false;
  let stopped = false;
  const ask = () => myRaces().then(({ rooms, stats }) => {
    if (stopped) return;
    onRooms(rooms);
    onStats(stats);
  }).catch((error) => { if (!stopped) onError(error); });
  const useServer = () => {
    if (fallback) return;
    fallback = true;
    void ask();
  };
  const stopRooms = onSnapshot(query(collection(db, 'battleRooms'), where('players', 'array-contains', uid), where('open', '==', true)), (snap) => {
    onRooms(snap.docs.map((item) => item.data() as RaceRoom).sort((a, b) => b.createdAt - a.createdAt));
  }, (error) => (denied(error) ? useServer() : onError(error)));
  const stopStats = onSnapshot(doc(db, 'battleStats', uid), (snap) => onStats(snap.exists() ? (snap.data() as RaceStats) : null), (error) => (denied(error) ? useServer() : onError(error)));
  return {
    stop() {
      stopped = true;
      stopRooms();
      stopStats();
    },
    /** After an action: the listeners update themselves; the fallback asks again. */
    refresh() {
      if (fallback) void ask();
    },
  };
}

let bankIndex: Promise<BankCourse[]> | null = null;

/** Every course's battle topics and how many questions each has (public/battle-bank/index.json). */
export function loadBattleIndex(): Promise<BankCourse[]> {
  bankIndex ??= fetch(`${SITE_BASE}/battle-bank/index.json`)
    .then((response) => {
      if (!response.ok) throw new Error('The battle topics could not be loaded.');
      return response.json() as Promise<{ courses: BankCourse[] }>;
    })
    .then((index) => index.courses)
    .catch((error) => {
      bankIndex = null;
      throw error;
    });
  return bankIndex;
}

/** The room from one player's side. */
export function raceView(room: RaceRoom, uid: string) {
  const meFirst = room.challenger.uid === uid;
  const me = meFirst ? room.challenger : room.opponent;
  const them = meFirst ? room.opponent : room.challenger;
  return {
    me,
    them,
    mine: room.sides[me.uid],
    theirs: room.sides[them.uid],
    iAmChallenger: meFirst,
    result: room.status !== 'done' ? null : room.winner === 'draw' ? 'draw' as const : room.winner === uid ? 'win' as const : 'loss' as const,
  };
}

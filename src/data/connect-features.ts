import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';

import { getRankProgress, RANKS } from '@/data/ranks';
import { auth, db } from '@/lib/firebase';

export type WeeklyChallengeStatus = {
  week_start: string;
  lessons_completed: number;
  lesson_target: number;
  freeze_balance: number;
  reward_claimed: boolean;
};

export type WeeklyLeagueEntry = {
  rank_id: string;
  rank_name: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  lifetime_xp: number;
  weekly_xp: number;
  league_position: number;
  league_size: number;
  is_viewer: boolean;
};

export type FriendBattleScore = { xp: number };
export type FriendBattleResults = {
  challenger: FriendBattleScore | null;
  opponent: FriendBattleScore | null;
};

export async function loadWeeklyChallengeStatus(): Promise<WeeklyChallengeStatus> {
  const user = auth.currentUser;
  const currentWeek = new Date().toISOString().split('T')[0];
  if (!user) {
    return {
      week_start: currentWeek,
      lessons_completed: 0,
      lesson_target: 5,
      freeze_balance: 0,
      reward_claimed: false,
    };
  }

  try {
    const snap = await getDoc(doc(db, 'progress', user.uid));
    const d = snap.data() || {};
    return {
      week_start: currentWeek,
      lessons_completed: Object.keys(d.lessons || {}).length,
      lesson_target: 5,
      freeze_balance: 0,
      reward_claimed: false,
    };
  } catch {
    return {
      week_start: currentWeek,
      lessons_completed: 0,
      lesson_target: 5,
      freeze_balance: 0,
      reward_claimed: false,
    };
  }
}

export async function claimWeeklyChallengeReward() {
  return { available: 50, week_start: new Date().toISOString().split('T')[0] };
}

/**
 * The league: learners of your rank, ordered by total XP, from the shared
 * leaderboard (scores/{uid}, the same entries the original app shows). There
 * is no weekly XP in either app, so `weekly_xp` is the total until weekly
 * standings exist.
 */
export async function loadWeeklyLeague(): Promise<WeeklyLeagueEntry[]> {
  const viewerId = auth.currentUser?.uid ?? null;
  const snap = await getDocs(query(collection(db, 'scores'), orderBy('xp', 'desc'), limit(300)));
  const rows = snap.docs.map((item) => ({ id: item.id, data: item.data() }));
  if (viewerId && !rows.some((row) => row.id === viewerId)) {
    const mine = await getDoc(doc(db, 'scores', viewerId));
    if (mine.exists()) rows.push({ id: mine.id, data: mine.data() });
  }
  const rankOf = (xp: unknown) => getRankProgress(Number(xp) || 0)?.rank ?? RANKS[0];
  const viewerRow = rows.find((row) => row.id === viewerId);
  const myRank = rankOf(viewerRow?.data.xp);
  const league = rows
    .filter((row) => rankOf(row.data.xp).id === myRank.id)
    .sort((a, b) => (Number(b.data.xp) || 0) - (Number(a.data.xp) || 0));
  return league.map((row, index) => ({
    rank_id: myRank.id,
    rank_name: myRank.name,
    user_id: row.id,
    username: row.data.username || null,
    display_name: row.data.username || null,
    avatar_url: null,
    lifetime_xp: Number(row.data.xp) || 0,
    weekly_xp: Number(row.data.xp) || 0,
    league_position: index + 1,
    league_size: league.length,
    is_viewer: row.id === viewerId,
  }));
}

export async function loadFriendBattleResults(challengeId: string): Promise<FriendBattleResults> {
  try {
    const snap = await getDoc(doc(db, 'battles', challengeId));
    if (!snap.exists()) return { challenger: null, opponent: null };
    const d = snap.data();
    return {
      challenger: d.challengerScore ? { xp: Number(d.challengerScore) } : null,
      opponent: d.opponentScore ? { xp: Number(d.opponentScore) } : null,
    };
  } catch {
    return { challenger: null, opponent: null };
  }
}

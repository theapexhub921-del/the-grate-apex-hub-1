import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from 'firebase/firestore';

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

export async function loadWeeklyLeague(): Promise<WeeklyLeagueEntry[]> {
  try {
    const snap = await getDocs(query(collection(db, 'leaderboard'), limit(50)));
    const viewerId = auth.currentUser?.uid;
    return snap.docs.map((d, index) => {
      const data = d.data();
      return {
        rank_id: d.id,
        rank_name: data.rankName || 'Cadet',
        user_id: data.userId || d.id,
        username: data.username || null,
        display_name: data.displayName || data.username || null,
        avatar_url: data.avatarUrl || null,
        lifetime_xp: Number(data.xp || 0),
        weekly_xp: Number(data.weeklyXp || data.xp || 0),
        league_position: index + 1,
        league_size: snap.size,
        is_viewer: viewerId === (data.userId || d.id),
      };
    });
  } catch {
    return [];
  }
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

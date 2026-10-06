import { supabase } from '@/lib/supabase';

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
export type FriendBattleResults = { challenger: FriendBattleScore | null; opponent: FriendBattleScore | null };

export async function loadWeeklyChallengeStatus(): Promise<WeeklyChallengeStatus> {
  const { data, error } = await supabase.rpc('grateapex_weekly_challenge_status');
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error('Weekly challenge status is unavailable.');
  return row as WeeklyChallengeStatus;
}

export async function claimWeeklyChallengeReward() {
  const { data, error } = await supabase.rpc('grateapex_claim_weekly_challenge');
  if (error) throw error;
  return data as { available: number; week_start: string };
}

export async function loadWeeklyLeague(): Promise<WeeklyLeagueEntry[]> {
  const { data, error } = await supabase.rpc('grateapex_weekly_league');
  if (error) throw error;
  return (data ?? []) as WeeklyLeagueEntry[];
}

export async function loadFriendBattleResults(challengeId: string): Promise<FriendBattleResults> {
  const { data, error } = await supabase.rpc('grateapex_friend_battle_results', { p_challenge: challengeId });
  if (error) throw error;
  return data as FriendBattleResults;
}

import { supabase } from '@/lib/supabase';
import { dayKey } from '@/data/learning/time';

export type ApexCoinReward = 'apex_challenge' | 'topic_completion';
export type StreakRecoveryOffer = { id: string; lost_streak: number; lost_on: string };

export async function readApexCoinBalance() {
  const { data, error } = await supabase.from('apex_coin_wallets').select('balance').maybeSingle();
  if (error) throw error;
  return Number(data?.balance ?? 0);
}

export async function sendApexCoins(recipientId: string, amount: number) {
  if (!recipientId) throw new Error('Choose a friend first.');
  if (!Number.isSafeInteger(amount) || amount < 1) throw new Error('Enter a whole number greater than zero.');
  const { data, error } = await supabase.rpc('grateapex_send_apex_coins', {
    p_recipient_id: recipientId,
    p_amount: amount,
  });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function awardApexCoins(reward: ApexCoinReward, sourceId: string) {
  if (!sourceId.trim()) throw new Error('A completion reference is required.');
  const { data, error } = await supabase.rpc('grateapex_award_apex_coins', {
    p_reward: reward,
    p_source_id: sourceId,
  });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function buyStreakRecoveryWithCoins(at = Date.now()) {
  const { data, error } = await supabase.rpc('grateapex_buy_streak_recovery', {
    p_today: dayKey(at),
  });
  if (error) throw error;
  const result = data as { balance?: unknown; streak?: unknown } | null;
  return { balance: Number(result?.balance ?? 0), streak: Number(result?.streak ?? 0) };
}

export async function readStreakRecoveryOffer(): Promise<StreakRecoveryOffer | null> {
  const { data, error } = await supabase.from('streak_recovery_offers')
    .select('id, lost_streak, lost_on').is('recovered_at', null)
    .order('lost_streak', { ascending: false }).order('lost_on', { ascending: false })
    .limit(1).maybeSingle();
  if (error) throw error;
  return data as StreakRecoveryOffer | null;
}

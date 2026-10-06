import { supabase } from '@/lib/supabase';

export type TableConference = { id: string; host_id: string; group_id: string | null; name: string; topic: string; starts_at: string; status: 'scheduled' | 'live' | 'completed' | 'cancelled'; created_at: string };
export type ConferenceMessage = { id: string; conference_id: string; author_id: string; body: string; created_at: string };

async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Sign in to use Table Conferences.');
  return data.user.id;
}

export async function listConferences() {
  const { data, error } = await supabase.from('table_conferences').select('*').neq('status', 'cancelled').order('starts_at', { ascending: true }).limit(50);
  if (error) throw error;
  return (data ?? []) as TableConference[];
}

export async function createConference(input: Pick<TableConference, 'name' | 'topic' | 'starts_at' | 'group_id'>, inviteeIds: string[]) {
  const hostId = await getUserId();
  const { data, error } = await supabase.from('table_conferences').insert({ ...input, host_id: hostId }).select('*').single();
  if (error) throw error;
  const rows = [...new Set([hostId, ...inviteeIds])].map((userId) => ({ conference_id: data.id, user_id: userId, invited_by: hostId, status: userId === hostId ? 'joined' : 'invited', joined_at: userId === hostId ? new Date().toISOString() : null }));
  const { error: inviteError } = await supabase.from('table_conference_participants').insert(rows);
  if (inviteError) {
    await supabase.from('table_conferences').delete().eq('id', data.id).eq('host_id', hostId);
    throw inviteError;
  }
  return data as TableConference;
}

export async function joinConference(conferenceId: string) {
  await getUserId();
  const { error } = await supabase.rpc('grateapex_join_conference', { p_conference: conferenceId });
  if (error) throw error;
}

export async function leaveConference(conferenceId: string) {
  const userId = await getUserId();
  const { error } = await supabase.from('table_conference_participants').update({ status: 'left' }).eq('conference_id', conferenceId).eq('user_id', userId);
  if (error) throw error;
}

export async function listConferenceMessages(conferenceId: string, before?: string, limit = 40) {
  let query = supabase.from('table_conference_messages').select('*').eq('conference_id', conferenceId).order('created_at', { ascending: false }).limit(limit);
  if (before) query = query.lt('created_at', before);
  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as ConferenceMessage[]).reverse();
}

export async function sendConferenceMessage(conferenceId: string, body: string) {
  const authorId = await getUserId();
  const text = body.trim();
  if (text.length < 1 || text.length > 4000) throw new Error('Messages must be 1–4,000 characters.');
  const { data, error } = await supabase.from('table_conference_messages').insert({ conference_id: conferenceId, author_id: authorId, body: text }).select('*').single();
  if (error) throw error;
  return data as ConferenceMessage;
}

export async function conferenceParticipants(conferenceId: string) {
  const { data, error } = await supabase.from('table_conference_participants').select('user_id,status').eq('conference_id', conferenceId);
  if (error) throw error;
  return data ?? [];
}

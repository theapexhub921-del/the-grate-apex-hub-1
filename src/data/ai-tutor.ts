import { supabase } from '@/lib/supabase';

export type RealtimeTutorSession = {
  client_secret: {
    value: string;
    expires_at: number;
  };
  model: string;
};

/** Requests a short-lived voice-session credential; the permanent provider key stays server-side. */
export async function createRealtimeTutorSession() {
  const { data, error } = await supabase.functions.invoke('ai-tutor-session', {
    method: 'POST',
  });
  if (error) {
    const context = (error as { context?: unknown }).context;
    if (context && typeof context === 'object' && 'json' in context && typeof context.json === 'function') {
      const response = context as Response;
      const payload = await response.clone().json().catch(() => null) as { error?: unknown; message?: unknown } | null;
      const detail = typeof payload?.error === 'string'
        ? payload.error
        : typeof payload?.message === 'string'
          ? payload.message
          : null;
      if (detail) {
        throw new Error(`AI tutor setup failed (${response.status}): ${detail}`);
      }
      throw new Error(`AI tutor setup failed (${response.status}). Check the Edge Function secrets and logs in Supabase.`);
    }
    throw error;
  }
  if (!data?.client_secret?.value || typeof data?.client_secret?.expires_at !== 'number') {
    throw new Error(data?.error ?? 'The AI tutor session could not be started.');
  }
  return data as RealtimeTutorSession;
}

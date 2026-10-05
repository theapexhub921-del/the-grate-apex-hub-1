import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ProfileUpdate = {
  display_name?: string | null;
  avatar_url?: string | null;
};

export type ProfileResponse = {
  data: Profile | null;
  error: PostgrestError | Error | null;
};

/**
 * Fetches a profile by its authenticated user ID.
 */
export async function getProfileById(userId: string): Promise<ProfileResponse> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * Fetches the currently authenticated user's profile.
 * Returns { data: null, error: null } if no session exists.
 */
export async function getCurrentProfile(): Promise<ProfileResponse> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return { data: null, error: authError };
    }

    if (!user) {
      return { data: null, error: null };
    }

    return await getProfileById(user.id);
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * Updates a profile for a specific user ID.
 */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<ProfileResponse> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, display_name, avatar_url, created_at')
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * Updates the currently authenticated user's profile (display name, avatar).
 */
export async function updateCurrentProfile(
  updates: ProfileUpdate
): Promise<ProfileResponse> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return { data: null, error: authError };
    }

    if (!user) {
      return {
        data: null,
        error: new Error('Cannot update profile: no authenticated user found.'),
      };
    }

    return await updateProfile(user.id, updates);
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

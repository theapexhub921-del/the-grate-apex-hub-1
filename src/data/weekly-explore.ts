import { useEffect, useState } from 'react';

import type { ExploreItem } from '@/data/explore';
import { supabase } from '@/lib/supabase';

export type WeeklyExploreSession = {
  week_start: string;
  title: string;
  summary: string;
  items: ExploreItem[];
};

function mondayKey(date: Date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function addDays(key: string, days: number) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export async function loadWeeklyExploreSession(now = new Date()): Promise<WeeklyExploreSession | null> {
  const weekStart = mondayKey(now);
  const nextWeek = addDays(weekStart, 7);
  const { data, error } = await supabase
    .from('explore_weekly_sessions')
    .select('week_start, title, summary, items')
    .eq('status', 'published')
    .gte('week_start', weekStart)
    .lte('week_start', nextWeek)
    .order('week_start', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data || !Array.isArray(data.items)) return null;
  return data as unknown as WeeklyExploreSession;
}

export function useWeeklyExploreSession() {
  const [session, setSession] = useState<WeeklyExploreSession | null>(null);
  useEffect(() => {
    let active = true;
    void loadWeeklyExploreSession().then((result) => { if (active) setSession(result); });
    return () => { active = false; };
  }, []);
  return session;
}

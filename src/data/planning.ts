import { supabase } from '@/lib/supabase';

export type StudyPlan = {
  id: string;
  user_id: string;
  title: string;
  topic_ids: string[];
  duration_days: number;
  goal: string;
  progress_lesson_ids: string[];
  status: 'active' | 'completed' | 'archived';
  starts_at: string;
  created_at: string;
  updated_at: string;
};

export type TimetableBlock = {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  weekday: number;
  start_time: string;
  end_time: string;
  recurrence: 'once' | 'weekly';
  event_date: string | null;
  study_plan_id: string | null;
  created_at: string;
};

export type PersonalGoal = {
  id: string;
  user_id: string;
  title: string;
  goal_type: 'lessons' | 'xp' | 'questions' | 'streak' | 'topic' | 'study_plan';
  target: number;
  current: number;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

async function currentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Sign in to sync your study planning.');
  return data.user.id;
}

export async function listStudyPlans() {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('personal_study_plans').select('*').eq('user_id', userId)
    .neq('status', 'archived').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as StudyPlan[];
}

export async function saveStudyPlan(input: Pick<StudyPlan, 'id' | 'title' | 'topic_ids' | 'duration_days' | 'goal' | 'status'> | Omit<StudyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'progress_lesson_ids' | 'starts_at'>) {
  const userId = await currentUserId();
  const { data: existing, error: existingError } = await supabase.from('personal_study_plans').select('id, progress_lesson_ids, starts_at')
    .eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (existingError) throw existingError;
  const payload = {
    user_id: userId,
    title: input.title,
    topic_ids: input.topic_ids,
    duration_days: input.duration_days,
    goal: input.goal,
    status: input.status,
    updated_at: new Date().toISOString(),
    ...(existing ? {} : { starts_at: new Date().toISOString().slice(0, 10) }),
  };
  const query = existing
    ? supabase.from('personal_study_plans').update(payload).eq('id', existing.id).eq('user_id', userId)
    : supabase.from('personal_study_plans').insert(payload);
  const { data, error } = await query.select('*').single();
  if (error) throw error;
  return data as StudyPlan;
}

export async function updateStudyPlanProgress(lessonIds: string[]) {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('personal_study_plans').select('id, topic_ids').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (error) throw error;
  if (!data) return;
  const { publishedTopics } = await import('@/data/curriculum');
  const path = data.topic_ids.flatMap((topicId: string) => publishedTopics.find((topic) => topic.id === topicId)?.lessons.map((lesson) => lesson.id) ?? []);
  const completed = [...new Set(lessonIds.filter((id) => path.includes(id)))];
  const { error: updateError } = await supabase.from('personal_study_plans').update({
    progress_lesson_ids: completed,
    status: path.length > 0 && completed.length >= path.length ? 'completed' : 'active',
    updated_at: new Date().toISOString(),
  }).eq('id', data.id).eq('user_id', userId);
  if (updateError) throw updateError;
}

export async function listTimetableBlocks() {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('timetable_blocks').select('*').eq('user_id', userId)
    .order('weekday').order('start_time');
  if (error) throw error;
  return (data ?? []) as TimetableBlock[];
}

export async function createTimetableBlock(input: Omit<TimetableBlock, 'id' | 'user_id' | 'created_at'>) {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('timetable_blocks').insert({ ...input, user_id: userId }).select('*').single();
  if (error) throw error;
  return data as TimetableBlock;
}

export async function deleteTimetableBlock(id: string) {
  const userId = await currentUserId();
  const { error } = await supabase.from('timetable_blocks').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function updateTimetableBlock(id: string, input: Omit<TimetableBlock, 'id' | 'user_id' | 'created_at'>) {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('timetable_blocks').update(input).eq('id', id).eq('user_id', userId).select('*').single();
  if (error) throw error;
  return data as TimetableBlock;
}

export async function listPersonalGoals() {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('personal_goals').select('*').eq('user_id', userId).order('deadline', { nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as PersonalGoal[];
}

export async function createPersonalGoal(input: Pick<PersonalGoal, 'title' | 'goal_type' | 'target' | 'deadline'>) {
  const userId = await currentUserId();
  const { data, error } = await supabase.from('personal_goals').insert({ ...input, user_id: userId }).select('*').single();
  if (error) throw error;
  return data as PersonalGoal;
}

export async function deletePersonalGoal(id: string) {
  const userId = await currentUserId();
  const { error } = await supabase.from('personal_goals').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function updatePersonalGoal(id: string, current: number) {
  const userId = await currentUserId();
  const { error } = await supabase.from('personal_goals').update({
    current,
    completed_at: current > 0 ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq('id', id).eq('user_id', userId);
  if (error) throw error;
}

export async function refreshProgressGoals(progress: { lessonsCompleted: number; xp: number; streak: number }) {
  const userId = await currentUserId();
  const { data: goals, error } = await supabase.from('personal_goals').select('id, goal_type, target, current').eq('user_id', userId);
  if (error) throw error;
  const supported: Record<string, number> = { lessons: progress.lessonsCompleted, xp: progress.xp, streak: progress.streak };
  await Promise.all((goals ?? []).filter((goal) => goal.goal_type in supported).map(async (goal) => {
    const current = Math.max(0, supported[goal.goal_type]);
    if (Number(goal.current) === current) return;
    const { error: updateError } = await supabase.from('personal_goals').update({
      current,
      completed_at: current >= Number(goal.target) ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', goal.id).eq('user_id', userId);
    if (updateError) throw updateError;
  }));
}

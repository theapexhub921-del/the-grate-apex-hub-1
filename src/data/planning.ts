import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export type StudyPlan = {
  id: string;
  user_id: string;
  title: string;
  topic_ids: string[];
  duration_days: number;
  starts_at: string;
  status: 'active' | 'completed' | 'archived';
  goal: 'mastery' | 'exam' | 'catchup' | 'revision' | string;
  progress_lesson_ids: string[];
  created_at: string;
  updated_at: string;
};

export type TimetableBlock = {
  id: string;
  user_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  subject: string;
  title: string;
  notes?: string | null;
  recurrence?: 'weekly';
  event_date?: string | null;
  study_plan_id?: string | null;
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
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to sync your study planning.');
  return user.uid;
}

export async function listStudyPlans(): Promise<StudyPlan[]> {
  try {
    const userId = await currentUserId();
    const snap = await getDocs(collection(db, 'users', userId, 'studyPlans'));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as StudyPlan)
      .filter((p) => p.status !== 'archived');
  } catch {
    return [];
  }
}

export async function saveStudyPlan(
  input:
    | Pick<StudyPlan, 'id' | 'title' | 'topic_ids' | 'duration_days' | 'goal' | 'status'>
    | Omit<StudyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'progress_lesson_ids' | 'starts_at'>
): Promise<StudyPlan> {
  const userId = await currentUserId();
  const id = 'id' in input && input.id ? input.id : `plan_${Date.now()}`;
  const now = new Date().toISOString();
  const plan: StudyPlan = {
    id,
    user_id: userId,
    title: input.title,
    topic_ids: input.topic_ids,
    duration_days: input.duration_days,
    starts_at: now.slice(0, 10),
    status: input.status,
    goal: input.goal,
    progress_lesson_ids: [],
    created_at: now,
    updated_at: now,
  };

  await setDoc(doc(db, 'users', userId, 'studyPlans', id), plan, { merge: true });
  return plan;
}

export async function updateStudyPlanProgress(lessonIds: string[]) {
  try {
    const userId = await currentUserId();
    const plans = await listStudyPlans();
    const active = plans.find((p) => p.status === 'active');
    if (!active) return;

    const { publishedTopics } = await import('@/data/curriculum');
    const path = active.topic_ids.flatMap(
      (topicId: string) => publishedTopics.find((t) => t.id === topicId)?.lessons.map((l) => l.id) ?? []
    );
    const completed = [...new Set(lessonIds.filter((id) => path.includes(id)))];

    await updateDoc(doc(db, 'users', userId, 'studyPlans', active.id), {
      progress_lesson_ids: completed,
      status: path.length > 0 && completed.length >= path.length ? 'completed' : 'active',
      updated_at: new Date().toISOString(),
    });
  } catch {}
}

export async function listTimetableBlocks(): Promise<TimetableBlock[]> {
  try {
    const userId = await currentUserId();
    const snap = await getDocs(collection(db, 'users', userId, 'timetableBlocks'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TimetableBlock);
  } catch {
    return [];
  }
}

export async function createTimetableBlock(
  input: Omit<TimetableBlock, 'id' | 'user_id' | 'created_at'>
): Promise<TimetableBlock> {
  const userId = await currentUserId();
  const id = `block_${Date.now()}`;
  const block: TimetableBlock = {
    id,
    user_id: userId,
    ...input,
    created_at: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', userId, 'timetableBlocks', id), block);
  return block;
}

export async function deleteTimetableBlock(id: string) {
  const userId = await currentUserId();
  await deleteDoc(doc(db, 'users', userId, 'timetableBlocks', id));
}

export async function updateTimetableBlock(
  id: string,
  input: Partial<Omit<TimetableBlock, 'id' | 'user_id' | 'created_at'>>
): Promise<TimetableBlock> {
  const userId = await currentUserId();
  await updateDoc(doc(db, 'users', userId, 'timetableBlocks', id), {
    ...input,
  });
  return {
    id,
    user_id: userId,
    weekday: input.weekday ?? 0,
    start_time: input.start_time ?? '',
    end_time: input.end_time ?? '',
    subject: input.subject ?? '',
    title: input.title ?? '',
    created_at: new Date().toISOString(),
    ...input,
  } as TimetableBlock;
}

export async function listPersonalGoals(): Promise<PersonalGoal[]> {
  try {
    const userId = await currentUserId();
    const snap = await getDocs(collection(db, 'users', userId, 'goals'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PersonalGoal);
  } catch {
    return [];
  }
}

export async function createPersonalGoal(
  input: Pick<PersonalGoal, 'title' | 'goal_type' | 'target' | 'deadline'>
): Promise<PersonalGoal> {
  const userId = await currentUserId();
  const id = `goal_${Date.now()}`;
  const now = new Date().toISOString();
  const goal: PersonalGoal = {
    id,
    user_id: userId,
    ...input,
    current: 0,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };

  await setDoc(doc(db, 'users', userId, 'goals', id), goal);
  return goal;
}

export async function deletePersonalGoal(id: string) {
  const userId = await currentUserId();
  await deleteDoc(doc(db, 'users', userId, 'goals', id));
}

export async function updatePersonalGoal(id: string, current: number) {
  const userId = await currentUserId();
  await updateDoc(doc(db, 'users', userId, 'goals', id), {
    current,
    completed_at: current > 0 ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  });
}

export async function refreshProgressGoals(progress: { lessonsCompleted: number; xp: number; streak: number }) {
  try {
    const userId = await currentUserId();
    const snap = await getDocs(collection(db, 'users', userId, 'goals'));
    const supported: Record<string, number> = {
      lessons: progress.lessonsCompleted,
      xp: progress.xp,
      streak: progress.streak,
    };

    for (const d of snap.docs) {
      const g = d.data();
      if (g.goal_type in supported) {
        const current = Math.max(0, supported[g.goal_type]);
        if (Number(g.current) !== current) {
          await updateDoc(d.ref, {
            current,
            completed_at: current >= Number(g.target) ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  } catch {}
}

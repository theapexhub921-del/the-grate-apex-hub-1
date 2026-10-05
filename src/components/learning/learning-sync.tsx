import { useEffect } from 'react';

import { useLearning } from '@/data/learning/use-learning';
import { useAuth } from '@/hooks/use-auth';
import { projectScheduleToCloud } from '@/data/review';

// Mounted once in the root layout (renders nothing).
// - Subscribing through useLearning() loads every learning store early,
//   so the first screen the learner opens already has their history.
// - Whenever the memory model changes, the concept schedule is projected
//   to Supabase `review_schedule` (debounced; only changed rows).
export function LearningSync() {
  const { session } = useAuth();
  const { memory, historyReady } = useLearning();

  useEffect(() => {
    if (!session || !historyReady) return;
    projectScheduleToCloud(memory);
  }, [session, historyReady, memory]);

  return null;
}

import { useEffect, useState } from 'react';
import {
  StreakCelebrationModal,
  clearStreakCelebration,
  getPendingStreakCelebration,
  subscribeStreakCelebration,
  type StreakCelebrationData,
} from '@/components/streak-celebration';

// Mounted once in _layout.tsx alongside the other watchers.
// Listens for streak events triggered by progress.ts and shows the modal.
export function StreakCelebrationWatcher() {
  const [data, setData] = useState<StreakCelebrationData | null>(
    () => getPendingStreakCelebration()
  );

  useEffect(() => {
    return subscribeStreakCelebration((next) => setData(next));
  }, []);

  function dismiss() {
    clearStreakCelebration();
    setData(null);
  }

  if (!data) return null;

  return <StreakCelebrationModal data={data} onDismiss={dismiss} />;
}

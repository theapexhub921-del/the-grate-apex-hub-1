import { type AtlasQuizResult } from '@/data/learning/atlas-quiz-rules';
import { dayKey } from '@/data/learning/time';
import { atlasQuizXp } from '@/data/learning/xp-rules';
import { awardXp } from '@/data/progress';

// Records a finished 3D atlas quiz round: XP once per day (the award key is the day, like the
// Question of the Day) and, through awardXp, the learning streak. A second round on the same day
// gives no more XP but still counts as study. Returns the XP actually added (0 if already paid today).
export async function recordAtlasQuiz(result: AtlasQuizResult, at = Date.now()): Promise<number> {
  return awardXp({
    sourceType: 'practice',
    sourceId: `atlas-quiz:${dayKey(at)}`,
    amount: atlasQuizXp({ correct: result.score, total: result.total }),
    label: 'Anatomy atlas quiz',
  });
}

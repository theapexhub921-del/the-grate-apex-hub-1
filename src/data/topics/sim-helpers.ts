// Shared pieces for each topic's simulations.ts (see AGENTS.md → Lesson
// simulations). The Cardiovascular and CNS topics keep their own copies.
import type { InteractiveDraft, QuestionDraft } from '@/data/topics/build';

const DIRECTIONS = ['It increases', 'It decreases', 'It stays about the same'];

// "Which way will it go?" — always in the same order, marked as a prediction.
export function direction<K extends string>(id: string, conceptId: K, prompt: string, answer: 'up' | 'down' | 'same', explanation: string): QuestionDraft<K> {
  return {
    id,
    type: 'choice',
    conceptId,
    prompt,
    options: DIRECTIONS,
    answer: answer === 'up' ? 0 : answer === 'down' ? 1 : 2,
    fixedOrder: true,
    explanation,
    skill: 'prediction',
    label: 'Predict',
  } as QuestionDraft<K>;
}

// Options for mcq() predictions.
export const predict = { skill: 'prediction' as const, label: 'Predict' };

// A lesson's interactive steps with its simulation added before the final
// recall prompt (or at the end if there is none).
export function insertSimulation<K extends string>(steps: InteractiveDraft<K>[] | undefined, sim: InteractiveDraft<K> | undefined): InteractiveDraft<K>[] | undefined {
  if (!steps || !sim) return steps;
  const last = steps[steps.length - 1];
  return last?.type === 'recall' ? [...steps.slice(0, -1), sim, last] : [...steps, sim];
}

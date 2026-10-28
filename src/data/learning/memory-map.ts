// Memory map (2026-10-28): every concept of a topic as a tile, lesson by
// lesson, coloured by what the learner's memory model says about it (new,
// learning, struggling, remembered, mastered) and filled by the mastery
// estimate. Pure: checked by tests/learning-boosts.test.mjs.
import type { MemoryState } from '@/data/learning/scheduler';

export type MapLesson = { id: string; title: string; concepts: { key: string; name: string }[] };
export type MapMemory = { state: MemoryState; mastery: number; due: boolean; dueAt: number | null };
export type MapCell = { key: string; name: string; state: MemoryState; mastery: number; due: boolean; dueAt: number | null };
export type MapRow = { lessonId: string; title: string; cells: MapCell[]; strength: number };

export function memoryMap(lessons: readonly MapLesson[], memoryOf: (key: string) => MapMemory | undefined): MapRow[] {
  return lessons
    .map((lesson) => {
      const cells = lesson.concepts.map((concept) => {
        const memory = memoryOf(concept.key);
        return {
          key: concept.key,
          name: concept.name,
          state: memory?.state ?? 'new',
          mastery: memory ? Math.max(0, Math.min(1, memory.mastery)) : 0,
          due: memory?.due ?? false,
          dueAt: memory?.dueAt ?? null,
        };
      });
      const strength = cells.length ? cells.reduce((sum, cell) => sum + cell.mastery, 0) / cells.length : 0;
      return { lessonId: lesson.id, title: lesson.title, cells, strength };
    })
    .filter((row) => row.cells.length > 0);
}

/** The few concepts to look at first: struggling, then due, then the weakest started ones. */
export function mapFocus(rows: readonly MapRow[], limit = 3): MapCell[] {
  const cells = rows.flatMap((row) => row.cells).filter((cell) => cell.state !== 'new');
  const rank = (cell: MapCell) => (cell.state === 'struggling' ? 0 : cell.due ? 1 : 2);
  return cells.sort((a, b) => rank(a) - rank(b) || a.mastery - b.mastery || a.name.localeCompare(b.name)).slice(0, limit);
}

// The Physiology → Simulations tab (data/simulation-library.ts): it lists
// every lesson simulation of the subject, and each one opens on its page.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { builtTopics } = await import('@/data/topics');
const { simulationLibrary, lessonSimulation } = await import('@/data/simulation-library');

describe('simulation library', () => {
  const groups = simulationLibrary('physiology');
  const listed = groups.flatMap((group) => group.items.map((item) => item.lesson.id));

  it('lists every physiology lesson simulation', () => {
    const expected = builtTopics
      .filter((built) => built.topic.subject === 'physiology')
      .flatMap((built) => built.topic.lessons.filter((lesson) => (lesson.interactive ?? []).some((step) => step.type === 'simulate')).map((lesson) => lesson.id));
    assert.ok(expected.length > 0);
    assert.deepEqual(listed, expected);
  });

  it('opens each one by lesson id', () => {
    for (const id of listed) assert.ok(lessonSimulation(id)?.step, id);
    assert.equal(lessonSimulation('no-such-lesson'), null);
  });
});

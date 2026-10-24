// Every lesson opens with "Start simple" (components/learning/interactive-layer.tsx):
// the big idea, the words it uses and what the learner will be able to do, built
// from the lesson itself (owner, 2026-10-24: teach as if the learner knew nothing,
// then build up). Every lesson needs a description and objectives for it, and a
// step-by-step version to open.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { builtTopics } from '../src/data/topics/index.ts';

test('every lesson has what "Start simple" shows, and a step-by-step version', () => {
  for (const { topic } of builtTopics) {
    for (const lesson of topic.lessons) {
      assert.ok(lesson.description?.trim(), `${lesson.id} needs a description (the big idea)`);
      assert.ok(lesson.objectives?.length, `${lesson.id} needs objectives`);
      assert.ok(lesson.interactive?.length, `${lesson.id} needs interactive steps`);
    }
  }
});

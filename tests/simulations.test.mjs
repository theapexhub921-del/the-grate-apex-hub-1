// Lesson simulations (data/simulations/). Run with: npm test
//
// Guarantees:
// - every simulation step names a real model, and every prediction's
//   watched readout and expectations hold when the model runs the change
//   (so the answer a learner is marked on matches what they then see)
// - "It increases / decreases / stays the same" answers agree with the model
// - scenarios and challenge starts stay inside each control's range
// - every challenge is not already solved at its start, and can be solved
//   by moving only its unlocked controls
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { builtTopics } = await import('@/data/topics');
const { SIMULATIONS, predictionValues } = await import('@/data/simulations');
const { goalMet, controlRange } = await import('@/data/simulations/types');

const steps = builtTopics.flatMap((built) =>
  built.topic.lessons.flatMap((lesson) => (lesson.interactive ?? []).filter((step) => step.type === 'simulate').map((step) => ({ lesson, step })))
);

function checkExpectation(expectation, before, after) {
  const a = before.readouts[expectation.readout];
  const b = after.readouts[expectation.readout];
  assert.ok(a !== undefined && b !== undefined, `unknown readout ${expectation.readout}`);
  if (expectation.equals !== undefined) {
    const tolerance = expectation.tolerance ?? 1e-9;
    assert.ok(Math.abs(b - expectation.equals) <= Math.max(tolerance, Math.abs(expectation.equals) * tolerance), `${expectation.readout} = ${b}, expected ${expectation.equals}`);
  }
  if (expectation.change) {
    const tolerance = (expectation.tolerance ?? 0.005) * Math.max(1, Math.abs(a));
    if (expectation.change === 'up') assert.ok(b > a + tolerance, `${expectation.readout} should rise: ${a} → ${b}`);
    if (expectation.change === 'down') assert.ok(b < a - tolerance, `${expectation.readout} should fall: ${a} → ${b}`);
    if (expectation.change === 'same') assert.ok(Math.abs(b - a) <= tolerance, `${expectation.readout} should stay the same: ${a} → ${b}`);
  }
}

function inRange(definition, values, where) {
  for (const control of definition.controls) {
    const value = values[control.key];
    assert.ok(typeof value === 'number' && Number.isFinite(value), `${where}: ${control.key} missing`);
    if (control.kind === 'slider') assert.ok(value >= control.min - 1e-9 && value <= control.max + 1e-9, `${where}: ${control.key}=${value} out of range`);
    else assert.ok(control.options.some((option) => option.value === value), `${where}: ${control.key}=${value} not an option`);
  }
}

// Every combination of the unlocked controls on a grid (finer when fewer
// controls are free; every step if that is fewer).
function* grid(definition, challenge) {
  const free = definition.controls.filter((control) => !(challenge.locked ?? []).includes(control.key));
  const axes = free.map((control) => {
    if (control.kind === 'choice') return control.options.map((option) => option.value);
    const range = controlRange(control, challenge);
    const steps = Math.round((range.max - range.min) / control.step);
    const count = Math.min(steps, free.length <= 1 ? 400 : free.length === 2 ? 80 : 12);
    return Array.from({ length: count + 1 }, (_, i) => {
      const raw = range.min + ((range.max - range.min) * i) / count;
      return Math.round(raw / control.step) * control.step;
    });
  });
  function* walk(i, values) {
    if (i === free.length) {
      yield values;
      return;
    }
    for (const value of axes[i]) yield* walk(i + 1, { ...values, [free[i].key]: value });
  }
  yield* walk(0, { ...challenge.start });
}

describe('simulations', () => {
  it('appear in lessons', () => {
    assert.ok(steps.length > 0);
  });

  for (const { lesson, step } of steps) {
    describe(`${lesson.id}: ${step.sim}`, () => {
      const definition = SIMULATIONS[step.sim];

      it('names a real model with valid readouts', () => {
        assert.ok(definition, `no model ${step.sim}`);
        inRange(definition, definition.initial, 'initial');
        const state = definition.model(definition.initial);
        for (const readout of definition.readouts) assert.ok(readout.key in state.readouts, `readout ${readout.key} not produced`);
      });

      step.predictions.forEach((prediction, index) => {
        it(`prediction ${index + 1} matches the model`, () => {
          const { before, after } = predictionValues(definition, prediction);
          inRange(definition, before, 'prediction start');
          inRange(definition, after, 'prediction end');
          assert.ok(definition.readouts.some((readout) => readout.key === prediction.watch), `watch ${prediction.watch} is not a readout`);
          const a = definition.model(before);
          const b = definition.model(after);
          assert.ok(prediction.expect.length > 0, 'no expectations');
          for (const expectation of prediction.expect) checkExpectation(expectation, a, b);

          // A direction question's marked answer must agree with the watched readout.
          const q = prediction.question;
          if (q.type === 'choice' && q.fixedOrder && q.options[0] === 'It increases') {
            const chosen = ['up', 'down', 'same'][q.answer];
            const watched = prediction.expect.find((expectation) => expectation.readout === prediction.watch && expectation.change);
            assert.ok(watched, 'a direction question needs a change expectation on its watched readout');
            assert.equal(watched.change, chosen, 'marked answer disagrees with the model');
          }
        });
      });

      it('scenarios use valid values', () => {
        for (const scenario of definition.scenarios) inRange(definition, scenario.values, `scenario ${scenario.id}`);
      });

      for (const challenge of definition.challenges) {
        it(`challenge "${challenge.label}" is unsolved at start and solvable`, () => {
          inRange(definition, challenge.start, `challenge ${challenge.id} start`);
          const start = definition.model(challenge.start).readouts;
          assert.ok(!challenge.goals.every((goal) => goalMet(goal, start)), 'already solved at the start');
          let solved = false;
          for (const values of grid(definition, challenge)) {
            const readouts = definition.model(values).readouts;
            if (challenge.goals.every((goal) => goalMet(goal, readouts))) {
              solved = true;
              break;
            }
          }
          assert.ok(solved, 'no combination of the unlocked controls reaches the goal');
        });
      }
    });
  }
});

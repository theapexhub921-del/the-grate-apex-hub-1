// Boosts work as soon as they are received (owner, 2026-10-24): a timed boost starts at
// once; with one already running, the next waits and starts by itself when it ends (one
// at a time, so an effect is never stacked or extended).
import assert from 'node:assert/strict';
import { test } from 'node:test';

test('a timed boost starts when received; the next starts when it ends', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-10-24T12:00:00Z') });
  const powerups = await import('@/data/learning/powerups');
  await powerups.resetPowerups();

  assert.equal(await powerups.grantPowerup('gift', 'first', 2, 600), true);
  const running = powerups.activeBoostNow();
  assert.ok(running, 'started straight away, no Activate needed');
  assert.equal(running.multiplier, 2);
  assert.equal(powerups.powerupInventory().filter((item) => item.kind === 'timed').length, 0);

  await powerups.grantPowerup('gift', 'second', 1.5, 900);
  assert.equal(powerups.activeBoostNow().multiplier, 2, 'the running boost is not replaced or extended');
  assert.equal(powerups.powerupInventory().filter((item) => item.kind === 'timed').length, 1, 'the second one waits');

  t.mock.timers.tick(600 * 1000 + 300);
  await new Promise((resolve) => setImmediate(resolve));
  const next = powerups.activeBoostNow();
  assert.ok(next, 'the waiting boost started by itself');
  assert.equal(next.multiplier, 1.5);
  assert.equal(powerups.powerupInventory().filter((item) => item.kind === 'timed').length, 0);
});

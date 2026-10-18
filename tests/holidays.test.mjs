// Moving special days (data/holidays.ts) for the seasonal theme achievements.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { easterSunday, EASTER_DAYS, EID_AL_FITR_DAYS, EID_AL_ADHA_DAYS } = await import('@/data/holidays');

describe('special days', () => {
  it('finds Easter Sunday', () => {
    assert.equal(easterSunday(2024), '2024-03-31');
    assert.equal(easterSunday(2025), '2025-04-20');
    assert.equal(easterSunday(2026), '2026-04-05');
    assert.equal(easterSunday(2027), '2027-03-28');
    assert.ok(EASTER_DAYS.has('2026-04-05'));
  });
  it('accepts the day either side of each Eid (moon sighting)', () => {
    for (const day of ['2026-03-19', '2026-03-20', '2026-03-21']) assert.ok(EID_AL_FITR_DAYS.has(day), day);
    for (const day of ['2026-05-26', '2026-05-27', '2026-05-28']) assert.ok(EID_AL_ADHA_DAYS.has(day), day);
    assert.ok(!EID_AL_FITR_DAYS.has('2026-03-23'));
  });
});

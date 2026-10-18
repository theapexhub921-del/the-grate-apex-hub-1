// Moving special days (data/holidays.ts) for the seasonal theme achievements.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { easterSunday, EASTER_DAYS, EID_AL_FITR_DAYS, EID_AL_ADHA_DAYS, specialThemeStart, specialThemeOpen } = await import('@/data/holidays');
const { THEME_CATALOG, themeLock, themeLockText } = await import('@/data/theme-catalog');

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

describe('special-day themes last 24 hours (then Premium)', () => {
  const at = (y, m, d, h = 0, min = 0) => new Date(y, m - 1, d, h, min).getTime();
  const HOUR = 3_600_000;
  it('the 24 hours start at the first study on the most recent special day', () => {
    const times = [at(2025, 12, 25, 18), at(2026, 12, 24, 9), at(2026, 12, 25, 20), at(2026, 12, 25, 9), at(2027, 1, 3)];
    assert.equal(specialThemeStart('xmas', times), at(2026, 12, 25, 9));
    assert.equal(specialThemeStart('xmas', [at(2026, 12, 24)]), null);
    assert.equal(specialThemeStart('gh', [at(2027, 3, 6, 23, 30)]), at(2027, 3, 6, 23, 30));
  });
  it('is open for exactly 24 hours', () => {
    const start = at(2026, 12, 25, 9);
    assert.equal(specialThemeOpen(start, start + 23 * HOUR), true);
    assert.equal(specialThemeOpen(start, start + 24 * HOUR), false);
    assert.equal(specialThemeOpen(null, start), false);
  });
  it('the theme list follows it, and points to Premium afterwards', () => {
    const christmas = THEME_CATALOG.find((entry) => entry.id === 'christmas');
    const start = at(2026, 12, 25, 9);
    const input = (now, admin = false) => ({ xp: 0, achievementLevels: { xmas: 1 }, isAdmin: admin, special: { start: () => start, now } });
    assert.equal(themeLock(christmas, input(start + HOUR)).unlocked, true);
    const ended = themeLock(christmas, input(start + 25 * HOUR));
    assert.equal(ended.kind, 'special');
    assert.match(themeLockText(ended), /Premium/);
    assert.equal(themeLock(christmas, input(start + 25 * HOUR, true)).unlocked, true, 'admins can always try it');
    const never = themeLock(THEME_CATALOG.find((entry) => entry.id === 'eidfitr'), { xp: 0, achievementLevels: {}, isAdmin: false, special: { start: () => null, now: start } });
    assert.match(themeLockText(never), /^Study on Eid al-Fitr to use it for 24 hours/);
  });
});

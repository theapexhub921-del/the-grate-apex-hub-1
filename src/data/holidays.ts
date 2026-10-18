// Special days whose date moves each year, as 'YYYY-MM-DD' study days, for the
// "Special days" achievements that unlock the seasonal themes. Pure, for tests.

const pad = (n: number) => String(n).padStart(2, '0');
const key = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;

/** Easter Sunday (Western churches, as kept in Ghana), by the Anonymous Gregorian algorithm. */
export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return key(year, month, day);
}

// The Eids follow the moon, so their dates are listed (expected dates; the day
// is confirmed by moon sighting, so the day before and after also count).
const EID_AL_FITR = ['2024-04-10', '2025-03-30', '2026-03-20', '2027-03-10', '2028-02-27', '2029-02-15', '2030-02-05', '2031-01-25', '2032-01-15'];
const EID_AL_ADHA = ['2024-06-16', '2025-06-06', '2026-05-27', '2027-05-16', '2028-05-05', '2029-04-24', '2030-04-13', '2031-04-02', '2032-03-22'];

function withNeighbours(dates: readonly string[]): ReadonlySet<string> {
  const out = new Set<string>();
  for (const date of dates) {
    const [y, m, d] = date.split('-').map(Number);
    for (const shift of [-1, 0, 1]) {
      const day = new Date(Date.UTC(y, m - 1, d + shift));
      out.add(key(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate()));
    }
  }
  return out;
}

export const EASTER_DAYS: ReadonlySet<string> = new Set(Array.from({ length: 2050 - 2020 + 1 }, (_, i) => easterSunday(2020 + i)));
export const EID_AL_FITR_DAYS = withNeighbours(EID_AL_FITR);
export const EID_AL_ADHA_DAYS = withNeighbours(EID_AL_ADHA);

// ── Special-day themes: 24 hours ───────────────────────────────────────────
// A special-day theme (Christmas, Valentine, New Year, Independence, Easter,
// both Eids) opens for 24 hours from the learner's first study on its day,
// then locks again until that day comes round (owner's decision, 2026-10-18).

export const SPECIAL_THEME_HOURS = 24;

type SpecialDay = { label: string; isDay: (day: string) => boolean };
const onDate = (monthDay: string) => (day: string) => day.slice(5) === monthDay;
const inSet = (days: ReadonlySet<string>) => (day: string) => days.has(day);

/** The special day of each special-day theme's achievement (achievements.ts ids). */
export const SPECIAL_DAYS: Readonly<Record<string, SpecialDay>> = {
  xmas: { label: '25 December', isDay: onDate('12-25') },
  val: { label: '14 February', isDay: onDate('02-14') },
  ny: { label: '1 January', isDay: onDate('01-01') },
  gh: { label: '6 March', isDay: onDate('03-06') },
  easter: { label: 'Easter Sunday', isDay: inSet(EASTER_DAYS) },
  eidfitr: { label: 'Eid al-Fitr', isDay: inSet(EID_AL_FITR_DAYS) },
  eidadha: { label: 'Eid al-Adha', isDay: inSet(EID_AL_ADHA_DAYS) },
};

/** 'YYYY-MM-DD' in the device's time zone (the same day the achievements count). */
export const localDayKey = (time: number) => {
  const d = new Date(time);
  return key(d.getFullYear(), d.getMonth() + 1, d.getDate());
};

/**
 * When the theme's 24 hours began: the learner's first study on the most recent
 * of its special days, or null if they never studied on one.
 */
export function specialThemeStart(achievement: string, studyTimes: Iterable<number>): number | null {
  const special = SPECIAL_DAYS[achievement];
  if (!special) return null;
  const firstByDay = new Map<string, number>();
  for (const time of studyTimes) {
    if (!(time > 0)) continue;
    const day = localDayKey(time);
    if (!special.isDay(day)) continue;
    const seen = firstByDay.get(day);
    if (seen === undefined || time < seen) firstByDay.set(day, time);
  }
  const latest = [...firstByDay.keys()].sort().pop();
  return latest ? firstByDay.get(latest)! : null;
}

/** True while the theme's 24 hours are running. */
export function specialThemeOpen(start: number | null, now: number) {
  return start !== null && now >= start && now < start + SPECIAL_THEME_HOURS * 3_600_000;
}

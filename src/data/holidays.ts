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

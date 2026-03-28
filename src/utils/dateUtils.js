// rn-fluid-calendar — Date Utilities

/**
 * Parse a date value (string | Date | undefined) → Date
 */
export function parseDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  // 'YYYY-MM-DD' — parse as local time to avoid UTC-offset shifting the day
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format a Date → 'YYYY-MM-DD'
 */
export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Return the number of days in a given month/year.
 */
export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Return the ISO week number for a given Date.
 */
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Build a 6-row, 7-column grid of Date objects for the given month.
 * firstDay: 0 = Sunday, 1 = Monday
 */
export function buildCalendarGrid(year, month, firstDay = 0) {
  const firstOfMonth = new Date(year, month, 1);
  const startDay = (firstOfMonth.getDay() - firstDay + 7) % 7;
  const totalDays = daysInMonth(year, month);
  const grid = [];
  let day = 1 - startDay;

  for (let row = 0; row < 6; row++) {
    const week = [];
    for (let col = 0; col < 7; col++) {
      week.push(new Date(year, month, day));
      day++;
    }
    grid.push(week);
  }
  return grid;
}

/**
 * Compare two date strings ('YYYY-MM-DD') — returns -1, 0, or 1.
 */
export function compareDateStrings(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Return true if dateStr is between startStr and endStr (inclusive).
 */
export function isBetween(dateStr, startStr, endStr) {
  return dateStr >= startStr && dateStr <= endStr;
}

/**
 * Format a header string using tokens {MMMM} and {YYYY}.
 */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatHeader(format, year, month) {
  if (!format) return `${MONTH_NAMES[month]} ${year}`;
  return format
    .replace('{MMMM}', MONTH_NAMES[month])
    .replace('{MMM}', MONTH_NAMES[month].slice(0, 3))
    .replace('{MM}', String(month + 1).padStart(2, '0'))
    .replace('{YYYY}', year)
    .replace('{YY}', String(year).slice(2));
}

export { MONTH_NAMES };

export const WEEKDAY_LABELS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const WEEKDAY_LABELS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

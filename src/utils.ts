/**
 * Get the number of days in a given month.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the weekday index (0=Sun) of the first day of the month.
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Format a Date to 'YYYY-MM-DD'.
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse an ISO date string 'YYYY-MM-DD' to a Date object (local midnight).
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Check if two dates represent the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a date is today.
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Add (or subtract) months from a date, clamping day to valid range.
 */
export function addMonths(date: Date, delta: number): Date {
  const result = new Date(date);
  const targetMonth = result.getMonth() + delta;
  result.setMonth(targetMonth);
  return result;
}

/**
 * Clamp a date between min and max.
 */
export function clampDate(date: Date, min?: Date, max?: Date): Date {
  let result = date;
  if (min && result < min) result = min;
  if (max && result > max) result = max;
  return result;
}

/**
 * Get week number for a date (ISO 8601).
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Build a map of marked dates for a date range (for period marking).
 * @example
 * const marks = buildPeriodMarks('2024-06-10', '2024-06-15', '#5B5EA6');
 */
export function buildPeriodMarks(
  startStr: string,
  endStr: string,
  color: string,
  textColor = '#fff'
): Record<string, object> {
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const result: Record<string, object> = {};
  const cur = new Date(start);

  while (cur <= end) {
    const str = formatDate(cur);
    result[str] = {
      color,
      textColor,
      startingDay: isSameDay(cur, start),
      endingDay: isSameDay(cur, end),
    };
    cur.setDate(cur.getDate() + 1);
  }

  return result;
}

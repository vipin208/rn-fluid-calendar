// rn-fluid-calendar — useCalendarState

import { useState, useCallback, useMemo } from 'react';
import {
  parseDate,
  toDateString,
  buildCalendarGrid,
  compareDateStrings,
} from '../utils/dateUtils';

/**
 * Manages the calendar's internal state:
 *   - current displayed month/year
 *   - selected dates / range
 *   - merged markedDates
 */
export function useCalendarState({
  initialDate,
  minDate: minDateProp,
  maxDate: maxDateProp,
  markedDates: externalMarkedDates = {},
  rangeSelection = false,
  firstDay = 0,
  onDayPress,
  onMonthChange,
}) {
  const initial = parseDate(initialDate);

  const [displayYear, setDisplayYear] = useState(initial.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(initial.getMonth());

  // Internal selection state
  const [rangeStart, setRangeStart] = useState(null); // 'YYYY-MM-DD'
  const [rangeEnd, setRangeEnd]   = useState(null);
  const [selectedDates, setSelectedDates] = useState({}); // { 'YYYY-MM-DD': true }

  const minDateStr = minDateProp ? toDateString(parseDate(minDateProp)) : null;
  const maxDateStr = maxDateProp ? toDateString(parseDate(maxDateProp)) : null;

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goToPrevMonth = useCallback(() => {
    setDisplayMonth(prev => {
      if (prev === 0) { setDisplayYear(y => y - 1); return 11; }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setDisplayMonth(prev => {
      if (prev === 11) { setDisplayYear(y => y + 1); return 0; }
      return prev + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setDisplayYear(now.getFullYear());
    setDisplayMonth(now.getMonth());
  }, []);

  const goToMonth = useCallback((year, month) => {
    setDisplayYear(year);
    setDisplayMonth(month);
    onMonthChange?.({
      month: month + 1,
      year,
      dateString: toDateString(new Date(year, month, 1)),
    });
  }, [onMonthChange]);

  // ── Day press ─────────────────────────────────────────────────────────────

  const handleDayPress = useCallback((date) => {
    const dateStr = toDateString(date);

    // Boundary check
    if (minDateStr && compareDateStrings(dateStr, minDateStr) < 0) return;
    if (maxDateStr && compareDateStrings(dateStr, maxDateStr) > 0) return;

    if (rangeSelection) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start a new range
        setRangeStart(dateStr);
        setRangeEnd(null);
      } else {
        // Complete the range
        if (compareDateStrings(dateStr, rangeStart) < 0) {
          setRangeEnd(rangeStart);
          setRangeStart(dateStr);
        } else {
          setRangeEnd(dateStr);
        }
      }
    } else {
      // Toggle single selection
      setSelectedDates(prev => {
        const next = { ...prev };
        if (next[dateStr]) {
          delete next[dateStr];
        } else {
          next[dateStr] = true;
        }
        return next;
      });
    }

    onDayPress?.({
      dateString: dateStr,
      date,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }, [rangeSelection, rangeStart, rangeEnd, minDateStr, maxDateStr, onDayPress]);

  // ── Derived: merged markedDates ───────────────────────────────────────────

  const mergedMarkedDates = useMemo(() => {
    const result = { ...externalMarkedDates };

    if (rangeSelection) {
      if (rangeStart) {
        result[rangeStart] = { ...result[rangeStart], selected: true, startingDay: true };
      }
      if (rangeEnd) {
        result[rangeEnd] = { ...result[rangeEnd], selected: true, endingDay: true };
        // Fill days in between
        const start = parseDate(rangeStart);
        const end   = parseDate(rangeEnd);
        const cursor = new Date(start);
        cursor.setDate(cursor.getDate() + 1);
        while (cursor < end) {
          const s = toDateString(cursor);
          result[s] = { ...result[s], selected: true };
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    } else {
      Object.keys(selectedDates).forEach(s => {
        result[s] = { ...result[s], selected: true };
      });
    }

    return result;
  }, [externalMarkedDates, selectedDates, rangeSelection, rangeStart, rangeEnd]);

  // ── Calendar grid ─────────────────────────────────────────────────────────

  const grid = useMemo(
    () => buildCalendarGrid(displayYear, displayMonth, firstDay),
    [displayYear, displayMonth, firstDay],
  );

  return {
    displayYear,
    displayMonth,
    grid,
    mergedMarkedDates,
    rangeStart,
    rangeEnd,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    goToMonth,
    handleDayPress,
  };
}

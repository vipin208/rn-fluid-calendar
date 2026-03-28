// rn-fluid-calendar — CalendarGrid

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayCell } from './DayCell';
import {
  toDateString,
  WEEKDAY_LABELS_SUN,
  WEEKDAY_LABELS_MON,
  getWeekNumber,
  isBetween,
} from '../utils/dateUtils';

export function CalendarGrid({
  theme: t,
  grid,
  displayMonth,
  displayYear,
  markedDates = {},
  rangeStart,
  rangeEnd,
  firstDay = 0,
  showWeekNumbers = false,
  minDateStr,
  maxDateStr,
  onDayPress,
}) {
  const labels = firstDay === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SUN;
  const todayStr = toDateString(new Date());
  const fontStyle = t.fontFamily ? { fontFamily: t.fontFamily } : {};

  const weekNumberWidth = showWeekNumbers ? 28 : 0;

  return (
    <View style={{ paddingHorizontal: t.containerPadding }}>
      {/* Weekday labels row */}
      <View style={styles.labelsRow}>
        {showWeekNumbers && <View style={{ width: weekNumberWidth }} />}
        {labels.map((label, i) => (
          <View key={i} style={[styles.labelCell, { flex: 1 }]}>
            <Text
              style={[
                styles.labelText,
                { color: t.weekdayTextColor, fontSize: t.weekdayFontSize },
                fontStyle,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Weeks */}
      {grid.map((week, rowIdx) => (
        <View key={rowIdx} style={[styles.weekRow, { marginVertical: t.rowGap / 2 }]}>
          {showWeekNumbers && (
            <View style={[styles.weekNumCell, { width: weekNumberWidth }]}>
              <Text style={[styles.weekNumText, { color: t.disabledDayTextColor, fontSize: t.weekdayFontSize - 1 }, fontStyle]}>
                {getWeekNumber(week[0])}
              </Text>
            </View>
          )}
          {week.map((date, colIdx) => {
            const dateStr  = toDateString(date);
            const marking  = markedDates[dateStr] || {};
            const isToday  = dateStr === todayStr;
            const isStart  = !!rangeStart && dateStr === rangeStart;
            const isEnd    = !!rangeEnd   && dateStr === rangeEnd;
            const inRange  = !!(rangeStart && rangeEnd && isBetween(dateStr, rangeStart, rangeEnd));

            return (
              <View key={colIdx} style={{ flex: 1, alignItems: 'center' }}>
                <DayCell
                  date={date}
                  displayMonth={displayMonth}
                  theme={t}
                  marking={marking}
                  isToday={isToday}
                  isRangeStart={isStart}
                  isRangeEnd={isEnd}
                  isInRange={inRange}
                  minDateStr={minDateStr}
                  maxDateStr={maxDateStr}
                  onPress={onDayPress}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  labelCell: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  labelText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekNumCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNumText: {
    fontWeight: '500',
  },
});

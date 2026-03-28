// rn-fluid-calendar — DayCell

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { toDateString } from '../utils/dateUtils';

/**
 * @param {object} props
 * @param {Date}   props.date
 * @param {number} props.displayMonth  – current month being shown (0-based)
 * @param {object} props.theme
 * @param {object} props.marking       – markedDates entry for this date
 * @param {boolean} props.isToday
 * @param {boolean} props.isRangeStart
 * @param {boolean} props.isRangeEnd
 * @param {boolean} props.isInRange
 * @param {string}  props.minDateStr
 * @param {string}  props.maxDateStr
 * @param {function} props.onPress
 * @param {boolean}  props.showWeekNumbers
 */
export const DayCell = React.memo(function DayCell({
  date,
  displayMonth,
  theme: t,
  marking = {},
  isToday,
  isRangeStart,
  isRangeEnd,
  isInRange,
  minDateStr,
  maxDateStr,
  onPress,
}) {
  const dateStr     = toDateString(date);
  const isOutOfMonth = date.getMonth() !== displayMonth;
  const isDisabled  = marking.disabled
    || (minDateStr && dateStr < minDateStr)
    || (maxDateStr && dateStr > maxDateStr);

  const isSelected  = marking.selected || isRangeStart || isRangeEnd;

  const fontStyle = t.fontFamily ? { fontFamily: t.fontFamily } : {};

  // ── Background ─────────────────────────────────────────────────────────────
  let circleBg = 'transparent';
  let textColor = isOutOfMonth
    ? t.disabledDayTextColor
    : isDisabled
    ? t.disabledDayTextColor
    : t.dayTextColor;
  let circleBorderRadius = t.dayCellSize / 2;

  if (isToday && !isSelected) {
    circleBg  = t.todayBackgroundColor;
    textColor = t.todayTextColor;
  }

  if (isSelected || marking.selected) {
    const color = marking.selectedColor || t.markedDateBackgroundColor;
    circleBg  = color;
    textColor = marking.selectedTextColor || t.markedDateTextColor;
  }

  // Range fill (in-between days): rectangular strip
  let rangeFill = 'transparent';
  let rangeLeft  = 'transparent';
  let rangeRight = 'transparent';

  if (isInRange && !isRangeStart && !isRangeEnd) {
    rangeFill = t.rangeFillColor;
  }
  if (isRangeStart && isRangeEnd) {
    // single day range — circle only
  } else if (isRangeStart) {
    rangeRight = t.rangeFillColor;
  } else if (isRangeEnd) {
    rangeLeft  = t.rangeFillColor;
  }

  const handlePress = useCallback(() => {
    if (!isDisabled && !isOutOfMonth) onPress(date);
  }, [date, isDisabled, isOutOfMonth, onPress]);

  const cellSize = t.dayCellSize;

  return (
    <TouchableOpacity
      activeOpacity={isDisabled || isOutOfMonth ? 1 : 0.75}
      onPress={handlePress}
      style={[styles.touchable, { width: cellSize + t.dayGap, paddingVertical: t.rowGap / 2 }]}
    >
      {/* Range strip layer */}
      <View style={[styles.rangeStrip, { backgroundColor: rangeFill }]}>
        <View style={[styles.rangeHalf, { backgroundColor: rangeLeft }]} />
        <View style={[styles.rangeHalf, { backgroundColor: rangeRight }]} />
      </View>

      {/* Circle */}
      <View
        style={[
          styles.circle,
          {
            width: cellSize,
            height: cellSize,
            borderRadius: circleBorderRadius,
            backgroundColor: circleBg,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: textColor,
              fontSize: t.dayFontSize,
              fontWeight: t.dayFontWeight,
            },
            fontStyle,
          ]}
        >
          {date.getDate()}
        </Text>
      </View>

      {/* Dot marker */}
      {(marking.marked) && (
        <View style={[styles.dot, { backgroundColor: marking.dotColor || t.dotColor }]} />
      )}

      {/* Note badge */}
      {marking.note ? (
        <Text
          numberOfLines={1}
          style={[
            styles.note,
            { color: marking.noteColor || t.weekdayTextColor, fontSize: Math.max(8, t.dayFontSize - 4) },
            fontStyle,
          ]}
        >
          {marking.note}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  rangeStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  rangeHalf: { flex: 1 },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  note: {
    marginTop: 1,
    textAlign: 'center',
    maxWidth: 36,
  },
});

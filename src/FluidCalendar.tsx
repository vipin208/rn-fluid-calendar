import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { FluidCalendarProps, CalendarRef } from './types';
import { defaultTheme, darkTheme } from './theme';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  isToday,
  addMonths,
} from './utils';

Dimensions.get('window');
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FluidCalendar = forwardRef<CalendarRef, FluidCalendarProps>((props, ref) => {
  const {
    // Theme
    theme: themeProp,
    darkMode = false,

    // Dates
    initialDate,
    minDate,
    maxDate,

    // Marked dates
    markedDates = {},
    markingType = 'dot',

    // Selection
    allowMultiSelect = false,
    onDayPress,
    onMonthChange,

    // Animation
    animationType = 'slide',
    animationDuration = 350,

    // Style overrides
    containerStyle,
    headerStyle,
    dayStyle,
    dayTextStyle,
    todayStyle,
    todayTextStyle,
    selectedDayStyle,
    selectedDayTextStyle,
    markedDotStyle,
    weekDayStyle,
    weekDayTextStyle,

    // Typography
    fontFamily,
    headerFontFamily,
    fontSize = 14,
    headerFontSize = 18,

    // Layout
    daySize = 40,
    calendarPadding = 16,
    dayGap = 4,
    weekRowGap = 6,

    // Header
    showArrows = true,
    renderArrowLeft,
    renderArrowRight,
    renderHeader,

    // Features
    firstDay = 0,
    hideDayNames = false,
    disableMonthChange = false,
    enableSwipeMonths = true,

    // Custom renders
    renderDay,
    renderDayName,
    dayNamesShort: dayNamesShortProp = DAY_NAMES,
  } = props;

  // Reorder day names based on firstDay (0=Sun, 1=Mon, etc.)
  const dayNamesShort = [
    ...dayNamesShortProp.slice(firstDay),
    ...dayNamesShortProp.slice(0, firstDay),
  ];

  const baseTheme = darkMode ? darkTheme : defaultTheme;
  const theme = { ...baseTheme, ...themeProp };

  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) return new Date(initialDate);
    return new Date();
  });

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [, setIsVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const monthSlideAnim = useRef(new Animated.Value(0)).current;

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    open: () => triggerOpen(),
    close: () => triggerClose(),
    goToMonth: (date: Date) => setCurrentDate(new Date(date)),
    clearSelection: () => setSelectedDates([]),
    getSelectedDates: () => selectedDates,
  }));

  const triggerOpen = useCallback(() => {
    setIsVisible(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.85);
    rotateAnim.setValue(0);
    flipAnim.setValue(0);

    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ];

    if (animationType === 'slide') {
      animations.push(
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'scale') {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'rotate') {
      animations.push(
        Animated.spring(rotateAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'flip') {
      animations.push(
        Animated.spring(flipAnim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [animationType, animationDuration]);

  const triggerClose = useCallback(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationDuration * 0.7,
        useNativeDriver: true,
      }),
    ];

    if (animationType === 'slide') {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 60,
          duration: animationDuration * 0.7,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'scale') {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: animationDuration * 0.7,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'rotate') {
      animations.push(
        Animated.timing(rotateAnim, { toValue: 0, duration: animationDuration * 0.7, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.85, duration: animationDuration * 0.7, useNativeDriver: true })
      );
    } else if (animationType === 'flip') {
      animations.push(
        Animated.timing(flipAnim, { toValue: 0, duration: animationDuration * 0.7, useNativeDriver: true })
      );
    }

    Animated.parallel(animations).start(() => setIsVisible(false));
  }, [animationType, animationDuration]);

  const getAnimatedStyle = () => {
    if (animationType === 'slide') {
      return {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      };
    } else if (animationType === 'scale') {
      return {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      };
    } else if (animationType === 'rotate') {
      const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-8deg', '0deg'],
      });
      return {
        opacity: fadeAnim,
        transform: [{ rotate }, { scale: scaleAnim }],
      };
    } else if (animationType === 'flip') {
      const rotateX = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-90deg', '0deg'],
      });
      return {
        opacity: fadeAnim,
        transform: [{ perspective: 1000 }, { rotateX }],
      };
    }
    return { opacity: fadeAnim };
  };

  // Swipe to change month
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        enableSwipeMonths && Math.abs(gestureState.dx) > 15,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          handleMonthChange(1);
        } else if (gestureState.dx > 50) {
          handleMonthChange(-1);
        }
      },
    })
  ).current;

  const handleMonthChange = useCallback(
    (delta: number) => {
      if (disableMonthChange) return;
      const newDate = addMonths(currentDate, delta);

      // Animate slide
      Animated.sequence([
        Animated.timing(monthSlideAnim, {
          toValue: delta < 0 ? 30 : -30,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(monthSlideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentDate(newDate);
      onMonthChange?.(newDate);
    },
    [currentDate, disableMonthChange, onMonthChange]
  );

  const handleDayPress = useCallback(
    (date: Date) => {
      const dateStr = formatDate(date);

      if (allowMultiSelect) {
        setSelectedDates((prev) => {
          if (prev.includes(dateStr)) {
            return prev.filter((d) => d !== dateStr);
          }
          return [...prev, dateStr];
        });
      } else {
        setSelectedDates([dateStr]);
      }

      onDayPress?.(date, dateStr);
    },
    [allowMultiSelect, onDayPress]
  );

  const isSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDates.includes(dateStr) || !!markedDates[dateStr]?.selected;
  };

  const buildCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];

    // Leading empty days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    // Trailing
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        days.push(null);
      }
    }

    return days;
  };

  const days = buildCalendarDays();

  const renderDayCell = (date: Date | null, index: number) => {
    if (!date) {
      return (
        <View
          key={`empty-${index}`}
          style={[styles.dayCell, { width: daySize, height: daySize, margin: dayGap / 2 }]}
        />
      );
    }

    const dateStr = formatDate(date);
    const marked = markedDates[dateStr];
    const selected = isSelected(date);
    const today = isToday(date);

    const isDisabled: boolean =
      !!(minDate && date < new Date(minDate)) ||
      !!(maxDate && date > new Date(maxDate));

    if (renderDay) {
      return (
        <View key={dateStr} style={{ margin: dayGap / 2 }}>
          {renderDay({ date, dateStr, marked, selected, today, isDisabled })}
        </View>
      );
    }

    const cellBg = selected
      ? theme.selectedDayBackgroundColor
      : today
      ? theme.todayBackgroundColor
      : 'transparent';

    const textColor = selected
      ? theme.selectedDayTextColor
      : today
      ? theme.todayTextColor
      : isDisabled
      ? theme.disabledTextColor
      : theme.dayTextColor;

    return (
      <TouchableOpacity
        key={dateStr}
        activeOpacity={isDisabled ? 1 : 0.7}
        onPress={() => !isDisabled && handleDayPress(date)}
        style={[
          styles.dayCell,
          {
            width: daySize,
            height: daySize,
            margin: dayGap / 2,
            borderRadius: daySize / 2,
            backgroundColor: cellBg,
          },
          today && !selected && todayStyle,
          selected && selectedDayStyle,
          dayStyle,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: textColor,
              fontSize,
              fontFamily: fontFamily,
            },
            today && !selected && todayTextStyle,
            selected && selectedDayTextStyle,
            dayTextStyle,
          ]}
        >
          {date.getDate()}
        </Text>

        {/* Dot marking */}
        {markingType === 'dot' && marked?.marked && (
          <View
            style={[
              styles.dot,
              { backgroundColor: marked.dotColor || theme.dotColor },
              markedDotStyle,
            ]}
          />
        )}

        {/* Multi-dot marking */}
        {markingType === 'multi-dot' && marked?.dots && (
          <View style={styles.dotRow}>
            {marked.dots.slice(0, 3).map((dot, i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: dot.color || theme.dotColor, marginHorizontal: 1 }]}
              />
            ))}
          </View>
        )}

        {/* Period marking */}
        {markingType === 'period' && marked?.startingDay && (
          <View
            style={[
              styles.periodStart,
              { backgroundColor: marked.color || theme.selectedDayBackgroundColor },
            ]}
          />
        )}
        {markingType === 'period' && marked?.endingDay && (
          <View
            style={[
              styles.periodEnd,
              { backgroundColor: marked.color || theme.selectedDayBackgroundColor },
            ]}
          />
        )}

        {/* Custom marking */}
        {markingType === 'custom' && marked?.customStyles && (
          <View style={[StyleSheet.absoluteFill, marked.customStyles.container]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderWeekRow = (weekDays: (Date | null)[], weekIndex: number) => (
    <View key={weekIndex} style={[styles.weekRow, { marginVertical: weekRowGap / 2 }]}>
      {weekDays.map((day, i) => renderDayCell(day, weekIndex * 7 + i))}
    </View>
  );

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const headerText = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColor,
          padding: calendarPadding,
          borderRadius: theme.borderRadius,
          shadowColor: theme.shadowColor,
          shadowOpacity: theme.shadowOpacity,
          shadowRadius: theme.shadowRadius,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },
        getAnimatedStyle(),
        containerStyle,
      ]}
      {...(enableSwipeMonths ? panResponder.panHandlers : {})}
    >
      {/* Header */}
      {renderHeader ? (
        renderHeader(currentDate)
      ) : (
        <View style={[styles.header, headerStyle]}>
          {showArrows && (
            <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.arrow}>
              {renderArrowLeft ? (
                renderArrowLeft()
              ) : (
                <Text style={[styles.arrowText, { color: theme.arrowColor }]}>‹</Text>
              )}
            </TouchableOpacity>
          )}

          <Animated.Text
            style={[
              styles.headerText,
              {
                color: theme.monthTextColor,
                fontSize: headerFontSize,
                fontFamily: headerFontFamily || fontFamily,
                transform: [{ translateY: monthSlideAnim }],
              },
            ]}
          >
            {headerText}
          </Animated.Text>

          {showArrows && (
            <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.arrow}>
              {renderArrowRight ? (
                renderArrowRight()
              ) : (
                <Text style={[styles.arrowText, { color: theme.arrowColor }]}>›</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Day names */}
      {!hideDayNames && (
        <View style={[styles.weekRow, weekDayStyle]}>
          {dayNamesShort.map((name, i) =>
            renderDayName ? (
              renderDayName(name, i)
            ) : (
              <View
                key={name}
                style={[styles.dayCell, { width: daySize, height: daySize, margin: dayGap / 2 }]}
              >
                <Text
                  style={[
                    styles.dayNameText,
                    { color: theme.dayNamesColor, fontSize: fontSize - 2, fontFamily },
                    weekDayTextStyle,
                  ]}
                >
                  {name}
                </Text>
              </View>
            )
          )}
        </View>
      )}

      {/* Calendar grid */}
      <View>{weeks.map((week, i) => renderWeekRow(week, i))}</View>
    </Animated.View>
  );
});

FluidCalendar.displayName = 'FluidCalendar';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerText: {
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  arrow: {
    padding: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '300',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontWeight: '500',
  },
  dayNameText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    position: 'absolute',
    bottom: 4,
  },
  dotRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
  },
  periodStart: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    left: '50%',
    opacity: 0.3,
  },
  periodEnd: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: '50%',
    opacity: 0.3,
  },
});

export default FluidCalendar;

import { StyleProp, ViewStyle, TextStyle } from 'react-native';

// ─── Marking ────────────────────────────────────────────────────────────────

export interface DotMarking {
  color: string;
  key?: string;
}

export interface MarkedDate {
  // Common
  selected?: boolean;
  disabled?: boolean;

  // Dot
  marked?: boolean;
  dotColor?: string;

  // Multi-dot
  dots?: DotMarking[];

  // Period
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;

  // Custom
  customStyles?: {
    container?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
  };
}

export interface MarkedDates {
  [date: string]: MarkedDate;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export interface CalendarTheme {
  backgroundColor?: string;
  calendarBackground?: string;
  textSectionTitleColor?: string;
  textSectionTitleDisabledColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayBackgroundColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  textDisabledColor?: string;
  disabledTextColor?: string;
  dotColor?: string;
  selectedDotColor?: string;
  arrowColor?: string;
  disabledArrowColor?: string;
  monthTextColor?: string;
  indicatorColor?: string;
  dayNamesColor?: string;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  borderRadius?: number;
}

// ─── Animation ───────────────────────────────────────────────────────────────

export type AnimationType = 'slide' | 'scale' | 'rotate' | 'flip' | 'fade';

export type MarkingType = 'dot' | 'multi-dot' | 'period' | 'custom' | 'none';

// ─── Day Render ──────────────────────────────────────────────────────────────

export interface DayRenderProps {
  date: Date;
  dateStr: string;
  marked?: MarkedDate;
  selected: boolean;
  today: boolean;
  isDisabled: boolean;
}

// ─── Ref ─────────────────────────────────────────────────────────────────────

export interface CalendarRef {
  /** Programmatically open/show with animation */
  open: () => void;
  /** Programmatically close/hide with animation */
  close: () => void;
  /** Navigate to a specific month */
  goToMonth: (date: Date) => void;
  /** Clear all selected dates */
  clearSelection: () => void;
  /** Get currently selected date strings */
  getSelectedDates: () => string[];
}

// ─── Main Props ──────────────────────────────────────────────────────────────

export interface FluidCalendarProps {
  // ── Theme ──────────────────────────────────────────────────
  /** Custom theme overrides */
  theme?: CalendarTheme;
  /** Toggle dark mode */
  darkMode?: boolean;

  // ── Dates ──────────────────────────────────────────────────
  /** Initial month to display (ISO string or Date) */
  initialDate?: string | Date;
  /** Minimum selectable date */
  minDate?: string | Date;
  /** Maximum selectable date */
  maxDate?: string | Date;

  // ── Marking ────────────────────────────────────────────────
  /** Object of marked dates keyed by 'YYYY-MM-DD' */
  markedDates?: MarkedDates;
  /** Marking style type */
  markingType?: MarkingType;

  // ── Selection ──────────────────────────────────────────────
  /** Allow selecting multiple dates */
  allowMultiSelect?: boolean;
  /** Callback when a day is pressed */
  onDayPress?: (date: Date, dateString: string) => void;
  /** Callback when the visible month changes */
  onMonthChange?: (date: Date) => void;

  // ── Animation ──────────────────────────────────────────────
  /** Opening/closing animation type */
  animationType?: AnimationType;
  /** Animation duration in ms */
  animationDuration?: number;

  // ── Style Overrides ────────────────────────────────────────
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  dayStyle?: StyleProp<ViewStyle>;
  dayTextStyle?: StyleProp<TextStyle>;
  todayStyle?: StyleProp<ViewStyle>;
  todayTextStyle?: StyleProp<TextStyle>;
  selectedDayStyle?: StyleProp<ViewStyle>;
  selectedDayTextStyle?: StyleProp<TextStyle>;
  markedDotStyle?: StyleProp<ViewStyle>;
  markedHighlightStyle?: StyleProp<ViewStyle>;
  weekDayStyle?: StyleProp<ViewStyle>;
  weekDayTextStyle?: StyleProp<TextStyle>;

  // ── Typography ─────────────────────────────────────────────
  /** Font family for all calendar text */
  fontFamily?: string;
  /** Font family for the month/year header */
  headerFontFamily?: string;
  /** Base font size for day numbers */
  fontSize?: number;
  /** Font size for the header */
  headerFontSize?: number;

  // ── Layout ─────────────────────────────────────────────────
  /** Size of each day cell (width & height) */
  daySize?: number;
  /** Horizontal padding inside calendar */
  calendarPadding?: number;
  /** Gap between day cells */
  dayGap?: number;
  /** Vertical gap between week rows */
  weekRowGap?: number;

  // ── Header ─────────────────────────────────────────────────
  /** Show prev/next arrows */
  showArrows?: boolean;
  /** Custom left arrow render */
  renderArrowLeft?: () => React.ReactNode;
  /** Custom right arrow render */
  renderArrowRight?: () => React.ReactNode;
  /** Custom header render; receives current Date */
  renderHeader?: (date: Date) => React.ReactNode;
  /** Date format string for the header */
  headerDateFormat?: string;

  // ── Features ───────────────────────────────────────────────
  /** Show week number column */
  showWeekNumbers?: boolean;
  /** First day of the week (0=Sun, 1=Mon) */
  firstDay?: number;
  /** Hide the day names row */
  hideDayNames?: boolean;
  /** Hide days that fall outside the current month */
  hideExtraDays?: boolean;
  /** Prevent swiping/tapping to change month */
  disableMonthChange?: boolean;
  /** Enable swipe gestures for month navigation */
  enableSwipeMonths?: boolean;

  // ── Custom Renders ─────────────────────────────────────────
  /** Fully custom day cell renderer */
  renderDay?: (props: DayRenderProps) => React.ReactNode;
  /** Custom day-name cell renderer */
  renderDayName?: (name: string, index: number) => React.ReactNode;
  /** Custom short day names array (length 7) */
  dayNamesShort?: string[];
}

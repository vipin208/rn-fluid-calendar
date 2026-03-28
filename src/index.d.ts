// rn-fluid-calendar - Type Definitions
// Author: rn-fluid-calendar contributors
// License: MIT

import { TextStyle, ViewStyle } from 'react-native';

// ─── Animation Types ──────────────────────────────────────────────────────────

export type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip';

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface CalendarTheme {
  /** Background color of the calendar container */
  backgroundColor?: string;
  /** Text color for day numbers */
  dayTextColor?: string;
  /** Text color for disabled/out-of-month days */
  disabledDayTextColor?: string;
  /** Text color for today's date */
  todayTextColor?: string;
  /** Background color for today's date */
  todayBackgroundColor?: string;
  /** Text color for the month/year header */
  headerTextColor?: string;
  /** Background color for the header */
  headerBackgroundColor?: string;
  /** Text color for weekday labels (Mon, Tue …) */
  weekdayTextColor?: string;
  /** Background color for marked (selected) dates */
  markedDateBackgroundColor?: string;
  /** Text color for marked dates */
  markedDateTextColor?: string;
  /** Color for dot markers */
  dotColor?: string;
  /** Arrow / chevron color for month navigation */
  arrowColor?: string;
  /** Border radius for the calendar container */
  borderRadius?: number;
  /** Font family applied to all text inside the calendar */
  fontFamily?: string;
  /** Font size for day numbers */
  dayFontSize?: number;
  /** Font size for weekday labels */
  weekdayFontSize?: number;
  /** Font size for the header text */
  headerFontSize?: number;
  /** Font weight for day numbers */
  dayFontWeight?: TextStyle['fontWeight'];
  /** Font weight for the header */
  headerFontWeight?: TextStyle['fontWeight'];
  /** Horizontal gap between day cells */
  dayGap?: number;
  /** Vertical gap between week rows */
  rowGap?: number;
  /** Padding inside each day cell */
  dayCellPadding?: number;
  /** Overall padding inside the calendar container */
  containerPadding?: number;
  /** Elevation / shadow depth (Android + iOS) */
  elevation?: number;
  /** Shadow color for the container */
  shadowColor?: string;
  /** Size of the day circle */
  dayCellSize?: number;
  /** Border width for the calendar container */
  borderWidth?: number;
  /** Border color for the calendar container */
  borderColor?: string;
  /** Background color for the selected date range start/end */
  rangeStartEndBackgroundColor?: string;
  /** Background color for dates within a selected range */
  rangeFillColor?: string;
}

// ─── Marked Dates ─────────────────────────────────────────────────────────────

export interface MarkedDate {
  /** Mark this date as selected */
  selected?: boolean;
  /** Mark this date as the start of a range */
  startingDay?: boolean;
  /** Mark this date as the end of a range */
  endingDay?: boolean;
  /** Show a dot below the day number */
  marked?: boolean;
  /** Custom dot color (overrides theme) */
  dotColor?: string;
  /** Custom background color for this date (overrides theme) */
  selectedColor?: string;
  /** Custom text color for this date (overrides theme) */
  selectedTextColor?: string;
  /** Disable interaction for this date */
  disabled?: boolean;
  /** Custom text to show as a badge/note */
  note?: string;
  /** Color for the note text */
  noteColor?: string;
}

export type MarkedDates = Record<string, MarkedDate>;

// ─── Events ───────────────────────────────────────────────────────────────────

export interface DayPressEvent {
  /** ISO date string: 'YYYY-MM-DD' */
  dateString: string;
  /** Full JavaScript Date object */
  date: Date;
  /** Day of month (1–31) */
  day: number;
  /** Month (1–12) */
  month: number;
  /** Full year */
  year: number;
}

export interface MonthChangeEvent {
  /** Month (1–12) */
  month: number;
  /** Full year */
  year: number;
  /** ISO string for the first day of the displayed month */
  dateString: string;
}

// ─── Main Component Props ─────────────────────────────────────────────────────

export interface FluidCalendarProps {
  // ── Visibility ──────────────────────────────────────────────────────────────
  /** Whether the calendar is visible */
  visible?: boolean;
  /** Callback fired when the calendar requests to close */
  onClose?: () => void;

  // ── Mode ────────────────────────────────────────────────────────────────────
  /** Color scheme. Defaults to 'light' */
  mode?: 'light' | 'dark';
  /** Display the calendar inline (no modal wrapper) */
  inline?: boolean;

  // ── Animation ────────────────────────────────────────────────────────────────
  /** Animation played when opening/closing the calendar. Default: 'fade' */
  animationType?: AnimationType;
  /** Duration of the open/close animation in ms. Default: 300 */
  animationDuration?: number;

  // ── Initial / Controlled Date ────────────────────────────────────────────────
  /** Initially displayed month. ISO string or Date. Defaults to current month */
  initialDate?: string | Date;
  /** Minimum selectable date */
  minDate?: string | Date;
  /** Maximum selectable date */
  maxDate?: string | Date;

  // ── Selection ────────────────────────────────────────────────────────────────
  /** Allow selecting a date range (start → end) */
  rangeSelection?: boolean;
  /** Programmatically provide marked dates */
  markedDates?: MarkedDates;

  // ── Events ───────────────────────────────────────────────────────────────────
  /** Fired when a day is tapped */
  onDayPress?: (event: DayPressEvent) => void;
  /** Fired when navigating to a different month */
  onMonthChange?: (event: MonthChangeEvent) => void;

  // ── Appearance ───────────────────────────────────────────────────────────────
  /** Override any theme token */
  theme?: CalendarTheme;
  /** Override style of the outer container View */
  style?: ViewStyle;
  /** First day of the week: 0 = Sunday, 1 = Monday */
  firstDay?: 0 | 1;
  /** Show the "today" button in the header */
  showTodayButton?: boolean;
  /** Label for the "today" button */
  todayButtonLabel?: string;
  /** Show week numbers in the leftmost column */
  showWeekNumbers?: boolean;
  /** Custom header format string. Tokens: {MMMM} {YYYY} */
  headerFormat?: string;
  /** Show a month/year picker when tapping the header */
  enableMonthYearPicker?: boolean;
  /** Backdrop opacity for modal mode (0–1). Default: 0.5 */
  backdropOpacity?: number;
  /** Custom backdrop color. Default: '#000000' */
  backdropColor?: string;
  /** Close the modal when tapping the backdrop */
  closeOnBackdropPress?: boolean;
}

// ─── Inline Calendar Props (subset) ──────────────────────────────────────────

export type InlineCalendarProps = Omit<
  FluidCalendarProps,
  'visible' | 'onClose' | 'animationType' | 'animationDuration' | 'backdropOpacity' | 'backdropColor' | 'closeOnBackdropPress'
> & {
  style?: ViewStyle;
};

// ─── Default export ───────────────────────────────────────────────────────────

declare const FluidCalendar: React.FC<FluidCalendarProps>;
export { FluidCalendar };
export default FluidCalendar;

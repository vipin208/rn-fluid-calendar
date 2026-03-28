import { CalendarTheme } from './types';

export const defaultTheme: Required<CalendarTheme> = {
  backgroundColor: '#FFFFFF',
  calendarBackground: '#FFFFFF',
  textSectionTitleColor: '#B6C1CD',
  textSectionTitleDisabledColor: '#D9E1E8',
  selectedDayBackgroundColor: '#5B5EA6',
  selectedDayTextColor: '#FFFFFF',
  todayBackgroundColor: '#EEF0FF',
  todayTextColor: '#5B5EA6',
  dayTextColor: '#2D4150',
  textDisabledColor: '#D9E1E8',
  disabledTextColor: '#CCCCCC',
  dotColor: '#5B5EA6',
  selectedDotColor: '#FFFFFF',
  arrowColor: '#5B5EA6',
  disabledArrowColor: '#D9E1E8',
  monthTextColor: '#2D4150',
  indicatorColor: '#5B5EA6',
  dayNamesColor: '#A0A0A0',
  shadowColor: '#000000',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  borderRadius: 20,
};

export const darkTheme: Required<CalendarTheme> = {
  backgroundColor: '#1C1C2E',
  calendarBackground: '#1C1C2E',
  textSectionTitleColor: '#6E6E8A',
  textSectionTitleDisabledColor: '#333347',
  selectedDayBackgroundColor: '#7B7FE8',
  selectedDayTextColor: '#FFFFFF',
  todayBackgroundColor: '#2A2A45',
  todayTextColor: '#A9ABFF',
  dayTextColor: '#E8E8FF',
  textDisabledColor: '#333347',
  disabledTextColor: '#444460',
  dotColor: '#7B7FE8',
  selectedDotColor: '#FFFFFF',
  arrowColor: '#7B7FE8',
  disabledArrowColor: '#444460',
  monthTextColor: '#E8E8FF',
  indicatorColor: '#7B7FE8',
  dayNamesColor: '#6E6E8A',
  shadowColor: '#000000',
  shadowOpacity: 0.4,
  shadowRadius: 20,
  borderRadius: 20,
};

/**
 * Create a fully merged theme from partial overrides.
 * @param base     'light' | 'dark'
 * @param overrides Partial theme object to merge on top
 */
export function createTheme(
  base: 'light' | 'dark' = 'light',
  overrides: CalendarTheme = {}
): Required<CalendarTheme> {
  const baseTheme = base === 'dark' ? darkTheme : defaultTheme;
  return { ...baseTheme, ...overrides };
}

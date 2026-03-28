# rn-fluid-calendar

<div align="center">

[![npm version](https://img.shields.io/npm/v/rn-fluid-calendar.svg?style=flat-square)](https://www.npmjs.com/package/rn-fluid-calendar)
[![npm downloads](https://img.shields.io/npm/dm/rn-fluid-calendar.svg?style=flat-square)](https://www.npmjs.com/package/rn-fluid-calendar)
[![license](https://img.shields.io/npm/l/rn-fluid-calendar.svg?style=flat-square)](https://github.com/vipin208/rn-fluid-calendar/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey.svg?style=flat-square)](https://reactnative.dev/)

**A modern, highly customizable React Native calendar component.**

</div>

---

### ✨ Features

- 🌙 **Dark & Light mode** out of the box
- 🎬 **5 animation types**: `slide`, `scale`, `rotate`, `flip`, `fade`
- 📍 **4 marking types**: `dot`, `multi-dot`, `period`, `custom`
- ✅ **Single & multi-date selection**
- 🎨 **Full style control** — fonts, colors, sizes, gaps, border radius, shadows
- 📦 **Zero native dependencies** — pure JS/TS with React Native `Animated` API
- 💪 **TypeScript-first** with complete type exports
- 👆 **Swipe gesture** support for month navigation
- 🔗 **Imperative ref API** (`open`, `close`, `goToMonth`, etc.)

---

## Installation

```bash
npm install rn-fluid-calendar
# or
yarn add rn-fluid-calendar
```

No native linking required.

---

## Quick Start

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import FluidCalendar, { CalendarRef } from 'rn-fluid-calendar';

export default function App() {
  const calRef = useRef<CalendarRef>(null);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Open Calendar" onPress={() => calRef.current?.open()} />
      <Button title="Close Calendar" onPress={() => calRef.current?.close()} />

      <FluidCalendar
        ref={calRef}
        darkMode={false}
        animationType="slide"
        onDayPress={(date, dateStr) => console.log('Selected:', dateStr)}
        onMonthChange={(date) => console.log('Month changed:', date)}
      />
    </View>
  );
}
```

---

## Examples

### 1. Basic Calendar

```tsx
import FluidCalendar from 'rn-fluid-calendar';

<FluidCalendar
  onDayPress={(date, dateStr) => console.log(dateStr)}
/>
```

---

### 2. Dark Mode Calendar

```tsx
<FluidCalendar
  darkMode
  animationType="fade"
  onDayPress={(date, dateStr) => console.log('Dark mode picked:', dateStr)}
/>
```

---

### 3. Multi-Date Selection

```tsx
import React, { useState } from 'react';
import { Text } from 'react-native';
import FluidCalendar from 'rn-fluid-calendar';

export default function MultiSelectExample() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <>
      <FluidCalendar
        allowMultiSelect
        onDayPress={(date, dateStr) =>
          setSelected((prev) =>
            prev.includes(dateStr)
              ? prev.filter((d) => d !== dateStr)
              : [...prev, dateStr]
          )
        }
      />
      <Text>Selected: {selected.join(', ')}</Text>
    </>
  );
}
```

---

### 4. Dot Marking

```tsx
<FluidCalendar
  markingType="dot"
  markedDates={{
    '2024-06-10': { marked: true, dotColor: '#FF6B6B' },
    '2024-06-15': { marked: true, dotColor: '#5B5EA6' },
    '2024-06-20': { marked: true, selected: true },
  }}
/>
```

---

### 5. Multi-Dot Marking

```tsx
<FluidCalendar
  markingType="multi-dot"
  markedDates={{
    '2024-06-15': {
      dots: [
        { key: 'work',  color: '#5B5EA6' },
        { key: 'gym',   color: '#FF6B6B' },
        { key: 'lunch', color: '#4CAF50' },
      ],
    },
    '2024-06-20': {
      dots: [
        { key: 'meeting', color: '#FF9800' },
      ],
    },
  }}
/>
```

---

### 6. Period Range Marking

```tsx
import FluidCalendar, { buildPeriodMarks } from 'rn-fluid-calendar';

const marks = buildPeriodMarks('2024-06-10', '2024-06-15', '#5B5EA6');

<FluidCalendar
  markingType="period"
  markedDates={marks}
/>
```

---

### 7. Custom Marking

```tsx
<FluidCalendar
  markingType="custom"
  markedDates={{
    '2024-06-15': {
      customStyles: {
        container: {
          backgroundColor: '#FF6B6B',
          borderRadius: 8,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    },
  }}
/>
```

---

### 8. Min / Max Date Restriction

```tsx
<FluidCalendar
  minDate="2024-06-01"
  maxDate="2024-06-30"
  onDayPress={(date, dateStr) => console.log('Restricted pick:', dateStr)}
/>
```

---

### 9. All Animation Types

```tsx
// Try: 'slide' | 'scale' | 'rotate' | 'flip' | 'fade'
<FluidCalendar
  animationType="flip"
  animationDuration={400}
/>
```

---

### 10. Custom Typography & Layout

```tsx
<FluidCalendar
  fontFamily="Poppins-Regular"
  headerFontFamily="Poppins-Bold"
  fontSize={15}
  headerFontSize={20}
  daySize={44}
  dayGap={6}
  weekRowGap={8}
  calendarPadding={20}
/>
```

---

### 11. Custom Theme Colors

```tsx
import FluidCalendar, { createTheme } from 'rn-fluid-calendar';

const myTheme = createTheme('light', {
  selectedDayBackgroundColor: '#FF6B6B',
  todayTextColor: '#FF6B6B',
  dotColor: '#FF6B6B',
  borderRadius: 24,
  arrowColor: '#FF6B6B',
});

<FluidCalendar theme={myTheme} />
```

---

### 12. Style Overrides

```tsx
<FluidCalendar
  containerStyle={{ borderWidth: 1, borderColor: '#ddd', margin: 8 }}
  headerStyle={{ backgroundColor: '#f5f5f5', borderRadius: 12 }}
  dayStyle={{ borderRadius: 4 }}
  dayTextStyle={{ fontWeight: '700' }}
  todayStyle={{ borderWidth: 2, borderColor: '#5B5EA6' }}
  selectedDayStyle={{ borderWidth: 2, borderColor: '#FF6B6B' }}
  weekDayTextStyle={{ letterSpacing: 1 }}
/>
```

---

### 13. Custom Header

```tsx
import { Text, View } from 'react-native';

<FluidCalendar
  renderHeader={(date) => (
    <View style={{ alignItems: 'center', paddingVertical: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#5B5EA6' }}>
        {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
      </Text>
    </View>
  )}
/>
```

---

### 14. Custom Arrow Buttons

```tsx
import { Text } from 'react-native';

<FluidCalendar
  renderArrowLeft={() => <Text style={{ fontSize: 20 }}>◀</Text>}
  renderArrowRight={() => <Text style={{ fontSize: 20 }}>▶</Text>}
/>
```

---

### 15. Custom Day Cell Renderer

```tsx
import { Text, TouchableOpacity, View } from 'react-native';
import FluidCalendar, { DayRenderProps } from 'rn-fluid-calendar';

<FluidCalendar
  renderDay={({ date, selected, today, isDisabled }: DayRenderProps) => (
    <TouchableOpacity
      style={{
        width: 40, height: 40,
        borderRadius: 8,
        backgroundColor: selected ? '#FF6B6B' : today ? '#EEF' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDisabled ? 0.3 : 1,
      }}
    >
      <Text style={{ color: selected ? '#fff' : '#333' }}>
        {date.getDate()}
      </Text>
    </TouchableOpacity>
  )}
/>
```

---

### 16. Custom Day Name Labels

```tsx
<FluidCalendar
  dayNamesShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
/>
```

---

### 17. Week Starting on Monday

```tsx
<FluidCalendar firstDay={1} />
```

---

### 18. Hide Day Names Row

```tsx
<FluidCalendar hideDayNames />
```

---

### 19. Disable Month Change (Lock Month)

```tsx
<FluidCalendar
  disableMonthChange
  showArrows={false}
/>
```

---

### 20. Programmatic Ref Control

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import FluidCalendar, { CalendarRef } from 'rn-fluid-calendar';

export default function RefExample() {
  const calRef = useRef<CalendarRef>(null);

  return (
    <View style={{ flex: 1, gap: 8, padding: 16 }}>
      <Button title="Open"          onPress={() => calRef.current?.open()} />
      <Button title="Close"         onPress={() => calRef.current?.close()} />
      <Button title="Go to Jan 2025" onPress={() => calRef.current?.goToMonth(new Date(2025, 0, 1))} />
      <Button title="Clear Selection" onPress={() => calRef.current?.clearSelection()} />
      <Button
        title="Log Selected Dates"
        onPress={() => console.log(calRef.current?.getSelectedDates())}
      />

      <FluidCalendar ref={calRef} allowMultiSelect />
    </View>
  );
}
```

---

### 21. Full Customization Kitchen Sink

```tsx
import React, { useRef } from 'react';
import { View, Text, Button } from 'react-native';
import FluidCalendar, {
  CalendarRef,
  buildPeriodMarks,
  createTheme,
} from 'rn-fluid-calendar';

const theme = createTheme('dark', {
  selectedDayBackgroundColor: '#FF6B6B',
  todayTextColor: '#FF6B6B',
  dotColor: '#FF6B6B',
  borderRadius: 24,
});

const marks = {
  ...buildPeriodMarks('2024-06-10', '2024-06-15', '#FF6B6B'),
  '2024-06-20': { marked: true, dotColor: '#4CAF50' },
};

export default function FullExample() {
  const calRef = useRef<CalendarRef>(null);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Open" onPress={() => calRef.current?.open()} />

      <FluidCalendar
        ref={calRef}
        darkMode
        animationType="flip"
        animationDuration={400}
        allowMultiSelect
        markingType="period"
        markedDates={marks}
        minDate="2024-01-01"
        maxDate="2024-12-31"
        daySize={44}
        dayGap={6}
        weekRowGap={8}
        calendarPadding={20}
        fontSize={15}
        headerFontSize={20}
        fontFamily="System"
        theme={theme}
        firstDay={1}
        enableSwipeMonths
        containerStyle={{ borderWidth: 1, borderColor: '#333' }}
        selectedDayStyle={{ borderWidth: 2, borderColor: '#FF6B6B' }}
        renderArrowLeft={() => <Text style={{ color: '#FF6B6B', fontSize: 22 }}>◀</Text>}
        renderArrowRight={() => <Text style={{ color: '#FF6B6B', fontSize: 22 }}>▶</Text>}
        onDayPress={(date, str) => console.log('Pressed:', str)}
        onMonthChange={(date) => console.log('Month:', date.toDateString())}
      />
    </View>
  );
}
```

---

## Props Reference

### Theme

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `darkMode` | `boolean` | `false` | Enable dark theme |
| `theme` | `CalendarTheme` | `{}` | Fine-grained theme overrides |

### Dates

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialDate` | `string \| Date` | today | Starting month to display |
| `minDate` | `string \| Date` | — | Minimum selectable date |
| `maxDate` | `string \| Date` | — | Maximum selectable date |

### Marking

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `markedDates` | `MarkedDates` | `{}` | Map of dates keyed by `'YYYY-MM-DD'` |
| `markingType` | `'dot' \| 'multi-dot' \| 'period' \| 'custom' \| 'none'` | `'dot'` | Marking visual style |

### Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowMultiSelect` | `boolean` | `false` | Allow selecting multiple dates |
| `onDayPress` | `(date: Date, dateStr: string) => void` | — | Fires when a day is tapped |
| `onMonthChange` | `(date: Date) => void` | — | Fires when month changes |

### Animation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationType` | `'slide' \| 'scale' \| 'rotate' \| 'flip' \| 'fade'` | `'slide'` | Open/close animation style |
| `animationDuration` | `number` | `350` | Animation duration in ms |

### Typography

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fontFamily` | `string` | system font | Font for day numbers and names |
| `headerFontFamily` | `string` | same as `fontFamily` | Font for month/year header |
| `fontSize` | `number` | `14` | Base font size |
| `headerFontSize` | `number` | `18` | Header font size |

### Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `daySize` | `number` | `40` | Width & height of each day cell |
| `calendarPadding` | `number` | `16` | Inner padding of the calendar |
| `dayGap` | `number` | `4` | Horizontal gap between day cells |
| `weekRowGap` | `number` | `6` | Vertical gap between week rows |

### Style Overrides

All accept React Native `StyleProp<ViewStyle | TextStyle>`:

| Prop | Applies to |
|------|-----------|
| `containerStyle` | Outer calendar wrapper |
| `headerStyle` | Month/year header row |
| `dayStyle` | Every day cell |
| `dayTextStyle` | Every day number |
| `todayStyle` | Today's cell |
| `todayTextStyle` | Today's number |
| `selectedDayStyle` | Selected day cell |
| `selectedDayTextStyle` | Selected day number |
| `markedDotStyle` | The dot indicator |
| `markedHighlightStyle` | Highlight for marked day |
| `weekDayStyle` | Day-name row container |
| `weekDayTextStyle` | Day-name text |

### Header Customization

| Prop | Type | Description |
|------|------|-------------|
| `showArrows` | `boolean` | Show/hide prev/next arrows |
| `renderArrowLeft` | `() => ReactNode` | Custom left arrow |
| `renderArrowRight` | `() => ReactNode` | Custom right arrow |
| `renderHeader` | `(date: Date) => ReactNode` | Completely custom header |
| `headerDateFormat` | `string` | Date format string for header label |

### Features

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableSwipeMonths` | `boolean` | `true` | Swipe left/right to change month |
| `disableMonthChange` | `boolean` | `false` | Lock the displayed month |
| `hideDayNames` | `boolean` | `false` | Hide the Sun–Sat row |
| `hideExtraDays` | `boolean` | `false` | Hide days from adjacent months |
| `showWeekNumbers` | `boolean` | `false` | Show ISO week number column |
| `firstDay` | `number` | `0` | First day of week (0=Sun, 1=Mon) |
| `dayNamesShort` | `string[]` | `['Sun','Mon',...]` | Custom day-name labels |

### Custom Renders

| Prop | Type | Description |
|------|------|-------------|
| `renderDay` | `(props: DayRenderProps) => ReactNode` | Fully custom day cell |
| `renderDayName` | `(name: string, index: number) => ReactNode` | Custom day-name cell |

---

## CalendarTheme Interface

```ts
interface CalendarTheme {
  backgroundColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayBackgroundColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  disabledTextColor?: string;
  dotColor?: string;
  arrowColor?: string;
  monthTextColor?: string;
  dayNamesColor?: string;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  borderRadius?: number;
}
```

Use `createTheme` helper:

```ts
import { createTheme } from 'rn-fluid-calendar';

// base: 'light' | 'dark'
const myTheme = createTheme('dark', {
  selectedDayBackgroundColor: '#FF6B6B',
  borderRadius: 12,
});
```

---

## CalendarRef API

```tsx
const calRef = useRef<CalendarRef>(null);

calRef.current?.open();                        // Animate calendar in
calRef.current?.close();                       // Animate calendar out
calRef.current?.goToMonth(new Date(2025, 0)); // Jump to Jan 2025
calRef.current?.clearSelection();              // Clear selected dates
calRef.current?.getSelectedDates();            // Returns string[] of 'YYYY-MM-DD'
```

---

## Utility Functions

```ts
import {
  formatDate,        // Date → 'YYYY-MM-DD'
  parseDate,         // 'YYYY-MM-DD' → Date
  buildPeriodMarks,  // Build period range MarkedDates map
  getWeekNumber,     // Get ISO week number for a date
} from 'rn-fluid-calendar';
```

### `buildPeriodMarks(start, end, color, textColor?)`

```ts
const marks = buildPeriodMarks('2024-06-10', '2024-06-15', '#5B5EA6');
// Returns a MarkedDates object ready to pass as markedDates prop
```

---

## DayRenderProps

```ts
interface DayRenderProps {
  date: Date;
  dateStr: string;        // 'YYYY-MM-DD'
  marked?: MarkedDate;
  selected: boolean;
  today: boolean;
  isDisabled: boolean;
}
```

---

## Animation Types

| Type | Effect |
|------|--------|
| `slide` | Slides up from below with spring physics |
| `scale` | Scales from 85% to 100% |
| `rotate` | Rotates in from a slight tilt |
| `flip` | 3D flip on the X axis |
| `fade` | Simple opacity fade-in/out |

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repository
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m 'feat: add your-feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

MIT © [Vipin Jaiswal](https://github.com/vipin208)

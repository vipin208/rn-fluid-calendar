// rn-fluid-calendar — CalendarHeader

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { formatHeader, MONTH_NAMES } from '../utils/dateUtils';

const YEARS = Array.from({ length: 201 }, (_, i) => 1920 + i);

export function CalendarHeader({
  theme,
  displayYear,
  displayMonth,
  headerFormat,
  showTodayButton,
  todayButtonLabel = 'Today',
  enableMonthYearPicker,
  onPrev,
  onNext,
  onToday,
  onMonthYearSelect,
}) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState('month'); // 'month' | 'year'

  const headerText = formatHeader(headerFormat, displayYear, displayMonth);

  const t = theme;
  const fontStyle = t.fontFamily ? { fontFamily: t.fontFamily } : {};

  return (
    <View style={[styles.header, { backgroundColor: t.headerBackgroundColor, paddingHorizontal: t.containerPadding }]}>
      {/* Prev Arrow */}
      <TouchableOpacity onPress={onPrev} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.arrow}>
        <Text style={[styles.arrowText, { color: t.arrowColor }, fontStyle]}>‹</Text>
      </TouchableOpacity>

      {/* Header Title */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          onPress={() => enableMonthYearPicker && (setPickerMode('month'), setPickerVisible(true))}
          activeOpacity={enableMonthYearPicker ? 0.7 : 1}
        >
          <Text
            style={[
              styles.headerText,
              {
                color: t.headerTextColor,
                fontSize: t.headerFontSize,
                fontWeight: t.headerFontWeight,
              },
              fontStyle,
            ]}
          >
            {headerText}
          </Text>
        </TouchableOpacity>

        {showTodayButton && (
          <TouchableOpacity onPress={onToday} style={[styles.todayBtn, { borderColor: t.arrowColor }]}>
            <Text style={[styles.todayBtnText, { color: t.arrowColor, fontSize: t.weekdayFontSize }, fontStyle]}>
              {todayButtonLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Next Arrow */}
      <TouchableOpacity onPress={onNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.arrow}>
        <Text style={[styles.arrowText, { color: t.arrowColor }, fontStyle]}>›</Text>
      </TouchableOpacity>

      {/* Month / Year Picker Modal */}
      {enableMonthYearPicker && (
        <Modal transparent visible={pickerVisible} animationType="fade" onRequestClose={() => setPickerVisible(false)}>
          <TouchableOpacity style={styles.pickerBackdrop} activeOpacity={1} onPress={() => setPickerVisible(false)}>
            <View style={[styles.pickerContainer, { backgroundColor: t.backgroundColor, borderRadius: t.borderRadius }]}>
              {/* Mode toggle */}
              <View style={styles.pickerModeRow}>
                {['month', 'year'].map(m => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setPickerMode(m)}
                    style={[
                      styles.pickerModeBtn,
                      pickerMode === m && { backgroundColor: t.markedDateBackgroundColor },
                    ]}
                  >
                    <Text style={[
                      styles.pickerModeBtnText,
                      { color: pickerMode === m ? t.markedDateTextColor : t.dayTextColor },
                      fontStyle,
                    ]}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {pickerMode === 'month' ? (
                <View style={styles.monthGrid}>
                  {MONTH_NAMES.map((name, idx) => (
                    <TouchableOpacity
                      key={name}
                      style={[
                        styles.monthCell,
                        idx === displayMonth && { backgroundColor: t.markedDateBackgroundColor, borderRadius: 8 },
                      ]}
                      onPress={() => {
                        onMonthYearSelect(displayYear, idx);
                        setPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.monthCellText,
                        {
                          color: idx === displayMonth ? t.markedDateTextColor : t.dayTextColor,
                          fontSize: t.dayFontSize,
                        },
                        fontStyle,
                      ]}>
                        {name.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <FlatList
                  data={YEARS}
                  keyExtractor={item => String(item)}
                  style={{ maxHeight: 220 }}
                  getItemLayout={(_, index) => ({ length: 44, offset: 44 * index, index })}
                  initialScrollIndex={YEARS.indexOf(displayYear)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.yearRow,
                        item === displayYear && { backgroundColor: t.markedDateBackgroundColor, borderRadius: 8 },
                      ]}
                      onPress={() => {
                        onMonthYearSelect(item, displayMonth);
                        setPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        { color: item === displayYear ? t.markedDateTextColor : t.dayTextColor, fontSize: t.dayFontSize },
                        fontStyle,
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  arrow: { padding: 4 },
  arrowText: { fontSize: 28, lineHeight: 30, fontWeight: '300' },
  titleRow: { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  headerText: {},
  todayBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  todayBtnText: {},
  // Picker
  pickerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  pickerContainer: { width: 280, padding: 16, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  pickerModeRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  pickerModeBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
  pickerModeBtnText: { fontWeight: '600' },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  monthCell: { width: '25%', alignItems: 'center', paddingVertical: 10 },
  monthCellText: { fontWeight: '500' },
  yearRow: { height: 44, justifyContent: 'center', alignItems: 'center' },
});

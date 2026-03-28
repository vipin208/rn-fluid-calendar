// rn-fluid-calendar — useCalendarAnimation
// Provides open/close animated values for 4 animation types:
//   fade | slide | zoom | flip
//
// Uses React Native's built-in Animated API so the package works without
// react-native-reanimated (which is an optional peer dep).

import { useEffect, useRef, useMemo } from 'react';
import { Animated, Easing, Dimensions } from 'react-native';

const { height: SCREEN_H } = Dimensions.get('window');

/**
 * @param {object} options
 * @param {boolean} options.visible
 * @param {'fade'|'slide'|'zoom'|'flip'} options.animationType
 * @param {number} options.duration  ms
 * @returns {{ animatedStyle: object, containerStyle: object }}
 */
export function useCalendarAnimation({ visible, animationType = 'fade', duration = 300 }) {
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration,
      easing: visible ? Easing.out(Easing.back(1.4)) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, duration]);

  const animatedStyle = useMemo(() => {
    switch (animationType) {
      // ── 1. FADE ──────────────────────────────────────────────────────────────
      case 'fade':
        return {
          opacity: progress,
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        };

      // ── 2. SLIDE (from bottom) ────────────────────────────────────────────────
      case 'slide':
        return {
          opacity: progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [SCREEN_H * 0.35, 0],
              }),
            },
          ],
        };

      // ── 3. ZOOM ───────────────────────────────────────────────────────────────
      case 'zoom':
        return {
          opacity: progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.8, 1] }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
        };

      // ── 4. FLIP (perspective Y rotation) ────────────────────────────────────
      case 'flip':
        return {
          opacity: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.5, 1] }),
          transform: [
            { perspective: 800 },
            {
              rotateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['-90deg', '0deg'],
              }),
            },
          ],
        };

      default:
        return { opacity: progress };
    }
  }, [animationType, progress]);

  // Backdrop opacity (always fades)
  const backdropStyle = {
    opacity: progress,
  };

  return { animatedStyle, backdropStyle };
}

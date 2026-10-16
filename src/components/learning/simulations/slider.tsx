import { useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';

import type { ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

import { type SimSliderProps, snap } from './slider-types';

// Phones: drag or tap anywhere on the track. (The web uses slider.web.tsx.)
export function SimSlider({ value, min, max, step, disabled, onChange, accessibilityLabel, valueText }: SimSliderProps) {
  const styles = useThemedStyles(createStyles);
  const [width, setWidth] = useState(0);
  const latest = useRef({ width, min, max, step, disabled, onChange });
  latest.current = { width, min, max, step, disabled, onChange };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !latest.current.disabled,
        onMoveShouldSetPanResponder: () => !latest.current.disabled,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => move(event.nativeEvent.locationX),
        onPanResponderMove: (event) => move(event.nativeEvent.locationX),
      }),
    []
  );

  function move(x: number) {
    const { width: w, min: lo, max: hi, step: s, onChange: change } = latest.current;
    if (w <= 0) return;
    change(snap(lo + (Math.min(w, Math.max(0, x)) / w) * (hi - lo), lo, hi, s));
  }

  const fraction = max > min ? (value - min) / (max - min) : 0;
  const nudge = (direction: 1 | -1) => onChange(snap(value + direction * step, min, max, step));

  return (
    <View
      style={styles.hit}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: valueText }}
      accessibilityState={{ disabled: Boolean(disabled) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => nudge(event.nativeEvent.actionName === 'increment' ? 1 : -1)}
      {...responder.panHandlers}
    >
      <View style={styles.track} pointerEvents="none">
        <View style={[styles.fill, disabled && styles.fillDisabled, { width: `${fraction * 100}%` }]} />
      </View>
      <View pointerEvents="none" style={[styles.thumb, disabled && styles.thumbDisabled, { left: Math.max(0, fraction * width - 12) }]} />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    hit: { height: 36, justifyContent: 'center' },
    track: { height: 8, borderRadius: 4, backgroundColor: colors.track, overflow: 'hidden' },
    fill: { height: 8, backgroundColor: colors.primary },
    fillDisabled: { backgroundColor: colors.textDisabled },
    thumb: {
      position: 'absolute',
      top: 6,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    thumbDisabled: { borderColor: colors.textDisabled },
  });
}

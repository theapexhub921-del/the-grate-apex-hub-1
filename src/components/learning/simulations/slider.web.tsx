import { useTheme } from '@/hooks/use-theme';

import type { SimSliderProps } from './slider-types';

// Web: a real range input — keyboard (arrows, Home/End, Page Up/Down),
// screen readers and touch all work for free.
export function SimSlider({ value, min, max, step, disabled, onChange, accessibilityLabel, valueText }: SimSliderProps) {
  const colors = useTheme();
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      aria-label={accessibilityLabel}
      aria-valuetext={valueText}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
      style={{
        width: '100%',
        height: 28,
        margin: 0,
        accentColor: disabled ? colors.textDisabled : colors.primary,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    />
  );
}

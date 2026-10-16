import { StyleSheet, View } from 'react-native';

import { type AtmosphereMood, useAtmospherePalette } from '@/components/atmosphere/config';

// The Originate page background: one plain colour from the theme
// (docs/design-system.md — no aurora, rays, grid, grain, vignette or drawings).
// `mood` is kept so the shell's call stays the same; it no longer changes the look.
export function Atmosphere(_props: { mood: AtmosphereMood }) {
  const { palette } = useAtmospherePalette();
  return <View pointerEvents="none" accessible={false} style={[StyleSheet.absoluteFill, { backgroundColor: palette.base }]} />;
}

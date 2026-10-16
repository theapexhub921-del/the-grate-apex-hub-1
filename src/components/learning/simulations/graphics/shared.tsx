import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import type { SimValues } from '@/data/simulations/types';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// What every drawing receives.
export type GraphicProps<S> = {
  state: S; // the model now
  baseline: S; // the model at the comparison point (drawn faded)
  values: SimValues;
  time: number; // simulated seconds (frozen under reduced motion)
  reduceMotion: boolean;
};

// An SVG drawing that scales to the card width, keeping its proportions.
export function Canvas({ width, height, children, label }: { width: number; height: number; children: ReactNode; label: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.canvas, { aspectRatio: width / height }]} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {children}
      </Svg>
    </View>
  );
}

export type Scale = (value: number) => number;

export function linear(domain: [number, number], range: [number, number]): Scale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  return (value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
}

export function pathOf(points: [number, number][], x: Scale, y: Scale, close = false) {
  let d = '';
  points.forEach(([px, py], i) => {
    d += `${i === 0 ? 'M' : 'L'}${x(px).toFixed(1)} ${y(py).toFixed(1)} `;
  });
  return close ? `${d}Z` : d;
}

// Grid lines and tick labels for a plot.
export function Axes({
  x,
  y,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  left,
  right,
  top,
  bottom,
}: {
  x: Scale;
  y: Scale;
  xTicks: number[];
  yTicks: number[];
  xLabel?: string;
  yLabel?: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}) {
  const colors = useTheme();
  return (
    <>
      {yTicks.map((tick) => (
        <Line key={`y${tick}`} x1={left} x2={right} y1={y(tick)} y2={y(tick)} stroke={colors.border} strokeWidth={1} />
      ))}
      {yTicks.map((tick) => (
        <SvgText key={`yl${tick}`} x={left - 6} y={y(tick) + 4} fontSize={12} fontWeight="700" fill={colors.textTertiary} textAnchor="end">
          {String(tick)}
        </SvgText>
      ))}
      {xTicks.map((tick) => (
        <SvgText key={`xl${tick}`} x={x(tick)} y={bottom + 16} fontSize={12} fontWeight="700" fill={colors.textTertiary} textAnchor="middle">
          {String(tick)}
        </SvgText>
      ))}
      {xLabel ? (
        <SvgText x={(left + right) / 2} y={bottom + 33} fontSize={13} fontWeight="800" fill={colors.textSecondary} textAnchor="middle">
          {xLabel}
        </SvgText>
      ) : null}
      {yLabel ? (
        <SvgText x={14} y={(top + bottom) / 2} fontSize={13} fontWeight="800" fill={colors.textSecondary} textAnchor="middle" rotation={-90} origin={`14, ${(top + bottom) / 2}`}>
          {yLabel}
        </SvgText>
      ) : null}
    </>
  );
}

// A small legend under a drawing.
export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.swatch, { borderColor: item.color, borderStyle: item.dashed ? 'dashed' : 'solid' }]} />
          <Text style={styles.legendText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// A row of status chips (phase, valves…).
export function StatusRow({ title, chips }: { title: string; chips: { label: string; on: boolean }[] }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.status}>
      <Text style={styles.statusTitle}>{title}</Text>
      <View style={styles.chips}>
        {chips.map((chip) => (
          <View key={chip.label} style={[styles.chip, chip.on && styles.chipOn]}>
            <Text style={[styles.chipText, chip.on && styles.chipTextOn]}>{chip.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Systole and diastole as two bars sized by their duration, with a cursor.
export function BeatBar({ systole, diastole, cursor }: { systole: number; diastole: number; cursor?: number }) {
  const styles = useThemedStyles(createStyles);
  const beat = systole + diastole;
  return (
    <View style={styles.beat}>
      <View style={styles.beatBar}>
        <View style={[styles.beatSys, { flex: systole }]}>
          <Text style={styles.beatSysText} numberOfLines={1}>{`Systole ${systole.toFixed(2)} s`}</Text>
        </View>
        <View style={[styles.beatDia, { flex: diastole }]}>
          <Text style={styles.beatDiaText} numberOfLines={1}>{`Diastole ${diastole.toFixed(2)} s`}</Text>
        </View>
        {cursor !== undefined ? <View style={[styles.beatCursor, { left: `${(cursor / beat) * 100}%` }]} /> : null}
      </View>
      <Text style={styles.beatNote}>{`One beat = ${beat.toFixed(2)} s`}</Text>
    </View>
  );
}

// Position along a list of timed segments, looping every `period` seconds.
export function locate<T extends { duration: number }>(segments: T[], time: number) {
  const period = segments.reduce((sum, segment) => sum + segment.duration, 0);
  const t = period > 0 ? ((time % period) + period) % period : 0;
  let start = 0;
  for (const segment of segments) {
    if (t < start + segment.duration) return { segment, fraction: (t - start) / Math.max(1e-6, segment.duration), t, period };
    start += segment.duration;
  }
  return { segment: segments[segments.length - 1], fraction: 1, t, period };
}

export function along(points: [number, number][], fraction: number): [number, number] {
  const n = points.length - 1;
  if (n <= 0) return points[0] ?? [0, 0];
  const x = Math.min(n, Math.max(0, fraction * n));
  const i = Math.min(n - 1, Math.floor(x));
  const r = x - i;
  return [points[i][0] + (points[i + 1][0] - points[i][0]) * r, points[i][1] + (points[i + 1][1] - points[i][1]) * r];
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    canvas: { width: '100%', maxWidth: 560, alignSelf: 'center' },
    legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 4 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    swatch: { width: 16, height: 0, borderTopWidth: 3 },
    legendText: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
    status: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    statusTitle: { fontSize: 15, fontWeight: '900', color: colors.text },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
    chipOn: { backgroundColor: colors.primarySubtle, borderColor: colors.primaryBorder },
    chipText: { fontSize: 12, fontWeight: '800', color: colors.textTertiary },
    chipTextOn: { color: colors.primaryText },
    beat: { gap: 4 },
    beatBar: { flexDirection: 'row', height: 24, borderRadius: 8, overflow: 'hidden' },
    beatSys: { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    beatSysText: { fontSize: 11, fontWeight: '800', color: colors.onPrimary },
    beatDia: { backgroundColor: colors.primarySubtle, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    beatDiaText: { fontSize: 11, fontWeight: '800', color: colors.primaryText },
    beatCursor: { position: 'absolute', top: 0, bottom: 0, width: 3, marginLeft: -1.5, backgroundColor: colors.accent },
    beatNote: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
  });
}

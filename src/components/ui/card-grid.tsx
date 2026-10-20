import { Children, isValidElement, type ReactNode, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useLayoutWidth } from '@/components/side-panel-store';

const rows = <T,>(items: readonly T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

/**
 * A grid of same-sized cards. Every card in the grid has the same width (an
 * unfinished last row keeps the same card width instead of stretching), and
 * cards in the same row have the same height.
 *
 * Columns come from the grid's own width: as many as fit at `minItemWidth`,
 * up to `maxColumns`. Each card sits in a padding-free slot, so a card's own
 * padding never changes its size. Give the card `flexGrow: 1` so it fills its
 * slot's height.
 */
export function CardGrid({
  children,
  minItemWidth = 260,
  maxColumns = 4,
  gap = 12,
  style,
}: {
  children: ReactNode;
  minItemWidth?: number;
  maxColumns?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const windowWidth = useLayoutWidth();
  const [measured, setMeasured] = useState(0);
  const width = measured || windowWidth;
  const perRow = Math.max(1, Math.min(maxColumns, Math.floor((width + gap) / (minItemWidth + gap))));
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View
      style={[{ gap }, style]}
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        if (next !== measured) setMeasured(next);
      }}
    >
      {rows(items, perRow).map((row, r) => (
        <View key={r} style={[styles.row, { gap }]}>
          {row.map((item, i) => <View key={isValidElement(item) && item.key != null ? item.key : i} style={styles.slot}>{item}</View>)}
          {Array.from({ length: perRow - row.length }, (_, i) => <View key={`empty${i}`} style={styles.slot} />)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch' },
  slot: { flex: 1, minWidth: 0 },
});

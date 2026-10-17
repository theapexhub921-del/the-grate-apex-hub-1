import { StyleSheet, View } from 'react-native';

import { CardGrid } from '@/components/ui/card-grid';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { useExperience } from '@/hooks/use-experience';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

export type Tile = { id: string; icon: IconName; title: string; detail: string; badge?: string; onPress: () => void; disabled?: boolean; hidden?: boolean };

/**
 * Uniform tiles: every tile has the same layout (icon, title, up to three
 * lines, an optional badge) and the same width and height, in every row; an
 * unfinished last row keeps its tiles the same size. `columns` is the most per
 * row; narrower space shows fewer.
 */
export function TileGrid({ tiles, columns = 2 }: { tiles: readonly Tile[]; columns?: number }) {
  return <TileCards tiles={tiles} columns={columns} />;
}

function TileCards({ tiles, columns }: { tiles: readonly Tile[]; columns: number }) {
  const styles = useThemedStyles(createStyles);
  // Originate: the same tiles as flat bordered cards; the icon sits on its own
  // in the brand colour instead of in a tinted square.
  const originate = useExperience() === 'originate';
  const colors = useTheme();
  return (
    <CardGrid maxColumns={columns} minItemWidth={250}>
      {tiles.filter((tile) => !tile.hidden).map((tile) => (
        <PressableCard key={tile.id} onPress={tile.onPress} disabled={tile.disabled} accessibilityLabel={`${tile.title}. ${tile.detail}`} style={[styles.tile, tile.disabled && styles.off]}>
          <View style={[styles.icon, originate && styles.iconPlain]}><Icon name={tile.icon} size={20} color={originate ? colors.primaryText : colors.accentText} /></View>
          <View style={styles.text}>
            <View style={styles.head}>
              <Text style={styles.title} numberOfLines={1}>{tile.title}</Text>
              {tile.badge ? <Pill label={tile.badge} tone="gold" /> : null}
            </View>
            <Text style={styles.detail} numberOfLines={3}>{tile.detail}</Text>
          </View>
        </PressableCard>
      ))}
    </CardGrid>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    tile: { flexGrow: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 16 },
    off: { opacity: 0.6 },
    icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSubtle },
    iconPlain: { width: 24, height: 24, backgroundColor: 'transparent', alignItems: 'flex-start' },
    text: { flex: 1, minWidth: 0, gap: 3 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 24 },
    title: { ...Type.headline, color: colors.text, flexShrink: 1 },
    // Room for all three lines on every tile, so every tile is the same height.
    detail: { fontSize: 13.5, lineHeight: 20, minHeight: 60, color: colors.textSecondary },
  });
}

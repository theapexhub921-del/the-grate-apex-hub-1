import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/text';
import { webStyle } from '@/components/ui/web';
import { cssTransition, MOTION } from '@/constants/motion';
import { ORadius, OSpace } from '@/constants/originate';
import { Type, type ThemeColors } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// Lists of the same kind of thing (courses, tools, settings) are rows with
// dividers, not a grid of cards (docs/design-system.md). The text lines up
// with the page edge; the hover fill reaches a little past it.

/** A plain list: rows separated by dividers, with a line above and below. */
export function List({ children, style, accessibilityLabel }: { children: ReactNode; style?: StyleProp<ViewStyle>; accessibilityLabel?: string }) {
  const styles = useThemedStyles(createStyles);
  const rows = Children.toArray(children).filter(isValidElement);
  return (
    <View style={[styles.list, style]} accessibilityRole="list" accessibilityLabel={accessibilityLabel}>
      {rows.map((row, index) => (
        <Fragment key={row.key ?? index}>
          {index > 0 ? <View style={styles.divider} /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

type ListRowProps = {
  title: string;
  /** One or two lines under the title. */
  detail?: string;
  /** Short right-aligned text: a count, a date, a status. */
  meta?: string;
  /** Draws `meta` in the warning colour (something is due). */
  metaTone?: 'default' | 'attention' | 'muted';
  /** 0–1: a thin progress line under the text. */
  progress?: number;
  progressLabel?: string;
  onPress?: () => void;
  disabled?: boolean;
  /** Why the row is disabled, shown under the title. */
  disabledReason?: string;
  accessibilityLabel?: string;
  /** Replaces the chevron (e.g. a switch); pass null for none. */
  trailing?: ReactNode | null;
  /** A picture at the start of the row (a course's image). */
  leading?: ReactNode;
};

/** One row: title, optional detail, a short value on the right and a chevron when it opens something. */
export function ListRow({ title, detail, meta, metaTone = 'default', progress, progressLabel, onPress, disabled, disabledReason, accessibilityLabel, trailing, leading }: ListRowProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const body = (
    <>
      {leading}
      <View style={styles.text}>
        <Text style={[styles.title, disabled && styles.titleOff]} numberOfLines={1}>
          {title}
        </Text>
        {disabled && disabledReason ? (
          <Text style={styles.detail} numberOfLines={2}>{disabledReason}</Text>
        ) : detail ? (
          <Text style={styles.detail} numberOfLines={2}>{detail}</Text>
        ) : null}
        {progress !== undefined ? <ProgressBar value={progress} height={3} style={styles.progress} label={progressLabel ?? `${title} progress`} /> : null}
      </View>
      {meta ? <Text style={[styles.meta, metaTone === 'attention' && styles.metaAttention, metaTone === 'muted' && styles.metaMuted]}>{meta}</Text> : null}
      {trailing !== undefined ? trailing : onPress && !disabled ? <Icon name="chevronRight" size={18} color={colors.textTertiary} /> : null}
    </>
  );
  if (!onPress) {
    return <View style={styles.row} accessibilityLabel={accessibilityLabel}>{body}</View>;
  }
  return (
    <Interactive
      onPress={onPress}
      disabled={disabled}
      dimDisabled={false}
      accessibilityLabel={accessibilityLabel ?? [title, meta, detail].filter(Boolean).join('. ')}
      style={({ hovered, pressed }) => [styles.row, styles.pressable, hovered && styles.hovered, pressed && styles.pressed]}
    >
      {body}
    </Interactive>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.divider },
    divider: { height: 1, backgroundColor: colors.divider },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: OSpace.md,
      minHeight: 56,
      paddingVertical: OSpace.md,
      paddingHorizontal: OSpace.md,
      marginHorizontal: -OSpace.md,
      borderRadius: ORadius.control,
    },
    pressable: webStyle(cssTransition('background-color', MOTION.micro)),
    hovered: { backgroundColor: colors.surfaceMuted },
    pressed: { opacity: 0.8 },
    text: { flex: 1, minWidth: 0, gap: 2 },
    title: { ...Type.headline, fontWeight: '600', color: colors.text },
    titleOff: { color: colors.textTertiary },
    detail: { fontSize: 13.5, lineHeight: 19, color: colors.textSecondary },
    progress: { marginTop: OSpace.sm, maxWidth: 360 },
    meta: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, fontVariant: ['tabular-nums'] },
    metaAttention: { color: colors.warningText, fontWeight: '600' },
    metaMuted: { color: colors.textTertiary },
  });
}

import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { addSidePanelHost, closeSidePanel, SIDE_PANEL_MIN_WINDOW, sidePanelWidth, useSidePanel } from '@/components/side-panel-store';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

// A panel docked on the right of the page on a computer, like Ask Gemini in
// Chrome: the page moves over to make room, so the learner can keep reading
// and scrolling while it is open. Used by "Ask AI" while reading a lesson.
//
// Only the web shell (app-tabs.web.tsx) draws <SidePanelHost />. Callers check
// useSidePanelAvailable() first and use a <Sheet> otherwise (phones, narrow windows).

export {
  closeSidePanel,
  openSidePanel,
  SIDE_PANEL_MIN_WINDOW,
  sidePanelWidth,
  updateSidePanel,
  useLayoutWidth,
  useSidePanel,
  useSidePanelAvailable,
} from '@/components/side-panel-store';

export function SidePanelHost() {
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const current = useSidePanel();
  useEffect(() => addSidePanelHost(), []);
  if (!current || width < SIDE_PANEL_MIN_WINDOW) return null;
  const panelWidth = sidePanelWidth(width);
  return (
    <View style={[styles.panel, { width: panelWidth }]} accessibilityLabel={current.title}>
      <View style={styles.header}>
        <View style={styles.headText}>
          <Text style={styles.title} numberOfLines={1}>{current.title}</Text>
          {current.subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{current.subtitle}</Text> : null}
        </View>
        <IconButton icon="close" label={`Close ${current.title}`} onPress={() => closeSidePanel()} size={36} />
      </View>
      {/* The key keeps one conversation per panel: a new panel starts fresh. */}
      <View key={current.id} style={styles.body}>{current.content}</View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    panel: { height: '100%', flexShrink: 0, borderLeftWidth: 1, borderLeftColor: colors.divider, backgroundColor: colors.surface, zIndex: 2 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 18, paddingRight: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.divider },
    headText: { flex: 1, minWidth: 0 },
    title: { ...Type.headline, color: colors.text },
    subtitle: { fontSize: 12.5, color: colors.textSecondary },
    body: { flex: 1, minHeight: 0 },
  });
}

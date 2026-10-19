import { type ReactNode, useEffect, useSyncExternalStore } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

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

export const SIDE_PANEL_MIN_WINDOW = 1024;

type Panel = { id: string; title: string; subtitle?: string; content: ReactNode };

let panel: Panel | null = null;
let hosts = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export function openSidePanel(next: Panel) {
  panel = next;
  emit();
}

// Updates the title or content of the panel that is open, if it is this one.
export function updateSidePanel(id: string, changes: Partial<Omit<Panel, 'id'>>) {
  if (panel?.id !== id) return;
  panel = { ...panel, ...changes };
  emit();
}

// Closes the panel; with an id, only if that panel is the one open.
export function closeSidePanel(id?: string) {
  if (!panel || (id && panel.id !== id)) return;
  panel = null;
  emit();
}

export function useSidePanel() {
  return useSyncExternalStore(subscribe, () => panel, () => null);
}

// True when a docked panel can be shown: the web shell is there and the window is wide enough.
export function useSidePanelAvailable() {
  const { width } = useWindowDimensions();
  const hosted = useSyncExternalStore(subscribe, () => hosts > 0, () => false);
  return hosted && width >= SIDE_PANEL_MIN_WINDOW;
}

export function SidePanelHost() {
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const current = useSidePanel();
  useEffect(() => {
    hosts += 1;
    emit();
    return () => { hosts -= 1; emit(); };
  }, []);
  if (!current || width < SIDE_PANEL_MIN_WINDOW) return null;
  const panelWidth = Math.round(Math.min(440, Math.max(360, width * 0.3)));
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
    panel: { height: '100%', borderLeftWidth: 1, borderLeftColor: colors.divider, backgroundColor: colors.surface, zIndex: 2 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 18, paddingRight: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.divider },
    headText: { flex: 1, minWidth: 0 },
    title: { ...Type.headline, color: colors.text },
    subtitle: { fontSize: 12.5, color: colors.textSecondary },
    body: { flex: 1, minHeight: 0 },
  });
}

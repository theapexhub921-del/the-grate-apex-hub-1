import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import { useWindowDimensions } from 'react-native';

// The docked side panel's state (components/side-panel.tsx draws it). Kept in a
// file with no UI imports, so layout primitives (Screen, Columns) can read how
// much room the page really has while the panel is open.

export const SIDE_PANEL_MIN_WINDOW = 1024;

export type Panel = { id: string; title: string; subtitle?: string; content: ReactNode };

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

/** Counts the web shells drawing the panel (SidePanelHost). */
export function addSidePanelHost() {
  hosts += 1;
  emit();
  return () => {
    hosts -= 1;
    emit();
  };
}

export function useSidePanel() {
  return useSyncExternalStore(subscribe, () => panel, () => null);
}

/** The panel's width for a window this wide (30% of the window, 360–440 px). */
export const sidePanelWidth = (windowWidth: number) => Math.round(Math.min(440, Math.max(360, windowWidth * 0.3)));

// True when a docked panel can be shown: the web shell is there and the window is wide enough.
export function useSidePanelAvailable() {
  const { width } = useWindowDimensions();
  const hosted = useSyncExternalStore(subscribe, () => hosts > 0, () => false);
  return hosted && width >= SIDE_PANEL_MIN_WINDOW;
}

/**
 * The width the page really has: the window, less the docked panel while it is
 * open. Layouts that pick one or two columns by width use this, so opening Ask AI
 * beside a lesson turns the page into one column instead of squeezing it
 * (owner, 2026-10-20: the panel pushed the lesson over).
 */
export function useLayoutWidth() {
  const { width } = useWindowDimensions();
  const open = useSyncExternalStore(subscribe, () => panel !== null && hosts > 0, () => false);
  return open && width >= SIDE_PANEL_MIN_WINDOW ? width - sidePanelWidth(width) : width;
}

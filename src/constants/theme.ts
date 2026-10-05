/**
 * GRATEAPEX design tokens — one set of names, three palettes.
 *
 * Brand anchors (from the logo):
 * - Logo blue  #1245C4 → identity, main actions, active states
 * - Star gold  #FDC00A → rewards, highlights, the Apex identity
 *
 * Screens never pick a palette themselves: they read the active one with
 * `useTheme()` / `useThemedStyles()` (hooks/use-theme.ts). The learner's
 * choice (Apex / Light / Dark / System) lives in data/settings.ts.
 *
 * Surface hierarchy (back to front):
 *   page atmosphere (components/atmosphere) → background → surface (cards)
 *   → surfaceElevated (heroes, sheets, popovers) → focus states
 * `surfaceMuted` is a quiet fill INSIDE a card; `surfaceSunken` is a well
 * (inputs, tracks) that sits below the card it is in.
 */

import '@/global.css';

import { Platform, type TextStyle, type ViewStyle } from 'react-native';

const light = {
  // ── Brand ──────────────────────────────────────────────────────────
  primary: '#1245C4', // filled buttons, active states, progress fills
  primaryPressed: '#0E369B',
  primaryText: '#1245C4', // blue text/links on the page background
  primarySubtle: '#EAF0FC', // light blue background (selected / info)
  primaryBorder: '#C3D3F5',
  onPrimary: '#FFFFFF', // text/icons on primary
  onPrimaryMuted: '#BFD0F5', // quieter text on primary
  secondary: '#0B1E5B', // deep navy — strong secondary emphasis
  onSecondary: '#FFFFFF',

  // Reward accent (logo star) — XP, rewards and highlights only
  accent: '#FDC00A',
  accentSubtle: '#FFF5D6',
  accentText: '#7A5A00',

  // ── Surfaces ───────────────────────────────────────────────────────
  background: '#F3F5FA', // off-white page (never pure white everywhere)
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F2F4FA', // quiet fills inside cards
  surfaceSunken: '#EBEFF7', // inputs and wells
  track: '#E3E8F3', // empty part of progress bars

  // ── Text (deep navy instead of pure black, to sit with the logo blue) ─
  text: '#0F1833',
  textSecondary: '#4E5873',
  textTertiary: '#737D96',
  textDisabled: '#A9B0C0',

  // ── Lines ──────────────────────────────────────────────────────────
  border: '#DDE3EE',
  borderStrong: '#C6CFE1',
  divider: '#EDF0F6',
  hairline: 'rgba(15, 24, 51, 0.06)', // 1px outlines on elevated surfaces
  highlight: 'rgba(255, 255, 255, 0.95)', // inner top light of a surface

  // ── Status (meaning, not decoration) ───────────────────────────────
  success: '#1F8A4C',
  successText: '#1E6B3E',
  successSubtle: '#E8F6EE',
  successBorder: '#B5DFC4',
  error: '#C62828',
  errorSubtle: '#FDECEC',
  errorBorder: '#F2C1C1',
  warning: '#D9822B',
  warningText: '#8A4F1A',
  warningStrong: '#9A5A20',
  warningSubtle: '#FFF3E6',
  warningBorder: '#F0C9A0',
  info: '#1245C4',
  infoSubtle: '#EAF0FC',
  infoText: '#1245C4',

  // ── Navigation ─────────────────────────────────────────────────────
  // Legacy bar tokens (still read by older components)
  tabBar: '#1245C4',
  tabBarBorder: '#1245C4',
  tabActive: '#FFFFFF',
  tabInactive: '#AFC4F2',
  // Floating bar / rail
  navSurface: 'rgba(255, 255, 255, 0.88)',
  navBorder: 'rgba(15, 30, 80, 0.10)',
  navActive: '#1245C4',
  navActiveSubtle: '#E6EDFC',
  navInactive: '#66708A',

  // "+XP" moment
  rewardBackground: '#0B1E5B',
  rewardMuted: '#C9D6F7',

  // G / A / cap of the logo mark (the swoosh and star stay gold) — LOCKED
  logoLetters: '#1245C4',

  // Memory states (learning engine) — meaning, not decoration
  stateNew: '#B7C1D6',
  stateLearning: '#1245C4',
  stateStruggling: '#C62828',
  stateRemembered: '#1F8A4C',
  stateMastered: '#D99A00',

  // Keyboard focus ring
  focusRing: '#1245C4',

  // Depth
  shadow: 'rgba(16, 30, 80, 0.10)',
  shadowStrong: 'rgba(16, 30, 80, 0.18)',
  overlay: 'rgba(10, 18, 45, 0.40)', // scrim behind sheets and dialogs

  // Apex Challenge identity (dark, high-stakes — the same in every theme)
  apexBackground: '#050B24',
  apexSurface: '#0C1640',
  apexText: '#FFFFFF',
  apexMuted: '#A9BCF0',
  apexGlow: '#FDC00A',

  // Names used by the Expo template components (themed-text/view)
  backgroundElement: '#F2F4FA',
  backgroundSelected: '#E3E8F3',
};

export type ThemeColors = typeof light;

// Layered dark neutrals + the same GRATEAPEX blue and gold.
// Blues are brighter than the logo so they stay readable on dark.
const dark: ThemeColors = {
  primary: '#3B6BEA',
  primaryPressed: '#2F5BD0',
  primaryText: '#93B0F7',
  primarySubtle: '#172443',
  primaryBorder: '#2D4479',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#C4D3F7',
  secondary: '#DCE4F7',
  onSecondary: '#0B0D12',

  accent: '#FDC00A',
  accentSubtle: '#2E2510',
  accentText: '#F7CF5A',

  background: '#0B0D12',
  surface: '#13161D',
  surfaceElevated: '#1A1E27',
  surfaceMuted: '#1A1E26',
  surfaceSunken: '#0E1015',
  track: '#262B36',

  text: '#ECEEF4',
  textSecondary: '#A6AEC0',
  textTertiary: '#808899',
  textDisabled: '#5A6172',

  border: '#262B36',
  borderStrong: '#353C4B',
  divider: '#1D2129',
  hairline: 'rgba(255, 255, 255, 0.06)',
  highlight: 'rgba(255, 255, 255, 0.05)',

  success: '#5FCB7E',
  successText: '#7DD796',
  successSubtle: '#13261A',
  successBorder: '#2A5537',
  error: '#F47272',
  errorSubtle: '#341618',
  errorBorder: '#6A2A2E',
  warning: '#F2A65A',
  warningText: '#F3B47A',
  warningStrong: '#F4A259',
  warningSubtle: '#2F2213',
  warningBorder: '#6B4A26',
  info: '#93B0F7',
  infoSubtle: '#172443',
  infoText: '#AFC4FA',

  tabBar: '#141A2B',
  tabBarBorder: '#26304A',
  tabActive: '#93B0F7',
  tabInactive: '#808899',
  navSurface: 'rgba(19, 22, 29, 0.88)',
  navBorder: 'rgba(255, 255, 255, 0.08)',
  navActive: '#ECEEF4',
  navActiveSubtle: '#1F2840',
  navInactive: '#8A92A4',

  rewardBackground: '#141B33',
  rewardMuted: '#C4D3F7',

  logoLetters: '#FFFFFF',

  stateNew: '#4A5266',
  stateLearning: '#93B0F7',
  stateStruggling: '#F47272',
  stateRemembered: '#5FCB7E',
  stateMastered: '#FDC00A',

  focusRing: '#93B0F7',

  shadow: 'rgba(0, 0, 0, 0.45)',
  shadowStrong: 'rgba(0, 0, 0, 0.6)',
  overlay: 'rgba(0, 0, 0, 0.62)',

  apexBackground: '#04060F',
  apexSurface: '#0C1430',
  apexText: '#FFFFFF',
  apexMuted: '#A9BCF0',
  apexGlow: '#FDC00A',

  backgroundElement: '#1A1E26',
  backgroundSelected: '#262B36',
};

// Apex (default): the GRATEAPEX logo as a theme.
// A deep royal-blue field (lit by the atmosphere layers), deeper blue cards,
// white text. Blue actions would disappear on a blue page, so "primary"
// becomes the logo's star gold (with navy text on it).
const apex: ThemeColors = {
  primary: '#FDC00A', // gold buttons, progress fills, selected states
  primaryPressed: '#E8AE00',
  primaryText: '#FFD04A', // gold highlight text (selected labels, links)
  primarySubtle: '#163CA6', // selected backgrounds
  primaryBorder: '#4C74DC',
  onPrimary: '#0A1F5C', // navy text on gold
  onPrimaryMuted: '#3D4E80',
  secondary: '#FFFFFF',
  onSecondary: '#0A2572',

  accent: '#FDC00A',
  accentSubtle: '#2E3F7E',
  accentText: '#FFD04A',

  // Surfaces (Apex)
  background: '#0A2572', // deep royal field; the atmosphere lights it
  surface: '#0F3190', // cards
  surfaceElevated: '#143A9F', // heroes, sheets, popovers
  surfaceMuted: '#0B2A7E', // quiet fills inside cards
  surfaceSunken: '#08205F',
  track: '#0A2468',

  text: '#FFFFFF',
  textSecondary: '#DCE6FD',
  // Muted text stays well above the 4.5:1 contrast floor on cards and page.
  textTertiary: '#B3C5F2',
  textDisabled: '#8DA2D8',

  border: '#2F57C4',
  borderStrong: '#4A78E0',
  divider: '#1D44AC',
  hairline: 'rgba(170, 200, 255, 0.14)',
  highlight: 'rgba(255, 255, 255, 0.10)',

  success: '#7BE0A0',
  successText: '#8DE8AE',
  successSubtle: '#0E4A5A',
  successBorder: '#2E9E78',
  error: '#FF9A9A',
  errorSubtle: '#4A2363',
  errorBorder: '#C2577A',
  warning: '#FFC266',
  warningText: '#FFCB8A',
  warningStrong: '#FFC078',
  warningSubtle: '#3D3170',
  warningBorder: '#B48A58',
  info: '#8FB8FF',
  infoSubtle: '#163CA6',
  infoText: '#BFD5FF',

  // Legacy bar tokens
  tabBar: '#081E62',
  tabBarBorder: '#081E62',
  tabActive: '#FDC00A',
  tabInactive: '#A9BEF0',
  navSurface: 'rgba(7, 26, 86, 0.84)',
  navBorder: 'rgba(150, 185, 255, 0.18)',
  navActive: '#FDC00A',
  navActiveSubtle: 'rgba(253, 192, 10, 0.14)',
  navInactive: '#B3C5F2',

  rewardBackground: '#071B5C',
  rewardMuted: '#C9D6F7',

  logoLetters: '#FFFFFF',

  stateNew: '#6F8BD8',
  stateLearning: '#9CC3FF',
  stateStruggling: '#FF9A9A',
  stateRemembered: '#7BE0A0',
  stateMastered: '#FDC00A',

  focusRing: '#FDC00A',

  shadow: 'rgba(2, 8, 40, 0.45)',
  shadowStrong: 'rgba(2, 8, 40, 0.65)',
  overlay: 'rgba(3, 10, 40, 0.62)',

  apexBackground: '#040A22',
  apexSurface: '#0B1640',
  apexText: '#FFFFFF',
  apexMuted: '#A9BCF0',
  apexGlow: '#FDC00A',

  backgroundElement: '#0B2A7E',
  backgroundSelected: '#0A2468',
};

export const Colors = { light, dark, apex };

export type ColorSchemeName = keyof typeof Colors;
export type ThemeColor = keyof ThemeColors;

// ── Type ─────────────────────────────────────────────────────────────
// Web loads Manrope (see app/+html.tsx) for display text and numerals;
// native uses the platform face. Body text is always the system face.
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    display: undefined as string | undefined,
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    display: undefined as string | undefined,
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
    display: 'var(--font-heading)' as string | undefined,
  },
});

// The GRATEAPEX type hierarchy. Screens spread these instead of inventing
// sizes: `{ ...Type.title2, color: colors.text }`.
export const Type = {
  display: { fontFamily: Fonts.display, fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.6 },
  title1: { fontFamily: Fonts.display, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.4 },
  title2: { fontFamily: Fonts.display, fontSize: 22, lineHeight: 28, fontWeight: '800', letterSpacing: -0.2 },
  title3: { fontFamily: Fonts.display, fontSize: 18, lineHeight: 24, fontWeight: '700' },
  headline: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 23 },
  callout: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '800', letterSpacing: 1.2 },
  numeral: { fontFamily: Fonts.display, fontWeight: '800', fontVariant: ['tabular-nums'] },
} as const satisfies Record<string, TextStyle>;

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// ── Elevation ────────────────────────────────────────────────────────
// 0 flat · 1 resting card · 2 raised (hover, hero) · 3 overlay (sheet,
// toast, popover). Uses `boxShadow`, which React Native 0.86 renders on
// every platform. The inset line is the "double bezel" top light.
export function elevation(colors: ThemeColors, level: 0 | 1 | 2 | 3): ViewStyle {
  switch (level) {
    case 0:
      return {};
    case 1:
      return { boxShadow: `inset 0px 1px 0px ${colors.highlight}, 0px 1px 2px ${colors.shadow}, 0px 6px 18px ${colors.shadow}` } as ViewStyle;
    case 2:
      return { boxShadow: `inset 0px 1px 0px ${colors.highlight}, 0px 2px 4px ${colors.shadow}, 0px 14px 34px ${colors.shadowStrong}` } as ViewStyle;
    case 3:
      return { boxShadow: `inset 0px 1px 0px ${colors.highlight}, 0px 4px 10px ${colors.shadow}, 0px 24px 60px ${colors.shadowStrong}` } as ViewStyle;
  }
}

// GRATEAPEX layout helpers.
//
// Screens are written once, mobile-first, and widen on larger viewports
// using these shared values instead of inventing a max-width per page.

// Small phones (iPhone SE, compact Android): tighter type and gutters.
export const COMPACT_BREAKPOINT = 380;
// Large phones / small tablets: two-up grids become possible.
export const TABLET_BREAKPOINT = 640;
// Below this width the layout stays in the single-column mobile shape.
export const DESKTOP_BREAKPOINT = 900;
// Wide desktop breakpoint (used for extra multi-column layouts).
export const WIDE_BREAKPOINT = 1280;

// Reading width for long-form text (lessons, articles). Long lines are
// hard to read, so prose is capped narrower than dashboards.
export const PROSE_MAX_WIDTH = 760;
// General content column for dashboards and card grids.
export const CONTENT_MAX_WIDTH = 1120;
// Roomier shell for the full-bleed learning surfaces (quiz, results).
export const LEARNING_MAX_WIDTH = 880;

// Standard responsive horizontal gutters.
export const GUTTER_MOBILE = 20;
export const GUTTER_COMPACT = 16;
export const GUTTER_DESKTOP = 32;

// Desktop navigation rail width. When the rail is docked the content
// column is offset by exactly this much, so nothing can overlap.
export const SIDEBAR_WIDTH = 248;

// Floating mobile tab bar: height and its gap from the screen edge.
export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_INSET = 12;

/**
 * True on laptop/desktop widths. Use for two-column layouts.
 */
export function isDesktopWidth(width: number) {
  return width >= DESKTOP_BREAKPOINT;
}

/**
 * True on large displays, where a third column or denser grids make sense.
 */
export function isWideWidth(width: number) {
  return width >= WIDE_BREAKPOINT;
}

/**
 * Horizontal padding + centred max width for a screen container.
 * `max` lets a page choose a narrower shell (prose) or a wider one.
 */
export function pageContainer(
  width: number,
  max: number = CONTENT_MAX_WIDTH
): ViewStyle {
  const desktop = isDesktopWidth(width);
  return {
    width: '100%',
    maxWidth: max,
    alignSelf: 'center',
    paddingHorizontal: desktop ? GUTTER_DESKTOP : width < COMPACT_BREAKPOINT ? GUTTER_COMPACT : GUTTER_MOBILE,
  };
}

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = CONTENT_MAX_WIDTH;

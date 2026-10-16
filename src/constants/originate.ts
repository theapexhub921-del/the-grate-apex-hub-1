// Originate's shape and spacing rules (docs/design-system.md). Colours and the
// type scale stay in constants/theme.ts; these are the values the primitives
// use when the learner's experience is Originate.

/** Corner radius by kind of thing — never one radius for everything. */
export const ORadius = {
  tag: 4, // Pill / small labels
  control: 8, // buttons, inputs, segmented controls, icon buttons
  card: 12, // a card, when a card is the right container
  overlay: 14, // sheets, dialogs, menus, toasts
} as const;

/** The 4-point spacing scale. */
export const OSpace = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

/** Control heights. */
export const OControl = { sm: 34, md: 42, lg: 48 } as const;

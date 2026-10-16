# Originate design system

Status: adopted 2026-10-16. Applies to the **Originate** experience only. The
Originals and Hybrid are faithful copies of the original app and keep their
own look (`docs/experiences-architecture.md`).

This replaces the decorative pass of the same day (gradient buttons, glows,
pointer light, lit cards, page fade). Those are removed.

## Who it is for, and the one job

Medical students in a lecture-based course (HB1, HB2…), mostly on phones
between lectures, sometimes on a laptop in the evening. The app's job on every
visit is: **show me what to study next, and let me start it in one tap.**
Classmates, ranks and XP support that job; they never compete with it.

The reference point is a well-kept set of lecture notes, not a dashboard:
calm pages, clear headings, information in lists and rows, very few boxes.

## Typography

| Role | Face | Why |
| --- | --- | --- |
| Interface, headings, numbers | **IBM Plex Sans** (400, 500, 600) | Built for interfaces and technical reading; sturdy at small sizes on cheap phone screens; tabular figures for scores and counts. |
| Long reading (lesson text) | **Source Serif 4** (400, 600) | Lessons are read like a textbook. A serif with generous line height is easier for long passages and makes reading feel different from navigating. |

- Loaded on the web from Google Fonts after first paint (`src/lib/web-fonts.ts`); phones use the system face.
- Weights: 400 for text, 500 for emphasis inside text, 600 for headings, labels and buttons. Nothing heavier — 700/800/900 in older styles are drawn as 600 in Originate (`src/components/ui/text.tsx`).
- Labels are **sentence case**. Small all-caps tracked labels ("SPACED REVIEW") are drawn in sentence case with no tracking in Originate; acronyms (XP, HB2, AI, MCQ…) keep their capitals.
- Scale (unchanged sizes, from `Type` in `src/constants/theme.ts`): display 34, title1 28, title2 22, title3 18, headline 16, body 15/23, callout 14, caption 12.

## Colour

Restrained: one brand blue for actions and selection, gold only for rewards
(XP, streak, rank), and neutrals for everything else. Status colours mean
status only.

Light theme (the reference palette):

| Token | Value | Use |
| --- | --- | --- |
| `background` | `#F4F5F7` | Page |
| `surface` | `#FFFFFF` | Grouped content, inputs |
| `text` | `#131A2B` | Body and headings |
| `textSecondary` | `#4B5468` | Supporting text |
| `border` | `#DCE0E7` | The only structural line |
| `primary` | `#1245C4` | Logo blue: buttons, links, selection |
| `accent` | `#FDC00A` | Logo gold: XP, streak, rank only |

The other themes (Apex, Dark, Violet…) keep their own colours and follow the
same roles. The page is a plain colour: no aurora, rays, grid, grain,
vignette, doodles or pointer light in Originate.

## Shape and depth

| Thing | Radius | Border | Shadow |
| --- | --- | --- | --- |
| Buttons, inputs, segmented controls, tags | 8 | 1px where needed | none |
| Cards (when a card is right) | 12 | 1px `border` | none |
| Sheets, dialogs, menus, toasts | 14 | 1px `border` | one soft shadow — the only shadows in the app |
| Avatars, switches, progress tracks | round | — | none |

- No gradients on controls or surfaces. No glass or blur except under the
  phone tab bar's solid fill (none).
- Tags (`Pill`) are small rectangles with radius 4, not capsules.

## Spacing

A 4-point grid: **4, 8, 12, 16, 24, 32, 48**. Inside a card: 16. Between
items in a list: 12. Between sections: 32 on desktop, 24 on phones. Page
gutters: 16 (small phones), 20 (phones), 32 (desktop).

## When to use a card

Use a card only when a group of things belongs together **and** sits beside
other, different groups (a course with its progress and its "continue"
action; a question being answered). Otherwise use:

- **Rows with dividers** for lists of the same kind of thing (subjects,
  topics, tools, settings, notifications).
- **A section heading and whitespace** to separate parts of a page.
- **Plain text** for explanations.

Never put a card inside a card. "Coming soon" features are a line of text in
the list they belong to, not a card of their own.

## Icons

One family: the GRATEAPEX line icons (`src/components/ui/icon.tsx`), 1.8px
stroke, drawn at 16, 20 or 24. Icons are used for navigation, for actions
whose icon is universally understood (close, back, settings, search,
notifications), and for status (done, locked, due). Not as decoration beside
headings or inside coloured squares. No emoji in the interface.

## Buttons and actions

- **One primary button per screen** (solid blue): the thing the screen is for.
- Secondary actions: outlined buttons or text links.
- Labels say what happens: "Start review", "Continue lesson", "Save".
- Hover darkens the fill or border slightly; press dims. No lift, no glow.

## States

Every list and data view designs all five:

| State | Pattern |
| --- | --- |
| Loading | Skeleton rows in the shape of the content (`LoadingState`) |
| Empty | One sentence saying what will appear, one action that makes it appear (`EmptyState`) |
| Error | What failed and what to do, with "Try again" (`ErrorScreen`, `InlineNotice`) |
| Disabled | Muted fill and text, with the reason nearby ("Finish a lesson to unlock review") |
| Success | Inline confirmation where the action happened ("Saved"), not a modal |

## Motion

Only motion that answers an action: a sheet sliding up, a selected tab
indicator moving, a progress bar filling after an answer. No page fades, no
ambient drifting backgrounds, no hover lifts. Everything respects reduced
motion.

## Writing

Plain, specific and in the learner's words. Say what a thing is or does
("3 concepts due for review"), not how it feels ("Reach your peak!"). Buttons
are verbs. Errors say what happened and how to fix it, without apologising.

## Phones

Phones are designed, not shrunk: a docked bottom tab bar (five tabs, active
tab in blue, with Study as a raised round button in the middle — the owner's
choice, since studying is the app's main job), full-width rows instead of grids of cards, the primary
action within thumb reach, and nothing that only works on hover.

## Where it lives in code

- Tokens: `src/constants/theme.ts` (colours, `Type`, spacing) and
  `src/constants/originate.ts` (radii and rules specific to Originate).
- Fonts and the type normaliser: `src/lib/web-fonts.ts`,
  `src/components/ui/text.tsx`.
- Primitives that switch to these rules in Originate: `Card`, `PressableCard`,
  `Button`, `IconButton`, `Pill`, `SegmentedControl`, `Sheet`, `PageHeader`,
  `SectionHeader`, `TileGrid`, `ListRow` (new), state views.
- Shell: `components/atmosphere/` (plain page), `floating-tab-bar.tsx`
  (docked bar), `desktop-sidebar.tsx` (flat rail).

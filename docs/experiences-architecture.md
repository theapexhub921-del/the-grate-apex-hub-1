# Three experiences — proposed architecture (for the owner's review)

Status 2026-10-10: **proposal + foundation only.** The choice is stored and
enforced, behind a switch that is **off** (`EXPERIENCES_ENABLED` in
`src/data/experience.ts`), so no student is asked to choose until The Originals
and Hybrid really look different. No screen has been redesigned.

## The three experiences

| | The Originals | Originate | Hybrid |
|---|---|---|---|
| Source of truth | the original app (`old-reference/`) | this app as it is today | rules below |
| Shell | full-screen gradient + faint floating motifs (`Background.tsx`), floating tab bar with a raised Study button (`Tabs.tsx`) | atmosphere layer, desktop sidebar, floating tab bar | this app's shell and navigation |
| Surfaces | frosted "glass" panels (`ui.tsx` → `Panel`) | `Card` tones and elevation | glass panels on this app's layout grid |
| Buttons | gradient pill buttons | `Button` variants | gradient pills for the main action only |
| Type | Poppins / Montserrat / Inter / Roboto | this app's type scale | this app's type scale |
| Motion | simple fades | `motion.ts` springs | `motion.ts` |

Navigation labels stay **Feed · Connect · Study · Explore · You** in every
experience. The original app's *Compete* tab (leaderboard, battles) maps to
Connect, where the league and battles already live; its *Community* maps to
Connect too.

## How they share one app

- **One set of business logic.** Every data module (`src/data/*`, `src/lib/*`)
  is shared: accounts, learning engine, progress, achievements, social, the
  Firestore rules. Switching experience never touches data.
- **One set of routes and screens.** Screens keep their content and behaviour.
- **Experience-specific presentation only**, in the primitives and the shell:
  `Screen`, `Card`/`PressableCard`, `Button`, the atmosphere/background, the tab
  bar and sidebar read the experience (`useExperience()`) and pick their
  variant. Screens that are built from primitives change look automatically.
- **Legacy screen layouts** that differ structurally (e.g. the original
  StudyScreen columns) get experience-specific *layout* components only where the
  primitives aren't enough — listed and approved one by one.

## Reuse from the original app

Reusable almost as-is (presentation only, no data logic): `Background.tsx`
(gradient + motifs), `ui.tsx` (`Panel`, gradient `Button`, `Chip`), the tab-bar
look in `screens/Tabs.tsx`, `Text.tsx` font choices.
Must be rebuilt: anything in the original screens that reads its own data
modules (`progress.tsx`, `social.ts`, `community.ts`…) — those are replaced by
this app's data modules. Not imported: payments (Paystack/MoMo), the old
learning/SRS engine, AI usage counters.

## Choice: stored, enforced, no default

- Saved on the account as `users/{uid}.experience` (`'originals' | 'originate' |
  'hybrid'`) — allowed by the deployed rules, follows the learner across devices.
- **No default.** When the switch is on, the route guard sends any signed-in
  learner without a saved choice to `/choose-experience` (after the username
  step) before the main app; existing learners are asked at their next visit.
  A choice that can't be read shows the chooser again rather than guessing.
- Changeable any time in Settings → Experience, with the warning that only the
  interface changes — not the account, progress, friends, messages,
  achievements or XP.

## Appearance stays independent

- Appearance (themes: Apex, Light, Dark, System and the others) keeps its own
  setting and is never changed by switching experience; switching themes never
  changes the experience.
- Every experience reads colours from the same theme tokens. The original app's
  15 palettes would be added as Appearance themes (exact colours) once the
  owner picks which ones and the unlock rules — still pending.
- If a theme can't support an experience's effects (e.g. the original
  gradient needs three stops), the experience uses the theme's own colours for
  the stops; the saved theme preference is never changed.

## Decisions needed before building The Originals and Hybrid

1. Approve this approach (shared logic, presentation in primitives + shell).
2. The original UI uses **emoji** (tab icons, background motifs). This app's
   rule is no emoji in the interface. Keep emoji in The Originals (faithful), or
   use the GRATEAPEX icon set there too?
3. Fonts: The Originals needs Poppins/Montserrat/Inter (+ Roboto) — an added
   font dependency (no cost, some download size).
4. Hybrid: confirm the rules in the table above.
5. Which original themes join Appearance, and the unlock rules.

## What exists now (switch off)

`src/data/experience.ts` (values, `needsExperience`, save on the account),
`/choose-experience` (three choices, no default, honest descriptions), the
guard step, and Settings → Experience — all inactive until
`EXPERIENCES_ENABLED` is set to `true`.

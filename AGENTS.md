# GRATEAPEX — Codex Project Instructions

## Project overview

GRATEAPEX is a medical-student learning app being built as a beginner-friendly study ecosystem.

The current project is an early prototype. The initial intended subjects are:

* Anatomy
* Biochemistry
* Physiology

Lecture material lives in `content/<SUBJECT>/` and is the source of truth. Do not invent or permanently add course content that has not been provided.

The first real topic is Biochemistry → Fatty Acid Biosynthesis. The earlier Glycolysis test content has been removed.

## Developer experience

The project owner is a beginner with no formal coding experience.

When making changes:

* Prefer simple, maintainable solutions.
* Avoid unnecessary architectural complexity.
* Explain important changes in beginner-friendly language.
* Do not make large unrelated changes while fixing a specific problem.
* Preserve working functionality.
* Before changing an existing system, inspect how it currently works.
* Prefer the smallest reliable change that solves the problem.

## Current technology

The project uses:

* Expo
* React Native
* Expo Router
* TypeScript
* AsyncStorage
* VS Code
* Expo Go for Android testing
* Web testing through Expo

Project path:

`C:\Users\User\GRATEAPEX`

The app uses `src/app` as the Expo Router root.

## Important project structure

Current routes include:

* `src/app/index.tsx`
* `src/app/explore.tsx`
* `src/app/profile.tsx`
* `src/app/progress.tsx`
* `src/app/learn/index.tsx`
* `src/app/learn/anatomy.tsx`
* `src/app/learn/biochemistry.tsx`
* `src/app/learn/physiology.tsx`
* `src/app/learn/topic.tsx` (any topic: `/learn/topic?topic=<topic id>`)
* `src/app/learn/course.tsx` (kept for old links: redirects a topic id to the topic page)
* `src/app/learn/fatty-acid-biosynthesis.tsx` (kept for old links: redirects to the topic page)
* `src/app/learn/lesson.tsx` (`/learn/lesson?lesson=<lesson id>[&layer=learn|read]`)
* `src/app/learn/quiz.tsx` (lesson quiz, topic quiz, practice wrong answers, mastery check)
* `src/app/learn/results.tsx` (`/learn/results?attempt=<attempt id>`)
* `src/app/learn/review.tsx` (spaced-repetition review sessions)
* `src/app/learn/apex.tsx` (Apex Challenge: `/learn/apex?course=<course id>`; 10 seconds per question, set in `src/data/learning/apex.ts`)
* `src/app/login.tsx` (sign in, create account, Continue with Google, forgot / reset password)
* `src/app/onboarding.tsx` (first-run interactive introduction: `/onboarding[?replay=1]`)
* `src/app/settings.tsx`, `src/app/social/index.tsx`, `src/app/social/friends.tsx`, `src/app/explore/discovery.tsx`

Build every learn-flow link with `src/lib/routes.ts` (it never produces `undefined` in a URL).

## Authentication and onboarding

Everything uses Firebase Auth (`src/lib/firebase.ts`, `src/lib/firebase-auth.ts`, `src/hooks/use-auth.tsx`). Do not add a second auth system.

* **Create account:** Firebase Auth `createUserWithEmailAndPassword`, with the learner's name saved to their user profile.
* **Continue with Google:** `src/lib/google-auth.ts`.
  * On the web it handles Google sign-in via Firebase popup/redirect.
  * On phones it uses `expo-web-browser`.
* **Route guard:** `AppGuard` in `src/app/_layout.tsx`.
  * Signed-out users go to `/login`.
  * Password-recovery links stay on `/login`.
  * A signed-in learner who needs onboarding goes to `/onboarding`.
  * Signed-in learners on `/login` go to Home.
* **Who needs onboarding:** `src/data/onboarding.ts`. Accounts created on or after the release date (`ONBOARDING_RELEASE`) see the introduction once.
  * Finishing or skipping is stored on the device and in the account metadata (`onboarding_completed`), so it follows the learner to other devices.
  * Settings → Help → "Replay the introduction" shows it again.
* **The introduction:** `src/components/onboarding/`.
  * It is practice only: demo answers, XP and schedules are never recorded.
  * The one exception is "Make it yours" (name, avatar, theme), which saves real settings and is labelled as such.

There is intentionally no `src/app/learn/_layout.tsx` unless the project owner specifically asks for one.

## Current data structure

Inventory of every file in `content/` (topics, sources, annotations, outlines):

`src/data/content-catalog.ts`

Content types (Subject → Topic → Lesson → Concept, sources, discrepancies):

`src/data/lesson-types.ts`

Each topic with lessons lives in `src/data/topics/<topic>/` (`sources.ts`, `lessons.ts`, `interactive.ts`, `questions.ts`, `index.ts`), built by `src/data/topics/build.ts` and registered in:

`src/data/topics/index.ts` (also set the topic's status to `published` in `src/data/content-catalog.ts`)

Anatomy (HB2) is taught in three sections. Every anatomy topic sets `section` in its `index.ts` to `'Gross Anatomy'`, `'Microanatomy'` or `'Embryology'` (`TopicSection` in `lesson-types.ts`); the app shows it as section headings on the topic path and the HB2 course path, a pill on topic cards, the topic breadcrumb and the lesson subtitle. Gross anatomy topics (in course order): Upper Limb, Cardiovascular System, Respiratory System, Gastrointestinal System, Urinary System, Head and Neck, Neuroanatomy. `tests/hb2-study.test.mjs` fails if an anatomy topic has no section.

Subject → course → topic → lesson lookups (the one curriculum model):

`src/data/curriculum.ts`

The learning engine is in `src/data/learning/`:

* `scheduler.ts` — spaced-repetition scheduler (documented at the top of the file)
* `memory.ts` — concept and question memory, derived from answer history
* `selection.ts` — quiz / review / Apex question selection (never a fixed list)
* `xp-rules.ts` — every XP amount and penalty
* `progress-model.ts`, `next-action.ts`, `calendar.ts`, `events.ts`, `lesson-sessions.ts`, `apex.ts`

Question history and quiz attempts are in `src/data/question-history.ts` and `src/data/quiz-history.ts`.

Social (real friends) is in `src/data/social.ts`, backed by Firestore:

* Usernames, learner search, friend requests, and social notifications.
* Realtime sync through Firestore snapshot listeners.

"Stump a friend" (`src/data/stumps.ts`, `src/components/social/stump-card.tsx`): from quiz results, a multiple-choice question is shared to the feed as a post with `stump: { qid, note }`; friends answer on the card (answers are hidden `replies` with `stump: { pick, ok }`, saved to question history as practice, no XP). Only the sharer sees who got it right or wrong; others see only their own result. Works with the deployed Firestore rules unchanged.

Database changes use Firestore rules in `firestore.rules`. Deploy them only with the owner's approval.

Lecture diagrams (tappable images) are in `src/data/figures/` (one file per topic, registered in `index.ts`); the pictures are slide crops in `public/figures/<topic>/`. A reading section shows one with `figure: '<id>'` ("Explore" / "Test yourself", `src/components/learning/figure-view.tsx`); `spotQuestion()` in `src/data/topics/build.ts` makes "what is the marked part?" quiz questions (labels covered, never in Apex). `tests/figures.test.mjs` checks every image and reference.

* In a lesson a diagram is a compact preview card ("Explore diagram"); the interactive diagram opens in a sheet, so diagrams never take over the reading (owner's request). Quiz diagrams are capped at 280 px tall.
* Topics with diagrams: Cardiovascular Physiology, Upper Limb, and all eight Biochemistry topics (2026-10-16). HB2 lessons show them too (block `lfig` in `hb2-study.ts`).

undefined

Progress functionality is currently in:

`src/data/progress.ts`

Compliments are currently in:

`src/data/compliments.ts`

Learning remarks are currently in:

`src/data/remarks.ts`

## Lesson simulations (interactive models)

The interactive layer has a fourth step type, `simulate` (`SimulationStep` in `src/data/lesson-types.ts`). Each Cardiovascular Physiology lesson has one, placed just before its final recall prompt.

* **Models** (pure, testable): `src/data/simulations/<id>.ts`, registered in `src/data/simulations/index.ts`. A model takes control values and returns readouts, plus anything its drawing needs. Each lists its controls, readouts, Explore situations and Challenges, and a `modelNote` saying what is simplified and where the numbers come from (lecture slides; any textbook value is labelled).
* **Drawings**: `src/components/learning/simulations/graphics/<id>.tsx` (react-native-svg, theme colours only), chosen in `graphics/index.tsx`.
* **The step**: `src/components/learning/simulations/simulation-step.tsx` — Predict (a normal checkpoint question, answered before the model runs the change), then Explore and Challenge, which unlock once the predictions are answered. Continue is enabled after the predictions. Predictions are recorded like `ask` checkpoints (memory, Review, first-try count).
* **Content**: each topic's predictions and step text, e.g. `src/data/topics/cardiovascular-physiology/simulations.ts` (`simulate()` helper in `build.ts`; added to the lessons by `withSimulation` in `lessons.ts`).
* **Sliders**: `slider.web.tsx` (a real range input on the web) and `slider.tsx` (drag on phones).
* **Checks**: `tests/simulations.test.mjs` — every prediction's marked answer must match what the model shows, every scenario stays in range, and every challenge is unsolved at its start and solvable with its unlocked controls.
* Adding a simulation: write the model, its drawing, register both, then add a `simulate()` step with predictions to the topic. Bump the topic's `contentVersion` when steps are added, so half-finished lesson sessions restart cleanly.

## Ask AI and AI Flashcards (every lesson)

Every lesson has an "Ask AI" tab (questions answered from the lesson's own text) and an "AI Flashcards" tab (question-and-answer cards the AI writes from the lesson, studied with the same spaced repetition as the normal flashcards). Both are on `src/app/learn/lesson.tsx` and `src/app/learn/hb-lesson.tsx`.

* Providers, tried in order (same chain as Study chat): any OpenAI-compatible service, Groq by default (`CHAT_API_KEY`, optional `CHAT_API_BASE`, `CHAT_MODEL`), then Gemini 3.1 Flash-Lite (`gemini-3.1-flash-lite`, change with `GEMINI_MODEL`). If one is missing or fails, the next answers.
* The Gemini key never goes in the app. `api/ai.mjs` (a Vercel function, like `api/push.mjs`) checks the learner's sign-in token, limits requests per learner, and calls the providers. Set `CHAT_API_KEY` and/or `GEMINI_API_KEY` in Vercel → Settings → Environment Variables, then redeploy.
* `src/lib/ai-study-api.ts` calls it; `src/data/ai-study.ts` turns a lesson into plain text and handles saved cards (kept on the device, key `grateapex_ai_cards:<lesson id>`); `src/components/learning/ai-study.tsx` holds the two panels.
* `expo start` does not run `api/`, so the AI shows a friendly "runs on the live app" message in a local preview. To try it locally use `vercel dev`, or set `EXPO_PUBLIC_API_BASE` to the live site.
* `tests/ai-study.test.mjs` checks every lesson produces text for the AI.
* **AI while studying** (`src/components/learning/ai-explain.tsx`, `api/ai.mjs` mode `explain`):
  * Every wrong answer in a quiz, review, HB practice or past paper (`QuestionCard`) has "Explain my mistake with AI"; the results page has "Explain with AI" on every answer. It explains from the lesson's lecture text (`src/data/ai-context.ts` finds it from the question's `lessonId`), with follow-up questions.
  * The Read page of both lesson screens has a floating "Ask AI" button (`AskAiFab` in `ai-study.tsx`) that opens Ask AI in a sheet without leaving the page.
  * Flashcards (term cards and AI cards) show "Ask AI about this card" once flipped.

## Study chat (general AI chat, outside lessons)

`/learn/chat` (`src/app/learn/chat.tsx`) is a general AI chat, linked from the Learn home. It calls `/api/chat` (`api/chat.mjs`) through `src/lib/ai-chat-api.ts`, with its own per-learner allowance (120 requests / 10 min) separate from the lesson AI.

* Providers, tried in order: any OpenAI-compatible service (`CHAT_API_KEY`, optional `CHAT_API_BASE` default Groq, optional `CHAT_MODEL`), then Gemini (`GEMINI_API_KEY`, optional `GEMINI_CHAT_MODEL`). If the first is rate-limited or down, the next answers. Set at least one key in Vercel, then redeploy.

## Gifts between friends (coins and XP boosts)

XP itself is never transferable; Apex Coins and XP boosts are, between friends (each follows the other).

* **Coins:** `sendApexCoins` / `claimIncomingCoins` in `src/data/apex-coins.ts`, Firestore `coinTransfers` (from the Apex Coins card on Profile).
* **Boosts:** `src/data/boost-gifts.ts`, Firestore `boostTransfers`. The boost leaves the sender's inventory (`takePowerup` in `powerups.ts`) and arrives as a `gift` power-up (timed or single-use, same multiplier and duration). Document id `<from>_<to>_<day>_<n>` lets the rules allow at most 3 boosts per friend per day. Gift from Achievements → Boosts, or "Gift a boost instead" on the coins sheet (`src/components/gift-boost-sheet.tsx`).
* **Arrival:** `src/components/coin-gift-sync.tsx` (in `_layout.tsx`) collects both every few minutes and shows "Gifts from friends"; `api/push.mjs` kind `gift` alerts the friend's devices.
* The `boostTransfers` rules are in `firestore.rules`: deploy the rules after changing them.

## Streaks (learning and friend), freezes and restores

Rules in one pure, tested module: `src/data/learning/streak-rules.ts` (`tests/streak-rules.test.mjs`).

* **Learning streak** (`src/data/progress.ts`): any learning activity keeps it — a lesson (even one done before), any quiz, review, practice, Apex, battle, question of the day, or a flashcard session (`markStudyActivity`). A whole calendar day with none ends it at midnight: the shown streak becomes 0 and the old one is kept as `lostStreak`.
* **Freezes:** 5 lessons completed in a week (Monday–Sunday) earn one, up to 2 stored (`streakFreezes`, `freezeWeeks`). One is used automatically for each missed day.
* **Restore:** within 3 days of losing it, for 100 Apex Coins (`restoreStreakWithCoins` in `apex-coins.ts`; coins are given back if it fails). The old streak continues, including any study done since.
* Saved with the progress (`progress/{uid}`: `streak`, `lastActivityDate`, `streakFreezes`, `freezeWeeks`, `lostStreak`) and on `scores/{uid}` (`streak`, `streakDay`, `streakFreezes`) so friends see it lapse.
* **Friend streaks** (`src/data/friend-streaks.ts` rules, `src/data/friend-streak-store.ts` loading): days on which both friends messaged each other, from the chat's last 400 days. A missed day can be covered by either friend with freezes (one per day) or 100 coins; covered days are shared in `friendStreaks/{chatId}`. Shown in the chat header, the chats list and Social → Friend streaks; the chat shows "at risk" and "restore" notes (`components/chat/friend-streak-notice.tsx`).

## Stories (Instagram-style)

Stories live in `users/{uid}/stories` (rules already allow them; nothing to deploy). The data is in `src/data/community.ts` (`listLiveStories`, `createCommunityStory`, `STORY_BACKGROUNDS`), the strip of rings and the composer are in `src/components/social/social-activity-feed.tsx`, and the full-screen viewer is `src/components/social/story-viewer.tsx`.

* Tap right / left for next / previous, hold to pause, swipe sideways to change person, swipe down to close; it carries on to the next person; arrow keys, Space and Esc work on the web.
* A photo's timer waits until it has loaded. Web videos drive their own progress bar; on phones a video shows its still frame for 15 seconds.
* Text-only stories can have one of six background colours (saved as `bg`).
* "+" on your own ring always adds another story.

## Progress system

GRATEAPEX has persistent progress using AsyncStorage.

Progress includes:

* XP
* level
* streak
* lessons completed
* completed lesson IDs
* subject progress
* last activity date

Lesson completion should:

1. Prevent duplicate XP for an already completed lesson.
2. Add the lesson ID to completed lessons.
3. Increment lessons completed.
4. Increase the relevant subject progress.
5. Update the streak.
6. Add XP.
7. Persist the updated progress.
8. Notify the UI so the current screen immediately reflects the new state.

Do not break duplicate-completion protection.

## Lesson system

The lesson screen should show a completion state after the learner completes a lesson.

After completion, the learner should be able to:

* See "Lesson Completed"
* See the XP earned
* Take the lesson quiz when a quiz exists
* Return to the course

Lesson pages should be scrollable.

Important content should not be hidden behind bottom navigation.

## Quiz system

The quiz system currently supports:

* Multiple-choice questions
* Answer selection
* Instant feedback
* Submit-at-end mode
* Score calculation
* Timer
* Retaking quizzes
* Practicing wrong answers
* Tracking wrong question IDs
* Tracking incorrect concepts
* Results screen

Do not remove these features when modifying the quiz system.

## Quiz results

The results screen is intended to show:

* Score
* Strengths
* Areas needing improvement
* Learning remark
* Time-related feedback
* Practice wrong answers
* Retake quiz
* Return to course

Learning remarks use persistent usage tracking so the same remark should not unnecessarily repeat when alternatives are available.

## Course content rules

All supplied files for a topic are merged; none is treated as the single authoritative file. Where sources disagree, keep both versions (topic `discrepancies` and a "check" note) instead of correcting them. Material added to a deck after the lecture (speaker notes, comments, pasted images) is labelled as an annotation and is not used in quizzes until confirmed.

## Navigation

Web navigation is controlled by:

`src/components/app-tabs.web.tsx` (phones/tablets: `src/components/app-tabs.tsx`)

The five destinations live in `src/components/nav-items.tsx`, and both shells read them from there. The order is Home, Learn, Social, Explore, Profile (the owner's choice).

* **Desktop:** the left rail is `src/components/desktop-sidebar.tsx`. With "Always visible" it is docked; with auto-hide it floats in from the left edge.
* **Phones and narrow web:** the floating bottom bar is `src/components/floating-tab-bar.tsx`. It auto-hides on scroll down; see `src/components/tab-bar-visibility.tsx`.

Some learning and results routes are intentionally hidden from the main navigation and are reached through the learning flow.

Do not expose hidden routes in the main navigation unless specifically requested.

## Design system

The full redesign rationale is in `docs/redesign-notes.md`.

### Tokens and motion

* All colours, type, radius and elevation come from `src/constants/theme.ts`:
  * `useTheme()` / `useThemedStyles()`
  * `Type.*`, `Radius.*`, `elevation(colors, level)`
* All durations, springs and curves come from `src/constants/motion.ts`.
* Respect reduced motion: use `useReducedMotion()`.
* Never hard-code new colours in screens.

### Atmosphere

* The page background is the shell's atmosphere layer (`src/components/atmosphere/`). In Originate it is one plain colour from the theme (the per-route moods no longer change the look); The Originals and Hybrid draw the original gradient instead.
* Screens are transparent, so build pages with `Screen` from `src/components/ui/screen.tsx`. Do not give screens an opaque page background.

### Originate design system (2026-10-16)

* Originate follows `docs/design-system.md` — read it before changing any Originate screen. In short: IBM Plex Sans (Source Serif 4 for lesson text), weights 400/500/600, sentence-case labels, a plain page colour (no atmosphere effects), cards only when grouping helps (radius 12, 1px border, no shadow), lists as `List` / `ListRow` (`src/components/ui/list.tsx`), one primary button per screen, a docked tab bar on phones, and only motion that answers an action.
* The rules live in the primitives and switch on `useExperience() === 'originate'`, so The Originals and Hybrid look exactly as before. The type rules are applied to every `Text` by `src/components/ui/text.tsx` (`src/data/originate-type.ts`); shape and spacing values are in `src/constants/originate.ts`.
* The Originals is the default experience; the chooser and Settings never call one experience "recommended" (owner's choice, 2026-10-16).
* Originate's desktop sidebar (`src/components/desktop-sidebar.tsx`) is the owner's favourite: do not restyle it.
* Originate's Study page keeps every section The Originals has (course pictures, question of the day, practise-and-plan tiles, your progress, your week), drawn in Originate's style.

### Primitives (`src/components/ui/`)

* `Card` / `PressableCard` (with tones), `Button`, `IconButton`
* `ProgressBar`, `ProgressRing`, `AnimatedNumber`
* `Pill`, `SegmentedControl`, `Sheet` (a bottom sheet on phones, a dialog on desktop)
* `Avatar` / `AvatarStack`
* `EmptyState`, `ErrorScreen`, `LoadingState` (skeletons), `InlineNotice`
* `List` / `ListRow` for lists of the same kind of thing
* Reuse these instead of styling one-off rows, cards or buttons.

### Icons and glyphs

* No emoji in the interface. Use `Icon` (`src/components/ui/icon.tsx`), the GRATEAPEX SVG icon set.
* Subjects and topics use `SubjectGlyph` / `TopicGlyph` (`src/components/learning/glyphs.tsx`). The anatomy glyph is a human body.
* A subject's topics are shown as a vertical path, in course order (finish one, then the next).

### Avatars

* `src/components/avatar/` holds the illustrated male and female presets plus the picker.
* A learner's choice is saved through `setAvatarUrl` in `profiles.avatar_url` as one of:
  * `preset:<id>`
  * a small resized photo data URI (`src/lib/avatar-upload.ts`)
  * nothing, which shows initials

### Notifications

* `src/data/notifications.ts` derives notifications from real learning state. Only read marks are stored, on the device.
* The bell and centre UI are in `src/components/notifications.tsx`.
* Phone and computer alerts that arrive when the app is closed (messages, follows, likes, comments, **battle challenges and results**) go through `api/push.mjs`; **streak-at-risk, review-due, weekly league and Sunday weekly-summary pushes** are sent on a daily schedule by `api/reminders.mjs` (needs `FIREBASE_SERVICE_ACCOUNT` and `CRON_SECRET` in Vercel). Shared rules are in `api/_push-logic.mjs`, checked by `tests/push-logic.test.mjs`. Setup, switches and a safe dry run: `docs/push-notifications.md`.

### Offline study

* `public/sw.js` keeps the app shell, scripts, pages already visited, question banks (`/curriculum/*.json`, shown from the saved copy and refreshed in the background) and lecture diagrams (`/figures/*`). Banks and diagrams live in the `grateapex-offline-v1` cache, which app updates never delete.
* Settings → Offline study (`src/components/offline-study-card.tsx`, `src/data/offline-study.ts`, `src/lib/offline-study.ts`) downloads a class's banks, diagrams, original lessons and lesson pictures on request. Lesson text, pictures and the lesson list are stored in the same cache on the web (not localStorage, which is too small); `legacy-study.ts` reads them when there is no connection.
* If you change `OFFLINE_CACHE`, change it in both `public/sw.js` and `src/lib/offline-study.ts`.
* The 3D atlas (`/atlas/*`) is deliberately skipped by `public/sw.js` (an old saved copy once left phones stuck on a broken atlas), `vercel.json` makes `/atlas/anatomy` and `/sw.js` revalidate on every load, and every atlas address carries a fresh `?v=` stamp (`atlasFresh()` in `src/lib/atlas-theme.ts`). Keep all three if you touch the atlas wiring; bump `CACHE_NAME` in `public/sw.js` whenever a deploy must purge what phones already saved.
* The atlas models (`/atlas/**/*.glb`, ~80 MB) are downloaded once: `vercel.json` lets browsers keep them for a year, and the page asks for them as `file.glb?m=<MODEL_VERSION>` (`MODEL_VERSION` in `public/atlas/anatomy.html`). **When any .glb file changes, bump `MODEL_VERSION` and update `KNOWN_MODELS` in `tests/deploy-wiring.test.mjs`** (the test fails until you do), otherwise learners keep seeing the old models. The page itself (`anatomy.html`) is still revalidated on every open.
* Med Term Scramble (`public/game-builds/med-term-scramble/`) needs three things kept as well: `node scripts/assemble-games.mjs` at the start of the `vercel.json` build command (it joins `index.wasm` from its parts; without it the game never loads), the `/game-builds/` handling in `public/sw.js` (keeps a copy in the offline cache so a game played once also plays offline; fetches the original request and never saves a redirect, because play.html redirects to /play), and the hidden `games/med-term-scramble` tab in both `app-tabs` files. The game page takes the whole screen like a chat (`setTabBarLocked` while it is open). Touch scrolling inside the game is in `games/med-term-scramble/scripts/ui/screen.gd`; after changing the game, export the pack (`--export-pack Web`) into `public/game-builds/med-term-scramble/index.pck` and update its size in `play.html`. `tests/deploy-wiring.test.mjs` checks the atlas and game wiring.

### Anatomy atlas quiz (2026-10-17)

* `public/atlas/anatomy.html` → menu section "Quiz" (the `/* ---------- quiz mode ---------- */` block in the script). The learner picks one body system, and each of 10 questions highlights a structure with its name hidden and offers four choices (wrong answers are other structures with a different name). Structures under 1.2 cm are skipped, and a round asks at most two of the same family (e.g. phalanges).
* While a quiz runs (`body.quizzing`) the menu, info card, hover names and tapping the model are all switched off so nothing gives the answer away, and only the chosen system shows, in x-ray. Ending the quiz (Done, the close button, or Escape) puts back which systems were ticked and the x-ray setting.
* The learner can also pick a body region (Head … Lower limb; the limbs ask Right / Left). The view is cut to that region while the quiz runs (`setRegion(id, true)`), and only structures whose centre is in it are asked about. The Explore tab's own region and limb side are put back afterwards.
* The Explore tab's Upper limb / Lower limb regions show one limb at a time (Right / Left chips; right is −x, left is +x in the model), and can be narrowed to a part: Shoulder, Arm, Forearm, Hand (upper) or Thigh, Leg, Foot (lower). The arms hang down at the sides, so a part is a band of height (`LIMB_PARTS` in `anatomy.html`: shoulder ≥ 1.30 m, elbow 1.10, wrist 0.86, knee 0.43, ankle 0.085, measured from `landmarks.json`). The same side and band are tested on the CPU (`inRegion`) and in the shader (`uLimbSide`, `uLimbLo`, `uLimbHi`). The quiz uses the same parts. `tests/atlas-quiz.test.mjs` runs the page's own `inRegion` against the real landmarks, so keep the CPU and shader tests in step.
* A finished round is posted as `{ type: 'quiz', system, region?, side?, score, total }`. On the web the page is an iframe, so `post()` also sends it to the parent window (same origin only).
  * `src/components/learning/skeleton-atlas.web.tsx` listens (only to its own iframe), checks the message with `parseAtlasQuizMessage` (`src/data/learning/atlas-quiz-rules.ts`) and saves it with `recordAtlasQuiz` (`src/data/atlas-quiz.ts`).
  * XP: `XP_RULES.atlasQuiz` / `atlasQuizXp` (10, +10 at 90%, +5 at 75%, no penalty), paid once per day (award key `practice:atlas-quiz:<day>`, like the Question of the Day). Every round still counts for the streak. The app replies `{ type: 'quizXp', amount }` and the score card shows it.
  * On phones the atlas opens in the in-app browser, which has no link back to the app, so scores are not recorded there yet.
* Phones: the quiz card is compact, full width, at the bottom; the camera aims a little below the structure so it sits above the card.

### Locked elements

* The logo and its hover shine (`src/components/logo-mark.tsx`) are locked, and so is the ~3-second intro (`src/components/animated-icon*.tsx`).
* The only intro additions are the background behind it and the "developed by OrigiNate" credit (`src/components/intro-credit.tsx`).
* The OrigiNate signature at the bottom of screens was removed at the owner's request (2026-10-13); `src/components/signature.tsx` is no longer shown.

### Data honesty

* Every number shown comes from real learning data.
* Sample data (Friends) is labelled as sample.
* Features that are not built say "coming soon".

## UI requirements

Pages should generally be scrollable.

Leave sufficient bottom spacing so content and buttons are not hidden behind navigation.

Keep the interface clean, readable, and suitable for medical students.

Do not introduce unnecessary visual complexity.

## File modification rules

Before modifying code:

1. Inspect the relevant files.
2. Understand the existing implementation.
3. Identify the smallest appropriate change.
4. Avoid changing unrelated files.
5. Preserve existing working behavior.

After modifying code:

1. Check for TypeScript errors (`npm run typecheck`).
2. Run an appropriate validation command when practical (`npm test` checks the learning engine and every published topic's content).
3. Explain what changed.
4. Mention any remaining issue or uncertainty.

For larger changes, first provide a short implementation plan before editing.

Do not rewrite an entire project when a focused change is sufficient.

## Testing priority

The current priority is the web version of GRATEAPEX.

Do not spend time fixing Android-specific behavior unless the project owner explicitly asks for it.

## Git safety

Do not delete working features or files without explaining why.

Do not reset, revert, or overwrite unrelated user changes.

Do not make destructive Git operations unless explicitly requested.

## Working style

The project owner prefers working one clear step at a time.

When a task has multiple possible approaches, recommend the simplest reliable approach.

If something is broken, diagnose the existing implementation before proposing a rewrite.

The goal is to build GRATEAPEX incrementally into a polished medical-student learning ecosystem.

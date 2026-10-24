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

Anatomy (HB2) is taught in three sections. Every anatomy topic sets `section` in its `index.ts` to `'Gross Anatomy'`, `'Microanatomy'` or `'Embryology'` (`TopicSection` in `lesson-types.ts`); the app shows it as section headings on the topic path and the HB2 course path, a pill on topic cards, the topic breadcrumb and the lesson subtitle. Gross anatomy topics (in course order, owner 2026-10-19, following the course outline: cardiovascular system, thoracic cavity, abdomen, pelvis and perineum, upper limbs, lower limbs, head and neck, CNS): Cardiovascular System, Respiratory System, Gastrointestinal System, Urinary System, Upper Limb, Head and Neck, Neuroanatomy (no Lower Limb topic yet). The order is set in `builtTopics` (`src/data/topics/index.ts`), the anatomy entries of `src/data/content-catalog.ts` and `PAST_TOPICS` in `past-question-topics.ts`; keep the three in step. `tests/hb2-study.test.mjs` fails if an anatomy topic has no section.

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

**Firebase reads (free plan, owner 2026-10-18):** the project is on Firebase's free Spark plan (50,000 document reads a day for everyone). Never poll Firestore with `getDocs` on a timer: use `onSnapshot` listeners, which are charged only for changed documents. Open chats (`watchConversationMessages`, `watchConversationMeta`, `watchGroupMessages`, `watchGroup`), the chats list (`myChatDocs` in `community.ts`, shared by the chats list, the bell and the recent-messages card), the groups list (`listMyGroups`) and the bell's account notifications are all live. The friend streak reads only messages newer than the last load. `tests/firebase-reads.test.mjs` checks this, and that every collection the app uses has a rule.

**Quota ran out on 2026-10-24** ("429 Quota exceeded" by mid-afternoon). Fixed by: the league promotion watcher reads `league` from the live account and only calls `loadLeague` to join or settle a week (`savedLeague`, `saveWeeklyLeagueXp`); a loaded league is reused for 10 minutes; presence is written every 3 minutes (`PRESENCE_EVERY_MS`, online for `ONLINE_WITHIN_MS` = 5 minutes, `src/lib/presence.ts`); battles are watched only while on screen (`useFocusEffect`); the coin balance comes from the live account (`coinsOf`), not a timer. Keep these; `tests/firebase-reads.test.mjs` checks them.

"Stamp a friend" (renamed from "Stump a friend" on screen, owner 2026-10-20; the code, files and database names keep "stump" so existing posts and answers keep working — only text learners see says "Stamp") (`src/data/stumps.ts`, `src/components/social/stump-card.tsx`): a multiple-choice question sent from quiz results or from the stump button in any chat (`pickStumpQuestion` picks only questions the learner has answered, owner 2026-10-18). The composer sends it to any mix of the feed, friends (each in the private chat) and groups (`sendStump`). Answers are saved to question history as practice, no XP. Only the sender sees who got it right or wrong; others see only their own result, and the database enforces it (owner: answers must be private).

* **Feed:** a post with `stump: { qid, note }`; answers are private documents `posts/{id}/stumpAnswers/{uid}` (readable by the answerer and the post's author). Older answers were public `replies` with `stump: { pick, ok }` and are still read.
* **Chats and groups:** a message with `share: { kind: 'stump', uid, username, id: <question id>, text, note }` (the original app's shared-post shape, so it shows there as a shared post). In a direct chat an answer is a message with `share: { kind: 'stumpAnswer', id: <stump message id>, pick, ok }` (only the two of you can read it). In a group an answer is a private document `groups/{gid}/stumpAnswers/{stump message id}_{uid}` (`from`, `to` = the sharer), read live by `watchGroupStumpAnswers`. Answer messages are never drawn as bubbles: the stump card reads them (`chatStumpAnswers`).
* Until the 2026-10-18 rules are published, answering falls back to the old public way, so nothing breaks.
* Past-paper questions (`legacy:<course>:<id>`) are only known once their paper is loaded: `useStumpQuestion` / `StumpById` load it first, so friends who never opened that paper can still answer.

**Report this question** (owner, 2026-10-20): every answered question (`QuestionCard`) has "Report a problem with this question" (`src/components/learning/question-report.tsx`): wrong answer, typo, unclear, options, other, with a note. A report is private (`questionReports/{key}_{uid}`, one per learner per question); a public counter `questionFlags/{key}` is written in the same transaction, and once 2 learners say "wrong answer" (`UNDER_REVIEW_AFTER` in `src/data/question-report-rules.ts`) the question shows "Being checked" to everyone. Flagged questions are read once per session (one query). Admins see open reports in Settings → Help → Reported questions (`/learn/question-reports`) and mark them "Fixed" or "Not an error", which clears the note. Rules in `firestore.rules` (needs publishing); `tests/question-reports.test.mjs`.

**Exam practice** (owner, 2026-10-20), on the Learn home's "Practise and plan" tiles; all three run in the normal quiz engine (`/learn/quiz?exam=…`, settings in `src/data/exam-practice-rules.ts`, pools in `src/data/exam-practice.ts`, kept on the attempt as `customQuiz.exam`; `tests/exam-practice.test.mjs`):

* **Mock exam** (`/learn/mock-exam`): an HB2 course, 20–100 questions and a time for the whole paper (`timeLimitSeconds` on `QuestionSession`: at zero the answers are handed in). Drawn at random from the course's past papers, answers at the end; Results shows "Score by topic", weakest first.
* **Spotter** (`/learn/spotter`): timed picture stations (each with its own clock, moving on when it runs out): the lecture diagrams' "what is the marked part?" questions plus past-paper questions with a picture (`img`). Answers at the end.
* **Answers after each or at the end** (owner, 2026-10-20): every quiz except the interactive lesson lets the learner choose — the start card in `quiz.tsx`, and a "When do you want to see the answers?" switch at the top of `QuestionSession` until the first answer (lesson and topic quizzes, practice, mock exams, spotters, past papers and HB practice; not Apex). Mock exams and spotters start on "At the end".
* **Pictures and the clock:** a question with a picture starts its clock only once the picture has loaded (`onPictureReady` from `QuestionCard` / `figure-view.tsx`, or after 25 s), shows "Loading the picture…" / "Try again", and the next pictures are downloaded ahead (`prefetchQuestionPictures`). Lecture diagrams over 60 KB were shrunk (max 1200 px, palette PNGs) on 2026-10-20.
* **Your weakest 20**: the learner's most-missed questions, worst first (`src/data/learning/weakest.ts`: missed at least once, not yet right twice in a row). The tile says when today's set is done (this device).

**Focus timer** (owner, 2026-10-20): `/learn/focus` (Learn home tile). The clock lives in `src/data/focus-timer.ts` (not the page), so it runs in the background; when a block ends an alarm rings (`alarmFeedback` in `lib/feedback.ts`, made ready by the Start tap with `primeAlarm`, rings even with answer sounds off), and a device alert shows if alerts are allowed and the app is hidden. The page tells the learner it runs in the background and that an alarm rings. 25/5, 50/10 or 15/3 blocks; the clock runs from an end time and is kept outside the page, so it survives a background tab or a visit to another page. A finished block (or stopping after 5+ minutes) records its minutes (`src/data/focus.ts`, pure rules in `focus-rules.ts`, `tests/focus-timer.test.mjs`), keeps the learning streak (`markStudyActivity`) and feeds the "Focus minutes" personal goal. The log is synced as `synced.focus`.

**Same on every device** (owner, 2026-10-19): `src/data/account-sync.ts` keeps small per-account records on the private `progress/{uid}` document as `synced.<name>` (read once per sign-in, written a few seconds after a change, each name replaced whole; no rules change): `seenStories`, `viewedPosts`, `seenAlerts` (device alerts already shown), `lessonSessions` (lessons in progress, with clear marks so a finished one does not come back), `flashcards` (per card, the copy with more reviews) and `prePost`. Notification read marks were already synced (`progress/{uid}.notificationsRead`). XP, lessons, answers, quizzes, planner and quiz drafts sync on their own. After a review today, the "reinforcement is ready" reminder is gone for the day (`reviewedToday` in `buildNotifications`); the daily review push already skips anyone who studied that day.

**Groups** (`src/data/group-chat.ts`) hold up to `GROUP_MAX_MEMBERS` = 20 people (owner 2026-10-18; the rules allow 20).

**Push addresses** are private: `pushDevices/{uid}.webPush` (owner-only rule). `api/push.mjs` and `api/reminders.mjs` read them with the service account (`api/_admin.mjs`, Vercel setting `FIREBASE_SERVICE_ACCOUNT`) and merge the older public `users/{uid}.webPush` list (`mergeDevices`). The app removes the public copy only after `GET /api/push` says `privateDevices: true`.

**The live address** (`https://grateapex.vercel.app`) is only in `src/lib/live-site.ts` (`LIVE_SITE`, `SITE_BASE`, `API_BASE`) on the app side.

Database changes use Firestore rules in `firestore.rules`. Deploy them only with the owner's approval.

Lecture diagrams (tappable images) are in `src/data/figures/` (one file per topic, registered in `index.ts`); the pictures are slide crops in `public/figures/<topic>/`. A reading section shows one with `figure: '<id>'` ("Explore" / "Test yourself", `src/components/learning/figure-view.tsx`); `spotQuestion()` in `src/data/topics/build.ts` makes "what is the marked part?" quiz questions (labels covered, never in Apex). `tests/figures.test.mjs` checks every image and reference.

* In a lesson a diagram is a compact preview card ("Explore diagram"); the interactive diagram opens in a sheet, so diagrams never take over the reading (owner's request). Quiz diagrams are capped at 280 px tall.
* Topics with diagrams: Cardiovascular Physiology, Upper Limb, and all eight Biochemistry topics (2026-10-16), and every Gross Anatomy topic (2026-10-19, owner's request): right atrium, thoracic wall joints, portal venous system, kidney in section, auricle, arteries at the base of the brain. HB2 lessons show them too (block `lfig` in `hb2-study.ts`).
* Making one from a slide: render the slide with PowerPoint, hide the arrows and text boxes, crop to the picture; label and pointer positions come from the slide's own shapes where they are separate (exact), otherwise they are measured on the picture and checked by drawing the pins over it. Labels printed inside a picture get `boxes`.

HB2 past papers (Learn → Past question bank → HB2) are in `public/curriculum/hb2-anatomy.json`, `hb2-biochemistry.json` and `hb2-physiology.json`, one set per paper named `Past Questions N — <label>`. A bank question may carry `img` (a plain picture under `public/figures/`, e.g. the histology practical's diagrams); it is shown with the question, asked as written, and kept out of Apex.

* **By topic:** every HB2 past question has a topic (`tp`), written by `scripts/sort-past-questions-by-topic.mjs` (key words, paper hints, neighbouring questions and hand corrections; rerun it after adding past questions and check its counts). The topics per course are in `src/data/past-question-topics.ts` (the app's topics plus groups without lessons, e.g. Embryology). `tests/past-question-topics.test.mjs` fails if a question has no listed topic.
* **Custom quiz:** each topic card has "Past questions on this topic" (`past=` in the quiz link). `src/data/past-questions.ts` loads a course's past questions and registers them with `curriculum.ts` (`registerExtraQuestions`), so the quiz engine, results and retakes find them by id.
* **Past question bank:** HB2 has a "By paper / By topic" switch; a topic is sat like a paper (`ptopic=` in `/learn/hb-practice`, mode `pastTopic` in `practice-modes.ts`).

Progress functionality is currently in:

`src/data/progress.ts`

Compliments are currently in:

`src/data/compliments.ts`

Learning remarks are currently in:

`src/data/remarks.ts`

## Lesson simulations (interactive models)

The interactive layer has a fourth step type, `simulate` (`SimulationStep` in `src/data/lesson-types.ts`). Each Cardiovascular Physiology, Central Nervous System, Respiratory Physiology, Renal Physiology, Endocrinology, Gastrointestinal Physiology, Reproductive Physiology and Special Senses lesson has one — every Physiology topic, placed just before its final recall prompt. Newer topics use the shared helpers in `src/data/topics/sim-helpers.ts` and the drawing kit `graphics/kit.tsx`.

* **Models** (pure, testable): `src/data/simulations/<id>.ts`, registered in `src/data/simulations/index.ts`. A model takes control values and returns readouts, plus anything its drawing needs. Each lists its controls, readouts, Explore situations and Challenges, and a `modelNote` saying what is simplified and where the numbers come from (lecture slides; any textbook value is labelled).
* **Drawings**: `src/components/learning/simulations/graphics/<id>.tsx` (react-native-svg, theme colours only), chosen in `graphics/index.tsx`.
* **Illustrated organs** (owner's request, 2026-10-18: "if you're using a lung let me see a lung" — no line, circle and tick diagrams): drawings show the real organ, moving with the controls (breathing lungs, red cells coloured by their O₂, a fingertip turning blue). Shared organ pieces live in `graphics/anatomy/` (`lungs.tsx`: lungs, airways, ribs, diaphragm, heart, torso, bronchiole; `cells.tsx`: alveoli, capillary, red cells; `kidney.tsx`: cut kidney, nephron with its vessels and JGA, glomerular tuft, and `Tube` for round tubules and vessels). Tissue colours come from `Anatomy` in `src/constants/theme.ts` (the same in light and dark mode); labels use `Tag` from `kit.tsx`. Numbers belong in the readout tiles, not in bars on the picture; a graph stays only where the lecture itself uses one (e.g. the O₂ curve, the spirogram), drawn next to the organ.
* **Real 3D organs** (owner's choice, 2026-10-19: "3D organs everywhere"): organ-level views use the atlas's own 3D models (Z-Anatomy, CC BY-SA). `public/sim3d/organ.html?scene=<id>` is a standalone three.js viewer (like the atlas, run in a frame); `public/sim3d/scenes.js` lists each scene's models, parts and groups. The app moves it with messages: `Organ3D` (`src/components/learning/simulations/organ-3d.web.tsx`; native shows nothing yet) takes a scene and an `OrganFrame` (per group: `move` scale, `glow`, `glowColor`, `color`, `opacity`); `organ-frames.ts` has helpers (`heartFrame`, `beatAt`). On narrow screens it waits for a "Show in 3D" tap (about 5 MB, then kept by the browser). Microscopic views (cells, nephron, alveoli, vessel wall, capillary bed) stay illustrated in SVG. `scenes.js` must use the atlas `MODEL_VERSION`; `/sim3d/` is skipped by `public/sw.js`; `tests/deploy-wiring.test.mjs` checks both and that every `scene="…"` exists. The Cardiovascular simulations use it (heart, neck-heart, baroreflex, circulation, brain-arteries), the Respiratory ones (chest, breath-control; `chestFrame`) the Renal ones (urinary, bladder, lungs-kidneys) the CNS ones (brain, brain-deep, cord, knee, motor) and the Endocrinology ones (endocrine, endocrine-neck, endocrine-abdomen, adrenals — one set of glands framed four ways by `endocrineScene()` — plus skeleton and calcium; `levelGlow` turns a hormone level into a glow), and the GI ones (gut, gut-upper, mouth — the digestive tract framed three ways by `gutScene()`, which can fade parts — and pelvic-colon), and the Reproductive ones (male, female — the HuBMAP female organs in VisceralSystem100 — and breasts, from `/atlas/reproductive/breasts.glb`, placed with the scene's `offsets` as the atlas does; subfolder files have no lite copy), and the Special Senses ones (eye, visual-pathway, ear, hearing-pathway, taste, smell). Where the atlas reuses one mesh name for both sides (ossicles, temporal bone, cuneus), match the side on the parent's name in the chain. `BONE_MARKERS` in `scenes.js` hides the muscle-attachment patches drawn on the atlas bones. The axis models share one feedback solver, `src/data/simulations/endocrine-axis.ts`. `TagRows` (`graphics/tag-rows.tsx`) lays out the name tags under a 3D organ. Scene options: `slab` cuts the whole scene to a height band (the cord section); a group with `side` ('r'/'l') or `level` [from, to] is a clipped copy drawn on top (one-sided lesions, a cord segment); a `move` group's `pivotAt` (top/bottom/medial) and `axis` let the frame `turn` it in degrees (the knee kick).
* **The step**: `src/components/learning/simulations/simulation-step.tsx` — Predict (a normal checkpoint question, answered before the model runs the change), then Explore and Challenge, which unlock once the predictions are answered. Continue is enabled after the predictions. Predictions are recorded like `ask` checkpoints (memory, Review, first-try count).
* **Content**: each topic's predictions and step text, e.g. `src/data/topics/cardiovascular-physiology/simulations.ts` (`simulate()` helper in `build.ts`; added to the lessons by `withSimulation` in `lessons.ts`).
* **Sliders**: `slider.web.tsx` (a real range input on the web) and `slider.tsx` (drag on phones).
* **Simulations tab** (owner's request, 2026-10-18): Physiology has its own Simulations tab, like Anatomy's Atlas — on the HB2 Physiology course page (`hb-course.tsx`, `&tab=simulations`) and the Physiology subject page (`SubjectScreen` prop `simulations`). It lists every lesson simulation by topic (`src/components/learning/simulation-library.tsx`, `src/data/simulation-library.ts`); each opens on its own page, `/learn/simulation?lesson=<lesson id>` (`routes.simulation`), as practice (predictions there are not recorded).
* **Checks**: `tests/simulations.test.mjs` — every prediction's marked answer must match what the model shows, every scenario stays in range, and every challenge is unsolved at its start and solvable with its unlocked controls.
* Adding a simulation: write the model, its drawing, register both, then add a `simulate()` step with predictions to the topic. Bump the topic's `contentVersion` when steps are added, so half-finished lesson sessions restart cleanly.

## Study from the basics up (owner, 2026-10-24)

* Every step-by-step lesson opens with **Start simple** (`StartSimple` in `interactive-layer.tsx`): the big idea (`description`), the lesson's own key words (`terms`, at most six) and `objectives`. It is a card above step 1, not a step, so sessions in progress keep their place. `tests/start-simple.test.mjs`.
* **Explain it more simply** (`ExplainSimplyButton` in `ai-study.tsx`) under every learn step and every answered checkpoint: Ask AI with `autoAsk` asks for a from-zero explanation.
* HB2 lesson pages recommend the step-by-step version first ("New to this? Start here"); the reading is the notes to revise from.
* **Lesson order follows the lecture decks** (`tests/lesson-order.test.mjs` for numbered decks). Reorder by changing the `lessons` array only; lesson ids never change, so progress is kept.

## Laptop scrolling (2026-10-24)

`src/lib/web-scrolling.ts` (web only, started in `_layout.tsx`): page content ignores the mouse while scrolling (hover redraws caused 200–790 ms freezes), keyboard keys scroll the page without clicking first, and wide windows show a thin scrollbar (`Screen` passes `showsVerticalScrollIndicator` on desktop).

## Ask AI and AI Flashcards (every lesson)

Every lesson has an "Ask AI" tab (questions answered from the lesson's own text) and an "AI Flashcards" tab (question-and-answer cards the AI writes from the lesson, studied with the same spaced repetition as the normal flashcards). Both are on `src/app/learn/lesson.tsx` and `src/app/learn/hb-lesson.tsx`.

* Providers, tried in order (same chain as Study chat): any OpenAI-compatible service, Groq by default (`CHAT_API_KEY`, optional `CHAT_API_BASE`, `CHAT_MODEL`), then Gemini 3.1 Flash-Lite (`gemini-3.1-flash-lite`, change with `GEMINI_MODEL`). If one is missing or fails, the next answers.
* Models are chosen by `api/_ai-models.mjs` (both AI functions): a retired model is replaced by the best one the key can use (it asks the service's model list), and an overloaded Gemini model is followed by other Flash models. Groq retired `llama-3.3-70b-versatile` on 2026-10-19, which stopped all AI until this was added. Vercel logs show "AI answered with <model>". Tested by `tests/ai-models.test.mjs`.
* The Gemini key never goes in the app. `api/ai.mjs` (a Vercel function, like `api/push.mjs`) checks the learner's sign-in token, limits requests per learner, and calls the providers. Set `CHAT_API_KEY` and/or `GEMINI_API_KEY` in Vercel → Settings → Environment Variables, then redeploy.
* `src/lib/ai-study-api.ts` calls it; `src/data/ai-study.ts` turns a lesson into plain text and handles saved cards (kept on the device, key `grateapex_ai_cards:<lesson id>`); `src/components/learning/ai-study.tsx` holds the two panels.
* `expo start` does not run `api/`, so the AI shows a friendly "runs on the live app" message in a local preview. To try it locally use `vercel dev`, or set `EXPO_PUBLIC_API_BASE` to the live site.
* `tests/ai-study.test.mjs` checks every lesson produces text for the AI.
* **AI while studying** (`src/components/learning/ai-explain.tsx`, `api/ai.mjs` mode `explain`):
  * Every wrong answer in a quiz, review, HB practice or past paper (`QuestionCard`) has "Explain my mistake with AI"; the results page has "Explain with AI" on every answer. It explains from the lesson's lecture text (`src/data/ai-context.ts` finds it from the question's `lessonId`), with follow-up questions.
  * The Read page of both lesson screens has a floating "Ask AI" button (`AskAiFab` in `ai-study.tsx`) that opens Ask AI without leaving the page: on a computer (window 1024 px or wider) in a panel docked on the right, like Ask Gemini in Chrome (owner, 2026-10-19; `src/components/side-panel.tsx`, drawn by `SidePanelHost` in `app-tabs.web.tsx`; the page moves over and stays scrollable, and the panel closes when the learner leaves the lesson); on phones and narrow windows in a sheet. While the panel is open, layouts use the page's real width, not the window's (`useLayoutWidth` in `src/components/side-panel-store.ts`, used by `Screen`, `Columns`, `CardGrid` and `hb-lesson.tsx`), so the lesson becomes one column beside the panel instead of being squeezed or pushed over (owner, 2026-10-20).
  * Flashcards (term cards and AI cards) show "Ask AI about this card" once flipped.
  * **Recall steps ("in your own words")** in the interactive lesson have a box to type the answer (owner, 2026-10-20). "Check my answer" sends it to `api/ai.mjs` mode `grade`, which marks it against the lecture slides first, then the model answer (`api/_grade.mjs`, `tests/ai-grade.test.mjs`): a verdict, short feedback, the slide points missing, and anything beyond the slides. The learner still picks the rating (the AI's is preselected), so Review works as before. Enter makes a new line in that box.

## Study chat (general AI chat, outside lessons)

`/learn/chat` (`src/app/learn/chat.tsx`) is a general AI chat, linked from the Learn home. It calls `/api/chat` (`api/chat.mjs`) through `src/lib/ai-chat-api.ts`, with its own per-learner allowance (120 requests / 10 min) separate from the lesson AI.

* **AI chat history** (owner's request, 2026-10-20): every AI chat is saved to the learner's account in `users/{uid}/tutorChats` (existing rules, nothing to deploy) and listed under **Recent AI chats** on this page, with a filter (Study, Lessons, Explain, Voice). Study chat, Ask AI in a lesson (`AskAiPanel`, which also lists that lesson's recent chats, read by id prefix), "Explain with AI" threads and Voice tutor transcripts (saved when the call ends) all save themselves. Any of them except a voice call can be opened here and continued. The id prefix gives the kind (`tc_`, `la_<lesson>_`, `ex_`, `vt_`) and the first saved turn is a `{ role: 'context' }` note with the lesson / question: `src/data/ai-chat-history.ts` (pure, `tests/ai-chat-history.test.mjs`) and `src/data/tutor-chats.ts`.
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
* **Friend streaks** (`src/data/friend-streaks.ts` rules, `src/data/friend-streak-store.ts` loading): days on which both friends **stumped each other** in their chat (owner's rule, 2026-10-18), from the chat's last 400 days. Days before `STUMP_STREAKS_FROM` (2026-10-21) count when both sent any message, so streaks that existed at the switch were kept; do not move that date backwards. Group stumps do not count toward a pair's streak. A missed day can be covered by either friend with freezes (one per day) or 100 coins; covered days are shared in `friendStreaks/{chatId}`. Shown in the chat header, the chats list and Social → Friend streaks; the chat shows "at risk" and "restore" notes (`components/chat/friend-streak-notice.tsx`).

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

**True/false questions are plain statements** (owner, 2026-10-20). Practice sets turn some multiple-choice questions into true/false with `trueFalseStatement` (`src/data/true-false.ts`, used by `buildLocalPractice` and `buildPractice`): "Which enzyme type removes water from its substrate?" + "Hydrolase" becomes "Hydrolase is the enzyme type that removes water from its substrate." A question that does not read well as a statement is not turned into true/false. Never write "For “…”, the answer is “…”", and never put "— the answer is …" inside an assertion (the 140 such biochemistry assertion–reason questions were rewritten; the 25 whose reason only repeated the answer are now plain true/false). `tests/true-false.test.mjs`.

**Answer options must not give the answer away** (owner, 2026-10-20: "the most worded answers tend to be the correct answers"). Write every wrong option as long and specific as the right one (same structure, a swapped term, a plausible qualifier) and vary which option is longest. `tests/question-option-lengths.test.mjs` fails if a correct option is 1.5× longer than every wrong one, if the answer is the longest option in more than a quarter of a topic's questions or more than 15% overall (owner, 2026-10-20: "30% is still too much, make it 15%"), or if a question repeats an option. Diagram questions use the diagram's own labels and are exempt.

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
* **Sound and vibration** (owner, 2026-10-19): `src/lib/feedback.ts` — `tapFeedback` on every tap is a tiny buzz only, never a sound (owner: sounds only where necessary); `correctFeedback` / `wrongFeedback` (quiet) when an answer is checked (`QuestionCard`; cards that open already answered stay quiet). Sounds are made with Web Audio (no files); vibration uses `navigator.vibrate` (Android; not iPhone) or React Native `Vibration`. Settings → Sounds and vibration switches each off, per device.
* Never hard-code new colours in screens.

### Atmosphere

* The page background is the shell's atmosphere layer (`src/components/atmosphere/`). In Originate it is one plain colour from the theme (the per-route moods no longer change the look); The Originals (Legacy) draws the original gradient instead. (Hybrid was removed on 2026-10-18.)
* Screens are transparent, so build pages with `Screen` from `src/components/ui/screen.tsx`. Do not give screens an opaque page background.

### Originate design system (2026-10-16)

* Originate follows `docs/design-system.md` — read it before changing any Originate screen. In short: IBM Plex Sans (Source Serif 4 for lesson text), weights 400/500/600, sentence-case labels, a plain page colour (no atmosphere effects), cards only when grouping helps (radius 12, 1px border, no shadow), lists as `List` / `ListRow` (`src/components/ui/list.tsx`), one primary button per screen, a docked tab bar on phones, and only motion that answers an action.
* The rules live in the primitives and switch on `useExperience() === 'originate'`, so The Originals (Legacy) looks exactly as before. The type rules are applied to every `Text` by `src/components/ui/text.tsx` (`src/data/originate-type.ts`); shape and spacing values are in `src/constants/originate.ts`.
* Learners see experiences as **interfaces** (Settings → Interface, "Choose your interface") and The Originals as **Legacy** (owner's requests, 2026-10-17); code, routes and the saved id (`originals`) keep the old words, so nobody's choice resets. Originate is shown to learners as **OrigiNate** (owner, 2026-10-24); its id and code names stay `originate`.
* The Originals (Legacy) is the default experience; the chooser and Settings never call one experience "recommended" (owner's choice, 2026-10-16).
* Originate's desktop sidebar (`src/components/desktop-sidebar.tsx`) is the owner's favourite: do not restyle it.
* Originate's Study page keeps every section The Originals has (course pictures, question of the day, practise-and-plan tiles, your progress, your week), drawn in Originate's style.

### Themes

* Every theme is in `src/data/theme-catalog.ts` (locks: level, achievement, admin, special). Everything is free: no theme is paid for (owner, 2026-10-18). Added themes live in `src/data/extra-themes.ts`.
* **Special-day themes** (Christmas, Valentine, New Year, Independence in the Ghana flag colours, Easter, Eid al-Fitr, Eid al-Adha) open for **24 hours from the learner's first study on their day**, then lock again until that day comes round (owner, 2026-10-18). Days, Easter and the Eid table (to 2032, day either side accepted) are in `src/data/holidays.ts`; `useThemeLocks` in `experience-sync.tsx` feeds the study times. An expired theme is switched back to the default.
* MSA (red and white) unlocks at Level 15.

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

### Usage analytics (owner, 2026-10-20)

* **Google Analytics for Firebase** (web, so the Android app too): `src/lib/analytics.ts` (`initAnalytics` in `_layout.tsx`, `track`, `setAnalyticsUser` in `use-auth.tsx`). Page views are automatic; events: `sign_up`, `login`, `lesson_complete`, `first_lesson_complete`, `quiz_complete`, `apex_challenge_complete`, `battle_start`, `battle_finish`, `stamp_sent`. Never send names, emails or answers. Every call is fire-and-forget and does nothing on native or with the emulators.
* **Vercel Web Analytics**: the script tag in `src/app/+html.tsx` (served by Vercel, no package); `public/sw.js` lets `/_vercel/` go straight to the network. Switched on in Vercel → Analytics.

### Help and contact

* Explore → Contact us shows the team email and the two WhatsApp help groups (`WHATSAPP_HELP_GROUPS` in `src/lib/contact.ts`).

### Notifications

* `src/data/notifications.ts` derives notifications from real learning state. Only read marks are stored, on the device.
* The bell and centre UI are in `src/components/notifications.tsx`.
* Phone and computer alerts that arrive when the app is closed (messages, follows, likes, comments, **battle challenges and results**) go through `api/push.mjs`; **streak-at-risk, review-due, weekly league and Sunday weekly-summary pushes** are sent on a daily schedule by `api/reminders.mjs` (needs `FIREBASE_SERVICE_ACCOUNT` and `CRON_SECRET` in Vercel). Shared rules are in `api/_push-logic.mjs`, checked by `tests/push-logic.test.mjs`. Setup, switches and a safe dry run: `docs/push-notifications.md`.

### Android app (2026-10-19)

* The APK is a Trusted Web Activity around the live site (built with PWABuilder, package `com.grateapex.app`), so every push to master reaches installed apps with no new APK. `public/.well-known/assetlinks.json` must keep the signing key's fingerprint (`tests/deploy-wiring.test.mjs`). The signing key is NOT in the repo. See `docs/android-app.md`.

### Offline study

* `public/sw.js` keeps the app shell, scripts, pages already visited, question banks (`/curriculum/*.json`, shown from the saved copy and refreshed in the background) and lecture diagrams (`/figures/*`). Banks and diagrams live in the `grateapex-offline-v1` cache, which app updates never delete.
* Settings → Offline study (`src/components/offline-study-card.tsx`, `src/data/offline-study.ts`, `src/lib/offline-study.ts`) downloads a class's banks, diagrams, original lessons and lesson pictures on request. Lesson text, pictures and the lesson list are stored in the same cache on the web (not localStorage, which is too small); `legacy-study.ts` reads them when there is no connection.
* If you change `OFFLINE_CACHE`, change it in both `public/sw.js` and `src/lib/offline-study.ts`.
* The 3D atlas (`/atlas/*`) is deliberately skipped by `public/sw.js` (an old saved copy once left phones stuck on a broken atlas), `vercel.json` makes `/atlas/anatomy` and `/sw.js` revalidate on every load, and every atlas address carries a fresh `?v=` stamp (`atlasFresh()` in `src/lib/atlas-theme.ts`). Keep all three if you touch the atlas wiring; bump `CACHE_NAME` in `public/sw.js` whenever a deploy must purge what phones already saved.
* The atlas models (`/atlas/**/*.glb`, ~80 MB) are downloaded once: `vercel.json` lets browsers keep them for a year, and the page asks for them as `file.glb?m=<MODEL_VERSION>` (`MODEL_VERSION` in `public/atlas/anatomy.html`). **When any .glb file changes, bump `MODEL_VERSION` and update `KNOWN_MODELS` in `tests/deploy-wiring.test.mjs`** (the test fails until you do), otherwise learners keep seeing the old models. The page itself (`anatomy.html`) is still revalidated on every open.
* The study games, Med Term Scramble, Golden Hour and Pathway Lab (`public/game-builds/<id>/`, listed in `src/data/games.ts`, played by `src/components/explore/game-player.tsx`), need three things kept as well: `node scripts/assemble-games.mjs` at the start of the `vercel.json` build command (it joins `index.wasm` from its parts; without it the game never loads), the `/game-builds/` handling in `public/sw.js` (keeps a copy in the offline cache so a game played once also plays offline; fetches the original request and never saves a redirect, because play.html redirects to /play), and a hidden `games/<id>` tab in both `app-tabs` files. The game page takes the whole screen like a chat (`setTabBarLocked` while it is open). The game sources are in `games/<id>/` (touch scrolling in `scripts/ui/screen.gd`); after changing a game, export the pack (`--export-pack Web`) into `public/game-builds/<id>/index.pck` and update its size in `play.html`. Explore and Connect each show one **Games** button (`GamesEntry` in `src/components/explore/games-section.tsx`, owner 2026-10-20) that opens the Games page `/games` (`src/app/games/index.tsx`, hidden tab `games/index`), which shows every game with its cover colour, genre, how-it-works steps and a "Not sure which to play?" guide (`genre`, `accent`, `bestFor`, `steps` in `games.ts`); a game's back link returns to Games. `connectText` marks the multiplayer games. Pathway Lab's content is `games/pathway-lab/data/pathways.json` (70 pathways from the owner's Pathway Lab prototype, unchanged) and its rules are `scripts/core/pathway_round.gd`, checked for every pathway by `games/pathway-lab/tests/logic.tscn`. `tests/deploy-wiring.test.mjs` checks the atlas and game wiring.

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
* Slow or broken connections (owner: "the atlas was not opening", 2026-10-19): a failed model download is retried twice (`loadModel`), the 3D view shows "Loading the 3D model … %" while downloading, and a lasting "could not download" message with **Try again** if it still fails (`#loadStatus`, `renderLoadStatus`). Before this a failure left an empty screen.

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

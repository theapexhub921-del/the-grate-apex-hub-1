# Study boosts (2026-10-28)

Owner: "implement everything" (the eight ideas to make studying more fun and
easier to remember). What each one is, where it lives, and the rules behind it.
Pure rules are checked by `tests/learning-boosts.test.mjs`.

## 1. Sure / Guessing

- After choosing an answer, and before it is checked, the learner can tap
  **Sure** or **Guessing** (`components/learning/confidence-toggle.tsx`, shown by
  `QuestionSession`, so every quiz, review, mock exam and practice has it).
  Optional: leaving it blank changes nothing.
- Saved on the answer (`confidence` on `QuestionAttempt`, and per question on the
  quiz attempt for Results). Device copy only; the cloud copy of answers keeps
  its old fields.
- Scheduler (`data/learning/scheduler.ts`): a right **guess** grows the interval
  like a "partly" recall (it comes back sooner); a **sure but wrong** answer costs
  extra ease (`confidentWrongEasePenalty`, a misconception needs more reviews).
- With instant answers, a lucky guess waits like a wrong answer so its note can
  be read. Results shows **How sure you were**: sure and right, lucky guesses,
  sure but wrong, and "Practise these" (`data/learning/confidence.ts`).

## 2. Daily 10

- Learn home tile. Ten questions on what is due, one per concept, topics taken
  in turn so courses mix (`dailyMixConcepts` / `dailyMixIds` in
  `data/learning/daily-practice.ts`; `dailyMixPool` in `data/daily-practice.ts`).
  Then struggling and still-learning concepts fill any gap.
- Runs as a review (`/learn/quiz?exam=daily&practice=<ids>`, kind `review`), so
  it earns review XP and counts for spaced repetition.

## 3. 2-minute sprint

- `/learn/quiz?exam=sprint`: multiple choice from studied lessons, the whole
  run on a 2-minute clock (`SPRINT_SECONDS`), answers as you go. Only answered
  questions count. Results and the tile show the best sprint (from quiz history).

## 4. Confused pairs

- Every wrong multiple-choice answer now keeps the option picked (`chosen` on
  `QuestionAttempt`); older quizzes' saved answers are read too (`myMixUps`).
- `confusedPairs` finds the two answers mixed up most (either way round; "all of
  the above" and true/false are not terms). `pairDrillIds` asks questions whose
  answer is one of the pair with the other among the options, A then B, pairs
  taking turns (`/learn/quiz?exam=pairs&practice=<ids>`).

## 5. Daily quest

- A card on the Learn home: finish the Daily 10, label a diagram, and finish a
  lesson / quiz / review / sprint (`markQuest` in `data/daily-quest.ts`, ticked by
  `submitQuiz`, `finishLesson`, the quiz page and "Label it"). The ticks are kept
  on this device for today. All three: **Claim +25 XP** (`DAILY_QUEST_XP`), paid
  once a day through the XP ledger (`practice:daily-quest:<day>`). No coins (the
  coin rules only allow listed kinds).

## 6. Label it (diagrams)

- A third mode on every lecture diagram, beside Explore and Test yourself
  (`LabelBoard` in `components/learning/figure-view.tsx`, rules in
  `data/learning/label-it.ts`): the labels are covered and listed as names; pick
  a name, tap its pin. Parts with the same label are interchangeable.
- The first try on each part is recorded like an answer to that part's "what is
  the marked part?" question (`spotQuestionFor` in `data/figure-practice.ts`), so
  it feeds memory and Review.
- `/learn/label` ("Label a diagram" tile) picks a diagram from a studied lesson.

## 7. Memory map

- On every topic page (`components/learning/memory-map.tsx`, rules in
  `data/learning/memory-map.ts`): each concept is a square, lesson by lesson,
  coloured by memory state and filled by the mastery estimate; a dot when due.
  Tap a square for its state, when it is back, and its memory hook.

## 8. Links across courses and memory hooks

- **Links:** at the end of a lesson's reading, up to three lessons in other
  subjects that share its key words (terms, key words, concept names;
  `data/learning/related-lessons.ts`, index in `data/related-lessons.ts`). A whole
  shared key word counts most; otherwise two uncommon shared words are needed.
  "How do these link?" asks Ask AI for the connection and a memory hook
  (`AiQuestionButton` in `components/learning/ai-study.tsx`).
- **Memory hooks:** under every answered question, "Add a memory hook" — the
  learner's own mnemonic for the concept (`components/learning/memory-hook.tsx`).
  It shows whenever the concept comes up and on the memory map, is synced as
  `synced.hooks` on `progress/{uid}` (newer change wins, `memory-hook-rules.ts`),
  and "Share with friends" posts it to the feed for friends.

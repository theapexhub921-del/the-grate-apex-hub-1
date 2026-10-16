# GRATEAPEX

A modern study ecosystem and learning app for medical students, built with Expo, React Native, Expo Router, and TypeScript.

The app covers **Anatomy**, **Biochemistry**, and **Physiology**, featuring curriculum-aligned lessons, interactive diagrams, spaced-repetition review, AI study tutors, past papers, and a collaborative social community.

---

## 📚 Course Content & Curriculum

Lecture material lives in `content/<SUBJECT>/` and serves as the single source of truth. Every published topic includes interactive learning steps, reading summaries, verified diagrams, and dedicated question banks.

| Subject | Published Topics & Status |
| --- | --- |
| **Biochemistry** | **8 Published Topics**:<br>• **Fatty Acid Biosynthesis** (8 lessons)<br>• **Cholesterol and Bile Biosynthesis** (5 lessons)<br>• **Heme and Heme Metabolism** (7 lessons)<br>• **Oxygen Carriers: Myoglobin & Hemoglobin** (4 lessons)<br>• **Blood Coagulation and Fibrinolysis** (4 lessons)<br>• **Endocrine System: Hormones** (3 lessons)<br>• **Inborn Errors of Metabolism** (5 lessons)<br>• **Collagen & Elastin Synthesis** (3 lessons)<br>*All Biochemistry topics feature interactive lecture diagrams and comprehensive question banks.* |
| **Physiology** | **Cardiovascular Physiology** (published with full lesson coverage, interactive lecture diagrams, and recall questions). Additional lecture modules catalogued. |
| **Anatomy** | **Upper Limb** (published with regional anatomy lessons, interactive anatomical diagrams, and identification questions). |
| **HB1 / Past Papers** | Semester 1 original coursework, past question papers, and predicted practice exams. |

`src/data/content-catalog.ts` maintains an inventory of all source files in `content/`, tracking their slide counts, outlines, and publication status.

---

## ✨ Key Features

- **Adaptive Learning Engine**:
  - Spaced-repetition scheduler (`src/data/learning/scheduler.ts`) derived from memory models and answer history.
  - Next-best-action recommendations based on due reviews and learning progress.
  - **Apex Challenge**: High-intensity, 10-second recall drills.
  - **Custom Quiz Builder**: Flexible practice by topic, question count, timers, and instant or end-of-quiz feedback.

- **Interactive Lecture Diagrams**:
  - Slide crops and anatomical illustrations with tappable label exploration and hidden "test yourself" spot questions.
  - Preview cards open full diagrams in interactive sheets without interrupting the reading flow.

- **AI Study Companion**:
  - **Ask AI & AI Flashcards**: Context-grounded questions answered directly from lecture text.
  - **AI Explanations**: "Explain my mistake" on incorrect quiz answers and review cards.
  - **Study Chat**: General conversational AI tutor for study plans, mnemonics, and cross-subject queries.

- **Streak & Progression**:
  - Daily streak tracking with animated breathing flame widgets, celebration modals, and milestone boosts.
  - Persistent progress with AsyncStorage and Supabase sync (XP, levels, masteries, streak freezes, and coin recovery).

- **Social & Collaborative Study**:
  - Real learner profiles, friend connections, and activity feeds.
  - **Stories**: Instagram-style story reels for medical notes, video progress, and quick updates.
  - **Stump a Friend**: Share tricky multiple-choice questions directly to friends in the community feed.
  - **Apex Coins & Boosts**: Earn coins and send XP boost gifts between mutual study partners.

---

## 🚀 Running the App

You need [Node.js](https://nodejs.org) installed.

1. **Install dependencies** (first time or after dependency updates):
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npx expo start
   ```

3. **Open the app**:
   - Press **w** in your terminal to open the web version (the primary platform priority).
   - Or scan the terminal QR code with **Expo Go** on Android.

---

## 🧪 Validation & Testing

Always verify code health before committing:

| Command | What it checks |
| --- | --- |
| `npm run typecheck` | Validates TypeScript with zero compiler errors (`tsc --noEmit`) |
| `npm test` | Runs the full test suite (learning engine, scheduler, XP rules, and validation of all published topics and diagrams) |
| `npx eslint src` | Code style, linting, and formatting rules |

---

## 🗄️ Project Structure

```
GRATEAPEX/
├── content/                     # Source lecture slides, documents, and notes
├── public/                      # Static assets, lecture diagrams, and service worker
├── src/
│   ├── app/                     # Expo Router routes and screens
│   │   ├── learn/               # Learning flow: courses, topics, lessons, quizzes, review, apex
│   │   ├── social/              # Friends, profiles, battles, conferences
│   │   ├── index.tsx            # Home feed
│   │   ├── progress.tsx         # My Progress dashboard & streak stats
│   │   └── ...
│   ├── components/              # Shared UI components
│   │   ├── learning/            # Lesson runners, question cards, diagrams, review calendar
│   │   ├── social/              # Community posts, story viewer, stump cards
│   │   ├── ui/                  # Design system primitives (Card, Button, Pill, ProgressBar...)
│   │   └── streak-widget.tsx    # Animated streak cards & compact widgets
│   ├── constants/               # Theme colors, typography, motion tokens
│   ├── data/                    # Curriculum models, learning engine, progress stores
│   │   ├── topics/              # Topic content definitions (lessons, questions, diagrams)
│   │   └── learning/            # Spaced repetition, memory, selection, XP rules
│   └── lib/                     # Supabase client, routing utilities, AI study API
└── supabase/
    └── migrations/              # SQL migrations for auth, stats, and social tables
```

---

## 🔒 Environment & Configuration

Supabase and API configurations are read from `.env` in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

*Never commit `.env` or paste secret API keys directly into client source code.*

---

## ⚠️ Important Precautions

- **Do NOT run `npm run reset-project`**: This command from the Expo template resets the repository and erases project source files.
- **Content Honesty**: Do not invent course content or hallucinate lecture facts. Course material in `content/` is the authoritative source.
- **Git Safety**: Do not reset, revert, or delete working features without explanation.

---

## 👥 Project Guidelines for AI & Collaborators

Review `AGENTS.md` for specific architectural conventions, design system tokens, database policies, and developer guidelines.

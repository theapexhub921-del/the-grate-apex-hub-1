# Lesson pictures and textbook pages

## Pictures in the anatomy lessons (2026-10-28)

Every Gross Anatomy lesson shows lecture pictures (owner's request: "incorporate
pictures and images into the anatomy lessons to make learning more fun"). 80
pictures, 1–3 per lesson, are crops of the lecture slides' own diagrams.

- **Data:** `src/data/figures/pictures/<topic>.ts` — the `LessonFigure`s and
  their `pictures` placements (lesson, reading section `chunk`, interactive
  `step`, `conceptId`, and the spots asked in the quiz). Images:
  `public/figures/<topic>/<name>.jpg`.
- **Where they show:** `buildTopic` (`pictures` option, `withPictures` in
  `src/data/topics/build.ts`) adds each picture to its reading section
  (`LessonChunk.figures`, Read tab and HB2 lesson pages) and to its learn card in
  the step-by-step lesson (`figures` on a `learn` step). Each opens the usual
  interactive diagram: Explore (tap a number) and Test yourself (labels covered).
- **Quiz:** each spot in `quiz` becomes a "what is the marked part?" question
  (`pic-<picture>-<spot>`), with the picture's neighbouring labels as wrong
  answers. They feed lesson quizzes and the Spotter, never Apex.
- **Labels** are the ones printed on the slide, read from the image (OCR, then
  checked by eye and spelling tidied). Each pin sits where the label's leader
  line starts; the label's box is covered in Test yourself. Only where a slide
  draws its labels as separate text boxes (upper limb slide 123) are the pins
  at the arrow tips.

### Adding or changing a picture

The scripts are in `scripts/lesson-pictures/` (Python 3, Pillow, python-pptx,
tesseract). They read the decks in `content/` (not in GitHub):

1. `extract.py <deck>` saves each slide's main picture (as cropped on the slide)
   to `pics/<deck>/s<slide>.png`; `ocr.py <deck> <slide>` lists its printed
   labels with numbered boxes.
2. Describe the picture in `specs/<topic>.json`: deck, slide, lesson, title,
   optional `crop`, and the spots (`label`, the OCR boxes to cover in `ocr`, or
   a `box`, optional `pin` side or `[x, y]`), plus the spots to ask in `quiz`.
3. `make_fig.py <topic>` writes the JPEG and a check image with the pins drawn
   (look at it); `gen_ts.py <topic>` writes `src/data/figures/pictures/<topic>.ts`.
   Placement is the section/step whose slides are nearest the picture's slide;
   set `chunk`, `step` or `concept` in the spec to override.

Cardiovascular System lessons 6–7 (vessels and great arteries) use the
"Cardiovascular System Gross 2" deck, which could not be copied from the
owner's computer on 2026-10-28; they have no pictures yet.

## Textbook pages for every course (2026-10-28)

Owner: "add textbook references based on the slides to every course, not just
Lehninger for biochemistry".

- **Data:** `src/data/textbook-refs/<topic>.ts`: lesson → section index → book
  and printed pages. `textbookRefsFor` (`index.ts`) is used by `buildTopic` to add
  them to the section's `sourceRefs`, so they show as "Source: … · Gray's pp. …"
  on the Read tab and as "Read more in the textbook" on HB2 lesson pages.
- **Books:** Gray's Anatomy for Students 4th ed. (anatomy), Guyton and Hall 14th
  ed. and Costanzo (physiology), Guyton and Hall for the biochemistry topics it
  covers (coagulation, immunology, hormones, amino acids, nucleic acids, parts
  of collagen and free radicals). Lehninger pages were already written into the
  older biochemistry topics' `sources.ts`.
- **How pages were found:** `scripts/textbook-pages/pages.py` reads the printed
  page numbers of a `pdftotext -layout` dump; `match.py` scores every page
  against each section's lecture text (title and key words weigh most), looking
  near the chapter that matches the whole lesson. Only strong matches are kept,
  so a section the book does not cover gets no page. Spot-checked by hand.
- `tests/textbook-refs.test.mjs` checks every reference and that each course has
  pages.

## What the textbook adds — summarised notes (2026-10-29)

Owner: "instead of just saying read more in a textbook, add a small extract from
the textbook that communicates what you want to teach" — then "start with option
1 and do all". The books are copyrighted and the app is public, so these are
**not extracts**: each note is 2–4 sentences in our own words saying what the
section's own textbook pages add to the slides (a clearer explanation, the
"why", numbers, a clinical point, or where the book disagrees with the lecture —
those are said openly, e.g. capacitation time, CO affinity, the male urethra's
parts).

- **Data:** `src/data/textbook-notes/<topic>.ts` (lesson → section index → note,
  498 notes across 23 topics), read by `textbookNoteFor` in `index.ts`;
  `buildTopic` puts it on the section as `textbookNote`.
- **Shown:** a "From the textbook (summarised)" box with the pages on the Read
  tab (`reading-layer.tsx`) and on HB2 lesson pages (`hb2-study.ts`, in place of
  "Read more in the textbook").
- **Not covered:** sections whose only textbook is Lehninger (fatty acid,
  cholesterol and heme metabolism, inborn errors, part of oxygen carriers — 69
  sections), because its text was not available; and about 20 sections whose
  matched pages turned out to be about something else. They keep the plain page
  reference.
- **How they were written:** the paragraphs of each section's referenced pages
  were pulled from the book text (kept outside the repo), the note written from
  them, then every note was checked against the full book text so that no run of
  7 words is copied. Never commit textbook text.
- `tests/textbook-notes.test.mjs`: every note belongs to a section with textbook
  pages, names only that section's books, is 120–700 characters, does not repeat
  the slide text, and at least 75% of each anatomy and physiology topic's
  sections with pages have one.

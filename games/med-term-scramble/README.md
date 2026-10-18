# Med Term Scramble (Godot 4.7 source)

The game's Godot project. GRATEAPEX shows the web build from
`public/game-builds/med-term-scramble/` at `/games/med-term-scramble`.

- Edit terms, cases and achievements in `data/*.json` (no code changes needed).
- Open `project.godot` in Godot to edit or play the game on its own.
- After changes, the web build must be exported again (Web preset, threads off),
  `index.html` renamed to `play.html`, and `index.wasm` split into
  numbered `index.wasm.partNN` pieces (5 MB each).

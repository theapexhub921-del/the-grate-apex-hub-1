// Game web builds have one large file (index.wasm, about 40 MB). It is stored
// in 5 MB parts (index.wasm.part00, .part01, ...) so it can be copied and uploaded
// easily. This joins the parts back together before the app runs or builds.
// Runs automatically before `npm start`, `npm run web` and the Vercel build.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'public', 'game-builds');
if (existsSync(root)) {
  for (const game of readdirSync(root)) {
    const dir = join(root, game);
    if (!statSync(dir).isDirectory()) continue;
    const groups = {};
    for (const file of readdirSync(dir).filter((f) => /\.part\d+$/.test(f)).sort()) {
      (groups[file.replace(/\.part\d+$/, '')] ??= []).push(file);
    }
    for (const [target, parts] of Object.entries(groups)) {
      const out = join(dir, target);
      const total = parts.reduce((sum, f) => sum + statSync(join(dir, f)).size, 0);
      if (existsSync(out) && statSync(out).size === total) continue;
      writeFileSync(out, Buffer.concat(parts.map((f) => readFileSync(join(dir, f)))));
      console.log(`Assembled game file: ${game}/${target}`);
    }
  }
}

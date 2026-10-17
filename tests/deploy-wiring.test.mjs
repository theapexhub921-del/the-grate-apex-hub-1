// Deploy wiring that is easy to lose when a file is edited from an older copy.
// Run with: npm test
// - the 3D atlas: never touched by the service worker, revalidated on every
//   open, and loaded with a fresh ?v= stamp
// - Med Term Scramble: the engine (index.wasm) is joined from its parts in the
//   Vercel build, the service worker leaves game builds alone, and the game
//   page stays out of the navigation tabs
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path) => readFileSync(path, 'utf8');
const vercel = JSON.parse(read('vercel.json'));
const sw = read('public/sw.js');

describe('3D atlas wiring', () => {
  it('the service worker never serves the atlas', () => {
    assert.match(sw, /startsWith\('\/atlas\/'\)\) return;/);
  });
  it('vercel.json revalidates the atlas page and the service worker', () => {
    const sources = (vercel.headers ?? []).map((rule) => rule.source);
    assert.ok(sources.includes('/sw.js'), 'no Cache-Control rule for /sw.js');
    assert.ok(sources.some((source) => source.startsWith('/atlas/anatomy')), 'no Cache-Control rule for /atlas/anatomy');
  });
  it('atlas addresses carry a fresh ?v= stamp', () => {
    assert.match(read('src/lib/atlas-theme.ts'), /export function atlasFresh\(/);
  });
});

describe('Med Term Scramble wiring', () => {
  it('the Vercel build joins the game engine from its parts first', () => {
    assert.match(vercel.buildCommand, /^node scripts\/assemble-games\.mjs && /);
  });
  it('the game build has its engine parts and page', () => {
    const files = readdirSync('public/game-builds/med-term-scramble');
    assert.ok(files.some((file) => /^index\.wasm\.part\d+$/.test(file)), 'no index.wasm.partNN files');
    for (const file of ['play.html', 'index.js', 'index.pck']) assert.ok(files.includes(file), `missing ${file}`);
  });
  it('the service worker leaves game builds to the browser', () => {
    assert.match(sw, /startsWith\('\/game-builds\/'\)\) return;/);
  });
  it('the game page is hidden from the navigation tabs', () => {
    for (const file of ['src/components/app-tabs.web.tsx', 'src/components/app-tabs.tsx']) {
      assert.match(read(file), /name="games\/med-term-scramble" options=\{\{ href: null \}\}/, file);
    }
  });
});

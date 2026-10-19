// Deploy wiring that is easy to lose when a file is edited from an older copy.
// Run with: npm test
// - the 3D atlas: never touched by the service worker, revalidated on every
//   open, and loaded with a fresh ?v= stamp
// - Med Term Scramble: the engine (index.wasm) is joined from its parts in the
//   Vercel build, the service worker keeps game builds for offline play, and the game
//   page stays out of the navigation tabs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

// Update both values together whenever an atlas model (.glb) is changed (see the atlas tests below).
const KNOWN_MODELS = { version: '1', fingerprint: 'ab6bb914e2085911146be7bfd4e65fc008605f4b7fcf80773ef152b8808cf828' };

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
  // The models (.glb) are kept by the browser for a year, so they are downloaded once. That is only safe
  // because their address carries ?m=<MODEL_VERSION>, which must change whenever a model file changes.
  it('vercel.json lets browsers keep the atlas models', () => {
    const rule = (vercel.headers ?? []).find((r) => r.source === '/atlas/(.*)\\.glb');
    assert.ok(rule, 'no Cache-Control rule for /atlas/*.glb');
    assert.match(rule.headers.find((h) => h.key === 'Cache-Control')?.value ?? '', /max-age=31536000/);
  });
  it('the atlas asks for models with the current model version', () => {
    const html = read('public/atlas/anatomy.html');
    assert.match(html, /f \+ '\?m=' \+ MODEL_VERSION/, 'model addresses must end in ?m=<MODEL_VERSION>');
    assert.equal(/const MODEL_VERSION = '(\d+)'/.exec(html)?.[1], KNOWN_MODELS.version);
  });
  // The 3D organs shown with the simulations (public/sim3d) load the same model files: they must ask for the
  // same version, or browsers would download every model a second time.
  it('the simulation 3D organs ask for models with the same version', () => {
    const scenes = read('public/sim3d/scenes.js');
    assert.equal(/export const MODEL_VERSION = '(\d+)'/.exec(scenes)?.[1], KNOWN_MODELS.version);
    assert.match(read('public/sim3d/organ.html'), /'\.glb\?m=' \+ MODEL_VERSION/);
    assert.match(read('public/sw.js'), /startsWith\('\/sim3d\/'\)\) return;/, 'the service worker must leave /sim3d/ alone, like /atlas/');
  });
  it('every 3D scene a simulation asks for exists', async () => {
    const { SCENES } = await import('../public/sim3d/scenes.js');
    const dir = 'src/components/learning/simulations/graphics';
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.tsx'))) {
      for (const m of read(`${dir}/${file}`).matchAll(/scene="([\w-]+)"/g)) assert.ok(SCENES[m[1]], `${file} asks for 3D scene "${m[1]}", which public/sim3d/scenes.js does not have`);
    }
  });
  it('the model version was bumped whenever a model changed', () => {
    const files = [];
    const walk = (dir) => readdirSync(dir, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : files.push(`${dir}/${e.name}`)));
    walk('public/atlas');
    const hash = createHash('sha256');
    for (const file of files.filter((f) => f.endsWith('.glb')).sort()) {
      hash.update(file);
      hash.update(createHash('sha256').update(readFileSync(file)).digest());
    }
    assert.equal(
      hash.digest('hex'),
      KNOWN_MODELS.fingerprint,
      'An atlas .glb file changed. Bump MODEL_VERSION in public/atlas/anatomy.html, then update KNOWN_MODELS here (version and fingerprint).',
    );
  });
});

const GAME_IDS = ['med-term-scramble', 'golden-hour'];

describe('Study game wiring (Med Term Scramble, Golden Hour)', () => {
  it('the Vercel build joins the game engine from its parts first', () => {
    assert.match(vercel.buildCommand, /^node scripts\/assemble-games\.mjs && /);
  });
  for (const id of GAME_IDS) {
    it(`${id}: the game build has its engine parts and page`, () => {
      const files = readdirSync(`public/game-builds/${id}`);
      assert.ok(files.some((file) => /^index\.wasm\.part\d+$/.test(file)), 'no index.wasm.partNN files');
      for (const file of ['play.html', 'index.js', 'index.pck']) assert.ok(files.includes(file), `missing ${file}`);
      const pck = readFileSync(`public/game-builds/${id}/index.pck`).length;
      assert.match(readFileSync(`public/game-builds/${id}/play.html`, 'utf8'), new RegExp(`"index\\.pck":${pck}\\b`), 'play.html must list the real index.pck size');
    });
  }
  it('the service worker saves game builds for offline play, never a redirect', () => {
    const block = sw.slice(sw.indexOf("startsWith('/game-builds/')"));
    assert.ok(block.length < sw.length, 'no /game-builds/ handling in public/sw.js');
    assert.match(block, /await fetch\(request\)/, 'fetch the original request (keeps the play.html redirect intact)');
    assert.match(block, /!response\.redirected/, 'a redirected reply must never be saved');
    assert.match(block, /OFFLINE_CACHE/, 'game files belong in the offline cache that app updates keep');
  });
  it('every game page is hidden from the navigation tabs', () => {
    for (const file of ['src/components/app-tabs.web.tsx', 'src/components/app-tabs.tsx']) {
      for (const id of GAME_IDS) {
        assert.ok(read(file).includes(`name="games/${id}" options={{ href: null }}`), `${file}: games/${id}`);
      }
    }
  });
});

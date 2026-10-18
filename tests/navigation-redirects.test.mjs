// A screen that has been visited stays mounted as a hidden tab. If it redirects
// from a plain useEffect that depends on the account, it moves the learner away
// from whatever tab they are on each time the account updates (presence is
// written every 45 s) — the "Connect keeps jumping to Study" bug (2026-10-18).
// Redirects in screens must run only while the screen is focused.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const APP = new URL('../src/app/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

function screens(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return screens(path);
    return name.endsWith('.tsx') && !name.startsWith('_') ? [path] : [];
  });
}

// The body of each useEffect(() => { ... }) call, by matching braces.
function effectBodies(source) {
  const bodies = [];
  const start = /useEffect\(\s*\(\)\s*=>\s*\{/g;
  let match;
  while ((match = start.exec(source))) {
    let depth = 1;
    let i = match.index + match[0].length;
    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') depth -= 1;
      i += 1;
    }
    bodies.push(source.slice(match.index, i));
  }
  return bodies;
}

test('no screen redirects from a plain useEffect (use useFocusEffect)', () => {
  const offenders = [];
  for (const file of screens(APP)) {
    const source = readFileSync(file, 'utf8');
    for (const body of effectBodies(source)) {
      if (/router\.(replace|push|navigate)\(/.test(body)) offenders.push(file.slice(APP.length));
    }
  }
  assert.deepEqual(offenders, []);
});

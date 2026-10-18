// Adds the second batch of HB2 past questions (content/GrAte Apex Past Questions/new/)
// to the HB2 question banks in public/curriculum/:
//   Biochemistry Mid-Sem HB II        → hb2-biochemistry.json (one paper)
//   Cardiovascular Physiology quiz    → hb2-physiology.json   (one paper)
//   Anatomy Complete Quiz (10 parts)  → hb2-anatomy.json      (one paper per part)
//   Histology Practical quiz          → hb2-anatomy.json      (one paper; its diagrams
//                                        are saved to public/figures/hb2-histology-past/)
//
// Three of the files are hand-written quizzes whose questions are JavaScript, not JSON;
// only the lines that build the question list are run (in a sandbox), never the page.
// Safe to run again: a paper that is already in its bank is skipped.
//
// Usage:  node scripts/import-hb2-past-questions-2.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import vm from 'vm';

const SRC_DIR = 'content/GrAte Apex Past Questions/new';
const BANK_DIR = 'public/curriculum';
const FIG_DIR = 'public/figures/hb2-histology-past';
const L = 'ABCDE';

const qid = (text) => createHash('sha256').update(text).digest('hex').slice(0, 6);
const read = (file) => readFileSync(`${SRC_DIR}/${file}`, 'utf8');

/** Runs only the question-building lines of a quiz page and returns the named values. */
function runQuizData(file, startsWith, endsBefore, names) {
  const lines = read(file).split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(startsWith));
  const end = lines.findIndex((line, i) => i > start && endsBefore.test(line));
  if (start < 0 || end < 0) throw new Error(`Could not find the questions in ${file}`);
  return vm.runInNewContext(`${lines.slice(start, end).join('\n')}\n;({${names.join(',')}})`, {});
}

/** "Also accepted" note for alternative answers, as in the first import. */
function withAlternatives(explanation, options, alternatives) {
  if (!alternatives?.length) return explanation;
  const labels = alternatives.map((i) => options[i]).join(', ');
  return explanation ? `${explanation} (Also accepted: ${labels})` : `Also accepted: ${labels}`;
}

function question(text, options, answer, explanation = '', tag = '', img) {
  const q = { id: qid(text), q: text, o: options, a: answer, e: explanation.trim(), t: tag };
  if (img) q.img = img;
  if (!text.trim() || options.length < 2 || !(answer >= 0 && answer < options.length)) throw new Error(`Bad question: ${text.slice(0, 80)}`);
  return q;
}

// ── Biochemistry Mid-Sem HB II (same JSON format as the first batch) ──
function biochemistry() {
  const html = read('GrAte Apex · Biochemistry Mid-Sem HB II (84 questions).html');
  const data = JSON.parse(html.match(/<script type="application\/json" id="d">([\s\S]*?)<\/script>/)[1]);
  return [{ label: 'Biochemistry Mid-Sem HB II', questions: data.q.map((q) => question(q.q, q.o, q.a, withAlternatives(q.n || '', q.o, q.alt), data.secs[q.s] ?? '')) }];
}

// ── Cardiovascular Physiology: section A is 10 stems × 5 true/false statements ──
function cardiovascular() {
  const { Q } = runQuizData('cardiovascular-physiology-quiz.html', 'const L=', /^const S=/, ['Q']);
  const questions = [];
  for (const q of Q) {
    if (q.sec === 'A') {
      q.o.forEach((statement, j) => questions.push(question(`${q.q}: ${statement}`, ['True', 'False'], q.a[j] ? 0 : 1, q.n || '')));
    } else {
      questions.push(question(q.q, q.o, q.a, withAlternatives(q.n || '', q.o, q.x)));
    }
  }
  return [{ label: 'Cardiovascular Physiology', questions }];
}

// ── Anatomy Complete Quiz: one paper per part ──
function anatomy() {
  const { Q } = runQuizData('GrAte_Apex_Anatomy_Complete_Quiz.html', 'const C=', /^let sel=/, ['Q']);
  const parts = [];
  for (const q of Q) {
    let part = parts.find((item) => item.group === q.g);
    if (!part) parts.push((part = { group: q.g, questions: [] }));
    part.questions.push(question(q.s, q.o, q.a, q.t || ''));
  }
  // "Part 3 · T/F Section C" → "Anatomy Part 3 · True/False Section C"
  return parts.map((part) => ({ label: `Anatomy ${part.group.replace('T/F', 'True/False')}`, questions: part.questions }));
}

// ── Histology Practical: labelled diagrams, shared-option groups and multiple choice ──
function histology() {
  const { Q, G, IMG } = runQuizData('histology-practical-quiz (1).html', 'const L=', /^const S=/, ['Q', 'G', 'IMG']);
  mkdirSync(FIG_DIR, { recursive: true });
  for (const [name, uri] of Object.entries(IMG)) {
    const match = uri.match(/^data:image\/jpeg;base64,(.+)$/);
    if (!match) throw new Error(`Diagram ${name} is not a JPEG`);
    writeFileSync(`${FIG_DIR}/${name}.jpg`, Buffer.from(match[1], 'base64'));
  }
  const questions = Q.map((q) => {
    const group = G[q.g];
    const title = group.t.replace(/\s*\(Q[^)]*\)\s*$/, ''); // "Figure 1 · Capillaries"
    const topic = group.fig || group.o ? title.replace(/^Figure \d+ · /, '') : 'Histology'; // "Capillaries"
    const options = q.o || group.o || [...L].slice(0, group.k);
    const key = group.leg ? `Diagram key: ${group.leg}.` : '';
    const explanation = withAlternatives([q.note, key].filter(Boolean).join(' '), options, q.x);
    const text = group.fig || group.o ? `${title}: ${q.q}` : q.q;
    return question(text, options, q.a, explanation, topic, group.fig ? `/figures/hb2-histology-past/${group.fig}.jpg` : undefined);
  });
  return [{ label: 'Histology Practical', questions }];
}

// ── Add the papers to the banks ──
const PLAN = [
  { bank: 'hb2-biochemistry', name: 'HB2 Biochemistry', papers: biochemistry() },
  { bank: 'hb2-physiology', name: 'HB2 Physiology', papers: cardiovascular() },
  { bank: 'hb2-anatomy', name: 'HB2 Anatomy', papers: [...anatomy(), ...histology()] },
];

let added = 0;
for (const { bank: bankId, name, papers } of PLAN) {
  const path = `${BANK_DIR}/${bankId}.json`;
  const bank = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { id: bankId, name, sets: [] };
  console.log(`\n── ${bank.name} (${bankId}) ── ${bank.sets.length} papers already`);
  for (const paper of papers) {
    if (bank.sets.some((set) => set.name.endsWith(`— ${paper.label}`))) {
      console.log(`   = already there: ${paper.label}`);
      continue;
    }
    // Unique ids within the paper (the same statement can appear twice in one paper).
    const ids = new Set();
    for (const q of paper.questions) {
      let n = 0;
      while (ids.has(q.id)) q.id = qid(`${q.q}#${++n}`);
      ids.add(q.id);
    }
    const number = bank.sets.filter((set) => /^Past Questions/i.test(set.name)).length + 1;
    const nextId = Math.max(0, ...bank.sets.map((set) => Number(set.id.replace(/^s/, '')) || 0)) + 1;
    const set = { id: `s${nextId}`, name: `Past Questions ${number} — ${paper.label}`, questions: paper.questions };
    bank.sets.push(set);
    added += paper.questions.length;
    console.log(`   + ${set.id}: ${set.name} (${paper.questions.length} questions)`);
  }
  writeFileSync(path, JSON.stringify(bank));
}
console.log(`\nDone. Added ${added} questions.`);

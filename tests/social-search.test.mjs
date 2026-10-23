import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  normalizeQuery,
  rankAndFilterCandidates,
  scoreSearchMatch,
  tokenizeWords,
} from '../src/data/social-search.ts';

test('normalizes queries correctly', () => {
  assert.equal(normalizeQuery('  @Victoria_A  '), 'victoria_a');
  assert.equal(normalizeQuery('@@@john'), 'john');
  assert.equal(normalizeQuery(''), '');
});

test('tokenizes names and usernames into words', () => {
  assert.deepEqual(tokenizeWords('Ms. Victoria Atanga'), ['ms', 'victoria', 'atanga']);
  assert.deepEqual(tokenizeWords('john_doe-99.med'), ['john', 'doe', '99', 'med']);
  assert.deepEqual(tokenizeWords(null), []);
});

test('predicts matches like Instagram search', () => {
  const victoria = {
    userId: 'u1',
    username: 'vicky_med',
    displayName: 'Ms. Victoria Atanga',
    relationship: 'friends',
  };
  const victor = {
    userId: 'u2',
    username: 'victor99',
    displayName: 'Victor Brown',
    relationship: 'none',
  };
  const patricia = {
    userId: 'u3',
    username: 'patricia_strat',
    displayName: 'Patricia',
    relationship: 'none',
  };

  // 1. Searching by word boundary in name ("Atanga" matches "Ms. Victoria Atanga")
  assert.ok(scoreSearchMatch(victoria, 'Atanga') > 0);
  assert.equal(scoreSearchMatch(patricia, 'Atanga'), 0);

  // 2. Searching by handle prefix ("vicky")
  assert.ok(scoreSearchMatch(victoria, '@vicky') > 0);

  // 3. Single-character predictive matching ("v" matches both Victoria and Victor)
  assert.ok(scoreSearchMatch(victoria, 'v') > 0);
  assert.ok(scoreSearchMatch(victor, 'v') > 0);

  // Mutual friend (victoria) ranks higher than stranger (victor) for "v"
  const rankedV = rankAndFilterCandidates([victor, victoria, patricia], 'v');
  assert.equal(rankedV[0].userId, 'u1'); // Victoria first because she is a friend!

  // 4. Multi-token query ("vic ata" matches Victoria Atanga)
  assert.ok(scoreSearchMatch(victoria, 'vic ata') > 0);

  // 5. Initials matching ("va" matches Victoria Atanga)
  assert.ok(scoreSearchMatch(victoria, 'va') > 0);
});

test('ranks exact username and friends at the very top', () => {
  const friendJohn = {
    userId: 'u1',
    username: 'johndoe',
    displayName: 'Johnathan Doe',
    relationship: 'friends',
  };
  const strangerJohn = {
    userId: 'u2',
    username: 'john',
    displayName: 'John Smith',
    relationship: 'none',
  };

  // Searching "johndoe" puts friendJohn first
  const ranked = rankAndFilterCandidates([strangerJohn, friendJohn], 'johndoe');
  assert.equal(ranked[0].userId, 'u1');

  // Searching "john": friendJohn is a mutual friend so gets the network priority boost
  const rankedGeneral = rankAndFilterCandidates([strangerJohn, friendJohn], 'john');
  assert.equal(rankedGeneral[0].userId, 'u1');
});

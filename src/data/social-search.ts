import type { Relationship, SocialPerson } from '@/data/social';

export interface SearchCandidate {
  userId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl?: string | null;
  relationship?: Relationship;
  totalXp?: number | null;
  isOnline?: boolean;
}

/**
 * Normalizes text for search matching:
 * - strips leading '@'
 * - trims and lowercases
 */
export function normalizeQuery(raw: string): string {
  return raw.trim().replace(/^@+/, '').trim().toLowerCase();
}

/**
 * Splits a full name or username into searchable word tokens:
 * e.g., "Ms. Victoria Atanga" -> ["ms", "victoria", "atanga"]
 * e.g., "john_doe-99" -> ["john", "doe", "99"]
 */
export function tokenizeWords(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[._\-–—/,()@#+]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

/**
 * Instagram-style predictive scoring:
 * Considers:
 * 1. Relationship proximity (mutual friends ranked highest, then following, then followers)
 * 2. Exact match on username or full displayName
 * 3. Prefix match on username or displayName
 * 4. Word-boundary prefix match (e.g. typing "atanga" matches "Ms. Victoria Atanga")
 * 5. Multi-token queries (e.g. "vic ata")
 * 6. Initials / acronym matching (e.g. "va" matches "Victoria Atanga")
 * 7. Substring match
 *
 * Returns 0 if no match, > 0 if matched (higher = better rank).
 */
export function scoreSearchMatch(candidate: SearchCandidate, rawQuery: string): number {
  const query = normalizeQuery(rawQuery);
  if (!query) return 0;

  const username = (candidate.username ?? '').trim().toLowerCase();
  const displayName = (candidate.displayName ?? '').trim().toLowerCase();

  // If user has neither username nor displayName, cannot match
  if (!username && !displayName) return 0;

  let lexicalScore = 0;

  const nameWords = tokenizeWords(displayName);
  const userWords = tokenizeWords(username);
  const queryTokens = tokenizeWords(query);

  // 1. Exact matches (highest lexical priority)
  if (username === query) {
    lexicalScore = Math.max(lexicalScore, 1000);
  } else if (displayName === query) {
    lexicalScore = Math.max(lexicalScore, 950);
  }

  // 2. Starts with query
  if (username.startsWith(query)) {
    const closeness = Math.max(0, 50 - (username.length - query.length));
    lexicalScore = Math.max(lexicalScore, 850 + closeness);
  }
  if (displayName.startsWith(query)) {
    const closeness = Math.max(0, 50 - (displayName.length - query.length));
    lexicalScore = Math.max(lexicalScore, 800 + closeness);
  }

  // 3. Word boundary prefix matches (e.g. "Atanga" or "Vic" in "Ms. Victoria Atanga")
  for (const word of nameWords) {
    if (word === query) {
      lexicalScore = Math.max(lexicalScore, 780);
    } else if (word.startsWith(query)) {
      lexicalScore = Math.max(lexicalScore, 750);
    }
  }
  for (const word of userWords) {
    if (word === query) {
      lexicalScore = Math.max(lexicalScore, 770);
    } else if (word.startsWith(query)) {
      lexicalScore = Math.max(lexicalScore, 720);
    }
  }

  // 4. Multi-token queries (e.g. "vic ata" matches "Victoria Atanga")
  if (queryTokens.length > 1) {
    const allWords = [...nameWords, ...userWords];
    const allMatched = queryTokens.every((token) =>
      allWords.some((w) => w.startsWith(token) || w.includes(token))
    );
    if (allMatched) {
      lexicalScore = Math.max(lexicalScore, 700 + queryTokens.length * 20);
    }
  }

  // 5. Initials matching (e.g. "va" matches "Victoria Atanga" or "Ms Victoria Atanga")
  if (nameWords.length >= 2 && query.length >= 2 && query.length <= nameWords.length) {
    const fullInitials = nameWords.map((w) => w[0]).join('');
    const significantWords = nameWords.filter((w) => !['ms', 'mr', 'mrs', 'dr', 'prof'].includes(w));
    const sigInitials = significantWords.map((w) => w[0]).join('');

    if (fullInitials.startsWith(query) || fullInitials === query || fullInitials.includes(query) ||
        sigInitials.startsWith(query) || sigInitials === query) {
      lexicalScore = Math.max(lexicalScore, 650);
    }
  }

  // 6. Substring match
  if (username.includes(query)) {
    lexicalScore = Math.max(lexicalScore, 400);
  }
  if (displayName.includes(query)) {
    lexicalScore = Math.max(lexicalScore, 350);
  }

  // If no lexical match was found at all, return 0
  if (lexicalScore <= 0) return 0;

  // 7. Relationship boost (Instagram's hallmark: prioritizing people in your network)
  let relationshipBoost = 0;
  if (candidate.relationship === 'friends') {
    relationshipBoost = 2000;
  } else if (candidate.relationship === 'outgoing') {
    // You follow them
    relationshipBoost = 1200;
  } else if (candidate.relationship === 'incoming') {
    // They follow you
    relationshipBoost = 800;
  }

  // Tiebreakers
  const onlineBonus = candidate.isOnline ? 10 : 0;
  const xpBonus = Math.min(20, Math.floor((candidate.totalXp ?? 0) / 1000));

  return lexicalScore + relationshipBoost + onlineBonus + xpBonus;
}

/**
 * Filters and ranks candidates based on predictive score.
 */
export function rankAndFilterCandidates<T extends SearchCandidate>(
  candidates: T[],
  query: string,
  limitCount = 20
): T[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const scored: { item: T; score: number }[] = [];
  const seenIds = new Set<string>();

  for (const candidate of candidates) {
    if (seenIds.has(candidate.userId)) continue;
    seenIds.add(candidate.userId);

    const score = scoreSearchMatch(candidate, normalized);
    if (score > 0) {
      scored.push({ item: candidate, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || String(a.item.username ?? '').localeCompare(String(b.item.username ?? '')))
    .slice(0, limitCount)
    .map((s) => s.item);
}

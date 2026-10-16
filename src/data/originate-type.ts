// Originate's type rules (docs/design-system.md), applied to every piece of text
// by components/ui/text.tsx. Pure, so the tests can check them.
//
// - One family for the interface (IBM Plex Sans) and one for long reading
//   (Source Serif 4, chosen by passing `fontFamily: Fonts.serif`).
// - Three weights: 400, 500, 600. Heavier weights in older styles draw as 600.
// - Labels are sentence case: a small, tracked, all-caps label ("SPACED
//   REVIEW") is drawn as "Spaced review" with no tracking. Acronyms keep
//   their capitals.

export const ORIGINATE_SANS = "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const ORIGINATE_SERIF = "'Source Serif 4', 'Source Serif Pro', Georgia, 'Times New Roman', serif";

type Weight = '400' | '500' | '600';

/** The Originate weight for a style's weight. */
export function originateWeight(weight: string | number | undefined): Weight | undefined {
  if (weight === undefined || weight === null) return undefined;
  if (weight === 'bold') return '600';
  if (weight === 'normal') return '400';
  const n = parseInt(String(weight), 10);
  if (!Number.isFinite(n)) return undefined;
  if (n >= 600) return '600';
  if (n >= 500) return '500';
  return '400';
}

/** True for the small tracked label style (`Type.overline` and its look-alikes). */
export function isLabelStyle(style: { fontSize?: number; letterSpacing?: number }) {
  return (style.letterSpacing ?? 0) >= 0.8 && (style.fontSize ?? 14) <= 13;
}

// Words that stay in capitals inside a sentence-case label.
const KEEP = new Set([
  'XP', 'AI', 'HB', 'MCQ', 'MCQS', 'SBA', 'SBAS', 'CNS', 'ECG', 'DNA', 'RNA', 'ATP', 'NADPH', 'NADH', 'FAD', 'COA', 'OK', 'ID', 'QOTD',
  'GA', 'UK', 'US', 'PDF', 'FAQ', 'I', 'II', 'III', 'IV', 'V', 'VI',
]);

/** "SPACED REVIEW · FATTY ACID BIOSYNTHESIS" → "Spaced review · Fatty acid biosynthesis". Text with lowercase letters is returned unchanged. */
export function sentenceCaseLabel(text: string) {
  if (!/[A-Z]/.test(text) || /[a-z]/.test(text)) return text;
  let startOfPart = true;
  return text.replace(/[A-Za-z0-9'’]+|[·|—:/]/g, (token) => {
    if (/^[·|—:/]$/.test(token)) {
      startOfPart = true;
      return token;
    }
    const keep = KEEP.has(token.replace(/['’]S$/, '')) || /\d/.test(token);
    const word = keep ? token : token.toLowerCase();
    const out = startOfPart && !keep ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    startOfPart = false;
    return out;
  });
}

/** The family Originate draws a style in: serif and monospace stay, everything else is Plex Sans. */
export function originateFamily(fontFamily: string | undefined) {
  if (fontFamily && /serif|mono/i.test(fontFamily) && !/sans-serif$/i.test(fontFamily.trim())) {
    return /mono/i.test(fontFamily) ? fontFamily : ORIGINATE_SERIF;
  }
  return ORIGINATE_SANS;
}

import { Platform } from 'react-native';

// Loads this app's faces on the web without ever blocking the first paint:
// the stylesheet is added after start-up, text renders immediately in the
// system font, then swaps (font-display: swap). If the fonts cannot be
// reached, everything stays readable in the fallback.
//   IBM Plex Sans + Source Serif 4 — Originate (docs/design-system.md)
//   Nunito Sans — the display face Hybrid's lighter headings still use
const HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Nunito+Sans:wght@600;700;800;900&display=swap';

let requested = false;

export function loadWebFonts() {
  if (requested || Platform.OS !== 'web' || typeof document === 'undefined') return;
  requested = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = HREF;
  document.head.appendChild(link);
}

// The original app's faces (The Originals and Hybrid): Poppins, Montserrat and
// Roboto, the weights its font files used. Loaded only when an experience
// needs them, the same non-blocking way.
const LEGACY_HREF =
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap';

let legacyRequested = false;

export function loadLegacyWebFonts() {
  if (legacyRequested || Platform.OS !== 'web' || typeof document === 'undefined') return;
  legacyRequested = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = LEGACY_HREF;
  document.head.appendChild(link);
}

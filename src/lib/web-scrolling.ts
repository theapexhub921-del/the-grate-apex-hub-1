import { Platform } from 'react-native';

// Smoother, more accessible scrolling on laptops and desktops (web only).
//
// 1. Hover pauses while a page scrolls. Every card is pressable with a hover
//    style, and on a computer the content moving under the mouse made each card
//    redraw as the pointer crossed it: frames of 100–480 ms while scrolling
//    (measured 2026-10-24; phones have no hover, which is why they felt smoother).
//    While a page scrolls its content ignores the mouse, and 150 ms after the
//    last scroll it reacts again.
// 2. Page Up / Page Down, Space, the arrow keys, Home and End scroll the page
//    straight away, without clicking into it first (the page is a scrolling box
//    inside the window, which the browser only scrolls once it has focus).
// 3. A thin scrollbar on wide windows, so there is something to grab.

const SCROLLING = 'data-gx-scrolling';
const IDLE_MS = 150;
const CSS = `
[${SCROLLING}] > * { pointer-events: none; }
@media (min-width: 900px) and (pointer: fine) {
  * { scrollbar-width: thin; scrollbar-color: rgba(128, 128, 140, 0.45) transparent; }
}
`;

let installed = false;

export function installWebScrolling() {
  if (installed || Platform.OS !== 'web' || typeof document === 'undefined') return;
  installed = true;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  const markScrolling = (box: Element) => {
    if (!timers.has(box)) box.setAttribute(SCROLLING, '');
    clearTimeout(timers.get(box));
    timers.set(box, setTimeout(() => {
      box.removeAttribute(SCROLLING);
      timers.delete(box);
    }, IDLE_MS));
  };
  // Scroll events don't bubble, so listen while they travel down (capture).
  document.addEventListener(
    'scroll',
    (event) => {
      if (event.target instanceof Element) markScrolling(event.target);
    },
    { capture: true, passive: true }
  );
  // The wheel turns before the page moves: mark its box already, so the first step is smooth too.
  document.addEventListener(
    'wheel',
    (event) => {
      const box = event.target instanceof Element ? scrollerOf(event.target) : null;
      if (box) markScrolling(box);
    },
    { capture: true, passive: true }
  );

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    // Only when nothing else has the keys (no field, button or open page box focused).
    const focused = document.activeElement;
    if (focused && focused !== document.body && focused !== document.documentElement) return;
    const box = mainScroller();
    if (!box) return;
    const page = box.clientHeight * 0.85;
    const line = 48;
    const moves: Record<string, number | 'top' | 'end'> = {
      PageDown: page,
      PageUp: -page,
      ' ': event.shiftKey ? -page : page,
      ArrowDown: line,
      ArrowUp: -line,
      Home: 'top',
      End: 'end',
    };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    // Straight there (an animated scroll was sometimes cancelled half-way in testing).
    const max = box.scrollHeight - box.clientHeight;
    box.scrollTop = move === 'top' ? 0 : move === 'end' ? max : Math.max(0, Math.min(max, box.scrollTop + move));
  });
}

/** The scrolling box of the page on screen: the one under the middle of the window. */
function mainScroller(): HTMLElement | null {
  return scrollerOf(document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2));
}

/** The nearest box around `start` that scrolls up and down. */
function scrollerOf(start: Element | null): HTMLElement | null {
  let element = start;
  while (element && element !== document.body) {
    if (element instanceof HTMLElement && element.scrollHeight > element.clientHeight + 1) {
      const overflow = getComputedStyle(element).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return element;
    }
    element = element.parentElement;
  }
  return null;
}

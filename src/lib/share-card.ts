// Draws a share card (data/share-card-rules.ts) as a picture with the GrAte Apex
// logo, and shares it outside the app (owner, 2026-10-29).
//
// Web (and the Android app, which is the website): the picture is drawn on a
// canvas and handed to the phone's share sheet (WhatsApp, Instagram, …) with the
// message and link. Where the browser cannot share pictures (most computers),
// the picture is downloaded and the message with its link is copied, ready to
// paste. On native builds (not used yet) only the message is shared.
import { Platform, Share } from 'react-native';

import { SHARE_BRAND, SHARE_TAGLINE, shareFileName, type ShareCard } from '@/data/share-card-rules';
import { LIVE_SITE_LABEL } from '@/lib/live-site';

// The brand's own colours (from the logo), fixed so the picture looks the same
// whatever theme the sender uses.
const BRAND = { blue: '#1436B8', blueDeep: '#0E2A93', gold: '#F5B800', white: '#FFFFFF', ink: '#14193A', muted: '#5B6385', soft: '#EEF2FF', line: '#D9DFF5' };
const LOGO = '/icons/grateapex-512-v2.png';
const W = 1080;
const H = 1350;
const FONT = '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export type ShareResult = 'shared' | 'downloaded' | 'copied' | 'cancelled';

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width <= width || !line) line = test;
      else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type Layout = { titleLines: string[]; titleSize: number; rows: { label?: string; lines: string[] }[]; rowSize: number; noteLines: string[]; height: number };

/** Fits the text in the white panel, shrinking it step by step when it is long. */
function layout(ctx: CanvasRenderingContext2D, card: ShareCard, innerWidth: number, maxHeight: number): Layout {
  let best: Layout | null = null;
  for (let step = 0; step < 8; step += 1) {
    const titleSize = 54 - step * 5;
    const rowSize = 36 - step * 3;
    ctx.font = `600 ${titleSize}px ${FONT}`;
    const titleLines = wrap(ctx, card.title, innerWidth);
    ctx.font = `400 ${rowSize}px ${FONT}`;
    const rows = card.lines.map((line) => ({ label: line.label, lines: wrap(ctx, line.text, innerWidth - (line.label ? rowSize * 2.6 : 0) - 40) }));
    ctx.font = `400 ${rowSize * 0.85}px ${FONT}`;
    const noteLines = card.note ? wrap(ctx, card.note, innerWidth) : [];
    const height =
      titleLines.length * titleSize * 1.25 +
      (rows.length ? 28 : 0) +
      rows.reduce((sum, row) => sum + row.lines.length * rowSize * 1.3 + 30 + 14, 0) +
      (noteLines.length ? 16 + noteLines.length * rowSize * 0.85 * 1.35 : 0);
    best = { titleLines, titleSize, rows, rowSize, noteLines, height };
    if (height <= maxHeight) return best;
  }
  return best!;
}

/** The picture, as a PNG (web only). */
export async function drawShareCard(card: ShareCard): Promise<Blob | null> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  if (document.fonts?.ready) await document.fonts.ready.catch(() => undefined);

  // Background: the logo's blue, with a soft lighter corner.
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, BRAND.blue);
  gradient.addColorStop(1, BRAND.blueDeep);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Header: logo and name.
  const logo = await loadImage(LOGO);
  const pad = 64;
  if (logo) {
    ctx.save();
    roundRect(ctx, pad, 56, 112, 112, 26);
    ctx.clip();
    ctx.drawImage(logo, pad, 56, 112, 112);
    ctx.restore();
  }
  ctx.fillStyle = BRAND.white;
  ctx.font = `700 54px ${FONT}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(SHARE_BRAND, pad + 136, 112);
  ctx.fillStyle = '#B9C6FF';
  ctx.font = `italic 400 26px ${FONT}`;
  ctx.fillText(SHARE_TAGLINE, pad + 138, 152);

  // The white panel, sized to its text and centred between header and footer.
  const panelX = pad;
  const panelW = W - pad * 2;
  const footer = 190;
  const top = 212;
  const room = H - top - footer - 24;
  const inner = panelW - 2 * 56;
  const fit = layout(ctx, card, inner, room - 140);
  const panelH = Math.min(room, Math.max(560, fit.height + 150));
  const panelY = top + (room - panelH) / 2;
  ctx.fillStyle = BRAND.white;
  roundRect(ctx, panelX, panelY, panelW, panelH, 36);
  ctx.fill();

  let y = panelY + 72;
  const x = panelX + 56;
  ctx.fillStyle = BRAND.blue;
  ctx.font = `700 26px ${FONT}`;
  ctx.fillText(card.kicker.slice(0, 60), x, y);
  y += 30;

  ctx.fillStyle = BRAND.ink;
  ctx.font = `600 ${fit.titleSize}px ${FONT}`;
  for (const line of fit.titleLines) {
    y += fit.titleSize * 1.25;
    ctx.fillText(line, x, y);
  }
  if (fit.rows.length) y += 28;
  for (const row of fit.rows) {
    const rowH = row.lines.length * fit.rowSize * 1.3 + 30;
    ctx.fillStyle = BRAND.soft;
    roundRect(ctx, x, y, inner, rowH, 18);
    ctx.fill();
    let textX = x + 24;
    if (row.label) {
      ctx.fillStyle = BRAND.blue;
      ctx.font = `700 ${fit.rowSize}px ${FONT}`;
      ctx.fillText(row.label, textX, y + 15 + fit.rowSize);
      textX += Math.max(fit.rowSize * 1.4, ctx.measureText(row.label).width + 22);
    }
    ctx.fillStyle = BRAND.ink;
    ctx.font = `400 ${fit.rowSize}px ${FONT}`;
    row.lines.forEach((line, index) => ctx.fillText(line, textX, y + 15 + fit.rowSize + index * fit.rowSize * 1.3));
    y += rowH + 14;
  }
  if (fit.noteLines.length) {
    y += 16;
    ctx.fillStyle = BRAND.muted;
    ctx.font = `400 ${fit.rowSize * 0.85}px ${FONT}`;
    for (const line of fit.noteLines) {
      y += fit.rowSize * 0.85 * 1.35;
      ctx.fillText(line, x, y);
    }
  }

  // Footer: the call to action and the address.
  ctx.fillStyle = BRAND.gold;
  ctx.font = `700 34px ${FONT}`;
  const ctaLines = wrap(ctx, card.cta, W - pad * 2);
  let footY = H - footer + 70;
  for (const line of ctaLines.slice(0, 2)) {
    ctx.fillText(line, pad, footY);
    footY += 42;
  }
  ctx.fillStyle = BRAND.white;
  ctx.font = `600 30px ${FONT}`;
  ctx.fillText(LIVE_SITE_LABEL, pad, Math.min(H - 40, footY + 8));

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}

/** Shares a card outside the app: picture + message + link where possible. */
export async function shareCardOutside(card: ShareCard): Promise<ShareResult> {
  if (Platform.OS !== 'web') {
    const result = await Share.share({ message: card.message, title: SHARE_BRAND });
    return result.action === Share.sharedAction ? 'shared' : 'cancelled';
  }
  const nav = globalThis.navigator as Navigator & {
    share?: (data: ShareData & { files?: File[] }) => Promise<void>;
    canShare?: (data: ShareData & { files?: File[] }) => boolean;
  };
  const blob = await drawShareCard(card).catch(() => null);
  const file = blob ? new File([blob], shareFileName(card), { type: 'image/png' }) : null;
  try {
    if (file && nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], text: card.message, title: SHARE_BRAND });
      return 'shared';
    }
    if (!file && nav.share) {
      await nav.share({ text: card.message, title: SHARE_BRAND, url: card.url });
      return 'shared';
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return 'cancelled';
    // Some browsers refuse files at the last moment: fall back below.
  }
  // Computers: download the picture and copy the message with its link.
  if (blob && typeof document !== 'undefined') {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = shareFileName(card);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 10_000);
  }
  await nav.clipboard?.writeText(card.message).catch(() => undefined);
  return blob ? 'downloaded' : 'copied';
}

/** What to tell the learner afterwards. */
export function shareNotice(result: ShareResult): string | null {
  switch (result) {
    case 'shared':
      return null;
    case 'downloaded':
      return 'Picture saved, and the message with its link is copied: paste it with the picture in WhatsApp or anywhere.';
    case 'copied':
      return 'Message and link copied: paste it anywhere.';
    case 'cancelled':
      return null;
  }
}

// The 3D atlas quiz reports each finished round to the app. This reads that message.
// Pure — no React, no storage — so it can be tested on its own.
//
// The atlas (public/atlas/anatomy.html) sends:
//   { type: 'quiz', system, region?, side?, part?, score, total }

export type AtlasQuizResult = {
  system: string; // body system the round was about, e.g. 'skeletal'
  region: string | null; // body region the round was limited to, e.g. 'upper-limb' (null = whole body)
  side: 'right' | 'left' | null; // only for the limb regions
  part: string | null; // part of the limb, e.g. 'forearm' (null = the whole limb, or not a limb)
  score: number;
  total: number;
};

const MAX_QUESTIONS = 50; // the longest round the atlas offers

function text(value: unknown, max = 40) {
  return typeof value === 'string' && value.length > 0 && value.length <= max ? value : null;
}

// Returns the round's result, or null when the message is not a sensible quiz result
// (wrong type, missing or impossible numbers) so nothing odd is ever recorded.
export function parseAtlasQuizMessage(data: unknown): AtlasQuizResult | null {
  if (!data || typeof data !== 'object') return null;
  const m = data as Record<string, unknown>;
  if (m.type !== 'quiz') return null;
  const system = text(m.system);
  const { score, total } = m;
  if (!system) return null;
  if (typeof score !== 'number' || typeof total !== 'number') return null;
  if (!Number.isInteger(score) || !Number.isInteger(total)) return null;
  if (total < 1 || total > MAX_QUESTIONS || score < 0 || score > total) return null;
  return {
    system,
    region: text(m.region),
    side: m.side === 'right' || m.side === 'left' ? m.side : null,
    part: text(m.part),
    score,
    total,
  };
}

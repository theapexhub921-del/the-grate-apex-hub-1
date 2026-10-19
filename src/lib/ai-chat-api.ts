// Talks to /api/chat (api/chat.mjs) — the general Study chat, separate from the
// per-lesson AI so the two have separate limits.
import { API_BASE, LIVE_SITE_LABEL } from '@/lib/live-site';

import { auth } from '@/lib/firebase';
import { AiError, type ChatTurn } from '@/lib/ai-study-api';

const SERVER = API_BASE;

export async function askStudyChat(message: string, history: readonly ChatTurn[]): Promise<string> {
  const token = await auth.currentUser?.getIdToken().catch(() => undefined);
  if (!token) throw new AiError('Sign in to use Study chat.');
  let response: Response;
  try {
    response = await fetch(`${SERVER}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ message, history: history.slice(-20) }),
    });
  } catch {
    throw new AiError('Could not reach the AI. Check your connection and try again.');
  }
  const data = (await response.json().catch(() => null)) as { answer?: string; error?: string } | null;
  if (!response.ok || !data?.answer) {
    if (response.status === 404 && !data) throw new AiError(`Study chat runs on the live app (${LIVE_SITE_LABEL}). It is not available in this local preview.`);
    throw new AiError(data?.error || 'The AI could not answer right now. Please try again.');
  }
  return data.answer;
}

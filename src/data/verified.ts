// Verified learners: a gold tick next to their name (like X). The owner's
// list, plus anyone the original app verified (verified/{uid}, written only
// by admins under the deployed rules).
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export const VERIFIED_USERNAMES: readonly string[] = ['prince', 'theapexhub', 'originate', 'robotnik', 'stbretro'];

export const isVerifiedUsername = (username: string | null | undefined) =>
  Boolean(username) && VERIFIED_USERNAMES.includes(String(username).replace(/^@/, '').toLowerCase());

const checked = new Map<string, Promise<boolean>>();

/** Verified by the original app (verified/{uid}). Cached per session. */
export function useVerifiedUid(uid: string | null | undefined) {
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (!uid) return;
    let live = true;
    let promise = checked.get(uid);
    if (!promise) {
      promise = getDoc(doc(db, 'verified', uid)).then((snap) => snap.exists()).catch(() => false);
      checked.set(uid, promise);
    }
    void promise.then((value) => { if (live) setVerified(value); });
    return () => { live = false; };
  }, [uid]);
  return verified;
}

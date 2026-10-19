import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { samePresenceAside } from '@/lib/presence';

export interface AuthUser {
  id: string; // for compatibility with code referencing user.id
  uid: string; // Firebase uid
  email: string | null;
  displayName: string | null;
  created_at?: string;
  user_metadata?: Record<string, any>;
  profile?: Record<string, any>;
  /** True once users/{uid} was read (it may not exist yet); false when it could not be read. */
  profileLoaded: boolean;
}

export interface AuthSession {
  user: AuthUser;
}

export interface AuthState {
  session: AuthSession | null;
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    let lastProfile: Record<string, any> | null = null;

    const stopWatching = () => {
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }
      if (retry) {
        clearTimeout(retry);
        retry = null;
      }
    };

    const watchProfile = (firebaseUser: FirebaseUser, attempt: number) => {
      // Read live Firestore profile
      const userRef = doc(db, 'users', firebaseUser.uid);
      // Writes made as the app starts (last seen, online…) are merged into the
      // profile and shown at once as a preview holding only those fields, sometimes
      // even marked as from the server. The profile only counts as loaded once a
      // complete copy has arrived (from the server, nothing unconfirmed in it), or
      // the route guard would think the learner has no interface, username or class
      // yet and send them to set it up again.
      let fromServer = false;
      unsubSnapshot = onSnapshot(
        userRef,
        (snap) => {
          if (!snap.metadata.fromCache && !snap.metadata.hasPendingWrites) fromServer = true;
          const profile = snap.data() || {};
          attempt = 0;
          // Presence alone changed (written every 45 s while the app is open):
          // keep the same learner, so the whole app doesn't redraw and reload.
          if (lastProfile && samePresenceAside(lastProfile, profile)) return;
          lastProfile = profile;
          const authUser: AuthUser = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: profile.displayName || profile.username || firebaseUser.displayName || null,
            created_at: firebaseUser.metadata.creationTime,
            user_metadata: {
              ...profile,
              onboarding_completed: profile.onboardingDone === true,
              full_name: profile.displayName || profile.username || firebaseUser.displayName || '',
            },
            profile,
            profileLoaded: fromServer,
          };
          setSession({ user: authUser });
          setLoading(false);
        },
        () => {
          // The read failed (e.g. a dropped connection while signing in). Until
          // the profile has been read once, carry on with the basic sign-in;
          // either way, listen again shortly (a failed listener never recovers).
          unsubSnapshot = null;
          if (!lastProfile) {
            const authUser: AuthUser = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              created_at: firebaseUser.metadata.creationTime,
              user_metadata: {},
              profile: {},
              profileLoaded: false,
            };
            setSession({ user: authUser });
            setLoading(false);
          }
          const wait = Math.min(60_000, 2_000 * 2 ** attempt);
          retry = setTimeout(() => {
            retry = null;
            if (auth.currentUser?.uid === firebaseUser.uid) watchProfile(firebaseUser, attempt + 1);
          }, wait);
        }
      );
    };

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      stopWatching();
      lastProfile = null;

      if (!firebaseUser) {
        setSession(null);
        setLoading(false);
        return;
      }

      watchProfile(firebaseUser, 0);
    });

    return () => {
      stopWatching();
      unsubAuth();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

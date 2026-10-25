import { router, usePathname } from 'expo-router';
import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { ErrorScreen } from '@/components/ui/state-views';
import { reportCrash } from '@/lib/crash-report';

// Catches a crash in any page (owner, 2026-10-25: a battle crash used to blank the
// whole screen for both players). The page shows "Something went wrong" with Reload
// and Go to Study, the sidebar stays usable, and the team is told (lib/crash-report).
// Going to another page clears it.

type Props = { children: ReactNode; resetKey: string; onReset: () => void };
type State = { error: Error | null };

class Boundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportCrash(error, 'page', info.componentStack ?? undefined);
  }

  componentDidUpdate(previous: Props) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <ErrorScreen
        title="Something went wrong"
        message="This page ran into a problem. The team has been told automatically. Reload to try again, or go back to Study."
        primary={{
          label: 'Reload',
          onPress: () => {
            if (Platform.OS === 'web' && typeof window !== 'undefined') window.location.reload();
            else this.setState({ error: null });
          },
        }}
        secondary={{
          label: 'Go to Study',
          onPress: () => {
            this.props.onReset();
            this.setState({ error: null });
            router.replace('/learn');
          },
        }}
      />
    );
  }
}

export function CrashBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [resets, setResets] = useState(0);
  // A new page clears the error screen.
  const [key, setKey] = useState(pathname);
  useEffect(() => setKey(pathname), [pathname]);
  return (
    <Boundary resetKey={`${key}:${resets}`} onReset={() => setResets((n) => n + 1)}>
      {children}
    </Boundary>
  );
}
